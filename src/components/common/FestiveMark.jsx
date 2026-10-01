"use client";

import { useEffect, useState } from "react";
import DiyaIcon from "@/components/home/DiyaIcon";
import {
  getCampaignMark,
  getCampaignPreview,
  getStripCampaigns,
  todayInIndia,
} from "@/data/campaigns";
import styles from "./FestiveMark.module.css";

const MARKS = {
  diya: DiyaIcon,
};

/**
 * Small seasonal ornament beside the header logo while a campaign with a
 * `mark` runs. Every page except the homepage is built once at deploy, so the
 * date is checked in the browser; the mark is absolutely positioned, so it
 * appearing after load never moves the header. Also sets `data-festive` on
 * <html> for the CSS-only festive accents in globals.css.
 */
export default function FestiveMark() {
  const [mark, setMark] = useState(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const preview = getCampaignPreview(window.location.search);
      const slides = preview?.slides ?? getStripCampaigns(todayInIndia());
      const next = getCampaignMark(slides);
      setMark(MARKS[next] ? next : null);
      if (next) {
        document.documentElement.dataset.festive = next;
      } else {
        delete document.documentElement.dataset.festive;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!mark) return null;

  const Mark = MARKS[mark];
  return (
    <span aria-hidden="true" className={styles.mark}>
      <Mark className={styles.icon} flameClassName={styles.flame} />
    </span>
  );
}
