import AboutSection from '../components/AboutSection'
import PeritoSection from '../components/PeritoSection'

export default function About(){
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-stone-900">Sobre Terra Capital — San Ramón</h1>
        <p className="text-sm text-stone-500 mt-2">20 años de critério pericial al servicio de tu patrimonio</p>
      </div>
      <PeritoSection/>
      <div className="mt-8">
        <AboutSection/>
      </div>
      <div className="mt-8 bg-white border border-stone-200 rounded-2xl p-6 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-stone-900">Certificaciones 20 años</h3>
          <ul className="text-sm text-stone-600 mt-2 space-y-1 list-disc list-inside">
            <li>CFIA — lista oficial de peritos Dirección Ejecutiva (Art.12 Reglamento Nombramiento)</li>
            <li>IVS Norma N°3 Informes — todo avalúo contiene identificación, variables, metodología y conclusiones</li>
            <li>SUGEF — avalúos hipotecarios independientes, 6 meses vigencia</li>
            <li>Referente nacional: Perito ICO-3075 (44 años/2210 informes) como estándar de experiencia</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-stone-900">Historia desde Occidente</h3>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">Base San Ramón de Alajuela, con 20 años valuando vivienda, fincas y comercio en Occidente (Palmares, Naranjo, Grecia) y GAM. El portal nace para dar trazabilidad digital al peritaje que antes era solo papel: presupuesto transparente desde San Ramón, pago previo a visita y reporte defendible.</p>
        </div>
      </div>
    </div>
  )
}
