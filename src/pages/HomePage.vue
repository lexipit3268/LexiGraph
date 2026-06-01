<template>
  <main class="grid h-full w-full flex-1 grid-cols-[1fr_auto] gap-2">
    <div class="flex h-full w-full flex-col gap-2 overflow-hidden">
      <div class="relative flex w-full flex-1 gap-2 overflow-hidden">
        <div class="relative w-1/4 min-w-62.5">
          <GraphView ref="subGraphRef" />
        </div>

        <div class="relative flex-1 overflow-hidden">
          <GraphView
            ref="graphRef"
            :is-main-graph="true"
            @play="handlePlay"
            @pause="handlePause"
            @next="handleNextStep"
            @previous="handlePrevStep"
            @speed="handleSpeed"
          />
        </div>
      </div>

      <div class="flex h-70 w-full shrink-0 gap-2">
        <DirectoryView class="" />
        <div
          class="panel flex flex-1 flex-col rounded-xl border border-(--color-border) bg-(--color-bg-panel)"
        >
          <h3 class="m-4 text-[13px] font-bold text-(--color-text-muted) uppercase">
            Bước chạy thuật toán
          </h3>

          <ElDivider class="m-0! mb-2!" />

          <div class="h-full overflow-y-auto p-2">
            <div v-if="algoHistory.length > 0" class="flex flex-1 flex-col gap-2 p-2 select-none">
              <div
                v-for="(step, index) in algoHistory"
                :key="step.step"
                class="rounded-lg border p-3 transition-all duration-200"
                :class="[
                  index === currentStepIndex
                    ? 'border-(--color-primary) bg-(--color-primary-light) shadow-xs'
                    : 'border-(--color-border) bg-(--color-secondary-light)/50 opacity-60 hover:opacity-90'
                ]"
              >
                <div class="flex items-start gap-3 text-sm">
                  <span
                    class="inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase"
                    :class="{
                      'border-purple-200 bg-purple-50 text-purple-600': step.action === 'INIT',
                      'border-amber-200 bg-amber-50 text-amber-600': step.action === 'VISIT',
                      'border-blue-200 bg-blue-50 text-blue-600': step.action === 'CHECK',
                      'border-(--color-success)/20 bg-(--color-success)/10 text-(--color-success)':
                        step.action === 'RELAX',
                      'border-slate-200 bg-slate-100 text-(--color-text-main)':
                        step.action === 'COMPLETE'
                    }"
                  >
                    Bước {{ step.step }}
                  </span>

                  <span class="flex-1 text-[13px] leading-relaxed text-(--color-text-main)">
                    {{ step.description }}
                  </span>
                </div>

                <div
                  v-if="index === currentStepIndex"
                  class="mt-3 flex flex-col gap-1 border-t border-(--color-border) pt-2.5 font-mono text-[11px] text-(--color-text-muted)"
                >
                  <div class="flex items-center gap-1.5">
                    <span class="w-24 shrink-0 font-semibold text-(--color-text-main)"
                      >Khoảng cách:
                    </span>
                    <span
                      class="truncate rounded border border-(--color-border) bg-white px-1.5 py-0.5"
                    >
                      {{ formatRow(step.pi) }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-24 shrink-0 font-semibold text-(--color-text-main)"
                      >Đỉnh cha:
                    </span>
                    <span
                      class="truncate rounded border border-(--color-border) bg-white px-1.5 py-0.5"
                    >
                      {{ formatRow(step.p) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="flex h-full flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-(--color-border) bg-(--color-bg-app)/50 p-8 text-center text-sm text-(--color-text-muted) italic"
            >
              <p>Chưa có dữ liệu tiến trình thực thi.</p>
              <p class="text-xs text-gray-400 not-italic">
                Bấm Play hoặc Next trên bảng điều khiển để kích hoạt giải thuật.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <GraphInput
      :isConfiguring="isConfiguring"
      :isHavingGraph="isHavingGraph"
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
import { ElDivider, ElMessage } from 'element-plus';
import { EdgeLineStyle, EdgeCurveStyle, GraphThemes } from '../core/graphStyles.ts';
import { handleError } from '../utils/errorHandler.ts';

import { useAlgorithm } from '../composables/useAlgorithm';

const graphRef = ref<InstanceType<typeof GraphView> | null>(null);
const subGraphRef = ref<InstanceType<typeof GraphView> | null>(null);

const isHavingGraph = ref(false);
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

const {
  algoHistory,
  currentStepIndex,
  formatRow,
  resetAlgorithm,
  handlePlay,
  handlePause,
  handleNextStep,
  handlePrevStep,
  handleSpeed
} = useAlgorithm(graphRef, subGraphRef);

const handleCreateGraph = () => {
  if (isCooldown) return;
  isCooldown = true;
  setTimeout(() => {
    isCooldown = false;
  }, 1000);

  if (graphRef.value) {
    try {
      resetAlgorithm();
      graphRef.value.graphManager.updateConfig(graphConfig.value);
      graphRef.value.graphManager.importFromText(
        graphInputText.value,
        graphRef.value?.isPhysicsEnabled
      );
      isHavingGraph.value = true;
      ElMessage.success({ message: 'Vẽ đồ thị thành công!', grouping: true });
    } catch (error) {
      handleError(error);
    }
  }
};

const handleResetConfig = () => {
  graphConfig.value = { ...DEFAULT_CONFIG };
  ElMessage.info('Đã khôi phục tùy chọn mặc định');
};

watch(
  graphConfig,
  newConfig => {
    if (graphRef.value) {
      handlePause();
      resetAlgorithm();
      graphRef.value.graphManager.updateConfig(newConfig);
      graphRef.value.graphManager.importFromText(
        graphInputText.value,
        graphRef.value?.isPhysicsEnabled
      );
      isHavingGraph.value = false;
    }
    isConfiguring.value = JSON.stringify(newConfig) !== JSON.stringify(DEFAULT_CONFIG);
  },
  { deep: true }
);

watch(
  graphInputText,
  () => {
    graphRef.value?.graphManager.clearElements();
    isHavingGraph.value = false;
  },
  { deep: true }
);
</script>
