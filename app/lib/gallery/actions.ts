"use server";

import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

const UploadImageSchema = z.object({
  image: z.instanceof(File, { message: "لطفا یک فایل معتبر انتخاب کنید" }),
});

const DeleteImageSchema = z.object({
  key: z.string().min(1, { message: "کلید فایل معتبر نیست" }),
});

export type State = {
  message: string | null;
  success: boolean;
};


export async function uploadImage(
  prevState: State,
  formData: FormData
): Promise<State> {
  const file = formData.get("image");

  const result = UploadImageSchema.safeParse({ image: file });
  if (!result.success) {
    return {
      message: "لطفاً یک فایل معتبر انتخاب کنید",
      success: false
    };
  }

  try {
    const { image } = result.data;
    const id = uuidv4();
    const renamed = new File([image], id, { type: image.type });

    await utapi.uploadFiles([renamed]);

    revalidatePath("/dashboard/gallery");

    return {
      message: "File Uploaded Successfully",
      success: true
    };
  } catch (err) {
    console.error(err);
    return {
      message: "Upload Error: Failed to Upload.",
      success: false
    };
  }
}

export async function deleteImage(key: string) {
  const result = DeleteImageSchema.safeParse({ key });
  if (!result.success) {
    console.error(result.error.flatten());
    return { success: false, message: "Invalid Key!" };
  }

  try {
    await utapi.deleteFiles([key]);
  } catch (err) {
    console.error(err);
    return { success: false, message: "Delete Error!" };
  }
  revalidatePath('/dashboard/gallery')
}
