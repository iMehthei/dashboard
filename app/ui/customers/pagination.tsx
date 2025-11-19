import { fetchCustomersPages } from '@/app/lib/customers/data';
import Pagination from "@/app/ui/pagination";

export default async function CustomersPagination({ query }: { query: string }) {
  const totalPages = await fetchCustomersPages(query);

  return (
    <Pagination totalPages={totalPages} />
  )
}
