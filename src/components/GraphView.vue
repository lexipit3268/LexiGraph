<template>
  <div class="panel relative flex h-full max-w-full flex-col overflow-hidden">
    <div
      class="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-(--color-border) bg-white/10 p-1.5 shadow-sm backdrop-blur-md"
    >
      <div class="flex items-center gap-1">
        <ElTooltip placement="bottom" content="Phóng to">
          <button
            @click="handleZoom(1)"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
          >
            <HugeiconsIcon :icon="SearchAddIcon" :size="15" />
          </button>
        </ElTooltip>

        <ElTooltip placement="bottom" content="Thu nhỏ">
          <button
            @click="handleZoom(-1)"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
          >
            <HugeiconsIcon :icon="SearchMinusIcon" :size="15" />
          </button>
        </ElTooltip>

        <ElTooltip placement="bottom" content="Đặt lại góc nhìn">
          <button
            @click="reloadView"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
          >
            <HugeiconsIcon :icon="KeyframeAlignCenterIcon" :size="15" />
          </button>
        </ElTooltip>

        <ElTooltip v-if="isMainGraph" placement="bottom" content="Tính vật lý">
          <button
            @click="togglePhysic"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
            :class="
              isPhysicsEnabled
                ? 'bg-(--color-secondary) text-(--color-text-active)'
                : 'text-(--color-text-muted) hover:bg-(--color-bg-app)'
            "
          >
            <HugeiconsIcon :icon="Magnet02Icon" :size="15" />
          </button>
        </ElTooltip>

        <div class="mx-1.5 h-5 w-px bg-(--color-border)"></div>

        <ElTooltip placement="bottom" content="Tải ảnh đồ thị">
          <button
            @click="exportGraphImage"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
          >
            <HugeiconsIcon :icon="ImageDownload02Icon" :size="15" />
          </button>
        </ElTooltip>
        <ElTooltip placement="bottom" content="Tải đồ thị dạng file">
          <button
            @click="exportGraphJson"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
          >
            <HugeiconsIcon :icon="FileDownloadIcon" :size="15" />
          </button>
        </ElTooltip>
      </div>

      <template v-if="isMainGraph">
        <div class="mx-1.5 h-5 w-px bg-(--color-border)"></div>

        <div class="flex items-center gap-1">
          <ElTooltip placement="bottom" content="Bước trước đó">
            <button
              @click="handlePrevStep"
              class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
            >
              <HugeiconsIcon :icon="ArrowLeft01Icon" :size="15" />
            </button>
          </ElTooltip>

          <ElTooltip placement="bottom" :content="isPlaying ? 'Tạm dừng' : 'Chạy thuật toán'">
            <button
              @click="togglePlay"
              class="mx-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-(--color-primary) text-white shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <HugeiconsIcon :icon="isPlaying ? PauseIcon : PlayIcon" :size="16" />
            </button>
          </ElTooltip>

          <ElTooltip placement="bottom" content="Bước tiếp theo">
            <button
              @click="handleNextStep"
              class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
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

    <div ref="containerRef" class="absolute inset-0 h-full w-full"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
  Magnet02Icon
} from '@hugeicons/core-free-icons';
import { ElTooltip, ElSlider } from 'element-plus';
import { Graph } from '../core/Graph';
import { GlobalException, GraphExportException } from '../core/exceptions/GlobalException';
import { downloadFile } from '../utils/fileHelper';
import dayjs from 'dayjs';

const { isMainGraph } = defineProps({
  isMainGraph: {
    type: Boolean,
    default: false
  }
});
const isPhysicsEnabled = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const graphManager = new Graph();

onMounted(() => {
  if (containerRef.value) {
    graphManager.init(containerRef.value);
  }
});

const handleZoom = (value: number) => {
  graphManager.zoomControl(value);
};

const reloadView = () => {
  graphManager.getInstance()?.fit();
};

const togglePhysic = () => {
  isPhysicsEnabled.value = !isPhysicsEnabled.value;
  graphManager.toggleContinuousPhysics(isPhysicsEnabled.value);
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

const isPlaying = ref(false);
const algorithmSpeed = ref(3);

const togglePlay = () => {
  if (graphManager.getInstance()?.elements().length === 0) {
    throw new GlobalException('Chưa có dữ liệu đồ thị');
  }
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    console.log('algorithmSpeed value = ', algorithmSpeed.value);
  }
};

const handleNextStep = () => {
  isPlaying.value = false;
};

const handlePrevStep = () => {
  isPlaying.value = false;
};

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
</style>
