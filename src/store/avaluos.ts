import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
  // Datos registrales y constructivos (para avalúo completo)
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
  documentos: Record<string, string>
  docCompletitud: number
  valorEstimado?: number
  tasador?: string
  fechaVisita?: string
  notas?: string
  metodoPago?: 'sinpe' | 'tarjeta' | 'transferencia' | ''
}

type State = {
  avaluos: Avaluo[]
  addAvaluo: (a: Omit<Avaluo,'id'|'createdAt'|'status'|'pagoStatus'>) => string
  updateAvaluo: (id: string, patch: Partial<Avaluo>) => void
  deleteAvaluo: (id: string) => void
}

const seed: Avaluo[] = [
  { id:'AV-1001', createdAt: new Date(Date.now()-86400000*2).toISOString(), nombre:'María Fernández', email:'maria@email.com', telefono:'+506 8888 1111', direccion:'San Ramón Centro, casa 320m²', superficie:320, tipo:'casa', descripcion:'Casa 4 hab, lujo', modalidad:'virtual', urgencia:'normal', numeroPlano:'A-123456-2024', folioReal:'1-123456-000', areaTerreno:320, areaConstruccion:210, anioConstruccion:2018, materiales:'Block + teja', usoSuelo:'Residencial', tieneConstruccion:true, status:'entregado', pagoStatus:'no_aplica', costoTotal:0, desplazamientoCosto:0, metodologia:'Comparación de Mercado (5-8 comparables)', documentos:{ plano:'plano-1001.pdf', literal:'literal-1001.pdf', cedula:'cedula-1001.pdf'}, docCompletitud:100, valorEstimado:245000000, tasador:'Ing. Patricia Mora Soto' },
  { id:'AV-1002', createdAt: new Date(Date.now()-86400000*1).toISOString(), nombre:'Carlos Méndez', email:'carlos@email.com', telefono:'+506 8888 2222', direccion:'Heredia Centro, apto 12B', superficie:115, tipo:'apartamento', descripcion:'Penthouse', modalidad:'presencial', urgencia:'express', numeroPlano:'A-987654-2023', folioReal:'1-987654-000', areaTerreno:115, areaConstruccion:115, anioConstruccion:2022, materiales:'Concreto', usoSuelo:'Residencial', tieneConstruccion:true, status:'pendiente_pago', pagoStatus:'pendiente', costoTotal:76500, desplazamientoCosto:18000, metodologia:'Comparación de Mercado (5-8 comparables)', documentos:{ plano:'plano-1002.pdf'}, docCompletitud:33, tasador:'Ing. Patricia Mora Soto' },
  { id:'AV-1003', createdAt: new Date().toISOString(), nombre:'Ana Soto', email:'ana@email.com', telefono:'+506 8888 3333', direccion:'Curridabat, lote 450m²', superficie:450, tipo:'lote', descripcion:'Lote esquinero', modalidad:'hipotecario', urgencia:'normal', numeroPlano:'A-456789-2024', folioReal:'1-456789-000', areaTerreno:450, areaConstruccion:0, anioConstruccion:0, materiales:'', usoSuelo:'Residencial', tieneConstruccion:false, status:'pagado', pagoStatus:'pagado', costoTotal:120000, desplazamientoCosto:25000, metodologia:'Comparación + Costo', documentos:{ plano:'plano-1003.pdf', literal:'literal-1003.pdf', cedula:'cedula-1003.pdf', impuesto:'impuesto-1003.pdf'}, docCompletitud:80, valorEstimado:72000000, tasador:'Ing. Patricia Mora Soto', fechaVisita: new Date(Date.now()+86400000*2).toISOString().slice(0,10), metodoPago:'sinpe' },
]

export const useAvaluoStore = create<State>()(persist((set,get)=> ({
  avaluos: seed,
  addAvaluo: (data) => {
    const id = `AV-${1000 + get().avaluos.length + 1}-${Math.floor(Math.random()*90+10)}`
    // lógica de pago: virtual = no_aplica/entregado directo, presencial/hipotecario = pendiente_pago
    const pagoStatus: PagoStatus = data.modalidad==='virtual' ? 'no_aplica' : 'pendiente'
    const status: AvaluoStatus = data.modalidad==='virtual' ? 'pendiente' : 'pendiente_pago'
    const nuevo: Avaluo = { id, createdAt: new Date().toISOString(), status, pagoStatus, ...data }
    set({ avaluos: [nuevo, ...get().avaluos] })
    return id
  },
  updateAvaluo: (id, patch) => set({ avaluos: get().avaluos.map(a=> a.id===id ? {...a, ...patch}: a)}),
  deleteAvaluo: (id) => set({ avaluos: get().avaluos.filter(a=> a.id!==id)}),
}), { name: 'terra-avaluos-v5-completo' }))
