import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator

// Helper function to get file extension based on MIME type
const getFileExtension = (mimeType: string): string | null => {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    default:
      return null; // Unknown MIME type
  }
};

export async function POST(request: NextRequest) {
  try {
    // Parse formData from the incoming request
    const data = await request.formData();
    const file = data.get("file") as unknown as File | null;
    const path = data.get("path") as string | null;

    // Check if file was provided
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "No file provided",
        },
        { status: 400 },
      );
    }

    // Get the file extension based on the MIME type
    const fileExtension = getFileExtension(file.type);

    if (!fileExtension) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Unsupported file type",
        },
        { status: 400 },
      );
    }

    // Generate a unique file name with UUID
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define the path to save the file, e.g., inside 'public/uploads/articles'
    const filePath = join(
      process.cwd(),
      `public/uploads/${path || "articles"}`,
      fileName,
    );

    // Write the file to the destination folder
    await writeFile(filePath, new Uint8Array(buffer));

    // Return success response with the file path
    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "File uploaded successfully",
        filePath: `/uploads/${path || "articles"}/${fileName}`,
      },
      { status: 200 },
    );
  } catch (error) {
    // Return error response in case of any exceptions
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
