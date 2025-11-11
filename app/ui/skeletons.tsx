"use client"

import { EditCell, MobileTable, MobileTableRow, MobileTableRowContainer, Table, TableContainer, TBody, TBodyRow, TD, THead } from '@/app/ui/table';
import clsx from "clsx";

// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="rounded-xl bg-gray-100 p-4">
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-gray-200" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-gray-200" />
          <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
        <div className="bg-white px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function InvoicesTableSkeleton() {
  const tableHeadTitles = ['Customer', 'Email', 'Amount', 'Date', 'Status', 'Edit'];

  return (
    <div className='relative overflow-hidden'>
      <div className={shimmer}>
        <TableContainer>
          <MobileTable>
            {Array.from({ length: 6 }).map((_, idx) => (
              <MobileTableRowContainer key={idx}>
                <MobileTableRow>
                  <div className='pb-2'>
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-gray-300" />
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                    </div>
                    <div className="h-3 mt-2 w-24 bg-gray-300 rounded" />
                  </div>
                  <div className="h-6 w-16 bg-gray-300 rounded-full" />
                </MobileTableRow>
                <MobileTableRow>
                  <div className="flex flex-col gap-2 py-1">
                    <div className="h-5 w-16 bg-gray-300 rounded" />
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                  </div>
                  <EditCell>
                    <div className="size-9 bg-gray-300 rounded" />
                    <div className="size-9 bg-gray-300 rounded" />
                  </EditCell>
                </MobileTableRow>
              </MobileTableRowContainer>
            ))}
          </MobileTable>

          {/* Desktop */}
          <Table>
            <THead titles={tableHeadTitles} />
            <TBody>
              {Array.from({ length: 6 }).map((_, idx) => (
                <TBodyRow key={idx}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-gray-300" />
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                    </div>
                  </TD>
                  <TD><div className="h-4 w-32 bg-gray-300 rounded" /></TD>
                  <TD><div className="h-4 w-16 bg-gray-300 rounded" /></TD>
                  <TD><div className="h-4 w-20 bg-gray-300 rounded" /></TD>
                  <TD><div className="h-6 w-16 bg-gray-300 rounded-full" /></TD>
                  <TD>
                    <div className="flex gap-3">
                      <div className="h-9 w-9 bg-gray-300 rounded" />
                      <div className="h-9 w-9 bg-gray-300 rounded" />
                    </div>
                  </TD>
                </TBodyRow>
              ))}
            </TBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export function CustomersTableSkeleton() {
  const tableHeadTitles = ['Name', 'Email', 'Total Invoices', 'Total Pending', 'Total Paid', 'Edit'];

  return (
    <div className='relative overflow-hidden'>
      <div className={`${shimmer}`}>
        <TableContainer>
          {/* Mobile */}
          <MobileTable>
            {Array.from({ length: 6 }).map((_, idx) => (
              <MobileTableRowContainer key={idx}>
                <MobileTableRow>
                  <div className='py-1'>
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-gray-300" />
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                    </div>
                    <div className="h-3 mt-2 w-24 bg-gray-300 rounded" />
                  </div>
                </MobileTableRow>
                <MobileTableRow>
                  <div className='py-1 flex w-full'>
                    <div className="flex w-1/2 flex-col gap-1">
                      <div className="h-3 w-12 bg-gray-300 rounded" />
                      <div className="h-4 w-16 bg-gray-300 rounded" />
                    </div>
                    <div className="flex w-1/2 flex-col gap-1">
                      <div className="h-3 w-12 bg-gray-300 rounded" />
                      <div className="h-4 w-16 bg-gray-300 rounded" />
                    </div>
                  </div>
                </MobileTableRow>
                <MobileTableRow>
                  <div className='py-1'>
                    <div className="h-4 w-24 bg-gray-300 rounded" />
                  </div>
                </MobileTableRow>
              </MobileTableRowContainer>
            ))}
          </MobileTable>

          {/* Desktop */}
          <Table>
            <THead titles={tableHeadTitles} />
            <TBody>
              {Array.from({ length: 6 }).map((_, idx) => (
                <TBodyRow key={idx}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-gray-300" />
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                    </div>
                  </TD>
                  <TD><div className="h-4 w-32 bg-gray-300 rounded" /></TD>
                  <TD><div className="h-4 w-8 bg-gray-300 rounded" /></TD>
                  <TD><div className="h-4 w-16 bg-gray-300 rounded" /></TD>
                  <TD><div className="h-4 w-16 bg-gray-300 rounded" /></TD>
                  <TD>
                    <div className="flex gap-3">
                      <div className="h-9 w-9 bg-gray-300 rounded" />
                      <div className="h-9 w-9 bg-gray-300 rounded" />
                    </div>
                  </TD>
                </TBodyRow>
              ))}
            </TBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export function PaginationSkeleton() {
  const fakeButtons = Array.from({ length: 3 });

  return (
    <div className="relative overflow-hidden">
      <div className={`${shimmer} mt-5 flex w-full justify-center`}>
        <div className="inline-flex">
          {/* Left Arrow */}
          <div
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-md border',
              'bg-gray-300 mr-2 md:mr-4',
            )}
          />

          {/* Page Numbers */}
          <div className="flex -space-x-px">
            {fakeButtons.map((_, i) => (
              <div
                key={i}
                className={clsx(
                  'flex h-10 w-10 items-center justify-center text-sm border',
                  'bg-gray-300 text-transparent select-none',
                  {
                    'rounded-l-md': i === 0,
                    'rounded-r-md': i === fakeButtons.length - 1,
                  },
                )}
              >
                0
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <div
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-md border',
              'bg-gray-300 ml-2 md:ml-4',
            )}
          />
        </div>
      </div>
    </div>
  );
}
