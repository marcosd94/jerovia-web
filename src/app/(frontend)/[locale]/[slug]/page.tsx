import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichTextView } from '@/components/RichTextView'
import { asMedia, getPage, mediaUrl } from '@/lib/data'
import { isLocale } from '@/lib/locale'

type Props = { params: Promise<{ locale: string; slug: string }> }

// Páginas institucionales creadas desde el panel (Nosotros, Comunidad, legales, etc.)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const page = await getPage(locale, slug)
  return page ? { title: page.title, description: page.intro ?? undefined } : {}
}

export default async function InfoPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const page = await getPage(locale, slug)
  if (!page) notFound()
  const image = mediaUrl(page.image, 'card')
  return (
    <div className="wrap" style={{ paddingBottom: '4rem' }}>
      <div className="page-head">
        <h1>{page.title}</h1>
        {page.intro ? <p>{page.intro}</p> : null}
      </div>
      <RichTextView data={page.content} />
      {image ? (
        <div className="page-image">
          <img src={image} alt={asMedia(page.image)?.alt ?? ''} />
        </div>
      ) : null}
    </div>
  )
}
