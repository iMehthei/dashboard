'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/app/lib/data';
import { v4 as uuidv4 } from 'uuid';

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

const CreateCutomer = FormSchema.omit({ id: true });
export async function createCustomer(
  prevState: State,
  formData: FormData
) {
  try {
    const uuid = uuidv4()
    const validatedFields = CreateCutomer.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      image_url: formData.get('image_url'),
    });
    if (!validatedFields.success) return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    }
    const { name, email, image_url } = validatedFields.data;

    await sql`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (${uuid}, ${name}, ${email}, ${image_url})
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
      image_url: formData.get("image_url")
    })
    if (!validatedFields.success) return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.',
    }
    const { name, email, image_url } = validatedFields.data

    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${image_url}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer.' };
  }
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers')
}

export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
    return { success: true, message: 'Customer and image deleted successfully!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete customer.' };
  }
}


