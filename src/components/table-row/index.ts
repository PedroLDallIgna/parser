import { html, TemplateResult } from 'lit-html';
import './index.css';

export function TableRow<T extends Record<string, any>>({
  item,
  onClick,
  isSelected = false,
}: {
  item: T;
  onClick?: (item: T) => void;
  isSelected?: boolean;
}): TemplateResult<1> {
  return html`
    <tr
      class="cursor-pointer ${isSelected
        ? 'bg-blue-100'
        : ''}"
    >
      ${Object.values(item).map(
        (value, index) => html`
          <td key="${index}" class="p-2 border-b">
            ${value}
          </td>
        `
      )}
    </tr>
  `;
}
