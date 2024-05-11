export function randomString(length: number = 10): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
