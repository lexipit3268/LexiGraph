import { GraphInputException } from '../core/exceptions/GlobalException';

export interface ParsedGraphData {
  n: number;
  m: number;
  uniqueNodes: Set<string>;
  edges: { u: string; v: string; w: number; isParallel: boolean }[];
}

export const parseAndValidateGraphText = (inputText: string): ParsedGraphData => {
  const lines = inputText
    .trim()
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  if (!lines.length) throw new GraphInputException('Dữ liệu đầu vào trống!');

  const firstLine = lines[0].split(/\s+/);
  if (firstLine.length > 2)
    throw new GraphInputException('Dòng đầu chỉ được nhập số đỉnh và số cung');

  const n = parseInt(firstLine[0], 10);
  const m = parseInt(firstLine[1], 10);

  if (isNaN(n) || isNaN(m) || m <= 0 || n <= 0) {
    throw new GraphInputException('Số lượng đỉnh và cung phải là số nguyên dương');
  }
  if (n >= 386 || m >= 386) {
    throw new GraphInputException('Số đỉnh hoặc cung quá lớn, vui lòng kiểm tra lại');
  }
  if (lines.length - 1 !== m) {
    throw new GraphInputException(
      `Số cung nhập vào (${lines.length - 1}) khác với số cung khai báo (${m}).`
    );
  }

  const uniqueNodes = new Set<string>();
  const edges: { u: string; v: string; w: number; isParallel: boolean }[] = [];
  const edgePairCount = new Map<string, number>();

  let globalNodeType: 'numeric' | 'string' | null = null;
  const isNumberNode = (val: string) => /^-?\d+$/.test(val);

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/\s+/);
    if (parts.length > 3) throw new GraphInputException(`Lỗi dòng ${i + 1}: Dư dữ liệu.`);
    if (parts.length < 3) throw new GraphInputException(`Lỗi dòng ${i + 1}: Thiếu trọng số.`);

    const [u, v, wStr] = parts;
    const w = Number(wStr);

    if (isNaN(w) || !Number.isInteger(w)) {
      throw new GraphInputException(`Lỗi dòng ${i + 1}: Trọng số "${wStr}" phải là số nguyên.`);
    }

    const typeU = isNumberNode(u) ? 'numeric' : 'string';
    const typeV = isNumberNode(v) ? 'numeric' : 'string';
    if (globalNodeType === null) globalNodeType = typeU;
    if (typeU !== globalNodeType || typeV !== globalNodeType) {
      throw new GraphInputException(`Lỗi dòng ${i + 1}: Không trộn lẫn đỉnh Chữ và Số.`);
    }

    uniqueNodes.add(u);
    uniqueNodes.add(v);

    const pairKey = [u, v].sort().join('-');
    const count = (edgePairCount.get(pairKey) || 0) + 1;
    edgePairCount.set(pairKey, count);

    edges.push({ u, v, w, isParallel: count > 1 });
  }

  if (uniqueNodes.size > n) {
    throw new GraphInputException(
      `Số đỉnh thực tế (${uniqueNodes.size}) vượt quá khai báo (${n}).`
    );
  }

  return { n, m, uniqueNodes, edges };
};
