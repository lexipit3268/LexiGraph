import { ref, nextTick, Ref } from 'vue';
import { ElMessage } from 'element-plus';
import { runMooreDijkstra } from '../core/algorithms/MooreDijkstra';
import { AlgorithmStep } from '../core/algorithms/types/AlgorithmStep';
import { AlgorithmResult } from '../core/algorithms/types/AlgorithmResult';

export function useAlgorithm(graphRef: Ref<any>, subGraphRef: Ref<any>) {
  const algoGenerator = ref<Generator<AlgorithmStep, AlgorithmResult, unknown> | null>(null);
  const algoHistory = ref<AlgorithmStep[]>([]);
  const currentStepIndex = ref<number>(-1); // -1 nghĩa là chưa bắt đầu

  let playInterval: ReturnType<typeof setInterval> | null = null;
  const currentSpeedMs = ref(500);
  const speedMap: Record<number, number> = { 1: 2000, 2: 1000, 3: 500, 4: 200, 5: 50 };

  const formatRow = (obj: Record<string, any>) => {
    /* ... */
  };
  const autoScrollToBottom = () => {
    /* ... */
  };

  const applyStepToGraph = (step: AlgorithmStep) => {
    /* ... */
  };

  const resetAlgorithm = () => {
    /* ... */
  };

  const initAlgorithm = () => {
    /* ... */
  };

  // ========================================================
  const handlePlay = () => {
    /* ... */
  };
  const handlePause = () => {
    /* ... */
  };
  const handleSpeed = (speedLevel: number) => {
    /* ... */
  };
  const handlePrevStep = () => {
    /* ... */
  };

  const handleNextStep = () => {};

  return {
    algoHistory,
    currentStepIndex,
    formatRow,
    resetAlgorithm,
    handlePlay,
    handlePause,
    handleNextStep,
    handlePrevStep,
    handleSpeed
  };
}
