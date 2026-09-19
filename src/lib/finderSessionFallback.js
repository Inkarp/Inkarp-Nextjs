// Short-lived continuity store used only when MongoDB is unreachable. It lets
// the current visitor view the report instead of losing a completed wizard.
// Normal operation always persists to MongoDB.
const sessions = globalThis._finderSessionFallback ?? new Map();
globalThis._finderSessionFallback = sessions;

const MAX_SESSIONS = 100;

export function cacheFinderSession(session) {
  sessions.set(session.sessionId, session);
  while (sessions.size > MAX_SESSIONS) {
    sessions.delete(sessions.keys().next().value);
  }
  return session;
}

export function getCachedFinderSession(sessionId) {
  return sessions.get(sessionId) ?? null;
}

export function updateCachedFinderSession(sessionId, updates) {
  const session = getCachedFinderSession(sessionId);
  if (!session) return null;
  const updated = { ...session, ...updates, updatedAt: new Date() };
  sessions.set(sessionId, updated);
  return updated;
}
