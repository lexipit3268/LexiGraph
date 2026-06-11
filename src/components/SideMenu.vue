<template>
  <div
    class="flex h-full w-16 flex-col items-center justify-between rounded-none! border-r border-(--color-border) bg-(--color-bg-panel) pt-4 pb-6"
  >
    <div class="flex h-full w-16 flex-col items-center gap-4">
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
          class="group relative flex h-12 w-full cursor-pointer items-center justify-center"
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
            size="32"
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

    <div class="flex w-full justify-center">
      <el-dropdown trigger="click" placement="right-end" @command="handleCommand">
        <a
          class="group relative flex h-8 w-full cursor-pointer items-center justify-center"
          title="Cài đặt"
        >
          <HugeiconsIcon
            :icon="Settings01Icon"
            size="32"
            class="transition-colors duration-200"
            :class="
              isMenuOpen
                ? 'text-(--color-primary)'
                : 'text-slate-400 group-hover:text-(--color-text-main)'
            "
          />
        </a>

        <template #dropdown>
          <el-dropdown-menu class="min-w-40">
            <el-dropdown-item
              class="pointer-events-none flex items-center justify-between gap-4 px-4!"
            >
              <HugeiconsIcon :icon="DarkModeIcon" size="20" />
              <span class="text-sm font-medium text-(--color-text-main)">Giao diện tối</span>
              <el-switch
                v-model="isDark"
                size="small"
                @change="handleDarkToggle"
                class="pointer-events-auto"
              />
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { DarkModeIcon, Home01Icon, Settings01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ElMessage } from 'element-plus';

const isMenuOpen = ref(false);
const isDark = ref(false);

const menuItems = [{ name: 'home-page', icon: Home01Icon, tooltip: 'Trang chủ' }];

const handleDarkToggle = (val: boolean | string | number) => {
  if (val) {
    document.body.classList.add('dark');
    ElMessage.success({ message: 'Đã bật chế độ tối!', grouping: true });
  } else {
    document.body.classList.remove('dark');
    ElMessage.info({ message: 'Đã tắt chế độ tối!', grouping: true });
  }
};

onMounted(() => {
  isDark.value = document.body.classList.contains('dark');
});

const handleCommand = (command: string) => {};

defineExpose({ isDark });
</script>

<style scoped>
:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: var(--el-fill-color-light);
  color: inherit;
}
</style>
