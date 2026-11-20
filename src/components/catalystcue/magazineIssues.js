// CATALYSTCue issue data for /magazine and the redesign previews:
// every issue, newest first, with its cover, theme and the application notes
// published in it. Built on the server and passed to the previews as props, so
// the client bundles don't carry the full catalogue data.
import { applicationResources } from "@/data/applicationResources";
import { catalystCards } from "@/data/catalystCue";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Words kept lower case inside a title, as on the printed covers.
const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to", "via", "with"]);

/** "controlling-variability-in-scientific-workflows" → "Controlling Variability in Scientific Workflows" */
export function themeFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && SMALL_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

const pad = (value) => String(value).padStart(2, "0");

export function getMagazineIssues() {
  return catalystCards
    .map((card) => {
      const volume = Number(String(card.Volume).replace(/\D/g, ""));
      const issue = Number(String(card.subTitle).replace(/\D/g, ""));
      const [month = "", year = ""] = String(card.Date).trim().split(/\s+/);
      const resourceIssue = String(card.subTitle).replace(" ", "-");
      const notes = applicationResources
        .filter((note) => note.volume === card.Volume && note.issue === resourceIssue)
        .map((note) => ({ title: note.title, url: note.url, thumb: note.thumbUrl }));

      return {
        id: card.id,
        volume,
        issue,
        label: `Volume ${pad(volume)} · Issue ${pad(issue)}`,
        short: `V${volume} · ${pad(issue)}`,
        month,
        monthShort: month.slice(0, 3),
        year: Number(year),
        date: card.Date,
        theme: themeFromSlug(card.slug),
        slug: card.slug,
        href: `/magazine/${encodeURIComponent(card.slug)}`,
        cover: card.image,
        coverAlt: card.altText || `CATALYSTCue Volume ${volume} Issue ${issue} cover, ${card.Date}`,
        notes,
        order: Number(year) * 12 + MONTHS.indexOf(month),
      };
    })
    .sort((a, b) => b.order - a.order);
}
