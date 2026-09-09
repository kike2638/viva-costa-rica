import { usePropiedadStore } from '../store/propiedades';

export const useProperty = (id?: string) => {
  if (!id) return undefined;
  const { propiedades } = usePropiedadStore.getState();
  const p = propiedades.find(x=> x.id===id);
  if(!p) return undefined;
  return {
    id: p.id, title: p.titulo, location: p.ubicacion, city: p.ciudad, price: p.precioVenta, priceLabel: `₡${p.precioVenta.toLocaleString('es-CR')}`,
    type: p.tipo, status: 'venta', bedrooms: p.habitaciones, bathrooms: p.banos, area: p.area, year: 2024,
    image: p.imagenUrl, images: (p as any).imagenes?.length ? (p as any).imagenes : [p.imagenUrl], featured: p.destacada,
    description: p.descripcion, amenities: [], lat:10.09, lng:-84.47
  } as any;
};
