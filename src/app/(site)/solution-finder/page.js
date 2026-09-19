import { FiActivity, FiCheckCircle, FiCpu, FiDatabase, FiRadio, FiShield, FiZap } from "react-icons/fi";
import SolutionFinderWizard from "@/components/solution-finder/SolutionFinderWizard";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { getDb } from "@/lib/mongodb";
import { findSeedInstitution, institutionIndustrySlug } from "@/lib/solutionFinder";

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
      <section className="relative px-4 pb-20 pt-12 text-white sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
        <div aria-hidden="true" className="solution-universe-grid absolute inset-0" />
        <div aria-hidden="true" className="solution-orbit solution-orbit-one"><span /></div>
        <div aria-hidden="true" className="solution-orbit solution-orbit-two"><span /></div>
        <div aria-hidden="true" className="solution-aurora solution-aurora-red" />
        <div aria-hidden="true" className="solution-aurora solution-aurora-blue" />
        <div className="relative z-10 mx-auto max-w-[1180px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-red/40 bg-red/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-rose-200 shadow-[0_0_30px_rgba(190,0,16,0.18)]"><FiZap /> Inkarp Intelligence Engine</span>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/70"><i className="solution-live-dot" /> Systems online · catalogue connected</span>
          </div>
          <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-cyan-300/70">Enter the solution space</p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">Turn your lab challenge into an <span className="solution-gradient-text">intelligent workflow.</span></h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">Describe your environment and objective. Our intelligence layer maps your needs across instruments, applications, and scientific workflows to create a ranked path forward.</p>
            </div>
            <div className="solution-neural-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Live reasoning map</span><FiRadio className="text-cyan-300" /></div>
              <div className="relative flex h-32 items-center justify-center">
                <div className="solution-core"><FiCpu /></div>
                <span className="solution-node left-[8%] top-[15%]">LAB</span><span className="solution-node right-[4%] top-[12%]">FIT</span>
                <span className="solution-node bottom-[5%] left-[2%]">DATA</span><span className="solution-node bottom-0 right-[8%]">FLOW</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center font-mono text-[9px] uppercase tracking-wider text-white/45"><span>Discover</span><span>Reason</span><span>Recommend</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto -mt-10 max-w-[1180px]"><SolutionFinderWizard initialAnswers={initialAnswers} /></div>
      </section>

      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ Icon, title, text }, index) => <article className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.06]" key={title}><span className="flex items-center justify-between"><Icon className="text-2xl text-rose-400" /><b className="font-mono text-[10px] text-white/20">0{index + 1}</b></span><h2 className="mt-5 font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}
        </div>
      </section>
    </main>
  );
}
