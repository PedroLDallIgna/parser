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

const items = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 },
];

const columns = ['id', 'name', 'age'];

const myTable = Table({ items, columns });
render(myTable, root);

// render(tokenForm, root);
