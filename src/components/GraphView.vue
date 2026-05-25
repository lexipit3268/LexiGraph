<template>
  <div ref="graphContainer" class="h-full w-full bg-white"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Graph } from '../core/Graph';

const graphContainer = ref<HTMLElement | null>(null);

const graphManager = new Graph();

onMounted(() => {
  if (graphContainer.value) {
    graphManager.init(graphContainer.value);
  }
});

defineExpose({ graphManager });
</script>
