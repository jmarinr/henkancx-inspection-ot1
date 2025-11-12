import React, { useState, useEffect } from 'react'
import SectionLayout from './SectionLayout'
import GenericForm from './GenericForm'
import schema from './schemas/mantenimiento_sitio.json'
import FotosSeccion from './FotosSeccion'

export default function MantenimientoSitio({ inspection, save, onBack }) {
  const [local, setLocal] = useState(inspection.formularios.mantenimientoSitio.campos || {})
  const [photos, setPhotos] = useState(inspection.formularios.mantenimientoSitio.fotos || [])

  useEffect(() => {
    save(prev => ({ ...prev, formularios: { ...prev.formularios, mantenimientoSitio: { campos: local, fotos: photos } } }))
  }, [local, photos, save])

  const onChange = (e) => setLocal({ ...local, [e.target.name]: e.target.value })

  return (
    <SectionLayout title={schema.title} onBack={onBack} onNext={onBack}>
      <GenericForm schema={schema} data={local} onChange={onChange} />
      <FotosSeccion seccionKey="mantenimientoSitio" photos={photos} setPhotos={setPhotos} onOCRData={(d)=> setLocal({ ...local, ...d })} />
    </SectionLayout>
  )
}
