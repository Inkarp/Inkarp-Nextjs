import { getRecentPosts } from "./blogs";
import { webinars } from "./webinars";
import { catalystCards } from "./catalystCue";

function toTimestamp(value) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * A single "what's new" feed mixing recently-published content (blog posts,
 * CatalystCue issues) with upcoming events (webinars), sorted so whatever is
 * most temporally relevant — the soonest webinar, the freshest post — rises to
 * the top. Products aren't included yet: the catalog has no `dateAdded` field
 * to sort by, so surfacing "new products" here would need that added first.
 */
export function getPulseUpdates(limit = 6) {
  const blogItems = getRecentPosts(null, 3).map((post) => ({
    id: `blog-${post.slug}`,
    type: "blog",
    title: post.title,
    date: post.date,
    href: `/blog/${post.slug}`,
  }));

  const webinarItems = [...webinars]
    .filter((webinar) => webinar.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)
    .map((webinar) => ({
      id: `webinar-${webinar.id}`,
      type: "webinar",
      title: webinar.title,
      date: webinar.date,
      href: "/webinars",
    }));

  const magazineItems = [...catalystCards]
    .sort((a, b) => b.id - a.id)
    .slice(0, 2)
    .map((card) => ({
      id: `magazine-${card.slug}`,
      type: "magazine",
      title: card.title,
      date: card.Date,
      href: `/magazine/${encodeURIComponent(card.slug)}`,
    }));

  return [...blogItems, ...webinarItems, ...magazineItems]
    .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))
    .slice(0, limit);
}
