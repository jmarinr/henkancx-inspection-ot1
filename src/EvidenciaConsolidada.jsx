import React, { useEffect, useState } from 'react'
import SectionLayout from './SectionLayout.jsx'
import Camera from './Camera.jsx'

export default function EvidenciaConsolidada({ inspection, save, onBack }) {
  const [photos, setPhotos] = useState(inspection?.formularios?.evidenciaConsolidada?.fotos || [])

  useEffect(()=>{
    save(prev => ({
      ...prev,
      formularios: {
        ...prev.formularios,
        evidenciaConsolidada: { fotos: photos }
      }
    }))
  }, [photos, save])

  return (
    <SectionLayout title="Evidencia fotográfica consolidada" onBack={onBack} onNext={onBack}>
      <Camera
        photos={(photos||[]).map(p => p.dataUrl || p)}
        onAddPhoto={(img)=> setPhotos([...(photos||[]), { dataUrl: img }])}
        onRemovePhoto={(i)=>{ const arr = photos.slice(); arr.splice(i,1); setPhotos(arr) }}
      />
      <p className="text-sm text-gray-500 mt-2">
        Sube al menos 3 fotos representativas del sitio. Para análisis con IA/OCR usa las secciones específicas.
      </p>
    </SectionLayout>
  )
}
