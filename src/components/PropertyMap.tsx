import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, Compass, Layers } from 'lucide-react';
import { Property } from '../types';

interface PropertyMapProps {
  property: Property;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  const [mapType, setMapType] = useState<'m' | 'k'>('m'); // 'm' = Roadmap, 'k' = Satellite
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Determinar la consulta de búsqueda para la ubicación
  const searchLocation = property.latitude && property.longitude
    ? `${property.latitude},${property.longitude}`
    : `${property.location}, Costa Rica`;

  // URL para Google Maps Embed (Iframe estandarizado y responsivo)
  const mapEmbedUrl = property.latitude && property.longitude
    ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&t=${mapType}&z=16&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(searchLocation)}&t=${mapType}&z=14&ie=UTF8&iwloc=&output=embed`;

  // Enlaces de navegación externa
  const googleMapsExternalUrl = property.map_link 
    || (property.latitude && property.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchLocation)}`);

  const wazeExternalUrl = property.latitude && property.longitude
    ? `https://waze.com/ul?ll=${property.latitude},${property.longitude}&navigate=yes`
    : `https://waze.com/ul?q=${encodeURIComponent(searchLocation)}&navigate=yes`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(property.location);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col gap-5">
      {/* Encabezado de Ubicación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
              <Compass className="h-3 w-3 text-amber-600" />
              Ubicación Geográfica
            </span>
            <span className="text-xs font-semibold text-stone-500">Costa Rica 🇨🇷</span>
          </div>
          <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-600 shrink-0" />
            {property.location}
          </h3>
        </div>

        {/* Selector de Modo de Mapa (Estándar vs Satélite) */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0 self-start sm:self-center border border-stone-200">
          <button
            type="button"
            onClick={() => setMapType('m')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mapType === 'm'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Mapa Vías
          </button>
          <button
            type="button"
            onClick={() => setMapType('k')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              mapType === 'k'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="h-3 w-3 text-amber-600" />
            Satélite
          </button>
        </div>
      </div>

      {/* Mapa Visual Interactivo (Iframe de Google Maps) */}
      <div className="relative w-full h-[320px] sm:h-[400px] rounded-xl overflow-hidden border border-stone-200 shadow-inner bg-stone-100 group">
        <iframe
          title={`Mapa de la propiedad en ${property.location}`}
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />

        {/* Pin Badge superpuesto en el mapa */}
        <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-stone-700/80 shadow-md">
          <MapPin className="h-3.5 w-3.5 text-amber-400" />
          <span>{property.title}</span>
        </div>
      </div>

      {/* Botones de Acción y Navegación Directa */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Enlace directo a Google Maps */}
          <a
            href={googleMapsExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 text-stone-50 hover:bg-stone-800 px-4 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Navigation className="h-3.5 w-3.5 text-amber-400" />
            <span>Abrir en Google Maps</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>

          {/* Enlace para Waze */}
          <a
            href={wazeExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
          >
            <span className="text-sm">🚗</span>
            <span>Navegar con Waze</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>

        {/* Copiar Dirección */}
        <button
          type="button"
          onClick={handleCopyAddress}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ml-auto"
        >
          {copiedAddress ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-stone-500" />
              <span>Copiar dirección</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
