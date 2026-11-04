import styles from "./FlaskJourney.module.css";

/**
 * What carries the sample down the homepage (FlaskJourney): glassware and
 * glass icons drawn alike in a 120 × 130 box, each standing on the same base
 * line (y 126) so they share the same stand: the Erlenmeyer flask of the
 * opening animation (LabIntro), a beaker, a wrench (service), a map pin
 * (location), a calendar (events) and a volumetric flask (FLASK_STOPS in
 * FlaskDock).
 * How full a vessel is comes from the CSS number `--flask-fill` (0 empty, 1
 * up to its `range`) and the tilt of its surface from `--flask-slosh`, both
 * set by whoever holds it (FlaskDock or the travelling flask). `uid` keeps
 * the gradient and clip ids of each copy apart.
 */

// For each: its inside (`body`, which also clips the liquid; `evenodd` when
// it has a hole), the drawn outline, its fine lines (graduations, dates, the
// calibration ring), the highlight down the glass, any solid glass (`solid`:
// a stopper), a `transform` for the drawing (not the liquid, which stays
// level), where the liquid's surface sits when empty (`bottom`) and how far
// it rises when full (`range`), and where its bubbles rise (x).
export const VESSELS = {
  erlenmeyer: {
    body: "M47 12V50L15 110Q10 124 25 126H95Q110 124 105 110L73 50V12Z",
    outline: "M47 12V50L15 110Q10 124 25 126H95Q110 124 105 110L73 50V12M41 12H79",
    marks: "M78 72h6M86 88h6M94 104h6",
    glint: "M42 63 27 93",
    bottom: 126,
    range: 70,
    bubbles: [48, 67, 57, 40, 74, 52, 63],
  },
  beaker: {
    body: "M24 30V117Q24 126 33 126H87Q96 126 96 117V30Z",
    outline: "M17 25Q22 26 24 31V117Q24 126 33 126H87Q96 126 96 117V29Q96 26 100 26",
    marks: "M32 104h9M32 88h5M32 72h9M32 56h5",
    glint: "M87 42V108",
    bottom: 126,
    range: 86,
    bubbles: [50, 72, 61, 40, 80, 55, 67],
  },
  // Service: a wrench, drawn upright and tipped over like the usual icon
  // (the liquid stays level inside it).
  wrench: {
    body: "M52 56.5V116A8 8 0 0 0 68 116V56.5A22 22 0 0 0 67 15.1V30A7 7 0 0 1 53 30V15.1A22 22 0 0 0 52 56.5Z",
    outline: "M52 56.5V116A8 8 0 0 0 68 116V56.5A22 22 0 0 0 67 15.1V30A7 7 0 0 1 53 30V15.1A22 22 0 0 0 52 56.5Z",
    marks: "",
    glint: "M56.5 64V106",
    transform: "translate(0 12) rotate(40 60 70)",
    bottom: 126,
    range: 91,
    bubbles: [42, 50, 46, 38, 54, 44, 48],
  },
  // Location: a map pin, its hole left clear, standing on its point.
  pin: {
    body: "M60 126C52 112 26 88 26 56A34 34 0 0 1 94 56C94 88 68 112 60 126ZM73 56A13 13 0 1 0 47 56A13 13 0 1 0 73 56Z",
    outline: "M60 126C52 112 26 88 26 56A34 34 0 0 1 94 56C94 88 68 112 60 126ZM73 56A13 13 0 1 0 47 56A13 13 0 1 0 73 56Z",
    marks: "",
    glint: "M35 50Q37 35 49 28",
    evenodd: true,
    bottom: 126,
    range: 102,
    bubbles: [44, 74, 58, 36, 82, 50, 66],
  },
  // Events: a calendar page, with its rings, header and dates.
  calendar: {
    body: "M28 30H92Q102 30 102 40V116Q102 126 92 126H28Q18 126 18 116V40Q18 30 28 30Z",
    outline: "M28 30H92Q102 30 102 40V116Q102 126 92 126H28Q18 126 18 116V40Q18 30 28 30ZM18 52H102M40 18V40M80 18V40",
    marks: "M32 70h10M55 70h10M78 70h10M32 88h10M55 88h10M78 88h10M32 106h10M55 106h10",
    glint: "M25 62V112",
    bottom: 126,
    range: 72,
    bubbles: [36, 82, 58, 30, 90, 46, 70],
  },
  volumetric: {
    body: "M54 12V72.7A27 27 0 1 0 66 72.7V12Z",
    outline: "M50 12H70M54 12V72.7A27 27 0 1 0 66 72.7V12",
    // The stopper, and the calibration ring it is filled to.
    solid: "M52 12V6Q52 3 55 3H65Q68 3 68 6V12Z",
    marks: "M51 34H69",
    glint: "M42 88Q38 99 42 110",
    bottom: 126,
    range: 92,
    bubbles: [52, 68, 60, 44, 76, 56, 64],
  },
};

// Each rises to the surface and goes: three always, four more while the
// vessel is on the move. y is below the surface.
const BUBBLES = [
  { y: 20, r: 2.2, delay: 0, duration: 2.8 },
  { y: 22, r: 1.6, delay: 1.1, duration: 2.4 },
  { y: 24, r: 2.6, delay: 1.9, duration: 3.1 },
];
const BUSY_BUBBLES = [
  { y: 14, r: 1.5, delay: 0.2, duration: 1.3 },
  { y: 17, r: 2.1, delay: 0.6, duration: 1.5 },
  { y: 12, r: 1.3, delay: 0.9, duration: 1.2 },
  { y: 19, r: 1.9, delay: 0.4, duration: 1.6 },
];

function Bubble({ bubble, x, bottom }) {
  return (
    <circle
      className={styles.bubble}
      cx={x}
      cy={bottom + bubble.y}
      r={bubble.r}
      style={{ animationDelay: `${bubble.delay}s`, animationDuration: `${bubble.duration}s` }}
    />
  );
}

export default function JourneyFlask({ uid, kind = "erlenmeyer" }) {
  const vessel = VESSELS[kind] ?? VESSELS.erlenmeyer;
  const { bottom } = vessel;
  const rule = vessel.evenodd ? "evenodd" : undefined;
  const inside = `${uid}-inside`;
  const liquid = `${uid}-liquid`;
  const glass = `${uid}-glass`;
  // Along the surface: little waves, one up and one down every 30 units, so
  // sliding the row 30 units loops it.
  const wave = `M-60 ${bottom}${"q7.5-2.6 15 0t15 0".repeat(10)}V${bottom + 3.5}H-60Z`;

  return (
    <svg aria-hidden="true" className={styles.flask} fill="none" focusable="false" viewBox="0 2 120 130">
      <defs>
        <clipPath id={inside}>
          <path clipRule={rule} d={vessel.body} transform={vessel.transform} />
        </clipPath>
        <linearGradient id={liquid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e3262f" />
          <stop offset="0.7" stopColor="#9c000e" />
          <stop offset="1" stopColor="#8f000c" />
        </linearGradient>
        <linearGradient id={glass} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f2f5f8" />
          <stop offset="1" stopColor="#e1e7ee" />
        </linearGradient>
      </defs>

      <g transform={vessel.transform}>
        <path d={vessel.body} fill={`url(#${glass})`} fillRule={rule} />
        {vessel.solid ? <path d={vessel.solid} fill={`url(#${glass})`} /> : null}
      </g>
      <g clipPath={`url(#${inside})`}>
        {/* The liquid: lifted by the fill, tipped by the slosh about its own
            surface. Wide and deep enough to cover the inside whichever way
            it tips. */}
        <g
          className={styles.liquid}
          style={{ "--flask-range": `${vessel.range}px`, transformOrigin: `60px ${bottom}px` }}
        >
          <rect fill={`url(#${liquid})`} height="110" width="240" x="-60" y={bottom} />
          <path className={styles.wave} d={wave} />
          {BUBBLES.map((bubble, index) => (
            <Bubble bottom={bottom} bubble={bubble} key={index} x={vessel.bubbles[index]} />
          ))}
          <g className={styles.busyBubbles}>
            {BUSY_BUBBLES.map((bubble, index) => (
              <Bubble bottom={bottom} bubble={bubble} key={index} x={vessel.bubbles[index + 3]} />
            ))}
          </g>
        </g>
      </g>
      <g transform={vessel.transform}>
        {vessel.marks ? <path className={styles.marks} d={vessel.marks} /> : null}
        <path className={styles.glint} d={vessel.glint} />
        {vessel.solid ? <path className={styles.outline} d={vessel.solid} /> : null}
        <path className={styles.outline} d={vessel.outline} />
      </g>
    </svg>
  );
}
