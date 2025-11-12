import React, { useEffect, useMemo, useRef, useState } from 'react'
import VoiceInput from './VoiceInput.jsx'               // ✅ único import de VoiceInput
import ObservationsIA from './ObservationsIA.jsx'       // usado en secciones que lo requieran
import OCRConfirmModal from './OCRConfirmModal.jsx'     // modal para “simular” extracción OCR

/**
 * Contenedor estándar para cualquier formulario/paso del wizard.
 * Props:
 * - title: string      → Título visible de la sección
 * - sectionKey: string → Clave de la sección (ej. "infoBasica")
 * - inspection: obj    → Objeto de inspección activo (para mostrar #, etc.)
 * - onBack: fn()       → Navegar de regreso al menú
 * - onSave: fn(payload, {complete:boolean}) → Guardar datos de la sección
 * - children: JSX      → El formulario concreto de la sección
 * - showObservationsIA: boolean → Mostrar caja de observaciones con IA
 */
export default function FormHost({
  title = 'Sección',
  sectionKey = '',
  inspection = null,
  onBack,
  onSave,
  children,
  showObservationsIA = false,
}) {
  // estado local genérico para datos del formulario hijo (si el hijo no maneja su propio estado)
  const [localData, setLocalData] = useState({})
  // Estado para modal de confirmación de OCR simulado
  const [ocrDraft, setOcrDraft] = useState(null)
  // control botón guardar
  const [saving, setSaving] = useState(false)

  // id de inspección para encabezado
  const inspectionId = useMemo(() => {
    if (inspection?.id) return inspection.id
    try {
      const raw = localStorage.getItem('activeInspection')
      if (raw) return JSON.parse(raw)?.id ?? ''
    } catch {}
    return ''
  }, [inspection])

  // referencia al campo actualmente enfocado (para dictado)
  const focusedElRef = useRef(null)
  useEffect(() => {
    const handler = (e) => { focusedElRef.current = e.target }
    window.addEventListener('focusin', handler)
    return () => window.removeEventListener('focusin', handler)
  }, [])

  const handleDictationText = (text) => {
    // Inserta texto dictado en el elemento enfocado si es input/textarea
    const el = focusedElRef.current
    if (!el) return
    const tag = (el.tagName || '').toLowerCase()
    if (tag === 'input' || tag === 'textarea') {
      const start = el.selectionStart ?? el.value?.length ?? 0
      const end = el.selectionEnd ?? start
      const value = (el.value ?? '')
      el.value = value.slice(0, start) + text + value.slice(end)
      // dispara evento de cambio para React
      const evt = new Event('input', { bubbles: true })
      el.dispatchEvent(evt)
      el.focus()
      // mueve cursor al final del texto insertado
      const newPos = start + text.length
      try { el.setSelectionRange(newPos, newPos) } catch {}
    }
  }

  const onClickSave = async (complete) => {
    try {
      setSaving(true)
      const payload = { ...localData }
      await Promise.resolve(onSave && onSave(payload, { complete: !!complete }))
      if (complete && onBack) onBack()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container px-4 py-6">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="btn btn-secondary shadow-sm hover:shadow transition"
        >
          ← Volver al menú
        </button>

        <div className="text-sm text-muted">
          {inspectionId ? <>Inspección #{inspectionId}</> : null}
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted mt-1">
            Completa los datos de <strong>{title}</strong>. Puedes dictar texto con el botón flotante
            y simular extracción por OCR desde los campos de foto.
          </p>
        </div>

        {/* Contenido del formulario específico */}
        <div className="space-y-4">
          {children ? (
            children
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-muted">
              Aquí irá el formulario específico de <strong>{title}</strong>. Puedes reemplazar este
              contenedor por tu componente real cuando lo tengas.
            </div>
          )}

          {/* Observaciones con IA (opcional) */}
          {showObservationsIA && (
            <ObservationsIA
              onOCR={(data) => setOcrDraft(data)}
              onChange={(txt) => setLocalData((prev) => ({ ...prev, observaciones: txt }))}
              value={localData.observaciones || ''}
            />
          )}
        </div>

        {/* acciones */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            className="btn btn-secondary"
            onClick={() => onBack && onBack()}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onClickSave(true)}
            disabled={saving}
          >
            {saving ? 'Guardando…' : 'Guardar y marcar como completado'}
          </button>
        </div>
      </div>

      {/* FAB de Dictado: inyecta texto en el campo activo */}
      <VoiceInput onText={handleDictationText} />

      {/* Modal de confirmación de OCR (simulado) */}
      {ocrDraft && (
        <OCRConfirmModal
          draft={ocrDraft}
          onCancel={() => setOcrDraft(null)}
          onConfirm={(accepted) => {
            setOcrDraft(null)
            if (accepted && typeof accepted === 'object') {
              setLocalData((prev) => ({ ...prev, ...accepted }))
            }
          }}
        />
      )}
    </div>
  )
}
