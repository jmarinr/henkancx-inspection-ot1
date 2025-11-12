import React, { useEffect, useState } from 'react'
import SectionLayout from './SectionLayout.jsx'
import FotosSeccion from './FotosSeccion.jsx'
import VoiceRecorder from './VoiceRecorder.jsx'

export default function MantenimientoSitio({ inspection, save, onBack }) {
  const initial = inspection?.formularios?.mantenimientoSitio || {}
  const [local, setLocal] = useState({
    limpieza: initial.limpieza || '',
    estadoCercas: initial.estadoCercas || '',
    observaciones: initial.observaciones || '',
  })
  const [photos, setPhotos] = useState(initial.fotos || [])

  useEffect(()=>{
    save(prev => ({
      ...prev,
      formularios: {
        ...prev.formularios,
        mantenimientoSitio: { ...local, fotos: photos }
      }
    }))
  }, [local, photos, save])

  return (
    <SectionLayout title="Mantenimiento general del sitio (PMI)" onBack={onBack} onNext={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Limpieza general</label>
          <input className="input-field" value={local.limpieza} onChange={e=>setLocal(v=>({ ...v, limpieza: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium">Estado de cercas</label>
          <input className="input-field" value={local.estadoCercas} onChange={e=>setLocal(v=>({ ...v, estadoCercas: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Observaciones</label>
        <textarea className="input-field" rows={4} value={local.observaciones||''} onChange={e=>setLocal(v=>({ ...v, observaciones: e.target.value }))} />
        <div className="mt-2">
          <VoiceRecorder onText={(t)=>setLocal(v=>({ ...v, observaciones: (v.observaciones||'') + ' ' + t }))} />
        </div>
      </div>

      <FotosSeccion
        seccionKey="mantenimientoSitio"
        photos={photos}
        setPhotos={setPhotos}
        onOCRData={(d)=> setLocal(v=>({ ...v, ...d }))}
      />
    </SectionLayout>
  )
}
