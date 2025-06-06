import { html, TemplateResult } from 'lit-html';
import { TableRow } from '../table-row';
import { TableColumn } from '../table-column';

export function Table<T extends Record<string, any>>({
  rows,
  columns,
  onRowClick,
  index,
}: {
  rows: TableRow[];
  columns: TableColumn[];
  onRowClick?: (item: T) => void;
  index?: boolean;
}): TemplateResult<1> {
  return html`
    <table class="min-w-full border-collapse">
      <thead>
        <tr>
          ${index &&
          new TableColumn({ label: '#' }).render()}
          ${columns.map((column) => column.render())}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row, rowIndex) =>
          row.render(rowIndex + 1)
        )}
      </tbody>
    </table>
  `;
}
