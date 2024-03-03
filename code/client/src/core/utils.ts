const BASE64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const DEFAULT_REPLICA_ID_LENGTH = 10;

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

export function getCursorPosition(textarea: HTMLTextAreaElement) {
  const selectionStart = textarea.selectionStart;
  const lines = textarea.value.substring(0, selectionStart).split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}
