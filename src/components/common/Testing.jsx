"use client";

import { useEffect, useRef } from "react";
import HeroSection from "@/components/home/HeroSection";

const PUSH = {
  path: "https://ribbit.dk/Assets/Grx/sage_push",
  length: 174,
};

function getFrameSrc(basePath, index) {
  return `${basePath}/${index.toString().padStart(3, "0")}.png`;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function Testing() {
  const containerRef = useRef(null);
  const videoWrapRef = useRef(null);
  const charCanvasRef = useRef(null);
  const charImagesRef = useRef([]);
  const charFrameRef = useRef(-1);
  const charLoadedRef = useRef(false);

  // Preload sage_push frames in the background
  useEffect(() => {
    let loadedCount = 0;
    const images = [];
    for (let i = 0; i < PUSH.length; i++) {
      const img = new window.Image();
      img.src = getFrameSrc(PUSH.path, i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === PUSH.length) charLoadedRef.current = true;
      };
      images.push(img);
    }
    charImagesRef.current = images;
  }, []);

  // Single scroll listener drives both animations
  useEffect(() => {
    let ticking = false;

    const drawCharFrame = (index) => {
      const canvas = charCanvasRef.current;
      const img = charImagesRef.current[index];
      if (!canvas || !img || !img.complete) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const sectionHeight = container.offsetHeight - window.innerHeight;
      let progress = -rect.top / sectionHeight;
      progress = Math.min(Math.max(progress, 0), 1);

      const eased = easeInOut(progress);

      // ── Video: shrinks and drifts right as character pushes ──
      const wrap = videoWrapRef.current;
      if (wrap) {
        const scale      = lerp(1,  0.55, eased);
        const translateX = lerp(0,  24,   eased);
        const translateY = lerp(0,  6,    eased);
        const radius     = lerp(0,  22,   eased);

        wrap.style.transform    = `translate(${translateX}%, ${translateY}%) scale(${scale})`;
        wrap.style.borderRadius = `${radius}px`;

        // Counter-scale buttons so they stay at a readable size as the video shrinks
        const counterScale = 1 / scale;
        wrap.querySelectorAll("button, a").forEach((el) => {
          el.style.transform   = `scale(${counterScale})`;
          el.style.opacity     = "1";
          el.style.pointerEvents = "auto";
        });
      }

      // ── Character canvas: slides in from the left ──
      const charCanvas = charCanvasRef.current;
      if (charCanvas) {
        const charX = lerp(-105, 0, eased);  // % of its own width
        charCanvas.style.transform = `translateX(${charX}%)`;
      }

      // ── Character frame playback ──
      if (charLoadedRef.current) {
        const frameIndex = Math.min(
          PUSH.length - 1,
          Math.floor(progress * PUSH.length)
        );
        if (frameIndex !== charFrameRef.current) {
          charFrameRef.current = frameIndex;
          drawCharFrame(frameIndex);
        }
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
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="push-wrapper">
      <div className="push-sticky">

        {/* Hero video — full screen at start, pushed right on scroll */}
        <div ref={videoWrapRef} className="video-wrap">
          <HeroSection />
        </div>

        {/* Character — enters from left and visually pushes the video */}
        <canvas ref={charCanvasRef} className="char-canvas" />

      </div>

      <style jsx>{`
        .push-wrapper {
          position: relative;
          height: 450vh;
          display: none;
        }

        @media (min-width: 1024px) {
          .push-wrapper {
            display: block;
          }
        }

        .push-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }

        /* ── Video wrap ── */
        .video-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          transform-origin: center center;
          will-change: transform, border-radius;
        }

        /* Force HeroSection to fill the wrapper with no gaps */
        .video-wrap > section {
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .video-wrap > section > div:first-child {
          height: 100% !important;
          border-radius: 0 !important;
          margin: 0 !important;
        }

        /* Video and images fill without letterboxing */
        .video-wrap video,
        .video-wrap img {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }

        /* ── Character canvas ── */
        .char-canvas {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 88vh;
          width: auto;
          transform: translateX(-105%);
          transform-origin: left bottom;
          will-change: transform;
          z-index: 10;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
