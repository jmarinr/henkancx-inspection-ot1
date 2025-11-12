import React, { useRef } from 'react'

export default function Camera({ photos = [], onAddPhoto, onRemovePhoto, onOCRData }) {
  const fileInputRef = useRef(null)
  const onSelect = async (e)=>{
    const f = e.target.files?.[0]; if (!f) return
    const reader = new FileReader()
    reader.onload = ev => {
      onAddPhoto(ev.target.result)
      // simulación: no ejecutamos OCR aquí; en tu proyecto real Tesseract extraerá datos
      if (onOCRData) onOCRData({})
    }
    reader.readAsDataURL(f)
    e.target.value=''
  }
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold">Evidencia Fotográfica</h4>
        <button className="btn btn-secondary" onClick={()=>fileInputRef.current?.click()}>Subir foto</button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onSelect}/>
      </div>
      {photos.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {photos.map((p,i)=>(
            <div key={i} className="relative">
              <img src={p} className="w-full h-32 object-cover rounded-lg border" />
              <button className="absolute top-2 right-2 btn btn-secondary" onClick={()=>onRemovePhoto(i)}>X</button>
            </div>
          ))}
        </div>
      ) : (<p className="text-sm text-gray-500">Aún no hay fotos.</p>)}
    </div>
  )
}
