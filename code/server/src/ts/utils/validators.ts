export function isValidUUID(uuid: string): boolean {
  const regex = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-([89ab])[0-9a-fA-F]{3}-[0-9a-fA-F]{12}$');
  return regex.test(uuid);
}
