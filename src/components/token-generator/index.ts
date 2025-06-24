import { html, render as litRender } from 'lit-html';
import { GrammarSchema } from '../../types/grammar-schema';

export class TokenGenerator {
  private _grammar: GrammarSchema;
  private _derivation: string;
  private _history: string[];
  private _historyIndex: number;
  public _element: HTMLElement;
  private _onGenerated: (token: string) => void;

  constructor({
    grammar,
    element,
    onGenerated,
  }: {
    grammar: GrammarSchema;
    element: HTMLElement;
    onGenerated?: (token: string) => void;
  }) {
    this._grammar = grammar;
    this._derivation = grammar.startSymbol;
    this._history = [this._derivation];
    this._historyIndex = 0;
    this._element = element;
    this._onGenerated = onGenerated || (() => {});
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

    this.render();
  }

  private handleUndo() {
    if (this._historyIndex > 0) {
      this._historyIndex--;
      this._derivation = this._history[this._historyIndex];

      this.render();
    }
  }

  private handleRedo() {
    if (this._historyIndex < this._history.length - 1) {
      this._historyIndex++;
      this._derivation = this._history[this._historyIndex];

      this.render();
    }
  }

  private expand(rule: string): void {
    // console.log('Expanding rule:', rule);

    const index = this._derivation.indexOf(
      this.leftMostNonTerminal
    );
    if (index !== -1) {
      if (rule === 'ε') rule = '';

      this._derivation =
        this._derivation.slice(0, index) +
        rule +
        this._derivation.slice(index + 1);

      // Update history
      this._history = this._history.slice(
        0,
        this._historyIndex + 1
      );
      this._history.push(this._derivation);
      this._historyIndex++;
    }

    // console.log('Expanded token:', this._derivation);

    this.render();

    if (!this.leftMostNonTerminal) {
      this._onGenerated(this._derivation);
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
            @click=${() => {}}
            title="Árvore de derivação"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M7.997 4.152V7.5m0 0h5V11m-5-3.5h-5V11m5-3.5V11M9.5 2.507V4.51h-3V2.507zm5 7.993v2h-3v-2zm-5 0v2h-3v-2zm-5 0v2h-3v-2z" stroke-width="1"/></svg>
          </button>
        </div>
        <div class="token-display-container flex flex-col space-y-2">
          <div class="token-display mb-4">
            <label class="font-bold text-lg inline-flex text-gray-800 space-x-2 items-center">
              <span>Derivação:</span>
              <div class="derivation-result inline-flex">
                <input name="token" type="text" .value=${this._derivation} readonly class="derivation w-32 text-gray-600 bg-gray-200 py-1 px-2 rounded-l-sm focus:outline-none"/>
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
    `;
  }

  render() {
    litRender(this.content(), this._element);
  }
}
