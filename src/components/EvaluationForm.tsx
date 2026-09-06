import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useState, useMemo } from 'react'
import { CheckCircle2, Loader2, Info, CreditCard, MapPin, Clock, Shield } from 'lucide-react'
import { useAvaluoStore } from '../store/avaluos'
import { AVALUO_MODALIDADES, calcularCostoAvaluo, getDesplazamientoCosto, type AvaluoModalidad } from '../utils/constants'

const schema = Yup.object({
  nombre: Yup.string().min(2,'Mínimo 2 caracteres').required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
  telefono: Yup.string().min(8,'Teléfono inválido').required('Requerido'),
  direccion: Yup.string().required('Requerido'),
  superficie: Yup.number().typeError('Debe ser número').positive().required('Requerido'),
  tipo: Yup.string().required('Requerido'),
  modalidad: Yup.string().required('Requerido'),
  descripcion: Yup.string().min(10,'Describe mejor').required('Requerido'),
})

export default function EvaluationForm({ compact=false }: { compact?: boolean }) {
  const [ok, setOk] = useState(false)
  const [newId, setNewId] = useState<string>('')
  const [lastCosto, setLastCosto] = useState<number>(0)
  const [lastModalidad, setLastModalidad] = useState<AvaluoModalidad>('virtual')
  const addAvaluo = useAvaluoStore(s=>s.addAvaluo)

  return (
    <div className={`bg-white border border-stone-200 rounded-2xl shadow-sm p-6 ${compact?'':''}`}>
      <h3 className="font-bold text-stone-900 text-lg">Solicitar avalúo — Terra Capital</h3>
      <p className="text-sm text-stone-500 mb-4">Elige la modalidad. La estimación virtual es gratis; la visita presencial incluye desplazamiento.</p>
      {ok ? (
        <div className="py-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto"/>
          <div className="font-semibold text-stone-900 mt-3">¡Solicitud registrada!</div>
          <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-mono">ID: {newId}</div>
          {lastModalidad==='virtual' ? (
            <p className="text-sm text-stone-600 mt-3">Modalidad <b>Virtual — GRATIS</b>. Recibirás un rango estimado por email en 24h (no válido para bancos).</p>
          ) : (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-left text-sm">
              <div className="font-semibold text-amber-900">Avalúo {lastModalidad==='hipotecario'?'Hipotecario':'Presencial'} — Costo: <span className="text-[#8c6239]">₡{lastCosto.toLocaleString('es-CR')}</span></div>
              <p className="text-xs text-amber-800 mt-1">Queda en estado <b>pendiente de pago</b>. Nuestro equipo te contactará con link de pago (SINPE / tarjeta / transferencia). La visita se agenda <b>solo después del pago</b> para cubrir desplazamiento y tiempo del tasador.</p>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="flex items-center gap-1"><CreditCard className="w-3 h-3"/> SINPE Móvil 8888-9999</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3"/> Factura electrónica</span>
              </div>
            </div>
          )}
          <button onClick={()=> setOk(false)} className="mt-4 text-[#8c6239] text-sm font-semibold">Enviar otra solicitud</button>
        </div>
      ) : (
      <Formik initialValues={{nombre:'', email:'', telefono:'', direccion:'', superficie:'', tipo:'casa', modalidad:'virtual' as AvaluoModalidad, descripcion:'', urgencia:'normal', aceptaCosto:false}} validationSchema={schema} onSubmit={(values, {setSubmitting, resetForm})=>{
        const costo = calcularCostoAvaluo(values.modalidad as AvaluoModalidad, values.direccion, values.urgencia as any)
        const despl = values.modalidad==='virtual' ? 0 : getDesplazamientoCosto(values.direccion)
        setTimeout(()=>{
          const id = addAvaluo({
            nombre: values.nombre, email: values.email, telefono: values.telefono,
            direccion: values.direccion, superficie: Number(values.superficie), tipo: values.tipo,
            descripcion: values.descripcion, modalidad: values.modalidad, urgencia: values.urgencia as any,
            costoTotal: costo, desplazamientoCosto: despl, metodoPago: '' as any
          })
          setNewId(id); setLastCosto(costo); setLastModalidad(values.modalidad)
          setSubmitting(false); setOk(true); resetForm();
        }, 700)
      }}>
        {({isSubmitting, values})=>{
          const costoPreview = useMemo(()=> calcularCostoAvaluo(values.modalidad as AvaluoModalidad, values.direccion || '', values.urgencia as any), [values.modalidad, values.direccion, values.urgencia])
          const desplPreview = values.modalidad==='virtual' ? 0 : getDesplazamientoCosto(values.direccion || '')
          const base = AVALUO_MODALIDADES.find(m=>m.value===values.modalidad)
          return (
          <Form className="grid gap-4">
            {/* MODALIDAD */}
            <div>
              <label className="text-xs font-semibold">Modalidad de avalúo *</label>
              <div className="grid gap-2 mt-2">
                {AVALUO_MODALIDADES.map(m=>(
                  <label key={m.value} className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition ${values.modalidad===m.value? 'bg-[#1a120e] text-white border-[#1a120e]' : 'bg-stone-50 border-stone-200 hover:bg-white'}`}>
                    <Field type="radio" name="modalidad" value={m.value} className="mt-1"/>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{m.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${m.value==='virtual' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>{m.badge}</span>
                      </div>
                      <div className={`text-xs mt-0.5 ${values.modalidad===m.value ? 'text-stone-300':'text-stone-500'}`}>{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-2 bg-sky-50 border border-sky-200 rounded-xl p-3 flex gap-2 text-xs text-sky-800">
                <Info className="w-4 h-4 shrink-0"/><span><b>¿Por qué no es gratis con visita?</b> El desplazamiento, combustible, tiempo del tasador y reporte CFIA tienen costo. La visita solo se agenda tras el pago; si cancelas antes, se reembolsa el 100%.</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold">Nombre completo</label><Field name="nombre" placeholder="Ej. Juan Pérez" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#a67c52]"/><ErrorMessage name="nombre" component="div" className="text-xs text-rose-500 mt-1"/></div>
              <div><label className="text-xs font-semibold">Email</label><Field name="email" placeholder="juan@email.com" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#a67c52]"/><ErrorMessage name="email" component="div" className="text-xs text-rose-500 mt-1"/></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold">Teléfono</label><Field name="telefono" placeholder="+506 8888 8888" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"/><ErrorMessage name="telefono" component="div" className="text-xs text-rose-500 mt-1"/></div>
              <div><label className="text-xs font-semibold">Tipo de propiedad</label><Field as="select" name="tipo" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"><option value="casa">Casa</option><option value="apartamento">Apartamento</option><option value="condo">Condominio</option><option value="lote">Lote</option><option value="villa">Villa</option></Field></div>
            </div>
            <div><label className="text-xs font-semibold">Dirección completa</label><Field name="direccion" placeholder="Provincia, cantón, distrito, señas exactas" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"/><ErrorMessage name="direccion" component="div" className="text-xs text-rose-500 mt-1"/><div className="text-xs text-stone-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> El costo de desplazamiento se calcula según esta dirección</div></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold">Superficie (m²)</label><Field name="superficie" placeholder="Ej. 250" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"/><ErrorMessage name="superficie" component="div" className="text-xs text-rose-500 mt-1"/></div>
              <div><label className="text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3"/> Urgencia</label><Field as="select" name="urgencia" className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"><option value="normal">Normal (72h)</option><option value="express">Express 24h (+30%)</option></Field></div>
            </div>

            {/* CALCULADORA */}
            <div className="bg-stone-900 text-white rounded-xl p-4">
              <div className="text-xs text-stone-400 uppercase tracking-widest">Resumen de costo — {base?.label}</div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between"><span>Base</span><span>₡{(base?.basePrice||0).toLocaleString('es-CR')}</span></div>
                {values.modalidad!=='virtual' && <div className="flex justify-between"><span>Desplazamiento ({values.direccion || '—'})</span><span>₡{desplPreview.toLocaleString('es-CR')}</span></div>}
                {values.urgencia==='express' && values.modalidad!=='virtual' && <div className="flex justify-between text-amber-300"><span>Express +30%</span><span>₡{Math.round((base?.basePrice||0)*0.3).toLocaleString('es-CR')}</span></div>}
                <div className="flex justify-between font-extrabold text-lg border-t border-white/20 pt-2 mt-2"><span>Total a pagar</span><span className={costoPreview===0?'text-emerald-400':'text-[#d4a574]'}>{costoPreview===0?'GRATIS':`₡${costoPreview.toLocaleString('es-CR')}`}</span></div>
              </div>
              {costoPreview>0 && <p className="text-xs text-stone-400 mt-2">* Se paga <b>antes</b> de la visita. Incluye factura electrónica. Métodos: SINPE Móvil, tarjeta, transferencia.</p>}
              {costoPreview===0 && <p className="text-xs text-emerald-300 mt-2">* Estimación referencial gratuita, no válida para trámite bancario.</p>}
            </div>

            {costoPreview>0 && <label className="flex gap-2 items-start text-xs text-stone-600 bg-amber-50 border border-amber-200 rounded-xl p-3"><Field type="checkbox" name="aceptaCosto" required className="mt-0.5"/><span>Entiendo que este avalúo tiene costo de <b>₡{costoPreview.toLocaleString('es-CR')}</b> y que la visita se agenda solo tras el pago. Acepto ser contactado para coordinar pago y fecha.</span></label>}

            <div><label className="text-xs font-semibold">Descripción</label><Field as="textarea" name="descripcion" rows={3} placeholder="Habitaciones, estado, acabados, año..." className="w-full mt-1 px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm"/><ErrorMessage name="descripcion" component="div" className="text-xs text-rose-500 mt-1"/></div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8c6239] to-[#4a3320] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin"/>}{isSubmitting? 'Registrando...' : costoPreview===0 ? 'Solicitar estimación gratis' : `Solicitar avalúo — ₡${costoPreview.toLocaleString('es-CR')}`}
            </button>
            <p className="text-xs text-stone-400 text-center">Al enviar aceptas política de privacidad · Queda registrado en SuperAdmin con control de pago</p>
          </Form>
          )}}
      </Formik>
      )}
    </div>
  )
}
