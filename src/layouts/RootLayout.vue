<template>
  <div class="flex h-screen w-screen flex-col overflow-y-auto bg-(--color-bg-app)">
    <TitleBar />
    <div class="flex h-full w-full gap-2 p-2">
      <SideMenu />

      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import SideMenu from '../components/SideMenu.vue';
import TitleBar from '../components/TitleBar.vue';
</script>
