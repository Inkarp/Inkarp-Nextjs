import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// UV/VIS spectrophotometer: measure a blank, load the sample cuvette, the beam
// passes through it to the detector, the absorbance is calculated, and the
// report is printed.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Body, optical bench window, cuvette slot, and the screen on its stand. */}
      <g data-part="frame">
        <rect height="88" rx="8" width="196" x="22" y="112" />
        <rect height="60" rx="4" width="176" x="32" y="126" />
        <path d="M108 126v-6h24v6M190 88v24" />
      </g>

      {/* The blank: a cuvette of solvent alone. */}
      <g {...part('blank')}>
        <rect height="32" rx="2" width="14" x="44" y="80" />
        <path d="M44 88h14" />
      </g>

      {/* The sample cuvette lowered into the beam. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-34px' }}>
          <rect height="40" rx="2" width="16" x="112" y="132" />
          <path className={styles.liquid} d="M112 148h16v22a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2z" />
        </g>
      </g>

      {/* Lamp, light beam and detector. */}
      <g {...part('measure')}>
        <circle cx="50" cy="156" r="8" />
        <path className={styles.glow} d="M50 142v-4M50 170v4M36 156h-4" />
        <path className={styles.flow} d="M60 156H186" />
        <rect height="20" rx="2" width="12" x="186" y="146" />
      </g>

      {/* The spectrum worked out on the screen. */}
      <g {...part('calculate')}>
        <rect height="54" rx="4" width="80" x="150" y="34" />
        <path className={styles.draw} d="M158 80c8 0 10-30 18-30s10 22 18 18 10-8 28-8" pathLength="100" />
      </g>

      {/* The printed report. */}
      <g {...part('report')}>
        <g className={styles.feed}>
          <path d="M222 140h22v34h-22z" />
          <path d="M226 148h14M226 154h14M226 160h9" />
        </g>
      </g>
    </>
  );
}

const uvVis = {
  Drawing,
  // "Measure Absorbance" is checked before "load", "Load Sample" before "blank".
  parts: [
    { part: 'blank', test: /blank|reference|zero|baseline/ },
    { part: 'measure', test: /measur|absorb|scan/ },
    { part: 'load', test: /load|sample|cuvette|insert/ },
    { part: 'calculate', test: /calculat|concentrat|result/ },
    { part: 'report', test: /report|print|record/ },
  ],
  tags: {
    blank: { at: [51, 70], align: 'center' },
    load: { at: [104, 104], align: 'end' },
    measure: { at: [120, 214], align: 'center' },
    calculate: { at: [190, 24], align: 'center' },
    report: { at: [233, 186], align: 'center' },
  },
};

export default uvVis;
