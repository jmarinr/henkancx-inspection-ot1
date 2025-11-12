import React from 'react'
import VoiceInput from './components/VoiceInput'

export default function Vehiculo({ inspection, setField }) {
  const v = inspection.vehiculo || {}
  const onChange = (e)=> setField(`vehiculo.${e.target.name}`, e.target.value)
  return (
    <div className="container px-4 py-6 space-y-4">
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Datos del vehículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <VoiceInput label="Placa" name="placa" value={v.placa||''} onChange={onChange} />
          <VoiceInput label="VIN (17)" name="vin" value={v.vin||''} onChange={onChange} />
          <VoiceInput label="Marca" name="marca" value={v.marca||''} onChange={onChange} />
          <VoiceInput label="Modelo" name="modelo" value={v.modelo||''} onChange={onChange} />
          <VoiceInput type="number" label="Año" name="anio" value={v.anio||''} onChange={onChange} />
          <VoiceInput type="number" label="Kilometraje" name="kilometraje" value={v.kilometraje||''} onChange={onChange} />
        </div>
        <p className="text-sm text-gray-500 mt-2">Puedes usar la cámara en secciones para extraer datos de placas con OCR.</p>
      </div>
    </div>
  )
}
