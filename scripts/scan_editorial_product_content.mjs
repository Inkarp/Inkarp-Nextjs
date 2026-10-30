import fs from "node:fs/promises";
import path from "node:path";

const root = "src/data/principals";
const files = [];
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(full);
  }
}
await walk(root);

const strongPatterns = [
  /\bI(?:'|’)m\b/i,
  /\bI(?:'|’)ve\b/i,
  /\bI have (?:kept|flagged|not|only)\b/i,
  /\bI am (?:flagging|not assuming)\b/i,
  /\bnot assuming\b/i,
  /\bthis source\b/i,
  /\bsource pull\b/i,
  /\bsource page\b/i,
  /\bsupplied source\b/i,
  /\bsource material\b/i,
  /\bnot detailed further\b/i,
  /\bplaceholders? pending\b/i,
  /\bbuilt so far\b/i,
  /\bsource stays\b/i,
  /\b(?:original|current) source\b/i,
  /\bsource (?:document|content|information|data)\b/i,
  /\bpage (?:reviewed|pulled|title|breadcrumb|content)\b/i,
  /\baccording to (?:the|this) (?:page|source)\b/i,
  /\bper the source\b/i,
  /\bthe source (?:describes|states|claims)\b/i,
  /\bwe (?:found|could not|couldn't|did not|didn't|have not|haven't)\b/i,
  /\bcurrently available (?:content|information|data)\b/i,
  /\bnot a blanket claim\b/i,
];

function classify(text) {
  if (/\bI(?:'|’)m\b|\bI(?:'|’)ve\b|\bnot assuming\b|\bI have kept\b|\bsource stays\b/i.test(text)) {
    return ["Remove / rewrite", "Internal AI/editorial voice is visible to customers"];
  }
  if (/placeholders? pending|built so far/i.test(text)) {
    return ["Remove / rewrite", "Internal production or incomplete-content wording"];
  }
  if (/not confirmed|weren't confirmed|wasn't confirmed|not stated|not specified|not detailed|not available|source pull|source page|supplied source|this source/i.test(text)) {
    return ["Rewrite", "Replace source-process wording with customer-facing availability or verification wording"];
  }
  return ["Review", "Editorial or source-reference wording should be checked"];
}

function visit(value, jsonPath, context, rows) {
  if (typeof value === "string") {
    if (strongPatterns.some((pattern) => pattern.test(value))) {
      const [action, reason] = classify(value);
      rows.push({ ...context, jsonPath, text: value, action, reason });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, `${jsonPath}[${index}]`, context, rows));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) visit(item, `${jsonPath}.${key}`, context, rows);
  }
}

const findings = [];
for (const file of files) {
  let data;
  try {
    data = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    continue;
  }
  const principal = data.principal?.principalName ?? data.principal?.name ?? data.principal?.slug ?? path.basename(path.dirname(file));
  for (const category of data.categories ?? []) {
    for (const product of category.products ?? []) {
      const sections = product.longForm?.sections ?? [];
      sections.forEach((section, sectionIndex) => {
        const context = {
          principal,
          category: category.name ?? product.category ?? "",
          product: product.name ?? product.slug,
          slug: product.slug ?? "",
          tab: section.title ?? section.key ?? `Section ${sectionIndex + 1}`,
          sectionKey: section.key ?? "",
          file: file.replaceAll("\\", "/"),
        };
        visit(section, `longForm.sections[${sectionIndex}]`, context, findings);
      });
    }
  }
}

const unique = [];
const seen = new Set();
for (const row of findings) {
  const key = `${row.slug}\u0000${row.jsonPath}\u0000${row.text}`;
  if (!seen.has(key)) {
    seen.add(key);
    unique.push(row);
  }
}
unique.sort((a, b) => a.principal.localeCompare(b.principal) || a.product.localeCompare(b.product) || a.tab.localeCompare(b.tab) || a.jsonPath.localeCompare(b.jsonPath));
await fs.mkdir("tmp", { recursive: true });
await fs.writeFile("tmp/editorial-content-findings.json", JSON.stringify(unique, null, 2));
const byPrincipal = Object.fromEntries([...new Set(unique.map((row) => row.principal))].map((principal) => [principal, unique.filter((row) => row.principal === principal).length]));
console.log(JSON.stringify({ filesScanned: files.length, findings: unique.length, products: new Set(unique.map((row) => row.slug)).size, byPrincipal }, null, 2));
