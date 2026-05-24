<template>
  <div
    class="drag-area z-50 flex h-12 w-full items-center justify-between border-b border-(--color-border) bg-(--color-bg-titlebar) text-(--color-text-main) select-none"
  >
    <div class="flex items-center pl-6 text-sm font-normal tracking-wide">LexiGraph</div>

    <div class="no-drag flex h-full text-slate-500">
      <button
        @click="minimize"
        class="flex h-full w-12 items-center justify-center transition-colors outline-none hover:bg-black/5 hover:text-slate-800"
        title="Minimize"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 6H11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      </button>

      <button
        @click="maximize"
        class="flex h-full w-12 items-center justify-center transition-colors outline-none hover:bg-black/5 hover:text-slate-800"
        :title="isMaximized ? 'Restore' : 'Maximize'"
      >
        <svg
          v-if="isMaximized"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 3H9V9H3V3Z" stroke="currentColor" stroke-width="1.2" />
          <path d="M5 1H11V7" stroke="currentColor" stroke-width="1.2" />
        </svg>
        <svg
          v-else
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1.5" y="1.5" width="9" height="9" stroke="currentColor" stroke-width="1.2" />
        </svg>
      </button>

      <button
        @click="close"
        class="flex h-full w-12 items-center justify-center transition-colors outline-none hover:bg-red-500 hover:text-white"
        title="Close"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L11 11M11 1L1 11"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
          />
        </svg>
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
