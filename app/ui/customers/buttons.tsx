"use client"

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCustomer } from '@/app/lib/customers/actions';
import { useActionState } from 'react';
import clsx from 'clsx';
import { MoonLoader } from 'react-spinners';

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customer</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      className="rounded-md border hover:bg-gray-100 size-9 flex items-center justify-center"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteCustomer({ id }: { id: string }) {
  const handleDelete = deleteCustomer.bind(null, id);
  const [state, formAction, isPending] = useActionState(handleDelete, null);

  return (
    <form action={formAction}>
      <button type="submit" className='border hover:bg-gray-100 size-9 flex items-center justify-center relative'>
        <span className="sr-only">Delete</span>
        <TrashIcon className={clsx(isPending ? 'hidden' : 'w-4')} />
        <MoonLoader size={18} loading={isPending} />
      </button>
    </form>
  );
}
