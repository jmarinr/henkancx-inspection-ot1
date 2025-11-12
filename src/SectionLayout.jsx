
import React from 'react'

export default function SectionLayout({ title, children, onBack, onNext, nextLabel = 'Guardar y volver al menú' }) {
  return (
    <div className="container px-4 py-6 space-y-4">
      <div className="card">
        {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
        {children}
        <div className="mt-4 flex justify-end gap-2">
          {onBack && <button className="btn btn-secondary" onClick={onBack}>Volver al menú</button>}
          {onNext && <button className="btn btn-primary" onClick={onNext}>{nextLabel}</button>}
        </div>
      </div>
    </div>
  )
}
