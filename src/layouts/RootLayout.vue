<template>
  <div class="flex h-screen w-screen flex-col overflow-hidden bg-(--color-bg-app)">
    <TitleBar />
    <RouterView />
  </div>
</template>
<script setup lang="ts">
import TitleBar from '../components/TitleBar.vue';
</script>
