import { fetchInvoicesPages } from "@/app/lib/data";
import PaginationClient from "@/app/ui/invoices/pagination-client";

export default async function Pagination({ query }: { query: string }) {
  const totalPages = await fetchInvoicesPages(query);

  return (
    <PaginationClient totalPages={totalPages} />
  )
}
