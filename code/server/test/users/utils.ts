export function getRandomUserId() {
  return Math.random().toString(36).substring(2, 30);
}
