'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/app/lib/data';
import { UTApi } from "uploadthing/server";
import { v4 as uuidv4 } from 'uuid';
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
  image: z.instanceof(File).optional(), // فایل اختیاری
});

const CreateCutomer = FormSchema.omit({ id: true });
const UpdateCutomer = FormSchema.omit({});

export type State = {
  message?: string | null;
  errors?: {
    name?: string[];
    email?: string[];
  };
};

export async function createCustomer(
  prevState: State,
  formData: FormData
) {
  try {
    const uuid = uuidv4()

    const validatedFields = CreateCutomer.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      image: formData.get("image")
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Customer.',
      };
    }

    const { name, email, image } = CreateCutomer.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      image: formData.get('image'),
    });

    let imageUrl: string | null = null;

    if (image instanceof File) {
      const renamedFile = new File([image], uuid, {
        type: image.type,
        lastModified: image.lastModified,
      });

      const [result] = await utapi.uploadFiles([renamedFile]);
      imageUrl = result?.data?.url ?? null;
    }

    await sql`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (${uuid}, ${name}, ${email}, ${imageUrl})
    `;

    revalidatePath('/dashboard/customers');
    return { success: true };
  } catch (err) {
    console.error(err);
    return { message: "Internal server error" };
  }
}

export async function updateCustomer(
  id: string,
  prevState: State,
  formData: FormData
) {

  const validatedFields = UpdateCutomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.',
    };
  }

  const { name, email } = UpdateCutomer.parse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  try {
    await sql`
        UPDATE customers
        SET name = ${name}, email = ${email}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
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


