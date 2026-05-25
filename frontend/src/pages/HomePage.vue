<template>
  <main class="flex flex-1 gap-2 overflow-hidden">
    <div class="relative max-w-220 flex-1 overflow-hidden">
      <GraphView ref="graphRef" />
    </div>

    <!-- Input -->
    <div class="panel flex w-80 flex-col gap-2 p-4">
      <h2 class="font-bold text-slate-700">Dữ liệu đồ thị</h2>

      <CodeEditor
        v-model="graphInput"
        :display-language="false"
        width="100%"
        :line-nums="true"
        theme="mono-blue"
        font-size="14px"
        border-radius="4px"
      />

      <button
        @click="handleCreateGraph"
        class="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
      >
        Vẽ Đồ Thị
      </button>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import GraphView from '../components/GraphView.vue';
// @ts-ignore: module has no declaration file
import CodeEditor from 'simple-code-editor/CodeEditor.vue';

const graphInput = ref(`4 4\n4 1 2\n1 3 -3\n2 3 3\n2 3 3`);

const graphRef = ref<InstanceType<typeof GraphView> | null>(null);

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
<style scoped>
:deep(.header.border) {
  border-width: 0px;
}
:deep(.code-editor textarea),
:deep(.code-editor .hljs) {
  font-family: var(--font-mono) !important;
}
</style>
