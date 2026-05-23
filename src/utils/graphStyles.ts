import cytoscape from 'cytoscape';

const COLOR_NODE_BG = '#3b82f6';
const COLOR_NODE_LABEL = '#ffffff';
const COLOR_NODE_SELECTED = '#023e8a';

const COLOR_EDGE = '#cbd5e1';
const COLOR_EDGE_SELECTED = '#000000';

const COLOR_TARGET_ARROW = '#cbd5e1';
const COLOR_TARGET_ARROW_SELECTED = '#000000';

const COLOR_TEXT_BG = '#0000FF';

const COLOR_VISITED = '#10b981';
const COLOR_PROCESSING = '#f59e0b';

export const graphStyles = (isDirected: boolean): cytoscape.StylesheetStyle[] => [
  {
    selector: 'node',
    style: {
      'background-color': COLOR_NODE_BG,
      label: 'data(id)',
      color: COLOR_NODE_LABEL,
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '14px',
      'transition-property': 'background-color, border-color, border-width',
      'transition-duration': 0.3,
      width: 30,
      height: 30
    }
  },
  {
    selector: 'node:selected',
    style: {
      'background-color': COLOR_NODE_SELECTED
    }
  },
  {
    selector: 'edge',
    style: {
      width: 2,
      'line-color': COLOR_EDGE,
      'target-arrow-color': COLOR_TARGET_ARROW,
      'target-arrow-shape': isDirected ? 'triangle' : 'none',
      'curve-style': 'bezier',
      label: 'data(weight)',
      'font-size': '12px',
      'text-background-opacity': 0,
      'text-background-color': COLOR_TEXT_BG,
      'text-outline-width': 1.2,
      'text-outline-color': '#ffffff',
      'text-background-padding': '2',
      'transition-property': 'line-color, target-arrow-color, width',
      'transition-duration': 0.3
    }
  },
  {
    selector: '.visited',
    style: {
      'background-color': COLOR_VISITED,
      'line-color': COLOR_VISITED,
      'target-arrow-color': COLOR_VISITED
    }
  },
  {
    selector: '.processing',
    style: {
      'background-color': COLOR_PROCESSING,
      'line-color': COLOR_PROCESSING,
      'target-arrow-color': COLOR_PROCESSING,
      width: 4
    }
  },
  {
    selector: 'edge:selected',
    style: {
      'line-color': COLOR_EDGE_SELECTED,
      'target-arrow-color': COLOR_TARGET_ARROW_SELECTED
    }
  }
];
