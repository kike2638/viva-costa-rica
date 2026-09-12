export type PropertyType = 'casa' | 'apartamento' | 'lote' | 'local' | 'oficina';
export type TransactionType = 'venta' | 'alquiler';
export type PropertyStatus = 'disponible' | 'reservada' | 'vendida';
export type CurrencyType = 'USD' | 'CRC';

export type RentalPeriod = 'mes' | 'dia';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: CurrencyType;
  property_type: PropertyType;
  transaction_type: TransactionType;
  rental_period?: RentalPeriod; // 'mes' o 'dia' cuando transaction_type es 'alquiler'
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  floors?: number; // Número de plantas / niveles / pisos
  land_area_sqm: number; // Terreno m²
  building_area_sqm: number; // Construcción m²
  location: string;
  latitude?: number;
  longitude?: number;
  map_link?: string;
  images: string[];
  featured: boolean;
  features?: string[];
  website_url?: string;
  video_url?: string; // URL de video (YouTube / Vimeo / Video Dron)
  virtual_tour_360_url?: string; // URL de Tour Virtual 360° interactivo (Matterport, Kuula, etc.)
  created_at?: string;
}

export interface SearchFilters {
  searchQuery: string;
  property_type: string;
  transaction_type: string;
  rental_period?: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  floors?: string;
}
