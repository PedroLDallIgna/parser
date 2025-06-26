import * as d3 from 'd3';

type Node = {
  name: string;
  children?: Node[];
};

export function drawTree(treeData: Node) {
  // const svg = d3.select('svg#derivation-tree');

  // svg.selectAll('*').remove();

  // const width = +svg.attr('width');
  // const height = +svg.attr('height');

  // const root = d3.hierarchy(treeData);

  // const treeLayout = d3
  //   .tree<Node>()
  //   .size([width - 40, height - 40]);
  // treeLayout(root);

  // const g = svg
  //   .append('g')
  //   .attr('transform', 'translate(20, 20)');

  // const node = g
  //   .selectAll('.link')
  //   .data(root.descendants)
  //   .enter()
  //   .append('g')
  //   .attr('class', 'node')
  //   .attr('transform', (d) => `translate(${d.y}, ${d.x})`);

  // node.append('circle').attr('r', 5);

  // node
  //   .append('text')
  //   .attr('dy', 4)
  //   .attr('text-anchor', 'middle')
  //   .text((d) => d.data.name);

  // const svg = d3.select('svg#derivation-tree');
  // svg.selectAll('*').remove();

  // const width = +svg.attr('width');
  // const height = +svg.attr('height');

  // const root = d3.hierarchy(treeData);

  // const treeLayout = d3
  //   .tree<Node>()
  //   .size([width - 40, height - 40]);
  // treeLayout(root);

  // const g = svg
  //   .append('g')
  //   .attr('transform', 'translate(20,20)');

  // // Links
  // // g.selectAll('.link')
  // //   .data(root.links())
  // //   .enter()
  // //   .append('path')
  // //   .attr('class', 'link')
  // //   .attr(
  // //     'd',
  // //     d3
  // //       .linkVertical<
  // //         d3.HierarchyPointLink<Node>,
  // //         d3.HierarchyPointNode<Node>
  // //       >()
  // //       .x((d: any) => d.x)
  // //       .y((d: any) => d.y)
  // //   );
  // g.selectAll('.link')
  //   .data(root.links())
  //   .enter()
  //   .append('path')
  //   .attr('class', 'link')
  //   .attr('fill', 'none')
  //   .attr('stroke', '#555')
  //   .attr('stroke-opacity', 0.4)
  //   .attr('stroke-width', 1.5)
  //   .attr('d', (d) => {
  //     return `M${d.source.x},${d.source.y}
  //           V${(d.source.y! + d.target.y!) / 2}
  //           H${d.target.x}
  //           V${d.target.y}`;
  //   });

  // // Nodes
  // const node = g
  //   .selectAll('.node')
  //   .data(root.descendants())
  //   .enter()
  //   .append('g')
  //   .attr('class', 'node')
  //   .attr(
  //     'transform',
  //     (d: any) => `translate(${d.x},${d.y})`
  //   );

  // node.append('circle').attr('r', 15);

  // node
  //   .append('text')
  //   .attr('dy', 4)
  //   .attr('text-anchor', 'middle')
  //   .text((d) => d.data.name);

  const svg = d3.select('svg#derivation-tree');
  svg.selectAll('*').remove(); // Clear previous render

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
    .attr('fill', '#60a5fa');

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
