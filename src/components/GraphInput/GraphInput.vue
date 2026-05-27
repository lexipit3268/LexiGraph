<template>
  <div class="panel flex w-80 flex-col gap-4 p-4">
    <div class="space-y-1">
      <div>
        <div class="flex flex-row items-center gap-2">
          <HugeiconsIcon
            class="text-(--color-text-muted)"
            :icon="SlidersHorizontalIcon"
            :size="18"
          />
          <h2 class="text-xs font-bold text-(--color-text-muted) uppercase">Cấu hình</h2>
        </div>
        <ElDivider class="mt-4! mb-2!" />
      </div>

      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-(--color-text-main)">Loại đồ thị</h3>
        <ElSwitch
          v-model="graphConfig.isDirected"
          style="--el-switch-on-color: #0058be; --el-switch-off-color: #62b6cb"
          size="large"
          active-text="Có hướng"
          inactive-text="Vô hướng"
          inline-prompt
        />
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-(--color-text-main)">Giao diện</h3>
        <ElSelect v-model="graphConfig.theme">
          <ElOption
            v-for="item in themeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></ElOption>
        </ElSelect>
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-(--color-text-main)">Kiểu cung</h3>
        <div class="flex gap-2">
          <ElSelect v-model="graphConfig.edgeCurveStyle">
            <ElOption
              v-for="curve in edgeCurveOptions"
              :key="curve.value"
              :label="curve.label"
              :value="curve.value"
              :disabled="graphConfig.isDirected && curve.value === 'haystack'"
            />
          </ElSelect>
          <ElSelect v-model="graphConfig.edgeLineStyle">
            <ElOption
              v-for="line in edgeLineOptions"
              :key="line.value"
              :label="line.label"
              :value="line.value"
            />
          </ElSelect>
        </div>
      </div>
    </div>

    <div class="">
      <div class="flex flex-row items-center gap-2">
        <HugeiconsIcon class="text-(--color-text-muted)" :icon="KeyboardIcon" :size="18" />
        <h2 class="text-xs font-bold text-(--color-text-muted) uppercase">Dữ liệu đầu vào</h2>
      </div>
      <ElDivider class="my-4!" />

      <div>
        <CodeEditor
          v-model="modelValue"
          :languages="[['js', 'Plaintext']]"
          :display-language="true"
          width="100%"
          :line-nums="true"
          theme="docco"
          font-size="14px"
          border-radius="4px"
          height="200px"
        />
      </div>
    </div>
    <div class="space-y-2">
      <button class="secondary-btn flex flex-row items-center justify-center gap-2">
        <HugeiconsIcon :icon="BlendIcon" :size="18" />
        Vẽ ngẫu nhiên
      </button>
      <button
        @click="emit('create-graph')"
        class="primary-btn flex flex-row items-center justify-center gap-2"
      >
        <HugeiconsIcon :icon="BrushIcon" :size="18" />
        Vẽ Đồ Thị
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GraphConfig } from '../../core/GraphConfig';
import { EdgeCurveStyle, EdgeLineStyle, GraphThemes } from '../../core/graphStyles';
import {
  BlendIcon,
  BrushIcon,
  KeyboardIcon,
  SlidersHorizontalIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ElDivider, ElOption, ElSelect, ElSwitch } from 'element-plus';
// @ts-ignore: module has no declaration file
import CodeEditor from 'simple-code-editor/CodeEditor.vue';

const graphConfig = defineModel<GraphConfig>('config', { required: true });
const modelValue = defineModel<string>();

const themeOptions: { label: string; value: GraphThemes }[] = [
  { label: 'Mặc định', value: 'default' },
  { label: 'Hoàng hôn', value: 'sunset' },
  { label: 'Đơn sắc', value: 'monochrome' },
  { label: 'Nordic', value: 'nordic' }
];

const edgeCurveOptions: { label: string; value: EdgeCurveStyle }[] = [
  { label: 'Cong mềm', value: 'bezier' },
  { label: 'Đường thẳng nhanh', value: 'haystack' },
  { label: 'Gấp khúc', value: 'segments' },
  { label: 'Đường thẳng', value: 'straight' },
  { label: 'Vuông góc', value: 'taxi' },
  { label: 'Cong đa hướng', value: 'unbundled-bezier' }
];

const edgeLineOptions: { label: string; value: EdgeLineStyle }[] = [
  { label: 'Nét liền', value: 'solid' },
  { label: 'Nét đứt', value: 'dashed' },
  { label: 'Chấm bi', value: 'dotted' }
];

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
:deep(.el-select__wrapper) {
  background: var(--color-bg-app);
}
</style>
