"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { INDIA_MAP, projectToMap } from "@/data/indiaMap";
import Eyebrow from "./Eyebrow";
import { BRANCHES } from "./storyContent";
import { clamp01, useScrollFrame } from "./motion";
import styles from "./StoryPreview.module.css";

const pad = (value) => String(value).padStart(2, "0");
const round = (value) => Math.round(value * 10) / 10;

// Which side of its pin each name sits on, so neighbours never overlap (as on the contact page map).
const LABEL_LEFT = new Set(["Ahmedabad", "Mumbai", "Chandigarh", "Bengaluru", "Thiruvananthapuram", "Hyderabad"]);

// Pins and lines in map units, worked out once. Each line bows to one side.
const POINTS = BRANCHES.map((branch) => {
  const [x, y] = projectToMap(branch.coords);
  return { ...branch, x: round(x), y: round(y) };
});
const HQ = POINTS[0];
const LINES = POINTS.slice(1).map((point) => {
  const dx = point.x - HQ.x;
  const dy = point.y - HQ.y;
  const length = Math.hypot(dx, dy);
  const cx = round((HQ.x + point.x) / 2 - (dy / length) * length * 0.22);
  const cy = round((HQ.y + point.y) / 2 + (dx / length) * length * 0.22);
  return { name: point.name, d: `M${HQ.x} ${HQ.y} Q${cx} ${cy} ${point.x} ${point.y}` };
});

// Scroll share before the first line starts (the head office arrives) and after the last one lands.
const LEAD = 0.08;
const TAIL = 0.1;

/**
 * The network, pinned while it draws: the Hyderabad head office appears
 * first, then a line runs out to each branch in turn and its pin drops in.
 * The panel counts the branches and names the one just reached.
 */
export default function BranchMapScene() {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);
  const [reached, setReached] = useState(0);
  const total = POINTS.length;

  const reduced = useScrollFrame(sectionRef, (progress) => {
    const svg = svgRef.current;
    if (!svg) return;
    const span = (1 - LEAD - TAIL) / LINES.length;
    let count = progress > 0.02 ? 1 : 0;
    LINES.forEach((line, index) => {
      const t = clamp01((progress - LEAD - index * span) / span);
      const path = svg.querySelector(`[data-line="${index}"]`);
      const pin = svg.querySelector(`[data-pin="${index + 1}"]`);
      if (path) path.style.strokeDashoffset = String(1 - t);
      if (pin) {
        const pop = clamp01((t - 0.75) / 0.25);
        pin.style.opacity = String(pop);
        pin.style.transform = `scale(${0.4 + pop * 0.6})`;
      }
      if (t >= 1) count = index + 2;
    });
    const hq = svg.querySelector('[data-pin="0"]');
    if (hq) hq.style.opacity = String(clamp01(progress / 0.03));
    setReached(count);
  });

  const shown = reduced ? total : reached;
  const latest = POINTS[Math.max(0, shown - 1)];

  return (
    <section className={reduced ? "py-20" : "h-[300vh]"} ref={sectionRef}>
      <div className={`${reduced ? "" : "sticky top-0 flex h-screen flex-col justify-center"} overflow-hidden bg-parchment-alt py-8`}>
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 lg:px-8">
          <div className="relative mx-auto w-full max-w-[min(100%,calc((100vh-260px)*0.875))] lg:max-w-[min(100%,calc((100vh-80px)*0.875))]">
            <div className="relative w-full" style={{ aspectRatio: `${INDIA_MAP.width} / ${INDIA_MAP.height}` }}>
              <Image alt="Map of India with Inkarp's branches" className="absolute inset-0 h-full w-full select-none opacity-70" draggable={false} height={INDIA_MAP.height} src={INDIA_MAP.src} width={INDIA_MAP.width} />
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" ref={svgRef} viewBox={`0 0 ${INDIA_MAP.width} ${INDIA_MAP.height}`}>
                {LINES.map((line, index) => (
                  <path d={line.d} data-line={index} fill="none" key={line.name} pathLength="1" stroke="#be0010" strokeDasharray="1" strokeDashoffset={reduced ? 0 : 1} strokeLinecap="round" strokeWidth="1.6" />
                ))}
                {POINTS.map((point, index) => (
                  <g className={styles.pin} data-pin={index} key={point.name} style={reduced ? undefined : { opacity: 0 }}>
                    {point.headOffice ? <circle className={styles.pulse} cx={point.x} cy={point.y} fill="#be0010" r="7" /> : null}
                    <circle cx={point.x} cy={point.y} fill={point.headOffice ? "#be0010" : "#1a1a1a"} r={point.headOffice ? 7 : 4.5} stroke="#fff" strokeWidth="2" />
                    <text
                      className="hidden fill-ink font-mono sm:block"
                      dominantBaseline="middle"
                      fontSize={point.headOffice ? 15 : 12.5}
                      fontWeight={point.headOffice ? 700 : 500}
                      paintOrder="stroke"
                      stroke="#f5f5f4"
                      strokeWidth="4"
                      textAnchor={LABEL_LEFT.has(point.name) ? "end" : "start"}
                      x={LABEL_LEFT.has(point.name) ? point.x - 10 : point.x + 10}
                      y={point.y}
                    >
                      {point.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div>
            <Eyebrow>Pan-India service network</Eyebrow>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">Branches in India</p>
            <p className="mt-1 font-mono text-[64px] font-semibold leading-none tracking-[-0.04em] text-ink sm:text-[88px]">
              <span className="text-red">{pad(shown)}</span>
              <span className="text-line-light">/{pad(total)}</span>
            </p>
            <p className={`${styles.swap} mt-4 min-h-[36px] text-[26px] font-semibold text-ink`} key={latest.name}>
              {shown ? latest.name : ""}
              {shown && latest.headOffice ? <span className="ml-2 align-middle font-mono text-[11px] uppercase tracking-[0.14em] text-red">Head office</span> : null}
            </p>
            <ol className="mt-6 hidden grid-cols-2 gap-x-6 gap-y-1.5 lg:grid">
              {POINTS.map((point, index) => (
                <li className={`${styles.branchItem} flex items-center gap-2 text-[14px] text-ink`} data-on={index < shown ? "" : undefined} key={point.name}>
                  <span className={`size-1.5 rounded-full ${point.headOffice ? "bg-red" : "bg-ink"}`} />
                  {point.name}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
