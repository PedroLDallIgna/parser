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
  const tokenSet = new Set(token.split(''));
  const charsSet = new Set(chars);

  for (const char of tokenSet) {
    if (!charsSet.has(char)) {
      return false;
    }
  }

  return true;
}
