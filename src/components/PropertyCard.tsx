import { Bed, Bath, Ruler, MapPin, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Property } from '../utils/constants'
import { useStore } from '../store'

export default function PropertyCard({ p, index=0 }: { p: Property; index?: number }) {
  const { favorites, toggleFavorite } = useStore()
  const fav = favorites.includes(p.id)
  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{delay:index*0.05}} className="group bg-white rounded-[20px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-slate-700 shadow">{p.type}</span>
          {p.featured && <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">Destacada</span>}
        </div>
        <button onClick={()=>toggleFavorite(p.id)} className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur border shadow transition ${fav?'bg-rose-500 border-rose-500 text-white':'bg-white/90 border-white text-slate-600 hover:bg-white'}`}>
          <Heart className={`w-4 h-4 ${fav?'fill-white':''}`}/>
        </button>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="text-white font-bold text-lg">{p.priceLabel}</div>
          <div className="text-white/80 text-xs flex items-center gap-1"><MapPin className="w-3 h-3"/> {p.location}</div>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-slate-900 leading-tight line-clamp-1">{p.title}</h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
          {p.bedrooms>0 && <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-slate-400"/>{p.bedrooms} hab</span>}
          {p.bathrooms>0 && <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-slate-400"/>{p.bathrooms} baños</span>}
          <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-slate-400"/>{p.area} m²</span>
        </div>
        <Link to={`/propiedades/${p.id}`} className="mt-4 inline-flex justify-center items-center gap-2 w-full py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition">Ver detalles</Link>
      </div>
    </motion.div>
  )
}
