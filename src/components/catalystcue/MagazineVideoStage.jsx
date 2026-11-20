"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiPause, FiPlay } from "react-icons/fi";
import { ease, sectionProgress, useReducedMotion } from "./magazineMotion";
import styles from "./MagazineVideoStage.module.css";

// The latest issue's post-launch film (Volume 03 · Issue 02, October 2026),
// H.264 with no sound track (it always plays muted), faststart for quick play:
// 1080p for wide screens, 720p for small ones, and a still of its title card
// shown while it loads.
const VIDEO_1080 = "/assets/catalyst/videos/post-launch-V3I2.mp4";
const VIDEO_720 = "/assets/catalyst/videos/post-launch-V3I2-720.mp4";
const POSTER = "/assets/catalyst/videos/post-launch-V3I2-poster.webp";

// Same condition as the wide-screen block in the stylesheet.
const WIDE_QUERY = "(min-width: 768px) and (min-aspect-ratio: 21/20)";

/**
 * Where the frame ends up (true 16:9, laid out at that size) and the transform
 * that puts it at its start: covering the screen on wide screens, full width
 * and centred on tall ones. Written to CSS variables on the stage.
 */
function layOut(stage, sticky) {
  const vw = sticky.clientWidth;
  const vh = sticky.clientHeight;
  if (!vw || !vh) return;
  const wide = window.matchMedia(WIDE_QUERY).matches;
  let fw, fx, fy, s0, lx, lw, ly;

  if (wide) {
    const side = Math.max(20, vw * 0.04);
    fw = Math.min(vw * 0.58, ((vh - 120) * 16) / 9);
    fx = side;
    fy = (vh - (fw * 9) / 16) / 2;
    s0 = Math.max(vw / fw, vh / ((fw * 9) / 16));
    lx = fx + fw + Math.max(28, vw * 0.035);
    lw = vw - lx - side;
    ly = 0;
  } else {
    fw = Math.min(vw - 32, 760);
    fx = (vw - fw) / 2;
    fy = Math.max(16, vh * 0.06);
    s0 = vw / fw;
    lx = fx;
    lw = fw;
    ly = fy + (fw * 9) / 16 + 20;
  }
  const fh = (fw * 9) / 16;
  const values = {
    "--fw": `${fw}px`,
    "--fh": `${fh}px`,
    "--fx": `${fx}px`,
    "--fy": `${fy}px`,
    "--s0": s0.toFixed(4),
    "--tx0": ((vw - fw * s0) / 2 - fx).toFixed(2),
    "--ty0": ((vh - fh * s0) / 2 - fy).toFixed(2),
    "--lx": `${lx}px`,
    "--lw": `${lw}px`,
    "--ly": `${ly}px`,
  };
  Object.entries(values).forEach(([name, value]) => stage.style.setProperty(name, value));
}

/**
 * The CATALYSTCue opening banner. The magazine film, with no text over it,
 * always at its true 16:9 shape. Wide screens: it starts full screen and
 * settles into a frame on the left as the latest issue swings in on the right.
 * Tall screens (phones, portrait tablets): it starts full width, uncropped,
 * then moves up as the latest issue rises in beneath it. One scroll-scrubbed
 * handover written to CSS variables; re-measured on any resize or rotation.
 * The film pauses while the banner is off screen. Reduced motion shows the
 * film and the issue as a still block.
 *
 * `insideHref`: where "N articles inside" points (omit to hide that button).
 */
export default function MagazineVideoStage({ latest, insideHref }) {
  const stageRef = useRef(null);
  const stickyRef = useRef(null);
  const videoRef = useRef(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const sticky = stickyRef.current;
    if (!stage || !sticky) return undefined;
    if (reduced) {
      stage.style.setProperty("--e", "1");
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      stage.style.setProperty("--e", ease(sectionProgress(stage)).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const relayout = () => {
      layOut(stage, sticky);
      schedule();
    };
    relayout();
    const resizer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(relayout);
    resizer?.observe(sticky);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", relayout);
    return () => {
      resizer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", relayout);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  // Pause the film while the banner is off screen (saves battery and data);
  // resume when it comes back, unless the visitor paused it.
  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
      } else if (!userPaused.current) {
        video.play().catch(() => {});
      }
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      userPaused.current = true;
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <section className={`${styles.stage} ${reduced ? styles.isStatic : ""}`} data-scroll-skip ref={stageRef}>
      <div className={styles.sticky} ref={stickyRef}>
        <div className={styles.frame}>
          <video autoPlay className={styles.video} loop muted playsInline poster={POSTER} preload="auto" ref={videoRef}>
            {/* Browsers that ignore `media` take the first source (1080p). */}
            <source media="(min-width: 900px)" src={VIDEO_1080} type="video/mp4" />
            <source src={VIDEO_720} type="video/mp4" />
            <track kind="captions" />
          </video>
          <button
            aria-label={playing ? "Pause the video" : "Play the video"}
            aria-pressed={!playing}
            className={styles.play}
            onClick={togglePlay}
            type="button"
          >
            {playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
          </button>
        </div>

        {/* Nothing is written over the film; the page's heading stays for
            search engines and screen readers. */}
        <h1 className="sr-only">CATALYSTCue, the Inkarp magazine</h1>

        <div className={styles.latest}>
          <Link aria-label={`Read ${latest.label}`} className={styles.cover} href={latest.href}>
            <Image alt={latest.coverAlt} className="object-cover" fetchPriority="high" fill loading="eager" sizes="(min-width: 768px) 300px, 30vw" src={latest.cover} />
          </Link>
          <div className={styles.latestText}>
            <p className={styles.badge}>Latest issue</p>
            <p className={styles.meta}>{latest.label} · {latest.date}</p>
            <h2 className={styles.theme}>{latest.theme}</h2>
            <div className={styles.actions}>
              <Link className={styles.primary} href={latest.href}>
                Read the issue <FiArrowRight aria-hidden="true" />
              </Link>
              {insideHref && latest.notes.length ? (
                <a className={styles.secondary} href={insideHref}>
                  {latest.notes.length} articles inside
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
