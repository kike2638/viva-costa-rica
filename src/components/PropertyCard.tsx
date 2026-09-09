import { Bed, Bath, Ruler, MapPin, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Property } from '../utils/constants'
import { useStore } from '../store'

export default function PropertyCard({ p, index=0 }: { p: Property; index?: number }) {
  const { favorites, toggleFavorite } = useStore()
  const fav = favorites.includes(p.id)
  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{delay:index*0.05}} className="group bg-white rounded-[22px] overflow-hidden border border-stone-200 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-700" loading="lazy"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90"/>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold tracking-wide text-stone-800 shadow">{p.type}</span>
          {p.featured && <span className="bg-[#8c6239] text-white px-3 py-1 rounded-full text-xs font-bold shadow">Destacada</span>}
        </div>
        <button onClick={()=>toggleFavorite(p.id)} className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur border shadow transition ${fav?'bg-rose-500 border-rose-500 text-white':'bg-white/90 border-white text-stone-600 hover:bg-white'}`}>
          <Heart className={`w-4 h-4 ${fav?'fill-white':''}`}/>
        </button>
        <div className="absolute bottom-0 inset-x-0 p-4">
          <div className="text-white font-extrabold text-xl tracking-tight" style={{fontFamily:'Playfair Display, serif'}}>{p.priceLabel}</div>
          <div className="text-white/90 text-xs flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {p.location}</div>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-stone-900 leading-tight line-clamp-1" style={{fontFamily:'Playfair Display, serif'}}>{p.title}</h3>
        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{p.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-stone-600">
          {p.bedrooms>0 && <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-stone-400"/>{p.bedrooms} hab</span>}
          {p.bathrooms>0 && <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-stone-400"/>{p.bathrooms} baños</span>}
          <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-stone-400"/>{p.area} m²</span>
        </div>
        <div className="flex gap-2 mt-4">
          <Link to={`/propiedades/${p.id}`} className="flex-1 inline-flex justify-center items-center gap-2 py-2.5 rounded-full bg-[#1a120e] text-white text-sm font-semibold hover:bg-black transition">Ver detalles</Link>
          {(p as any).videos?.length >0 && <span className="px-3 py-2 rounded-full bg-stone-100 border border-stone-200 text-xs">Video</span>}
        </div>
        <div className="text-xs text-stone-400 mt-2 text-center">Ficticia — bórrala en SuperAdmin y sube real</div>
      </div>
    </motion.div>
  )
}
