// Builds public/patterns/lab-glassware.svg, the faint lab-glassware wallpaper tile
// used by `.lab-pattern` in src/app/globals.css, from the Lucide lab icons that
// react-icons ships (react-icons/lu). Edit ICONS or OPACITY here and re-run:
//   node scripts/build-lab-pattern.mjs
import fs from "node:fs";

const OUT = "public/patterns/lab-glassware.svg";
const OPACITY = 0.07;

// 360px tile, a loose 3x3 scatter. Every icon stays clear of the tile edge so the
// repeat never cuts one in half. [icon, centre x, centre y, rotation, scale]
const ICONS = [
  ["LuBeaker", 54, 50, -12, 1.2],
  ["LuFlaskConical", 186, 72, 10, 1.25],
  ["LuTestTube", 306, 42, 28, 1.15],
  ["LuPipette", 84, 178, 0, 1.15],
  ["LuMicroscope", 212, 196, 0, 1.3],
  ["LuFlaskRound", 318, 170, -8, 1.2],
  ["LuTestTubes", 42, 302, 8, 1.2],
  ["LuThermometer", 158, 318, -24, 1.15],
  ["LuDroplets", 284, 298, 0, 1.05],
];

const source = fs.readFileSync("node_modules/react-icons/lu/index.mjs", "utf8");

function iconMarkup(name) {
  const match = source.match(new RegExp(`export function ${name} \\(props\\) \\{\\s*return GenIcon\\((\\{.*\\})\\)\\(props\\);`));
  if (!match) throw new Error(`Icon not found in react-icons/lu: ${name}`);
  const toSvg = (node) => `<${node.tag}${Object.entries(node.attr).map(([key, value]) => ` ${key}="${value}"`).join("")}/>`;
  return JSON.parse(match[1]).child.map(toSvg).join("");
}

const groups = ICONS.map(([name, x, y, rotation, scale]) =>
  `  <!-- ${name.slice(2)} -->\n  <g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale}) translate(-12 -12)">${iconMarkup(name)}</g>`
).join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360">
  <!-- Built by scripts/build-lab-pattern.mjs; edit that script, not this file.
       Icons: Lucide (ISC licence), via react-icons/lu. -->
  <g fill="none" stroke="#161616" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="${OPACITY}">
${groups}
  </g>
</svg>
`;

fs.mkdirSync("public/patterns", { recursive: true });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${svg.length} bytes)`);
