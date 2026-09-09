import AboutSection from '../components/AboutSection'

export default function About(){
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-stone-900">Sobre Viva Costa Rica — Costa Rica</h1>
        <p className="text-sm text-stone-500 mt-2">Transparencia y cercanía desde Occidente</p>
      </div>
      <AboutSection/>
      <div className="mt-8 bg-white border border-stone-200 rounded-2xl p-6 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-stone-900">Nuestro enfoque</h3>
          <ul className="text-sm text-stone-600 mt-2 space-y-1 list-disc list-inside">
            <li>Propiedades verificadas en Costa Rica, Occidente y GAM</li>
            <li>Avalúos con metodología profesional y trazabilidad digital</li>
            <li>Asesoría cercana para inversionistas y familias</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-stone-900">Historia desde Occidente</h3>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">Base Costa Rica de Alajuela. El portal nace para dar trazabilidad digital a tu patrimonio: presupuesto transparente desde Costa Rica, avalúo GRATIS si envías fotos/datos y con desplazamiento solo tras pago.</p>
        </div>
      </div>
      <p className="text-xs text-stone-400 text-center mt-6">Detalle pericial completo disponible solo en panel SuperAdmin (/admin/login).</p>
    </div>
  )
}

