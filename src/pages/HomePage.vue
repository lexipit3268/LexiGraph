<template>
  <main class="flex flex-1 gap-2 overflow-hidden">
    <DirectoryView />
    <div class="flex-1">
      <GraphView ref="graphRef" :is-main-graph="true" />
    </div>

    <GraphInput v-model="graphInput" @create-graph="handleCreateGraph" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GraphView from '../components/GraphView.vue';
import DirectoryView from '../components/DirectoryView/DirectoryView.vue';
import GraphInput from '../components/GraphInput/GraphInput.vue';
import { ElMessage } from 'element-plus';

const graphRef = ref<InstanceType<typeof GraphView> | null>(null);
const graphInput = ref<string>('4 4\n4 1 2\n1 3 -3\n2 3 3\n2 3 3');

const handleCreateGraph = () => {
  if (graphRef.value) {
    try {
      graphRef.value.graphManager.drawGraph(graphInput.value);
      ElMessage.success('Đã vẽ đồ thị thành công!');
    } catch (error) {
      ElMessage.error('Lỗi cú pháp đồ thị. Vui lòng kiểm tra lại.');
    }
  }
};
</script>
<style scoped></style>
