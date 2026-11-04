import { events, formatEventDate, getEventStatus } from "@/data/events";

/**
 * The events list (src/data/events.js) made ready for display, shared by the
 * events page's list layouts (EventsTimeline, EventsWall, EventsYearRows):
 * newest first, each with a display name and its dates and venue as written
 * in its description. Whether it is still to come is worked out when shown
 * (liveStatus), not once when this module loads.
 *
 * Names come only from the data. An invitation's wording is trimmed ("You
 * are invited to attend the …", "Invitation to the …"). An event with no
 * title, or one sharing its title with others and with no description of its
 * own (a placeholder copied between entries), gets no name: the layouts show
 * FALLBACK_NAME instead.
 */

export const FALLBACK_NAME = "Inkarp at this event";

const INVITATION = /^(you are invited to attend( the)?|invitation to( the)?)\s+/i;

const titleCounts = events.reduce((counts, event) => {
  if (event.title) counts.set(event.title, (counts.get(event.title) ?? 0) + 1);
  return counts;
}, new Map());

function displayName(event) {
  if (!event.title) return null;
  if (titleCounts.get(event.title) > 1 && !event.description) return null;
  const trimmed = event.title.replace(INVITATION, "");
  const name = trimmed.replace(/[!.]+$/, "").trim();
  // Capitalised only where the invitation's wording was cut off ("…attend
  // the IPAAF…"); a name's own styling ("analytica") stays.
  return trimmed === event.title ? name : name.charAt(0).toUpperCase() + name.slice(1);
}

// "Date: September 26th - 28th, 2024" and "Location: …" lines, when given.
function descriptionLine(event, label) {
  const line = (event.description ?? "")
    .split("\n")
    .map((text) => text.trim())
    .find((text, index) => (label === "Date" ? /^date:/i.test(text) || (index === 0 && /\d/.test(text) && !/^location:/i.test(text)) : /^location:/i.test(text)));
  return line ? line.replace(/^(date|location):\s*/i, "") : null;
}

function prepare(event) {
  return {
    ...event,
    name: displayName(event),
    dateText: descriptionLine(event, "Date") ?? formatEventDate(event),
    place: descriptionLine(event, "Location"),
    year: new Date(event.date).getFullYear(),
  };
}

// Its status today, and its registration link while it is still to come.
export function liveStatus(event) {
  const status = getEventStatus(event);
  return { status, registerUrl: status !== "past" && event.formLink ? event.formLink : null };
}

export const listedEvents = events.map(prepare).sort((a, b) => new Date(b.date) - new Date(a.date));

// [{ year, events }], newest year first.
export const eventsByYear = [...new Set(listedEvents.map((event) => event.year))].map((year) => ({
  year,
  events: listedEvents.filter((event) => event.year === year),
}));

export const STATUS_LABELS = { upcoming: "Upcoming", ongoing: "Happening now", past: "Completed" };
