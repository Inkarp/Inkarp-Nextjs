"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiBarChart2, FiCheck, FiCheckCircle } from "react-icons/fi";
import AddToQuoteButton from "@/components/products/AddToQuoteButton";
import PrincipalLogo from "@/components/products/PrincipalLogo";
import useCompareBasket from "@/components/products/useCompareBasket";
import { addToCompare, COMPARE_LIMIT, itemKey, removeFromCompare } from "@/lib/compareBasket";

export default function FinderProductCard({ recommendation, featured = false }) {
  const { product, match, reasons, rank } = recommendation;
  const basket = useCompareBasket();
  const inCompare = basket.some((entry) => itemKey(entry) === itemKey(product));
  const compareFull = !inCompare && basket.length >= COMPARE_LIMIT;
  const toggleCompare = () => {
    if (inCompare) removeFromCompare(itemKey(product));
    else addToCompare(product);
  };
  return (
    <article className={`group flex h-full flex-col border bg-white p-4 transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.1)] ${featured ? "border-red/40" : "border-line-light"}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-ink-soft">#{rank} {featured ? "Best match" : "Recommended"}</span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{match}% match</span>
      </div>
      <Link className="relative mt-4 flex aspect-[4/3] items-center justify-center overflow-hidden bg-parchment-alt" href={product.href}>
        {product.image ? <Image alt={product.imageAlt} className="object-contain p-5 transition duration-500 group-hover:scale-105" fill sizes="(min-width: 1024px) 30vw, 90vw" src={product.image} /> : <PrincipalLogo className="h-12 w-36" principalName={product.principalName} principalSlug={product.principalSlug} />}
      </Link>
      <div className="mt-4 flex items-center justify-between gap-3"><PrincipalLogo className="h-5 w-24" principalName={product.principalName} principalSlug={product.principalSlug} /><span className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{product.countryOfOrigin}</span></div>
      <h2 className="mt-3 text-lg font-semibold leading-snug"><Link className="hover:text-red" href={product.href}>{product.name}</Link></h2>
      <p className="mt-1 text-xs text-ink-soft">{product.industry}</p>
      <div className="my-4 space-y-2 border-t border-line-light pt-4">{reasons.map((reason) => <p className="flex gap-2 text-xs leading-5 text-ink-soft" key={reason}><FiCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />{reason}</p>)}</div>
      <div className="mt-auto space-y-2">
        <div className="grid grid-cols-2 gap-2"><Link className="inline-flex h-10 items-center justify-center gap-1 bg-ink text-xs font-semibold text-white hover:bg-red" href={product.href}>View details <FiArrowUpRight /></Link><AddToQuoteButton product={product} /></div>
        <button
          className={`inline-flex h-9 w-full items-center justify-center gap-1.5 border text-xs font-semibold transition ${inCompare ? "border-ink bg-ink text-white" : compareFull ? "cursor-not-allowed border-line-light bg-parchment-alt text-ink-soft/50" : "border-line-light bg-white text-ink hover:border-ink"}`}
          disabled={compareFull}
          onClick={toggleCompare}
          type="button"
        >
          {inCompare ? <FiCheck className="text-xs" /> : <FiBarChart2 className="text-xs" />}
          {inCompare ? "Added to compare" : compareFull ? "Compare list full" : "Add to compare"}
        </button>
      </div>
    </article>
  );
}
