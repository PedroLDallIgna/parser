import { html, TemplateResult } from 'lit-html';
import { TableRow } from '../table-row';
import { TableColumn } from '../table-column';

export class Table<T extends Record<string, any>> {
  private rows: TableRow[];
  private columns: TableColumn[];
  private onRowClick?: (item: T) => void;
  private index?: boolean;

  constructor({
    rows,
    columns,
    onRowClick,
    index,
  }: {
    rows: TableRow[];
    columns: TableColumn[];
    onRowClick?: (item: T) => void;
    index?: boolean;
  }) {
    this.rows = rows;
    this.columns = columns;
    this.onRowClick = onRowClick;
    this.index = index;
  }

  render(): TemplateResult<1> {
    return html`
      <table class="min-w-full border-collapse">
        <thead>
          <tr>
            ${this.index &&
            new TableColumn({ label: '#' }).render()}
            ${this.columns.map((column) => column.render())}
          </tr>
        </thead>
        <tbody>
          ${this.rows.map((row, rowIndex) =>
            row.render(rowIndex + 1)
          )}
        </tbody>
      </table>
    `;
  }
}
