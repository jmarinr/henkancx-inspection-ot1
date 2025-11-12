// src/FormHost.jsx
import React, { useEffect, useMemo, useState } from 'react'

// ✅ Componentes que SÍ existen en tu repo v1
import MeasurementsForm from './MeasurementsForm.jsx'
import TestsForm from './TestsForm.jsx'
import SignaturePad from './SignaturePad.jsx'
import VoiceInput from './VoiceInput.jsx'
import ObservationsIA from './ObservationsIA.jsx'
import OCRConfirmModal from './OCRConfirmModal.jsx'

// -----------------------------
// Utilidades simples del archivo
// -----------------------------
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
};

function FooterActions({ onBack, onSave }) {
  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <button className="btn btn-secondary" onClick={onBack}>← Volver al menú</button>
      <button className="btn btn-primary" onClick={onSave}>Guardar y marcar como completado</button>
    </div>
  );
}

// -----------------------------
// Módulos internos autocontenidos
// -----------------------------

// 1) Formulario Básico – con los campos que pediste
function BasicInfoFields({ value, onChange }) {
  const v = value || {};
  const set = (k, val) => onChange({ ...v, [k]: val });

  // Fecha/hora ejecutada no editable; se toma automática al iniciar sección si no existe
  useEffect(() => {
    if (!v.fechaHoraEjecutada) {
      onChange({ ...v, fechaHoraEjecutada: new Date().toISOString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card">
        <label className="text-sm font-medium">Nombre del Sitio</label>
        <input className="input-field" value={v.nombreSitio || ''} onChange={e => set('nombreSitio', e.target.value)} />
      </div>
      <div className="card">
        <label className="text-sm font-medium">Número ID del Sitio</label>
        <input className="input-field" value={v.idSitio || ''} onChange={e => set('idSitio', e.target.value)} />
      </div>
      <div className="card">
        <label className="text-sm font-medium">Fecha Programada</label>
        <input type="date" className="input-field" value={v.fechaProgramada || ''} onChange={e => set('fechaProgramada', e.target.value)} />
      </div>
      <div className="card">
        <label className="text-sm font-medium"># Orden de Trabajo (OT)</label>
        <input className="input-field" value={v.ordenTrabajo || ''} onChange={e => set('ordenTrabajo', e.target.value)} />
      </div>
      <div className="card">
        <label className="text-sm font-medium">Proveedor o Empresa</label>
        <input className="input-field" value={v.proveedor || ''} onChange={e => set('proveedor', e.target.value)} />
      </div>
      <div className="card">
        <label className="text-sm font-medium">Ingeniero responsable</label>
        <input className="input-field" value={v.ingeniero || ''} onChange={e => set('ingeniero', e.target.value)} />
      </div>

      {/* Fecha/hora ejecutada (solo lectura) */}
      <div className="card md:col-span-2">
        <label className="text-sm font-medium">Fecha y Hora Ejecutada</label>
        <input className="input-field opacity-70" readOnly value={v.fechaHoraEjecutada || ''} />
      </div>
    </div>
  );
}

// 2) Captura simple de geolocalización (sin dependencia de Google)
function MapCapture({ value, onChange }) {
  const [geo, setGeo] = useState(value || null);

  useEffect(() => {
    let mounted = true;
    if (!geo) {
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          if (!mounted) return;
          const g = {
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
            accuracy: pos.coords.accuracy,
            ts: Date.now(),
          };
          setGeo(g);
          onChange && onChange(g);
        },
        () => {
          // sin permisos: deja vacío pero no rompe
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!geo) {
    return <div className="card text-sm text-gray-500 dark:text-gray-400">Obteniendo ubicación automáticamente…</div>;
  }

  const link = `https://maps.google.com/?q=${geo.lat},${geo.lng}`;
  return (
    <div className="card space-y-1">
      <div className="text-sm">GPS: <span className="font-mono">{geo.lat}, {geo.lng}</span> (±{Math.round(geo.accuracy)} m)</div>
      <a className="text-blue-600 underline text-sm" href={link} target="_blank" rel="noreferrer">Abrir en Google Maps</a>
    </div>
  );
}

// 3) Fotos + “OCR simulado”
function PhotoOCR({ photos = [], setPhotos, onAnalyze }) {
  const add = (files) => {
    const arr = Array.from(files || []);
    if (!arr.length) return;
    const next = arr.map(f => ({ id: crypto.randomUUID(), name: f.name, url: URL.createObjectURL(f) }));
    const merged = [...photos, ...next];
    setPhotos(merged);
    // Simula IA/OCR
    setTimeout(() => {
      onAnalyze && onAnalyze({
        lecturaHodometro: String(1000 + Math.floor(Math.random() * 500)),
        serie: 'SN-' + Math.floor(100000 + Math.random() * 900000),
        modeloDetectado: 'GEN-' + Math.floor(100 + Math.random() * 900),
      });
    }, 600);
  };

  const remove = (id) => setPhotos(photos.filter(p => p.id !== id));

  return (
    <div className="card space-y-3">
      <label className="text-sm font-medium">Cargar fotos (OCR simulado)</label>
      <input type="file" multiple accept="image/*" onChange={(e) => add(e.target.files)} />
      {photos.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {photos.map(p => (
            <div key={p.id} className="relative">
              <img src={p.url} alt={p.name} className="w-full h-24 object-cover rounded-lg border" />
              <button
                className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full px-2 py-0.5 text-xs"
                onClick={() => remove(p.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <OCRConfirmModal />
      <p className="text-xs text-gray-500 dark:text-gray-400">Cada foto disparará una extracción automática de datos con IA (simulada).</p>
    </div>
  );
}

// 4) Inventario simple en-línea
function EquipmentList({ items = [], setItems }) {
  const add = () => setItems([...(items || []), { id: crypto.randomUUID(), tipo: '', marca: '', modelo: '', serie: '' }]);
  const remove = (id) => setItems(items.filter(i => i.id !== id));
  const set = (idx, k, val) => {
    const copy = items.slice();
    copy[idx] = { ...copy[idx], [k]: val };
    setItems(copy);
  };

  return (
    <div className="card space-y-3">
      {items?.length === 0 && <div className="text-sm text-gray-500">Sin equipos. Usa “Añadir equipo”.</div>}
      {items?.map((it, i) => (
        <div key={it.id} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-start">
          <input className="input-field" placeholder="Tipo"   value={it.tipo}   onChange={e => set(i, 'tipo', e.target.value)} />
          <input className="input-field" placeholder="Marca"  value={it.marca}  onChange={e => set(i, 'marca', e.target.value)} />
          <input className="input-field" placeholder="Modelo" value={it.modelo} onChange={e => set(i, 'modelo', e.target.value)} />
          <input className="input-field" placeholder="Serie"  value={it.serie}  onChange={e => set(i, 'serie', e.target.value)} />
          <button className="btn btn-secondary" onClick={() => remove(it.id)}>Eliminar</button>
        </div>
      ))}
      <button className="btn btn-primary" onClick={add}>Añadir equipo</button>
    </div>
  );
}

// -----------------------------
// FormHost principal
// -----------------------------
export default function FormHost({ formKey, inspection, onBack, onComplete }) {
  if (!formKey) return null;
  const title = TITLES[formKey] || formKey;

  const initialLocal = useMemo(() => {
    const base = inspection?.formularios?.[formKey];
    return base ? JSON.parse(JSON.stringify(base)) : {};
  }, [inspection, formKey]);

  const [local, setLocal] = useState(initialLocal);
  const setField = (name, value) => setLocal(prev => ({ ...prev, [name]: value }));
  const merge = (obj) => setLocal(prev => ({ ...prev, ...obj }));

  const saveAndComplete = () => onComplete(formKey, local);

  let content = null;

  switch (formKey) {
    case 'infoBasica':
      content = (
        <div className="space-y-6">
          <BasicInfoFields
            value={local.campos || {}}
            onChange={(d) => setLocal(prev => ({ ...prev, campos: d }))}
          />
          <MapCapture
            value={local.geo || inspection?.geo}
            onChange={(g) => merge({ geo: g })}
          />
          <div className="card space-y-3">
            <h3 className="font-semibold">Observaciones</h3>
            <ObservationsIA
              value={local.observaciones || ''}
              onChange={(v) => setField('observaciones', v)}
              onAnalyze={(ai) => setField('observaciones', ai)}
            />
            <VoiceInput
              label="Grabar Audio (30s máx)"
              onTranscript={(txt) =>
                setField('observaciones', (local.observaciones ? local.observaciones + ' ' : '') + txt)
              }
            />
          </div>
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      );
      break;

    case 'vehiculo':
      content = (
        <div className="space-y-6">
          <MeasurementsForm
            data={local.campos || {}}
            setData={(d) => setLocal(prev => ({ ...prev, campos: d }))}
            title="Datos del vehículo"
          />
          <PhotoOCR
            photos={local.fotos || []}
            setPhotos={(arr) => setField('fotos', arr)}
            onAnalyze={(r) => merge({ campos: { ...(local.campos || {}), ...r } })}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      );
      break;

    case 'preventivoMG':
      content = (
        <div className="space-y-6">
          <TestsForm
            data={local.campos || {}}
            setData={(d) => setLocal(prev => ({ ...prev, campos: d }))}
            title="Checklist Preventivo MG y baterías"
          />
          <PhotoOCR
            photos={local.fotos || []}
            setPhotos={(arr) => setField('fotos', arr)}
            onAnalyze={(r) => merge({ campos: { ...(local.campos || {}), ...r } })}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      );
      break;

    case 'sistemaTierras':
      content = (
        <div className="space-y-6">
          <MeasurementsForm
            data={local.campos || {}}
            setData={(d) => setLocal(prev => ({ ...prev, campos: d }))}
            title="Medición del sistema de tierras (Ground – El Valle)"
          />
          <PhotoOCR
            photos={local.fotos || []}
            setPhotos={(arr) => setField('fotos', arr)}
            onAnalyze={(r) => merge({ campos: { ...(local.campos || {}), ...r } })}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      );
      break;

    case 'infraestructuraTorre':
      content = (
        <div className="space-y-6">
          <MeasurementsForm
            data={local.campos || {}}
            setData={(d) => setLocal(prev => ({ ...prev, campos: d }))}
            title="Infraestructura de torre (El Valle)"
          />
          <PhotoOCR
            photos={local.fotos || []}
            setPhotos={(arr) => setField('fotos', arr)}
            onAnalyze={(r) => merge({ campos: { ...(local.campos || {}), ...r } })}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      );
      break;

    case 'inventarioEquipos':
      content = (
        <div className="space-y-6">
          <EquipmentList
            items={local.lista || []}
            setItems={(lista) => setField('lista', lista)}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      );
      break;

    case 'mantenimientoSitio':
      content = (
        <div className="space-y-6">
          <MeasurementsForm
            data={local.campos || {}}
            setData={(d) => setLocal(prev => ({ ...prev, campos: d }))}
            title="Mantenimiento general del sitio (PMI)"
          />
          <PhotoOCR
            photos={local.fotos || []}
            setPhotos={(arr) => setField('fotos', arr)}
            onAnalyze={(r) => merge({ campos: { ...(local.campos || {}), ...r } })}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      );
      break;

    case 'fotos':
      content = (
        <div className="space-y-6">
          <PhotoOCR
            photos={local.items || []}
            setPhotos={(arr) => setField('items', arr)}
            onAnalyze={(r) => merge({ extraidos: { ...(local.extraidos || {}), ...r } })}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      );
      break;

    case 'firma':
      content = (
        <div className="space-y-6">
          <SignaturePad
            value={local.trazo || null}
            onChange={(sig) => setField('trazo', sig)}
            nombreCliente={local.nombreCliente || ''}
            onNombreChange={(v) => setField('nombreCliente', v)}
          />
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      );
      break;

    default:
      content = (
        <div className="card">
          <p>No hay un formulario asignado a <code>{formKey}</code>. (Placeholder)</p>
          <FooterActions onBack={onBack} onSave={saveAndComplete} />
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <button className="btn btn-secondary" onClick={onBack}>← Volver al menú</button>
        <div className="text-sm text-gray-500 dark:text-gray-400">Inspección #{inspection?.id}</div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Completa la sección y guarda para marcar como <em>completada</em>.</p>
      </div>

      {content}
    </div>
  );
}
