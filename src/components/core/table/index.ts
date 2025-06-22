import { html, TemplateResult } from 'lit-html';
import { TableRow } from '../table-row';
import { TableColumn } from '../table-column';

export class Table<T extends Record<string, any>> {
  private rows: TableRow[];
  private columns: TableColumn[];
  private onRowClick?: (item: T) => void;
  private index?: boolean;
  private caption?: string;

  constructor({
    rows,
    columns,
    onRowClick,
    index,
    caption,
  }: {
    rows: TableRow[];
    columns: TableColumn[];
    onRowClick?: (item: T) => void;
    index?: boolean;
    caption?: string;
  }) {
    this.rows = rows;
    this.columns = columns;
    this.onRowClick = onRowClick;
    this.index = index;
    this.caption = caption;
  }

  render(): TemplateResult<1> {
    return html`
      <table class="min-w-full border-collapse">
        ${this.caption
          ? html`<caption
              class="text-base font-semibold mb-4"
            >
              ${this.caption}
            </caption>`
          : ''}
        <thead>
          <tr class="bg-gray-200">
            ${this.index &&
            new TableColumn({
              label: '#',
              alignment: 'center',
            }).render()}
            ${this.columns.map((column) => column.render())}
          </tr>
        </thead>
        <tbody>
          ${this.rows.map((row, rowIndex) =>
            row.render(
              this.index ? rowIndex + 1 : undefined
            )
          )}
        </tbody>
      </table>
    `;
  }
}
