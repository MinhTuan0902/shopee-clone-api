export function getObjectKeys(obj: any): string[] {
  if (typeof obj !== 'object') return [];
  return Object.keys(obj);
}
