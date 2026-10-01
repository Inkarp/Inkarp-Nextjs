import { daysBetween } from "@/data/campaigns";
import DiyaIcon from "./DiyaIcon";
import styles from "./NavratriCelebration.module.css";

// One festive colour per night, used for the top band and each lamp's glow.
// Decorative only; not the published colour-of-the-day list.
const NIGHT_COLOURS = [
  "#f6c445",
  "#3fae6f",
  "#c9c3d6",
  "#f08a24",
  "#fff1d6",
  "#e5383b",
  "#4d6bff",
  "#f272b0",
  "#9b5de5",
];

function DandiyaPair({ className }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 60 60">
      <g className={styles.stickLeft}>
        <g transform="rotate(-32 30 30)">
          <rect fill="#f6c445" height="50" rx="3" width="6" x="27" y="4" />
          <rect fill="#e5383b" height="4" width="6" x="27" y="10" />
          <rect fill="#3fae6f" height="4" width="6" x="27" y="22" />
          <rect fill="#4d6bff" height="4" width="6" x="27" y="34" />
          <circle cx="30" cy="4" fill="#ffd46b" r="3" />
        </g>
      </g>
      <g className={styles.stickRight}>
        <g transform="rotate(32 30 30)">
          <rect fill="#f272b0" height="50" rx="3" width="6" x="27" y="4" />
          <rect fill="#fff1d6" height="4" width="6" x="27" y="10" />
          <rect fill="#9b5de5" height="4" width="6" x="27" y="22" />
          <rect fill="#f08a24" height="4" width="6" x="27" y="34" />
          <circle cx="30" cy="4" fill="#ffd46b" r="3" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Navratri strip: one more lamp is lit each night, counted in IST from the
 * campaign's `start`. A `finale` entry (Dussehra) shows every lamp lit.
 */
export default function NavratriCelebration({ campaign, today }) {
  const nights = campaign.nights ?? NIGHT_COLOURS.length;
  const night = campaign.finale
    ? nights
    : Math.min(nights, Math.max(1, daysBetween(campaign.start, today ?? campaign.start) + 1));

  return (
    <div className={styles.banner}>
      <div aria-hidden="true" className={styles.band}>
        {NIGHT_COLOURS.slice(0, nights).map((colour) => (
          <span key={colour} style={{ background: colour }} />
        ))}
      </div>
      <div className={styles.content}>
        <DandiyaPair className={styles.dandiya} />
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            {campaign.finale ? "Vijayadashami · Team Inkarp wishes you" : "Inkarp wishes you & your family"}
          </p>
          <p className={styles.title}>{campaign.title}</p>
          <p className={styles.message}>{campaign.message}</p>
        </div>
        <div className={styles.nights}>
          <ol aria-hidden="true" className={styles.lamps}>
            {NIGHT_COLOURS.slice(0, nights).map((colour, index) => {
              const lampNight = index + 1;
              // On the finale every lamp is simply lit; no single "tonight".
              const state = campaign.finale || lampNight < night
                ? styles.lit
                : lampNight === night
                  ? styles.tonight
                  : styles.unlit;
              return (
                <li className={state} key={colour} style={{ "--lamp": colour }}>
                  <DiyaIcon className={styles.lamp} flameClassName={styles.flame} />
                </li>
              );
            })}
          </ol>
          <p className={styles.count}>
            {campaign.finale ? "All nine nights" : `Night ${night} of ${nights}`}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className={styles.border} />
    </div>
  );
}
