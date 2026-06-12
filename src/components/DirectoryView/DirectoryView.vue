<template>
  <div
    class="panel flex h-full w-80 shrink-0 flex-col overflow-hidden border-l border-(--color-border) bg-(--color-bg-panel)"
  >
    <div class="shrink-0">
      <TitleComponent title="Quản lý tệp tin" class="mx-4! my-4" />
      <el-divider class="m-0!" />
    </div>

    <div class="flex flex-1 flex-col overflow-hidden p-3">
      <div
        ref="dropzoneRef"
        :data-files="files.length > 0 || undefined"
        class="relative flex flex-1 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-(--color-border-input) bg-(--color-bg-app) p-6 transition-all duration-200 hover:border-(--color-primary) hover:bg-(--color-primary-light) data-files:hidden data-[dragging=true]:border-(--color-primary) data-[dragging=true]:bg-(--color-primary-light)"
        @click="openFileDialog"
      >
        <input ref="inputRef" type="file" multiple class="hidden" />
        <div class="flex flex-col items-center justify-center text-center">
          <div
            class="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-bg-panel) shadow-sm"
          >
            <HugeiconsIcon :icon="CloudUploadIcon" class="text-(--color-text-muted)" size="20" />
          </div>
          <p class="mb-1 text-sm font-semibold text-(--color-text-main)">Kéo thả hoặc click</p>
          <p class="text-[11px] text-(--color-text-muted)">
            Hỗ trợ .txt, .json (Tối đa {{ maxFiles }} tệp)
          </p>

          <button
            @click.stop="openFileDialog"
            class="secondary-btn group my-4 flex items-center justify-center gap-4"
          >
            <HugeiconsIcon
              :icon="Upload01Icon"
              size="16"
              class="transition-all duration-200 group-hover:-translate-y-0.5"
            />
            Duyệt tệp tin
          </button>
        </div>
      </div>

      <div v-if="files.length > 0" class="flex flex-1 flex-col overflow-hidden">
        <div class="mb-3 flex shrink-0 items-center justify-between">
          <h3 class="text-sm font-medium text-(--color-text-muted)">
            Đã tải lên ({{ files.length }})
          </h3>
          <div class="flex gap-2">
            <el-tooltip content="Thêm tệp" placement="top" :show-after="200">
              <button
                @click="openFileDialog"
                class="cursor-pointer rounded p-1 text-(--color-text-muted) transition-colors hover:bg-(--color-bg-app) hover:text-(--color-primary)"
              >
                <HugeiconsIcon :icon="Upload01Icon" size="18" />
              </button>
            </el-tooltip>

            <el-tooltip content="Xóa tất cả" placement="top" :show-after="200">
              <button
                @click="clearFiles"
                class="cursor-pointer rounded p-1 text-(--color-text-muted) transition-colors hover:bg-(--color-bg-app) hover:text-(--color-danger)"
              >
                <HugeiconsIcon :icon="Delete01Icon" size="18" />
              </button>
            </el-tooltip>
          </div>
        </div>

        <div class="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
          <div
            v-for="file in files"
            :key="file.id"
            class="group flex items-center justify-between rounded-lg border border-(--color-border) bg-(--color-bg-app) p-2.5 transition-all hover:border-(--color-primary-light)"
          >
            <div class="flex items-center gap-3 overflow-hidden">
              <HugeiconsIcon
                :icon="File02Icon"
                size="24"
                class="shrink-0 text-(--color-text-muted)"
              />
              <div class="flex flex-col overflow-hidden">
                <span
                  class="truncate text-xs font-medium text-(--color-text-main)"
                  :title="file.name"
                >
                  {{ file.name }}
                </span>
                <span class="text-[10px] text-(--color-text-muted)">
                  {{ formatBytes(file.size) }}
                </span>
              </div>
            </div>

            <div
              class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <el-tooltip content="Nạp đồ thị" placement="top" :show-after="200">
                <button
                  @click="handleLoadGraph(file)"
                  class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-stone-300 hover:text-(--color-primary)"
                >
                  <HugeiconsIcon :icon="ArrowBigRightDashIcon" size="14" />
                </button>
              </el-tooltip>

              <el-tooltip content="Xóa tệp" placement="top" :show-after="200">
                <button
                  @click="removeFile(file.id)"
                  class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--color-text-muted) transition-colors hover:bg-stone-300 hover:text-(--color-danger)"
                >
                  <HugeiconsIcon :icon="Delete01Icon" size="14" />
                </button>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>

      <div v-if="errors.length > 0" class="mt-2 text-xs text-(--color-danger)">
        {{ errors[0] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  CloudUploadIcon,
  File02Icon,
  Delete01Icon,
  Upload01Icon,
  ArrowBigRightDashIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ElTooltip, ElDivider } from 'element-plus';
import TitleComponent from '../TitleComponent.vue';

const maxFiles = 10;
const formatBytes = (bytes: number) => (bytes / 1024).toFixed(1) + ' KB';

const dropzoneRef = ref(null);
const inputRef = ref(null);
const errors = ref([]);

const files = ref([{ id: '1', name: 'dijkstra_testaaaaaaaaaaaa.txt', size: 1024 }]);

const openFileDialog = () => {};

const clearFiles = () => {
  files.value = [];
};

const removeFile = (id: string) => {
  files.value = files.value.filter(f => f.id !== id);
};

const handleLoadGraph = (file: any) => {
  console.log(file.name);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}
</style>
