import { sql } from "../data";
import { deleteImage } from "../file-manager";

export async function checkCustomerImage(imageUrl: string | null, id: string) {
  if (imageUrl) {
    const customer = await sql`SELECT image_url FROM customers WHERE id = ${id}`;
    const customerImageUrl = customer[0]?.image_url;
    if (!customerImageUrl) await deleteImage(imageUrl)
  }
}