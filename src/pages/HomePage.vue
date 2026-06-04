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
            :isAnimating="isAnimating"
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
      :isConfiguring="graphStore.isConfiguring"
      :isHavingGraph="graphStore.isHavingGraph"
      :isAnimating="algoStore.isAnimating"
      :nodeList="graphStore.nodeList"
      v-model="graphStore.graphInputText"
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
import GraphView from '../components/GraphView.vue';
import DirectoryView from '../components/DirectoryView/DirectoryView.vue';
import GraphInput from '../components/GraphInput/GraphInput.vue';
import { ElMessage } from 'element-plus';
import { handleError } from '../utils/errorHandler.ts';

import { useAlgorithm } from '../composables/useAlgorithm';
import AlgorithmHistory from '../components/AlgorithmHistory/AlgorithmHistory.vue';

import { useGraphStore } from '../stores/useGraphStore';
import { useAlgorithmStore } from '../stores/useAlgorithmStore';
import { storeToRefs } from 'pinia';

const graphStore = useGraphStore();
const algoStore = useAlgorithmStore();

const graphRef = ref<InstanceType<typeof GraphView> | null>(null);
const subGraphRef = ref<InstanceType<typeof GraphView> | null>(null);

let isCooldown = false;

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

const handleCreateGraph = () => {
  if (isCooldown) return;
  isCooldown = true;
  setTimeout(() => {
    isCooldown = false;
  }, 1000);

  if (graphRef.value) {
    try {
      resetAlgorithm();
      graphRef.value.graphManager.updateConfig(graphStore.graphConfig);
      graphRef.value.graphManager.importFromText(
        graphStore.graphInputText,
        graphRef.value?.isPhysicsEnabled
      );
      graphStore.nodeList = graphRef.value.graphManager.getNodes();
      graphStore.isHavingGraph = true;
      ElMessage.success({ message: 'Vẽ đồ thị thành công!', grouping: true });
    } catch (error) {
      handleError(error);
    }
  }
};

watch(
  () => ({ ...graphStore.graphConfig }),
  (newConfig, oldConfig) => {
    if (graphRef.value) {
      graphRef.value.graphManager.updateConfig(newConfig);

      const isDirectedChanged = newConfig.isDirected !== oldConfig?.isDirected;

      if (graphStore.isHavingGraph && isDirectedChanged) {
        handlePause();
        resetAlgorithm();

        try {
          graphRef.value.graphManager.importFromText(
            graphStore.graphInputText,
            graphRef.value?.isPhysicsEnabled
          );
          algoStore.startNodeId = '';
          algoStore.endNodeId = '';
          graphStore.nodeList = graphRef.value.graphManager.getNodes();
        } catch (error) {}
      }
    }
  },
  { deep: true }
);

watch(
  () => graphStore.graphInputText,
  () => {
    graphStore.isHavingGraph = false;
    graphStore.nodeList = [];
    algoStore.startNodeId = '';
    algoStore.endNodeId = '';
  }
);
</script>
