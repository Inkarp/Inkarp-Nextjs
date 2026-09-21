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

function StageIcon({ stage, className = "text-base" }) {
  if (stage === "preparing" || stage === "downloading") {
    return <span aria-hidden="true" className="size-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />;
  }
  if (stage === "done") {
    return <FiCheck aria-hidden="true" className={className} />;
  }
  return <FaDownload aria-hidden="true" className={`${className} animate-bounce`} />;
}

const STAGE_LABEL = { idle: "Product Profile", preparing: "Preparing…", downloading: "Downloading…", done: "Downloaded" };

export default function ProductProfileDownloadButton({ href, variant = "full" }) {
  const [stage, start] = useDownloadStage();
  const busy = stage !== "idle";

  const handleClick = (event) => {
    if (!start()) event.preventDefault();
  };

  const shineSweep = (
    <span
      aria-hidden="true"
      className="absolute inset-y-0 -left-1/2 -z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-[450%]"
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
        className={`profile-download-btn group relative isolate inline-flex size-11 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(110deg,#8f000c_0%,#be0010_45%,#e3232d_100%)] text-white shadow-[0_10px_24px_rgba(190,0,16,0.35)] ring-1 ring-white/15 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(190,0,16,0.45)] ${stage === "idle" ? "profile-download-glow" : ""}`}
        download
        href={href}
        onClick={handleClick}
      >
        {shineSweep}
        <StageIcon stage={stage} />
        {progressBar}
      </a>
    );
  }

  return (
    <a
      aria-busy={busy}
      aria-label="Download product profile"
      className={`profile-download-btn group relative isolate inline-flex h-12 w-12 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[linear-gradient(110deg,#8f000c_0%,#be0010_45%,#e3232d_100%)] text-sm font-bold text-white shadow-[0_10px_26px_rgba(190,0,16,0.32)] ring-1 ring-white/15 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(190,0,16,0.42)] xl:w-auto xl:px-5 2xl:px-6 ${stage === "idle" ? "profile-download-glow" : ""}`}
      download
      href={href}
      onClick={handleClick}
    >
      {shineSweep}
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
        <StageIcon className="text-sm" stage={stage} />
      </span>
      <span className="hidden xl:inline">{STAGE_LABEL[stage]}</span>
      {progressBar}
    </a>
  );
}
