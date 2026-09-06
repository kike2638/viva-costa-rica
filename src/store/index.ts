import { create } from 'zustand';
import type { Property } from '../utils/constants';

type Filters = {
  type: string;
  location: string;
  priceIdx: number;
  bedrooms: string;
  search: string;
};

type AppState = {
  properties: Property[];
  favorites: string[];
  filters: Filters;
  selectedId: string | null;
  setFilters: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  toggleFavorite: (id: string) => void;
  setSelected: (id: string | null) => void;
};

const defaultFilters: Filters = { type: 'todos', location: 'todos', priceIdx: 0, bedrooms: 'todos', search: '' };

export const useStore = create<AppState>((set) => ({
  properties: [],
  favorites: [],
  filters: defaultFilters,
  selectedId: null,
  setFilters: (p) => set((s) => ({ filters: { ...s.filters, ...p } })),
  resetFilters: () => set({ filters: defaultFilters }),
  toggleFavorite: (id) => set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] })),
  setSelected: (id) => set({ selectedId: id }),
}));
