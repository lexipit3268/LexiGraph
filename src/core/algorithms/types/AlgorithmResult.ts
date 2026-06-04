import { ElementDefinition } from 'cytoscape';

export interface AlgorithmResult {
  pathNodes: string[];
  pathEdges: string[];
  subGraphElements: ElementDefinition[]; // dữ liệu cây đường đi --> subGraph
  cost: number;
}
