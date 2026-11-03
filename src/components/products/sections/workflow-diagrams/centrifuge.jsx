import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Centrifuge, lid open: tubes go into the rotor, the opposite tube balances
// it, speed and time are set on the panel, the rotor spins, and the tube comes
// out with its pellet.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Body (top, front and side), feet, the open lid and the chamber. */}
      <g data-part="frame">
        <path d="M22 128L40 112H218L200 128Z" />
        <path d="M22 128V190a6 6 0 0 0 6 6H194a6 6 0 0 0 6-6V128M200 190L218 174V112" />
        <path d="M36 196v6M186 196v6" />
        <path d="M40 112L58 56H236L218 112M130 64h40" />
        <ellipse cx="120" cy="120" rx="62" ry="6.5" />
        <path d="M36 136h40" />
      </g>

      {/* A tube lowered into the rotor. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-20px' }}>
          <path d="M74 96V116a4 4 0 0 0 8 0V96M73 96h10" />
          <path className={styles.liquid} d="M74 106h8v10a4 4 0 0 1-8 0z" />
        </g>
      </g>

      {/* The opposite tube, filled to the same level. */}
      <g {...part('balance')}>
        <path d="M158 96V116a4 4 0 0 0 8 0V96M157 96h10" />
        <path className={styles.liquid} d="M158 106h8v10a4 4 0 0 1-8 0z" />
        <path className={styles.blink} d="M86 106H154" strokeDasharray="2 3" />
      </g>

      {/* Speed and time set on the panel. */}
      <g {...part('set')}>
        <rect height="18" rx="2" width="52" x="120" y="142" />
        <path className={styles.blink} d="M126 151h8M138 151h8M150 151h16" />
        <circle className={styles.press} cx="130" cy="176" r="4" />
        <circle cx="146" cy="176" r="4" />
        <circle cx="162" cy="176" r="4" />
      </g>

      {/* The rotor spinning. */}
      <g {...part('spin')}>
        <ellipse className={styles.turn} cx="120" cy="120" rx="48" ry="4.6" />
        <ellipse cx="120" cy="120" rx="5" ry="1.6" />
      </g>

      {/* The spun tube lifted out into the rack, pellet at the bottom. */}
      <g {...part('recover')}>
        <path d="M-6 172h24M-4 172v24M16 172v24" />
        <g className={styles.lower} style={{ '--lower': '10px' }}>
          <path d="M2 146V170a4 4 0 0 0 8 0V146M1 146h10" />
          <path className={styles.liquid} d="M2 154h8v12h-8z" />
          <path d="M4 171h4M3.5 168h5" />
        </g>
      </g>
    </>
  );
}

const centrifuge = {
  Drawing,
  // "Recover Sample" is checked before "load", "Set Speed & Time" before "spin".
  parts: [
    { part: 'recover', test: /recover|unload|remove|collect/ },
    { part: 'balance', test: /balanc/ },
    { part: 'set', test: /set|speed|time|program/ },
    { part: 'spin', test: /spin|run|centrifug/ },
    { part: 'load', test: /load|tube|sample/ },
  ],
  tags: {
    load: { at: [70, 88], align: 'end' },
    balance: { at: [172, 92], align: 'start' },
    set: { at: [146, 214], align: 'center' },
    spin: { at: [120, 80], align: 'center' },
    recover: { at: [-6, 132], align: 'start' },
  },
};

export default centrifuge;
