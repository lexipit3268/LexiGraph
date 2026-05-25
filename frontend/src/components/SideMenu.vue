<template>
  <div class="panel flex h-full w-14 flex-col items-center gap-6 py-6">
    <RouterLink
      v-for="item in menuItems"
      :key="item.name"
      :to="{ name: item.name }"
      custom
      v-slot="{ isExactActive, isActive, href, navigate }"
    >
      <a
        :href="href"
        @click="navigate"
        class="group relative flex h-8 w-full cursor-pointer items-center justify-center"
        :title="item.tooltip"
      >
        <div
          class="absolute left-0 h-full w-1 rounded-tr-2xl rounded-br-2xl transition-colors duration-200"
          :class="
            (item.name === 'home-page' ? isExactActive : isActive)
              ? 'bg-(--color-primary)'
              : 'bg-transparent group-hover:bg-slate-200'
          "
        ></div>

        <HugeiconsIcon
          :icon="item.icon"
          size="24"
          class="transition-colors duration-200"
          :class="
            (item.name === 'home-page' ? isExactActive : isActive)
              ? 'text-(--color-primary)'
              : 'text-slate-400 group-hover:text-slate-600'
          "
        />
      </a>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { Home01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';

const menuItems = [
  { name: 'home-page', icon: Home01Icon, tooltip: 'Trang chủ' }
  // { name: 'home-page', icon: Home01Icon, tooltip: 'Trang chủ' }
];
</script>
