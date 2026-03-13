import { createSeededPlatformStore } from "./seeds/platform-seed";

let store = createSeededPlatformStore();

export function getPlatformStore() {
  return store;
}

export function resetPlatformStore() {
  store = createSeededPlatformStore();
  return store;
}
