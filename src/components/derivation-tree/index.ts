import * as d3 from 'd3';
import { Node } from '../../types/node';

export function drawTree(treeData: Node) {
  const svg = d3.select('svg#derivation-tree');
  svg.selectAll('*').remove();

  const width = 600;
  const height = 400;

  const root = d3.hierarchy(treeData);
  const treeLayout = d3
    .tree<Node>()
    .size([width, height - 100]);
  treeLayout(root);

  svg
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(0,40)')
    .selectAll('line')
    .data(root.links())
    .join('line')
    .attr('x1', (d) => d.source.x!)
    .attr('y1', (d) => d.source.y!)
    .attr('x2', (d) => d.target.x!)
    .attr('y2', (d) => d.target.y!)
    .attr('stroke', 'gray');

  svg
    .select('g')
    .selectAll('circle')
    .data(root.descendants())
    .join('circle')
    .attr('cx', (d) => d.x!)
    .attr('cy', (d) => d.y!)
    .attr('r', 20)
    .attr('fill', (d) =>
      d.children ? '#60a5fa' : '#34d399'
    );

  svg
    .select('g')
    .selectAll('text')
    .data(root.descendants())
    .join('text')
    .attr('x', (d) => d.x!)
    .attr('y', (d) => d.y! + 5)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .text((d) => d.data.name);
}
