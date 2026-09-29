"use client";

import { useEffect, useRef, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";

// Purely decorative — the real file transfer is the browser's native
// download (triggered by the anchor's own `download` attribute), which we
// never block. This state machine just gives that instant action some
// visible weight instead of nothing happening for a moment, then a file
// silently landing in Downloads.
const STAGE_MS = { preparing: 700, downloading: 1600, done: 700 };

function useDownloadStage() {
  const [stage, setStage] = useState("idle");
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const start = () => {
    if (stage !== "idle") return false;
    setStage("preparing");
    timers.current.push(window.setTimeout(() => setStage("downloading"), STAGE_MS.preparing));
    timers.current.push(window.setTimeout(() => setStage("done"), STAGE_MS.preparing + STAGE_MS.downloading));
    timers.current.push(window.setTimeout(() => setStage("idle"), STAGE_MS.preparing + STAGE_MS.downloading + STAGE_MS.done));
    return true;
  };

  return [stage, start];
}

function StageIcon({ stage, className = "text-base", onLight = false }) {
  if (stage === "preparing" || stage === "downloading") {
    const ring = onLight ? "border-red/25 border-t-red" : "border-white/30 border-t-white";
    return <span aria-hidden="true" className={`size-4 shrink-0 animate-spin rounded-full border-2 ${ring}`} />;
  }
  if (stage === "done") {
    return <FiCheck aria-hidden="true" className={className} />;
  }
  return <FaDownload aria-hidden="true" className={`${className} animate-bounce`} />;
}

const STAGE_LABEL = { idle: "Product Profile", preparing: "Preparing…", downloading: "Downloading…", done: "Downloaded" };

// A light, raised pill: soft peach fill inside a red -> orange -> sand gradient
// outline (the nav hover palette), with a thin red lip underneath so it reads as
// a pressable button without a solid block of red. The resting shadow is also
// in the profile-glow-pulse keyframes (globals.css), which own it while idle.
const LIGHT_SURFACE =
  "border-[1.5px] border-transparent [background:linear-gradient(180deg,#fff5f0,#ffe2d7)_padding-box,linear-gradient(110deg,#be0010_0%,#f67a45_55%,#d5bda2_100%)_border-box] hover:[background:linear-gradient(180deg,#ffece4,#ffd4c5)_padding-box,linear-gradient(110deg,#be0010_0%,#f67a45_55%,#d5bda2_100%)_border-box] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_0_rgba(190,0,16,0.22),0_8px_18px_rgba(190,0,16,0.14)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_3px_0_rgba(190,0,16,0.26),0_12px_24px_rgba(190,0,16,0.2)] active:translate-y-px active:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_0_rgba(190,0,16,0.22),0_4px_10px_rgba(190,0,16,0.12)]";

export default function ProductProfileDownloadButton({ href, variant = "full" }) {
  const [stage, start] = useDownloadStage();
  const busy = stage !== "idle";

  const handleClick = (event) => {
    if (!start()) event.preventDefault();
  };

  const shineSweep = (
    <span
      aria-hidden="true"
      className="absolute inset-y-0 -left-1/2 -z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[#f67a45]/20 to-transparent transition-transform duration-700 group-hover:translate-x-[450%]"
    />
  );
  const progressBar = stage === "downloading"
    ? <span aria-hidden="true" className="profile-download-progress absolute inset-x-0 bottom-0 h-[3px]" />
    : null;

  if (variant === "icon") {
    return (
      <a
        aria-busy={busy}
        aria-label="Download product profile"
        className={`profile-download-btn group relative isolate inline-flex size-11 items-center justify-center overflow-hidden rounded-full text-red transition duration-300 hover:-translate-y-0.5 ${LIGHT_SURFACE} ${stage === "idle" ? "profile-download-glow" : ""}`}
        download
        href={href}
        onClick={handleClick}
      >
        {shineSweep}
        <StageIcon onLight stage={stage} />
        {progressBar}
      </a>
    );
  }

  return (
    <a
      aria-busy={busy}
      aria-label="Download product profile"
      className={`profile-download-btn group relative isolate inline-flex h-12 w-12 items-center justify-center gap-2.5 overflow-hidden rounded-full text-sm font-bold text-ink transition duration-300 hover:-translate-y-0.5 xl:w-auto xl:pl-1.5 xl:pr-5 2xl:pr-6 ${LIGHT_SURFACE} ${stage === "idle" ? "profile-download-glow" : ""}`}
      download
      href={href}
      onClick={handleClick}
    >
      {shineSweep}
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#be0010,#e3232d)] text-white shadow-[0_4px_10px_rgba(190,0,16,0.28)]">
        <StageIcon className="text-sm" stage={stage} />
      </span>
      <span className="hidden xl:inline">{STAGE_LABEL[stage]}</span>
      {progressBar}
    </a>
  );
}
