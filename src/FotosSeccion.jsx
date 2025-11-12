import React from 'react'
import Camera from './components/Camera'

const TITLES = {
  preventivoMG: ['Tablero completo generador','Controlador','Placa datos generador','Placa motor','Observaciones'],
  sistemaTierras: ['Puntos de medición','Electrodos','Equipo de medición','Plano/GPS'],
  infraestructuraTorre: ['Base de torre','Tramos medios','Cima/Antenas','Cercas/Portones'],
  inventarioEquipos: ['Equipo (placa)','Equipo (instalación)','Etiqueta'],
  mantenimientoSitio: ['Sala generador','Tableros eléctricos','Extintores','Cableado']
}

export default function FotosSeccion({ seccionKey, photos, setPhotos, onOCRData }) {
  const setTitle = (idx, title) => {
    const arr = photos.slice()
    arr[idx] = { ...(arr[idx] || {}), dataUrl: arr[idx]?.dataUrl || arr[idx], title }
    setPhotos(arr)
  }
  const addPhoto = (img) => setPhotos([...(photos||[]), { dataUrl: img }])
  const removePhoto = (i) => {
    const arr = photos.slice(); arr.splice(i,1); setPhotos(arr)
  }
  return (
    <div className="space-y-3">
      <Camera photos={(photos||[]).map(p=>p.dataUrl||p)} onAddPhoto={addPhoto} onRemovePhoto={removePhoto} onOCRData={onOCRData} />
      {(photos||[]).length>0 && (
        <div className="card">
          <h4 className="font-semibold mb-3">Títulos por foto (Sugerido: 3+ imágenes)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(photos||[]).map((p,idx)=>(
              <div key={idx} className="flex gap-2 items-center">
                <select className="input-field" value={p.title||''} onChange={e=>setTitle(idx, e.target.value)}>
                  <option value="">Selecciona un título</option>
                  {(TITLES[seccionKey]||[]).map(t=>(<option key={t} value={t}>{t}</option>))}
                  <option value="Otro">Otro…</option>
                </select>
                <input className="input-field" placeholder="Título personalizado" value={p.title==='Otro'?(p.custom||''): (p.custom||'')} onChange={e=>{
                  const arr = photos.slice(); arr[idx] = { ...(arr[idx]||{}), custom: e.target.value }; setPhotos(arr)
                }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
