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
        :data-dragging="isDragging"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
        @click="openFileDialog"
        class="relative flex flex-1 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-(--color-border-input) bg-(--color-bg-app) p-6 transition-all duration-200 hover:border-(--color-primary) hover:bg-(--color-primary-light) data-files:hidden data-[dragging=true]:border-(--color-primary) data-[dragging=true]:bg-(--color-primary-light)"
      >
        <input
          ref="inputRef"
          type="file"
          multiple
          accept=".txt,.json"
          @change="onFileChange"
          class="hidden"
        />
        <div class="pointer-events-none flex flex-col items-center justify-center text-center">
          <div
            class="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-bg-panel) shadow-sm transition-transform duration-200"
            :class="{ 'scale-110': isDragging }"
          >
            <HugeiconsIcon :icon="CloudUploadIcon" class="text-(--color-text-muted)" size="20" />
          </div>
          <p class="mb-1 text-sm font-semibold text-(--color-text-main)">
            {{ isDragging ? 'Thả file vào đây' : 'Kéo thả hoặc click' }}
          </p>
          <p class="text-[11px] text-(--color-text-muted)">
            Hỗ trợ .txt, .json (Tối đa {{ maxFiles }} tệp)
          </p>

          <button
            class="secondary-btn group pointer-events-auto my-4 flex items-center justify-center gap-4"
          >
            <HugeiconsIcon
              :icon="PlusSignCircleIcon"
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
                <HugeiconsIcon :icon="PlusSignCircleIcon" size="18" />
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
  PlusSignCircleIcon,
  ArrowBigRightDashIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ElTooltip, ElDivider } from 'element-plus';
import TitleComponent from '../TitleComponent.vue';

import { GraphImportException } from '../../core/exceptions/GlobalException.ts';
import { handleError } from '../../utils/errorHandler.ts';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: 'txt' | 'json';
  raw: File;
}

const emit = defineEmits<{
  (e: 'load-graph', payload: { type: 'txt' | 'json'; content: string; fileName: string }): void;
}>();

const maxFiles = 10;
const formatBytes = (bytes: number) => (bytes / 1024).toFixed(1) + ' KB';

// @ts-ignore
const dropzoneRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const errors = ref<string[]>([]);
const files = ref<UploadedFile[]>([]);

const openFileDialog = () => {
  inputRef.value?.click();
};

const processFiles = (fileList: File[]) => {
  errors.value = [];
  const validFiles = fileList.filter(f => f.name.endsWith('.txt') || f.name.endsWith('.json'));

  if (validFiles.length !== fileList.length) {
    throw new GraphImportException('Chỉ hỗ trợ nạp tệp định dạng .txt hoặc .json');
  }

  for (const file of validFiles) {
    if (files.value.length >= maxFiles) {
      throw new GraphImportException(`Chỉ được tải lên tối đa ${maxFiles} tệp.`);
    }
    if (!files.value.some(f => f.name === file.name)) {
      files.value.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.name.endsWith('.json') ? 'json' : 'txt',
        raw: file
      });
    }
  }
};

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) processFiles(Array.from(target.files));
  if (inputRef.value) inputRef.value.value = '';
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer && e.dataTransfer.files.length > 0)
    processFiles(Array.from(e.dataTransfer.files));
};

const clearFiles = () => {
  files.value = [];
  errors.value = [];
};

const removeFile = (id: string) => {
  files.value = files.value.filter(f => f.id !== id);
  errors.value = [];
};

const handleLoadGraph = async (file: UploadedFile) => {
  try {
    const content = await file.raw.text();

    if (file.type === 'json') {
      try {
        const parsedData = JSON.parse(content);
        if (!Array.isArray(parsedData)) {
          throw new GraphImportException('Tệp JSON không đúng cấu trúc đồ thị.');
        }
      } catch (e) {
        if (e instanceof GraphImportException) throw e;
        throw new GraphImportException('Nội dung file JSON bị hỏng hoặc sai cú pháp.');
      }
    } else {
      if (!content || !content.trim()) {
        throw new GraphImportException('Tệp TXT không có nội dung.');
      }
    }

    emit('load-graph', {
      type: file.type,
      content: content,
      fileName: file.name
    });
  } catch (error) {
    handleError(error);
  }
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
