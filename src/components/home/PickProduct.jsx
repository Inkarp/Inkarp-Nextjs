"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import SectionHeading from "@/components/home/SectionHeading";

const productData = [
  {
    name: "ALPHA II Compact FT-IR Spectrometer",
    image: "/assets/images/productImages/Bruker/banner-alpha.png",
    link: "/products?q=ALPHA%20II%20Compact%20FT-IR%20Spectrometer",
  },
  {
    name: "Mya 4 Reaction Station",
    image: "/assets/images/productImages/radleys/mya-4.png",
    link: "/products?q=Mya%204%20Reaction%20Station",
  },
  {
    name: "Alliance HPLC System",
    image: "/assets/images/productImages/Waters/hpcl.png",
    link: "/products?q=Alliance%20HPLC%20System",
  },
  {
    name: "Labstation I",
    image: "/assets/images/productImages/Labstation/labstation.png",
    link: "/products?q=Labstation%20I",
  },
  {
    name: "Hei-VAP Ultimate Control",
    image: "/assets/images/productImages/heidolph/Hei-VAP-Expert-Control.webp",
    link: "/products?q=Hei-VAP%20Ultimate%20Control",
  },
  {
    name: "Arium Comfort II",
    image: "/assets/images/productImages/Sotorius/comfort-II.png",
    link: "/products?q=Arium%20Comfort%20II",
  },
  {
    name: "Freeze Dryer Lyovapor L-300",
    image: "/assets/images/productImages/Buchi/L-300-2.png",
    link: "/products?q=Freeze%20Dryer%20Lyovapor%20L-300",
  },
];

export default function PickProduct() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState(50);
  const cardRef = useRef(null);
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

  function handleMouseMove(event) {
    const rect = cardRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    setTilt({
      x: Math.max(-10, Math.min(10, -y / 18)),
      y: Math.max(-10, Math.min(10, x / 18)),
    });
    setGlare(Math.max(0, Math.min(100, ((x + rect.width / 2) / rect.width) * 100)));
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
    setGlare(50);
  }

  return (
    <section className="relative mx-auto w-full overflow-hidden py-10">
      <SectionHeading
        eyebrow="Precision Picks"
        title="Explore Our Top Lab Solutions"
        description="Expert-curated equipment engineered for accuracy, reliability, and ease."
      />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="lg:hidden">
              <label
                className="mb-2 block text-sm font-medium text-zinc-700"
                htmlFor="pick-product-select"
              >
                Select a product
              </label>
              <div className="rounded-xl bg-gradient-to-r from-[#BE0010] to-[#E63946] p-px">
                <select
                  className="w-full rounded-[11px] border border-white bg-white px-4 py-3 text-sm font-semibold text-zinc-950 outline-none focus:ring-2 focus:ring-[#E63946]/40"
                  id="pick-product-select"
                  onChange={(event) => setSelectedIndex(Number(event.target.value))}
                  value={selectedIndex}
                >
                  {productOptions.map((item, index) => (
                    <option key={item.name} value={index}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden h-full min-h-[250px] rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm lg:flex lg:flex-col">
              <ul className="max-h-[294px] flex-1 space-y-2 overflow-y-auto pr-1">
                {productOptions.map((item, index) => (
                  <li key={item.name}>
                    <button
                      className={`group w-full rounded-xl border p-3 text-left transition ${
                        index === selectedIndex
                          ? "border-[#E63946]/30 bg-[#E63946]/5 text-[#E63946] shadow-sm"
                          : "border-zinc-200 bg-white text-zinc-900 hover:border-[#E63946]/30 hover:bg-[#E63946]/5"
                      }`}
                      onClick={() => setSelectedIndex(index)}
                      type="button"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full transition ${
                            index === selectedIndex
                              ? "bg-[#E63946]"
                              : "bg-zinc-300 group-hover:bg-[#E63946]/60"
                          }`}
                        />
                        <span className="text-sm font-medium leading-5">
                          {item.name}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="grid h-full grid-cols-1 gap-6 px-0 py-2 lg:grid-cols-5">
              <div
                className="relative lg:col-span-3 lg:min-h-[360px]"
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                ref={cardRef}
              >
                <div
                  className="relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 transition-transform duration-200 sm:h-[360px]"
                  style={{
                    transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  }}
                >
                  <div className="absolute -inset-10 bg-[radial-gradient(500px_200px_at_50%_20%,rgba(230,57,70,0.10),transparent)]" />
                  <Image
                    alt={selectedProduct.name}
                    className="object-contain p-8 drop-shadow-[0_20px_25px_rgba(0,0,0,0.15)]"
                    fill
                    key={selectedProduct.image}
                    sizes="(min-width: 1024px) 50vw, 96vw"
                    src={selectedProduct.image}
                  />
                  <div
                    className="pointer-events-none absolute top-0 h-full w-1/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-[left] duration-200"
                    style={{ left: `${glare}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 px-4 lg:col-span-2">
                <div className="relative mx-auto aspect-[4/3] w-[80%] max-w-[280px] overflow-hidden rounded-lg bg-white">
                  <Image
                    alt="Dr Dexter"
                    className="object-contain"
                    fill
                    sizes="280px"
                    src="/assets/home/Dexter-2.0.gif"
                    unoptimized
                  />
                </div>

                <div className="flex justify-center">
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-[#E63946] px-5 py-2.5 font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-red-700"
                    href={selectedProduct.link}
                  >
                    Explore
                    <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
