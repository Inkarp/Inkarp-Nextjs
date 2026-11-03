import { ShakerDrawing } from './shakerBase';

// Vibrating plate shaker: microplates on a platform that vibrates fast.
function Drawing({ on }) {
  return <ShakerDrawing load="plates" motion="vibrate" on={on} />;
}

const plateShaker = {
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

export default plateShaker;
