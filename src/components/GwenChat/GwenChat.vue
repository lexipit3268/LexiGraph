<template>
  <div class="flex w-80 shrink-0 flex-col border-r border-(--color-border) bg-(--color-bg-panel)">
    <div class="flex h-12 items-center justify-between border-b border-(--color-border) px-4">
      <span class="text-xs font-bold text-(--color-text-main) uppercase"> Gwen </span>
      <button
        @click="emit('close')"
        class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-text-main)"
      >
        <HugeiconsIcon :icon="Cancel01Icon" />
      </button>
    </div>

    <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <div class="flex flex-col items-start gap-1">
        <span class="ml-1 text-xs font-semibold text-(--color-text-muted)">Gwen</span>
        <div
          class="max-w-[85%] rounded-2xl rounded-tl-sm border border-(--color-border) bg-(--color-secondary) px-3 py-2 text-sm text-(--color-text-main) shadow-sm"
        >
          Xin chào! Tôi là Gwen. Bạn cần hỗ trợ gì về đồ thị hoặc thuật toán hôm nay?
        </div>
      </div>

      <div class="flex flex-col items-end gap-1">
        <span class="mr-1 text-xs font-semibold text-(--color-text-muted)">Bạn</span>
        <div
          class="max-w-[85%] rounded-2xl rounded-tr-sm bg-(--color-primary) px-3 py-2 text-sm text-white shadow-sm"
        >
          Làm sao để tìm đường đi ngắn nhất từ đỉnh A đến đỉnh F?
        </div>
      </div>

      <div class="flex flex-col items-start gap-1">
        <span class="ml-1 text-xs font-semibold text-(--color-text-muted)">Gwen</span>
        <div
          class="max-w-[85%] rounded-2xl rounded-tl-sm border border-(--color-border) bg-(--color-secondary) px-3 py-2 text-sm leading-relaxed text-(--color-text-main) shadow-sm"
        >
          Câu trả lời
        </div>
      </div>
    </div>

    <div class="border-t border-(--color-border) bg-(--color-bg-panel) p-3">
      <div
        class="flex items-center rounded-xl border border-(--color-border-input) bg-(--color-bg-app) px-3 py-2 shadow-sm transition-colors focus-within:border-(--color-primary) focus-within:bg-(--color-bg-panel)"
      >
        <input
          type="text"
          placeholder="Hỏi AI về thuật toán..."
          class="flex-1 bg-transparent text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)"
        />
        <button
          class="ml-2 text-(--color-primary) transition-opacity hover:text-(--color-primary-hover)"
        >
          <HugeiconsIcon :icon="SentIcon" size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cancel01Icon, SentIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';

const emit = defineEmits(['close']);
</script>
