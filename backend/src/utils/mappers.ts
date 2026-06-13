/**
 * Converts snake_case DB rows to camelCase for API responses.
 */
export function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [
      key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
      typeof val === 'object' && val !== null && !Array.isArray(val) && !(val instanceof Date)
        ? toCamelCase(val)
        : val,
    ])
  );
}

/**
 * Converts camelCase API input to snake_case for DB writes.
 */
export function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [
      key.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`),
      val,
    ])
  );
}

/**
 * Picks only the allowed fields from an object (for safe DB writes).
 */
export function pick<T extends Record<string, any>>(obj: T, keys: string[]): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => keys.includes(k))
  ) as Partial<T>;
}
