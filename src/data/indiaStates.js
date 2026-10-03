import { branches } from "@/data/branches";

// States and union territories for the contact form's State picker. Each
// carries its capital's coordinates, which is what "nearest branch" is
// measured from — a proxy, since a large state can be closer to another
// branch at its far end.
export const INDIA_STATES = [
  { name: "Andaman and Nicobar Islands", lat: 11.62, lon: 92.73 },
  { name: "Andhra Pradesh", lat: 16.51, lon: 80.52 },
  { name: "Arunachal Pradesh", lat: 27.08, lon: 93.61 },
  { name: "Assam", lat: 26.14, lon: 91.79 },
  { name: "Bihar", lat: 25.59, lon: 85.14 },
  { name: "Chandigarh", lat: 30.73, lon: 76.78 },
  { name: "Chhattisgarh", lat: 21.25, lon: 81.63 },
  { name: "Dadra and Nagar Haveli and Daman and Diu", lat: 20.4, lon: 72.83 },
  { name: "Delhi", lat: 28.61, lon: 77.21 },
  { name: "Goa", lat: 15.49, lon: 73.83 },
  { name: "Gujarat", lat: 23.22, lon: 72.65 },
  { name: "Haryana", lat: 30.73, lon: 76.78 },
  { name: "Himachal Pradesh", lat: 31.1, lon: 77.17 },
  { name: "Jammu and Kashmir", lat: 34.08, lon: 74.8 },
  { name: "Jharkhand", lat: 23.34, lon: 85.31 },
  { name: "Karnataka", lat: 12.97, lon: 77.59 },
  { name: "Kerala", lat: 8.52, lon: 76.94 },
  { name: "Ladakh", lat: 34.15, lon: 77.58 },
  { name: "Lakshadweep", lat: 10.57, lon: 72.64 },
  { name: "Madhya Pradesh", lat: 23.26, lon: 77.41 },
  { name: "Maharashtra", lat: 19.08, lon: 72.88 },
  { name: "Manipur", lat: 24.82, lon: 93.94 },
  { name: "Meghalaya", lat: 25.58, lon: 91.89 },
  { name: "Mizoram", lat: 23.73, lon: 92.72 },
  { name: "Nagaland", lat: 25.67, lon: 94.11 },
  { name: "Odisha", lat: 20.3, lon: 85.82 },
  { name: "Puducherry", lat: 11.94, lon: 79.81 },
  { name: "Punjab", lat: 30.73, lon: 76.78 },
  { name: "Rajasthan", lat: 26.91, lon: 75.79 },
  { name: "Sikkim", lat: 27.33, lon: 88.61 },
  { name: "Tamil Nadu", lat: 13.08, lon: 80.27 },
  { name: "Telangana", lat: 17.39, lon: 78.49 },
  { name: "Tripura", lat: 23.83, lon: 91.28 },
  { name: "Uttar Pradesh", lat: 26.85, lon: 80.95 },
  { name: "Uttarakhand", lat: 30.32, lon: 78.03 },
  { name: "West Bengal", lat: 22.57, lon: 88.36 },
];

const OUTSIDE_INDIA = "Outside India";
export const STATE_OPTIONS = [...INDIA_STATES.map((state) => state.name), OUTSIDE_INDIA];

// Squared equirectangular distance — only used to rank branches, so the
// exact kilometres don't matter.
function distanceScore(a, b) {
  const meanLat = ((a.lat + b.lat) / 2) * (Math.PI / 180);
  const dx = (a.lon - b.lon) * Math.cos(meanLat);
  const dy = a.lat - b.lat;
  return dx * dx + dy * dy;
}

/** The branch closest to a { lat, lon } point. */
export function nearestBranchTo(point) {
  return branches.reduce((best, branch) =>
    distanceScore(point, branch.coords) < distanceScore(point, best.coords) ? branch : best
  );
}

/** The branch closest to a state's capital, or null for an unknown state. */
export function nearestBranchForState(stateName) {
  const state = INDIA_STATES.find((s) => s.name === stateName);
  return state ? nearestBranchTo(state) : null;
}
