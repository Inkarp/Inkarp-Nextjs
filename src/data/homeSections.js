import { siteConfig } from "@/data/siteConfig";

export const googleReviewsSummary = {
  rating: "4.8",
  count: "120+",
  href: siteConfig.googleBusinessUrl,
};

// PLACEHOLDER CONTENT — all 9 entries below are dummy. Swap `name`, `initials`,
// `date`, `rating`, and `text` for the real Google reviews when they're ready.
// Keep `id` unique (it's the React key) and keep the list at a multiple of 3 so
// the HomeClientReviews slider pages fill evenly on desktop.
export const googleReviews = [
  {
    id: "review-1",
    name: "Sample Reviewer 1",
    initials: "SR",
    date: "2 weeks ago",
    rating: 5,
    text: "Sample review text — replace with a real Google review. Installation and support were prompt and professional.",
  },
  {
    id: "review-2",
    name: "Sample Reviewer 2",
    initials: "SR",
    date: "1 month ago",
    rating: 5,
    text: "Sample review text — replace with a real Google review. The team helped us choose the right instrument for our lab.",
  },
  {
    id: "review-3",
    name: "Sample Reviewer 3",
    initials: "SR",
    date: "2 months ago",
    rating: 4,
    text: "Sample review text — replace with a real Google review. Responsive service and genuine product knowledge.",
  },
  {
    id: "review-4",
    name: "Sample Reviewer 4",
    initials: "SR",
    date: "3 months ago",
    rating: 5,
    text: "Sample review text — replace with a real Google review. Commissioning was completed on schedule and the handover training was clear.",
  },
  {
    id: "review-5",
    name: "Sample Reviewer 5",
    initials: "SR",
    date: "4 months ago",
    rating: 5,
    text: "Sample review text — replace with a real Google review. Application support helped us settle on a method that suits our samples.",
  },
  {
    id: "review-6",
    name: "Sample Reviewer 6",
    initials: "SR",
    date: "5 months ago",
    rating: 4,
    text: "Sample review text — replace with a real Google review. Spare parts arrived quickly and the instrument was back in service the same week.",
  },
  {
    id: "review-7",
    name: "Sample Reviewer 7",
    initials: "SR",
    date: "6 months ago",
    rating: 5,
    text: "Sample review text — replace with a real Google review. The engineer explained the preventive maintenance schedule in detail.",
  },
  {
    id: "review-8",
    name: "Sample Reviewer 8",
    initials: "SR",
    date: "8 months ago",
    rating: 5,
    text: "Sample review text — replace with a real Google review. Good coordination from enquiry through to installation at our facility.",
  },
  {
    id: "review-9",
    name: "Sample Reviewer 9",
    initials: "SR",
    date: "10 months ago",
    rating: 4,
    text: "Sample review text — replace with a real Google review. Consistent follow-up and dependable annual service visits.",
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
