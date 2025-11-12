import React from 'react'
export default function VoiceInput({ label, name, value, onChange, type='text' }){
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input name={name} value={value} onChange={onChange} type={type} className="input-field" />
    </div>
  )
}
