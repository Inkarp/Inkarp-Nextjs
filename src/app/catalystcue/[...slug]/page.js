import FlipbookPage from "@/components/catalystcue/FlipbookPage";
import {
  getCatalystCardBySlug,
  getCatalystPdfPath,
} from "@/data/catalystCue";

function slugFromParams(params) {
  const slugParts = Array.isArray(params?.slug) ? params.slug : [];
  return decodeURIComponent(slugParts.join("/")).replace(/\.pdf$/i, "");
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = slugFromParams(resolvedParams);
  const card = getCatalystCardBySlug(slug);
  const title = card?.title || "CATALYSTCue Magazine";

  return {
    title: card?.metaTitle || title,
    description:
      card?.metaDescription ||
      "Explore the latest edition of CATALYSTCue by Inkarp Instruments.",
    keywords: card?.keywords || "CATALYSTCue, Inkarp, Scientific Magazine",
  };
}

export default async function CatalystFlipbook({ params }) {
  const resolvedParams = await params;
  const slug = slugFromParams(resolvedParams);
  const card = getCatalystCardBySlug(slug);

  return (
    <FlipbookPage
      file={getCatalystPdfPath(slug)}
      title={card?.title || "CATALYSTCue Magazine"}
    />
  );
}
