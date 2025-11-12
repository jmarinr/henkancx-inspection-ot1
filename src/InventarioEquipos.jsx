import React, { useEffect, useState } from 'react'
import SectionLayout from './SectionLayout.jsx'
import VoiceButton from './VoiceButton.jsx'

export default function InventarioEquipos({ inspection, save, onBack }) {
  const initial = inspection?.formularios?.inventarioEquipos?.items || []
  const [items, setItems] = useState(initial.length ? initial : [{ tipo:'', marca:'', modelo:'', serie:'' }])

  useEffect(()=>{
    save(prev => ({
      ...prev,
      formularios: {
        ...prev.formularios,
        inventarioEquipos: { items }
      }
    }))
  }, [items, save])

  const update = (i, key, val) => {
    const next = items.slice()
    next[i] = { ...next[i], [key]: val }
    setItems(next)
  }

  const addRow = () => setItems(prev => [...prev, { tipo:'', marca:'', modelo:'', serie:'' }])
  const delRow = (i) => setItems(prev => prev.filter((_,idx)=>idx!==i))

  return (
    <SectionLayout title="Inventario de equipos" onBack={onBack} onNext={onBack}>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="card">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {['tipo','marca','modelo','serie'].map((k)=>(
                <div className="space-y-1" key={k}>
                  <label className="block text-sm font-medium capitalize">{k}</label>
                  <div className="flex gap-2">
                    <input className="input-field flex-1" value={it[k]||''} onChange={e=>update(i,k,e.target.value)} />
                    <VoiceButton onText={(t)=>update(i,k,(it[k]||'')+' '+t)} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button className="btn btn-secondary mt-2" onClick={()=>delRow(i)}>Eliminar</button>
            </div>
          </div>
        ))}
        <button className="btn btn-primary" onClick={addRow}>Añadir equipo</button>
      </div>
    </SectionLayout>
  )
}
