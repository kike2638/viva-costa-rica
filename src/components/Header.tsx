import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Phone, Heart, Search, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { useAuthStore } from '../store/auth'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/propiedades', label: 'Propiedades' },
  { to: '/evaluacion', label: 'Avalúos' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { filters, setFilters, favorites } = useStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="bg-[#1a120e] text-white text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <span className="flex items-center gap-2 text-stone-200"><Phone className="w-4 h-4"/> +506 2222-3333 · info@vivacostarica.com · Costa Rica</span>
          <span className="text-stone-400 flex items-center gap-3">Base Costa Rica · Lun-Vie 8am-6pm {isAuthenticated && <Link to="/admin" className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Shield className="w-3 h-3"/> Panel Admin</Link>}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-[68px] gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo-viva-horizontal.svg" alt="Viva Costa Rica - Your Home in Paradise" className="h-11 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} className={({isActive})=> `px-4 py-2 rounded-full text-sm font-medium transition ${isActive? 'bg-[#1a120e] text-white':'text-stone-700 hover:bg-stone-100'}`}>{l.label}</NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"/>
              <input value={filters.search} onChange={e=> setFilters({search: e.target.value})} onKeyDown={e=> e.key==='Enter' && navigate('/propiedades')} placeholder="Buscar por ubicación o título..." className="w-full pl-9 pr-4 py-2.5 bg-stone-100 rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#a67c52] border border-transparent focus:border-[#e8ddd0] placeholder:text-stone-400"/>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/propiedades" className="relative hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-full border border-stone-200 text-sm font-medium hover:bg-stone-50">
              <Heart className="w-4 h-4 text-stone-600"/> <span className="hidden xl:inline">Favoritos</span> {favorites.length>0 && <span className="bg-[#8c6239] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{favorites.length}</span>}
            </Link>
            {isAuthenticated && <Link to="/admin" className="hidden md:inline-flex bg-[#1a120e] text-white px-4 py-2.5 rounded-full text-sm font-semibold">Panel</Link>}
            <Link to="/evaluacion" className="hidden md:inline-flex bg-gradient-to-r from-[#8c6239] to-[#4a3320] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow hover:shadow-md transition">
              Solicitar avalúo
            </Link>
            <button onClick={()=>setOpen(!open)} className="lg:hidden p-2 rounded-full border border-stone-200">
              {open? <X className="w-5 h-5"/>:<Menu className="w-5 h-5"/>}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="lg:hidden border-t border-stone-200 bg-white overflow-hidden">
            <div className="px-4 py-4 space-y-2">
              <input value={filters.search} onChange={e=> setFilters({search:e.target.value})} placeholder="Buscar..." className="w-full px-4 py-2.5 bg-stone-100 rounded-xl text-sm outline-none"/>
              {links.map(l=> <NavLink key={l.to} to={l.to} onClick={()=>setOpen(false)} className={({isActive})=>`block px-4 py-3 rounded-xl text-sm font-medium ${isActive?'bg-[#1a120e] text-white':'bg-stone-50 text-stone-700'}`}>{l.label}</NavLink>)}
              <Link to="/evaluacion" onClick={()=>setOpen(false)} className="block text-center bg-[#8c6239] text-white px-4 py-3 rounded-xl font-semibold">Solicitar avalúo</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

