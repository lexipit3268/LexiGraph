import cytoscape, { ElementDefinition } from 'cytoscape';
import { EdgeCurveStyle, EdgeLineStyle, graphStyles } from './graphStyles';
import { GraphConfig } from './GraphConfig';

export class Graph {
  private cy: cytoscape.Core | null = null;
  private isDirected: boolean = true;
  private currentTheme: string = 'default';
  private edgeLineStyle: EdgeLineStyle = 'solid';
  private edgeCurveStyle: EdgeCurveStyle = 'bezier';

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

  importFromText(inputText: string) {
    if (!this.cy) return;

    const lines = inputText
      .trim()
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
    if (!lines.length) return;

    const [nStr, mStr] = lines[0].split(/\s+/);
    const n = parseInt(nStr, 10);
    // @ts-ignore
    const m = parseInt(mStr, 10);

    const elements: any[] = [];
    const uniqueNodes = new Set<string>();
    const edgeElements: any[] = [];

    const edgePairCount = new Map<string, number>();

    // kiem tra trung canh u v, v u
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      if (parts.length >= 2) {
        const u = parts[0];
        const v = parts[1];
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
      }
    }

    uniqueNodes.forEach(nodeId => {
      elements.push({ group: 'nodes', data: { id: nodeId, label: nodeId } });
    });

    if (uniqueNodes.size < n && !isNaN(n)) {
      let missingCount = n - uniqueNodes.size;
      let generateId = 1;

      while (missingCount > 0) {
        let newId = String(generateId);
        if (!uniqueNodes.has(newId)) {
          elements.push({ group: 'nodes', data: { id: newId, label: newId } });
          missingCount--;
        }
        generateId++;
      }
    }

    elements.push(...edgeElements);

    this.cy.elements().remove();
    this.cy.add(elements);

    this.cy
      .layout({
        name: 'cose',
        animate: true,
        padding: 80
      })
      .run();
  }

  exportElementsJson() {
    console.log(this.cy?.elements().jsons());
    return this.cy?.elements().jsons();
  }

  importElementsFromJson(elements: ElementDefinition[]) {
    if (!this.cy) return;
    this.cy.elements().remove();
    this.cy.add(elements);
    this.cy.layout({ name: 'cose', animate: true, padding: 80 }).run();
  }

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

  getInstance() {
    return this.cy;
  }
}
