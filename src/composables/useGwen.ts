import { ref, shallowRef } from 'vue';
import { CreateWebWorkerMLCEngine, WebWorkerMLCEngine } from '@mlc-ai/web-llm';

const engine = shallowRef<WebWorkerMLCEngine | null>(null);
const isLoaded = ref(false);
const loadProgress = ref('');
const loadPercentage = ref(0);
const selectedModel = 'Qwen3-1.7B-q4f32_1-MLC';

export function useGwen() {
  const initGwen = async () => {
    if (isLoaded.value) return;

    try {
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
      loadProgress.value = 'Lỗi hệ thống WebGPU. Vui lòng thử lại.';
      throw error;
    }
  };

  const reloadModel = () => {
    engine.value?.reload(selectedModel);
  };

  return { engine, isLoaded, loadProgress, loadPercentage, initGwen, reloadModel };
}
