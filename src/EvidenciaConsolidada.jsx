import React, { useEffect, useState } from 'react'
import SectionLayout from './SectionLayout'
import Camera from './components/Camera'

export default function EvidenciaConsolidada({ inspection, save, onBack }) {
  const [photos, setPhotos] = useState(inspection.formularios?.evidenciaConsolidada?.fotos || [])

  useEffect(() => {
    save(prev => ({
      ...prev,
      formularios: { ...prev.formularios, evidenciaConsolidada: { fotos: photos } }
    }))
  }, [photos, save])

  return (
    <SectionLayout title="Evidencia fotográfica consolidada" onBack={onBack} onNext={onBack}>
      <Camera photos={photos.map(p => p.dataUrl || p)} onAddPhoto={(img)=>setPhotos([...(photos||[]), { dataUrl: img }])}
              onRemovePhoto={(i)=>{ const arr = photos.slice(); arr.splice(i,1); setPhotos(arr) }} />
      <p className="text-sm text-gray-500 mt-2">
        Sube al menos 3 fotos representativas del sitio. Puedes usar también las secciones de fotos específicas.
      </p>
    </SectionLayout>
  )
}
