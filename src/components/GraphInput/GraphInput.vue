<template>
  <div class="relative h-full overflow-hidden">
    <Transition name="fade">
      <LoadingComponent v-if="isAnimating" />
    </Transition>
    <div class="panel flex h-full w-75 flex-col gap-4 p-4">
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
                  : 'text-(--color-text-muted) hover:bg-(--color-secondary-hover)'
              ]"
            >
              Có hướng
            </button>

            <button
              :disabled="isAnimating"
              type="button"
              @click="graphConfig.isDirected = !graphConfig.isDirected"
              :class="[
                'flex w-full cursor-pointer items-center justify-center px-4 text-sm font-medium transition-colors duration-500 disabled:cursor-not-allowed',
                !graphConfig.isDirected
                  ? 'bg-(--color-secondary) text-(--color-text-active)'
                  : 'text-(--color-text-muted) hover:bg-(--color-secondary-hover)'
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
            v-if="isEditorVisible"
            v-model="graphInput"
            :languages="[['js', 'Plaintext']]"
            :display-language="true"
            width="100%"
            :line-nums="true"
            theme="github-dark-dimmed"
            font-size="16px"
            border-radius="4px"
            height="250px"
            :read-only="isAnimating"
          />
        </div>
      </div>
      <div v-if="isHavingGraph" class="flex items-center justify-between gap-2">
        <div class="flex-1">
          <p class="mb-1 text-sm font-semibold text-(--color-text-main)">Đỉnh bắt đầu</p>
          <ElSelect
            v-model="startNodeId"
            placeholder="Đỉnh..."
            :disabled="isAnimating"
            clearable
            filterable
          >
            <ElOption
              v-for="node in nodeList"
              :key="node.id"
              :label="node.label"
              :value="node.id"
            />
          </ElSelect>
        </div>
        <button class="toolbar-btn" @click="switchSelection">
          <HugeiconsIcon :icon="ArrowDataTransferHorizontalIcon" :size="15" />
        </button>
        <div class="flex-1">
          <p class="mb-1 text-sm font-semibold text-(--color-text-main)">Đỉnh kết thúc</p>
          <ElSelect
            v-model="endNodeId"
            placeholder="Đỉnh..."
            :disabled="isAnimating"
            clearable
            filterable
          >
            <ElOption
              v-for="node in nodeList"
              :key="node.id"
              :label="node.label"
              :value="node.id"
            />
          </ElSelect>
        </div>
      </div>
      <div class="flex flex-1 flex-col justify-end space-y-2">
        <button
          class="secondary-btn flex flex-row items-center justify-center gap-2 disabled:cursor-not-allowed!"
          :disabled="isAnimating"
          @click="handleCreateRandomGraph"
        >
          <HugeiconsIcon :icon="BlendIcon" :size="18" />
          Đồ Thị Ngẫu Nhiên
        </button>
        <button
          @click="emit('create-graph')"
          class="relative flex h-10 cursor-pointer flex-row items-center justify-center gap-2 overflow-hidden rounded-sm transition-all duration-500 active:scale-95"
          :disabled="isAnimating"
        >
          <Grainient
            color1="#0353a4"
            color2="#5390d9"
            color3="#48bfe3"
            :time-speed="1.5"
            :color-balance="0.0"
            :warp-strength="1.0"
            :warp-frequency="5.0"
            :warp-speed="2.0"
            :warp-amplitude="50.0"
            :blend-angle="0.0"
            :blend-softness="0.05"
            :rotation-amount="500.0"
            :noise-scale="2.0"
            :grain-amount="0"
            :grain-scale="2.0"
            :grain-animated="false"
            :contrast="1.5"
            :gamma="1.0"
            :saturation="1.0"
            :center-x="0.0"
            :center-y="0.2"
            :zoom="0.9"
          />

          <div class="absolute flex flex-row items-center justify-center gap-2 text-white">
            <HugeiconsIcon :icon="BrushIcon" :size="18" />
            Vẽ Đồ Thị
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GraphConfig } from '../../core/GraphConfig';
import { EdgeCurveStyle, EdgeLineStyle, GraphThemes } from '../../core/graphStyles';
import {
  ArrowDataTransferHorizontalIcon,
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
import { nextTick, onActivated, onDeactivated, ref, watch } from 'vue';
import { Node } from '../../core/Graph';
import { PRESET_GRAPHS } from '../../constants/graphPresets';
import LoadingComponent from '../LoadingComponent.vue';
import Grainient from '../vuebits/Grainient/Grainient.vue';

const { isConfiguring, isHavingGraph, isAnimating, nodeList } = defineProps<{
  isConfiguring: boolean;
  isHavingGraph: boolean;
  isAnimating: boolean;
  nodeList: Node[];
}>();

const graphConfig = defineModel<GraphConfig>('config', { required: true });
const graphInput = defineModel<string>('graphInput', { required: true });
const startNodeId = defineModel<string>('startNodeId', { required: true });
const endNodeId = defineModel<string>('endNodeId', { required: true });

const isEditorVisible = ref(true);

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
  (e: 'create-random-graph'): void;
  (e: 'reset-config'): void;
}>();

let lastRandomIndex = -1;
let isLocalCooldown = false;

const handleCreateRandomGraph = async () => {
  if (isLocalCooldown) return;
  isLocalCooldown = true;
  setTimeout(() => {
    isLocalCooldown = false;
  }, 1000);

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * PRESET_GRAPHS.length);
  } while (randomIndex === lastRandomIndex && PRESET_GRAPHS.length > 1);

  lastRandomIndex = randomIndex;
  graphInput.value = PRESET_GRAPHS[randomIndex];

  await nextTick();
  emit('create-graph');
};

const switchSelection = () => {
  [startNodeId.value, endNodeId.value] = [endNodeId.value, startNodeId.value];
};

watch(
  () => nodeList,
  () => {},
  { deep: true }
);

onDeactivated(() => {
  isEditorVisible.value = false;
});

onActivated(() => {
  nextTick(() => {
    isEditorVisible.value = true;
  });
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
