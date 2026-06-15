import { ElementDefinition } from 'cytoscape';
import { Node } from '../Graph';
import { AlgorithmResult } from './types/AlgorithmResult';
import { AlgorithmStep } from './types/AlgorithmStep';
import { buildSubGraph } from './buildSubGraph';

const Infinity = 999;

export function* runBellmanFord(
  nodes: Node[],
  adjList: Record<string, { target: string; weight: number; edgeId: string }[]>,
  startNodeId: string,
  endNodeId?: string
): Generator<AlgorithmStep, AlgorithmResult, unknown> {
  let stepCounter = 1;
  const V = nodes.length;

  const pi: Record<string, number> = {};
  const p: Record<string, string | null> = {};
  const pEdge: Record<string, string | null> = {};
  const pWeight: Record<string, number> = {};
  const mark: Record<string, boolean> = {};

  const inQueue: Record<string, boolean> = {};
  const count: Record<string, number> = {};
  const queue: string[] = [];

  let hasNegativeCycle: boolean = false;
  let cycleStartNode: string | null = null;

  nodes.forEach(node => {
    pi[node.id] = Infinity;
    p[node.id] = null;
    pEdge[node.id] = null;
    pWeight[node.id] = 0;
    mark[node.id] = false;
    inQueue[node.id] = false;
    count[node.id] = 0;
  });

  pi[startNodeId] = 0;
  mark[startNodeId] = true;
  queue.push(startNodeId);
  inQueue[startNodeId] = true;
  count[startNodeId] = 1;

  yield {
    step: stepCounter++,
    action: 'INIT',
    description: `Khoảng cách π(${startNodeId}) = 0, đưa ${startNodeId} vào hàng đợi.`,
    processingNodes: [startNodeId],
    visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
    pi: { ...pi },
    p: { ...p }
  };

  while (queue.length > 0) {
    const u = queue.shift()!;
    inQueue[u] = false;

    for (const edge of adjList[u]) {
      const v = edge.target;
      const w = edge.weight;

      yield {
        step: stepCounter++,
        action: 'CHECK',
        description: `Tại đỉnh ${u}, kiểm tra cung (${u} \u2192 ${v}) trọng số ${w}.`,
        processingNodes: [u, v],
        processingEdges: [edge.edgeId],
        visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
        pi: { ...pi },
        p: { ...p }
      };

      if (pi[u] + w < pi[v]) {
        pi[v] = pi[u] + w;
        p[v] = u;
        pEdge[v] = edge.edgeId;
        pWeight[v] = w;
        mark[v] = true;

        yield {
          step: stepCounter++,
          action: 'RELAX',
          description: `Khoảng cách π(${v}) = ${pi[v]} (qua ${u}).`,
          processingNodes: [u, v],
          processingEdges: [edge.edgeId],
          visitedNodes: Object.keys(mark).filter(nodeId => mark[nodeId]),
          pi: { ...pi },
          p: { ...p }
        };

        if (!inQueue[v]) {
          queue.push(v);
          inQueue[v] = true;
          count[v]++;

          if (count[v] >= V) {
            hasNegativeCycle = true;
            cycleStartNode = v;
            break;
          }
        }
      }
    }
    if (hasNegativeCycle) break;
  }

  if (hasNegativeCycle && cycleStartNode) {
    let curr = cycleStartNode;
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
  }

  let pathNodes: string[] = [];
  let pathEdges: string[] = [];
  let subGraphElements: ElementDefinition[] = [];

  const cost: number =
    endNodeId && pi[endNodeId] !== Infinity && !hasNegativeCycle ? pi[endNodeId] : 0;

  if (!hasNegativeCycle) {
    const buildPathresults = buildSubGraph(
      nodes,
      pi,
      p,
      pEdge,
      pWeight,
      startNodeId,
      endNodeId,
      Infinity
    );

    pathNodes = buildPathresults.pathNodes;
    pathEdges = buildPathresults.pathEdges;
    subGraphElements = buildPathresults.subGraphElements;
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
