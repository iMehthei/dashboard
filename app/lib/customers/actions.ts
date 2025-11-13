'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/app/lib/data';

const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter the customer name.',
  }),
  email: z.string({
    invalid_type_error: 'Please enter the customer email.',
  }),
  image_url: z.string()
});

const CreateCutomer = FormSchema.omit({ id: true, image_url: true });
const UpdateCutomer = FormSchema.omit({ id: true, image_url: true });

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

  const validatedFields = CreateCutomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }

  const { name, email } = CreateCutomer.parse({
    name: formData.get('name'),
    email: formData.get('email'),
  });


  try {
    await sql`
      INSERT INTO customers (name, email)
      VALUES (${name}, ${email})
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
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

export async function deleteCustomer(id: string) {
  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath('/dashboard/customers');
}

