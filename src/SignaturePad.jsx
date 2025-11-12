import React from 'react'
export default function SignaturePad({ firma, setFirma, nombreCliente, setNombreCliente }){
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-3">Firma del Cliente</h3>
      <input className="input-field mb-2" placeholder="Nombre del cliente" value={nombreCliente||''} onChange={e=>setNombreCliente(e.target.value)} />
      <p className="text-sm text-gray-500">* Integrar canvas de firma (react-signature-canvas) como en v1.0</p>
    </div>
  )
}
