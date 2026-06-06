import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AlgorithmStep } from '../core/algorithms/types/AlgorithmStep';
import { ElementDefinition } from 'cytoscape';

export const useAlgorithmStore = defineStore('algorithm', () => {
  const startNodeId = ref<string>('');
  const endNodeId = ref<string>('');
  const algoHistory = ref<AlgorithmStep[]>([]);
  const currentStepIndex = ref<number>(-1);
  const finalCost = ref<number>();
  const finalPath = ref<string[]>([]);
  const finalPathEdges = ref<string[]>([]);
  const subGraphElementsData = ref<ElementDefinition[]>([]);

  const isAnimating = ref(false);
  const algorithmSpeed = ref(3);

  const resetState = () => {
    algoHistory.value = [];
    currentStepIndex.value = -1;
    subGraphElementsData.value = [];
    isAnimating.value = false;
    finalCost.value = 999;
    finalPath.value = [];
  };

  return {
    startNodeId,
    endNodeId,
    algoHistory,
    currentStepIndex,
    subGraphElementsData,
    isAnimating,
    algorithmSpeed,
    resetState,
    finalCost,
    finalPath,
    finalPathEdges
  };
});
