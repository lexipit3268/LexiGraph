<template>
  <div class="panel flex w-75 flex-col gap-4 p-4" v-loading="isAnimating">
    <div class="space-y-2">
      <div>
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-row items-center gap-2">
            <HugeiconsIcon
              class="text-(--color-text-muted)"
              :icon="SlidersHorizontalIcon"
              :size="18"
            />
            <h2 class="text-xs font-bold text-(--color-text-muted) uppercase">Tùy chỉnh</h2>
          </div>
          <ElTooltip v-if="isConfiguring" content="Đặt lại mặc định">
            <button @click="emit('reset-config')">
              <HugeiconsIcon
                class="cursor-pointer text-(--color-text-muted) transition-all duration-200 hover:text-(--color-primary)"
                :icon="FilterResetIcon"
                :size="18"
              />
            </button>
          </ElTooltip>
        </div>
        <ElDivider class="mt-4! mb-2!" />
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-(--color-text-main)">Loại đồ thị</h3>

        <div class="panel flex h-8 w-full overflow-hidden rounded-sm!">
          <button
            :disabled="isAnimating"
            type="button"
            @click="graphConfig.isDirected = !graphConfig.isDirected"
            :class="[
              'flex w-full cursor-pointer items-center justify-center px-4 text-sm font-medium transition-colors duration-500 disabled:cursor-not-allowed',
              graphConfig.isDirected
                ? 'bg-(--color-secondary) text-(--color-text-active)'
                : 'text-(--color-text-muted) hover:bg-(--color-bg-app)'
            ]"
          >
            Có hướng
          </button>

          <div class="w-px bg-slate-200"></div>

          <button
            :disabled="isAnimating"
            type="button"
            @click="graphConfig.isDirected = !graphConfig.isDirected"
            :class="[
              'flex w-full cursor-pointer items-center justify-center px-4 text-sm font-medium transition-colors duration-500 disabled:cursor-not-allowed',
              !graphConfig.isDirected
                ? 'bg-(--color-secondary) text-(--color-text-active)'
                : 'text-(--color-text-muted) hover:bg-(--color-bg-app)'
            ]"
          >
            Vô hướng
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-(--color-text-main)">Bộ lọc màu</h3>
        <ElSelect v-model="graphConfig.theme" :disabled="isAnimating">
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
          <ElSelect v-model="graphConfig.edgeCurveStyle" :disabled="isAnimating">
            <ElOption
              v-for="curve in edgeCurveOptions"
              :key="curve.value"
              :label="curve.label"
              :value="curve.value"
              :disabled="graphConfig.isDirected && curve.value === 'haystack'"
            />
          </ElSelect>
          <ElSelect v-model="graphConfig.edgeLineStyle" class="max-w-25!" :disabled="isAnimating">
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
        <h2 class="text-xs font-bold text-(--color-text-muted) uppercase">Dữ liệu đồ thị</h2>
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
          :read-only="isAnimating"
        />
      </div>
    </div>
    <div v-if="isHavingGraph" class="grid grid-cols-2 gap-2">
      <div>
        <p class="mb-1 text-sm font-semibold text-(--color-text-main)">Đỉnh bắt đầu</p>
        <ElSelect
          v-model="startNodeId"
          placeholder="Chọn đỉnh"
          :disabled="isAnimating"
          clearable
          filterable
        >
          <ElOption v-for="node in nodeList" :key="node.id" :label="node.label" :value="node.id" />
        </ElSelect>
      </div>
      <div>
        <p class="mb-1 text-sm font-semibold text-(--color-text-main)">Đỉnh kết thúc</p>
        <ElSelect
          v-model="endNodeId"
          placeholder="Chọn đỉnh"
          :disabled="isAnimating"
          clearable
          filterable
        >
          <ElOption v-for="node in nodeList" :key="node.id" :label="node.label" :value="node.id" />
        </ElSelect>
      </div>
    </div>
    <div class="flex flex-1 flex-col justify-end space-y-2">
      <button
        class="secondary-btn flex flex-row items-center justify-center gap-2 disabled:cursor-not-allowed!"
        :disabled="isAnimating"
      >
        <HugeiconsIcon :icon="BlendIcon" :size="18" />
        Đồ Thị Ngẫu Nhiên
      </button>
      <button
        @click="emit('create-graph')"
        class="primary-btn flex flex-row items-center justify-center gap-2 disabled:cursor-not-allowed!"
        :disabled="isAnimating"
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
  FilterResetIcon,
  KeyboardIcon,
  SlidersHorizontalIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ElDivider, ElOption, ElSelect, ElTooltip } from 'element-plus';
// @ts-ignore: module has no declaration file
import CodeEditor from 'simple-code-editor/CodeEditor.vue';
import { watch } from 'vue';
import { Node } from '../../core/Graph';

const { isConfiguring, isHavingGraph, isAnimating, nodeList } = defineProps<{
  isConfiguring: boolean;
  isHavingGraph: boolean;
  isAnimating: boolean;
  nodeList: Node[];
}>();

const graphConfig = defineModel<GraphConfig>('config', { required: true });
const modelValue = defineModel<string>();
const startNodeId = defineModel<string>('startNodeId', { required: true });
const endNodeId = defineModel<string>('endNodeId', { required: true });

const themeOptions: { label: string; value: GraphThemes }[] = [
  { label: 'Mặc định', value: 'default' },
  { label: 'Hoàng hôn', value: 'sunset' },
  { label: 'Đơn sắc', value: 'monochrome' },
  { label: 'Nordic', value: 'nordic' },
  { label: 'Rừng xanh', value: 'forest' },
  { label: 'Cyberpunk', value: 'cyberpunk' },
  { label: 'Lavender', value: 'lavender' }
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
  (e: 'reset-config'): void;
}>();

watch(
  () => nodeList,
  () => {},
  { deep: true }
);
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
:deep(.el-loading-mask) {
  background: #dbeafe50;
}
</style>
