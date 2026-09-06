import { Award, Shield, Users, TrendingUp } from 'lucide-react'
import { TEAM, STATS } from '../utils/constants'
import StatsChart from './StatsChart'

export default function AboutSection(){
  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200">Desde 2009</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Líderes en valoración inmobiliaria en Costa Rica</h2>
          <p className="text-slate-600 text-sm leading-relaxed mt-3">Somos un equipo de tasadores certificados, corredores y analistas que combina datos de mercado reales con inteligencia local. Cada valoración incluye estudio comparativo, inspección y reporte legal.</p>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              {icon: Award, title:'Certificación CFIA', desc:'Tasadores incorporados'},
              {icon: Shield, title:'Garantía de precisión', desc:'±3% de margen'},
              {icon: Users, title:'+1200 familias', desc:'Asesoradas con éxito'},
              {icon: TrendingUp, title:'Data-driven', desc:'Big data + inspección'},
            ].map(c=>(
              <div key={c.title} className="bg-white border border-slate-200 rounded-xl p-4">
                <c.icon className="w-5 h-5 text-sky-600"/>
                <div className="font-semibold text-sm text-slate-900 mt-2">{c.title}</div>
                <div className="text-xs text-slate-500">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <img src="https://placehold.co/700x520/0ea5e9/ffffff?text=Equipo+ValoraCR" alt="Equipo" className="rounded-2xl shadow-lg border border-slate-200 w-full object-cover"/>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s=> <div key={s.label} className="bg-slate-900 text-white rounded-2xl p-6 text-center"><div className="text-2xl font-extrabold text-sky-400">{s.value}</div><div className="text-xs text-slate-400 mt-1">{s.label}</div></div>)}
      </div>

      <StatsChart/>

      <div>
        <h3 className="text-xl font-bold text-slate-900 text-center">Nuestro equipo</h3>
        <p className="text-center text-sm text-slate-500 mt-1">Expertos locales comprometidos con tu patrimonio</p>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {TEAM.map(m=>(
            <div key={m.name} className="bg-white border border-slate-200 rounded-2xl overflow-hidden text-center">
              <img src={m.img} alt={m.name} className="h-64 w-full object-cover"/>
              <div className="p-4"><div className="font-semibold text-slate-900">{m.name}</div><div className="text-xs text-sky-600 font-medium">{m.role}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
