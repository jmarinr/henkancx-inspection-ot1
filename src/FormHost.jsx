// src/FormHost.jsx
import React, { useEffect, useMemo, useState } from 'react'
import SignaturePad from './SignaturePad.jsx'
import VoiceInput from './VoiceInput.jsx'
import ObservationsIA from './ObservationsIA.jsx'
import OCRConfirmModal from './OCRConfirmModal.jsx'
import VoiceInput from './VoiceInput.jsx'


// --- utilidades y etiquetas ---
const TITLES = {
  infoBasica: 'Información básica',
  vehiculo: 'Datos del vehículo',
  preventivoMG: 'Mantenimiento preventivo MG y baterías',
  sistemaTierras: 'Medición de sistema de tierras (Ground – El Valle)',
  infraestructuraTorre: 'Infraestructura de torre (El Valle)',
  inventarioEquipos: 'Inventario de equipos',
  mantenimientoSitio: 'Mantenimiento general del sitio (PMI)',
  fotos: 'Evidencia fotográfica consolidada',
  firma: 'Firma y cierre',
}

const Footer = ({ onBack, onSave }) => (
  <div className="flex items-center justify-end gap-2 pt-2">
    <button className="btn btn-secondary" onClick={onBack}>← Volver al menú</button>
    <button className="btn btn-primary" onClick={onSave}>Guardar y marcar como completado</button>
  </div>
)

// ------- bloques autocontenidos (sin imports externos) -------

// 1) Form básico (con fecha ejecutada autogenerada)
function BasicInfo({ value, onChange }) {
  const v = value || {}
  const set = (k, val) => onChange({ ...v, [k]: val })
  useEffect(() => {
    if (!v.fechaHoraEjecutada) {
      onChange({ ...v, fechaHoraEjecutada: new Date().toISOString() })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card"><label className="text-sm font-medium">Nombre del Sitio</label>
        <input className="input-field" value={v.nombreSitio||''} onChange={e=>set('nombreSitio',e.target.value)} />
      </div>
      <div className="card"><label className="text-sm font-medium">Número ID del Sitio</label>
        <input className="input-field" value={v.idSitio||''} onChange={e=>set('idSitio',e.target.value)} />
      </div>
      <div className="card"><label className="text-sm font-medium">Fecha Programada</label>
        <input type="date" className="input-field" value={v.fechaProgramada||''} onChange={e=>set('fechaProgramada',e.target.value)} />
      </div>
      <div className="card"><label className="text-sm font-medium"># Orden de Trabajo (OT)</label>
        <input className="input-field" value={v.ordenTrabajo||''} onChange={e=>set('ordenTrabajo',e.target.value)} />
      </div>
      <div className="card"><label className="text-sm font-medium">Proveedor o Empresa</label>
        <input className="input-field" value={v.proveedor||''} onChange={e=>set('proveedor',e.target.value)} />
      </div>
      <div className="card"><label className="text-sm font-medium">Ingeniero responsable</label>
        <input className="input-field" value={v.ingeniero||''} onChange={e=>set('ingeniero',e.target.value)} />
      </div>
      <div className="card md:col-span-2"><label className="text-sm font-medium">Fecha y Hora Ejecutada</label>
        <input className="input-field opacity-70" readOnly value={v.fechaHoraEjecutada||''} />
      </div>
    </div>
  )
}

// 2) Captura de geolocalización simple (sin Google Maps)
function GeoBox({ value, onChange }) {
  const [geo,setGeo] = useState(value||null)
  useEffect(()=>{
    let ok=true
    if(!geo){ navigator.geolocation?.getCurrentPosition(
      (pos)=>{ if(!ok) return; const g={lat:+pos.coords.latitude.toFixed(6),lng:+pos.coords.longitude.toFixed(6),accuracy:pos.coords.accuracy,ts:Date.now()}; setGeo(g); onChange&&onChange(g)},
      ()=>{}, {enableHighAccuracy:true,timeout:8000,maximumAge:0}
    )}
    return ()=>{ ok=false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  if(!geo) return <div className="card text-sm text-gray-500">Obteniendo ubicación automáticamente…</div>
  const link=`https://maps.google.com/?q=${geo.lat},${geo.lng}`
  return (
    <div className="card space-y-1">
      <div className="text-sm">GPS: <span className="font-mono">{geo.lat}, {geo.lng}</span> (±{Math.round(geo.accuracy)} m)</div>
      <a className="text-blue-600 underline text-sm" href={link} target="_blank" rel="noreferrer">Abrir en Google Maps</a>
    </div>
  )
}

// 3) Grilla genérica de mediciones (reemplaza Measurements/Tests)
function MetricGrid({ title, data={}, onChange }) {
  const set = (k,val)=> onChange({ ...(data||{}), [k]:val })
  return (
    <div className="card">
      <div className="font-semibold mb-3">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className="text-xs">Hodómetro</label><input className="input-field" value={data.hodometro||''} onChange={e=>set('hodometro',e.target.value)} /></div>
        <div><label className="text-xs">Serie</label><input className="input-field" value={data.serie||''} onChange={e=>set('serie',e.target.value)} /></div>
        <div><label className="text-xs">Modelo</label><input className="input-field" value={data.modelo||''} onChange={e=>set('modelo',e.target.value)} /></div>
        <div><label className="text-xs">Voltaje</label><input className="input-field" value={data.voltaje||''} onChange={e=>set('voltaje',e.target.value)} /></div>
        <div><label className="text-xs">Corriente</label><input className="input-field" value={data.corriente||''} onChange={e=>set('corriente',e.target.value)} /></div>
        <div><label className="text-xs">Observación</label><input className="input-field" value={data.obs||''} onChange={e=>set('obs',e.target.value)} /></div>
      </div>
    </div>
  )
}

// 4) Fotos + OCR simulado
function PhotoOCR({ photos=[], setPhotos, onAnalyze }) {
  const add=(files)=>{
    const arr=Array.from(files||[])
    if(!arr.length) return
    const next=arr.map(f=>({id:crypto.randomUUID(),name:f.name,url:URL.createObjectURL(f)}))
    const merged=[...photos,...next]
    setPhotos(merged)
    setTimeout(()=> onAnalyze && onAnalyze({
      hodometro: String(1000+Math.floor(Math.random()*500)),
      serie:'SN-'+Math.floor(100000+Math.random()*900000),
      modelo:'GEN-'+Math.floor(100+Math.random()*900),
    }),600)
  }
  const remove=(id)=> setPhotos(photos.filter(p=>p.id!==id))
  return (
    <div className="card space-y-3">
      <label className="text-sm font-medium">Cargar fotos (OCR simulado)</label>
      <input type="file" multiple accept="image/*" onChange={(e)=>add(e.target.files)} />
      {photos.length>0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {photos.map(p=>(
            <div key={p.id} className="relative">
              <img src={p.url} alt={p.name} className="w-full h-24 object-cover rounded-lg border" />
              <button className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full px-2 py-0.5 text-xs" onClick={()=>remove(p.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
      <OCRConfirmModal />
      <p className="text-xs text-gray-500">Cada foto dispara extracción automática de datos (simulada).</p>
    </div>
  )
}

// 5) Inventario simple
function EquipmentList({ items=[], setItems }) {
  const add=()=> setItems([...(items||[]), {id:crypto.randomUUID(), tipo:'', marca:'', modelo:'', serie:''}])
  const remove=id=> setItems(items.filter(i=>i.id!==id))
  const set=(idx,k,val)=>{ const copy=items.slice(); copy[idx]={...copy[idx],[k]:val}; setItems(copy) }
  return (
    <div className="card space-y-3">
      {items?.length===0 && <div className="text-sm text-gray-500">Sin equipos. Usa “Añadir equipo”.</div>}
      {items?.map((it,i)=>(
        <div key={it.id} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-start">
          <input className="input-field" placeholder="Tipo"   value={it.tipo}   onChange={e=>set(i,'tipo',e.target.value)} />
          <input className="input-field" placeholder="Marca"  value={it.marca}  onChange={e=>set(i,'marca',e.target.value)} />
          <input className="input-field" placeholder="Modelo" value={it.modelo} onChange={e=>set(i,'modelo',e.target.value)} />
          <input className="input-field" placeholder="Serie"  value={it.serie}  onChange={e=>set(i,'serie',e.target.value)} />
          <button className="btn btn-secondary" onClick={()=>remove(it.id)}>Eliminar</button>
        </div>
      ))}
      <button className="btn btn-primary" onClick={add}>Añadir equipo</button>
    </div>
  )
}

// ---------------- FormHost principal ----------------
export default function FormHost({ formKey, inspection, onBack, onComplete }) {
  if (!formKey) return null
  const title = TITLES[formKey] || formKey

  const initialLocal = useMemo(()=>{
    const base = inspection?.formularios?.[formKey]
    return base ? JSON.parse(JSON.stringify(base)) : {}
  },[inspection,formKey])

  const [local,setLocal] = useState(initialLocal)
  const setField = (k,v)=> setLocal(prev=>({...prev,[k]:v}))
  const merge = (obj)=> setLocal(prev=>({...prev,...obj}))
  const saveAndComplete = ()=> onComplete(formKey, local)

  let content = null
  switch(formKey){
    case 'infoBasica':
      content = (
        <div className="space-y-6">
          <BasicInfo value={local.campos||{}} onChange={d=>setField('campos',d)} />
          <GeoBox value={local.geo||inspection?.geo} onChange={g=>merge({geo:g})} />
          <div className="card space-y-3">
            <h3 className="font-semibold">Observaciones</h3>
            <ObservationsIA value={local.observaciones||''} onChange={v=>setField('observaciones',v)} onAnalyze={ai=>setField('observaciones',ai)} />
            <VoiceInput label="Grabar Audio (30s máx)" onTranscript={t=>setField('observaciones', (local.observaciones?local.observaciones+' ':'')+t)} />
          </div>
          <Footer onBack={onBack} onSave={saveAndComplete} />
        </div>
      ); break

    case 'vehiculo':
    case 'preventivoMG':
    case 'sistemaTierras':
    case 'infraestructuraTorre':
    case 'mantenimientoSitio':
      content = (
        <div className="space-y-6">
          <MetricGrid
            title={TITLES[formKey]}
            data={local.campos||{}}
            onChange={d=>setField('campos',d)}
          />
          <PhotoOCR
            photos={local.fotos||[]}
            setPhotos={arr=>setField('fotos',arr)}
            onAnalyze={r=>merge({campos:{...(local.campos||{}), ...r}})}
          />
          <Footer onBack={onBack} onSave={saveAndComplete} />
        </div>
      ); break

    case 'inventarioEquipos':
      content = (
        <div className="space-y-6">
          <EquipmentList items={local.lista||[]} setItems={lista=>setField('lista',lista)} />
          <Footer onBack={onBack} onSave={saveAndComplete} />
        </div>
      ); break

    case 'fotos':
      content = (
        <div className="space-y-6">
          <PhotoOCR
            photos={local.items||[]}
            setPhotos={arr=>setField('items',arr)}
            onAnalyze={r=>merge({extraidos:{...(local.extraidos||{}), ...r}})}
          />
          <Footer onBack={onBack} onSave={saveAndComplete} />
        </div>
      ); break

    case 'firma':
      content = (
        <div className="space-y-6">
          <SignaturePad
            value={local.trazo||null}
            onChange={sig=>setField('trazo',sig)}
            nombreCliente={local.nombreCliente||''}
            onNombreChange={v=>setField('nombreCliente',v)}
          />
          <Footer onBack={onBack} onSave={saveAndComplete} />
        </div>
      ); break

    default:
      content = (
        <div className="card">
          <p>No hay un formulario asignado a <code>{formKey}</code>.</p>
          <Footer onBack={onBack} onSave={saveAndComplete} />
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <button className="btn btn-secondary" onClick={onBack}>← Volver al menú</button>
        <div className="text-sm text-gray-500 dark:text-gray-400">Inspección #{inspection?.id}</div>
      </div>
      <div className="card">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Completa la sección y guarda para marcarla como <em>completada</em>.</p>
      </div>
      {content}
    </div>
  )
}
