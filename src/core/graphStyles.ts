import cytoscape from 'cytoscape';

export interface GraphThemePalettes {
  nodeBg: string;
  nodeLabel: string;
  nodeSelected: string;
  edge: string;
  edgeSelected: string;
  targetArrow: string;
  targetArrowSelected: string;
  textBg: string;
  visited: string;
  processing: string;
  path: string;
}

export type EdgeLineStyle = 'solid' | 'dotted' | 'dashed';
export type EdgeCurveStyle =
  | 'haystack'
  | 'straight'
  | 'bezier'
  | 'unbundled-bezier'
  | 'segments'
  | 'taxi';

export type GraphThemes =
  | 'default'
  | 'sunset'
  | 'monochrome'
  | 'nordic'
  | 'forest'
  | 'cyberpunk'
  | 'lavender';

const COMMON_COLORS = {
  nodeLabel: '#ffffff',
  textBg: '#ffffff'
};

const createTheme = (
  config: Omit<GraphThemePalettes, 'nodeLabel' | 'textBg' | 'targetArrow' | 'targetArrowSelected'>
): GraphThemePalettes => ({
  ...COMMON_COLORS,
  targetArrow: config.edge,
  targetArrowSelected: config.edgeSelected,
  ...config
});

export const themes: Record<string, GraphThemePalettes> = {
  default: createTheme({
    nodeBg: '#3b82f6',
    nodeSelected: '#1e3a8a',
    edge: '#94a3b8',
    edgeSelected: '#1e293b',
    visited: '#64748b',
    processing: '#f59e0b',
    path: '#10b981'
  }),
  sunset: createTheme({
    nodeBg: '#f97316',
    nodeSelected: '#7c2d12',
    edge: '#fcd34d',
    edgeSelected: '#78350f',
    visited: '#a8a29e',
    processing: '#eab308',
    path: '#14b8a6'
  }),
  monochrome: createTheme({
    nodeBg: '#475569',
    nodeSelected: '#0f172a',
    edge: '#94a3b8',
    edgeSelected: '#000000',
    visited: '#6b7280',
    processing: '#06b6d4',
    path: '#8b5cf6'
  }),
  nordic: createTheme({
    nodeBg: '#0d9488',
    nodeSelected: '#134e4a',
    edge: '#99f6e4',
    edgeSelected: '#1e293b',
    visited: '#64748b',
    processing: '#d97706',
    path: '#e11d48'
  }),
  forest: createTheme({
    nodeBg: '#16a34a',
    nodeSelected: '#14532d',
    edge: '#bbf7d0',
    edgeSelected: '#064e3b',
    visited: '#78716c',
    processing: '#eab308',
    path: '#0284c7'
  }),
  cyberpunk: createTheme({
    nodeBg: '#db2777',
    nodeSelected: '#831843',
    edge: '#fbcfe8',
    edgeSelected: '#4c0519',
    visited: '#8b5cf6',
    processing: '#f59e0b',
    path: '#06b6d4'
  }),
  lavender: createTheme({
    nodeBg: '#8b5cf6',
    nodeSelected: '#4c1d95',
    edge: '#ddd6fe',
    edgeSelected: '#2e1065',
    visited: '#a78bfa',
    processing: '#fbbf24',
    path: '#ec4899'
  })
};

export const graphStyles = (
  isDirected: boolean,
  themeName: string = 'default',
  edgeLineStyle: EdgeLineStyle = 'solid',
  edgeCurveStyle: EdgeCurveStyle = 'bezier'
): cytoscape.StylesheetStyle[] => {
  const theme = themes[themeName] || themes['default'];

  return [
    {
      selector: 'node',
      style: {
        'background-color': theme.nodeBg,
        label: 'data(id)',
        color: theme.nodeLabel,
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '8px',
        'transition-property': 'background-color, border-color, border-width',
        'transition-duration': 0.3,
        width: 20,
        height: 20
      }
    },
    {
      selector: 'edge',
      style: {
        width: 1.4,
        'line-color': theme.edge,
        'target-arrow-color': theme.targetArrow,
        'target-arrow-shape': isDirected ? 'triangle' : 'none',
        'arrow-scale': 0.6,
        'line-style': edgeLineStyle,
        'curve-style': edgeCurveStyle,
        label: 'data(weight)',
        'font-size': '8px',
        'text-background-opacity': 0,
        'text-background-color': theme.textBg,
        'text-outline-width': 0.4,
        'text-outline-color': '#ffffff',
        'text-background-padding': '2',
        'transition-property': 'line-color, target-arrow-color, width',
        'transition-duration': 0.3
      }
    },
    {
      selector: 'edge.parallel-edge',
      style: {
        'curve-style': 'bezier'
      }
    },
    {
      selector: '.visited',
      style: {
        'background-color': theme.visited,
        'line-color': theme.visited,
        'target-arrow-color': theme.visited,
        'border-color': theme.visited
      }
    },
    {
      selector: '.processing',
      style: {
        'background-color': theme.processing,
        'line-color': theme.processing,
        'target-arrow-color': theme.processing,
        'border-color': theme.processing
      }
    },
    {
      selector: '.path',
      style: {
        'background-color': theme.path,
        'line-color': theme.path,
        'target-arrow-color': theme.path,
        'border-color': theme.path,
        'z-index': 10
      }
    },
    {
      selector: 'node:selected',
      style: {
        'background-color': theme.nodeSelected
      }
    },
    {
      selector: 'edge:selected',
      style: {
        'line-color': theme.edgeSelected,
        'target-arrow-color': theme.targetArrowSelected
      }
    },
    {
      selector: ':active',
      style: {
        'overlay-padding': 3,
        'overlay-opacity': 0.1
      }
    }
  ];
};
