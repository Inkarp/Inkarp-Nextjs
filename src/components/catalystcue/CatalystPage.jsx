"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CatalystLatestIssue from "@/components/catalystcue/CatalystLatestIssue";
import CatalystModal from "@/components/catalystcue/CatalystModal";
import { catalystCards } from "@/data/catalystCue";

export default function CatalystPage() {
  const [showCatalystModal, setShowCatalystModal] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowCatalystModal(true), 5000);

    return () => window.clearTimeout(timer);
  }, []);

  const groupedByVolume = useMemo(() => {
    return catalystCards.reduce((accumulator, card) => {
      accumulator[card.Volume] ||= [];
      accumulator[card.Volume].push(card);
      return accumulator;
    }, {});
  }, []);

  const sortedVolumeKeys = useMemo(() => {
    return Object.keys(groupedByVolume).sort((a, b) => {
      const numA = Number.parseInt(a.split("-")[1], 10);
      const numB = Number.parseInt(b.split("-")[1], 10);
      return numB - numA;
    });
  }, [groupedByVolume]);

  const latestIssue = useMemo(() => {
    return [...catalystCards].sort((a, b) => b.id - a.id)[0];
  }, []);

  return (
    <main className="relative">
      <Image
        alt="CatalystCue Banner"
        className="h-auto w-full object-cover object-center px-5"
        height={980}
        priority
        src="/assets/catalyst/CatalystcueBannerVolume02Issue02.jpeg"
        // style={{ borderRadius: "0 0 85% 85% / 30%" }}
        width={1920}
      />

      <CatalystLatestIssue issue={latestIssue} />

      <div className="p-5" id="catalyst-archive">
        {sortedVolumeKeys.map((volume) => {
          const volumeCards = [...groupedByVolume[volume]].sort(
            (a, b) => b.id - a.id
          );

          return (
            <section className="mb-10" key={volume}>
              <div className="flex justify-center">
                <h2 className="mb-4 border border-[#E63946] px-4 py-1 text-xl font-bold">
                  {volume}
                </h2>
              </div>

              <div className="flex flex-wrap justify-center gap-8">
                {volumeCards.map((card) => (
                  <Link
                    className="flex w-[270px] flex-col overflow-hidden border border-white bg-[#1A2D51] text-white transition-transform duration-500 hover:scale-105"
                    href={`/catalystcue/${encodeURIComponent(card.slug)}`}
                    key={card.slug}
                  >
                    <Image
                      alt={card.subTitle}
                      className="h-[380px] w-[270px] object-cover"
                      height={380}
                      src={card.image}
                      width={270}
                    />
                    <div className="flex min-h-10 items-center justify-center gap-2 p-2 text-center">
                      <h3>{card.subTitle}</h3>
                      <span>|</span>
                      <p>{card.Date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {showCatalystModal ? (
        <div className="z-[10000]">
          <CatalystModal onClose={() => setShowCatalystModal(false)} />
        </div>
      ) : null}
    </main>
  );
}
