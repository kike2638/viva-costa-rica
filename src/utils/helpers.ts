export const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n);

export const formatArea = (a: number) => `${a} m²`;

export const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

export const priceFromLabel = (min: number, max: number) =>
  max === Infinity ? `₡${(min/1_000_000).toFixed(0)}M+` : `₡${(min/1_000_000).toFixed(0)}M - ${(max/1_000_000).toFixed(0)}M`;
