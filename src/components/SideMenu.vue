<template>
  <div
    class="z-10 flex h-full w-16 flex-col items-center justify-between rounded-none! border-r border-(--color-border) bg-(--color-bg-panel) pt-4 pb-6"
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
                : 'text-(--color-text-muted) group-hover:text-(--color-text-main)'
            "
          />
        </a>
      </RouterLink>
    </div>

    <div class="flex w-full flex-col items-center justify-center gap-4">
      <a
        @click="$emit('toggle-ai-chat')"
        class="group relative flex h-12 w-full cursor-pointer items-center justify-center"
        title="Trợ lý Gwen"
      >
        <div
          class="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-all duration-300"
          :class="isChatOpen ? 'scale-105 shadow-md' : 'bg-transparent'"
        >
          <div
            class="absolute inset-0 transition-opacity duration-300"
            :class="isChatOpen ? 'opacity-100' : 'opacity-0'"
          >
            <Grainient
              color1="#0353a4"
              color2="#5390d9"
              color3="#48bfe3"
              :time-speed="2"
              :color-balance="0.0"
              :warp-strength="1.0"
              :warp-frequency="5.0"
              :warp-speed="2.0"
              :warp-amplitude="50.0"
              :blend-angle="0.0"
              :blend-softness="0.05"
              :rotation-amount="500.0"
              :noise-scale="2.0"
              :grain-amount="0"
              :grain-scale="2.0"
              :grain-animated="false"
              :contrast="1.5"
              :gamma="1.0"
              :saturation="1.0"
              :center-x="0.0"
              :center-y="0.0"
              :zoom="0.9"
            />
          </div>

          <HugeiconsIcon
            :icon="ArtificialIntelligence08Icon"
            :size="isChatOpen ? '24' : '32'"
            class="relative z-10 transition-colors duration-300"
            :class="
              isChatOpen
                ? 'text-white'
                : 'text-(--color-text-muted) group-hover:text-(--color-text-main)'
            "
          />
        </div>
      </a>
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
                : 'text-(--color-text-muted) group-hover:text-(--color-text-main)'
            "
          />
        </a>

        <template #dropdown>
          <el-dropdown-menu class="min-w-48">
            <el-dropdown-item
              class="pointer-events-none flex items-center justify-between gap-4 px-4! py-2!"
            >
              <div class="flex items-center gap-3">
                <HugeiconsIcon :icon="DarkModeIcon" size="18" class="text-(--color-text-muted)" />
                <span class="text-sm font-medium text-(--color-text-main)">Giao diện tối</span>
              </div>
              <el-switch
                v-model="isDark"
                size="small"
                @change="handleDarkToggle"
                class="pointer-events-auto"
              />
            </el-dropdown-item>

            <el-divider class="my-1!" />

            <el-dropdown-item command="shortcuts" class="flex items-center gap-3 px-4! py-2!">
              <HugeiconsIcon :icon="KeyboardIcon" size="18" class="text-(--color-text-muted)" />
              <span class="text-sm font-medium text-(--color-text-main)">Phím tắt</span>
            </el-dropdown-item>

            <el-dropdown-item command="about" class="flex items-center gap-3 px-4! py-2!">
              <HugeiconsIcon
                :icon="InformationCircleIcon"
                size="18"
                class="text-(--color-text-muted)"
              />
              <span class="text-sm font-medium text-(--color-text-main)">Thông tin ứng dụng</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-dialog
      v-model="isShortcutsVisible"
      title="Phím tắt & Thao tác"
      width="480px"
      destroy-on-close
      class="overflow-hidden rounded-xl!"
    >
      <div class="flex flex-col gap-6 pt-2 pb-4">
        <div class="space-y-3">
          <h3 class="text-xs font-bold tracking-wider text-(--color-text-muted) uppercase">
            Thao tác cơ bản
          </h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-normal text-(--color-text-main)">Chọn đỉnh/cạnh</span>
              <kbd class="key-cap">Click trái</kbd>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-normal text-(--color-text-main)"
                >Chỉnh sửa tên/trọng số</span
              >
              <kbd class="key-cap">Nháy đúp chuột</kbd>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-normal text-(--color-text-main)"
                >Xóa phần tử đang chọn</span
              >
              <div class="flex items-center gap-1.5">
                <kbd class="key-cap">Delete</kbd>
                <span class="text-xs text-(--color-text-muted)">hoặc</span>
                <kbd class="key-cap">Backspace</kbd>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-normal text-(--color-text-main)"
                >Hủy thao tác hiện tại</span
              >
              <kbd class="key-cap">Esc</kbd>
            </div>
          </div>
        </div>

        <el-divider class="my-0!" />

        <div class="space-y-3">
          <h3 class="text-xs font-bold tracking-wider text-(--color-text-muted) uppercase">
            Chế độ vẽ đồ thị
          </h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-normal text-(--color-text-main)">Tạo đỉnh mới</span>
              <kbd class="key-cap">Click vào vùng trống</kbd>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-normal text-(--color-text-main)">Tạo cung</span>
              <kbd class="key-cap">Kéo thả (Đỉnh ➔ Đỉnh)</kbd>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  DarkModeIcon,
  DashboardCircleEditIcon,
  Settings01Icon,
  KeyboardIcon,
  LibraryIcon,
  InformationCircleIcon,
  ArtificialIntelligence08Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ElMessage, ElDivider } from 'element-plus';
import Grainient from './vuebits/Grainient/Grainient.vue';
defineProps({
  isChatOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle-ai-chat']);

const router = useRouter();

const isMenuOpen = ref(false);
const isDark = ref(false);
const isShortcutsVisible = ref(false);

const menuItems = [
  { name: 'home-page', icon: DashboardCircleEditIcon, tooltip: 'Trang chủ' },
  { name: 'algorithm-page', icon: LibraryIcon, tooltip: 'Thuật toán' },
  { name: 'about-page', icon: InformationCircleIcon, tooltip: 'Thông tin ứng dụng' }
];

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

const handleCommand = (command: string) => {
  switch (command) {
    case 'about':
      router.push({ name: 'about-page' });
      break;
    case 'shortcuts':
      isShortcutsVisible.value = true;
      break;
  }
};

defineExpose({ isDark });
</script>

<style scoped>
:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: var(--el-fill-color-light);
  color: inherit;
}

.key-cap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  padding: 4px 8px;
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--color-text-main);
  background-color: var(--color-bg-panel-hover);
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

:deep(.el-dialog__header) {
  margin-right: 0;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 16px;
}
:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: bold;
  color: var(--color-text-main);
}
</style>
