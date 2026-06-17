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

    <GwenMessage :messages="messages" :isThinking="isThinking" />

    <GwenInput @send="handleUserMessage" :isThinking="isThinking" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import GwenMessage from './GwenMessage.vue';
import GwenInput from './GwenInput.vue';
import { GwenMsg } from '../../types/GwenMsg.ts';

const emit = defineEmits(['close']);

const isThinking = ref(false);
const messages = ref<GwenMsg[]>([
  {
    role: 'gwen',
    content: 'Xin chào! Tôi là Gwen. Bạn cần hỗ trợ gì về đồ thị hoặc thuật toán hôm nay?'
  }
]);

const handleUserMessage = async (text: string) => {
  messages.value.push({ role: 'user', content: text });

  isThinking.value = true;

  setTimeout(() => {
    isThinking.value = false;
    messages.value.push({
      role: 'gwen',
      content: `Đây là câu trả lời mẫu cho: **${text}**\n\n\`\`\`javascript\nconsole.log("Hello LexiGraph!");\n\`\`\``
    });
  }, 2000);
};
</script>
