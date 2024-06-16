// utils/cache.ts
import localforage from "localforage";
import "fake-indexeddb/auto";

// localforage.config({
//   driver: localforage.LOCALSTORAGE,
//   name: "incident-cache",
// });

localforage.createInstance({
  driver: [
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE, // Fallback to localStorage if other methods not available
  ],
  name: "incident-cache",
});

export const getCache = async (key: string) => {
  return await localforage.getItem(key);
};

export const setCache = async (key: string, value: any) => {
  await localforage.setItem(key, value);
};

export const clearCache = async () => {
  await localforage.clear();
};

export const removeCache = async (key: string) => {
  await localforage.removeItem(key);
};

export const filterAndUpdateCache = async (
  filterFn: (incident: any) => boolean,
  updateFn: (incident: any) => any
) => {
  const keys = await localforage.keys();
  for (const key of keys) {
    const incident = await localforage.getItem(key);
    if (incident && filterFn(incident)) {
      const updatedIncident = updateFn(incident);
      await localforage.setItem(key, updatedIncident);
    }
  }
};
