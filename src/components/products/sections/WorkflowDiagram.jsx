import styles from './WorkflowDiagram.module.css';
import { DIAGRAMS } from './workflow-diagrams';

/**
 * A line drawing of the instrument at work, beside the workflow steps (which
 * product shows which kind: src/data/products/heroDrawings.js; the drawings:
 * ./workflow-diagrams). Its moving parts run all the time in grey; the part
 * that does the active step lights up in brand red, with a tag naming the
 * step. Steps are matched to parts by keyword, so "Rotate", "Rotation" and
 * "Spin" all light the flask; an unmatched step lights nothing. Decorative
 * (aria-hidden): the step list says the same in text.
 */

// The shared drawing grid (240 units) with a margin for the tags.
const VIEWBOX = { x: -10, y: 0, width: 262, height: 236 };

export default function WorkflowDiagram({ kind, stepTitle, stepNumber, className = '' }) {
  const diagram = DIAGRAMS[kind];
  if (!diagram) return null;

  const title = String(stepTitle ?? '');
  const on = diagram.parts.find((p) => p.test.test(title.toLowerCase()))?.part;
  const { at: [x, y], align } = (on && diagram.tags[on]) || { at: [0, 0], align: 'start' };
  const shiftX = align === 'end' ? '-100%' : align === 'center' ? '-50%' : '0';
  const { Drawing } = diagram;

  return (
    <div aria-hidden="true" className={`${styles.diagram} relative ${className}`}>
      <svg
        fill="none"
        focusable="false"
        viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}`}
      >
        <Drawing on={on} />
      </svg>
      {on ? (
        <span
          className={styles.tag}
          style={{
            left: `${((x - VIEWBOX.x) / VIEWBOX.width) * 100}%`,
            top: `${((y - VIEWBOX.y) / VIEWBOX.height) * 100}%`,
            transform: `translate(${shiftX}, -50%)`,
          }}
        >
          {String(stepNumber).padStart(2, '0')}&nbsp;&nbsp;{title}
        </span>
      ) : null}
    </div>
  );
}
