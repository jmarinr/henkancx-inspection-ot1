import React, { useEffect, useMemo, useState } from 'react'
import Header from './Header.jsx'
import Login from './Login.jsx'
import MenuWizard from './MenuWizard.jsx'
import InfoBasica from './InfoBasica.jsx'
import Vehiculo from './Vehiculo.jsx'
import SistemaTierras from './SistemaTierras.jsx'
import InfraestructuraTorre from './InfraestructuraTorre.jsx'
import InventarioEquipos from './InventarioEquipos.jsx'
import MantenimientoSitio from './MantenimientoSitio.jsx'
import EvidenciaConsolidada from './EvidenciaConsolidada.jsx'
import PreventivoMG from './PreventivoMG.jsx'
import SignaturePad from './SignaturePad.jsx'
import InspectionComplete from './InspectionComplete.jsx'
import VoiceDock from './VoiceDock.jsx'

const VIEWS = {
  MENU: 'menu',
  INFO: 'infoBasica',
  VEHICULO: 'vehiculo',
  TIERRAS: 'sistemaTierras',
  TORRE: 'infraestructuraTorre',
  INVENTARIO: 'inventarioEquipos',
  PMI: 'mantenimientoSitio',
  FOTOS: 'fotos',
  PREVENTIVO_MG: 'preventivoMG',
  FIRMA: 'firma',
  COMPLETE: 'complete',
}

const emptyInspection = (id='TEMP') => ({
  id,
  startedAt: null,
  finishedAt: null,
  proveedor: '',
  ot: '',
  sitio: { nombre:'', idSitio:'', fechaProgramada:'', coords:null },
  vehiculo: {},
  formularios: {},
  __progress: 0,
})

export default function App() {
  const [tech, setTech] = useState(localStorage.getItem('tecnicoCode') || '')
  const [view, setView] = useState(VIEWS.MENU)
  const [inspection, setInspection] = useState(()=>{
    const raw = localStorage.getItem('activeInspection')
    return raw ? JSON.parse(raw) : emptyInspection(String(Date.now()))
  })

  // Persistencia
  useEffect(()=>{ localStorage.setItem('activeInspection', JSON.stringify(inspection)) },[inspection])

  const save = (updater) => setInspection(prev => (typeof updater === 'function' ? updater(prev) : updater))
  const setField = (path, value) => {
    // path style: 'sitio.nombre' or 'formularios.x.y'
    save(prev => {
      const next = structuredClone(prev)
      const parts = path.split('.')
      let ref = next
      while (parts.length > 1) {
        const k = parts.shift()
        ref[k] = ref[k] ?? {}
        ref = ref[k]
      }
      ref[parts[0]] = value
      return next
    })
  }

  const markStart = ()=> save(prev => prev.startedAt ? prev : ({ ...prev, startedAt: Date.now() }))

  const sectionStatus = useMemo(()=>{
    const st = {}
    const isDone = (x)=> !!x && (typeof x === 'object' ? Object.keys(x).length>0 : String(x).trim()!=='')
    st.infoBasica = isDone(inspection.sitio?.nombre) ? 'done' : (inspection.sitio?.nombre || inspection.sitio?.coords ? 'inprogress':'pending')
    st.vehiculo = isDone(inspection.vehiculo) ? 'inprogress' : 'pending'
    st.preventivoMG = inspection.formularios?.preventivoMG ? 'inprogress' : 'pending'
    st.sistemaTierras = inspection.formularios?.sistemaTierras ? 'inprogress' : 'pending'
    st.infraestructuraTorre = inspection.formularios?.infraestructuraTorre ? 'inprogress' : 'pending'
    st.inventarioEquipos = inspection.formularios?.inventarioEquipos?.items?.length ? 'inprogress' : 'pending'
    st.mantenimientoSitio = inspection.formularios?.mantenimientoSitio ? 'inprogress' : 'pending'
    st.fotos = inspection.formularios?.evidenciaConsolidada?.fotos?.length ? 'inprogress' : 'pending'
    st.firma = inspection.firma ? 'done' : 'pending'
    // progreso simple
    const total = 9
    const done = Object.values(st).filter(v=>v==='done' || v==='inprogress').length
    save(prev => ({ ...prev, __progress: Math.round((done/total)*100) }))
    return st
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[inspection])

  const openSection = (key) => {
    const map = {
      infoBasica: VIEWS.INFO,
      vehiculo: VIEWS.VEHICULO,
      preventivoMG: VIEWS.PREVENTIVO_MG,
      sistemaTierras: VIEWS.TIERRAS,
      infraestructuraTorre: VIEWS.TORRE,
      inventarioEquipos: VIEWS.INVENTARIO,
      mantenimientoSitio: VIEWS.PMI,
      fotos: VIEWS.FOTOS,
      firma: VIEWS.FIRMA,
    }
    setView(map[key] || VIEWS.MENU)
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  const backToMenu = ()=> setView(VIEWS.MENU)

  if (!tech) return <Login onLogin={()=> setTech(localStorage.getItem('tecnicoCode')||'')} />

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Header tecnico={tech} inspectionId={inspection.id} progress={inspection.__progress} onLogout={()=>{localStorage.removeItem('tecnicoCode'); setTech('')}} onHome={backToMenu} />
      {view === VIEWS.MENU && (
        <MenuWizard inspection={inspection} status={sectionStatus} onOpen={openSection} />
      )}

      {view === VIEWS.INFO && (
        <InfoBasica inspection={inspection} setField={setField} markStart={markStart} onBack={backToMenu} />
      )}
      {view === VIEWS.VEHICULO && (
        <Vehiculo inspection={inspection} setField={setField} onBack={backToMenu} />
      )}
      {view === VIEWS.PREVENTIVO_MG && (
        <PreventivoMG inspection={inspection} save={save} onBack={backToMenu} />
      )}
      {view === VIEWS.TIERRAS && (
        <SistemaTierras inspection={inspection} save={save} onBack={backToMenu} />
      )}
      {view === VIEWS.TORRE && (
        <InfraestructuraTorre inspection={inspection} save={save} onBack={backToMenu} />
      )}
      {view === VIEWS.INVENTARIO && (
        <InventarioEquipos inspection={inspection} save={save} onBack={backToMenu} />
      )}
      {view === VIEWS.PMI && (
        <MantenimientoSitio inspection={inspection} save={save} onBack={backToMenu} />
      )}
      {view === VIEWS.FOTOS && (
        <EvidenciaConsolidada inspection={inspection} save={save} onBack={backToMenu} />
      )}
      {view === VIEWS.FIRMA && (
        <SignaturePad inspection={inspection} save={save} onBack={backToMenu} onComplete={()=> setView(VIEWS.COMPLETE)} />
      )}
      {view === VIEWS.COMPLETE && (
        <InspectionComplete inspection={inspection} onBackToMenu={backToMenu} />
      )}

      <VoiceDock />
    </div>
  )
}
