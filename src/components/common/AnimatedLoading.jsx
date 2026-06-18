"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BASE_URL = "https://ribbit.dk";

const figures = [
  {
    id: "explorer",
    svg: `${BASE_URL}/Assets/Grx/Footer/1.svg`,
    svgWidth: 191,
    svgHeight: 272,
    path: `${BASE_URL}/Assets/Grx/footer_explorer`,
    length: 9,
    frameWidth: 350,
    frameHeight: 427,
    xAdjust: "-15%",
    yAdjust: "-17%",
    scale: "scale(1.16, 1.16)",
    transformOrigin: "0% 0%",
  },
  {
    id: "outlaw",
    svg: `${BASE_URL}/Assets/Grx/Footer/2.svg`,
    svgWidth: 204,
    svgHeight: 217,
    path: `${BASE_URL}/Assets/Grx/footer_outlaw`,
    length: 11,
    frameWidth: 183,
    frameHeight: 246,
    xAdjust: "0.5%",
    yAdjust: "0px",
    scale: "scale(0.6, 0.6)",
    transformOrigin: "100% 100%",
  },
  {
    id: "jester",
    svg: `${BASE_URL}/Assets/Grx/Footer/3.svg`,
    svgWidth: 361,
    svgHeight: 368,
    path: `${BASE_URL}/Assets/Grx/footer_jester`,
    length: 10,
    frameWidth: 500,
    frameHeight: 540,
    xAdjust: "-1%",
    yAdjust: "16.75%",
    scale: "scale(0.88, 0.88)",
    transformOrigin: "0% 0%",
  },
  {
    id: "creator",
    svg: `${BASE_URL}/Assets/Grx/Footer/4.svg`,
    svgWidth: 164,
    svgHeight: 295,
    path: `${BASE_URL}/Assets/Grx/footer_creator`,
    length: 10,
    frameWidth: 306,
    frameHeight: 510,
    xAdjust: "-0.5%",
    yAdjust: "-8%",
    scale: "scale(1.18, 1.18)",
    transformOrigin: "0% 100%",
  },
  {
    id: "sage",
    svg: `${BASE_URL}/Assets/Grx/Footer/5.svg`,
    svgWidth: 305,
    svgHeight: 261,
    path: `${BASE_URL}/Assets/Grx/footer_sage`,
    length: 10,
    frameWidth: 435,
    frameHeight: 400,
    xAdjust: "0.25%",
    yAdjust: "9.5%",
    scale: "scale(0.895, 0.895)",
    transformOrigin: "100% 100%",
  },
];

function getFramePath(path, index) {
  return `${path}/${String(index).padStart(3, "0")}.png`;
}

function AnimatedFigure({ figure }) {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const startAnimation = () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setFrame(0);

    let currentFrame = 0;

    intervalRef.current = setInterval(() => {
      currentFrame += 1;

      if (currentFrame >= figure.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        setFrame(0);
        setIsPlaying(false);
        return;
      }

      setFrame(currentFrame);
    }, 70);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      className="footer-figure"
      onMouseEnter={startAnimation}
      onClick={startAnimation}
    >
      <picture className={isPlaying ? "base-image is-hidden" : "base-image"}>
        <img
          src={figure.svg}
          width={figure.svgWidth}
          height={figure.svgHeight}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </picture>

      <div className={isPlaying ? "animation-layer is-visible" : "animation-layer"}>
        <Image
          className="sequence-image"
          src={getFramePath(figure.path, frame)}
          width={figure.frameWidth}
          height={figure.frameHeight}
          alt=""
          draggable="false"
          style={{
            transform: `translate(${figure.xAdjust}, ${figure.yAdjust}) ${figure.scale}`,
            transformOrigin: figure.transformOrigin,
          }}
        />
      </div>
    </div>
  );
}

export default function FooterFiguresAnimation() {
  return (
    <section className="footer-figures-section">
      <div className="figures">
        <div className="inner">
          {figures.map((figure) => (
            <AnimatedFigure key={figure.id} figure={figure} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .footer-figures-section {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #ffffff;
          padding: 80px 0 0;
        }

        .figures {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .inner {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: clamp(20px, 4vw, 70px);
          width: 100%;
          min-height: 430px;
          padding: 0 24px;
        }

        .footer-figure {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          cursor: pointer;
          user-select: none;
        }

        .footer-figure:nth-child(1) {
          width: 191px;
          height: 272px;
        }

        .footer-figure:nth-child(2) {
          width: 204px;
          height: 217px;
          margin-bottom: 0;
        }

        .footer-figure:nth-child(3) {
          width: 361px;
          height: 368px;
        }

        .footer-figure:nth-child(4) {
          width: 164px;
          height: 295px;
        }

        .footer-figure:nth-child(5) {
          width: 305px;
          height: 261px;
        }

        .base-image {
          position: relative;
          z-index: 1;
          display: block;
          transition: opacity 0.08s ease;
        }

        .base-image img {
          display: block;
          width: 100%;
          height: auto;
          pointer-events: none;
        }

        .base-image.is-hidden {
          opacity: 0;
        }

        .animation-layer {
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: 2;
          opacity: 0;
          pointer-events: none;
        }

        .animation-layer.is-visible {
          opacity: 1;
        }

        .sequence-image {
          display: block;
          max-width: none;
          pointer-events: none;
        }

        @media (max-width: 1024px) {
          .inner {
            gap: 28px;
            min-height: 360px;
            transform: scale(0.82);
            transform-origin: bottom center;
          }
        }

        @media (max-width: 768px) {
          .footer-figures-section {
            padding-top: 40px;
          }

          .figures {
            overflow-x: auto;
            overflow-y: hidden;
          }

          .inner {
            justify-content: flex-start;
            min-width: 980px;
            min-height: 360px;
            transform: scale(0.75);
            transform-origin: bottom left;
            padding-left: 24px;
            padding-right: 24px;
          }
        }
      `}</style>
    </section>
  );
}