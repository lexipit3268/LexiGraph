<template>
  <div class="flex w-80 shrink-0 flex-col border-r border-(--color-border) bg-(--color-bg-panel)">
    <div class="flex h-12 items-center justify-between border-b border-(--color-border) px-4">
      <span class="text-xs font-bold text-(--color-text-main) uppercase"> Gwen </span>
      <div class="flex items-center gap-1">
        <button
          v-if="isLoaded"
          @click="handleRestartGwen"
          title="Khởi động lại Gwen"
          class="hidden h-6 w-6 cursor-pointer items-center justify-center rounded-md text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-text-main)"
        >
          <HugeiconsIcon :icon="ReloadIcon" :size="20" />
        </button>

        <button
          @click="emit('close')"
          class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-(--color-text-muted) transition-colors hover:bg-(--color-bg-panel-hover) hover:text-(--color-text-main)"
        >
          <HugeiconsIcon :icon="Cancel01Icon" />
        </button>
      </div>
    </div>
    <GwenMessage
      :messages="messages"
      :readyToResponse="readyToResponse"
      :isLoaded="isLoaded"
      :loadPercentage="loadPercentage"
      :loadProgress="loadProgress"
    />

    <GwenInput @send="handleUserMessage" :isDisabled="readyToResponse || !isLoaded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Cancel01Icon, ReloadIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import GwenMessage from './GwenMessage.vue';
import GwenInput from './GwenInput.vue';
import { useGwen } from '../../composables/useGwen.ts';
import { SystemPromt } from '../../constants/systemPromt.ts';
import type { GwenMsg } from '../../types/GwenMsg.ts';
import { getGraphContextString } from '../../utils/graphContext.ts';

const emit = defineEmits(['close']);

const { engine, isLoaded, loadProgress, loadPercentage, initGwen, reloadModel } = useGwen();

const readyToResponse = ref(false);
const messages = ref<GwenMsg[]>([]);

const handleRestartGwen = async () => {
  reloadModel();
  readyToResponse.value = false;
  messages.value = [];

  messages.value.push({
    role: 'gwen',
    content: '🔄 Đang dọn dẹp bộ nhớ và khởi động lại hệ thống. Fen đợi tui xíu nha...'
  });

  try {
    await initGwen();
    messages.value = [];
    messages.value.push({
      role: 'gwen',
      content: '✨ Khởi động lại thành công! Tui có thể giúp gì tiếp theo?'
    });
  } catch (error) {
    console.error('Lỗi khi khởi động lại:', error);
    messages.value.push({
      role: 'gwen',
      content: '❌ Khởi động lại thất bại. Vui lòng kiểm tra lại đường truyền mạng nhé!'
    });
  }
};

const handleUserMessage = async (text: string) => {
  if (!isLoaded.value || !engine.value) return;

  messages.value.push({ role: 'user', content: text });
  readyToResponse.value = true;

  const graphContext = getGraphContextString();

  const chatHistory = [
    {
      role: 'system',
      content: SystemPromt
    },
    ...messages.value.map((msg, index) => {
      if (index === messages.value.length - 1 && msg.role === 'user') {
        return {
          role: 'user',
          content: `${graphContext}\n\n[User Question]: ${msg.content}`
        };
      }
      return {
        role: msg.role === 'gwen' ? 'assistant' : 'user',
        content: msg.content
      };
    })
  ];

  messages.value.push({ role: 'gwen', content: '' });
  const currentGwenIndex = messages.value.length - 1;

  try {
    const chunks = await engine.value.chat.completions.create({
      messages: chatHistory as any,
      stream: true,
      max_tokens: 2048,
      temperature: 0.6
    });

    let isFirstChunk = true;

    for await (const chunk of chunks) {
      if (isFirstChunk) {
        readyToResponse.value = false;
        isFirstChunk = false;
      }

      const delta = chunk.choices[0]?.delta?.content || '';
      if (currentGwenIndex !== -1) {
        messages.value[currentGwenIndex].content += delta;
      }
    }
  } catch (error) {
    readyToResponse.value = false;
    if (messages.value[currentGwenIndex]) {
      messages.value[currentGwenIndex].content =
        'Xin lỗi, tôi đang gặp trục trặc trong quá trình xử lý!';
    }
    reloadModel();
    console.error(error);
  }
};

onMounted(async () => {
  if (!isLoaded.value) {
    messages.value.push({
      role: 'gwen',
      content:
        'Xin chào! Tui đang bắt đầu khởi tạo. Ở lần chạy đầu tiên, hãy đảm bảo máy tính của bạn có kết nối mạng Internet ổn định nhé...'
    });

    try {
      await initGwen();
      messages.value = [];
      messages.value.push({
        role: 'gwen',
        content:
          '✨ Hệ thống đã sẵn sàng! Tui là Gwen, nữ trợ lý chuyên nghiệp trên ứng dụng LexiGraph. Tui có thể giúp gì cho bạn?'
      });
    } catch (error: any) {
      console.error('Lỗi khi tải mô hình:', error);

      messages.value.push({
        role: 'gwen',
        content:
          'Tải dữ liệu thất bại 😭 Dường như máy tính đang không có mạng hoặc máy chủ từ chối kết nối. Vui lòng kiểm tra lại Internet nhé.'
      });
    }
  } else {
    if (messages.value.length === 0) {
      messages.value.push({
        role: 'gwen',
        content: 'Tui đã trở lại! Bạn cần hỗ trợ gì tiếp theo?'
      });
    }
  }
});
</script>
