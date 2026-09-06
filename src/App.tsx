import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Properties from './pages/Properties'
import Evaluation from './pages/Evaluation'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { useAuthStore } from './store/auth'

function Protected({children}:{children:React.ReactNode}){
  const isAuth = useAuthStore(s=>s.isAuthenticated)
  const loc = useLocation()
  if(!isAuth) return <Navigate to="/admin/login" state={{from: loc}} replace/>
  return <>{children}</>
}

function PublicLayout(){
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header/>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/propiedades" element={<Properties/>}/>
          <Route path="/propiedades/:id" element={<Properties/>}/>
          <Route path="/evaluacion" element={<Evaluation/>}/>
          <Route path="/sobre" element={<About/>}/>
          <Route path="/contacto" element={<Contact/>}/>
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="*" element={<div className="max-w-7xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">Página no encontrada</h1></div>}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Protected><AdminDashboard mode="dashboard"/></Protected>}/>
        <Route path="/admin/avaluos" element={<Protected><AdminDashboard mode="list"/></Protected>}/>
        <Route path="/*" element={<PublicLayout/>}/>
      </Routes>
    </BrowserRouter>
  )
}
