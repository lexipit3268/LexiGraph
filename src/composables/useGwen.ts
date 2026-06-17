import { ref, shallowRef } from 'vue';
import { CreateWebWorkerMLCEngine, WebWorkerMLCEngine } from '@mlc-ai/web-llm';

const engine = shallowRef<WebWorkerMLCEngine | null>(null);
const isLoaded = ref(false);
const loadProgress = ref('');
const loadPercentage = ref(0);

export function useGwen() {
  const initGwen = async () => {
    if (isLoaded.value) return;

    try {
      const selectedModel = 'Qwen2.5-3B-Instruct-q4f32_1-MLC';

      const worker = new Worker(new URL('../utils/gwen.worker.ts', import.meta.url), {
        type: 'module'
      });

      engine.value = await CreateWebWorkerMLCEngine(worker, selectedModel, {
        initProgressCallback: progress => {
          loadProgress.value = progress.text;
          loadPercentage.value = Math.round(progress.progress * 100);
        }
      });

      isLoaded.value = true;
    } catch (error) {
      console.error('Lỗi khởi tạo Gwen:', error);
      loadProgress.value = 'Lỗi hệ thống WebGPU. Vui lòng thử lại.';
    }
  };

  return { engine, isLoaded, loadProgress, loadPercentage, initGwen };
}
