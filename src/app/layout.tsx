import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.scss";
import React from "react";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "./components/react-query-provider";

const inter = Manrope({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nano Nano Indonesia",
};

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
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <ReactQueryProvider>
          <main className="pb-5">{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
