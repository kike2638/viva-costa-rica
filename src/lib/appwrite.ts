import { Client, Databases, Query } from 'appwrite';
import { Property } from '../types';

// ==========================================
// CONFIGURACIÓN DE APPWRITE CLOUD
// ==========================================
export const APPWRITE_ENDPOINT = (import.meta as any).env?.VITE_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = (import.meta as any).env?.VITE_APPWRITE_PROJECT_ID || '6a7e4f6f0037477961d2';
export const APPWRITE_DATABASE_ID = (import.meta as any).env?.VITE_APPWRITE_DATABASE_ID || 'VIVA_db';
export const APPWRITE_COLLECTION_ID = (import.meta as any).env?.VITE_APPWRITE_COLLECTION_ID || 'properties';
export const APPWRITE_BUCKET_ID = (import.meta as any).env?.VITE_APPWRITE_BUCKET_ID || 'property_images';

export const isAppwriteConfigured = Boolean(APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID);

export const appwriteClient = new Client();

if (isAppwriteConfigured) {
  appwriteClient
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
}

export const appwriteDatabases = new Databases(appwriteClient);

// ==========================================
// HELPERS GENERALES (Precios e IDs)
// ==========================================

// Formateador de precios en colones (₡ CRC) o dólares ($ USD)
export const formatPropertyPrice = (
  price: number, 
  currency: 'USD' | 'CRC' = 'USD', 
  transactionType?: string,
  rentalPeriod?: 'mes' | 'dia'
): string => {
  const periodText = transactionType === 'alquiler' 
    ? (rentalPeriod === 'dia' ? '/día' : '/mes') 
    : '';

  if (currency === 'CRC') {
    const formatted = new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0,
    }).format(price);
    return `${formatted}${periodText}`;
  }
  
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
  return `${formatted}${periodText}`;
};

// Generador de ID único secuencial con prefijo MAG-XXXX
export const generateNextPropertyId = (existingProperties: Property[] = []): string => {
  let highestNumber = 1000;
  
  existingProperties.forEach(p => {
    if (p.id && typeof p.id === 'string') {
      const match = p.id.match(/^MAG-(\d+)$/i);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > highestNumber) {
          highestNumber = num;
        }
      }
    }
  });

  return `MAG-${highestNumber + 1}`;
};

// ==========================================
// PERSISTENCIA LOCAL (Solo caché de respaldo, NUNCA la fuente de verdad)
// La clave incluye versión para descartar cachés viejas de otros dispositivos.
// ==========================================
const LOCAL_CACHE_KEY = 'VIVA_properties_v2';

const getLocalProperties = (): Property[] => {
  const stored = localStorage.getItem(LOCAL_CACHE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error al parsear propiedades locales, usando lista vacía:', e);
    }
  }
  // Sin caché: devolver lista vacía. Nunca mostrar propiedades demo/ficticias
  // cuando Appwrite no responde (en producción solo deben verse datos reales).
  return [];
};

const saveLocalProperties = (properties: Property[]) => {
  localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(properties));
};

const saveLocalPropertyFallback = (property: Partial<Property>): Property => {
  const local = getLocalProperties();
  if (property.id) {
    const index = local.findIndex(p => p.id === property.id);
    if (index !== -1) {
      const updated = { ...local[index], ...property } as Property;
      local[index] = updated;
      saveLocalProperties(local);
      return updated;
    }
  }

  const newId = property.id?.trim() || generateNextPropertyId(local);
  const newProperty: Property = {
    id: newId,
    title: property.title || 'Propiedad sin título',
    description: property.description || '',
    price: Number(property.price) || 0,
    currency: property.currency || 'USD',
    property_type: property.property_type || 'casa',
    transaction_type: property.transaction_type || 'venta',
    rental_period: property.transaction_type === 'alquiler' ? (property.rental_period || 'mes') : 'mes',
    status: property.status || 'disponible',
    bedrooms: Number(property.bedrooms) || 0,
    bathrooms: Number(property.bathrooms) || 0,
    floors: Number(property.floors) || 1,
    land_area_sqm: Number(property.land_area_sqm) || 0,
    building_area_sqm: Number(property.building_area_sqm) || 0,
    location: property.location || 'Sin ubicación registrada',
    website_url: property.website_url || '',
    video_url: property.video_url || '',
    virtual_tour_360_url: property.virtual_tour_360_url || '',
    map_link: property.map_link || '',
    features: property.features || [],
    images: property.images && property.images.length > 0 ? property.images : [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: !!property.featured,
    created_at: property.created_at || new Date().toISOString()
  };

  const existingIdx = local.findIndex(p => p.id === newProperty.id);
  if (existingIdx !== -1) {
    local[existingIdx] = newProperty;
  } else {
    local.unshift(newProperty);
  }
  saveLocalProperties(local);
  return newProperty;
};

// ==========================================
// MAPPER DE DOCUMENTO APPWRITE -> OBJETO PROPERTY
// ==========================================
export const mapAppwriteDocToProperty = (doc: any): Property => {
  let images: string[] = [];
  if (Array.isArray(doc.images)) {
    images = doc.images;
  } else if (typeof doc.images === 'string') {
    try {
      images = JSON.parse(doc.images);
    } catch {
      images = [doc.images];
    }
  }

  let features: string[] = [];
  if (Array.isArray(doc.features)) {
    features = doc.features;
  } else if (typeof doc.features === 'string') {
    try {
      features = JSON.parse(doc.features);
    } catch {
      features = doc.features.split(',').map((s: string) => s.trim());
    }
  }

  return {
    id: doc.$id || doc.id,
    title: doc.title || 'Propiedad sin título',
    description: doc.description || '',
    price: Number(doc.price) || 0,
    currency: doc.currency || 'USD',
    property_type: doc.property_type || 'casa',
    transaction_type: doc.transaction_type || 'venta',
    rental_period: doc.rental_period || 'mes',
    status: doc.status || 'disponible',
    bedrooms: Number(doc.bedrooms) || 0,
    bathrooms: Number(doc.bathrooms) || 0,
    floors: Number(doc.floors) || 1,
    land_area_sqm: Number(doc.land_area_sqm) || 0,
    building_area_sqm: Number(doc.building_area_sqm) || 0,
    location: doc.location || '',
    latitude: doc.latitude ? Number(doc.latitude) : undefined,
    longitude: doc.longitude ? Number(doc.longitude) : undefined,
    map_link: doc.map_link || '',
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    featured: Boolean(doc.featured),
    features: features,
    website_url: doc.website_url || '',
    video_url: doc.video_url || '',
    virtual_tour_360_url: doc.virtual_tour_360_url || '',
    created_at: doc.$createdAt || doc.created_at || new Date().toISOString()
  };
};

// ==========================================
// MÉTODOS PÚBLICOS DEL CATÁLOGO & CRUD
// ==========================================

// Error del último intento de lectura a Appwrite (para mostrarlo en la UI).
let lastPropertiesError: string | null = null;
export const getLastPropertiesError = (): string | null => lastPropertiesError;

// Evita que la app se quede en "Cargando..." para siempre si el servidor no responde.
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Tiempo de espera agotado al conectar con el servidor')), ms)
    ),
  ]);

// 1. Obtener todas las propiedades de Appwrite Cloud
export const getProperties = async (): Promise<Property[]> => {
  if (isAppwriteConfigured) {
    try {
      const response = await withTimeout(
        appwriteDatabases.listDocuments(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_ID,
          [Query.orderDesc('$createdAt'), Query.limit(100)]
        ),
        10000
      );
      if (response && response.documents) {
        const remoteProps = response.documents.map(mapAppwriteDocToProperty);
        // Sincronizar el almacenamiento local con los datos reales de Appwrite
        saveLocalProperties(remoteProps);
        lastPropertiesError = null;
        return remoteProps;
      }
    } catch (error: any) {
      lastPropertiesError = error?.message || 'No se pudo conectar con el servidor de propiedades';
      console.warn('Appwrite listDocuments (usando persistencia local de respaldo):', error.message || error);
    }
  }

  return getLocalProperties();
};

// 2. Obtener propiedad por ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  if (isAppwriteConfigured) {
    try {
      const doc = await withTimeout(
        appwriteDatabases.getDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_ID,
          id
        ),
        10000
      );
      if (doc) return mapAppwriteDocToProperty(doc);
    } catch (error: any) {
      console.warn(`Appwrite getDocument (${id}):`, error.message || error);
    }
  }

  const local = getLocalProperties();
  return local.find(p => p.id === id) || null;
};

// ==========================================
// ADMIN SEGURO (escrituras via funciones serverless en Vercel)
// El navegador NUNCA escribe directo a Appwrite.
// ==========================================

const adminApiUrl = () => `${window.location.origin}/api/admin`;

const adminFetch = async (path: string, body: any) => {
  const res = await fetch(`${adminApiUrl()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
};

// Login del administrador. Devuelve el token de sesión (no expone secretos).
export const adminLogin = async (email: string, password: string): Promise<string> => {
  const data = await adminFetch('/login', { email, password });
  return data.token;
};

// 3. Crear o actualizar propiedad (a través del servidor)
export const saveProperty = async (property: Partial<Property>, token: string): Promise<Property> => {
  const data = await adminFetch('/save', { token, id: property.id, data: property });
  return saveLocalPropertyFallback(property);
};

// 4. Eliminar propiedad (a través del servidor)
export const deleteProperty = async (id: string, token: string): Promise<boolean> => {
  await adminFetch('/delete', { token, id });
  const local = getLocalProperties();
  saveLocalProperties(local.filter(p => p.id !== id));
  return true;
};

// 5. Subir imagen (a través del servidor -> Appwrite Storage)
export const uploadPropertyImage = async (file: File, token: string): Promise<string> => {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] || result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const data = await adminFetch('/upload', {
    token,
    name: file.name,
    mimeType: file.type,
    base64,
  });
  return data.url;
};

