// Registration for the show on the events page banner (bannerEvent in
// ./events.js reads its link and end from here). While registration is open
// and the show has not ended, the events pages' floating pill invites
// visitors to register in place of the instrument finder (HomeSolutionFinder),
// and goes back to the finder by itself after. Kept apart from events.js so
// the site-wide finder does not load the whole events list.
export const eventRegistration = {
  name: "PMEC India",
  // The link the user supplied (6 Nov 2026): the organiser's PMEC India
  // registration form (Standard pass), with the organiser's own tracking tags
  // kept as given. null = no pill and no Register button.
  url: "https://pmec-india-register.cphi.com/form/standard_short?ref=google1&utm_campaign=VM_PMEC_Search_Brand_17June26&utm_source=google&utm_medium=perf_mrktg_cmpgn",
  // When the show closes: PMEC India's last day, 26 November, runs 10:00 -
  // 17:00 (opening times on cphi.com/india). After this the pill is the
  // instrument finder again.
  endsAt: "2026-11-26T17:00:00+05:30",
};

// Whether the pill should invite registration right now.
export function registrationOpen(now = Date.now()) {
  return Boolean(eventRegistration.url) && now < Date.parse(eventRegistration.endsAt);
}
