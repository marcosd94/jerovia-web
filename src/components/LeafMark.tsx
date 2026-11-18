// Marca de agua: hoja estilizada que se usa cuando un producto todavía no tiene foto.
export function LeafMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label="" aria-hidden="true" focusable="false">
      <path d="M20 100C20 52 52 20 104 16c-2 54-32 86-80 88" fill="currentColor" opacity="0.9" />
      <path d="M26 98C48 76 68 54 92 30" fill="none" stroke="var(--paper)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
