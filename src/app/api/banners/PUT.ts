import prisma from "@/app/lib/db";
import { Product } from "@/app/types/product";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const data: Product = await request.json();

    const { id } = data;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Product ID is required",
        },
        { status: 400 },
      );
    }

    const missingFields = [];
    if (!data.name)
      missingFields.push({
        field: "name",
        message: "Please provide the product name.",
      });
    if (!data.description)
      missingFields.push({
        field: "description",
        message: "Please include a description for the product.",
      });
    if (!data.imageUrl)
      missingFields.push({
        field: "imageUrl",
        message: "An image URL is required to display the product.",
      });
    if (!data.buyLink)
      missingFields.push({
        field: "buyLink",
        message:
          "Please provide a buy link where customers can purchase the product.",
      });

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

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        isActive: data.isActive ? 1 : 0,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Product updated successfully",
        data: updatedProduct,
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
