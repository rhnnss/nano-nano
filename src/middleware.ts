import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";
import { cookies } from "next/headers";

// Routes Middleware should not run on
export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/vPCVvSUYl3Dy9v5ihuvETAu/dashboard",
    "/vPCVvSUYl3Dy9v5ihuvETAu",
  ],
};

export async function middleware(req: NextRequest) {
  console.log("Current Path:", req.nextUrl.pathname);

  const cookie = req.cookies.get("session")?.value;

  if (!cookie) {
    console.log("No session cookie found.");

    // Hanya redirect ke halaman login jika saat ini bukan di halaman login
    if (req.nextUrl.pathname !== "/vPCVvSUYl3Dy9v5ihuvETAu") {
      return NextResponse.redirect(
        new URL("/vPCVvSUYl3Dy9v5ihuvETAu", req.url),
      );
    }

    return NextResponse.next();
  }

  const session = await decrypt(cookie);
  const expiresAt = new Date(session?.expiresAt ?? 0);
  const now = new Date();

  const formattedExpiresAt = expiresAt.toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  console.log("Session:", session);
  console.log("Session expiresAt:", formattedExpiresAt);

  // Jika session ditemukan, cek apakah sudah expired
  if (session !== null) {
    console.log("Session valid, checking expiration...");

    if (expiresAt < now) {
      console.log("Session expired! Deleting session...");

      cookies().delete("session");

      // Jika sesi sudah kadaluwarsa, arahkan ke halaman login kecuali saat ini sudah di halaman login
      if (req.nextUrl.pathname !== "/vPCVvSUYl3Dy9v5ihuvETAu") {
        return NextResponse.redirect(
          new URL("/vPCVvSUYl3Dy9v5ihuvETAu", req.url),
        );
      }

      return NextResponse.next();
    }

    // Jika session masih valid, cek halaman yang diakses
    if (req.nextUrl.pathname === "/vPCVvSUYl3Dy9v5ihuvETAu") {
      console.log("Redirecting to dashboard...");
      return NextResponse.redirect(
        new URL("/vPCVvSUYl3Dy9v5ihuvETAu/dashboard", req.url),
      );
    }

    return NextResponse.next();
  } else {
    // Jika session null atau tidak valid, redirect ke halaman login
    console.log("Session is null, redirecting to login page...");

    if (req.nextUrl.pathname !== "/vPCVvSUYl3Dy9v5ihuvETAu") {
      return NextResponse.redirect(
        new URL("/vPCVvSUYl3Dy9v5ihuvETAu", req.url),
      );
    }
  }

  return NextResponse.next();
}
