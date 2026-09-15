"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { drag as d3Drag } from "d3-drag";
import { geoDistance, geoOrthographic, geoPath } from "d3-geo";
import { interpolate as d3Interpolate } from "d3-interpolate";
import { select as d3Select } from "d3-selection";
import { transition as d3Transition } from "d3-transition";
import { FiArrowUpRight, FiGlobe, FiMapPin, FiMove } from "react-icons/fi";
import { feature as topoFeature } from "topojson-client";
import RecTag from "./RecTag";
import { countryGeo } from "@/data/countryGeo";
import { getPrincipalLogo } from "@/data/products/principalLogos";

const GLOBE_SIZE = 320;
const GLOBE_RADIUS = 150;
const AUTO_SPIN_SPEED = 0.05;
const LAND_TOPOLOGY_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";

function useCountryGroups(productPrincipals) {
  return useMemo(() => {
    const groups = new Map();

    productPrincipals.forEach((principal) => {
      principal.countryOfOrigin.split(/\s*&\s*/).forEach((rawCountry) => {
        const country = rawCountry.trim();
        if (!groups.has(country)) groups.set(country, []);
        groups.get(country).push(principal);
      });
    });

    const countries = Object.entries(countryGeo)
      .map(([name, geo]) => ({
        name,
        ...geo,
        principals: (groups.get(name) ?? []).sort((a, b) =>
          a.principalName.localeCompare(b.principalName)
        ),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const allPrincipals = [...productPrincipals].sort((a, b) =>
      a.principalName.localeCompare(b.principalName)
    );

    return { countries, allPrincipals };
  }, [productPrincipals]);
}

function PrincipalCard({ principal }) {
  const logo = getPrincipalLogo(principal.slug);

  return (
    <Link
      href={`/products?brand=${principal.slug}`}
      aria-label={principal.principalName}
      className="group relative flex h-[74px] items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white/90 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.025] transition duration-300 hover:-translate-y-1 hover:border-red/25 hover:shadow-[0_16px_34px_rgba(190,0,16,0.13)]"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {logo ? (
        <span className="relative h-9 w-full transition duration-300 group-hover:scale-[1.04]">
          <Image src={logo} alt={principal.principalName} fill sizes="140px" className="object-contain" />
        </span>
      ) : (
        <span className="text-xs font-semibold text-ink">{principal.principalName}</span>
      )}
      <span className="absolute right-2 top-2 grid size-5 translate-x-1 -translate-y-1 place-items-center rounded-full bg-red text-white opacity-0 shadow-md transition duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
        <FiArrowUpRight aria-hidden="true" className="size-3" />
      </span>
    </Link>
  );
}

// Logo-only showcase tile, intentionally not linked to a product/brand page.
function StaticPrincipalLogo({ name, logo }) {
  return (
    <div
      aria-label={name}
      className="relative flex h-[74px] items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white/75 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ring-1 ring-black/[0.025]"
    >
      {logo ? (
        <span className="relative h-9 w-full">
          <Image src={logo} alt={name} fill sizes="140px" className="object-contain" />
        </span>
      ) : (
        <span className="text-xs font-semibold text-ink">{name}</span>
      )}
    </div>
  );
}

export default function PrincipalsGlobe({ principals = [] }) {
  const { countries, allPrincipals } = useCountryGroups(principals);
  const [selected, setSelected] = useState(null);
  const [globeStatus, setGlobeStatus] = useState("loading");
  const wrapRef = useRef(null);
  const selectRef = useRef(null);
  const selectedRef = useRef(null);
  const sectionRef = useRef(null);
  const logosScrollRef = useRef(null);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let cancelled = false;
    let rafId = null;
    let rotation = [-12, -18];
    let dragging = false;

    const svg = d3Select(wrap)
      .append("svg")
      .attr("viewBox", `0 0 ${GLOBE_SIZE} ${GLOBE_SIZE}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .style("cursor", "grab");

    const projection = geoOrthographic()
      .scale(GLOBE_RADIUS)
      .translate([GLOBE_SIZE / 2, GLOBE_SIZE / 2])
      .clipAngle(90)
      .rotate(rotation);
    const path = geoPath(projection);

    const defs = svg.append("defs");

    const glow = defs.append("filter").attr("id", "globe-glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    glow.append("feGaussianBlur").attr("stdDeviation", 8).attr("result", "blur");
    glow.append("feFlood").attr("flood-color", "#54b7ff").attr("flood-opacity", 0.28);
    glow.append("feComposite").attr("in2", "blur").attr("operator", "in");
    glow.append("feMerge").selectAll("feMergeNode").data(["glow", "SourceGraphic"]).join("feMergeNode").attr("in", (d) => d);

    const oceanGradient = defs
      .append("radialGradient")
      .attr("id", "globe-ocean")
      .attr("cx", "35%")
      .attr("cy", "32%")
      .attr("r", "75%");
    oceanGradient.append("stop").attr("offset", "0%").attr("stop-color", "#4f9fd6");
    oceanGradient.append("stop").attr("offset", "55%").attr("stop-color", "#1f6fa8");
    oceanGradient.append("stop").attr("offset", "100%").attr("stop-color", "#0b3d63");

    const landGradient = defs
      .append("radialGradient")
      .attr("id", "globe-land")
      .attr("cx", "35%")
      .attr("cy", "32%")
      .attr("r", "80%");
    landGradient.append("stop").attr("offset", "0%").attr("stop-color", "#8bc36a");
    landGradient.append("stop").attr("offset", "60%").attr("stop-color", "#4f8f3d");
    landGradient.append("stop").attr("offset", "100%").attr("stop-color", "#2f5f28");

    svg
      .append("circle")
      .attr("cx", GLOBE_SIZE / 2)
      .attr("cy", GLOBE_SIZE / 2)
      .attr("r", GLOBE_RADIUS)
      .attr("fill", "url(#globe-ocean)")
      .attr("stroke", "#0b3d63")
      .attr("stroke-width", 0.75)
      .attr("filter", "url(#globe-glow)");

    const landGroup = svg.append("g");
    const pinGroup = svg.append("g");

    function draw() {
      projection.rotate(rotation);
      landGroup.selectAll("path").attr("d", path);
      pinGroup.selectAll("g").each(function (d) {
        const coords = projection([d.lon, d.lat]);
        const visible = geoDistance([d.lon, d.lat], [-rotation[0], -rotation[1]]) < Math.PI / 2;
        const node = d3Select(this);
        node.style("display", visible ? null : "none");
        if (!visible) return;
        const active = selectedRef.current === d.name;
        node.attr("transform", `translate(${coords[0]},${coords[1]})`);
        node.select(".pin-halo").attr("r", active ? 11 : 7).attr("opacity", active ? 0.35 : 0.18);
        node.select(".pin-core").attr("r", active ? 5 : 3.5);
      });
    }

    function rotateTo(lon, lat) {
      const target = [-lon, -lat];
      d3Transition()
        .duration(700)
        .tween("rotate", () => {
          const i = d3Interpolate(rotation, target);
          return (t) => {
            rotation = i(t);
            draw();
          };
        });
    }

    function selectCountry(name) {
      setSelected(name);
      const country = countries.find((c) => c.name === name);
      if (country) rotateTo(country.lon, country.lat);
    }
    selectRef.current = selectCountry;

    fetch(LAND_TOPOLOGY_URL)
      .then((res) => res.json())
      .then((world) => {
        if (cancelled) return;

        const land = topoFeature(world, world.objects.land);
        landGroup
          .append("path")
          .datum(land)
          .attr("fill", "url(#globe-land)")
          .attr("stroke", "#274a20")
          .attr("stroke-width", 0.3)
          .attr("opacity", 0.95);

        const pins = pinGroup
          .selectAll("g")
          .data(countries)
          .join("g")
          .style("cursor", "pointer")
          .on("click", (_event, d) => selectCountry(d.name));

        pins.append("circle").attr("class", "pin-halo").attr("fill", (d) => d.hue);
        pins
          .append("circle")
          .attr("class", "pin-core")
          .attr("fill", (d) => d.hue)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.2);

        draw();
        setGlobeStatus("ready");

        let lastPointer = null;
        svg.call(
          d3Drag()
            .on("start", (event) => {
              lastPointer = [event.x, event.y];
              dragging = true;
              svg.style("cursor", "grabbing");
            })
            .on("drag", (event) => {
              if (!lastPointer) return;
              const dx = event.x - lastPointer[0];
              const dy = event.y - lastPointer[1];
              rotation = [rotation[0] + dx * 0.5, Math.max(-80, Math.min(80, rotation[1] - dy * 0.5))];
              lastPointer = [event.x, event.y];
              draw();
            })
            .on("end", () => {
              lastPointer = null;
              dragging = false;
              svg.style("cursor", "grab");
            })
        );

        const reduceMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!reduceMotion) {
          const tick = () => {
            if (!dragging && !selectedRef.current) {
              rotation = [rotation[0] + AUTO_SPIN_SPEED, rotation[1]];
              draw();
            }
            rafId = requestAnimationFrame(tick);
          };
          rafId = requestAnimationFrame(tick);
        }
      })
      .catch(() => {
        if (!cancelled) setGlobeStatus("error");
      });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      d3Select(wrap).selectAll("*").remove();
    };
  }, [countries]);

  // Desktop only: while this section fills the viewport, redirect wheel scroll into the
  // logos column instead of the page. Once the logos are fully scrolled, release the
  // wheel back to normal page scroll so the next section can take over.
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    let isDesktop = desktopQuery.matches;
    const handleDesktopChange = (event) => {
      isDesktop = event.matches;
    };
    desktopQuery.addEventListener("change", handleDesktopChange);

    function handleWheel(event) {
      if (!isDesktop || event.ctrlKey) return;

      const section = sectionRef.current;
      const logos = logosScrollRef.current;
      if (!section || !logos) return;

      const rect = section.getBoundingClientRect();
      const fillsViewport = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!fillsViewport) return;

      const atBottom = logos.scrollTop + logos.clientHeight >= logos.scrollHeight - 1;
      const atTop = logos.scrollTop <= 0;

      if (event.deltaY > 0 && !atBottom) {
        event.preventDefault();
        logos.scrollTop += event.deltaY;
      } else if (event.deltaY < 0 && !atTop) {
        event.preventDefault();
        logos.scrollTop += event.deltaY;
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, []);

  const clearSelection = () => setSelected(null);

  const activeCountry = selected ? countries.find((c) => c.name === selected) : null;
  const visiblePrincipals = activeCountry ? activeCountry.principals : allPrincipals;
  // Being has no catalog products, so it isn't in `principals`/countryGeo groupings, but it's
  // shown as a static logo tile under China (see the logos grid below) — count it there too.
  const countryBrandCount = (country) =>
    country.principals.length + (country.name === "China" ? 1 : 0);
  const visibleBrandCount = activeCountry
    ? countryBrandCount(activeCountry)
    : visiblePrincipals.length;

  return (
    <section
      ref={sectionRef}
      className="principals-showcase relative flex flex-col overflow-hidden bg-[#f7f8fa] px-4 py-12 sm:px-6 lg:h-[calc(100vh-var(--header-offset,0px))] lg:px-8 lg:py-10"
      id="principals"
      data-scroll-skip
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-16 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(190,0,16,0.09),transparent_68%)] blur-2xl" />
        <div className="absolute -right-24 bottom-0 size-[480px] rounded-full bg-[radial-gradient(circle,rgba(31,111,168,0.11),transparent_68%)] blur-2xl" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(15,23,42,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.5)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      </div>

      <div className="relative mx-auto mb-8 w-full max-w-[1240px] shrink-0 lg:mb-6">
        <RecTag>Our Principals</RecTag>
        <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
          A global network of scientific leaders
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
          We represent {allPrincipals.length} principals across {countries.length} countries. Spin the
          globe or pick a country to see who we bring to Indian labs.
        </p>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-[300px_230px_1fr] lg:items-stretch">
        <div className="relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-white/80 to-white/35 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.09)] ring-1 ring-black/[0.025] backdrop-blur-xl">
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-red/50 to-transparent" />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft shadow-sm">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-emerald-500" /></span>
            Global network
          </div>
          <div
            className="relative h-[270px] w-[270px] flex-none select-none overflow-visible rounded-full sm:h-[290px] sm:w-[290px]"
            style={{ touchAction: "none" }}
          >
            <div className="absolute inset-0" ref={wrapRef} />
            {globeStatus !== "ready" ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {globeStatus === "error" ? (
                  <p className="max-w-[70%] text-center text-xs text-ink-soft">
                    Globe map data could not load. Check your connection.
                  </p>
                ) : (
                  <FiGlobe aria-hidden="true" className="h-16 w-16 animate-pulse text-black/10" />
                )}
              </div>
            ) : null}
          </div>
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft/70"><FiMove aria-hidden="true" /> Drag to explore</p>
        </div>

        <div className="principals-scroll flex flex-col gap-2 rounded-[28px] border border-white/80 bg-white/55 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.025] backdrop-blur-xl lg:min-h-0 lg:overflow-y-auto">
          <div className="mb-1 flex items-center justify-between px-2 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft/60">Explore by region</span>
            <FiMapPin aria-hidden="true" className="size-3.5 text-red" />
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide transition duration-300 ${
              !selected
                ? "border-red bg-gradient-to-r from-red to-[#d51b2b] text-white shadow-[0_8px_20px_rgba(190,0,16,0.22)]"
                : "border-white bg-white/80 text-ink-soft shadow-sm hover:translate-x-0.5 hover:border-red/30 hover:text-ink"
            }`}
          >
            All principals
            <span className={`text-[10px] normal-case tracking-normal ${!selected ? "text-white/80" : "text-ink-soft/70"}`}>
              {allPrincipals.length}
            </span>
          </button>
          {countries.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => selectRef.current?.(c.name)}
              className={`group flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition duration-300 ${
                selected === c.name
                  ? "border-red/30 bg-red/[0.07] text-red shadow-[inset_3px_0_0_#be0010]"
                  : "border-white bg-white/75 text-ink-soft shadow-sm hover:translate-x-0.5 hover:border-red/25 hover:bg-white hover:text-ink"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="size-2 shrink-0 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,.8)] transition group-hover:scale-125" style={{ background: c.hue }} />
                {c.label}
              </span>
              <span className="text-[10px] text-ink-soft/70">{countryBrandCount(c)}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col rounded-[28px] border border-white/80 bg-white/55 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.025] backdrop-blur-xl lg:min-h-0 lg:p-5">
          <div className="mb-4 flex shrink-0 flex-wrap items-end justify-between gap-2 border-b border-black/[0.06] pb-4">
            <p className="text-lg font-semibold tracking-tight text-ink">
              {activeCountry ? activeCountry.label : "All principals"}
            </p>
            <p className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
              {visibleBrandCount} brand{visibleBrandCount === 1 ? "" : "s"}
              {activeCountry ? "" : ` across ${countries.length} countries`}
            </p>
          </div>

          <div
            ref={logosScrollRef}
            className="principals-scroll grid grid-cols-2 content-start gap-3 sm:grid-cols-3 lg:min-h-0 lg:flex-1 lg:grid-cols-4 lg:overflow-y-auto lg:pr-2"
          >
            {visiblePrincipals.map((principal) => (
              <PrincipalCard key={principal.slug} principal={principal} />
            ))}
            {!activeCountry ? (
              <>
                <StaticPrincipalLogo name="Being" logo={getPrincipalLogo("being")} />
                <StaticPrincipalLogo name="Lumicks" logo={getPrincipalLogo("lumicks")} />
                <StaticPrincipalLogo name="RotaChrom" logo={getPrincipalLogo("rotachrom")} />
              </>
            ) : activeCountry.name === "China" ? (
              <StaticPrincipalLogo name="Being" logo={getPrincipalLogo("being")} />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
