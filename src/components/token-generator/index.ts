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

  private resetToken() {
    this._derivation = `${this._grammar.startSymbol}`;
    this._history = [this._derivation];
    this._historyIndex = 0;

    this.render();
  }

  private navigateBackward() {
    if (this._historyIndex > 0) {
      this._historyIndex--;
      this._derivation = this._history[this._historyIndex];

      this.render();
    }
  }

  private navigateForward() {
    if (this._historyIndex < history.length - 1) {
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
  private content() {
    return html`
      <div>
        <div class="controls flex flex-row space-x-2 mb-4">
          <button
            class="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            @click=${() => this.resetToken()}
            title="Resetar token"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 15 15"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M4.854 2.146a.5.5 0 0 1 0 .708L3.707 4H9a4.5 4.5 0 1 1 0 9H5a.5.5 0 0 1 0-1h4a3.5 3.5 0 1 0 0-7H3.707l1.147 1.146a.5.5 0 1 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2a.5.5 0 0 1 .708 0"
                clip-rule="evenodd"
                stroke-width="1"
                stroke="currentColor"
              />
            </svg>
          </button>
          <button
            class="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${this
              ._historyIndex === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'}"
            @click=${() => this.navigateBackward()}
            ?disabled=${this._historyIndex === 0}
            title="Alteração anterior"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 15 15"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M6.854 3.146a.5.5 0 0 1 0 .708L3.707 7H12.5a.5.5 0 0 1 0 1H3.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0"
                clip-rule="evenodd"
                stroke-width="1"
                stroke="currentColor"
              />
            </svg>
          </button>
          <button
            class="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${this
              ._historyIndex ===
            history.length - 1
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'}"
            @click=${() => this.navigateForward()}
            ?disabled=${this._historyIndex ===
            this._history.length - 1}
            title="Alteração seguinte"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 15 15"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M8.146 3.146a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L11.293 8H2.5a.5.5 0 0 1 0-1h8.793L8.146 3.854a.5.5 0 0 1 0-.708"
                clip-rule="evenodd"
                stroke-width="1"
                stroke="currentColor"
              />
            </svg>
          </button>
        </div>
        <div class="token-display mb-4">
          <p class="font-bold text-lg text-gray-800">
            Derivação: ${this._derivation}
          </p>
        </div>
        ${Object.entries(this._grammar.rules).map(
          ([nonTerminal, rules]) => {
            return html`
              <div
                class="flex flex-row items-center space-x-1 m-2"
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
                          @click=${() => this.expand(rule)}
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
    `;
  }

  render() {
    litRender(this.content(), this._element);
  }
}
