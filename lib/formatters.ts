/**
 * Helper formatters for input masks.
 */

export function formatCep(val: string): string {
  const clean = val.replace(/\D/g, "").slice(0, 8);
  if (clean.length > 5) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return clean;
}

export function formatPlate(val: string): string {
  const clean = val.replace(/[^A-Za-z0-9]/g, "").slice(0, 7).toUpperCase();
  if (clean.length > 3) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  return clean;
}
