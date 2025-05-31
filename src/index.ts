import { html, render } from 'lit-html';

// data
import grammar from './grammar.json';

// styles
import './index.css';

console.log(grammar);

const root = <HTMLDivElement>document.getElementById('app')!;

const template = html` <div class="test">Usage example</div> `;

render(template, root);
