const BASE64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const DEFAULT_REPLICA_ID_LENGTH = 10;

export function generateRandomReplicaId() {
  let id = '';
  const charsLength = BASE64CHARS.length;
  for (let i = 0; i < DEFAULT_REPLICA_ID_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    id += BASE64CHARS[randomIndex];
  }
  return id;
}
