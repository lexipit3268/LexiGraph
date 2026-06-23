<template>
  <div
    class="flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-(--color-bg-app) p-4 md:p-6 lg:p-8"
  >
    <div class="grid h-full min-h-0 w-full max-w-[1700px] grid-cols-5 grid-rows-2 gap-5">
      <div
        class="relative col-span-3 row-span-1 flex min-h-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-(--color-border) bg-(--color-bg-panel) shadow-sm"
      >
        <div class="absolute inset-0 z-0">
          <DotField
            :dot-radius="2.5"
            :dot-spacing="20"
            :bulge-strength="80"
            :glow-radius="250"
            :wave-amplitude="5"
            :cursor-radius="300"
            :cursor-force="0.15"
            :bulge-only="true"
            gradient-from="#0353a4"
            gradient-to="#3b82f6"
            glow-color="rgba(3, 83, 164, 0.08)"
          />
        </div>
        <div class="pointer-events-none relative z-10 text-center">
          <img
            src="/graph.ico"
            alt="LexiGraph Logo"
            class="mx-auto mb-3 h-16 w-16 opacity-90 drop-shadow-md"
          />
          <h1
            class="text-5xl font-bold tracking-tight text-(--color-text-main) drop-shadow-sm lg:text-5xl"
          >
            LexiGraph
          </h1>
          <p class="mt-3 text-xs font-semibold tracking-widest text-(--color-text-muted) uppercase">
            Trực quan hóa đồ thị & Tìm đường đi ngắn nhất
          </p>
        </div>
      </div>

      <div class="col-span-2 row-span-1 min-h-0">
        <BorderGlow
          class="h-full w-full shadow-sm!"
          :edge-sensitivity="15"
          glow-color="211 96 33"
          background-color="var(--color-bg-panel)"
          :border-radius="8"
          :glow-radius="30"
          :glow-intensity="1"
          :cone-spread="15"
          :animated="true"
          :colors="['#0353a4', '#3b82f6', '#38bdf8']"
        >
          <div class="flex h-full flex-col p-6">
            <h3 class="mb-2 text-xs font-bold tracking-widest text-(--color-text-muted) uppercase">
              Tác giả
            </h3>
            <div class="flex flex-1 flex-col items-center justify-center text-center">
              <div
                class="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-(--color-secondary) text-2xl font-bold text-(--color-primary)"
              >
                NPL
              </div>
              <h4 class="text-xl font-bold text-(--color-text-main)">Nguyễn Phước Lộc</h4>
              <p class="mb-3 text-sm font-medium text-(--color-text-muted)">Full-stack Developer</p>
              <p class="text-sm text-(--color-text-muted) italic">
                "Đơn giản hóa những thuật toán phức tạp thông qua hình ảnh trực quan."
              </p>
            </div>
          </div>
        </BorderGlow>
      </div>

      <div class="col-span-2 row-span-1 min-h-0">
        <BorderGlow
          class="h-full w-full p-1! shadow-sm!"
          :edge-sensitivity="15"
          glow-color="211 96 33"
          background-color="var(--color-bg-app)"
          :border-radius="8"
          :glow-radius="30"
          :glow-intensity="1"
          :cone-spread="15"
          :animated="true"
          :colors="['#0353a4', '#3b82f6', '#38bdf8']"
        >
          <div class="h-full w-full overflow-hidden rounded-lg">
            <GraphView
              ref="demoGraphRef"
              :showToolbar="false"
              :isMainGraph="false"
              :hasSubGraphData="true"
            />
          </div>
        </BorderGlow>
      </div>

      <div class="col-span-3 row-span-1 min-h-0">
        <BorderGlow
          class="h-full w-full shadow-sm!"
          :edge-sensitivity="15"
          glow-color="211 96 33"
          background-color="var(--color-bg-panel)"
          :border-radius="8"
          :glow-radius="30"
          :glow-intensity="1"
          :cone-spread="15"
          :animated="true"
          :colors="['#0353a4', '#3b82f6', '#38bdf8']"
        >
          <div class="flex h-full flex-col justify-between p-6 md:p-8">
            <div class="min-h-0 flex-1 overflow-hidden pr-2">
              <h3
                class="mb-3 text-xs font-bold tracking-widest text-(--color-text-muted) uppercase"
              >
                Tổng quan ứng dụng
              </h3>

              <div class="space-y-3 text-sm text-(--color-text-muted)">
                <p class="font-medium text-(--color-text-main)">
                  <strong class="text-base">LexiGraph</strong> là phần mềm trực quan hóa đồ thị được
                  đóng gói độc lập qua ElectronJS, phục vụ công tác học tập và nghiên cứu cấu trúc
                  dữ liệu.
                </p>
                <ul class="ml-5 list-disc space-y-1.5 marker:text-(--color-text-muted)">
                  <li>
                    <strong class="text-(--color-text-main)">Không gian tương tác:</strong> Hỗ trợ
                    khởi tạo đỉnh/cung linh hoạt qua thao tác chuột, hoặc nạp trực tiếp bộ dữ liệu
                    từ văn bản.
                  </li>
                  <li>
                    <strong class="text-(--color-text-main)">Mô phỏng thuật toán:</strong> Ứng dụng
                    kỹ thuật <i>Generator Function</i> để điều khiển tiến trình chạy từng bước cho
                    giải thuật Moore-Dijkstra và Bellman-Ford.
                  </li>
                  <li>
                    <strong class="text-(--color-text-main)">Quản lý dữ liệu:</strong> Lưu trữ mô
                    hình dưới dạng JSON và hỗ trợ kết xuất không gian làm việc thành ảnh PNG.
                  </li>
                  <li>
                    <strong class="text-(--color-text-main)">Local AI Assistant:</strong> Tích hợp
                    trợ lý ảo chạy hoàn toàn cục bộ, hỗ trợ giải đáp lý thuyết và hướng dẫn thao tác
                    phần mềm.
                  </li>
                </ul>
              </div>
            </div>

            <div class="mt-4 shrink-0">
              <Vue3Marquee
                :duration="25"
                :clone="true"
                class="overflow-hidden rounded-md border border-(--color-border) bg-(--color-bg-app) py-2.5"
              >
                <div class="mx-8 text-[#42b883]">
                  <svg width="24" height="24" viewBox="0 0 256 256">
                    <path
                      fill="currentColor"
                      d="M204.8 45.4L128 178.6L51.2 45.4h-51L128 256l128-210.6z"
                    />
                    <path
                      fill="currentColor"
                      d="M168.3 45.4L128 115l-40.3-69.6h-46.7L128 196l87-150.6z"
                    />
                  </svg>
                </div>
                <div class="mx-8 text-[#9feaf9]">
                  <svg width="24" height="24" viewBox="0 0 256 256">
                    <path
                      fill="currentColor"
                      d="M127.85 106.66a21.19 21.19 0 1 0 21.19 21.19a21.19 21.19 0 0 0-21.19-21.19m78.11 39A100.86 100.86 0 0 0 220 127.85A100.67 100.86 0 0 0 127.85 36A100.86 100.86 0 0 0 36 127.85a100.86 100.86 0 0 0 54 84A100 100 0 0 0 206 145.69m-144-83a93.2 93.2 0 0 1 129.56-.56L169 88.58A66 66 0 0 0 86.85 169.9l-26.65 26.66a93.5 93.5 0 0 1 1.76-133.91Z"
                    />
                  </svg>
                </div>
                <div class="mx-8 text-[#38bdf8]">
                  <svg width="24" height="24" viewBox="0 0 256 256">
                    <path
                      fill="currentColor"
                      d="M128 64c-35 0-56 21-64 64c24-16 44-20 64-12c12 5 21 14 30 25c17 21 38 47 98 47c35 0 56-21 64-64c-24 16-44 20-64 12c-12-5-21-14-30-25c-17-21-38-47-98-47ZM64 128c-35 0-56 21-64 64c24-16 44-20 64-12c12 5 21 14 30 25c17 21 38 47 98 47c35 0 56-21 64-64c-24 16-44 20-64 12c-12-5-21-14-30-25c-17-21-38-47-98-47Z"
                    />
                  </svg>
                </div>
                <div class="mx-8 text-[#8b5cf6]">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 21a9 9 0 0 1-9-9V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4a9 9 0 0 1-9 9m-3-8l2 2l4-4"
                    />
                  </svg>
                </div>
                <div class="mx-8 text-[#3178c6]">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21 2H3v20h18zM12.92 17.51c-1.39 1-3.23 1.57-5 1.57c-2.39 0-4.14-.62-5.26-1.84l1.55-1.78c.84 1 2.05 1.48 3.51 1.48c1.37 0 2.21-.4 2.21-1.07c0-.62-.51-.95-1.92-1.32c-2.32-.6-3.84-1.37-3.84-3.3c0-1.85 1.45-3.15 3.8-3.15c1.47 0 2.8.36 3.94 1.13l-1.35 1.83c-1.12-.76-2.14-1-3.08-1c-1.15 0-1.7.4-1.7 1.01c0 .54.49.82 1.77 1.18c2.6.72 4.01 1.47 4.01 3.44c0 1.94-1.46 3.19-3.64 3.19m7.73-10.43h-4.42v11.8h-2.36V7.08H9.45V5.11h11.2z"
                    />
                  </svg>
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

        cy.fit('', 35);
        cy.userZoomingEnabled(false);
        cy.userPanningEnabled(false);
      }
    }
  }, 100);
});
</script>

<style scoped>
:deep(.border-glow-wrapper) {
  border-radius: 8px;
}
</style>
