import React from 'react';
import { Search, MapPin, Home, DollarSign, BedDouble, RefreshCw, Layers } from 'lucide-react';
import { SearchFilters, PropertyType, TransactionType } from '../types';

interface PropertyFiltersProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  locations: string[];
}

export default function PropertyFilters({ filters, setFilters, locations }: PropertyFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTransactionChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      transaction_type: prev.transaction_type === type ? '' : type,
      rental_period: type === 'alquiler' ? prev.rental_period : '',
    }));
  };

  const handleRentalPeriodChange = (period: string) => {
    setFilters((prev) => ({
      ...prev,
      rental_period: prev.rental_period === period ? '' : period,
    }));
  };

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      property_type: '',
      transaction_type: '',
      rental_period: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      floors: '',
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm mb-8" id="search-filter-card">
      {/* Título de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-stone-900">Encuentra tu propiedad ideal</h2>
          <p className="text-xs text-stone-500 mt-0.5">Filtra por compra/alquiler, plantas/niveles, ubicación, precio y tipo de inmueble</p>
        </div>
        
        {/* Botón de reinicio rápido */}
        <button
          onClick={handleReset}
          className="self-start sm:self-center flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-amber-700 transition-colors cursor-pointer bg-stone-50 hover:bg-amber-50 px-3 py-1.5 rounded-full border border-stone-200/65"
          id="btn-reset-filters"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Restablecer Filtros</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Campo de búsqueda por texto */}
        <div className="md:col-span-4 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Palabra clave</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleChange}
              placeholder="Buscar por ID (ej. MAG-1001), título..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 transition-all focus:border-amber-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600"
              id="filter-input-search"
            />
          </div>
        </div>

        {/* Tipo de Transacción: Venta / Alquiler */}
        <div className="md:col-span-5 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Tipo de Operación</label>
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, transaction_type: '' }))}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !filters.transaction_type
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              id="filter-btn-todas-operaciones"
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => handleTransactionChange('venta')}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filters.transaction_type === 'venta'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              id="filter-btn-venta"
            >
              Venta
            </button>
            <button
              type="button"
              onClick={() => handleTransactionChange('alquiler')}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filters.transaction_type === 'alquiler'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              id="filter-btn-alquiler"
            >
              Alquiler
            </button>
          </div>

          {/* Sub-filtro de frecuencia si está seleccionado Alquiler */}
          {filters.transaction_type === 'alquiler' && (
            <div className="flex gap-1 mt-1.5 bg-amber-50/80 p-1 rounded-xl border border-amber-200/80">
              <button
                type="button"
                onClick={() => handleRentalPeriodChange('')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                  !filters.rental_period
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-900 hover:bg-amber-100'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => handleRentalPeriodChange('mes')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                  filters.rental_period === 'mes'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-900 hover:bg-amber-100'
                }`}
              >
                Por Mes
              </button>
              <button
                type="button"
                onClick={() => handleRentalPeriodChange('dia')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                  filters.rental_period === 'dia'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-900 hover:bg-amber-100'
                }`}
              >
                Por Día / Airbnb
              </button>
            </div>
          )}
        </div>

        {/* Ubicación */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Ubicación</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <select
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-8 text-sm text-stone-900 transition-all focus:border-amber-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
              id="filter-select-location"
            >
              <option value="">Todas las zonas</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tipo de Propiedad */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Tipo de Inmueble</label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <select
              name="property_type"
              value={filters.property_type}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-8 text-sm text-stone-900 transition-all focus:border-amber-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
              id="filter-select-type"
            >
              <option value="">Todos los tipos</option>
              <option value="casa">Casa / Cabaña / Quinta</option>
              <option value="apartamento">Apartamento</option>
              <option value="lote">Lote de Terreno</option>
              <option value="local">Local Comercial</option>
              <option value="oficina">Oficina</option>
            </select>
          </div>
        </div>

        {/* Pisos / Plantas */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Plantas / Niveles</label>
          <div className="relative">
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <select
              name="floors"
              value={filters.floors || ''}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-8 text-sm text-stone-900 transition-all focus:border-amber-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
              id="filter-select-floors"
            >
              <option value="">Cualquier planta</option>
              <option value="1">1 Planta o más</option>
              <option value="2">2 Plantas o más</option>
              <option value="3">3 Plantas o más</option>
            </select>
          </div>
        </div>

        {/* Habitaciones */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Habitaciones</label>
          <div className="relative">
            <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-8 text-sm text-stone-900 transition-all focus:border-amber-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
              id="filter-select-bedrooms"
            >
              <option value="">Cualquiera</option>
              <option value="1">1+ hab</option>
              <option value="2">2+ hab</option>
              <option value="3">3+ hab</option>
              <option value="4">4+ hab</option>
            </select>
          </div>
        </div>

        {/* Precio Mínimo */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Precio Min</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min"
              min="0"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-900 placeholder-stone-400 transition-all focus:border-amber-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600"
              id="filter-input-minprice"
            />
          </div>
        </div>

        {/* Precio Máximo */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Precio Max</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max"
              min="0"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-900 placeholder-stone-400 transition-all focus:border-amber-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600"
              id="filter-input-maxprice"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
