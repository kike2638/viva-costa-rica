import ContactForm from '../components/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Contact(){
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900">Contáctanos — San Ramón</h1>
            <p className="text-sm text-stone-500 mt-2">Base San Ramón de Alajuela · Cobertura Occidente y todo el país (costo de desplazamiento según zona)</p>
          </div>

          <div className="grid gap-3">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f4f1ec] flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-[#8c6239]"/></div>
              <div><div className="text-sm font-semibold text-stone-900">Oficina central</div><div className="text-sm text-stone-600">San Ramón, Alajuela, Costa Rica<br/>100m norte del Parque Central — Oficina Terra Capital</div></div>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-emerald-600"/></div>
              <div><div className="text-sm font-semibold text-stone-900">Teléfono / WhatsApp</div><div className="text-sm text-stone-600">+506 2222-3333 · +506 8888-9999</div></div>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-amber-600"/></div>
              <div><div className="text-sm font-semibold text-stone-900">Email</div><div className="text-sm text-stone-600">info@terracapital.cr · avalúos@terracapital.cr</div></div>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-stone-600"/></div>
              <div><div className="text-sm font-semibold text-stone-900">Horario</div><div className="text-sm text-stone-600">Lun-Vie 8am-6pm · Sáb 9am-1pm · Base San Ramón</div></div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-stone-200 h-[320px] bg-stone-100">
            <iframe title="mapa San Ramón" src="https://www.openstreetmap.org/export/embed.html?bbox=-84.52%2C10.06%2C-84.42%2C10.12&layer=mapnik&marker=10.09%2C-84.47" className="w-full h-full border-0"/>
          </div>
          <p className="text-xs text-stone-500">📍 Mapa centrado en San Ramón. El costo de desplazamiento se calcula desde aquí.</p>
        </div>

        <ContactForm/>
      </div>
    </div>
  )
}
