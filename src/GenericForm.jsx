import React from 'react'

export default function GenericForm({ title, schema, data, onChange }) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">{title || schema?.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {schema.fields.map((f)=>{
          const val = data[f.name] ?? ''
          if (f.type==='textarea') {
            return (
              <div key={f.name} className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{f.label}</label>
                <textarea name={f.name} value={val} onChange={onChange} className="input-field min-h-24" />
              </div>
            )
          }
          if (f.type==='select') {
            return (
              <div key={f.name}>
                <label className="block text-sm font-medium mb-1">{f.label}</label>
                <select name={f.name} value={val} onChange={onChange} className="input-field">
                  <option value="">Seleccionar</option>
                  {f.options.map(o=>(<option key={o} value={o}>{o}</option>))}
                </select>
              </div>
            )
          }
          return (
            <div key={f.name}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              <input name={f.name} value={val} onChange={onChange} className="input-field" type={f.type||'text'} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
