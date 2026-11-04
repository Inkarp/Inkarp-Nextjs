import styles from "./FlaskJourney.module.css";

/**
 * The glassware that carries the sample down the homepage
 * (FlaskJourney): six vessels drawn alike in a 120 × 130 box, each standing
 * on the same base line (y 126) so they share the same stand. The first is
 * the Erlenmeyer flask of the opening animation (LabIntro).
 * How full a vessel is comes from the CSS number `--flask-fill` (0 empty, 1
 * up to its `range`) and the tilt of its surface from `--flask-slosh`, both
 * set by whoever holds it (FlaskDock or the travelling flask). `uid` keeps
 * the gradient and clip ids of each copy apart.
 */

// For each vessel: its inside (`body`, which also clips the liquid), the
// drawn outline, its fine lines (graduations, a ground-glass joint, the
// calibration ring), the highlight down the glass, any solid glass
// (`solid`: a foot, a stopper), where the liquid's surface sits when empty
// (`bottom`) and how far it rises when full (`range`), and where its bubbles
// rise (x across the inside).
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
  testTube: {
    body: "M46 12V112A14 14 0 0 0 74 112V12Z",
    outline: "M42 12H78M46 12V112A14 14 0 0 0 74 112V12",
    marks: "",
    glint: "M52 26V104",
    bottom: 126,
    range: 104,
    bubbles: [56, 65, 60, 52, 68, 57, 63],
  },
  roundBottom: {
    body: "M52 12V63A32 32 0 1 0 68 63V12Z",
    outline: "M48 12H72M52 12V63A32 32 0 1 0 68 63V12",
    // The ground-glass joint at the top of the neck.
    marks: "M52 19H68M52 25H68",
    glint: "M39 80Q34 92 37 105",
    bottom: 126,
    range: 60,
    bubbles: [50, 70, 60, 42, 78, 55, 65],
  },
  cylinder: {
    body: "M46 14V119H74V14Z",
    outline: "M41 11Q45 12 46 16V119M74 119V13H78",
    solid: "M32 126H88L83 119H37Z",
    marks: "M50 28h9M50 40h5M50 52h9M50 64h5M50 76h9M50 88h5M50 100h9M50 112h5",
    glint: "M69 24V110",
    bottom: 119,
    range: 101,
    bubbles: [56, 66, 61, 52, 70, 58, 64],
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
          <path d={vessel.body} />
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

      <path d={vessel.body} fill={`url(#${glass})`} />
      {vessel.solid ? <path d={vessel.solid} fill={`url(#${glass})`} /> : null}
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
      {vessel.marks ? <path className={styles.marks} d={vessel.marks} /> : null}
      <path className={styles.glint} d={vessel.glint} />
      {vessel.solid ? <path className={styles.outline} d={vessel.solid} /> : null}
      <path className={styles.outline} d={vessel.outline} />
    </svg>
  );
}
