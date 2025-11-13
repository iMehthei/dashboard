import InvoceForm from '@/app/ui/invoices/form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchCustomers } from '@/app/lib/customers/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <InvoceForm customers={customers} />
    </main>
  );
}