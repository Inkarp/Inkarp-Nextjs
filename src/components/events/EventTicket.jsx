import { FiCalendar, FiMapPin } from "react-icons/fi";
import styles from "./EventTicket.module.css";

/**
 * The show's details laid out as a pass ("Visit us at"): dates and venue in
 * bold on the main part, the hall and the stall number large on a red
 * tear-off stub. A design device, not an entry pass (no number or code).
 * Data: `bannerEvent` in src/data/events.js.
 */

// PMEC's soft rounded shapes (as in StageEventBanner), faint on the pass.
const SHAPES = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="52" viewBox="0 0 96 52"><rect x="3" y="5" width="42" height="18" rx="9" fill="#001e36"/><circle cx="67" cy="14" r="9" fill="#001e36"/><rect x="51" y="31" width="42" height="18" rx="9" fill="#001e36"/><circle cx="21" cy="40" r="9" fill="#001e36"/></svg>'
)}")`;

export default function EventTicket({ event, className = "", style }) {
  // "Hall 5" → "5" under its own small "Hall" label.
  const hallNumber = event.hall.replace(/^hall\s*/i, "") || event.hall;

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

        {/* Hall and stall picked out: each a small label over a large value. */}
        <div className={styles.stub}>
          <span className={styles.stubLabel}>Hall</span>
          <span className={`${styles.stubValue} text-[28px] sm:text-[30px]`}>{hallNumber}</span>
          <span aria-hidden="true" className={styles.stubRule} />
          <span className={styles.stubLabel}>Stall</span>
          <span className={`${styles.stubValue} text-[28px] sm:text-[31px]`}>{event.stallNumber}</span>
        </div>
      </div>
    </div>
  );
}
