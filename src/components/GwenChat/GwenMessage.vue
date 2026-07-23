<template>
  <div
    ref="chatContainer"
    class="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto scroll-smooth p-4"
  >
    <div v-if="!isLoaded" class="flex flex-col items-start gap-1">
      <span class="ml-1 text-xs font-semibold text-(--color-text-muted)">Gwen</span>
      <div
        class="flex w-full max-w-[85%] flex-col gap-2 rounded-2xl rounded-tl-sm border border-(--color-border) bg-(--color-bg-app) px-4 py-3"
      >
        <span class="text-xs text-(--color-text-main)">Tui đang khởi động, chờ tui xíu nhe...</span>

        <el-progress
          :percentage="loadPercentage"
          :duration="15"
          :show-text="false"
          class="w-full"
        />

        <div class="flex w-full items-center justify-between">
          <span class="w-3/4 truncate text-[10px] text-slate-400" :title="loadProgress">
            {{ loadProgress }}
          </span>
          <span class="text-[10px] font-bold text-(--color-primary)">{{ loadPercentage }}%</span>
        </div>
      </div>
    </div>

    <div
      v-for="(msg, index) in messages"
      :key="index"
      class="flex flex-col gap-1"
      :class="msg.role === 'user' ? 'items-end' : 'items-start'"
    >
      <span
        class="text-xs font-semibold text-(--color-text-muted)"
        :class="msg.role === 'user' ? 'mr-1' : 'ml-1'"
      >
        {{ msg.role === 'user' ? 'Bạn' : 'Gwen' }}
      </span>

      <div
        v-if="msg.role === 'user'"
        class="max-w-[85%] rounded-2xl rounded-tr-sm bg-(--color-primary) px-3 py-2 text-sm wrap-break-word whitespace-pre-wrap text-white"
      >
        {{ msg.content }}
      </div>

      <div
        v-else
        class="max-w-[85%] rounded-2xl rounded-tl-sm border border-(--color-border) bg-(--color-secondary) px-3 py-2 text-sm leading-relaxed wrap-break-word text-(--color-text-main)"
      >
        <div
          v-if="!msg.content"
          class="thought-title flex items-center gap-2 text-xs text-(--color-text-muted) transition-colors select-none hover:text-(--color-text-main)"
        >
          <p>Đang suy nghĩ...</p>
          <span class="loader"></span>
        </div>

        <template v-else v-for="(part, idx) in parseGwenMessage(msg.content)" :key="idx">
          <details v-if="part.type === 'thought'" class="thought-box group rounded-sm py-2">
            <summary
              class="thought-title flex cursor-pointer items-center gap-2 text-xs text-(--color-text-muted) transition-colors select-none hover:text-(--color-text-main)"
            >
              <p>Đang suy nghĩ...</p>

              <span v-if="part.isThinking" class="loader"></span>
              <span v-else>
                <hugeicons-icon :icon="Tick02Icon" :size="14" />
              </span>
            </summary>
            <div
              class="thought-content mt-2 border-l-2 border-(--color-border) pl-2 text-xs whitespace-pre-wrap text-(--color-text-muted) italic"
            >
              {{ part.content }}
            </div>
          </details>

          <div
            v-else-if="part.type === 'text' && part.content.trim()"
            class="markdown-body mt-1"
            v-html="renderMarkdown(part.content)"
          ></div>
        </template>
      </div>
    </div>

    <!-- <div v-if="readyToResponse" class="flex flex-col items-start gap-1">
      <span class="ml-1 text-xs font-semibold text-(--color-text-muted)">Gwen</span>
      <div
        class="flex min-h-9.5 max-w-[85%] items-center gap-1 rounded-2xl rounded-tl-sm border border-(--color-border) bg-(--color-secondary) px-4 py-3"
      >
        <span class="loader"></span>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
// @ts-ignore
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import type { GwenMsg } from '../../types/GwenMsg';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Tick02Icon } from '@hugeicons/core-free-icons';

const { messages, readyToResponse, isLoaded, loadPercentage, loadProgress } = defineProps<{
  messages: GwenMsg[];
  readyToResponse: boolean;
  isLoaded: boolean;
  loadPercentage: number;
  loadProgress: string;
}>();

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        );
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

const renderMarkdown = (text: string) => {
  return md.render(text);
};

const parseGwenMessage = (rawText: string) => {
  const parts: { type: 'thought' | 'text'; content: string; isThinking?: boolean }[] = [];

  const thinkStart = rawText.indexOf('<think>');
  const thinkEnd = rawText.indexOf('</think>');

  if (thinkStart !== -1) {
    if (thinkStart > 0) {
      parts.push({ type: 'text', content: rawText.substring(0, thinkStart) });
    }

    if (thinkEnd !== -1) {
      parts.push({
        type: 'thought',
        content: rawText.substring(thinkStart + 7, thinkEnd).trim(),
        isThinking: false
      });
      parts.push({
        type: 'text',
        content: rawText.substring(thinkEnd + 8).trim()
      });
    } else {
      parts.push({
        type: 'thought',
        content: rawText.substring(thinkStart + 7).trim(),
        isThinking: true
      });
    }
  } else {
    parts.push({ type: 'text', content: rawText });
  }

  return parts;
};

const chatContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

watch([() => messages.length, () => readyToResponse], () => {
  scrollToBottom();
});
</script>

<style scoped>
.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation-fill-mode: both;
  animation: bblFadInOut 1.8s infinite ease-in-out;
}
.loader {
  color: var(--color-text-muted);
  font-size: 3px;
  position: relative;
  text-indent: -9999em;
  animation-delay: -0.16s;
  margin-left: 3em;
  margin-right: 3em;
  transform: translateY(-2.5em);
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
}
.loader:before {
  left: -3.5em;
  animation-delay: -0.32s;
}
.loader:after {
  left: 3.5em;
}

@keyframes bblFadInOut {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}

.thought-box summary::-webkit-details-marker {
  display: none;
}

:deep(.markdown-body p) {
  margin-bottom: 0.5em;
}
:deep(.markdown-body p:last-child) {
  margin-bottom: 0;
}
:deep(.markdown-body strong) {
  color: var(--color-primary);
}
:deep(.markdown-body pre) {
  border-radius: 6px;
  padding: 8px;
  margin: 8px 0;
  font-size: 12px;
  overflow-x: auto;
}
:deep(.markdown-body code:not(pre code)) {
  background-color: var(--color-bg-panel-hover);
  padding: 2px 4px;
  border-radius: 4px;
  color: #e83e8c;
}
</style>
