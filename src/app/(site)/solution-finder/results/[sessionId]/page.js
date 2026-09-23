import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowRight, FiBarChart2, FiLayers, FiMessageCircle, FiShield } from "react-icons/fi";
import { getDb } from "@/lib/mongodb";
import FinderReportActions from "@/components/solution-finder/FinderReportActions";
import MatchScoreBadge from "@/components/solution-finder/MatchScoreBadge";
import FinderProductCard from "@/components/solution-finder/FinderProductCard";
import FinderAiAdvisor from "@/components/solution-finder/FinderAiAdvisor";
import { buildFinderFallbackGuidance } from "@/lib/solutionFinderAi";
import { getCachedFinderSession } from "@/lib/finderSessionFallback";
import FinderResultsReveal from "@/components/solution-finder/FinderResultsReveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { sessionId } = await params;
  return { title: `Solution Report ${sessionId.slice(0, 6).toUpperCase()} | Inkarp`, robots: { index: false, follow: false } };
}

async function getSession(sessionId) {
  if (!/^[A-Za-z0-9_-]{12,40}$/.test(sessionId)) return null;
  try {
    const db = await getDb();
    return db.collection("solutionFinderSessions").findOne({ sessionId }, { projection: { _id: 0, accountEmail: 0, contactEmail: 0 } });
  } catch { return getCachedFinderSession(sessionId); }
}

export default async function FinderResultsPage({ params }) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) notFound();
  const recommendations = session.recommendations ?? [];
  const bestMatch = recommendations[0]?.match ?? 0;

  return (
    <FinderResultsReveal initialReady={Boolean(session.aiGuidance?.summary)} sessionId={sessionId}>
    <main className="min-h-screen bg-parchment-alt text-ink" data-scroll-skip>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_12%_20%,rgba(168,85,247,.34),transparent_26%),radial-gradient(circle_at_88%_75%,rgba(236,72,153,.26),transparent_28%),linear-gradient(110deg,#100822_0%,#24114a_48%,#0d1938_100%)] px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-16">
        <div className="relative mx-auto max-w-[1180px]">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="flex flex-wrap items-start gap-6">
              <MatchScoreBadge score={bestMatch} />
              <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-red-soft">Personalised solution report · {sessionId.slice(0, 6).toUpperCase()}</p><h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Solutions for {session.labels.role} at <span className="text-red-soft">{session.institution.name}</span></h1><p className="mt-4 max-w-2xl text-base leading-7 text-white/65">Built for {session.labels.objective.toLowerCase()} in {session.labels.industry.toLowerCase()}, with recommendations ranked against your selected priorities.</p></div>
            </div>
            <FinderReportActions sessionId={sessionId} />
          </div>
          <div className="mt-9 grid gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-3">
            {[['Products assessed', recommendations.length], ['Automation', session.labels.automation], ['Timeline', session.labels.timeline]].map(([label, value]) => <div className="bg-white/5 p-4" key={label}><p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></div>)}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><div className="mx-auto max-w-[1180px]">
        <div className="grid gap-4 border border-line-light bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Institution</p><p className="mt-1 text-sm font-semibold">{session.institution.name}</p></div>
          <div><p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Role</p><p className="mt-1 text-sm font-semibold">{session.labels.role}</p></div>
          <div><p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Objective</p><p className="mt-1 text-sm font-semibold">{session.labels.objective}</p></div>
          <div><p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Priorities</p><p className="mt-1 text-sm font-semibold">{session.labels.challenges.join(', ') || 'General fit and workflow coverage'}</p></div>
        </div>

        <FinderAiAdvisor fallbackGuidance={buildFinderFallbackGuidance(session)} initialGuidance={session.aiGuidance ?? null} sessionId={sessionId} />

        <div className="mt-12 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-red">Ranked shortlist</p><h2 className="mt-2 text-3xl font-semibold">Products matched to your workflow</h2></div><p className="max-w-lg text-sm leading-6 text-ink-soft">Match percentages rank these options against your answers; they are not performance guarantees. An application specialist will confirm specifications.</p></div>
        {recommendations.length ? <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{recommendations.map((recommendation, index) => <FinderProductCard featured={index === 0} key={`${recommendation.product.principalSlug}-${recommendation.product.slug}`} recommendation={recommendation} />)}</div> : <div className="mt-7 border border-dashed border-line-light bg-white p-8 text-center"><p className="font-semibold">No confident product matches yet.</p><Link className="mt-4 inline-flex bg-red px-5 py-3 text-sm font-semibold text-white" href="/contact">Ask an application specialist</Link></div>}
      </div></section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1180px]"><p className="text-xs font-bold uppercase tracking-[0.18em] text-red">Complete the decision</p><h2 className="mt-2 text-3xl font-semibold">From shortlist to working laboratory</h2><div className="mt-7 grid gap-px border border-line-light bg-line-light md:grid-cols-4">
        {[{Icon:FiLayers,title:'Compare',text:'Review shortlisted specifications and configurations.',href:'/compare',cta:'Open comparison'},{Icon:FiBarChart2,title:'Build a quote',text:'Combine products into one consolidated request.',href:'/quote',cta:'View quote list'},{Icon:FiShield,title:'Confirm technical fit',text:'Validate samples, throughput, compliance, and accessories.',href:'/contact',cta:'Contact a specialist'},{Icon:FiMessageCircle,title:'Plan service',text:'Discuss installation, qualification, training, AMC, and calibration.',href:'/service',cta:'Explore service'}].map(({Icon,title,text,href,cta}) => <article className="bg-white p-6" key={title}><Icon className="text-2xl text-red"/><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 min-h-16 text-sm leading-6 text-ink-soft">{text}</p><Link className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-red hover:text-ink" href={href}>{cta}<FiArrowRight/></Link></article>)}
      </div></div></section>
    </main>
    </FinderResultsReveal>
  );
}
