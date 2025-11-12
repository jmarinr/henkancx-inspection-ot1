import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- Polyfill: Safari / iPad pueden no tener structuredClone (crashea silenciosamente)
if (typeof window.structuredClone !== 'function') {
  window.structuredClone = (obj) => JSON.parse(JSON.stringify(obj))
}

// --- ErrorBoundary para evitar pantalla en blanco y ver el error real
class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { error: null } }
  static getDerivedStateFromError(error){ return { error } }
  componentDidCatch(error, info){
    console.error('[App crashed]', error, info)
  }
  render(){
    if (this.state.error) {
      return (
        <div className="container px-4 py-8">
          <div className="card">
            <h1 className="text-xl font-bold mb-2">Se produjo un error en la aplicación</h1>
            <p className="text-muted mb-4">
              Revisa la consola (F12) para ver la traza completa con sourcemap.
            </p>
            <pre className="text-xs overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
