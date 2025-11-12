import React from 'react'
import ProgressBar from './ProgressBar.jsx'

const Row = ({ label, status, onClick }) => {
  const chip =
    status === 'done' ? 'text-green-700 bg-green-50 border-green-200' :
    status === 'inprogress' ? 'text-blue-700 bg-blue-50 border-blue-200' :
    'text-gray-600 bg-gray-50 border-gray-200'

  const dot =
    status === 'done' ? '✅' :
    status === 'inprogress' ? '🟦' : '⚪'

  return (
    <button className="w-full text-left" onClick={onClick}>
      <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-800 transition">
        <div className="flex items-center gap-3">
          <span className="text-xl">{dot}</span>
          <div>
            <div className="font-medium">{label}</div>
            <div className={`inline-block text-xs mt-1 px-2 py-0.5 rounded-full border ${chip}`}>
              {status === 'done' ? 'Done' : status === 'inprogress' ? 'In progress' : 'Pending'}
            </div>
          </div>
        </div>
        <div className="text-xl text-gray-400">›</div>
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
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Menú de inspección</h2>
            <p className="text-sm text-muted">Inspección #{inspection?.id}</p>
          </div>
          <div className="min-w-[220px]">
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map(([label, key]) => (
          <Row key={key} label={label} status={status[key] ?? 'pending'} onClick={() => onOpen && onOpen(key)} />
        ))}
      </div>
    </div>
  )
}
