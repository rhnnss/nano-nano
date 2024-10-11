import imageCompression from "browser-image-compression";
import React from "react";
import { useDropzone } from "react-dropzone";
import "react-quill/dist/quill.snow.css";

const ThumbnailDropzone: React.FC<{ onFileAccepted: (file: File) => void }> = ({
  onFileAccepted,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
    onDrop: async (acceptedFiles) => {
      try {
        const file = acceptedFiles[0];

        // Kompres file menggunakan browser-image-compression
        const options = {
          maxSizeMB: 1, // Kompres gambar menjadi 1MB
          maxWidthOrHeight: 1920, // Batasi dimensi maksimum
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        // Periksa ukuran file setelah kompresi
        if (compressedFile.size > 1024 * 1024) {
          alert("File size must be under 1MB after compression");
          return;
        }

        // Pass the compressed file to the parent component
        onFileAccepted(compressedFile);
      } catch (error) {
        console.error("Error compressing the image", error);
        alert("Failed to compress the image. Please try again.");
      }
    },
  });

  return (
    <div
      {...getRootProps({
        className: "border-dashed border-2 border-gray-300 p-4 rounded-md",
      })}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag `n` drop a file here, or click to select</p>
      )}
    </div>
  );
};

export default ThumbnailDropzone;
