import React, { useEffect, useState } from 'react'
import SectionLayout from './SectionLayout.jsx'
import LocationMap from './LocationMap.jsx'
import VoiceButton from './VoiceButton.jsx'

export default function InfoBasica({ inspection, setField, markStart, onBack }) {
  const sitio = inspection?.sitio || {}
  const [local, setLocal] = useState({
    nombre: sitio.nombre || '',
    idSitio: sitio.idSitio || '',
    fechaProgramada: sitio.fechaProgramada || '',
    coords: sitio.coords || null,
    proveedor: inspection?.proveedor || '',
    ot: inspection?.ot || '',
    ingeniero: inspection?.ingeniero || '',
  })

  useEffect(() => {
    markStart && markStart()
    // Coordenadas automáticas
    if (navigator.geolocation) {
      const watch = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords
          const coords = { latitude, longitude, accuracy, takenAt: Date.now() }
          setLocal(v => ({ ...v, coords }))
        },
        () => {}, { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      )
      return () => navigator.geolocation && navigator.geolocation.clearWatch(watch)
    }
  }, [markStart])

  // Guardado continuo
  useEffect(() => {
    setField('sitio.nombre', local.nombre)
    setField('sitio.idSitio', local.idSitio)
    setField('sitio.fechaProgramada', local.fechaProgramada)
    setField('sitio.coords', local.coords)
    setField('proveedor', local.proveedor)
    setField('ot', local.ot)
    setField('ingeniero', local.ingeniero)
  }, [local, setField])

  const Field = ({ label, value, onChange, placeholder='',
                   childrenRight=null }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input className="input-field flex-1" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
        {childrenRight}
      </div>
    </div>
  )

  return (
    <SectionLayout
      title="Información básica"
      onBack={onBack}
      onNext={onBack}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombre del sitio"
               value={local.nombre}
               onChange={v=>setLocal(s=>({ ...s, nombre: v }))}
               placeholder="Ej. Planta Santa Rosa"
               childrenRight={<VoiceButton onText={(t)=>setLocal(s=>({ ...s, nombre: (s.nombre||'') + ' ' + t }))} />}
        />
        <Field label="Número ID del sitio"
               value={local.idSitio}
               onChange={v=>setLocal(s=>({ ...s, idSitio: v }))}
               placeholder="Ej. SIT-00123"
               childrenRight={<VoiceButton onText={(t)=>setLocal(s=>({ ...s, idSitio: (s.idSitio||'') + t.replace(/\\s/g,'') }))} />}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium">Fecha programada</label>
          <input type="date" className="input-field" value={local.fechaProgramada || ''} onChange={e=>setLocal(s=>({ ...s, fechaProgramada: e.target.value }))} />
        </div>

        <Field label="# Orden de trabajo (OT)"
               value={local.ot}
               onChange={v=>setLocal(s=>({ ...s, ot: v }))}
               placeholder="Ej. OT-55678" />

        <Field label="Proveedor / Empresa"
               value={local.proveedor}
               onChange={v=>setLocal(s=>({ ...s, proveedor: v }))}
               placeholder="Nombre del proveedor" />

        <Field label="Ingeniero responsable"
               value={local.ingeniero}
               onChange={v=>setLocal(s=>({ ...s, ingeniero: v }))}
               placeholder="Nombre del ingeniero" />
      </div>

      <div className="card">
        <div className="mb-2 font-medium">Ubicación de la inspección</div>
        {local.coords ? (
          <>
            <LocationMap lat={local.coords.latitude} lng={local.coords.longitude} />
            <div className="text-xs text-gray-500 mt-2">
              GPS: {local.coords.latitude?.toFixed(6)}, {local.coords.longitude?.toFixed(6)} · {Math.round(local.coords.accuracy||0)} m · {new Date(local.coords.takenAt).toLocaleTimeString()}
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500">Obteniendo ubicación… (necesita HTTPS)</div>
        )}
      </div>
    </SectionLayout>
  )
}
