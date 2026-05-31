import cytoscape, { ElementDefinition } from 'cytoscape';
import { EdgeCurveStyle, EdgeLineStyle, graphStyles } from './graphStyles';
import { GraphConfig } from './GraphConfig';
import { GraphInputException } from './exceptions/GlobalException';
// @ts-ignore
import cola from 'cytoscape-cola';
cytoscape.use(cola);

export type Node = { id: string; label: string };
export type Edge = { id: string; source: string; target: string; weight: string };

export class Graph {
  private cy: cytoscape.Core | null = null;
  private isDirected: boolean = true;
  private currentTheme: string = 'default';
  private edgeLineStyle: EdgeLineStyle = 'solid';
  private edgeCurveStyle: EdgeCurveStyle = 'bezier';
  private activePhysicsLayout: cytoscape.Layouts | null = null;
  private nodes: Node[] | null = null;
  private edges: Edge[] | null = null;
  private cachedAdjacencyList: Record<
    string,
    { target: string; weight: number; edgeId: string }[]
  > | null = null;

  private isAdjacencyListDirty: boolean = true;

  init(
    container: HTMLElement,
    isDirected = true,
    theme = 'default',
    edgeLineStyle: EdgeLineStyle = 'solid',
    edgeCurveStyle: EdgeCurveStyle = 'bezier'
  ) {
    this.isDirected = isDirected;
    this.currentTheme = theme;
    this.edgeLineStyle = edgeLineStyle;
    this.edgeCurveStyle = edgeCurveStyle;
    this.nodes = [];
    this.edges = [];
    this.cachedAdjacencyList = {};

    this.cy = cytoscape({
      container,
      elements: [],
      style: graphStyles(this.isDirected, this.currentTheme, this.edgeLineStyle, edgeCurveStyle),
      zoomingEnabled: true,
      userZoomingEnabled: true,
      minZoom: 0.2,
      maxZoom: 10
    });
  }

  // --------------ALGORITHMS - GRAPH UTILS------------
  getInstance() {
    return this.cy;
  }

  getNodes(): Node[] {
    return this.nodes || [];
  }

  getEdges(): Edge[] {
    return this.edges || [];
  }

  getAdjacencyList() {
    if (!this.isAdjacencyListDirty && this.cachedAdjacencyList) {
      return this.cachedAdjacencyList;
    }

    const adjList: Record<string, { target: string; weight: number; edgeId: string }[]> = {};
    const nodes = this.getNodes();
    const edges = this.getEdges();

    nodes.forEach(node => (adjList[node.id] = []));

    edges.forEach(edge => {
      const w = parseFloat(edge.weight) || 0;

      const isForwardExist = adjList[edge.source].some(e => e.target === edge.target);
      if (!isForwardExist) {
        adjList[edge.source].push({ target: edge.target, weight: w, edgeId: edge.id });
      }

      if (!this.isDirected) {
        const isBackwardExist = adjList[edge.target]?.some(e => e.target === edge.source);
        if (!isBackwardExist) {
          adjList[edge.target]?.push({ target: edge.source, weight: w, edgeId: edge.id });
        }
      }
    });

    this.cachedAdjacencyList = adjList;
    this.isAdjacencyListDirty = false;
    return adjList;
  }

  // --------------LAYOUT------------
  toggleContinuousPhysics(enable: boolean) {
    if (!this.cy) return;

    if (enable) {
      if (this.activePhysicsLayout) {
        this.activePhysicsLayout.stop();
      }

      const currentExtent = this.cy.extent();

      this.activePhysicsLayout = this.cy.layout({
        name: 'cola',
        animate: true,
        refresh: 2,
        infinite: true,
        fit: false,
        randomize: false,
        padding: 80,
        centerGraph: true,
        convergenceThreshold: 0.007,
        edgeLength: () => 68,
        nodeSpacing: () => 10,
        boundingBox: currentExtent
      } as any);

      this.activePhysicsLayout.run();
    } else {
      if (this.activePhysicsLayout) {
        this.activePhysicsLayout.stop();
        this.activePhysicsLayout = null;
      }
    }
  }

  // --------------FILE & IN-OUT------------
  importFromText(inputText: string, enablePhysicsOnStart: boolean = false) {
    if (!this.cy) return;

    const lines = inputText
      .trim()
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    if (!lines.length) throw new GraphInputException('Dữ liệu đầu vào trống!');

    const firstLine = lines[0].split(/\s+/);

    if (firstLine.length > 2) {
      throw new GraphInputException('Dòng đầu chỉ được nhập số đỉnh và số cung');
    }

    const [nStr, mStr] = firstLine;
    const n = parseInt(nStr, 10);
    const m = parseInt(mStr, 10);

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
    const elements: any[] = [];
    const uniqueNodes = new Set<string>();
    const edgeElements: any[] = [];

    const edgePairCount = new Map<string, number>();
    const isNumberNode = (val: string) => /^-?\d+$/.test(val);
    let globalNodeType: 'numeric' | 'string' | null = null;

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);

      if (parts.length > 3) {
        throw new GraphInputException(
          `Lỗi dòng ${i + 1}: Dư dữ liệu. Cú pháp chuẩn là [ĐỈNH_1 ĐỈNH_2 TRỌNG_SỐ].`
        );
      }

      if (parts.length >= 2) {
        const u = parts[0];
        const v = parts[1];

        const typeU = isNumberNode(u) ? 'numeric' : 'string';
        const typeV = isNumberNode(v) ? 'numeric' : 'string';

        if (globalNodeType === null) {
          globalNodeType = typeU;
        }

        if (typeU !== globalNodeType || typeV !== globalNodeType) {
          throw new GraphInputException(
            `Lỗi dòng ${i + 1}: Không được trộn lẫn đỉnh Chữ và đỉnh Số trong cùng một đồ thị.`
          );
        }

        const pairKey = [u, v].sort().join('-');
        edgePairCount.set(pairKey, (edgePairCount.get(pairKey) || 0) + 1);
      }
    }

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      if (parts.length >= 2) {
        const u = parts[0];
        const v = parts[1];
        const w = parts.length >= 3 ? parts[2] : '';

        uniqueNodes.add(u);
        uniqueNodes.add(v);

        const pairKey = [u, v].sort().join('-');
        const isParallel = (edgePairCount.get(pairKey) || 0) > 1;

        edgeElements.push({
          group: 'edges',
          data: {
            id: `e-${u}-${v}-${i}`,
            source: u,
            target: v,
            weight: w
          },
          classes: isParallel ? 'parallel-edge' : ''
        });

        this.edges?.push({ id: `e-${u}-${v}-${i}`, source: u, target: v, weight: w });
      }
    }

    this.isAdjacencyListDirty = true;

    if (uniqueNodes.size !== n) {
      throw new GraphInputException(
        `Số đỉnh thực tế xuất hiện trong các cung (${uniqueNodes.size}) khác số đỉnh khai báo ở dòng đầu (${n}).`
      );
    }

    uniqueNodes.forEach(nodeId => {
      elements.push({ group: 'nodes', data: { id: nodeId, label: nodeId } });
      this.nodes?.push({ id: nodeId, label: nodeId });
    });

    if (uniqueNodes.size < n && !isNaN(n)) {
      let missingCount = n - uniqueNodes.size;
      let generateId = 1;

      while (missingCount > 0) {
        let newId = String(generateId);
        if (!uniqueNodes.has(newId)) {
          this.nodes?.push({ id: newId, label: newId });
          elements.push({ group: 'nodes', data: { id: newId, label: newId } });
          missingCount--;
        }
        generateId++;
      }
    }

    elements.push(...edgeElements);

    this.toggleContinuousPhysics(false);

    this.cy.elements().remove();
    this.cy.add(elements);

    if (enablePhysicsOnStart) {
      this.toggleContinuousPhysics(true);
    } else {
      const centerX = this.cy.width() / 8;
      const centerY = this.cy.height() / 8;

      const coseLayout = this.cy.layout({
        name: 'cose',
        animate: false,
        padding: 80
      });

      coseLayout.promiseOn('layoutstop').then(() => {
        const targetPositions: Record<string, any> = {};
        this.cy?.nodes().forEach(node => {
          targetPositions[node.id()] = { ...node.position() };
        });

        this.cy?.nodes().positions({ x: centerX, y: centerY });

        this.cy
          ?.layout({
            name: 'preset',
            positions: targetPositions,
            animate: true,
            padding: 80,
            fit: true,
            animationDuration: 800,
            animationEasing: 'ease-out'
          })
          .run();
      });

      coseLayout.run();
    }
  }

  exportGraphBase64() {
    if (!this.cy || this.cy.elements().length === 0) return null;
    return this.cy.png({
      bg: '#ffffff',
      full: true,
      scale: 10
    });
  }

  exportElementsJsonString() {
    if (!this.cy || this.cy.elements().length === 0) return null;
    const rawElements = this.cy.elements().jsons();
    return JSON.stringify(rawElements, null, 2);
  }

  importElementsFromJson(elements: ElementDefinition[], enablePhysicsOnStart: boolean) {
    if (!this.cy) return;
    this.toggleContinuousPhysics(false);
    this.cy.elements().remove();

    this.nodes = [];
    this.edges = [];
    elements.forEach(el => {
      if (el.group === 'nodes' && el.data.id) {
        this.nodes?.push({ id: el.data.id, label: el.data.label || el.data.id });
      } else if (el.group === 'edges' && el.data.id && el.data.source && el.data.target) {
        this.edges?.push({
          id: el.data.id,
          source: el.data.source,
          target: el.data.target,
          weight: el.data.weight || ''
        });
      }
    });

    this.isAdjacencyListDirty = true;
    this.cy.add(elements);
    if (enablePhysicsOnStart) {
      this.toggleContinuousPhysics(true);
    } else {
      this.cy
        .layout({
          name: 'cose',
          animate: false,
          padding: 80
        })
        .run();
    }
  }

  // --------------STYLING------------
  updateConfig(config: GraphConfig) {
    if (!this.cy) return;

    this.isDirected = config.isDirected ?? this.isDirected;
    this.currentTheme = config.theme ?? this.currentTheme;
    this.edgeLineStyle = config.edgeLineStyle ?? this.edgeLineStyle;
    this.edgeCurveStyle = config.edgeCurveStyle ?? this.edgeCurveStyle;

    this.cy.style(
      graphStyles(this.isDirected, this.currentTheme, this.edgeLineStyle, this.edgeCurveStyle)
    );
  }

  zoomControl(value: number) {
    const currentZoom = this.cy?.zoom();
    this.cy?.zoom({
      level: currentZoom ? currentZoom + value : value,
      renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
    });
  }

  setNodeStatus(id: string, status: 'visited' | 'processing' | 'default') {
    if (!this.cy) return;
    const node = this.cy.getElementById(id);
    node.removeClass('visited processing');
    if (status !== 'default') node.addClass(status);
  }

  setEdgeStatus(id: string, status: 'visited' | 'processing' | 'default') {
    if (!this.cy) return;
    const edge = this.cy.getElementById(id);
    edge.removeClass('visited processing');
    if (status !== 'default') edge.addClass(status);
  }

  clearAllStatus() {
    this.cy?.elements().removeClass('visited processing');
  }
}
