<template>
  <div class="panel relative flex h-full max-w-full flex-col overflow-hidden">
    <!-- control menu -->
    <div
      class="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-(--color-border) bg-white/10 p-2 shadow-sm backdrop-blur-md"
    >
      <ElTooltip placement="bottom" content="Tải ảnh đồ thị" :show-after="200">
        <button
          @click="downloadGraph"
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
        >
          <HugeiconsIcon :icon="ImageDownload02Icon" :size="18" />
        </button>
      </ElTooltip>

      <ElTooltip placement="bottom" content="Đặt lại" :show-after="200">
        <button
          @click="reloadView"
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
        >
          <HugeiconsIcon :icon="KeyframeAlignCenterIcon" :size="18" />
        </button>
      </ElTooltip>

      <div class="mx-2 h-6 w-px bg-(--color-border)"></div>

      <div class="flex items-center gap-1">
        <ElTooltip placement="bottom" content="Bước trước đó" :show-after="200">
          <button
            @click="handlePrevStep"
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
          >
            <HugeiconsIcon :icon="ArrowLeft01Icon" :size="18" />
          </button>
        </ElTooltip>

        <ElTooltip
          placement="bottom"
          :content="isPlaying ? 'Tạm dừng' : 'Chạy thuật toán'"
          :show-after="200"
        >
          <button
            @click="togglePlay"
            class="mx-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-(--color-primary) text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <HugeiconsIcon :icon="isPlaying ? PauseIcon : PlayIcon" :size="20" />
          </button>
        </ElTooltip>

        <ElTooltip placement="bottom" content="Bước tiếp theo" :show-after="200">
          <button
            @click="handleNextStep"
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-primary)"
          >
            <HugeiconsIcon :icon="ArrowRight01Icon" :size="18" />
          </button>
        </ElTooltip>
      </div>

      <div class="mx-2 h-6 w-px bg-(--color-border)"></div>

      <div class="flex w-32 items-center gap-3 px-2">
        <span class="text-xs font-medium text-(--color-text-muted)">1x</span>
        <el-slider
          v-model="algorithmSpeed"
          :min="1"
          :max="5"
          :step="1"
          :show-tooltip="false"
          size="small"
        />
        <span class="text-xs font-medium text-(--color-text-muted)">5x</span>
      </div>
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
  ArrowRight01Icon
} from '@hugeicons/core-free-icons';
import { ElTooltip, ElSlider } from 'element-plus';
import { Graph } from '../core/Graph';

const containerRef = ref<HTMLElement | null>(null);
const graphManager = new Graph();

onMounted(() => {
  if (containerRef.value) {
    graphManager.init(containerRef.value);
  }
});

const reloadView = () => {
  graphManager.getInstance()?.fit();
};

const downloadGraph = () => {
  const uri = graphManager.getInstance()?.png({
    bg: '#ffffff',
    full: true,
    scale: 2
  });

  if (uri) {
    const link = document.createElement('a');
    link.href = uri;
    link.download = 'lexigraph.png';
    link.click();
  }
};

const isPlaying = ref(false);
const algorithmSpeed = ref(3);

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    console.log(algorithmSpeed.value);
  }
};

const handleNextStep = () => {
  isPlaying.value = false;
};

const handlePrevStep = () => {
  isPlaying.value = false;
};

defineExpose({ graphManager });
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
