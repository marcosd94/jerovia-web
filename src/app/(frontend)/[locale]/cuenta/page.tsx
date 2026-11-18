import config from '@payload-config'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { brand } from '@brand'
import { getCustomer } from '@/lib/customer'
import { localePath } from '@/lib/data'
import { isLocale } from '@/lib/locale'
import { ta, type AccountKey } from '@/lib/messages-account'
import { AddressForm, DeleteForm, PasswordForm, ProfileForm } from './AccountForms'
import { logoutAccount, removeAddress } from './actions'

export const metadata: Metadata = { title: 'Mi cuenta', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

const gs = (n: number | null | undefined) => (typeof n === 'number' ? `Gs. ${n.toLocaleString('es-PY')}` : '—')

export default async function Account({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale) || !brand.features.accounts) notFound()
  const me = await getCustomer()
  if (!me) redirect(localePath(locale, '/cuenta/ingresar'))

  // overrideAccess:false + user: las reglas de acceso aseguran que solo se lean los pedidos de esta cuenta
  const payload = await getPayload({ config })
  const orders = await payload.find({
    collection: 'orders',
    where: { account: { equals: me.id } },
    sort: '-createdAt',
    limit: 20,
    depth: 0,
    user: me,
    overrideAccess: false,
  })

  const date = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : locale === 'pt' ? 'pt-BR' : 'es-PY', { dateStyle: 'medium' })
  return (
    <div className="wrap">
      <div className="page-head" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'end', justifyContent: 'space-between' }}>
        <div>
          <h1>{ta(locale, 'title')}</h1>
          <p>{me.email}</p>
        </div>
        <form action={logoutAccount}>
          <input type="hidden" name="locale" value={locale} />
          <button className="btn btn-ghost" type="submit">
            {ta(locale, 'logout')}
          </button>
        </form>
      </div>

      <div className="account-grid">
        <section aria-labelledby="orders-h">
          <h2 id="orders-h">{ta(locale, 'orders')}</h2>
          {orders.docs.length === 0 ? (
            <p>{ta(locale, 'ordersEmpty')}</p>
          ) : (
            <div className="table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>{ta(locale, 'order')}</th>
                    <th>{ta(locale, 'date')}</th>
                    <th>{ta(locale, 'status')}</th>
                    <th>{ta(locale, 'total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.docs.map((o) => (
                    <tr key={o.id}>
                      <td>{o.orderNumber}</td>
                      <td>{date.format(new Date(o.createdAt))}</td>
                      <td>{ta(locale, `st_${o.status}` as AccountKey)}</td>
                      <td>{gs(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-labelledby="profile-h">
          <h2 id="profile-h">{ta(locale, 'profile')}</h2>
          <ProfileForm
            locale={locale}
            d={{
              name: me.name,
              phone: me.phone,
              documentType: me.billing?.documentType ?? 'ci',
              documentNumber: me.billing?.documentNumber ?? '',
              businessName: me.billing?.businessName ?? '',
              preferredLocale: me.preferredLocale ?? 'es',
              marketing: Boolean(me.marketingOptIn),
            }}
          />
        </section>

        <section aria-labelledby="addr-h">
          <h2 id="addr-h">{ta(locale, 'addresses')}</h2>
          {(me.addresses ?? []).length === 0 ? (
            <p>{ta(locale, 'addressesEmpty')}</p>
          ) : (
            <ul className="addr-list">
              {(me.addresses ?? []).map((a) => (
                <li key={a.id}>
                  <div>
                    <strong>{a.label}</strong> {a.isDefault ? <span className="tag">{ta(locale, 'isDefault')}</span> : null}
                    <br />
                    {a.address}
                    {a.reference ? <> · {a.reference}</> : null}
                    {a.city ? <> · {a.city}</> : null}
                  </div>
                  <form action={removeAddress}>
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="addressId" value={a.id ?? ''} />
                    <button className="btn btn-ghost" type="submit">
                      {ta(locale, 'remove')}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <h3>{ta(locale, 'addAddress')}</h3>
          <AddressForm locale={locale} />
        </section>

        <section aria-labelledby="pwd-h">
          <h2 id="pwd-h">{ta(locale, 'changePassword')}</h2>
          <PasswordForm locale={locale} />
          <h2 id="del-h" style={{ marginTop: '2.5rem' }}>
            {ta(locale, 'deleteTitle')}
          </h2>
          <DeleteForm locale={locale} />
        </section>
      </div>
    </div>
  )
}
