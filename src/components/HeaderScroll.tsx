'use client'

import { useEffect } from 'react'

/** Achica el menú fijo y le agrega sombra cuando se baja por la página. No muestra nada. */
export function HeaderScroll() {
  useEffect(() => {
    const header = document.querySelector('.site-header')
    if (!header) return
    const update = () => header.toggleAttribute('data-scrolled', window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return null
}
