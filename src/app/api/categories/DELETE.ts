import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Category ID is required",
        },
        { status: 400 },
      );
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        Posts: true,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    // Delete related posts and their files
    for (const post of existingCategory.Posts) {
      // Assuming you have a method to delete the file from storage
      if (post.thumbnailUrl) {
        await fetch(`${process.env.NEXT_PUBLIC_API}/api/deleteFile`, {
          method: "POST",
          body: JSON.stringify({ filePath: post.thumbnailUrl }),
        });
      }

      // Delete the post
      await prisma.posts.delete({
        where: { id: post.id },
      });
    }

    // Finally, delete the category
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Category and related posts deleted successfully",
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
