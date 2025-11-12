
import React, { useEffect, useRef, useState } from 'react'

function useSpeech() {
  const [support, setSupport] = useState(false)
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState('')
  const recRef = useRef(null)

  useEffect(()=>{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    setSupport(true)
    const rec = new SR()
    rec.lang = 'es-ES'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e)=>{
      let s = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        s += e.results[i][0].transcript
      }
      setResult(s)
    }
    rec.onend = ()=> setListening(false)
    recRef.current = rec
  }, [])

  const start = ()=> { if (recRef.current && !listening){ setResult(''); recRef.current.start(); setListening(true)} }
  const stop = ()=> { if (recRef.current && listening){ recRef.current.stop(); setListening(false)} }

  return { support, listening, result, start, stop }
}

export default function VoiceDock() {
  const { support, listening, result, start, stop } = useSpeech()
  const [attach, setAttach] = useState(true)

  useEffect(()=>{
    if (!attach) return
    const el = document.activeElement
    if (!el) return
    if (result && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
      const cursor = el.selectionStart || el.value?.length || 0
      const startText = el.value?.slice(0, cursor) || ''
      const endText = el.value?.slice(cursor) || ''
      el.value = (startText + result + endText).replace(/\s+/g, ' ').trimStart()
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }, [result, attach])

  if (!support) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="card shadow-lg px-3 py-2 flex items-center gap-2">
        <button
          className={`btn ${listening ? 'btn-secondary' : 'btn-primary'}`}
          onClick={listening ? stop : start}
          title={listening ? 'Detener dictado' : 'Dictar por voz'}
        >
          {listening ? 'Detener' : 'Dictar'}
        </button>
        <label className="text-xs flex items-center gap-1">
          <input type="checkbox" checked={attach} onChange={e=>setAttach(e.target.checked)} />
          Insertar en campo activo
        </label>
      </div>
    </div>
  )
}
