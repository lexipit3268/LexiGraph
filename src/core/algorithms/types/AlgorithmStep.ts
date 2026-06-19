import { StepAction } from './StepAction';

export interface AlgorithmStep {
  step: number;
  action: StepAction;
  description: string;

  processingNodes?: string[]; // đỉnh đang xử lý
  processingEdges?: string[]; // cung đang xử lý
  visitedNodes?: string[]; // đỉnh đã xử lý xong
  visitedEdges?: string[]; // cung đỉnh đã xử lý xong, đã đi qua

  pi: Record<string, number>; // mảng khoảng cách ngắn nhất
  p: Record<string, string | null>; // mảng đỉnh liền trước
}
