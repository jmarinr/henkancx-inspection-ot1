import React, { useEffect, useState } from 'react'
import SectionLayout from './SectionLayout.jsx'
import FotosSeccion from './FotosSeccion.jsx'
import VoiceRecorder from './VoiceRecorder.jsx'
import VoiceButton from './VoiceButton.jsx'

export default function PreventivoMG({ inspection, save, onBack }) {
  const initial = inspection?.formularios?.preventivoMG || {}
  const [local, setLocal] = useState({
    hodometro: initial.hodometro || '',
    nivelAceite: initial.nivelAceite || '',
    nivelRefrigerante: initial.nivelRefrigerante || '',
    bateriaVoltaje: initial.bateriaVoltaje || '',
    observaciones: initial.observaciones || ''
  })
  const [photos, setPhotos] = useState(initial.fotos || [])

  useEffect(()=>{
    save(prev => ({
      ...prev,
      formularios: {
        ...prev.formularios,
        preventivoMG: { ...local, fotos: photos }
      }
    }))
  }, [local, photos, save])

  const Field = ({ label, name, placeholder='' }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input className="input" value={local[name]||''} onChange={e=>setLocal(v=>({ ...v, [name]: e.target.value }))} placeholder={placeholder} />
        <VoiceButton onText={(t)=>setLocal(v=>({ ...v, [name]:(v[name]||'') + ' ' + t }))} />
      </div>
    </div>
  )

  return (
    <SectionLayout title="Mantenimiento preventivo MG y baterías" onBack={onBack} onNext={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Hodómetro" name="hodometro" placeholder="Lectura actual" />
        <Field label="Nivel de aceite" name="nivelAceite" />
        <Field label="Nivel de refrigerante" name="nivelRefrigerante" />
        <Field label="Voltaje de baterías" name="bateriaVoltaje" />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Observaciones</label>
        <textarea className="input" rows={4} value={local.observaciones||''} onChange={e=>setLocal(v=>({ ...v, observaciones: e.target.value }))} />
        <div className="mt-2">
          <VoiceRecorder onText={(t)=>setLocal(v=>({ ...v, observaciones: (v.observaciones||'') + ' ' + t }))} />
        </div>
      </div>

      <FotosSeccion
        seccionKey="preventivoMG"
        photos={photos}
        setPhotos={setPhotos}
        onOCRData={(d)=> setLocal(v=>({ ...v, ...d }))}
      />
    </SectionLayout>
  )
}
