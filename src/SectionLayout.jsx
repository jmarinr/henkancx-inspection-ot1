import React from 'react'

export default function SectionLayout({
  title,
  children,
  onBack,
  onSave,
  onNext,
  saveLabel='Guardar',
  nextLabel='Guardar y volver'
}) {
  return (
    <div className="container px-4 py-6">
      <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-surface/80 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button className="btn-ghost" onClick={onBack} title="Volver al menú">←</button>
            )}
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {children}
      </div>

      <div className="h-20" />
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/85 backdrop-blur">
        <div className="max-w-6xl mx-auto p-3 flex flex-col md:flex-row gap-2 md:gap-3 md:items-center md:justify-between">
          <div className="text-xs text-muted">Los cambios se guardan automáticamente.</div>
          <div className="flex gap-2 justify-end">
            {onSave && <button className="btn-secondary" onClick={onSave}>{saveLabel}</button>}
            {onNext && <button className="btn-primary" onClick={onNext}>{nextLabel}</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
