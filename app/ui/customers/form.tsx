"use client"

import { updateCustomer, createCustomer, State } from '@/app/lib/customers/actions';
import { Customer } from '@/app/lib/customers/definitions';
import { Form, Input } from "@/app/ui/form"
import { AtSymbolIcon, PhotoIcon, UserIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";

export default function CustomerForm({ customer }: { customer?: Customer }) {

  const initialState: State = { message: null, errors: {} };
  const onSubmit = customer ? updateCustomer.bind(null, customer.id) : createCustomer
  const [state, formAction, isPending] = useActionState(onSubmit, initialState);

  return (
    <Form
      formAction={formAction}
      isPending={isPending}
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
      {<input type='hidden' name='image_url' value={customer?.image_url || ''} />}
      <Input
        id="image"
        name="image"
        label="Email"
        type="file"
        placeholder="Choose a Image"
        step={undefined}
        icon={PhotoIcon}
        defaultValue={undefined}
        errors={[]}
      />
    </Form>
  )
}
