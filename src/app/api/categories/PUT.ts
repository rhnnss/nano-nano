import prisma from "@/app/lib/db";
import { Category } from "@/app/types/article";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const data: Category = await request.json();

    const { id } = data;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Category ID is required",
        },
        { status: 400 },
      );
    }

    const missingFields = [];
    if (!data.name)
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

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Category updated successfully",
        data: updatedCategory,
      },
      { status: 200 },
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
