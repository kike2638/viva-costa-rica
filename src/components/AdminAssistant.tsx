import { useState, useMemo } from 'react'
import { Bot, Send, Sparkles, AlertTriangle, FileCheck, MapPin } from 'lucide-react'
import { PERITO_PRINCIPAL } from '../utils/constants'
import { useAvaluoStore } from '../store/avaluos'

type Msg = { role:'user'|'assistant', text:string }

const quickPrompts = [
  '¿Qué metodología IVS aplico a este caso?',
  '¿Documentación suficiente o falta algo?',
  '¿Riesgo de rechazo SUGEF/banco?',
  '¿Cómo justificar desplazamiento San Ramón?',
  'Redacta conclusión para informe',
]

export default function AdminAssistant(){
  const { avaluos } = useAvaluoStore()
  const [input,setInput]=useState('')
  const [msgs,setMsgs]=useState<Msg[]>([
    { role:'assistant', text:`Soy la asistente del perito ${PERITO_PRINCIPAL.nombre} (20 años, ${PERITO_PRINCIPAL.informes} informes). Pregúntame sobre metodología, checklist o cómo defender el valor ante banco/juzgado. Base San Ramón.` }
  ])
  const [selectedId,setSelectedId]=useState<string>(avaluos[0]?.id || '')

  const selected = useMemo(()=> avaluos.find(a=>a.id===selectedId), [avaluos, selectedId])

  const respond = (q:string) => {
    const low = q.toLowerCase()
    let ans = ''
    if(!selected) ans = 'Selecciona un avalúo arriba para asesoría contextual.'
    else if(low.includes('metodolog')) {
      ans = `Para ${selected.tipo} (${selected.modalidad}) con 20 años recomiendo: **${selected.metodologia}**. Justificación: ${PERITO_PRINCIPAL.metodologias.find(m=> selected.metodologia.includes(m.nombre.split(' ')[0]))?.desc || 'Combinar al menos 2 enfoques IVS. Para vivienda: comparación 5-8 comparables verificados <6m; si es lote, homologación + costo.'} No uses solo costo en vivienda — banco lo rechaza.`
    } else if(low.includes('document') || low.includes('falta')) {
      const comp = selected.docCompletitud
      const missing = comp<100 ? 'Faltan obligatorios (plano/literal/cédula). ' : 'Documentación completa. '
      ans = `${missing}Completitud ${comp}%. Checklist: ${PERITO_PRINCIPAL.checklistDocumentos.slice(0,3).join(' · ')}. Sin literal <30d o plano, SUGEF no acepta hipotecario. Avisa al cliente antes de visita.`
    } else if(low.includes('sugef') || low.includes('rechazo') || low.includes('banco')) {
      ans = `Riesgo 20 años: ${selected.pagoStatus!=='pagado' ? 'Sin pago previo — no visitar (experiencia: visitas impagas son pérdida). ' : ''}${selected.modalidad==='virtual' ? 'Virtual no válido SUGEF (6 meses vigencia, requiere independencia). ' : ''}Si usas solo 1 enfoque o comparables >12m, el banco lo devuelve. Asegura independencia (perito sin vínculo vendedor) y fotos georreferenciadas.`
    } else if(low.includes('desplazamiento') || low.includes('san ramón')) {
      ans = `Desde San Ramón: costo ${selected.desplazamientoCosto===0?'₡0 (local)':`₡${selected.desplazamientoCosto.toLocaleString('es-CR')}`} para ${selected.direccion}. Justifica con tabla DESPLAZAMIENTO_TARIFAS (Palmares 5k, Grecia 8k, Alajuela 12k, Heredia 18k...). Agrupa visitas por zona para optimizar. Incluye en factura como "gastos de desplazamiento" separado del honorario.`
    } else if(low.includes('conclus') || low.includes('redacta') || low.includes('informe')) {
      ans = `Conclusión sugerida (Norma IVS N°3): "Con base en ${selected.metodologia}, inspección ${selected.fechaVisita||'pendiente'} y comparables verificados, el valor de mercado al ${new Date().toLocaleDateString('es-CR')} es ₡${(selected.valorEstimado||0).toLocaleString('es-CR')}. Metodología justificada por tipo ${selected.tipo}. Válido 6 meses SUGEF. Perito ${PERITO_PRINCIPAL.nombre} ${PERITO_PRINCIPAL.carnet}." Adjunta fotos, plano y literal.`
    } else {
      ans = `Criterio 20 años: ${q} → Revisa ${selected.metodologia}, completitud ${selected.docCompletitud}% y pago ${selected.pagoStatus}. Si es hipotecario, exige 2 enfoques y comparables <6m. ¿Quieres que genere checklist, borrador de conclusión o cálculo de desplazamiento?`
    }
    setMsgs(m=> [...m, {role:'user', text:q}, {role:'assistant', text:ans}])
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col h-[520px]">
      <div className="bg-[#1a120e] text-white p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#8c6239] flex items-center justify-center"><Bot className="w-5 h-5"/></div>
        <div className="flex-1"><div className="font-bold text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#d4a574]"/> Asistente Perito 20 años</div><div className="text-xs text-stone-400">Isolado en SuperAdmin — no visible en web pública</div></div>
        <select value={selectedId} onChange={e=> setSelectedId(e.target.value)} className="text-xs bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
          {avaluos.map(a=> <option key={a.id} value={a.id} className="text-stone-900">{a.id} — {a.direccion.slice(0,24)}</option>)}
        </select>
      </div>

      {selected && (
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{selected.modalidad} · {selected.metodologia}</span>
          <span className="flex items-center gap-1"><FileCheck className="w-3 h-3"/>Docs {selected.docCompletitud}%</span>
          {selected.docCompletitud<100 && <span className="flex items-center gap-1 text-amber-700"><AlertTriangle className="w-3 h-3"/>Incompleto — riesgo SUGEF</span>}
        </div>
      )}

      <div className="flex-1 overflow-auto p-4 space-y-3 bg-stone-50">
        {msgs.map((m,i)=> (
          <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role==='assistant' ? 'bg-white border border-stone-200 text-stone-800' : 'bg-[#1a120e] text-white ml-auto'}`}>{m.text}</div>
        ))}
      </div>

      <div className="p-3 border-t border-stone-200 bg-white">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {quickPrompts.map(p=> <button key={p} onClick={()=> respond(p)} className="text-xs px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200">{p}</button>)}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={e=> setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && input.trim() && (respond(input), setInput(''))} placeholder="Pregunta al perito (ej: ¿cómo defiendo este valor?)" className="flex-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#a67c52]"/>
          <button onClick={()=> input.trim() && (respond(input), setInput(''))} className="w-10 h-10 rounded-xl bg-[#8c6239] text-white flex items-center justify-center hover:bg-[#6b4a2b]"><Send className="w-4 h-4"/></button>
        </div>
      </div>
    </div>
  )
}
