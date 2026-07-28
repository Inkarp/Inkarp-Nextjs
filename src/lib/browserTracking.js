// Single source of truth for client-side visitor attribution.
//
// Visitors rarely convert on the exact page a campaign link lands them on —
// they land on the homepage from a Google/Facebook ad, browse a few pages,
// then submit a form somewhere else entirely. window.location.search only
// carries UTM params on that one landing page, and document.referrer gets
// silently overwritten to our own domain on every internal click. So the
// first page load that ever sees campaign params persists them, every later
// page/form reuses what's persisted, and only a genuinely external referrer
// (or nothing at all) is allowed to reclassify a visit that arrived with no
// params.

const STORAGE_KEY = "ikp_attribution";
const STORAGE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
];

const SEARCH_ENGINES = [
  ["google", "Google"],
  ["bing", "Bing"],
  ["yahoo", "Yahoo"],
  ["duckduckgo", "DuckDuckGo"],
  ["yandex", "Yandex"],
];

const SOCIAL_NETWORKS = [
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["linkedin", "LinkedIn"],
  ["twitter", "Twitter / X"],
  ["x.com", "Twitter / X"],
  ["youtube", "YouTube"],
  ["whatsapp", "WhatsApp"],
  ["telegram", "Telegram"],
];

function detectDeviceType() {
  const userAgent = (typeof navigator !== "undefined" && navigator.userAgent) || "";
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "Tablet";
  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(userAgent)) return "Mobile";
  return "Desktop";
}

function classifyReferrerHost(hostname) {
  const host = hostname.replace(/^www\./, "").toLowerCase();
  const engine = SEARCH_ENGINES.find(([needle]) => host.includes(needle));
  if (engine) return engine[1];
  const social = SOCIAL_NETWORKS.find(([needle]) => host.includes(needle));
  if (social) return social[1];
  return `Referral: ${hostname}`;
}

function isExternalReferrer(referrer) {
  if (!referrer) return false;
  try {
    return new URL(referrer).origin !== window.location.origin;
  } catch {
    return false;
  }
}

function readStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const age = Date.now() - new Date(data.landingTimestamp).getTime();
    if (!data.landingTimestamp || Number.isNaN(age) || age > STORAGE_MAX_AGE_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeStorage(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Private browsing, quota exceeded, or storage disabled — degrade to page-only capture.
  }
}

function isStorageMeaningful(stored) {
  if (!stored) return false;
  return Boolean(
    stored.utmSource || stored.gclid || stored.fbclid || (stored.trafficSource && stored.trafficSource !== "Direct / None")
  );
}

function buildFreshAttribution(params, referrer) {
  const utmSource = params.get("utm_source") || "";
  let trafficSource = utmSource;

  if (!trafficSource) {
    if (params.get("gclid")) trafficSource = "google";
    else if (params.get("fbclid")) trafficSource = "facebook";
    else if (isExternalReferrer(referrer)) trafficSource = classifyReferrerHost(new URL(referrer).hostname);
    else trafficSource = "Direct / None";
  }

  return {
    trafficSource,
    referrer: referrer || "Direct / None",
    utmSource,
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmTerm: params.get("utm_term") || "",
    utmContent: params.get("utm_content") || "",
    gclid: params.get("gclid") || "",
    fbclid: params.get("fbclid") || "",
    landingTimestamp: new Date().toISOString(),
  };
}

function buildReferralAttribution(referrer) {
  const hostname = new URL(referrer).hostname;
  return {
    trafficSource: classifyReferrerHost(hostname),
    referrer,
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
    gclid: "",
    fbclid: "",
    landingTimestamp: new Date().toISOString(),
  };
}

function buildDirectAttribution() {
  return {
    trafficSource: "Direct / None",
    referrer: "Direct / None",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
    gclid: "",
    fbclid: "",
    landingTimestamp: new Date().toISOString(),
  };
}

// Priority order: fresh campaign params > persisted attribution > external
// referrer > direct. See module comment for why.
function resolveAttribution() {
  const params = new URLSearchParams(window.location.search);
  const hasFreshParams = UTM_PARAM_KEYS.some((key) => params.get(key));

  if (hasFreshParams) {
    const fresh = buildFreshAttribution(params, document.referrer || "");
    writeStorage(fresh);
    return fresh;
  }

  const stored = readStorage();
  if (isStorageMeaningful(stored)) {
    return stored;
  }

  if (isExternalReferrer(document.referrer)) {
    const referral = buildReferralAttribution(document.referrer);
    writeStorage(referral);
    return referral;
  }

  const direct = buildDirectAttribution();
  writeStorage(direct);
  return direct;
}

function liveFields() {
  return {
    pageUrl: window.location.href,
    pagePath: window.location.pathname,
    deviceType: detectDeviceType(),
    userAgent: navigator.userAgent || "",
  };
}

// Call once per full page load (mounted globally in the root layout), so
// attribution is captured even on pages that have no form on them.
export function captureAttribution() {
  if (typeof window === "undefined") return;
  resolveAttribution();
}

// Call at the moment any form is submitted; returns the tracking payload to
// spread into the submit request.
export function collectTracking() {
  if (typeof window === "undefined") {
    return {
      pageUrl: "",
      pagePath: "",
      deviceType: "",
      userAgent: "",
      trafficSource: "Direct / None",
      referrer: "Direct / None",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
      gclid: "",
      fbclid: "",
      landingTimestamp: "",
      timestamp: new Date().toISOString(),
    };
  }

  const attribution = resolveAttribution();

  return {
    ...liveFields(),
    ...attribution,
    timestamp: new Date().toISOString(),
  };
}
