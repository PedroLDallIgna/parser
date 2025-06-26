export function maskToken(
  value: string,
  alphabet: string[]
): string {
  if (!value) return '';

  const newValue = value
    .toLowerCase()
    .replace(/[^\w]/g, '')
    .replace(/\d/g, '')
    .replace(
      new RegExp(`[^${alphabet.join('')}]`, 'g'),
      ''
    );

  return newValue;
}
