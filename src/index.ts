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
import { Modal } from './components/core/modal';
import { TokenGenerator } from './components/token-generator';
import { maskToken } from './utils/maskToken';

console.log(grammar);

const parsedGrammar = grammar as GrammarSchema;

const tokenInput = <HTMLInputElement>(
  document.getElementById('token-input')!
);
const actionBarEl = <HTMLInputElement>(
  document.getElementById('toolbar')!
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

const openActionBar = (
  actions: any[],
  parsingStackTable: ParsingStackTable,
  n: number
) => {
  const actionBar = html`
    <div class="flex flex-row items-center p-4 space-x-2">
      <button
        class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${n ===
        0
          ? 'opacity-50 cursor-not-allowed disabled'
          : 'cursor-pointer'}"
        @click=${(e: any) => {
          nextStep(actions, parsingStackTable, n);
        }}
        ?disabled=${n === 0}
      >
        Step back
      </button>
      <button
        class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${n ===
        actions.length
          ? 'opacity-50 cursor-not-allowed disabled'
          : 'cursor-pointer'}"
        @click=${(e: any) => {
          previousStep(actions, parsingStackTable, n);
        }}
        ?disabled=${n === actions.length}
      >
        Step forward
      </button>
    </div>
  `;

  render(actionBar, actionBarEl);
};

const tokenInputForm = new TokenInput({
  grammar: parsedGrammar,
  token: entryToken,
  onRun: (delay) => {
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

    executeStack(delay);
  },
  mask: (value: string) => {
    const maskedToken = maskToken(
      value,
      parsedGrammar.terminals
    );
    console.log('Masked Token:', maskedToken);
    return maskedToken;
  },
  onInputChange: (value: string) => {
    entryToken = value;
    console.log('Input changed:', entryToken);
  },
  onDebug: () => {
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

    let n = 0;
    const actions = process(
      stack,
      entryQueue,
      parsedGrammar
    );
    const parsingStackTable = new ParsingStackTable(
      actions
    );

    render(parsingStackTable.render(0), parsing);

    // render debugging toolbar
    openActionBar(actions, parsingStackTable, n);
  },
  extra: html`<div id="grammar"></div>`,
});

render(tokenInputForm.render(), tokenInput);

const grammarInfo = <HTMLDivElement>(
  document.getElementById('grammar')!
);

const executeStack = (delay: number) => {
  const actions = process(stack, entryQueue, parsedGrammar);

  const parsingStackTable = new ParsingStackTable(actions);

  render(parsingStackTable.render(0), parsing);

  let n = 1;
  const interval = setInterval(() => {
    if (n <= actions.length) {
      render(parsingStackTable.render(n), parsing);
      n++;
    } else {
      clearInterval(interval);
    }
  }, delay);
};

function previousStep(
  actions: any[],
  parsingStackTable: ParsingStackTable,
  n: number
) {
  console.log('clicked');

  if (n < actions.length) {
    n++;
    render(parsingStackTable.render(n), parsing);
  }

  openActionBar(actions, parsingStackTable, n);
}

function nextStep(
  actions: any[],
  parsingStackTable: ParsingStackTable,
  n: number
) {
  console.log('clicked');

  if (n > 0) {
    n--;
    render(parsingStackTable.render(n), parsing);
  }

  openActionBar(actions, parsingStackTable, n);
}

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
      gap: '2',
    }),
    parsingTable,
  ],
  gap: '2',
});

const grammarInfoModal = new Modal({
  btnLabel: 'Ver gramática',
  content: html`<div
    class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
  >
    <h3
      class="text-lg font-semibold text-gray-900"
      id="dialog-title"
    >
      Gramática
    </h3>
    <div class="mt-2">${grammarInfoContainer.render()}</div>
  </div>`,
  element: grammarInfo,
});

grammarInfoModal.render();

const tokenGeneratorEl = document.getElementById(
  'token-generator'
)!;

const tokenGenerator = new TokenGenerator({
  element: tokenGeneratorEl,
  grammar: parsedGrammar,
});

tokenGenerator.render();
