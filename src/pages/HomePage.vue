<template>
  <main class="grid h-full w-full flex-1 grid-cols-[1fr_auto] gap-2">
    <div class="flex h-full w-full flex-col gap-2 overflow-hidden">
      <div class="relative flex w-full flex-1 gap-2 overflow-hidden">
        <div class="relative w-1/4 min-w-62.5">
          <GraphView
            ref="subGraphRef"
            :is-animating="isAnimating"
            :has-sub-graph-data="(subGraphElementsData?.length ?? 0) > 0"
          />
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
      :nodeList="nodeList"
      v-model="graphInputText"
      v-model:config="graphConfig"
      v-model:start-node-id="startNodeIdInput"
      v-model:end-node-id="endNodeIdInput"
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
import { Node } from '../core/Graph.ts';

const graphRef = ref<InstanceType<typeof GraphView> | null>(null);
const subGraphRef = ref<InstanceType<typeof GraphView> | null>(null);
const historyContainerRef = ref<HTMLElement | null>(null);

const isHavingGraph = ref(false);
const graphInputText = ref<string>(
  '6 12\n1 2 1\n2 1 10\n2 3 2\n3 2 20\n3 4 3\n4 3 30\n4 5 4\n5 4 40\n5 6 5\n6 5 50\n6 1 6\n1 6 60'
);
const isConfiguring = ref(false);
const startNodeIdInput = ref<string>('');
const endNodeIdInput = ref<string>('');
const nodeList = ref<Node[]>([]);

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
  isAnimating,
  subGraphElementsData
} = useAlgorithm(graphRef, subGraphRef, historyContainerRef, startNodeIdInput, endNodeIdInput);

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
      nodeList.value = graphRef.value.graphManager.getNodes();
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
          startNodeIdInput.value = '';
          endNodeIdInput.value = '';
          nodeList.value = graphRef.value.graphManager.getNodes();
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
    nodeList.value = [];
    startNodeIdInput.value = '';
    endNodeIdInput.value = '';
  },
  { deep: true }
);
</script>
