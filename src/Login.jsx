import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [code, setCode] = useState(localStorage.getItem('tecnicoCode') || '')

  const submit = (e) => {
    e.preventDefault()
    if (!code.trim()) return
    localStorage.setItem('tecnicoCode', code.trim())
    onLogin && onLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-md">
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold">HenkanCX Inspection Module v2.1</h1>
          <p className="text-sm text-gray-500">Ingrese su código de técnico para continuar.</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Código de técnico</label>
            <input className="input-field" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Ej. 1234" />
          </div>
          <button className="btn btn-primary w-full" type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  )
}
