"use client";

import { useActionState, useEffect, useState } from "react";
import { CloudArrowUpIcon, DocumentPlusIcon } from "@heroicons/react/24/outline";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { uploadImage, State } from "@/app/lib/gallery/actions";
import { PulseLoader } from "react-spinners";
import clsx from "clsx";

export default function UploadForm() {
  const initialState: State = { message: null, success: false };

  const [state, formAction, isPending] = useActionState(uploadImage, initialState);
  const [message, setMessage] = useState('')
  const [fileSelected, setFileSelected] = useState<FileList | null>(null);
  useEffect(() => {
    setFileSelected(null)
    if (state.message) {
      setMessage(state.message)
      setTimeout(() => setMessage(''), 6000)
    }
  }, [state])
  return (
    <div className="w-full">
      <form action={formAction} className="flex items-center justify-between gap-2 w-full">
        <input
          id="fileUpload"
          name="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFileSelected(e.target.files)}
        />

        <label
          htmlFor="fileUpload"
          className={clsx(
            "cursor-pointer flex items-center gap-2 border rounded-md px-3 py-2 flex-1",
          )}
        >
          {fileSelected
            ? <DocumentIcon className='h-[18px] w-[18px] text-gray-900' />
            : <DocumentPlusIcon className='h-[18px] w-[18px] text-gray-500' />
          }
          <span className={clsx('text-sm', fileSelected ? 'text-gray-900' : 'text-gray-700')}>{fileSelected ? fileSelected[0]?.name : 'Choose File'}</span>
        </label>

        <div
          className={clsx(
            'flex items-center justify-center relative h-10 rounded-lg bg-blue-600 font-medium text-white transition-colors px-4 flex-shrink-0',
            !fileSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500",
          )}
        >
          <button
            type="submit"
            disabled={!fileSelected || isPending}
            className={clsx(
              'flex items-center h-full text-sm',
              isPending ? 'sacle-0 opacity-0' : ''
            )}
          >
            <span className="hidden md:block">Upload File</span>
            <CloudArrowUpIcon className="h-5 md:ml-4" />
          </button>

          <PulseLoader
            size={10}
            color="#FFF"
            loading={isPending}
            className="absolute left-1/2 -translate-x-1/2"
          />
        </div>
      </form>

      <div className="relative">
        {message && (
          <p className={`absolute left-3 mt-2 text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
