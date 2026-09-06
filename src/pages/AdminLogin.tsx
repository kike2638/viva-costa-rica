import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Mountain, Lock, Mail, ArrowLeft, Shield } from 'lucide-react'
import { useAuthStore } from '../store/auth'

const schema = Yup.object({ email: Yup.string().email('Email inválido').required('Requerido'), password: Yup.string().required('Requerido') })

export default function AdminLogin(){
  const login = useAuthStore(s=>s.login)
  const isAuth = useAuthStore(s=>s.isAuthenticated)
  const [err,setErr]=useState('')
  const nav = useNavigate()
  if(isAuth) { setTimeout(()=> nav('/admin'),0); return null }

  return (
    <div className="min-h-[calc(100vh-68px)] grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-stone-50">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6"><ArrowLeft className="w-4 h-4"/> Volver al sitio</Link>
          <div className="bg-white border border-stone-200 rounded-[24px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#1a120e] flex items-center justify-center text-white"><Shield className="w-5 h-5"/></div>
              <div><div className="font-extrabold">TERRA CAPITAL</div><div className="text-xs tracking-widest text-stone-500">SUPERADMIN</div></div>
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900 mt-4">Acceso SuperAdmin</h1>
            <p className="text-sm text-stone-500 mt-1">Panel exclusivo para gestión de avalúos reales</p>

            <Formik initialValues={{email:'', password:''}} validationSchema={schema} onSubmit={(v,{setSubmitting})=>{
              setErr('')
              const ok = login(v.email, v.password)
              setSubmitting(false)
              if(ok) nav('/admin')
              else setErr('Credenciales inválidas')
            }}>
              {({isSubmitting})=>(
                <Form className="grid gap-4 mt-6">
                  <div>
                    <label className="text-xs font-semibold">Email</label>
                    <div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"/><Field name="email" placeholder="admin@terracapital.cr" className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#a67c52]"/></div>
                    <ErrorMessage name="email" component="div" className="text-xs text-rose-500 mt-1"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Contraseña</label>
                    <div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"/><Field name="password" type="password" placeholder="••••••••" className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#a67c52]"/></div>
                    <ErrorMessage name="password" component="div" className="text-xs text-rose-500 mt-1"/>
                  </div>
                  {err && <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{err}</div>}
                  <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-[#1a120e] text-white font-semibold hover:bg-black transition">Ingresar al panel</button>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
                    <b>Demo:</b> <br/>Email: <code>admin@terracapital.cr</code><br/>Pass: <code>Terra2026</code>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex bg-[#1a120e] text-white relative overflow-hidden items-center p-12">
        <img src="https://placehold.co/900x900/1a120e/d4a574?text=TERRA+CAPITAL" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20"/>
        <div className="relative">
          <Mountain className="w-12 h-12 text-[#d4a574]"/>
          <h2 className="text-4xl font-extrabold mt-4 leading-tight">Gestión real<br/>de avalúos certificados</h2>
          <p className="text-stone-300 mt-3 text-sm max-w-md leading-relaxed">Workflow completo: recepción → revisión → tasación → entrega. Con trazabilidad, asignación de tasador y valor comercial validado.</p>
          <ul className="mt-6 space-y-2 text-sm text-stone-300">
            <li>✓ Persistencia local (Zustand) lista para conectar a Supabase/REST</li>
            <li>✓ Roles y protección de rutas</li>
            <li>✓ Export y reportes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
