"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from "react-icons/fi";

const productData = [
  {
    name: "ALPHA II Compact FT-IR Spectrometer",
    category: "Molecular Spectroscopy",
    summary:
      "Compact FT-IR analysis for reliable material identification and everyday QC workflows.",
    image: "/assets/images/productImages/Bruker/banner-alpha.png",
    link: "/products?q=ALPHA%20II%20Compact%20FT-IR%20Spectrometer",
  },
  {
    name: "Mya 4 Reaction Station",
    category: "Reaction Chemistry",
    summary:
      "Parallel reaction control for chemists who need repeatable heating, stirring, and scale flexibility.",
    image: "/assets/images/productImages/radleys/mya-4.png",
    link: "/products?q=Mya%204%20Reaction%20Station",
  },
  {
    name: "Alliance HPLC System",
    category: "Chromatography",
    summary:
      "Trusted liquid chromatography performance for analytical labs and routine separation methods.",
    image: "/assets/images/productImages/Waters/hpcl.png",
    link: "/products?q=Alliance%20HPLC%20System",
  },
  {
    name: "Labstation I",
    category: "Controlled Atmosphere",
    summary:
      "A controlled glovebox environment for sensitive materials, synthesis, and sample handling.",
    image: "/assets/images/productImages/Labstation/labstation.png",
    link: "/products?q=Labstation%20I",
  },
  {
    name: "Hei-VAP Ultimate Control",
    category: "Evaporation",
    summary:
      "Advanced rotary evaporation with precise control for dependable solvent removal.",
    image: "/assets/images/productImages/heidolph/Hei-VAP-Expert-Control.webp",
    link: "/products?q=Hei-VAP%20Ultimate%20Control",
  },
  {
    name: "Arium Comfort II",
    category: "Water Purification",
    summary:
      "Consistent purified water delivery for analytical, life science, and general lab needs.",
    image: "/assets/images/productImages/Sotorius/comfort-II.png",
    link: "/products?q=Arium%20Comfort%20II",
  },
  {
    name: "Freeze Dryer Lyovapor L-300",
    category: "Lyophilization",
    summary:
      "Efficient freeze drying for protecting sample integrity from research to process development.",
    image: "/assets/images/productImages/Buchi/L-300-2.png",
    link: "/products?q=Freeze%20Dryer%20Lyovapor%20L-300",
  },
];

export default function PickProduct() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedProduct = productData[selectedIndex];
  const productOptions = useMemo(() => productData, []);

  useEffect(() => {
    const onKey = (event) => {
      if (["ArrowRight", "ArrowDown"].includes(event.key)) {
        setSelectedIndex((index) => (index + 1) % productOptions.length);
      }

      if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
        setSelectedIndex(
          (index) => (index - 1 + productOptions.length) % productOptions.length
        );
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [productOptions.length]);

  function goToPrevious() {
    setSelectedIndex(
      (index) => (index - 1 + productOptions.length) % productOptions.length
    );
  }

  function goToNext() {
    setSelectedIndex((index) => (index + 1) % productOptions.length);
  }

  return (
    <section className="relative overflow-hidden bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#BE0010]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#BE0010]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-3 text-center">
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
            Precision Picks
          </span>
          <h2 className="font-maxot text-3xl leading-tight text-white sm:text-4xl">
            Explore Our <span className="text-[#ff6b75]">Top Lab Solutions</span>
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            Expert-curated instruments for research, quality control, and
            scale-up teams.
          </p>
        </div>

        {/* Spotlight panel */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:p-10">
          <span
            aria-hidden="true"
            className="font-maxot pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 text-[180px] font-bold leading-none text-white/[0.04] sm:text-[260px]"
          >
            {String(selectedIndex + 1).padStart(2, "0")}
          </span>

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Info */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/50">
                Featured Solution
                <span className="text-[#ff6b75]">
                  {String(selectedIndex + 1).padStart(2, "0")}/
                  {String(productOptions.length).padStart(2, "0")}
                </span>
              </span>

              <h3 className="font-maxot mt-4 text-3xl leading-tight text-white sm:text-4xl">
                {selectedProduct.name}
              </h3>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-[#ff6b75]">
                {selectedProduct.category}
              </p>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
                {selectedProduct.summary}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:max-w-sm">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-white/40">Focus</p>
                  <p className="mt-1 font-semibold text-white">Lab efficiency</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-white/40">Support</p>
                  <p className="mt-1 font-semibold text-white">India-wide</p>
                </div>
              </div>

              <div className="mt-7 flex items-center gap-2">
                <button
                  aria-label="Previous product"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/40 hover:bg-white/10"
                  onClick={goToPrevious}
                  type="button"
                >
                  <FiArrowLeft />
                </button>
                <Link
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#BE0010] px-6 text-sm font-semibold text-white transition hover:bg-[#9f000d] sm:flex-none"
                  href={selectedProduct.link}
                >
                  Explore
                  <FiArrowRight aria-hidden="true" />
                </Link>
                <button
                  aria-label="Next product"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/40 hover:bg-white/10"
                  onClick={goToNext}
                  type="button"
                >
                  <FiArrowRight />
                </button>
              </div>
            </div>

            {/* Image stage */}
            <div className="relative flex aspect-square items-center justify-center">
              <div className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
              <div className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#BE0010]/25" />
              <div className="absolute bottom-6 left-1/2 h-12 w-[70%] -translate-x-1/2 rounded-[50%] bg-[#BE0010]/10 blur-xl" />

              <div className="relative flex h-[78%] w-[78%] items-center justify-center">
                <Image
                  alt={selectedProduct.name}
                  className="object-contain p-4 drop-shadow-[0_30px_40px_rgba(190,0,16,0.25)] transition duration-500"
                  fill
                  key={selectedProduct.image}
                  priority={selectedIndex === 0}
                  sizes="(min-width: 1024px) 40vw, 85vw"
                  src={selectedProduct.image}
                />
              </div>

              <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
                <FiCheckCircle className="text-[#ff6b75]" />
                Curated by specialists
              </div>

              <div className="absolute -right-3 -top-3 size-24 overflow-hidden rounded-full border-2 border-[#BE0010] bg-white shadow-lg shadow-[#BE0010]/30 sm:size-32">
                <Image
                  alt="Dr Dexter"
                  className="object-contain"
                  fill
                  sizes="128px"
                  src="/assets/home/Dexter-2.0.gif"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail dock */}
        <div className="mt-8 flex items-end justify-center gap-3 overflow-x-auto px-1 pb-2">
          {productOptions.map((item, index) => {
            const active = index === selectedIndex;

            return (
              <button
                aria-label={item.name}
                aria-pressed={active}
                className={`relative shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 ${
                  active
                    ? "size-20 border-[#BE0010] shadow-lg shadow-[#BE0010]/30 sm:size-24"
                    : "size-14 border-white/10 opacity-60 hover:opacity-100 hover:border-white/30 sm:size-16"
                }`}
                key={item.name}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <Image
                  alt=""
                  className="object-contain p-1.5"
                  fill
                  sizes="96px"
                  src={item.image}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
