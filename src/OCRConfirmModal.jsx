
import React from 'react'

export default function OCRConfirmModal({ image, onConfirm }) {
  const apply = () => {
    // Simula otra capa de OCR con campos muy comunes en placas
    const payload = {
      numero_placa: 'PL-' + Math.floor(Math.random()*99999).toString().padStart(5,'0'),
      fabricante: ['Yanmar','Cummins','Kohler','Himoinsa'][Math.floor(Math.random()*4)]
    }
    onConfirm && onConfirm(payload)
  }
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">OCR listo.</span>
      <button className="btn btn-secondary btn-sm" onClick={apply}>Aplicar OCR</button>
    </div>
  )
}
