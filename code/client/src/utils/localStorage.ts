function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItem(key: string) {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  return JSON.parse(item);
}

function removeItem(key: string) {
  localStorage.removeItem(key);
}

export default { setItem, getItem, removeItem };
