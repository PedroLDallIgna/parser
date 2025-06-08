import { html, TemplateResult } from 'lit-html';

export class Container {
  private child: any;
  private padding: string;

  constructor({
    child,
    padding = '4',
  }: {
    child: any;
    padding?: string;
  }) {
    this.child = child;
    this.padding = padding;
  }

  render(): TemplateResult {
    return html`
      <div
        class="container mx-auto p-${this
          .padding} rounded-lg shadow-lg"
      >
        ${this.child.render()}
      </div>
    `;
  }
}
