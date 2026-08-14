import { siteConfig } from "@/data/siteConfig";

export const googleReviewsSummary = {
  rating: "4.8",
  count: "120+",
  href: siteConfig.googleBusinessUrl,
};

// Real Google reviews, transcribed from the business listing in August 2026.
// Ordered newest first.
//
// These carry real reviewers' names, so `text` is only lightly copy-edited —
// capitalisation, punctuation and obvious typos. The wording and meaning are the
// reviewer's own and must stay that way; do not paraphrase or embellish. If a
// review needs more than a typo fix to read well, leave it out instead.
//
// `date` is a fixed month, not a relative phrase: Google shows "3 weeks ago",
// but storing that would leave the site claiming it forever.
//
// Keep `id` unique (it's the React key). A count that is a multiple of 3 fills
// the HomeClientReviews slider evenly on desktop; at 16 the last desktop page
// carries a single card.
export const googleReviews = [
  {
    id: "review-rajkumar-varma",
    name: "Rajkumar Varma",
    initials: "RV",
    date: "August 2026",
    rating: 5,
    text: "Nice explanation and good knowledge about the instrument and installation. Great hands-on skills.",
  },
  {
    id: "review-vishal-gupta",
    name: "Vishal Gupta",
    initials: "VG",
    date: "July 2026",
    rating: 5,
    text: "Service is very prompt, and the engineer has full knowledge of the equipment.",
  },
  {
    id: "review-amit-banerjee",
    name: "Amit Banerjee",
    initials: "AB",
    date: "July 2026",
    rating: 4,
    text: "We are highly satisfied with the service provided by Inkarp Instruments. All the issues related to our FTIR have been resolved, and we received satisfactory answers to all our queries from the instrument engineer, Mr. Kaushik.",
  },
  {
    id: "review-manpreet-kathuria",
    name: "Manpreet Kathuria",
    initials: "MK",
    date: "July 2026",
    rating: 5,
    text: "Good service, well explained about installation.",
  },
  {
    id: "review-rudra-murty",
    name: "Rudra Murty",
    initials: "RM",
    date: "July 2026",
    rating: 5,
    text: "Services rendered in prompt time, and execution done successfully for the replacement of a spare part.",
  },
  {
    id: "review-suryanarayana-g",
    name: "Suryanarayana G.",
    initials: "SG",
    date: "July 2026",
    rating: 5,
    text: "Good support and good product.",
  },
  {
    id: "review-ram-charan-nadendla",
    name: "Ram Charan Nadendla",
    initials: "RN",
    date: "July 2026",
    rating: 5,
    text: "Good product quality.",
  },
  {
    id: "review-samanthula-krishna",
    name: "Samanthula Krishna",
    initials: "SK",
    date: "June 2026",
    rating: 5,
    text: "Good quality products.",
  },
  {
    id: "review-adinath-kanawade",
    name: "Adinath Kanawade",
    initials: "AK",
    date: "June 2026",
    rating: 4,
    text: "Very good work, and the equipment is all working fine.",
  },
  {
    id: "review-sushanth-reddipalli",
    name: "Sushanth Reddipalli",
    initials: "SR",
    date: "June 2026",
    rating: 5,
    text: "Quality products, and a proper response on time.",
  },
  {
    id: "review-adduri-veeranna",
    name: "Adduri Veeranna",
    initials: "AV",
    date: "June 2026",
    rating: 5,
    text: "Good quality and quick response.",
  },
  {
    id: "review-gowtham-gandi",
    name: "Gowtham Gandi",
    initials: "GG",
    date: "June 2026",
    rating: 5,
    text: "Overall experience is good.",
  },
  {
    id: "review-yasodha-nandakumar",
    name: "Yasodha Nandakumar",
    initials: "YN",
    date: "June 2026",
    rating: 5,
    text: "Quality product and good response.",
  },
  {
    id: "review-satish-kumar-k",
    name: "Satish Kumar K",
    initials: "SK",
    date: "June 2026",
    rating: 5,
    text: "Good company and quality products.",
  },
  {
    id: "review-jithendra",
    name: "Jithendra",
    initials: "J",
    date: "June 2026",
    rating: 5,
    text: "Outstanding quality and attention to detail. The environment was clean, comfortable and welcoming. I would definitely visit again and recommend this place to others.",
  },
  {
    id: "review-jithendra-sai-chandra-bardvaj",
    name: "Jithendra Sai Chandra Bardvaj",
    initials: "JB",
    date: "June 2026",
    rating: 5,
    text: "I got better quality products from this company, and they had the right instruments for me.",
  },
];

export const groupCompanies = {
  heading: "Group Companies & Collaborations",
  title: "Beyond Inkarp",
  description:
    "Inkarp works through group companies, service divisions, and selected collaborations that strengthen how laboratories access scientific solutions, technical support, and long-term service.",
  centerLogo: "/assets/home/GroupLogo.png",
  companies: [
    {
      name: "Group Company",
      displayName: "Spark Scientific Private Ltd",
      description: "Group company supporting scientific and laboratory requirements.",
      logo: "/assets/home/Spark.svg",
      href: "/",
      year: "2005", // dummy — replace with the real founding/start year
    },
    {
      name: "Group Company",
      displayName: "Inkarp Telecom",
      description: "Group company supporting communication and connectivity needs.",
      logo: "/assets/home/InkarpTelecom.svg",
      href: "/",
      badge: "Phone",
      year: "2010", // dummy — replace with the real founding/start year
    },
    {
      name: "Group Company",
      displayName: "Inkarp Instrument Services",
      description: "Service division supporting installed systems, maintenance, and technical care.",
      logo: "/assets/home/InkarpServices.svg",
      href: "/",
      badge: "Service",
      year: "2012", // dummy — replace with the real founding/start year
    },
    {
      name: "Collaborative Venture",
      displayName: "Advion Interchim Scientific",
      description: "Collaboration partner for specialized analytical and purification technologies.",
      logo: "/assets/images/PrincipalLogos/RowOne/advion.png",
      href: "/products?q=advion",
      year: "2015", // dummy — replace with the real partnership start year
    },
    {
      name: "Collaborative Venture",
      displayName: "Verder Scientific",
      description: "Collaboration partner supporting laboratory and material science solutions.",
      logo: "/assets/home/Verder.svg",
      href: "/",
      year: "2018", // dummy — replace with the real partnership start year
    },
  ],
};
