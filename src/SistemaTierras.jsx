import React, { useEffect, useState } from 'react'
import SectionLayout from './SectionLayout.jsx'
import FotosSeccion from './FotosSeccion.jsx'
import VoiceButton from './VoiceButton.jsx'

export default function SistemaTierras({ inspection, save, onBack }) {
  const initial = inspection?.formularios?.sistemaTierras?.campos || {}
  const [local, setLocal] = useState({
    medida1: initial.medida1 || '',
    medida2: initial.medida2 || '',
    medida3: initial.medida3 || '',
    resistividadProm: initial.resistividadProm || '',
    observaciones: initial.observaciones || '',
  })
  const [photos, setPhotos] = useState(inspection?.formularios?.sistemaTierras?.fotos || [])

  useEffect(()=>{
    save(prev => ({
      ...prev,
      formularios: {
        ...prev.formularios,
        sistemaTierras: { campos: local, fotos: photos }
      }
    }))
  }, [local, photos, save])

  const Field = ({ label, name, type='text', placeholder='' }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input className="input-field flex-1" type={type} value={local[name]||''} onChange={e=>setLocal(v=>({ ...v, [name]: e.target.value }))} placeholder={placeholder} />
        <VoiceButton onText={(t)=>setLocal(v=>({ ...v, [name]:(v[name]||'') + ' ' + t }))} />
      </div>
    </div>
  )

  return (
    <SectionLayout title="Medición de sistema de tierras (Ground – El Valle)" onBack={onBack} onNext={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Medida 1 (Ω)" name="medida1" />
        <Field label="Medida 2 (Ω)" name="medida2" />
        <Field label="Medida 3 (Ω)" name="medida3" />
        <Field label="Resistividad promedio (Ω)" name="resistividadProm" />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Observaciones</label>
        <textarea className="input-field" rows={4} value={local.observaciones||''} onChange={e=>setLocal(v=>({ ...v, observaciones: e.target.value }))} />
      </div>

      <FotosSeccion
        seccionKey="sistemaTierras"
        photos={photos}
        setPhotos={setPhotos}
        onOCRData={(d)=> setLocal(v=>({ ...v, ...d }))}
      />
    </SectionLayout>
  )
}
