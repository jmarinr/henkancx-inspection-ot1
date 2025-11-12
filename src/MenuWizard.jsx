import React from 'react'
import ProgressBar from './ProgressBar.jsx'

const Row = ({ label, status, onClick }) => {
  const color =
    status === 'done' ? 'bg-green-600/10 text-green-600 border-green-600/30' :
    status === 'inprogress' ? 'bg-blue-600/10 text-blue-600 border-blue-600/30' :
    'bg-gray-500/10 text-gray-500 border-gray-500/30'

  const dot =
    status === 'done' ? '✅' :
    status === 'inprogress' ? '🟦' : '⚪'

  return (
    <button
      className="w-full text-left"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-gray-900/40 hover:bg-gray-900/60 border border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-xl">{dot}</span>
          <div>
            <div className="font-medium">{label}</div>
            <div className={`inline-block text-xs mt-1 px-2 py-0.5 rounded-full border ${color}`}>
              {status === 'done' ? 'Done' : status === 'inprogress' ? 'In progress' : 'Pending'}
            </div>
          </div>
        </div>
        <div className="text-xl">›</div>
      </div>
    </button>
  )
}

export default function MenuWizard({ inspection, status = {}, onOpen }) {
  const progress = (inspection?.__progress ?? 0)

  const rows = [
    ['Información básica', 'infoBasica'],
    ['Datos del vehículo', 'vehiculo'],
    ['Mantenimiento preventivo MG y baterías', 'preventivoMG'],
    ['Medición de sistema de tierras (Ground – El Valle)', 'sistemaTierras'],
    ['Infraestructura de torre (El Valle)', 'infraestructuraTorre'],
    ['Inventario de equipos', 'inventarioEquipos'],
    ['Mantenimiento general del sitio (PMI)', 'mantenimientoSitio'],
    ['Evidencia fotográfica consolidada', 'fotos'],
    ['Firma y cierre', 'firma'],
  ]

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Menú de inspección</h2>
            <p className="text-sm text-gray-500">Inspección #{inspection?.id}</p>
          </div>
          <div className="min-w-[200px]">
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map(([label, key]) => (
          <Row
            key={key}
            label={label}
            status={status[key] ?? 'pending'}
            onClick={() => onOpen && onOpen(key)}
          />
        ))}
      </div>
    </div>
  )
}
