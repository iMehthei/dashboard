import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { InvoicesTableSkeleton, PaginationSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { H1 } from '@/app/ui/heading';

export const metadata: Metadata = {
  title: 'Invoices',
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
        <H1>Invoices</H1>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <Suspense fallback={<PaginationSkeleton />}>
        <Pagination query={query} />
      </Suspense>
    </div>
  );
}