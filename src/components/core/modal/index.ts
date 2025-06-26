import {
  html,
  TemplateResult,
  render as litRender,
} from 'lit-html';

export class Modal {
  private _isOpen: boolean;
  private _btnLabel: string | TemplateResult;
  private _btnTitle?: string;
  private _content: TemplateResult;
  private _element: HTMLElement;

  constructor({
    btnLabel = 'Open Modal',
    btnTitle = 'Open Modal',
    content = html``,
    element,
  }: {
    btnLabel: string | TemplateResult;
    btnTitle?: string;
    element: HTMLElement;
    content?: TemplateResult;
  }) {
    this._isOpen = false;
    this._content = content;
    this._element = element;
    this._btnLabel = btnLabel;
    this._btnTitle = btnTitle;
  }

  render() {
    litRender(this.renderButton(), this._element);
  }

  private toggle(): void {
    this._isOpen = !this._isOpen;
    this.render();
  }

  private renderModal(): TemplateResult {
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
                  <!-- <div
                    class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                  >
                    <h3
                      class="text-lg font-semibold text-gray-900"
                      id="dialog-title"
                    >
                      Gramática
                    </h3>
                    <div class="mt-2">${this._content}</div>
                  </div> -->
                  ${this._content}
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

  private renderButton() {
    return html`
      <button
        class="bg-blue-500 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click=${() => this.toggle()}
        title=${this._btnTitle || 'Open Modal'}
      >
        ${this._btnLabel}
      </button>
      ${this.renderModal()}
    `;
  }
}
