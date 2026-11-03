import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Ultrasonic cleaning bath: the tank is filled, the basket of parts is
// lowered in, the transducers sonicate, the parts are rinsed with the wash
// bottle, and left to dry.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The tank, feet and front panel, and the cleaned part on the bench. */}
      <g data-part="frame">
        <rect height="86" rx="6" width="160" x="30" y="110" />
        <path d="M44 196v5M176 196v5" />
        <rect height="16" rx="2" width="36" x="146" y="174" />
        <path d="M206 170h20M208 170v22a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-22" />
      </g>

      {/* Water poured into the tank. */}
      <g {...part('fill')}>
        <path d="M24 72l20-8 8 16-20 8z" />
        <circle className={styles.drop} cx="40" cy="94" r="1.6" style={{ '--fall': '30px' }} />
        <path className={styles.liquid} d="M36 128h148v40H36z" />
      </g>

      {/* The basket of parts lowered into the water. */}
      <g {...part('immerse')}>
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          <path d="M60 104h90v56H60zM60 120h90M60 140h90M90 104v56M120 104v56" />
          <path d="M70 152h10M100 150h14M128 152h10" strokeWidth="3" />
        </g>
      </g>

      {/* The transducers sending ultrasound up through the water. */}
      <g {...part('sonicate')}>
        <path className={styles.signal} d="M66 182q8-6 16 0M104 182q8-6 16 0M142 182q8-6 16 0" />
        <circle className={styles.rise} cx="80" cy="164" r="1.4" />
        <circle className={`${styles.rise} ${styles.later}`} cx="110" cy="166" r="1.4" />
        <circle className={styles.rise} cx="136" cy="164" r="1.4" />
      </g>

      {/* The wash bottle rinsing the part. */}
      <g {...part('rinse')}>
        <path d="M204 104v-26a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v26zM212 74v-6h6M218 68h-10l-6 6" />
        <circle className={styles.drop} cx="208" cy="110" r="1.4" style={{ '--fall': '50px' }} />
        <circle className={`${styles.drop} ${styles.later}`} cx="214" cy="110" r="1.4" style={{ '--fall': '50px' }} />
      </g>

      {/* The part drying in the air. */}
      <g {...part('dry')}>
        <path className={styles.heat} d="M212 166q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M220 166q-2-3 0-6t0-6" />
        <path className={styles.flow} d="M236 160v28" />
      </g>
    </>
  );
}

const ultrasonicBath = {
  Drawing,
  parts: [
    { part: 'fill', test: /fill/ },
    { part: 'immerse', test: /immers|place|load/ },
    { part: 'sonicate', test: /sonicat|ultrason|clean/ },
    { part: 'rinse', test: /rinse|wash/ },
    { part: 'dry', test: /dry/ },
  ],
  tags: {
    fill: { at: [38, 52], align: 'center' },
    immerse: { at: [105, 84], align: 'center' },
    sonicate: { at: [105, 214], align: 'center' },
    rinse: { at: [214, 56], align: 'center' },
    dry: { at: [216, 140], align: 'center' },
  },
};

export default ultrasonicBath;
