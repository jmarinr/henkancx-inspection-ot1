
import React, { useMemo, useState } from 'react'
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
import SignaturePad from './SignaturePad.jsx'
import InspectionComplete from './InspectionComplete.jsx'
import VoiceDock from './VoiceDock.jsx'
import { useInspectionState } from './state/inspectionState.js'
import { downloadPDF } from './pdf.js'

export default function App() {
  const [route, setRoute] = useState('menu')
  const [logged, setLogged] = useState(!!localStorage.getItem('tecnicoCode'))
  const { inspection, save, setField, markStart, markEnd } = useInspectionState()

  const status = useMemo(() => {
    const s = {
      infoBasica: 'inprogress',
      vehiculo: 'pending',
      preventivoMG: 'pending',
      sistemaTierras: 'pending',
      infraestructuraTorre: 'pending',
      inventarioEquipos: 'pending',
      mantenimientoSitio: 'pending',
      fotos: 'pending',
      firma: 'pending'
    }
    if (inspection?.sitio?.nombre && inspection?.sitio?.idSitio && inspection?.sitio?.coords) s.infoBasica = 'done'
    if (inspection?.vehiculo && Object.keys(inspection.vehiculo).length > 0) s.vehiculo = 'inprogress'
    if (inspection?.firma?.imagenDataUrl && inspection?.firma?.nombreCliente) s.firma = 'done'
    return s
  }, [inspection])

  const open = (key) => setRoute(key)
  const logout = () => { localStorage.removeItem('tecnicoCode'); setLogged(false); setRoute('menu') }
  const finalizeAndDownload = () => { markEnd(); downloadPDF(inspection); setRoute('complete') }

  if (!logged) return <Login onLogin={() => setLogged(true)} />

  return (
    <div className="min-h-screen">
      <Header onLogout={logout} />
      {route === 'menu' && <MenuWizard onOpen={open} status={status} />}

      {route === 'infoBasica' && (
        <InfoBasica inspection={inspection} setField={setField} markStart={markStart} onBack={()=>setRoute('menu')} />
      )}
      {route === 'vehiculo' && (
        <Vehiculo inspection={inspection} setField={setField} />
      )}
      {route === 'sistemaTierras' && (
        <SistemaTierras inspection={inspection} save={save} onBack={()=>setRoute('menu')} />
      )}
      {route === 'infraestructuraTorre' && (
        <InfraestructuraTorre inspection={inspection} save={save} onBack={()=>setRoute('menu')} />
      )}
      {route === 'inventarioEquipos' && (
        <InventarioEquipos inspection={inspection} save={save} />
      )}
      {route === 'mantenimientoSitio' && (
        <MantenimientoSitio inspection={inspection} save={save} onBack={()=>setRoute('menu')} />
      )}
      {route === 'fotos' && (
        <EvidenciaConsolidada inspection={inspection} save={save} onBack={()=>setRoute('menu')} />
      )}
      {route === 'firma' && (
        <div className="container px-4 py-6 space-y-4">
          <SignaturePad
            firma={inspection?.firma?.imagenDataUrl}
            setFirma={(v) => setField('firma.imagenDataUrl', v)}
            nombreCliente={inspection?.firma?.nombreCliente}
            setNombreCliente={(v) => setField('firma.nombreCliente', v)}
          />
          <div className="flex gap-2 justify-end">
            <button className="btn btn-secondary" onClick={() => setRoute('menu')}>Volver</button>
            <button className="btn btn-primary" onClick={finalizeAndDownload}>Finalizar e imprimir PDF</button>
          </div>
        </div>
      )}
      {route === 'complete' && (
        <InspectionComplete inspection={inspection} onBack={()=>setRoute('menu')} onFinish={()=>setRoute('menu')} />
      )}
      <VoiceDock />
    </div>
  )
}
