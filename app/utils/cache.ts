// utils/cache.ts
const cache = new Map<string, any>();

export const getCache = (key: string) => {
  return cache.get(key);
};

export const setCache = (key: string, value: any) => {
  cache.set(key, value);
};

export const clearCache = () => {
  cache.clear();
};

export const removeCache = (key: string) => {
  cache.delete(key);
};
