# Analisador Sintático (parser)

[Live demo](https://pedroldalligna.github.io/parser/)

## Tecnologias

- TypeScript

## Alunos

- Henrique Bonatto
- Pedro Lucas Dall' Igna

## Objetivo

Implementação de um Analisador Sintático _Top-Down_ Preditivo Tabular.

## _Features_

- Escrita manual de _tokens_
- Restrição de escrita apenas à caracteres do alfabeto
- Geração de _tokens_ aleatórios baseado no alfabeto (pode ser editado)
- Geração de _tokens_ aleatórios válidos baseado nas regras da gramática (pode ser editado)
- Geração interativa de _tokens_ a partir das regras da gramática, possibilidade de desfazer e refazer uma ação
- Visualização da gramática, conjuntos _first_ e _follow_ e tabela de _parsing_ a partir de arquivo de gramática
- Visualização da árvore de derivação de token gerado via interação com a gramática
- Análise do _token_ utilizando pilha top-down preditiva não recursiva tabular
- Análise do _token_ com _delay_ ajustável entre passos utilizando pilha top-down preditiva não recursiva tabular
- Análise do _token_ passo a passo utilizando pilha _top-down_ preditiva não recursiva tabular
- Possibilidade de alteração da gramática via arquivo de _schema_ contendo as propriedades da gramática, como regras, conjuntos _first_ e _follow_ e tabela de _parsing_.

## Gramática

_Schema_ para estruturação e customização da gramática.

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

## Como executar

A aplicação está disponível na _web_ pelo link [https://pedroldalligna.github.io/parser/](https://pedroldalligna.github.io/parser/).

Porém, se quiser executar localmente existem duas possibilidades:

- _Build_ local
- _Branch_ `gh-pages`

### _Build_ local

1. Clonar repositório localmente
2. Abrir diretório do projeto no terminal
3. Executar comando de _build_ na raiz do projeto

```shell
npm run build
```

4. Abrir arquivo `index.html` gerado na pasta `dist` no navegador

### _Branch_ `gh-pages`

1. Clonar repositório
2. Abrir diretório do projeto no terminal
3. Trocar para a branch `gh-pages` com o comando

```shell
git checkout gh-pages
```

ou

```shell
git switch gh-pages
```

4. Abrir arquivo `index.html` no navegador
