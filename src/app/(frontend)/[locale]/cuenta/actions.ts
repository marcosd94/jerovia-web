'use server'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { MIN_PASSWORD } from '@/collections/Customers'
import { clearCustomerSession, getCustomer, setCustomerSession } from '@/lib/customer'
import { localePath } from '@/lib/data'
import { isLocale } from '@/lib/locale'
import type { AccountKey } from '@/lib/messages-account'
import { allow, clientIp } from '@/lib/ratelimit'

export type AcctState = {
  status: 'idle' | 'ok' | 'error'
  message?: AccountKey
  errors?: Record<string, AccountKey>
  values?: Record<string, string>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const loc = (fd: FormData) => {
  const l = clean(fd.get('locale'), 5)
  return isLocale(l) ? l : 'es'
}
const getP = async () => getPayload({ config })
const errName = (e: unknown) => (e as { name?: string })?.name ?? ''

/** Los datos sensibles nunca vuelven a pintarse en el formulario */
const keep = (fd: FormData, names: string[]) => Object.fromEntries(names.map((n) => [n, clean(fd.get(n), 300)]))

// ---------- Registro ----------
export async function registerAccount(_p: AcctState, fd: FormData): Promise<AcctState> {
  if (clean(fd.get('website'), 50)) return { status: 'ok' } // trampa anti-robots
  const locale = loc(fd)
  const values = keep(fd, ['name', 'email', 'phone'])
  if (!allow(`register:${await clientIp()}`, 5, 60 * 60 * 1000)) return { status: 'error', message: 'errLimit', values }

  const password = String(fd.get('password') ?? '')
  const errors: Record<string, AccountKey> = {}
  if (!values.name) errors.name = 'errRequired'
  if (!values.phone || !/^[+\d\s().-]{6,40}$/.test(values.phone)) errors.phone = 'errRequired'
  if (!values.email || !EMAIL.test(values.email)) errors.email = 'errEmail'
  if (password.length < MIN_PASSWORD) errors.password = 'errPassword'
  if (fd.get('privacy') !== 'on') errors.privacy = 'errPrivacy'
  if (Object.keys(errors).length) return { status: 'error', errors, values }

  const payload = await getP()
  const now = new Date().toISOString()
  const marketing = fd.get('marketing') === 'on'
  let needsVerify = false
  try {
    await payload.create({
      collection: 'customers',
      data: {
        email: values.email.toLowerCase(),
        password,
        name: values.name,
        phone: values.phone,
        preferredLocale: locale,
        privacyAcceptedAt: now,
        marketingOptIn: marketing,
        marketingOptInAt: marketing ? now : undefined,
      },
      overrideAccess: true, // el público no tiene permiso de crear: esta función valida todo antes
    })
    needsVerify = Boolean(process.env.SMTP_HOST)
  } catch (error) {
    console.error('No se pudo crear la cuenta de cliente', errName(error))
    return { status: 'error', message: 'errRegister', values }
  }
  if (needsVerify) return { status: 'ok', message: 'verifyNeeded' }
  // Sin verificación por correo (desarrollo): se inicia sesión directo
  try {
    const res = await payload.login({ collection: 'customers', data: { email: values.email.toLowerCase(), password } })
    if (res.token) await setCustomerSession(res.token)
  } catch {
    return { status: 'ok', message: 'verifyNeeded' }
  }
  redirect(localePath(locale, '/cuenta'))
}

// ---------- Ingreso / salida ----------
export async function loginAccount(_p: AcctState, fd: FormData): Promise<AcctState> {
  const locale = loc(fd)
  const email = clean(fd.get('email'), 200).toLowerCase()
  const password = String(fd.get('password') ?? '')
  if (!allow(`login:${await clientIp()}`, 15, 10 * 60 * 1000)) return { status: 'error', message: 'errLimit', values: { email } }
  if (!email || !password) return { status: 'error', message: 'errLogin', values: { email } }
  try {
    const payload = await getP()
    const res = await payload.login({ collection: 'customers', data: { email, password } })
    if (!res.token) return { status: 'error', message: 'errLogin', values: { email } }
    await setCustomerSession(res.token)
  } catch (error) {
    const name = errName(error)
    const message: AccountKey = name === 'LockedAuth' ? 'errLocked' : name === 'UnverifiedEmail' ? 'errUnverified' : 'errLogin'
    return { status: 'error', message, values: { email } }
  }
  redirect(localePath(locale, '/cuenta'))
}

export async function logoutAccount(fd: FormData) {
  await clearCustomerSession()
  redirect(localePath(loc(fd), '/cuenta/ingresar'))
}

// ---------- Recuperar contraseña ----------
export async function forgotPassword(_p: AcctState, fd: FormData): Promise<AcctState> {
  const email = clean(fd.get('email'), 200).toLowerCase()
  if (!allow(`forgot:${await clientIp()}`, 5, 60 * 60 * 1000)) return { status: 'error', message: 'errLimit', values: { email } }
  if (!EMAIL.test(email)) return { status: 'error', errors: { email: 'errEmail' }, values: { email } }
  try {
    const payload = await getP()
    await payload.forgotPassword({ collection: 'customers', data: { email }, disableEmail: !process.env.SMTP_HOST })
  } catch (error) {
    console.error('forgotPassword', errName(error))
  }
  // Siempre la misma respuesta, exista o no el correo (no revela quién tiene cuenta)
  return { status: 'ok', message: 'forgotSent' }
}

export async function resetPassword(_p: AcctState, fd: FormData): Promise<AcctState> {
  const token = clean(fd.get('token'), 200)
  const password = String(fd.get('password') ?? '')
  if (!allow(`reset:${await clientIp()}`, 10, 60 * 60 * 1000)) return { status: 'error', message: 'errLimit' }
  if (password.length < MIN_PASSWORD) return { status: 'error', errors: { password: 'errPassword' } }
  try {
    const payload = await getP()
    await payload.resetPassword({ collection: 'customers', data: { token, password }, overrideAccess: true })
  } catch {
    return { status: 'error', message: 'resetInvalid' }
  }
  return { status: 'ok', message: 'resetDone' }
}

// ---------- Mis datos ----------
export async function updateProfile(_p: AcctState, fd: FormData): Promise<AcctState> {
  const me = await getCustomer()
  if (!me) return { status: 'error', message: 'errGeneric' }
  const name = clean(fd.get('name'), 120)
  const phone = clean(fd.get('phone'), 40)
  const errors: Record<string, AccountKey> = {}
  if (!name) errors.name = 'errRequired'
  if (!phone || !/^[+\d\s().-]{6,40}$/.test(phone)) errors.phone = 'errRequired'
  if (Object.keys(errors).length) return { status: 'error', errors }

  const docTypeRaw = clean(fd.get('documentType'), 10)
  const documentType = (['ci', 'ruc', 'other'] as const).find((d) => d === docTypeRaw) ?? 'ci'
  const prefRaw = clean(fd.get('preferredLocale'), 5)
  const marketing = fd.get('marketing') === 'on'
  try {
    const payload = await getP()
    await payload.update({
      collection: 'customers',
      id: me.id,
      data: {
        name,
        phone,
        billing: { documentType, documentNumber: clean(fd.get('documentNumber'), 30), businessName: clean(fd.get('businessName'), 160) },
        preferredLocale: isLocale(prefRaw) ? prefRaw : 'es',
        marketingOptIn: marketing,
        // la fecha de aceptación solo cambia cuando cambia la decisión
        ...(marketing !== Boolean(me.marketingOptIn) ? { marketingOptInAt: marketing ? new Date().toISOString() : null } : {}),
      },
      overrideAccess: true, // se arma solo con los campos permitidos de arriba, y para la cuenta que tiene la sesión
    })
  } catch (error) {
    console.error('updateProfile', errName(error))
    return { status: 'error', message: 'errGeneric' }
  }
  revalidatePath('/[locale]/cuenta', 'page')
  return { status: 'ok', message: 'saved' }
}

// ---------- Direcciones ----------
export async function addAddress(_p: AcctState, fd: FormData): Promise<AcctState> {
  const me = await getCustomer()
  if (!me) return { status: 'error', message: 'errGeneric' }
  const label = clean(fd.get('label'), 60)
  const address = clean(fd.get('address'), 400)
  const errors: Record<string, AccountKey> = {}
  if (!label) errors.label = 'errRequired'
  if (!address) errors.address = 'errRequired'
  if (Object.keys(errors).length) return { status: 'error', errors, values: keep(fd, ['label', 'address', 'reference', 'city']) }
  if ((me.addresses?.length ?? 0) >= 10) return { status: 'error', message: 'errGeneric' }

  const makeDefault = fd.get('isDefault') === 'on' || !(me.addresses?.length ?? 0)
  const existing = (me.addresses ?? []).map((a) => ({ ...a, isDefault: makeDefault ? false : a.isDefault }))
  try {
    const payload = await getP()
    await payload.update({
      collection: 'customers',
      id: me.id,
      data: { addresses: [...existing, { label, address, reference: clean(fd.get('reference'), 160), city: clean(fd.get('city'), 80), isDefault: makeDefault }] },
      overrideAccess: true,
    })
  } catch (error) {
    console.error('addAddress', errName(error))
    return { status: 'error', message: 'errGeneric' }
  }
  revalidatePath('/[locale]/cuenta', 'page')
  return { status: 'ok', message: 'saved' }
}

export async function removeAddress(fd: FormData) {
  const me = await getCustomer()
  const id = clean(fd.get('addressId'), 80)
  if (!me || !id) return
  const rest = (me.addresses ?? []).filter((a) => a.id !== id)
  if (rest.length && !rest.some((a) => a.isDefault)) rest[0] = { ...rest[0], isDefault: true }
  const payload = await getP()
  await payload.update({ collection: 'customers', id: me.id, data: { addresses: rest }, overrideAccess: true })
  redirect(localePath(loc(fd), '/cuenta'))
}

// ---------- Contraseña y baja ----------
async function confirmPassword(email: string, password: string): Promise<boolean> {
  try {
    const payload = await getP()
    const res = await payload.login({ collection: 'customers', data: { email, password } })
    return Boolean(res.token)
  } catch {
    return false
  }
}

export async function changePassword(_p: AcctState, fd: FormData): Promise<AcctState> {
  const me = await getCustomer()
  if (!me) return { status: 'error', message: 'errGeneric' }
  if (!allow(`pwd:${me.id}`, 8, 60 * 60 * 1000)) return { status: 'error', message: 'errLimit' }
  const current = String(fd.get('currentPassword') ?? '')
  const next = String(fd.get('newPassword') ?? '')
  if (next.length < MIN_PASSWORD) return { status: 'error', errors: { newPassword: 'errPassword' } }
  if (!(await confirmPassword(me.email, current))) return { status: 'error', errors: { currentPassword: 'errCurrentPassword' } }
  try {
    const payload = await getP()
    await payload.update({ collection: 'customers', id: me.id, data: { password: next }, overrideAccess: true })
  } catch {
    return { status: 'error', message: 'errGeneric' }
  }
  return { status: 'ok', message: 'passwordChanged' }
}

export async function deleteAccount(_p: AcctState, fd: FormData): Promise<AcctState> {
  const me = await getCustomer()
  if (!me) return { status: 'error', message: 'errGeneric' }
  if (!allow(`del:${me.id}`, 5, 60 * 60 * 1000)) return { status: 'error', message: 'errLimit' }
  if (!(await confirmPassword(me.email, String(fd.get('password') ?? '')))) return { status: 'error', errors: { password: 'errCurrentPassword' } }
  try {
    const payload = await getP()
    // Los pedidos se conservan como registro de la tienda, ya sin vínculo con la cuenta
    await payload.update({ collection: 'orders', where: { account: { equals: me.id } }, data: { account: null }, overrideAccess: true })
    await payload.delete({ collection: 'customers', id: me.id, overrideAccess: true })
  } catch (error) {
    console.error('deleteAccount', errName(error))
    return { status: 'error', message: 'errGeneric' }
  }
  await clearCustomerSession()
  redirect(localePath(loc(fd), ''))
}
