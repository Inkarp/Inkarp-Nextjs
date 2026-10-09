// Per-IP throttle for API routes that send email or store submissions.
// In-process on purpose: a spike guard for one server against bots flooding
// the forms (each submission mails the team and the address typed in), not a
// distributed quota.

const LOOPBACK = /^(127\.|::1$|::ffff:127\.)/;

// X-Real-IP first: the proxy sets it from the connection, so a bot can't
// rotate it the way it can prefix its own X-Forwarded-For. A loopback address
// means the proxy didn't pass the visitor's address on, and every visitor
// would look like the same one, so it counts as unknown.
export function clientIp(request) {
  const realIp = request.headers.get("x-real-ip")?.trim();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  const ip = realIp || forwarded || "";
  return LOOPBACK.test(ip) ? "" : ip;
}

export function createRateLimiter({ windowMs, max }) {
  const hits = new Map();

  return function isRateLimited(request) {
    const ip = clientIp(request);
    // Without a client address every visitor would share one bucket and real
    // people would be blocked, so only throttle when the proxy reports one.
    if (!ip) return false;

    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((time) => now - time < windowMs);
    recent.push(now);
    hits.set(ip, recent);

    // Keep the map from growing without bound on a long-lived process.
    if (hits.size > 5000) {
      for (const [key, times] of hits) {
        if (!times.some((time) => now - time < windowMs)) hits.delete(key);
      }
    }

    return recent.length > max;
  };
}

// A function, not a shared constant: a Response body can only be sent once.
export function tooManySubmissions() {
  return Response.json(
    {
      success: false,
      message: "Too many submissions from your connection. Please wait a few minutes and try again.",
    },
    { status: 429 }
  );
}
