const STORAGE_KEY = "ikp_pulse_last_seen";

export function getLastSeenPulse() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function markPulseSeen(isoDate) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, isoDate);
  } catch {
    // Private mode or blocked storage — the badge just won't remember.
  }
}
