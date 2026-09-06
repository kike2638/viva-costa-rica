import { PROPERTIES } from '../utils/constants';

export const useProperty = (id?: string) => {
  if (!id) return undefined;
  return PROPERTIES.find((p) => p.id === id);
};
