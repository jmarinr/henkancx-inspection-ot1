import React, { useEffect, useMemo, useState } from 'react'
import MenuWizard from './MenuWizard.jsx'

// Pequeño header fijo y minimalista
function HeaderBar({ tech, onLogout, onThemeToggle }) {
  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 grid place-items-center font-bold">H</div>
          <div>
            <div className="font-semibold">HenkanCX Synk</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Módulo de Inspección v2.1</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Técnico: {tech || '—'}</span>
          <button className="px-2 py-1 text-sm rounded-lg bg-gray-200 dark:bg-gray-700" onClick={onThemeToggle}>🌓</button>
          {tech ? (
            <button className="px-2 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700" onClick={onLogout}>Salir</button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// Login súper simple por código de técnico
function LoginPane({ onLogin }) {
  const [code, setCode] = useState('')
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto card space-y-4">
        <h1 className="text-xl font-bold">HenkanCX Inspection Module v2.1</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Ingresa tu código de técnico para continuar.</p>
        <input
          className="input-field"
          placeholder="Código de técnico"
          value={code}
          onChange={(e)=>setCode(e.target.value)}
        />
        <button
          className="btn btn-primary w-full"
          onClick={()=> onLogin(code.trim() || '0000')}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

// Paso previo: iniciar inspección con un número/OT
function StartInspection({ onStart }) {
  const [id, setId] = useState('')
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto card space-y-4">
        <h2 className="text-lg font-semibold">Iniciar nueva inspección</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Indica el número de inspección u Orden de Trabajo (OT).
        </p>
        <input
          className="input-field"
          placeholder="Ej. OT-2025-00123"
          value={id}
          onChange={(e)=>setId(e.target.value)}
        />
        <button className="btn btn-primary w-full" onClick={()=> onStart(id.trim() || String(Date.now()))}>
          Comenzar inspección
        </button>
      </div>
    </div>
  )
}

// Utilidad local para un objeto de inspección vacío
function emptyInspection(id){
  return {
    id,
    startedAt: new Date().toISOString(),
    geo: null,
    formularios: {
      infoBasica:   { campos: {}, fotos: [] },
      vehiculo:     { campos: {}, fotos: [] },
      preventivoMG: { campos: {}, fotos: [] },
      sistemaTierras: { campos: {}, fotos: [] },
      infraestructuraTorre: { campos: {}, fotos: [] },
      inventarioEquipos: { lista: [] },
      mantenimientoSitio: { campos: {}, fotos: [] },
      fotos: { items: [] },
      firma: { nombreCliente: '', trazo: null },
    },
    __progress: 0,
    __status: {}, // done | inprogress | pending por sección
  }
}

// Persistencia mínima
const LS_TECH = 'tecnicoCode'
const LS_INS  = 'activeInspection'

// 👇 App asegurando SIEMPRE un render
export default function App(){
  const [tech, setTech] = useState(()=> localStorage.getItem(LS_TECH) || '')
  const [inspection, setInspection] = useState(()=>{
    const raw = localStorage.getItem(LS_INS)
    return raw ? JSON.parse(raw) : null
  })

  // Log de ayuda (lo verás en consola; así confirmas que App sí se renderiza)
  useEffect(()=> {
    // eslint-disable-next-line no-console
    console.log('[App render]', { tech, inspectionId: inspection?.id })
  })

  // Guardar cambios de técnico/inspección
  useEffect(()=> { tech ? localStorage.setItem(LS_TECH, tech) : localStorage.removeItem(LS_TECH) }, [tech])
  useEffect(()=> { inspection ? localStorage.setItem(LS_INS, JSON.stringify(inspection)) : localStorage.removeItem(LS_INS) }, [inspection])

  // Toggle de tema
  const toggleTheme = () => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    if (isDark) root.classList.remove('dark'); else root.classList.add('dark')
  }

  const handleLogout = () => {
    setTech('')
    setInspection(null)
  }

  // Paso 1: login por código
  if (!tech) {
    return (
      <>
        <HeaderBar tech={tech} onLogout={handleLogout} onThemeToggle={toggleTheme}/>
        <LoginPane onLogin={setTech}/>
      </>
    )
  }

  // Paso 2: iniciar o continuar inspección
  if (!inspection) {
    return (
      <>
        <HeaderBar tech={tech} onLogout={handleLogout} onThemeToggle={toggleTheme}/>
        <StartInspection onStart={(id)=> setInspection(emptyInspection(id))}/>
      </>
    )
  }

  // Paso 3: menú de formularios (wizard)
  const status = inspection.__status || {}
  const openForm = (key) => {
    // Aquí iría tu ruteo o setState para abrir formularios reales;
    // para asegurar feedback visual, marcamos "inprogress"
    setInspection(prev => ({
      ...prev,
      __status: { ...prev.__status, [key]: 'inprogress' }
    }))
    alert(`Abrir formulario: ${key}`)
  }

  return (
    <>
      <HeaderBar tech={tech} onLogout={handleLogout} onThemeToggle={toggleTheme}/>
      <MenuWizard inspection={inspection} status={status} onOpen={openForm}/>
    </>
  )
}
