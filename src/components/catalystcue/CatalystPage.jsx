"use client";

import { useEffect, useMemo, useState } from "react";
import CatalystArchiveSwitcher from "@/components/catalystcue/CatalystArchiveVariants";
import CatalystLatestIssue from "@/components/catalystcue/CatalystLatestIssue";
import CatalystModal from "@/components/catalystcue/CatalystModal";
import { catalystCards } from "@/data/catalystCue";

export default function CatalystPage() {
  const [showCatalystModal, setShowCatalystModal] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowCatalystModal(true), 5000);

    return () => window.clearTimeout(timer);
  }, []);

  const latestIssue = useMemo(() => {
    return [...catalystCards].sort((a, b) => b.id - a.id)[0];
  }, []);

  return (
    <main className="relative">
      <div className="relative left-1/2 h-screen -translate-x-1/2 overflow-hidden">
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover object-center"
          loop
          muted
          playsInline
          src="/assets/catalyst/post-lauch-v2-i6.mp4"
        >
          <track kind="captions" />
        </video>
      </div>

      <CatalystLatestIssue issue={latestIssue} />

      <div className="p-5" id="catalyst-archive">
        <CatalystArchiveSwitcher catalystCards={catalystCards} />
      </div>

      {showCatalystModal ? (
        <div className="z-[10000]">
          <CatalystModal onClose={() => setShowCatalystModal(false)} />
        </div>
      ) : null}
    </main>
  );
}
