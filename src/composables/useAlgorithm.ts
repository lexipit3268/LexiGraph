import { ref, nextTick, Ref } from 'vue';
import { ElMessage } from 'element-plus';
import { runMooreDijkstra } from '../core/algorithms/MooreDijkstra';
import { AlgorithmStep } from '../core/algorithms/types/AlgorithmStep';
import { AlgorithmResult } from '../core/algorithms/types/AlgorithmResult';
import { scrollToPosition } from '../utils/domHelpers';
import { GraphInputException } from '../core/exceptions/GlobalException';
import { Edge, Node } from '../core/Graph';
import { handleError } from '../utils/errorHandler';
import { useAlgorithmStore } from '../stores/useAlgorithmStore';

export function useAlgorithm(
  graphRef: Ref<any>,
  subGraphRef: Ref<any>,
  historyContainerRef: Ref<HTMLElement | null>
) {
  const algoStore = useAlgorithmStore();

  const algoGenerator = ref<Generator<AlgorithmStep, AlgorithmResult, unknown> | null>(null);
  const currentSpeedMs = ref(500);
  const playInterval = ref<ReturnType<typeof setInterval> | null>(null);

  const speedMap: Record<number, number> = { 1: 2000, 2: 1000, 3: 500, 4: 200, 5: 50 };

  const formatRow = (obj: Record<string, any>) => {
    return Object.entries(obj)
      .map(([k, v]) => `${k}: ${v === Infinity ? '∞' : (v ?? 'null')}`)
      .join(', ');
  };

  const autoScrollToBottom = () => {
    nextTick(() => {
      scrollToPosition(historyContainerRef.value);
    });
  };

  const resetAlgorithm = () => {
    handlePause();
    algoGenerator.value = null;

    algoStore.resetState();

    if (graphRef.value) {
      graphRef.value.graphManager.clearAllStatus();
    }
    if (subGraphRef.value) {
      const subCy = subGraphRef.value.graphManager.getInstance();
      if (subCy) {
        subCy.elements().remove();
      }
    }
  };

  const applyStepToGraph = (step: AlgorithmStep) => {
    const gm = graphRef.value?.graphManager;
    if (!gm) return;
    gm.clearAllStatus();
    step.visitedNodes?.forEach((id: string) => gm.setNodeStatus(id, 'visited'));
    step.processingNodes?.forEach((id: string) => gm.setNodeStatus(id, 'processing'));
    step.processingEdges?.forEach((id: string) => gm.setEdgeStatus(id, 'processing'));
  };

  // phát hiện trọng số âm ---> dùng bellman forddd
  const hasNegativeWeight = (edges: Edge[]): boolean => {
    return edges.some(edge => parseFloat(edge.weight) < 0);
  };

  const initAlgorithm = () => {
    const gm = graphRef.value?.graphManager;
    if (!gm) return false;

    const nodes: Node[] = gm.getNodes();
    const edges: Edge[] = gm.getEdges();

    if (nodes.length === 0) {
      ElMessage.warning('Đồ thị trống! Vui lòng tạo đồ thị trước.');
      return false;
    }

    if (!algoStore.startNodeId || !algoStore.endNodeId) {
      throw new GraphInputException('Vui lòng nhập đỉnh bắt đầu và kết thúc');
    }

    const isStartExist = nodes.find(node => node.id === String(algoStore.startNodeId));
    if (!isStartExist) {
      throw new GraphInputException(
        `Đỉnh bắt đầu "${algoStore.startNodeId}" không tồn tại trong đồ thị!`
      );
    }

    const isEndExist = nodes.find(node => node.id === String(algoStore.endNodeId));
    if (!isEndExist) {
      throw new GraphInputException(
        `Đỉnh kết thúc "${algoStore.endNodeId}" không tồn tại trong đồ thị!`
      );
    }

    const startNode = algoStore.startNodeId;
    const endNode = algoStore.endNodeId;

    const isNegative = hasNegativeWeight(edges);
    if (isNegative) {
      console.log(
        'Phát hiện trọng số ÂM -> Tự động chạy Bellman-Ford với START:',
        startNode,
        'END:',
        endNode
      );
      // algoGenerator.value = runBellmanFord(nodes, edges, gm.getAdjacencyList(), startNode, endNode);
      throw new GraphInputException('Đồ thị có trọng số âm. Dùng thuật toán Bellman-Ford');
    } else {
      console.log(
        'Đồ thị trọng số DƯƠNG -> Tự động chạy Moore-Dijkstra với START:',
        startNode,
        'END:',
        endNode
      );
      algoGenerator.value = runMooreDijkstra(
        nodes,
        edges,
        gm.getAdjacencyList(),
        startNode,
        endNode
      );
    }

    algoStore.algoHistory = [];
    algoStore.currentStepIndex = -1;
    return true;
  };

  const handleNextStep = () => {
    if (
      algoStore.currentStepIndex >= 0 &&
      algoStore.currentStepIndex === algoStore.algoHistory.length &&
      algoGenerator.value === null
    ) {
      resetAlgorithm();
    }

    if (!algoGenerator.value) {
      if (!initAlgorithm()) return;
    }

    if (algoStore.currentStepIndex < algoStore.algoHistory.length - 1) {
      algoStore.currentStepIndex++;
      applyStepToGraph(algoStore.algoHistory[algoStore.currentStepIndex]);
      autoScrollToBottom();
      return;
    }

    const gen = algoGenerator.value;
    if (!gen) return;
    const result = gen.next();

    if (!result.done) {
      algoStore.algoHistory.push(result.value);
      algoStore.currentStepIndex++;
      applyStepToGraph(result.value);
      autoScrollToBottom();
    } else {
      handlePause();
      algoGenerator.value = null;
      algoStore.currentStepIndex = algoStore.algoHistory.length;

      const finalResult = result.value as AlgorithmResult;

      if (finalResult.pathNodes && finalResult.pathNodes.length > 0) {
        ElMessage.success(
          `Thuật toán hoàn tất! Đường đi ngắn nhất: ${finalResult.pathNodes.join(' -> ')}`
        );
        finalResult.pathNodes.forEach(id => graphRef.value?.graphManager.setNodeStatus(id, 'path'));
        finalResult.pathEdges?.forEach(id =>
          graphRef.value?.graphManager.setEdgeStatus(id, 'path')
        );
      } else {
        finalResult.subGraphElements = [];
        ElMessage.warning('Thuật toán hoàn tất! Không tìm thấy đường đi.');
      }

      if (subGraphRef.value && finalResult.subGraphElements) {
        algoStore.subGraphElementsData = finalResult.subGraphElements;
        const subCy = subGraphRef.value.graphManager.getInstance();
        subCy?.elements().remove();
        subCy?.add(finalResult.subGraphElements);
        subCy
          ?.layout({
            name: 'cose',
            animate: true,
            padding: 20,
            idealEdgeLength: () => 10
          })
          .run();
      }
    }
  };

  const handlePrevStep = () => {
    if (algoStore.currentStepIndex > 0) {
      algoStore.currentStepIndex--;
      applyStepToGraph(algoStore.algoHistory[algoStore.currentStepIndex]);
    } else if (algoStore.currentStepIndex === 0) {
      algoStore.currentStepIndex = -1;
      graphRef.value?.graphManager.clearAllStatus();
    }
  };

  const handlePlay = () => {
    if (algoStore.currentStepIndex >= algoStore.algoHistory.length && !algoGenerator.value) {
      resetAlgorithm();
    }
    if (!algoGenerator.value) {
      try {
        if (!initAlgorithm()) {
          return;
        }
      } catch (error) {
        handlePause();
        handleError(error);
        return;
      }
    }
    if (playInterval.value) clearInterval(playInterval.value);
    playInterval.value = setInterval(handleNextStep, currentSpeedMs.value);
    algoStore.isAnimating = true;
  };

  const handlePause = () => {
    if (playInterval.value) {
      clearInterval(playInterval.value);
      playInterval.value = null;
      algoStore.isAnimating = false;
    }
  };

  const handleSpeed = (speedLevel: number) => {
    currentSpeedMs.value = speedMap[speedLevel] || 500;
    if (playInterval.value) {
      handlePause();
      handlePlay();
    }
  };

  return {
    formatRow,
    resetAlgorithm,
    handlePlay,
    handlePause,
    handleNextStep,
    handlePrevStep,
    handleSpeed
  };
}
