'use client';

import type { InvoiceForm } from "@/app/lib/invoices/definitions";
import type { CustomerField } from "@/app/lib/customers/definitions";
import { CheckIcon, ClockIcon, CurrencyDollarIcon, UserCircleIcon, } from '@heroicons/react/24/outline';
import { updateInvoice, createInvoice, State } from '@/app/lib/invoices/actions';
import { useActionState } from 'react';
import { Fieldset, Form, Input, Select } from '@/app/ui/form';

type InvoiceFormProps = {
  invoice?: InvoiceForm;
  customers: CustomerField[];
};

export default function InvoiceForm({
  invoice,
  customers,
}: InvoiceFormProps) {

  const initialState: State = { message: null, errors: {} };
  const onSubmit = invoice ? updateInvoice.bind(null, invoice.id) : createInvoice
  const [state, formAction] = useActionState(onSubmit, initialState);

  return (
    <Form
      formAction={formAction}
      submitButtonText={invoice ? "Edit Invoice" : "Create Invoice"}
      cancelButtonLink={"/dashboard/invoices"}
      message={state.message ?? null}
    >
      <Select
        id="customer"
        label="Choose Customer"
        name="customerId"
        defaultValue={invoice?.customer_id ?? ""}
        icon={UserCircleIcon}
        errors={state.errors?.customerId ?? []}
      >
        <option value="" disabled>Select a customer</option>
        {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
      </Select>

      <Input
        id="amount"
        name="amount"
        label="Enter Amount"
        type="number"
        step="0.01"
        placeholder="Enter USD amount"
        icon={CurrencyDollarIcon}
        defaultValue={invoice?.amount ?? undefined}
        errors={state.errors?.amount ?? []}
      />

      <Fieldset
        id="status"
        legend="Invoice Status"
        errors={state.errors?.status ?? []}
      >
        <div className="flex items-center">
          <input
            id="pending"
            name="status"
            type="radio"
            value="pending"
            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
            defaultChecked={invoice?.status === 'pending'}
          />
          <label
            htmlFor="pending"
            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
          >
            Pending <ClockIcon className="h-4 w-4" />
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="paid"
            name="status"
            type="radio"
            value="paid"
            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
            defaultChecked={invoice?.status === 'paid'}
          />
          <label
            htmlFor="paid"
            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
          >
            Paid <CheckIcon className="h-4 w-4" />
          </label>
        </div>
      </Fieldset>
    </Form>
  )
}
