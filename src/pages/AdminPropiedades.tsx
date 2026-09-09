import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { usePropiedadStore, type AdminPropiedad, getDesfase } from '../store/propiedades'
import { Plus, Trash2, Edit2, Home, MapPin, DollarSign } from 'lucide-react'

export default function AdminPropiedades(){
  const { propiedades, addPropiedad, updatePropiedad, deletePropiedad } = usePropiedadStore()
  const [editing, setEditing] = useState<AdminPropiedad | null>(null)
  const [form, setForm] = useState<Partial<AdminPropiedad>>({
    titulo:'', ubicacion:'San Ramón, Alajuela', ciudad:'San Ramón', tipo:'casa', operacion:'venta',
    precioVenta: 0, valorAvaluo: 0, habitaciones: 3, banos: 2, area: 120, descripcion:'', imagenUrl:'https://placehold.co/800x600/8c6239/fff?text=Nueva', imagenes: [], videos: [], destacada:false, disponible:true
  })

  const onImages = (e:any) => {
    const files = Array.from(e.target.files || []) as File[]
    files.forEach(f=>{
      const r = new FileReader()
      r.onload = () => {
        const url = r.result as string
        setForm(prev=> {
          const imgs = [...(prev.imagenes||[]), url]
          return {...prev, imagenes: imgs, imagenUrl: prev.imagenUrl?.includes('placehold') ? url : prev.imagenUrl }
        })
      }
      r.readAsDataURL(f)
    })
  }
  const onVideos = (e:any) => {
    const files = Array.from(e.target.files || []) as File[]
    files.forEach(f=>{
      const r = new FileReader()
      r.onload = () => setForm(prev=> ({...prev, videos: [...(prev.videos||[]), r.result as string]}))
      r.readAsDataURL(f)
    })
  }
  const submit = () => {
    if(!form.titulo || !form.ubicacion || !form.precioVenta) return alert('Título, ubicación y precio venta son obligatorios')
    const payload:any = {...form}
    if(!payload.imagenes?.length && payload.imagenUrl) payload.imagenes = [payload.imagenUrl]
    if(!payload.imagenUrl && payload.imagenes?.length) payload.imagenUrl = payload.imagenes[0]
    // En Vercel Blob, aquí harías: const {url}= await put(`propiedades/${file.name}`, file, {access:'public'})
    if(editing){
      updatePropiedad(editing.id, payload)
      setEditing(null)
    } else {
      addPropiedad(payload)
    }
    setForm({ titulo:'', ubicacion:'San Ramón, Alajuela', ciudad:'San Ramón', tipo:'casa', operacion:'venta', precioVenta: 0, valorAvaluo: 0, habitaciones: 3, banos: 2, area: 120, descripcion:'', imagenUrl:'https://placehold.co/800x600/8c6239/fff?text=Nueva', imagenes:[], videos:[], destacada:false, disponible:true })
  }

  const startEdit = (p: AdminPropiedad)=> { setEditing(p); setForm({...p}); window.scrollTo({top:0, behavior:'smooth'}) }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-extrabold">Propiedades — SuperAdmin</h1><p className="text-sm text-stone-500">Solo tú editas. Venta y alquiler. Avalúo = referencia técnica, precio venta lo pone el cliente igual (se valida).</p></div>
        <div className="text-xs bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-amber-800">Avalúo ≠ bloqueo: si cliente pide ₡150M y tu avalúo dice ₡130M, igual anuncias en ₡150M pero con alerta “sobrevalorada 15% — riesgo no vende / banco no financia”.</div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6">
        <h3 className="font-bold flex items-center gap-2">{editing? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} {editing ? 'Editar propiedad' : 'Nueva propiedad (venta o alquiler)'}</h3>
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <input placeholder="Título" value={form.titulo||''} onChange={e=> setForm({...form, titulo:e.target.value})} className="px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-sm"/>
          <input placeholder="Ubicación" value={form.ubicacion||''} onChange={e=> setForm({...form, ubicacion:e.target.value})} className="px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-sm"/>
          <select value={form.tipo} onChange={e=> setForm({...form, tipo:e.target.value})} className="px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-sm"><option value="casa">Casa</option><option value="apartamento">Apartamento</option><option value="condo">Condominio</option><option value="lote">Lote</option><option value="villa">Villa</option></select>
          <select value={form.operacion} onChange={e=> setForm({...form, operacion:e.target.value as any})} className="px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-sm"><option value="venta">Venta</option><option value="alquiler">Alquiler</option></select>
          <div><label className="text-xs font-semibold">Precio venta / alquiler (cliente) *</label><input type="number" value={form.precioVenta||0} onChange={e=> setForm({...form, precioVenta: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-sm"/><div className="text-xs text-stone-500">Es el asking price, aunque difiera del avalúo igual se anuncia.</div></div>
          <div><label className="text-xs font-semibold">Valor avalúo técnico (referencia)</label><input type="number" value={form.valorAvaluo||0} onChange={e=> setForm({...form, valorAvaluo: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 border border-emerald-200 rounded-xl bg-emerald-50 text-sm"/><div className="text-xs text-emerald-700">Si lo dejas 0, es “sin avalúo aún” — igual se publica.</div></div>
          <input placeholder="Área m²" type="number" value={form.area||0} onChange={e=> setForm({...form, area: Number(e.target.value)})} className="px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-sm"/>
          <div className="flex gap-2"><input placeholder="Habs" type="number" value={form.habitaciones||0} onChange={e=> setForm({...form, habitaciones: Number(e.target.value)})} className="flex-1 px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-sm"/><input placeholder="Baños" type="number" value={form.banos||0} onChange={e=> setForm({...form, banos: Number(e.target.value)})} className="flex-1 px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-sm"/></div>
          <div className="md:col-span-2 border border-dashed border-stone-300 rounded-xl p-4 bg-stone-50">
            <div className="font-semibold text-sm">Galería — imágenes y videos (ficticias borrables)</div>
            <p className="text-xs text-stone-500">Carga desde tu panel. Las 8 ficticias con placehold.co se pueden eliminar. En Vercel se guardan en Blob (`public.blob.vercel-storage.com`), aquí se previsualizan local.</p>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs font-semibold">Imágenes (múltiple)</label>
                <input type="file" multiple accept="image/*" onChange={onImages} className="w-full mt-1 text-xs file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-[#1a120e] file:text-white"/>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(form.imagenes||[]).map((src,i)=>(
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200">
                      <img src={src} className="w-full h-full object-cover"/>
                      <button type="button" onClick={()=> setForm({...form, imagenes: (form.imagenes||[]).filter((_,j)=> j!==i), imagenUrl: (form.imagenes||[]).filter((_,j)=> j!==i)[0] || 'https://placehold.co/800x600/8c6239/fff?text=Nueva'})} className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-xs">×</button>
                      <button type="button" onClick={()=> setForm({...form, imagenUrl: src})} className={`absolute bottom-1 left-1 text-xs px-1.5 py-0.5 rounded-full ${form.imagenUrl===src?'bg-[#8c6239] text-white':'bg-white/80'}`}>Portada</button>
                    </div>
                  ))}
                </div>
                <input placeholder="o pega URL imagen" value={form.imagenUrl||''} onChange={e=> setForm({...form, imagenUrl:e.target.value})} className="w-full mt-2 px-3 py-2 border border-stone-200 rounded-xl bg-white text-sm"/>
              </div>
              <div>
                <label className="text-xs font-semibold">Videos (mp4, máx 50MB)</label>
                <input type="file" multiple accept="video/*" onChange={onVideos} className="w-full mt-1 text-xs file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-[#1a120e] file:text-white"/>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(form.videos||[]).map((src,i)=>(
                    <div key={i} className="relative w-28 h-20 rounded-xl overflow-hidden border border-stone-200 bg-black flex items-center justify-center">
                      <video src={src} className="w-full h-full object-cover" muted/>
                      <button type="button" onClick={()=> setForm({...form, videos: (form.videos||[]).filter((_,j)=> j!==i)})} className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-xs">×</button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-stone-400 mt-1">En Vercel Blob se guardan como URLs públicas para galería.</p>
              </div>
            </div>
          </div>
          <textarea placeholder="Descripción" value={form.descripcion||''} onChange={e=> setForm({...form, descripcion:e.target.value})} className="md:col-span-2 px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-sm" rows={2}/>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.destacada} onChange={e=> setForm({...form, destacada:e.target.checked})}/> Destacada</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.disponible} onChange={e=> setForm({...form, disponible:e.target.checked})}/> Disponible</label>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={submit} className="px-6 py-2.5 rounded-xl bg-[#1a120e] text-white font-semibold hover:bg-black">{editing?'Guardar cambios':'Agregar propiedad'}</button>
          {editing && <button onClick={()=> {setEditing(null); setForm({ titulo:'', ubicacion:'San Ramón, Alajuela', ciudad:'San Ramón', tipo:'casa', operacion:'venta', precioVenta: 0, valorAvaluo: 0, habitaciones: 3, banos: 2, area: 120, descripcion:'', imagenUrl:'https://placehold.co/800x600/8c6239/fff?text=Nueva', imagenes:[], videos:[], destacada:false, disponible:true })}} className="px-4 py-2.5 rounded-xl border border-stone-200">Cancelar</button>}
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-4">
        <h3 className="font-bold mb-3">Catálogo ({propiedades.length}) — Venta y Alquiler</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {propiedades.map(p=>{
            const desf = getDesfase(p)
            return (
              <div key={p.id} className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50">
                <img src={p.imagenUrl} alt={p.titulo} className="h-36 w-full object-cover"/>
                <div className="p-3">
                  <div className="flex items-center gap-2"><span className={`text-xs px-2 py-1 rounded-full font-bold ${p.operacion==='venta'?'bg-[#1a120e] text-white':'bg-sky-600 text-white'}`}>{p.operacion}</span><span className="text-xs text-stone-500 flex items-center gap-1"><MapPin className="w-3 h-3"/>{p.ubicacion}</span></div>
                  <div className="font-semibold text-sm mt-1">{p.titulo}</div>
                  <div className="text-xs text-stone-600 flex items-center gap-1 mt-1"><Home className="w-3 h-3"/> {p.tipo} · {p.area} m² · {p.habitaciones}h/{p.banos}b</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1 text-sm font-bold"><DollarSign className="w-4 h-4 text-[#8c6239]"/>{p.operacion==='alquiler' ? `₡${p.precioVenta.toLocaleString('es-CR')}/mes` : `₡${p.precioVenta.toLocaleString('es-CR')}`}<span className="text-xs font-normal text-stone-500">(venta cliente)</span></div>
                    {p.valorAvaluo ? <div className="text-xs">Avalúo: <b>₡{p.valorAvaluo.toLocaleString('es-CR')}</b> {desf!==null && <span className={`ml-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${Math.abs(desf)>10 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>{desf>0?'+':''}{desf.toFixed(1)}% {desf>10?'sobrevalorada': desf<-10?'oportunidad':'alineada'}</span>}</div> : <div className="text-xs text-stone-400">Sin avalúo aún — igual se anuncia</div>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={()=> startEdit(p)} className="flex-1 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-semibold hover:bg-stone-50">Editar</button>
                    <button onClick={()=> { if(confirm('¿Eliminar?')) deletePropiedad(p.id)}} className="px-3 py-1.5 rounded-full border border-rose-200 text-rose-600 text-xs hover:bg-rose-50"><Trash2 className="w-3 h-3"/></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}
