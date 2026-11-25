import DexterFigure from "./DexterFigure";

/**
 * A whole-page Dexter moment (page not found, error, thank-you): the figure
 * in a mood beside a heading, a message and what to do next.
 */
export default function DexterMoment({ mood, label, title, children, actions, figureHeight = 280, className = "" }) {
  return (
    <div className={`grid items-end gap-6 border border-line-light bg-white p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-8 ${className}`}>
      <div className="flex justify-center rounded-sm bg-parchment-alt px-6 pt-6 sm:justify-start">
        <DexterFigure decorative height={figureHeight} mood={mood} />
      </div>
      <div className="pb-1">
        {label ? <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red">{label}</p> : null}
        <h3 className="mt-2 text-[26px] font-semibold leading-tight text-ink sm:text-[30px]">{title}</h3>
        <div className="mt-3 text-[15px] leading-relaxed text-ink-soft">{children}</div>
        {actions ? <div className="mt-5 flex flex-wrap gap-2.5">{actions}</div> : null}
      </div>
    </div>
  );
}
