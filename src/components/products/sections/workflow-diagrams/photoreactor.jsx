import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Photoreactor / illuminator: the sample (vials or a well plate) goes on the
// stage, the wavelength is dialled in, the lamps irradiate it, the reaction
// runs, and the result is analysed on screen.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The enclosure, its open front and the sample stage. */}
      <g data-part="frame">
        <rect height="146" rx="6" width="140" x="30" y="50" />
        <path d="M44 196v5M156 196v5" />
        <rect height="86" rx="3" width="120" x="40" y="100" />
        <rect height="6" width="60" x="70" y="170" />
      </g>

      {/* The plate of samples set on the stage. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <rect height="10" rx="1.5" width="48" x="76" y="160" />
          <path d="M82 165h0M90 165h0M98 165h0M106 165h0M114 165h0M120 165h0" strokeWidth="3" />
        </g>
      </g>

      {/* The wavelength dial and its reading. */}
      <g {...part('set')}>
        <circle cx="196" cy="90" r="14" />
        <path className={styles.whirl} d="M196 78v24M184 90h24" />
        <rect height="14" rx="2" width="32" x="180" y="110" />
        <path className={styles.blink} d="M185 117h8M197 117h10" />
      </g>

      {/* The lamp bar shining down on the samples. */}
      <g {...part('irradiate')}>
        <rect height="14" rx="2" width="100" x="50" y="60" />
        <path d="M60 67h0M75 67h0M90 67h0M105 67h0M120 67h0M135 67h0" strokeWidth="3" />
        <path className={styles.glow} d="M70 78l-6 76M100 78v76M130 78l6 76" />
      </g>

      {/* The reaction running in the wells. */}
      <g {...part('react')}>
        <circle className={styles.rise} cx="88" cy="158" r="1.4" />
        <circle className={`${styles.rise} ${styles.later}`} cx="102" cy="156" r="1.4" />
        <circle className={styles.rise} cx="114" cy="158" r="1.4" />
      </g>

      {/* The result analysed on screen. */}
      <g {...part('analyse')}>
        <rect height="50" rx="3" width="64" x="182" y="140" />
        <path className={styles.draw} d="M188 182c8 0 10-28 18-28s8 20 16 16 8-6 18-6" pathLength="100" />
      </g>
    </>
  );
}

const photoreactor = {
  Drawing,
  parts: [
    { part: 'load', test: /load|sample|place/ },
    { part: 'set', test: /set|wavelength|select/ },
    { part: 'irradiate', test: /irradiat|illuminat|expos/ },
    { part: 'react', test: /react|convert/ },
    { part: 'analyse', test: /analy|measur/ },
  ],
  tags: {
    load: { at: [100, 208], align: 'center' },
    set: { at: [196, 64], align: 'center' },
    irradiate: { at: [100, 38], align: 'center' },
    react: { at: [44, 146], align: 'start' },
    analyse: { at: [214, 204], align: 'center' },
  },
};

export default photoreactor;
