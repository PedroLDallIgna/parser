import { TemplateResult } from 'lit-html';
import { Container } from '../core/container';
import { Table } from '../core/table';
import { TableRow } from '../core/table-row';
import { TableCell } from '../core/table-cell';
import { TableColumn } from '../core/table-column';

export class ParsingTable {
  private parsingTable: Record<
    string,
    Record<string, string>
  >;
  private terminals: string[];

  constructor({
    parsingTable,
    terminals,
  }: {
    parsingTable: Record<string, Record<string, string>>;
    terminals: string[];
  }) {
    this.parsingTable = parsingTable;
    this.terminals = terminals;
  }

  render(): TemplateResult {
    return new Container({
      child: new Table({
        columns: [
          new TableColumn({
            label: ' ',
            alignment: 'center',
          }),
          ...this.terminals.map(
            (terminal) =>
              new TableColumn({
                label: terminal,
                alignment: 'center',
              })
          ),
          new TableColumn({
            label: '$',
            alignment: 'center',
          }),
        ],
        rows: Object.entries(this.parsingTable).map(
          ([nonTerminal, productions]) =>
            new TableRow({
              cells: [
                new TableCell({
                  value: nonTerminal,
                  alignment: 'center',
                  background: 'gray-200',
                }),
                ...Object.values(productions).map(
                  (production) =>
                    new TableCell({
                      value: production
                        ? `${nonTerminal} -> ${production}`
                        : '-',
                    })
                ),
              ],
            })
        ),
      }),
    }).render();
  }
}
