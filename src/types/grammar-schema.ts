export interface GrammarSchema {
  type:
    | 'context-free'
    | 'regular'
    | 'context-sensitive'
    | 'unrestricted';
  startSymbol: string;
  terminals: string[];
  nonTerminals: string[];
  rules: Record<string, string[]>;
  parsingTable: Record<string, Record<string, string>>;
  firstSets: Record<string, string[]>;
  followSets: Record<string, string[]>;
}
