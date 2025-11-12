import React from 'react'
export default function ObservationsIA({ observaciones, setObservaciones, iaResult, setIaResult, allFormData }){
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-3">Observaciones del servicio</h3>
      <textarea className="input-field min-h-32" value={observaciones||''} onChange={e=>setObservaciones(e.target.value)} />
      <p className="text-sm text-gray-500 mt-2">* Análisis IA se integra como en v1.0</p>
    </div>
  )
}
