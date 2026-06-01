import { Node, Edge } from '../Graph';
import { PriorityQueue } from './data-structures/PriorityQueue';
import { AlgorithmStep } from './types/AlgorithmStep';
import { AlgorithmResult } from './types/AlgorithmResult';
import { ElementDefinition } from 'cytoscape';

/**
 * Moore-Dijkstra Algorithm (using Lazy Priority Queue)
 * * @param nodes Danh sách đỉnh
 * @param edges Danh sách cung
 * @param adjList Danh sách kề (Lấy từ graphManager.getAdjacencyList())
 * @param startNodeId Đỉnh bắt đầu
 * @param endNodeId Đỉnh đích (Optional)
 */

const Infinity = 999;

export function* runMooreDijkstra(
  nodes: Node[],
  edges: Edge[],
  adjList: Record<string, { target: string; weight: number; edgeId: string }[]>,
  startNodeId: string,
  endNodeId?: string
): Generator<AlgorithmStep, AlgorithmResult, unknown> {
  let stepCounter = 1;

  const pi: Record<string, number> = {};
  const p: Record<string, string | null> = {};
  const mark: Record<string, boolean> = {};

  nodes.forEach(node => {
    pi[node.id] = Infinity;
    p[node.id] = null;
    mark[node.id] = false;
  });

  pi[startNodeId] = 0;

  // --- YIELD 1 ---
  yield {
    step: stepCounter++,
    action: 'INIT',
    description: `Khởi tạo: Khoảng cách từ đỉnh ${startNodeId} = 0, các đỉnh khác = vô cực.`,
    processingNodes: [startNodeId],
    pi: { ...pi },
    p: { ...p }
  };

  const priorityQueue = new PriorityQueue<string>();
  priorityQueue.enqueue(startNodeId, 0);

  // MAIN LOOP
  while (!priorityQueue.isEmpty()) {
    const u = priorityQueue.dequeue();

    if (!u || mark[u]) continue;
    mark[u] = true;
    const visitedNodesList = Object.keys(mark).filter(nodeId => mark[nodeId] && nodeId !== u);

    // --- YIELD 2 ---
    yield {
      step: stepCounter++,
      action: 'VISIT',
      description: `Chọn đỉnh ${u} (khoảng cách nhỏ nhất hiện tại: ${pi[u]}).`,
      processingNodes: [u],
      visitedNodes: visitedNodesList,
      pi: { ...pi },
      p: { ...p }
    };

    for (const neighbor of adjList[u]) {
      const v = neighbor.target;
      const w = neighbor.weight;
      const edgeId = neighbor.edgeId;

      // --- YIELD 3 ---
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
          priorityQueue.enqueue(v, pi[v]);
          // --- YIELD 4 ---
          yield {
            step: stepCounter++,
            action: 'RELAX',
            description: `Cập nhật: Khoảng cách đến đỉnh ${v} giảm xuống còn ${pi[v]} (qua ${u}).`,
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

  const pathNodes: string[] = [];
  const pathEdges: string[] = [];
  const subGraphElements: ElementDefinition[] = [];

  // tạo subGraphElements dựa trên mảng p
  nodes.forEach(node => {
    if (pi[node.id] != Infinity) {
      subGraphElements.push({
        group: 'nodes',
        data: { id: node.id, label: node.label }
      });

      const parentId = p[node.id];

      if (parentId) {
        const edgeOrg = edges.find(
          e =>
            (e.source === parentId && e.target === node.id) ||
            (e.source === node.id && e.target === parentId)
        );
        if (edgeOrg) {
          subGraphElements.push({
            group: 'edges',
            data: {
              id: `sub-${edgeOrg.id}`,
              source: parentId,
              target: node.id,
              weight: edgeOrg.weight
            }
          });
        }
      }
    }
  });

  //truy vết đường đi từ endNodeId ngược về startNodeId
  if (endNodeId && pi[endNodeId] !== Infinity) {
    let current: string | null = endNodeId;

    while (current !== null) {
      pathNodes.push(current);
      const parentId: string | null = p[current];
      if (parentId) {
        const edgeOrg = edges.find(
          e =>
            (e.source === parentId && e.target === current) ||
            (e.source === current && e.target === parentId)
        );
        if (edgeOrg) {
          pathEdges.push(edgeOrg.id);
        }
      }
      current = parentId;
    }
    pathNodes.reverse();
    pathEdges.reverse();
  }

  // --- YIELD 5: hoan tat thuat toan ---
  yield {
    step: stepCounter++,
    action: 'COMPLETE',
    description: `Thuật toán Moore-Dijkstra đã hoàn tất!`,
    visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
    pi: { ...pi },
    p: { ...p }
  };

  return {
    hasNegativeCycle: false,
    pathNodes,
    pathEdges,
    subGraphElements
  };
}
