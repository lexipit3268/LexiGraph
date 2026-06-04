<template>
  <div
    class="panel flex flex-1 flex-col overflow-hidden rounded-xl border border-(--color-border) bg-(--color-bg-panel)"
  >
    <div class="flex items-center justify-between pr-2">
      <TitleComponent title="Bảng theo dõi thuật toán" />
      <ElTooltip content="Phóng to bảng" placement="top">
        <button
          @click="isModalOpen = true"
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
        >
          <HugeiconsIcon :icon="FullScreenIcon" :size="16" />
        </button>
      </ElTooltip>
    </div>
    <ElDivider class="m-0!" />

    <div ref="historyContainerRef" class="flex-1 overflow-y-auto p-4">
      <div v-if="algoHistory.length > 0" class="flex flex-col gap-4">
        <div
          class="custom-scrollbar relative w-full overflow-x-auto rounded-md border border-(--color-border) bg-(--color-bg-panel)"
        >
          <table class="w-full min-w-max text-left text-sm">
            <thead
              class="sticky top-0 z-10 border-b border-(--color-border) bg-(--color-bg-titlebar)"
            >
              <tr class="text-(--color-text-muted)">
                <th
                  class="w-12 border-r border-(--color-border)/50 px-3 py-2 text-center font-semibold"
                >
                  Bước
                </th>
                <th class="w-fit border-r border-(--color-border)/50 px-3 py-2 font-semibold">
                  Hành động
                </th>
                <th class="border-r border-(--color-border)/50 px-3 py-2 font-semibold">
                  Chi tiết
                </th>

                <th
                  v-for="node in allNodes"
                  :key="'header-' + node"
                  class="border-r border-(--color-border)/50 px-3 py-2 text-center font-semibold whitespace-nowrap last:border-0"
                >
                  Đỉnh {{ node }}
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-(--color-border)/50">
              <tr
                v-for="(step, index) in algoHistory"
                :key="step.step"
                class="transition-all duration-500"
                :class="
                  index === currentStepIndex
                    ? 'bg-(--color-primary-light) shadow-[inset_3px_0_0_var(--color-primary)]'
                    : 'hover:bg-(--color-bg-panel-hover)'
                "
              >
                <td
                  class="border-r border-(--color-border)/50 px-2 py-1.5 text-center font-mono font-medium text-(--color-text-muted)"
                >
                  {{ step.step }}
                </td>

                <td class="border-r border-(--color-border)/50 px-3 py-1.5 whitespace-nowrap">
                  <span class="font-medium text-(--color-text-main)">
                    {{ actionMap[step.action] || step.action }}
                  </span>
                </td>

                <td
                  class="min-w-50 border-r border-(--color-border)/50 px-3 py-1.5 text-(--color-text-main)"
                >
                  {{ step.description }}
                </td>

                <td
                  v-for="node in allNodes"
                  :key="node"
                  class="border-r border-(--color-border)/50 px-2 py-1.5 text-center last:border-0"
                >
                  <div
                    class="inline-flex min-w-14 flex-col items-center justify-center rounded px-1.5 py-1"
                    :class="
                      isNodeUpdated(index, node)
                        ? 'border border-(--color-success)/20 bg-(--color-success)/10'
                        : ''
                    "
                  >
                    <div
                      class="flex items-center gap-1 font-semibold"
                      :class="
                        isNodeUpdated(index, node)
                          ? 'text-(--color-success)'
                          : 'text-(--color-text-main)'
                      "
                    >
                      <HugeiconsIcon
                        v-if="step.pi[node] === 999"
                        :icon="Infinity01Icon"
                        :size="14"
                        class="text-(--color-text-muted)"
                      />
                      <span v-else>{{ step.pi[node] }}</span>
                    </div>

                    <div
                      v-if="step.p && step.p[node]"
                      class="mt-0.5 text-xs"
                      :class="
                        isNodeUpdated(index, node)
                          ? 'text-(--color-success)/70'
                          : 'text-(--color-text-muted)'
                      "
                    >
                      p: {{ step.p[node] }}
                    </div>
                    <div
                      v-else-if="step.pi[node] !== 999"
                      class="mt-0.5 text-xs text-transparent select-none"
                    >
                      p: null
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="finalSummary"
          class="flex flex-col gap-1.5 rounded-lg border border-(--color-border) bg-(--color-bg-panel) p-3"
        >
          <h4 class="text-xs font-bold tracking-wide text-(--color-text-main) uppercase">
            Kết quả thuật toán
          </h4>

          <div v-if="finalSummary.found" class="flex flex-col gap-1">
            <div class="flex items-center gap-2 text-sm text-(--color-text-main)">
              <span class="font-medium">Tổng chi phí:</span>
              <span class="font-bold">{{ finalSummary.cost }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-(--color-text-main)">
              <span class="font-medium">Đường đi ngắn nhất:</span>
              <span class="font-bold">{{ finalSummary.path }}</span>
            </div>
          </div>

          <div v-else class="text-sm font-medium text-(--color-danger)">
            {{ finalSummary.message }}
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-(--color-border) bg-(--color-bg-app)/50 p-8 text-center text-sm text-(--color-text-muted) italic"
      >
        <p>Chưa có dữ liệu tiến trình thực thi.</p>
        <p class="text-xs not-italic opacity-70">
          Bấm Play hoặc Next trên bảng điều khiển để kích hoạt giải thuật.
        </p>
      </div>
    </div>

    <el-dialog
      v-model="isModalOpen"
      title="Bảng theo dõi thuật toán"
      width="60%"
      top="10vh"
      destroy-on-close
      class="custom-history-modal"
    >
      <div v-if="algoHistory.length > 0" class="flex flex-col gap-4">
        <div
          class="custom-scrollbar relative max-h-[50vh] w-full overflow-x-auto overflow-y-auto rounded-md border border-(--color-border) bg-(--color-bg-panel)"
        >
          <table class="w-full min-w-fit text-left text-sm">
            <thead class="sticky top-0 z-20 border-b border-(--color-border) bg-(--color-bg-app)">
              <tr class="text-(--color-text-muted)">
                <th
                  class="w-14 border-r border-(--color-border)/50 px-3 py-2 text-center font-semibold"
                >
                  Bước
                </th>
                <th class="min-w-26 border-r border-(--color-border)/50 px-3 py-2 font-semibold">
                  Hành động
                </th>
                <th class="min-w-50 border-r border-(--color-border)/50 px-3 py-2 font-semibold">
                  Chi tiết thao tác
                </th>
                <th
                  v-for="node in allNodes"
                  :key="'modal-header-' + node"
                  class="border-r border-(--color-border)/50 px-3 py-2 text-center font-semibold whitespace-nowrap last:border-0"
                >
                  Đỉnh {{ node }}
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-(--color-border)/50">
              <tr
                v-for="(step, index) in algoHistory"
                :key="'modal-' + step.step"
                class="transition-colors"
                :class="
                  index === currentStepIndex
                    ? 'bg-(--color-primary-light)'
                    : 'hover:bg-(--color-bg-panel-hover)'
                "
              >
                <td
                  class="border-r border-(--color-border)/50 px-3 py-2 text-center font-mono font-medium text-(--color-text-muted)"
                >
                  {{ step.step }}
                </td>
                <td
                  class="border-r border-(--color-border)/50 px-3 py-2 font-medium text-(--color-text-main)"
                >
                  {{ actionMap[step.action] || step.action }}
                </td>
                <td class="border-r border-(--color-border)/50 px-3 py-2 text-(--color-text-main)">
                  {{ step.description }}
                </td>
                <td
                  v-for="node in allNodes"
                  :key="'modal-node-' + node"
                  class="border-r border-(--color-border)/50 px-2 py-1.5 text-center last:border-0"
                >
                  <div
                    class="inline-flex min-w-15 flex-col items-center justify-center rounded px-2 py-1"
                    :class="
                      isNodeUpdated(index, node)
                        ? 'border border-(--color-success)/20 bg-(--color-success)/10'
                        : ''
                    "
                  >
                    <div
                      class="flex items-center gap-1 font-semibold"
                      :class="
                        isNodeUpdated(index, node)
                          ? 'text-(--color-success)'
                          : 'text-(--color-text-main)'
                      "
                    >
                      <HugeiconsIcon
                        v-if="step.pi[node] === 999"
                        :icon="Infinity01Icon"
                        :size="16"
                        class="text-(--color-text-muted)"
                      />
                      <span v-else>{{ step.pi[node] }}</span>
                    </div>
                    <div
                      v-if="step.p && step.p[node]"
                      class="mt-0.5 text-xs"
                      :class="
                        isNodeUpdated(index, node)
                          ? 'text-(--color-success)/70'
                          : 'text-(--color-text-muted)'
                      "
                    >
                      p: {{ step.p[node] }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="finalSummary"
          class="shrink-0 rounded-lg border border-(--color-border) bg-(--color-bg-app) p-3"
        >
          <h4 class="mb-1.5 text-xs font-bold tracking-wide text-(--color-text-main) uppercase">
            Kết quả
          </h4>
          <div v-if="finalSummary.found" class="flex flex-col gap-1">
            <div class="text-sm text-(--color-text-main)">
              <span class="font-medium">Tổng chi phí:</span>
              <span class="ml-1 font-bold">{{ finalSummary.cost }}</span>
            </div>
            <div class="text-sm text-(--color-text-main)">
              <span class="font-medium">Đường đi ngắn nhất:</span>
              <span class="ml-1 font-bold">{{ finalSummary.path }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-(--color-border) bg-(--color-bg-app)/50 p-8 text-center text-sm text-(--color-text-muted) italic"
      >
        <p>Chưa có dữ liệu tiến trình thực thi.</p>
        <p class="text-xs not-italic opacity-70">
          Bấm Play hoặc Next trên bảng điều khiển để kích hoạt giải thuật.
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { ElDivider, ElTooltip, ElDialog } from 'element-plus';
import { HugeiconsIcon } from '@hugeicons/vue';
import { FullScreenIcon, Infinity01Icon } from '@hugeicons/core-free-icons';
import { AlgorithmStep } from '../../core/algorithms/types/AlgorithmStep';
import TitleComponent from '../TitleComponent.vue';
import { useAlgorithmStore } from '../../stores/useAlgorithmStore';

const algoStore = useAlgorithmStore();

const { algoHistory, currentStepIndex } = defineProps<{
  algoHistory: AlgorithmStep[];
  currentStepIndex: number;
  formatRow: (row: any) => string;
}>();

const historyContainerRef = ref<HTMLElement | null>(null);
const isModalOpen = ref(false);

const actionMap: Record<string, string> = {
  INIT: 'Khởi tạo',
  VISIT: 'Chọn đỉnh',
  CHECK: 'Kiểm tra',
  RELAX: 'Cập nhật',
  COMPLETE: 'Hoàn tất'
};

const allNodes = computed(() => {
  if (algoHistory.length === 0) return [];
  return Object.keys(algoHistory[0].pi);
});

const isNodeUpdated = (index: number, node: string) => {
  if (index === 0) {
    return algoHistory[index].pi[node] !== 999;
  }
  const prevStep = algoHistory[index - 1];
  const currStep = algoHistory[index];

  return (
    prevStep.pi[node] !== currStep.pi[node] ||
    (prevStep.p && currStep.p && prevStep.p[node] !== currStep.p[node])
  );
};

const finalSummary = computed(() => {
  if (algoHistory.length === 0) return null;
  const lastStep = algoHistory[algoHistory.length - 1];

  if (lastStep.action !== 'COMPLETE') return null;

  const cost = algoStore.finalCost;
  const path = algoStore.finalPath;

  if (cost === undefined || cost === 999 || path.length === 0) {
    return { found: false, message: 'Không tìm thấy đường đi tới đỉnh đích!' };
  }

  return {
    found: true,
    cost: cost,
    path: path.join(' \u2192 ')
  };
});

watch(
  () => currentStepIndex,
  async () => {
    await nextTick();

    if (historyContainerRef.value) {
      historyContainerRef.value.scrollTo({
        top: historyContainerRef.value.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--color-bg-app);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border-input);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

:deep(.custom-history-modal) {
  border-radius: 6px !important;
  overflow: hidden;
}
:deep(.custom-history-modal .el-dialog__header) {
  background-color: var(--color-bg-panel);
  margin-right: 0;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}
:deep(.custom-history-modal .el-dialog__title) {
  font-weight: 600;
  color: var(--color-text-main);
}
:deep(.custom-history-modal .el-dialog__body) {
  padding: 20px;
  background-color: var(--color-bg-panel);
}
</style>
