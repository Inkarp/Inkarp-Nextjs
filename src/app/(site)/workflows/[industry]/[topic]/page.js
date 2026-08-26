import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import WorkflowIcon from "@/components/home/WorkflowIcon";
import WorkflowStageDetail from "@/components/products/WorkflowStageDetail";
import WorkflowOtherStages from "@/components/products/WorkflowOtherStages";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { topicSlug, workflowIndustries, workflowTopics } from "@/data/homeShowcase";
import {
  findStage,
  industriesWithStage,
  stageSlugForLegacyTopic,
  stagesWithSlugs,
} from "@/data/workflowWheel";
import { buildDynamicMetadata } from "@/data/pageSeo";
import { workflowChallenges } from "@/data/workflowChallenges";
import { getAllProducts, getProductBySlug } from "@/data/products/principals";

function resolve(industry, slug) {
  const activeIndustry = workflowIndustries.find((item) => item.cat === industry);
  if (!activeIndustry) return {};
  return { activeIndustry, stage: findStage(industry, slug) };
}

/**
 * The stage descriptions written for the page body run ~60 characters — far too
 * short for a search result. This composes one from what the page actually
 * contains: the stage, the industry, how many problems it covers and which
 * brands answer them.
 */
function buildStageMeta({ activeIndustry, industry, stage, topic }) {
  const challenges = workflowChallenges?.[industry]?.[stage.name] ?? [];

  const brands = [
    ...new Set(
      challenges
        .flatMap((entry) => entry.products ?? [])
        .filter((item) => item.slug)
        .map((item) => item.principal)
        .filter(Boolean)
    ),
  ].slice(0, 3);

  const industryLabel = activeIndustry.industry.toLowerCase();
  const problems = challenges.length
    ? `${challenges.length} common problems and the instruments that solve them`
    : "the instruments Inkarp supplies for it";
  const brandLine = brands.length ? ` Products from ${brands.join(", ")}.` : "";

  // Search results cut off around 155 characters, so the closing line only
  // survives if the brands have not already used the space.
  const lead = `${stage.name} in ${industryLabel} labs: ${problems}.`;
  const withBrands = `${lead}${brandLine}`;
  const description =
    withBrands.length <= 120
      ? `${withBrands} Inkarp, distributor in India.`
      : withBrands.slice(0, 155).trimEnd();

  return {
    description,
    keywords: [
      `${stage.name} ${industryLabel}`,
      `${stage.name} instruments`,
      `${industryLabel} laboratory workflow`,
      `${industryLabel} lab equipment india`,
      ...brands.map((brand) => `${brand} india`),
      "inkarp workflows",
    ].join(", "),
  };
}

export async function generateMetadata({ params }) {
  const { industry, topic } = await params;
  const { activeIndustry, stage } = resolve(industry, topic);
  // Without this, an unresolved URL inherits the site-wide default title.
  if (!activeIndustry || !stage) {
    return { title: "Workflow Not Found - Inkarp", robots: { index: false, follow: true } };
  }

  const { description, keywords } = buildStageMeta({ activeIndustry, industry, stage, topic });

  return buildDynamicMetadata({
    title: `${stage.name} — ${activeIndustry.industry} Workflow | Inkarp`,
    description,
    keywords,
    path: `/workflows/${industry}/${topic}`,
  });
}

// One page per workflow stage (nine industries x eight stages), plus the old
// topic slugs so those URLs keep working and redirect to their stage.
export function generateStaticParams() {
  return workflowIndustries.flatMap((item) => {
    const stages = stagesWithSlugs(item.cat).map((stage) => stage.slug);
    const legacy = (workflowTopics[item.cat] ?? [])
      .map((topic) => topicSlug(topic.tag))
      .filter((slug) => !stages.includes(slug));

    return [...stages, ...legacy].map((topic) => ({ industry: item.cat, topic }));
  });
}

export default async function WorkflowStagePage({ params }) {
  const { industry, topic } = await params;
  const { activeIndustry, stage } = resolve(industry, topic);
  if (!activeIndustry) notFound();

  // Legacy /workflows/<industry>/<old-topic> URLs point at the stage that fed them.
  if (!stage) {
    const legacy = stageSlugForLegacyTopic(industry, topic);
    if (legacy) redirect(`/workflows/${industry}/${legacy}`);
    notFound();
  }

  const stages = stagesWithSlugs(industry);

  // Eight stage names are shared across industries; show those as tabs so the
  // reader can compare the same workflow elsewhere.
  const sharedWith = industriesWithStage(stage.name)
    .map((item) => ({
      ...item,
      industry: workflowIndustries.find((i) => i.cat === item.cat)?.industry ?? item.cat,
    }));

  // Resolve each named instrument against the live catalogue here on the
  // server, so the cards can show the product image, brand and country without
  // shipping the whole catalogue to the browser. Instruments the document names
  // but the site does not stock yet are dropped rather than shown as dead
  // entries; matching also falls back to the product name, so they reappear on
  // their own once those product pages exist.
  const normaliseName = (value) =>
    String(value ?? "").toLowerCase().replace(/[®™]/g, "").replace(/[^a-z0-9]+/g, "");
  const productsByName = new Map(getAllProducts().map((p) => [normaliseName(p.name), p]));

  const challenges = (workflowChallenges[industry]?.[stage.name] ?? []).map((c) => ({
    ...c,
    products: c.products
      .map((item) => {
        const product =
          (item.slug ? getProductBySlug(item.slug) : null) ??
          productsByName.get(normaliseName(item.name));
        if (!product) return null;
        return {
          name: product.name ?? item.name,
          slug: product.slug,
          principal: product.principalName ?? item.principal,
          principalSlug: product.principalSlug ?? "",
          principalImage: product.principalImage ?? null,
          country: product.countryOfOrigin ?? null,
          image: product.image ?? null,
          imageAlt: product.imageAlt ?? product.name ?? item.name,
        };
      })
      .filter(Boolean),
  }));

  const trail = [
    { label: "Workflows", href: "/workflows" },
    { label: activeIndustry.industry, href: `/workflows/${industry}` },
    { label: stage.name, href: `/workflows/${industry}/${topic}` },
  ];

  return (
    <main className="min-h-screen bg-parchment-alt" data-scroll-skip>
      <BreadcrumbJsonLd trail={trail} />
      <PageBreadcrumbs trail={trail} />

      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        {sharedWith.length > 1 && (
          <div className="mb-8">
            <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              This workflow also runs in
            </p>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Industries sharing this workflow">
              {sharedWith.map((item) => (
                <Link
                  aria-selected={item.cat === industry}
                  className={`inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    item.cat === industry
                      ? "border-red bg-red text-parchment"
                      : "border-line-light bg-white text-ink-soft hover:border-red/40 hover:text-red"
                  }`}
                  href={`/workflows/${item.cat}/${item.slug}`}
                  key={item.cat}
                  role="tab"
                >
                  <WorkflowIcon cat={item.cat} className="h-3.5 w-3.5" />
                  {item.industry}
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-red"
          href={`/workflows/${industry}`}
        >
          ← Back to workflows
        </Link>

        <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">
          Workflow #{stage.number} / {activeIndustry.industry}
        </p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
          {stage.name}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft">{stage.description}</p>

        <WorkflowStageDetail
          challenges={challenges}
          industry={activeIndustry.industry}
          stage={stage}
        />

        <WorkflowOtherStages cat={industry} currentSlug={stage.slug} stages={stages} />
      </div>
    </main>
  );
}
