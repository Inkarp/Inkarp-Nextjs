"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const productData = [
  {
    name: "Bruker ALPHA II Compact FT-IR Spectrometer",
    image: "/assets/images/productImages/Bruker/banner-alpha.png",
    description: "Compact benchtop FT-IR spectrometer for routine analysis",
    dos: [
      "Keep the Bruker ALPHA II in a clean, dry, vibration-free space.",
      "Handle the ATR crystals and modules gently and clean them with wipes.",
      "Always use a grounded power supply for safe operation.",
      "After moving the spectrometer, let it settle before starting work.",
      "Run regular background checks and maintenance to keep performance sharp.",
    ],
    donts: [
      "Never expose the ALPHA II to dust, humidity, or harsh fumes.",
      "Don't force the ATR pressure arm — treat it carefully.",
      "Avoid spraying solvents directly on the instrument.",
      "Don't block the air vents — it needs to breathe.",
      "Never tamper with the internal parts or optics — leave that to experts.",
    ],
  },
  {
    name: "Mya-4 Automated Reaction Station",
    image: "/assets/images/productImages/radleys/mya-4.png",
    description: "High-performance reaction automation with precise control",
    dos: [
      "Use compatible vessels and secure clamps before heating.",
      "Set ramp rates and safety limits for temp/flow.",
      "Log parameters for reproducibility.",
      "Wear PPE when handling hot vessels or solvents.",
      "Inspect tubing and joints for leaks before each run.",
    ],
    donts: [
      "Do not exceed recommended temperature/pressure limits.",
      "Avoid dry running circulators or pumps.",
      "Don't move the unit while in operation.",
      "Do not mix incompatible chemicals in the same loop.",
      "Avoid blocking airflow around electronics.",
    ],
  },
  {
    name: "Alliance HPLC System",
    image: "/assets/images/productImages/Waters/hpcl.png",
    description: "Reliable liquid chromatography for analytical labs",
    dos: [
      "Filter and degas mobile phases; label bottles clearly.",
      "Use correct fittings; tighten to spec to avoid leaks.",
      "Prime lines after solvent change; purge air.",
      "Schedule routine seal/washer replacement.",
      "Flush columns with appropriate solvent after use.",
    ],
    donts: [
      "Do not run buffers in columns not rated for them.",
      "Avoid sudden gradient jumps without equilibration.",
      "Do not let reservoirs run dry.",
      "Don't overtighten PEEK fittings (risk of cracking).",
      "Avoid strong solvents on non-compatible tubing.",
    ],
  },
  {
    name: "Labstation I Glovebox Analyzer",
    image: "/assets/images/productImages/Labstation/labstation-i-solvent-purification-system-sps.png",
    description: "Advanced inert-atmosphere control with safety features",
    dos: [
      "Purge and maintain inert atmosphere per SOP.",
      "Use antechamber cycles for all transfers.",
      "Log O2/H2O ppm; service purifier as recommended.",
      "Wear nitrile gloves; inspect glove integrity routinely.",
      "Store moisture-sensitive samples in sealed containers.",
    ],
    donts: [
      "Do not open main door without proper purge.",
      "Avoid sharp tools that could puncture gloves.",
      "Do not bring wet/contaminated items inside.",
      "Avoid running purifier past capacity limits.",
      "Do not block circulation vents inside the box.",
    ],
  },
  {
    name: "Hei-VAP Ultimate Control Rotary Evaporator",
    image: "/assets/images/productImages/heidolph/hei-vap-expert-control-rotary-evaporator.webp",
    description: "Fully automated rotary evaporator for complex workflows",
    dos: [
      "Check glassware integrity; secure clamps before run.",
      "Use appropriate bath level and temperature.",
      "Match rotation speed and vacuum to solvent BP.",
      "Use bump trap and anti-foam if needed.",
      "Vent to atmosphere before stopping rotation.",
    ],
    donts: [
      "Do not overfill flasks or exceed load capacity.",
      "Avoid thermal shock to hot glassware.",
      "Don't run vacuum without coolant flow to condenser.",
      "Do not handle glass joints with greasy hands.",
      "Avoid touching hot bath surfaces.",
    ],
  },
  {
    name: "Arium Comfort II",
    image: "/assets/images/productImages/Sotorius/comfort-II.png",
    description: "Reliable water purification for everyday lab use",
    dos: [
      "Replace cartridges as per usage indicators.",
      "Use prefilters for high particulate feed water.",
      "Sanitize per schedule to prevent biofilm.",
      "Record conductivity/TOC to verify quality.",
      "Use sterile dispensing protocols for cell culture.",
    ],
    donts: [
      "Do not run the unit dry or with closed outlet.",
      "Avoid non-rated chemicals in feed line.",
      "Do not bypass sanitization cycles.",
      "Avoid storing water in open containers.",
      "Do not block ventilation inlets/outlets.",
    ],
  },
  {
    name: "Freeze Dryer Lyovapor™ L-300",
    image: "/assets/images/productImages/Buchi/L-300-2.png",
    description: "Precision freeze-drying for sensitive samples",
    dos: [
      "Pre-freeze samples to appropriate temperature.",
      "Use compatible vials/trays; avoid overfilling.",
      "Monitor condenser temperature and vacuum level.",
      "Defrost and clean condenser after cycles.",
      "Label samples and log cycle parameters.",
    ],
    donts: [
      "Do not lyophilize solvents that damage the pump.",
      "Avoid sealing wet samples; risk of blowout.",
      "Do not open chamber to atmosphere mid-cycle.",
      "Avoid touching cold surfaces without gloves.",
      "Don't exceed heat input beyond protocol.",
    ],
  },
];

function TipsSlider({ selectedProduct }) {
  const slides = useMemo(() => {
    const { name, image, dos = [], donts = [] } = selectedProduct;

    return [
      {
        id: "image",
        title: name,
        content: (
          <div className="relative flex h-[250px] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-white to-white/60 dark:from-zinc-800 dark:to-zinc-900">
            <Image
              alt={name}
              className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.15)]"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              src={image}
            />
          </div>
        ),
      },
      {
        id: "dos",
        title: (
          <span className="inline-flex items-center gap-2">
            <FiCheckCircle className="text-emerald-500" /> Do&apos;s
          </span>
        ),
        content: (
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700 sm:text-base dark:text-zinc-300">
            {dos.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        ),
      },
      {
        id: "donts",
        title: (
          <span className="inline-flex items-center gap-2">
            <FiXCircle className="text-[#BE0010]" /> Don&apos;ts
          </span>
        ),
        content: (
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700 sm:text-base dark:text-zinc-300">
            {donts.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        ),
      },
    ];
  }, [selectedProduct]);

  const [idx, setIdx] = useState(0);
  const total = slides.length;

  const next = () => setIdx((i) => (i + 1) % total);
  const prev = () => setIdx((i) => (i - 1 + total) % total);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  useEffect(() => {
    setIdx(0);
  }, [selectedProduct]);

  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3">
        <h3 className="font-maxot text-base leading-snug text-[#E63946] sm:text-lg">
          {slides[idx].title}
        </h3>
      </div>

      <div
        className="min-h-[240px] animate-[hvc-fade_400ms_ease-out] [animation-fill-mode:both]"
        key={slides[idx].id}
      >
        {slides[idx].content}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs transition hover:border-[#E63946] hover:text-[#E63946] sm:text-sm dark:border-zinc-700 dark:text-zinc-200"
          onClick={prev}
          type="button"
        >
          Prev
        </button>
        <button
          className="rounded-md bg-[#E63946] px-3 py-1.5 text-xs text-white transition hover:bg-[#BE0010] sm:text-sm"
          onClick={next}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function ProductHandlingGuide() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedProduct = productData[selectedIndex];

  return (
    <section className="relative mx-auto w-[95%] overflow-hidden py-5">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <span className="font-maxot rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs uppercase sm:text-sm dark:bg-zinc-900 dark:text-zinc-100">
          Best Practices
        </span>
        <h2 className="font-maxot text-xl leading-tight text-[#E63946] sm:text-2xl">
          Product Handling Guidelines
        </h2>
        <p className="max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          Clear, reliable, and safe handling practices designed to protect your
          equipment, your team, and your research outcomes.
        </p>
      </div>

      <div className="relative mx-auto mt-8 w-full overflow-hidden rounded-3xl">
        <div className="relative grid grid-cols-1 gap-6 border border-zinc-200 bg-white p-6 lg:grid-cols-12 dark:border-zinc-800 dark:bg-zinc-900">
          {/* Product picker */}
          <div className="flex lg:col-span-3">
            <div className="w-full px-2 lg:hidden">
              <label
                className="mb-2 block text-sm text-zinc-700 dark:text-zinc-300"
                htmlFor="product-handling-select"
              >
                Select a product
              </label>
              <div
                className="rounded-xl p-[1.5px]"
                style={{ background: "linear-gradient(90deg,#BE0010,#E63946)" }}
              >
                <select
                  className="font-maxot w-full rounded-[10px] border border-white/60 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-[#E63946] dark:bg-zinc-950 dark:text-zinc-100"
                  id="product-handling-select"
                  onChange={(event) => setSelectedIndex(Number(event.target.value))}
                  value={selectedIndex}
                >
                  {productData.map((item, idx) => (
                    <option key={item.name} value={idx}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden w-full lg:block">
              <div className="h-full rounded-3xl border border-zinc-200 p-2 shadow-sm dark:border-zinc-800">
                <ul className="sticky top-4 max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                  {productData.map((item, idx) => {
                    const isActive = idx === selectedIndex;

                    return (
                      <li key={item.name}>
                        <button
                          className={`group w-full rounded-xl border p-3 text-left transition ${
                            isActive
                              ? "border-[#E63946]/30 bg-[#E63946]/5 text-[#E63946] shadow-sm"
                              : "border-zinc-200 bg-white text-zinc-900 hover:border-[#E63946]/30 hover:bg-[#E63946]/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                          }`}
                          onClick={() => setSelectedIndex(idx)}
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`size-2.5 shrink-0 rounded-full transition ${
                                isActive
                                  ? "bg-[#E63946]"
                                  : "bg-zinc-300 group-hover:bg-[#E63946]/60 dark:bg-zinc-700"
                              }`}
                            />
                            <p className="min-w-0 truncate text-sm">{item.name}</p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Dr. Dexter + slider */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="relative h-40 w-full">
                    <Image
                      alt="Dr. Dexter"
                      className="rounded-lg object-contain"
                      fill
                      sizes="240px"
                      src="/assets/home/Dexter-2.0.gif"
                      unoptimized
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-maxot text-sm text-[#E63946] sm:text-base">
                      Dr. Dexter&apos;s
                    </p>
                    <p className="text-sm italic text-zinc-700 sm:text-base dark:text-zinc-400">
                      Product Handling Tips
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <TipsSlider selectedProduct={selectedProduct} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
