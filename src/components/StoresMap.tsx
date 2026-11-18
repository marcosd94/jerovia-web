'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type MapPoint = { id: string | number; name: string; region: string; lat: number; lng: number; address?: string; phone?: string }
type Views = { key: string; label: string }[]

/** Mapa con OpenStreetMap. Se arma solo en el navegador; los textos se insertan como texto (nunca como HTML). */
export default function StoresMap({ points, label, directionsLabel, views }: { points: MapPoint[]; label: string; directionsLabel: string; views: Views }) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const available = views.filter((v) => v.key === 'all' || points.some((p) => p.region === v.key))
  const [view, setView] = useState(available.find((v) => v.key !== 'all')?.key ?? 'all')

  const fit = (key: string) => {
    const map = mapRef.current
    if (!map) return
    const list = key === 'all' ? points : points.filter((p) => p.region === key)
    if (list.length === 0) return
    if (list.length === 1) map.setView([list[0].lat, list[0].lng], 15)
    else map.fitBounds(L.latLngBounds(list.map((p) => [p.lat, p.lng] as [number, number])), { padding: [30, 30], maxZoom: 14 })
  }

  useEffect(() => {
    if (!ref.current || points.length === 0) return
    const map = L.map(ref.current, { scrollWheelZoom: false })
    mapRef.current = map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    }).addTo(map)

    const icon = L.divIcon({ className: 'map-pin', html: '<span></span>', iconSize: [28, 34], iconAnchor: [14, 34], popupAnchor: [0, -30] })
    for (const p of points) {
      const box = document.createElement('div')
      const name = document.createElement('strong')
      name.textContent = p.name
      box.append(name)
      for (const line of [p.address, p.phone]) {
        if (!line) continue
        const el = document.createElement('div')
        el.textContent = line
        box.append(el)
      }
      const link = document.createElement('a')
      link.href = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.textContent = directionsLabel
      box.append(link)
      L.marker([p.lat, p.lng], { icon, title: p.name, alt: p.name }).bindPopup(box).addTo(map)
    }
    fit(view)
    // el zoom con la rueda se activa al hacer clic, para no atrapar el scroll de la página
    map.once('click', () => map.scrollWheelZoom.enable())
    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, directionsLabel])

  return (
    <>
      {available.length > 2 ? (
        <div className="map-views">
          {available.map((v) => (
            <button
              key={v.key}
              type="button"
              aria-pressed={view === v.key}
              onClick={() => {
                setView(v.key)
                fit(v.key)
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      ) : null}
      <div ref={ref} className="stores-map" role="region" aria-label={label} />
    </>
  )
}
