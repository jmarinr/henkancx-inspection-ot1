import React, { useRef } from 'react'
import ObservationsIA from './ObservationsIA.jsx'
import OCRConfirmModal from './OCRConfirmModal.jsx'
import Camera from './Camera.jsx'

export default function FotosSeccion({ seccionKey, photos=[], setPhotos, onOCRData }) {
  const inputRef = useRef(null)

  const addPhotoFile = async (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setPhotos([...(photos||[]), { dataUrl, title: '' }])
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = (e) => {
    const f = e.target.files?.[0]
    if (f) addPhotoFile(f)
  }

  const onAddFromCamera = (img) => {
    setPhotos([...(photos||[]), { dataUrl: img, title: '' }])
  }

  const updateTitle = (i, v) => {
    const arr = photos.slice()
    arr[i] = { ...arr[i], title: v }
    setPhotos(arr)
  }

  const remove = (i) => {
    const arr = photos.slice()
    arr.splice(i,1)
    setPhotos(arr)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="font-medium">Evidencia fotográfica</div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={()=> inputRef.current?.click()}>Subir + OCR</button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      <Camera
        photos={(photos||[]).map(p=> p.dataUrl || p)}
        onAddPhoto={onAddFromCamera}
        onRemovePhoto={remove}
      />

      {(photos||[]).length > 0 && (
        <div className="mt-4 space-y-4">
          {(photos||[]).map((p, i) => (
            <div key={i} className="rounded-lg border border-gray-700 p-3 bg-gray-900/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <img src={p.dataUrl || p} alt={`Foto ${i+1}`} className="w-full rounded-md border border-gray-700" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Título de la foto</label>
                  <input className="input-field" value={p.title||''} onChange={(e)=> updateTitle(i, e.target.value)} placeholder="Ej. Tablero del generador" />

                  <div className="space-y-2">
                    <ObservationsIA image={p.dataUrl||p} onExtract={(d)=> onOCRData && onOCRData(d)} />
                    <OCRConfirmModal image={p.dataUrl||p} onConfirm={(d)=> onOCRData && onOCRData(d)} />
                  </div>

                  <div className="pt-2">
                    <button className="btn btn-secondary" onClick={()=> remove(i)}>Eliminar foto</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
