import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, BedDouble, Bath, Square, MapPin, Tag, Calendar, MessageCircle, 
  Mail, Share2, Compass, CheckCircle, Globe, ExternalLink, Layers, 
  Sparkles, Maximize2, Video, Play, Eye, FileText, Camera, ShieldCheck,
  Hash, Copy, Check
} from 'lucide-react';
import { Property } from '../types';
import { formatPropertyPrice } from '../lib/appwrite';
import { PropertyMap } from './PropertyMap';
import PropertyLightbox from './PropertyLightbox';
import PropertyDatasheetModal from './PropertyDatasheetModal';
import { getVideoEmbedUrl, getVirtualTourEmbedUrl, handleImageError, getOptimizedImageUrl } from '../lib/mediaUtils';

interface PropertyDetailsProps {
  property: Property;
  onBack: () => void;
}

export default function PropertyDetails({ property, onBack }: PropertyDetailsProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video' | 'tour360'>('photos');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDatasheetOpen, setIsDatasheetOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Inyectar metadatos Open Graph y SEO dinámicamente para compartir enlaces en WhatsApp / Redes
  useEffect(() => {
    const originalTitle = document.title;
    const mainImage = property.images && property.images.length > 0 
      ? property.images[0] 
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    
    const priceFormatted = formatPropertyPrice(property.price, property.currency || 'USD', property.transaction_type, property.rental_period);
    const metaDescription = `${property.title} (Ref: ${property.id}) en ${property.location}. Precio: ${priceFormatted}. ${property.bedrooms} hab, ${property.bathrooms} baños. ${property.description.slice(0, 120)}...`;

    document.title = `${property.title} (Ref: ${property.id}) | Viva Costa Rica`;

    const setMetaTag = (propertyOrName: string, content: string, isName = false) => {
      const attribute = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attribute}="${propertyOrName}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, propertyOrName);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('og:title', `${property.title} - ${priceFormatted}`);
    setMetaTag('og:description', metaDescription);
    setMetaTag('og:image', mainImage);
    setMetaTag('og:url', window.location.href);
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:title', `${property.title} - ${priceFormatted}`, true);
    setMetaTag('twitter:description', metaDescription, true);
    setMetaTag('twitter:image', mainImage, true);

    return () => {
      document.title = originalTitle;
    };
  }, [property]);

  // Traductores estéticos de tipo de propiedad
  const getPropertyTypeName = (type: string) => {
    switch (type) {
      case 'casa': return 'Casa Residencial';
      case 'apartamento': return 'Apartamento / Condominio';
      case 'lote': return 'Lote de Terreno';
      case 'local': return 'Local Comercial';
      case 'oficina': return 'Oficina Corporativa';
      default: return type;
    }
  };

  // Enlace dinámico de WhatsApp para el negocio
  const getWhatsAppLink = () => {
    const phoneNumber = '50660027000';
    const message = `Hola Viva Costa Rica, estoy muy interesado en la propiedad "${property.title}" (Ref: ${property.id}) que vi en su catálogo digital. ¿Me podrían brindar más detalles y programar una visita? Muchas gracias.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  // Enlace dinámico de Correo Electrónico
  const getEmailLink = () => {
    const email = 'VIVAbr.cr@gmail.com';
    const subject = `Consulta sobre propiedad: ${property.title} (Ref: ${property.id})`;
    const priceText = formatPropertyPrice(property.price, property.currency || 'USD', property.transaction_type, property.rental_period);
    const body = `Hola Viva Costa Rica,\n\nEstoy interesado en obtener más información sobre la propiedad "${property.title}" (Ref: ${property.id}).\n\nDetalles del inmueble:\n- Código Ref: ${property.id}\n- Ubicación: ${property.location}\n- Precio: ${priceText}\n\n¿Me podrían brindar más detalles y coordinar una visita?\n\nMuchas gracias.`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/?id=${encodeURIComponent(property.id)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(property.id).then(() => {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    });
  };

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const videoData = property.video_url ? getVideoEmbedUrl(property.video_url) : null;
  const virtualTourEmbed = property.virtual_tour_360_url ? getVirtualTourEmbedUrl(property.virtual_tour_360_url) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" id="property-details-container">
      {/* Barra de Acciones Superior */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Botón de retorno */}
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-amber-700 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-stone-200/80 shadow-xs"
          id="btn-back-to-catalog"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Volver al Catálogo</span>
        </button>

        {/* Botones de Ficha Técnica y Compartir */}
        <div className="flex items-center gap-2">
          {/* Botón Ver Ficha Técnica */}
          <button
            onClick={() => setIsDatasheetOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm border border-stone-800 transition-all cursor-pointer transform hover:-translate-y-0.5"
            id="btn-open-datasheet-top"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Ficha Técnica</span>
          </button>

          {/* Botón Compartir Ficha Técnica */}
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/?id=${encodeURIComponent(property.id)}`;
              if (navigator.share) {
                navigator.share({
                  title: `Ficha Técnica: ${property.title} | Viva Costa Rica`,
                  text: `Ficha técnica oficial de ${property.title} (${formatPropertyPrice(property.price, property.currency || 'USD', property.transaction_type, property.rental_period)}) en ${property.location}. Ref: ${property.id}.`,
                  url: shareUrl,
                }).catch(() => {
                  setIsDatasheetOpen(true);
                });
              } else {
                setIsDatasheetOpen(true);
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
            id="btn-share-datasheet-top"
            title="Compartir ficha técnica completa"
          >
            <Share2 className="h-4 w-4" />
            <span>Compartir Ficha</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA: GALERÍA MULTIMEDIA E INFORMACIÓN (8 Columnas en desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* PESTAÑAS MULTIMEDIA Y VISOR */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm flex flex-col">
            
            {/* Barra de Pestañas Interactivas Multimedia */}
            <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-3 py-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Pestaña: Fotos */}
                <button
                  onClick={() => setActiveMediaTab('photos')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeMediaTab === 'photos'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 font-black'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                  id="tab-media-photos"
                >
                  <Camera className="h-4 w-4 text-amber-600" />
                  <span>Fotos</span>
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600">
                    {images.length}
                  </span>
                </button>

                {/* Pestaña: Video / Dron */}
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                    activeMediaTab === 'video'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 font-black'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                  id="tab-media-video"
                >
                  <Video className="h-4 w-4 text-amber-600" />
                  <span>Video / Dron</span>
                  {property.video_url && (
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </button>

                {/* Pestaña: Tour Virtual 360° */}
                <button
                  onClick={() => setActiveMediaTab('tour360')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                    activeMediaTab === 'tour360'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 font-black'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                  id="tab-media-tour360"
                >
                  <Eye className="h-4 w-4 text-amber-600" />
                  <span>Tour 360°</span>
                  {property.virtual_tour_360_url && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                  )}
                </button>
              </div>

              {/* Botón Pantalla Completa para Fotos */}
              {activeMediaTab === 'photos' && (
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
                  title="Abrir galería en pantalla completa"
                  id="btn-open-lightbox"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-stone-600" />
                  <span className="hidden sm:inline">Pantalla Completa</span>
                </button>
              )}
            </div>

            {/* CONTENIDO DE LA PESTAÑA SELECCIONADA */}
            
            {/* 1. PESTAÑA: FOTOS */}
            {activeMediaTab === 'photos' && (
              <>
                {/* Foto Principal Activa */}
                <div 
                  className="relative aspect-16/9 w-full bg-stone-100 cursor-zoom-in group"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={getOptimizedImageUrl(images[activeImageIndex], 1280, 82)}
                    alt={`${property.title} - Imagen ${activeImageIndex + 1}`}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-101"
                    id="details-active-image"
                  />
                  
                  {/* Overlay hover para Lightbox */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                      <Maximize2 className="h-4 w-4 text-amber-400" />
                      <span>Clic para visor inmersivo</span>
                    </div>
                  </div>

                  {/* Badge de Transacción */}
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-black uppercase tracking-widest text-white shadow-md ${
                      property.transaction_type === 'venta' ? 'bg-amber-600 border-amber-500' : 'bg-stone-900 border-stone-800'
                    }`}>
                      {property.transaction_type === 'venta' ? 'En Venta' : 'En Renta'}
                    </span>
                  </div>

                  {/* Badge de Estado */}
                  <div className="absolute top-4 right-4 pointer-events-none">
                    <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-md ${
                      property.status === 'disponible' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : property.status === 'reservada'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}>
                      <span className={`mr-2 h-2 w-2 rounded-full ${
                        property.status === 'disponible' ? 'bg-emerald-500 animate-pulse' : property.status === 'reservada' ? 'bg-amber-500' : 'bg-stone-400'
                      }`}></span>
                      {property.status === 'disponible' ? 'Disponible' : property.status === 'reservada' ? 'Reservado' : 'Vendido'}
                    </span>
                  </div>

                  {/* Indicador de número de foto */}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg border border-white/20 pointer-events-none">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Selector de Miniaturas (Solo si hay más de 1 imagen) */}
                {images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto p-4 border-t border-stone-100 bg-stone-50/50">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative aspect-4/3 w-20 sm:w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                          activeImageIndex === index ? 'border-amber-600 scale-95 shadow-md ring-2 ring-amber-500/20' : 'border-transparent opacity-70 hover:opacity-100 hover:border-stone-300'
                        }`}
                      >
                        <img
                          src={getOptimizedImageUrl(img, 300)}
                          alt={`Miniatura ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* 2. PESTAÑA: VIDEO / DRON */}
            {activeMediaTab === 'video' && (
              <div className="p-4 sm:p-6 bg-stone-900 text-white min-h-[380px] sm:min-h-[460px] flex flex-col justify-center">
                {property.video_url ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
                        <Video className="h-4 w-4" />
                        <span>Recorrido Audiovisual / Dron</span>
                      </div>
                      <a
                        href={property.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-stone-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Abrir en YouTube/Vimeo</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {videoData?.embedUrl ? (
                      <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-black border border-stone-800 shadow-2xl">
                        <iframe
                          src={videoData.embedUrl}
                          title={`Video de ${property.title}`}
                          className="absolute inset-0 h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-stone-800/80 rounded-xl border border-stone-700 space-y-3">
                        <Video className="h-10 w-10 text-amber-500 mx-auto" />
                        <p className="text-sm font-semibold">Video disponible en enlace externo</p>
                        <a
                          href={property.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-2.5 text-xs font-bold text-white transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          <span>Ver Video Externo</span>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 space-y-4 max-w-md mx-auto">
                    <div className="h-16 w-16 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center mx-auto text-amber-400">
                      <Video className="h-8 w-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-stone-100">Filmación con Dron en Proceso</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Esta propiedad cuenta con cobertura fotográfica completa. Puedes solicitar un recorrido en video guiado o toma aérea por dron contactando directamente a nuestro equipo.
                      </p>
                    </div>
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Solicitar Video Guiado</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* 3. PESTAÑA: TOUR VIRTUAL 360° */}
            {activeMediaTab === 'tour360' && (
              <div className="p-4 sm:p-6 bg-stone-950 text-white min-h-[380px] sm:min-h-[460px] flex flex-col justify-center">
                {property.virtual_tour_360_url ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-wider">
                        <Eye className="h-4 w-4" />
                        <span>Tour Virtual Interactivo 360°</span>
                      </div>
                      <a
                        href={property.virtual_tour_360_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-stone-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Abrir Visor Completo</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-black border border-stone-800 shadow-2xl">
                      <iframe
                        src={virtualTourEmbed || property.virtual_tour_360_url}
                        title={`Tour 360 de ${property.title}`}
                        className="absolute inset-0 h-full w-full border-0"
                        allow="fullscreen; vr; xr; xr-spatial-tracking"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 space-y-4 max-w-md mx-auto">
                    <div className="h-16 w-16 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center mx-auto text-blue-400">
                      <Eye className="h-8 w-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-stone-100">Visita Guiada y Recorrido 3D</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Puedes agendar una visita virtual interactiva en vivo por videollamada o solicitar el escaneo 360° de los espacios de esta propiedad con nuestros asesores inmobiliarios.
                      </p>
                    </div>
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Agendar Recorrido Virtual</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Información General y Precios */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-stone-100 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                  <Tag className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
                  {getPropertyTypeName(property.property_type)}
                </span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                  property.transaction_type === 'venta' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-stone-900 text-stone-100'
                }`}>
                  {property.transaction_type === 'venta' 
                    ? 'En Venta' 
                    : (property.rental_period === 'dia' ? 'Alquiler por día' : 'Alquiler por mes')}
                </span>
                {/* Código de Referencia Único con botón Copiar */}
                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                  title="Haga clic para copiar el código de referencia"
                  id="btn-copy-ref-code"
                >
                  <Hash className="h-3.5 w-3.5 text-amber-600" />
                  <span>Ref: {property.id}</span>
                  {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-amber-600 opacity-80" />}
                </button>
                {copiedId && (
                  <span className="text-[11px] text-emerald-600 font-bold">¡Código copiado!</span>
                )}
                <span className="text-xs text-stone-400 font-medium flex items-center gap-1.5 ml-auto">
                  <Calendar className="h-3.5 w-3.5" />
                  Publicado: {property.created_at ? new Date(property.created_at).toLocaleDateString('es-ES') : 'Recientemente'}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-stone-900 leading-tight">
                {property.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <MapPin className="h-5 w-5 text-amber-600 shrink-0" />
                  <span className="text-sm font-semibold">{property.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                    {formatPropertyPrice(property.price, property.currency || 'USD', property.transaction_type, property.rental_period)}
                  </span>
                  {property.currency === 'CRC' ? (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md uppercase">
                      Colones ₡
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-md uppercase">
                      USD $
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Atributos Clave Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 py-6 border-b border-stone-100">
              {property.property_type !== 'lote' && (
                <>
                  <div className="flex flex-col p-3.5 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5 text-stone-500" /> Habitaciones
                    </span>
                    <span className="text-base font-black text-stone-900">{property.bedrooms} Recámaras</span>
                  </div>

                  <div className="flex flex-col p-3.5 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5 text-stone-500" /> Baños completos
                    </span>
                    <span className="text-base font-black text-stone-900">{property.bathrooms} Sanitarios</span>
                  </div>

                  <div className="flex flex-col p-3.5 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-amber-600" /> Plantas / Niveles
                    </span>
                    <span className="text-base font-black text-stone-900">
                      {property.floors && property.floors > 1 ? `${property.floors} Plantas` : `${property.floors || 1} Planta`}
                    </span>
                  </div>

                  <div className="flex flex-col p-3.5 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Square className="h-3.5 w-3.5 text-stone-500" /> Construcción
                    </span>
                    <span className="text-base font-black text-stone-900">
                      {property.building_area_sqm > 0 ? `${property.building_area_sqm} m²` : 'N/A'}
                    </span>
                  </div>
                </>
              )}

              <div className="flex flex-col p-3.5 bg-stone-50 rounded-xl border border-stone-100 col-span-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-stone-500" /> Superficie Terreno
                </span>
                <span className="text-base font-black text-stone-900">
                  {property.land_area_sqm > 0 ? `${property.land_area_sqm} m²` : `${property.building_area_sqm} m²`}
                </span>
              </div>
            </div>

            {/* Descripción Detallada */}
            <div className="mt-6">
              <h3 className="text-base font-bold text-stone-900 mb-3">Descripción de la Propiedad</h3>
              <div className="text-sm sm:text-base text-stone-600 leading-relaxed space-y-4 font-normal">
                {property.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Componente Mapa Interactivo de Ubicación */}
          <PropertyMap property={property} />

          {/* Servicios y Equipamiento Incluidos (Solo si la propiedad tiene elementos activos) */}
          {property.features && property.features.length > 0 && (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-bold text-stone-900 mb-4">Servicios y Equipamiento Incluidos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-stone-700 text-sm font-medium bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: CONTACTO Y FICHA (4 Columnas en desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card de Ficha Rápida y Acciones VIP */}
          <div className="rounded-2xl border border-stone-200 bg-stone-900 text-white p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="h-5 w-5" />
                <h4 className="text-sm font-bold tracking-tight uppercase font-brand-cinzel">Dossier Inmobiliario</h4>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md font-bold uppercase">
                Oficial
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Ficha técnica imprimible en PDF con cuadro de áreas, especificaciones arquitectónicas y equipamiento.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => setIsDatasheetOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all cursor-pointer transform hover:scale-101"
                id="btn-generate-datasheet-sidebar"
              >
                <FileText className="h-4 w-4" />
                <span>Ver / Imprimir Ficha Técnica</span>
              </button>

              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/?id=${encodeURIComponent(property.id)}`;
                  const text = `Hola, te comparto la ficha técnica de *${property.title}* (Ref: ${property.id}) en Viva Costa Rica:\n\nPrecio: ${formatPropertyPrice(property.price, property.currency || 'USD', property.transaction_type, property.rental_period)}\nUbicación: ${property.location}\nTerreno: ${property.land_area_sqm} m²\nConstrucción: ${property.building_area_sqm} m²\n\nVer ficha técnica completa aquí: ${shareUrl}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
                id="btn-share-datasheet-whatsapp-sidebar"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Compartir Ficha por WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Card de Agente / Contacto */}
          <div className="sticky top-24 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-3.5 border-b border-stone-100 pb-4">
              <div className="h-14 w-14 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center font-black text-lg border border-stone-200">
                M
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Viva Costa Rica</h4>
                <p className="text-xs text-stone-500 font-medium">Asesoría Inmobiliaria de Élite</p>
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Activo hoy
                </p>
              </div>
            </div>

            {/* Frase gancho */}
            <div>
              <p className="text-xs font-semibold text-stone-700 bg-stone-50 border border-stone-100 p-3 rounded-xl leading-relaxed">
                "Nos encargamos de todo el proceso de gestoría, avalúo y escrituración de manera transparente para tu absoluta tranquilidad."
              </p>
            </div>

            {/* CTA Botón Principal: WhatsApp Directo */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-bold text-white shadow-xs transition-colors cursor-pointer"
              id="cta-whatsapp-link"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Contactar por WhatsApp</span>
            </a>

            {/* CTA Botón Secundario: Enviar Correo Electrónico */}
            <a
              href={getEmailLink()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 py-2.5 text-xs font-bold text-stone-800 shadow-2xs transition-colors cursor-pointer"
              id="cta-email-link"
            >
              <Mail className="h-4 w-4 text-amber-700" />
              <span>Enviar por Correo Electrónico</span>
            </a>

            {/* Enlace a Página Web o Landing Page del Bien / Desarrollo (si está configurada) */}
            {property.website_url && (
              <a
                href={property.website_url.startsWith('http') ? property.website_url : `https://${property.website_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 py-2.5 text-xs font-bold text-white shadow-2xs transition-colors cursor-pointer"
                id="btn-visit-website"
              >
                <Globe className="h-4 w-4" />
                <span>Visitar Sitio Web / Landing Page</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>
            )}

            {/* Compartir propiedad */}
            <button
              onClick={handleCopyLink}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 py-2.5 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
              id="btn-share-property"
            >
              <Share2 className="h-4 w-4" />
              <span>{copiedLink ? '¡Enlace copiado!' : 'Copiar enlace para compartir'}</span>
            </button>

            {/* Información de Contacto Directo */}
            <div className="border-t border-stone-100 pt-4 text-left">
              <h5 className="text-[11px] font-black uppercase text-stone-400 tracking-wider mb-2">Contacto VIVA</h5>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                WhatsApp: <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-stone-900 font-bold hover:text-emerald-600 underline decoration-stone-300 transition-colors">+506 60027000</a><br />
                Email: <a href={getEmailLink()} className="text-stone-900 font-bold hover:text-amber-700 underline decoration-stone-300 transition-colors">VIVAbr.cr@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox de Pantalla Completa para Fotografías */}
      <PropertyLightbox
        images={images}
        initialIndex={activeImageIndex}
        propertyTitle={property.title}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* Modal de Ficha Técnica Instantánea */}
      <PropertyDatasheetModal
        property={property}
        isOpen={isDatasheetOpen}
        onClose={() => setIsDatasheetOpen(false)}
      />
    </div>
  );
}

