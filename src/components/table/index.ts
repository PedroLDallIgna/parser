import { html, TemplateResult } from 'lit-html';
import { TableRow } from '../table-row';

export function Table<T extends Record<string, any>>({
  items,
  columns,
  onRowClick,
}: {
  items: T[];
  columns: string[];
  onRowClick?: (item: T) => void;
}): TemplateResult<1> {
  return html`
    <table class="min-w-full border-collapse">
      <thead>
        <tr>
          ${columns.map(
            (column) =>
              html`<th class="p-2 border-b">${column}</th>`
          )}
        </tr>
      </thead>
      <tbody>
        ${items.map((item) =>
          TableRow({
            item: item,
            isSelected: false,
          })
        )}
      </tbody>
    </table>
  `;
}
