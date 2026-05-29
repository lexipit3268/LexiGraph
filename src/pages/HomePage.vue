<template>
  <main class="grid h-full w-full flex-1 grid-cols-[auto_1fr_auto] gap-2">
    <DirectoryView />

    <div class="relative mx-auto flex h-full w-full max-w-225 min-w-0 flex-col gap-2!">
      <GraphView ref="graphRef" :is-main-graph="true" />
      <div class="flex h-full max-h-60 gap-2">
        <div class="panel flex-1">box 1</div>
        <div class="panel flex-1">box 2</div>
      </div>
    </div>

    <!-- <div class="relative mx-auto flex h-full w-full max-w-225 min-w-0 flex-col">
      <ElSplitter layout="vertical" style="height: 100%">
        <ElSplitterPanel :size="70" :min="30">
          <GraphView ref="graphRef" :is-main-graph="true" />
        </ElSplitterPanel>

        <ElSplitterPanel :size="30" :collapsible="true">
          <ElSplitter style="height: 100%">
            <ElSplitterPanel :size="50" class="panel">
              <div class="h-full w-full p-2">Pseudo Code Box 1</div>
            </ElSplitterPanel>

            <ElSplitterPanel :size="50" class="panel">
              <div class="h-full w-full p-2">Console/Step Box 2</div>
            </ElSplitterPanel>
          </ElSplitter>
        </ElSplitterPanel>
      </ElSplitter>
    </div> -->

    <GraphInput
      :isConfiguring="isConfiguring"
      v-model="graphInputText"
      v-model:config="graphConfig"
      v-model:is-physics-enabled="isPhysicsEnabled"
      @create-graph="handleCreateGraph"
      @reset-config="handleResetConfig"
      @toggle-physic="handleTogglePhysic"
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

// usage: import graphManager from graphRef hehehe
const graphRef = ref<InstanceType<typeof GraphView> | null>(null);
const graphInputText = ref<string>('4 4\n4 1 2\n1 3 -3\n2 3 3\n2 3 3');
const isConfiguring = ref(false);
const isPhysicsEnabled = ref(false);

const DEFAULT_CONFIG = {
  isDirected: true,
  theme: 'default' as GraphThemes,
  edgeLineStyle: 'solid' as EdgeLineStyle,
  edgeCurveStyle: 'bezier' as EdgeCurveStyle
};

const graphConfig = ref({ ...DEFAULT_CONFIG });

let isCooldown = false;

const handleCreateGraph = () => {
  if (isCooldown) return;

  isCooldown = true;

  setTimeout(() => {
    isCooldown = false;
  }, 1000);

  if (graphRef.value) {
    try {
      graphRef.value.graphManager.updateConfig(graphConfig.value);
      graphRef.value.graphManager.importFromText(graphInputText.value, isPhysicsEnabled.value);
      ElMessage.success('Đã vẽ đồ thị thành công!');
    } catch (error) {
      handleError(error);
    }
  }
};

const handleResetConfig = () => {
  graphConfig.value = { ...DEFAULT_CONFIG };
  ElMessage.info('Đã khôi phục cấu hình mặc định');
};

const handleTogglePhysic = () => {
  console.log('Trạng thái vật lý:', isPhysicsEnabled.value);
  graphRef.value?.graphManager.toggleContinuousPhysics(isPhysicsEnabled.value);
};

watch(
  graphConfig,
  newConfig => {
    if (graphRef.value) {
      graphRef.value.graphManager.updateConfig(newConfig);
    }
    isConfiguring.value = JSON.stringify(newConfig) !== JSON.stringify(DEFAULT_CONFIG);
  },
  { deep: true }
);
</script>
<style scoped></style>
