import Image from "next/image";
import { FiActivity, FiCheckCircle, FiDatabase, FiShield, FiZap } from "react-icons/fi";
import SolutionFinderWizard from "@/components/solution-finder/SolutionFinderWizard";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { getDb } from "@/lib/mongodb";
import { findSeedInstitution, institutionIndustrySlug } from "@/lib/solutionFinder";

const HERO_IMAGE = "/assets/home/inkarp-lab-hero-generated.png";

export const metadata = {
  title: "Laboratory Solution Finder | Inkarp",
  description: "Build a personalised laboratory workflow and discover matched scientific instruments, application resources, and support from Inkarp.",
};

const benefits = [
  { Icon: FiActivity, title: "Workflow-led", text: "Recommendations consider the full laboratory process, not only a keyword." },
  { Icon: FiCheckCircle, title: "Explainable matches", text: "Every product includes clear reasons for its position in the report." },
  { Icon: FiDatabase, title: "Built on the catalogue", text: "Results come from Inkarp's live product information and structured tags." },
  { Icon: FiShield, title: "Specialist confirmed", text: "Technical fit and final configuration are verified before quotation." },
];

// The home page widget already asks for institution, role, and interest — so a
// visitor arriving from it has answered everything except industry (never asked
// there) and priorities (Step 4, always new). Deriving industry from the
// institution's own known sector lets those already-answered steps be marked
// complete on arrival instead of re-presenting them for no reason.
async function resolveInstitutionIndustry(institutionId) {
  if (!institutionId) return "";
  try {
    const db = await getDb();
    const record = await db.collection("institutions").findOne(
      { id: institutionId },
      { projection: { _id: 0, industry: 1 } }
    );
    if (record?.industry) return institutionIndustrySlug(record);
  } catch {
    // Fall through to the static seed list below.
  }
  const seed = findSeedInstitution(institutionId);
  return seed ? institutionIndustrySlug(seed) : "";
}

export default async function SolutionFinderPage({ searchParams }) {
  const params = await searchParams;
  const institutionId = params?.institutionId ? String(params.institutionId).slice(0, 100) : "";
  const industry = await resolveInstitutionIndustry(institutionId);
  const initialAnswers = {
    institution: institutionId && params?.institutionName
      ? { id: institutionId, name: String(params.institutionName).slice(0, 180) }
      : null,
    role: typeof params?.role === "string" ? params.role : "",
    industry,
    objective: typeof params?.objective === "string" ? params.objective : "",
  };
  return (
    <main className="solution-universe relative min-h-screen overflow-hidden bg-[#05060b] text-white" data-scroll-skip>
      <BreadcrumbJsonLd path="/solution-finder" />
      <div className="relative z-20 text-white [&_a]:text-white/60 [&_a:hover]:text-white"><PageBreadcrumbs path="/solution-finder" /></div>
      <section className="relative overflow-hidden text-white">
        <div aria-hidden="true" className="absolute inset-0">
          <Image alt="Modern Inkarp laboratory workspace" className="object-cover" fill priority sizes="100vw" src={HERO_IMAGE} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05060b]/90 via-[#05060b]/80 to-[#05060b]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(168,85,247,.34),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(236,72,153,.24),transparent_45%)]" />
        </div>
        <div aria-hidden="true" className="solution-aurora solution-aurora-violet" />
        <div aria-hidden="true" className="solution-aurora solution-aurora-pink" />
        <div className="relative z-10 mx-auto max-w-[1180px] px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/35 bg-fuchsia-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-fuchsia-200 shadow-[0_0_30px_rgba(192,38,211,0.18)]"><FiZap /> Inkarp Intelligence Engine</span>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/70"><i className="solution-live-dot" /> Systems online · catalogue connected</span>
          </div>
          <p className="mx-auto mt-8 max-w-xl font-mono text-[11px] uppercase tracking-[0.28em] text-fuchsia-300/70">Laboratory solution finder</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-6xl">Find the right workflow for your lab.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Tell us what you need and receive a ranked, AI-assisted shortlist from the verified Inkarp catalogue.</p>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]"><SolutionFinderWizard initialAnswers={initialAnswers} /></div>
      </section>

      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ Icon, title, text }, index) => <article className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.06]" key={title}><span className="flex items-center justify-between"><Icon className="text-2xl text-rose-400" /><b className="font-mono text-[10px] text-white/20">0{index + 1}</b></span><h2 className="mt-5 font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}
        </div>
      </section>
    </main>
  );
}
