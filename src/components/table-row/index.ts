import { html, TemplateResult } from 'lit-html';
import './index.css';
import { TableCell } from '../table-cell';

export class TableRow {
  private cells: TableCell[];

  constructor({ cells }: { cells: TableCell[] }) {
    this.cells = cells;
  }

  render(index: number): TemplateResult<1> {
    return html`
      <tr class="cursor-pointer">
        ${index && new TableCell({ value: index }).render()}
        ${this.cells.map((cell) => cell.render())}
      </tr>
    `;
  }
}
