import cytoscape, { ElementDefinition } from 'cytoscape';
import { EdgeCurveStyle, EdgeLineStyle, graphStyles } from './graphStyles';
import { GraphConfig } from './GraphConfig';
import { parseAndValidateGraphText } from '../utils/graphValidator';
// @ts-ignore
import cola from 'cytoscape-cola';
// @ts-ignore
import edgehandles from 'cytoscape-edgehandles';
import { ElMessage } from 'element-plus';
cytoscape.use(edgehandles);
cytoscape.use(cola);

export type Node = { id: string; label: string };
export type Edge = { id: string; source: string; target: string; weight: string };

export class Graph {
  private cy: cytoscape.Core | null = null;
  private isDrawMode: boolean = false;
  private eh: any = null;
  private syncCallback: ((text: string, nodes: Node[]) => void) | null = null;
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

  getGraphNamingType(): 'numeric' | 'alphabetic' | 'mixed' | 'empty' {
    const nodes = this.cy?.nodes() || [];
    if (nodes.length === 0) return 'empty';

    let hasNumber = false;
    let hasLetter = false;

    nodes.forEach(n => {
      const label = (n.data('label') || '').trim();
      if (label && label !== '') {
        if (/^\d+$/.test(label)) hasNumber = true;
        else if (/^[A-Za-z]+$/.test(label)) hasLetter = true;
        else {
          hasNumber = true;
          hasLetter = true;
        }
      }
    });

    if (hasNumber && !hasLetter) return 'numeric';
    if (!hasNumber && hasLetter) return 'alphabetic';
    return 'mixed';
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

      const forwardIdx = adjList[edge.source].findIndex(e => e.target === edge.target);
      if (forwardIdx === -1) {
        adjList[edge.source].push({ target: edge.target, weight: w, edgeId: edge.id });
      } else if (w < adjList[edge.source][forwardIdx].weight) {
        adjList[edge.source][forwardIdx] = { target: edge.target, weight: w, edgeId: edge.id };
      }

      if (!this.isDirected) {
        const backwardIdx = adjList[edge.target]?.findIndex(e => e.target === edge.source);
        if (backwardIdx === -1) {
          adjList[edge.target]?.push({ target: edge.source, weight: w, edgeId: edge.id });
        } else if (w < adjList[edge.target][backwardIdx].weight) {
          adjList[edge.target][backwardIdx] = { target: edge.source, weight: w, edgeId: edge.id };
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
        nodeSpacing: () => 6,
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

  // --------------DRAW MODE & SYNC------------
  createInputOverlay(
    element: cytoscape.NodeSingular | cytoscape.EdgeSingular,
    defaultValue: string,
    placeholder: string,
    onComplete: (value: string) => void
  ) {
    if (!this.cy) return;
    const container = this.cy.container();
    if (!container) return;

    container.style.position = 'relative';

    let renderedX = 0;
    let renderedY = 0;

    if (element.isNode()) {
      const pos = (element as cytoscape.NodeSingular).renderedPosition();
      renderedX = pos.x;
      renderedY = pos.y;
    } else {
      const mid = (element as cytoscape.EdgeSingular).midpoint();
      const zoom = this.cy.zoom();
      const pan = this.cy.pan();

      renderedX = mid.x * zoom + pan.x;
      renderedY = mid.y * zoom + pan.y;
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.value = defaultValue;
    input.placeholder = placeholder;
    input.style.position = 'absolute';
    input.style.top = `${renderedY}px`;
    input.style.left = `${renderedX}px`;
    input.style.transform = 'translate(-50%, -50%)';
    input.style.zIndex = '9999';
    input.style.width = element.isNode() ? `${element.renderedWidth() + 20}px` : '40px';
    input.style.height = element.isNode() ? `${element.renderedHeight()}px` : '24px';
    input.style.textAlign = 'center';
    input.style.background = '#ffffff';
    input.style.border = '1px solid #3b82f6';
    input.style.borderRadius = '2px';
    input.style.outline = 'none';
    input.style.fontWeight = 'bold';

    container.appendChild(input);
    input.focus();
    input.select();

    let isFinished = false;
    const finish = () => {
      if (isFinished) return;
      isFinished = true;
      const val = input.value.trim();
      if (container.contains(input)) container.removeChild(input);
      onComplete(val);
      this.cy?.off('zoom pan', finish);
    };

    input.addEventListener('blur', finish);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === 'Escape') finish();
    });
    this.cy.on('zoom pan', finish);
  }

  toggleDrawMode(enable: boolean, onSync?: (text: string, nodes: Node[]) => void) {
    if (!this.cy) return;
    this.isDrawMode = enable;
    if (onSync) this.syncCallback = onSync;

    if (enable) {
      if (!this.eh) {
        this.eh = (this.cy as any).edgehandles({
          snap: true,
          noEdgeEventsInDraw: true,
          disableBrowserGestures: true,
          edgeParams: (sourceNode: cytoscape.NodeSingular, targetNode: cytoscape.NodeSingular) => {
            return {
              data: {
                id: `e-${sourceNode.id()}-${targetNode.id()}-${Date.now()}`,
                weight: ''
              }
            };
          }
        });
      }
      this.eh.enable();
      this.eh.enableDrawMode();

      this.cy.on('tap', this.handleCanvasTap);
      this.cy.on('ehcomplete', this.handleEdgeComplete);
    } else {
      if (this.eh) {
        this.eh.disableDrawMode();
        this.eh.disable();
      }
      this.cy.off('tap', this.handleCanvasTap);
      this.cy.off('ehcomplete', this.handleEdgeComplete);
    }
  }

  handleCanvasTap = (event: cytoscape.EventObject) => {
    if (!this.cy || !this.isDrawMode) return;

    if (event.target === this.cy) {
      const tempId = crypto.randomUUID();
      const type = this.getGraphNamingType();

      const tempNode = this.cy.add({
        group: 'nodes',
        data: { id: tempId, label: '' },
        position: event.position,
        style: { 'text-opacity': 0 }
      });

      this.createInputOverlay(tempNode, '', '', label => {
        const isInputNumeric = /^\d+$/.test(label);
        const isInputAlpha = /^[A-Za-z]+$/.test(label);

        if (!label) {
          tempNode.remove();
          return;
        }

        if (type === 'numeric' && !isInputNumeric) {
          ElMessage.error('Đồ thị đang dùng số. Vui lòng không nhập chữ!');
          tempNode.remove();
          return;
        }

        if (type === 'alphabetic' && !isInputAlpha) {
          ElMessage.error('Đồ thị đang dùng chữ. Vui lòng không nhập số!');
          tempNode.remove();
          return;
        }

        if (this.cy!.getElementById(label).length > 0) {
          ElMessage.error('Tên đỉnh này đã tồn tại!');
          tempNode.remove();
          return;
        }

        this.cy!.add({
          group: 'nodes',
          data: { id: label, label: label },
          position: tempNode.position()
        });

        tempNode.remove();
        this.syncGraphToText();
      });
    }
  };

  handleEdgeComplete = (
    _event: cytoscape.EventObject,
    _sourceNode: cytoscape.NodeSingular,
    _targetNode: cytoscape.NodeSingular,
    addedEdge: cytoscape.EdgeSingular
  ) => {
    if (!this.isDrawMode) return;

    this.createInputOverlay(addedEdge, '1', 'W', weight => {
      if (!weight || isNaN(Number(weight))) {
        ElMessage.error('Trọng số phải là số nguyên');
        addedEdge.remove();
      } else {
        addedEdge.data('weight', weight);
        this.syncGraphToText();
      }
    });
  };

  syncGraphToText() {
    if (!this.cy) return;

    const cyNodes = this.cy.nodes();
    const cyEdges = this.cy.edges();

    this.nodes = [];
    this.edges = [];
    this.isAdjacencyListDirty = true;

    // n m
    let text = `${cyNodes.length} ${cyEdges.length}\n`;

    cyNodes.forEach(n => {
      this.nodes!.push({ id: n.id(), label: n.data('label') || n.id() });
    });

    cyEdges.forEach(e => {
      const src = e.source().id();
      const tgt = e.target().id();
      const w = e.data('weight') || '1';

      this.edges!.push({
        id: e.id(),
        source: src,
        target: tgt,
        weight: String(w)
      });

      text += `${src} ${tgt} ${w}\n`;
    });

    if (this.syncCallback) {
      this.syncCallback(text.trim(), this.nodes!);
    }
  }

  // --------------FILE & IN-OUT------------
  importFromText(inputText: string, enablePhysicsOnStart: boolean = false) {
    if (!this.cy) return;

    const { n, uniqueNodes, edges } = parseAndValidateGraphText(inputText);

    this.cy.elements().remove();
    this.nodes = [];
    this.edges = [];
    this.isAdjacencyListDirty = true;

    const elements: any[] = [];

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

    edges.forEach((edge, index) => {
      elements.push({
        group: 'edges',
        data: {
          id: `e-${edge.u}-${edge.v}-${index}`,
          source: edge.u,
          target: edge.v,
          weight: edge.w
        },
        classes: edge.isParallel ? 'parallel-edge' : ''
      });
      this.edges?.push({
        id: `e-${edge.u}-${edge.v}-${index}`,
        source: edge.u,
        target: edge.v,
        weight: String(edge.w)
      });
    });

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

  importElementsFromJson(elements: ElementDefinition[], enablePhysicsOnStart: boolean) {
    if (!this.cy) return;
    if (!elements || !Array.isArray(elements)) return;

    this.toggleContinuousPhysics(false);
    this.cy.elements().remove();
    this.nodes = [];
    this.edges = [];
    this.isAdjacencyListDirty = true;

    elements.forEach(el => {
      if (el.group === 'nodes' && el.data.id) {
        this.nodes?.push({ id: el.data.id, label: el.data.label || el.data.id });
      } else if (el.group === 'edges' && el.data.id && el.data.source && el.data.target) {
        this.edges?.push({
          id: el.data.id,
          source: el.data.source,
          target: el.data.target,
          weight: el.data.weight !== undefined ? String(el.data.weight) : ''
        });
      }
    });

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

  setNodeStatus(
    id: string,
    status: 'visited' | 'processing' | 'default' | 'path' | 'boundary' | 'negative'
  ) {
    if (!this.cy) return;
    const node = this.cy.getElementById(id);
    node.removeClass('visited processing negative');
    if (status !== 'default') node.addClass(status);
  }

  setEdgeStatus(id: string, status: 'visited' | 'processing' | 'default' | 'path' | 'negative') {
    if (!this.cy) return;
    const edge = this.cy.getElementById(id);
    edge.removeClass('visited processing negative');
    if (status !== 'default') edge.addClass(status);
  }

  clearAllStatus() {
    this.cy?.elements().removeClass('visited processing path negative boundary');
  }

  clearElements() {
    this.cy?.elements().remove();
  }
}
