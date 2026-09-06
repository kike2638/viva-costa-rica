import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Search, BadgeCheck, TrendingUp } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import EvaluationForm from '../components/EvaluationForm'
import Testimonials from '../components/Testimonials'
import PeritoSection from '../components/PeritoSection'
import { PROPERTIES } from '../utils/constants'

export default function Home(){
  const featured = PROPERTIES.filter(p=>p.featured)
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://placehold.co/1920x900/1a120e/d4a574?text=Terra+Capital+Hero" alt="hero" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a120e]/90 via-[#1a120e]/70 to-[#1a120e]/20"/>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full"><ShieldCheck className="w-4 h-4 text-[#d4a574]"/> Avalúos certificados CFIA · 98.7% precisión · Terra Capital</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mt-4 text-balance">Propiedades de calidad.<br/><span className="text-[#d4a574]">Avalúos precisos.</span></h1>
              <p className="text-stone-200 mt-4 text-[15px] leading-relaxed max-w-xl">Terra Capital — el portal inmobiliario más confiable de Costa Rica. Encuentra tu próxima propiedad o solicita un avalúo certificado con trazabilidad real en menos de 24 horas.</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to="/propiedades" className="inline-flex items-center gap-2 bg-white text-[#1a120e] px-6 py-3 rounded-full font-semibold hover:bg-stone-100 transition">Explorar propiedades <ArrowRight className="w-4 h-4"/></Link>
                <Link to="/evaluacion" className="inline-flex items-center gap-2 bg-[#8c6239] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6b4a2b] transition">Solicitar avalúo</Link>
              </div>
              <div className="flex gap-6 mt-8 text-white/90">
                <div><div className="text-2xl font-extrabold">1,240+</div><div className="text-xs text-white/60">Propiedades vendidas</div></div>
                <div className="w-px bg-white/20"/>
                <div><div className="text-2xl font-extrabold">4.9/5</div><div className="text-xs text-white/60">Satisfacción</div></div>
                <div className="w-px bg-white/20"/>
                <div><div className="text-2xl font-extrabold">15+</div><div className="text-xs text-white/60">Años experiencia</div></div>
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6, delay:0.2}} className="hidden lg:block">
              <div className="bg-white rounded-[24px] p-3 shadow-2xl border border-white/20">
                <div className="rounded-[16px] overflow-hidden relative">
                  <img src="https://placehold.co/700x420/8c6239/ffffff?text=Casa+Destacada" alt="destacada" className="w-full h-[280px] object-cover"/>
                  <div className="absolute bottom-3 left-3 bg-white rounded-xl px-4 py-3 shadow flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f4f1ec] flex items-center justify-center text-[#8c6239]"><BadgeCheck className="w-5 h-5"/></div>
                    <div><div className="text-xs text-stone-500">Avalúo verificado</div><div className="text-sm font-bold text-stone-900">₡245M · Escazú</div></div>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 rounded-xl py-3"><div className="text-sm font-bold">4 hab</div><div className="text-xs text-slate-500">Dormitorios</div></div>
                  <div className="bg-slate-50 rounded-xl py-3"><div className="text-sm font-bold">320 m²</div><div className="text-xs text-slate-500">Construcción</div></div>
                  <div className="bg-slate-50 rounded-xl py-3"><div className="text-sm font-bold flex items-center justify-center gap-1"><TrendingUp className="w-4 h-4 text-emerald-500"/> +8%</div><div className="text-xs text-slate-500">Plusvalía anual</div></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div><h2 className="text-2xl font-extrabold text-stone-900">Propiedades destacadas</h2><p className="text-sm text-stone-500">Selección curada por Terra Capital</p></div>
          <Link to="/propiedades" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[#8c6239] hover:text-[#6b4a2b]">Ver todas <ArrowRight className="w-4 h-4"/></Link>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((p,i)=> <PropertyCard key={p.id} p={p} index={i}/>)}
        </div>
      </section>

      {/* EVALUATION CTA */}
      <section className="bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl font-extrabold text-stone-900">¿Quieres saber cuánto vale tu propiedad?</h2>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">Tasadores certificados Terra Capital realizan estudio comparativo, inspección física y análisis legal para entregarte un avalúo comercial real, no una estimación automática. Todo queda registrado en el panel SuperAdmin.</p>
            <ul className="mt-6 space-y-3">
              {[
                {title:'Inspección presencial', desc:'Visita de tasador certificado en 48h'},
                {title:'Reporte legal y comparativo', desc:'Con datos del Registro y mercado real'},
                {title:'Entrega en 24-72h', desc:'Documento válido para bancos y trámites'},
              ].map(s=>(
                <li key={s.title} className="flex gap-3 bg-white border border-stone-200 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-full bg-[#f4f1ec] flex items-center justify-center shrink-0"><Search className="w-5 h-5 text-[#8c6239]"/></div>
                  <div><div className="font-semibold text-sm text-stone-900">{s.title}</div><div className="text-xs text-stone-500">{s.desc}</div></div>
                </li>
              ))}
            </ul>
          </div>
          <EvaluationForm compact/>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <PeritoSection/>
        <Testimonials/>
      </div>
    </div>
  )
}
