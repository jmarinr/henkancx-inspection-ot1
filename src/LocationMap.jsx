
import React, { useEffect, useRef } from 'react'

export default function LocationMap({ lat, lng, zoom=15, height=240 }) {
  const ref = useRef(null)

  useEffect(()=>{
    const hasGoogle = typeof window !== 'undefined' && window.google && window.google.maps
    if (hasGoogle) {
      const map = new window.google.maps.Map(ref.current, {
        center: { lat, lng },
        zoom,
        disableDefaultUI: false,
      })
      new window.google.maps.Marker({ position: { lat, lng }, map })
      return
    }
    // Fallback a Leaflet sin API Key
    const setupLeaflet = async () => {
      if (!window.L) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
        await new Promise(r=> link.onload = r)
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        document.body.appendChild(script)
        await new Promise(r=> script.onload = r)
      }
      const map = window.L.map(ref.current).setView([lat, lng], zoom)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map)
      window.L.marker([lat, lng]).addTo(map)
    }
    setupLeaflet()
  }, [lat, lng, zoom])

  return <div ref={ref} style={{height}} className="w-full rounded-md overflow-hidden border" />
}
