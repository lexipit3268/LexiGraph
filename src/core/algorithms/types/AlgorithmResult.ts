import { ElementDefinition } from 'cytoscape';

export interface AlgorithmResult {
  hasNegativeCycle: boolean;
  pathNodes: string[];
  pathEdges: string[];
  subGraphElements: ElementDefinition[]; // dữ liệu cây đường đi --> subGraph
}
