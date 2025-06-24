import { TemplateResult } from 'lit-html';
import { GrammarSchema } from '../../types/grammar-schema';
import { Container } from '../core/container';
import { Table } from '../core/table';
import { TableColumn } from '../core/table-column';
import { TableRow } from '../core/table-row';
import { TableCell } from '../core/table-cell';

export class GrammarTable {
  private rules: Record<string, string[]>;

  constructor({
    rules,
  }: {
    rules: Record<string, string[]>;
  }) {
    this.rules = rules;
  }

  render(): TemplateResult {
    return new Container({
      padding: '0',
      child: new Table({
        caption: 'Regras da Gramática',
        columns: [
          new TableColumn({
            label: 'Símbolo',
            alignment: 'center',
          }),
          new TableColumn({
            label: 'Produções',
            alignment: 'center',
          }),
        ],
        rows: Object.entries(this.rules).map(
          ([nonTerminal, productions]) =>
            new TableRow({
              cells: [
                new TableCell({
                  value: nonTerminal,
                  alignment: 'center',
                  background: 'gray-200',
                }),
                new TableCell({
                  value: productions.join(' | '),
                }),
              ],
            })
        ),
      }),
    }).render();
  }
}
