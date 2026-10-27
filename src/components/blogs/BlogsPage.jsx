"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { posts } from "@/data/blogs";

// A multiple of the 3- and 2-column grids, so each batch fills its rows.
const PAGE_SIZE = 12;

// Listing cards use the related instrument rather than article banner artwork.
// Each post's own `image` in blogs.js now points at the same product photo.
const BLOG_CARD_IMAGES = {
  "metallic-grain-structures-and-their-microscopic-analysis": "/assets/images/productImages/Zeiss/axioscope-5-fl_axiocam-208-color.webp",
  "advancing-biomarker-discovery-through-circulating-tumor-cells-analysis": "/assets/blogs/BlogFour/cytefinder-ii.jpg",
  "tg-dta-analysis-evaluating-decomposition-temperature-in-pharmaceuticals": "/assets/images/productImages/Hitachi/simultaneous-thermogravimetric-analyzer-nexta-sta-series.jpg",
  "automated-mineral-classification-and-measurement-using-machine-learning-and-image-analysis": "/assets/images/productImages/Zeiss/axioscan7_colibri_prev.webp",
  "investigating-thermal-history-effectsonpet-glass-transition-and-melting-behavior-using-differential-scale-calorimetry": "/assets/images/productImages/Hitachi/differential-scanning-calorimeter-dsc-nexta-dsc-series.jpg",
  "algae-based-phosphate-removal-a-sustainable-approach-to-wastewater-treatment": "/assets/images/productImages/radleys/reactor-ready-flex-lab-reactor.jpg",
  "automated-water-sample-concentration-optimizing-radionuclide-and-heavy-metal-analysis-using-large-scale-rotary-evaporation": "/assets/images/productImages/heidolph/hei-vap-industrial-rotary-evaporator.webp",
  "accurate-optical-density-measurements-for-cell-growth-analysis-the-importance-of-od600-measurements": "/assets/images/productImages/Implen/nanophotometer-od600.jpg",
  "specific-heat-capacity-measurements-using-dsc-i": "/assets/images/productImages/Hitachi/differential-scanning-calorimeter-dsc-nexta-dsc-series.jpg",
  "online-monitoring-acid-number-oh-during-polyester-resin-production": "/assets/images/productImages/Bruker/matrix-f-ii-banner-bruker.png",
  "applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials": "/assets/images/productImages/Hitachi/dma-200.png",
  "electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research": "/assets/images/productImages/Bruker/vertex-80-80v-ft-ir-research-spectrometer.png",
  "a-new-biomarker-for-nsclc-immunotherapy-functional-pd-1-pd-l1-engagement": "/assets/blogs/BlogTwentySix/hawk-violet-3-qf-pro.jpg",
  "temperature-modulated-dsc-principles-applications-and-measurement-examples": "/assets/images/productImages/Hitachi/differential-scanning-calorimeter-dsc-nexta-dsc-series.jpg",
  "analysis-of-feed-ingredients-with-ft-nir-spectrometer": "/assets/images/productImages/Bruker/tango-ii-ft-nir-spectrometer.png",
  "minimizing-lcms-artifacts-using-arium-ultrapure-water-systems": "/assets/images/productImages/Sotorius/arium-mini-plus-lab-water-purification-system.png",
  "accurate-and-precise-spike-in-method-for-ctc-validation-studies-with-cellenone": "/assets/images/productImages/cellenONE-product.png",
  "determination-of-protein-content-in-soybeans-using-the-kjeldahl-method": "/assets/images/productImages/Buchi/K-375.webp",
  "optimizing-ethanol-recovery-in-winterized-botanical-extracts-with-heidolph-autoaccurate-technology": "/assets/images/productImages/heidolph/hei-vap-ultimate-control-rotary-evaporator.webp",
  "variable-magnetic-field-generatornanosurf-s-innovative-design": "/assets/images/productImages/Nanosurf/driveafm.jpg",
  "nucleic-acid-quantification-using-implen-nanophotometer": "/assets/images/productImages/Implen/nanophotometer-np80.jpg",
  "exploring-the-role-of-precision-x-ray-imaging-in-cancer-biology": "/assets/images/productImages/Zeiss/axio-observer-ls_product.webp",
  "kidney-stone-analysis-using-atr-with-bruker-alpha-ii-spectrometer": "/assets/images/productImages/Bruker/banner-alpha.png",
  "achieving-precision-in-moisture-analysis-installation-of-the-mettler-toledo-hx204-moisture-analyzer": "/assets/images/productImages/Mettler/halogen-moisture-analyzer-hx204.jpg",
  "ensuring-sample-integrity-in-clinical-trials-with-being-86-ultra-low-temperature": "/assets/blogs/legacy/ensuring-sample-integrity-in-clinical-trials-with-being-86-ultra-low-temperature/Ultra-Low-Temperature-banner.jpg",
  "exploring-cell-based-liquid-biopsy-beyond-circulating-tumour-cell-enumeration-with-the-rarecyte-platform": "/assets/blogs/BlogFour/cytefinder-ii.jpg",
  "advancing-sustainable-polymer-synthesis-with-reactor-ready-a-milestone-at-cardiff-university": "/assets/images/productImages/radleys/reactor-ready-flex-lab-reactor.jpg",
  "enhancing-polymer-research-with-radleys-mya-4-reaction-station": "/assets/images/productImages/radleys/mya-4-reaction-station.jpg",
  "optimising-protein-purification-processes-with-the-kubota-m500tr-centrifuge": "/assets/images/productImages/Kubota/benchtop-high-speed-refrigerated-centrifuge-model-m500tr.jpg",
  "using-bruker-alpha-ii-ftir-for-rapid-material-identification-in-chemical-industries": "/assets/images/productImages/Bruker/banner-alpha.png",
  "exploring-the-kjeldahl-method-case-studies-and-applications-in-protein-analysis": "/assets/images/productImages/Buchi/K-375.webp",
  "optimizing-solvent-recovery-in-pharmaceutical-processes-with-heidolph-rotary-evaporators": "/assets/images/productImages/heidolph/hei-vap-expert-control-rotary-evaporator.webp",
};

function getCardImage(post) {
  return BLOG_CARD_IMAGES[post.slug] || post.image;
}

function BlogCard({ post, index }) {
  const cardImage = getCardImage(post);
  const isProductShot = Boolean(BLOG_CARD_IMAGES[post.slug]) || cardImage?.includes("/productImages/");

  // One way in: the "Read article" button. The card itself is not a link.
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-32px_rgba(15,23,42,0.55)]">
      {cardImage ? (
        <div className={`relative h-56 overflow-hidden ${isProductShot ? "bg-gradient-to-br from-slate-50 via-white to-slate-100" : "bg-slate-100"}`}>
          <div className={`absolute ${isProductShot ? "inset-5" : "inset-0"}`}>
            <Image
              alt={post.title}
              className={isProductShot ? "object-contain" : "object-cover"}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={cardImage}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/15 to-transparent" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-slate-900">{post.title}</h3>
        <p className="line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{post.excerpt}</p>
        <div className="border-t border-slate-100 pt-4">
          <Link
            className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
            href={`/blog/${post.slug}`}
          >
            Read article <FiArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      <span className="absolute right-5 top-[13.25rem] text-[11px] font-bold tracking-[0.15em] text-slate-300">{String(index + 1).padStart(2, "0")}</span>
    </article>
  );
}

export default function BlogsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const loadMoreRef = useRef(null);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      if (!query) return true;
      return [post.title, post.excerpt, ...(post.tags || [])].join(" ").toLowerCase().includes(query);
    });
  }, [searchQuery]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  useEffect(() => {
    if (!hasMore) return;
    const target = loadMoreRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisibleCount((count) => count + PAGE_SIZE);
      },
      { rootMargin: "200px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <main className="overflow-hidden bg-[#f7f8fa]">
      <h1 className="sr-only">Inkarp Blog: laboratory equipment guides and buying advice</h1>

      <section className="mx-auto max-w-[1180px] px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm" data-reveal>
          <label className="relative block w-full">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input aria-label="Search articles" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-900/10" onChange={(event) => { setSearchQuery(event.target.value); setVisibleCount(PAGE_SIZE); }} placeholder="Search articles and topics" type="search" value={searchQuery} />
          </label>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center"><FiSearch className="mx-auto size-8 text-slate-300" /><p className="mt-4 font-semibold text-slate-800">No matching articles found</p><p className="mt-1 text-sm text-slate-500">Try a different topic or search term.</p></div>
        ) : (
          <div className="space-y-12" data-reveal>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">{visiblePosts.map((post, index) => <BlogCard index={index} key={post.id} post={post} />)}</div>

            {hasMore && <div className="flex justify-center pt-2" ref={loadMoreRef}><div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-500 shadow-sm"><div className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />Loading more insights</div></div>}
          </div>
        )}
      </section>
    </main>
  );
}
