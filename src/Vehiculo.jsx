import React, { useEffect, useState } from 'react'
import SectionLayout from './SectionLayout.jsx'
import VoiceButton from './VoiceButton.jsx'
import FotosSeccion from './FotosSeccion.jsx'

export default function Vehiculo({ inspection, setField, onBack }) {
  const base = inspection?.vehiculo || {}
  const [local, setLocal] = useState({
    marcaPlanta: base.marcaPlanta || '',
    modeloPlanta: base.modeloPlanta || '',
    marcaMotor: base.marcaMotor || '',
    modeloMotor: base.modeloMotor || '',
    seriePlanta: base.seriePlanta || '',
    serieMotor: base.serieMotor || '',
    capacidadKW: base.capacidadKW || '',
    capacidadHP: base.capacidadHP || '',
    capacidadAmp: base.capacidadAmp || '',
  })
  const [photos, setPhotos] = useState(inspection?.formularios?.vehiculo?.fotos || [])

  useEffect(() => {
    setField('vehiculo', local)
    setField('formularios.vehiculo.fotos', photos)
  }, [local, photos, setField])

  const Field = ({ label, name, placeholder='' }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input className="input-field flex-1" value={local[name]||''} onChange={e=>setLocal(v=>({ ...v, [name]: e.target.value }))} placeholder={placeholder} />
        <VoiceButton onText={(t)=>setLocal(v=>({ ...v, [name]:(v[name]||'') + ' ' + t }))} />
      </div>
    </div>
  )

  return (
    <SectionLayout title="Datos del vehículo" onBack={onBack} onNext={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Marca Planta" name="marcaPlanta" />
        <Field label="Modelo Planta" name="modeloPlanta" />
        <Field label="Marca Motor" name="marcaMotor" />
        <Field label="Modelo Motor" name="modeloMotor" />
        <Field label="N° Serie Planta" name="seriePlanta" />
        <Field label="N° Serie Motor" name="serieMotor" />
        <Field label="Capacidad (KW)" name="capacidadKW" />
        <Field label="Capacidad (HP)" name="capacidadHP" />
        <Field label="Capacidad (Amp)" name="capacidadAmp" />
      </div>

      <FotosSeccion
        seccionKey="vehiculo"
        photos={photos}
        setPhotos={setPhotos}
        onOCRData={(d)=> setLocal(v=>({ ...v, ...d }))}
      />
    </SectionLayout>
  )
}
