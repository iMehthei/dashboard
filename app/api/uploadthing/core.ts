// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
// import { z } from "zod";
// import { sql } from "@/app/lib/data";

// const f = createUploadthing();

// export const ourFileRouter = {
//   userUploader: f({
//     image: { maxFileSize: "4MB", maxFileCount: 1 },
//   })
//     .middleware(async ({ req }) => {
//       const body = await req.json().catch(() => null);

//       const Parsed = z
//         .object({
//           name: z.string(),
//           email: z.string().email(),
//         })
//         .safeParse(body?.metadata);

//       if (!Parsed.success) {
//         throw new UploadThingError("Invalid metadata");
//       }

//       return { metadata: Parsed.data };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       const { name, email } = metadata.metadata;
//       const imageUrl = file.url;

//       // ذخیره در Postgres با SQL خام
//       await sql`
//         INSERT INTO user_uploads (id, name, email, image_url)
//         VALUES (${crypto.randomUUID()}, ${name}, ${email}, ${imageUrl})
//       `;

//       console.log("Saved to Postgres ✔");

//       return { success: true, imageUrl };
//     }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;
