import DiyaIcon from "./DiyaIcon";
import styles from "./DiwaliCelebration.module.css";

// Fairy lights hang in four scallops across the strip. Each bulb sits on the
// same parabola as the wire's quadratic curve (y = 2 + 48·t·(1−t)), and every
// coordinate is rounded so the server and browser render identical styles.
const SCALLOPS = 4;
const BULB_COUNT = 36;
const BULBS = Array.from({ length: BULB_COUNT }, (_, i) => {
  const x = (i + 0.5) / BULB_COUNT;
  const t = (x * SCALLOPS) % 1;
  return {
    left: `${(x * 100).toFixed(2)}%`,
    top: `${(2 + 48 * t * (1 - t) - 3).toFixed(2)}px`,
  };
});
const WIRE_PATH = Array.from({ length: SCALLOPS }, (_, k) => {
  const from = (k / SCALLOPS) * 100;
  const mid = from + 50 / SCALLOPS;
  const to = ((k + 1) / SCALLOPS) * 100;
  return `${k === 0 ? `M${from} 2` : ""} Q${mid} 26 ${to} 2`;
}).join(" ");

// Fixed star positions; `--twinkle` staggers them so they never blink together.
const STARS = [
  { left: "6%", top: "58%", delay: "0s" },
  { left: "14%", top: "30%", delay: "1.2s" },
  { left: "23%", top: "70%", delay: "2.1s" },
  { left: "31%", top: "40%", delay: "0.6s" },
  { left: "68%", top: "36%", delay: "1.7s" },
  { left: "76%", top: "68%", delay: "0.3s" },
  { left: "85%", top: "32%", delay: "2.4s" },
  { left: "93%", top: "60%", delay: "1s" },
];

/** The diyas light one after another on load, left to right across the strip. */
function DiyaRow({ from, className }) {
  return (
    <div aria-hidden="true" className={`${styles.diyas} ${className}`}>
      {[0, 1, 2].map((n) => (
        <DiyaIcon
          className={styles.diya}
          flameClassName={styles.flame}
          key={n}
          style={{ "--order": from + n }}
        />
      ))}
    </div>
  );
}

export default function DiwaliCelebration({ campaign }) {
  return (
    <div className={styles.banner}>
      <div aria-hidden="true" className={styles.stars}>
        {STARS.map((star) => (
          <i key={star.left} style={{ left: star.left, top: star.top, animationDelay: star.delay }} />
        ))}
      </div>
      <div aria-hidden="true" className={styles.lights}>
        <svg className={styles.wire} preserveAspectRatio="none" viewBox="0 0 100 28">
          <path d={WIRE_PATH} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        {BULBS.map((bulb, index) => (
          <span key={index} style={bulb} />
        ))}
      </div>
      <div className={styles.content}>
        <DiyaRow className={styles.left} from={0} />
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Team Inkarp wishes you a bright &amp; joyous</p>
          <p className={styles.title}>{campaign.title}</p>
          <p className={styles.message}>{campaign.message}</p>
          <p className={styles.cheer}>
            <span aria-hidden="true">✦</span> Shubh Deepavali <span aria-hidden="true">✦</span>
          </p>
        </div>
        <DiyaRow className={styles.right} from={3} />
      </div>
      <div aria-hidden="true" className={styles.border} />
    </div>
  );
}
