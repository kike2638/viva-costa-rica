import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Building2, LogOut, Home } from 'lucide-react'
import { useAuthStore } from '../store/auth'

export default function AdminLayout({children}:{children:React.ReactNode}){
  const { user, logout } = useAuthStore()
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-stone-50 flex">
      <aside className="w-[260px] bg-[#1a120e] text-stone-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-icon.svg" alt="Terra Capital" className="w-9 h-9 rounded-xl" />
            <div><div className="font-extrabold text-white leading-none">TERRA CAPITAL</div><div className="text-xs tracking-widest text-stone-400">SUPERADMIN</div></div>
          </Link>
          <div className="mt-4 text-xs text-stone-400">{user?.email}</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/admin" end className={({isActive})=> `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive?'bg-white text-[#1a120e]':'text-stone-300 hover:bg-white/10 hover:text-white'}`}><LayoutDashboard className="w-4 h-4"/> Dashboard</NavLink>
          <NavLink to="/admin/avaluos" className={({isActive})=> `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive?'bg-white text-[#1a120e]':'text-stone-300 hover:bg-white/10 hover:text-white'}`}><ClipboardList className="w-4 h-4"/> Avalúos</NavLink>
          <NavLink to="/admin/propiedades" className={({isActive})=> `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive?'bg-white text-[#1a120e]':'text-stone-300 hover:bg-white/10 hover:text-white'}`}><Building2 className="w-4 h-4"/> Propiedades</NavLink>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white"><Home className="w-4 h-4"/> Ver sitio</Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={()=>{logout(); nav('/admin/login')}} className="w-full flex items-center gap-2 justify-center py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold"><LogOut className="w-4 h-4"/> Cerrar sesión</button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden bg-[#1a120e] text-white flex items-center justify-between px-4 py-3">
          <span className="font-bold">TERRA CAPITAL · Admin</span>
          <button onClick={()=>{logout(); nav('/admin/login')}} className="text-xs bg-white/20 px-3 py-1.5 rounded-full">Salir</button>
        </div>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
