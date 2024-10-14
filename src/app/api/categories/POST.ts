import prisma from "@/app/lib/db";
import { Category } from "@/app/types/article";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data: Category = await request.json();

    const missingFields = [];
    if (!data?.name)
      missingFields.push({ field: "name", message: "Name is required" });

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Missing required fields",
          errors: missingFields,
        },
        { status: 400 },
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          status: 409,
          message: "Category with this name already exists",
        },
        { status: 409 },
      );
    }

    const newCategory = await prisma.category.create({
      data,
    });

    return NextResponse.json(
      {
        success: true,
        status: 201,
        message: "Category created successfully",
        data: newCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal Server Error",
        errors: [{ message: errorMessage }],
      },
      { status: 500 },
    );
  }
}
