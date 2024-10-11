import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";

// Define the DELETE API for removing files
export async function POST(request: Request) {
  try {
    // Parse the JSON body to get the filePath
    const { filePath } = await request.json();

    // Check if filePath is provided
    if (!filePath) {
      return NextResponse.json(
        { success: false, message: "No file path provided" },
        { status: 400 },
      );
    }

    // Define the full path to the file (assuming it's in 'public/uploads')
    const fullPath = join(process.cwd(), "public", filePath);

    // Use unlink to delete the file from the filesystem
    await unlink(fullPath);

    // Send a success response back
    return NextResponse.json(
      { success: true, message: "File deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    // Handle any errors that occur during file deletion
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
