
import React, { Suspense } from 'react'
const ObservationsIA = React.lazy(() => import('./ObservationsIA.jsx'))
const OCRConfirmModal = React.lazy(() => import('./OCRConfirmModal.jsx'))
import Camera from './Camera.jsx'

export default function FotosSeccion({ seccionKey, photos, setPhotos, onOCRData }) {
  const addPhoto = (imgDataUrl, title='') => {
    const item = { dataUrl: imgDataUrl, title: title || 'Foto sin título' }
    setPhotos([...(photos||[]), item])
  }
  const removePhoto = (i) => {
    const arr = (photos||[]).slice(); arr.splice(i,1); setPhotos(arr)
  }
  const updateTitle = (i, v) => {
    const arr = (photos||[]).slice(); arr[i] = { ...(arr[i]||{}), title: v }; setPhotos(arr)
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h4 className="font-semibold mb-2">Fotos de la sección</h4>
        <Camera
          photos={(photos||[]).map(p => p.dataUrl || p)}
          onAddPhoto={(img)=>addPhoto(img)}
          onRemovePhoto={removePhoto}
        />
        <div className="mt-3 space-y-3">
          {(photos||[]).map((p, idx)=>(
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 border rounded-lg p-3">
              <div className="md:col-span-1">
                <img src={p.dataUrl || p} alt={`foto-${idx}`} className="w-full h-40 object-contain rounded-md border" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <input className="input-field" value={p.title || ''} onChange={e=>updateTitle(idx, e.target.value)} placeholder="Ej. Foto tablero completo generador" />
                </div>
                <Suspense fallback={<div className="text-sm text-gray-500">Analizando IA…</div>}>
                  <ObservationsIA image={p.dataUrl || p} onExtract={(data)=> onOCRData && onOCRData(data)} />
                  <OCRConfirmModal image={p.dataUrl || p} onConfirm={(data)=> onOCRData && onOCRData(data)} />
                </Suspense>
                <div className="flex justify-end">
                  <button className="btn btn-secondary" onClick={()=>removePhoto(idx)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Sugerencia: incluye al menos 3 fotos por sección (no son obligatorias).</p>
      </div>
    </div>
  )
}
