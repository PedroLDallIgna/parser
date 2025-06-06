import { html, render } from 'lit-html';
import Queue from './queue';
import Stack from './stack';
import { process } from './process';

// data
// import grammar from './grammar.json';
import grammar from './grammars/grammar2.json';

// styles
import './index.css';
import { GrammarSchema } from './types/grammar-schema';
import { Table } from './components/table';
import { TableColumn } from './components/table-column';
import { TableRow } from './components/table-row';
import { TableCell } from './components/table-cell';
import { set } from 'lodash';

console.log(grammar);

const parsedGrammar = grammar as GrammarSchema;

const root = <HTMLDivElement>(
  document.getElementById('app')!
);

const entryToken = 'adcaa';

// type must be alphabet and $
const entryQueue = new Queue<string>();

// type must be non terminals and $
const stack = new Stack<string>();

// validate token
// verify token

for (const char of entryToken) {
  entryQueue.enqueue(char);
}
entryQueue.enqueue('$');
console.log('Entry Queue:', entryQueue);

stack.push('$');
stack.push(grammar.startSymbol);
console.log('Initial Stack:', stack);

const actions = process(stack, entryQueue, parsedGrammar);

console.log('Final actions:', actions);

const myTable = (rows: number) =>
  new Table({
    rows: [
      ...actions
        .map((action) => {
          return new TableRow({
            cells: [
              new TableCell({
                value: action.stack.join(' '),
              }),
              new TableCell({
                value: action.queue.join(' '),
              }),
              new TableCell({ value: action.action }),
            ],
          });
        })
        .slice(0, rows),
    ],
    columns: [
      new TableColumn({ label: 'Pilha' }),
      new TableColumn({ label: 'Entrada' }),
      new TableColumn({ label: 'Ação' }),
    ],
    index: true,
  });

let n = 1;
const interval = setInterval(() => {
  if (n <= actions.length) {
    render(myTable(n).render(), root);
    n++;
  } else {
    clearInterval(interval);
  }
}, 1000);

// render(tokenForm, root);
