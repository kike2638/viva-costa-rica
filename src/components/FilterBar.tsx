import { useStore } from '../store'
import { LOCATIONS, PROPERTY_TYPES, PRICE_RANGES } from '../utils/constants'

export default function FilterBar() {
  const { filters, setFilters, resetFilters } = useStore()
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[160px]">
        <label className="text-xs font-semibold text-slate-600">Tipo</label>
        <select value={filters.type} onChange={e=> setFilters({type:e.target.value})} className="w-full mt-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500">
          {PROPERTY_TYPES.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="text-xs font-semibold text-slate-600">Localidad</label>
        <select value={filters.location} onChange={e=> setFilters({location:e.target.value})} className="w-full mt-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500">
          {LOCATIONS.map(l=> <option key={l} value={l}>{l==='todos'?'Todas':l}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="text-xs font-semibold text-slate-600">Precio</label>
        <select value={filters.priceIdx} onChange={e=> setFilters({priceIdx: Number(e.target.value)})} className="w-full mt-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500">
          {PRICE_RANGES.map((r,i)=> <option key={i} value={i}>{r.label}</option>)}
        </select>
      </div>
      <div className="min-w-[140px]">
        <label className="text-xs font-semibold text-slate-600">Habitaciones</label>
        <select value={filters.bedrooms} onChange={e=> setFilters({bedrooms:e.target.value})} className="w-full mt-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500">
          <option value="todos">Cualquiera</option>
          <option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
        </select>
      </div>
      <button onClick={resetFilters} className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50">Limpiar</button>
    </div>
  )
}
