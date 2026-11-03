import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Blender-mixer (Blixer): the ingredients go in through the lid, the blade
// cuts them, the bowl blends them, they are emulsified to a smooth texture,
// and the batch is poured off into a container.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The motor base, feet, bowl, lid, feed tube and handle. */}
      <g data-part="frame">
        <rect height="46" rx="8" width="100" x="60" y="150" />
        <path d="M74 196v5M146 196v5" />
        <path d="M70 150V80h80v70M66 80h88M100 80V60h20v20M150 96h12v30h-12" />
      </g>

      {/* Ingredients dropping in through the feed tube. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-20px' }}>
          <path d="M104 64h6v6h-6zM112 70h5v5h-5zM106 74h5v5h-5z" />
        </g>
      </g>

      {/* The blade cutting. */}
      <g {...part('cut')}>
        <path d="M110 150V128" />
        <path className={styles.spinBar} d="M84 132h52" />
      </g>

      {/* The batch blending round the bowl, the speed knob. */}
      <g {...part('blend')}>
        <path className={styles.flow} d="M76 110q34 12 68 0" />
        <circle cx="140" cy="172" r="7" />
        <path className={styles.whirl} d="M140 166v12M134 172h12" />
      </g>

      {/* The mix emulsified smooth. */}
      <g {...part('emulsify')}>
        <path className={styles.liquid} d="M72 116q38 10 76 0v32H72z" />
        <circle className={styles.rise} cx="92" cy="140" r="1.4" />
        <circle className={`${styles.rise} ${styles.later}`} cx="126" cy="138" r="1.4" />
      </g>

      {/* The batch poured off into the container. */}
      <g {...part('discharge')}>
        <path d="M162 140h22l-4 6h-14" />
        <circle className={styles.drop} cx="182" cy="150" r="1.6" style={{ '--fall': '18px' }} />
        <path d="M176 196v-26a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v26z" />
        <path className={styles.liquid} d="M176 182h36v14h-36z" />
      </g>
    </>
  );
}

const blixer = {
  Drawing,
  // "Discharge" is checked before "load" ("charge").
  parts: [
    { part: 'discharge', test: /discharg|unload|pour/ },
    { part: 'load', test: /load|add|feed/ },
    { part: 'cut', test: /cut|chop/ },
    { part: 'blend', test: /blend|mix/ },
    { part: 'emulsify', test: /emulsif|homogen/ },
  ],
  tags: {
    load: { at: [110, 46], align: 'center' },
    cut: { at: [40, 138], align: 'center' },
    blend: { at: [40, 108], align: 'center' },
    emulsify: { at: [110, 214], align: 'center' },
    discharge: { at: [196, 126], align: 'center' },
  },
};

export default blixer;
