import prisma from "@/app/lib/db";
import { Banner } from "@/app/types/banner";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const data: Banner = await request.json();

    const { id } = data;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Banner ID is required",
        },
        { status: 400 },
      );
    }

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
          message: "Missing required fields",
          errors: missingFields,
        },
        { status: 400 },
      );
    }

    const bannerData = {
      ...data,
      isActive: data.isActive ? 1 : 0,
      ctaUrl: data.ctaUrl || "",
      displayOrder: data.displayOrder,
      updatedAt: new Date(),
    };

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: bannerData,
    });

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Banner updated successfully",
        data: updatedBanner,
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
