// Draws India's states into public/assets/contact/india-states.svg and writes
// src/data/indiaMap.js, the projection that places branch pins on that map.
//
// Boundaries: DataMeet India community, States/Admin2 (updated to the Survey of
// India map), CC BY 4.0 - https://github.com/datameet/maps/tree/master/States
//
// To rebuild (only needed if the boundaries or the look change):
//   1. Download Admin2.shp, .shx, .dbf and .prj from that folder.
//   2. npx mapshaper@0.6 Admin2.shp -simplify 0.5% keep-shapes -clean //        -o states.topojson format=topojson quantization=100000
//   3. node scripts/build-india-map.mjs . states.topojson //        public/assets/contact/india-states.svg src/data/indiaMap.js
// Pins come from each branch's lat/lon in src/data/branches.js; nothing here
// needs changing when a branch is added or moved.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [repo, topoFile, outSvg, outJs] = process.argv.slice(2);
const mod = (p) => import(pathToFileURL(path.join(repo, "node_modules", p)).href);
const { geoConicConformal, geoPath, geoArea } = await mod("d3-geo/src/index.js");
const topo = await mod("topojson-client/src/index.js");

const W = 600;
const PAD = 6;
const ROTATE = -80; // central meridian 80°E
const PARALLELS = [12.4729, 35.1728];

const data = JSON.parse(fs.readFileSync(topoFile, "utf8"));
const objectName = Object.keys(data.objects)[0];
const geoms = data.objects[objectName].geometries;
const fc = topo.feature(data, data.objects[objectName]);
const neighbors = topo.neighbors(geoms);

const CODES = {
  "Andaman & Nicobar": "AN", "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR", Assam: "AS", Bihar: "BR",
  Chandigarh: "CH", Chhattisgarh: "CG", "Dadra and Nagar Haveli and Daman and Diu": "DH", Delhi: "DL", Goa: "GA",
  Gujarat: "GJ", Haryana: "HR", "Himachal Pradesh": "HP", "Jammu & Kashmir": "JK", Jharkhand: "JH", Karnataka: "KA",
  Kerala: "KL", Ladakh: "LA", Lakshadweep: "LD", "Madhya Pradesh": "MP", Maharashtra: "MH", Manipur: "MN",
  Meghalaya: "ML", Mizoram: "MZ", Nagaland: "NL", Odisha: "OD", Puducherry: "PY", Punjab: "PB", Rajasthan: "RJ",
  Sikkim: "SK", "Tamil Nadu": "TN", Telangana: "TG", Tripura: "TR", "Uttar Pradesh": "UP", Uttarakhand: "UK",
  "West Bengal": "WB",
};

// Fit the width, then size the height to the drawn bounds.
const projection = geoConicConformal().rotate([ROTATE, 0]).parallels(PARALLELS);
projection.fitWidth(W - 2 * PAD, fc);
let [[bx0, by0], [bx1, by1]] = geoPath(projection).bounds(fc);
const H = Math.ceil(by1 - by0 + 2 * PAD);
projection.fitExtent([[PAD, PAD], [W - PAD, H - PAD]], fc);
const k = projection.scale();
const [tx, ty] = projection.translate();

// Drop island specks under a quarter of a pixel; keep each state's largest piece.
const pathGen = geoPath(projection).digits(1);
const projectedArea = (polygonCoords) => Math.abs(geoPath(projection).area({ type: "Polygon", coordinates: polygonCoords }));
for (const f of fc.features) {
  if (f.geometry.type !== "MultiPolygon") continue;
  const polys = f.geometry.coordinates.map((c) => ({ c, a: projectedArea(c) })).sort((a, b) => b.a - a.a);
  f.geometry.coordinates = polys.filter((p, i) => i === 0 || p.a >= 0.25).map((p) => p.c);
}

// Neighbouring states never share a shade.
const SHADES = ["#3a3a3a", "#4a4a4a", "#5a5a5a", "#6b6b6b"];
const order = fc.features.map((f, i) => i).sort((a, b) => neighbors[b].length - neighbors[a].length);
const shade = [];
for (const i of order) {
  const used = new Set(neighbors[i].map((j) => shade[j]).filter((s) => s != null));
  shade[i] = [0, 1, 2, 3].find((s) => !used.has(s)) ?? 0;
}

// Label point: the interior point farthest from the edges of the largest piece.
function labelPoint(feature) {
  const polys = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  const biggest = polys.map((c) => ({ c, a: projectedArea(c) })).sort((a, b) => b.a - a.a)[0].c;
  const rings = biggest.map((ring) => ring.map((p) => projection(p)));
  const xs = rings[0].map((p) => p[0]); const ys = rings[0].map((p) => p[1]);
  const inside = (x, y) => rings.reduce((ins, ring) => {
    let c = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return ins !== c;
  }, false);
  const edgeDist = (x, y) => {
    let best = Infinity;
    for (const ring of rings) for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [ax, ay] = ring[j]; const [bx, by] = ring[i];
      const dx = bx - ax; const dy = by - ay; const l2 = dx * dx + dy * dy;
      const t = l2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2)) : 0;
      best = Math.min(best, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)));
    }
    return best;
  };
  let best = { r: -1 };
  const step = Math.max(0.5, (Math.max(...xs) - Math.min(...xs)) / 60);
  for (let x = Math.min(...xs); x <= Math.max(...xs); x += step)
    for (let y = Math.min(...ys); y <= Math.max(...ys); y += step)
      if (inside(x, y)) { const r = edgeDist(x, y); if (r > best.r) best = { x, y, r }; }
  return best;
}

const LABEL_MIN_R = 5.5; // room for a two-letter code
const statesSvg = [];
const labelsSvg = [];
const report = [];
fc.features.forEach((f, i) => {
  const name = f.properties.ST_NM;
  const code = CODES[name];
  if (!code) throw new Error(`no code for ${name}`);
  const esc = name.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  statesSvg.push(`<path d="${pathGen(f)}" fill="${SHADES[shade[i]]}"><title>${esc}</title></path>`);
  const lp = labelPoint(f);
  report.push([code, lp.r.toFixed(1)]);
  if (lp.r >= LABEL_MIN_R) labelsSvg.push(`<text x="${lp.x.toFixed(1)}" y="${(lp.y + 2.8).toFixed(1)}">${code}</text>`);
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Map of India with state boundaries">
<!-- India state boundaries: DataMeet India community (https://github.com/datameet/maps, States/Admin2), CC BY 4.0. Drawn with d3-geo, Lambert conformal conic. -->
<g stroke="#e4e4e4" stroke-width="0.6" stroke-linejoin="round">${statesSvg.join("")}</g>
<g fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="8" font-weight="600" text-anchor="middle" letter-spacing="0.3">${labelsSvg.join("")}</g>
</svg>
`;
fs.writeFileSync(outSvg, svg);

// Raw conic conformal, as d3-geo computes it, so the site needs no d3 for pins.
const rad = Math.PI / 180;
const tany = (y) => Math.tan((Math.PI / 2 + y) / 2);
const y0 = PARALLELS[0] * rad; const y1 = PARALLELS[1] * rad;
const n = Math.log(Math.cos(y0) / Math.cos(y1)) / Math.log(tany(y1) / tany(y0));
const F = (Math.cos(y0) * Math.pow(tany(y0), n)) / n;
const mine = (lon, lat) => {
  const x = (lon + ROTATE) * rad; const y = lat * rad;
  const r = F / Math.pow(tany(y), n);
  return [tx + k * r * Math.sin(n * x), ty - k * (F - r * Math.cos(n * x))];
};
for (const [lon, lat] of [[77.59, 12.97], [76.94, 8.52], [88.36, 22.57], [72.57, 23.02], [93.6, 27.1], [92.73, 11.62]]) {
  const a = projection([lon, lat]); const b = mine(lon, lat);
  if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 0.01) throw new Error(`projection mismatch at ${lon},${lat}: ${a} vs ${b}`);
}

const round = (v, d = 6) => Number(v.toFixed(d));
const js = `// Generated by scripts/build-india-map.mjs: do not edit by hand.
// The drawn map, public/assets/contact/india-states.svg, and the projection that
// draws it, so a branch's lat/lon lands exactly on the map (Lambert conformal
// conic, as d3-geo's geoConicConformal; central meridian ${-ROTATE}°E, standard
// parallels ${PARALLELS.join("° and ")}°).
// Boundaries: DataMeet India community (States/Admin2, per the Survey of
// India map), CC BY 4.0.

export const INDIA_MAP = {
  src: "/assets/contact/india-states.svg",
  width: ${W},
  height: ${H},
  credit: { label: "Map data: DataMeet India (CC BY 4.0)", href: "https://github.com/datameet/maps" },
};

const P = { lon0: ${-ROTATE}, n: ${round(n, 12)}, f: ${round(F, 12)}, k: ${round(k, 6)}, tx: ${round(tx, 6)}, ty: ${round(ty, 6)} };
const RAD = Math.PI / 180;
const tany = (y) => Math.tan((Math.PI / 2 + y) / 2);

// Map units (0..width, 0..height) for a { lat, lon }.
export function projectToMap({ lat, lon }) {
  const x = (lon - P.lon0) * RAD;
  const r = P.f / Math.pow(tany(lat * RAD), P.n);
  return [P.tx + P.k * r * Math.sin(P.n * x), P.ty - P.k * (P.f - r * Math.cos(P.n * x))];
}

// The same point as CSS percentages of a frame with the map's aspect ratio.
export function mapPercent(coords) {
  const [x, y] = projectToMap(coords);
  return { left: \`\${((x / INDIA_MAP.width) * 100).toFixed(3)}%\`, top: \`\${((y / INDIA_MAP.height) * 100).toFixed(3)}%\` };
}
`;
fs.writeFileSync(outJs, js);
console.log("svg", W, "x", H, (fs.statSync(outSvg).size / 1024).toFixed(1), "KB; labels", labelsSvg.length, "of", fc.features.length);
console.log(report.map((r) => r.join(":")).join(" "));
