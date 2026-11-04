// Registration for the show on the events page banner (bannerEvent in
// ./events.js reads its link and end from here). While registration is open
// and the show has not ended, the events pages' floating pill invites
// visitors to register in place of the instrument finder (HomeSolutionFinder),
// and goes back to the finder by itself after. Kept apart from events.js so
// the site-wide finder does not load the whole events list.
export const eventRegistration = {
  name: "PMEC India",
  // The official visitor registration page; null until it is supplied (no
  // pill and no Register button until then).
  url: null,
  endsAt: "2026-11-26T18:00:00+05:30",
};

// Whether the pill should invite registration right now.
export function registrationOpen(now = Date.now()) {
  return Boolean(eventRegistration.url) && now < Date.parse(eventRegistration.endsAt);
}
