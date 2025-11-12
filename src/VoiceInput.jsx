// src/VoiceInput.jsx
import React, { useEffect, useRef, useState } from 'react'

/**
 * Botón de dictado por voz (30s máx).
 * Props:
 *  - label?: string
 *  - onTranscript: (text: string) => void
 */
export default function VoiceInput({ label = 'Dictar en campo activo', onTranscript }) {
  const [supported, setSupported] = useState(false)
  const [recording, setRecording] = useState(false)
  const [partial, setPartial] = useState('')
  const recRef = useRef(null)
  const stopTimer = useRef(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      const rec = new SR()
      rec.lang = 'es-ES'
      rec.continuous = true
      rec.interimResults = true

      rec.onresult = (e) => {
        let final = ''
        let interim = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript.trim()
          if (e.results[i].isFinal) final += t + ' '
          else interim += t + ' '
        }
        if (interim) setPartial(interim)
        if (final) {
          setPartial('')
          onTranscript && onTranscript(final.trim())
        }
      }
      rec.onend = () => {
        setRecording(false)
        setPartial('')
        if (stopTimer.current) {
          clearTimeout(stopTimer.current)
          stopTimer.current = null
        }
      }
      rec.onerror = () => {
        setRecording(false)
        setPartial('')
      }

      recRef.current = rec
      setSupported(true)
    } else {
      setSupported(false)
    }
    return () => {
      if (recRef.current) recRef.current.stop?.()
      if (stopTimer.current) clearTimeout(stopTimer.current)
    }
  }, [onTranscript])

  const start = () => {
    if (!recRef.current) return
    try {
      recRef.current.start()
      setRecording(true)
      // límite 30s
      stopTimer.current = setTimeout(() => {
        recRef.current.stop()
      }, 30_000)
    } catch {}
  }

  const stop = () => {
    if (!recRef.current) return
    recRef.current.stop()
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className={`btn ${recording ? 'btn-secondary' : 'btn-primary'}`}
        onClick={recording ? stop : start}
        disabled={!supported}
        title={supported ? '' : 'El navegador no soporta reconocimiento de voz'}
      >
        {recording ? '◼︎ Detener' : '🎤 '}{label}
      </button>
      {recording && (
        <span className="text-sm text-gray-500">
          Escuchando… {partial && <em className="opacity-70 ml-1">{partial}</em>}
        </span>
      )}
      {!supported && (
        <span className="text-xs text-gray-500">
          (No soportado en este navegador)
        </span>
      )}
    </div>
  )
}
