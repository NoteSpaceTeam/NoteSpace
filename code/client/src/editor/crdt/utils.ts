const BASE64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const DEFAULT_REPLICA_ID_LENGTH = 5;

export function generateRandomId(length = DEFAULT_REPLICA_ID_LENGTH) {
  let id = '';
  const charsLength = BASE64CHARS.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    id += BASE64CHARS[randomIndex];
  }
  return id;
}

export function getTagId(inputString: string): string {
  return inputString.substring(0, inputString.length - 1);
}

export function getTagValue(inputString: string): string {
  return inputString.charAt(inputString.length - 1);
}
