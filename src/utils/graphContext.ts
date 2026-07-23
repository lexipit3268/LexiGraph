import { useGraphStore } from '../stores/useGraphStore';

export function getGraphContextString(): string {
  const graphStore = useGraphStore();

  const nodes = graphStore.nodeList;
  const edges = graphStore.edgeList;

  const isDirected = graphStore.graphConfig?.isDirected ?? true;

  if (!nodes || nodes.length === 0) {
    return '[System: Đồ thị hiện tại đang trống, chưa có đỉnh hay cạnh nào.]';
  }

  const verticesStr = nodes.map(n => n.id).join(', ');

  const edgesStr = edges
    .map(e => {
      const connector = isDirected ? '->' : '-';
      return `${e.source}${connector}${e.target}(${e.weight})`;
    })
    .join(', ');

  const graphType = isDirected ? 'Có hướng' : 'Vô hướng';

  const contextString = `[System Context - Current Graph State: Type: ${graphType}; Vertices: ${verticesStr}; Edges: ${edgesStr}]`;

  return contextString;
}
