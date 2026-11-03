import styles from '../WorkflowDiagram.module.css';

// The stirring hotplate several drawings stand their block on (parallel
// reactor, work station, heat block, air condenser, blowdown evaporator).
// `stir` and `heat` name the parts its knobs (and the plate's glow) belong to;
// null leaves that knob in the grey frame.
export function HotplateBase({ part, stir = null, heat = null }) {
  return (
    <>
      <g data-part="frame">
        <rect height="30" rx="6" width="160" x="40" y="168" />
        <path d="M54 198v5M186 198v5" />
        <rect height="6" rx="2" width="148" x="46" y="162" />
        <rect height="14" rx="2" width="44" x="56" y="176" />
        {stir ? null : <circle cx="136" cy="183" r="7" />}
        {heat ? null : <circle cx="172" cy="183" r="7" />}
      </g>
      {stir ? (
        <g {...part(stir)}>
          <circle cx="136" cy="183" r="7" />
          <path className={styles.whirl} d="M136 177v12M130 183h12" />
        </g>
      ) : null}
      {heat ? (
        <g {...part(heat)}>
          <circle cx="172" cy="183" r="7" />
          <path className={styles.whirl} d="M172 177v12M166 183h12" />
          <path className={styles.glow} d="M52 165h136" />
        </g>
      ) : null}
    </>
  );
}
