// Dexter's email check: spots the common slips in an email's domain
// ("gmial.com", "yahoo.con") and suggests the fix. It only suggests; the
// visitor decides.

const DOMAINS = ["gmail.com", "yahoo.com", "yahoo.co.in", "hotmail.com", "outlook.com", "rediffmail.com", "icloud.com", "live.com"];
const ENDINGS = { con: "com", cmo: "com", ocm: "com", vom: "com", comm: "com", "co.inn": "co.in", "co.n": "co.in", "ac.inn": "ac.in" };

// Edit distance, small strings only.
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

/** The corrected email when the domain looks mistyped, else null. */
export function suggestEmail(value) {
  const email = String(value ?? "").trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return null;
  const user = email.slice(0, at);
  let domain = email.slice(at + 1);

  // A mistyped ending (".con", ".co.inn").
  for (const [wrong, right] of Object.entries(ENDINGS)) {
    if (domain.endsWith(`.${wrong}`)) {
      domain = `${domain.slice(0, -wrong.length)}${right}`;
      break;
    }
  }

  // A mistyped well-known provider ("gmial.com", "gmai.com").
  if (!DOMAINS.includes(domain)) {
    const close = DOMAINS.map((known) => [known, distance(domain, known)])
      .filter(([, d]) => d > 0 && d <= 2)
      .sort((a, b) => a[1] - b[1])[0];
    if (close) domain = close[0];
  }

  const fixed = `${user}@${domain}`;
  return fixed === email ? null : fixed;
}

/** Whether a value looks like an email at all. */
export const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value ?? "").trim());
