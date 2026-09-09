import { create } from 'zustand'
import type { AvaluoModalidad } from '../utils/constants'

export type AvaluoStatus = 'pendiente' | 'pendiente_pago' | 'pagado' | 'en_revision' | 'visita_agendada' | 'tasado' | 'entregado' | 'rechazado'
export type PagoStatus = 'no_aplica' | 'pendiente' | 'pagado' | 'reembolsado'

export interface Avaluo {
  id: string
  createdAt: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  superficie: number
  tipo: string
  descripcion: string
  modalidad: AvaluoModalidad
  urgencia: 'normal' | 'express'
  numeroPlano?: string
  folioReal?: string
  areaTerreno?: number
  areaConstruccion?: number
  anioConstruccion?: number
  materiales?: string
  usoSuelo?: string
  tieneConstruccion: boolean
  status: AvaluoStatus
  pagoStatus: PagoStatus
  costoTotal: number
  desplazamientoCosto: number
  metodologia: string
  documentos: Record<string, string> // ahora URLs de Vercel Blob o filenames
  docCompletitud: number
  valorEstimado?: number
  tasador?: string
  fechaVisita?: string
  notas?: string
  metodoPago?: 'sinpe' | 'tarjeta' | 'transferencia' | ''
}

type State = {
  avaluos: Avaluo[]
  loading: boolean
  error: string | null
  loadAvaluos: () => Promise<void>
  addAvaluo: (a: Omit<Avaluo,'id'|'createdAt'|'status'|'pagoStatus'> & { _files?: Record<string, File> }) => Promise<string>
  updateAvaluo: (id: string, patch: Partial<Avaluo>) => Promise<void>
  deleteAvaluo: (id: string) => Promise<void>
  uploadFile: (file: File, avaluoId: string) => Promise<string> // devuelve URL Blob
}

const seed: Avaluo[] = [
  { id:'AV-1001', createdAt: new Date(Date.now()-86400000*2).toISOString(), nombre:'María Fernández', email:'maria@email.com', telefono:'+506 8888 1111', direccion:'Costa Rica Centro, casa 320m²', superficie:320, tipo:'casa', descripcion:'Casa 4 hab, lujo', modalidad:'virtual', urgencia:'normal', numeroPlano:'A-123456-2024', folioReal:'1-123456-000', areaTerreno:320, areaConstruccion:210, anioConstruccion:2018, materiales:'Block + teja', usoSuelo:'Residencial', tieneConstruccion:true, status:'entregado', pagoStatus:'no_aplica', costoTotal:0, desplazamientoCosto:0, metodologia:'Comparación de Mercado (5-8 comparables)', documentos:{ plano:'plano-1001.pdf', literal:'literal-1001.pdf', cedula:'cedula-1001.pdf'}, docCompletitud:100, valorEstimado:245000000, tasador:'Ing. Patricia Mora Soto' },
  { id:'AV-1002', createdAt: new Date(Date.now()-86400000*1).toISOString(), nombre:'Carlos Méndez', email:'carlos@email.com', telefono:'+506 8888 2222', direccion:'Heredia Centro, apto 12B', superficie:115, tipo:'apartamento', descripcion:'Penthouse', modalidad:'presencial', urgencia:'express', numeroPlano:'A-987654-2023', folioReal:'1-987654-000', areaTerreno:115, areaConstruccion:115, anioConstruccion:2022, materiales:'Concreto', usoSuelo:'Residencial', tieneConstruccion:true, status:'pendiente_pago', pagoStatus:'pendiente', costoTotal:76500, desplazamientoCosto:18000, metodologia:'Comparación de Mercado (5-8 comparables)', documentos:{ plano:'plano-1002.pdf'}, docCompletitud:33, tasador:'Ing. Patricia Mora Soto' },
  { id:'AV-1003', createdAt: new Date().toISOString(), nombre:'Ana Soto', email:'ana@email.com', telefono:'+506 8888 3333', direccion:'Curridabat, lote 450m²', superficie:450, tipo:'lote', descripcion:'Lote esquinero', modalidad:'hipotecario', urgencia:'normal', numeroPlano:'A-456789-2024', folioReal:'1-456789-000', areaTerreno:450, areaConstruccion:0, anioConstruccion:0, materiales:'', usoSuelo:'Residencial', tieneConstruccion:false, status:'pagado', pagoStatus:'pagado', costoTotal:120000, desplazamientoCosto:25000, metodologia:'Comparación + Costo', documentos:{ plano:'plano-1003.pdf', literal:'literal-1003.pdf', cedula:'cedula-1003.pdf', impuesto:'impuesto-1003.pdf'}, docCompletitud:80, valorEstimado:72000000, tasador:'Ing. Patricia Mora Soto', fechaVisita: new Date(Date.now()+86400000*2).toISOString().slice(0,10), metodoPago:'sinpe' },
]

const API = '/api/avaluos'
const LS_KEY = 'viva-avaluos-v1' // fallback si no hay Postgres

function loadLS(): Avaluo[] {
  try { const raw = localStorage.getItem(LS_KEY); if(raw) return JSON.parse(raw); } catch {}
  return seed
}
function saveLS(arr: Avaluo[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch {}
}

export const useAvaluoStore = create<State>()((set, get) => ({
  avaluos: loadLS(),
  loading: false,
  error: null,

  loadAvaluos: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error(`GET ${res.status}`)
      const data = await res.json()
      // Vercel Postgres devuelve rows con snake_case, mapeamos a camel
      const mapped: Avaluo[] = Array.isArray(data) && data.length ? data.map((r:any)=> ({
        id: r.id,
        createdAt: r.created_at || r.createdAt,
        nombre: r.nombre, email: r.email, telefono: r.telefono,
        direccion: r.direccion, superficie: r.superficie, tipo: r.tipo,
        descripcion: r.descripcion, modalidad: r.modalidad, urgencia: r.urgencia,
        status: r.status, pagoStatus: r.pago_status || r.pagoStatus,
        costoTotal: r.costo_total ?? r.costoTotal, desplazamientoCosto: r.desplazamiento_costo ?? r.desplazamientoCosto,
        metodologia: r.metodologia, docCompletitud: r.doc_completitud ?? r.docCompletitud,
        documentos: typeof r.documentos === 'string' ? JSON.parse(r.documentos) : (r.documentos||{}),
        numeroPlano: r.numero_plano || r.numeroPlano, folioReal: r.folio_real || r.folioReal,
        areaTerreno: r.area_terreno ?? r.areaTerreno, areaConstruccion: r.area_construccion ?? r.areaConstruccion,
        anioConstruccion: r.anio_construccion ?? r.anioConstruccion, materiales: r.materiales, usoSuelo: r.uso_suelo || r.usoSuelo,
        tieneConstruccion: r.tiene_construccion ?? r.tieneConstruccion, valorEstimado: r.valor_estimado ?? r.valorEstimado,
        tasador: r.tasador, fechaVisita: r.fecha_visita || r.fechaVisita, notas: r.notas, metodoPago: r.metodo_pago || r.metodoPago,
      })) : loadLS()
      if (mapped.length) { set({ avaluos: mapped }); saveLS(mapped) }
    } catch (e:any) {
      set({ error: String(e.message||e) })
      // fallback ya está en state
    } finally { set({ loading: false }) }
  },

  uploadFile: async (file: File, avaluoId: string) => {
    // Intenta Vercel Blob, fallback a filename local
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&avaluoId=${avaluoId}`, {
        method: 'POST',
        body: file,
      })
      if (!res.ok) throw new Error(`Blob ${res.status}`)
      const { url } = await res.json()
      return url as string
    } catch {
      return file.name
    }
  },

  addAvaluo: async (data) => {
    const { _files, ...clean } = data as any
    const pagoStatus: PagoStatus = clean.modalidad==='virtual' ? 'no_aplica' : 'pendiente'
    const status: AvaluoStatus = clean.modalidad==='virtual' ? 'pendiente' : 'pendiente_pago'
    // sube archivos a Blob si hay File objects
    let documentos: Record<string,string> = { ...(clean.documentos||{}) }
    if (_files) {
      const tempId = `AV-${Date.now().toString().slice(-6)}`
      for (const [k, f] of Object.entries(_files as Record<string, File>)) {
        if (f) documentos[k] = await get().uploadFile(f as File, tempId)
      }
    }
    const payload = { ...clean, documentos, status, pagoStatus }
    try {
      const res = await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error(`POST ${res.status}`)
      const { id } = await res.json()
      const nuevo: Avaluo = { id, createdAt: new Date().toISOString(), status, pagoStatus, ...clean, documentos } as Avaluo
      const next = [nuevo, ...get().avaluos]
      set({ avaluos: next }); saveLS(next)
      return id
    } catch (e) {
      // fallback localStorage si no hay DB
      const id = `AV-${1000 + get().avaluos.length + 1}-${Math.floor(Math.random()*90+10)}`
      const nuevo: Avaluo = { id, createdAt: new Date().toISOString(), status, pagoStatus, ...clean, documentos } as Avaluo
      const next = [nuevo, ...get().avaluos]
      set({ avaluos: next }); saveLS(next)
      return id
    }
  },

  updateAvaluo: async (id, patch) => {
    const prev = get().avaluos
    const next = prev.map(a=> a.id===id ? {...a, ...patch}: a)
    set({ avaluos: next }); saveLS(next)
    try {
      await fetch(API, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, ...patch }) })
    } catch {}
  },

  deleteAvaluo: async (id) => {
    const next = get().avaluos.filter(a=> a.id!==id)
    set({ avaluos: next }); saveLS(next)
    try { await fetch(`${API}?id=${id}`, { method:'DELETE' }) } catch {}
  },
}))
