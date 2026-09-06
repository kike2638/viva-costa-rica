import { useMemo } from 'react';
import { PROPERTIES, PRICE_RANGES } from '../utils/constants';
import { useStore } from '../store';

export const useFilteredProperties = () => {
  const { filters } = useStore();
  return useMemo(() => {
    const range = PRICE_RANGES[filters.priceIdx];
    return PROPERTIES.filter((p) => {
      if (filters.type !== 'todos' && p.type !== filters.type) return false;
      if (filters.location !== 'todos' && p.city !== filters.location) return false;
      if (p.price < range.min || p.price > range.max) return false;
      if (filters.bedrooms !== 'todos' && String(p.bedrooms) !== filters.bedrooms) return false;
      if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase()) && !p.location.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters]);
};
