import styles from '../WorkflowDiagram.module.css';

/**
 * Props for one part of a diagram: the part that does the active step is lit
 * in brand red (see WorkflowDiagram.module.css). Usage in a drawing:
 *   const part = partOf(on);  <g {...part('heat')}>…</g>
 */
export function partOf(on) {
  return (name) => ({ 'data-part': name, className: on === name ? styles.on : undefined });
}
