<template>
  <div
    class="panel flex flex-1 flex-col overflow-hidden rounded-xl border border-(--color-border) bg-(--color-bg-panel)"
  >
    <TitleComponent title="Bảng theo dõi thuật toán" />
    <ElDivider class="m-0!" />

    <div
      ref="historyContainerRef"
      class="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth p-4"
    >
      <div v-if="algoHistory.length > 0" class="flex flex-col gap-3">
        <div
          v-for="(step, index) in algoHistory"
          :key="step.step"
          class="flex flex-col gap-2 rounded-lg border p-3 text-sm transition-all duration-300"
          :class="[
            index === currentStepIndex
              ? 'border-blue-300 bg-blue-50/40 ring-1 ring-blue-200'
              : 'border-slate-100 bg-(--color-bg-panel) hover:border-(--color-border) hover:bg-(--color-bg-panel-hover)/60'
          ]"
        >
          <div class="flex items-start gap-3">
            <span
              class="mt-0.5 inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase"
              :class="{
                'border-purple-200 bg-purple-50 text-purple-600': step.action === 'INIT',
                'border-amber-200 bg-amber-50 text-amber-600': step.action === 'VISIT',
                'border-blue-200 bg-blue-50 text-blue-600': step.action === 'CHECK',
                'border-(--color-success)/20 bg-(--color-success)/10 text-(--color-success)':
                  step.action === 'RELAX',
                'border-(--color-border) bg-slate-100 text-slate-600': step.action === 'COMPLETE'
              }"
            >
              Bước {{ step.step }}
            </span>
            <span class="text-[13px] leading-relaxed font-medium text-(--color-text-main)">
              {{ step.description }}
            </span>
          </div>

          <div class="mt-1 ml-0 flex flex-wrap gap-2 sm:ml-12">
            <div
              v-for="(val, node) in step.pi"
              :key="node"
              class="flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs transition-colors"
              :class="
                isNodeUpdated(index, node)
                  ? 'border-green-200 bg-green-50'
                  : 'border-(--color-border) bg-(--color-bg-panel)'
              "
            >
              <span
                class="font-bold text-(--color-text-main)"
                :class="{ 'text-green-700': isNodeUpdated(index, node) }"
              >
                {{ node }}
              </span>
              <span class="text-slate-300">|</span>

              <div class="flex items-center gap-1">
                <span class="font-serif text-(--color-text-muted) italic">π:</span>
                <span
                  class="font-semibold"
                  :class="[
                    val === 999
                      ? 'text-sm leading-none text-(--color-text-muted)'
                      : 'text-(--color-text-main)',
                    { 'text-green-700': isNodeUpdated(index, node) }
                  ]"
                >
                  {{ val === 999 ? '∞' : val }}
                </span>
              </div>

              <template v-if="step.p && step.p[node] !== null && step.p[node] !== undefined">
                <span class="text-slate-300">|</span>
                <div class="flex items-center gap-1">
                  <span class="font-serif text-(--color-text-muted) italic">p:</span>
                  <span
                    class="font-semibold text-slate-600"
                    :class="{ 'text-green-700': isNodeUpdated(index, node) }"
                  >
                    {{ step.p[node] }}
                  </span>
                </div>
              </template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElDivider } from 'element-plus';
import { AlgorithmStep } from '../../core/algorithms/types/AlgorithmStep';
import TitleComponent from '../TitleComponent.vue';

const { algoHistory, currentStepIndex } = defineProps<{
  algoHistory: AlgorithmStep[];
  currentStepIndex: number;
  formatRow: (row: any) => string;
}>();

const historyContainerRef = ref<HTMLElement | null>(null);

const isNodeUpdated = (index: number, node: string | number) => {
  if (index === 0) return false;

  const prevStep = algoHistory[index - 1];
  const currStep = algoHistory[index];

  if (prevStep.pi[node] !== currStep.pi[node]) return true;

  if (prevStep.p && currStep.p && prevStep.p[node] !== currStep.p[node]) return true;

  return false;
};

defineExpose({
  historyContainerRef
});
</script>
