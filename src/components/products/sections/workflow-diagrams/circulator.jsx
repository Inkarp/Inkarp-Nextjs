import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Circulating bath / chiller: the hoses are connected to the jacketed vessel,
// the reservoir is filled, the temperature is set, the pump circulates the
// fluid round the jacket, the reading settles, and the vessel is held there.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The unit, its reservoir window and lid, and the jacketed vessel. */}
      <g data-part="frame">
        <rect height="126" rx="6" width="110" x="20" y="70" />
        <path d="M34 196v5M116 196v5M30 70v-6h40v6" />
        <rect height="66" rx="3" width="50" x="30" y="120" />
        <path d="M178 96v78a12 12 0 0 0 12 12h28a12 12 0 0 0 12-12v-78M186 100v70a6 6 0 0 0 6 6h24a6 6 0 0 0 6-6v-70" />
        <path className={styles.liquid} d="M186 130h36v40a6 6 0 0 1-6 6h-24a6 6 0 0 1-6-6z" />
      </g>

      {/* The hoses and their quick connectors. */}
      <g {...part('connect')}>
        <path d="M130 126h6v8h-6zM130 150h6v8h-6z" />
        <path d="M136 130H160V110H178M136 154H160V166H178" />
      </g>

      {/* Fluid poured into the reservoir. */}
      <g {...part('fill')}>
        <path d="M30 28l20-8 8 16-20 8z" />
        <circle className={styles.drop} cx="44" cy="50" r="1.6" style={{ '--fall': '14px' }} />
        <path className={styles.liquid} d="M32 136h46v48H32z" />
      </g>

      {/* The temperature set on the buttons. */}
      <g {...part('set')}>
        <circle className={styles.press} cx="96" cy="112" r="5" />
        <circle cx="114" cy="112" r="5" />
      </g>

      {/* The pump turning, fluid running round the jacket. */}
      <g {...part('circulate')}>
        <circle cx="55" cy="100" r="9" />
        <path className={styles.whirl} d="M55 93v14M48 100h14" />
        <path className={styles.flow} d="M136 130H160V110H178M178 166H160V154H136" />
      </g>

      {/* The temperature curve settling on the display. */}
      <g {...part('stabilise')}>
        <rect height="22" rx="2" width="38" x="86" y="78" />
        <path className={styles.draw} d="M90 96c4-14 6-2 9-8s5 2 8-1 5 0 13 0" pathLength="100" />
      </g>

      {/* The vessel held at temperature, its probe steady. */}
      <g {...part('maintain')}>
        <path d="M204 80V150" />
        <circle cx="204" cy="154" r="4" />
        <circle className={styles.blink} cx="204" cy="78" r="2" />
      </g>
    </>
  );
}

const circulator = {
  Drawing,
  parts: [
    { part: 'connect', test: /connect|attach|hose/ },
    { part: 'fill', test: /fill/ },
    { part: 'set', test: /set|temperat/ },
    { part: 'circulate', test: /circulat|coolant|pump/ },
    { part: 'stabilise', test: /stabil|equilibr/ },
    { part: 'maintain', test: /maintain|hold|keep/ },
  ],
  tags: {
    connect: { at: [148, 196], align: 'center' },
    fill: { at: [44, 12], align: 'center' },
    set: { at: [105, 130], align: 'center' },
    circulate: { at: [148, 88], align: 'center' },
    stabilise: { at: [105, 58], align: 'center' },
    maintain: { at: [204, 64], align: 'center' },
  },
};

export default circulator;
