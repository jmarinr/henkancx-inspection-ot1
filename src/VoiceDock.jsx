import React, { useEffect, useRef, useState } from 'react'

export default function VoiceDock() {
  const [support, setSupport] = useState(false)
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  useEffect(()=> {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    setSupport(true)
    const rec = new SR()
    rec.lang = 'es-ES'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e)=>{
      let s = ''
      for (let i=e.resultIndex; i<e.results.length; i++) s += e.results[i][0].transcript
      const el = document.activeElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
        const start = el.selectionStart ?? el.value.length
        const end = el.selectionEnd ?? el.value.length
        el.setRangeText((el.value ? ' ' : '') + s, start, end, 'end')
        el.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }
    rec.onend = ()=> setListening(false)
    recRef.current = rec
  }, [])

  if (!support) return null

  const toggle = ()=> {
    if (!recRef.current) return
    if (listening){ recRef.current.stop(); setListening(false) }
    else { recRef.current.start(); setListening(true) }
  }

  return (
    <div className="fixed right-4 bottom-24 z-40">
      <button onClick={toggle} className={`rounded-full shadow-lg text-white px-4 py-3 ${listening ? 'bg-purple-600' : 'bg-blue-600'}`}>
        {listening ? '⏹ Detener dictado' : '🎤 Dictar en campo activo'}
      </button>
    </div>
  )
}
