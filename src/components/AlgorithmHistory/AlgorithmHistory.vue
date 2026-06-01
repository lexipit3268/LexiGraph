<template>
  <div
    class="panel flex flex-1 flex-col overflow-x-hidden rounded-xl border border-(--color-border) bg-(--color-bg-panel)"
  >
    <div class="m-4 mb-2 flex items-center justify-between">
      <h3 class="text-[13px] font-bold tracking-wide text-(--color-text-muted) uppercase">
        Bảng theo dõi thuật toán
      </h3>
    </div>

    <ElDivider class="m-0!" />

    <div class="flex-1 overflow-x-hidden overflow-y-auto! p-4">
      <div
        v-if="algoHistory.length > 0"
        class="relative w-full rounded-md border border-(--color-border) bg-white select-none"
      >
        <div class="w-full">
          <table class="w-full min-w-200 text-left text-sm">
            <thead class="border-b border-(--color-border) bg-(--color-bg-app)">
              <tr class="text-(--color-text-muted)">
                <th class="h-10 w-24 px-4 align-middle font-semibold">Bước</th>
                <th class="h-10 px-4 align-middle font-semibold">Chi tiết thao tác</th>
                <th class="h-10 w-64 px-4 align-middle font-semibold">Khoảng cách (&pi;)</th>
                <th class="h-10 w-64 px-4 align-middle font-semibold">Đỉnh cha (p)</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-(--color-border)">
              <tr
                v-for="(step, index) in algoHistory"
                :key="step.step"
                class="transition-colors duration-200 hover:bg-(--color-bg-panel-hover)/60"
                :class="[
                  index === currentStepIndex
                    ? 'bg-(--color-primary-light) shadow-[inset_3px_0_0_var(--color-primary)]'
                    : 'bg-white'
                ]"
              >
                <td class="px-4 py-3 align-top">
                  <span
                    class="mt-0.5 inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase"
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
                </td>

                <td
                  class="px-4 py-3 align-top text-[13px] leading-relaxed text-(--color-text-main)"
                >
                  {{ step.description }}
                </td>

                <td class="px-4 py-3 align-top">
                  <div
                    class="rounded border border-(--color-border) bg-(--color-bg-app)/50 p-2 font-mono text-[11px] text-(--color-text-muted)"
                  >
                    {{ formatRow(step.pi) }}
                  </div>
                </td>

                <td class="px-4 py-3 align-top">
                  <div
                    class="rounded border border-(--color-border) bg-(--color-bg-app)/50 p-2 font-mono text-[11px] text-(--color-text-muted)"
                  >
                    {{ formatRow(step.p) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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

const { algoHistory, currentStepIndex, formatRow } = defineProps<{
  algoHistory: AlgorithmStep[];
  currentStepIndex: number;
  formatRow: (row: any) => string;
}>();

const historyContainerRef = ref<HTMLElement | null>(null);

defineExpose({
  historyContainerRef
});
</script>
