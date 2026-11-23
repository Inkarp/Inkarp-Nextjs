/** The site's red eyebrow label with its short rule. */
export default function Eyebrow({ children, className = "", light = false }) {
  return (
    <p className={`flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] ${light ? "text-white/80" : "text-red"} ${className}`}>
      <span aria-hidden="true" className="h-px w-6 bg-current" />
      {children}
    </p>
  );
}
