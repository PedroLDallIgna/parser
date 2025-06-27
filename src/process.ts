import Queue from './queue';
import Stack from './stack';
import { GrammarSchema } from './types/grammar-schema';

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
      step['action'] = 'Aceito';
      actions.push(step);
      entryQueue.dequeue();
      stack.pop();
      break;
    }

    if (currentSymbol === '$' && currentToken !== '$') {
      step['action'] =
        'Erro: a pilha está vazia mas a entrada não';
      actions.push(step);
      stack.clear();
      entryQueue.clear();
      break;
    }

    if (
      grammar.terminals.includes(currentSymbol) &&
      grammar.terminals.includes(currentToken)
    ) {
      if (currentToken === currentSymbol) {
        step['action'] = `Lê '${currentToken}'`;
        actions.push(step);
        entryQueue.dequeue();
        stack.pop();
        continue;
      } else {
        step['action'] =
          'Erro: símbolo terminal não corresponde ao token de entrada';
        actions.push(step);
        stack.clear();
        entryQueue.clear();
        break;
      }
    }

    if (currentSymbol in grammar.parsingTable) {
      if (
        currentToken in grammar.parsingTable[currentSymbol]
      ) {
        const production =
          grammar.parsingTable[currentSymbol][currentToken];

        if (!production) {
          step['action'] =
            'Erro: não há produção para o símbolo atual';
          actions.push(step);
          stack.clear();
          entryQueue.clear();
          break;
        } else {
          step['action'] =
            `Expande: ${currentSymbol} -> ${production}`;
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
    } else {
      step['action'] =
        'Erro: símbolo não encontrado na tabela de parsing';
      actions.push(step);
      stack.clear();
      entryQueue.clear();
      break;
    }
  }

  return actions;
}
