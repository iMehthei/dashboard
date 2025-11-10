import CustomersTable from '@/app/ui/customers/table';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';


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
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Customers
      </h1>
      <Search placeholder="Search customers..." />
      <Suspense fallback={<CustomersTableSkeleton />}>
        <CustomersTable query={query} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}