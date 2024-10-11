"use client";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="z-10 flex min-h-screen w-full flex-col bg-transparent">
      <div className="align-center mb-auto mt-auto flex flex-col items-center justify-center gap-8 px-6 py-4">
        <Image
          className="h-[48px] w-auto"
          src="/images/icons/icon-notfound.png"
          width={48}
          height={56}
          alt="halaman tidak ditemukan"
          aria-label="halaman tidak ditemukan"
        />
        <div className="flex flex-col items-center justify-center gap-1">
          <h1 className="font-bold">Halaman tidak ditemukan</h1>
          <p className="text-center text-gray-400">
            Kami tidak menemukan halaman yang Anda cari, silakan untuk kembali
            ke halaman awal.
          </p>
        </div>
      </div>
    </div>
  );
}
