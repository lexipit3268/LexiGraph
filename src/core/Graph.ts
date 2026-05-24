import cytoscape from 'cytoscape';
import { graphStyles } from '../utils/graphStyles';

export class Graph {
  private cy: cytoscape.Core | null = null;
  private isDirected: boolean = true;
  private currentTheme: string = 'default';

  init(container: HTMLElement, isDirected = true, theme = 'default') {
    this.isDirected = isDirected;
    this.currentTheme = theme;

    this.cy = cytoscape({
      container,
      elements: [],
      style: graphStyles(this.isDirected, this.currentTheme),
      zoomingEnabled: true,
      userZoomingEnabled: true
    });
  }

  drawGraph(inputText: string) {
    if (!this.cy) return;

    const lines = inputText
      .trim()
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
    if (!lines.length) return;

    const [nStr, mStr] = lines[0].split(/\s+/);
    const n = parseInt(nStr, 10);
    const m = parseInt(mStr, 10);

    const elements: any[] = [];

    for (let i = 1; i <= n; i++) {
      elements.push({ group: 'nodes', data: { id: String(i) } });
    }

    for (let i = 1; i <= m; i++) {
      if (i < lines.length) {
        const [u, v, w] = lines[i].split(/\s+/);
        elements.push({
          group: 'edges',
          data: {
            id: `e${u}-${v}-${i}`,
            source: u,
            target: v,
            weight: w ?? ''
          }
        });
      }
    }

    this.cy.elements().remove();
    this.cy.add(elements);

    this.cy
      .layout({
        name: 'cose',
        animate: true,
        idealEdgeLength: 100,
        nodeOverlap: 20
      })
      .run();
  }

  updateConfig(config: { isDirected?: boolean; theme?: string }) {
    if (!this.cy) return;

    this.isDirected = config.isDirected ?? this.isDirected;
    this.currentTheme = config.theme ?? this.currentTheme;

    this.cy.style(graphStyles(this.isDirected, this.currentTheme));
  }

  // toggleDirected(isDirected: boolean) {
  //   if (!this.cy) return;

  //   this.cy.style(graphStyles(isDirected));
  // }

  // --- ANIMATION ---

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
