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
import { upcomingStallEvent } from "./events";
import { webinars } from "./webinars";

const LEAD_IN_DAYS = 10;

function shiftDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * The stripe for the webinar happening furthest in the future. Derived from the
 * webinar data rather than hand-dated, so publishing a webinar schedules its own
 * campaign — and the window is computed from that fixed date, never from "now",
 * which would bake the build date into the prerendered page.
 */
function buildWebinarCampaign() {
  const latest = [...webinars]
    .filter((webinar) => webinar.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  if (!latest) return null;

  return {
    id: `webinar-${latest.id}`,
    type: "webinar",
    variant: "webinar-countdown",
    icon: "📅",
    accent: "teal",
    webinarId: latest.id,
    title: latest.title,
    message: latest.description ?? "",
    cta: { label: "Register free", href: "/webinars" },
    start: shiftDays(latest.date, -LEAD_IN_DAYS),
    end: latest.date,
    priority: 6,
  };
}

const webinarCampaign = buildWebinarCampaign();

export const campaigns = [
  ...(webinarCampaign ? [webinarCampaign] : []),
  {
    // Exhibition stand, counting down to doors-open. Dates and copy come from
    // the events-page banner, so moving the show moves both.
    id: "analytica-countdown-2026",
    type: "event",
    variant: "event-countdown",
    icon: "🧪",
    accent: "red",
    kicker: "Meet us there",
    title: upcomingStallEvent.title,
    message: upcomingStallEvent.description,
    venue: upcomingStallEvent.venue,
    eventDate: upcomingStallEvent.date,
    dateLabel: upcomingStallEvent.dateLabel,
    image: upcomingStallEvent.image,
    // The icon + wordmark crop used in place of the event name elsewhere —
    // shown in the strip's thumbnail slot instead of the wider stall photo.
    logoImage: "/assets/events/analytica-logo.png",
    cta: { label: "Event details", href: "/events" },
    start: shiftDays(upcomingStallEvent.date, -30),
    end: upcomingStallEvent.closesOn,
    priority: 4,
  },
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
    id: "diwali-2026",
    type: "festival",
    icon: "🪔",
    accent: "red",
    title: "Happy Diwali from Team Inkarp",
    message: "Wishing your lab a bright, safe, and productive festive season.",
    cta: null,
    // Verify exact date before publishing — approximate, regionally variable.
    start: "2026-11-07",
    end: "2026-11-09",
    priority: 8,
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

function toDateOnly(value) {
  const date = value instanceof Date ? value : new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function isCampaignActive(campaign, today = new Date()) {
  const day = toDateOnly(today);
  const start = toDateOnly(campaign.start);
  const end = toDateOnly(campaign.end);
  return day >= start && day <= end;
}

export function getActiveCampaign(today = new Date()) {
  const active = campaigns
    .filter((campaign) => isCampaignActive(campaign, today))
    .sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(a.start) - new Date(b.start);
    });

  return active[0] ?? null;
}

export function getEvergreenCampaign() {
  return campaigns.find((campaign) => campaign.evergreen) ?? null;
}

export function getActiveCampaigns(today = new Date()) {
  return campaigns
    .filter((campaign) => isCampaignActive(campaign, today))
    .sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(a.start) - new Date(b.start);
    });
}
