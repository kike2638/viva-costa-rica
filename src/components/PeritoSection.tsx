import { Award, FileCheck, Scale, ClipboardCheck, MapPin, Clock, Shield } from 'lucide-react'
import { PERITO_PRINCIPAL } from '../utils/constants'

export default function PeritoSection(){
  const p = PERITO_PRINCIPAL
  return (
    <section className="bg-white border border-stone-200 rounded-[24px] overflow-hidden">
      <div className="grid lg:grid-cols-5 gap-0">
        <div className="lg:col-span-2 bg-[#1a120e] text-white p-8 flex flex-col">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 mx-auto lg:mx-0">
            <img src="https://placehold.co/400x400/8c6239/ffffff?text=PM+20a" alt={p.nombre} className="w-full h-full object-cover"/>
          </div>
          <h3 className="text-xl font-extrabold mt-4 text-center lg:text-left">{p.nombre}</h3>
          <div className="text-sm text-[#d4a574] font-semibold text-center lg:text-left">{p.carnet}</div>
          <div className="text-xs text-stone-400 mt-1 text-center lg:text-left">Incorporada {p.incorporacion} · {p.experiencia} años valuando en Occidente y GAM</div>
          <div className="grid grid-cols-3 gap-3 mt-6 text-center">
            <div className="bg-white/10 rounded-xl py-3"><div className="text-lg font-extrabold">{p.experiencia}+</div><div className="text-xs text-stone-300">años</div></div>
            <div className="bg-white/10 rounded-xl py-3"><div className="text-lg font-extrabold">{p.informes.toLocaleString()}</div><div className="text-xs text-stone-300">informes</div></div>
            <div className="bg-white/10 rounded-xl py-3"><div className="text-lg font-extrabold">CFIA</div><div className="text-xs text-stone-300">lista peritos</div></div>
          </div>
          <blockquote className="mt-6 text-sm text-stone-300 italic border-l-2 border-[#d4a574] pl-4">“{p.frases20anos}”</blockquote>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.especialidades.map(e=> <span key={e} className="text-xs bg-white/10 border border-white/20 px-2.5 py-1 rounded-full">{e}</span>)}
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-stone-400"><MapPin className="w-4 h-4"/> Base Costa Rica · cobertura nacional</div>
        </div>

        <div className="lg:col-span-3 p-6 md:p-8 space-y-6">
          <div>
            <h4 className="font-bold text-stone-900 flex items-center gap-2"><Award className="w-5 h-5 text-[#8c6239]"/> Metodología 20 años — 3 enfoques IVS (CFIA Art.10)</h4>
            <p className="text-xs text-stone-500 mt-1">Todo avalúo combina al menos 2 enfoques para valor defendible ante banco/juzgado. La perito elige y justifica según tipo de bien (no aplica la misma a todo).</p>
            <div className="grid gap-3 mt-4">
              {p.metodologias.map(m=>(
                <div key={m.nombre} className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                  <div className="font-semibold text-sm text-stone-900">{m.nombre}</div>
                  <div className="text-xs text-[#8c6239] font-medium mt-1">Uso: {m.uso}</div>
                  <div className="text-xs text-stone-600 mt-1">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-sm text-stone-900 flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-emerald-600"/> Checklist documental (evita rechazo SUGEF)</h5>
              <ul className="mt-2 space-y-1.5">
                {p.checklistDocumentos.map(d=> <li key={d} className="flex gap-2 text-xs text-stone-700"><FileCheck className="w-4 h-4 text-emerald-500 shrink-0"/>{d}</li>)}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm text-stone-900 flex items-center gap-2"><Scale className="w-4 h-4 text-[#8c6239]"/> Validez y normativa</h5>
              <ul className="mt-2 space-y-1.5">
                {p.normativa.map(n=> <li key={n} className="flex gap-2 text-xs text-stone-700"><Shield className="w-4 h-4 text-[#8c6239] shrink-0"/>{n}</li>)}
              </ul>
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <div className="font-semibold flex items-center gap-1"><Clock className="w-4 h-4"/> Plazos reales 20 años</div>
                <div className="mt-1">Vivienda estándar <b>5 días hábiles</b> post-visita · Industrial 7-15 días · Agropecuario 10-20 días · Express 48-72h con recargo.</div>
                <div className="mt-1 text-amber-700">Vigencia hipotecario: <b>6 meses</b>. Sin independencia (vendedor/comprador) no lo acepta el banco.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

