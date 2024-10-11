import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    // Get the URL's search parameters to extract the post id
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    // Check if postId is provided
    if (!postId) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Post ID is required",
        },
        { status: 400 },
      );
    }

    // Find the post by ID to ensure it exists
    const existingPost = await prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Post not found",
        },
        { status: 404 },
      );
    }

    // Delete the post
    await prisma.posts.delete({
      where: { id: postId },
    });

    // Return a success response
    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Post deleted successfully",
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
