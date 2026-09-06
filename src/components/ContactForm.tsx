import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'

const schema = Yup.object({
  nombre: Yup.string().required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
  mensaje: Yup.string().min(10,'Mínimo 10 caracteres').required('Requerido'),
})

export default function ContactForm(){
  const [ok,setOk]=useState(false)
  if(ok) return <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center"><CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto"/><div className="font-semibold mt-3">Mensaje enviado</div><p className="text-sm text-slate-500 mt-1">Te responderemos en menos de 4 horas.</p><button onClick={()=>setOk(false)} className="mt-4 text-sky-600 text-sm font-semibold">Enviar otro</button></div>
  return (
    <Formik initialValues={{nombre:'', email:'', mensaje:'', telefono:''}} validationSchema={schema} onSubmit={(_, {setSubmitting, resetForm})=>{
      setTimeout(()=>{setSubmitting(false); setOk(true); resetForm()},800)
    }}>
      {({isSubmitting})=>(
        <Form className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm grid gap-4">
          <h3 className="font-bold text-slate-900">Escríbenos</h3>
          <div><label className="text-xs font-semibold">Nombre</label><Field name="nombre" placeholder="Tu nombre" className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"/><ErrorMessage name="nombre" component="div" className="text-xs text-rose-500 mt-1"/></div>
          <div><label className="text-xs font-semibold">Email</label><Field name="email" placeholder="tu@email.com" className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm"/><ErrorMessage name="email" component="div" className="text-xs text-rose-500 mt-1"/></div>
          <div><label className="text-xs font-semibold">Teléfono (opcional)</label><Field name="telefono" placeholder="+506..." className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm"/></div>
          <div><label className="text-xs font-semibold">Mensaje</label><Field as="textarea" name="mensaje" rows={4} placeholder="¿En qué podemos ayudarte?" className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm"/><ErrorMessage name="mensaje" component="div" className="text-xs text-rose-500 mt-1"/></div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-2">{isSubmitting && <Loader2 className="w-4 h-4 animate-spin"/>}Enviar mensaje</button>
        </Form>
      )}
    </Formik>
  )
}
