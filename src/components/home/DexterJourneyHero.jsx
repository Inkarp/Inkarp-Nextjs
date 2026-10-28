"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowDown, FiArrowRight, FiCheck, FiSearch, FiTool } from "react-icons/fi";

const MOMENTS = [
  {
    kicker: "Meet Dexter · Your laboratory guide",
    title: "Every breakthrough starts with a question.",
    body: "Tell us what your laboratory needs to achieve. Dexter helps turn that scientific question into a clear workflow.",
  },
  {
    kicker: "01 · Understand",
    title: "One requirement. Many possible paths.",
    body: "Application, sample, throughput and compliance all shape the right choice. We begin with your work—not a product list.",
  },
  {
    kicker: "02 · Connect",
    title: "The right technologies, working together.",
    body: "Explore connected solutions across preparation, analysis and process—supported by specialists who understand the application.",
  },
  {
    kicker: "03 · Support",
    title: "From installation to confident results.",
    body: "Method guidance, installation, training and nationwide service help your solution keep delivering after it reaches the lab.",
  },
];

const PATHS = [
  { label: "Prepare", note: "Sample preparation", icon: FiTool },
  { label: "Analyse", note: "Measurement & insight", icon: FiSearch },
  { label: "Deliver", note: "A supported result", icon: FiCheck },
];

export default function DexterJourneyHero() {
  const rootRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const stage = Math.min(MOMENTS.length - 1, Math.floor(progress * MOMENTS.length));
  const moment = MOMENTS[stage];

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const distance = Math.max(1, node.offsetHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, -rect.top / distance)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      aria-label="Dexter's guided laboratory journey"
      className="dexter-story"
      data-stage={stage}
      ref={rootRef}
      style={{ "--journey": progress }}
    >
      <div className="dexter-story__sticky">
        <div className="dexter-story__grid" aria-hidden="true" />
        <div className="dexter-story__glow dexter-story__glow--one" aria-hidden="true" />
        <div className="dexter-story__glow dexter-story__glow--two" aria-hidden="true" />

        <div className="dexter-story__inner">
          <div className="dexter-story__copy" key={stage}>
            <p className="dexter-story__kicker">{moment.kicker}</p>
            <h1>{moment.title}</h1>
            <p className="dexter-story__body">{moment.body}</p>

            <div className="dexter-story__actions">
              <Link className="dexter-story__primary" href="/solution-finder">
                Let Dexter guide me <FiArrowRight aria-hidden="true" />
              </Link>
              <Link className="dexter-story__secondary" href="/products">
                Browse solutions
              </Link>
            </div>
          </div>

          <div className="dexter-story__scene">
            <div className="dexter-story__orbit" aria-hidden="true">
              <span className="dexter-story__orbit-dot" />
              <span className="dexter-story__orbit-dot dexter-story__orbit-dot--two" />
            </div>

            <div className="dexter-story__question" aria-hidden="true">?</div>
            <div className="dexter-story__result" aria-hidden="true">
              <span /> <span /> <span /> <span /> <span />
            </div>

            <div className="dexter-story__dexter">
              <Image
                alt="Dexter, Inkarp's laboratory guide"
                fill
                priority
                sizes="(min-width: 1024px) 470px, 72vw"
                src="/dexter.png"
              />
            </div>

            <div className="dexter-story__paths">
              {PATHS.map(({ label, note, icon: Icon }, index) => (
                <div className="dexter-story__path" key={label} style={{ "--path-index": index }}>
                  <span><Icon aria-hidden="true" /></span>
                  <strong>{label}</strong>
                  <small>{note}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dexter-story__rail" aria-label={`Story step ${stage + 1} of ${MOMENTS.length}`}>
          {MOMENTS.map((item, index) => (
            <span className={index <= stage ? "is-active" : ""} key={item.kicker} />
          ))}
        </div>

        <div className="dexter-story__scroll" aria-hidden="true">
          <FiArrowDown /> <span>{stage === MOMENTS.length - 1 ? "Continue" : "Scroll to explore"}</span>
        </div>
      </div>

      <style jsx>{`
        .dexter-story { height: 360vh; position: relative; background: #071923; }
        .dexter-story__sticky { background: linear-gradient(145deg,#071923 0%,#0b2632 52%,#07151d 100%); color:#fff; height:calc(100svh - var(--header-spacer, 0px)); min-height:620px; overflow:hidden; position:sticky; top:var(--header-spacer, 0px); }
        .dexter-story__grid { background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px); background-size:54px 54px; inset:0; mask-image:linear-gradient(to bottom,black,transparent 88%); opacity:.7; position:absolute; }
        .dexter-story__glow { border-radius:999px; filter:blur(80px); opacity:.22; position:absolute; }
        .dexter-story__glow--one { background:#be0010; height:380px; right:6%; top:12%; width:380px; }
        .dexter-story__glow--two { background:#38bdf8; bottom:-130px; height:330px; left:25%; width:330px; }
        .dexter-story__inner { align-items:center; display:grid; gap:3rem; grid-template-columns:minmax(0,1fr) minmax(420px,.9fr); height:100%; margin:auto; max-width:1280px; padding:4rem 3rem 5rem; position:relative; z-index:2; }
        .dexter-story__copy { animation:story-copy-in .65s cubic-bezier(.16,1,.3,1) both; max-width:650px; }
        .dexter-story__kicker { align-items:center; color:#fca5a5; display:flex; font-size:.72rem; font-weight:800; gap:.7rem; letter-spacing:.18em; margin:0 0 1.4rem; text-transform:uppercase; }
        .dexter-story__kicker:before { background:#ef4444; content:""; height:2px; width:34px; }
        h1 { font-size:clamp(3rem,5.6vw,5.75rem); font-weight:650; letter-spacing:-.055em; line-height:.94; margin:0; max-width:11ch; text-wrap:balance; }
        .dexter-story__body { color:#cbd5e1; font-size:clamp(1rem,1.4vw,1.2rem); line-height:1.72; margin:1.7rem 0 0; max-width:580px; }
        .dexter-story__actions { display:flex; flex-wrap:wrap; gap:1rem; margin-top:2rem; }
        .dexter-story__actions a { align-items:center; display:inline-flex; font-size:.86rem; font-weight:750; gap:.65rem; padding:.9rem 1.15rem; transition:.25s ease; }
        .dexter-story__primary { background:#be0010; color:#fff; box-shadow:0 14px 36px rgba(190,0,16,.3); }
        .dexter-story__primary:hover { background:#d71920; transform:translateY(-3px); }
        .dexter-story__secondary { border:1px solid rgba(255,255,255,.25); color:#fff; }
        .dexter-story__secondary:hover { border-color:#fff; background:rgba(255,255,255,.07); }
        .dexter-story__scene { height:min(72vh,690px); position:relative; }
        .dexter-story__dexter { bottom:-8%; height:95%; left:50%; position:absolute; transform:translateX(-50%) translateY(calc(var(--journey) * -2.5%)); width:88%; z-index:3; }
        .dexter-story__dexter :global(img) { object-fit:contain; filter:drop-shadow(0 28px 40px rgba(0,0,0,.35)); }
        .dexter-story__orbit { border:1px solid rgba(125,211,252,.27); border-radius:50%; height:72%; left:13%; position:absolute; top:11%; transform:rotate(calc(var(--journey) * 115deg)); width:76%; }
        .dexter-story__orbit:after { border:1px dashed rgba(255,255,255,.16); border-radius:50%; content:""; inset:9%; position:absolute; }
        .dexter-story__orbit-dot { background:#fb7185; border-radius:50%; box-shadow:0 0 24px #fb7185; height:11px; left:18%; position:absolute; top:1%; width:11px; }
        .dexter-story__orbit-dot--two { background:#67e8f9; bottom:5%; box-shadow:0 0 24px #67e8f9; left:auto; right:12%; top:auto; }
        .dexter-story__question { align-items:center; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.22); border-radius:50%; display:flex; font-size:2rem; font-weight:800; height:64px; justify-content:center; opacity:calc(1 - min(1,var(--journey) * 5)); position:absolute; right:1%; top:18%; transform:translateY(calc(var(--journey) * -50px)) rotate(calc(var(--journey) * 18deg)); width:64px; }
        .dexter-story__result { align-items:flex-end; bottom:22%; display:flex; gap:5px; height:58px; opacity:clamp(0,calc((var(--journey) - .68) * 7),1); position:absolute; right:0; width:72px; }
        .dexter-story__result span { background:linear-gradient(#67e8f9,#0ea5e9); border-radius:3px 3px 0 0; flex:1; height:30%; }
        .dexter-story__result span:nth-child(2) { height:54%; }.dexter-story__result span:nth-child(3) { height:42%; }.dexter-story__result span:nth-child(4) { height:78%; }.dexter-story__result span:nth-child(5) { height:100%; }
        .dexter-story__paths { bottom:4%; display:flex; gap:.65rem; left:50%; opacity:clamp(0,calc((var(--journey) - .22) * 5),1); position:absolute; transform:translateX(-50%); width:108%; z-index:4; }
        .dexter-story__path { backdrop-filter:blur(12px); background:rgba(7,25,35,.82); border:1px solid rgba(255,255,255,.14); flex:1; min-width:0; padding:.8rem; transform:translateY(calc((1 - clamp(0,calc((var(--journey) - .18) * 5),1)) * 36px)); transition:border-color .25s; }
        .dexter-story__path:hover { border-color:rgba(103,232,249,.6); }
        .dexter-story__path span { align-items:center; background:rgba(190,0,16,.18); color:#fda4af; display:flex; height:28px; justify-content:center; margin-bottom:.55rem; width:28px; }
        .dexter-story__path strong,.dexter-story__path small { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .dexter-story__path strong { font-size:.8rem; }.dexter-story__path small { color:#94a3b8; font-size:.64rem; margin-top:.2rem; }
        .dexter-story__rail { bottom:2rem; display:flex; gap:.45rem; left:50%; position:absolute; transform:translateX(-50%); z-index:5; }
        .dexter-story__rail span { background:rgba(255,255,255,.2); height:3px; transition:.35s ease; width:34px; }.dexter-story__rail span.is-active { background:#ef4444; }
        .dexter-story__scroll { align-items:center; bottom:1.8rem; color:#94a3b8; display:flex; font-size:.64rem; gap:.5rem; letter-spacing:.13em; position:absolute; right:2rem; text-transform:uppercase; z-index:5; }
        .dexter-story__scroll :global(svg) { animation:story-nudge 1.7s ease-in-out infinite; }
        @keyframes story-copy-in { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes story-nudge { 50% { transform:translateY(5px); } }
        @media (max-width:900px) {
          .dexter-story { height:320vh; }
          .dexter-story__sticky { min-height:680px; }
          .dexter-story__inner { align-items:start; gap:0; grid-template-columns:1fr; padding:3rem 1.25rem 4.5rem; }
          .dexter-story__copy { position:relative; z-index:5; }
          h1 { font-size:clamp(2.65rem,12vw,4.5rem); max-width:10ch; }
          .dexter-story__body { font-size:.96rem; line-height:1.55; max-width:34rem; }
          .dexter-story__actions { margin-top:1.4rem; }
          .dexter-story__scene { bottom:0; height:47%; position:absolute; right:-3%; width:62%; }
          .dexter-story__dexter { height:112%; width:100%; }
          .dexter-story__paths { display:none; }
          .dexter-story__orbit { height:76%; width:90%; }
        }
        @media (max-width:620px) {
          .dexter-story__sticky { min-height:700px; }
          .dexter-story__inner { padding-top:2rem; }
          .dexter-story__kicker { font-size:.61rem; margin-bottom:1rem; }
          h1 { font-size:clamp(2.35rem,11vw,3.3rem); }
          .dexter-story__body { font-size:.9rem; max-width:24rem; }
          .dexter-story__actions { gap:.55rem; }
          .dexter-story__actions a { font-size:.75rem; padding:.75rem .85rem; }
          .dexter-story__scene { height:40%; right:-15%; width:80%; }
          .dexter-story__question,.dexter-story__result { right:10%; }
          .dexter-story__scroll { display:none; }
          .dexter-story__rail { bottom:1.3rem; }
        }
        @media (prefers-reduced-motion:reduce) {
          .dexter-story { height:auto; }
          .dexter-story__sticky { min-height:760px; position:relative; top:0; }
          .dexter-story__copy,.dexter-story__scroll :global(svg) { animation:none; }
          .dexter-story__orbit { transform:none; }
        }
      `}</style>
    </section>
  );
}
