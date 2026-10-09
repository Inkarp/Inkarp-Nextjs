import { notFound } from"next/navigation";
import FlipbookPage from"@/components/catalystcue/FlipbookPage";
import {
  getCatalystCardBySlug,
  getCatalystPdfPath,
} from"@/data/catalystCue";
import { buildDynamicMetadata } from"@/data/pageSeo";

function slugFromParams(params) {
  const slugParts = Array.isArray(params?.slug) ? params.slug : [];
  return decodeURIComponent(slugParts.join("/")).replace(/\.pdf$/i,"");
}

// The issue's theme is its slug ("Transformative-Tools-Aiding-Biotherapies"),
// which keeps each issue's description distinct until a written one is added.
function issueDescription(card) {
  if (card.metaDescription) return card.metaDescription;
  const theme = card.slug.replace(/-/g," ");
  return `${card.title}: ${theme}. Read this issue of CATALYSTCue, the scientific magazine by Inkarp Instruments, online.`;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = slugFromParams(resolvedParams);
  const card = getCatalystCardBySlug(slug);
  if (!card) return { title:"Page not found - Inkarp Instruments" };

  return buildDynamicMetadata({
    path: `/magazine/${slug}`,
    title: card.metaTitle || card.title,
    description: issueDescription(card),
    keywords: card.keywords ||"CATALYSTCue, Inkarp, Scientific Magazine",
  });
}

export default async function CatalystFlipbook({ params }) {
  const resolvedParams = await params;
  const slug = slugFromParams(resolvedParams);
  const card = getCatalystCardBySlug(slug);
  if (!card) notFound();

  return (
    <>
      {/* The reader below mounts in the browser only, so the issue's title
          and summary are rendered here for search engines and screen readers. */}
      <div className="sr-only">
        <h1>{card.title}</h1>
        <p>{issueDescription(card)}</p>
      </div>
      <FlipbookPage file={getCatalystPdfPath(slug)} title={card.title} />
    </>
  );
}
