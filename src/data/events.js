export const events = [
  {
    id: 1,
    title: "India Lab Expo 2026",
    type: "Exhibition",
    city: "Mumbai",
    venue: "Bombay Exhibition Centre, Goregaon",
    startDate: "2026-07-09",
    endDate: "2026-07-11",
    boothNo: "Hall 3, Booth B-42",
    logo: "/assets/images/PrincipalLogos/RowSeven/Bruker.svg",
    description:
      "India's largest laboratory technology exhibition, bringing together analytical, scientific, and biotech instrumentation under one roof.",
    highlights: [
      "Live demos of Bruker FT-IR and Heidolph rotary evaporators",
      "Meet our application specialists for on-site consultations",
      "Exclusive show offers on select instrumentation",
    ],
  },
  {
    id: 2,
    title: "Analytica Anacon India",
    type: "Conference",
    city: "Hyderabad",
    venue: "HITEX Exhibition Center",
    startDate: "2026-08-20",
    endDate: "2026-08-22",
    boothNo: "Hall 1, Booth A-18",
    logo: "/assets/images/PrincipalLogos/RowTwo/waters.svg",
    description:
      "A premier platform for analytical, biotech, and laboratory technology, connecting manufacturers and end-users across pharma and life sciences.",
    highlights: [
      "Showcasing Waters mass spectrometry and chromatography systems",
      "Technical talks on GLP-1RA and peptide analysis workflows",
      "Hands-on demo zone for QC and R&D laboratories",
    ],
  },
  {
    id: 3,
    title: "CPHI & PMEC India",
    type: "Trade Show",
    city: "Greater Noida",
    venue: "India Expo Mart",
    startDate: "2026-11-25",
    endDate: "2026-11-27",
    boothNo: "Hall 5, Booth C-09",
    logo: "/assets/images/PrincipalLogos/RowSix/Chemspeed.jpg",
    description:
      "The region's leading pharma ingredients and machinery exhibition, covering the full spectrum of pharmaceutical manufacturing and discovery.",
    highlights: [
      "Chemspeed automated synthesis and high-throughput platforms on display",
      "Live Q&A on lab automation strategies for process development",
      "Network with our regional sales and service teams",
    ],
  },
  {
    id: 4,
    title: "Lab Asia & Bio Asia Expo",
    type: "Exhibition",
    city: "Bengaluru",
    venue: "Bangalore International Exhibition Centre",
    startDate: "2026-03-12",
    endDate: "2026-03-14",
    boothNo: "Hall 2, Booth D-05",
    logo: "/assets/images/PrincipalLogos/RowOne/Heidolph.svg",
    description:
      "A regional showcase of laboratory, biotechnology, and life sciences innovation for South India's research and manufacturing community.",
    highlights: [
      "Heidolph evaporation and distillation systems demo",
      "Application support desk for water quality and BOD testing",
      "Student and academia outreach sessions",
    ],
  },
];

export function getEventStatus(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(event.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(event.endDate || event.startDate);
  end.setHours(0, 0, 0, 0);

  if (today > end) {
    return "past";
  }

  if (today >= start && today <= end) {
    return "ongoing";
  }

  return "upcoming";
}

export function getDaysToStart(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(event.startDate);
  start.setHours(0, 0, 0, 0);

  return Math.ceil((start - today) / (1000 * 60 * 60 * 24));
}

export function getNextUpcomingEvent() {
  return events
    .filter((event) => getEventStatus(event) !== "past")
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];
}

export function formatDateRange(event) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate || event.startDate);
  const options = { day: "numeric", month: "short", year: "numeric" };

  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString("en-IN", options);
  }

  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    return `${start.getDate()}-${end.toLocaleDateString("en-IN", options)}`;
  }

  return `${start.toLocaleDateString("en-IN", options)} - ${end.toLocaleDateString(
    "en-IN",
    options
  )}`;
}
