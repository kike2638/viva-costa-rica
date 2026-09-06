import jsPDF from 'jspdf'
import type { Avaluo } from '../store/avaluos'
import { PERITO_PRINCIPAL } from './constants'

export function generateAvaluoPDF(a: Avaluo){
  const doc = new jsPDF({ unit:'mm', format:'a4' })
  const W = 210, H = 297
  let y = 14

  // Header
  doc.setFillColor(26,18,14)
  doc.rect(0,0,W,22,'F')
  doc.setTextColor(212,165,116)
  doc.setFont('helvetica','bold'); doc.setFontSize(14)
  doc.text('TERRA CAPITAL', 14, 11)
  doc.setFontSize(7); doc.setTextColor(255,255,255)
  doc.text('SAN RAMÓN · AVALÚOS 20 AÑOS · CFIA IC-11247', 14, 16)
  doc.setTextColor(212,165,116); doc.setFontSize(8)
  doc.text(`AVALÚO ${a.id}`, W-14, 12, {align:'right'})
  doc.setTextColor(255,255,255); doc.setFontSize(6)
  doc.text(new Date(a.createdAt).toLocaleDateString('es-CR'), W-14, 16, {align:'right'})

  y = 28
  const addTitle = (t:string) => { doc.setFillColor(244,241,236); doc.rect(12,y-5,W-24,8,'F'); doc.setTextColor(26,18,14); doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.text(t,14,y); y+=4; doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(60,60,60) }
  const addLine = (label:string, value:string) => { doc.setFont('helvetica','bold'); doc.text(`${label}:`,14,y); doc.setFont('helvetica','normal'); doc.text(value, 42, y, {maxWidth: W-56}); y+=5; if(y> H-20){ doc.addPage(); y=14 } }
  const wrap = (txt:string) => { const lines = doc.splitTextToSize(txt, W-28); doc.text(lines,14,y); y+= lines.length*4 +2; if(y> H-20){ doc.addPage(); y=14 } }

  // Datos cliente
  addTitle('1. DATOS GENERALES')
  addLine('Cliente', `${a.nombre} · ${a.email} · ${a.telefono}`)
  addLine('Dirección', a.direccion)
  addLine('Tipo / Sup.', `${a.tipo} · ${a.superficie} m² · Modalidad: ${a.modalidad} · Urgencia: ${a.urgencia}`)
  addLine('Plano / Folio', `${a.numeroPlano|| a.documentos?.plano || '—'} / ${a.folioReal|| a.documentos?.folioReal || '—'}`)
  if(a.tieneConstruccion) addLine('Construcción', `${a.areaConstruccion||0} m² · ${a.anioConstruccion||'—'} · ${a.materiales||'—'} · Uso: ${a.usoSuelo||'—'} · Terreno: ${a.areaTerreno||a.superficie} m²`)
  else addLine('Terreno', `${a.areaTerreno||a.superficie} m² — Lote sin construcción · Uso: ${a.usoSuelo||'—'}`)

  addTitle('2. METODOLOGÍA (20 años · IVS Norma N°3)')
  wrap(`${a.metodologia} — ${PERITO_PRINCIPAL.metodologias.find(m=> a.metodologia.includes(m.nombre.split(' ')[0]))?.desc || ''}`)
  doc.setFontSize(6); doc.setTextColor(100,100,100); wrap(`Perito: ${PERITO_PRINCIPAL.nombre} ${PERITO_PRINCIPAL.carnet} — ${PERITO_PRINCIPAL.experiencia} años, ${PERITO_PRINCIPAL.informes} informes. Validez SUGEF hipotecario 6 meses, independencia CFIA Art.12.`); doc.setTextColor(60,60,60); doc.setFontSize(7)

  addTitle('3. VALOR Y ANÁLISIS')
  doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(140,98,57)
  if(a.valorEstimado) doc.text(`Valor estimado: ₡${a.valorEstimado.toLocaleString('es-CR')}`, 14, y)
  else doc.text('Valor estimado: PENDIENTE DE TASACIÓN', 14, y)
  y+=7; doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(60,60,60)
  addLine('Costo avalúo', `₡${a.costoTotal.toLocaleString('es-CR')} (despl. ₡${a.desplazamientoCosto.toLocaleString('es-CR')} desde San Ramón) · Pago: ${a.pagoStatus}`)
  addLine('Estado', `${a.status} · Docs: ${a.docCompletitud}% · Tasador: ${a.tasador||'—'}${a.fechaVisita?` · Visita: ${a.fechaVisita}`:''}`)

  // Plus / sugerencia IA (generada)
  addTitle('4. CARACTERÍSTICAS Y PLUSES (sugerencia IA perito)')
  const pluses = genPluses(a)
  pluses.forEach(p=> { doc.setFont('helvetica','normal'); doc.text(`• ${p}`, 14, y, {maxWidth: W-28}); y+=5; if(y>H-20){doc.addPage(); y=14} })

  addTitle('5. SUGERENCIA — ¿VENDER O MANTENER?')
  const sugg = genSugerencia(a)
  wrap(sugg)

  // Footer
  doc.setFontSize(6); doc.setTextColor(140,140,140)
  doc.text('Terra Capital · San Ramón, Alajuela · info@terracapitalcr.com · Este avalúo virtual es rango estimado con fotos/datos cliente. Para validez bancaria requiere visita física CFIA.', 14, H-10, {maxWidth: W-28, align:'left'})
  doc.text(`Documento generado ${new Date().toLocaleString('es-CR')} · ${a.id}`, 14, H-6)

  doc.save(`${a.id}-TerraCapital-Avaluo.pdf`)
}

function genPluses(a: Avaluo): string[] {
  const list:string[] = []
  if(a.areaTerreno && a.areaTerreno>300) list.push(`Lote generoso ${a.areaTerreno} m² — plus para ampliación o piscina.`)
  if(a.areaConstruccion && a.areaConstruccion>150) list.push(`Construcción amplia ${a.areaConstruccion} m² — ideal familias.`)
  if(a.anioConstruccion && a.anioConstruccion>2018) list.push(`Construcción reciente ${a.anioConstruccion} — acabados vigentes, menor depreciación.`)
  if(a.materiales) list.push(`Acabados: ${a.materiales} — destacar en anuncio para justificar precio.`)
  if(a.direccion.toLowerCase().includes('san ramón')) list.push(`Ubicación San Ramón — alta demanda Occidente, plusvalía estable.`)
  if(a.tipo==='lote' && !a.tieneConstruccion) list.push(`Lote limpio — listo para construir, atractivo inversionista.`)
  if(list.length<3) list.push(`Entorno tranquilo y servicios a mano — plus habitabilidad.`, `Documentación con plano/folio al día — transmite confianza.`)
  return list.slice(0,5)
}
function genSugerencia(a: Avaluo): string{
  if(!a.valorEstimado) return 'Con el rango virtual puedes comparar tu precio esperado: si está >10% sobre este avalúo, ajusta o espera plusvalía 6-12 meses. Si está alineado, es buen momento para vender.'
  return `Valor técnico ₡${a.valorEstimado.toLocaleString('es-CR')} defendido con ${a.metodologia}. Sugerencia perito 20 años: si necesitas liquidez vende ahora; si puedes esperar, plusvalía Occidente ~5-8% anual. Destaca pluses del punto 4 en anuncio.`
}
