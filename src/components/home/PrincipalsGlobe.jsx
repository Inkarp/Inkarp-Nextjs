"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiGlobe } from "react-icons/fi";
import { countryGeo } from "@/data/countryGeo";
import { getPrincipalLogo } from "@/data/products/principalLogos";
import { productPrincipals } from "@/data/products/principals";

const TILT_RAD = (16 * Math.PI) / 180;
const RADIUS_PCT = 42;
const DRAG_SENSITIVITY = 0.35;
const AUTO_SPIN_SPEED = 0.045;

function project(lat, lon, rotationY) {
  const phi = (lat * Math.PI) / 180;
  const theta = ((lon + rotationY) * Math.PI) / 180;
  const x = Math.cos(phi) * Math.sin(theta);
  const y0 = Math.sin(phi);
  const z0 = Math.cos(phi) * Math.cos(theta);
  return {
    x,
    y: y0 * Math.cos(TILT_RAD) - z0 * Math.sin(TILT_RAD),
    z: y0 * Math.sin(TILT_RAD) + z0 * Math.cos(TILT_RAD),
  };
}

function shortestTarget(current, target) {
  const diff = (((target - current + 180) % 360) + 360) % 360 - 180;
  return current + diff;
}

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
  const [rotation, setRotation] = useState(-8);
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startRotation: 0 });
  const frontRef = useRef(null);

  useEffect(() => {
    if (dragging || selected) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = requestAnimationFrame(function tick() {
      setRotation((r) => r + AUTO_SPIN_SPEED);
      raf = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(raf);
  }, [dragging, selected]);

  const selectCountry = (name) => {
    setSelected(name);
    const geo = countryGeo[name];
    if (geo) setRotation((r) => shortestTarget(r, -geo.lon));
  };

  const clearSelection = () => setSelected(null);

  const handlePointerDown = (e) => {
    setDragging(true);
    dragRef.current = { startX: e.clientX, startRotation: rotation };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const nextRotation = dragRef.current.startRotation + deltaX * DRAG_SENSITIVITY;
    setRotation(nextRotation);

    let bestName = null;
    let bestZ = -Infinity;
    countries.forEach((c) => {
      const { z } = project(c.lat, c.lon, nextRotation);
      if (z > bestZ) {
        bestZ = z;
        bestName = c.name;
      }
    });
    frontRef.current = bestName;
    if (bestName) setSelected(bestName);
  };

  const handlePointerUp = (e) => {
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    const name = frontRef.current;
    const geo = name && countryGeo[name];
    if (geo) setRotation((r) => shortestTarget(r, -geo.lon));
  };

  const activeCountry = selected ? countries.find((c) => c.name === selected) : null;
  const visiblePrincipals = activeCountry ? activeCountry.principals : allPrincipals;

  return (
    <section className="bg-parchment px-4 py-12 sm:px-6 lg:px-8 lg:py-16" id="principals" data-reveal>
      <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center">
        <span className="rounded-full border border-red/30 bg-parchment px-4 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
          Our Principals
        </span>
        <h2 className="text-2xl leading-tight text-red sm:text-3xl">
          A global network of scientific leaders
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
          We represent {allPrincipals.length} principals across {countries.length} countries. Spin the
          globe or pick a country to see who we bring to Indian labs.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[380px_1fr] lg:items-start">
        <div className="flex flex-col items-center gap-6">
          <div
            className="relative h-[300px] w-[300px] select-none rounded-full bg-[radial-gradient(circle_at_32%_28%,#f6f6f5,#d9d9d7_62%,#c6c6c3_100%)] shadow-[inset_-14px_-14px_44px_rgba(0,0,0,0.14),inset_8px_8px_24px_rgba(255,255,255,0.5)] sm:h-[340px] sm:w-[340px]"
            style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <FiGlobe
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 text-black/10"
            />

            {countries.map((c) => {
              const { x, y, z } = project(c.lat, c.lon, rotation);
              const front = Math.max(0, z);
              const left = 50 + x * RADIUS_PCT;
              const top = 50 - y * RADIUS_PCT;
              const opacity = 0.16 + front * 0.84;
              const scale = 0.55 + front * 0.55;
              const isActive = selected === c.name;

              return (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.label}
                  onClick={() => selectCountry(c.name)}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    opacity,
                    zIndex: Math.round((z + 1) * 100),
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    transition: dragging ? "none" : "left 500ms ease-out, top 500ms ease-out, opacity 300ms ease-out",
                  }}
                >
                  <span
                    className="block size-3 rounded-full ring-2 ring-white"
                    style={{
                      background: c.hue,
                      boxShadow: isActive ? `0 0 0 3px ${c.hue}55` : "none",
                    }}
                  />
                </button>
              );
            })}
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
                onClick={() => selectCountry(c.name)}
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
