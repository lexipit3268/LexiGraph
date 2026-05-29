<template>
  <main class="flex flex-1 gap-2 overflow-hidden">
    <DirectoryView />
    <div class="flex-1">
      <GraphView ref="graphRef" :is-main-graph="true" />
    </div>

    <GraphInput
      :isConfiguring="isConfiguring"
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

// usage: import graphManager from graphRef hehehe
const graphRef = ref<InstanceType<typeof GraphView> | null>(null);
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

const handleCreateGraph = () => {
  if (isCooldown) return;

  isCooldown = true;

  setTimeout(() => {
    isCooldown = false;
  }, 1000);

  if (graphRef.value) {
    try {
      graphRef.value.graphManager.updateConfig(graphConfig.value);
      graphRef.value.graphManager.importFromText(graphInputText.value);
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
