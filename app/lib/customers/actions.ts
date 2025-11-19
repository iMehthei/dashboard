'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/app/lib/data';
import { v4 as uuidv4 } from 'uuid';
import { UTApi } from "uploadthing/server";
import { Customer } from './definitions';

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter the customer name.',
  }),
  email: z.string({
    invalid_type_error: 'Please enter the customer email.',
  }),
  image: z.instanceof(File).optional(),
  image_url: z.string().nullable()
});

export type State = {
  message?: string | null;
  errors?: {
    name?: string[];
    email?: string[];
  };
};

const CreateCutomer = FormSchema.omit({ id: true, image_url: true });
export async function createCustomer(
  prevState: State,
  formData: FormData
) {
  try {
    const uuid = uuidv4()
    const validatedFields = CreateCutomer.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      image: formData.get('image'),
    });
    if (!validatedFields.success) return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    }
    const { name, email, image } = validatedFields.data;

    let imageUrl: string | null = null;
    if (image) {
      const renamed = new File([image], uuid, { type: image.type });
      const [uploadedImage] = await utapi.uploadFiles([renamed]);
      if (uploadedImage?.data?.url) {
        imageUrl = uploadedImage.data.url;
      } else {
        console.error("Image upload failed:", uploadedImage);
      }
    }

    await sql`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (${uuid}, ${name}, ${email}, ${imageUrl})
    `;

  } catch (err) {
    console.error(err);
    return { message: "Internal server error" };
  }
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers')
}

const UpdateCutomer = FormSchema.omit({ id: true });
export async function updateCustomer(
  id: string,
  prevState: State,
  formData: FormData
) {
  try {
    const validatedFields = UpdateCutomer.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      image: formData.get("image"),
      image_url: formData.get("image_url")
    })
    if (!validatedFields.success) return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.',
    }
    const { name, email, image, image_url } = validatedFields.data

    let imageUrl: string | null = image_url;

    if (image && image instanceof File && image.size > 0) {
      let key: string | undefined = undefined
      if (image_url) {
        key = image_url.split("/").filter(Boolean).at(-1)
        key && await utapi.deleteFiles([key]);
      }

      const renamed = new File([image], id, { type: image.type });
      const [uploadedImage] = await utapi.uploadFiles([renamed]);
      if (uploadedImage?.data?.url) {
        imageUrl = uploadedImage.data.url;
      } else {
        console.error("Image upload failed:", uploadedImage);
      }
    }
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${imageUrl}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: '.' };
  }
  revalidatePath('/dashboard');
  redirect('/dashboard/customers')
}

export async function deleteCustomer(customer: Customer) {
  try {
    if (customer?.image_url) {
      try {
        const fileName = customer.image_url.split('/').pop();
        if (fileName) await utapi.deleteFiles([fileName]);
      } catch (err) {
        console.error("Failed to delete image from UploadThing:", err);
      }
    }
    await sql`DELETE FROM customers WHERE id = ${customer.id}`;
    revalidatePath('/dashboard/customers');
    return { success: true, message: 'Customer and image deleted successfully!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete customer.' };
  }
}


