'use client'

import { track } from '../lib/analytics'

const ICONS: Record<string, string> = {
  web: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.5 2.7 4 6.2 4 10s-1.5 7.3-4 10m0-20C9.5 4.7 8 8.2 8 12s1.5 7.3 4 10M2 12h20',
  whatsapp: 'M4 20l1.3-4.2A8 8 0 1112 20a8 8 0 01-3.9-1L4 20zm5-11c0 3 3 6 6 6l1.2-1.6-2-1-1 .6c-.8-.4-1.6-1.2-2-2l.6-1-1-2L9 9z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  email: 'M3 6h18v12H3zM3 7l9 7 9-7',
  instagram: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5a4 4 0 100 8 4 4 0 000-8zm5.5-1.5v.01',
  facebook: 'M14 9V7c0-1 .5-1.5 1.5-1.5H17V3h-2.5C12 3 11 4.7 11 7v2H8.5v3H11v9h3v-9h2.5l.5-3H14z',
  tiktok: 'M14 3v11.5a3.5 3.5 0 11-3.5-3.5M14 3c.3 2.4 2 4 4.5 4.2',
  maps: 'M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  other: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1',
}

type Props = { href: string; label: string; kind: string; image?: string | null; tone?: string; asIcon?: boolean }

export function LinkButton({ href, label, kind, image, tone, asIcon }: Props) {
  const external = /^https?:\/\//i.test(href)
  return (
    <a
      className={asIcon ? 'link-icon' : `link-btn${tone && tone !== 'default' ? ` link-${tone}` : ''}${image ? ' has-img' : ''}`}
      {...(asIcon ? { 'aria-label': label, title: label } : {})}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={() => track('link_click', { link_label: label, link_kind: kind, link_url: href.split('?')[0], page: 'links' })}
    >
      {image && !asIcon ? <img className="link-thumb" src={image} alt="" width={48} height={48} /> : null}
      {!image || asIcon ? <svg viewBox="0 0 24 24" width={asIcon ? 26 : 22} height={asIcon ? 26 : 22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={ICONS[kind] ?? ICONS.other} />
      </svg> : null}
      {asIcon ? null : <span>{label}</span>}
    </a>
  )
}
