<template>
  <div ref="panelRef" class="panel relative flex h-full w-full flex-col overflow-hidden">
    <div
      v-if="isMainGraph"
      class="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-(--color-border) bg-white/10 p-1.5 shadow-sm backdrop-blur-md"
    >
      <div class="flex items-center gap-1">
        <div class="flex items-center" v-if="isHavingGraph">
          <ElTooltip :show-after="100" placement="bottom" content="Thông tin đồ thị">
            <button
              @click="toggleGraphInformation"
              class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
            >
              <HugeiconsIcon :icon="InformationCircleIcon" :size="15" />
            </button>
          </ElTooltip>
          <div class="mx-1.5 h-5 w-px bg-(--color-border)"></div>
        </div>

        <ElTooltip :show-after="100" placement="bottom" content="Tải ảnh đồ thị">
          <button
            @click="exportGraphImage"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
          >
            <HugeiconsIcon :icon="ImageDownload02Icon" :size="15" />
          </button>
        </ElTooltip>

        <ElTooltip :show-after="100" placement="bottom" content="Tải đồ thị dạng file">
          <button
            @click="exportGraphJson"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
          >
            <HugeiconsIcon :icon="FileDownloadIcon" :size="15" />
          </button>
        </ElTooltip>
      </div>
      <div class="mx-1.5 h-5 w-px bg-(--color-border)"></div>
      <template v-if="isMainGraph">
        <div class="flex items-center gap-1">
          <ElTooltip :show-after="100" placement="bottom" content="Bước trước đó">
            <button
              @click="handlePrevStep"
              class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
            >
              <HugeiconsIcon :icon="ArrowLeft01Icon" :size="15" />
            </button>
          </ElTooltip>

          <ElTooltip
            :show-after="100"
            placement="bottom"
            :content="isAnimating ? 'Tạm dừng' : 'Chạy thuật toán'"
          >
            <button
              @click="togglePlay"
              class="mx-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-(--color-primary) text-white shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <HugeiconsIcon :icon="isAnimating ? PauseIcon : PlayIcon" :size="16" />
            </button>
          </ElTooltip>

          <ElTooltip :show-after="100" placement="bottom" content="Bước tiếp theo">
            <button
              @click="handleNextStep"
              class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
            >
              <HugeiconsIcon :icon="ArrowRight01Icon" :size="15" />
            </button>
          </ElTooltip>
        </div>

        <div class="mx-1.5 h-5 w-px bg-(--color-border)"></div>

        <div class="flex w-24 items-center gap-2 px-1">
          <span class="text-[11px] font-medium text-(--color-text-muted)">1x</span>
          <el-slider
            v-model="algorithmSpeed"
            @change="val => emit('speed', val as number)"
            :min="1"
            :max="5"
            :step="1"
            :show-tooltip="false"
            size="small"
          />
          <span class="text-[11px] font-medium text-(--color-text-muted)">5x</span>
        </div>
      </template>
    </div>

    <div
      v-if="isMainGraph"
      class="absolute right-0 bottom-5 z-50 flex -translate-x-1/2 flex-col items-center gap-1 rounded-lg border border-(--color-border) bg-white/10 p-1.5 shadow-sm backdrop-blur-md"
    >
      <ElTooltip :show-after="100" placement="bottom" content="Chế độ nhập bằng chuột">
        <button
          @click="toggleDrawingMode"
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
          :class="
            isDrawingModeEnabled
              ? 'bg-(--color-secondary) text-(--color-text-active)'
              : 'text-(--color-text-muted) hover:bg-(--color-bg-app)'
          "
        >
          <HugeiconsIcon :icon="PaintBrush01Icon" :size="15" />
        </button>
      </ElTooltip>
      <ElTooltip :show-after="100" placement="left-start" content="Phóng to">
        <button
          @click="handleZoom(1)"
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
        >
          <HugeiconsIcon :icon="SearchAddIcon" :size="15" />
        </button>
      </ElTooltip>

      <ElTooltip :show-after="100" placement="left-start" content="Thu nhỏ">
        <button
          @click="handleZoom(-1)"
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
        >
          <HugeiconsIcon :icon="SearchMinusIcon" :size="15" />
        </button>
      </ElTooltip>

      <ElTooltip :show-after="100" placement="left-start" content="Đặt lại góc nhìn">
        <button
          @click="reloadView"
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
        >
          <HugeiconsIcon :icon="KeyframeAlignCenterIcon" :size="15" />
        </button>
      </ElTooltip>

      <ElTooltip :show-after="100" placement="left-start" content="Tính vật lý">
        <button
          @click="togglePhysic"
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
          :class="
            isPhysicsEnabled
              ? 'bg-(--color-secondary) text-(--color-text-active)'
              : 'text-(--color-text-muted) hover:bg-(--color-bg-app)'
          "
        >
          <HugeiconsIcon :icon="Magnet02Icon" :size="15" />
        </button>
      </ElTooltip>
    </div>

    <div v-else class="shrink-0 border-b border-(--color-border)">
      <div class="flex items-center justify-between">
        <TitleComponent title="Cây đường đi" />
        <div class="flex items-center gap-2 px-4">
          <ElTooltip :show-after="100" placement="bottom" content="Tải ảnh đồ thị">
            <button
              @click="exportGraphImage"
              class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
            >
              <HugeiconsIcon :icon="ImageDownload02Icon" :size="15" />
            </button>
          </ElTooltip>
          <ElTooltip :show-after="100" placement="bottom" content="Đặt lại góc nhìn">
            <button
              @click="reloadView"
              class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
            >
              <HugeiconsIcon :icon="KeyframeAlignCenterIcon" :size="15" />
            </button>
          </ElTooltip>
          <ElTooltip :show-after="100" placement="bottom" content="Xem chi tiết">
            <button
              @click="toggleFullscreen"
              class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
            >
              <HugeiconsIcon :icon="FullScreenIcon" :size="15" />
            </button>
          </ElTooltip>
        </div>
      </div>
    </div>

    <div class="relative min-h-0 w-full flex-1">
      <div
        v-if="isAnimating && !isMainGraph"
        class="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center overflow-hidden p-8"
      >
        <el-skeleton animated class="w-full max-w-lg overflow-hidden">
          <template #template>
            <el-skeleton-item variant="image" class="h-80! bg-amber-200! lg:w-75!" />
            <div>
              <el-skeleton-item variant="p" style="width: 50%" />
              <div style="display: flex; align-items: center; justify-items: space-between">
                <el-skeleton-item variant="text" style="margin-right: 16px" class="bg-amber-200!" />
                <el-skeleton-item variant="text" style="width: 30%" class="bg-amber-200!" />
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>

      <div
        v-else-if="!hasSubGraphData && !isMainGraph"
        class="absolute inset-0 z-20 flex h-full w-full items-center justify-center"
      >
        <el-empty description="Chưa có dữ liệu đường đi" />
      </div>

      <div
        ref="containerRef"
        class="absolute top-0 left-0 h-full w-full transition-opacity duration-300"
      ></div>
    </div>

    <el-dialog
      v-model="isModalVisible"
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
                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-(--color-border) text-(--color-text-muted) shadow-sm transition-colors hover:bg-(--color-secondary-hover) hover:text-(--color-primary)"
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
          class="flex w-64 shrink-0 flex-col gap-4 rounded-md border border-(--color-border) bg-(--color-bg-app) p-4"
        >
          <div class="border-b border-(--color-border) pb-2">
            <h3 class="text-sm font-bold text-(--color-text-main)">Thông số Đồ thị</h3>
          </div>

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
            <div class="mt-2 rounded-lg bg-(--color-primary-light) p-3 text-center">
              <span class="block text-xs font-medium text-(--color-text-muted)"
                >Miền liên thông</span
              >
              <span class="block text-xl font-black text-(--color-primary)">{{
                graphMetadata.componentsCount
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import {
  ImageDownload02Icon,
  KeyframeAlignCenterIcon,
  PlayIcon,
  PauseIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  SearchAddIcon,
  SearchMinusIcon,
  FileDownloadIcon,
  Magnet02Icon,
  FullScreenIcon,
  PaintBrush01Icon,
  InformationCircleIcon
} from '@hugeicons/core-free-icons';
import { ElTooltip, ElSlider, ElDialog, ElEmpty, ElSkeleton, ElMessage } from 'element-plus';
import { Graph } from '../core/Graph';
import { GlobalException, GraphExportException } from '../core/exceptions/GlobalException';
import { downloadFile } from '../utils/fileHelper';
import dayjs from 'dayjs';
import TitleComponent from './TitleComponent.vue';

const { isMainGraph, isAnimating, hasSubGraphData, isDrawingModeEnabled, isHavingGraph } =
  defineProps({
    isMainGraph: { type: Boolean, default: false },
    isAnimating: { type: Boolean, default: false },
    hasSubGraphData: { type: Boolean, default: true },
    isDrawingModeEnabled: { type: Boolean, default: false },
    isHavingGraph: { type: Boolean, default: false }
  });

const isPhysicsEnabled = ref(false);

const containerRef = ref<HTMLElement | null>(null);
//@ts-ignore
const panelRef = ref<HTMLElement | null>(null);
const graphManager = new Graph();

// --- STATE CHO MODAL ---
const isModalVisible = ref(false);
const modalContainerRef = ref<HTMLElement | null>(null);
const modalGraphManager = new Graph();
const graphMetadata = ref({ v: 0, e: 0, density: '0.0', componentsCount: 0 });

const handleZoom = (value: number) => {
  graphManager.zoomControl(value);
};

const reloadView = () => {
  graphManager.getInstance()?.fit('', isMainGraph ? 80 : 20);
};

const togglePhysic = () => {
  isPhysicsEnabled.value = !isPhysicsEnabled.value;
  graphManager.toggleContinuousPhysics(isPhysicsEnabled.value);
};

const toggleDrawingMode = () => {
  emit('toggle-drawing-mode');
};

const exportGraphImage = () => {
  const uri = graphManager.exportGraphBase64();
  if (!uri) throw new GraphExportException('Chưa có dữ liệu đồ thị!');
  const now = dayjs().format('DD-MM-YYYY_HH-mm-ss_SSS');
  downloadFile(uri, `LexiGraph_Image_${now}.png`, true);
};

const exportGraphJson = () => {
  const jsonString = graphManager.exportElementsJsonString();
  if (!jsonString || jsonString === '[]') {
    throw new GraphExportException('Chưa có dữ liệu đồ thị!');
  }
  const now = dayjs().format('DD-MM-YYYY_HH-mm-ss_SSS');
  downloadFile(jsonString, `LexiGraph_Data_${now}.json`);
};

const algorithmSpeed = ref(3);

const togglePlay = () => {
  if (graphManager.getInstance()?.elements().length === 0) {
    throw new GlobalException('Chưa có dữ liệu đồ thị');
  }

  if (isAnimating) {
    emit('pause');
  } else {
    emit('play');
    emit('speed', algorithmSpeed.value);
  }
};

const handleNextStep = () => {
  if (isAnimating) emit('pause');
  emit('next');
};

const handlePrevStep = () => {
  if (isAnimating) emit('pause');
  emit('previous');
};

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'previous'): void;
  (e: 'play'): void;
  (e: 'pause'): void;
  (e: 'toggle-drawing-mode'): void;
  (e: 'speed', algorithmSpeed: number): void;
}>();

const toggleFullscreen = () => {
  if (isAnimating) {
    ElMessage.warning({ message: 'Vui lòng đợi thuật toán chạy xong!', grouping: true });
    return;
  }
  isModalVisible.value = true;
};

const toggleGraphInformation = () => {
  if (isAnimating) {
    ElMessage.warning({ message: 'Vui lòng đợi thuật toán chạy xong!', grouping: true });
    return;
  }
  graphMetadata.value = graphManager.getGraphMetadata();
  isModalVisible.value = true;
};

const handleModalOpened = async () => {
  await nextTick();

  if (modalContainerRef.value) {
    modalGraphManager.init(modalContainerRef.value);

    modalGraphManager.getInstance()?.elements().remove();

    const currentData = graphManager.exportElementsJsonString();

    if (currentData && currentData !== '[]') {
      try {
        const elements = JSON.parse(currentData);
        modalGraphManager.getInstance()?.add(elements);

        if (isMainGraph) {
          const components = graphManager.getConnectedComponents();
          modalGraphManager.generateCompoundGroups(components);
        }
      } catch (error) {
        console.error('Lỗi khi render dữ liệu trong Modal:', error);
      }
    }

    modalGraphManager.getInstance()?.fit('', 20);
  }
};

onMounted(() => {
  if (containerRef.value) {
    graphManager.init(containerRef.value);
  }
});

defineExpose({ graphManager, isPhysicsEnabled });
</script>

<style scoped>
:deep(.el-slider__bar) {
  background-color: var(--color-primary);
}
:deep(.el-slider__button) {
  height: 0.8rem;
  width: 0.8rem;
  border-color: var(--color-primary);
}

:deep(.el-dialog__body) {
  padding: 10px 20px 20px 20px;
}
</style>
