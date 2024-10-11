import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define schema for query params using Zod
const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  // Add more specific query fields according to your schema
  name: z.string().optional(), // Example field
});

export async function GET(request: Request) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const objParams = Object.fromEntries(searchParams.entries());

    const parsedParams = querySchema.parse(objParams);

    // Set default pagination values
    const page = parseInt(parsedParams.page || "1", 10);
    const limit = parseInt(parsedParams.limit || "10", 10);
    const skip = (page - 1) * limit;

    // Set sorting options
    const sortBy = parsedParams.sortBy || "createdAt"; // Default to sorting by createdAt
    const sortOrder = parsedParams.sortOrder || "asc"; // Default to ascending order

    // Construct query for Prisma
    const stores = await prisma.category.findMany({
      where: {
        // Dynamically add filters based on parsed params
        ...(parsedParams.name && {
          name: { contains: parsedParams.name },
        }),
        // Add more filters if needed
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // Get total count for pagination metadata
    const totalRecords = await prisma.category.count({
      where: {
        ...(parsedParams.name && {
          name: { contains: parsedParams.name },
        }),
      },
    });

    const totalPages = Math.ceil(totalRecords / limit);

    // Return the response with data and pagination info
    return NextResponse.json(
      {
        data: stores,
        pagination: {
          page,
          limit,
          totalRecords,
          totalPages,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (error instanceof z.ZodError) {
      // Return validation error response
      return NextResponse.json(
        { message: "Invalid query parameters", errors: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
