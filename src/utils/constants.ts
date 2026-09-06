export type PropertyType = 'casa' | 'apartamento' | 'condo' | 'lote' | 'villa';
export type PropertyStatus = 'venta' | 'alquiler' | 'vendido';

export interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  priceLabel: string;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number;
  year: number;
  image: string;
  images: string[];
  featured?: boolean;
  description: string;
  amenities: string[];
  lat: number;
  lng: number;
}

export const PROPERTY_TYPES: { value: PropertyType | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'condo', label: 'Condominio' },
  { value: 'lote', label: 'Lote' },
  { value: 'villa', label: 'Villa' },
];

export const LOCATIONS = ['todos', 'San Ramón', 'Palmares', 'Naranjo', 'Grecia', 'Alajuela', 'San José', 'Escazú', 'Santa Ana', 'Heredia', 'Cartago', 'Jacó'];

export const PRICE_RANGES = [
  { label: 'Cualquier precio', min: 0, max: Infinity },
  { label: '₡ 30M - 80M', min: 30_000_000, max: 80_000_000 },
  { label: '₡ 80M - 150M', min: 80_000_000, max: 150_000_000 },
  { label: '₡ 150M - 300M', min: 150_000_000, max: 300_000_000 },
  { label: '₡ 300M+', min: 300_000_000, max: Infinity },
];

export const PROPERTIES: Property[] = [
  {
    id: '1', title: 'Casa Moderna en Escazú', location: 'Escazú, San José', city: 'Escazú',
    price: 245_000_000, priceLabel: '₡245,000,000', type: 'casa', status: 'venta',
    bedrooms: 4, bathrooms: 3, area: 320, year: 2021,
    image: 'https://placehold.co/800x600/0ea5e9/ffffff?text=Casa+Escazu',
    images: ['https://placehold.co/800x600/0ea5e9/ffffff?text=Casa+Escazu+1','https://placehold.co/800x600/38bdf8/ffffff?text=Interior','https://placehold.co/800x600/0284c7/ffffff?text=Jardin'],
    featured: true, description: 'Espectacular casa moderna con acabados de lujo, amplia terraza y jardín privado. Ubicada en condominio cerrado con seguridad 24/7.',
    amenities: ['Piscina','Gimnasio','BBQ','Garaje 2 autos','Seguridad'], lat: 9.92, lng: -84.14
  },
  {
    id: '2', title: 'Apartamento Sky Loft Santa Ana', location: 'Santa Ana, San José', city: 'Santa Ana',
    price: 138_000_000, priceLabel: '₡138,000,000', type: 'apartamento', status: 'venta',
    bedrooms: 2, bathrooms: 2, area: 115, year: 2023,
    image: 'https://placehold.co/800x600/f59e0b/ffffff?text=Loft+Santa+Ana',
    images: ['https://placehold.co/800x600/f59e0b/ffffff?text=Loft'], featured: true,
    description: 'Apartamento tipo loft con doble altura, ventanales de piso a techo y vista panorámica al Valle Central.',
    amenities: ['Rooftop','Cowork','Piscina','Pet friendly'], lat: 9.93, lng: -84.18
  },
  {
    id: '3', title: 'Villa Campestre en Heredia', location: 'San Rafael, Heredia', city: 'Heredia',
    price: 320_000_000, priceLabel: '₡320,000,000', type: 'villa', status: 'venta',
    bedrooms: 5, bathrooms: 4, area: 480, year: 2019,
    image: 'https://placehold.co/800x600/10b981/ffffff?text=Villa+Heredia',
    images: ['https://placehold.co/800x600/10b981/ffffff?text=Villa'], featured: true,
    description: 'Villa campestre rodeada de naturaleza, con piscina infinita y vistas al volcán Barva.',
    amenities: ['Piscina infinita','Viñedo','Caballeriza','Rancho BBQ'], lat: 10.02, lng: -84.10
  },
  {
    id: '4', title: 'Condominio Costa Jacó', location: 'Jacó, Puntarenas', city: 'Jacó',
    price: 98_000_000, priceLabel: '₡98,000,000', type: 'condo', status: 'venta',
    bedrooms: 3, bathrooms: 2, area: 140, year: 2022,
    image: 'https://placehold.co/800x600/06b6d4/ffffff?text=Condo+Jaco',
    images: ['https://placehold.co/800x600/06b6d4/ffffff?text=Condo'], featured: false,
    description: 'Frente a la playa, a 2 minutos del mar. Ideal para inversión Airbnb con alta ocupación.',
    amenities: ['Playa','Piscina','Gym','Renta vacacional'], lat: 9.61, lng: -84.62
  },
  {
    id: '5', title: 'Lote Residencial Curridabat', location: 'Curridabat, San José', city: 'Curridabat',
    price: 65_000_000, priceLabel: '₡65,000,000', type: 'lote', status: 'venta',
    bedrooms: 0, bathrooms: 0, area: 520, year: 2024,
    image: 'https://placehold.co/800x600/8b5cf6/ffffff?text=Lote+Curridabat',
    images: ['https://placehold.co/800x600/8b5cf6/ffffff?text=Lote'], featured: false,
    description: 'Lote plano en urbanización premium, listo para construir. Todos los servicios disponibles.',
    amenities: ['Servicios','Seguridad','Topografía plana'], lat: 9.91, lng: -84.03
  },
  {
    id: '6', title: 'Casa Colonial Cartago', location: 'Cartago Centro', city: 'Cartago',
    price: 112_000_000, priceLabel: '₡112,000,000', type: 'casa', status: 'venta',
    bedrooms: 3, bathrooms: 2, area: 210, year: 2015,
    image: 'https://placehold.co/800x600/ef4444/ffffff?text=Casa+Cartago',
    images: ['https://placehold.co/800x600/ef4444/ffffff?text=Casa'], featured: false,
    description: 'Encantadora casa colonial remodelada, patio interno y cochera amplia. Céntrica y segura.',
    amenities: ['Patio','Cochera','Remodelada'], lat: 9.86, lng: -83.92
  },
  {
    id: '7', title: 'Penthouse Alajuela', location: 'Alajuela Centro', city: 'Alajuela',
    price: 185_000_000, priceLabel: '₡185,000,000', type: 'apartamento', status: 'venta',
    bedrooms: 3, bathrooms: 3, area: 180, year: 2024,
    image: 'https://placehold.co/800x600/f97316/ffffff?text=Penthouse',
    images: ['https://placehold.co/800x600/f97316/ffffff?text=Penthouse'], featured: true,
    description: 'Penthouse de lujo con terraza privada y jacuzzi, acabados en mármol y domótica.',
    amenities: ['Jacuzzi','Domótica','Terraza','Vista volcán'], lat: 10.01, lng: -84.21
  },
  {
    id: '8', title: 'Casa Familiar San José', location: 'San José, Rohrmoser', city: 'San José',
    price: 175_000_000, priceLabel: '₡175,000,000', type: 'casa', status: 'venta',
    bedrooms: 4, bathrooms: 3, area: 260, year: 2018,
    image: 'https://placehold.co/800x600/6366f1/ffffff?text=Rohrmoser',
    images: ['https://placehold.co/800x600/6366f1/ffffff?text=Rohrmoser'], featured: false,
    description: 'Casa familiar en zona tranquila, cerca de colegios y centros comerciales.',
    amenities: ['Jardín','Estudio','Garaje'], lat: 9.94, lng: -84.10
  },
];

export const TESTIMONIALS = [
  { id: 1, name: 'María Fernández', role: 'Compradora en Escazú', avatar: 'https://placehold.co/100x100/0ea5e9/fff?text=MF', text: 'Encontramos nuestra casa soñada en 3 semanas. El equipo fue impecable con la valoración y negociación.', stars: 5 },
  { id: 2, name: 'Carlos Méndez', role: 'Inversionista', avatar: 'https://placehold.co/100x100/f59e0b/fff?text=CM', text: 'La valoración fue extremadamente precisa. Vendí por encima del precio esperado gracias a su estudio de mercado.', stars: 5 },
  { id: 3, name: 'Ana Soto', role: 'Vendedora en Santa Ana', avatar: 'https://placehold.co/100x100/10b981/fff?text=AS', text: 'Profesionales, transparentes y rápidos. El proceso de evaluación me dio total confianza.', stars: 5 },
];

export const STATS = [
  { label: 'Propiedades vendidas', value: '1,240+' },
  { label: 'Años de experiencia', value: '15+' },
  { label: 'Valoraciones precisas', value: '98.7%' },
  { label: 'Clientes satisfechos', value: '4.9/5' },
];

export const TEAM = [
  { name: 'Ing. Patricia Mora Soto', role: 'Perito Valuador CFIA IC-11247 · 20 años · Coordinadora Técnica', img: 'https://placehold.co/400x500/8c6239/fff?text=Perito+20a' },
  { name: 'Laura Jiménez', role: 'CEO & Fundadora', img: 'https://placehold.co/400x500/0ea5e9/fff?text=Laura' },
  { name: 'Jorge Rojas', role: 'Director de Valoraciones', img: 'https://placehold.co/400x500/0284c7/fff?text=Jorge' },
];

// === PERITO 20 AÑOS — Terra Capital (inspirado en peritos CR reales: CFIA 5+ años mínimo, referente ICO-3075 con 44 años/2210 informes) ===
export const PERITO_PRINCIPAL = {
  nombre: 'Ing. Patricia Mora Soto',
  carnet: 'CFIA IC-11247 · ICO-2840',
  incorporacion: 2004,
  experiencia: 20,
  informes: 1850,
  colegiado: 'Colegio Federado de Ingenieros y Arquitectos (CFIA) — lista de peritos Dirección Ejecutiva',
  especialidades: ['Vivienda urbana y condominios', 'Fincas y lotes rurales (Occidente)', 'Comercial y bodegas', 'Sucesiones / judicial', 'Hipotecario SUGEF'],
  metodologias: [
    { nombre: 'Comparación de Mercado (homologación)', uso: 'Residencial urbano, casas, apartamentos, lotes', desc: 'Ajusta 5-8 comparables verificados de la zona (ventas recientes 6-12m). Exige acceso a registro y mercado real. Evita sobrevaloración.' },
    { nombre: 'Costo de Reposición - Depreciación', uso: 'Industrial, único, sin comparables, obra nueva', desc: 'Terreno + costo reconstruir hoy - depreciación física/funcional. Clave para propiedades atípicas.' },
    { nombre: 'Capitalización de Ingresos (DCF / perpetuidad)', uso: 'Comercial, alquiler, inversión', desc: 'Valor presente de flujos futuros. Para locales, edificios de renta. Requiere tasa de capitalización de mercado.' },
  ],
  checklistDocumentos: [
    'Plano catastrado vigente (foto/PDF legible)',
    'Certificación literal Registro Nacional (<30 días)',
    'Planos constructivos (si hay)',
    'Recibos servicios públicos (agua/luz)',
    'Recibo impuesto bienes inmuebles municipal',
    'Cédula propietario + personería si es jurídica',
  ],
  normativa: ['Reglamento Contratación Peritajes y Avalúos CFIA (Art. 1-12)', 'IVS (International Valuation Standards) Norma N°3 Informes', 'SUGEF 6 meses vigencia hipotecario', 'Código Ética CFIA — independencia y neutralidad'],
  frases20anos: 'Un avalúo mal hecho no lo rechaza el cliente, lo rechaza el banco o el juez. La experiencia es saber qué metodología defiende el valor ante quien lo cuestiona.',
}

// === TERRA CAPITAL: Modelo comercial de avalúos ===
export type AvaluoModalidad = 'virtual' | 'presencial' | 'hipotecario'
export const AVALUO_MODALIDADES: { value: AvaluoModalidad; label: string; desc: string; basePrice: number; badge: string }[] = [
  { value: 'virtual', label: 'Estimación Virtual — Cliente envía fotos/datos', desc: 'GRATIS sin visita: cliente envía fotos, video y datos. Rango estimado 24h. No válido SUGEF/bancos. Sin desplazamiento.', basePrice: 0, badge: 'GRATIS' },
  { value: 'presencial', label: 'Avalúo Presencial Certificado — Con visita', desc: 'CON visita: me desplazo desde San Ramón + reporte CFIA válido venta. Entrega 48-72h. Incluye desplazamiento.', basePrice: 45000, badge: 'Desde ₡45.000' },
  { value: 'hipotecario', label: 'Avalúo Hipotecario Bancario — Con visita', desc: 'CON visita: inspección + fotos perito + certificado crédito. 72h. Incluye desplazamiento.', basePrice: 95000, badge: 'Desde ₡95.000' },
]

// Base: San Ramón de Alajuela — todo se calcula desde aquí
export const DESPLAZAMIENTO_TARIFAS: Record<string, number> = {
  'San Ramón': 0, 'San Ramon': 0,
  'Palmares': 5000, 'Naranjo': 7000, 'Grecia': 8000,
  'Alajuela': 12000, 'Heredia': 18000,
  'San José': 22000, 'Escazú': 22000, 'Santa Ana': 22000, 'Curridabat': 25000,
  'Cartago': 28000, 'Jacó': 30000,
  'default': 25000,
}

export const getDesplazamientoCosto = (cityOrAddress: string): number => {
  for (const [k,v] of Object.entries(DESPLAZAMIENTO_TARIFAS)) if (cityOrAddress.toLowerCase().includes(k.toLowerCase())) return v
  return DESPLAZAMIENTO_TARIFAS['default']
}

export const calcularCostoAvaluo = (modalidad: AvaluoModalidad, direccion: string, urgencia: 'normal'|'express'): number => {
  const base = AVALUO_MODALIDADES.find(m=>m.value===modalidad)?.basePrice ?? 0
  if (modalidad==='virtual') return 0
  const despl = getDesplazamientoCosto(direccion)
  const urg = urgencia==='express' ? Math.round(base*0.3) : 0
  return base + despl + urg
}

// === CHECKLIST + METODOLOGÍA AUTO (20 años) ===
export const DOCS_REQUERIDOS = [
  { key:'fotos', label:'Fotos y video (cliente)', required: true, accept: '.jpg,.png,.mp4,.heic', note:'Obligatorio para GRATIS' },
  { key:'plano', label:'Plano catastrado — o N° plano', required: true, accept: '.pdf,.jpg,.png', note:'Archivo o número' },
  { key:'literal', label:'Certificación literal / folio real', required: true, accept: '.pdf,.jpg,.png', note:'Archivo o folio' },
  { key:'cedula', label:'Cédula / personería', required: true, accept: '.pdf,.jpg,.png' },
  { key:'impuesto', label:'Recibo impuesto bienes inmuebles', required: false, accept: '.pdf,.jpg,.png' },
  { key:'planosConst', label:'Planos constructivos', required: false, accept: '.pdf,.dwg' },
  // recibos ya no pesan para avalúo personal — queda oculto
] as const

export const getMetodologiaRecomendada = (tipo: string, modalidad: AvaluoModalidad): string => {
  if (tipo==='lote') return 'Comparación de Mercado (homologación) + Costo'
  if (tipo==='casa' || tipo==='apartamento' || tipo==='condo') return 'Comparación de Mercado (5-8 comparables)'
  if (tipo==='villa') return 'Comparación + Costo de Reposición'
  // comercial / inversión
  return modalidad==='hipotecario' ? 'Comparación + Costo (SUGEF independiente)' : 'Comparación de Mercado'
}
export const getEnfoquesRequeridos = (tipo: string): string[] => {
  if (tipo==='lote') return ['Comparación de Mercado','Costo']
  if (['casa','apartamento','condo','villa'].includes(tipo)) return ['Comparación de Mercado','Costo de Reposición']
  return ['Comparación de Mercado']
}
