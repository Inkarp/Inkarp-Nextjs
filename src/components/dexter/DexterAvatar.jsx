import Image from "next/image";
import { DEXTER_ART, dexterArt } from "@/data/dexter";
import styles from "./Dexter.module.css";

/** Dexter's head and shoulders in a red ring: chat, tip cards, form reactions. */
export default function DexterAvatar({ size = 44, mood = "hello", decorative = true, className = "" }) {
  return (
    <span className={`${styles.dexter} ${styles.avatar} shrink-0 ${className}`} data-mood={mood} style={{ height: size, width: size }}>
      <Image alt={decorative ? "" : DEXTER_ART.alt} height={size} src={dexterArt(mood, "bust")} style={{ height: "100%", width: "100%", objectFit: "cover" }} width={size} />
    </span>
  );
}
