<template>
  <div
    class="drag-area z-50 flex h-10 w-full items-center justify-between bg-slate-900 text-slate-300 select-none"
  >
    <div class="flex items-center pl-4 text-sm font-semibold tracking-wide text-blue-400">
      LexiGraph
    </div>

    <div class="no-drag flex h-full font-mono text-xs">
      <button
        @click="minimize"
        class="flex h-full w-12 items-center justify-center transition-colors outline-none hover:bg-slate-700"
      >
        <span>—</span>
      </button>

      <button
        @click="maximize"
        class="flex h-full w-12 items-center justify-center text-sm transition-colors outline-none hover:bg-slate-700"
      >
        <span v-if="isMaximized">🗗</span>
        <span v-else>❑</span>
      </button>

      <button
        @click="close"
        class="flex h-full w-12 items-center justify-center text-sm transition-colors outline-none hover:bg-red-600 hover:text-white"
      >
        <span>✕</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isMaximized = ref(false);

const minimize = () => {
  if (window.electronAPI) window.electronAPI.controlWindow('minimize');
};

const maximize = () => {
  if (window.electronAPI) window.electronAPI.controlWindow('maximize');
};

const close = () => {
  if (window.electronAPI) window.electronAPI.controlWindow('close');
};

onMounted(async () => {
  if (window.electronAPI) {
    if (window.electronAPI.getInitialStatus) {
      isMaximized.value = await window.electronAPI.getInitialStatus();
    }

    window.electronAPI.onStatusChange((status: boolean) => {
      isMaximized.value = status;
    });
  }
});
</script>

<style scoped>
.drag-area {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag;
}
</style>
