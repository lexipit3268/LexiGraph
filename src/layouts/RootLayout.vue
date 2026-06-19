<template>
  <div class="flex h-screen w-screen flex-col overflow-y-hidden bg-(--color-bg-app)">
    <TitleBar />

    <div class="flex h-full max-h-[calc(100%-3rem)] w-full overflow-hidden">
      <SideMenu :isChatOpen="showChatPanel" @toggle-ai-chat="showChatPanel = !showChatPanel" />

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -ml-80"
        enter-to-class="opacity-100 ml-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 ml-0"
        leave-to-class="opacity-0 -ml-80"
      >
        <KeepAlive>
          <GwenChat v-if="showChatPanel" @close="showChatPanel = false" />
        </KeepAlive>
      </Transition>

      <div class="relative flex-1 overflow-hidden bg-(--color-bg-app)">
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component"></component>
          </KeepAlive>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SideMenu from '../components/SideMenu.vue';
import TitleBar from '../components/TitleBar.vue';
import GwenChat from '../components/GwenChat/GwenChat.vue';

const showChatPanel = ref(false);
</script>
