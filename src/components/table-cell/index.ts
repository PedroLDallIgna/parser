import { html, TemplateResult } from 'lit-html';

export class TableCell {
  private value: any;

  constructor({ value }: { value: any }) {
    this.value = value;
  }

  render(): TemplateResult<1> {
    return html`<td class="p-2 border-b">
      ${this.value}
    </td>`;
  }
}
