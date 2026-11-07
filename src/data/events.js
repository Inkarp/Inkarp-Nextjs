import { eventRegistration } from "./eventRegistration";

const IMG = "/assets/images/events";
const COLLAGE = "/assets/images/events/collages";

export const events = [
  {
    id: 1,
    category: "Event",
    title: "Analytica Anacon India & India Lab Expo 2024!",
    description:
      "Date: September 26th - 28th, 2024\nLocation: Hall-3, Booth H3-D01, Hitex, Hyderabad",
    image: `${IMG}/Event1.jpeg`,
    date: "2024-09-26",
  },
  {
    id: 2,
    category: "Event",
    title: "CPHI & PMEC India Expo 2024!",
    description:
      "November 26th - 28th, 2024\nLocation: RH.C62, India Expo Center, Greater Noida, Delhi NCR",
    image: `${IMG}/Event2.jpeg`,
    date: "2024-11-28",
  },
  {
    id: 3,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "7th International Conference on Frontiers in Chemical Sciences",
    description:
      "December 02nd - 04th, 2024\nLocation: Conference Hall Indian Institute of Technology Amingaon, North Guwahati, Assam, 781039",
    image: `${IMG}/Event3.jpeg`,
    date: "2024-12-04",
  },
  {
    id: 4,
    category: "Conference 2024",
    title:
      "2nd International Conference On Biotechnology And Interdisciplinary Technologies [iCBIT 2024]",
    description:
      "December 13th - 14th, 2024\nLocation: Osman Sagar Rd, Kokapet, Gandipet, Hyderabad, Telangana 500075",
    image: `${IMG}/Event4.jpeg`,
    date: "2024-12-14",
  },
  {
    id: 5,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "International Conference On Metal Halide Perovskites (2024)",
    description:
      "Date: December 19th - 22nd, 2024\nLocation: National Institute of Science Education and Research (NISER), Bhubaneswar",
    image: `${IMG}/Event5.jpeg`,
    date: "2024-12-12",
  },
  {
    id: 6,
    category: "Asia Labex & Labotica Conclave 2026",
    title:
      "2nd International Conference On Advanced Functional Materials And Applications (ICAFMA-2025)",
    description: "January 2nd - 4th, 2025\nLocation: Manipal Institute of Technology, Manipal",
    image: `${IMG}/Event6.jpeg`,
    date: "2025-01-04",
  },
  {
    id: 7,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "You Are Invited To Attend Pharmaceutical & Lab Exhibition",
    description: "Date: January 3rd - 5th, 2025\nLocation: Brilliant Convention Centre, Indore",
    image: `${IMG}/Event7.jpeg`,
    date: "2025-01-05",
  },
  {
    id: 8,
    category: "Asia Labex & Labotica Conclave 2026",
    title:
      "13th International Symposium On Electrochemical Science And Technology (iSAEST-13)",
    description:
      "Date: January 8th - 10th, 2025\nLocation: Uday Samudra, Leisure Beach Hotel, Thiruvananthapuram, Kerala",
    image: `${IMG}/Event8.jpeg`,
    date: "2025-01-10",
  },
  {
    id: 9,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "You Are Invited To Attend Pharmaceutical & Lab Exhibition",
    description:
      "Date: February 3rd - 5th, 2025\nLocation: AMTZ Convention Centre, Visakhapatnam",
    image: `${IMG}/Event9.jpeg`,
    date: "2025-02-05",
  },
  {
    id: 10,
    category: "Asia Labex & Labotica Conclave 2026",
    title:
      "Invitation To The Mahe-IIT Conference On Advancements In Microfluidics And Biomarkers In Healthcare",
    description: "Date: February 21st, 2025\nLocation: MV Seminal Hall, MIT Manipal",
    image: `${IMG}/Event10.jpeg`,
    date: "2025-02-21",
  },
  {
    id: 11,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "You Are Invited To Attend The Asia Labex Exhibition & Labotica Conclave 2025",
    description:
      "Date: March 20th - 22nd, 2025\nLocation: Parade Ground, Sector-17, Chandigarh, India",
    image: `${IMG}/Event11.jpeg`,
    date: "2025-03-22",
  },
  {
    id: 12,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "Analytica Lab India-Mumbai 2025",
    description:
      "Date: 23rd - 25th of April 2025\nLocation: Stall no: G031 Pavilion 1 & 2, Jio Convention Centre, Bandra Kurla Complex, Mumbai",
    image: `${IMG}/Event12.jpeg`,
    date: "2025-04-25",
  },
  {
    id: 13,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "You are invited to attend the IPAAF International Poultry, Aquaculture & Animal Feed Expo.",
    description:
      "Date: 09th - 11th of May 2025\nLocation: Adlux International Convention Centre, Angamaly, Ernakulam, Kerala",
    image: `${IMG}/Event13.jpeg`,
    date: "2025-05-11",
    collageImage: `${COLLAGE}/IpaafEvent.webp`,
  },
  {
    id: 14,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "You are invited to attend the Pharmaceutical & Lab Exhibition.",
    description:
      "Date: 08th - 10th of May 2025\nLocation: Plot No. L-136, Near Cipla Circle and Pfizer Company, Verna, Goa",
    image: `${IMG}/Event14.jpeg`,
    date: "2025-05-10",
    collageImage: `${COLLAGE}/Pharmalab.webp`,
  },
  {
    id: 15,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "Invitation To The ASI Symposium 004 On Genesis And Evolution Of Organics In Space (Ois2.0)",
    description: "Date: 16th - 18th July 2025\nLocation: GITAM, Bengaluru",
    image: `${IMG}/Event15.jpeg`,
    date: "2025-07-18",
    collageImage: `${COLLAGE}/GitamEvent.webp`,
  },
  {
    id: 16,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "Invitation to the Purify Conclave on Purify'25 West, Chromatography Purification Conclave",
    description:
      "Date: Friday, 25th July 2025\nLocation: Peacock Banquet - Taj Skyline, 16th Floor - Sankalp Building, Ahmedabad",
    image: `${IMG}/Event16.jpeg`,
    date: "2025-07-25",
    collageImage: `${COLLAGE}/PurifyEvent.webp`,
  },
  {
    id: 17,
    image: `${IMG}/EventNew1.jpg`,
    date: "2025-09-18",
    formLink: "https://mmiconnect.in/ile-hyd-2025/visitor/registration?source=website",
    collageImage: `${COLLAGE}/HitexBeing.webp`,
  },
  {
    id: 18,
    image: `${IMG}/EventNew2.jpg`,
    date: "2025-09-21",
    formLink: "https://mmiconnect.in/ile-hyd-2025/visitor/registration?source=website",
    collageImage: `${COLLAGE}/HitexInkarp.webp`,
  },
  {
    id: 19,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "Invitation to the Purify Conclave on Purify'25 West, Chromatography Purification Conclave",
    description: "",
    image: `${IMG}/EventNew3.jpg`,
    date: "2025-11-06",
    collageImage: `${COLLAGE}/Vapi.webp`,
  },
  {
    id: 20,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "Invitation to the Purify Conclave on Purify'25 West, Chromatography Purification Conclave",
    description: "",
    image: `${IMG}/EventNew4.jpg`,
    date: "2025-11-28",
    formLink:
      "https://registration.cphi-pmec-india-virtualexpo.com/standard_visitor_registration?_gl=1*1d0kibw*_gcl_aw*R0NMLjE3NjM0NDUwODMuQ2owS0NRaUFyT3ZJQmhETEFSSXNBUHdKWE9iUFBiTjJJRU1vV0FFOGxybkV5Y19WbG1NTUNvRldGVFhadHJZaWJ4azJqX1FlUThFem1EUWFBak54RUFMd193Y0I.*_gcl_au*MTY3NjcwMDE1Ni4xNzU5ODEyNTQ3*_ga*MTU0ODQ4MDE4OS4xNzYyODYxNDQ0*_ga_ZJB8WQKN4E*czE3NjM2MTk4NTEkbzE0JGcxJHQxNzYzNjE5ODYyJGo0OSRsMCRoMA.",
    collageImage: `${COLLAGE}/CPHI-PMEc.jpg`,
  },
  {
    id: 21,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "Invitation to the Purify Conclave on Purify'25 West, Chromatography Purification Conclave",
    description: "",
    image: `${IMG}/EventNew5.jpg`,
    date: "2026-01-08",
    formLink: "https://exporegistration.in/pharmalabchemexpo-visitor.aspx",
    collageImage: `${COLLAGE}/PharmalabVijag.jpeg`,
  },
  {
    id: 22,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "Invitation to the Purify Conclave on Purify'25 West, Chromatography Purification Conclave",
    description: "",
    image: `${IMG}/EventNew6.webp`,
    date: "2026-02-08",
    formLink: "https://exporegistration.in/pharmalabchemexpo-visitor.aspx",
    collageImage: `${COLLAGE}/IndoorPharma.jpeg`,
  },
  {
    id: 23,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "Invitation to the Purify Conclave on Purify'25 West, Chromatography Purification Conclave",
    description: "",
    image: `${IMG}/EventNew7.jpeg`,
    date: "2026-04-24",
    formLink: "https://mmiconnect.in/ile-mum-2026/visitor/registration?source=website",
    collageImage: `${COLLAGE}/Mumbai-analytica.jpg`,
  },
  {
    id: 24,
    category: "Asia Labex & Labotica Conclave 2026",
    title: "Invitation to the Purify Conclave on Purify'25 West, Chromatography Purification Conclave",
    description: "",
    image: `${IMG}/EventNew8.jpeg`,
    date: "2026-05-27",
    formLink: "https://asialabex.com/bng2026registration/",
    collageImage: `${COLLAGE}/AsiaLabex.webp`,
  },
  {
    id: 25,
    category: "Exhibition",
    title: "analytica Lab India 2026 – Hyderabad",
    description:
      "Date: 10th - 12th September 2026\nLocation: Stall No. H5-C02, HITEX Exhibition Centre, Hyderabad",
    image: `${IMG}/EventNew9.webp`,
    date: "2026-09-12",
    collageImage: `${COLLAGE}/AnalyticaHyderabad2026.webp`,
  },
  {
    // Invitation poster laid out like the analytica 2026 one above (EventNew9),
    // made 7 Nov 2026 from the banner's stall render (pmec-2026-stall.webp),
    // the PMEC India logo and the details in `bannerEvent` below. Add a
    // `collageImage` of the stand after the show.
    id: 26,
    category: "Exhibition",
    title: "PMEC India 2026 – Greater Noida",
    description:
      "Date: 24th - 26th November 2026\nLocation: Hall 5, Stall No. 5F12, India Exposition Mart Limited (IEML), Greater Noida, Delhi NCR",
    image: `${IMG}/EventNew10.webp`,
    date: "2026-11-26",
  },
];

// Featured event shown in the page banner, replacing the old flat EventBanner
// image. Update these five fields when the next show is confirmed.
//
// Name taken from the official MMI registration page, which titles the 2026
// Hyderabad edition "analytica Lab India" (the older "Anacon India & India Lab
// Expo" branding is retired). The registration URL was checked and resolves.
// The banner hides the Register button entirely if `registrationUrl` is null.
export const featuredEvent = {
  eyebrow: "Event Completed",
  name: "analytica Lab India",
  edition: "Hyderabad 2026",
  dateLabel: "10 – 12 September 2026",
  venue: "HITEX Exhibition Centre, Hyderabad",
  stallNumber: "H5-C02",
  // Drives the banner countdown. Local time, doors-open on day one.
  startsAt: "2026-09-10T10:00:00+05:30",
  endsAt: "2026-09-12T18:00:00+05:30",
  summary:
    "Thank you to everyone who visited the Inkarp team at analytica Lab India 2026. We were delighted to demonstrate our laboratory and analytical instrumentation, discuss methods, and connect with the scientific community.",
  highlights: [
    "Instrument demonstrations",
    "Application and method discussions",
    "Connections with our support team",
  ],
  image: `${IMG}/Event1.jpeg`,
  registrationUrl: null,
};

/**
 * The next show, in the Events page banner ("stage" layout around the stall
 * render). Separate from `featuredEvent`, which still drives the homepage's
 * analytica stall card. Set to null to fall back to the `featuredEvent` banner.
 *
 * PMEC India 2026 is the IEML half of CPHI & PMEC India: from 2026 the sister
 * show CPHI India runs at Yashobhoomi, Delhi (official FAQ, cphi.com/india).
 * The banner's "Register to visit" button and the floating "Register now"
 * pill on the events pages take the organiser's registration link and the
 * show's closing time from ./eventRegistration.js (added 6 Nov 2026).
 */
export const bannerEvent = {
  eyebrow: "Meet us at",
  name: "PMEC India",
  edition: "2026",
  dateLabel: "24 – 26 November 2026",
  venue: "India Exposition Mart Limited (IEML), Greater Noida, Delhi NCR",
  hall: "Hall 5",
  stallNumber: "5F12",
  // Countdown target: doors open on day one at 10:00 (opening times on cphi.com/india).
  startsAt: "2026-11-24T10:00:00+05:30",
  endsAt: eventRegistration.endsAt,
  // A line under the pass (StageEventBanner); none for now.
  summary: null,
  // Short, so they sit in one row under the stall.
  highlights: ["Live instrument demos", "Method discussions", "Service and support"],
  stallImage: `${IMG}/pmec-2026-stall.webp`,
  stallImageAlt: "Inkarp stall 5F12 at PMEC India 2026, with laboratory instruments on display",
  registrationUrl: eventRegistration.url,
  // PMEC India's own logo in place of its name in the title: the full-colour
  // file the user supplied (6 Nov 2026), its grey background made transparent
  // so it sits straight on the white banner. null = none.
  logo: { src: `${IMG}/pmec-india-logo.png`, width: 271, height: 116 },
  // The heading and intro of the section under the banner (StallShowcase).
  showcaseTitle: "What's on Our Showcase?",
  showcaseIntro: "From smart laboratory solutions to advanced analytical technologies, here's what's coming to our stall!",
  // What is on show at the stall (the display list the user supplied, names
  // only), as image cards in two stacks either side of the stall in the
  // section under the banner. `href` only where the product has a page here;
  // `logo` marks a brand logo standing in for a product photo; no `image`
  // shows a lab icon.
  displayProducts: [
    { brand: "Heidolph", name: "Hei-VAP Expert Control", image: "/assets/images/productImages/heidolph/hei-vap-expert-control-rotary-evaporator.webp", href: "/products/hei-vap-expert-control-rotary-evaporator" },
    { brand: "Heidolph", name: "Magnetic Stirrer", image: "/assets/images/productImages/heidolph/Hei-PLATE-MixnHeat-Core.webp", href: "/products/hei-plate-mix-n-heat-core-magnetic-stirrer" },
    { brand: "Radleys", name: "Mya 4", image: "/assets/images/productImages/radleys/mya-4.png", href: "/products/mya-4-reaction-station" },
    { brand: "Radleys", name: "Reactor-Ready Mini", image: "/assets/images/productImages/radleys/E4-Reactor-Ready-Mini.webp", href: "/products/reactor-ready-mini-lab-reactor" },
    { brand: "GEA", name: "Panda Smart" },
    { brand: "Bruker", name: "ALPHA II", image: "/assets/images/productImages/Bruker/banner-alpha.png", href: "/products/alpha-ii-compact-ft-ir-spectrometer" },
    { brand: "Sartorius", name: "Arium Mini Plus", image: "/assets/images/productImages/Sotorius/arium-mini-plus-lab-water-purification-system.png", href: "/products/arium-mini-plus-lab-water-purification-system" },
    { brand: "Being", name: "Chiller BR-05A", image: "/assets/images/PrincipalLogos/Being.svg", logo: true },
    { brand: "Being", name: "Vacuum Oven DZF-6032", image: "/assets/images/events/pmec-2026-being-vacuum-oven.webp" },
    { brand: "Inkarp USB", name: "Ultrasonic Bath", image: "/assets/images/productImages/inkarp/ultrasonic-bath.png", href: "/products/ultrasonic-bath" },
    { brand: "Being", name: "20 L Rotary Evaporator RV-20A", image: "/assets/images/PrincipalLogos/Being.svg", logo: true },
    { brand: "Being", name: "V65 Pump", image: "/assets/images/PrincipalLogos/Being.svg", logo: true },
    { brand: "Implen", name: "NanoPhotometer N80", image: "/assets/images/productImages/Implen/nanophotometer-np80.jpg", href: "/products/nanophotometer-np80" },
    { brand: "Anvajo", name: "Fluidlab R300" },
    { brand: "Ametek Brookfield", name: "CTX Texture Analyzer", image: "/assets/images/productImages/Brookfield/ctx-text-analyzer.webp", href: "/products/ctx-texture-analyzer" },
    { brand: "Ametek Brookfield", name: "DVNext Rheometer", image: "/assets/images/productImages/Brookfield/dvnext-rheometer.webp", href: "/products/dvnext-rheometer" },
    { brand: "Ametek Brookfield", name: "DV2Plus Viscometer", image: "/assets/images/productImages/Brookfield/dv2plus-viscometer.webp", href: "/products/dv2plus-viscometer" },
    { brand: "Advion Interchim Scientific", name: "puriFlash XS 530", image: "/assets/images/productImages/Advion/puriflash-xs-platform.jpg", href: "/products/puriflash-xs-530" },
    { name: "Prep Tower 1000 ml" },
    { brand: "ECOM", name: "DAC Column PC01 50/500", image: "/assets/images/productImages/Ecom/separchrom-pc01.webp", href: "/products/separchrom-dac-pc01-hplc-columns-with-axial-compression" },
  ],
};

/**
 * The stand Inkarp is exhibiting at next: the events page banner's show
 * (`bannerEvent`, PMEC India 2026; the recap `featuredEvent` if there is
 * none). Kept here rather than inside a component so the homepage's events
 * row reads the same source as the events page — update the show in one
 * place. Its status comes from `startsAt` / `endsAt` (stallStatus).
 */
export const upcomingStallEvent = bannerEvent
  ? {
      id: `${bannerEvent.name}-${bannerEvent.edition}`.toLowerCase().replace(/\W+/g, "-"),
      title: `${bannerEvent.name} ${bannerEvent.edition}`,
      shortTitle: bannerEvent.name,
      description: `${bannerEvent.hall} · Stall ${bannerEvent.stallNumber}, ${bannerEvent.venue}`,
      venue: bannerEvent.venue,
      dateLabel: bannerEvent.dateLabel,
      image: bannerEvent.stallImage,
      registrationUrl: bannerEvent.registrationUrl,
      stallNumber: bannerEvent.stallNumber,
      // Full doors-open timestamp, for countdowns precise to the second — `date`
      // below is the day-only cut for simpler "days until" displays.
      startsAt: bannerEvent.startsAt,
      endsAt: bannerEvent.endsAt,
      // Doors open on day one — that is what a countdown should point at.
      date: bannerEvent.startsAt.slice(0, 10),
      closesOn: bannerEvent.endsAt.slice(0, 10),
    }
  : {
      id: `${featuredEvent.name}-${featuredEvent.edition}`.toLowerCase().replace(/\W+/g, "-"),
      title: `${featuredEvent.name} ${featuredEvent.edition}`,
      shortTitle: featuredEvent.name,
      description: featuredEvent.summary,
      venue: featuredEvent.venue,
      dateLabel: featuredEvent.dateLabel,
      image: featuredEvent.image,
      registrationUrl: featuredEvent.registrationUrl,
      stallNumber: featuredEvent.stallNumber,
      startsAt: featuredEvent.startsAt,
      endsAt: featuredEvent.endsAt,
      date: featuredEvent.startsAt.slice(0, 10),
      closesOn: featuredEvent.endsAt.slice(0, 10),
    };

// "upcoming" before a show opens, "ongoing" while it is on, "past" after.
export function stallStatus(event, now = Date.now()) {
  if (now < Date.parse(event.startsAt)) return "upcoming";
  return now <= Date.parse(event.endsAt) ? "ongoing" : "past";
}

export const eventYears = [...new Set(events.map((event) => new Date(event.date).getFullYear()))].sort(
  (a, b) => a - b
);

export function isPastEvent(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);

  return eventDate < today;
}

export function getEventStatus(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate.getTime() === today.getTime()) return "ongoing";
  return eventDate < today ? "past" : "upcoming";
}

export function formatEventDate(event) {
  return new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
