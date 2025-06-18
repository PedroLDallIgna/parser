# Analisador Sintático (parser)

[Live demo](https://pedroldalligna.github.io/parser/)

## Tecnologias

- TypeScript

## Alunos

- Henrique Bonatto
- Pedro Lucas Dall' Igna

## Objetivo

Implementação de um Analisador Sintático Top-Down Preditivo Tabular.

## Gramática

Schema para estruturação e customização da gramática.

```json
{
  "$schema": "http://json-schema.org/draft/2020-12/schema",
  "title": "Grammar",
  "description": "A grammar to be used in the parser",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": ["context-free"]
    },
    "startSymbol": {
      "type": "string"
    },
    "nonTerminals": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "terminals": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "rules": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "firstSets": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "followSets": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "parsingTable": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "additionalProperties": {
          "type": "string"
        }
      }
    }
  },
  "required": [
    "type",
    "startSymbol",
    "nonTerminals",
    "terminals",
    "rules",
    "firstSets",
    "followSets",
    "parsingTable"
  ]
}
```
