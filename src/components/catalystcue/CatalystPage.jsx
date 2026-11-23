"use client";

import { useEffect, useState } from "react";
import CatalystModal from "@/components/catalystcue/CatalystModal";
import MagazineShelf from "@/components/catalystcue/MagazineShelf";

// The physical-copy form used to open by itself 5 seconds after the page
// loaded. It is paused with the other pop-ups under review and now opens from
// the "Request a physical copy" button in the archive's header. Set to true to
// bring the timed opening back.
const AUTO_OPEN_PHYSICAL_COPY = false;

/**
 * The body of /magazine: the archive as a full-width shelf in one <main>,
 * plus the physical-copy form.
 */
export default function CatalystPage({ issues }) {
  const [showCatalystModal, setShowCatalystModal] = useState(false);

  useEffect(() => {
    if (!AUTO_OPEN_PHYSICAL_COPY) return undefined;
    const timer = window.setTimeout(() => setShowCatalystModal(true), 5000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="relative bg-parchment">
      <MagazineShelf issues={issues} onRequestCopy={() => setShowCatalystModal(true)} />


      {showCatalystModal ? (
        <div className="z-[10000]">
          <CatalystModal onClose={() => setShowCatalystModal(false)} />
        </div>
      ) : null}
    </main>
  );
}
