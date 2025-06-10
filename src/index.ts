import { html, render } from 'lit-html';
import Queue from './queue';
import Stack from './stack';
import { process } from './process';

// data
// import grammar from './grammar.json';
import grammar from './grammars/grammar2.json';

// styles
import './index.css';

// components
import { GrammarSchema } from './types/grammar-schema';
import { ParsingStackTable } from './components/parsing-stack-table';
import { ParsingTable } from './components/parsing-table';
import { FirstFollowTable } from './components/first-follow-table';
import { Column } from './components/core/column';
import { Row } from './components/core/row';
import { GrammarTable } from './components/grammar-table';
import { TokenInput } from './components/token-input';

console.log(grammar);

const parsedGrammar = grammar as GrammarSchema;

const tokenInput = <HTMLInputElement>(
  document.getElementById('token-input')!
);
const grammarInfo = <HTMLDivElement>(
  document.getElementById('grammar')!
);
const parsing = <HTMLDivElement>(
  document.getElementById('parsing')!
);

// const entryToken = 'adcaa';
// const entryToken = 'dbbbbc';
// const entryToken = 'ccabbc';
// const entryToken = 'acbbca';
// const entryToken = 'acabbca';
let entryToken = '';

// type must be alphabet and $
const entryQueue = new Queue<string>();

// type must be non terminals and $
const stack = new Stack<string>();

// validate token
// verify token

// for (const char of entryToken) {
//   entryQueue.enqueue(char);
// }
// entryQueue.enqueue('$');
// console.log('Entry Queue:', entryQueue);

// stack.push('$');
// stack.push(grammar.startSymbol);
// console.log('Initial Stack:', stack);

// const actions = process(stack, entryQueue, parsedGrammar);

// console.log('Final actions:', actions);

const myButton = html` <button
  @click=${(e: any) => console.log('Clicked')}
>
  Click me
</button>`;

const tokenInputForm = new TokenInput({
  token: entryToken,
  onRun: () => {
    entryQueue.clear();
    stack.clear();

    for (const char of entryToken) {
      entryQueue.enqueue(char);
    }
    entryQueue.enqueue('$');
    console.log('Entry Queue:', entryQueue);

    stack.push('$');
    stack.push(grammar.startSymbol);
    console.log('Initial Stack:', stack);

    executeStack();
  },
  onInputChange: (event: Event) => {
    const { value } = event.target as HTMLInputElement;
    entryToken = value;
  },
  onPause: () => {
    entryQueue.clear();
    stack.clear();

    for (const char of entryToken) {
      entryQueue.enqueue(char);
    }
    entryQueue.enqueue('$');
    console.log('Entry Queue:', entryQueue);

    stack.push('$');
    stack.push(grammar.startSymbol);
    console.log('Initial Stack:', stack);

    stepByStep();
  },
});

render(tokenInputForm.render(), tokenInput);

const executeStack = () => {
  const actions = process(stack, entryQueue, parsedGrammar);

  const parsingStackTable = new ParsingStackTable(actions);

  render(parsingStackTable.render(actions.length), parsing);
};

function* steps() {}

const stepByStep = () => {
  const actions = process(stack, entryQueue, parsedGrammar);

  const parsingStackTable = new ParsingStackTable(actions);

  let n = 1;
  const interval = setInterval(() => {
    if (n <= actions.length) {
      render(parsingStackTable.render(n), parsing);
      n++;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

const grammarTable = new GrammarTable({
  rules: parsedGrammar.rules,
});

const firstFollowTable = new FirstFollowTable({
  firstSets: parsedGrammar.firstSets,
  followSets: parsedGrammar.followSets,
});

const parsingTable = new ParsingTable({
  parsingTable: parsedGrammar.parsingTable,
  terminals: parsedGrammar.terminals,
});

// const parsingStackTable = new ParsingStackTable(actions);

const grammarInfoContainer = new Column({
  children: [
    new Row({
      children: [grammarTable, firstFollowTable],
      gap: '4',
    }),
    parsingTable,
  ],
  gap: '4',
});

// render(parsingStackTable.render(0), parsing);

// let n = 1;
// const interval = setInterval(() => {
//   if (n <= actions.length) {
//     render(parsingStackTable.render(n), parsing);
//     n++;
//   } else {
//     clearInterval(interval);
//   }
// }, 1000);

render(grammarInfoContainer.render(), grammarInfo);
// render(parsingStackTable.render(actions.length), parsing);
