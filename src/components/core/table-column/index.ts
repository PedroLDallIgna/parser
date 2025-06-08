import { html, TemplateResult } from 'lit-html';

export class TableColumn {
  private label: string;
  private alignment: 'left' | 'center' | 'right';

  constructor({
    label,
    alignment = 'left',
  }: {
    label: string;
    alignment?: 'left' | 'center' | 'right';
  }) {
    this.label = label;
    this.alignment = alignment;
  }

  render(): TemplateResult<1> {
    return html`
      <th
        class="border border-gray-300 px-4 py-2 text-${this
          .alignment}"
      >
        ${this.label}
      </th>
    `;
  }
}
