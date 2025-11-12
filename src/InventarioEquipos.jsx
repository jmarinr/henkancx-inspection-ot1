import React, { useState, useEffect } from 'react'
import schema from './schemas/inventario_equipos.json'
import FotosSeccion from './FotosSeccion'

export default function InventarioEquipos({ inspection, save }) {
  const [items, setItems] = useState(inspection.formularios.inventarioEquipos.items || [])
  const [photos, setPhotos] = useState(inspection.formularios.inventarioEquipos.fotos || [])

  useEffect(() => {
    save(prev => ({
      ...prev,
      formularios: { ...prev.formularios, inventarioEquipos: { items, fotos: photos } }
    }))
  }, [items, photos, save])

  const add = () => setItems([...items, { equipo:'', marca:'', modelo:'', serie:'', ubicacion:'', estado:'' }])
  const setItem = (i, name, value) => {
    const arr = items.slice(); arr[i] = { ...arr[i], [name]: value }; setItems(arr)
  }
  const remove = (i) => { const arr = items.slice(); arr.splice(i,1); setItems(arr) }

  return (
    <div className="container px-4 py-6 space-y-4">
      <div className="card">
        <h3 className="text-xl font-bold mb-4">{schema.title}</h3>
        <button onClick={add} className="btn btn-primary mb-3">+ Agregar equipo</button>
        <div className="space-y-3">
          {items.map((it, idx)=>(
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 border rounded-lg p-3">
              {schema.fields.map(f=>(
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1">{f.label}</label>
                  {f.type==='select' ? (
                    <select className="input-field" value={it[f.name]||''} onChange={e=>setItem(idx, f.name, e.target.value)}>
                      <option value="">Seleccionar</option>
                      {f.options.map(o=>(<option key={o} value={o}>{o}</option>))}
                    </select>
                  ) : (
                    <input className="input-field" value={it[f.name]||''} onChange={e=>setItem(idx, f.name, e.target.value)} />
                  )}
                </div>
              ))}
              <div className="md:col-span-3 flex justify-end">
                <button onClick={()=>remove(idx)} className="btn btn-secondary">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FotosSeccion seccionKey="inventarioEquipos" photos={photos} setPhotos={setPhotos} onOCRData={()=>{}} />
    </div>
  )
}
