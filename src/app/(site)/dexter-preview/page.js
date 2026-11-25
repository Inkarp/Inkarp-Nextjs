import Link from "next/link";
import { FiArrowRight, FiPhone, FiRefreshCw, FiSearch } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import AskDexterButton from "@/components/dexter/AskDexterButton";
import DexterAvatar from "@/components/dexter/DexterAvatar";
import DexterFigure from "@/components/dexter/DexterFigure";
import DexterMoment from "@/components/dexter/DexterMoment";
import DexterTip from "@/components/dexter/DexterTip";
import { MoodBoard, ReactionForm } from "@/components/dexter/preview/DexterLiveParts";
import { DEXTER_POSES, MOOD_KEYS, hasNewFace } from "@/data/dexter";
import { finderRoles } from "@/data/solutionFinder";
import { getAllProducts, getProductBySlug } from "@/data/products/principals";
import { siteConfig, whatsappEnquiryHref } from "@/data/siteConfig";
import { closestPages } from "@/lib/dexter/didYouMean";

export const metadata = {
  title: "Dexter preview | Inkarp",
  robots: { index: false, follow: false },
};

// A broken address, as a visitor might type it, and the real pages Dexter finds for it.
const BROKEN_PATH = "/products/hei-vap-cor";

function Place({ name, phase, children, wide = false }) {
  return (
    <li className={`flex flex-col border border-line-light bg-parchment-alt ${wide ? "lg:col-span-2" : ""}`}>
      <div className="flex-1 p-4 sm:p-5">{children}</div>
      <p className="flex items-center justify-between gap-3 border-t border-line-light bg-white px-4 py-2.5 text-[13px]">
        <span className="font-semibold text-ink">{name}</span>
        <span className="border border-line-light bg-parchment-alt px-2 py-0.5 text-[12px] text-ink-soft">{phase}</span>
      </p>
    </li>
  );
}

function Section({ title, intro, children, grey = false }) {
  return (
    <section className={`px-4 py-14 sm:px-6 lg:px-8 ${grey ? "bg-parchment-alt" : ""}`}>
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[28px] leading-tight text-ink sm:text-4xl">{title}</h2>
        {intro ? <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">{intro}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export default function DexterPreview() {
  const products = getAllProducts();
  const pages = products.map((product) => ({ href: `/products/${product.slug}`, title: product.name }));
  const suggestions = closestPages(BROKEN_PATH, pages);
  const nearestRotavaps = closestPages("rotary-evaporator", pages);
  const n120 = getProductBySlug("nanophotometer-n120");
  const n120Result = n120?.suitability?.results?.[0];
  const phone = siteConfig.contact.phone;
  const faceNames = [...MOOD_KEYS, ...Object.keys(DEXTER_POSES)];
  const newFaces = faceNames.filter(hasNewFace).length;

  return (
    <main className="bg-white text-ink" data-scroll-skip>
      <div className="border-b border-line-light bg-parchment-alt">
        <p className="mx-auto max-w-[1180px] px-4 py-3 text-[12.5px] text-ink-soft sm:px-6 lg:px-8">
          Dexter preview · nothing on the live site changes until each place is switched on in <code className="bg-white px-1">src/data/dexter.js</code>
        </p>
      </div>

      <header className="px-4 pb-6 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <h1 className="text-4xl leading-[1.05] text-ink sm:text-[52px]">Dexter, on every step of a visit</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Every part below is the real code that would go on the site. Buttons that say Ask Dexter open the real chat with their question already asked.
          </p>
          <p className="mt-4 max-w-2xl border-l-[3px] border-red bg-parchment-alt px-4 py-3 text-[14.5px] leading-relaxed text-ink">
            <b>Faces:</b> {newFaces} of {faceNames.length} new faces in use.{" "}
            {newFaces < faceNames.length
              ? "Until a face arrives from the ChatGPT set, that mood uses today's Dexter, shown through his movement and a small sign (thinking dots, a question mark, confetti). "
              : null}
            To replace a face, save the new image in Desktop\Dexter faces and run <code className="bg-white px-1">node scripts/import-dexter-faces.mjs</code>.
          </p>
        </div>
      </header>

      <Section intro="Each mood has one job. Press Play again to see it once more." title="Eight moods">
        <MoodBoard />
      </Section>

      <Section grey intro="For tip cards, forms, the chat and the thank-you page." title="Four extra poses">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(DEXTER_POSES).map(([key, label]) => (
            <li className="flex flex-col border border-line-light bg-white" key={key}>
              <div className="flex h-[210px] items-end justify-center overflow-hidden bg-parchment-alt pt-6">
                <DexterFigure height={180} mood={key} />
              </div>
              <p className="p-3.5 text-[15px] font-semibold text-ink">
                {label}
                <span className="mt-0.5 block text-[12.5px] font-normal text-ink-soft">{hasNewFace(key) ? "New face" : "Today's Dexter until the new image is imported"}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section intro="Small by default; the full figure only when Dexter is the whole page." title="Four sizes">
        <ul className="grid gap-4 lg:grid-cols-2">
          <Place name="Avatar · the chat button, with a first line about the page" phase="Live → Phase 4">
            <div className="flex h-full flex-col justify-end gap-3">
              <p className="max-w-sm self-start border border-line-light bg-white p-3 text-[14px] leading-snug">
                You&apos;re looking at the <b>Hei-VAP Core Rotary Evaporator</b>. Ask me about solvents, glassware or vacuum and chiller pairing.
              </p>
              <span className="inline-flex items-center gap-2 self-end rounded-full border border-line-light bg-white py-1.5 pl-1.5 pr-4 text-sm font-semibold shadow-[0_8px_24px_-14px_rgba(0,0,0,0.5)]">
                <DexterAvatar size={34} />
                Ask Dexter
              </span>
            </div>
          </Place>
          <Place name="Tip card · workflow stage page" phase="Phase 4">
            <p className="mb-3 text-[12.5px] text-ink-soft">Workflows · Pharmaceuticals · Separation (HPLC)</p>
            <DexterTip
              buttonLabel="Ask Dexter about this stage"
              place="workflow-stage"
              question="Which instruments help when complex matrices co-elute and hide analytes in pharmaceutical HPLC separation?"
            >
              Complex matrices co-eluting and hiding analytes? Ask me which instruments handle it.
            </DexterTip>
          </Place>
          <Place name="Reaction · inside a form" phase="Phase 3">
            <ReactionForm />
          </Place>
          <Place name="Moment · page not found" phase="Phase 2">
            <DexterMoment
              actions={
                <>
                  <Link className="inline-flex items-center gap-2 bg-red px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#a3000e]" href="/products">
                    <FiSearch aria-hidden="true" /> Browse products
                  </Link>
                  <AskDexterButton place="not-found" question={`I was looking for inkarp.co.in${BROKEN_PATH} but the page wasn't found.`} variant="outline">
                    Ask Dexter where it went
                  </AskDexterButton>
                </>
              }
              figureHeight={200}
              label="Page not found"
              mood="puzzled"
              title="This page has moved."
            >
              <p>
                We couldn&apos;t find <code className="bg-parchment-alt px-1">inkarp.co.in{BROKEN_PATH}</code>. Did you mean:
              </p>
              <ul className="mt-2 grid gap-1.5">
                {suggestions.map((page) => (
                  <li key={page.href}>
                    <Link className="flex items-center justify-between gap-3 border border-line-light px-3 py-2 font-medium text-ink hover:border-red hover:text-red" href={page.href}>
                      {page.title}
                      <FiArrowRight aria-hidden="true" className="shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </DexterMoment>
          </Place>
        </ul>
      </Section>

      <Section intro="The same parts in each place from the plan, with the phase it ships in. All examples use real products, questions and contacts from the site." title="Where he appears">
        <ul className="grid gap-4 lg:grid-cols-2">
          <Place name="Error page" phase="Phase 2">
            <DexterMoment
              actions={
                <>
                  <span className="inline-flex items-center gap-2 bg-red px-3.5 py-2 text-sm font-semibold text-white">
                    <FiRefreshCw aria-hidden="true" /> Try again
                  </span>
                  <a className="inline-flex items-center gap-2 border border-line-light bg-white px-3.5 py-2 text-sm font-semibold text-ink hover:border-red hover:text-red" href={`tel:${phone.replace(/\s/g, "")}`}>
                    <FiPhone aria-hidden="true" /> {phone}
                  </a>
                  <a className="inline-flex items-center gap-2 border border-line-light bg-white px-3.5 py-2 text-sm font-semibold text-ink hover:border-red hover:text-red" href={whatsappEnquiryHref("")} rel="noopener noreferrer" target="_blank">
                    <FaWhatsapp aria-hidden="true" /> WhatsApp
                  </a>
                </>
              }
              figureHeight={180}
              label="Something went wrong"
              mood="worried"
              title="That didn't load."
            >
              <p>It&apos;s on our side, not yours. Try again, or reach a person straight away.</p>
            </DexterMoment>
          </Place>
          <Place name="Thank-you page" phase="Phase 3">
            <DexterMoment
              actions={
                <Link className="inline-flex items-center gap-2 bg-red px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#a3000e]" href="/products">
                  Keep browsing <FiArrowRight aria-hidden="true" />
                </Link>
              }
              figureHeight={180}
              label="Enquiry sent"
              mood="celebrate"
              title="Thank you."
            >
              <p>Inkarp will be in touch within 1 business day.</p>
            </DexterMoment>
          </Place>
          <Place name="Products · no filter results" phase="Phase 2">
            <p className="mb-3 text-[12.5px] text-ink-soft">Filters: Rotary evaporators · Bruker</p>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 border border-line-light bg-white p-4">
              <DexterAvatar mood="puzzled" size={52} />
              <div>
                <p className="text-[15px] text-ink">Nothing matches those filters. These three come closest.</p>
                <ul className="mt-3 grid gap-1.5">
                  {nearestRotavaps.map((page) => (
                    <li key={page.href}>
                      <Link className="text-[14.5px] font-medium text-red hover:underline" href={page.href}>{page.title}</Link>
                    </li>
                  ))}
                </ul>
                <AskDexterButton className="mt-3" place="no-results" question="Which rotary evaporators do you have?" variant="outline" />
              </div>
            </div>
          </Place>
          <Place name="Header search · no results" phase="Phase 4">
            <div className="border border-line-light bg-white">
              <p className="flex items-center gap-2 border-b border-line-light px-4 py-3 text-[15px] text-ink">
                <FiSearch aria-hidden="true" className="text-ink-soft" /> moisture in plastic granules
              </p>
              <p className="px-4 py-3 text-[14px] text-ink-soft">No pages match all of those words.</p>
              <div className="flex items-center gap-3 border-t border-line-light bg-[#fdf0f1] px-4 py-3">
                <DexterAvatar size={36} />
                <AskDexterButton place="header-search" question="I need to measure moisture in plastic granules." variant="link">
                  Ask Dexter instead
                </AskDexterButton>
              </div>
            </div>
          </Place>
          <Place name="Product page · after the FAQs" phase="Phase 4">
            <p className="mb-3 text-[12.5px] text-ink-soft">Hei-VAP Core Rotary Evaporator · Frequently asked questions</p>
            <DexterTip buttonLabel="Ask Dexter about this product" place="product-faq" question="I have a question about the Hei-VAP Core Rotary Evaporator.">
              Didn&apos;t find your answer? Ask me about the Hei-VAP Core.
            </DexterTip>
          </Place>
          {n120Result ? (
            <Place name="Product page · a tool's result" phase="Phase 4">
              <p className="mb-3 text-[12.5px] text-ink-soft">NanoPhotometer® N120 · {n120.suitability.eyebrow}</p>
              <div className="border border-line-light bg-white p-4">
                <p className="flex items-center gap-2 text-[12.5px] font-semibold text-red">
                  <DexterAvatar mood="wow" size={28} /> Dexter&apos;s read
                </p>
                <p className="mt-2 text-[16px] font-semibold leading-snug text-ink">{n120Result.title}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{n120Result.body}</p>
              </div>
            </Place>
          ) : null}
          <Place name="Solution Finder · Dexter asks the questions" phase="Phase 4">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
              <DexterAvatar mood="listening" size={48} />
              <div className="border border-line-light bg-white p-4">
                <p className="text-[16px] font-semibold text-ink">What best describes your role?</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {finderRoles.slice(0, 4).map((role) => (
                    <span className="border border-line-light px-3 py-2 text-[13.5px] text-ink" key={role.value}>{role.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </Place>
          <Place name="Compare · nothing picked yet" phase="Phase 4">
            <div className="grid justify-items-center gap-3 border border-dashed border-line-light bg-white p-6 text-center">
              <DexterAvatar mood="hello" size={64} />
              <p className="max-w-xs text-[15px] text-ink">Pick two to four instruments and I&apos;ll line them up side by side.</p>
              <AskDexterButton place="compare" question="Help me choose instruments to compare." variant="outline">
                Ask Dexter which to compare
              </AskDexterButton>
            </div>
          </Place>
          <Place name="Quote list · empty" phase="Phase 4">
            <div className="grid justify-items-center gap-3 border border-dashed border-line-light bg-white p-6 text-center">
              <DexterAvatar mood="puzzled" size={64} />
              <p className="max-w-xs text-[15px] text-ink">Your quote list is empty. Add instruments from any product page.</p>
              <Link className="text-[14px] font-semibold text-red hover:underline" href="/products">Browse products</Link>
            </div>
          </Place>
          <Place name="Home page · under the hero" phase="Phase 5">
            <div className="flex flex-wrap items-center gap-4 border border-line-light bg-white p-4">
              <DexterAvatar size={56} />
              <p className="min-w-0 flex-1 text-[15px] text-ink">
                <b>Meet Dexter, Inkarp&apos;s lab guide.</b> Tell him what you measure and he&apos;ll point you to the right instrument.
              </p>
              <AskDexterButton place="home-intro" question="Help me choose an instrument." />
            </div>
          </Place>
          <Place name="Footer · on every page" phase="Phase 5">
            <div className="flex flex-wrap items-center gap-3 bg-ink p-4 text-white">
              <DexterAvatar size={40} />
              <p className="min-w-0 flex-1 text-[14px] text-white/85">Questions about an instrument? Dexter answers any time.</p>
              <AskDexterButton place="footer" question="I have a question about an instrument." variant="outline" />
            </div>
          </Place>
        </ul>
      </Section>
    </main>
  );
}
