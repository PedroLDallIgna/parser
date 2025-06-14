import { html, TemplateResult } from 'lit-html';

export class TokenInput {
  private token: string;
  private onRun: () => void;
  private onPause?: () => void;
  private onStepOver?: () => void;
  private onDebug?: () => void;
  private onStop?: () => void;
  private onInputChange: (event: Event) => void;
  private onSubmit?: (event: Event) => void;

  constructor({
    token,
    onRun,
    onPause,
    onStepOver,
    onDebug,
    onStop,
    onInputChange,
    onSubmit,
  }: {
    token?: string;
    onRun: () => void;
    onPause?: () => void;
    onStepOver?: () => void;
    onDebug?: () => void;
    onStop?: () => void;
    onInputChange: (event: Event) => void;
    onSubmit?: (event: Event) => void;
  }) {
    this.token = token || '';
    this.onRun = onRun;
    this.onPause = onPause;
    this.onStepOver = onStepOver;
    this.onDebug = onDebug;
    this.onStop = onStop;
    this.onInputChange = onInputChange;
    this.onSubmit = onSubmit;
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
        <div
          class="flex items-center space-x-2 p-2 rounded-md shadow-md"
        >
          <button
            @click=${(event: any) => this.onRun()}
            class="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Run without debugging"
          >
            Run
          </button>
          <button
            @click=${(event: any) => this.onPause?.()}
            class="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Run with delay
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
