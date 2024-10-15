import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    // Get the URL's search parameters to extract the product id
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    // Check if productId is provided
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Product ID is required",
        },
        { status: 400 },
      );
    }

    // Find the product by ID to ensure it exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: productId },
    });

    // Return a success response
    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Product deleted successfully",
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
