"use client";

import { useActionState, useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { uploadImage, State } from "@/app/lib/gallery/actions";
import { PulseLoader } from "react-spinners";
import clsx from "clsx";

export default function UploadForm() {
  const initialState: State = { message: null, success: false };

  const [state, formAction, isPending] = useActionState(uploadImage, initialState);
  const [fileSelected, setFileSelected] = useState(false);

  return (
    <>
      <form action={formAction} className="flex items-center justify-between gap-2">
        <input
          name="image"
          type="file"
          accept="image/*"
          className="border rounded-md p-1 flex flex-1 flex-shrink-0"
          onChange={(e) => setFileSelected(e.target.files?.length === 1)}
        />

        <div className={clsx(
          'flex items-center justify-center relative h-10 rounded-lg bg-blue-600 font-medium text-white transition-colors',
          !fileSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500",
        )}>
          <button
            type="submit"
            disabled={!fileSelected || isPending}
            className={clsx(
              'flex items-center h-full px-4 text-sm',
              isPending ? 'sacle-0 opacity-0' : ''
            )}
          >
            <span className="hidden md:block">Upload File</span>
            <CloudArrowUpIcon className="h-5 md:ml-4" />
          </button>
          <PulseLoader size={10} color='#FFF' loading={isPending} className='absolute left-1/2 -translate-x-1/2' />
        </div>
      </form>

      {state.message && (
        <p className={`mt-2 text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
          {state.message}
        </p>
      )}
    </>
  );
}
