import type { ComponentType, SVGProps } from 'react';
import { Button } from '@/app/ui/button';
type IconType = ComponentType<SVGProps<SVGSVGElement>>;
import Link from 'next/link';
import { PulseLoader } from 'react-spinners'
import clsx from 'clsx';

const titleClass = "mb-2 block text-sm font-medium"
const errorClass = "mt-2 text-sm text-red-500"
const iconClass = "pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"

export function Input({
  id,
  name,
  label,
  type,
  step,
  icon: Icon,
  errors = [],
  placeholder,
  defaultValue
}: {
  id: string
  name: string
  label: string
  type: string
  step: string | undefined
  icon: IconType,
  errors: string[],
  placeholder: string | undefined
  defaultValue: string | number | undefined
}) {
  return (
    <div className="mb-4">
      <Label htmlFor={id}>
        {label}
      </Label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id={id}
            name={name}
            type={type}
            step={step}
            placeholder={placeholder}
            aria-describedby={`${id}-error`}
            defaultValue={defaultValue}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <Icon className={iconClass} />
        </div>
      </div>
      <ErrorContainer id={id} errors={errors} />
    </div>
  )
}

export function Fieldset({
  children,
  id,
  legend,
  errors = []
}: {
  children: React.ReactNode
  id: string
  legend: string
  errors: string[]
}) {
  return (
    <fieldset aria-describedby={`${id}-error`}>
      <legend className={titleClass}>
        {legend}
      </legend>
      <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
        <div className="flex gap-4">
          {children}
        </div>
      </div>
      <ErrorContainer id={id} errors={errors} />
    </fieldset>
  )
}

export function Form({
  children,
  formAction,
  isPending,
  submitButtonText,
  cancelButtonLink,
  message
}: {
  children: React.ReactNode
  formAction: (formData: FormData) => void | Promise<any>
  isPending: boolean
  submitButtonText: string
  cancelButtonLink: string
  message: string | null
}) {
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 space-y-4">
        {children}
        {message && <p className={errorClass}>{message}</p>}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={cancelButtonLink}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" className='relative'>
          <span className={clsx(isPending ? 'scale-0 opacity-0' : '')}>{submitButtonText}</span>
          <PulseLoader color='#FFF' className={clsx(isPending ? '' : 'opacity-0 scale-0', 'absolute left-1/2 -translate-x-1/2')} />
        </Button>
      </div>
    </form>
  )
}

export function ErrorContainer({
  id,
  errors
}: {
  id: string,
  errors: string[]
}) {
  if (errors.length === 0) return null
  return (
    <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
      {errors.map((error) => (
        <p key={error} className={errorClass}>
          {error}
        </p>
      ))}
    </div>
  )
}

export function Select({
  children,
  id,
  label,
  name,
  defaultValue,
  icon: Icon,
  errors = []
}: {
  children: React.ReactNode,
  id: string,
  label: string,
  name: string,
  defaultValue: string,
  icon: IconType,
  errors: string[]
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          name={name}
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          defaultValue={defaultValue}
          aria-describedby={`${id}-error`}
        >
          {children}
        </select>
        <Icon className={iconClass} />
      </div>
      <ErrorContainer id={id} errors={errors} />
    </div>
  )
}

export function Label({
  children,
  htmlFor
}: {
  children: React.ReactNode,
  htmlFor: string
}) {
  return (
    <label htmlFor={htmlFor} className={titleClass}>
      {children}
    </label>
  )
}