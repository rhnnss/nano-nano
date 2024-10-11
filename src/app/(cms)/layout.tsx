"use client";
import { NextUIProvider } from "@nextui-org/react";
import { Viewport } from "next";
import React, { Suspense } from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextUIProvider>
      <Suspense>{children}</Suspense>
    </NextUIProvider>
  );
}
