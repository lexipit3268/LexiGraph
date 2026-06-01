<template>
  <main class="grid h-full w-full flex-1 grid-cols-[1fr_auto] gap-2">
    <div class="flex h-full w-full flex-col gap-2 overflow-hidden">
      <div class="relative flex w-full flex-1 gap-2 overflow-hidden">
        <div class="relative w-1/4 min-w-62.5">
          <GraphView ref="subGraphRef" />
        </div>

        <div class="relative flex-1 overflow-hidden">
          <GraphView
            ref="graphRef"
            :is-main-graph="true"
            @play="handlePlay"
            @pause="handlePause"
            @next="handleNextStep"
            @previous="handlePrevStep"
            @speed="handleSpeed"
          />
        </div>
      </div>

      <div class="flex h-70 w-full shrink-0 gap-2">
        <DirectoryView />
        <AlgorithmHistory
          :algoHistory="algoHistory"
          :currentStepIndex="currentStepIndex"
          :formatRow="formatRow"
        />
      </div>
    </div>

    <GraphInput
      :isConfiguring="isConfiguring"
      :isHavingGraph="isHavingGraph"
      :isAnimating="isAnimating"
      v-model="graphInputText"
      v-model:config="graphConfig"
      @create-graph="handleCreateGraph"
      @reset-config="handleResetConfig"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import GraphView from '../components/GraphView.vue';
import DirectoryView from '../components/DirectoryView/DirectoryView.vue';
import GraphInput from '../components/GraphInput/GraphInput.vue';
import { ElMessage } from 'element-plus';
import { EdgeLineStyle, EdgeCurveStyle, GraphThemes } from '../core/graphStyles.ts';
import { handleError } from '../utils/errorHandler.ts';

import { useAlgorithm } from '../composables/useAlgorithm';
import AlgorithmHistory from '../components/AlgorithmHistory/AlgorithmHistory.vue';

const graphRef = ref<InstanceType<typeof GraphView> | null>(null);
const subGraphRef = ref<InstanceType<typeof GraphView> | null>(null);
const historyContainerRef = ref<HTMLElement | null>(null);

const isHavingGraph = ref(false);
const graphInputText = ref<string>('4 4\n4 1 2\n1 3 -3\n2 3 3\n2 3 3');
const isConfiguring = ref(false);

const DEFAULT_CONFIG = {
  isDirected: true,
  theme: 'default' as GraphThemes,
  edgeLineStyle: 'solid' as EdgeLineStyle,
  edgeCurveStyle: 'bezier' as EdgeCurveStyle
};

const graphConfig = ref({ ...DEFAULT_CONFIG });
let isCooldown = false;

const {
  algoHistory,
  currentStepIndex,
  formatRow,
  resetAlgorithm,
  handlePlay,
  handlePause,
  handleNextStep,
  handlePrevStep,
  handleSpeed,
  isAnimating
} = useAlgorithm(graphRef, subGraphRef, historyContainerRef);

const handleCreateGraph = () => {
  if (isCooldown) return;
  isCooldown = true;
  setTimeout(() => {
    isCooldown = false;
  }, 1000);

  if (graphRef.value) {
    try {
      resetAlgorithm();
      graphRef.value.graphManager.updateConfig(graphConfig.value);
      graphRef.value.graphManager.importFromText(
        graphInputText.value,
        graphRef.value?.isPhysicsEnabled
      );
      isHavingGraph.value = true;
      ElMessage.success({ message: 'Vẽ đồ thị thành công!', grouping: true });
    } catch (error) {
      handleError(error);
    }
  }
};

const handleResetConfig = () => {
  graphConfig.value = { ...DEFAULT_CONFIG };
  ElMessage.info('Đã khôi phục tùy chọn mặc định');
};

watch(
  () => ({ ...graphConfig.value }),
  (newConfig, oldConfig) => {
    if (graphRef.value) {
      graphRef.value.graphManager.updateConfig(newConfig);

      const isDirectedChanged = newConfig.isDirected !== oldConfig?.isDirected;

      if (isHavingGraph.value && isDirectedChanged) {
        handlePause();
        resetAlgorithm();

        try {
          graphRef.value.graphManager.importFromText(
            graphInputText.value,
            graphRef.value?.isPhysicsEnabled
          );
        } catch (error) {}
      }
    }

    isConfiguring.value = JSON.stringify(newConfig) !== JSON.stringify(DEFAULT_CONFIG);
  },
  { deep: true }
);

watch(
  graphInputText,
  () => {
    graphRef.value?.graphManager.clearElements();
    isHavingGraph.value = false;
  },
  { deep: true }
);
</script>
