import React, { useState } from 'react'
import { KeyRound } from 'lucide-react'

export default function Login({ onLogin }) {
  const [code, setCode] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const c = (code || '').trim()
    if (!c || c.length < 4) return alert('Ingresa un código válido')
    localStorage.setItem('tecnicoCode', c)
    onLogin(c)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="card max-w-sm w-full">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5" />
          <h2 className="text-xl font-bold">Ingresar</h2>
        </div>
        <label className="block text-sm font-medium mb-1">Código de técnico</label>
        <input className="input-field mb-4" placeholder="Ej. TCN-00123" value={code} onChange={e=>setCode(e.target.value)} />
        <button className="btn btn-primary w-full">Entrar</button>
      </form>
    </div>
  )
}
