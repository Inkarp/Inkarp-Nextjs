"use client";

import Image from "next/image";
import { useRef } from "react";
import Eyebrow from "@/components/our-story-preview/Eyebrow";
import { useScrollFrame } from "@/components/our-story-preview/motion";
import styles from "./TeamDarkroom.module.css";

const TEAM_PHOTO = "/assets/our-story/inkarp-team.webp";

/**
 * Our Story's last section: the whole Inkarp team, shown like a print being
 * developed in a darkroom. While the section is pinned, scrolling opens a
 * strip around the line of people to the full photo, brings the image up out
 * of the blank paper and turns it from black-and-white to colour as the red
 * safelight fades. With reduced motion the finished photo is shown.
 */
export default function TeamDarkroom() {
  const ref = useRef(null);
  const reduced = useScrollFrame(ref, (progress, element) => element.style.setProperty("--p", progress.toFixed(4)));

  return (
    <section aria-labelledby="team-photo-heading" className={`${styles.room} ${reduced ? "" : "h-[230vh]"}`} ref={ref}>
      <div className={`${styles.stage} ${reduced ? "relative pb-16 sm:pb-20" : "sticky top-0 flex h-svh items-center"}`}>
        {/* A wider column than the page's usual 1180px, so the photo can be bigger. */}
        <div className="relative mx-auto w-full max-w-[1340px] px-4 pb-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 sm:mb-8">
            <div>
              <Eyebrow light>Our Team</Eyebrow>
              <h2 className="mt-3 text-[30px] leading-[1.05] tracking-tight text-white sm:text-5xl" id="team-photo-heading">
                The people behind the story.
              </h2>
            </div>
            <p className={`${styles.after} max-w-md text-[15px] leading-relaxed text-white/70`}>
              Every chapter of Inkarp&apos;s story was written by the people in this photograph.
            </p>
          </div>

          <div className={styles.frame}>
            <div className={styles.print}>
              <Image alt="The Inkarp team together outdoors" className={styles.photo} fill sizes="(min-width: 1180px) 1116px, 100vw" src={TEAM_PHOTO} />
            </div>
            <span aria-hidden="true" className={`${styles.edge} ${styles.edgeTop}`} />
            <span aria-hidden="true" className={`${styles.edge} ${styles.edgeBottom}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
