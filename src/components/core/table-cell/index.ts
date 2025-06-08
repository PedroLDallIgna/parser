import { html, TemplateResult } from 'lit-html';

export class TableCell {
  private value: any;
  private alignment: 'left' | 'center' | 'right';
  private background?: string;

  constructor({
    value,
    alignment = 'left',
    background = 'white',
  }: {
    value: any;
    alignment?: 'left' | 'center' | 'right';
    background?: string;
  }) {
    this.value = value;
    this.alignment = alignment;
    this.background = background;
  }

  render(): TemplateResult<1> {
    return html`<td
      class="border border-gray-300 px-4 py-2 text-${this
        .alignment} bg-${this.background}"
    >
      ${this.value}
    </td>`;
  }
}
