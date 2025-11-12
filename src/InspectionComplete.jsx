import React from 'react'
import { CheckCircle2, FileDown, ArrowLeft } from 'lucide-react'
import { downloadPDF } from './pdf'

/**
 * Pantalla de cierre de inspección.
 * - Muestra un resumen corto.
 * - Permite descargar el PDF final.
 *
 * Props:
 *  - inspection: objeto de inspección completo
 *  - onBack: función para volver al menú o paso anterior (opcional)
 *  - onFinish: callback opcional después de generar el PDF
 */
export default function InspectionComplete({ inspection, onBack, onFinish }) {
  const sitio = inspection?.sitio || {}
  const vehiculo = inspection?.vehiculo || {}

  const handleDownload = () => {
    const ok = downloadPDF(inspection)
    if (ok && typeof onFinish === 'function') onFinish()
  }

  return (
    <div className="container px-4 py-8">
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-600 shrink-0" />
          <div>
            <h2 className="text-2xl font-bold">Inspección lista para cerrar</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Revisa el resumen y descarga el PDF para adjuntarlo a tu entrega.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-3">
            <h3 className="font-semibold mb-2">Información del sitio</h3>
            <div className="text-sm">
              <div><span className="font-medium">Nombre:</span> {sitio.nombre || '-'}</div>
              <div><span className="font-medium">ID Sitio:</span> {sitio.idSitio || '-'}</div>
              <div><span className="font-medium">Fecha programada:</span> {sitio.fechaProgramada || '-'}</div>
              <div>
                <span className="font-medium">Fecha/hora ejecutada:</span>{' '}
                {inspection?.timestamps?.inicio ? new Date(inspection.timestamps.inicio).toLocaleString() : '-'}
              </div>
              <div>
                <span className="font-medium">Coordenadas:</span>{' '}
                {sitio?.coords
                  ? `${sitio.coords.latitude?.toFixed(6)}, ${sitio.coords.longitude?.toFixed(6)} (±${Math.round(
                      sitio.coords.accuracy || 0
                    )}m)`
                  : '-'}
              </div>
              <div><span className="font-medium">OT:</span> {inspection?.ot || '-'}</div>
              <div><span className="font-medium">Proveedor:</span> {inspection?.proveedor || '-'}</div>
              <div><span className="font-medium">Técnico (código):</span> {inspection?.tecnico?.code || '-'}</div>
            </div>
          </div>

          <div className="border rounded-lg p-3">
            <h3 className="font-semibold mb-2">Datos del vehículo</h3>
            <div className="text-sm">
              <div><span className="font-medium">Placa:</span> {vehiculo.placa || '-'}</div>
              <div><span className="font-medium">VIN:</span> {vehiculo.vin || '-'}</div>
              <div><span className="font-medium">Marca:</span> {vehiculo.marca || '-'}</div>
              <div><span className="font-medium">Modelo:</span> {vehiculo.modelo || '-'}</div>
              <div><span className="font-medium">Año:</span> {vehiculo.anio || '-'}</div>
              <div><span className="font-medium">Kilometraje:</span> {vehiculo.kilometraje || '-'}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            * Recuerda que las fotos de cada sección se incluyen con su título en el PDF.
          </div>
          <div className="flex gap-2">
            {onBack && (
              <button className="btn btn-secondary flex items-center gap-2" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
            )}
            <button className="btn btn-primary flex items-center gap-2" onClick={handleDownload}>
              <FileDown className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
