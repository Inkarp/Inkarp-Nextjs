// Which products have a line drawing of their instrument at work, opt-in by
// product slug (products without an entry are unchanged). It is shown as a
// live diagram beside the workflow section's title
// (src/components/products/sections/WorkflowDiagram.jsx), lighting up the part
// that does the active step.

const HERO_DRAWINGS = {
  "hei-vap-core-rotary-evaporator": "rotary-evaporator",
  // Mettler Toledo preview (2 Nov 2026): one product per category, to be
  // widened to each whole category once approved.
  "analytical-balance-mx204": "balance",
  "ph-meter-sevendirect-sd20-kit": "ph-meter",
  "titrator-excellence-t5": "titrator",
  "density-meter-excellence-d4": "density-meter",
  "halogen-moisture-analyzer-hx204": "moisture-analyzer",
  "spectrophotometer-easy-uv": "uv-vis",
};

// The live diagram in the workflow section (approved 2 Nov 2026).
const SHOW_WORKFLOW_DIAGRAMS = true;

// The same drawing faint in the page background (HeroDrawing.jsx), switched
// off 2 Nov 2026: the manager did not like it across the page. true brings
// it back as it was.
const SHOW_HERO_DRAWINGS = false;

export function getWorkflowDiagramKind(slug) {
  return SHOW_WORKFLOW_DIAGRAMS ? HERO_DRAWINGS[slug] ?? null : null;
}

export function getHeroDrawingKind(slug) {
  return SHOW_HERO_DRAWINGS ? HERO_DRAWINGS[slug] ?? null : null;
}
