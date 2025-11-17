import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

async function countAllFiles() {
  let total = 0;
  let offset = 0;
  const limit = 200;

  while (true) {
    const res = await utapi.listFiles({ limit, offset });
    total += res.files.length;
    if (!res.hasMore) break;
    offset += limit;
  }

  return total;
}

export async function getGallery({ page = 1, limit = 12 }) {
  const offset = (page - 1) * limit;

  const res = await utapi.listFiles({ limit, offset });
  const total = await countAllFiles();

  return {
    files: res.files,
    hasMore: res.hasMore,
    total,
  };
}
