import { FiCpu } from "react-icons/fi";

const SIZE = 112;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** A prominent match-score ring for the solution report hero — the visual focal
 * point CPhI/Exhibitly-style itinerary reports lead with, instead of burying the
 * best-match percentage inside a small stat tile. Labelled as AI-generated so it
 * reads as a personalised model output, not a fixed catalogue attribute. */
export default function MatchScoreBadge({ score }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
        <svg className="-rotate-90" height={SIZE} width={SIZE}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            fill="none"
            r={RADIUS}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            fill="none"
            r={RADIUS}
            stroke="#f43f5e"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth={STROKE}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold leading-none text-white">{clamped}%</span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">AI Match</span>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/60">
        <FiCpu className="text-red-soft" /> AI-generated
      </span>
    </div>
  );
}
