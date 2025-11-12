import React, { useEffect, useState } from 'react'
import SectionLayout from './SectionLayout.jsx'
import FotosSeccion from './FotosSeccion.jsx'
import VoiceButton from './VoiceButton.jsx'

export default function InfraestructuraTorre({ inspection, save, onBack }) {
  const initial = inspection?.formularios?.infraestructuraTorre?.campos || {}
  const [local, setLocal] = useState({
    estadoEstructural: initial.estadoEstructural || '',
    anclajes: initial.anclajes || '',
    anticorrosivo: initial.anticorrosivo || '',
    observaciones: initial.observaciones || ''
  })
  const [photos, setPhotos] = useState(inspection?.formularios?.infraestructuraTorre?.fotos || [])

  useEffect(()=>{
    save(prev => ({
      ...prev,
      formularios: {
        ...prev.formularios,
        infraestructuraTorre: { campos: local, fotos: photos }
      }
    }))
  }, [local, photos, save])

  const Field = ({ label, name }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input className="input-field flex-1" value={local[name]||''} onChange={e=>setLocal(v=>({ ...v, [name]: e.target.value }))} />
        <VoiceButton onText={(t)=>setLocal(v=>({ ...v, [name]:(v[name]||'') + ' ' + t }))} />
      </div>
    </div>
  )

  return (
    <SectionLayout title="Infraestructura de torre (El Valle)" onBack={onBack} onNext={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Estado estructural" name="estadoEstructural" />
        <Field label="Anclajes" name="anclajes" />
        <Field label="Anticorrosivo" name="anticorrosivo" />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium">Observaciones</label>
        <textarea className="input-field" rows={4} value={local.observaciones||''} onChange={e=>setLocal(v=>({ ...v, observaciones: e.target.value }))} />
      </div>

      <FotosSeccion
        seccionKey="infraestructuraTorre"
        photos={photos}
        setPhotos={setPhotos}
        onOCRData={(d)=> setLocal(v=>({ ...v, ...d }))}
      />
    </SectionLayout>
  )
}
