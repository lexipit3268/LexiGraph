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
        <div class="pointer-events-none relative z-1 text-center">
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
          <p class="mt-3 text-sm font-semibold text-white uppercase">
            Trực quan hóa đồ thị & Tìm đường đi ngắn nhất
          </p>
        </div>
      </div>

      <div class="col-span-1 row-span-1 min-h-0">
        <BorderGlow
          class="h-full w-full p-0.5 shadow-sm! transition-all duration-150"
          :edge-sensitivity="15"
          glow-color="211 96 33"
          background-color="var(--color-bg-panel)"
          :border-radius="14"
          :glow-radius="60"
          :glow-intensity="1"
          :cone-spread="10"
          :animated="true"
          :colors="['#0353a4', '#3b82f6', '#38bdf8']"
        >
          <div class="flex! h-full! flex-col! overflow-hidden rounded-xs border-none! p-2!">
            <div class="flex min-h-0 w-full flex-1 items-center gap-6">
              <div
                class="relative h-full w-full shrink-0 overflow-hidden rounded-lg bg-(--color-bg-panel)"
              >
                <img
                  src="https://avatars.githubusercontent.com/u/62460969?v=8"
                  alt=""
                  loading="lazy"
                  class="absolute inset-0 h-full w-full object-cover"
                />

                <!-- blur layerrrrr -->
                <div
                  class="pointer-events-none absolute inset-0 z-0 mask-[linear-gradient(to_top,black_20%,transparent_50%)]"
                >
                  <img
                    src="https://avatars.githubusercontent.com/u/62460969?v=8"
                    alt=""
                    class="absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
                  />
                </div>

                <div
                  class="pointer-events-none absolute inset-x-0 -bottom-10 z-0 h-2/3 bg-linear-to-t from-(--color-bg-panel) via-(--color-bg-panel)/10 to-transparent"
                ></div>

                <div
                  class="absolute bottom-4 left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center"
                >
                  <div class="mb-4 flex flex-col items-center justify-center gap-1 text-center">
                    <p class="text-xl font-bold text-white drop-shadow-sm">
                      {{ authorInformation.name }}
                    </p>
                    <p class="text-xs font-semibold text-white uppercase drop-shadow-sm">
                      {{ authorInformation.title }}
                    </p>
                  </div>

                  <div
                    class="flex w-fit items-center justify-center overflow-hidden rounded-full bg-(--color-secondary)/60 text-(--color-text-muted) shadow-md"
                  >
                    <div
                      class="group relative h-11 w-11 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:w-30 hover:bg-(--color-secondary-hover)/60"
                    >
                      <a
                        class="relative flex h-full w-full items-center justify-center p-3"
                        target="_blank"
                        href="https://www.facebook.com/LEXIPIT3268/"
                      >
                        <HugeiconsIcon
                          :icon="Facebook02Icon"
                          :size="18"
                          class="transition-all duration-150 group-hover:translate-y-full group-hover:opacity-0"
                        />
                        <span
                          class="absolute top-1/2 left-1/2 w-max -translate-x-1/2 translate-y-full text-center text-sm font-medium opacity-0 transition-all duration-300 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:opacity-100"
                          >Facebook</span
                        >
                      </a>
                    </div>

                    <div
                      class="group relative h-11 w-11 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:w-30 hover:bg-(--color-secondary-hover)/60"
                    >
                      <a
                        class="relative flex h-full w-full items-center justify-center p-3"
                        target="_blank"
                        href="https://www.youtube.com/@lexipit3268"
                      >
                        <HugeiconsIcon
                          :icon="YoutubeIcon"
                          :size="18"
                          class="transition-all duration-150 group-hover:translate-y-full group-hover:opacity-0"
                        />
                        <span
                          class="absolute top-1/2 left-1/2 w-max -translate-x-1/2 translate-y-full text-center text-sm font-medium opacity-0 transition-all duration-300 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:opacity-100"
                          >Youtube</span
                        >
                      </a>
                    </div>

                    <div
                      class="group relative h-11 w-11 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:w-30 hover:bg-(--color-secondary-hover)/60"
                    >
                      <a
                        class="relative flex h-full w-full items-center justify-center p-3"
                        target="_blank"
                        href="mailto:locb2303828@student.ctu.vn"
                      >
                        <HugeiconsIcon
                          :icon="Mail01Icon"
                          :size="18"
                          class="transition-all duration-150 group-hover:translate-y-full group-hover:opacity-0"
                        />
                        <span
                          class="absolute top-1/2 left-1/2 w-max -translate-x-1/2 translate-y-full text-center text-sm font-medium opacity-0 transition-all duration-300 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:opacity-100"
                          >Gmail</span
                        >
                      </a>
                    </div>

                    <div
                      class="group relative h-11 w-11 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:w-30 hover:bg-(--color-secondary-hover)/60"
                    >
                      <a
                        class="relative flex h-full w-full items-center justify-center p-3"
                        target="_blank"
                        href="https://github.com/lexipit3268"
                      >
                        <HugeiconsIcon
                          :icon="Github01Icon"
                          :size="18"
                          class="transition-all duration-150 group-hover:translate-y-full group-hover:opacity-0"
                        />
                        <span
                          class="absolute top-1/2 left-1/2 w-max -translate-x-1/2 translate-y-full text-center text-sm font-medium opacity-0 transition-all duration-300 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:opacity-100"
                          >Github</span
                        >
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>

      <div class="col-span-1 row-span-1 min-h-0">
        <BorderGlow
          class="h-full w-full p-0.5 shadow-sm! transition-all duration-150"
          :edge-sensitivity="15"
          glow-color="211 96 33"
          background-color="var(--color-bg-panel)"
          :border-radius="14"
          :glow-radius="60"
          :glow-intensity="1"
          :cone-spread="10"
          :colors="['#0353a4', '#3b82f6', '#38bdf8']"
        >
          <div
            class="bg-gradient-cus flex! h-full! flex-col! justify-between overflow-auto rounded-xl border-none! p-6!"
          >
            <div>
              <div class="mb-4 flex items-center">
                <h3 class="text-xs font-bold text-(--color-text-muted) uppercase">
                  Profile Overview
                </h3>
              </div>

              <div
                class="grid w-full grid-cols-3 divide-x divide-(--color-border) rounded-xl border border-(--color-border) bg-(--color-bg-app) py-4"
              >
                <div class="flex flex-col items-center justify-center gap-1">
                  <p class="text-3xl font-semibold text-(--color-text-main)">
                    {{ authorInformation.repos }}
                  </p>
                  <span
                    class="text-[9px] font-bold tracking-wider text-(--color-text-muted) uppercase"
                    >Repos</span
                  >
                </div>
                <div class="flex flex-col items-center justify-center gap-1">
                  <p class="text-3xl font-semibold text-(--color-text-main)">
                    {{ authorInformation.contributions }}
                  </p>
                  <span
                    class="text-[9px] font-bold tracking-wider text-(--color-text-muted) uppercase"
                    >Contributions</span
                  >
                </div>
                <div class="flex flex-col items-center justify-center gap-1">
                  <p class="text-3xl font-semibold text-(--color-text-main)">
                    {{ authorInformation.streak }}
                  </p>
                  <span
                    class="text-[9px] font-bold tracking-wider text-(--color-text-muted) uppercase"
                    >Streak</span
                  >
                </div>
              </div>
            </div>

            <div class="mt-4">
              <h3 class="mb-3 text-xs font-bold text-(--color-text-muted) uppercase">Skills</h3>

              <div class="flex flex-wrap gap-2">
                <div
                  class="flex h-8 cursor-default items-center overflow-hidden rounded bg-[#2B3A42] text-white shadow-sm transition-transform hover:scale-105"
                >
                  <div class="flex h-full items-center bg-black/20 px-2">
                    <img src="../assets/vue.svg" class="h-4 w-4" alt="Vue" />
                  </div>
                  <div class="px-2 text-[11px] font-semibold tracking-wider uppercase">Vue.js</div>
                </div>

                <div
                  class="flex h-8 cursor-default items-center overflow-hidden rounded bg-[#0F172A] text-white shadow-sm transition-transform hover:scale-105"
                >
                  <div class="flex h-full items-center bg-white/5 px-2">
                    <img src="../assets/tailwindcss.svg" class="h-4 w-4" alt="Tailwind" />
                  </div>
                  <div class="px-2 text-[11px] font-semibold tracking-wider uppercase">
                    Tailwind CSS
                  </div>
                </div>

                <div
                  class="flex h-8 cursor-default items-center overflow-hidden rounded bg-[#3178C6] text-white shadow-sm transition-transform hover:scale-105"
                >
                  <div class="flex h-full items-center bg-black/15 px-2">
                    <img src="../assets/typescript.svg" class="h-4 w-4" alt="TS" />
                  </div>
                  <div class="px-2 text-[11px] font-semibold tracking-wider uppercase">
                    TypeScript
                  </div>
                </div>

                <div
                  class="flex h-8 cursor-default items-center overflow-hidden rounded bg-[#474c48] text-white shadow-sm transition-transform hover:scale-105"
                >
                  <div class="flex h-full items-center bg-white/5 px-2">
                    <img src="../assets/Node.js.svg" class="h-4 w-4" alt="Node" />
                  </div>
                  <div class="px-2 text-[11px] font-semibold tracking-wider uppercase">Node.js</div>
                </div>

                <div
                  class="flex h-8 cursor-default items-center overflow-hidden rounded bg-[#0c3185] text-white shadow-sm transition-transform hover:scale-105"
                >
                  <div class="flex h-full items-center bg-white/5 px-2">
                    <img src="../assets/React.svg" class="h-4 w-4" alt="React" />
                  </div>
                  <div class="px-2 text-[11px] font-semibold tracking-wider uppercase">React</div>
                </div>

                <div
                  class="flex h-8 cursor-default items-center overflow-hidden rounded bg-[#001E2B] text-white shadow-sm transition-transform hover:scale-105"
                >
                  <div class="flex h-full items-center bg-white/5 px-2">
                    <img src="../assets/MongoDB.svg" class="h-4 w-4" alt="MongoDB" />
                  </div>
                  <div class="px-2 text-[11px] font-semibold tracking-wider uppercase">MongoDB</div>
                </div>

                <div
                  class="flex h-8 cursor-default items-center overflow-hidden rounded bg-[#2F3129] text-white shadow-sm transition-transform hover:scale-105"
                >
                  <div class="flex h-full items-center bg-white/5 px-2">
                    <img src="../assets/JavaScript.svg" class="h-4 w-4" alt="JS" />
                  </div>
                  <div class="px-2 text-[11px] font-semibold tracking-wider uppercase">
                    JavaScript
                  </div>
                </div>

                <div
                  class="flex h-8 cursor-default items-center overflow-hidden rounded bg-[#1572B6] text-white shadow-sm transition-transform hover:scale-105"
                >
                  <div class="flex h-full items-center bg-black/15 px-2">
                    <img src="../assets/CSS3.svg" class="h-4 w-4" alt="CSS3" />
                  </div>
                  <div class="px-2 text-[11px] font-semibold tracking-wider uppercase">CSS3</div>
                </div>

                <div
                  class="flex h-8 cursor-default items-center overflow-hidden rounded bg-[#5C2D91] text-white shadow-sm transition-transform hover:scale-105"
                >
                  <div class="flex h-full items-center bg-black/15 px-2">
                    <img src="../assets/CSharp.svg" class="h-4 w-4" alt="C#" />
                  </div>
                  <div class="px-2 text-[11px] font-semibold tracking-wider uppercase">C#</div>
                </div>
              </div>
            </div>
          </div>
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
          :cone-spread="10"
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
          :cone-spread="10"
          :colors="['#0353a4', '#3b82f6', '#38bdf8']"
        >
          <div class="flex h-full flex-col justify-between">
            <div class="px-6 py-4">
              <h3 class="text-xs font-semibold text-(--color-text-muted) uppercase">
                Tổng quan ứng dụng
              </h3>
            </div>
            <ElDivider class="m-0! w-full" />

            <div class="min-h-0 flex-1 overflow-y-auto px-8 py-4">
              <div class="flex flex-col gap-4">
                <p class="text-base leading-7 font-medium text-(--color-text-main)">
                  LexiGraph là phần mềm trực quan hóa đồ thị và mô phỏng thuật toán tìm đường đi
                  ngắn nhất trên đồ thị. Đây là dự án cá nhân nhằm hỗ trợ người dùng học tập và làm
                  việc với đồ thị.
                </p>

                <div class="flex flex-col gap-2">
                  <div class="space-y-1.5">
                    <h4 class="text-sm font-semibold text-(--color-text-main)">Về giao diện</h4>
                    <p class="text-sm leading-relaxed text-(--color-text-muted)">
                      Phần mềm cung cấp một giao diện hiện đại và tối ưu, mọi thứ đều được thiết kế
                      tỉ mỉ nhằm mang lại cho người dùng một trải nghiệm toàn diện. Người dùng có
                      thể tùy chỉnh giao diện theo ý muốn, từ giao diện của đồ thị đến giao diện của
                      ứng dụng.
                    </p>
                  </div>

                  <div class="space-y-1.5">
                    <h4 class="text-sm font-semibold text-(--color-text-main)">Về chức năng</h4>
                    <p class="text-sm leading-relaxed text-(--color-text-muted)">
                      Hỗ trợ tạo đồ thị linh hoạt (nhập tay, tải file, vẽ trực tiếp). Người dùng có
                      thể tương tác, chạy và theo dõi trực quan từng bước các thuật toán tìm đường.
                      Ngoài ra, trợ lý Gwen luôn sẵn sàng giải đáp mọi thắc mắc khi cần.
                    </p>
                  </div>
                </div>
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
                <div class="mx-8 transition-all duration-400">
                  <ElTooltip effect="light" content="VueJS">
                    <img src="../assets/vue.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 transition-all duration-400">
                  <ElTooltip effect="light" content="TailwindCSS">
                    <img src="../assets/tailwindcss.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 transition-all duration-400">
                  <ElTooltip effect="light" content="Cytoscape">
                    <img src="../assets/cytoscape.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 rounded-full bg-slate-700 transition-all duration-400">
                  <ElTooltip effect="light" content="Electron">
                    <img src="../assets/electron.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 transition-all duration-400">
                  <ElTooltip effect="light" content="ElementPlus">
                    <img src="../assets/elementplus.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 transition-all duration-400">
                  <ElTooltip effect="light" content="TypeScript">
                    <img src="../assets/typescript.svg" class="h-10" alt="" />
                  </ElTooltip>
                </div>
                <div class="mx-8 transition-all duration-400">
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
import ColorBends from '../components/vuebits/ColorBends.vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Facebook02Icon, Github01Icon, Mail01Icon, YoutubeIcon } from '@hugeicons/core-free-icons';

const demoGraphRef = ref<InstanceType<typeof GraphView> | null>(null);

const authorInformation: Record<string, string | number> = {
  name: 'Nguyễn Phước Lộc',
  title: 'Developer - Designer',
  birth: '03 - 02 - 05',
  repos: 22,
  streak: 29,
  contributions: 758
};

onMounted(async () => {
  await nextTick();

  setTimeout(() => {
    if (demoGraphRef.value) {
      const cy = demoGraphRef.value.graphManager.getInstance();
      if (cy) {
        cy.add([
          { data: { id: '0', label: '0' }, position: { x: 150, y: 150 } },

          { data: { id: '1', label: '1' }, position: { x: 150, y: 80 } },
          { data: { id: '2', label: '2' }, position: { x: 211, y: 115 } },
          { data: { id: '3', label: '3' }, position: { x: 211, y: 185 } },
          { data: { id: '4', label: '4' }, position: { x: 150, y: 220 } },
          { data: { id: '5', label: '5' }, position: { x: 89, y: 185 } },
          { data: { id: '6', label: '6' }, position: { x: 89, y: 115 } },
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

        cy.fit('', 65);
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
