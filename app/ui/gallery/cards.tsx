import Image from 'next/image'
import React, { Fragment } from 'react'
import { DeleteImage } from './buttons'
import { getGallery } from '@/app/lib/gallery/data';

export async function Cards({ page, limit }: { page: number, limit?: number }) {
  const { files } = await getGallery({ page, limit });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 p-2">
      {files.map(file => (
        <Fragment key={file.key}>
          <Card
            fileKey={file.key}
            name={file.name}
          />
        </Fragment>
      ))}
    </div>
  )
}

export async function Card({ fileKey, name }: { fileKey: string, name: string }) {
  return (
    <div>
      <div className="relative group border rounded overflow-hidden shadow aspect-square">
        <Image
          src={`https://utfs.io/f/${fileKey}`}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 25vw, 33vw, 50vw"
        />
        <DeleteImage keyId={fileKey} />
      </div>
      {/* <div className="truncate text-sm md:text-base">
        {name}
      </div> */}
    </div>
  )
}
