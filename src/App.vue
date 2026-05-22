<template>
  <div class="flex h-screen w-screen flex-col overflow-hidden bg-slate-50">
    <TitleBar />

    <div class="flex items-center justify-center text-slate-400">
      <p>Khu vực vẽ đồ thị Cytoscape sẽ nằm ở đây</p>
    </div>
    <div class="">
      <button @click="handleAlert" class="cursor-pointer bg-amber-200 p-4">alert</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import TitleBar from './components/TitleBar.vue';
const handleAlert = () => {
  ElMessage.error('lmaoooo');
};
</script>

<style></style>
