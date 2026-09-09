import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import PropertyCard from '../components/PropertyCard'
import { useFilteredProperties } from '../hooks/useFilter'
import { useProperty } from '../hooks/useProperty'
import { Bed, Bath, Ruler, MapPin, Calendar, Award, ArrowLeft, Heart, Share2, Phone, Mail } from 'lucide-react'
import { useStore } from '../store'

export default function Properties(){
  const { id } = useParams()
  if (id) return <PropertyDetail id={id}/>
  return <PropertyList/>
}

function PropertyList(){
  const filtered = useFilteredProperties()
  const [page, setPage] = useState(1)
  const per = 6
  const total = Math.ceil(filtered.length / per)
  const slice = filtered.slice((page-1)*per, page*per)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div><h1 className="text-3xl font-extrabold text-slate-900">Propiedades</h1><p className="text-sm text-slate-500">{filtered.length} resultados · Filtra por tipo, localidad y precio</p></div>
      </div>
      <FilterBar/>
      {filtered.length===0 ? <div className="text-center py-16 text-slate-500">No hay propiedades con esos filtros. <button onClick={()=> location.reload()} className="text-sky-600 font-semibold">Limpiar filtros</button></div> : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {slice.map((p,i)=> <PropertyCard key={p.id} p={p} index={i}/>)}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({length: total}).map((_,i)=>(
              <button key={i} onClick={()=> setPage(i+1)} className={`w-9 h-9 rounded-full text-sm font-semibold border ${page===i+1?'bg-slate-900 text-white border-slate-900':'bg-white border-slate-200 hover:bg-slate-50'}`}>{i+1}</button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function PropertyDetail({ id }: { id: string }){
  const p = useProperty(id)
  const { toggleFavorite, favorites } = useStore()
  const fav = favorites.includes(id)
  if(!p) return <div className="max-w-7xl mx-auto px-4 py-16 text-center">Propiedad no encontrada. <Link to="/propiedades" className="text-sky-600 font-semibold">Volver</Link></div>
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link to="/propiedades" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"><ArrowLeft className="w-4 h-4"/> Volver a propiedades</Link>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img src={p.images[0]} alt={p.title} className="w-full h-[420px] object-cover"/>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {p.images.slice(1).map((img:any,i:number)=> <img key={i} src={img} alt="" className="h-28 w-full object-cover rounded-xl border border-slate-200"/>)}
          </div>
          <div className="mt-6">
            <h1 className="text-2xl font-extrabold text-slate-900">{p.title}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1"><MapPin className="w-4 h-4"/> {p.location} · <Calendar className="w-4 h-4"/> {p.year}</div>
            <p className="text-sm text-slate-600 leading-relaxed mt-4">{p.description} Área total {p.area} m² con acabados premium, iluminación natural y distribución funcional. Ideal para familia o inversión.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {p.amenities.map((a:any)=> <span key={a} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-700">{a}</span>)}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-[88px]">
            <div className="text-3xl font-extrabold text-slate-900">{p.priceLabel}</div>
            <div className="text-xs text-slate-500">Valor comercial estimado · Inspección incluida</div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center"><Bed className="w-5 h-5 mx-auto text-slate-500"/><div className="text-sm font-bold mt-1">{p.bedrooms || '-'}</div><div className="text-xs text-slate-500">Habs</div></div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center"><Bath className="w-5 h-5 mx-auto text-slate-500"/><div className="text-sm font-bold mt-1">{p.bathrooms || '-'}</div><div className="text-xs text-slate-500">Baños</div></div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center"><Ruler className="w-5 h-5 mx-auto text-slate-500"/><div className="text-sm font-bold mt-1">{p.area}</div><div className="text-xs text-slate-500">m²</div></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={()=> toggleFavorite(p.id)} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 ${fav?'bg-rose-50 border-rose-200 text-rose-600':'bg-white border-slate-200 hover:bg-slate-50'}`}><Heart className={`w-4 h-4 ${fav?'fill-rose-500':''}`}/>{fav?'Guardado':'Guardar'}</button>
              <button className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"><Share2 className="w-4 h-4"/></button>
            </div>
            <div className="grid gap-2 mt-4">
              <a href="tel:+50622223333" className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2"><Phone className="w-4 h-4"/> Llamar ahora</a>
              <a href="mailto:info@valoracr.com" className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-2"><Mail className="w-4 h-4"/> Contactar agente</a>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2"><Award className="w-4 h-4"/> Valoración verificada por tasador CFIA</div>
          </div>
        </div>
      </div>
    </div>
  )
}
