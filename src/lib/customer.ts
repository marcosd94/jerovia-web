import config from '@payload-config'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import type { Customer } from '../payload-types'

// La sesión del cliente vive en su propia cookie, distinta de la del panel: iniciar sesión como cliente
// no cierra la sesión del personal ni al revés.
export const CUSTOMER_COOKIE = 'jv_customer'
export const SESSION_SECONDS = 60 * 60 * 24 * 7

export async function setCustomerSession(token: string) {
  const jar = await cookies()
  jar.set(CUSTOMER_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: SESSION_SECONDS })
}

export async function clearCustomerSession() {
  const jar = await cookies()
  jar.delete(CUSTOMER_COOKIE)
}

/** Cliente con sesión iniciada, o null */
export async function getCustomer(): Promise<Customer | null> {
  const token = (await cookies()).get(CUSTOMER_COOKIE)?.value
  if (!token) return null
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    return user && (user as { collection?: string }).collection === 'customers' ? (user as unknown as Customer) : null
  } catch {
    return null
  }
}
