
export function saveToStorage(value:any, key: string) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromStorage(key: string) {
  return localStorage.getItem(key);
}
