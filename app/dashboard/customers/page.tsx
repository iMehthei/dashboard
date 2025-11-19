import CustomersTable from '@/app/ui/customers/table';
import { CustomersTableSkeleton, PaginationSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Search from '@/app/ui/search';
import { CreateCustomer } from '@/app/ui/customers/buttons';
import { H1 } from '@/app/ui/heading';
import CustomersPagination from '@/app/ui/customers/pagination';


export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <H1>Customers</H1>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>
      <Suspense fallback={<CustomersTableSkeleton />}>
        <CustomersTable query={query} currentPage={currentPage} />
      </Suspense>
      <Suspense fallback={<PaginationSkeleton />}>
        <CustomersPagination query={query} />
      </Suspense>
    </div>
  );
}