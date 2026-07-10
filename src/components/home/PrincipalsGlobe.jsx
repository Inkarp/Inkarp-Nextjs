"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { drag as d3Drag } from "d3-drag";
import { geoDistance, geoOrthographic, geoPath } from "d3-geo";
import { interpolate as d3Interpolate } from "d3-interpolate";
import { select as d3Select } from "d3-selection";
import { transition as d3Transition } from "d3-transition";
import { FiGlobe } from "react-icons/fi";
import { feature as topoFeature } from "topojson-client";
import RecTag from "./RecTag";
import { countryGeo } from "@/data/countryGeo";
import { getPrincipalLogo } from "@/data/products/principalLogos";
import { productPrincipals } from "@/data/products/principals";

const GLOBE_SIZE = 320;
const GLOBE_RADIUS = 150;
const AUTO_SPIN_SPEED = 0.05;
const LAND_TOPOLOGY_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";

function useCountryGroups() {
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
  }, []);
}

function PrincipalCard({ principal }) {
  const logo = getPrincipalLogo(principal.slug);

  return (
    <Link
      href={`/products?brand=${principal.slug}`}
      aria-label={principal.principalName}
      className="flex min-h-[72px] items-center justify-center rounded-lg border border-line-light bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-red/50 hover:shadow-md"
    >
      {logo ? (
        <span className="relative h-10 w-full">
          <Image src={logo} alt={principal.principalName} fill sizes="140px" className="object-contain" />
        </span>
      ) : (
        <span className="text-sm font-semibold text-ink">{principal.principalName}</span>
      )}
    </Link>
  );
}

export default function PrincipalsGlobe() {
  const { countries, allPrincipals } = useCountryGroups();
  const [selected, setSelected] = useState(null);
  const [globeStatus, setGlobeStatus] = useState("loading");
  const wrapRef = useRef(null);
  const selectRef = useRef(null);
  const selectedRef = useRef(null);

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

    svg
      .append("circle")
      .attr("cx", GLOBE_SIZE / 2)
      .attr("cy", GLOBE_SIZE / 2)
      .attr("r", GLOBE_RADIUS)
      .attr("fill", "#bfe0f5")
      .attr("stroke", "#8fc3e0");

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
        landGroup.append("path").datum(land).attr("fill", "#4a9d5f").attr("opacity", 0.9);

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

  const clearSelection = () => setSelected(null);

  const activeCountry = selected ? countries.find((c) => c.name === selected) : null;
  const visiblePrincipals = activeCountry ? activeCountry.principals : allPrincipals;

  return (
    <section className="bg-parchment px-4 py-12 sm:px-6 lg:px-8 lg:py-16" id="principals" data-reveal>
      <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center">
        <RecTag>Our Principals</RecTag>
        <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
          A global network of scientific leaders
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base">
          We represent {allPrincipals.length} principals across {countries.length} countries. Spin the
          globe or pick a country to see who we bring to Indian labs.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[380px_1fr] lg:items-start">
        <div className="flex flex-col items-center gap-6">
          <div
            className="relative h-[300px] w-[300px] select-none overflow-hidden rounded-full shadow-[inset_-14px_-14px_44px_rgba(0,0,0,0.14),inset_8px_8px_24px_rgba(255,255,255,0.5)] sm:h-[340px] sm:w-[340px]"
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

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={clearSelection}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                !selected
                  ? "border-red bg-red text-white"
                  : "border-line-light bg-white text-ink-soft hover:border-red/40 hover:text-ink"
              }`}
            >
              All
            </button>
            {countries.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => selectRef.current?.(c.name)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  selected === c.name
                    ? "border-red bg-red/5 text-red"
                    : "border-line-light bg-white text-ink-soft hover:border-red/40 hover:text-ink"
                }`}
              >
                <span className="size-2 rounded-full" style={{ background: c.hue }} />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line-light pb-4">
            <p className="text-sm font-semibold text-ink">
              {activeCountry ? activeCountry.label : "All principals"}
            </p>
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              {visiblePrincipals.length} brand{visiblePrincipals.length === 1 ? "" : "s"}
              {activeCountry ? "" : ` across ${countries.length} countries`}
            </p>
          </div>

          <div className="grid max-h-[440px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-4">
            {visiblePrincipals.map((principal) => (
              <PrincipalCard key={principal.slug} principal={principal} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
