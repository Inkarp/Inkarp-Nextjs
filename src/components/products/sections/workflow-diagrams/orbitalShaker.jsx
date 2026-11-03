import { ShakerDrawing } from './shakerBase';

// Orbital shaker: flasks on a platform that circles.
function Drawing({ on }) {
  return <ShakerDrawing load="flasks" motion="orbit" on={on} />;
}

const orbitalShaker = {
  Drawing,
  // "Unload" is checked before "load".
  parts: [
    { part: 'shake', test: /shake|rock|wave|vibrat/ },
    { part: 'unload', test: /unload|remove/ },
    { part: 'load', test: /load|sample|place/ },
    { part: 'set', test: /set|speed|angle/ },
    { part: 'monitor', test: /monitor|time|record/ },
  ],
  tags: {
    load: { at: [70, 96], align: 'center' },
    set: { at: [176, 214], align: 'center' },
    shake: { at: [170, 96], align: 'center' },
    monitor: { at: [80, 214], align: 'center' },
    unload: { at: [-6, 160], align: 'start' },
  },
};

export default orbitalShaker;
