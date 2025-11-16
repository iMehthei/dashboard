import { UTApi } from "uploadthing/server";
import { v4 as uuidv4 } from 'uuid';

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

export async function uploadFile(file: File) {
  try {
    const id = uuidv4()
    const renamedFile = new File([file], id, {
      type: file.type,
      lastModified: file.lastModified,
    });
    const [result] = await utapi.uploadFiles([renamedFile]);
    return result?.data?.url ?? null;
  } catch (error) {
    console.error("Upload file failed:", error);
    return null;
  }
}

export async function deleteFile(fileUrl: string) {
  if (fileUrl) {
    try {
      const fileName = fileUrl.split('/').pop();
      if (fileName) await utapi.deleteFiles([fileName]);
    } catch (err) {
      console.error("Failed to delete image from UploadThing:", err);
    }
  }
}
