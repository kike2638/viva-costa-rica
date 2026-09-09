import { useMemo } from 'react';
import { PRICE_RANGES } from '../utils/constants';
import { useStore } from '../store';
import { usePropiedadStore } from '../store/propiedades';

export const useFilteredProperties = () => {
  const { filters } = useStore();
  const { propiedades } = usePropiedadStore();
  // Mapea AdminPropiedad -> Property shape para filtros existentes
  const mapped = useMemo(()=> propiedades.map(p=> ({
    id: p.id, title: p.titulo, location: p.ubicacion, city: p.ciudad, price: p.precioVenta, priceLabel: `₡${p.precioVenta.toLocaleString('es-CR')}`,
    type: p.tipo as any, status: 'venta' as const, bedrooms: p.habitaciones, bathrooms: p.banos, area: p.area, year: 2024,
    image: p.imagenUrl, images: [p.imagenUrl], featured: p.destacada, description: p.descripcion, amenities: [], lat: 10.09, lng: -84.47
  })), [propiedades]);
  return useMemo(() => {
    const range = PRICE_RANGES[filters.priceIdx];
    return mapped.filter((p:any) => {
      if (filters.type !== 'todos' && p.type !== filters.type) return false;
      if (filters.location !== 'todos' && p.city !== filters.location) return false;
      if (p.price < range.min || p.price > range.max) return false;
      if (filters.bedrooms !== 'todos' && String(p.bedrooms) !== filters.bedrooms) return false;
      if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase()) && !p.location.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters, mapped]);
};
