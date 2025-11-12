import React, { useEffect, useMemo, useState } from 'react'
import MenuWizard from './MenuWizard.jsx'
import FormHost from './FormHost.jsx'

const LS_TECH = 'tecnicoCode'
const LS_INS  = 'activeInspection'

const VIEWS = { MENU: 'MENU', FORM: 'FORM' }

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
    __status: {}, // por clave: done | inprogress | pending
  }
}

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

function LoginPane({ onLogin }) {
  const [code, setCode] = useState('')
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto card space-y-4">
        <h1 className="text-xl font-bold">HenkanCX Inspection Module v2.1</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Ingresa tu código de técnico para continuar.</p>
        <input className="input-field" placeholder="Código de técnico" value={code} onChange={(e)=>setCode(e.target.value)} />
        <button className="btn btn-primary w-full" onClick={()=> onLogin(code.trim() || '0000')}>Continuar</button>
      </div>
    </div>
  )
}

function StartInspection({ onStart }) {
  const [id, setId] = useState('')
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto card space-y-4">
        <h2 className="text-lg font-semibold">Iniciar nueva inspección</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Indica el número de inspección / OT.</p>
        <input className="input-field" placeholder="Ej. OT-2025-00123" value={id} onChange={(e)=>setId(e.target.value)} />
        <button className="btn btn-primary w-full" onClick={()=> onStart(id.trim() || String(Date.now()))}>Comenzar inspección</button>
      </div>
    </div>
  )
}

// claves del menú (para contar progreso)
const FORM_KEYS = [
  'infoBasica',
  'vehiculo',
  'preventivoMG',
  'sistemaTierras',
  'infraestructuraTorre',
  'inventarioEquipos',
  'mantenimientoSitio',
  'fotos',
  'firma',
]

export default function App(){
  const [tech, setTech] = useState(()=> localStorage.getItem(LS_TECH) || '')
  const [inspection, setInspection] = useState(()=>{
    const raw = localStorage.getItem(LS_INS)
    return raw ? JSON.parse(raw) : null
  })
  const [view, setView] = useState(VIEWS.MENU)
  const [activeForm, setActiveForm] = useState(null)

  // Persistencia
  useEffect(()=> { tech ? localStorage.setItem(LS_TECH, tech) : localStorage.removeItem(LS_TECH) }, [tech])
  useEffect(()=> { inspection ? localStorage.setItem(LS_INS, JSON.stringify(inspection)) : localStorage.removeItem(LS_INS) }, [inspection])

  // Tema
  const toggleTheme = () => {
    const root = document.documentElement
    root.classList.toggle('dark')
  }

  const handleLogout = () => {
    setTech('')
    setInspection(null)
    setView(VIEWS.MENU)
    setActiveForm(null)
  }

  // Progreso calculado según secciones en "done"
  const recalcProgress = (statusObj) => {
    const total = FORM_KEYS.length
    const done = FORM_KEYS.filter(k => (statusObj?.[k] || 'pending') === 'done').length
    return Math.round((done / total) * 100)
  }

  // Abrir formulario
  const openForm = (key) => {
    setInspection(prev => ({
      ...prev,
      __status: { ...prev.__status, [key]: (prev.__status?.[key] || 'pending') === 'pending' ? 'inprogress' : prev.__status?.[key] }
    }))
    setActiveForm(key)
    setView(VIEWS.FORM)
  }

  // Guardar/cerrar formulario
  const completeForm = (key, payload = {}) => {
    setInspection(prev => {
      const next = {
        ...prev,
        formularios: { ...prev.formularios, [key]: { ...(prev.formularios?.[key] || {}), ...payload } },
        __status: { ...prev.__status, [key]: 'done' }
      }
      next.__progress = recalcProgress(next.__status)
      return next
    })
    setActiveForm(null)
    setView(VIEWS.MENU)
  }

  // Cancelar/volver sin completar
  const backToMenu = () => {
    setActiveForm(null)
    setView(VIEWS.MENU)
  }

  // Flujo
  if (!tech) {
    return (
      <>
        <HeaderBar tech={tech} onLogout={handleLogout} onThemeToggle={toggleTheme}/>
        <LoginPane onLogin={setTech}/>
      </>
    )
  }

  if (!inspection) {
    return (
      <>
        <HeaderBar tech={tech} onLogout={handleLogout} onThemeToggle={toggleTheme}/>
        <StartInspection onStart={(id)=> setInspection(emptyInspection(id))}/>
      </>
    )
  }

  const status = inspection.__status || {}

  return (
    <>
      <HeaderBar tech={tech} onLogout={handleLogout} onThemeToggle={toggleTheme}/>
      {view === VIEWS.MENU ? (
        <MenuWizard inspection={inspection} status={status} onOpen={openForm}/>
      ) : (
        <FormHost
          formKey={activeForm}
          inspection={inspection}
          onBack={backToMenu}
          onComplete={completeForm}
        />
      )}
    </>
  )
}
