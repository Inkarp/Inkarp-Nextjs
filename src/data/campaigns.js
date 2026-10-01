// Fixed-date entries (Republic Day, Independence Day, Gandhi Jayanti, science/tech/
// environment days, New Year) are safe to extend a year at a time as-is.
// Lunar/variable-date festivals (Holi, Raksha Bandhan, Ganesh Chaturthi,
// Navratri/Dussehra, Diwali) shift every year and regionally — verify the exact
// date on a reliable calendar before each occasion and update start/end below.
// `image` is optional (used by HomeCampaignSlider) — entries without one render
// as a plain accent-colored text slide instead.
//
// HomeCampaignSlider is date-gated: it shows the highest-priority campaign whose
// start/end range covers today, and falls back to the `evergreen` entry when no
// dated campaign is running. Add an entry here only once it's real, ready
// content. The commented-out entries further down are placeholder examples kept
// for reference/reuse; uncomment and update one when you actually want it live.
//
// Dates are calendar days in India (IST) and both ends are inclusive, so every
// visitor sees the same window whatever their own timezone. An entry with a
// `mark` also puts that ornament beside the header logo while it runs.
//
// To see an entry before its dates, open the homepage with a preview link:
//   /?campaign=diwali-2026            that entry, whatever today's date is
//   /?campaign-date=2026-11-08        whatever would run on that day
// Previews only change the visitor's own browser and work even when
// CAMPAIGNS_ENABLED is off.
import { getUpcomingWebinarDate, webinars } from "./webinars";

/** Master switch: false hides every campaign surface without touching the entries. */
export const CAMPAIGNS_ENABLED = true;

const INDIA_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Today's date in India as "YYYY-MM-DD". The server and every browser get the
 * same answer, so the prerendered strip and the hydrated one agree.
 */
export function todayInIndia(now = new Date()) {
  return INDIA_DATE.format(now);
}

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

function toDateKey(value) {
  if (typeof value === "string" && DATE_KEY.test(value.slice(0, 10))) {
    return value.slice(0, 10);
  }
  return todayInIndia(value instanceof Date ? value : new Date(value));
}

/** Whole days from one "YYYY-MM-DD" to another; integers only, so it is hydration-safe. */
export function daysBetween(fromKey, toKey) {
  const toUtc = (key) => {
    const [year, month, day] = key.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((toUtc(toKey) - toUtc(fromKey)) / 86400000);
}

/**
 * The stripe for the webinar happening furthest in the future. Derived from the
 * webinar data rather than hand-dated, so publishing a webinar schedules its own
 * campaign — and the window is computed from that fixed date, never from "now",
 * which would bake the build date into the prerendered page.
 */
export function getUpcomingWebinarCampaign(today = new Date()) {
  const next = webinars
    .map((webinar) => ({ webinar, date: getUpcomingWebinarDate(webinar, today) }))
    .filter(({ date }) => date)
    .sort((a, b) => a.date - b.date)[0]?.webinar;
  if (!next) return null;

  return {
    id: `webinar-${next.id}`,
    type: "webinar",
    variant: "webinar-countdown",
    icon: "📅",
    accent: "teal",
    webinarId: next.id,
    title: next.title,
    message: next.description ?? "",
    cta: {
      label: "Reserve my seat",
      href: next.sourceLink || "/webinars",
      external: Boolean(next.sourceLink),
    },
    start: next.date,
    end: next.date,
    priority: 6,
  };
}

export const campaigns = [
  {
    // Milestone year banner. `years` is deliberately a literal rather than
    // derived from today's date: the stripe is prerendered, so computing it at
    // render time would bake the build year into the HTML and mismatch on
    // hydration. Bump `years` alongside start/end each anniversary; the slide
    // works out the ordinal ("41st", "42nd") from it.
    id: "inkarp-41st-anniversary",
    type: "milestone",
    variant: "inkarp-anniversary",
    icon: "🎉",
    accent: "red",
    foundedYear: 1985,
    years: 41,
    title: "Celebrating 41 Years of Inkarp",
    message: "Since 1985 — four decades of powering India's laboratories with trusted instruments and support.",
    cta: { label: "Our Story", href: "/our-story" },
    // Picks up the day after the Independence Day banner ends. Inclusive end —
    // the milestone stripe shows through the 21st and the evergreen Explore
    // Products promo takes over on the 22nd.
    start: "2026-08-17",
    end: "2026-08-21",
    priority: 3,
  },
  {
    // Major ten-day festival, through visarjan (Anant Chaturdashi) immersion
    // day. Verified 2026-09-10 against public festival calendars: Chaturthi
    // falls Mon 14 Sep 2026, visarjan Fri 25 Sep 2026 — re-verify next year,
    // this is a lunar date per the note at the top of this file.
    id: "ganesh-chaturthi-2026",
    type: "festival",
    variant: "ganesh-chaturthi",
    icon: "🐘",
    accent: "gold",
    title: "Happy Ganesh Chaturthi",
    exclusive: true,
    message: "May Lord Ganesha bless every new beginning with wisdom, fill your home with joy, and bring prosperity to you and your loved ones.",
    cta: null,
    start: "2026-09-10",
    end: "2026-09-18",
    priority: 7,
  },
  // Festival designs for Navratri, Dussehra and Diwali 2026 are ready but on
  // hold (2026-10-01). Uncomment this block to switch them on; the dates are
  // already verified. Preview links only work for entries that are uncommented.
  /*
  {
    // Nine nights of Sharad Navratri. Verified 2026-10-01 against public
    // festival calendars: Sun 11 Oct – Mon 19 Oct 2026. Lunar date, re-verify
    // next year. The slide lights one lamp per night, counted from `start`.
    id: "navratri-2026",
    type: "festival",
    variant: "navratri",
    mark: "diya",
    icon: "🪔",
    accent: "gold",
    title: "Happy Navratri",
    message: "Nine nights of devotion, colour and celebration. May the Goddess bless you and your family with strength, joy and prosperity.",
    nights: 9,
    cta: null,
    exclusive: true,
    start: "2026-10-11",
    end: "2026-10-19",
    priority: 7,
  },
  {
    // Vijayadashami, the day after the ninth night: Tue 20 Oct 2026 (verified
    // 2026-10-01). Same design as Navratri with every lamp lit.
    id: "dussehra-2026",
    type: "festival",
    variant: "navratri",
    finale: true,
    mark: "diya",
    icon: "🏹",
    accent: "gold",
    title: "Happy Dussehra",
    message: "May the victory of good over evil light the way for you and your loved ones. Warm wishes on Vijayadashami from Team Inkarp.",
    nights: 9,
    cta: null,
    exclusive: true,
    start: "2026-10-20",
    end: "2026-10-20",
    priority: 7,
  },
  {
    // Five-day festival, Dhanteras to Bhai Dooj. Verified 2026-10-01: Dhanteras
    // Fri 6 Nov, Lakshmi Puja Sun 8 Nov, Bhai Dooj Tue 10 Nov 2026. Lunar date,
    // re-verify next year.
    id: "diwali-2026",
    type: "festival",
    variant: "diwali",
    mark: "diya",
    icon: "🪔",
    accent: "gold",
    title: "Happy Diwali",
    message: "May the festival of lights fill your home with warmth, good health and prosperity, and light up every new beginning.",
    cta: null,
    exclusive: true,
    start: "2026-11-06",
    end: "2026-11-10",
    priority: 8,
  },
  */
  {
    id: "independence-day-2026",
    type: "national-day",
    variant: "flag-wave",
    icon: "🇮🇳",
    accent: "red",
    title: "Celebrating India's 80th Independence Day",
    message: "Jai Hind! Team Inkarp wishes you a proud and joyous Independence Day.",
    cta: null,
    // Live through the Independence Day window; inclusive end — the stripe shows
    // through the 16th and is replaced by the evergreen promo on the 17th.
    start: "2026-08-01",
    end: "2026-08-16",
    priority: 5,
  },
  // Optional evergreen fallback, ready to enable for future campaigns.
  /*
  {
    // `evergreen` marks the year-round fallback: it's what the stripe falls back
    // to whenever no dated campaign is running, and it's what renders on the
    // server so the first paint never depends on the build date.
    id: "explore-products-promo",
    type: "promo",
    variant: "explore-products",
    icon: "🔬",
    accent: "teal",
    title: "Explore Inkarp's Latest Lab Solutions",
    message: "Find instruments, application support, and expert guidance in one place.",
    cta: { label: "Explore Products", href: "/products" },
    evergreen: true,
    start: "2026-01-01",
    end: "2027-12-31",
    priority: 1,
  },
  */
  /*
  {
    id: "independence-day-2026-classic",
    type: "national-day",
    icon: "🇮🇳",
    accent: "red",
    title: "Happy Independence Day from Team Inkarp",
    message: "Celebrating 79 years of progress, science, and self-reliance.",
    image: "/independence-day-2026.png",
    cta: null,
    start: "2026-08-14",
    end: "2026-08-15",
    priority: 5,
  },
  {
    id: "gandhi-jayanti-2026",
    type: "national-day",
    icon: "🕊️",
    accent: "teal",
    title: "Gandhi Jayanti",
    message: "Remembering the values of truth, simplicity, and service.",
    cta: null,
    start: "2026-10-02",
    end: "2026-10-02",
    priority: 5,
  },
  {
    id: "new-year-2027",
    type: "national-day",
    icon: "🎉",
    accent: "teal",
    title: "Happy New Year from Team Inkarp",
    message: "Here's to another year of supporting India's laboratories.",
    cta: null,
    start: "2026-12-31",
    end: "2027-01-01",
    priority: 5,
  },
  {
    id: "republic-day-2027",
    type: "national-day",
    icon: "🇮🇳",
    accent: "red",
    title: "Happy Republic Day from Team Inkarp",
    message: "Celebrating India's progress in science and innovation.",
    cta: null,
    start: "2027-01-25",
    end: "2027-01-26",
    priority: 5,
  },
  {
    id: "national-science-day-2027",
    type: "observance",
    icon: "🔬",
    accent: "teal",
    title: "National Science Day",
    message: "Honouring the discovery of the Raman Effect and India's scientific spirit.",
    cta: { label: "Explore Products", href: "/products" },
    start: "2027-02-27",
    end: "2027-02-28",
    priority: 6,
  },
  */
];

function toDayKey(today) {
  return typeof today === "string" ? today : todayInIndia(today);
}

export function isCampaignActive(campaign, today = todayInIndia()) {
  const day = toDayKey(today);
  return day >= toDateKey(campaign.start) && day <= toDateKey(campaign.end);
}

function byPriority(a, b) {
  if (b.priority !== a.priority) {
    return b.priority - a.priority;
  }
  return toDateKey(a.start).localeCompare(toDateKey(b.start));
}

export function getActiveCampaign(today = todayInIndia()) {
  return getActiveCampaigns(today)[0] ?? null;
}

export function getEvergreenCampaign() {
  return campaigns.find((campaign) => campaign.evergreen) ?? null;
}

export function getActiveCampaigns(today = todayInIndia()) {
  if (!CAMPAIGNS_ENABLED) return [];
  return campaigns
    .filter((campaign) => isCampaignActive(campaign, today))
    .sort(byPriority);
}

/**
 * What the homepage strip shows on `today`: an `exclusive` campaign alone,
 * otherwise every dated campaign by priority, otherwise the evergreen entry.
 */
function resolveStripCampaigns(today) {
  const dated = campaigns
    .filter((campaign) => !campaign.evergreen && isCampaignActive(campaign, today))
    .sort(byPriority);
  const exclusive = dated.find((campaign) => campaign.exclusive);
  if (exclusive) return [exclusive];
  if (dated.length) return dated;

  const evergreen = getEvergreenCampaign();
  return evergreen ? [evergreen] : [];
}

export function getStripCampaigns(today = todayInIndia()) {
  return CAMPAIGNS_ENABLED ? resolveStripCampaigns(toDayKey(today)) : [];
}

function clampDay(day, start, end) {
  if (day < start) return start;
  if (day > end) return end;
  return day;
}

/**
 * Reads a preview link (see the note at the top of this file) from a
 * `location.search` string. Returns null when the URL asks for no preview, or
 * names an entry or date that doesn't exist.
 */
export function getCampaignPreview(search) {
  const params = new URLSearchParams(search);
  const id = params.get("campaign");
  const dateParam = params.get("campaign-date");
  const date = dateParam && DATE_KEY.test(dateParam) ? dateParam : null;

  if (id) {
    const campaign = campaigns.find((entry) => entry.id === id);
    if (!campaign) return null;
    const start = toDateKey(campaign.start);
    const end = toDateKey(campaign.end);
    return { slides: [campaign], today: date ?? clampDay(todayInIndia(), start, end) };
  }

  if (date) {
    return { slides: resolveStripCampaigns(date), today: date };
  }

  return null;
}

/** The ornament for the header logo on `today`, from the first strip campaign that sets one. */
export function getCampaignMark(slides) {
  return slides.find((campaign) => campaign.mark)?.mark ?? null;
}
