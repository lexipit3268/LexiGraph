<template>
  <!-- Giao diện full màn hình, xếp dọc -->
  <div class="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">
    <TitleBar />

    <div
      class="absolute inset-0 flex items-center justify-center text-slate-400"
    >
      <p>Khu vực vẽ đồ thị Cytoscape sẽ nằm ở đây</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from "./components/TitleBar.vue";
</script>

<style>
/* Reset mặc định để tránh thanh cuộn bất ngờ */
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
