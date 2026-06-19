<template>
  <div class="m-4 mb-2 flex items-center justify-between">
    <h3 class="text-[13px] font-bold tracking-wide text-(--color-text-muted) uppercase">
      {{ title }}
    </h3>
  </div>
</template>
<script setup lang="ts">
const { title } = defineProps<{
  title: string;
}>();
</script>
