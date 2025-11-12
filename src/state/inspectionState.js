import { useState } from 'react'

export function useInspectionState() {
  const [inspection, setInspection] = useState(() => {
    const existing = localStorage.getItem('inspection')
    return existing ? JSON.parse(existing) : {
      id: 'INS-' + Date.now(),
      timestamps: {},
      tecnico: { code: localStorage.getItem('tecnicoCode') || '' },
      sitio: { coords: null, nombre: '', idSitio: '', fechaProgramada: '', ingeniero: '' },
      proveedor: '',
      ot: '',                // ← OT explícito
      vehiculo: {},
      formularios: {
        preventivoMG: { campos: {}, fotos: [] },
        sistemaTierras: { campos: {}, fotos: [] },
        infraestructuraTorre: { campos: {}, fotos: [] },
        inventarioEquipos: { items: [], fotos: [] },
        mantenimientoSitio: { campos: {}, fotos: [] },
        evidenciaConsolidada: { fotos: [] }   // ← NUEVO
      },
      firma: { imagenDataUrl: null, nombreCliente: '' }
    }
  })

  const save = (next) => {
    const val = typeof next === 'function' ? next(inspection) : next
    setInspection(val)
    localStorage.setItem('inspection', JSON.stringify(val))
  }

  const setField = (path, value) => {
    const parts = path.split('.')
    save(prev => {
      const copy = structuredClone(prev)
      let ref = copy
      for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]]
      ref[parts[parts.length - 1]] = value
      return copy
    })
  }

  const markStart = () => {
    save(prev => ({ ...prev, timestamps: { ...prev.timestamps, inicio: Date.now() }, sitio: { ...prev.sitio } }))
  }

  const markEnd = () => {
    save(prev => ({ ...prev, timestamps: { ...prev.timestamps, fin: Date.now() } }))
  }

  return { inspection, save, setField, markStart, markEnd }
}
