<template>
  <main class="flex flex-1 gap-4 overflow-hidden p-4">
    <div class="flex w-80 flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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

    <div
      class="relative flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <GraphView ref="graphRef" />
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
