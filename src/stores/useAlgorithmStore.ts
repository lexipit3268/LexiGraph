import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AlgorithmStep } from '../core/algorithms/types/AlgorithmStep';

export const useAlgorithmStore = defineStore('algorithm', () => {
  const startNodeId = ref<string>('');
  const endNodeId = ref<string>('');
  const algoHistory = ref<AlgorithmStep[]>([]);
  const currentStepIndex = ref<number>(-1);
  const subGraphElementsData = ref<any[]>([]);
  const isAnimating = ref(false);
  const algorithmSpeed = ref(3);

  const resetState = () => {
    algoHistory.value = [];
    currentStepIndex.value = -1;
    subGraphElementsData.value = [];
    isAnimating.value = false;
  };

  return {
    startNodeId,
    endNodeId,
    algoHistory,
    currentStepIndex,
    subGraphElementsData,
    isAnimating,
    algorithmSpeed,
    resetState
  };
});
