import React, { useEffect, useCallback, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut, Download, Share2, Layers } from 'lucide-react';
import { handleImageError, getOptimizedImageUrl } from '../lib/mediaUtils';

interface PropertyLightboxProps {
  images: string[];
  initialIndex?: number;
  propertyTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyLightbox({
  images,
  initialIndex = 0,
  propertyTitle = 'Galería de Propiedad',
  isOpen,
  onClose,
}: PropertyLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Sync initial index
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex, images.length]);

  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Teclado: Flecha Izquierda, Flecha Derecha, Escape, F
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Auto-scroll thumbnail strip to center active thumbnail
  useEffect(() => {
    if (thumbnailStripRef.current) {
      const activeThumb = thumbnailStripRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentIndex]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchStartXRef.current - touchEndXRef.current;
      const minSwipeDistance = 50; // pixels
      if (diff > minSwipeDistance) {
        handleNext();
      } else if (diff < -minSwipeDistance) {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleCopyImageUrl = () => {
    const currentImg = images[currentIndex];
    if (currentImg) {
      navigator.clipboard.writeText(currentImg).then(() => {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      });
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white backdrop-blur-md select-none transition-all duration-300 animate-fadeIn"
      id="fullscreen-lightbox"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Barra Superior de Controles */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-b from-black/80 to-transparent z-20">
        <div className="flex items-center gap-3 truncate max-w-md sm:max-w-xl">
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
            <span className="text-amber-400 font-bold">{currentIndex + 1}</span>
            <span className="text-stone-400">/</span>
            <span className="text-stone-300">{images.length}</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-stone-200 truncate hidden sm:inline">
            {propertyTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Toggle */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
            title={isZoomed ? 'Reducir zoom' : 'Aumentar zoom'}
            id="lightbox-btn-zoom"
          >
            {isZoomed ? <ZoomOut className="h-4.5 w-4.5" /> : <ZoomIn className="h-4.5 w-4.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa (F)' : 'Pantalla completa (F)'}
            id="lightbox-btn-fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
          </button>

          {/* Copiar enlace de foto */}
          <button
            onClick={handleCopyImageUrl}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
            title={copiedUrl ? '¡Enlace copiado!' : 'Copiar URL de la imagen'}
            id="lightbox-btn-copy-url"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>

          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer ml-1 shadow-md"
            title="Cerrar visor (Escape)"
            id="lightbox-btn-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Área Central del Visor Inmersivo */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Botón Navegar Anterior */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-20 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-black/50 hover:bg-black/80 border border-white/10 text-white transition-all transform hover:scale-105 cursor-pointer shadow-xl backdrop-blur-xs"
            title="Foto anterior (Flecha Izquierda)"
            id="lightbox-btn-prev"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        )}

        {/* Contenedor de la Imagen Principal */}
        <div
          className={`relative max-w-full max-h-full flex items-center justify-center transition-transform duration-300 ${
            isZoomed ? 'scale-135 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            key={currentImage}
            src={currentImage}
            alt={`${propertyTitle} - Vista ${currentIndex + 1}`}
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="max-h-[72vh] sm:max-h-[78vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-opacity duration-200 animate-fadeIn"
          />
        </div>

        {/* Botón Navegar Siguiente */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-20 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-black/50 hover:bg-black/80 border border-white/10 text-white transition-all transform hover:scale-105 cursor-pointer shadow-xl backdrop-blur-xs"
            title="Foto siguiente (Flecha Derecha)"
            id="lightbox-btn-next"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        )}
      </div>

      {/* Tira de Miniaturas Inferior */}
      {images.length > 1 && (
        <div className="bg-gradient-to-t from-black via-black/90 to-transparent p-3 sm:p-4 z-20">
          <div
            ref={thumbnailStripRef}
            className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto max-w-5xl mx-auto py-1 px-2 no-scrollbar"
            id="lightbox-thumbnails-strip"
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsZoomed(false);
                  setCurrentIndex(idx);
                }}
                className={`relative aspect-4/3 h-12 sm:h-16 shrink-0 overflow-hidden rounded-lg transition-all duration-200 cursor-pointer ${
                  currentIndex === idx
                    ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-black scale-105 opacity-100 shadow-lg'
                    : 'opacity-40 hover:opacity-80 border border-white/20'
                }`}
              >
                <img
                  src={getOptimizedImageUrl(img, 240)}
                  alt={`Miniatura ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="h-full w-full object-cover"
                />
                {currentIndex === idx && (
                  <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
                )}
              </button>
            ))}
          </div>
          
          <p className="text-center text-[11px] text-stone-400 mt-2 font-medium">
            Usa las flechas del teclado o desliza en tu pantalla para explorar las fotos • Presiona <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20 text-stone-200 text-[10px]">Esc</kbd> para salir
          </p>
        </div>
      )}
    </div>
  );
}
