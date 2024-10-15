import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    // Get the URL's search parameters to extract the banner id
    const { searchParams } = new URL(request.url);
    const bannerId = searchParams.get("id");

    // Check if bannerId is provided
    if (!bannerId) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Banner ID is required",
        },
        { status: 400 },
      );
    }

    // Find the banner by ID to ensure it exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id: bannerId },
    });

    if (!existingBanner) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Banner not found",
        },
        { status: 404 },
      );
    }

    // Delete the banner
    await prisma.banner.delete({
      where: { id: bannerId },
    });

    // Return a success response
    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Banner deleted successfully",
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
