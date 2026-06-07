/**
 * Bellman-Ford
 * @param nodes Danh sách đỉnh
 * @param edges Danh sách cung
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
  mark[startNodeId] = true;

  yield {
    step: stepCounter++,
    action: 'INIT',
    description: `Khoảng cách π(${startNodeId}) = 0, còn lại π = vô cực.`,
    processingNodes: [startNodeId],
    visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
    pi: { ...pi },
    p: { ...p }
  };

  const V = nodes.length;
  for (let i = 1; i < V; i++) {
    let isUpdated = false;

    for (const edge of edges) {
      const u = edge.source;
      const v = edge.target;
      const w = parseInt(edge.weight);

      if (pi[u] !== Infinity) {
        yield {
          step: stepCounter++,
          action: 'CHECK',
          description: `Vòng ${i}: Kiểm tra cung (${u} \u2192 ${v}) trọng số ${w}.`,
          processingNodes: [u, v],
          processingEdges: [edge.id],
          visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
          pi: { ...pi },
          p: { ...p }
        };

        if (pi[u] + w < pi[v]) {
          pi[v] = pi[u] + w;
          p[v] = u;
          pEdge[v] = edge.id;
          mark[v] = true;
          isUpdated = true;

          yield {
            step: stepCounter++,
            action: 'RELAX',
            description: `Vòng ${i}: Khoảng cách π(${v}) = ${pi[v]} (qua ${u}).`,
            processingNodes: [u, v],
            processingEdges: [edge.id],
            visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
            pi: { ...pi },
            p: { ...p }
          };
        }
      }
    }

    if (!isUpdated) break;
  }

  for (const edge of edges) {
    const u = edge.source;
    const v = edge.target;
    const w = parseInt(edge.weight);

    if (pi[u] !== Infinity && pi[u] + w < pi[v]) {
      hasNegativeCycle = true;

      p[v] = u;
      pEdge[v] = edge.id;

      // lùi lại V lần để CHẮC CHẮN rớt vào bên trong lõi của chu trình âm
      let curr = v;
      for (let i = 0; i < V; i++) {
        if (p[curr] === null) break;
        curr = p[curr] as string;
      }

      const cycleNodes: string[] = [];
      const cycleEdges: string[] = [];
      const cycleStart = curr;

      do {
        cycleNodes.push(curr);
        const parentEdge = pEdge[curr];
        if (parentEdge) cycleEdges.push(parentEdge);
        curr = p[curr] as string;
      } while (curr !== cycleStart && curr !== null);

      cycleNodes.reverse();
      cycleEdges.reverse();

      yield {
        step: stepCounter++,
        action: 'NEGATIVE_CYCLE',
        description: `Phát hiện chu trình âm: ${cycleNodes.join(' \u2192 ')} \u2192 ${cycleNodes[0]}`,
        processingNodes: cycleNodes,
        processingEdges: cycleEdges,
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

  const cost: number =
    endNodeId && pi[endNodeId] !== Infinity && !hasNegativeCycle ? pi[endNodeId] : 0;

  if (!hasNegativeCycle) {
    nodes.forEach(node => {
      if (pi[node.id] !== Infinity) {
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

    if (endNodeId && pi[endNodeId] !== Infinity) {
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
  }

  yield {
    step: stepCounter++,
    action: 'COMPLETE',
    description: hasNegativeCycle
      ? `Thuật toán bị gián đoạn do phát hiện chu trình âm!`
      : `Thuật toán Bellman-Ford đã hoàn tất!`,
    visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
    pi: { ...pi },
    p: { ...p }
  };

  return { pathNodes, pathEdges, subGraphElements, cost, hasNegativeCycle };
}
