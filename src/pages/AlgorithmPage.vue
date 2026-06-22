<template>
  <div class="min-h-screen bg-(--color-bg-main)">
    <div class="relative h-50 overflow-hidden">
      <SilkBackground
        :speed="8"
        :scale="1"
        :color="'#0353a4'"
        :noise-intensity="1"
        :rotation="0"
        class="h-full w-full"
      />
      <div class="absolute inset-0 z-1 flex items-center justify-center">
        <h1 class="text-3xl font-bold tracking-wide text-white uppercase drop-shadow-lg">
          Đồ thị & Thuật toán tìm đường đi
        </h1>
      </div>
    </div>

    <div class="mx-auto flex max-w-7xl items-start gap-32 p-8">
      <div class="markdown-body flex-1 space-y-12 leading-relaxed text-(--color-text-main)">
        <section id="part-1-graph" class="scroll-mt-20">
          <h2
            class="mb-6 border-b border-(--color-border) pb-2 text-3xl font-bold text-(--color-text-main)"
          >
            1. Đồ thị và phân loại đồ thị
          </h2>
          <p class="mb-4 text-lg">
            Một đồ thị là một cấu trúc rời rạc gồm tập hợp các đỉnh và các cạnh nối giữa các đỉnh
            đó. Có thể mô tả đồ thị theo cách hình thức như sau:
          </p>

          <blockquote
            class="my-4 border-l-4 border-(--color-primary) bg-(--color-secondary) px-5 py-3 text-(--color-text-main) italic shadow-sm"
          >
            <p class="mb-2 text-xl font-bold text-(--color-primary)">G = (V, E)</p>
            <p>
              Tức là đồ thị <code class="inline-code">G</code> có tập các đỉnh là
              <code class="inline-code">V</code>, tập các cạnh là
              <code class="inline-code">E</code>. Có thể hiểu <code class="inline-code">E</code> là
              tập hợp các cặp <code class="inline-code">(u, v)</code> với
              <code class="inline-code">u</code> và <code class="inline-code">v</code> là hai đỉnh
              thuộc <code class="inline-code">V</code>.
            </p>
          </blockquote>

          <ul class="mb-8 list-disc space-y-3 pl-8 text-lg text-(--color-text-muted)">
            <li>
              <strong class="text-(--color-text-main)">Tập đỉnh (V):</strong> Là một tập hợp hữu
              hạn, không rỗng chứa các phần tử rời rạc, được ký hiệu là
              <code class="inline-code">V = {v1, v2, ..., vn}</code>. Tổng số lượng đỉnh trong một
              đồ thị được ký hiệu là <code class="inline-code">|V|</code> (hoặc n). Trong thực tiễn,
              mỗi đỉnh đại diện cho một đối tượng hoặc thực thể (ví dụ: một nút giao thông, một máy
              chủ mạng).
            </li>
            <li>
              <strong class="text-(--color-text-main)">Tập cạnh/cung (E):</strong> Là tập hợp bao
              gồm các cặp đỉnh được lấy từ tập V. Tổng số lượng cạnh/cung được ký hiệu là
              <code class="inline-code">|E|</code> (hoặc m). Tập E biểu diễn mối liên kết vật lý
              hoặc logic giữa các đỉnh.
            </li>
          </ul>

          <h3 class="mt-10 mb-6 text-2xl font-bold text-(--color-text-main)">
            Phân loại dựa vào tính chất cung
          </h3>
          <div class="mb-10 flex flex-col gap-4">
            <div class="flex flex-col items-center">
              <h4 class="mb-4 w-full text-xl font-bold text-(--color-primary)">Đồ thị vô hướng</h4>
              <div class="mb-4 h-56 w-80 overflow-hidden">
                <GraphView
                  ref="undirectedGraphRef"
                  :showToolbar="false"
                  :isMainGraph="false"
                  :hasSubGraphData="true"
                />
              </div>
              <p class="text-lg text-(--color-text-muted)">
                Mỗi phần tử trong E là một cặp đỉnh không phân biệt thứ tự. Cạnh nối đỉnh u và đỉnh
                v đồng nhất với cạnh nối đỉnh v và đỉnh u.
              </p>
            </div>

            <div class="flex flex-col items-center">
              <h4 class="mb-4 w-full text-xl font-bold text-(--color-primary)">Đồ thị có hướng</h4>
              <div class="mb-4 h-56 w-80 overflow-hidden">
                <GraphView
                  ref="directedGraphRef"
                  :showToolbar="false"
                  :isMainGraph="false"
                  :hasSubGraphData="true"
                />
              </div>
              <p class="text-lg text-(--color-text-muted)">
                Mỗi phần tử trong E là một cặp đỉnh có thứ tự, gọi là cung. Cung có hướng đi từ đỉnh
                xuất phát u đến đỉnh đích v.
              </p>
            </div>
          </div>

          <p class="mb-2 text-lg text-(--color-text-main)">
            Ngoài ra, khi xét đến chi phí di chuyển, đồ thị được mở rộng thành:
          </p>
          <ul class="mb-8 list-disc space-y-3 pl-8 text-lg text-(--color-text-muted)">
            <li>
              <strong class="text-(--color-text-main)">Đồ thị có trọng số:</strong> Mỗi cạnh hoặc
              cung nối đỉnh u và v được gán một giá trị số thực
              <code class="inline-code">w(u, v)</code> gọi là trọng số (chi phí, khoảng cách).
            </li>
          </ul>
        </section>

        <section id="part-2-path" class="scroll-mt-20">
          <h2
            class="mb-6 border-b border-(--color-border) pb-2 text-3xl font-bold text-(--color-text-main)"
          >
            2. Đường đi và chi phí
          </h2>
          <ul class="list-disc space-y-4 pl-8 text-lg text-(--color-text-muted)">
            <li>
              <strong class="text-(--color-text-main)">Đường đi:</strong> Một đường đi độ dài
              <code class="inline-code">k</code> từ đỉnh nguồn
              <code class="inline-code">S</code> đến đỉnh đích <code class="inline-code">D</code> là
              một dãy các đỉnh luân phiên <code class="inline-code">v0, v1, ..., vk</code> sao cho
              <code class="inline-code">v0 = S</code>, <code class="inline-code">vk = D</code> và
              tồn tại kết nối giữa hai đỉnh liên tiếp.
            </li>
            <li>
              <strong class="text-(--color-text-main)">Chi phí đường đi:</strong> Là tổng các trọng
              số của tất cả các cạnh/cung tạo nên đường đi đó.
            </li>
            <li>
              <strong class="text-(--color-text-main)">Đường đi ngắn nhất:</strong> Đường đi được
              coi là ngắn nhất khi có chi phí đường đi nhỏ nhất từ điểm bắt đầu đến điểm kết thúc.
            </li>
          </ul>
        </section>

        <section id="part-3-connectivity" class="scroll-mt-20">
          <h2
            class="mb-6 border-b border-(--color-border) pb-2 text-3xl font-bold text-(--color-text-main)"
          >
            3. Tính liên thông và chu trình âm
          </h2>

          <h3 class="mb-3 text-xl font-bold text-(--color-primary)">Tính liên thông</h3>
          <div class="mb-8 space-y-4 text-lg text-(--color-text-muted)">
            <p>
              <strong class="text-(--color-text-main)">Định nghĩa:</strong> Tính liên thông thể hiện
              khả năng di chuyển và kết nối giữa các phần tử trong mạng lưới đồ thị. Hai đỉnh u và v
              được gọi là liên thông với nhau nếu tồn tại ít nhất một đường đi hợp lệ nối từ u đến
              v. Một đồ thị được xem là liên thông hoàn toàn nếu mọi cặp đỉnh trong đồ thị đều có
              đường đi kết nối. Ngược lại, đồ thị sẽ bị phân rã thành nhiều cụm độc lập.
            </p>
            <p>
              <strong class="text-(--color-text-main)">Tác động đến bài toán:</strong> Đối với bài
              toán tìm đường đi, lộ trình từ đỉnh nguồn S đến đỉnh đích D chỉ có thể được thiết lập
              khi cả hai đỉnh này cùng nằm trong một thành phần liên thông. Trong trường hợp đồ thị
              bị chia cắt, bài toán không có lời giải thực tế, và khoảng cách giữa hai đỉnh cô lập
              này được quy ước về mặt toán học là dương vô cực
              <code class="inline-code">(+∞)</code>.
            </p>
          </div>
          <h3 class="mb-3 text-xl font-bold text-(--color-primary)">Miền liên thông mạnh</h3>
          <div class="mb-8 space-y-4 text-lg text-(--color-text-muted)">
            <p>
              <strong class="text-(--color-text-main)">Định nghĩa:</strong> Miền liên thông mạnh
              (Strongly Connected Components - SCC): Là tập hợp các đỉnh mà từ một đỉnh bất kỳ có
              thể đi đến tất cả các đỉnh còn lại trong cùng tập hợp.
            </p>
          </div>
          <h3 class="mb-4 text-xl font-bold text-(--color-primary)">
            Chu trình âm (Negative Cycle)
          </h3>
          <div class="">
            <div class="space-y-4">
              <p class="text-lg text-(--color-text-muted)">
                <strong class="text-(--color-text-main)">Định nghĩa:</strong> Chu trình là một tuyến
                đường khép kín, xuất phát từ một đỉnh, duyệt qua một số đỉnh trung gian và quay trở
                về đúng đỉnh xuất phát ban đầu. Chu trình âm xảy ra trong đồ thị có trọng số khi
                tổng giá trị các cạnh (hoặc cung) cấu thành nên chu trình đó mang
                <strong>giá trị nhỏ hơn 0</strong>.
              </p>
              <p class="text-lg text-(--color-text-muted)">
                <strong class="text-(--color-text-main)">Tác động đến bài toán:</strong> Sự xuất
                hiện của chu trình âm phá vỡ nguyên lý của bài toán tìm đường đi ngắn nhất. Nếu đồ
                thị tồn tại một chu trình âm và có thể đi đến được từ đỉnh nguồn, thì hệ thống thuật
                toán có thể rơi vào trạng thái lặp vô tận. Tổng chi phí sẽ liên tục giảm xuống và
                tiến dần về âm vô cực <strong>(-∞)</strong>. Do không có điểm dừng, bài toán được
                kết luận là vô nghiệm.
              </p>

              <div class="mt-4 h-72 w-full overflow-hidden rounded-xl bg-(--color-bg-panel)">
                <GraphView
                  ref="negativeCycleGraphRef"
                  :showToolbar="false"
                  :isMainGraph="false"
                  :hasSubGraphData="true"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="part-4-algorithms" class="scroll-mt-20">
          <h2
            class="mb-8 border-b border-(--color-border) pb-2 text-3xl font-bold text-(--color-text-main)"
          >
            4. Các thuật toán áp dụng
          </h2>

          <div id="algo-dijkstra" class="mb-14 scroll-mt-24">
            <h3 class="mb-5 text-2xl font-bold text-(--color-primary)">
              4.1 Thuật toán Moore-Dijkstra
            </h3>

            <h4 class="mb-2 text-lg font-bold text-(--color-text-main)">Khái niệm</h4>
            <p class="mb-4 text-lg text-(--color-text-muted)">
              Là thuật toán kinh điển và tiêu chuẩn trong khoa học máy tính dùng để tìm đường đi
              ngắn nhất từ một đỉnh nguồn (source) đến tất cả các đỉnh còn lại trong đồ thị.
            </p>

            <h4 class="mb-2 text-lg font-bold text-(--color-text-main)">Nên dùng khi nào</h4>
            <p class="mb-4 text-lg text-(--color-text-muted)">
              Áp dụng hiệu quả trên các đồ thị có hướng hoặc vô hướng nhưng
              <strong>bắt buộc trọng số của các cạnh phải không âm (w ≥ 0)</strong>.
            </p>

            <h4 class="mb-2 text-lg font-bold text-(--color-text-main)">Các bước hoạt động</h4>
            <ul class="mb-4 list-decimal space-y-2 pl-8 text-lg text-(--color-text-muted)">
              <li>
                Khởi tạo khoảng cách từ đỉnh nguồn đến chính nó bằng 0, đến các đỉnh khác bằng vô
                cực (∞). Đưa tất cả các đỉnh vào tập chưa xét.
              </li>
              <li>
                Tìm đỉnh <code class="inline-code">u</code> trong tập chưa xét có khoảng cách ngắn
                nhất hiện tại và đánh dấu đã xét.
              </li>
              <li>
                Duyệt qua tất cả láng giềng <code class="inline-code">v</code> của
                <code class="inline-code">u</code>. Nếu chi phí đi qua
                <code class="inline-code">u</code> cộng với trọng số cạnh nhỏ hơn khoảng cách hiện
                tại của <code class="inline-code">v</code>, tiến hành cập nhật lại khoảng cách.
              </li>
              <li>Lặp lại cho đến khi xét hết tất cả các đỉnh.</li>
            </ul>

            <h4 class="mb-2 text-lg font-bold text-(--color-text-main)">Độ phức tạp</h4>
            <div class="mb-4 space-y-2 text-lg text-(--color-text-muted)">
              <p>
                <strong class="text-(--color-text-main)">Time Complexity:</strong>
                O(n<sup>2</sup>) đối với cách cài đặt mảng cơ bản. Nếu sử dụng cấu trúc dữ liệu Hàng
                đợi ưu tiên (Priority Queue / Min-Heap), độ phức tạp sẽ được tối ưu xuống O(n + |En
                log n).
              </p>
              <p>
                <strong class="text-(--color-text-main)">Giải thích:</strong> Với cách cài đặt cơ
                bản, thuật toán cần lặp qua n đỉnh. Trong mỗi lần lặp, việc duyệt mảng để tìm đỉnh
                có khoảng cách nhỏ nhất tốn thời gian O(n). Do đó, tổng thời gian tìm đỉnh là
                O(n<sup>2</sup>). Việc cập nhật khoảng cách cho các cạnh lân cận mất tổng cộng O(m)
                thời gian trong suốt thuật toán. Suy ra tổng thời gian là O(n<sup>2</sup> + m) =
                O(n<sup>2</sup>).
              </p>
            </div>

            <h4 class="mb-2 text-lg font-bold text-(--color-text-main)">Mã giả</h4>
            <div class="overflow-hidden rounded-xl shadow-lg">
              <pre><code class="language-c">{{ pseudoCode.mooredijkstra }}</code></pre>
            </div>
          </div>

          <div id="algo-bellman-ford" class="mb-10 scroll-mt-24">
            <h3 class="mb-5 text-2xl font-bold text-(--color-primary)">
              4.2 Thuật toán Bellman-Ford
            </h3>

            <h4 class="mb-2 text-lg font-bold text-(--color-text-main)">Khái niệm</h4>
            <p class="mb-4 text-lg text-(--color-text-muted)">
              Là phiên bản thuật toán mạnh mẽ hơn Dijkstra, được thiết kế đặc biệt để tính toán
              khoảng cách trên đồ thị có chứa cạnh mang trọng số âm và phát hiện chu trình âm.
            </p>

            <h4 class="mb-2 text-lg font-bold text-(--color-text-main)">Nên dùng khi nào</h4>
            <p class="mb-4 text-lg text-(--color-text-muted)">
              Áp dụng cho các hệ thống có dữ liệu chi phí bị biến động dưới 0 (ví dụ: giao dịch tài
              chính bị lỗ, chênh lệch tỷ giá). Đặc biệt dùng để bắt lỗi dữ liệu đầu vào tránh treo
              hệ thống.
            </p>

            <h4 class="mb-2 text-lg font-bold text-(--color-text-main)">Các bước hoạt động</h4>
            <ul class="mb-4 list-decimal space-y-2 pl-8 text-lg text-(--color-text-muted)">
              <li>
                Khởi tạo khoảng cách từ đỉnh nguồn đến chính nó bằng 0, đến các đỉnh khác bằng vô
                cực (∞).
              </li>
              <li>
                <strong>Nới lỏng:</strong> Lặp lại <code class="inline-code">n - 1</code> lần. Mỗi
                lần duyệt qua <em>toàn bộ</em> các cạnh của đồ thị để cập nhật lại khoảng cách ngắn
                nhất.
              </li>
              <li>
                <strong>Kiểm tra lỗi:</strong> Duyệt qua toàn bộ các cạnh thêm 1 lần nữa. Nếu phát
                hiện khoảng cách vẫn tiếp tục giảm, kết luận đồ thị có chu trình âm.
              </li>
            </ul>

            <h4 class="mb-2 text-lg font-bold text-(--color-text-main)">Độ phức tạp</h4>
            <div class="mb-4 space-y-2 text-lg text-(--color-text-muted)">
              <p>
                <strong class="text-(--color-text-main)">Thời gian (Time Complexity):</strong>
                O(n × m).
              </p>
              <p>
                <strong class="text-(--color-text-main)">Giải thích:</strong> Thuật toán có một vòng
                lặp chính chạy đúng n - 1 lần. Bên trong vòng lặp này, thuật toán phải duyệt qua
                toàn bộ m cạnh của đồ thị để tiến hành nới lỏng. Thao tác kiểm tra chu trình âm ở
                cuối cùng tốn thêm O(m) thời gian. Vậy tổng thời gian vận hành là O((n - 1) × m + m)
                = O(n × m).
              </p>
            </div>

            <h4 class="mb-2 text-lg font-bold text-(--color-text-main)">Mã giả</h4>
            <div class="overflow-hidden rounded-xl shadow-lg">
              <pre><code class="language-c">{{ pseudoCode.bellmanFord }}</code></pre>
            </div>
          </div>
        </section>
      </div>

      <div class="sticky top-8 w-72 shrink-0 rounded-xl p-5">
        <h3 class="mb-4 font-bold tracking-wider text-(--color-text-muted) uppercase">Mục lục</h3>
        <el-anchor
          v-if="isReady"
          :container="containerRef"
          :offset="100"
          @click="handleClick"
          class="bg-transparent!"
        >
          <el-anchor-link href="#part-1-graph" title="1. Phân loại đồ thị" />
          <el-anchor-link href="#part-2-path" title="2. Đường đi & Chi phí" />
          <el-anchor-link href="#part-3-connectivity" title="3. Liên thông & Chu trình âm" />
          <el-anchor-link href="#part-4-algorithms" title="4. Các thuật toán áp dụng">
            <template #sub-link>
              <el-anchor-link href="#algo-dijkstra" title="Moore-Dijkstra" />
              <el-anchor-link href="#algo-bellman-ford" title="Bellman-Ford" />
            </template>
          </el-anchor-link>
        </el-anchor>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { ElAnchor, ElAnchorLink } from 'element-plus';
import SilkBackground from '../components/vuebits/SilkBackground.vue';
import GraphView from '../components/GraphView/GraphView.vue';

import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { pseudoCode } from '../constants/pseudoCode.ts';

const containerRef = ref<HTMLElement | null>(null);
const isReady = ref(false);

const undirectedGraphRef = ref<InstanceType<typeof GraphView> | null>(null);
const directedGraphRef = ref<InstanceType<typeof GraphView> | null>(null);
const negativeCycleGraphRef = ref<InstanceType<typeof GraphView> | null>(null);

onMounted(async () => {
  await nextTick();

  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block as HTMLElement);
  });

  containerRef.value = document.getElementById('app-main-container');
  if (containerRef.value) isReady.value = true;

  setTimeout(() => {
    if (undirectedGraphRef.value) {
      const cy1 = undirectedGraphRef.value.graphManager;
      if (cy1) {
        cy1.getInstance()?.add([
          { data: { id: 'u', label: 'u' }, position: { x: 50, y: 50 } },
          { data: { id: 'v', label: 'v' }, position: { x: 150, y: 50 } },
          { data: { id: 'e1', source: 'u', target: 'v' }, classes: 'undirected' }
        ]);
        cy1.getInstance()?.fit('', 30);
        cy1.updateConfig({
          isDirected: false
        });
      }
    }

    if (directedGraphRef.value) {
      const cy2 = directedGraphRef.value.graphManager.getInstance();
      if (cy2) {
        cy2.add([
          { data: { id: 'u', label: 'u' }, position: { x: 50, y: 50 } },
          { data: { id: 'v', label: 'v' }, position: { x: 150, y: 50 } },
          { data: { id: 'e2', source: 'u', target: 'v' } }
        ]);
        cy2.fit('', 30);
      }
    }

    if (negativeCycleGraphRef.value) {
      const cy3 = negativeCycleGraphRef.value.graphManager;
      if (cy3) {
        cy3
          .getInstance()
          ?.add([
            { data: { id: '1', label: '1' }, position: { x: 100, y: 80 } },
            { data: { id: '2', label: '2' }, position: { x: 50, y: 150 } },
            { data: { id: '3', label: '3' }, position: { x: 150, y: 150 } },
            { data: { id: 'e1', source: '1', target: '2', weight: 1, label: '1' } },
            { data: { id: 'e2', source: '2', target: '3', weight: 2, label: '2' } },
            { data: { id: 'e3', source: '3', target: '1', weight: -5, label: '-5' } }
          ]);
        cy3.getInstance()?.fit('', 20);
        cy3.updateConfig({
          theme: 'monochrome'
        });
      }
    }
  }, 100);
});

const handleClick = (e: MouseEvent) => {
  e.preventDefault();
};
</script>

<style scoped>
:deep(.el-anchor) {
  --el-anchor-bg-color: transparent;
}
:deep(.el-anchor__link) {
  font-size: 0.95rem;
  padding-top: 8px;
  padding-bottom: 8px;
}

.inline-code {
  background-color: var(--color-border);
  color: var(--color-text-main);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.9em;
}

pre {
  margin: 0;
  border-radius: 0.75rem;
}
</style>
