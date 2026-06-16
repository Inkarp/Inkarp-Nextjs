export default function LoadingMark() {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <svg
        aria-hidden="true"
        className="h-28 w-28 sm:h-36 sm:w-36"
        fill="none"
        viewBox="0 0 220 220"
      >
        <path
          d="M185 23C209 47 170 128 98 179C53 211 18 215 13 188C6 152 54 83 111 42C145 18 174 12 185 23Z"
          pathLength="1"
          stroke="#BE0010"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="15"
          style={{
            animation: "inkarp-loader-draw 1.65s ease-in-out infinite",
            strokeDasharray: 1,
            strokeDashoffset: 1,
          }}
        />
      </svg>

      <p className="font-maxot text-sm font-bold uppercase tracking-[0.28em] text-zinc-950">
        Loading
        <span
          className="inline-block overflow-hidden align-bottom"
          style={{ animation: "loading-dot 1.2s steps(4, end) infinite" }}
        >
          ...
        </span>
      </p>

      <style>{`
        @keyframes inkarp-loader-draw {
          0% {
            stroke-dashoffset: 1;
            opacity: 0.35;
          }
          55% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -1;
            opacity: 0.35;
          }
        }

        @keyframes loading-dot {
          0% {
            width: 0;
          }
          100% {
            width: 1.5em;
          }
        }
      `}</style>
    </div>
  );
}
