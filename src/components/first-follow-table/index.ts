import { html, TemplateResult } from 'lit-html';
import { Container } from '../core/container';
import { TableRow } from '../core/table-row';
import { TableCell } from '../core/table-cell';
import { TableColumn } from '../core/table-column';
import { Table } from '../core/table';

export class FirstFollowTable {
  private firstSets: Record<string, string[]>;
  private followSets: Record<string, string[]>;

  constructor({
    firstSets,
    followSets,
  }: {
    firstSets: Record<string, string[]>;
    followSets: Record<string, string[]>;
  }) {
    this.firstSets = firstSets;
    this.followSets = followSets;
  }

  render(): TemplateResult {
    return new Container({
      child: new Table({
        columns: [
          new TableColumn({
            label: ' ',
          }),
          new TableColumn({
            label: 'First',
            alignment: 'center',
          }),
          new TableColumn({
            label: 'Follow',
            alignment: 'center',
          }),
        ],
        rows: Object.entries(this.firstSets).map(
          ([nonTerminal, firstSet]) =>
            new TableRow({
              cells: [
                new TableCell({
                  value: nonTerminal,
                  alignment: 'center',
                  background: 'gray-200',
                }),
                new TableCell({
                  value: firstSet.join(', ') || '-',
                }),
                new TableCell({
                  value: this.followSets[nonTerminal]
                    ? this.followSets[nonTerminal].join(
                        ', '
                      )
                    : '-',
                }),
              ],
            })
        ),
      }),
    }).render();
  }
}
