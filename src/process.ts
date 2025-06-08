import Queue from './queue';
import Stack from './stack';
import { GrammarSchema } from './types/grammar-schema';

// throw an error when cant find production
export function process(
  stack: Stack<string>,
  entryQueue: Queue<string>,
  grammar: GrammarSchema
): Record<string, any>[] {
  const actions = [];

  while (!entryQueue.isEmpty() && !stack.isEmpty()) {
    const currentToken = entryQueue.peek();
    const currentSymbol = stack.peek();

    const step: { [x: string]: any } = {};
    step['currentToken'] = currentToken;
    step['currentSymbol'] = currentSymbol;
    step['stack'] = [...stack.getItems()];
    step['queue'] = [...entryQueue.getItems()];

    if (!currentSymbol || !currentToken)
      throw new Error(
        'Invalid state: empty stack or queue'
      );

    if (currentSymbol === '$' && currentToken === '$') {
      step['action'] = 'Accept';
      actions.push(step);
      entryQueue.dequeue();
      stack.pop();
      break;
    }

    if (currentSymbol === '$' && currentToken !== '$') {
      step['action'] =
        'Erro: a pilha está vazia mas a entrada não';
      actions.push(step);
      break;
    }

    if (currentToken === '$' && currentSymbol !== '$') {
      step['action'] =
        'Erro: a entrada está vazia mas a pilha não';
      actions.push(step);
      break;
    }

    if (currentToken === currentSymbol) {
      step['action'] = `Read ${currentToken}`;
      actions.push(step);
      entryQueue.dequeue();
      stack.pop();
      continue;
    }

    if (currentSymbol in grammar.parsingTable) {
      if (
        currentToken in grammar.parsingTable[currentSymbol]
      ) {
        const production =
          grammar.parsingTable[currentSymbol][currentToken];

        step['action'] =
          `Expand: ${currentSymbol} -> ${production}`;
        actions.push(step);

        stack.pop();
        if (production !== 'ε') {
          const productionSymbols = production
            .split('')
            .reverse();

          for (const symbol of productionSymbols) {
            stack.push(symbol);
          }
        }
      }
    }
  }

  return actions;
}
