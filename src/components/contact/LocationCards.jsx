"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdEmail, MdLocalPhone, MdLocationPin } from "react-icons/md";
import { branches, getScreenSize, phoneHref } from "@/data/branches";

export default function LocationCards() {
  const [screenSize, setScreenSize] = useState("lg");
  const [hoveredBranch, setHoveredBranch] = useState(null);
  const [cardHovered, setCardHovered] = useState(false);
  const hideTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSize());

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (hoveredBranch === null && !cardHovered) {
      hideTimeout.current = window.setTimeout(() => {
        setHoveredBranch(null);
      }, 150);
    } else if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
    }

    return () => {
      if (hideTimeout.current) {
        window.clearTimeout(hideTimeout.current);
      }
    };
  }, [hoveredBranch, cardHovered]);

  return (
    <section className="mx-auto px-2 py-8 md:px-12">
      <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
        <div className="w-full text-center sm:text-right md:text-left lg:w-1/4">
          <h1 className="text-2xl text-[#E63946]">12+ Branches Across India</h1>
          <p className="font-maxot text-lg">
            Wherever you are, we&apos;re nearby - ready to support and serve your
            scientific journey.
          </p>
        </div>

        <div className="relative mx-auto w-full rounded-lg">
          <Image
            alt="Location Map"
            className="h-auto w-full object-contain brightness-100"
            height={900}
            priority
            src="/assets/contact/IndiaMap.svg"
            width={900}
          />

          {branches.map((branch, index) => {
            const [top, left] = branch.position[screenSize];

            return (
              <div
                className={`absolute ${
                  hoveredBranch === index ? "z-[9000]" : "z-10"
                }`}
                key={branch.name}
                onMouseEnter={() => setHoveredBranch(index)}
                onMouseLeave={() => {
                  hideTimeout.current = window.setTimeout(() => {
                    if (!cardHovered) {
                      setHoveredBranch(null);
                    }
                  }, 150);
                }}
                style={{ top, left, transform: "translate(-50%, -50%)" }}
              >
                <div className="relative z-[10000] size-6">
                  <div className="location-ping absolute left-1/2 top-1/2 z-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
                  <MdLocationPin className="relative z-10 size-6 text-white drop-shadow" />
                </div>
                <span className="font-maxot mt-1 rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-sm font-medium text-zinc-950 shadow">
                  {branch.name}
                </span>

                {hoveredBranch === index ? (
                  <div
                    className="absolute left-[110%] top-1/2 z-[9999] w-[320px] max-w-xs rounded-lg border-2 border-[#E63946] bg-white p-4 shadow-2xl"
                    onMouseEnter={() => setCardHovered(true)}
                    onMouseLeave={() => {
                      setCardHovered(false);
                      hideTimeout.current = window.setTimeout(() => {
                        setHoveredBranch(null);
                      }, 150);
                    }}
                    style={{ transform: "translateY(-50%)" }}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex items-center justify-center rounded-full bg-[#E63946] p-2">
                        <MdLocationPin className="size-5 text-white" />
                      </span>
                      <h2 className="font-maxot text-xl font-bold tracking-wide text-[#E63946]">
                        {branch.name}
                      </h2>
                    </div>

                    <div className="mb-2 flex items-start gap-3 rounded-lg bg-[#fef2f2] p-3">
                      <MdLocationPin className="mt-0.5 size-5 shrink-0 text-[#E63946]" />
                      <p className="text-sm leading-snug">{branch.address}</p>
                    </div>

                    <div className="mb-2 flex items-start gap-3 rounded-lg bg-[#f5f5f5] p-3">
                      <MdLocalPhone className="mt-0.5 size-5 shrink-0 text-[#E63946]" />
                      <div className="flex flex-col gap-1">
                        {branch.phone.split(",").map((phone, phoneIndex) => (
                          <a
                            className="font-medium underline hover:text-[#E63946]"
                            href={`tel:${phoneHref(phone)}`}
                            key={`${branch.name}-phone-${phoneIndex}`}
                          >
                            {phone.trim()}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-[#f5f5f5] p-3">
                      <MdEmail className="mt-0.5 size-5 shrink-0 text-[#E63946]" />
                      <div className="flex flex-col gap-1">
                        {branch.email.split(",").map((email) => (
                          <a
                            className="font-medium underline hover:text-[#E63946]"
                            href={`mailto:${email.trim()}`}
                            key={`${branch.name}-${email}`}
                          >
                            {email.trim()}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="w-full text-center lg:w-1/4 lg:text-right">
          <h2 className="text-2xl text-[#E63946]">
            Inkarp Is Closer Than You Think
          </h2>
          <p className="font-maxot text-lg">
            Tap into our local teams for expert consultation and service
            tailored to your region.
          </p>
        </div>
      </div>
    </section>
  );
}
