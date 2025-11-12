import React from 'react'
import { CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react'

const sections = [
  { key:'infoBasica', title:'Información básica' },
  { key:'vehiculo', title:'Datos del vehículo' },
  { key:'preventivoMG', title:'Mantenimiento preventivo MG y baterías' },
  { key:'sistemaTierras', title:'Medición de sistema de tierras (Ground – El Valle)' },
  { key:'infraestructuraTorre', title:'Infraestructura de torre (El Valle)' },
  { key:'inventarioEquipos', title:'Inventario de equipos' },
  { key:'mantenimientoSitio', title:'Mantenimiento general del sitio (PMI)' },
  { key:'fotos', title:'Evidencia fotográfica consolidada' },
  { key:'firma', title:'Firma y cierre' },
]

export default function MenuWizard({ onOpen, status }) {
  return (
    <div className="container px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Menú de inspección</h2>
      <div className="grid grid-cols-1 gap-3">
        {sections.map(s => {
          const st = status[s.key] || 'pending'
          const color = st==='done'?'border-green-500':
                        st==='inprogress'?'border-blue-500':
                        st==='error'?'border-red-500':'border-gray-300'
          return (
            <button key={s.key} onClick={()=>onOpen(s.key)} className={`card flex items-center justify-between ${color}`}>
              <div className="flex items-center gap-3">
                {st==='done' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> :
                 st==='error' ? <AlertTriangle className="w-5 h-5 text-red-600" /> :
                 <div className="w-5 h-5 rounded-full border-2" />}
                <div className="text-left">
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-xs text-gray-500">Estado: {st}</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
