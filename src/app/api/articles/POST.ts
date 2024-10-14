import prisma from "@/app/lib/db";
import { ArticleInput } from "@/app/types/article";
import { NextResponse } from "next/server";

// Define the expected shape of the request body using a TypeScript type

export async function POST(request: Request) {
  try {
    // Parse the request body and ensure it matches the ArticleInput type
    const data: ArticleInput = await request.json();

    // Basic validation for required fields
    const missingFields = [];
    if (!data.title)
      missingFields.push({ field: "title", message: "Title is required" });
    if (!data.content)
      missingFields.push({ field: "content", message: "Content is required" });
    if (!data.slug)
      missingFields.push({ field: "slug", message: "Slug is required" });
    if (!data.categoryId)
      missingFields.push({
        field: "categoryId",
        message: "Category is required",
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

    // Ensure slug uniqueness (now that slug is unique)
    const existingArticle = await prisma.posts.findUnique({
      where: { slug: data.slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        {
          success: false,
          status: 409,
          message: "Article with this slug already exists",
        },
        { status: 409 },
      );
    }

    // Create the new article using Prisma
    const newArticle = await prisma.posts.create({
      data: {
        ...data, // Spread the incoming data directly
        publishedAt: new Date(data.publishedAt), // Convert `publishedAt` to Date
      },
    });

    // const newArticle = {};
    // await prisma.posts.createMany({
    //   data: [
    //     {
    //       id: "1df00a9e-5c3f-4b34-8f58-10213b732ba6",
    //       title: "Nano Nano: Rasa Manis dan Asin",
    //       content:
    //         "<p>Perpaduan rasa yang unik membuat Nano Nano populer di kalangan anak-anak hingga dewasa. Rasanya bagaikan sensasi yang tidak terduga.</p>",
    //       slug: "nano-nano-rasa-manis-asin",
    //       thumbnailUrl: "/uploads/articles/nano_01.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-10T08:00:00.000Z",
    //       createdAt: "2024-10-10T08:00:00.000Z",
    //       updatedAt: "2024-10-10T08:00:00.000Z",
    //     },
    //     {
    //       id: "8c15b046-e71b-4ff0-a4a2-8ad989705a96",
    //       title: "Sejarah Nano Nano: Dari Pabrik Hingga Warung",
    //       content:
    //         "<p>Permen Nano Nano telah ada sejak 1980-an dan menjadi bagian tak terpisahkan dari camilan Indonesia.</p>",
    //       slug: "sejarah-nano-nano",
    //       thumbnailUrl: "/uploads/articles/nano_02.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-09T07:30:00.000Z",
    //       createdAt: "2024-10-09T07:30:00.000Z",
    //       updatedAt: "2024-10-09T07:30:00.000Z",
    //     },
    //     {
    //       id: "92a3b84a-4b75-4090-b24f-4b5456b30d5e",
    //       title: "Nano Nano: Manis, Asin, Asam, Lengkap!",
    //       content:
    //         "<p>Dengan kombinasi rasa yang berani, Nano Nano menawarkan pengalaman baru dalam satu gigitan.</p>",
    //       slug: "nano-nano-manis-asin-asam",
    //       thumbnailUrl: "/uploads/articles/nano_03.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-11T09:15:00.000Z",
    //       createdAt: "2024-10-11T09:15:00.000Z",
    //       updatedAt: "2024-10-11T09:15:00.000Z",
    //     },
    //     {
    //       id: "f7d5e76b-6b68-4c30-a50e-21a121c7b911",
    //       title: "Nano Nano: Permen Favorit di Hari Hujan",
    //       content:
    //         "<p>Tidak ada yang lebih nikmat daripada menyantap permen Nano Nano di hari yang mendung, menghadirkan rasa segar dan nostalgia.</p>",
    //       slug: "nano-nano-hari-hujan",
    //       thumbnailUrl: "/uploads/articles/nano_04.jpg",
    //       status: 0,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-11T10:00:00.000Z",
    //       createdAt: "2024-10-11T10:00:00.000Z",
    //       updatedAt: "2024-10-11T10:00:00.000Z",
    //     },
    //     {
    //       id: "cc679e28-402e-42b1-a66e-08c5e9ab1c6f",
    //       title: "Nano Nano: Mengapa Rasa Ini Begitu Spesial?",
    //       content:
    //         "<p>Sensasi rasa yang berbeda dan unik menjadi alasan mengapa Nano Nano tetap populer dari generasi ke generasi.</p>",
    //       slug: "mengapa-nano-nano-spesial",
    //       thumbnailUrl: "/uploads/articles/nano_05.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-10T11:00:00.000Z",
    //       createdAt: "2024-10-10T11:00:00.000Z",
    //       updatedAt: "2024-10-10T11:00:00.000Z",
    //     },
    //     {
    //       id: "a9d0b4c4-7357-4b65-9262-f9a2061f3f69",
    //       title: "Nano Nano: Permen yang Membawa Keceriaan",
    //       content:
    //         "<p>Nano Nano menghadirkan rasa senang di setiap gigitan. Rasanya yang tak terduga membuat permen ini selalu dinantikan.</p>",
    //       slug: "nano-nano-membawa-keceriaan",
    //       thumbnailUrl: "/uploads/articles/nano_06.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-08T08:15:00.000Z",
    //       createdAt: "2024-10-08T08:15:00.000Z",
    //       updatedAt: "2024-10-08T08:15:00.000Z",
    //     },
    //     {
    //       id: "42d774e1-18c2-41ec-8538-8ff46b6f12e6",
    //       title: "Apa Rasa Favoritmu dari Nano Nano?",
    //       content:
    //         "<p>Setiap orang memiliki rasa favoritnya. Manis atau asin, apa pilihanmu?</p>",
    //       slug: "favoritmu-nano-nano",
    //       thumbnailUrl: "/uploads/articles/nano_07.jpg",
    //       status: 0,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-11T10:30:00.000Z",
    //       createdAt: "2024-10-11T10:30:00.000Z",
    //       updatedAt: "2024-10-11T10:30:00.000Z",
    //     },
    //     {
    //       id: "f9f3c33d-7a9f-4056-8be1-19448cc7dc16",
    //       title: "Nano Nano: Hadiah Kecil yang Berarti",
    //       content:
    //         "<p>Berikan Nano Nano kepada teman sebagai hadiah kecil yang penuh makna, pasti membawa senyum.</p>",
    //       slug: "hadiah-kecil-nano-nano",
    //       thumbnailUrl: "/uploads/articles/nano_08.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-09T11:45:00.000Z",
    //       createdAt: "2024-10-09T11:45:00.000Z",
    //       updatedAt: "2024-10-09T11:45:00.000Z",
    //     },
    //     {
    //       id: "9e3f84ae-6f11-4121-99e8-e61ff0c5f3a2",
    //       title: "Nano Nano: Sebuah Sensasi Tak Terduga",
    //       content:
    //         "<p>Dengan Nano Nano, kamu tidak pernah tahu apa yang akan kamu dapatkan di gigitan pertama: manis, asin, atau asam?</p>",
    //       slug: "nano-nano-sensasi-tak-terduga",
    //       thumbnailUrl: "/uploads/articles/nano_09.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-12T08:00:00.000Z",
    //       createdAt: "2024-10-12T08:00:00.000Z",
    //       updatedAt: "2024-10-12T08:00:00.000Z",
    //     },
    //     {
    //       id: "d645f48b-abe0-41c7-b658-b42e80e44a9f",
    //       title: "Nano Nano: Perpaduan Rasa yang Sempurna",
    //       content:
    //         "<p>Nano Nano tidak hanya dikenal karena rasanya yang berbeda-beda, tetapi juga perpaduannya yang sempurna untuk menyenangkan lidah.</p>",
    //       slug: "nano-nano-perpaduan-sempurna",
    //       thumbnailUrl: "/uploads/articles/nano_10.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-12T09:00:00.000Z",
    //       createdAt: "2024-10-12T09:00:00.000Z",
    //       updatedAt: "2024-10-12T09:00:00.000Z",
    //     },
    //     {
    //       id: "d16c1449-f624-4b16-91cb-e6df1b9ed593",
    //       title: "Rasa Unik Nano Nano: Penuh Kejutan",
    //       content:
    //         "<p>Sulit untuk menjelaskan Nano Nano kepada seseorang yang belum pernah mencobanya. Inilah yang membuatnya spesial.</p>",
    //       slug: "rasa-unik-nano-nano",
    //       thumbnailUrl: "/uploads/articles/nano_11.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-12T10:00:00.000Z",
    //       createdAt: "2024-10-12T10:00:00.000Z",
    //       updatedAt: "2024-10-12T10:00:00.000Z",
    //     },
    //     {
    //       id: "b4e8dc02-80ad-4716-8db3-df0e187cf4bb",
    //       title: "Nano Nano: Permen Favorit Generasi Z",
    //       content:
    //         "<p>Meskipun sudah ada selama puluhan tahun, Nano Nano tetap populer di kalangan anak muda zaman sekarang.</p>",
    //       slug: "nano-nano-favorit-generasi-z",
    //       thumbnailUrl: "/uploads/articles/nano_12.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-12T11:00:00.000Z",
    //       createdAt: "2024-10-12T11:00:00.000Z",
    //       updatedAt: "2024-10-12T11:00:00.000Z",
    //     },
    //     {
    //       id: "f9f03b5d-604b-46d7-bb95-b87cbaab7fbd",
    //       title: "Nano Nano: Rasa Tradisional dengan Sentuhan Modern",
    //       content:
    //         "<p>Menggabungkan rasa tradisional dengan sentuhan modern, Nano Nano tetap relevan hingga hari ini.</p>",
    //       slug: "nano-nano-tradisional-modern",
    //       thumbnailUrl: "/uploads/articles/nano_13.jpg",
    //       status: 0,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-12T12:00:00.000Z",
    //       createdAt: "2024-10-12T12:00:00.000Z",
    //       updatedAt: "2024-10-12T12:00:00.000Z",
    //     },
    //     {
    //       id: "0dc5674d-769d-4f75-bc7a-702104be924f",
    //       title: "Nano Nano: Kenangan Masa Kecil yang Kembali",
    //       content:
    //         "<p>Bagi banyak orang, Nano Nano membawa kembali kenangan masa kecil ketika mereka menikmati setiap gigitan.</p>",
    //       slug: "nano-nano-kenangan-masa-kecil",
    //       thumbnailUrl: "/uploads/articles/nano_14.jpg",
    //       status: 0,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-12T13:00:00.000Z",
    //       createdAt: "2024-10-12T13:00:00.000Z",
    //       updatedAt: "2024-10-12T13:00:00.000Z",
    //     },
    //     {
    //       id: "86b2a48b-9319-462d-b82e-e1575cbab76b",
    //       title: "Nano Nano: Permen Indonesia yang Mendunia",
    //       content:
    //         "<p>Nano Nano tidak hanya digemari di Indonesia, tetapi juga di beberapa negara tetangga, membuktikan kelezatan rasanya.</p>",
    //       slug: "nano-nano-mendunia",
    //       thumbnailUrl: "/uploads/articles/nano_15.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-12T14:00:00.000Z",
    //       createdAt: "2024-10-12T14:00:00.000Z",
    //       updatedAt: "2024-10-12T14:00:00.000Z",
    //     },
    //     {
    //       id: "a58e75cf-f435-4f5d-98d8-0f512fabc248",
    //       title: "Rasa Asli Indonesia dalam Setiap Gigitan Nano Nano",
    //       content:
    //         "<p>Dari keunikan rasanya, Nano Nano menjadi lambang rasa asli Indonesia dalam bentuk permen kecil yang penuh kejutan.</p>",
    //       slug: "rasa-asli-nano-nano",
    //       thumbnailUrl: "/uploads/articles/nano_16.jpg",
    //       status: 1,
    //       categoryId: "d5f5c5b7-3aaa-4bd8-bb3a-ef2d571be9aa",
    //       publishedAt: "2024-10-12T15:00:00.000Z",
    //       createdAt: "2024-10-12T15:00:00.000Z",
    //       updatedAt: "2024-10-12T15:00:00.000Z",
    //     },
    //   ],
    //   skipDuplicates: true, // Skip 'Bobo'
    // });

    return NextResponse.json(
      {
        success: true,
        status: 201,
        message: "Article created successfully",
        data: newArticle,
      },
      { status: 201 },
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
