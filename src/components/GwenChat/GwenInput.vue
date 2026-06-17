<template>
  <div class="border-t border-(--color-border) bg-(--color-bg-panel) p-3">
    <div
      class="flex items-end rounded-xl border border-(--color-border-input) bg-(--color-bg-app) px-3 py-2 shadow-sm transition-colors focus-within:border-(--color-primary) focus-within:bg-(--color-bg-panel)"
    >
      <textarea
        ref="inputRef"
        v-model="inputText"
        @keydown="handleKeydown"
        @input="autoResize"
        :disabled="isThinking"
        rows="1"
        placeholder="Hỏi Gwen về thuật toán..."
        class="max-h-30 flex-1 resize-none overflow-y-auto scroll-smooth bg-transparent py-1 text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted) disabled:opacity-50"
      ></textarea>

      <button
        @click="handleSend"
        :disabled="!inputText.trim() || isThinking"
        class="mb-1 ml-2 text-(--color-primary) transition-opacity hover:text-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-30"
      >
        <HugeiconsIcon :icon="SentIcon" size="20" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { SentIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';

const { isThinking } = defineProps({
  isThinking: Boolean
});

const emit = defineEmits(['send']);

const inputText = ref('');
const inputRef = ref<HTMLTextAreaElement | null>(null);

const autoResize = () => {
  if (!inputRef.value) return;
  inputRef.value.style.height = 'auto';
  inputRef.value.style.height = `${inputRef.value.scrollHeight}px`;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

const handleSend = () => {
  if (!inputText.value.trim() || isThinking) return;

  emit('send', inputText.value.trim());
  inputText.value = '';

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto';
    }
  });
};
</script>
