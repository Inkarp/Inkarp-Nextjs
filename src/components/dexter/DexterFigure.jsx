import Image from "next/image";
import { DEXTER_ART, DEXTER_MOODS, DEXTER_POSES, dexterArt, dexterFigureRatio } from "@/data/dexter";
import styles from "./Dexter.module.css";

// Confetti pieces flung round a circle; rounded so the server and the browser agree.
const CONFETTI = Array.from({ length: 14 }, (_, index) => {
  const angle = (index / 14) * Math.PI * 2;
  return { x: `${Math.round(Math.cos(angle) * 90)}px`, y: `${Math.round(Math.sin(angle) * 70 - 50)}px`, delay: `${(index % 4) * 40}ms` };
});

/** A mood's prop drawn beside Dexter: thinking dots, a question mark, a drop, a spark or confetti. */
export function DexterProp({ mood }) {
  const prop = DEXTER_MOODS[mood]?.prop;
  if (prop === "dots") {
    return (
      <span aria-hidden="true" className={`${styles.prop} ${styles.dots}`}>
        <b />
        <b />
        <b />
      </span>
    );
  }
  if (prop === "question") return <span aria-hidden="true" className={`${styles.prop} ${styles.question}`}>?</span>;
  if (prop === "spark") return <span aria-hidden="true" className={`${styles.prop} ${styles.spark}`}>!</span>;
  if (prop === "drop") return <span aria-hidden="true" className={`${styles.prop} ${styles.drop}`} />;
  if (prop === "confetti") {
    return (
      <span aria-hidden="true" className={`${styles.prop} ${styles.confetti}`}>
        {CONFETTI.map((piece, index) => (
          <i key={index} style={{ "--x": piece.x, "--y": piece.y, animationDelay: piece.delay }} />
        ))}
      </span>
    );
  }
  return null;
}

/** Full-figure Dexter in a mood (or a pose). `decorative` when the text beside him says it all. */
export default function DexterFigure({ mood = "hello", height = 260, decorative = false, priority = false, className = "" }) {
  const width = Math.round(height * dexterFigureRatio(mood));
  const label = (DEXTER_MOODS[mood]?.label ?? DEXTER_POSES[mood] ?? "").toLowerCase();
  return (
    <span className={`${styles.dexter} ${className}`} data-mood={mood} style={{ height, width }}>
      <Image
        alt={decorative ? "" : `${DEXTER_ART.alt}, ${label}`}
        height={height}
        loading={priority ? "eager" : undefined}
        priority={priority}
        src={dexterArt(mood, "figure")}
        style={{ height: "100%", width: "auto" }}
        width={width}
      />
      <DexterProp mood={mood} />
    </span>
  );
}
