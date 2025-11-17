import { lusitana } from "./fonts";

export function H1({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h1 className={`${lusitana.className} text-xl md:text-2xl ${className} mb-4 md:mb-8`}>
      {children}
    </h1>
  )
}
