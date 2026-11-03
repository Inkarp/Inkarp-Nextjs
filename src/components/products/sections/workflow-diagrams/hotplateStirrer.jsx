import { StirrerDrawing } from './magneticStirrer';

// Hotplate stirrer: the magnetic stirrer drawing with a heating plate, a
// temperature knob and a probe in the liquid.
function Drawing({ on }) {
  return <StirrerDrawing heats on={on} />;
}

const hotplateStirrer = {
  Drawing,
  // "Add Stir Bar" is checked before "stir".
  parts: [
    { part: 'stirbar', test: /bar/ },
    { part: 'place', test: /place|vessel|beaker|load/ },
    { part: 'set', test: /set|speed|temperat/ },
    { part: 'stir', test: /stir|heat|mix/ },
    { part: 'monitor', test: /monitor|read|record/ },
  ],
  tags: {
    place: { at: [120, 56], align: 'center' },
    stirbar: { at: [80, 128], align: 'end' },
    set: { at: [156, 214], align: 'center' },
    stir: { at: [164, 100], align: 'start' },
    monitor: { at: [85, 214], align: 'center' },
  },
};

export default hotplateStirrer;
