// Head office working hours, shown on /contact and used for its "Open now"
// badge. All times are IST, whatever the visitor's own timezone.
export const OFFICE_HOURS_LINES = [
  "Mon-Fri · 09:30am - 05:30pm",
  "1st & 3rd Sat · 09:30am - 01:30pm",
  "2nd & 4th Sat · Holiday",
];

const WEEKDAY = { open: [9, 30], close: [17, 30] };
const HALF_SATURDAY = { open: [9, 30], close: [13, 30] };
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Hours for one IST calendar day: { open, close }, "closed", or null when the
 * published hours don't say. A 5th Saturday isn't covered by the rules above,
 * so no claim is made either way.
 */
function hoursFor(weekday, dayOfMonth) {
  if (weekday === 0) return "closed";
  if (weekday < 6) return WEEKDAY;

  const nth = Math.ceil(dayOfMonth / 7);
  if (nth === 1 || nth === 3) return HALF_SATURDAY;
  if (nth === 2 || nth === 4) return "closed";
  return null;
}

function formatTime([hour, minute]) {
  const suffix = hour >= 12 ? "pm" : "am";
  const h = hour % 12 || 12;
  return `${h}:${String(minute).padStart(2, "0")} ${suffix} IST`;
}

function istParts(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, Number(value)])
  );
  return parts;
}

/**
 * Whether the head office is open at `now`.
 * @returns {{ open: boolean, label: string } | null} null when the hours
 *   don't cover today. Public holidays aren't known here.
 */
export function getOfficeStatus(now = new Date()) {
  const { year, month, day, hour, minute } = istParts(now);
  const minutesNow = hour * 60 + minute;

  // Walk forward a calendar day at a time (in IST) to the next opening.
  for (let offset = 0; offset < 8; offset += 1) {
    const date = new Date(Date.UTC(year, month - 1, day + offset));
    const hours = hoursFor(date.getUTCDay(), date.getUTCDate());

    if (hours === null) return offset === 0 ? null : { open: false, label: "Closed now" };
    if (hours === "closed") continue;

    const openAt = hours.open[0] * 60 + hours.open[1];
    const closeAt = hours.close[0] * 60 + hours.close[1];

    if (offset === 0) {
      if (minutesNow >= openAt && minutesNow < closeAt) {
        return { open: true, label: `Open now · until ${formatTime(hours.close)}` };
      }
      if (minutesNow < openAt) {
        return { open: false, label: `Closed · opens today ${formatTime(hours.open)}` };
      }
      continue;
    }

    const when = offset === 1 ? "tomorrow" : DAY_NAMES[date.getUTCDay()];
    return { open: false, label: `Closed · opens ${when} ${formatTime(hours.open)}` };
  }

  return null;
}
