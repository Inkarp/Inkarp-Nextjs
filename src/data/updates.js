import { getRecentPosts } from "./blogs";
import { webinars } from "./webinars";
import { catalystCards } from "./catalystCue";

function toTimestamp(value) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calendarDayNumber(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86400000;
}

function nextWebinarDate(webinar, todayKey) {
  return [...(webinar.dates ?? [webinar.date])]
    .filter(Boolean)
    .sort()
    .find((date) => date >= todayKey);
}

/**
 * A single "what's new" feed mixing recently-published content (blog posts,
 * CatalystCue issues) with upcoming events (webinars), sorted so whatever is
 * most temporally relevant — the soonest webinar, the freshest post — rises to
 * the top. Products aren't included yet: the catalog has no `dateAdded` field
 * to sort by, so surfacing "new products" here would need that added first.
 */
export function getPulseUpdates(limit = 6, now = new Date()) {
  const todayKey = toDateKey(now);
  const todayDay = calendarDayNumber(todayKey);

  const blogItems = getRecentPosts(null, 2).map((post) => ({
    id: `blog-${post.slug}`,
    type: "blog",
    title: post.title,
    date: post.date,
    href: `/blog/${post.slug}`,
  }));

  const webinarItems = [...webinars]
    .map((webinar) => ({ webinar, nextDate: nextWebinarDate(webinar, todayKey) }))
    .filter(({ nextDate }) => nextDate)
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate))
    .slice(0, 3)
    .map(({ webinar, nextDate }) => {
      const daysUntil = calendarDayNumber(nextDate) - todayDay;
      return {
      id: `webinar-${webinar.id}-${nextDate}`,
      type: "webinar",
      title: webinar.title,
      date: nextDate,
      href: "/webinars",
      statusLabel: daysUntil === 0 ? "Live today" : `In ${daysUntil} day${daysUntil === 1 ? "" : "s"}`,
      status: daysUntil === 0 ? "live" : "upcoming",
    };
    });

  const magazineItems = [...catalystCards]
    .sort((a, b) => b.id - a.id)
    .slice(0, 1)
    .map((card) => ({
      id: `magazine-${card.slug}`,
      type: "magazine",
      title: card.title,
      date: card.Date,
      href: `/magazine/${encodeURIComponent(card.slug)}`,
    }));

  return [...blogItems, ...webinarItems, ...magazineItems]
    .sort((a, b) => {
      if (a.type === "webinar" && b.type === "webinar") return toTimestamp(a.date) - toTimestamp(b.date);
      if (a.type === "webinar") return -1;
      if (b.type === "webinar") return 1;
      return toTimestamp(b.date) - toTimestamp(a.date);
    })
    .slice(0, limit);
}
