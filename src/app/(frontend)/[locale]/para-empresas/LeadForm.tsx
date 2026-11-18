'use client'
import { useActionState } from 'react'
import { t } from '@/lib/messages'
import type { Locale } from '@brand/types'
import { submitLead, type LeadState } from './actions'

const initial: LeadState = { status: 'idle' }

export function LeadForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(submitLead, initial)
  const v = state.values ?? {}

  if (state.status === 'ok') {
    return (
      <div className="notice" role="status">
        <h2>{t(locale, 'formOkTitle')}</h2>
        <p>{t(locale, 'formOk')}</p>
      </div>
    )
  }

  const err = (field: string) => (state.errors?.[field] ? <p className="error" id={`${field}-error`}>{t(locale, state.errors[field] === 'email' ? 'formErrorEmail' : 'formErrorRequired')}</p> : null)
  const invalid = (field: string) => (state.errors?.[field] ? { 'aria-invalid': true, 'aria-describedby': `${field}-error` } : {})

  return (
    <form className="form" action={action} noValidate>
      <input type="hidden" name="locale" value={locale} />
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.status === 'error' && state.message ? (
        <div className="notice error" role="alert">
          <p style={{ margin: 0 }}>{t(locale, state.message === 'limit' ? 'formErrorLimit' : 'formErrorGeneric')}</p>
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="company">{t(locale, 'formCompany')}</label>
        <input id="company" name="company" defaultValue={v.company} autoComplete="organization" required {...invalid('company')} />
        {err('company')}
      </div>
      <div className="field">
        <label htmlFor="name">{t(locale, 'formName')}</label>
        <input id="name" name="name" defaultValue={v.name} autoComplete="name" required {...invalid('name')} />
        {err('name')}
      </div>
      <div className="field">
        <label htmlFor="email">{t(locale, 'formEmail')}</label>
        <input id="email" name="email" type="email" defaultValue={v.email} autoComplete="email" required {...invalid('email')} />
        {err('email')}
      </div>
      <div className="field">
        <label htmlFor="phone">{t(locale, 'formPhone')}</label>
        <input id="phone" name="phone" type="tel" defaultValue={v.phone} autoComplete="tel" required {...invalid('phone')} />
        {err('phone')}
      </div>
      <div className="field">
        <label htmlFor="city">{t(locale, 'formCity')}</label>
        <input id="city" name="city" defaultValue={v.city} autoComplete="address-level2" />
      </div>
      <div className="field">
        <label htmlFor="kind">{t(locale, 'formKind')}</label>
        <select id="kind" name="kind" defaultValue={v.kind || 'distribuidor'}>
          <option value="distribuidor">{t(locale, 'formKindDistributor')}</option>
          <option value="supermercado">{t(locale, 'formKindSupermarket')}</option>
          <option value="otro">{t(locale, 'formKindOther')}</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">{t(locale, 'formMessage')}</label>
        <textarea id="message" name="message" defaultValue={v.message} />
      </div>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? t(locale, 'formSending') : t(locale, 'formSend')}
      </button>
      <p className="small">{t(locale, 'privacyNote')}</p>
    </form>
  )
}
