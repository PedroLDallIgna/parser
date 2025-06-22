import { html, TemplateResult } from 'lit-html';
import './index.css';

export class Row {
  private children: any[];
  private gap: string;

  constructor({
    children,
    gap = '2',
  }: {
    children: any[];
    gap?: string;
  }) {
    this.children = children;
    this.gap = gap;
  }

  render(): TemplateResult<1> {
    return html`
      <div class="flex flex-row space-x-${this.gap}">
        ${this.children.map((child) => child.render())}
      </div>
    `;
  }
}
