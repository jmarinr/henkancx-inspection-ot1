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

// --- SANITY CHECK: detecta imports undefined (causa típica del #301)
const __components = {
  Header, Login, MenuWizard, InfoBasica, Vehiculo,
  SistemaTierras, InfraestructuraTorre, InventarioEquipos,
  MantenimientoSitio, EvidenciaConsolidada, PreventivoMG,
  SignaturePad, InspectionComplete, VoiceDock,
}
for (const [name, mod] of Object.entries(__components)) {
  const ok = typeof mod === 'function' || (mod && typeof mod === 'object')
  if (!ok) {
    console.error(`❌ Import inválido: ${name} =`, mod)
    throw new Error(`Component "${name}" es undefined. Revisa su ruta y que tenga "export default".`)
  }
}

// ... (tu App real debajo, tal como la tienes)
export default function App() {
  const [tech, setTech] = useState(localStorage.getItem('tecnicoCode') || '')
  // resto de tu App...
}
