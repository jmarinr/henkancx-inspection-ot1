import jsPDF from 'jspdf';
export const generatePDF = (data) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  let y = 20;

  // Header (igual estilo v1.0)
  pdf.setFillColor(0, 0, 0);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('HenkanCX Synk', 15, 18);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Orden de Trabajo', 15, 25);
  pdf.setTextColor(0,0,0);

  // Información básica
  y = 40;
  pdf.setFont('helvetica','bold'); pdf.setFontSize(14); pdf.text('Información básica', 15, y); y+=6;
  pdf.setFont('helvetica','normal'); pdf.setFontSize(10);
  const i = data;
  const coords = i?.sitio?.coords ? `${i.sitio.coords.latitude?.toFixed(6)}, ${i.sitio.coords.longitude?.toFixed(6)} (±${Math.round(i.sitio.coords.accuracy||0)}m)` : 'N/A';
  const info = [
    ['Sitio', i?.sitio?.nombre || ''],
    ['ID de Sitio', i?.sitio?.idSitio || ''],
    ['Fecha programada', i?.sitio?.fechaProgramada || ''],
    ['Fecha/hora ejecutada', i?.timestamps?.inicio ? new Date(i.timestamps.inicio).toLocaleString('es-ES') : ''],
    ['Coordenadas', coords],
    ['Ingeniero responsable', i?.sitio?.ingeniero || ''],
    ['OT', i?.ot || ''],
    ['Proveedor/Empresa', i?.proveedor || ''],
    ['Técnico (código)', i?.tecnico?.code || '']
  ];
  info.forEach(([k,v])=>{ pdf.setFont('helvetica','bold'); pdf.text(`${k}:`, 15, y); pdf.setFont('helvetica','normal'); pdf.text(String(v||''), 55, y); y+=6; });
  y += 4;

  // Vehículo
  pdf.setFont('helvetica','bold'); pdf.setFontSize(14); pdf.text('Datos del vehículo', 15, y); y+=6;
  pdf.setFont('helvetica','normal'); pdf.setFontSize(10);
  const v = i.vehiculo || {};
  [['Placa', v.placa], ['VIN', v.vin], ['Marca', v.marca], ['Modelo', v.modelo], ['Año', v.anio], ['Kilometraje', v.kilometraje]]
    .forEach(([k,val])=>{ pdf.setFont('helvetica','bold'); pdf.text(`${k}:`, 15, y); pdf.setFont('helvetica','normal'); pdf.text(String(val||''), 55, y); y+=6; });
  y+=4;

  const section = (title)=>{ if (y>260){ pdf.addPage(); y=20 } ; pdf.setFont('helvetica','bold'); pdf.setFontSize(14); pdf.text(title,15,y); y+=6; pdf.setFont('helvetica','normal'); pdf.setFontSize(10); }

  // Secciones formularios resumidas (campos clave)
  section('Preventivo MG y baterías')
  // (Resumen simple)
  y+=4;

  section('Sistema de tierras (Ground – El Valle)')
  y+=4;

  section('Infraestructura de torre (El Valle)')
  y+=4;

  section('Inventario de equipos')
  y+=4;

  section('Mantenimiento general del sitio (PMI)')
  y+=4;

  // Fotos: por sección, con títulos
  const fotosPorSeccion = [
    ['Preventivo MG', i.formularios?.preventivoMG?.fotos],
    ['Sistema de tierras', i.formularios?.sistemaTierras?.fotos],
    ['Infraestructura', i.formularios?.infraestructuraTorre?.fotos],
    ['Inventario', i.formularios?.inventarioEquipos?.fotos],
    ['PMI', i.formularios?.mantenimientoSitio?.fotos]
  ]
  fotosPorSeccion.forEach(([title, arr])=>{
    if (!arr || !arr.length) return
    section('Fotos – '+title)
    let col = 0
    arr.slice(0,6).forEach(p=>{
      if (col===2){ col=0; y += 70; if (y>250){ pdf.addPage(); y=20 } }
      const x = col===0 ? 15 : (pageWidth/2 + 5)
      try {
        pdf.addImage(p.dataUrl||p, 'JPEG', x, y, 80, 60)
        if (p.title || p.custom) {
          pdf.text(String(p.custom || p.title), x, y+64)
        }
      } catch (e) {}
      col++
    })
    y += 70
  })

  // Firma
  if (i.firma?.imagenDataUrl){
    if (y>230){ pdf.addPage(); y=20 }
    pdf.setFont('helvetica','bold'); pdf.setFontSize(14); pdf.text('Firma del Cliente', 15, y); y+=8;
    try { pdf.addImage(i.firma.imagenDataUrl, 'PNG', 15, y, 60, 30) } catch(e){}
    y += 36
    if (i.firma.nombreCliente){ pdf.setFont('helvetica','normal'); pdf.text('Nombre: '+i.firma.nombreCliente, 15, y); y+=6 }
  }

  pdf.setFontSize(8); pdf.setTextColor(128,128,128);
  pdf.text(`Generado: ${new Date().toLocaleString('es-ES')} - HenkanCX Synk`, pageWidth/2, 290, { align:'center' });
  return pdf
}
export const downloadPDF = (data)=>{ try{ const pdf = generatePDF(data); pdf.save(`OT-${data.ot||data.id}.pdf`); return true } catch(e){ console.error(e); return false } }
