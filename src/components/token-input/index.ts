import { html, TemplateResult } from 'lit-html';
import { createRef, ref } from 'lit-html/directives/ref.js';
import { GrammarSchema } from '../../types/grammar-schema';
import {
  generateRandomToken,
  generateTokenByGrammarRules,
} from '../../utils/generateToken';

export class TokenInput {
  private grammar: GrammarSchema;
  private token: string;
  private delay: number = 0;
  private onRun: (delay: number) => void;
  private onDebug?: () => void;
  private onInputChange: (value: string) => void;
  private delayValueEl: ReturnType<
    typeof createRef<HTMLSpanElement>
  >;
  private inputValueEl: ReturnType<
    typeof createRef<HTMLInputElement>
  >;

  constructor({
    grammar,
    token,
    onRun,
    onDebug,
    onInputChange,
  }: {
    grammar: GrammarSchema;
    token?: string;
    onRun: (delay: number) => void;
    onDebug?: () => void;
    onInputChange: (value: string) => void;
  }) {
    this.grammar = grammar;
    this.token = token || '';
    this.onRun = onRun;
    this.onDebug = onDebug;
    this.onInputChange = onInputChange;
    this.delayValueEl = createRef<HTMLSpanElement>();
    this.inputValueEl = createRef<HTMLInputElement>();
  }

  private handleRandomTokenByGrammar(): void {
    const randomToken = generateTokenByGrammarRules(
      this.grammar,
      this.grammar.startSymbol,
      20
    );

    this.token = randomToken;
    this.inputValueEl.value!.value = this.token;
    this.onInputChange(this.token);
  }

  private handleRandomToken(): void {
    const randomToken = generateRandomToken(
      this.grammar.terminals
    );

    this.token = randomToken;
    this.inputValueEl.value!.value = this.token;
    this.onInputChange(this.token);
  }

  render(): TemplateResult {
    return html`
      <div>
        <label class="block">
          <span class="text-gray-700">Token:</span>
          <input
            type="text"
            class="form-input mt-1 block p-2 w-98 h-12 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder=""
            @input=${(event: any) =>
              this.onInputChange(event.target.value)}
            .value=${this.token}
            ${ref(this.inputValueEl)}
          />
        </label>
        <label
          class="flex flex-row items-center space-x-2 mt-4 mb-4"
        >
          <span class="text-gray-700">Delay:</span>
          <input
            type="range"
            class="form-input"
            min="0"
            max="500"
            step="25"
            @input=${(event: any) => {
              this.delay = Number(event.target.value) * 10;
              this.delayValueEl.value!.textContent = `${this.delay} ms`;
            }}
            .value=${this.delay / 10}
          />
          <span ${ref(this.delayValueEl)}
            >${this.delay} ms</span
          >
        </label>
        <div
          class="inline-flex items-center space-x-2 p-2 rounded-md shadow-md"
        >
          <button
            @click=${() => this.onRun(this.delay)}
            class="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Run without debugging"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="M7 28a1 1 0 0 1-1-1V5a1 1 0 0 1 1.482-.876l20 11a1 1 0 0 1 0 1.752l-20 11A1 1 0 0 1 7 28M8 6.69v18.62L24.925 16Z"
                stroke-width="1"
                stroke="currentColor"
              />
            </svg>
          </button>
          <button
            @click=${() => this.onDebug?.()}
            class="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="m29.83 20l.34-2l-5.17-.85v-4.38l5.06-1.36l-.51-1.93l-4.83 1.29A9 9 0 0 0 20 5V2h-2v2.23a8.8 8.8 0 0 0-4 0V2h-2v3a9 9 0 0 0-4.71 5.82L2.46 9.48L2 11.41l5 1.36v4.38L1.84 18l.32 2L7 19.18a8.9 8.9 0 0 0 .82 3.57l-4.53 4.54l1.42 1.42l4.19-4.2a9 9 0 0 0 14.2 0l4.19 4.2l1.42-1.42l-4.54-4.54a8.9 8.9 0 0 0 .83-3.57ZM15 25.92A7 7 0 0 1 9 19v-6h6ZM9.29 11a7 7 0 0 1 13.42 0ZM23 19a7 7 0 0 1-6 6.92V13h6Z"
                stroke-width="1"
                stroke="currentColor"
              />
            </svg>
          </button>
          <button
            @click=${() =>
              this.handleRandomTokenByGrammar()}
            class="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Token aleatório válido"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none" fill-rule="evenodd">
                <path
                  d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
                />
                <path
                  fill="currentColor"
                  d="M18 3a3 3 0 0 1 2.995 2.824L21 6v12a3 3 0 0 1-2.824 2.995L18 21H6a3 3 0 0 1-2.995-2.824L3 18V6a3 3 0 0 1 2.824-2.995L6 3zM8.5 14a1.5 1.5 0 0 0-1.493 1.356L7 15.5l.007.154a1.5 1.5 0 0 0 2.986 0L10 15.51l-.007-.154A1.5 1.5 0 0 0 8.5 14m7 0a1.5 1.5 0 0 0-1.493 1.356L14 15.51a1.5 1.5 0 0 0 2.993.144L17 15.5a1.5 1.5 0 0 0-1.5-1.5M12 10.5a1.5 1.5 0 0 0-1.493 1.356l-.007.154a1.5 1.5 0 0 0 2.993.144L13.5 12a1.5 1.5 0 0 0-1.5-1.5M8.5 7a1.5 1.5 0 0 0-1.493 1.356L7 8.5l.007.154a1.5 1.5 0 0 0 2.986 0L10 8.51l-.007-.154A1.5 1.5 0 0 0 8.5 7m7 0a1.5 1.5 0 0 0-1.493 1.356L14 8.51a1.5 1.5 0 0 0 2.993.144L17 8.5A1.5 1.5 0 0 0 15.5 7"
                  stroke-width="0.5"
                  stroke="currentColor"
                />
              </g>
            </svg>
          </button>
          <button
            @click=${() => this.handleRandomToken()}
            class="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Token aleatório"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none" fill-rule="evenodd">
                <path
                  d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
                />
                <path
                  fill="currentColor"
                  d="M18 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm0 2H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1m-9.5 9a1.5 1.5 0 0 1 1.493 1.356l.007.154a1.5 1.5 0 0 1-2.993.144L7 15.5A1.5 1.5 0 0 1 8.5 14m7 0a1.5 1.5 0 0 1 1.493 1.356l.007.154a1.5 1.5 0 0 1-2.993.144L14 15.5a1.5 1.5 0 0 1 1.5-1.5M12 10.5a1.5 1.5 0 0 1 1.493 1.356l.007.154a1.5 1.5 0 0 1-2.993.144L10.5 12a1.5 1.5 0 0 1 1.5-1.5M8.5 7a1.5 1.5 0 0 1 1.493 1.356L10 8.51a1.5 1.5 0 0 1-2.993.144L7 8.5A1.5 1.5 0 0 1 8.5 7m7 0a1.5 1.5 0 0 1 1.493 1.356L17 8.51a1.5 1.5 0 0 1-2.993.144L14 8.5A1.5 1.5 0 0 1 15.5 7"
                  stroke-width="0.5"
                  stroke="currentColor"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}
