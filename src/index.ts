import { html, render } from 'lit-html';
import Queue from './queue';
import Stack from './stack';
import { process } from './process';

// data
// import grammar from './grammar.json';
// import grammar from './grammars/grammar2.json';
// import grammar from './grammars/grammar3.json';
// import grammar from './grammars/grammar4.json';
// import grammar from './grammars/grammar5.json';
// import grammar from './grammars/grammar6.json';
// import grammar from './grammars/grammar7.json';
import grammar from './grammars/grammar8.json';

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
import { validateToken } from './utils/validateToken';

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

let entryToken = '';

// type must be alphabet and $
const entryQueue = new Queue<string>();

// type must be non terminals and $
const stack = new Stack<string>();

let debugging = false;

const openActionBar = (
  actions: any[],
  parsingStackTable: ParsingStackTable,
  n: number
) => {
  const actionBar = html`
    <div
      class="flex flex-row items-center justify-center p-2 space-x-2 w-min bg-white rounded-md mx-auto mb-1 shadow-sm"
    >
      <button
        class="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        @click=${() => stopDebugging()}
        title="Parar depuração"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M24 8v16H8V8zm0-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2"
            stroke-width="1"
            stroke="currentColor"
          />
        </svg>
      </button>
      <button
        class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${n ===
        0
          ? 'opacity-50 cursor-not-allowed disabled'
          : 'cursor-pointer'}"
        @click=${(e: any) => {
          previousStep(actions, parsingStackTable, n);
        }}
        ?disabled=${n === 0}
        title="Passo anterior"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M27 28a1 1 0 0 1-.5-.13l-19-11a1 1 0 0 1 0-1.74l19-11a1 1 0 0 1 1 0A1 1 0 0 1 28 5v22a1 1 0 0 1-1 1M10 16l16 9.27V6.73zM2 4h2v24H2z"
            stroke-width="1"
            stroke="currentColor"
          />
        </svg>
      </button>
      <button
        class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${n ===
        actions.length
          ? 'opacity-50 cursor-not-allowed disabled'
          : 'cursor-pointer'}"
        @click=${(e: any) => {
          nextStep(actions, parsingStackTable, n);
        }}
        ?disabled=${n === actions.length}
        title="Passo seguinte"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M5 28a1 1 0 0 1-1-1V5a1 1 0 0 1 .5-.87a1 1 0 0 1 1 0l19 11a1 1 0 0 1 0 1.74l-19 11A1 1 0 0 1 5 28M6 6.73v18.54L22 16zM28 4h2v24h-2z"
            stroke-width="1"
            stroke="currentColor"
          />
        </svg>
      </button>
    </div>
  `;

  render(actionBar, actionBarEl);
};

const tokenInputForm = new TokenInput({
  grammar: parsedGrammar,
  token: entryToken,
  onRun: (delay) => {
    if (
      validateToken(entryToken, parsedGrammar.terminals)
    ) {
      entryQueue.clear();
      stack.clear();

      for (const char of entryToken) {
        entryQueue.enqueue(char);
      }
      entryQueue.enqueue('$');
      // console.log('Entry Queue:', entryQueue);

      stack.push('$');
      stack.push(grammar.startSymbol);
      // console.log('Initial Stack:', stack);

      executeStack(delay);
    }
  },
  mask: (value: string) => {
    const maskedToken = maskToken(
      value,
      parsedGrammar.terminals
    );
    return maskedToken;
  },
  onInputChange: (value: string) => {
    entryToken = value;
  },
  onDebug: () => {
    if (
      validateToken(entryToken, parsedGrammar.terminals)
    ) {
      entryQueue.clear();
      stack.clear();

      for (const char of entryToken) {
        entryQueue.enqueue(char);
      }
      entryQueue.enqueue('$');
      // console.log('Entry Queue:', entryQueue);

      stack.push('$');
      stack.push(grammar.startSymbol);
      // console.log('Initial Stack:', stack);

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

      debugging = true;

      // render debugging toolbar
      openActionBar(actions, parsingStackTable, n);
    }
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

function stopDebugging() {
  debugging = false;
  render('', actionBarEl);
  render('', parsing);
}

function nextStep(
  actions: any[],
  parsingStackTable: ParsingStackTable,
  n: number
) {
  if (n < actions.length) {
    n++;
    render(parsingStackTable.render(n), parsing);
  }

  openActionBar(actions, parsingStackTable, n);
}

function previousStep(
  actions: any[],
  parsingStackTable: ParsingStackTable,
  n: number
) {
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
  btnLabel: html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 32 32"
  >
    <path
      fill="currentColor"
      d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 25c-5.3 0-10.9-3.93-12.93-9C5.1 10.93 10.7 7 16 7s10.9 3.93 12.93 9C26.9 21.07 21.3 25 16 25"
      stroke-width="1"
      stroke="currentColor"
    />
    <path
      fill="currentColor"
      d="M16 10a6 6 0 1 0 6 6a6 6 0 0 0-6-6m0 10a4 4 0 1 1 4-4a4 4 0 0 1-4 4"
      stroke-width="1"
      stroke="currentColor"
    />
  </svg>`,
  btnTitle: 'Ver Gramática',
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
