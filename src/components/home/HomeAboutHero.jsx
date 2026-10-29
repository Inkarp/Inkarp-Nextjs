"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiActivity, FiArrowRight, FiCalendar, FiCheck, FiCpu, FiDroplet, FiMapPin, FiSearch } from "react-icons/fi";
import { FaDna, FaFlask } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import RecTag from "./RecTag";
import { featuredEvent } from "@/data/events";

const AUTO_ROTATE_MS = 3000;
const BUILDING_IMAGE = "/assets/our-story/InkarpBuilding.jpg";
const ANNIVERSARY_VIDEO = "/assets/41-anniversary-animation.mp4";
const DEXTER_LAB_VIDEO = "/assets/home/dexter-lab-workflow.mp4";
const LAB_IMAGE = "/assets/home/inkarp-lab-hero-generated.png";
// The dedicated stall photo — same asset the home events row uses for this
// event's card — rather than the wider Event1.jpeg shared with the campaign strip.
const ANALYTICA_STALL_IMAGE = "/assets/events/analytica-2026.webp";
// Cropped from the official analytica banner artwork (public/analyticaLogo.jpg) —
// just the icon + wordmark, so it can sit inline in place of the event name.
const ANALYTICA_LOGO = "/assets/events/analytica-logo.png";

const HERO_MEDIA_ROTATE_MS = 10000;

function ScientificNetworkVisual() {
  const nodes = [
    { Icon: FaFlask, label: "Prepare", className: "science-node--prepare" },
    { Icon: FaDna, label: "Discover", className: "science-node--discover" },
    { Icon: FiDroplet, label: "Separate", className: "science-node--separate" },
    { Icon: FiCpu, label: "Control", className: "science-node--control" },
    { Icon: FiActivity, label: "Measure", className: "science-node--measure" },
    { Icon: FiSearch, label: "Analyse", className: "science-node--analyse" },
  ];

  return (
    <div className="science-visual">
      <div className="lab-chamber__blueprint" aria-hidden="true" />
      <div className="lab-chamber__scan" aria-hidden="true" />
      <div className="lab-chamber__halo lab-chamber__halo--one" aria-hidden="true" />
      <div className="lab-chamber__halo lab-chamber__halo--two" aria-hidden="true" />

      <div className="lab-chamber__pods" aria-hidden="true">
        {nodes.map(({ Icon, label, className }, index) => (
          <div className={`lab-pod lab-pod--${index + 1}`} key={label} style={{ "--pod-index": index }}>
            <span className="lab-pod__shell"><Icon /></span>
            <i />
          </div>
        ))}
      </div>

      <div className="lab-chamber__reactor" aria-hidden="true">
        <span className="lab-chamber__reactor-shell"><FiCpu /></span>
        <span className="lab-chamber__reactor-ring lab-chamber__reactor-ring--one" />
        <span className="lab-chamber__reactor-ring lab-chamber__reactor-ring--two" />
      </div>

      <div className="lab-chamber__rail" aria-hidden="true">
        <span className="lab-chamber__sample lab-chamber__sample--one" />
        <span className="lab-chamber__sample lab-chamber__sample--two" />
        <span className="lab-chamber__sample lab-chamber__sample--three" />
        <i /><i /><i /><i /><i /><i /><i /><i /><i />
      </div>

      <div className="lab-chamber__output" aria-hidden="true">
        <FiCheck />
        <span /><span />
      </div>

      <div className="lab-chamber__particles" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--particle": index }} />)}
      </div>

      <style jsx>{`
        .science-visual { background:linear-gradient(145deg,#090d18 0%,#10172a 46%,#160b16 100%); color:#fff; height:100%; inset:0; overflow:hidden; position:absolute; }
        .lab-chamber__blueprint { background-image:linear-gradient(rgba(139,92,246,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.07) 1px,transparent 1px); background-size:26px 26px; inset:0; mask-image:linear-gradient(to bottom,black,transparent 92%); perspective:600px; position:absolute; transform:rotateX(58deg) scale(1.55) translateY(20%); }
        .lab-chamber__scan { animation:lab-scan 3.2s ease-in-out infinite; background:linear-gradient(90deg,transparent,rgba(244,63,94,.05),rgba(244,63,94,.75),rgba(244,63,94,.05),transparent); box-shadow:0 0 24px rgba(244,63,94,.45); height:2px; left:5%; position:absolute; right:5%; top:10%; z-index:2; }
        .lab-chamber__halo { border:1px solid rgba(139,92,246,.2); border-radius:50%; height:330px; left:50%; position:absolute; top:48%; transform:translate(-50%,-50%) rotateX(64deg); width:330px; }.lab-chamber__halo--one { animation:lab-halo 8s linear infinite; border-color:rgba(244,63,94,.28); }.lab-chamber__halo--two { animation:lab-halo 11s linear infinite reverse; height:250px; width:250px; }
        .lab-chamber__halo:before,.lab-chamber__halo:after { background:#f43f5e; border-radius:50%; box-shadow:0 0 16px #f43f5e; content:""; height:7px; left:50%; position:absolute; top:-4px; width:7px; }.lab-chamber__halo:after { background:#8b5cf6; bottom:-4px; box-shadow:0 0 16px #8b5cf6; left:20%; top:auto; }
        .lab-chamber__pods { inset:0; position:absolute; z-index:4; }
        .lab-pod { animation:lab-pod-in .65s cubic-bezier(.16,1,.3,1) both; animation-delay:calc(.25s + var(--pod-index) * .16s); position:absolute; }.lab-pod--1{left:8%;top:18%}.lab-pod--2{left:35%;top:10%}.lab-pod--3{right:12%;top:16%}.lab-pod--4{right:8%;bottom:20%}.lab-pod--5{left:36%;bottom:10%}.lab-pod--6{left:9%;bottom:20%}
        .lab-pod__shell { align-items:center; background:linear-gradient(145deg,rgba(30,41,59,.94),rgba(15,23,42,.94)); border:1px solid rgba(167,139,250,.42); box-shadow:inset 0 0 18px rgba(139,92,246,.08),0 8px 25px rgba(0,0,0,.35); clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%); color:#c4b5fd; display:flex; font-size:17px; height:52px; justify-content:center; position:relative; width:58px; }
        .lab-pod > i { animation:lab-pod-signal 1.5s ease-in-out infinite; animation-delay:calc(var(--pod-index) * -.2s); background:#fb7185; border-radius:50%; box-shadow:0 0 12px #fb7185; height:5px; left:50%; position:absolute; top:calc(100% + 6px); width:5px; }
        .lab-chamber__reactor { height:145px; left:50%; position:absolute; top:48%; transform:translate(-50%,-50%); width:145px; z-index:5; }
        .lab-chamber__reactor-shell { align-items:center; animation:lab-reactor-breathe 2s ease-in-out infinite; background:linear-gradient(145deg,#f43f5e,#7c3aed); box-shadow:0 0 35px rgba(244,63,94,.42),inset 0 0 20px rgba(255,255,255,.16); clip-path:polygon(25% 4%,75% 4%,98% 50%,75% 96%,25% 96%,2% 50%); display:flex; font-size:31px; height:72px; justify-content:center; left:36px; position:absolute; top:36px; width:72px; }
        .lab-chamber__reactor-ring { animation:lab-reactor-spin 5s linear infinite; border:1px dashed rgba(196,181,253,.5); border-radius:50%; inset:13px; position:absolute; }.lab-chamber__reactor-ring:after { background:#c4b5fd; border-radius:50%; box-shadow:0 0 12px #c4b5fd; content:""; height:7px; left:50%; position:absolute; top:-4px; width:7px; }.lab-chamber__reactor-ring--two { animation-direction:reverse; animation-duration:7s; inset:0; }
        .lab-chamber__rail { animation:lab-rail-in .8s ease 1.25s both; background:linear-gradient(90deg,transparent,rgba(196,181,253,.65),rgba(244,63,94,.75),transparent); bottom:17%; height:2px; left:10%; position:absolute; right:10%; z-index:3; }.lab-chamber__rail>i { background:rgba(196,181,253,.38); height:7px; position:absolute; top:-2px; transform:rotate(45deg); width:7px; }.lab-chamber__rail>i:nth-of-type(1){left:8%}.lab-chamber__rail>i:nth-of-type(2){left:18%}.lab-chamber__rail>i:nth-of-type(3){left:28%}.lab-chamber__rail>i:nth-of-type(4){left:38%}.lab-chamber__rail>i:nth-of-type(5){left:48%}.lab-chamber__rail>i:nth-of-type(6){left:58%}.lab-chamber__rail>i:nth-of-type(7){left:68%}.lab-chamber__rail>i:nth-of-type(8){left:78%}.lab-chamber__rail>i:nth-of-type(9){left:88%}
        .lab-chamber__sample { animation:lab-sample 3.4s cubic-bezier(.45,0,.55,1) infinite; background:#67e8f9; border-radius:50%; box-shadow:0 0 14px #67e8f9; height:9px; left:0; position:absolute; top:-4px; width:9px; }.lab-chamber__sample--two{animation-delay:-1.15s;background:#fb7185;box-shadow:0 0 14px #fb7185}.lab-chamber__sample--three{animation-delay:-2.3s;background:#c4b5fd;box-shadow:0 0 14px #c4b5fd}
        .lab-chamber__output { align-items:center; animation:lab-output 1s cubic-bezier(.16,1,.3,1) 3.9s both; background:linear-gradient(145deg,#f43f5e,#8b5cf6); border:1px solid rgba(255,255,255,.35); border-radius:50%; bottom:8%; box-shadow:0 0 0 10px rgba(139,92,246,.08),0 0 32px rgba(244,63,94,.5); display:flex; font-size:22px; height:48px; justify-content:center; position:absolute; right:7%; width:48px; z-index:6; }.lab-chamber__output span { animation:lab-output-ring 2s ease-out infinite; border:1px solid rgba(244,63,94,.45); border-radius:50%; inset:-8px; position:absolute; }.lab-chamber__output span:last-child{animation-delay:1s}
        .lab-chamber__particles i { animation:lab-particle 4s ease-in-out infinite; animation-delay:calc(var(--particle) * -.31s); background:rgba(196,181,253,.8); border-radius:50%; height:3px; left:calc(7% + var(--particle) * 7.4%); position:absolute; top:calc(16% + (var(--particle) % 4) * 18%); width:3px; }
        @keyframes lab-scan { 0%,100%{opacity:0;transform:translateY(0)}15%{opacity:1}75%{opacity:.8}90%{opacity:0;transform:translateY(300px)} }
        @keyframes lab-halo { to{transform:translate(-50%,-50%) rotateX(64deg) rotateZ(360deg)} }
        @keyframes lab-pod-in { from{opacity:0;transform:translateY(18px) scale(.65)}to{opacity:1;transform:none} }
        @keyframes lab-pod-signal { 50%{opacity:.25;transform:translateY(6px) scale(.65)} }
        @keyframes lab-reactor-breathe { 50%{filter:brightness(1.18);transform:scale(1.08)} }
        @keyframes lab-reactor-spin { to{transform:rotate(360deg)} }
        @keyframes lab-rail-in { from{opacity:0;transform:scaleX(0)} }
        @keyframes lab-sample { 0%{left:0;opacity:0}10%{opacity:1}50%{transform:translateY(-16px) scale(1.35)}90%{opacity:1}100%{left:100%;opacity:0} }
        @keyframes lab-output { from{opacity:0;transform:scale(.25) rotate(-40deg)}to{opacity:1;transform:none} }
        @keyframes lab-output-ring { to{opacity:0;transform:scale(1.65)} }
        @keyframes lab-particle { 50%{opacity:.15;transform:translate(9px,-14px) scale(.5)} }
        .science-visual__grid { background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px); background-size:34px 34px; inset:0; mask-image:radial-gradient(circle at center,black,transparent 78%); position:absolute; }
        .science-visual__glow { animation:hero-science-drift 5s ease-in-out infinite; background:#be0010; border-radius:50%; filter:blur(50px); height:180px; opacity:.22; position:absolute; right:-50px; top:-35px; width:180px; }
        .science-visual__lines { animation:hero-science-stage-out .6s ease 4s forwards; height:100%; inset:0; position:absolute; width:100%; }
        .science-visual__lines path { animation:hero-science-line 1.3s ease .85s both; fill:none; stroke:rgba(103,232,249,.32); stroke-dasharray:6 7; stroke-width:1; }
        .science-visual__nodes { animation:hero-science-stage-out .6s ease 4s forwards; }
        .science-node { animation:hero-science-node .55s cubic-bezier(.16,1,.3,1) both; animation-delay:calc(.55s + var(--node-index) * .12s); position:absolute; text-align:center; transform:translate(-50%,-50%); }
        .science-node > span { align-items:center; backdrop-filter:blur(8px); background:rgba(5,20,28,.86); border:1px solid rgba(103,232,249,.35); border-radius:50%; box-shadow:0 0 0 6px rgba(103,232,249,.035); color:#a5f3fc; display:flex; font-size:13px; height:34px; justify-content:center; width:34px; }
        .science-node--prepare { left:12%; top:24%; }.science-node--discover { left:50%; top:12%; }.science-node--separate { left:88%; top:23%; }.science-node--control { left:89%; top:76%; }.science-node--measure { left:49%; top:88%; }.science-node--analyse { left:12%; top:77%; }
        .science-visual__core { animation:hero-science-core-in .7s ease 1.2s both,hero-science-stage-out .6s ease 4s forwards; height:96px; left:50%; position:absolute; top:53%; transform:translate(-50%,-50%); width:96px; }
        .science-visual__core-dot { animation:hero-science-pulse 1.6s ease-in-out infinite; background:radial-gradient(circle at 35% 30%,#fff,#67e8f9 22%,#0ea5e9 56%,#083344); border-radius:50%; box-shadow:0 0 30px rgba(103,232,249,.8); height:38px; left:29px; position:absolute; top:29px; width:38px; }
        .science-visual__ring { border:1px solid rgba(103,232,249,.5); border-radius:50%; inset:9px; position:absolute; }
        .science-visual__ring:after { background:#fb7185; border-radius:50%; box-shadow:0 0 10px #fb7185; content:""; height:6px; left:50%; position:absolute; top:-3px; width:6px; }
        .science-visual__ring--one { animation:hero-science-spin 4s linear infinite; }.science-visual__ring--two { animation:hero-science-spin 6s linear infinite reverse; inset:0; }.science-visual__ring--two:after { background:#67e8f9; box-shadow:0 0 10px #67e8f9; }
        .science-visual__result { align-items:flex-end; animation:hero-science-result .7s ease 2s both,hero-science-stage-out .6s ease 4s forwards; bottom:22%; display:flex; gap:3px; height:38px; position:absolute; right:7%; width:48px; }
        .science-visual__result span { animation:hero-science-bar .8s ease forwards; background:linear-gradient(#67e8f9,#0e7490); border-radius:2px 2px 0 0; flex:1; height:35%; transform:scaleY(0); transform-origin:bottom; }.science-visual__result span:nth-child(2){height:62%;animation-delay:.1s}.science-visual__result span:nth-child(3){height:48%;animation-delay:.2s}.science-visual__result span:nth-child(4){height:100%;animation-delay:.3s}.science-visual__result span:nth-child(5){height:78%;animation-delay:.4s}
        .science-visual__complete { align-items:center; animation:hero-science-complete 1s cubic-bezier(.16,1,.3,1) 4.15s both; background:radial-gradient(circle at 35% 30%,#fff,#67e8f9 24%,#0e7490 70%); border-radius:50%; box-shadow:0 0 0 12px rgba(103,232,249,.06),0 0 48px rgba(103,232,249,.72); color:#06212b; display:flex; font-size:32px; height:76px; justify-content:center; left:50%; position:absolute; top:52%; transform:translate(-50%,-50%); width:76px; z-index:7; }
        .science-visual__complete:before,.science-visual__complete:after { border:1px solid rgba(103,232,249,.35); border-radius:50%; content:""; inset:-26px; position:absolute; }.science-visual__complete:after { animation:hero-science-spin 6s linear infinite; border-color:#fb7185 transparent #67e8f9 transparent; inset:-42px; }
        @keyframes hero-science-node { from{opacity:0;transform:translate(-50%,-50%) scale(.45)}to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes hero-science-line { from{opacity:0;stroke-dashoffset:50}to{opacity:1;stroke-dashoffset:0} }
        @keyframes hero-science-core-in { from{opacity:0;transform:translate(-50%,-50%) scale(.4)}to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes hero-science-spin { to{transform:rotate(360deg)} }
        @keyframes hero-science-pulse { 50%{box-shadow:0 0 44px rgba(103,232,249,1);transform:scale(1.1)} }
        @keyframes hero-science-complete { from{opacity:0;transform:translate(-50%,-50%) scale(.3) rotate(-35deg)} to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)} }
        @keyframes hero-science-stage-out { to{opacity:0;filter:blur(5px)} }
        @keyframes hero-science-result { from{opacity:0;transform:translateY(8px)} }
        @keyframes hero-science-bar { to{transform:scaleY(1)} }
        @keyframes hero-science-drift { 50%{opacity:.32;transform:translate(-25px,20px) scale(1.12)} }
        @keyframes hero-science-blink { 50%{opacity:.2} }
        @media(prefers-reduced-motion:reduce){.science-visual *{animation:none!important}}
      `}</style>
    </div>
  );
}

function HeroMediaCarousel() {
  const [activeMedia, setActiveMedia] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveMedia((current) => (current + 1) % 2);
    }, HERO_MEDIA_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div key={activeMedia} className="absolute inset-0 animate-[hvc-fade_600ms_ease]">
        {activeMedia === 0 ? (
          <video
            aria-label="Inkarp 41st anniversary animation"
            autoPlay
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
            src={ANNIVERSARY_VIDEO}
          />
        ) : (
          <video
            aria-label="Dexter working in a scientific laboratory"
            autoPlay
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
            src={DEXTER_LAB_VIDEO}
          />
        )}
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-black/25 px-2.5 py-1.5 backdrop-blur-sm">
        {["41st anniversary animation", "Dexter laboratory workflow video"].map((label, index) => (
          <button
            aria-label={`Show ${label}`}
            className={`h-1.5 rounded-full transition-all ${activeMedia === index ? "w-6 bg-white" : "w-1.5 bg-white/45 hover:bg-white/75"}`}
            key={label}
            onClick={() => setActiveMedia(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}


/*
function SlideWorkflow() {
  return (
    <div className="bg-white px-4 pb-15 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="max-w-[16ch] text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Your lab has a workflow. 
              <em className="italic text-red">We help build the right{" "} solution</em> around it.
            </h1>

            <p className="my-4 max-w-[520px] text-base leading-relaxed text-ink-soft sm:text-lg">
              From global technologies to Inkarp&apos;s own solutions, we match your requirement
              with the right fit, guidance, and support path.
            </p>

            <div className="mb-11 flex flex-wrap gap-3.5">
              <Link
                href="#categories"
                className="border border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
              >
                Find My Industry
              </Link>
              <Link
                href="/workflows"
                className="border border-line-light bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
              >
                See a Workflow
              </Link>
            </div>
          </div>

          <div className="relative border border-line-light bg-parchment-alt p-4.5 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line-light bg-white">
              <Image
                src={LAB_IMAGE}
                alt="Modern scientific laboratory with Inkarp instrumentation workflow"
                loading="eager"
                fill
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

function SlideAbout() {
  return (
    <div className="bg-white px-4 pb-8 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-start gap-8 sm:gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="flex flex-col">
            {/* Phones: the badge floats right of the tag and heading, and the
                heading's lower lines run full width beneath it. From sm the
                badge leads the row. */}
            <div className="mb-4 flow-root sm:mb-6 sm:flex sm:items-start sm:gap-6">
              <div className="relative float-right mb-1 ml-3 flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-[1.5px] border-red text-center text-red sm:float-none sm:mb-0 sm:ml-0 sm:h-[104px] sm:w-[104px]">
                <div className="absolute inset-2 rounded-full border border-dashed border-red/40" />
                <span className="text-[19px] font-semibold tracking-wide">1985</span>
                <span className="mt-0.5 text-[8.5px] uppercase tracking-[0.16em]">Est. &amp; Trusted</span>
              </div>
              <div className="sm:min-w-0 sm:flex-1">
                <RecTag>About Inkarp</RecTag>
                {/* Page-level h1 — the only one on the homepage. Every other
                    section heads with an h2. */}
                <h1 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                  Four decades of supporting
                  <br />
                  India&apos;s <em className="italic text-red">laboratories.</em>
                </h1>
              </div>
            </div>

            <p className="max-w-[520px] text-base leading-relaxed text-ink-soft sm:my-4 sm:text-lg">
              Since 1985, Inkarp has helped Indian laboratories move from scientific need to
              supported use — bringing together global principals, product lines, application
              guidance, installation support, and service across India.
            </p>

            <div className="mt-5 flex flex-wrap gap-3.5 sm:mt-8 lg:mt-auto lg:pb-1">
              <Link
                href="/products"
                className="border border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
              >
                Browse Solutions
              </Link>
            </div>
          </div>

          <div className="relative border border-line-light bg-parchment-alt p-4.5 lg:flex lg:flex-col before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line-light bg-white lg:aspect-auto lg:flex-1">
              <HeroMediaCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytica hero slide — disabled until it's needed again; uncomment this
// block and add SlideAnalytica back to SLIDES below to bring it back.
/*
function useTimeUntil(startsAt) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!startsAt) return undefined;
    const target = new Date(startsAt).getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setRemaining({ state: "live" });
        return;
      }
      const totalMinutes = Math.floor(diff / 60000);
      setRemaining({
        state: "counting",
        days: Math.floor(totalMinutes / 1440),
        hours: Math.floor((totalMinutes % 1440) / 60),
        minutes: totalMinutes % 60,
      });
    };

    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [startsAt]);

  return remaining;
}

function CountdownUnit({ label, value }) {
  return (
    <span className="flex flex-col items-center border border-red/20 bg-white px-2.5 py-1.5">
      <span className="font-mono text-base font-bold leading-none text-red sm:text-lg">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </span>
    </span>
  );
}

function SlideAnalytica() {
  const remaining = useTimeUntil(featuredEvent.startsAt);

  return (
    <div className="bg-white px-4 pb-8 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="flex flex-col">
            <RecTag>{featuredEvent.eyebrow}</RecTag>
            <h1 className="flex flex-wrap items-center gap-3 text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              <Image
                alt={featuredEvent.name}
                className="h-10 w-auto object-contain sm:h-14"
                height={58}
                priority
                src={ANALYTICA_LOGO}
                width={234}
              />
              <em className="italic text-red">{featuredEvent.edition}</em>
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-ink">
              <span className="inline-flex items-center gap-2">
                <FiCalendar aria-hidden="true" className="size-4 text-red" />
                {featuredEvent.dateLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiMapPin aria-hidden="true" className="size-4 text-red" />
                {featuredEvent.venue}
              </span>
            </div>

            <p className="my-4 max-w-[520px] text-base leading-relaxed text-ink-soft sm:text-lg">
              {featuredEvent.summary}
            </p>

            <div className="mb-2 flex flex-wrap items-center gap-3">
              {featuredEvent.stallNumber ? (
                <p className="inline-flex w-fit shrink-0 items-center gap-1.5 border border-red/30 bg-red/5 px-3 py-1.5 text-sm font-semibold text-red">
                  Stall No: {featuredEvent.stallNumber}
                </p>
              ) : null}

              {remaining?.state === "counting" ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    Doors open in
                  </span>
                  <div className="flex items-center gap-1.5">
                    <CountdownUnit label="Days" value={remaining.days} />
                    <CountdownUnit label="Hrs" value={remaining.hours} />
                    <CountdownUnit label="Mins" value={remaining.minutes} />
                  </div>
                </div>
              ) : remaining?.state === "live" ? (
                <p className="inline-flex w-fit items-center gap-1.5 border border-teal/30 bg-teal/5 px-3 py-1.5 text-sm font-semibold text-teal">
                  <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-teal" />
                  Happening now — come say hello
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-3.5 lg:mt-auto lg:pb-1">
              {featuredEvent.registrationUrl ? (
                <a
                  className="border border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
                  href={featuredEvent.registrationUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Register Now
                </a>
              ) : null}
              <Link
                href="/events"
                className="border border-line-light bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
              >
                Event Details
              </Link>
            </div>
          </div>

          <div className="relative border border-line-light bg-parchment-alt p-4.5 lg:flex lg:flex-col before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line-light bg-white lg:aspect-auto lg:flex-1">
              <Image
                alt={`Inkarp stall at ${featuredEvent.name} ${featuredEvent.edition}`}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 520px, 90vw"
                src={ANALYTICA_STALL_IMAGE}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

const SLIDES = [SlideAbout];

export default function HomeAboutHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (SLIDES.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % SLIDES.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, []);

  const ActiveSlide = SLIDES[activeIndex];

  return (
    <section className="relative" id="about" data-reveal>
      <div key={activeIndex} className="animate-[hvc-fade_500ms_ease]">
        <ActiveSlide />
      </div>

      {SLIDES.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              type="button"
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index
                  ? "w-8 bg-red"
                  : "w-2.5 bg-ink-soft/30 hover:bg-ink-soft/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
