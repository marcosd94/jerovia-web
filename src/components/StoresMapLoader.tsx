'use client'

import dynamic from 'next/dynamic'
import type { MapPoint } from './StoresMap'

const StoresMap = dynamic(() => import('./StoresMap'), {
  ssr: false,
  loading: () => <div className="stores-map" aria-hidden="true" />,
})

export function StoresMapLoader(props: { points: MapPoint[]; label: string; directionsLabel: string; views: { key: string; label: string }[] }) {
  return <StoresMap {...props} />
}
