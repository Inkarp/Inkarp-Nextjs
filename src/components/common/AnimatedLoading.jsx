"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 91;
const FRAME_RATE_MS = 45;

function getFramePath(index) {
  return `/assets/LoadingPage/optimized/frame-${String(index).padStart(5, "0")}.webp`;
}

export default function AnimatedLoading({ size = 160 }) {
  const [frame, setFrame] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    for (let index = 0; index < FRAME_COUNT; index += 1) {
      const preload = new window.Image();
      preload.src = getFramePath(index);
    }

    intervalRef.current = setInterval(() => {
      setFrame((current) => (current + 1) % FRAME_COUNT);
    }, FRAME_RATE_MS);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="animated-loading"
      style={{ height: size, width: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="animated-loading-frame"
        decoding="async"
        draggable="false"
        src={getFramePath(frame)}
      />

      <style jsx>{`
        .animated-loading {
          position: relative;
          display: inline-block;
        }

        .animated-loading-frame {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
