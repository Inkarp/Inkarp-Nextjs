// components/ScrollPngSequenceLayered.jsx
"use client";

import { useEffect, useRef, useState } from "react";

const PUSH = {
  path: "https://ribbit.dk/Assets/Grx/sage_push",
  length: 174,
};

const PULL = {
  path: "https://ribbit.dk/Assets/Grx/sage_pull",
  length: 25,
};

function getFrameSrc(basePath, index) {
  return `${basePath}/${index.toString().padStart(3, "0")}.png`;
}

function preloadFrames(basePath, length, onAllLoaded) {
  let loadedCount = 0;
  const images = [];

  for (let i = 0; i < length; i++) {
    const img = new window.Image();
    img.src = getFrameSrc(basePath, i);
    img.onload = () => {
      loadedCount++;
      if (loadedCount === length) onAllLoaded();
    };
    images.push(img);
  }
  return images;
}

export default function HomeHero() {
  const containerRef = useRef(null);
  const pushCanvasRef = useRef(null);
  const pullCanvasRef = useRef(null);

  const pushImagesRef = useRef([]);
  const pullImagesRef = useRef([]);

  const pushFrameRef = useRef(0);
  const pullFrameRef = useRef(0);

  const [pushLoaded, setPushLoaded] = useState(false);
  const [pullLoaded, setPullLoaded] = useState(false);

  // Preload both sequences
  useEffect(() => {
    pushImagesRef.current = preloadFrames(PUSH.path, PUSH.length, () =>
      setPushLoaded(true)
    );
    pullImagesRef.current = preloadFrames(PULL.path, PULL.length, () =>
      setPullLoaded(true)
    );
  }, []);

  const drawFrame = (canvasEl, img) => {
    if (!canvasEl || !img || !img.complete) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    canvasEl.width = img.naturalWidth;
    canvasEl.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.drawImage(img, 0, 0);
  };

  useEffect(() => {
    if (!pushLoaded || !pullLoaded) return;
    let ticking = false;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const sectionHeight = container.offsetHeight - window.innerHeight;

      let progress = -rect.top / sectionHeight;
      progress = Math.min(Math.max(progress, 0), 1);

      // Base "push" layer plays across the whole scroll range
      const pushIndex = Math.min(
        PUSH.length - 1,
        Math.floor(progress * PUSH.length)
      );
      if (pushIndex !== pushFrameRef.current) {
        pushFrameRef.current = pushIndex;
        drawFrame(pushCanvasRef.current, pushImagesRef.current[pushIndex]);
      }

      // "Pull" overlay plays only in the back half of the scroll range
      const pullStart = 0.5;
      let pullProgress = (progress - pullStart) / (1 - pullStart);
      pullProgress = Math.min(Math.max(pullProgress, 0), 1);

      const pullIndex = Math.min(
        PULL.length - 1,
        Math.floor(pullProgress * PULL.length)
      );
      if (pullIndex !== pullFrameRef.current) {
        pullFrameRef.current = pullIndex;
        drawFrame(pullCanvasRef.current, pullImagesRef.current[pullIndex]);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pushLoaded, pullLoaded]);

  const ready = pushLoaded && pullLoaded;

  return (
    <div ref={containerRef} className="layered-wrapper">
      <div className="layered-sticky">
        {!ready && <div className="layered-loader">Loading…</div>}

        <div className="layered-stage">
          <canvas ref={pushCanvasRef} className="layer push-layer" />
          <canvas ref={pullCanvasRef} className="layer pull-layer" />
        </div>
      </div>

      <style jsx>{`
        .layered-wrapper {
          position: relative;
          height: 500vh;
        }

        .layered-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #000;
        }

        .layered-stage {
          position: relative;
          width: 490px;
          max-width: 90vw;
          aspect-ratio: 490 / 414;
        }

        .layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .pull-layer {
          /* mirrors data-scale/data-rel positioning from the source markup */
          transform: scale(0.75);
          transform-origin: 100% 50%;
        }

        .layered-loader {
          position: absolute;
          z-index: 2;
          font-size: 14px;
          color: #888;
        }
      `}</style>
    </div>
  );
}