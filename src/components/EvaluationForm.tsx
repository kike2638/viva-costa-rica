import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useState, useMemo } from 'react'
import { CheckCircle2, Loader2, MapPin, Clock, Upload, Award } from 'lucide-react'
import { useAvaluoStore } from '../store/avaluos'
import { AVALUO_MODALIDADES, calcularCostoAvaluo, getDesplazamientoCosto, getMetodologiaRecomendada, DOCS_REQUERIDOS, type AvaluoModalidad } from '../utils/constants'

const schema = Yup.object({
  nombre: Yup.string().min(2,'Mínimo 2').required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
  telefono: Yup.string().min(8,'Teléfono inválido').required('Requerido'),
  direccion: Yup.string().required('Requerido'),
  superficie: Yup.number().typeError('Número').positive().required('Requerido'),
  tipo: Yup.string().required('Requerido'),
  modalidad: Yup.string().required('Requerido'),
  descripcion: Yup.string().min(10,'Describe mejor').required('Requerido'),
  numeroPlano: Yup.string().optional(),
  folioReal: Yup.string().optional(),
  areaConstruccion: Yup.number().typeError('Número').min(0).optional(),
})

export default function EvaluationForm({ compact=false }: { compact?: boolean }) {
  const [ok, setOk] = useState(false)
  const [newId, setNewId] = useState<string>('')
  const [lastCosto, setLastCosto] = useState<number>(0)
  const [lastModalidad, setLastModalidad] = useState<AvaluoModalidad>('virtual')
  const [files, setFiles] = useState<Record<string,string>>({})
  const addAvaluo = useAvaluoStore(s=>s.addAvaluo)
  const onFile = (key:string, e:any) => { const f=e.target.files?.[0]; if(f) setFiles(p=> ({...p, [key]: f.name})) }

  return (
    <div className={`bg-white border border-stone-200 rounded-2xl shadow-sm p-6 ${compact?'':''}`}>
      <h3 className="font-bold text-stone-900 text-lg">Solicitar avalúo — Terra Capital</h3>
      <p className="text-sm text-stone-500 mb-4">Avalúo completo requiere plano <b>o</b> N° registro + datos de construcción</p>
      {ok ? (
        <div className="py-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto"/>
          <div className="font-semibold text-stone-900 mt-3">¡Solicitud registrada!</div>
          <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-mono">ID: {newId}</div>
          {lastModalidad==='virtual' ? <p className="text-sm text-stone-600 mt-3">Virtual <b>GRATIS</b> (fotos/datos) — sin desplazamiento San Ramón.</p> : <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-left text-sm"><div className="font-semibold text-amber-900">Avalúo {lastModalidad==='hipotecario'?'Hipotecario':'Presencial'} — <span className="text-[#8c6239]">₡{lastCosto.toLocaleString('es-CR')}</span></div><p className="text-xs text-amber-800 mt-1">Pendiente de pago. Tras pago asignamos perito 20 años y agendamos visita.</p></div>}
          <button onClick={()=> {setOk(false); setFiles({})}} className="mt-4 text-[#8c6239] text-sm font-semibold">Enviar otra</button>
        </div>
      ) : (
      <Formik initialValues={{nombre:'', email:'', telefono:'', direccion:'', superficie:'', tipo:'casa', modalidad:'virtual' as AvaluoModalidad, descripcion:'', urgencia:'normal', numeroPlano:'', folioReal:'', areaTerreno:'', areaConstruccion:'', anioConstruccion:'', materiales:'', usoSuelo:'Residencial', tieneConstruccion:true}} validationSchema={schema} onSubmit={(values, {setSubmitting, resetForm})=>{
        const costo = calcularCostoAvaluo(values.modalidad as AvaluoModalidad, values.direccion, values.urgencia as any)
        const despl = values.modalidad==='virtual' ? 0 : getDesplazamientoCosto(values.direccion)
        const metodologia = getMetodologiaRecomendada(values.tipo, values.modalidad as AvaluoModalidad)
        const reqKeys = DOCS_REQUERIDOS.filter(d=>d.required).map(d=>d.key)
        // para avalúo completo: plano archivo O numeroPlano+folioReal cuenta como cumplido para 'plano'/'literal'
        const hasPlano = !!files['plano'] || !!values.numeroPlano
        const hasLiteral = !!files['literal'] || !!values.folioReal
        const docOk = (k:string)=> { if(k==='plano') return hasPlano; if(k==='literal') return hasLiteral; return !!files[k] }
        const completitud = reqKeys.length ? Math.round((reqKeys.filter(k=> docOk(k)).length / reqKeys.length)*100) : 100
        setTimeout(()=>{
          const id = addAvaluo({
            nombre: values.nombre, email: values.email, telefono: values.telefono,
            direccion: values.direccion, superficie: Number(values.superficie), tipo: values.tipo,
            descripcion: values.descripcion, modalidad: values.modalidad, urgencia: values.urgencia as any,
            numeroPlano: values.numeroPlano, folioReal: values.folioReal,
            areaTerreno: values.areaTerreno ? Number(values.areaTerreno) : Number(values.superficie),
            areaConstruccion: values.areaConstruccion ? Number(values.areaConstruccion) : 0,
            anioConstruccion: values.anioConstruccion ? Number(values.anioConstruccion) : undefined,
            materiales: values.materiales, usoSuelo: values.usoSuelo, tieneConstruccion: values.tieneConstruccion,
            costoTotal: costo, desplazamientoCosto: despl, metodologia, documentos: {...files, ...(values.numeroPlano?{numeroPlano: values.numeroPlano}:{}), ...(values.folioReal?{folioReal: values.folioReal}:{})}, docCompletitud: completitud, metodoPago: '' as any
          })
          setNewId(id); setLastCosto(costo); setLastModalidad(values.modalidad); setSubmitting(false); setOk(true); resetForm(); setFiles({});
        }, 700)
      }}>
        {({isSubmitting, values})=>{
          const costoPreview = useMemo(()=> calcularCostoAvaluo(values.modalidad as AvaluoModalidad, values.direccion || '', values.urgencia as any), [values.modalidad, values.direccion, values.urgencia])
          const desplPreview = values.modalidad==='virtual' ? 0 : getDesplazamientoCosto(values.direccion || '')
          const base = AVALUO_MODALIDADES.find(m=>m.value===values.modalidad)
          const metodologia = getMetodologiaRecomendada(values.tipo, values.modalidad as AvaluoModalidad)
          const hasPlano = !!files['plano'] || !!values.numeroPlano
          const hasLiteral = !!files['literal'] || !!values.folioReal
          const missing = []
          if(!files['fotos']) missing.push('Fotos')
          if(!hasPlano) missing.push('Plano o N° plano')
          if(!hasLiteral) missing.push('Literal o folio real')
          if(!files['cedula']) missing.push('Cédula')
          return (
          <Form className="grid gap-4">
            <div>
              <label className="text-xs font-semibold">Modalidad *</label>
              <div className="grid gap-2 mt-2">
                {AVALUO_MODALIDADES.map(m=>(
                  <label key={m.value} className={`flex gap-3 p-3 rounded-xl border cursor-pointer ${values.modalidad===m.value? 'bg-[#1a120e] text-white border-[#1a120e]' : 'bg-stone-50 border-stone-200'}`}>
                    <Field type="radio" name="modalidad" value={m.value} className="mt-1"/>
                    <div className="flex-1"><div className="flex items-center gap-2"><span className="font-semibold text-sm">{m.label}</span><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${m.value==='virtual'?'bg-emerald-500 text-white':'bg-amber-500 text-white'}`}>{m.badge}</span></div><div className={`text-xs mt-0.5 ${values.modalidad===m.value?'text-stone-300':'text-stone-500'}`}>{m.desc}</div></div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-[#f4f1ec] border border-[#e8ddd0] rounded-xl p-3 flex gap-2">
              <Award className="w-5 h-5 text-[#8c6239] shrink-0"/>
              <div><div className="text-xs font-semibold">Metodología IVS auto</div><div className="text-sm font-bold text-[#8c6239]">{metodologia}</div><div className="text-xs text-stone-600">Según tipo {values.tipo} y modalidad.</div></div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold">Nombre *</label><Field name="nombre" placeholder="Juan Pérez" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#a67c52]"/><ErrorMessage name="nombre" component="div" className="text-xs text-rose-500 mt-1"/></div>
              <div><label className="text-xs font-semibold">Email *</label><Field name="email" placeholder="juan@email.com" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"/><ErrorMessage name="email" component="div" className="text-xs text-rose-500 mt-1"/></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold">Teléfono *</label><Field name="telefono" placeholder="+506 8888 8888" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"/><ErrorMessage name="telefono" component="div" className="text-xs text-rose-500 mt-1"/></div>
              <div><label className="text-xs font-semibold">Tipo *</label><Field as="select" name="tipo" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"><option value="casa">Casa</option><option value="apartamento">Apartamento</option><option value="condo">Condominio</option><option value="lote">Lote</option><option value="villa">Villa</option></Field></div>
            </div>
            <div><label className="text-xs font-semibold">Dirección *</label><Field name="direccion" placeholder="Cantón, distrito, señas" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"/><ErrorMessage name="direccion" component="div" className="text-xs text-rose-500 mt-1"/><div className="text-xs text-stone-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Desde San Ramón</div></div>

            {/* Datos registrales — simplificado para gratis */}
            <div className={`border rounded-xl p-4 ${values.modalidad==='virtual' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className={`font-semibold text-sm ${values.modalidad==='virtual' ? 'text-emerald-900' : 'text-amber-900'}`}>
                {values.modalidad==='virtual' ? 'Datos mínimos — avalúo GRATIS' : 'Datos registrales y constructivos — avalúo completo (admin)'}
              </div>
              <p className="text-xs mt-1" style={{color: values.modalidad==='virtual' ? '#065f46' : '#92400e'}}>
                {values.modalidad==='virtual' ? 'Solo fotos + N° plano/folio + superficie. Lo técnico detallado lo completas tú en SuperAdmin.' : 'Carga plano o N° + folio. Construcción con áreas/acabados para medición real (solo SuperAdmin edita a fondo).'}
              </p>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div><label className="text-xs font-semibold">N° Plano</label><Field name="numeroPlano" placeholder="A-123456-2024" className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-xl bg-white text-sm"/><div className="text-xs text-stone-500">o archivo abajo</div></div>
                <div><label className="text-xs font-semibold">Folio real</label><Field name="folioReal" placeholder="1-123456-000" className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-xl bg-white text-sm"/><div className="text-xs text-stone-500">o archivo</div></div>
                <div><label className="text-xs font-semibold">Superficie (m²) *</label><Field name="superficie" placeholder="Ej. 320" className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-xl bg-white text-sm"/><ErrorMessage name="superficie" component="div" className="text-xs text-rose-500 mt-1"/></div>
                <div><label className="text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3"/> Urgencia</label><Field as="select" name="urgencia" className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-xl bg-white text-sm"><option value="normal">Normal (72h)</option><option value="express">Express 24h (+30%)</option></Field></div>
              </div>
              {values.modalidad!=='virtual' && (
                <div className="mt-3 p-3 bg-white border border-stone-200 rounded-xl">
                  <div className="text-xs font-semibold text-stone-700">Parámetros reales medibles — solo SuperAdmin (referencia)</div>
                  <p className="text-xs text-stone-500">Estos los completas tú en panel después de la solicitud: área terreno/construcción, año, materiales, pisos, acabados, uso suelo. Cliente no necesita llenarlos para el gratis.</p>
                </div>
              )}
            </div>

            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
              <div className="font-semibold text-sm flex items-center gap-2"><Upload className="w-4 h-4"/> Archivos — plano o números bastan</div>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                {DOCS_REQUERIDOS.map(d=>{
                  const done = !!files[d.key] || (d.key==='plano' && !!values.numeroPlano) || (d.key==='literal' && !!values.folioReal)
                  return (
                  <label key={d.key} className={`flex flex-col gap-1 p-3 rounded-xl border bg-white ${done?'border-emerald-200':'border-stone-200'}`}>
                    <span className="text-xs font-semibold">{d.label} {done ? <span className="text-emerald-600">✓</span> : <span className="text-stone-400">○</span>} {files[d.key] && <span className="text-emerald-600 text-xs"> {files[d.key]}</span>}</span>
                    <input type="file" accept={d.accept} onChange={e=> onFile(d.key, e)} className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-[#1a120e] file:text-white"/>
                    <span className="text-xs text-stone-400">{(d as any).note || ''}</span>
                  </label>
                )})}
              </div>
              {missing.length>0 && <div className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">Falta para avalúo completo: {missing.join(', ')}. Con plano archivo <i>o</i> N°+folio + fotos es suficiente para virtual gratis.</div>}
              {missing.length===0 && <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2">¡Docs OK para avalúo completo!</div>}
            </div>

            <div className="bg-stone-900 text-white rounded-xl p-4">
              <div className="text-xs text-stone-400 uppercase tracking-widest">Resumen — {base?.label}</div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between"><span>Base</span><span>₡{(base?.basePrice||0).toLocaleString('es-CR')}</span></div>
                {values.modalidad!=='virtual' && <div className="flex justify-between"><span>Desplazamiento ({values.direccion || '—'})</span><span>₡{desplPreview.toLocaleString('es-CR')}</span></div>}
                {values.urgencia==='express' && values.modalidad!=='virtual' && <div className="flex justify-between text-amber-300"><span>Express +30%</span><span>₡{Math.round((base?.basePrice||0)*0.3).toLocaleString('es-CR')}</span></div>}
                <div className="flex justify-between font-extrabold text-lg border-t border-white/20 pt-2 mt-2"><span>Total</span><span className={costoPreview===0?'text-emerald-400':'text-[#d4a574]'}>{costoPreview===0?'GRATIS':`₡${costoPreview.toLocaleString('es-CR')}`}</span></div>
                <div className="text-xs text-stone-400">Metodología: {metodologia}</div>
              </div>
            </div>

            <div><label className="text-xs font-semibold">Descripción *</label><Field as="textarea" name="descripcion" rows={3} placeholder="Detalles: habitaciones, estado, acabados..." className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"/><ErrorMessage name="descripcion" component="div" className="text-xs text-rose-500 mt-1"/></div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8c6239] to-[#4a3320] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin"/>}{isSubmitting? 'Registrando...' : costoPreview===0 ? 'Solicitar estimación gratis' : `Solicitar avalúo — ₡${costoPreview.toLocaleString('es-CR')}`}
            </button>
          </Form>
          )}}
      </Formik>
      )}
    </div>
  )
}
