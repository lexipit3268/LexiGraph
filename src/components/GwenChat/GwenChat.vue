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

    <GwenMessage
      :messages="messages"
      :isThinking="isThinking"
      :isLoaded="isLoaded"
      :loadPercentage="loadPercentage"
      :loadProgress="loadProgress"
    />

    <GwenInput @send="handleUserMessage" :isDisabled="isThinking || !isLoaded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import GwenMessage from './GwenMessage.vue';
import GwenInput from './GwenInput.vue';
import { useGwen } from '../../composables/useGwen.ts';
import { SystemPromt } from '../../constants/systemPromt.ts';
import type { GwenMsg } from '../../types/GwenMsg.ts';

const emit = defineEmits(['close']);

const { engine, isLoaded, loadProgress, loadPercentage, initGwen } = useGwen();

const isThinking = ref(false);
const messages = ref<GwenMsg[]>([]);

onMounted(async () => {
  if (!isLoaded.value) {
    await initGwen();
    messages.value.push({
      role: 'gwen',
      content:
        'Hệ thống đã sẵn sàng! Tôi là Gwen, nữ trợ lý chuyên nghiệp trên ứng dụng LexiGraph. Tôi có thể giúp gì cho bạn?'
    });
  } else {
    if (messages.value.length === 0) {
      messages.value.push({
        role: 'gwen',
        content: 'Tôi đã trở lại! Bạn cần hỗ trợ gì tiếp theo?'
      });
    }
  }
});

const handleUserMessage = async (text: string) => {
  if (!isLoaded.value || !engine.value) return;

  messages.value.push({ role: 'user', content: text });
  isThinking.value = true;

  const systemPrompt = {
    role: 'system',
    content: SystemPromt
  };

  const chatHistory = [
    systemPrompt,
    ...messages.value.map(msg => ({
      role: msg.role === 'gwen' ? 'assistant' : 'user',
      content: msg.content
    }))
  ];

  try {
    const chunks = await engine.value.chat.completions.create({
      messages: chatHistory as any,
      stream: true,
      temperature: 0.6
    });

    let isFirstChunk = true;
    let currentGwenIndex = -1;

    for await (const chunk of chunks) {
      if (isFirstChunk) {
        isThinking.value = false;
        messages.value.push({ role: 'gwen', content: '' });
        currentGwenIndex = messages.value.length - 1;
        isFirstChunk = false;
      }

      const delta = chunk.choices[0]?.delta?.content || '';
      if (currentGwenIndex !== -1) {
        messages.value[currentGwenIndex].content += delta;
      }
    }
  } catch (error) {
    isThinking.value = false;
    messages.value.push({
      role: 'gwen',
      content: 'Xin lỗi, tôi đang gặp trục trặc trong quá trình xử lý!'
    });
    console.error(error);
  }
};
</script>
