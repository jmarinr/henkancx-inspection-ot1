
import React, { useEffect, useRef } from 'react'

export default function SignaturePad({ firma, setFirma, nombreCliente, setNombreCliente }) {
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // HiDPI
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    const ctx = canvas.getContext('2d')
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#111827'
  }, [])

  const start = (x, y) => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
    isDrawing.current = true
  }
  const draw = (x, y) => {
    if (!isDrawing.current) return
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  const end = () => {
    if (!isDrawing.current) return
    isDrawing.current = false
    const data = canvasRef.current.toDataURL('image/png')
    setFirma && setFirma(data)
  }

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const clear = () => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setFirma && setFirma('')
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-3">Firma del Cliente <span className="text-red-500">*</span></h3>

      <label className="block text-sm font-medium mb-1">Nombre del Cliente <span className="text-red-500">*</span></label>
      <input
        className="input-field mb-3"
        placeholder="Nombre completo del cliente"
        value={nombreCliente||''}
        onChange={(e)=> setNombreCliente && setNombreCliente(e.target.value)}
      />

      <div className="border rounded-md bg-white dark:bg-gray-800" style={{height: 220}}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseDown={(e)=>{ const p=getPos(e); start(p.x, p.y)}}
          onMouseMove={(e)=>{ const p=getPos(e); draw(p.x, p.y)}}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={(e)=>{ const p=getPos(e); start(p.x, p.y)}}
          onTouchMove={(e)=>{ const p=getPos(e); draw(p.x, p.y)}}
          onTouchEnd={end}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <button className="btn btn-secondary" onClick={clear}>
          🗑️ Limpiar
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-2">Firme en el espacio de arriba</p>
      <p className="text-sm text-red-600 mt-1">* La firma es obligatoria para finalizar la inspección</p>
    </div>
  )
}
