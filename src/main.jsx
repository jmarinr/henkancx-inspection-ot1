// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Polyfill por si iPad/Safari no trae structuredClone
if (typeof window.structuredClone !== 'function') {
  window.structuredClone = (obj) => JSON.parse(JSON.stringify(obj))
}

// ErrorBoundary mínimo para no dejar pantalla en blanco si algo crashea luego
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
            <p className="text-muted mb-4">
              Revisa la consola (F12) para ver la traza completa.
            </p>
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
    // 👇 Import dinámico para forzar a Vite a resolver exactamente el archivo
    const mod = await import('./App.jsx')
    const App = mod?.default

    // 🔍 Validación explícita: aquí atrapamos la causa del #301
    if (!App || typeof App !== 'function') {
      console.error('❌ Export inválido de App.jsx. Valor importado:', mod)
      throw new Error(
        'Export inválido en App.jsx: asegúrate de `export default function App(){}` ' +
        'y que la ruta y el *casing* del archivo son exactamente "./App.jsx".'
      )
    }

    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    )
  } catch (err) {
    console.error('[bootstrap] fallo al cargar App.jsx', err)
    // Fallback visible si algo impide montar React
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
