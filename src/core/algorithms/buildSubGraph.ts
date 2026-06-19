import { ElementDefinition } from 'cytoscape';
import { Node } from '../Graph';

export function buildSubGraph(
  nodes: Node[],
  pi: Record<string, number>,
  p: Record<string, string | null>,
  pEdge: Record<string, string | null>,
  pWeight: Record<string, number>,
  startNodeId: string,
  endNodeId?: string,
  infinityValue: number = 999
): { pathNodes: string[]; pathEdges: string[]; subGraphElements: ElementDefinition[] } {
  const pathNodes: string[] = [];
  const pathEdges: string[] = [];
  const subGraphElements: ElementDefinition[] = [];

  nodes.forEach(node => {
    if (pi[node.id] !== infinityValue) {
      subGraphElements.push({
        group: 'nodes',
        data: { id: node.id, label: node.label },
        classes: node.id === startNodeId || node.id === endNodeId ? 'boundary' : ''
      });

      const parentEdgeId = pEdge[node.id];
      if (parentEdgeId) {
        subGraphElements.push({
          group: 'edges',
          data: {
            id: `sub-${parentEdgeId}`,
            source: p[node.id],
            target: node.id,
            weight: String(pWeight[node.id])
          }
        });
      }
    }
  });

  //truy vết đường đi từ endNodeId ngược về startNodeId
  if (endNodeId && pi[endNodeId] !== infinityValue) {
    let current: string | null = endNodeId;

    while (current !== null) {
      pathNodes.push(current);

      const parentEdgeId = pEdge[current];
      if (parentEdgeId) {
        pathEdges.push(parentEdgeId);
      }

      current = p[current];
    }
    pathNodes.reverse();
    pathEdges.reverse();
  }

  return { pathNodes, pathEdges, subGraphElements };
}
