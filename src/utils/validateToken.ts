export function validateToken(
  token: string,
  chars: string[]
): boolean {
  if (!token) return false;
  if (!isCharsInAlphabet(token, chars)) return false;

  return true;
}

function isCharsInAlphabet(
  token: string,
  chars: string[]
): boolean {
  const re = new RegExp(`^[${chars.join('')}]+$`);
  return re.test(token);
}
