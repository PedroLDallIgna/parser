import { html, render } from 'lit-html';
import './styles.css';

const root = <HTMLDivElement>document.getElementById('app')!;

const template = html` <div class="test">Usage example</div> `;

render(template, root);
