import prisma from "@/app/lib/db";
import { Product } from "@/app/types/product";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data: Product = await request.json();

    // Basic validation for required fields
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
          message:
            "There are some missing or incomplete fields. Please check the details and try again.",
          errors: missingFields,
        },
        { status: 400 },
      );
    }

    // Ensure imageUrl uniqueness (now that imageUrl is unique)
    const existingProduct = await prisma.product.findUnique({
      where: { name: data.name },
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          status: 409,
          message:
            "A product with this name already exists. Please choose a different name.",
        },
        { status: 409 },
      );
    }

    // Ensure isActive is a number
    const productData = {
      ...data,
      isActive: data.isActive ? 1 : 0,
    };

    // Create the new product using Prisma
    const newProduct = await prisma.product.create({
      data: productData,
    });

    return NextResponse.json(
      {
        success: true,
        status: 201,
        message: "The product was successfully created.",
        data: newProduct,
      },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong on our end. Please try again later.";
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message:
          "An unexpected error occurred. We apologize for the inconvenience.",
        errors: [{ message: errorMessage }],
      },
      { status: 500 },
    );
  }
}
