import Image from 'next/image';

export function MobileTableRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b last:border-none w-full py-4">
      {children}
    </div>
  )
}

export function MobileTableRowContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 w-full rounded-md bg-white px-4">
      {children}
    </div>
  )
}

export function MobileTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:hidden">
      {children}
    </div>
  )
}

export function TableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flow-root w-full">
      <div className="inline-block min-w-full w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className="hidden min-w-full w-full text-gray-900 md:table">
      {children}
    </table>
  )
}

export function TBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className='bg-white'>
      {children}
    </tbody>
  )
}

export function THead({ titles }: { titles: string[] }) {
  return (
    <thead className="rounded-lg text-left text-sm font-normal">
      <tr className="[&>th:last-child>span]:sr-only">
        {titles.map(title => (
          <th
            key={title}
            scope="col"
            className="first:px-4 sm:first:pl-6 last:pl-6 px-3 last:py-3 py-5 last:relative font-medium"
          >
            <span>{title}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function EditCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end gap-3">
      {children}
    </div>
  )
}

export function UserCell({ image_url, name, email }: { image_url: string, name: string, email: string | null, }) {
  return (
    <div>
      <div className="flex items-center max-md:mb-2 md:gap-3 gap-2">
        <Image
          src={image_url}
          className="rounded-full"
          width={28}
          height={28}
          alt={`${name}'s profile picture`}
        />
        <p className='truncate'>{name}</p>
      </div>
      {email && <p className="text-sm text-gray-500">{email}</p>}
    </div>
  )
}

export function TBodyRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {children}
    </tr>
  )
}

export function TD({ children }: { children: React.ReactNode }) {
  return (
    <td className="whitespace-nowrap last:pl-6 first:pl-6 px-3 py-3">
      {children}
    </td>
  )
}