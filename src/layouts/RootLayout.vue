<template>
  <div class="flex h-screen w-screen flex-col overflow-y-auto bg-(--color-bg-app)">
    <TitleBar />
    <div class="flex h-full w-full">
      <SideMenu />

      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component"></component>
        </KeepAlive>
      </RouterView>
    </div>
  </div>
</template>
<script setup lang="ts">
import { KeepAlive } from 'vue';
import SideMenu from '../components/SideMenu.vue';
import TitleBar from '../components/TitleBar.vue';
</script>
