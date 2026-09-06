import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '../utils/constants'

export default function Testimonials() {
  return (
    <section className="py-14">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">Lo que dicen nuestros clientes</h2>
        <p className="text-slate-500 mt-2">Historias reales de familias que encontraron su hogar con nosotros</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map(t=>(
          <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
            <Quote className="absolute top-4 right-4 w-8 h-8 text-sky-100"/>
            <div className="flex gap-1 mb-3">{Array.from({length:t.stars}).map((_,i)=><Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}</div>
            <p className="text-sm text-slate-600 leading-relaxed">“{t.text}”</p>
            <div className="flex items-center gap-3 mt-5">
              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full"/>
              <div><div className="text-sm font-semibold text-slate-900">{t.name}</div><div className="text-xs text-slate-500">{t.role}</div></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
