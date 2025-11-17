'use client'

import { deleteImage } from "@/app/lib/gallery/actions";
import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useActionState } from "react";
import { MoonLoader } from "react-spinners";

export function DeleteImage({ keyId }: { keyId: string }) {
  const handleDelete = deleteImage.bind(null, keyId);
  const [state, formAction, isPending] = useActionState(handleDelete, null);

  return (
    <form
      action={formAction}
      className={clsx(
        'absolute top-2 right-2',
        'opacity-0 group-hover:opacity-100 duration-300'
      )}
    >
      <button type="submit" className="size-9 bg-white flex items-center justify-center rounded hover:bg-gray-100">
        <TrashIcon className={clsx(isPending ? 'hidden' : 'w-4')} />
        <MoonLoader size={18} loading={isPending} />
      </button>
    </form>
  )
}
