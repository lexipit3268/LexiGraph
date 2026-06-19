import { EdgeCurveStyle, EdgeLineStyle, GraphThemes } from './graphStyles';

export interface GraphConfig {
  isDirected: boolean;
  theme: GraphThemes;
  edgeLineStyle: EdgeLineStyle;
  edgeCurveStyle: EdgeCurveStyle;
}
