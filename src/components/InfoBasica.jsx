import React, { useEffect } from 'react'

export default function InfoBasica({ inspection, setField, markStart }) {
  useEffect(()=>{
    // fecha ejecutada al iniciar
    if (!inspection.timestamps?.inicio) {
      markStart()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    let watchId
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        pos => {
          const { latitude, longitude, accuracy } = pos.coords
          setField('sitio.coords', { latitude, longitude, accuracy, takenAt: Date.now() })
        },
        err => { console.warn('GPS error', err) },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
      )
    }
    return ()=> { if (navigator.geolocation && watchId) navigator.geolocation.clearWatch(watchId) }
  }, [setField])

  const i = inspection
  const c = i.sitio.coords

  return (
    <div className="container px-4 py-6 space-y-4">
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Información del sitio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del Sitio</label>
            <input className="input-field" value={i.sitio.nombre||''} onChange={e=>setField('sitio.nombre', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Número ID del Sitio</label>
            <input className="input-field" value={i.sitio.idSitio||''} onChange={e=>setField('sitio.idSitio', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Programada</label>
            <input type="date" className="input-field" value={i.sitio.fechaProgramada||''} onChange={e=>setField('sitio.fechaProgramada', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha y Hora Ejecutada (auto)</label>
            <input className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed" value={new Date(i.timestamps.inicio).toLocaleString()} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ingeniero responsable</label>
            <input className="input-field" value={i.sitio.ingeniero||''} onChange={e=>setField('sitio.ingeniero', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Proveedor o Empresa</label>
            <input className="input-field" value={i.proveedor||''} onChange={e=>setField('proveedor', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1"># Orden de Trabajo (OT)</label>
            <input className="input-field" value={i.ot||''} onChange={e=>setField('ot', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coordenadas tomadas en sitio (auto)</label>
            <input className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed" value={c?`${c.latitude.toFixed(6)}, ${c.longitude.toFixed(6)} (±${Math.round(c.accuracy)}m)`:'Capturando…'} disabled />
          </div>
        </div>
      </div>
    </div>
  )
}
