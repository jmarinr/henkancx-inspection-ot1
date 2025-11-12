// src/FormHost.jsx
import React, { useState } from 'react'

// 🧱 Tus componentes v1
import BasicInfoForm from './BasicInfoForm.jsx'
import EquipmentForm from './EquipmentForm.jsx'
import MeasurementsForm from './MeasurementsForm.jsx'      // si lo usas en PMI
import TestsForm from './TestsForm.jsx'                    // opcional, ejemplo
import LocationMap from './LocationMap.jsx'
import SignaturePad from './SignaturePad.jsx'
import VoiceInput from './VoiceInput.jsx'
import AICopilot from './AICopilot.jsx'
import Camera from './Camera.jsx'
import OCRConfirmModal from './OCRConfirmModal.jsx'
import ObservationsIA from './ObservationsIA.jsx'

// 🔖 títulos por clave
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

// 🔧 botón/acciones del pie
function FooterActions({ onBack, onSave }) {
  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <button className="btn btn-secondary" onClick={onBack}>← Volver al menú</button>
      <button className="btn btn-primary" onClick={onSave}>Guardar y marcar como completado</button>
    </div>
  )
}

export default function FormHost({ formKey, inspection, onBack, onComplete }) {
  if (!formKey) return null
  const title = TITLES[formKey] || formKey

  // Estado local temporal de cada formulario (se inicializa con lo que tengas guardado)
  const [local, setLocal] = useState(() => {
    const base = inspection?.formularios?.[formKey]
    // normaliza algunos casos
    if (!base) return {}
    return JSON.parse(JSON.stringify(base))
  })

  const saveAndComplete = () => {
    onComplete(formKey, local) // el padre guarda + marca done + recalc progreso
  }

  // Helpers de asignación
  const setField = (name, value) => {
    setLocal(prev => ({ ...prev, [name]: value }))
  }
  const merge = (obj) => setLocal(prev => ({ ...prev, ...obj }))

  // Render por sección
  let content = null

  switch (formKey) {
    // 1) Información básica: usa tu BasicInfoForm y la ubicación automática
    case 'infoBasica':
      content = (
        <div className="space-y-6">
          <BasicInfoForm
            data={local.campos || {}}
            setData={(d)=> setLocal(prev => ({ ...prev, campos: d }))}
          />

          {/* Ubicación (auto) */}
          <div className="card space-y-3">
            <h3 className="font-semibold">Ubicación de la inspección</h3>
            <LocationMap
              value={local.geo || inspection?.geo || null}
              onChange={(g)=> merge({ geo: g })}
              auto // que capture sin botón
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              * La ubicación se toma automáticamente para reducir errores.
            </p>
          </div>

          {/* Observaciones con IA + dictado */}
          <div className="card space-y-3">
            <h3 className="font-semibold">Observaciones</h3>
            <ObservationsIA
              value={local.observaciones || ''}
              onChange={(v)=> setField('observaciones', v)}
              onAnalyze={(ai)=> setField('observaciones', ai)} // simula IA
            />
            <VoiceInput
              onTranscript={(txt)=> setField('observaciones', (local.observaciones||'') + (local.observaciones ? ' ' : '') + txt)}
              label="Grabar Audio (30s máx)"
            />
          </div>

          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
      break

    // 2) Datos del vehículo (si los manejas en MeasurementsForm u otro)
    case 'vehiculo':
      content = (
        <div className="space-y-6">
          <MeasurementsForm
            data={local.campos || {}}
            setData={(d)=> setLocal(prev => ({ ...prev, campos: d }))}
          />

          {/* OCR/IA de fotos de placas/seriales */}
          <div className="card space-y-3">
            <h3 className="font-semibold">Fotos con OCR (simulado)</h3>
            <Camera
              photos={local.fotos || []}
              setPhotos={(arr)=> setField('fotos', arr)}
              onAnalyze={(result)=> merge({ campos: { ...(local.campos||{}), ...result } })} // simula IA
            />
            <OCRConfirmModal />
          </div>

          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
      break

    // 3) Preventivo MG y baterías
    case 'preventivoMG':
      content = (
        <div className="space-y-6">
          <TestsForm
            data={local.campos || {}}
            setData={(d)=> setLocal(prev => ({ ...prev, campos: d }))}
            title="Checklist Preventivo MG y baterías"
          />
          <Camera
            photos={local.fotos || []}
            setPhotos={(arr)=> setField('fotos', arr)}
            onAnalyze={(result)=> merge({ campos: { ...(local.campos||{}), ...result } })}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
      break

    // 4) Sistema de tierras
    case 'sistemaTierras':
      content = (
        <div className="space-y-6">
          <MeasurementsForm
            data={local.campos || {}}
            setData={(d)=> setLocal(prev => ({ ...prev, campos: d }))}
            title="Medición del sistema de tierras"
          />
          <Camera
            photos={local.fotos || []}
            setPhotos={(arr)=> setField('fotos', arr)}
            onAnalyze={(result)=> merge({ campos: { ...(local.campos||{}), ...result } })}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
      break

    // 5) Infraestructura de torre
    case 'infraestructuraTorre':
      content = (
        <div className="space-y-6">
          <MeasurementsForm
            data={local.campos || {}}
            setData={(d)=> setLocal(prev => ({ ...prev, campos: d }))}
            title="Infraestructura de torre (El Valle)"
          />
          <Camera
            photos={local.fotos || []}
            setPhotos={(arr)=> setField('fotos', arr)}
            onAnalyze={(result)=> merge({ campos: { ...(local.campos||{}), ...result } })}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
      break

    // 6) Inventario de equipos
    case 'inventarioEquipos':
      content = (
        <div className="space-y-6">
          <EquipmentForm
            items={local.lista || []}
            setItems={(lista)=> setField('lista', lista)}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
      break

    // 7) PMI general
    case 'mantenimientoSitio':
      content = (
        <div className="space-y-6">
          <MeasurementsForm
            data={local.campos || {}}
            setData={(d)=> setLocal(prev => ({ ...prev, campos: d }))}
            title="Mantenimiento general del sitio (PMI)"
          />
          <Camera
            photos={local.fotos || []}
            setPhotos={(arr)=> setField('fotos', arr)}
            onAnalyze={(result)=> merge({ campos: { ...(local.campos||{}), ...result } })}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
      break

    // 8) Evidencia consolidada
    case 'fotos':
      content = (
        <div className="space-y-6">
          <div className="card space-y-3">
            <h3 className="font-semibold">Evidencia fotográfica con OCR (simulado)</h3>
            <Camera
              photos={local.items || []}
              setPhotos={(arr)=> setField('items', arr)}
              onAnalyze={(result)=> merge({ extraidos: { ...(local.extraidos||{}), ...result } })}
            />
            <OCRConfirmModal />
          </div>
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
      break

    // 9) Firma y cierre
    case 'firma':
      content = (
        <div className="space-y-6">
          <SignaturePad
            value={local.trazo || null}
            onChange={(sig)=> setField('trazo', sig)}
            nombreCliente={local.nombreCliente || ''}
            onNombreChange={(v)=> setField('nombreCliente', v)}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
      break

    default:
      content = (
        <div className="card">
          <p>No hay un formulario asignado a <code>{formKey}</code>. (Placeholder)</p>
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Cabecera del formulario */}
      <div className="flex items-center justify-between">
        <button className="btn btn-secondary" onClick={onBack}>← Volver al menú</button>
        <div className="text-sm text-gray-500 dark:text-gray-400">Inspección #{inspection?.id}</div>
      </div>

      {/* Copiloto IA opcional arriba a la derecha */}
      <div className="flex justify-end">
        <AICopilot />
      </div>

      {/* Contenido */}
      {content}
    </div>
  )
}
