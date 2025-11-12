
import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [code, setCode] = useState('')

  const submit = (e)=>{
    e.preventDefault()
    if (!code.trim()) return
    localStorage.setItem('tecnicoCode', code.trim())
    if (typeof onLogin === 'function') onLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-extrabold mb-1">HenkanCX Inspection Module v2.1</h1>
        <p className="text-sm text-gray-500 mb-4">Ingresa tu código de técnico para comenzar.</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Código de técnico</label>
            <input autoFocus className="input-field" value={code} onChange={e=>setCode(e.target.value)} placeholder="Ej. 1234" />
          </div>
          <button className="btn btn-primary w-full" type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  )
}
