import EvaluationForm from '../components/EvaluationForm'
import { ClipboardCheck, Home, BadgeCheck, Info, CreditCard } from 'lucide-react'
import { AVALUO_MODALIDADES } from '../utils/constants'

export default function Evaluation(){
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex px-3 py-1 rounded-full bg-[#f4f1ec] text-[#8c6239] text-xs font-semibold border border-[#e8ddd0]">Viva Costa Rica · Certified Appraisals & Investments</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 mt-3">Avalúos con costo transparente</h1>
        <p className="text-stone-600 text-sm mt-3 leading-relaxed">La estimación virtual es <b>gratis y sin visita</b>. Los avalúos con visita presencial tienen costo porque incluyen desplazamiento, combustible y reporte CFIA. El pago se hace <b>antes</b> de agendar la visita.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8 max-w-5xl mx-auto">
        {AVALUO_MODALIDADES.map(m=>(
          <div key={m.value} className={`bg-white border rounded-2xl p-5 text-center ${m.value==='virtual'?'border-emerald-200':'border-stone-200'}`}>
            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${m.value==='virtual'?'bg-emerald-500 text-white':'bg-[#1a120e] text-white'}`}>{m.badge}</div>
            <div className="font-bold text-stone-900 mt-2">{m.label}</div>
            <div className="text-xs text-stone-500 mt-1">{m.desc}</div>
            {m.value!=='virtual' && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2 mt-3">+ desplazamiento según zona + 30% si es express</div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8 mt-10">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {icon: ClipboardCheck, title:'1. Solicitud', desc:'Eliges modalidad y ves costo al instante'},
              {icon: CreditCard, title:'2. Pago', desc:'Si es presencial, pagas por SINPE/tarjeta'},
              {icon: Home, title:'3. Visita', desc:'Solo tras pago: agendamos inspección'},
            ].map(s=>(
              <div key={s.title} className="bg-white border border-stone-200 rounded-2xl p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f4f1ec] flex items-center justify-center mx-auto"><s.icon className="w-6 h-6 text-[#8c6239]"/></div>
                <div className="font-semibold text-stone-900 mt-3 text-sm">{s.title}</div>
                <div className="text-xs text-stone-500 mt-1">{s.desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6">
            <h3 className="font-bold text-stone-900">¿Qué incluye cada modalidad?</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li className="flex gap-2"><BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0"/> <b>Virtual gratis:</b> rango estimado por comparables, sin visita ni validez bancaria. Ideal para orientarte.</li>
              <li className="flex gap-2"><BadgeCheck className="w-5 h-5 text-[#8c6239] shrink-0"/> <b>Presencial:</b> inspección + fotos + reporte CFIA para venta. Desde ₡45k + desplazamiento.</li>
              <li className="flex gap-2"><BadgeCheck className="w-5 h-5 text-[#1a120e] shrink-0"/> <b>Hipotecario:</b> certificado para crédito, con mayor detalle legal. Desde ₡95k + desplazamiento.</li>
            </ul>
            <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex gap-2"><Info className="w-4 h-4 shrink-0"/> Si el cliente cancela antes de la visita, se reembolsa el 100%. Si cancela tras la visita, aplica costo de desplazamiento. Todo queda trazado en el panel SuperAdmin.</div>
          </div>

          <div className="bg-[#1a120e] rounded-2xl p-6 text-white">
            <h4 className="font-semibold">¿Dudas sobre el costo?</h4>
            <p className="text-sm text-stone-300 mt-1">Habla con un tasador: <a href="tel:+50622223333" className="text-[#d4a574] font-semibold">+506 2222-3333</a> · info@vivacostarica.com — Te calculamos desplazamiento exacto por WhatsApp.</p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <EvaluationForm/>
        </div>
      </div>
    </div>
  )
}

