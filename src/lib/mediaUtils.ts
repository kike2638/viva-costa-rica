// Utility helpers for media embeds (YouTube Drone Videos, Vimeo, Matterport & Kuula 360 Virtual Tours)

// Imagen de respaldo cuando una URL de imagen falla o se corta.
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

// Devuelve una versión optimizada de la imagen para móviles.
// IMPORTANTE: las URLs de Appwrite se devuelven tal cual (el endpoint /preview de
// transformaciones está bloqueado en el plan gratuito de Appwrite; las imágenes
// ya se suben comprimidas desde el panel admin). Solo se re-escalan URLs externas
// (Unsplash) que soportan parámetros de tamaño.
export function getOptimizedImageUrl(url: string, width: number, quality = 78): string {
  if (!url) return url;
  const trimmed = url.trim();

  const viewMarker = '/view?';
  const viewIdx = trimmed.indexOf(viewMarker);
  if (viewIdx !== -1) {
    return trimmed;
  }

  if (trimmed.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(trimmed);
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      return parsed.toString();
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

// Swaps a broken <img> to the fallback image (uso: onError={(e) => handleImageError(e)})
export const handleImageError = (e: { currentTarget: HTMLImageElement }) => {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_IMAGE) {
    img.onerror = null;
    img.src = FALLBACK_IMAGE;
  }
};

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If already embed URL
  if (trimmed.includes('youtube.com/embed/') || trimmed.includes('youtube-nocookie.com/embed/')) {
    return trimmed;
  }

  // Standard youtube.com/watch?v=ID or &v=ID
  const matchWatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*?&v=)([a-zA-Z0-9_-]{11})/);
  if (matchWatch && matchWatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${matchWatch[1]}?rel=0&modestbranding=1`;
  }

  // Short youtu.be/ID
  const matchShort = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (matchShort && matchShort[1]) {
    return `https://www.youtube-nocookie.com/embed/${matchShort[1]}?rel=0&modestbranding=1`;
  }

  // Shorts youtube.com/shorts/ID
  const matchShorts = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (matchShorts && matchShorts[1]) {
    return `https://www.youtube-nocookie.com/embed/${matchShorts[1]}?rel=0&modestbranding=1`;
  }

  return null;
}

export function getVimeoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  if (trimmed.includes('player.vimeo.com/video/')) {
    return trimmed;
  }

  const match = trimmed.match(/vimeo\.com\/([0-9]+)/);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}?dnt=1&title=0&byline=0&portrait=0`;
  }

  return null;
}

export function getVideoEmbedUrl(url: string): { type: 'youtube' | 'vimeo' | 'direct'; embedUrl: string } | null {
  if (!url) return null;
  const trimmed = url.trim();

  const yt = getYouTubeEmbedUrl(trimmed);
  if (yt) return { type: 'youtube', embedUrl: yt };

  const vim = getVimeoEmbedUrl(trimmed);
  if (vim) return { type: 'vimeo', embedUrl: vim };

  if (trimmed.match(/\.(mp4|webm|ogg)($|\?)/i)) {
    return { type: 'direct', embedUrl: trimmed };
  }

  // If it's a general web video URL, return as is
  return { type: 'direct', embedUrl: trimmed };
}

export function getVirtualTourEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Matterport standard link formatting
  if (trimmed.includes('my.matterport.com') && !trimmed.includes('play=1')) {
    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}play=1&qs=1&brand=0`;
  }

  // Kuula formatting
  if (trimmed.includes('kuula.co/post/') || trimmed.includes('kuula.co/share/')) {
    return trimmed;
  }

  return trimmed;
}
