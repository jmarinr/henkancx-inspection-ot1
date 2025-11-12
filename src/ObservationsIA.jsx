
import React, { useEffect, useState } from 'react'

/**
 * Simula un análisis por IA de la imagen y devuelve pares clave-valor útiles
 * para auto-rellenar campos (hodómetro, serial, modelo, etc.).
 */
export default function ObservationsIA({ image, onExtract }) {
  const [busy, setBusy] = useState(false)
  const [summary, setSummary] = useState('')

  const analyze = async () => {
    setBusy(true)
    // Simulación: esperar 1200ms y devolver algunos campos posibles
    await new Promise(r => setTimeout(r, 1200))
    const mocked = {
      odometro: Math.floor(Math.random()*9000 + 1000).toString(),
      numero_serie: 'SN-' + Math.floor(Math.random()*900000).toString(),
      modelo: 'M-' + Math.floor(Math.random()*100).toString(),
      voltaje: (['110V','220V','440V'])[Math.floor(Math.random()*3)]
    }
    setSummary(`IA: hodómetro ${mocked.odometro}, serie ${mocked.numero_serie}, modelo ${mocked.modelo}, ${mocked.voltaje}`)
    onExtract && onExtract(mocked)
    setBusy(false)
  }

  useEffect(()=>{
    // auto-analizar al montar (se puede desactivar si prefieres botón)
    analyze()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image])

  return (
    <div className="rounded-md bg-purple-50 dark:bg-purple-900/20 p-3 border border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-2">
        <span>✨ Extracción Automática de Datos con IA</span>
        <button className="btn btn-primary btn-sm" disabled={busy} onClick={analyze}>
          {busy ? 'Analizando…' : 'Re-Analizar'}
        </button>
      </div>
      {summary && <p className="text-sm mt-2">{summary}</p>}
    </div>
  )
}
