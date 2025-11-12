import React from 'react'

export default function SectionLayout({ title, children, onBack, onSave, onNext, saveLabel='Guardar', nextLabel='Guardar y volver' }) {
  return (
    <div className="container px-4 py-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="space-y-4">
        {children}
      </div>

      <div className="h-20" />
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-800 bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto p-3 flex flex-col md:flex-row gap-2 md:gap-3 md:items-center md:justify-between">
          <div className="text-xs text-gray-500">Los cambios se guardan automáticamente.</div>
          <div className="flex gap-2 justify-end">
            {onBack && <button className="btn btn-secondary" onClick={onBack}>Volver al menú</button>}
            {onSave && <button className="btn btn-secondary" onClick={onSave}>{saveLabel}</button>}
            {onNext && <button className="btn btn-primary" onClick={onNext}>{nextLabel}</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
