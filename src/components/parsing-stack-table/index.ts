import { TemplateResult } from 'lit-html';
import { Container } from '../core/container';
import { Table } from '../core/table';
import { TableCell } from '../core/table-cell';
import { TableColumn } from '../core/table-column';
import { TableRow } from '../core/table-row';

export class ParsingStackTable {
  private actions: any[];

  constructor(actions: any[]) {
    this.actions = actions;
  }

  render(rows: number): TemplateResult {
    return new Container({
      padding: '2',
      child: new Table({
        rows: [
          ...this.actions
            .map((action) => {
              return new TableRow({
                cells: [
                  new TableCell({
                    value: action.stack.join(' '),
                  }),
                  new TableCell({
                    value: action.queue.join(' '),
                    alignment: 'right',
                  }),
                  new TableCell({ value: action.action }),
                ],
              });
            })
            .slice(0, rows),
        ],
        columns: [
          new TableColumn({ label: 'Pilha' }),
          new TableColumn({ label: 'Entrada' }),
          new TableColumn({ label: 'Ação' }),
        ],
        index: true,
      }),
    }).render();
  }
}
