import { Node } from '../Graph';
import { PriorityQueue } from './data-structures/PriorityQueue';
import { AlgorithmStep } from './types/AlgorithmStep';
import { AlgorithmResult } from './types/AlgorithmResult';
import { buildSubGraph } from './buildSubGraph';

/**
 * Moore-Dijkstra Algorithm (using Lazy Priority Queue)
 * @param nodes Danh sách đỉnh
 * @param adjList Danh sách kề (Lấy từ graphManager.getAdjacencyList())
 * @param startNodeId Đỉnh bắt đầu
 * @param endNodeId Đỉnh đích (Optional)
 */

const Infinity = 999;

export function* runMooreDijkstra(
  nodes: Node[],
  adjList: Record<string, { target: string; weight: number; edgeId: string }[]>,
  startNodeId: string,
  endNodeId?: string
): Generator<AlgorithmStep, AlgorithmResult, unknown> {
  let stepCounter = 1;

  const pi: Record<string, number> = {};
  const p: Record<string, string | null> = {};
  const pEdge: Record<string, string | null> = {};
  const pWeight: Record<string, number> = {};
  const mark: Record<string, boolean> = {};

  nodes.forEach(node => {
    pi[node.id] = Infinity;
    p[node.id] = null;
    pEdge[node.id] = null;
    pWeight[node.id] = 0;
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

  const priorityQueue = new PriorityQueue<string>();
  priorityQueue.enqueue(startNodeId, 0);

  while (!priorityQueue.isEmpty()) {
    const u = priorityQueue.dequeue();

    if (!u || mark[u]) continue;
    mark[u] = true;
    const visitedNodesList = Object.keys(mark).filter(nodeId => mark[nodeId] && nodeId !== u);

    yield {
      step: stepCounter++,
      action: 'VISIT',
      description: `Chọn đỉnh ${u} (min π: ${pi[u]}).`,
      processingNodes: [u],
      visitedNodes: visitedNodesList,
      pi: { ...pi },
      p: { ...p }
    };

    for (const neighbor of adjList[u]) {
      const v = neighbor.target;
      const w = neighbor.weight;
      const edgeId = neighbor.edgeId;

      if (!mark[v]) {
        yield {
          step: stepCounter++,
          action: 'CHECK',
          description: `Kiểm tra cung (${u} \u2192 ${v}) trọng số ${w}.`,
          processingNodes: [u, v],
          processingEdges: [edgeId],
          visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
          pi: { ...pi },
          p: { ...p }
        };

        if (pi[u] + w < pi[v]) {
          pi[v] = pi[u] + w;
          p[v] = u;
          pEdge[v] = edgeId;
          pWeight[v] = w;

          priorityQueue.enqueue(v, pi[v]);

          yield {
            step: stepCounter++,
            action: 'RELAX',
            description: `Khoảng cách π(${v}) = ${pi[v]} (qua ${u}).`,
            processingNodes: [u, v],
            processingEdges: [edgeId],
            visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
            pi: { ...pi },
            p: { ...p }
          };
        }
      }
    }
  }

  const cost: number = endNodeId && pi[endNodeId] !== Infinity ? pi[endNodeId] : 0;
  const hasNegativeCycle: boolean = false;

  const { pathNodes, pathEdges, subGraphElements } = buildSubGraph(
    nodes,
    pi,
    p,
    pEdge,
    pWeight,
    startNodeId,
    endNodeId,
    Infinity
  );

  yield {
    step: stepCounter++,
    action: 'COMPLETE',
    description: `Thuật toán Moore-Dijkstra đã hoàn tất!`,
    visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
    pi: { ...pi },
    p: { ...p }
  };

  return {
    pathNodes,
    pathEdges,
    subGraphElements,
    cost,
    hasNegativeCycle
  };
}
