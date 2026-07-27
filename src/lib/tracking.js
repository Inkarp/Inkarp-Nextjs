// Shared UTM / traffic-source tracking, used by every lead form and API route
// so submissions capture where a visitor actually came from, not just what
// they typed.
//
// Visitors rarely convert on the exact page they land on, so the campaign
// that brought them (utm_source/medium/campaign/content, or the referring
// search engine) is captured once on landing and persisted in a cookie
// (UTM_COOKIE_NAME, UTM_COOKIE_MAX_AGE_DAYS days). Every later form on any
// page reads that cookie as a fallback, so a visitor who lands on the
// homepage via an ad and submits a form from /contact three pages later
// still gets attributed correctly. A fresh UTM-tagged link always overwrites
// the cookie ("last real marketing touch wins").
//
// Field names are underscore-prefixed to keep them visually grouped and
// separate from real form fields in the notification email.

const UTM_COOKIE_NAME = "ikp_utm";
const UTM_COOKIE_MAX_AGE_DAYS = 90;

function getReferrerHost(referrerUrl) {
  try {
    return referrerUrl ? new URL(referrerUrl).hostname : "";
  } catch {
    return "";
  }
}

function getSearchKeyword(referrerUrl, params) {
  const utmTerm = params.get("utm_term") || params.get("keyword");
  if (utmTerm) return utmTerm;

  try {
    const referrer = new URL(referrerUrl);
    return (
      referrer.searchParams.get("q") ||
      referrer.searchParams.get("query") ||
      referrer.searchParams.get("p") ||
      ""
    );
  } catch {
    return "";
  }
}

function readUtmCookie(cookieString) {
  const match = (cookieString || "").match(new RegExp(`(?:^|; )${UTM_COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function writeUtmCookie(data) {
  if (typeof document === "undefined") return;
  const maxAge = UTM_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${UTM_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function buildAttribution({ params, referrerUrl }) {
  const referrerHost = getReferrerHost(referrerUrl);
  return {
    _trafficSource: params.get("utm_source") || referrerHost || "Direct",
    _trafficMedium: params.get("utm_medium") || (referrerHost ? "referral" : "direct"),
    _utmCampaign: params.get("utm_campaign") || "",
    _utmContent: params.get("utm_content") || "",
    _searchKeyword: getSearchKeyword(referrerUrl, params),
  };
}

function hasUtmParams(params) {
  return Boolean(params.get("utm_source") || params.get("utm_medium") || params.get("utm_campaign"));
}

// Call once per page load/route change (see TrackingCapture component). Only
// writes the cookie when the current URL actually carries UTM params, so
// plain internal navigation never overwrites a visitor's real attribution.
export function captureLanding() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  if (!hasUtmParams(params)) return;

  const referrerUrl = document.referrer || "";
  writeUtmCookie({
    _landingPageUrl: window.location.href,
    _referrerUrl: referrerUrl,
    ...buildAttribution({ params, referrerUrl }),
    _landingCapturedAt: new Date().toISOString(),
  });
}

// Call from client components (browser only) when building a submission payload.
export function collectTracking() {
  if (typeof window === "undefined") {
    return {
      _pageUrl: "",
      _referrerUrl: "",
      _trafficSource: "",
      _trafficMedium: "",
      _utmCampaign: "",
      _utmContent: "",
      _searchKeyword: "",
      _landingPageUrl: "",
      _landingCapturedAt: "",
    };
  }

  const params = new URLSearchParams(window.location.search);
  const referrerUrl = document.referrer || "";
  const stored = readUtmCookie(document.cookie);

  const attribution =
    hasUtmParams(params) || !stored
      ? {
          ...buildAttribution({ params, referrerUrl }),
          _landingPageUrl: window.location.href,
          _landingCapturedAt: new Date().toISOString(),
        }
      : {
          _trafficSource: stored._trafficSource || "",
          _trafficMedium: stored._trafficMedium || "",
          _utmCampaign: stored._utmCampaign || "",
          _utmContent: stored._utmContent || "",
          _searchKeyword: stored._searchKeyword || "",
          _landingPageUrl: stored._landingPageUrl || "",
          _landingCapturedAt: stored._landingCapturedAt || "",
        };

  return {
    _pageUrl: window.location.href,
    _referrerUrl: referrerUrl,
    ...attribution,
  };
}

// Call from API route handlers as a fallback/verification layer: fills in
// anything the client didn't send (stripped query string, blocked referrer,
// pre-update form, cleared sessionStorage) using the request's cookie header
// and headers instead.
export function getServerTracking(request, fields = {}) {
  const cookieData = readUtmCookie(request.headers.get("cookie")) || {};
  const referrerUrl = fields._referrerUrl || request.headers.get("referer") || "";
  const referrerHost = getReferrerHost(referrerUrl);
  const pageUrl = fields._pageUrl || referrerUrl || "";

  return {
    _pageUrl: pageUrl,
    _referrerUrl: referrerUrl,
    _trafficSource: fields._trafficSource || cookieData._trafficSource || referrerHost || "Direct",
    _trafficMedium: fields._trafficMedium || cookieData._trafficMedium || (referrerHost ? "referral" : "direct"),
    _utmCampaign: fields._utmCampaign || cookieData._utmCampaign || "",
    _utmContent: fields._utmContent || cookieData._utmContent || "",
    _searchKeyword: fields._searchKeyword || cookieData._searchKeyword || "",
    _landingPageUrl: fields._landingPageUrl || cookieData._landingPageUrl || pageUrl,
    _landingCapturedAt: fields._landingCapturedAt || cookieData._landingCapturedAt || "",
  };
}
