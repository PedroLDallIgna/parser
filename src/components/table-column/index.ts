import { html, TemplateResult } from 'lit-html';

export class TableColumn {
  private label: string;

  constructor({ label }: { label: string }) {
    this.label = label;
  }

  render(): TemplateResult<1> {
    return html`
      <th class="p-2 border-b">${this.label}</th>
    `;
  }
}
