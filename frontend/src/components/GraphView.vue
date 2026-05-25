<template>
  <div class="panel relative h-full w-full overflow-hidden">
    <div class="panel absolute top-4 right-4 z-10 flex items-center gap-1 p-1 shadow-sm">
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
    </div>

    <div ref="containerRef" class="absolute inset-0 h-full w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ImageDownload02Icon, KeyframeAlignCenterIcon } from '@hugeicons/core-free-icons';
import { ElTooltip } from 'element-plus';
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

defineExpose({ graphManager });
</script>
