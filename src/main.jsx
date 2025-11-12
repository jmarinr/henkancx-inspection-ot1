// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Polyfill por si falta structuredClone
if (typeof window.structuredClone !== 'function') {
  window.structuredClone = (obj) => JSON.parse(JSON.stringify(obj))
}

class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state = { error: null } }
  static getDerivedStateFromError(e){ return { error: e } }
  componentDidCatch(error, info){ console.error('[App crashed]', error, info) }
  render(){
    if (this.state.error) {
      return (
        <div className="container px-4 py-8">
          <div className="card">
            <h1 className="text-xl font-bold mb-2">Se produjo un error en la aplicación</h1>
            <p className="text-muted mb-4">Revisa la consola para ver la traza completa.</p>
            <pre className="text-xs overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))

async function bootstrap() {
  try {
    const mod = await import('./App.jsx')  // <- asegúrate que el archivo es exactamente App.jsx
    console.log('[main] App module loaded:', mod)
    const App = mod?.default

    if (!App || typeof App !== 'function') {
      console.error('❌ Export inválido de App.jsx. Valor importado:', mod)
      throw new Error('Export inválido en App.jsx (no es default function).')
    }

    root.render(
      // OJO: sin StrictMode para que el stack no duplique renders mientras depuramos
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    )
  } catch (err) {
    console.error('[bootstrap] fallo al cargar App.jsx', err)
    document.getElementById('root').innerHTML = `
      <div style="max-width:720px;margin:40px auto;padding:16px;border:1px solid #ddd;border-radius:12px">
        <h1 style="margin:0 0 8px;font:600 18px Inter,system-ui">No se pudo iniciar la app</h1>
        <p style="color:#666;margin:0 0 8px">Revisa la consola para más detalles.</p>
        <pre style="white-space:pre-wrap;font-size:12px">${(err && (err.stack || err.message)) || String(err)}</pre>
      </div>
    `
  }
}

bootstrap()
