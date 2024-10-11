import prisma from "@/app/lib/db";
import { ArticleInput } from "@/app/types/article";
import { NextResponse } from "next/server";

// Define the expected shape of the request body using a TypeScript type

export async function PUT(request: Request) {
  try {
    // Parse the request body and ensure it matches the ArticleInput type
    const data: ArticleInput = await request.json();

    // Extract the article ID from the request URL or body
    const { id } = data; // or retrieve it from query parameters if needed

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Article ID is required",
        },
        { status: 400 },
      );
    }

    // Basic validation for required fields
    const missingFields = [];
    if (!data.title)
      missingFields.push({ field: "title", message: "Title is required" });
    if (!data.content)
      missingFields.push({ field: "content", message: "Content is required" });
    if (!data.slug)
      missingFields.push({ field: "slug", message: "Slug is required" });
    if (!data.categoryId)
      missingFields.push({
        field: "categoryId",
        message: "Category is required",
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

    // Find and update the article using Prisma
    const updatedArticle = await prisma.posts.update({
      where: { id }, // Assuming you want to update by ID
      data: {
        ...data, // Spread the incoming data directly
        updatedAt: new Date(), // Set the updatedAt field to the current date
      },
    });

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Article updated successfully",
        data: updatedArticle,
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
