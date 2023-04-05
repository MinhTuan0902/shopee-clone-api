export function getAllEnumKey(e: any): string[] {
  if (typeof e !== 'object') return [];
  return Object.keys(e);
}
