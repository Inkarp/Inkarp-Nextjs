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
export const campaigns = [
  /*
  {
    id: "inkarp-41st-anniversary",
    type: "milestone",
    variant: "inkarp-anniversary",
    icon: "🎉",
    accent: "red",
    title: "Celebrating 41 Years of Inkarp",
    message: "Since 1985 — 41 years of powering India's laboratories with trusted instruments and support.",
    cta: { label: "Our Story", href: "/our-story" },
    start: "2026-01-01",
    end: "2026-12-31",
    priority: 3,
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
  {
    // `evergreen` marks the year-round fallback: it's what the stripe falls back
    // to whenever no dated campaign is running, and it's what renders on the
    // server so the first paint never depends on the build date.
    id: "explore-products-promo",
    type: "promo",
    variant: "explore-products",
    icon: "🔬",
    accent: "teal",
    evergreen: true,
    title: "Explore Inkarp's Latest Lab Solutions",
    message: "Find instruments, application support, and expert guidance in one place.",
    cta: { label: "Explore Products", href: "/products" },
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
