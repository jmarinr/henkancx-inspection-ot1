import React from 'react'

// Mapea clave → título amigable
const TITLES = {
  infoBasica: 'Información básica',
  vehiculo: 'Datos del vehículo',
  preventivoMG: 'Mantenimiento preventivo MG y baterías',
  sistemaTierras: 'Medición de sistema de tierras (Ground – El Valle)',
  infraestructuraTorre: 'Infraestructura de torre (El Valle)',
  inventarioEquipos: 'Inventario de equipos',
  mantenimientoSitio: 'Mantenimiento general del sitio (PMI)',
  fotos: 'Evidencia fotográfica consolidada',
  firma: 'Firma y cierre',
}

export default function FormHost({ formKey, inspection, onBack, onComplete }) {
  if (!formKey) return null
  const title = TITLES[formKey] || formKey

  // Aquí podrías renderizar tus formularios reales:
  // switch (formKey) {
  //   case 'infoBasica': return <BasicInfoForm ... />
  //   case 'inventarioEquipos': return <EquipmentForm ... />
  //   ...
  // }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <button className="btn btn-secondary" onClick={onBack}>← Volver al menú</button>
        <div className="text-sm text-gray-500 dark:text-gray-400">Inspección #{inspection?.id}</div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          (Vista genérica) Completa los datos de <strong>{title}</strong>. Cuando termines, guarda para marcar esta
          sección como <em>completada</em> y volver al menú.
        </p>

        {/* Espacio de trabajo temporal / placeholder */}
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-gray-500 dark:text-gray-400">
          Aquí irá el formulario específico de <strong>{title}</strong>.
          <br/>Puedes reemplazar este contenedor por tu componente real cuando lo tengas.
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button className="btn btn-secondary" onClick={onBack}>Cancelar</button>
          <button
            className="btn btn-primary"
            onClick={() => onComplete(formKey, { updatedAt: new Date().toISOString() })}
          >
            Guardar y marcar como completado
          </button>
        </div>
      </div>
    </div>
  )
}
