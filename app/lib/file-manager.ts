import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

export async function uploadImage(file: File, id: string): Promise<string | null> {
  if (!file) return null;

  try {
    const renamedFile = new File([file], id, {
      type: file.type,
      lastModified: file.lastModified,
    });

    (renamedFile as any).customId = id;

    const [result] = await utapi.uploadFiles([renamedFile]);

    return result?.data?.url ?? null;
  } catch (error) {
    console.error("Upload Error:", error);
    return null;
  }
}


export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    if (!imageUrl) return false;

    const fileName = imageUrl.split('/').pop();
    if (!fileName) return false;

    await utapi.deleteFiles([fileName]);
    return true;
  } catch (error) {
    console.error("Delete Error:", error);
    return false;
  }
}
