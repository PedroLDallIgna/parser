import {
  html,
  render as litRender,
  TemplateResult,
} from 'lit-html';
import { GrammarSchema } from '../../types/grammar-schema';
import Stack from '../../stack';
import { drawTree } from '../derivation-tree';
import { Node } from '../../types/node';

export class TokenGenerator {
  private _grammar: GrammarSchema;
  private _derivation: string;
  private _history: string[];
  private _historyIndex: number;
  public _element: HTMLElement;
  private _onGenerated: (
    token: string,
    treeData?: Node
  ) => void;
  private _derivationTree: Node;
  private _leftMostNode: Node;
  private _notExpandedNodes: Stack<Node>;
  private _treeHistory: string[] = [];
  private _isOpen: boolean = false;

  constructor({
    grammar,
    element,
    onGenerated,
  }: {
    grammar: GrammarSchema;
    element: HTMLElement;
    onGenerated?: (token: string, treeData?: Node) => void;
    extra?: string | TemplateResult;
  }) {
    this._grammar = grammar;
    this._derivation = grammar.startSymbol;
    this._history = [this._derivation];
    this._historyIndex = 0;
    this._element = element;
    this._onGenerated = onGenerated || (() => {});
    this._derivationTree = {
      name: this._grammar.startSymbol,
      children: [],
    };
    this._notExpandedNodes = new Stack<Node>();
    this._notExpandedNodes.push(this._derivationTree);
    this._treeHistory.push(
      JSON.stringify({ ...this._derivationTree })
    );
    this._leftMostNode = this._notExpandedNodes.peek()!;

    // TODO: to track undo and redo actions, change to two stacks (undoStack and redoStack)
  }

  private get leftMostNonTerminal(): string {
    for (let i = 0; i < this._derivation.length; i++) {
      if (
        this._grammar.nonTerminals.includes(
          this._derivation[i]
        )
      ) {
        return this._derivation[i];
      }
    }
    return '';
  }

  private handleReset() {
    this._derivation = `${this._grammar.startSymbol}`;
    this._history = [this._derivation];
    this._historyIndex = 0;
    this._derivationTree = {
      name: this._grammar.startSymbol,
      children: [],
    };
    this._notExpandedNodes.clear();
    this._notExpandedNodes.push(this._derivationTree);
    this._leftMostNode = this._notExpandedNodes.peek()!;

    this.render();
  }

  private handleUndo() {
    if (this._historyIndex > 0) {
      this._historyIndex--;
      this._derivation = this._history[this._historyIndex];
      this._derivationTree = JSON.parse(
        this._treeHistory[this._historyIndex]
      ) as Node;

      this.render();
    }
  }

  private handleRedo() {
    if (this._historyIndex < this._history.length - 1) {
      this._historyIndex++;
      this._derivation = this._history[this._historyIndex];
      this._derivationTree = JSON.parse(
        this._treeHistory[this._historyIndex]
      ) as Node;

      this.render();
    }
  }

  private expand(rule: string): void {
    const index = this._derivation.indexOf(
      this.leftMostNonTerminal
    );
    if (index !== -1) {
      // if (rule === 'ε') rule = '';

      this._derivation =
        this._derivation.slice(0, index) +
        rule +
        this._derivation.slice(index + 1);

      // TODO: update derivation tree on undo and redo actions

      console.log('peek', this._notExpandedNodes.peek());

      const node: Node = {
        name: this._derivation[index],
        children: rule.split('').map((char) => ({
          name: char === '' ? 'ε' : char,
          children: [],
        })),
      };

      const auxNode: Node[] = node.children.filter(
        ({ name }) =>
          this._grammar.nonTerminals.includes(name)
      );

      this._leftMostNode.children = [...node.children];
      this._notExpandedNodes.pop();

      console.log(this._derivationTree);

      for (const node of auxNode.reverse()) {
        this._notExpandedNodes.push(node);
      }

      this._leftMostNode = this._notExpandedNodes.peek()!;

      this._derivation = this._derivation.replace('ε', '');

      // Update history
      this._history = this._history.slice(
        0,
        this._historyIndex + 1
      );
      this._history.push(this._derivation);
      this._treeHistory = this._treeHistory.slice(
        0,
        this._historyIndex + 1
      );
      this._treeHistory.push(
        JSON.stringify({
          ...this._derivationTree,
        })
      );
      this._historyIndex++;
    }

    this.render();

    if (!this.leftMostNonTerminal) {
      this._onGenerated(
        this._derivation,
        this._derivationTree
      );
    }
  }

  private handleCopy() {
    navigator.clipboard.writeText(this._derivation);
  }

  private content() {
    return html`
      <div class="token-generator flex flex-row p-4 mt-4 mb-4 space-x-4 bg-white rounded-lg shadow-md">
        <div class="controls flex flex-col space-y-2 p-2 justify-center rounded-md shadow-md">
          <button
            class="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            @click=${() => this.handleReset()}
            title="Resetar token"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z" stroke-width="1" stroke="currentColor"/></svg>
          </button>
          <button
            class="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              this._historyIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            }"
            @click=${() => this.handleUndo()}
            ?disabled=${this._historyIndex === 0}
            title="Desfazer"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M20 10H7.815l3.587-3.586L10 5l-6 6l6 6l1.402-1.415L7.818 12H20a6 6 0 0 1 0 12h-8v2h8a8 8 0 0 0 0-16" stroke-width="1" stroke="currentColor"/></svg>
          </button>
          <button
            class="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              this._historyIndex ===
              this._history.length - 1
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            }"
            @click=${() => this.handleRedo()}
            ?disabled=${
              this._historyIndex ===
              this._history.length - 1
            }
            title="Refazer"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M12 10h12.185l-3.587-3.586L22 5l6 6l-6 6l-1.402-1.415L24.182 12H12a6 6 0 0 0 0 12h8v2h-8a8 8 0 0 1 0-16" stroke-width="1" stroke="currentColor"/></svg>
          </button>
          <button
            class="bg-blue-500 text-white py-2 px-3 rounded-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Árvore de derivação"
            @click=${() => this.toggle()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 16 16"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                d="M7.997 4.152V7.5m0 0h5V11m-5-3.5h-5V11m5-3.5V11M9.5 2.507V4.51h-3V2.507zm5 7.993v2h-3v-2zm-5 0v2h-3v-2zm-5 0v2h-3v-2z"
                stroke-width="1"
              />
            </svg>
          </button>
        </div>
        <div class="token-display-container flex flex-col space-y-2">
          <div class="token-display mb-4">
            <label class="font-bold text-lg inline-flex text-gray-800 space-x-2 items-center">
              <span>Derivação:</span>
              <div class="derivation-result inline-flex">
                <input name="token" type="text" .value=${this._derivation} readonly class="derivation w-48 text-gray-600 bg-gray-200 py-1 px-2 rounded-l-sm focus:outline-none"/>
                <button class="flex items-center copy-icon cursor-pointer py-1 px-2  bg-gray-300 rounded-r-sm hover:bg-gray-400 focus:outline" @click=${() => this.handleCopy()} ?disabled=${!!this.leftMostNonTerminal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10zm0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2" stroke-width="1" stroke="currentColor"/><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z" stroke-width="1" stroke="currentColor"/></svg>
                </button>
              </div>
            </p>
          </div>
          ${Object.entries(this._grammar.rules).map(
            ([nonTerminal, rules]) => {
              return html`
                <div
                  class="flex flex-row items-center space-x-1"
                >
                  <p
                    class="non-terminal font-bold text-lg text-gray-800"
                  >
                    ${nonTerminal}
                  </p>
                  <span
                    class="non-terminal font-bold text-lg text-gray-800"
                    >::=</span
                  >
                  <ul class="flex flex-row space-x-2">
                    ${rules.map(
                      (rule) =>
                        html` <li>
                          <button
                            class="production-rule bg-gray-200 text-white b-solid rounded py-1 px-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            ?disabled=${this
                              .leftMostNonTerminal !==
                            nonTerminal}
                            @click=${() =>
                              this.expand(rule)}
                          >
                            ${rule}
                          </button>
                        </li>`
                    )}
                  </ul>
                </div>
              `;
            }
          )}
        </div>
      </div>
      ${this.renderModal()}
    `;
  }

  private toggle() {
    this._isOpen = !this._isOpen;
    this.render();

    if (this._isOpen)
      drawTree(
        JSON.parse(
          this._treeHistory[this._historyIndex]
        ) as Node
      );
  }

  private renderModal() {
    if (!this._isOpen) return html``;

    return html`
      <div
        class="relative z-10"
        aria-labelledby="dialog-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="fixed inset-0 bg-gray-500/75 transition-opacity"
          aria-hidden="true"
        ></div>

        <div
          class="fixed inset-0 z-10 w-screen overflow-y-auto"
        >
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <div
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-w-4xl w-full sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div
                class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
              >
                <div class="sm:flex sm:items-start">
                  <div
                    class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                  >
                    <h3
                      class="text-lg font-semibold text-gray-900"
                      id="dialog-title"
                    >
                      Árvore de Derivação
                    </h3>
                    <div class="mt-2">
                      <svg
                        id="derivation-tree"
                        class="mx-auto"
                      ></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
              >
                <button
                  type="button"
                  class="cursor-pointer inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                  @click=${() => this.toggle()}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    litRender(this.content(), this._element);
  }
}
