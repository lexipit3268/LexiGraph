import { ref } from 'vue';
import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';

const engine = ref<MLCEngine | null>(null);
const isLoaded = ref(false);
const loadProgress = ref('');

export function useGwen() {
  const initGwen = async () => {
    if (isLoaded.value) return;

    try {
      const selectedModel = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';

      engine.value = await CreateMLCEngine(selectedModel, {
        initProgressCallback: progress => {
          loadProgress.value = progress.text;
        }
      });

      isLoaded.value = true;
    } catch (error) {
      console.error('Lỗi khởi tạo Gwen:', error);
      loadProgress.value = 'Lỗi hệ thống. Vui lòng kiểm tra lại kết nối mạng.';
    }
  };

  return { engine, isLoaded, loadProgress, initGwen };
}
