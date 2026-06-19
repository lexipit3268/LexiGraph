<template>
  <el-dialog
    v-model="isVisible"
    :title="isMainGraph ? 'Thông tin chi tiết' : 'Chi tiết Cây đường đi'"
    width="70%"
    top="5vh"
    destroy-on-close
    @opened="handleModalOpened"
  >
    <div class="flex h-180 w-full gap-4">
      <div class="relative flex-1 overflow-hidden rounded-md border border-(--color-border)">
        <div class="absolute top-4 right-4 z-10 flex gap-2">
          <ElTooltip :show-after="100" placement="bottom" content="Đặt lại góc nhìn">
            <button
              @click="modalGraphManager.getInstance()?.fit('', 20)"
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-(--color-border) bg-white text-(--color-text-muted) shadow-sm transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
            >
              <HugeiconsIcon :icon="KeyframeAlignCenterIcon" :size="16" />
            </button>
          </ElTooltip>
        </div>

        <div
          v-if="!isMainGraph && !hasSubGraphData"
          class="absolute inset-0 z-20 flex h-full w-full items-center justify-center"
        >
          <el-empty description="Không có dữ liệu đồ thị" />
        </div>

        <div
          ref="modalContainerRef"
          class="absolute top-0 left-0 h-full w-full transition-opacity duration-300"
          :class="{ 'pointer-events-none opacity-0': !isMainGraph && !hasSubGraphData }"
        ></div>
      </div>

      <div
        v-if="isMainGraph"
        class="flex w-100 shrink-0 flex-col gap-4 rounded-md border border-(--color-border) bg-(--color-bg-app) p-4"
      >
        <h3 class="text-sm font-bold text-(--color-text-muted) uppercase">THÔNG TIN ĐỒ THỊ</h3>
        <ElDivider class="m-0!" />

        <div class="flex flex-col gap-3 text-sm text-(--color-text-muted)">
          <div class="flex items-center justify-between">
            <span>Số lượng đỉnh:</span>
            <span class="font-bold text-(--color-primary)">{{ graphMetadata.v }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Số lượng cung:</span>
            <span class="font-bold text-(--color-primary)">{{ graphMetadata.e }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Mật độ liên kết:</span>
            <span class="font-bold text-(--color-primary)">{{ graphMetadata.density }}%</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Miền liên thông:</span>
            <span class="font-bold text-(--color-primary)">{{
              graphMetadata.componentsCount
            }}</span>
          </div>
        </div>
        <ElDivider class="m-0!" />
        <h3 class="text-sm font-bold text-(--color-text-muted) uppercase">Bậc của đỉnh</h3>

        <div class="custom-scrollbar flex-1 overflow-y-auto">
          <table class="w-full border-collapse text-left text-sm">
            <thead
              class="sticky top-0 z-10 bg-(--color-bg-app) shadow-[0_1px_0_0_var(--color-border)]"
            >
              <tr class="text-(--color-text-muted)">
                <th class="px-2 py-3 font-semibold">Đỉnh</th>
                <template
                  v-if="detailedNodes.length > 0 && typeof detailedNodes[0].degreeInfo === 'object'"
                >
                  <th class="px-2 py-3 font-semibold">Bậc vào</th>
                  <th class="px-2 py-3 font-semibold">Bậc ra</th>
                </template>
                <template v-else>
                  <th class="px-2 py-3 font-semibold">Bậc</th>
                </template>
                <th class="px-2 py-3 font-semibold">Đỉnh kề</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-(--color-border)">
              <tr
                v-for="node in detailedNodes"
                :key="node.id"
                class="transition-colors hover:bg-(--color-secondary-hover)"
              >
                <td class="px-4 py-3 text-(--color-text-main)">{{ node.label }}</td>
                <template v-if="typeof node.degreeInfo === 'object'">
                  <td class="px-4 py-3 text-(--color-text-main)">{{ node.degreeInfo.inDegree }}</td>
                  <td class="px-4 py-3 text-(--color-text-main)">
                    {{ node.degreeInfo.outDegree }}
                  </td>
                </template>
                <template v-else>
                  <td class="px-4 py-3 text-(--color-text-main)">{{ node.degreeInfo }}</td>
                </template>
                <td class="px-4 py-3 text-(--color-text-main)">
                  {{ node.neighbors.map(n => n.target).join(', ') || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { KeyframeAlignCenterIcon } from '@hugeicons/core-free-icons';
import { ElTooltip, ElDialog, ElEmpty, ElDivider } from 'element-plus';
import { Graph } from '../../core/Graph';

const props = defineProps({
  isMainGraph: { type: Boolean, default: false },
  hasSubGraphData: { type: Boolean, default: true },
  sourceGraphManager: { type: Object, required: true }
});

const isVisible = ref(false);
const modalContainerRef = ref<HTMLElement | null>(null);
const modalGraphManager = new Graph();
const graphMetadata = ref({ v: 0, e: 0, density: '0.0', componentsCount: 0 });

interface DetailedNode {
  id: string;
  label: string;
  degreeInfo: number | { inDegree: number; outDegree: number; sumDegree: number };
  neighbors: { target: string; weight: number; edgeId: string }[];
}

const detailedNodes = ref<DetailedNode[]>([]);

const open = () => {
  if (props.isMainGraph) {
    graphMetadata.value = props.sourceGraphManager.getGraphMetadata();
  }
  isVisible.value = true;
};

const handleModalOpened = async () => {
  await nextTick();

  if (modalContainerRef.value) {
    const config = props.sourceGraphManager.getConfig();
    const modalIsDirected = props.isMainGraph ? config.isDirected : true;

    modalGraphManager.init(
      modalContainerRef.value,
      modalIsDirected,
      config.theme,
      config.edgeLineStyle,
      config.edgeCurveStyle
    );

    modalGraphManager.getInstance()?.elements().remove();
    const currentData = props.sourceGraphManager.exportElementsJsonString();

    if (currentData && currentData !== '[]') {
      try {
        const elements = JSON.parse(currentData);
        modalGraphManager.getInstance()?.add(elements);

        if (props.isMainGraph) {
          const components = props.sourceGraphManager.getConnectedComponents();
          modalGraphManager.clearAllStatus();
          modalGraphManager.generateCompoundGroups(components);

          const nodes = props.sourceGraphManager.getNodes();
          const adjList = props.sourceGraphManager.getAdjacencyList();

          detailedNodes.value = nodes.map((node: any) => ({
            id: node.id,
            label: node.label,
            degreeInfo: props.sourceGraphManager.getNodeDegree(node.id) as any,
            neighbors: adjList[node.id] || []
          }));
        }
      } catch (error) {
        console.error('Lỗi parse Modal:', error);
      }
    }

    modalGraphManager.getInstance()?.fit('', 20);
  }
};

defineExpose({ open });
</script>

<style scoped>
:deep(.el-dialog__body) {
  padding: 10px 20px 20px 20px;
}
</style>
