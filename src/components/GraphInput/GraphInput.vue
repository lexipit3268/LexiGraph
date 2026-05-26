<template>
  <div class="panel flex w-80 flex-col gap-2 p-4">
    <h2 class="font-bold text-slate-700">Dữ liệu đồ thị</h2>

    <CodeEditor
      v-model="modelValue"
      :languages="[['js', 'Plaintext']]"
      :display-language="true"
      width="100%"
      :line-nums="true"
      theme="docco"
      font-size="14px"
      border-radius="4px"
    />

    <button
      @click="emit('create-graph')"
      class="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
    >
      Vẽ Đồ Thị
    </button>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore: module has no declaration file
import CodeEditor from 'simple-code-editor/CodeEditor.vue';
const modelValue = defineModel<string>();
const emit = defineEmits<{
  (e: 'create-graph'): void;
}>();
</script>

<style scoped>
:deep(.header.border) {
  border-width: 0px;
}
:deep(.code-editor) {
  border: 1px solid var(--color-border);
  border-radius: 4px;
}
:deep(.code-editor textarea),
:deep(.code-editor .hljs) {
  font-family: var(--font-mono) !important;
}
</style>
