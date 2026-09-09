import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1a120e] text-stone-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-terra-blanco.svg" alt="Terra Capital" className="h-12 w-auto bg-white/5 rounded-xl p-1" />
              <div><div className="font-extrabold tracking-tight">TERRA CAPITAL</div><div className="text-xs tracking-widest text-stone-400">TU HOGAR EMPIEZA AQUÍ</div></div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">Base San Ramón de Alajuela. Avalúos certificados en Occidente y todo Costa Rica. Más de 15 años respaldando tu patrimonio.</p>
            <div className="flex gap-2 mt-4">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon,i)=> <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#8c6239] transition"><Icon className="w-4 h-4"/></a>)}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/" className="hover:text-white">Inicio</Link></li>
              <li><Link to="/propiedades" className="hover:text-white">Propiedades</Link></li>
              <li><Link to="/evaluacion" className="hover:text-white">Avalúos</Link></li>
              <li><Link to="/sobre" className="hover:text-white">Sobre nosotros</Link></li>
              <li><Link to="/contacto" className="hover:text-white">Contacto</Link></li>
              <li><span className="text-stone-600 text-xs">Acceso privado SuperAdmin: /admin/login</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>Avalúo comercial</li><li>Avalúo hipotecario</li><li>Asesoría de inversión</li><li>Gestión de alquileres</li><li>Marketing inmobiliario</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-[#d4a574]"/> San Ramón, Alajuela, Costa Rica<br/>100m norte del Parque Central — Oficina Terra Capital</li>
              <li className="flex gap-2 items-center"><Phone className="w-4 h-4 text-[#d4a574]"/> +506 2222-3333 · San Ramón base</li>
              <li className="flex gap-2 items-center"><Mail className="w-4 h-4 text-[#d4a574]"/> info@terracapital.cr</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} Terra Capital. Todos los derechos reservados.</span>
          <span className="flex gap-4"><a href="#" className="hover:text-white">Privacidad</a><a href="#" className="hover:text-white">Términos</a><a href="#" className="hover:text-white">Aviso legal</a></span>
        </div>
      </div>
    </footer>
  )
}
