'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

export type CarouselLabels = { region: string; prev: string; next: string; pause: string; play: string; slide: string; goTo: string }

const fill = (text: string, vars: Record<string, string | number>) => Object.entries(vars).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), text)

/**
 * Carrusel accesible: se desliza con el dedo, tiene flechas y puntos, avanza solo (si se activó)
 * y se detiene al pasar el mouse, al enfocarlo, al tocarlo, con el botón de pausa o si la persona
 * pidió reducir el movimiento en su equipo.
 */
export function Carousel({ slides, autoplay, interval, labels }: { slides: ReactNode[]; autoplay: boolean; interval: number; labels: CarouselLabels }) {
  const track = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hold, setHold] = useState(false) // mouse encima, foco adentro o dedo apoyado
  const [visible, setVisible] = useState(true)
  const [reduced, setReduced] = useState(true) // hasta saberlo, no se mueve solo
  const count = slides.length

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // se pausa si el carrusel no está en pantalla o la pestaña está oculta
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const on = () => setVisible((v) => (document.hidden ? false : v))
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])

  // qué diapositiva está a la vista (también cuando se desliza con el dedo)
  useEffect(() => {
    const el = track.current
    if (!el) return
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setIndex(Math.round(el.scrollLeft / el.clientWidth)))
    }
    el.addEventListener('scroll', on, { passive: true })
    return () => {
      el.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  const goTo = useCallback(
    (i: number) => {
      const el = track.current
      if (!el) return
      const next = (i + count) % count
      el.scrollTo({ left: next * el.clientWidth, behavior: reduced ? 'auto' : 'smooth' })
      setIndex(next)
    },
    [count, reduced],
  )

  const playing = autoplay && !reduced && !userPaused
  useEffect(() => {
    if (!playing || hold || !visible || count < 2) return
    const id = window.setTimeout(() => goTo(index + 1), interval * 1000)
    return () => window.clearTimeout(id)
  }, [playing, hold, visible, index, interval, count, goTo])

  return (
    <section
      ref={root}
      className="carousel"
      aria-roledescription="carousel"
      aria-label={labels.region}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      onTouchStart={() => setHold(true)}
      onTouchEnd={() => setHold(false)}
    >
      <div
        ref={track}
        className="carousel-track"
        aria-live={playing && !hold ? 'off' : 'polite'}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') goTo(index + 1)
          if (e.key === 'ArrowLeft') goTo(index - 1)
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="carousel-slide" role="group" aria-roledescription="slide" aria-label={fill(labels.slide, { n: i + 1, total: count })} inert={i !== index}>
            {slide}
          </div>
        ))}
      </div>
      {count > 1 ? (
        <div className="wrap carousel-controls">
          <button type="button" className="carousel-btn" onClick={() => goTo(index - 1)} aria-label={labels.prev}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <div className="carousel-dots">
            {slides.map((_, i) => (
              <button key={i} type="button" className="carousel-dot" aria-label={fill(labels.goTo, { n: i + 1 })} aria-current={i === index ? 'true' : undefined} onClick={() => goTo(i)} />
            ))}
          </div>
          <button type="button" className="carousel-btn" onClick={() => goTo(index + 1)} aria-label={labels.next}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          {autoplay && !reduced ? (
            <button type="button" className="carousel-btn carousel-pause" onClick={() => setUserPaused((v) => !v)} aria-label={userPaused ? labels.play : labels.pause}>
              {userPaused ? (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" className="fill" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M8 5v14M16 5v14" /></svg>
              )}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
