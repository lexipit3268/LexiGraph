<template>
  <div
    class="h-12 w-full flex items-center justify-between bg-slate-800 text-slate-300 select-none drag-area z-50"
  >
    <div class="flex items-center pl-4 text-sm font-semibold tracking-wide text-blue-400">
      LexiGraph
    </div>

    <div class="flex h-full no-drag text-xs font-mono">
      <button
        @click="minimize"
        class="h-full w-12 hover:bg-slate-700 transition-colors flex items-center justify-center outline-none"
      >
        <span>—</span>
      </button>

      <button
        @click="maximize"
        class="h-full w-12 hover:bg-slate-700 transition-colors flex items-center justify-center outline-none"
      >
        <span>❑</span>
      </button>

      <button
        @click="close"
        class="h-full w-12 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center outline-none text-sm"
      >
        <span>✕</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const minimize = () => {
  if (window.electronAPI) window.electronAPI.controlWindow('minimize');
};

const maximize = () => {
  if (window.electronAPI) window.electronAPI.controlWindow('maximize');
};

const close = () => {
  if (window.electronAPI) window.electronAPI.controlWindow('close');
};
</script>

<style scoped>
.drag-area {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag;
}
</style>
