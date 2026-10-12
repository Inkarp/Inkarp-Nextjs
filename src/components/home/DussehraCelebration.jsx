import DiyaIcon from "./DiyaIcon";
import styles from "./DussehraCelebration.module.css";

const SPARKS = Array.from({ length: 16 }, (_, index) => ({
  left: `${(index * 31 + 7) % 100}%`,
  delay: `${(-index * 0.43).toFixed(2)}s`,
  duration: `${4 + (index % 4) * 0.7}s`,
}));

function BowAndArrow() {
  return (
    <svg className={styles.bow} viewBox="0 0 160 160" role="img" aria-label="Ceremonial bow and arrow">
      <circle className={styles.sunRing} cx="80" cy="80" r="70" />
      <circle className={styles.sunCore} cx="80" cy="80" r="54" />
      <g className={styles.weapon} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path className={styles.bowCurve} d="M48 18C112 42 112 118 48 142" />
        <path className={styles.bowString} d="M48 18L73 80L48 142" />
        <path className={styles.arrow} d="M22 80H130M119 68L133 80L119 92M35 73L24 80L35 87" />
      </g>
      <path className={styles.tilak} d="M77 57L80 45L83 57L80 67Z" />
    </svg>
  );
}

function Diya({ featured = false }) {
  return (
    <DiyaIcon
      className={`${styles.diya} ${featured ? styles.featuredDiya : ""}`}
      flameClassName={styles.flame}
    />
  );
}

export default function DussehraCelebration({ campaign }) {
  return (
    <div className={styles.banner}>
      <div aria-hidden="true" className={styles.garland}>
        {Array.from({ length: 30 }, (_, index) => <span key={index} />)}
      </div>
      <div aria-hidden="true" className={styles.sparks}>
        {SPARKS.map((spark, index) => (
          <i key={index} style={{ left: spark.left, animationDelay: spark.delay, animationDuration: spark.duration }} />
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.art}><BowAndArrow /></div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Team Inkarp celebrates the triumph of light</p>
          <h2 className={styles.title}>{campaign.title}</h2>
          <p className={styles.message}>{campaign.message}</p>
          <p className={styles.cheer}><span aria-hidden="true">✦</span> Shubh Vijayadashami <span aria-hidden="true">✦</span></p>
        </div>
        <div aria-hidden="true" className={styles.lamps}><Diya /><Diya featured /><Diya /></div>
      </div>
      <div aria-hidden="true" className={styles.border} />
    </div>
  );
}
