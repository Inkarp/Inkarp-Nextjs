import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Atomic force microscope: the sample goes on the stage, the cantilever tip
// approaches the surface, the laser tracks the cantilever as the stage scans,
// the topography is imaged on screen, and its height profile is analysed.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Base, the scan head on its legs, and the screen's stand. */}
      <g data-part="frame">
        <rect height="18" rx="4" width="140" x="30" y="180" />
        <rect height="60" rx="6" width="100" x="60" y="60" />
        <path d="M66 120L56 180M154 120L164 180" />
        <path d="M210 120v8M198 128h24" />
      </g>

      {/* The stage and the sample on it, scanning gently side to side. */}
      <g className={styles.rock}>
        <rect data-part="frame" height="12" width="60" x="70" y="168" />
        <g {...part('mount')}>
          <g className={styles.lower} style={{ '--lower': '-12px' }}>
            <rect height="6" width="36" x="82" y="162" />
            <path className={styles.liquid} d="M84 162q4-3 8 0t8 0t8 0t8 0z" />
          </g>
        </g>
      </g>

      {/* The cantilever and tip coming down to the surface. */}
      <g {...part('approach')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M100 120V146M100 146h18M116 146l3 9 3-9" />
        </g>
      </g>

      {/* Laser onto the cantilever, reflected to the photodetector. */}
      <g {...part('scan')}>
        <rect height="10" rx="1.5" width="10" x="74" y="76" />
        <path className={styles.flow} d="M79 86L112 144L136 86" />
        <rect height="10" rx="1.5" width="12" x="130" y="76" />
      </g>

      {/* The topography building up on screen. */}
      <g {...part('image')}>
        <rect height="96" rx="3" width="76" x="172" y="24" />
        <path className={styles.draw} d="M180 48q8-10 16 0t16 0t16 0t12 0" pathLength="100" />
        <path className={styles.draw} d="M180 60q8-6 16 0t16 0t16 0t12 0" pathLength="100" />
        <path className={styles.draw} d="M180 72q8-12 16 0t16 0t16 0t12 0" pathLength="100" />
      </g>

      {/* A height profile across the image. */}
      <g {...part('analyse')}>
        <path d="M180 112h60" />
        <path className={styles.draw} d="M180 108l8-14 8 10 8-18 8 16 8-8 8 10 12-4" pathLength="100" />
      </g>
    </>
  );
}

const afm = {
  Drawing,
  parts: [
    { part: 'mount', test: /mount|sample|place|load/ },
    { part: 'approach', test: /approach|engage|tip/ },
    { part: 'scan', test: /scan|raster/ },
    { part: 'image', test: /image|map/ },
    { part: 'analyse', test: /analy|measur/ },
  ],
  tags: {
    mount: { at: [62, 160], align: 'end' },
    approach: { at: [128, 140], align: 'start' },
    scan: { at: [108, 48], align: 'center' },
    image: { at: [210, 12], align: 'center' },
    analyse: { at: [210, 140], align: 'center' },
  },
};

export default afm;
