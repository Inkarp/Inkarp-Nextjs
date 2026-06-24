export default function LoadingScreen({ children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {children}

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
