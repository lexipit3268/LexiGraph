<template>
  <main class="grid h-full w-full flex-1 grid-cols-[1fr_auto] gap-3 p-2">
    <div class="flex h-full w-full flex-col gap-3 overflow-hidden">
      <div class="relative flex w-full flex-1 gap-3 overflow-hidden lg:max-h-155">
        <div class="relative w-1/4 min-w-65">
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
            :isAnimating="isAnimating"
            :isDrawingModeEnabled="isDrawingModeEnabled"
            @play="handlePlay"
            @pause="handlePause"
            @next="handleNextStep"
            @previous="handlePrevStep"
            @speed="handleSpeed"
            @toggle-drawing-mode="handleToggleDrawingMode"
          />
        </div>
      </div>

      <div class="flex max-h-85 w-full flex-1 shrink-0 gap-3">
        <DirectoryView />
        <AlgorithmHistory
          :algoHistory="algoHistory"
          :currentStepIndex="currentStepIndex"
          :formatRow="formatRow"
        />
      </div>
    </div>

    <GraphInput
      :isConfiguring="graphStore.isConfiguring"
      :isHavingGraph="graphStore.isHavingGraph"
      :isAnimating="algoStore.isAnimating"
      :nodeList="graphStore.nodeList"
      :isCooldown="isCooldown"
      v-model:graph-input="graphStore.graphInputText"
      v-model:config="graphStore.graphConfig"
      v-model:start-node-id="algoStore.startNodeId"
      v-model:end-node-id="algoStore.endNodeId"
      @create-graph="handleCreateGraph"
      @reset-config="graphStore.resetConfig"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { watchDebounced } from '@vueuse/core';
import { ElMessage } from 'element-plus';

import GraphView from '../components/GraphView.vue';
import DirectoryView from '../components/DirectoryView/DirectoryView.vue';
import GraphInput from '../components/GraphInput/GraphInput.vue';
import AlgorithmHistory from '../components/AlgorithmHistory/AlgorithmHistory.vue';

import { useGraphStore } from '../stores/useGraphStore';
import { useAlgorithmStore } from '../stores/useAlgorithmStore';
import { useAlgorithm } from '../composables/useAlgorithm';
import { handleError } from '../utils/errorHandler.ts';

const graphStore = useGraphStore();
const algoStore = useAlgorithmStore();

const graphRef = ref<InstanceType<typeof GraphView> | null>(null);
const subGraphRef = ref<InstanceType<typeof GraphView> | null>(null);

let isCooldown = false;
const lastRenderedGraphText = ref('');

const {
  formatRow,
  resetAlgorithm,
  handlePlay,
  handlePause,
  handleNextStep,
  handlePrevStep,
  handleSpeed
} = useAlgorithm(graphRef, subGraphRef);

const { isAnimating, subGraphElementsData, algoHistory, currentStepIndex } = storeToRefs(algoStore);
const { isDrawingModeEnabled } = storeToRefs(graphStore);

const executeGraphRender = (textToRender: string) => {
  const gm = graphRef.value?.graphManager;
  if (!gm) return;

  try {
    resetAlgorithm();
    gm.importFromText(textToRender, graphRef.value?.isPhysicsEnabled);

    lastRenderedGraphText.value = textToRender;
    graphStore.nodeList = gm.getNodes();
    graphStore.isHavingGraph = true;
  } catch (error) {
    graphStore.isHavingGraph = false;
    throw error;
  }
};

const handleCreateGraph = () => {
  if (isCooldown || !graphRef.value) return;

  isCooldown = true;
  setTimeout(() => {
    isCooldown = false;
  }, 1000);

  try {
    graphRef.value.graphManager.updateConfig(graphStore.graphConfig);
    executeGraphRender(graphStore.graphInputText);

    graphRef.value.graphManager.setSyncCallback((text, nodes) => {
      lastRenderedGraphText.value = text;
      graphStore.graphInputText = text;
      graphStore.nodeList = nodes;
    });

    ElMessage.success({ message: 'Vẽ đồ thị thành công!', grouping: true });
  } catch (error) {
    handleError(error);
  }
};

const handleToggleDrawingMode = () => {
  if (algoStore.currentStepIndex !== -1) {
    isDrawingModeEnabled.value = false;
    ElMessage.warning({
      message: 'Nhấn Next để Reset thuật toán trước khi vẽ',
      grouping: true
    });
    return;
  }

  const gm = graphRef.value?.graphManager;
  if (!gm) return;

  isDrawingModeEnabled.value = !isDrawingModeEnabled.value;

  gm.toggleDrawMode(isDrawingModeEnabled.value, (newText, newNodes) => {
    lastRenderedGraphText.value = newText;
    graphStore.graphInputText = newText;
    graphStore.nodeList = newNodes;
    graphStore.isHavingGraph = true;
  });
};

watch(
  () => algoStore.currentStepIndex,
  newIndex => {
    if (newIndex >= 0 && isDrawingModeEnabled.value) {
      isDrawingModeEnabled.value = false;
      graphRef.value?.graphManager.toggleDrawMode(false);
      ElMessage.info({
        message: 'Đã tự động tắt chế độ vẽ để thực thi thuật toán.',
        grouping: true
      });
    }
  }
);

watch(
  () => ({ ...graphStore.graphConfig }),
  (newConfig, oldConfig) => {
    if (!graphRef.value) return;

    graphRef.value.graphManager.updateConfig(newConfig);
    const isDirectedChanged = newConfig.isDirected !== oldConfig?.isDirected;

    if (graphStore.isHavingGraph && isDirectedChanged) {
      handlePause();
      try {
        executeGraphRender(graphStore.graphInputText);
        algoStore.startNodeId = '';
        algoStore.endNodeId = '';
      } catch (error) {}
    }
  },
  { deep: true }
);

watch(
  () => graphStore.graphInputText,
  newText => {
    if (newText === lastRenderedGraphText.value) return;

    graphStore.isHavingGraph = false;
    graphStore.nodeList = [];
    algoStore.startNodeId = '';
    algoStore.endNodeId = '';
  }
);

watchDebounced(
  () => graphStore.graphInputText,
  newText => {
    if (newText === lastRenderedGraphText.value) return;
    try {
      executeGraphRender(newText);
    } catch (error) {}
  },
  { debounce: 500 }
);
</script>
