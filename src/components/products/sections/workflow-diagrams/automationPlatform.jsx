import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Robotic synthesis / sample-prep platform: the method is programmed on the
// computer, the sample vials are loaded on the deck, the gantry head
// dispenses into the reactor block, the workflow runs (heating and stirring),
// and the finished vials are collected in the output rack.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The enclosure, its deck and the gantry rail. */}
      <g data-part="frame">
        <rect height="150" rx="6" width="160" x="36" y="40" />
        <path d="M44 190v6M188 190v6M44 164h144M44 58h144" />
      </g>

      {/* The method laid out on the computer. */}
      <g {...part('program')}>
        <rect height="56" rx="3" width="46" x="202" y="60" />
        <path className={styles.blink} d="M208 70h20M208 80h28M208 90h16M208 100h24" />
      </g>

      {/* Sample vials set into the deck rack. */}
      <g {...part('load')}>
        <rect height="8" width="40" x="48" y="156" />
        <g className={styles.lower} style={{ '--lower': '-10px' }}>
          <path d="M52 156v-16h6v16M62 156v-16h6v16M72 156v-16h6v16M82 156v-16h4v16" />
        </g>
      </g>

      {/* The gantry carriage travelling, carrying the dispensing head. */}
      <g className={styles.sweep}>
        <g {...part('run')}>
          <rect height="10" rx="2" width="28" x="106" y="54" />
        </g>
        <g {...part('dispense')}>
          <path d="M114 64h12v24h-12zM120 88v16" />
          <circle className={styles.drop} cx="120" cy="108" r="1.4" style={{ '--fall': '26px' }} />
        </g>
      </g>

      {/* The reactor block heating and stirring. */}
      <g {...part('run')}>
        <rect height="22" rx="2" width="50" x="96" y="138" />
        <path d="M104 138v-8h6v8M118 138v-8h6v8M132 138v-8h6v8" />
        <path className={styles.glow} d="M98 162h46" />
      </g>

      {/* Finished vials in the output rack. */}
      <g {...part('collect')}>
        <rect height="8" width="36" x="152" y="156" />
        <g className={styles.lower} style={{ '--lower': '-10px' }}>
          <path d="M156 156v-16h6v16M166 156v-16h6v16M176 156v-16h6v16" />
          <path className={styles.liquid} d="M156 150h6v6h-6zM166 150h6v6h-6zM176 150h6v6h-6z" />
        </g>
      </g>
    </>
  );
}

const automationPlatform = {
  Drawing,
  parts: [
    { part: 'program', test: /program|method|set ?up/ },
    { part: 'load', test: /load|sample|place/ },
    { part: 'dispense', test: /dispens|dose|add|weigh/ },
    { part: 'run', test: /run|react|execut|extract/ },
    { part: 'collect', test: /collect|recover|output/ },
  ],
  tags: {
    program: { at: [248, 46], align: 'end' },
    load: { at: [68, 124], align: 'center' },
    dispense: { at: [100, 76], align: 'end' },
    run: { at: [121, 208], align: 'center' },
    collect: { at: [170, 124], align: 'center' },
  },
};

export default automationPlatform;
