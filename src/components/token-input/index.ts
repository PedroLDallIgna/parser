import { html, TemplateResult } from 'lit-html';
import { createRef, ref } from 'lit-html/directives/ref.js';

export class TokenInput {
  private token: string;
  private delay: number = 0;
  private onRun: (delay: number) => void;
  private onDebug?: () => void;
  private onInputChange: (event: Event) => void;
  private delayValueEl: ReturnType<
    typeof createRef<HTMLSpanElement>
  >;

  constructor({
    token,
    onRun,
    onDebug,
    onInputChange,
  }: {
    token?: string;
    onRun: (delay: number) => void;
    onDebug?: () => void;
    onInputChange: (event: Event) => void;
  }) {
    this.token = token || '';
    this.onRun = onRun;
    this.onDebug = onDebug;
    this.onInputChange = onInputChange;
    this.delayValueEl = createRef<HTMLSpanElement>();
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
              this.onInputChange(event)}
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
          class="flex items-center space-x-2 p-2 rounded-md shadow-md"
        >
          <button
            @click=${(event: any) => this.onRun(this.delay)}
            class="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Run without debugging"
          >
            Run
          </button>
          <button
            @click=${(event: any) => this.onDebug?.()}
            class="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Run & Debug
          </button>
        </div>
      </div>
    `;
  }
}
