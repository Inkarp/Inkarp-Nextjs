// Approximate lat/lon per principal country of origin, used to plot dots on the
// rotating globe in PrincipalsGlobe. Hues are drawn from the site's validated
// 8-color categorical set (reused across two countries each) — every dot and
// pill always carries a visible text label, so color here is a reinforcing
// accent, not the sole identifier.
export const countryGeo = {
  Canada: { label: "Canada", lat: 56.13, lon: -106.35, hue: "#2a78d6" },
  China: { label: "China", lat: 35.86, lon: 104.2, hue: "#1baf7a" },
  "Czech Republic": { label: "Czechia", lat: 49.82, lon: 15.47, hue: "#eda100" },
  Denmark: { label: "Denmark", lat: 56.26, lon: 9.5, hue: "#008300" },
  France: { label: "France", lat: 46.23, lon: 2.21, hue: "#4a3aa7" },
  Germany: { label: "Germany", lat: 51.17, lon: 10.45, hue: "#e34948" },
  Hungary: { label: "Hungary", lat: 47.16, lon: 19.5, hue: "#e87ba4" },
  India: { label: "India", lat: 20.59, lon: 78.96, hue: "#eb6834" },
  Italy: { label: "Italy", lat: 41.87, lon: 12.57, hue: "#2a78d6" },
  Japan: { label: "Japan", lat: 36.2, lon: 138.25, hue: "#1baf7a" },
  Netherlands: { label: "Netherlands", lat: 52.13, lon: 5.29, hue: "#eda100" },
  "South Korea": { label: "South Korea", lat: 35.91, lon: 127.77, hue: "#008300" },
  Spain: { label: "Spain", lat: 40.46, lon: -3.75, hue: "#4a3aa7" },
  Switzerland: { label: "Switzerland", lat: 46.82, lon: 8.23, hue: "#e34948" },
  "United Kingdom": { label: "UK", lat: 55.38, lon: -3.44, hue: "#e87ba4" },
  "United States of America": { label: "USA", lat: 39.83, lon: -98.58, hue: "#eb6834" },
};
