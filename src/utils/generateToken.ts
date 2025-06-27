import { GrammarSchema } from '../types/grammar-schema';

function leftMostNonTerminal(
  derivation: string,
  nonTerminals: string[]
): string {
  for (let i = 0; i < derivation.length; i++) {
    if (nonTerminals.includes(derivation[i])) {
      return derivation[i];
    }
  }
  return '';
}

function leftMostNonTerminalIndex(
  derivation: string,
  nonTerminals: string[]
): number {
  for (let i = 0; i < derivation.length; i++) {
    if (nonTerminals.includes(derivation[i])) {
      return i;
    }
  }
  return -1;
}

export function generateTokenByGrammarRules(
  grammar: GrammarSchema,
  startSymbol: string,
  maxLength: number = 20
): string {
  let derivation = startSymbol;

  while (
    leftMostNonTerminalIndex(
      derivation,
      grammar.nonTerminals
    ) >= 0
  ) {
    const index = leftMostNonTerminalIndex(
      derivation,
      grammar.nonTerminals
    );

    derivation = derivation.replace(
      derivation[index],
      (match) => {
        const rules = grammar.rules[match];

        if (!rules || rules.length === 0) {
          return derivation;
        }

        if (derivation.length > 50) {
          return '';
        }

        if (
          derivation.length >= maxLength &&
          rules.includes('ε')
        ) {
          return '';
        }

        const randomRule =
          rules[Math.floor(Math.random() * rules.length)];

        return randomRule.replace('ε', '').trim();
      }
    );
  }

  return derivation;
}

export function generateRandomToken(
  alphabet: string[],
  minLength: number = 10,
  maxLength: number = 25
): string {
  let token = '';
  const length =
    Math.floor(
      Math.random() * (maxLength - minLength + 1)
    ) + minLength;
  for (let i = 0; i < length; i++) {
    const randomChar =
      alphabet[Math.floor(Math.random() * alphabet.length)];
    token += randomChar;
  }
  return token;
}
