import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { brand, copy } from '@brand'
import { getPosts, localePath } from '@/lib/data'
import { isLocale, pick } from '@/lib/locale'
import { t } from '@/lib/messages'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: isLocale(locale) ? pick(copy.blogPage.title, locale) : 'Blog' }
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale) || !brand.features.blog) notFound()
  const posts = await getPosts(locale)
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{pick(copy.blogPage.title, locale)}</h1>
        <p>{pick(copy.blogPage.intro, locale)}</p>
      </div>
      {posts.length === 0 ? (
        <p>{t(locale, 'noPosts')}</p>
      ) : (
        <ul className="press-list" style={{ marginBottom: '4rem' }}>
          {posts.map((n) => {
            const inner = (
              <>
                <span className="press-source">
                  {n.source ?? ''}
                  {n.publishedAt ? `${n.source ? ', ' : ''}${new Date(n.publishedAt).toLocaleDateString(locale === 'es' ? 'es-PY' : locale)}` : ''}
                </span>
                <span>
                  <strong>{n.title}</strong>
                  {n.excerpt ? <span style={{ display: 'block' }}>{n.excerpt}</span> : null}
                </span>
              </>
            )
            return (
              <li key={n.id}>
                {n.externalUrl ? (
                  <a className="press-item" href={n.externalUrl} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : n.content ? (
                  <Link className="press-item" href={localePath(locale, `/blog/${n.slug}`)}>
                    {inner}
                  </Link>
                ) : (
                  <div className="press-item">{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
