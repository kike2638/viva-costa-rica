import AboutSection from '../components/AboutSection'

export default function About(){
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Sobre ValoraCR</h1>
        <p className="text-sm text-slate-500 mt-2">Transparencia, precisión y cercanía humana</p>
      </div>
      <AboutSection/>
      <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-slate-900">Certificaciones</h3>
          <ul className="text-sm text-slate-600 mt-2 space-y-1 list-disc list-inside">
            <li>CFIA - Colegio Federado de Ingenieros y Arquitectos (Tasadores)</li>
            <li>CCSS - Peritos valuadores autorizados para créditos hipotecarios</li>
            <li>CCCBR - Cámara Costarricense de Corredores de Bienes Raíces</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Nuestra historia</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">Fundada en 2009 en San José, ValoraCR nació para resolver la asimetría de información en el mercado inmobiliario costarricense. Hoy operamos en 7 provincias con 25 colaboradores.</p>
        </div>
      </div>
    </div>
  )
}
