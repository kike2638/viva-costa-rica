import React, { useState } from 'react';
import { 
  X, Printer, Copy, Check, MessageCircle, Share2, Building2, MapPin, 
  BedDouble, Bath, Square, Layers, Compass, CheckCircle, Star, Phone, Mail, 
  Calendar, Tag, ExternalLink, ShieldCheck, Download, Sparkles, Send
} from 'lucide-react';
import { Property } from '../types';
import { formatPropertyPrice } from '../lib/appwrite';
import { handleImageError } from '../lib/mediaUtils';

interface PropertyDatasheetModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDatasheetModal({
  property,
  isOpen,
  onClose,
}: PropertyDatasheetModalProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharedSuccess, setSharedSuccess] = useState(false);

  if (!isOpen) return null;

  const priceFormatted = formatPropertyPrice(
    property.price,
    property.currency || 'USD',
    property.transaction_type,
    property.rental_period
  );

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

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

  // Generar resumen en texto limpio para portapapeles / WhatsApp
  const generateTextSummary = () => {
    const lines = [
      `🏛️ *Viva Costa Rica - FICHA TÉCNICA OFICIAL*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🆔 *Código de Referencia:* ${property.id}`,
      `🏷️ *Propiedad:* ${property.title}`,
      `📍 *Ubicación:* ${property.location}`,
      `💰 *Precio:* ${priceFormatted} (${property.transaction_type === 'venta' ? 'En Venta' : 'En Renta'})`,
      `📐 *Superficie Terreno:* ${property.land_area_sqm} m²`,
      property.building_area_sqm > 0 ? `🏢 *Área Construcción:* ${property.building_area_sqm} m²` : null,
      property.floors ? `🏗️ *Plantas / Niveles:* ${property.floors}` : null,
      property.property_type !== 'lote' ? `🛏️ *Habitaciones:* ${property.bedrooms} | 🚿 *Baños:* ${property.bathrooms}` : null,
      `📌 *Estado:* ${property.status.toUpperCase()}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      property.features && property.features.length > 0 
        ? `✅ *Servicios y Equipamiento:* \n• ${property.features.join('\n• ')}` 
        : null,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📞 *Contacto Asesor:* +506 60027000`,
      `✉️ *Correo:* VIVAbr.cr@gmail.com`,
      `🌐 *Ver ficha interactiva:* ${window.location.origin}/?id=${encodeURIComponent(property.id)}`,
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleCopyFormattedText = () => {
    const text = generateTextSummary();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    });
  };

  const handleCopyDirectLink = () => {
    const shareUrl = `${window.location.origin}/?id=${encodeURIComponent(property.id)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleNativeShare = async () => {
    const shareUrl = `${window.location.origin}/?id=${encodeURIComponent(property.id)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ficha Técnica: ${property.title} | Viva Costa Rica`,
          text: `Ficha técnica de ${property.title} (Ref: ${property.id}, ${priceFormatted}) en ${property.location}. Terreno: ${property.land_area_sqm}m², Construcción: ${property.building_area_sqm}m².`,
          url: shareUrl,
        });
        setSharedSuccess(true);
        setTimeout(() => setSharedSuccess(false), 2500);
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        handleCopyDirectLink();
      }
    } else {
      handleCopyDirectLink();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `Hola, te comparto la ficha técnica oficial de esta propiedad en Viva Costa Rica:\n\n*${property.title}* (Ref: ${property.id})\n💰 Precio: ${priceFormatted}\n📍 Ubicación: ${property.location}\n📐 Terreno: ${property.land_area_sqm} m² | Construcción: ${property.building_area_sqm} m²\n🏗️ Plantas: ${property.floors || 1}\n\n📄 Consulta la ficha técnica interactiva aquí:\n${window.location.origin}/?id=${encodeURIComponent(property.id)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-2 sm:p-4 md:p-6 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      id="datasheet-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        id="printable-datasheet"
      >
        {/* Barra Superior de Herramientas y Acciones de Compartir (No imprimible) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-stone-900 text-white border-b border-stone-800 no-print">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-stone-100 flex items-center gap-1.5 font-brand-cinzel">
                Ficha Técnica Inmobiliaria
              </h2>
              <p className="text-[10px] text-stone-400 hidden sm:block">Dossier oficial listo para presentación a clientes e inversionistas</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Botón Principal: Compartir Ficha (Nativo / Móvil) */}
            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
              title="Compartir ficha técnica"
              id="datasheet-btn-native-share"
            >
              {sharedSuccess || copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{sharedSuccess ? '¡Compartido!' : (copiedLink ? '¡Enlace Copiado!' : 'Compartir Ficha')}</span>
            </button>

            {/* Compartir WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
              title="Enviar por WhatsApp"
              id="datasheet-btn-whatsapp"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Copiar Formateado */}
            <button
              onClick={handleCopyFormattedText}
              className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-xs font-semibold text-stone-200 border border-stone-700 transition-colors cursor-pointer"
              title="Copiar texto de la ficha técnica"
              id="datasheet-btn-copy-text"
            >
              {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-amber-400" />}
              <span className="hidden md:inline">{copiedText ? '¡Copiado!' : 'Copiar Texto'}</span>
            </button>

            {/* Imprimir / Guardar PDF */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-xs font-semibold text-stone-200 border border-stone-700 transition-colors cursor-pointer"
              title="Imprimir o exportar como PDF"
              id="datasheet-btn-print"
            >
              <Printer className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer ml-1"
              id="datasheet-btn-close"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Barra de Acceso Rápido para Compartir (No imprimible) */}
        <div className="bg-stone-100 px-6 py-2.5 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-2 no-print text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <Share2 className="h-3.5 w-3.5 text-amber-600" />
            <span className="font-semibold text-stone-800">Compartir Ficha Técnica:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors cursor-pointer"
            >
              <MessageCircle className="h-3 w-3" />
              <span>Enviar a WhatsApp</span>
            </button>
            <button
              onClick={handleCopyDirectLink}
              className="text-stone-700 hover:text-stone-900 font-bold inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-stone-200 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-amber-600" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>
            <button
              onClick={handleCopyFormattedText}
              className="text-stone-700 hover:text-stone-900 font-bold inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-stone-200 transition-colors cursor-pointer"
            >
              {copiedText ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-amber-600" />}
              <span>{copiedText ? '¡Ficha Copiada!' : 'Copiar Resumen'}</span>
            </button>
          </div>
        </div>

        {/* Contenido Editorial de la Ficha (Imprimible y Scrollable) */}
        <div className="overflow-y-auto p-6 sm:p-8 bg-stone-50/50 space-y-6 text-stone-800">
          
          {/* ENCABEZADO EDITORIAL DE ALTA GAMA */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-stone-100 pb-5">
              {/* Logotipo y Título de Prestigio */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest text-amber-700 uppercase bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-md">
                    Viva Costa Rica
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-300/80 px-2 py-0.5 rounded-md">
                    REF: {property.id}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-950 font-serif-luxury tracking-tight mt-1 leading-snug">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1.5 text-stone-600 text-xs sm:text-sm font-medium">
                  <MapPin className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{property.location}</span>
                </div>
              </div>

              {/* Precio y Estado */}
              <div className="flex flex-col sm:items-end gap-1.5">
                <div className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                  {priceFormatted}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                    property.transaction_type === 'venta' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-stone-900 text-stone-100'
                  }`}>
                    {property.transaction_type === 'venta' ? 'Venta Exclusiva' : (property.rental_period === 'dia' ? 'Alquiler por Día' : 'Alquiler Mensual')}
                  </span>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${
                    property.status === 'disponible' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
            </div>

            {/* GALERÍA DE FOTOS PRINCIPALES EDITORIAL */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Foto Principal */}
              <div className="md:col-span-8 aspect-16/10 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative group">
                <img
                  src={images[0]}
                  alt={property.title}
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md">
                  Fotografía Principal
                </div>
              </div>

              {/* Mosaico de 2 fotos secundarias */}
              <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3">
                <div className="aspect-16/10 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative">
                  <img
                    src={images[1] || images[0]}
                    alt={`${property.title} - 2`}
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-16/10 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative">
                  <img
                    src={images[2] || images[0]}
                    alt={`${property.title} - 3`}
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="h-full w-full object-cover"
                  />
                  {images.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center text-white text-xs font-bold">
                      +{images.length - 2} fotos en catálogo
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DESGLOSE ESTRUCTURADO DE ÁREAS Y MÉTRICAS TÉCNICAS */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <span className="h-4 w-1 bg-amber-600 rounded-full"></span>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Especificaciones y Cuadro de Áreas
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {/* Área de Terreno */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Compass className="h-4 w-4 text-amber-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Superficie Terreno</span>
                </div>
                <div>
                  <span className="text-lg font-black text-stone-950">{property.land_area_sqm || 0}</span>
                  <span className="text-xs font-semibold text-stone-500 ml-1">m²</span>
                </div>
              </div>

              {/* Área de Construcción */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Square className="h-4 w-4 text-amber-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Construcción</span>
                </div>
                <div>
                  <span className="text-lg font-black text-stone-950">{property.building_area_sqm || 'N/A'}</span>
                  {property.building_area_sqm > 0 && <span className="text-xs font-semibold text-stone-500 ml-1">m²</span>}
                </div>
              </div>

              {/* Número de Plantas */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Layers className="h-4 w-4 text-amber-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Número de Plantas</span>
                </div>
                <div>
                  <span className="text-lg font-black text-stone-950">{property.floors || 1}</span>
                  <span className="text-xs font-semibold text-stone-500 ml-1">
                    {(property.floors || 1) > 1 ? 'Niveles' : 'Planta'}
                  </span>
                </div>
              </div>

              {/* Recámaras */}
              {property.property_type !== 'lote' && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                    <BedDouble className="h-4 w-4 text-stone-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Recámaras</span>
                  </div>
                  <div>
                    <span className="text-lg font-black text-stone-950">{property.bedrooms}</span>
                    <span className="text-xs font-semibold text-stone-500 ml-1">Habitaciones</span>
                  </div>
                </div>
              )}

              {/* Baños */}
              {property.property_type !== 'lote' && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                    <Bath className="h-4 w-4 text-stone-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Baños</span>
                  </div>
                  <div>
                    <span className="text-lg font-black text-stone-950">{property.bathrooms}</span>
                    <span className="text-xs font-semibold text-stone-500 ml-1">Completos</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SERVICIOS INCLUIDOS Y EQUIPAMIENTO */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <span className="h-4 w-1 bg-emerald-600 rounded-full"></span>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Servicios y Equipamiento Incluidos
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-xs font-semibold text-stone-800">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DESCRIPCIÓN NARRATIVA */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <span className="h-4 w-1 bg-amber-600 rounded-full"></span>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Resumen Ejecutivo de la Propiedad
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* BLOQUE DE ASESORÍA Y CONTACTO VIVA */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                Asesoría Inmobiliaria Certificada
              </span>
              <h4 className="text-base font-bold text-stone-100">
                Viva Costa Rica • Comercialización de Élite
              </h4>
              <p className="text-xs text-stone-400">
                Para coordinar visitas guiadas, dictamen legal o avalúo de la propiedad:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <a
                href={`https://wa.me/50660027000?text=${encodeURIComponent(`Hola Viva Costa Rica, solicito información y visita para la propiedad: ${property.title} (ID: ${property.id})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>WhatsApp: +506 60027000</span>
              </a>

              <a
                href="mailto:VIVAbr.cr@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-800 hover:bg-stone-700 px-4 py-2.5 text-xs font-bold text-stone-200 border border-stone-700 transition-colors cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 text-amber-400" />
                <span>VIVAbr.cr@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Pie de página de la Ficha Técnica */}
          <div className="text-center text-[10px] text-stone-400 pt-2 border-t border-stone-200">
            Documento informativo generado por Viva Costa Rica. Sujeto a disponibilidad y confirmación notarial.
          </div>
        </div>
      </div>
    </div>
  );
}

