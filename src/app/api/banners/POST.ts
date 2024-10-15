import prisma from "@/app/lib/db";
import { Banner } from "@/app/types/banner";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data: Banner = await request.json();

    // Basic validation for required fields
    const missingFields = [];
    if (!data.title)
      missingFields.push({
        field: "title",
        message: "Please provide the banner title.",
      });
    if (!data.description)
      missingFields.push({
        field: "description",
        message: "Please include a description for the banner.",
      });
    if (!data.imageUrl)
      missingFields.push({
        field: "imageUrl",
        message: "An image URL is required to display the banner.",
      });
    if (!data.ctaUrl)
      missingFields.push({
        field: "ctaUrl",
        message: "Please provide a call-to-action URL for the banner.",
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
    const existingBanner = await prisma.banner.findUnique({
      where: { title: data.title },
    });

    if (existingBanner) {
      return NextResponse.json(
        {
          success: false,
          status: 409,
          message:
            "A banner with this title already exists. Please choose a different title.",
        },
        { status: 409 },
      );
    }

    // Ensure isActive is a number
    const bannerData = {
      ...data,
      isActive: data.isActive ? 1 : 0,
    };

    // Create the new banner using Prisma
    const newBanner = await prisma.banner.create({
      data: bannerData,
    });

    return NextResponse.json(
      {
        success: true,
        status: 201,
        message: "The banner was successfully created.",
        data: newBanner,
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
