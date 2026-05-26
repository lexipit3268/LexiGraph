import cytoscape from 'cytoscape';

export interface GraphTheme {
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
  path: string; //result path
}

export type EdgeLineStyle = 'solid' | 'dotted' | 'dashed';
export type EdgeCurveStyle =
  | 'haystack'
  | 'straight'
  | 'bezier'
  | 'unbundled-bezier'
  | 'segments'
  | 'taxi';

export const themes: Record<string, GraphTheme> = {
  default: {
    nodeBg: '#3b82f6',
    nodeLabel: '#ffffff',
    nodeSelected: '#023e8a',
    edge: '#cbd5e1',
    edgeSelected: '#000000',
    targetArrow: '#cbd5e1',
    targetArrowSelected: '#000000',
    textBg: '#ffffff',
    visited: '#94a3b8',
    processing: '#f59e0b',
    path: '#10b981'
  },
  sunset: {
    nodeBg: '#f97316',
    nodeLabel: '#ffffff',
    nodeSelected: '#c2410c',
    edge: '#d6d3d1',
    edgeSelected: '#44403c',
    targetArrow: '#d6d3d1',
    targetArrowSelected: '#44403c',
    textBg: '#ffffff',
    visited: '#a8a29e',
    processing: '#eab308',
    path: '#14b8a6'
  },
  monochrome: {
    nodeBg: '#475569',
    nodeLabel: '#ffffff',
    nodeSelected: '#0f172a',
    edge: '#cbd5e1',
    edgeSelected: '#000000',
    targetArrow: '#cbd5e1',
    targetArrowSelected: '#000000',
    textBg: '#ffffff',
    visited: '#94a3b8',
    processing: '#06b6d4',
    path: '#8b5cf6'
  },
  nordic: {
    nodeBg: '#0d9488',
    nodeLabel: '#ffffff',
    nodeSelected: '#115e59',
    edge: '#94a3b8',
    edgeSelected: '#334155',
    targetArrow: '#94a3b8',
    targetArrowSelected: '#334155',
    textBg: '#ffffff',
    visited: '#64748b',
    processing: '#d97706',
    path: '#e11d48'
  }
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
      selector: '.visited',
      style: {
        'background-color': theme.visited,
        'line-color': theme.visited,
        'target-arrow-color': theme.visited,
        'border-width': 2,
        'border-color': theme.visited
      }
    },
    {
      selector: '.processing',
      style: {
        'background-color': theme.processing,
        'line-color': theme.processing,
        'target-arrow-color': theme.processing,
        width: 4,
        'border-width': 3,
        'border-color': theme.processing
      }
    },
    {
      selector: '.path',
      style: {
        'background-color': theme.path,
        'line-color': theme.path,
        'target-arrow-color': theme.path,
        width: 4,
        'border-width': 3,
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
