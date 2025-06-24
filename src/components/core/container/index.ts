import { html, TemplateResult } from 'lit-html';

export class Container {
  private child: any;
  private padding: string;
  private shadow?: 'sm' | 'md' | 'lg';
  private roundRadius?: 'sm' | 'md' | 'lg';

  constructor({
    child,
    padding = '4',
    shadow,
    roundRadius,
  }: {
    child: any;
    padding?: string;
    shadow?: 'sm' | 'md' | 'lg';
    roundRadius?: 'sm' | 'md' | 'lg';
  }) {
    this.child = child;
    this.padding = padding;
    this.shadow = shadow;
    this.roundRadius = roundRadius;
  }

  render(): TemplateResult {
    return html`
      <div
        class="container mx-auto p-${this.padding} ${this
          .roundRadius &&
        'rounded-' + this.roundRadius} ${this.shadow &&
        'shadow-' + this.shadow} bg-white"
      >
        ${this.child.render()}
      </div>
    `;
  }
}
