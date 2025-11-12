import React, { useState, useEffect } from 'react'
import GenericForm from '../GenericForm'
import schema from '../schemas/infraestructura_torre.json'
import FotosSeccion from '../FotosSeccion'

export default function InfraestructuraTorre({ inspection, save, setField }) {
  const [local, setLocal] = useState(inspection.formularios.infraestructuraTorre.campos || {})
  const [photos, setPhotos] = useState(inspection.formularios.infraestructuraTorre.fotos || [])

  useEffect(()=>{
    save(prev=> ({ ...prev, formularios: { ...prev.formularios, infraestructuraTorre: { campos: local, fotos: photos } } }))
  }, [local, photos, save])

  const onChange = (e)=> setLocal({ ...local, [e.target.name]: e.target.value })

  return (
    <div className="container px-4 py-6 space-y-4">
      <GenericForm title={schema.title} schema={schema} data={local} onChange={onChange} />
      <FotosSeccion seccionKey="infraestructuraTorre" photos={photos} setPhotos={setPhotos} onOCRData={(d)=> setLocal({ ...local, ...d })} />
    </div>
  )
}
