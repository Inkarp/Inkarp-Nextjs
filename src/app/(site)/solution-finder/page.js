import { FiActivity, FiCheckCircle, FiDatabase, FiShield } from "react-icons/fi";
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
    <main className="min-h-screen bg-parchment-alt text-ink" data-scroll-skip>
      <BreadcrumbJsonLd path="/solution-finder" />
      <PageBreadcrumbs path="/solution-finder" />
      <section className="relative overflow-hidden bg-[#111] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
        <div aria-hidden="true" className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_18%_20%,#be0010_0,transparent_32%),radial-gradient(circle_at_80%_80%,#d71920_0,transparent_28%)]" />
        <div className="relative mx-auto max-w-[1180px]">
          <span className="inline-flex border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-white/75">Inkarp Solution Finder</span>
          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">Your laboratory need, translated into a <em className="font-normal text-red-soft">clear solution.</em></h1>
            </div>
            <p className="max-w-xl text-base leading-7 text-white/65 sm:text-lg">Tell us where you work, what you do, and the outcome you need. We will build a ranked instrument shortlist, workflow view, and next-step report in a few minutes.</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-[1180px]"><SolutionFinderWizard initialAnswers={initialAnswers} /></div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-px bg-line-light border border-line-light sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ Icon, title, text }) => <article className="bg-white p-6" key={title}><Icon className="text-2xl text-red" /><h2 className="mt-4 font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p></article>)}
        </div>
      </section>
    </main>
  );
}
