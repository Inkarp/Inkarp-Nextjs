import { FiCalendar, FiMapPin } from "react-icons/fi";
import styles from "./EventTicket.module.css";

/**
 * The show's details laid out as a pass ("Visit us at"): dates and venue in
 * bold on the main part, the hall and stall number on a red tear-off stub. A design device, not an
 * entry pass (no number or code). Data: `bannerEvent` in src/data/events.js.
 */

// PMEC's soft rounded shapes (as in StageEventBanner), faint on the pass.
const SHAPES = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="52" viewBox="0 0 96 52"><rect x="3" y="5" width="42" height="18" rx="9" fill="#001e36"/><circle cx="67" cy="14" r="9" fill="#001e36"/><rect x="51" y="31" width="42" height="18" rx="9" fill="#001e36"/><circle cx="21" cy="40" r="9" fill="#001e36"/></svg>'
)}")`;

export default function EventTicket({ event, className = "", style }) {
  return (
    <div className={`${styles.wrap} ${className} w-full max-w-[470px]`} style={style}>
      <div className={styles.ticket}>
        <div className={styles.main} style={{ "--ticket-shapes": SHAPES }}>
          <p className="text-lg font-bold leading-tight tracking-tight">Visit us at</p>
          {/* The details picked out: bold values beside red icon chips. */}
          <dl className="mt-3 grid gap-3">
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-red/10">
                <FiCalendar aria-hidden="true" className="size-4 text-red" />
              </span>
              <div>
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#457ca3]">Dates</dt>
                <dd className="text-[16px] font-bold leading-snug">{event.dateLabel}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-red/10">
                <FiMapPin aria-hidden="true" className="size-4 text-red" />
              </span>
              <div>
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#457ca3]">Venue</dt>
                <dd className="text-[14.5px] font-bold leading-snug">{event.venue}</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className={styles.stub}>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white">{event.hall}</span>
          <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/75">Stall</span>
          <span className="font-mono text-[30px] font-bold leading-none tracking-tight sm:text-[32px]">{event.stallNumber}</span>
        </div>
      </div>
    </div>
  );
}
