'use client'
import Link from 'next/link'
import { useActionState } from 'react'
import type { Locale } from '@brand/types'
import { ta, type AccountKey } from '@/lib/messages-account'
import {
  addAddress,
  changePassword,
  deleteAccount,
  forgotPassword,
  loginAccount,
  registerAccount,
  resetPassword,
  updateProfile,
  type AcctState,
} from './actions'

const initial: AcctState = { status: 'idle' }
const base = (locale: Locale, path: string) => `/${locale}/cuenta${path}`

function Notice({ state, locale }: { state: AcctState; locale: Locale }) {
  if (state.status === 'idle' || !state.message) return null
  const bad = state.status === 'error'
  return (
    <div className={bad ? 'notice error' : 'notice'} role={bad ? 'alert' : 'status'}>
      <p style={{ margin: 0 }}>{ta(locale, state.message)}</p>
    </div>
  )
}

type FieldProps = {
  id: string
  label: string
  state: AcctState
  locale: Locale
  type?: string
  autoComplete?: string
  required?: boolean
  hint?: string
  textarea?: boolean
}
function Field({ id, label, state, locale, type = 'text', autoComplete, required, hint, textarea }: FieldProps) {
  const err = state.errors?.[id]
  const sensitive = type === 'password'
  const common = {
    id,
    name: id,
    autoComplete,
    required,
    defaultValue: sensitive ? undefined : state.values?.[id],
    'aria-invalid': err ? true : undefined,
    'aria-describedby': err ? `${id}-error` : hint ? `${id}-hint` : undefined,
  }
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {textarea ? <textarea {...common} style={{ minHeight: '4.5rem' }} /> : <input {...common} type={type} />}
      {hint && !err ? (
        <p className="small" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {err ? (
        <p className="error" id={`${id}-error`}>
          {ta(locale, err)}
        </p>
      ) : null}
    </div>
  )
}

const Trap = () => (
  <div className="hp" aria-hidden="true">
    <label>
      Website
      <input type="text" name="website" tabIndex={-1} autoComplete="off" />
    </label>
  </div>
)

function Submit({ pending, locale, label }: { pending: boolean; locale: Locale; label: AccountKey }) {
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? ta(locale, 'saving') : ta(locale, label)}
    </button>
  )
}

export function LoginForm({ locale, next }: { locale: Locale; next?: 'checkout' }) {
  const [state, action, pending] = useActionState(loginAccount, initial)
  return (
    <form className="form" action={action} noValidate>
      <input type="hidden" name="locale" value={locale} />
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Notice state={state} locale={locale} />
      <Field id="email" label={ta(locale, 'email')} type="email" autoComplete="email" required state={state} locale={locale} />
      <Field id="password" label={ta(locale, 'password')} type="password" autoComplete="current-password" required state={state} locale={locale} />
      <Submit pending={pending} locale={locale} label="login" />
      <p className="small">
        <Link href={base(locale, '/olvide')}>{ta(locale, 'forgot')}</Link>
      </p>
      <p className="small">
        {ta(locale, 'noAccount')} <Link href={base(locale, next ? '/registro?next=checkout' : '/registro')}>{ta(locale, 'register')}</Link>
      </p>
    </form>
  )
}

export function RegisterForm({ locale, next }: { locale: Locale; next?: 'checkout' }) {
  const [state, action, pending] = useActionState(registerAccount, initial)
  if (state.status === 'ok') {
    return (
      <div className="notice" role="status">
        <p style={{ margin: 0 }}>{ta(locale, state.message ?? 'verifyNeeded')}</p>
      </div>
    )
  }
  return (
    <form className="form" action={action} noValidate>
      <input type="hidden" name="locale" value={locale} />
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Trap />
      <Notice state={state} locale={locale} />
      <Field id="name" label={ta(locale, 'name')} autoComplete="name" required state={state} locale={locale} />
      <Field id="email" label={ta(locale, 'email')} type="email" autoComplete="email" required state={state} locale={locale} />
      <Field id="phone" label={ta(locale, 'phone')} type="tel" autoComplete="tel" required state={state} locale={locale} />
      <Field id="password" label={ta(locale, 'password')} type="password" autoComplete="new-password" required hint={ta(locale, 'passwordHint')} state={state} locale={locale} />
      <div className="field">
        <label>
          <input type="checkbox" name="privacy" style={{ width: 'auto', marginRight: '0.5rem' }} /> {ta(locale, 'privacy')}
        </label>
        {state.errors?.privacy ? <p className="error">{ta(locale, state.errors.privacy)}</p> : null}
      </div>
      <div className="field">
        <label>
          <input type="checkbox" name="marketing" style={{ width: 'auto', marginRight: '0.5rem' }} /> {ta(locale, 'marketing')}
        </label>
      </div>
      <Submit pending={pending} locale={locale} label="register" />
      <p className="small">
        {ta(locale, 'hasAccount')} <Link href={base(locale, next ? '/ingresar?next=checkout' : '/ingresar')}>{ta(locale, 'login')}</Link>
      </p>
    </form>
  )
}

export function ForgotForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(forgotPassword, initial)
  if (state.status === 'ok') return <Notice state={state} locale={locale} />
  return (
    <form className="form" action={action} noValidate>
      <Notice state={state} locale={locale} />
      <Field id="email" label={ta(locale, 'email')} type="email" autoComplete="email" required state={state} locale={locale} />
      <Submit pending={pending} locale={locale} label="sendLink" />
    </form>
  )
}

export function ResetForm({ locale, token }: { locale: Locale; token: string }) {
  const [state, action, pending] = useActionState(resetPassword, initial)
  if (state.status === 'ok') {
    return (
      <div className="notice" role="status">
        <p style={{ margin: 0 }}>{ta(locale, 'resetDone')}</p>
        <p style={{ margin: '0.6rem 0 0' }}>
          <Link href={base(locale, '/ingresar')}>{ta(locale, 'login')}</Link>
        </p>
      </div>
    )
  }
  return (
    <form className="form" action={action} noValidate>
      <input type="hidden" name="token" value={token} />
      <Notice state={state} locale={locale} />
      <Field id="password" label={ta(locale, 'newPassword')} type="password" autoComplete="new-password" required hint={ta(locale, 'passwordHint')} state={state} locale={locale} />
      <Submit pending={pending} locale={locale} label="save" />
    </form>
  )
}

type ProfileDefaults = { name: string; phone: string; documentType: string; documentNumber: string; businessName: string; preferredLocale: string; marketing: boolean }

export function ProfileForm({ locale, d }: { locale: Locale; d: ProfileDefaults }) {
  const [state, action, pending] = useActionState(updateProfile, initial)
  const values = { name: d.name, phone: d.phone, documentNumber: d.documentNumber, businessName: d.businessName }
  const s: AcctState = { ...state, values: state.status === 'idle' ? values : { ...values, ...state.values } }
  return (
    <form className="form" action={action} noValidate>
      <Notice state={state} locale={locale} />
      <Field id="name" label={ta(locale, 'name')} autoComplete="name" required state={s} locale={locale} />
      <Field id="phone" label={ta(locale, 'phone')} type="tel" autoComplete="tel" required state={s} locale={locale} />
      <div className="field">
        <label htmlFor="preferredLocale">{ta(locale, 'language')}</label>
        <select id="preferredLocale" name="preferredLocale" defaultValue={d.preferredLocale}>
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="pt">Português</option>
        </select>
      </div>
      <h3 style={{ margin: '0.5rem 0 0' }}>{ta(locale, 'billing')}</h3>
      <div className="field">
        <label htmlFor="documentType">{ta(locale, 'docType')}</label>
        <select id="documentType" name="documentType" defaultValue={d.documentType}>
          <option value="ci">{ta(locale, 'docCi')}</option>
          <option value="ruc">{ta(locale, 'docRuc')}</option>
          <option value="other">{ta(locale, 'docOther')}</option>
        </select>
      </div>
      <Field id="documentNumber" label={ta(locale, 'docNumber')} state={s} locale={locale} />
      <Field id="businessName" label={ta(locale, 'businessName')} state={s} locale={locale} />
      <div className="field">
        <label>
          <input type="checkbox" name="marketing" defaultChecked={d.marketing} style={{ width: 'auto', marginRight: '0.5rem' }} /> {ta(locale, 'marketing')}
        </label>
      </div>
      <Submit pending={pending} locale={locale} label="save" />
    </form>
  )
}

export function AddressForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(addAddress, initial)
  return (
    <form className="form" action={action} noValidate key={state.status === 'ok' ? 'saved' : 'edit'}>
      <Notice state={state} locale={locale} />
      <Field id="label" label={ta(locale, 'addrLabel')} required state={state} locale={locale} />
      <Field id="address" label={ta(locale, 'addrAddress')} textarea required autoComplete="street-address" state={state} locale={locale} />
      <Field id="reference" label={ta(locale, 'addrRef')} state={state} locale={locale} />
      <Field id="city" label={ta(locale, 'addrCity')} autoComplete="address-level2" state={state} locale={locale} />
      <div className="field">
        <label>
          <input type="checkbox" name="isDefault" style={{ width: 'auto', marginRight: '0.5rem' }} /> {ta(locale, 'addrDefault')}
        </label>
      </div>
      <Submit pending={pending} locale={locale} label="addAddress" />
    </form>
  )
}

export function PasswordForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(changePassword, initial)
  return (
    <form className="form" action={action} noValidate key={state.status === 'ok' ? 'done' : 'edit'}>
      <Notice state={state} locale={locale} />
      <Field id="currentPassword" label={ta(locale, 'currentPassword')} type="password" autoComplete="current-password" required state={state} locale={locale} />
      <Field id="newPassword" label={ta(locale, 'newPassword')} type="password" autoComplete="new-password" required hint={ta(locale, 'passwordHint')} state={state} locale={locale} />
      <Submit pending={pending} locale={locale} label="changePassword" />
    </form>
  )
}

export function DeleteForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(deleteAccount, initial)
  return (
    <form className="form" action={action} noValidate>
      <input type="hidden" name="locale" value={locale} />
      <p style={{ margin: 0 }}>{ta(locale, 'deleteWarn')}</p>
      <Notice state={state} locale={locale} />
      <Field id="password" label={ta(locale, 'password')} type="password" autoComplete="current-password" required state={state} locale={locale} />
      <Submit pending={pending} locale={locale} label="deleteConfirm" />
    </form>
  )
}
