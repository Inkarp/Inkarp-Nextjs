"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiCpu,
  FiDroplet,
  FiHexagon,
  FiRotateCcw,
  FiSearch,
  FiSkipForward,
  FiTarget,
  FiZap,
} from "react-icons/fi";
import { FaDna, FaFlask } from "react-icons/fa6";

const DURATION = 8200;

const NODES = [
  { Icon: FaFlask, label: "Prepare", x: "13%", y: "23%", delay: "0ms" },
  { Icon: FaDna, label: "Discover", x: "32%", y: "12%", delay: "170ms" },
  { Icon: FiDroplet, label: "Separate", x: "72%", y: "15%", delay: "340ms" },
  { Icon: FiCpu, label: "Control", x: "88%", y: "38%", delay: "510ms" },
  { Icon: FiActivity, label: "Measure", x: "76%", y: "76%", delay: "680ms" },
  { Icon: FiSearch, label: "Analyse", x: "27%", y: "81%", delay: "850ms" },
  { Icon: FiTarget, label: "Validate", x: "8%", y: "58%", delay: "1020ms" },
];

const STEPS = ["A scientific question", "A connected workflow", "A confident result"];

export default function ScientificIntro() {
  const [runKey, setRunKey] = useState(0);
  const [complete, setComplete] = useState(false);
  const [mutedMotion, setMutedMotion] = useState(false);
  const timerRef = useRef(null);

  const start = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setComplete(false);
    setRunKey((value) => value + 1);
    timerRef.current = window.setTimeout(() => setComplete(true), DURATION);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMutedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (mutedMotion) {
      setComplete(true);
      return undefined;
    }
    timerRef.current = window.setTimeout(() => setComplete(true), DURATION);
    return () => window.clearTimeout(timerRef.current);
  }, [runKey, mutedMotion]);

  return (
    <main className="science-preview">
      <section
        aria-label="Inkarp scientific discovery introduction"
        className={`science-intro ${complete ? "is-complete" : "is-running"}`}
        key={runKey}
      >
        <div className="science-intro__grid" aria-hidden="true" />
        <div className="science-intro__aurora science-intro__aurora--red" aria-hidden="true" />
        <div className="science-intro__aurora science-intro__aurora--blue" aria-hidden="true" />

        <div className="science-intro__topline">
          <span><i /> INKARP DISCOVERY SYSTEM</span>
          <span className="science-intro__status">{complete ? "EXPERIENCE READY" : "CONNECTING WORKFLOW"}</span>
        </div>

        <div className="science-intro__network" aria-hidden="true">
          <svg className="science-intro__links" viewBox="0 0 1000 620" preserveAspectRatio="none">
            <path d="M130 145 C260 80 390 75 500 300" />
            <path d="M320 75 C430 115 470 190 500 300" />
            <path d="M720 95 C640 135 565 200 500 300" />
            <path d="M885 235 C720 245 610 270 500 300" />
            <path d="M760 475 C650 425 580 365 500 300" />
            <path d="M270 500 C360 420 425 350 500 300" />
            <path d="M85 360 C250 340 375 320 500 300" />
          </svg>

          {NODES.map(({ Icon, label, x, y, delay }) => (
            <div className="science-intro__node" key={label} style={{ left: x, top: y, "--node-delay": delay }}>
              <span><Icon /></span>
              <small>{label}</small>
            </div>
          ))}

          <div className="science-intro__sample">
            <span className="science-intro__sample-core" />
            <span className="science-intro__sample-ring" />
            <span className="science-intro__sample-ring science-intro__sample-ring--two" />
          </div>

          <div className="science-intro__molecule science-intro__molecule--one" />
          <div className="science-intro__molecule science-intro__molecule--two" />
          <div className="science-intro__molecule science-intro__molecule--three" />
        </div>

        <div className="science-intro__copy">
          <p className="science-intro__eyebrow"><FiHexagon /> FROM QUESTION TO DISCOVERY</p>
          <h1>
            Every discovery begins with the
            <em> right scientific solution.</em>
          </h1>
          <p>Connected technologies. Application-led guidance. Support that stays with your laboratory.</p>
        </div>

        <div className="science-intro__brand">
          <div className="science-intro__brand-mark">
            <Image alt="Inkarp" fill priority sizes="220px" src="/InkarpLogo.svg" />
          </div>
          <span>Think Scientific. Think Inkarp.</span>
        </div>

        <div className="science-intro__dexter">
          <Image alt="Dexter, Inkarp's laboratory guide" fill priority sizes="310px" src="/dexter.png" />
          <div className="science-intro__bubble">
            <span>Workflow connected</span>
            Let&apos;s find the right path for your laboratory.
          </div>
        </div>

        <div className="science-intro__result" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span />
        </div>

        <div className="science-intro__progress" aria-hidden="true">
          {STEPS.map((step, index) => (
            <div key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </div>
          ))}
          <i />
        </div>

        <div className="science-intro__controls">
          {!complete ? (
            <button onClick={() => setComplete(true)} type="button">
              Skip intro <FiSkipForward />
            </button>
          ) : (
            <>
              <button onClick={start} type="button"><FiRotateCcw /> Replay</button>
              <Link href="/">Enter website <FiArrowRight /></Link>
            </>
          )}
        </div>

        <div className="science-intro__signal" aria-hidden="true"><FiZap /></div>
      </section>

      <section className="science-preview__notes">
        <p>CONCEPT PREVIEW · NOT CONNECTED TO THE HOMEPAGE</p>
        <h2>A scientific opening that earns attention.</h2>
        <p>
          This isolated preview demonstrates the first-visit sequence. The production version can remember a visitor&apos;s session,
          shorten repeat visits, and load the homepage behind the animation.
        </p>
      </section>

      <style jsx>{`
        .science-preview { background:#050b10; color:#fff; min-height:100vh; }
        .science-intro { background:radial-gradient(circle at 50% 42%,#113344 0%,#081923 35%,#040a0f 76%); height:calc(100svh - var(--header-spacer,0px)); min-height:690px; overflow:hidden; position:relative; isolation:isolate; }
        .science-intro__grid { background-image:linear-gradient(rgba(255,255,255,.038) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.038) 1px,transparent 1px); background-size:52px 52px; inset:0; mask-image:radial-gradient(circle at center,black 10%,transparent 78%); position:absolute; }
        .science-intro__aurora { border-radius:50%; filter:blur(90px); opacity:.2; position:absolute; }
        .science-intro__aurora--red { animation:science-drift 7s ease-in-out infinite; background:#be0010; height:330px; left:-80px; top:22%; width:330px; }
        .science-intro__aurora--blue { animation:science-drift 9s ease-in-out -2s infinite reverse; background:#0ea5e9; bottom:-90px; height:360px; right:-40px; width:360px; }
        .science-intro__topline { color:#718695; display:flex; font-family:monospace; font-size:10px; justify-content:space-between; left:clamp(18px,4vw,64px); letter-spacing:.17em; position:absolute; right:clamp(18px,4vw,64px); top:26px; z-index:10; }
        .science-intro__topline span { align-items:center; display:flex; gap:8px; }
        .science-intro__topline i { animation:science-blink 1s steps(1) infinite; background:#67e8f9; border-radius:50%; box-shadow:0 0 10px #67e8f9; height:6px; width:6px; }
        .science-intro__status { color:#fda4af; }
        .science-intro__network { animation:science-network-out .7s ease 5.15s forwards; height:min(68vw,690px); left:50%; position:absolute; top:48%; transform:translate(-50%,-50%); width:min(88vw,1060px); z-index:1; }
        .science-intro__links { inset:0; position:absolute; height:100%; width:100%; }
        .science-intro__links path { animation:science-line 1.1s ease forwards; animation-delay:1.25s; fill:none; opacity:0; stroke:rgba(103,232,249,.32); stroke-dasharray:8 9; stroke-width:1; }
        .science-intro__node { animation:science-node-in .65s cubic-bezier(.16,1,.3,1) forwards; animation-delay:calc(450ms + var(--node-delay)); opacity:0; position:absolute; transform:translate(-50%,-50%) scale(.5); text-align:center; }
        .science-intro__node > span { align-items:center; backdrop-filter:blur(12px); background:rgba(7,25,35,.82); border:1px solid rgba(103,232,249,.3); border-radius:50%; box-shadow:0 0 0 9px rgba(103,232,249,.035); color:#a5f3fc; display:flex; font-size:22px; height:58px; justify-content:center; width:58px; }
        .science-intro__node small { color:#78909e; display:block; font-family:monospace; font-size:8px; letter-spacing:.15em; margin-top:9px; text-transform:uppercase; }
        .science-intro__sample { animation:science-sample-in .7s ease 2s forwards; height:130px; left:50%; opacity:0; position:absolute; top:49%; transform:translate(-50%,-50%) scale(.5); width:130px; }
        .science-intro__sample-core { animation:science-core 1.4s ease-in-out infinite; background:radial-gradient(circle at 35% 30%,#fff,#67e8f9 22%,#0ea5e9 54%,#083344); border-radius:50%; box-shadow:0 0 34px rgba(103,232,249,.75); height:54px; left:38px; position:absolute; top:38px; width:54px; }
        .science-intro__sample-ring { animation:science-spin 4s linear infinite; border:1px solid rgba(103,232,249,.5); border-radius:50%; inset:10px; position:absolute; }
        .science-intro__sample-ring:after { background:#fb7185; border-radius:50%; box-shadow:0 0 14px #fb7185; content:""; height:8px; left:50%; position:absolute; top:-4px; width:8px; }
        .science-intro__sample-ring--two { animation-direction:reverse; animation-duration:6s; inset:0; transform:rotate(64deg); }
        .science-intro__sample-ring--two:after { background:#67e8f9; box-shadow:0 0 14px #67e8f9; }
        .science-intro__molecule { animation:science-float 4s ease-in-out infinite; border:1px solid rgba(255,255,255,.13); border-radius:50%; height:8px; position:absolute; width:8px; }
        .science-intro__molecule:before { background:rgba(255,255,255,.13); content:""; height:1px; left:8px; position:absolute; top:3px; width:34px; transform:rotate(-25deg); transform-origin:left; }
        .science-intro__molecule--one { left:41%; top:27%; }.science-intro__molecule--two { animation-delay:-1.3s; right:34%; top:40%; }.science-intro__molecule--three { animation-delay:-2.4s; bottom:25%; left:43%; }
        .science-intro__copy { animation:science-copy-sequence 2.25s cubic-bezier(.16,1,.3,1) 3.15s forwards; left:clamp(22px,6vw,96px); max-width:710px; opacity:0; position:absolute; top:50%; transform:translateY(-42%); z-index:4; }
        .science-intro__eyebrow { align-items:center; color:#67e8f9!important; display:flex; font-family:monospace; font-size:10px!important; font-weight:700; gap:9px; letter-spacing:.18em; margin-bottom:18px!important; }
        .science-intro__copy h1 { font-size:clamp(3rem,6.2vw,6.5rem); font-weight:650; letter-spacing:-.06em; line-height:.91; margin:0; max-width:11ch; text-wrap:balance; }
        .science-intro__copy h1 em { color:#fb7185; display:block; font-family:Georgia,serif; font-weight:400; }
        .science-intro__copy > p { color:#a9bac5; font-size:clamp(.95rem,1.25vw,1.15rem); line-height:1.65; margin:24px 0 0; max-width:540px; }
        .science-intro__brand { align-items:center; animation:science-brand-in .9s cubic-bezier(.16,1,.3,1) 5.1s forwards; display:flex; flex-direction:column; left:50%; opacity:0; position:absolute; top:43%; transform:translate(-50%,-50%) scale(.72); z-index:6; }
        .science-intro__brand-mark { filter:brightness(0) invert(1); height:86px; position:relative; width:250px; }
        .science-intro__brand-mark :global(img) { object-fit:contain; }
        .science-intro__brand > span { color:#a8bbc5; font-size:11px; letter-spacing:.25em; margin-top:11px; text-transform:uppercase; }
        .science-intro__dexter { animation:science-dexter-in .9s cubic-bezier(.16,1,.3,1) 6.35s forwards; bottom:-7%; height:min(62vh,600px); opacity:0; position:absolute; right:clamp(-50px,2vw,30px); transform:translateX(70px); width:min(36vw,430px); z-index:7; }
        .science-intro__dexter :global(img) { filter:drop-shadow(0 24px 36px rgba(0,0,0,.45)); object-fit:contain; object-position:bottom; }
        .science-intro__bubble { backdrop-filter:blur(15px); background:rgba(7,25,35,.86); border:1px solid rgba(255,255,255,.18); color:#dbe7ec; font-size:12px; left:-42%; line-height:1.5; padding:15px 17px; position:absolute; top:22%; width:210px; }
        .science-intro__bubble:after { border-bottom:8px solid transparent;border-left:10px solid rgba(255,255,255,.18);border-top:8px solid transparent;content:"";position:absolute;right:-10px;top:24px; }
        .science-intro__bubble span { color:#67e8f9; display:block; font-family:monospace; font-size:8px; letter-spacing:.16em; margin-bottom:5px; text-transform:uppercase; }
        .science-intro__result { align-items:flex-end; animation:science-result-in .8s ease 4.4s forwards; bottom:22%; display:flex; gap:6px; height:76px; opacity:0; position:absolute; right:11%; width:100px; }
        .science-intro__result span { animation:science-bar 1s ease forwards; background:linear-gradient(#67e8f9,#0e7490); border-radius:3px 3px 0 0; flex:1; height:var(--bar,35%); transform:scaleY(0); transform-origin:bottom; }
        .science-intro__result span:nth-child(2){--bar:55%;animation-delay:.1s}.science-intro__result span:nth-child(3){--bar:42%;animation-delay:.2s}.science-intro__result span:nth-child(4){--bar:88%;animation-delay:.3s}.science-intro__result span:nth-child(5){--bar:68%;animation-delay:.4s}.science-intro__result span:nth-child(6){--bar:100%;animation-delay:.5s}.science-intro__result span:nth-child(7){--bar:82%;animation-delay:.6s}
        .science-intro__progress { bottom:30px; display:flex; gap:30px; left:clamp(22px,4vw,64px); position:absolute; z-index:10; }
        .science-intro__progress > div { align-items:center; display:flex; gap:8px; }
        .science-intro__progress span { color:#fb7185; font-family:monospace; font-size:8px; }.science-intro__progress p { color:#637986; font-size:9px; letter-spacing:.1em; margin:0; text-transform:uppercase; }
        .science-intro__progress > i { animation:science-progress 8.2s linear forwards; background:linear-gradient(90deg,#be0010,#fb7185,#67e8f9); bottom:-10px; height:2px; left:0; position:absolute; transform-origin:left; width:100%; }
        .science-intro__controls { align-items:center; bottom:23px; display:flex; gap:10px; position:absolute; right:clamp(22px,4vw,64px); z-index:12; }
        .science-intro__controls button,.science-intro__controls a { align-items:center; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.16); color:#d7e2e8; cursor:pointer; display:inline-flex; font-size:11px; gap:8px; padding:10px 13px; transition:.25s ease; }
        .science-intro__controls a { background:#be0010; border-color:#be0010; }.science-intro__controls button:hover,.science-intro__controls a:hover { transform:translateY(-2px); border-color:#fff; }
        .science-intro__signal { animation:science-signal 2.2s ease-in-out infinite; color:#67e8f9; left:50%; opacity:.2; position:absolute; top:50%; z-index:0; }
        .is-complete .science-intro__network,.is-complete .science-intro__copy,.is-complete .science-intro__result { opacity:0; transition:opacity .6s ease; }
        .is-complete .science-intro__brand,.is-complete .science-intro__dexter { animation:none; opacity:1; transform:translate(-50%,-50%) scale(1); }
        .is-complete .science-intro__dexter { transform:none; }
        .is-complete .science-intro__progress > i { animation:none; transform:scaleX(1); }
        .science-preview__notes { background:#f5f5f5; color:#161616; padding:70px max(24px,8vw) 90px; }
        .science-preview__notes > p:first-child { color:#be0010; font-family:monospace; font-size:10px; letter-spacing:.18em; }
        .science-preview__notes h2 { font-size:clamp(2rem,4vw,4rem); letter-spacing:-.04em; margin:12px 0; }.science-preview__notes > p:last-child { color:#5f6368; line-height:1.7; max-width:720px; }
        @keyframes science-node-in { to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes science-line { to{opacity:1;stroke-dashoffset:-40} }
        @keyframes science-sample-in { to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes science-core { 50%{box-shadow:0 0 55px rgba(103,232,249,.95);transform:scale(1.1)} }
        @keyframes science-spin { to{transform:rotate(360deg)} }
        @keyframes science-float { 50%{transform:translate(10px,-12px);opacity:.4} }
        @keyframes science-copy-sequence { 0%{opacity:0;transform:translateY(-42%)} 28%,72%{opacity:1;transform:translateY(-50%)} 100%{opacity:0;transform:translateY(-55%)} }
        @keyframes science-network-out { to{opacity:0;filter:blur(8px);transform:translate(-50%,-50%) scale(1.06)} }
        @keyframes science-brand-in { to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes science-dexter-in { to{opacity:1;transform:none} }
        @keyframes science-result-in { to{opacity:1} }
        @keyframes science-bar { to{transform:scaleY(1)} }
        @keyframes science-progress { from{transform:scaleX(0)}to{transform:scaleX(1)} }
        @keyframes science-drift { 50%{opacity:.32;transform:translate(40px,-25px) scale(1.12)} }
        @keyframes science-blink { 50%{opacity:.25} }
        @keyframes science-signal { 50%{opacity:.5;transform:scale(1.5)} }
        @media(max-width:800px){
          .science-intro{min-height:720px}.science-intro__status{display:none}.science-intro__network{height:62%;top:43%;width:115%}.science-intro__node > span{height:47px;width:47px;font-size:18px}.science-intro__copy{left:22px;right:22px;top:43%}.science-intro__copy h1{font-size:clamp(2.7rem,12vw,4.4rem)}.science-intro__copy>p{font-size:.9rem;max-width:75%}.science-intro__result{display:none}.science-intro__progress{gap:15px}.science-intro__progress p{display:none}.science-intro__dexter{height:47%;right:-50px;width:55vw}.science-intro__bubble{left:-65%;top:20%;width:170px}.science-intro__brand{top:38%}.science-intro__controls{bottom:18px}.science-intro__progress{bottom:26px}
        }
        @media(max-width:520px){.science-intro__network{width:140%}.science-intro__node:nth-of-type(2),.science-intro__node:nth-of-type(4){display:none}.science-intro__copy>p{max-width:92%}.science-intro__dexter{bottom:-4%;height:42%;width:68vw}.science-intro__bubble{left:-52%;top:5%;width:145px}.science-intro__brand-mark{height:70px;width:200px}.science-intro__progress{display:none}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.science-intro__network,.science-intro__copy,.science-intro__result{display:none}.science-intro__brand,.science-intro__dexter{opacity:1;transform:none}.science-intro__brand{transform:translate(-50%,-50%)}.science-intro__progress>i{transform:scaleX(1)}}
      `}</style>
    </main>
  );
}
