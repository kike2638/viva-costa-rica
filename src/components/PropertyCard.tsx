import React, { useState } from 'react';
import { BedDouble, Bath, Square, MapPin, Tag, Globe, ExternalLink, Layers, Video, Eye, Share2, Check, FileText, Hash, Navigation } from 'lucide-react';
import { Property } from '../types';
import { formatPropertyPrice } from '../lib/appwrite';
import { handleImageError, FALLBACK_IMAGE, getOptimizedImageUrl } from '../lib/mediaUtils';

interface PropertyCardProps {
  key?: React.Key;
  property: Property;
  onSelect: (property: Property) => void;
}

export default function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  // Traductores estéticos de tipo de propiedad
  const getPropertyTypeName = (type: string) => {
    switch (type) {
      case 'casa': return 'Casa';
      case 'apartamento': return 'Apartamento';
      case 'lote': return 'Terreno';
      case 'local': return 'Local Comercial';
      case 'oficina': return 'Oficina';
      default: return type;
    }
  };

  // Enlace para manejar/ir directo a la propiedad en Google Maps
  const getDirectionsUrl = () => {
    if (property.map_link && property.map_link.startsWith('http')) {
      return property.map_link;
    }
    if (property.latitude && property.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.location + ', Costa Rica')}`;
  };

  // Manejador para compartir la ficha directamente desde la tarjeta
  const handleShareDatasheet = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?id=${encodeURIComponent(property.id)}`;
    const priceText = formatPropertyPrice(property.price, property.currency || 'USD', property.transaction_type, property.rental_period);
    
    if (navigator.share) {
      navigator.share({
        title: `Ficha Técnica: ${property.title} | Viva Costa Rica`,
        text: `Ficha técnica de ${property.title} (${priceText}) en ${property.location}. Ref: ${property.id}.`,
        url: shareUrl,
      }).catch(() => {
        // Fallback to copy
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // Formateador de moneda
  const formatPrice = (price: number, transaction: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
    
    return transaction === 'alquiler' ? `${formatted}/mes` : formatted;
  };

  // Clases CSS por estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'reservada':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'vendida':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      default:
        return 'bg-stone-50 text-stone-600 border-stone-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponible': return 'Disponible';
      case 'reservada': return 'Reservado';
      case 'vendida': return 'Vendido';
      default: return status;
    }
  };

  // Imagen principal o fallback si no hay imágenes o es una string inválida
  const mainImage = getOptimizedImageUrl(
    property.images && property.images.length > 0 
      ? property.images[0] 
      : FALLBACK_IMAGE,
    640
  );

  return (
    <article
      onClick={() => onSelect(property)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
      id={`property-card-${property.id}`}
    >
      {/* Contenedor de Imagen y Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={mainImage}
          alt={property.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge superior izquierdo: Tipo de Operación y Multimedia */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 items-start">
          <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
            property.transaction_type === 'venta' 
              ? 'bg-amber-600 border-amber-500 text-white' 
              : 'bg-stone-900 border-stone-800 text-stone-100'
          }`}>
            {property.transaction_type === 'venta' 
              ? 'En Venta' 
              : (property.rental_period === 'dia' ? 'Renta por día' : 'En Renta')}
          </span>

          {property.video_url && (
            <span className="inline-flex items-center gap-1 rounded-md bg-black/70 border border-white/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-xs shadow-sm" title="Incluye Video / Dron">
              <Video className="h-3 w-3" />
              <span>Video</span>
            </span>
          )}

          {property.virtual_tour_360_url && (
            <span className="inline-flex items-center gap-1 rounded-md bg-black/70 border border-white/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 backdrop-blur-xs shadow-sm" title="Incluye Tour Virtual 360°">
              <Eye className="h-3 w-3" />
              <span>360°</span>
            </span>
          )}
        </div>

        {/* Badge superior derecho: Estado de Disponibilidad */}
        <div className="absolute top-3.5 right-3.5">
          <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide shadow-sm ${getStatusBadge(property.status)}`}>
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
              property.status === 'disponible' ? 'bg-emerald-500' : property.status === 'reservada' ? 'bg-amber-500' : 'bg-stone-400'
            }`}></span>
            {getStatusLabel(property.status)}
          </span>
        </div>

        {/* Badge tipo propiedad y landing page */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur-xs">
            <Tag className="mr-1 h-3.5 w-3.5 text-amber-400" />
            {getPropertyTypeName(property.property_type)}
          </span>
          {property.website_url && (
            <a
              href={property.website_url.startsWith('http') ? property.website_url : `https://${property.website_url}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 text-[11px] font-bold backdrop-blur-xs shadow-md transition-all cursor-pointer"
              title="Ir al Sitio Web / Landing Page"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Sitio Web</span>
              <ExternalLink className="h-3 w-3 opacity-80" />
            </a>
          )}
        </div>
      </div>

      {/* Contenido / Información */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Ubicación y Ref */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-stone-500 hover:text-amber-700 transition-colors truncate group/loc"
            title="Abrir ubicación en Google Maps / Navegar con GPS"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-600/80 group-hover/loc:scale-110 transition-transform" />
            <span className="text-xs font-medium truncate underline-offset-2 group-hover/loc:underline">{property.location}</span>
          </a>
          <span className="shrink-0 font-mono text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded">
            Ref: {property.id}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
          {property.title}
        </h3>

        <p className="mt-2 text-[13px] text-stone-500 line-clamp-2 leading-relaxed flex-1">
          {property.description}
        </p>

        {/* Precio */}
        <div className="mt-4 border-t border-stone-100 pt-3.5">
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-black text-stone-950 tracking-tight">
              {formatPropertyPrice(property.price, property.currency || 'USD', property.transaction_type, property.rental_period)}
            </span>
            {property.currency === 'CRC' && (
              <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Colones ₡
              </span>
            )}
            {property.currency === 'USD' && (
              <span className="text-[10px] font-bold tracking-wider text-stone-600 uppercase bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                USD $
              </span>
            )}
          </div>
        </div>

        {/* Características Clave */}
        <div className="mt-3 flex items-center justify-between border-t border-stone-100/75 pt-3 text-stone-600">
          {property.property_type !== 'lote' && (
            <>
              <div className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-stone-400" />
                <span className="text-xs font-semibold">{property.bedrooms} <span className="hidden sm:inline font-medium text-stone-500">Hab</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-stone-400" />
                <span className="text-xs font-semibold">{property.bathrooms} <span className="hidden sm:inline font-medium text-stone-500">Baños</span></span>
              </div>
              {property.floors && property.floors > 1 && (
                <div className="flex items-center gap-1 text-amber-800 font-semibold" title={`${property.floors} plantas o niveles`}>
                  <Layers className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span className="text-xs">{property.floors} <span className="hidden sm:inline font-medium text-stone-500">p.</span></span>
                </div>
              )}
            </>
          )}
          <div className="flex items-center gap-1.5 ml-auto">
            <Square className="h-4 w-4 text-stone-400" />
            <span className="text-xs font-semibold">
              {property.building_area_sqm || property.land_area_sqm} <span className="font-normal text-stone-500">m²</span>
            </span>
          </div>
        </div>

        {/* Barra de Acciones de Tarjeta: Compartir Ficha, Cómo llegar y Enlaces */}
        <div className="mt-3.5 border-t border-stone-100 pt-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShareDatasheet}
              className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 hover:bg-amber-50 hover:text-amber-800 border border-stone-200/80 px-2.5 py-1.5 text-[11px] font-bold text-stone-700 transition-colors cursor-pointer"
              title="Compartir ficha técnica de la propiedad"
            >
              {copiedLink ? <Check className="h-3 w-3 text-emerald-600" /> : <Share2 className="h-3 w-3 text-amber-600" />}
              <span>{copiedLink ? '¡Copiado!' : 'Ficha'}</span>
            </button>

            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2 py-1.5 text-[11px] font-bold text-amber-800 transition-colors cursor-pointer"
              title="Abrir ruta directa en Google Maps para manejar al inmueble"
            >
              <Navigation className="h-3 w-3 text-amber-600" />
              <span>Cómo llegar</span>
            </a>
          </div>

          {property.website_url && (
            <a
              href={property.website_url.startsWith('http') ? property.website_url : `https://${property.website_url}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 transition-colors truncate"
              title="Visitar sitio web oficial"
            >
              <Globe className="h-3 w-3 text-amber-600 shrink-0" />
              <span className="truncate">Web</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

