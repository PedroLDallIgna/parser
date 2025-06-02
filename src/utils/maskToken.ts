export function maskToken(value: string): string {
  if (!value) return '';

  const newValue = value
    .toLowerCase()
    .replace(/[^\w]/g, '')
    .replace(/\d/g, '');

  return newValue;
}
