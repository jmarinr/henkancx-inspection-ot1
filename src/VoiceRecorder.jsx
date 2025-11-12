
import React, { useEffect, useRef, useState } from 'react'

export default function VoiceRecorder({ onText }) {
  const [recording, setRecording] = useState(false)
  const [time, setTime] = useState(0)
  const timerRef = useRef(null)
  const speechRef = useRef(null)

  useEffect(()=>{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = 'es-ES'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e)=>{
      let s = ''
      for (let i = e.resultIndex; i < e.results.length; i++) s += e.results[i][0].transcript
      onText && onText(s)
    }
    speechRef.current = rec
  }, [onText])

  const start = ()=>{
    if (!speechRef.current) return
    setRecording(true); setTime(0)
    speechRef.current.start()
    timerRef.current = setInterval(()=> setTime(t=>{
      if (t >= 29){ stop(); return 30 }
      return t+1
    }), 1000)
  }
  const stop = ()=>{
    setRecording(false)
    if (speechRef.current) speechRef.current.stop()
    if (timerRef.current){ clearInterval(timerRef.current); timerRef.current=null }
  }

  return (
    <div className="flex gap-2">
      <button className="btn btn-secondary w-full" disabled={recording} onClick={start}>🎙️ Grabar Audio (30s max)</button>
      <button className="btn btn-primary w-full" disabled={!recording} onClick={stop}>
        ✨ Analizar con IA {recording ? `(${time}s)` : ''}
      </button>
    </div>
  )
}
