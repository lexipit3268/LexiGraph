/**
 * Bellman-Ford
 * @param nodes Danh sách đỉnh
 * @param edges Danh sách cung
 * @param adjList Danh sách kề (Lấy từ graphManager.getAdjacencyList())
 * @param startNodeId Đỉnh bắt đầu
 * @param endNodeId Đỉnh đích (Optional)
 */

import { ElementDefinition } from 'cytoscape';
import { Edge, Node } from '../Graph';
import { AlgorithmResult } from './types/AlgorithmResult';
import { AlgorithmStep } from './types/AlgorithmStep';

const Infinity = 999;

export function* runBellmanFord(
  nodes: Node[],
  edges: Edge[],
  adjList: Record<string, { target: string; weight: number; edgeId: string }[]>,
  startNodeId: string,
  endNodeId?: string
): Generator<AlgorithmStep, AlgorithmResult, unknown> {
  let stepCounter = 1;

  const pi: Record<string, number> = {};
  const p: Record<string, string | null> = {};

  const pEdge: Record<string, string | null> = {};
  const mark: Record<string, boolean> = {};
  let hasNegativeCycle: boolean = false;

  nodes.forEach(node => {
    pi[node.id] = Infinity;
    p[node.id] = null;
    pEdge[node.id] = null;
    mark[node.id] = false;
  });
  pi[startNodeId] = 0;

  yield {
    step: stepCounter++,
    action: 'INIT',
    description: `Khoảng cách π(${startNodeId}) = 0, còn lại π = vô cực.`,
    processingNodes: [startNodeId],
    pi: { ...pi },
    p: { ...p }
  };

  for (const node of nodes) {
    for (const edge of edges) {
      const u = edge.source;
      const v = edge.target;
      const w = parseInt(edge.weight);

      yield {
        step: stepCounter++,
        action: 'CHECK',
        description: `Kiểm tra cung (${u} \u2192 ${v}) trọng số ${w}.`,
        processingNodes: [u, v],
        processingEdges: [edge.id],
        visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
        pi: { ...pi },
        p: { ...p }
      };

      if (pi[u] !== Infinity && pi[u] + w < pi[v]) {
        pi[v] = pi[u] + w;
        p[v] = u;

        yield {
          step: stepCounter++,
          action: 'RELAX',
          description: `Khoảng cách π(${v}) = ${pi[v]} (qua ${u}).`,
          processingNodes: [u, v],
          processingEdges: [edge.id],
          visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
          pi: { ...pi },
          p: { ...p }
        };
      }
    }
  }

  for (const edge of edges) {
    const u = edge.source;
    const v = edge.target;
    const w = parseInt(edge.weight);
    if (pi[u] + w < pi[v]) {
      hasNegativeCycle = true;
      yield {
        step: stepCounter++,
        action: 'NEGATIVE_CYCLE',
        description: `Phát hiện đồ thị chứa chu trình âm`,
        processingNodes: [u, v],
        processingEdges: [edge.id],
        visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
        pi: { ...pi },
        p: { ...p }
      };
      break;
    }
  }

  const pathNodes: string[] = [];
  const pathEdges: string[] = [];
  const subGraphElements: ElementDefinition[] = [];
  const cost: number = endNodeId && pi[endNodeId] !== Infinity ? pi[endNodeId] : 0;

  nodes.forEach(node => {
    if (pi[node.id] != Infinity && !hasNegativeCycle) {
      subGraphElements.push({
        group: 'nodes',
        data: { id: node.id, label: node.label },
        classes: node.id === startNodeId || node.id === endNodeId ? 'boundary' : ''
      });

      const parentEdgeId = pEdge[node.id];
      if (parentEdgeId) {
        const edgeOrg = edges.find(e => e.id === parentEdgeId);
        if (edgeOrg) {
          subGraphElements.push({
            group: 'edges',
            data: {
              id: `sub-${edgeOrg.id}`,
              source: p[node.id],
              target: node.id,
              weight: edgeOrg.weight
            }
          });
        }
      }
    }
  });

  //truy vết đường đi từ endNodeId ngược về startNodeId
  if (endNodeId && pi[endNodeId] !== Infinity && !hasNegativeCycle) {
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

  yield {
    step: stepCounter++,
    action: 'COMPLETE',
    description: `Thuật toán Bellman-Ford đã hoàn tất!`,
    visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
    pi: { ...pi },
    p: { ...p }
  };

  return { pathNodes, pathEdges, subGraphElements, cost };
}
