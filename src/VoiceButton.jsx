
import React, { useEffect, useRef, useState } from 'react'

export default function VoiceButton({ onText, title='Dictar' }) {
  const [support, setSupport] = useState(false)
  const [listening, setListening] = useState(false)
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
      for (let i = e.resultIndex; i < e.results.length; i++) s += e.results[i][0].transcript
      if (onText) onText(s)
    }
    rec.onend = ()=> setListening(false)
    recRef.current = rec
  }, [onText])

  if (!support) return null
  const toggle = ()=> {
    if (!recRef.current) return
    if (listening){ recRef.current.stop(); setListening(false) }
    else { recRef.current.start(); setListening(true) }
  }

  return (
    <button type="button" onClick={toggle} className={`btn ${listening ? 'btn-secondary' : 'btn-primary'} px-3`} title={title}>
      {listening ? '⏹' : '🎤'}
    </button>
  )
}
