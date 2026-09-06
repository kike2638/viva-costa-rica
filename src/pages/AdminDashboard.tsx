import { useMemo, useState } from 'react'
import { useAvaluoStore, type AvaluoStatus, type PagoStatus } from '../store/avaluos'
import AdminLayout from '../components/AdminLayout'
import AdminAssistant from '../components/AdminAssistant'
import PeritoSection from '../components/PeritoSection'
import { Search, Filter, TrendingUp, Clock, CheckCircle, FileText, CreditCard, MapPin, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'

const statusLabel: Record<AvaluoStatus,string> = { pendiente:'Pendiente', pendiente_pago:'Pendiente pago', pagado:'Pagado', en_revision:'En revisión', visita_agendada:'Visita agendada', tasado:'Tasado', entregado:'Entregado', rechazado:'Rechazado' }
const statusColor: Record<AvaluoStatus,string> = {
  pendiente:'bg-amber-100 text-amber-800 border-amber-200', pendiente_pago:'bg-orange-100 text-orange-800 border-orange-200',
  pagado:'bg-emerald-100 text-emerald-800 border-emerald-200', en_revision:'bg-sky-100 text-sky-800 border-sky-200',
  visita_agendada:'bg-indigo-100 text-indigo-800 border-indigo-200', tasado:'bg-emerald-100 text-emerald-800 border-emerald-200',
  entregado:'bg-violet-100 text-violet-800 border-violet-200', rechazado:'bg-rose-100 text-rose-800 border-rose-200'
}
const pagoColor: Record<PagoStatus,string> = { no_aplica:'bg-stone-100 text-stone-600 border-stone-200', pendiente:'bg-amber-100 text-amber-800 border-amber-200', pagado:'bg-emerald-100 text-emerald-800 border-emerald-200', reembolsado:'bg-rose-100 text-rose-800 border-rose-200' }

export default function AdminDashboard({mode='dashboard'}:{mode?:'dashboard'|'list'}){
  const { avaluos, updateAvaluo, deleteAvaluo } = useAvaluoStore()
  const [q,setQ]=useState('')
  const [f,setF]=useState<AvaluoStatus|'todos'>('todos')

  const filtered = useMemo(()=> avaluos.filter(a=>{
    if(f!=='todos' && a.status!==f) return false
    if(q && !(`${a.nombre} ${a.email} ${a.direccion} ${a.id} ${a.modalidad}`.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  }),[avaluos,q,f])

  const stats = {
    total: avaluos.length,
    pendientes: avaluos.filter(a=>['pendiente','pendiente_pago'].includes(a.status)).length,
    porCobrar: avaluos.filter(a=>a.pagoStatus==='pendiente').reduce((s,a)=>s+a.costoTotal,0),
    cobrado: avaluos.filter(a=>a.pagoStatus==='pagado').reduce((s,a)=>s+a.costoTotal,0),
    visitas: avaluos.filter(a=>a.status==='visita_agendada').length,
  }

  const byStatus = [
    { name:'Pendiente', value: avaluos.filter(a=>a.status==='pendiente').length },
    { name:'Pte. pago', value: avaluos.filter(a=>a.status==='pendiente_pago').length },
    { name:'Pagado', value: avaluos.filter(a=>a.status==='pagado').length },
    { name:'Tasado', value: avaluos.filter(a=>a.status==='tasado').length },
  ]
  const byModalidad = [
    { tipo:'Virtual', count: avaluos.filter(a=>a.modalidad==='virtual').length },
    { tipo:'Presencial', count: avaluos.filter(a=>a.modalidad==='presencial').length },
    { tipo:'Hipotecario', count: avaluos.filter(a=>a.modalidad==='hipotecario').length },
  ]
  const COLORS = ['#d4a574','#8c6239','#1a120e','#a67c52']

  const handleMarcarPagado = (id:string) => {
    const a = avaluos.find(x=>x.id===id)
    if(!a) return
    updateAvaluo(id, { pagoStatus:'pagado', status:'pagado', metodoPago: a.metodoPago || 'sinpe' })
  }

  return (
    <AdminLayout>
      {mode==='dashboard' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div><h1 className="text-2xl font-extrabold text-stone-900">Dashboard — Terra Capital</h1><p className="text-sm text-stone-500">Perito 20 años · Base San Ramón · Control desplazamiento y pago previo</p></div>
            <a href="/evaluacion" target="_blank" className="px-4 py-2 rounded-full bg-[#8c6239] text-white text-sm font-semibold">+ Nuevo avalúo (sitio)</a>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-5"><div className="text-xs text-stone-500 flex items-center gap-2"><FileText className="w-4 h-4"/> Total avalúos</div><div className="text-2xl font-extrabold mt-1">{stats.total}</div><div className="text-xs text-stone-400">Virtual gratis + pagos</div></div>
            <div className="bg-white border border-stone-200 rounded-2xl p-5"><div className="text-xs text-stone-500 flex items-center gap-2"><Clock className="w-4 h-4"/> Pendientes</div><div className="text-2xl font-extrabold mt-1">{stats.pendientes}</div><div className="text-xs text-amber-600">Requieren acción</div></div>
            <div className="bg-white border border-stone-200 rounded-2xl p-5"><div className="text-xs text-stone-500 flex items-center gap-2"><DollarSign className="w-4 h-4"/> Por cobrar</div><div className="text-2xl font-extrabold mt-1">₡{stats.porCobrar.toLocaleString('es-CR')}</div><div className="text-xs text-amber-600 flex items-center gap-1"><CreditCard className="w-3 h-3"/> Pendiente pago</div></div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5"><div className="text-xs text-emerald-700 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Cobrado</div><div className="text-2xl font-extrabold mt-1 text-emerald-800">₡{stats.cobrado.toLocaleString('es-CR')}</div><div className="text-xs text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Ingresos confirmados</div></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <h3 className="font-semibold text-sm text-stone-900 mb-3">Distribución por estado</h3>
              <div className="h-[220px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{byStatus.map((_,i)=> <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <h3 className="font-semibold text-sm text-stone-900 mb-3">Modalidad (gratis vs pago)</h3>
              <div className="h-[220px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={byModalidad}><CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4"/><XAxis dataKey="tipo" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}}/><Tooltip/><Bar dataKey="count" fill="#8c6239" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div>
              <p className="text-xs text-stone-500 mt-2">Virtual = gratis (fotos cliente, sin despl.). Presencial/Hipotecario = con visita San Ramón.</p>
            </div>
          </div>
          <details className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 open:bg-white">
            <summary className="font-bold text-sm text-stone-900 cursor-pointer list-none flex items-center justify-between">🔒 Perito 20 años — exclusivo SuperAdmin (click para ver) <span className="text-xs text-stone-500">CFIA IC-11247 · 1.850 informes</span></summary>
            <div className="mt-4"><PeritoSection/></div>
            <div className="mt-3 bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-800">
              <b>Bancos (hipotecario):</b> el virtual <b>NO es válido SUGEF</b>. Para hipotecario debes derivar a perito físico CFIA (tú como gestor San Ramón + perito firmante). Flujo: cliente pide hipotecario → cobras → asignas a <b>Ing. Patricia Mora (física, visita)</b> → ella firma informe. Tú facturas y le pagas honorario (ej. 60/40). Así no necesitas ser perito aún.
            </div>
          </details>
        </>
      )}

      <div className="bg-white border border-stone-200 rounded-2xl p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
          <h2 className="font-bold text-stone-900">{mode==='dashboard' ? 'Últimos avalúos' : 'Todos los avalúos'} — {filtered.length}</h2>
          <div className="flex gap-2">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar cliente, ID, modalidad..." className="pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#a67c52] w-[240px]"/></div>
            <div className="relative flex items-center gap-2 border border-stone-200 rounded-xl px-3 bg-stone-50"><Filter className="w-4 h-4 text-stone-500"/><select value={f} onChange={e=>setF(e.target.value as any)} className="bg-transparent text-sm outline-none py-2"><option value="todos">Todos</option><option value="pendiente">Pendiente</option><option value="pendiente_pago">Pendiente pago</option><option value="pagado">Pagado</option><option value="visita_agendada">Visita agendada</option><option value="en_revision">En revisión</option><option value="tasado">Tasado</option><option value="entregado">Entregado</option><option value="rechazado">Rechazado</option></select></div>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-stone-500 border-b border-stone-200"><th className="text-left py-2 px-2">ID / Modalidad</th><th className="text-left">Cliente</th><th className="text-left">Dirección + costo</th><th className="text-left">Metodología / Docs</th><th className="text-left">Pago</th><th className="text-left">Estado</th><th className="text-right">Acciones</th></tr></thead>
            <tbody>
              {(mode==='dashboard'? filtered.slice(0,6): filtered).map(a=>(
                <tr key={a.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="py-3 px-2"><div className="font-mono text-xs font-semibold">{a.id}</div><div className="text-xs capitalize px-2 py-0.5 rounded-full bg-stone-900 text-white inline-block mt-1">{a.modalidad}</div></td>
                  <td><div className="font-medium text-stone-900">{a.nombre}</div><div className="text-xs text-stone-500">{a.email} · {a.telefono}</div></td>
                  <td className="max-w-[240px]"><div className="text-stone-700 flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0"/>{a.direccion}</div><div className="text-xs text-stone-500">{a.superficie} m² · {a.tipo} · <span className="font-semibold text-[#8c6239]">₡{a.costoTotal.toLocaleString('es-CR')}</span> {a.desplazamientoCosto>0 && `(despl. ₡${a.desplazamientoCosto.toLocaleString('es-CR')})`}</div></td>
                  <td className="max-w-[160px]"><div className="text-xs font-medium text-stone-700">{a.metodologia}</div><div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block border ${a.docCompletitud===100?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-amber-50 text-amber-700 border-amber-200'}`}>Docs {a.docCompletitud}% {a.docCompletitud<100 && '⚠'}</div><div className="text-xs text-stone-400 truncate">{Object.keys(a.documentos||{}).join(', ')||'—'}</div></td>
                  <td><span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${pagoColor[a.pagoStatus]}`}>{a.pagoStatus==='no_aplica'?'GRATIS':a.pagoStatus}</span>{a.metodoPago && <div className="text-xs text-stone-500 mt-1">{a.metodoPago}</div>}</td>
                  <td><span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[a.status]}`}>{statusLabel[a.status]}</span></td>
                  <td className="text-right">
                    <div className="flex flex-col gap-1 items-end">
                      <div className="flex gap-1 flex-wrap justify-end">
                        <select value={a.status} onChange={e=> updateAvaluo(a.id, {status: e.target.value as AvaluoStatus})} className="text-xs border border-stone-200 rounded-full px-2 py-1 bg-white">
                          <option value="pendiente">Pendiente</option><option value="pendiente_pago">Pendiente pago</option><option value="pagado">Pagado</option><option value="visita_agendada">Visita agendada</option><option value="en_revision">En revisión</option><option value="tasado">Tasado</option><option value="entregado">Entregado</option><option value="rechazado">Rechazado</option>
                        </select>
                        {a.pagoStatus==='pendiente' && <button onClick={()=> handleMarcarPagado(a.id)} className="text-xs px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Marcar pagado</button>}
                      </div>
                      <div className="flex gap-1">
                        <select value={a.pagoStatus} onChange={e=> updateAvaluo(a.id, {pagoStatus: e.target.value as PagoStatus})} className="text-xs border border-stone-200 rounded-full px-2 py-1 bg-white">
                          <option value="no_aplica">Gratis</option><option value="pendiente">Pendiente</option><option value="pagado">Pagado</option><option value="reembolsado">Reembolsado</option>
                        </select>
                        <input type="date" value={a.fechaVisita||''} onChange={e=> updateAvaluo(a.id, {fechaVisita: e.target.value, status: e.target.value ? 'visita_agendada' as any : a.status})} className="text-xs border border-stone-200 rounded-full px-2 py-1 w-[130px]"/>
                      </div>
                      <div className="flex gap-1">
                        <input placeholder="Tasador" defaultValue={a.tasador||''} onBlur={e=> updateAvaluo(a.id, {tasador: e.target.value})} className="w-20 text-xs border border-stone-200 rounded-full px-2 py-1"/>
                        <input placeholder="Valor ₡" type="number" defaultValue={a.valorEstimado||''} onBlur={e=> e.target.value && updateAvaluo(a.id, {valorEstimado: Number(e.target.value)})} className="w-24 text-xs border border-stone-200 rounded-full px-2 py-1"/>
                        <button onClick={()=> { if(confirm('¿Eliminar?')) deleteAvaluo(a.id)}} className="text-xs px-2 py-1 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50">X</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="text-center py-8 text-stone-500 text-sm">Sin resultados</div>}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="text-xs text-stone-700 bg-white border border-stone-200 rounded-xl p-4">
            <b className="text-stone-900">Flujo 20 años (San Ramón):</b>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-stone-600">
              <li><b>Virtual gratis:</b> sin visita, entrega 24h, no SUGEF. Metodología auto: Comparación rápida.</li>
              <li><b>Presencial/Hipotecario:</b> ₡45k/₡95k + despl. San Ramón +30% express → <b>pendiente_pago</b>. Docs obligatorios: plano+literal+cédula (checklist).</li>
              <li>Admin marca <b>pagado</b> → asigna perito Patricia Mora (20 años) + metodología IVS → <b>visita_agendada</b> → <b>tasado/entregado</b> 6 meses validez.</li>
            </ol>
          </div>
        </div>
        <div><AdminAssistant/></div>
      </div>
      <div className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <b>Login aislado:</b> <code>/admin/login</code> no está en nav público (Header/Footer sin link). Solo acceso directo. Protegido por <code>Protected</code> en <code>src/App.tsx:13</code> con <code>useAuthStore</code>. Persistencia actual <code>terra-avaluos-v4-perito</code> → migrar a Vercel Postgres/Blob (<code>api/avaluos.js</code> + <code>vercel.json</code>).
      </div>
    </AdminLayout>
  )
}
