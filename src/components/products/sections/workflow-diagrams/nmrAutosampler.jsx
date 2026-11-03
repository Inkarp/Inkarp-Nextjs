import { NmrDrawing } from './benchtopNmr';

// Benchtop NMR with its autosampler: a rack of tubes, a queue on the tablet,
// and a gripper that inserts and ejects each tube in turn.
function Drawing({ on }) {
  return <NmrDrawing auto on={on} />;
}

const nmrAutosampler = {
  Drawing,
  // "Auto-Insert" is checked before "load"; "Eject" first of all.
  parts: [
    { part: 'eject', test: /eject|remove|return/ },
    { part: 'insert', test: /insert/ },
    { part: 'load', test: /load|rack/ },
    { part: 'queue', test: /queue|schedul/ },
    { part: 'acquire', test: /acquir|scan|measur/ },
  ],
  tags: {
    load: { at: [212, 90], align: 'center' },
    queue: { at: [80, 26], align: 'center' },
    insert: { at: [134, 62], align: 'end' },
    acquire: { at: [214, 150], align: 'center' },
    eject: { at: [184, 10], align: 'center' },
  },
};

export default nmrAutosampler;
