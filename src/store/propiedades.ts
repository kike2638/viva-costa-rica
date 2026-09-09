import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PROPERTIES as SEED } from '../utils/constants'

export type Operacion = 'venta' | 'alquiler'
export interface AdminPropiedad {
  id: string
  titulo: string
  ubicacion: string
  ciudad: string
  tipo: string
  operacion: Operacion
  precioVenta: number // precio que pone el cliente (asking)
  valorAvaluo?: number // valor técnico perito (referencia)
  habitaciones: number
  banos: number
  area: number
  descripcion: string
  imagenUrl: string
  imagenes: string[] // galería (placehold ficticias, borrables)
  videos: string[] // URLs blob o youtube
  destacada: boolean
  disponible: boolean
  createdAt: string
}

const mapSeed = (): AdminPropiedad[] => SEED.map(p=> ({
  id: p.id, titulo: p.title, ubicacion: p.location, ciudad: p.city, tipo: p.type,
  operacion: 'venta' as Operacion, precioVenta: p.price, valorAvaluo: p.price,
  habitaciones: p.bedrooms, banos: p.bathrooms, area: p.area, descripcion: p.description,
  imagenUrl: p.image, imagenes: p.images?.length ? p.images : [p.image], videos: [], destacada: !!p.featured, disponible: true, createdAt: new Date().toISOString()
}))

type State = {
  propiedades: AdminPropiedad[]
  addPropiedad: (p: Omit<AdminPropiedad,'id'|'createdAt'>) => string
  updatePropiedad: (id:string, patch: Partial<AdminPropiedad>) => void
  deletePropiedad: (id:string) => void
}

export const usePropiedadStore = create<State>()(persist((set,get)=> ({
  propiedades: mapSeed(),
  addPropiedad: (p) => {
    const id = `P-${Date.now().toString().slice(-6)}`
    const nuevo = { id, createdAt: new Date().toISOString(), ...p }
    set({ propiedades: [nuevo, ...get().propiedades] })
    return id
  },
  updatePropiedad: (id, patch) => set({ propiedades: get().propiedades.map(x=> x.id===id ? {...x,...patch}: x)}),
  deletePropiedad: (id) => set({ propiedades: get().propiedades.filter(x=> x.id!==id)}),
}), { name: 'terra-propiedades-v2-galeria' }))

export const getDesfase = (p: AdminPropiedad) => {
  if(!p.valorAvaluo) return null
  return ((p.precioVenta - p.valorAvaluo)/p.valorAvaluo)*100
}
