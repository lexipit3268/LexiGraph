import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { GraphConfig } from '../core/GraphConfig';
import { Node } from '../core/Graph';
import { GraphThemes, EdgeLineStyle, EdgeCurveStyle } from '../core/graphStyles';

const DEFAULT_CONFIG: GraphConfig = {
  isDirected: true,
  theme: 'default' as GraphThemes,
  edgeLineStyle: 'solid' as EdgeLineStyle,
  edgeCurveStyle: 'bezier' as EdgeCurveStyle
};

export const useGraphStore = defineStore('graph', () => {
  const graphInputText = ref<string>(
    '6 12\n1 2 1\n2 1 10\n2 3 2\n3 2 20\n3 4 3\n4 3 30\n4 5 4\n5 4 40\n5 6 5\n6 5 50\n6 1 6\n1 6 60'
  );
  const graphConfig = ref<GraphConfig>({ ...DEFAULT_CONFIG });
  const nodeList = ref<Node[]>([]);
  const isHavingGraph = ref(false);
  const isDrawingModeEnabled = ref(false);

  const isConfiguring = computed(() => {
    return JSON.stringify(graphConfig.value) !== JSON.stringify(DEFAULT_CONFIG);
  });

  const resetConfig = () => {
    graphConfig.value = { ...DEFAULT_CONFIG };
  };

  const clearGraphData = () => {
    isHavingGraph.value = false;
    nodeList.value = [];
  };

  return {
    DEFAULT_CONFIG,
    graphInputText,
    graphConfig,
    nodeList,
    isHavingGraph,
    isConfiguring,
    resetConfig,
    clearGraphData,
    isDrawingModeEnabled
  };
});
