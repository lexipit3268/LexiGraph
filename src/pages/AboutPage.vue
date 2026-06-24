<template>
  <div
    class="flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-(--color-bg-app) p-4 transition-all duration-300 md:p-6 lg:p-8"
  >
    <div class="grid h-full min-h-0 w-full grid-cols-5 grid-rows-2 gap-5">
      <div
        class="relative col-span-3 row-span-1 flex min-h-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-(--color-border) bg-[#1c1c1c] shadow-sm"
      >
        <div class="absolute inset-0 z-0">
          <DotField
            :dot-radius="2.5"
            :dot-spacing="15"
            :bulge-strength="80"
            :glow-radius="250"
            :cursor-radius="300"
            :cursor-force="0.15"
            :bulge-only="true"
            gradient-from="#0353a4"
            gradient-to="#3b82f6"
            glow-color="rgba(3, 83, 164, 0.08)"
          />
        </div>
        <div class="absolute inset-0 z-0">
          <ColorBends
            :colors="['#0353a4', '#3b82f6', '#38bdf8']"
            :rotation="45"
            :speed="0.3"
            :scale="2"
            :frequency="1"
            :noise="0.15"
            :parallax="0.5"
            :iterations="2"
            :intensity="1.3"
            :mouse-influence="0.4"
            :band-width="2"
            :fade-top="0.75"
            transparent
          />
        </div>
        <div class="pointer-events-none relative z-10 text-center">
          <div class="flex items-center justify-center gap-4">
            <img
              src="/graph.ico"
              alt="LexiGraph Logo"
              class="h-16 w-16 opacity-90 drop-shadow-md"
            />
            <h1 class="text-6xl font-bold tracking-tight text-white drop-shadow-sm lg:text-5xl">
              LexiGraph
            </h1>
          </div>
          <p class="mt-3 text-sm font-semibold tracking-widest text-white uppercase">
            Trực quan hóa đồ thị & Tìm đường đi ngắn nhất
          </p>
        </div>
      </div>

      <div class="col-span-2 row-span-1 min-h-0">
        <BorderGlow
          class="h-full w-full p-0.5 shadow-sm! transition-all duration-150"
          :edge-sensitivity="15"
          glow-color="211 96 33"
          background-color="var(--color-bg-panel)"
          :border-radius="8"
          :glow-radius="60"
          :glow-intensity="1"
          :cone-spread="30"
          :animated="true"
          :colors="['#0353a4', '#3b82f6', '#38bdf8']"
        >
          <SpotlightCard
            class="flex! h-full! flex-col! rounded-xs border-none! p-6!"
            spotlight-color="#38bdf890"
          >
            <div class="flex flex-1 items-center gap-6">
              <div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg">
                <img src="../asdas" alt="" />
              </div>
              <div class="flex-1">
                <h4 class="text-2xl font-bold text-(--color-text-main)">Nguyễn Phước Lộc</h4>
                <div
                  class="mt-1 inline-block rounded-full bg-(--color-primary-light) px-3 py-1 text-xs font-bold text-(--color-primary)"
                ></div>
                <p class="mt-3 text-sm text-(--color-text-muted) italic">I'm..i'm Ironman</p>
              </div>
            </div>

            <ElDivider class="my-6!" />

            <div>
              <h3
                class="mb-4 text-[10px] font-bold tracking-widest text-(--color-text-muted) uppercase"
              >
                Techstack
              </h3>
              <div class="flex flex-wrap gap-2">
                <div
                  class="flex items-center gap-1.5 rounded border border-(--color-border) bg-(--color-bg-app) px-2.5 py-1 text-[11px] font-semibold text-(--color-text-main)"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-[#42b883]"></span> Vue.js
                </div>
                <div
                  class="flex items-center gap-1.5 rounded border border-(--color-border) bg-(--color-bg-app) px-2.5 py-1 text-[11px] font-semibold text-(--color-text-main)"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-[#38bdf8]"></span> Tailwind
                </div>
                <div
                  class="flex items-center gap-1.5 rounded border border-(--color-border) bg-(--color-bg-app) px-2.5 py-1 text-[11px] font-semibold text-(--color-text-main)"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-[#3178c6]"></span> TypeScript
                </div>
                <div
                  class="flex items-center gap-1.5 rounded border border-(--color-border) bg-(--color-bg-app) px-2.5 py-1 text-[11px] font-semibold text-(--color-text-main)"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-[#f26724]"></span> Cytoscape
                </div>
                <div
                  class="flex items-center gap-1.5 rounded border border-(--color-border) bg-(--color-bg-app) px-2.5 py-1 text-[11px] font-semibold text-(--color-text-main)"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-[#3c873a]"></span> Node.js
                </div>
              </div>
            </div>
          </SpotlightCard>
        </BorderGlow>
      </div>

      <div class="col-span-2 row-span-1 min-h-0">
        <BorderGlow
          class="h-full w-full p-4! shadow-sm! transition-all duration-150"
          :edge-sensitivity="15"
          glow-color="211 96 33"
          background-color="var(--color-bg-app)"
          :border-radius="8"
          :glow-radius="60"
          :glow-intensity="1"
          :cone-spread="30"
          :animated="true"
          :colors="['#0353a4', '#3b82f6', '#38bdf8']"
        >
          <div class="h-full w-full overflow-hidden rounded-lg">
            <GraphView
              ref="demoGraphRef"
              :isMainGraph="true"
              class="border-none! bg-transparent!"
            />
          </div>
        </BorderGlow>
      </div>

      <div class="col-span-3 row-span-1 min-h-0">
        <BorderGlow
          class="h-full w-full shadow-sm! transition-all duration-150"
          :edge-sensitivity="15"
          glow-color="211 96 33"
          background-color="var(--color-bg-panel)"
          :border-radius="8"
          :glow-radius="60"
          :glow-intensity="1"
          :cone-spread="30"
          :animated="true"
          :colors="['#0353a4', '#3b82f6', '#38bdf8']"
        >
          <div class="flex h-full flex-col justify-between">
            <div class="px-6 py-4">
              <h3 class="text-xs font-bold tracking-widest text-(--color-text-muted) uppercase">
                Tổng quan ứng dụng
              </h3>
            </div>
            <ElDivider class="m-0! w-full" />

            <div class="min-h-0 flex-1 overflow-y-scroll px-8 py-4">
              <div class="space-y-3 text-base text-(--color-text-muted)">
                <p class="text-lg text-(--color-text-main)">
                  LexiGraph là phần mềm trực quan hóa đồ thị và mô phỏng thuật toán tìm đường đi
                  ngắn nhất trên đồ thị. Đây là dự án cá nhân nhằm hỗ trợ người dùng học tập và làm
                  việc với đồ thị.
                </p>
                <p>
                  <strong class="text-(--color-text-main)">Về giao diện: </strong>Phần mềm cung cấp
                  một giao diện hiện đại và tối ưu, mọi thứ đều được thiết kế tỉ mỉ nhằm mang lại
                  cho người dùng một trải nghiệm toàn diện. Người dùng có thể tùy chỉnh giao diện
                  theo ý muốn, từ giao diện của đồ thị đến giao diện của ứng dụng.
                </p>
                <p>
                  <strong class="text-(--color-text-main)">Về chức năng: </strong> Ứng dụng cho phép
                  người dùng tạo đồ thị bằng nhiều cách, từ nhập tay từng đỉnh/cạnh cho đến nhập
                  bằng file và vẽ bằng tay. Người dùng có thể tương tác với đồ thị và chạy các thuật
                  toán tìm đường đi trên đồ thị, đồng thời theo dõi từng bước chạy của thuật toán
                  một cách trực quan cụ thể. Mọi thắc mắc về ứng dụng sẽ được trợ lý Gwen giải đáp
                  ngay khi người dùng cần.
                </p>
              </div>
            </div>

            <div class="my-4">
              <div class="px-8 py-2">
                <span class="text-sm font-bold text-(--color-text-main) uppercase"
                  >Công nghệ sử dụng</span
                >
              </div>
              <Vue3Marquee
                :duration="20"
                :clone="true"
                class="mask-fade overflow-hidden py-2.5"
                :pause-on-hover="true"
              >
                <div class="mx-8 saturate-0 transition-all duration-400 hover:saturate-100">
                  <ElTooltip effect="light" content="VueJS">
                    <img src="../assets/vue.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 saturate-0 transition-all duration-400 hover:saturate-100">
                  <ElTooltip effect="light" content="TailwindCSS">
                    <img src="../assets/tailwindcss.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 saturate-0 transition-all duration-400 hover:saturate-100">
                  <ElTooltip effect="light" content="Cytoscape">
                    <img src="../assets/cytoscape.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div
                  class="mx-8 rounded-full bg-slate-700 saturate-0 transition-all duration-400 hover:saturate-100"
                >
                  <ElTooltip effect="light" content="Electron">
                    <img src="../assets/electron.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 saturate-0 transition-all duration-400 hover:saturate-100">
                  <ElTooltip effect="light" content="ElementPlus">
                    <img src="../assets/elementplus.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 saturate-0 transition-all duration-400 hover:saturate-100">
                  <ElTooltip effect="light" content="TypeScript">
                    <img src="../assets/typescript.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 saturate-0 transition-all duration-400 hover:saturate-100">
                  <ElTooltip effect="light" content="Qwen Model">
                    <img src="../assets/qwen.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
              </Vue3Marquee>
            </div>
          </div>
        </BorderGlow>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import DotField from '../components/vuebits/DotField.vue';
import BorderGlow from '../components/vuebits/BorderGlow.vue';
import GraphView from '../components/GraphView/GraphView.vue';
import { Vue3Marquee } from 'vue3-marquee';
import { ElDivider, ElTooltip } from 'element-plus';
import SpotlightCard from '../components/vuebits/SpotlightCard.vue';
import ColorBends from '../components/vuebits/ColorBends.vue';

const demoGraphRef = ref<InstanceType<typeof GraphView> | null>(null);

onMounted(async () => {
  await nextTick();

  setTimeout(() => {
    if (demoGraphRef.value) {
      const cy = demoGraphRef.value.graphManager.getInstance();
      if (cy) {
        cy.add([
          { data: { id: '0', label: '0' }, position: { x: 150, y: 150 } },

          { data: { id: '1', label: '1' }, position: { x: 150, y: 50 } },
          { data: { id: '2', label: '2' }, position: { x: 236, y: 100 } },
          { data: { id: '3', label: '3' }, position: { x: 236, y: 200 } },
          { data: { id: '4', label: '4' }, position: { x: 150, y: 250 } },
          { data: { id: '5', label: '5' }, position: { x: 64, y: 200 } },
          { data: { id: '6', label: '6' }, position: { x: 64, y: 100 } },

          { data: { id: 'e1', source: '1', target: '2' } },
          { data: { id: 'e2', source: '2', target: '3' } },
          { data: { id: 'e3', source: '3', target: '4' } },
          { data: { id: 'e4', source: '4', target: '5' } },
          { data: { id: 'e5', source: '5', target: '6' } },
          { data: { id: 'e6', source: '6', target: '1' } },

          { data: { id: 'c1', source: '0', target: '1' } },
          { data: { id: 'c3', source: '0', target: '3' } },
          { data: { id: 'c5', source: '0', target: '5' } }
        ]);

        cy.fit('', 70);
      }
    }
  }, 100);
});
</script>

<style scoped>
:deep(.border-glow-wrapper) {
  border-radius: 8px;
}
.mask-fade {
  mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
}
</style>
