import React, { useMemo, useState } from 'react'

// Header y sesión
import Header from './Header.jsx'
import Login from './Login.jsx'

// Wizard (menú y secciones)
import MenuWizard from './MenuWizard.jsx'
import InfoBasica from './InfoBasica.jsx'
import Vehiculo from './Vehiculo.jsx'

// Formularios (1 por archivo/área)
import SistemaTierras from './SistemaTierras.jsx'
import InfraestructuraTorre from './InfraestructuraTorre.jsx'
import InventarioEquipos from './InventarioEquipos.jsx'
import MantenimientoSitio from './MantenimientoSitio.jsx'

// Firma y cierre
import SignaturePad from './SignaturePad.jsx'
import InspectionComplete from './InspectionComplete.jsx'

// Estado unificado y PDF
import { useInspectionState } from './state/inspectionState.js'
import { downloadPDF } from './pdf.js'

export default function App() {
  // Ruta simple tipo “router” local
  const [route, setRoute] = useState('menu')

  // Sesión: login por código (acepta cualquiera)
  const [logged, setLogged] = useState(!!localStorage.getItem('tecnicoCode'))

  // Estado global de inspección (persistido en localStorage)
  const { inspection, save, setField, markStart, markEnd } = useInspectionState()

  // Cálculo de estado por sección para el menú (colores/etapas)
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

    // Información básica “completa” si tiene nombre, ID y coordenadas automáticas
    if (inspection?.sitio?.nombre && inspection?.sitio?.idSitio && inspection?.sitio?.coords) {
      s.infoBasica = 'done'
    }

    // Vehículo en progreso si hay algún dato capturado
    if (inspection && inspection.vehiculo && Object.keys(inspection.vehiculo).length > 0) {
      s.vehiculo = 'inprogress'
    }

    // Firma completa si hay imagen y nombre
    if (inspection?.firma?.imagenDataUrl && inspection?.firma?.nombreCliente) {
      s.firma = 'done'
    }

    // Los demás formularios quedan como pending por defecto; si quieres reglas
    // específicas (p.ej., mínimo de campos/fotos) las añadimos luego.
    return s
  }, [inspection])

  // Navegación simple
  const open = (key) => setRoute(key)

  // Logout
  const logout = () => {
    localStorage.removeItem('tecnicoCode')
    setLogged(false)
    setRoute('menu')
  }

  // Guardar PDF y pasar a pantalla de “completo”
  const finalizeAndDownload = () => {
    markEnd()
    downloadPDF(inspection)
    setRoute('complete')
  }

  // Si no hay sesión, mostrar login
  if (!logged) return <Login onLogin={() => setLogged(true)} />

  return (
    <div className="min-h-screen">
      <Header onLogout={logout} />

      {/* Menú principal tipo wizard */}
      {route === 'menu' && <MenuWizard onOpen={open} status={status} />}

      {/* Secciones del wizard */}
      {route === 'infoBasica' && (
        <InfoBasica inspection={inspection} setField={setField} markStart={markStart} />
      )}

      {route === 'vehiculo' && (
        <Vehiculo inspection={inspection} setField={setField} />
      )}

      {route === 'sistemaTierras' && (
        <SistemaTierras inspection={inspection} save={save} setField={setField} />
      )}

      {route === 'infraestructuraTorre' && (
        <InfraestructuraTorre inspection={inspection} save={save} setField={setField} />
      )}

      {route === 'inventarioEquipos' && (
        <InventarioEquipos inspection={inspection} save={save} />
      )}

      {route === 'mantenimientoSitio' && (
        <MantenimientoSitio inspection={inspection} save={save} />
      )}

      {/* Firma y botón de cierre */}
      {route === 'firma' && (
        <div className="container px-4 py-6 space-y-4">
          <SignaturePad
            firma={inspection?.firma?.imagenDataUrl}
            setFirma={(v) => setField('firma.imagenDataUrl', v)}
            nombreCliente={inspection?.firma?.nombreCliente}
            setNombreCliente={(v) => setField('firma.nombreCliente', v)}
          />

          <div className="flex gap-2 justify-end">
            <button className="btn btn-secondary" onClick={() => setRoute('menu')}>
              Volver
            </button>
            <button className="btn btn-primary" onClick={finalizeAndDownload}>
              Finalizar e imprimir PDF
            </button>
          </div>
        </div>
      )}

      {/* Pantalla final (resumen + descarga nuevamente si se desea) */}
      {route === 'complete' && (
        <InspectionComplete
          inspection={inspection}
          onBack={() => setRoute('menu')}
          onFinish={() => setRoute('menu')}
        />
      )}
    </div>
  )
}
