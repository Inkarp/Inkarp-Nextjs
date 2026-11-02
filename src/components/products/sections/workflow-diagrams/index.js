// Workflow diagrams by kind (see WorkflowDiagram.jsx). Each is
// { Drawing, parts: [{ part, test }], tags: { part: { at, align } } } on the
// shared 240-unit grid. Which product shows which kind:
// src/data/products/heroDrawings.js.
import balance from './balance';
import densityMeter from './densityMeter';
import moistureAnalyzer from './moistureAnalyzer';
import phMeter from './phMeter';
import rotaryEvaporator from './rotaryEvaporator';
import titrator from './titrator';
import uvVis from './uvVis';

export const DIAGRAMS = {
  'rotary-evaporator': rotaryEvaporator,
  balance,
  'ph-meter': phMeter,
  titrator,
  'density-meter': densityMeter,
  'moisture-analyzer': moistureAnalyzer,
  'uv-vis': uvVis,
};
