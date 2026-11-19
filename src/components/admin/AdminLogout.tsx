/** Botón "Cerrar sesión" visible, con texto, al pie del menú lateral del panel */
export function AdminLogout({ tabIndex = 0 }: { tabIndex?: number }) {
  return (
    <a className="admin-logout" href="/admin/logout" tabIndex={tabIndex}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5M21 12H9" />
      </svg>
      Cerrar sesión
    </a>
  )
}
