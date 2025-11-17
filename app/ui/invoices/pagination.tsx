import { fetchInvoicesPages } from '@/app/lib/invoices/data';
import Pagination from "@/app/ui/pagination";

export default async function InvoicesPagination({ query }: { query: string }) {
  const totalPages = await fetchInvoicesPages(query);

  return (
    <Pagination totalPages={totalPages} />
  )
}
