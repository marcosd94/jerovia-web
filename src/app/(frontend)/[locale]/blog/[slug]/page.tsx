import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { brand } from '@brand'
import { RichTextView } from '@/components/RichTextView'
import { asMedia, getPost, localePath, mediaUrl } from '@/lib/data'
import { isLocale } from '@/lib/locale'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = await getPost(locale, slug)
  return post ? { title: post.title, description: post.excerpt ?? undefined } : {}
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale) || !brand.features.blog) notFound()
  const post = await getPost(locale, slug)
  if (!post) notFound()
  const cover = mediaUrl(post.cover, 'hero')
  return (
    <article className="wrap" style={{ paddingBottom: '4rem' }}>
      <div className="page-head">
        <h1>{post.title}</h1>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
        {post.publishedAt ? <p className="small">{new Date(post.publishedAt).toLocaleDateString(locale === 'es' ? 'es-PY' : locale, { dateStyle: 'long' })}</p> : null}
      </div>
      {cover ? <img src={cover} alt={asMedia(post.cover)?.alt ?? ''} style={{ borderRadius: 6, marginBottom: '2rem', maxHeight: 440, objectFit: 'cover', width: '100%' }} /> : null}
      <RichTextView data={post.content} />
      <p style={{ marginTop: '2.5rem' }}>
        <Link className="btn btn-ghost" href={localePath(locale, '/blog')}>
          {locale === 'en' ? 'Back' : locale === 'pt' ? 'Voltar' : 'Volver'}
        </Link>
      </p>
    </article>
  )
}
