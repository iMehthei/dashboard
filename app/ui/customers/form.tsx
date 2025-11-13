"use client"

import { updateCustomer, createCustomer, State } from '@/app/lib/customers/actions';
import { Customer } from '@/app/lib/customers/definitions';
import { Form, Input } from "@/app/ui/form"
import { AtSymbolIcon, UserIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";

export default function CustomerForm({
  customer
}: {
  customer: Customer | null
}) {

  const initialState: State = { message: null, errors: {} };
  const onSubmit = customer ? updateCustomer.bind(null, customer.id) : createCustomer
  const [state, formAction] = useActionState(onSubmit, initialState);

  return (
    <Form
      formAction={formAction}
      submitButtonText={customer ? "Edit Customer" : "Create Customer"}
      cancelButtonLink={"/dashboard/customers"}
      message={state.message ?? null}
    >
      <Input
        id="name"
        name="name"
        label="Name"
        type="text"
        placeholder="Enter Name"
        step={undefined}
        icon={UserIcon}
        defaultValue={customer?.name ?? undefined}
        errors={state.errors?.name ?? []}
      />
      <Input
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="Enter Email"
        step={undefined}
        icon={AtSymbolIcon}
        defaultValue={customer?.email ?? undefined}
        errors={state.errors?.email ?? []}
      />
    </Form>
  )
}
