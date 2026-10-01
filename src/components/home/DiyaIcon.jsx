/**
 * Clay diya with its flame, shared by the festival strips and the header mark.
 * `flameClassName` wraps both flame layers so a design can light or flicker
 * them; keep `transform-origin: 40px 46px` (the wick) for any flame animation.
 */
export default function DiyaIcon({ className, flameClassName, style }) {
  return (
    <svg aria-hidden="true" className={className} style={style} viewBox="0 0 80 90">
      <g className={flameClassName}>
        <path d="M40 5C20 31 26 44 40 46C54 44 59 31 40 5Z" fill="#ffd46b" />
        <path d="M40 24C32 36 35 43 40 44C47 42 47 35 40 24Z" fill="#fff9d8" />
      </g>
      <path d="M8 51Q40 43 72 51Q65 79 40 80Q15 79 8 51Z" fill="#d66524" stroke="#ffcf70" strokeWidth="2" />
      <path d="M10 53Q40 64 70 53M22 66Q40 76 58 66" fill="none" stroke="#ffcf70" strokeWidth="2" />
    </svg>
  );
}
