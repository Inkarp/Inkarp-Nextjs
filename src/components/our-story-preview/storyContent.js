// Everything the Our Story previews show. Text is copied word for word from the
// live page's components (src/app/(site)/our-story + src/components/about) and
// the site's own facts (contact page, awards page, branches). The names on the
// road come from the history collage (public/assets/our-story/evolution/
// OldImagesCollage.webp). Nothing here is new copy.
import { branches } from "@/data/branches";

export const HERO = {
  eyebrow: "About Us",
  title: "Four decades of scientific partnerships, built on service and trust.",
  lede: "From a focused instrumentation company to a pan-India scientific solutions partner, Inkarp has grown by staying close to researchers, laboratories, and global principals who expect reliability at every step.",
  image: "/assets/our-story/InkarpBuilding.jpg",
  imageAlt: "Inkarp building",
};

// Same three figures as the contact page hero.
export const FACTS = [
  { value: 1985, label: "Serving labs since", year: true },
  { value: 45, suffix: "+", label: "Global principals" },
  { value: branches.length, label: "Branches in India" },
];

export const COLLAGE = {
  image: "/assets/our-story/evolution/OldImagesCollage.webp",
  alt: "Inkarp through the years: team photos and the road from INCORP in 1985 to inkarp in 2009",
};

// The road at the foot of the history collage.
export const NAMES = [
  { year: 1985, name: "INCORP" },
  { year: 1991, name: "Incorp" },
  { year: 2002, name: "Spincorp" },
  { year: 2004, name: "inkarp" },
  { year: 2009, name: "inkarp" },
];

// The awards page timeline.
export const RECOGNITIONS = [
  {
    year: 2013,
    title: "Heidolph Premium Distributor",
    images: [
      "/assets/awards/award-2013-heidolph-premium-distributor-a.png",
      "/assets/awards/award-2013-heidolph-premium-distributor-b.png",
      "/assets/awards/award-2013-heidolph-premium-distributor-c.png",
    ],
  },
  { year: 2016, title: "Heidolph Premium Distributor", images: ["/assets/awards/award-2016-heidolph-premium-distributor.png"] },
  { year: 2022, title: "Jeio Tech Plaque of Appreciation", images: ["/assets/awards/award-2022-jeiotech-plaque-of-appreciation.png"] },
  { year: 2023, title: "Exceptional International Distributor", images: ["/assets/awards/award-2023-exceptional-international-distributor.png"] },
];

export const PURPOSE = {
  eyebrow: "Who Are We",
  title: "Our Purpose & Principles",
  description:
    "With over four decades of experience, we partner with global leaders to empower research, diagnostics, and industry through reliable, precise instrumentation and personalized support.",
  pillars: [
    {
      key: "mission",
      title: "Our Mission",
      body: "To empower scientific progress across India by delivering cutting-edge instruments, responsive support, and trusted expertise in every partnership.",
    },
    {
      key: "vision",
      title: "Our Vision",
      body: "To be India's most trusted and innovative scientific solutions partner, enabling discovery, development, and diagnostics with excellence and integrity.",
    },
    {
      key: "values",
      title: "Our Core Values",
      body: "Integrity, innovation, and customer-first thinking guide everything we do, building trust and delivering long-term impact across the scientific community.",
    },
  ],
};

export const CHAPTERS = {
  eyebrow: "Inkarp Bio",
  title: "How We Have Grown",
  description:
    "Four decades changed what a laboratory needs from a partner. Follow how Inkarp moved from supplying core instruments to supporting complete, data-ready workflows.",
  items: [
    {
      key: "evolution",
      label: "Our Evolution",
      heading: "From Core Instruments to Integrated, Data-Ready Platforms",
      body: "Across decades, we expanded capabilities, instrumentation, and data systems to serve complex clinical and R&D needs with speed, traceability, and scalability.",
      img: "/assets/our-story/InkarpBuilding.jpg",
    },
    {
      key: "history",
      label: "Our History",
      heading: "Four Decades of Growth & Strategic Acquisitions",
      body: "As an industry leader, we are relentless in advancing the science of wellness and working with laboratory partners to uphold high standards of accuracy and reliability.",
      img: "/assets/our-story/evolution/OldImagesCollage.webp",
    },
    {
      key: "philosophy",
      label: "Our Philosophy",
      heading: "Science-First. Customer-Centric. Quality-Driven.",
      body: "We invest in people, training, and technology to ensure every solution is accurate, actionable, and delivered with care for the communities we serve.",
      img: "/assets/our-story/evolution/Philosophy.webp",
    },
    {
      key: "quality",
      label: "Commitment To Quality",
      heading: "Validated Processes. Reliable Results. Global Standards.",
      body: "From sample integrity to result reporting, our processes are validated, audited, and continuously improved to exceed regulatory and customer expectations.",
      img: "/assets/our-story/evolution/Commitment.webp",
    },
  ],
};

export const CLIENTS = {
  eyebrow: "Our Clients",
  title: "Trusted by Industry Leaders",
  logos: [
    ["Alembic.png", "Alembic"],
    ["Aragen.png", "Aragen"],
    ["Aurobindo.png", "Aurobindo"],
    ["Basf.png", "BASF"],
    ["Biocon.png", "Biocon"],
    ["Divis.png", "Divis"],
    ["Eisai.png", "Eisai"],
    ["Gland.png", "Gland"],
    ["Granuals.png", "Granules"],
    ["GVK.png", "GVK"],
    ["Hikal.png", "Hikal"],
    ["Macleods.png", "Macleods"],
    ["Mylan.png", "Mylan"],
    ["Natco.png", "Natco"],
    ["Pi.png", "PI Industries"],
    ["Reddy.png", "Dr. Reddy's"],
    ["Sai.png", "Sai Life Sciences"],
    ["Srigene.png", "Srigene"],
    ["Syngene.png", "Syngene"],
    ["Syngenta.png", "Syngenta"],
    ["Tcg.png", "TCG"],
  ].map(([file, alt]) => ({ alt, src: `/assets/our-story/clients/${file}` })),
};

export const LEADERS = {
  eyebrow: "Meet Our Leadership",
  title: "Built by people who chose trust first",
  description: "The company story begins with leaders who shaped Inkarp around integrity, relationships, and a service mindset.",
  people: [
    {
      image: "/assets/our-story/team/BaluFullImage.jpg",
      // The person stands on this side of the wide photo.
      side: "left",
      quote:
        "When I started this journey, I knew it was not enough to build a company. We had to build trust, values, and people who could carry them forward. Every milestone we reached came from holding firm to integrity, nurturing relationships, and believing that lasting success belongs to everyone together.",
      author: "S. Balu",
      role: "Chairman",
      link: "https://www.linkedin.com/in/balu-s-9b870b26/",
    },
    {
      image: "/assets/our-story/team/NateshFullImage.jpg",
      side: "right",
      quote:
        "I was entrusted with a vision built on strong values. My responsibility has been to shape it into a company that could endure, expand, and deliver greater impact. Growth has meaning only when it strengthens the foundation, empowers every department, and keeps us relentlessly focused on serving customers better.",
      author: "K. Natesh",
      role: "Managing Director",
      link: "https://www.linkedin.com/in/natesh-krishnamurthy-75054518/",
    },
  ],
};

export const DIRECTORS = {
  eyebrow: "Our Directors",
  title: "Regional leaders with one standard of support",
  description: "Meet the people steering operations, service, and growth across every region we serve.",
  people: [
    {
      name: "K. Sreedhar",
      title: "Director (South & East)",
      img: "/assets/our-story/team/Sreedar.jpeg",
      message:
        "Over the years I have seen how trust shapes lasting partnerships. My effort has always been to listen carefully, guide customers toward the right solutions, and support teams in doing the same. Experience has taught me that consistency and commitment are what truly sustain growth for both people and the company.",
      link: "https://www.linkedin.com/in/koora-sreedhar-06934019/",
    },
    {
      name: "M. Madhusudhan",
      title: "Director (North)",
      img: "/assets/our-story/team/Madhusudhan.jpeg",
      message:
        "My approach has always been rooted in science. Understanding the details, whether in chromatography or instrumentation, helps me guide customers toward solutions that genuinely work. Sales, to me, is not persuasion but problem solving. Every interaction is about applying knowledge with sincerity so researchers can move forward with confidence.",
      link: "https://www.linkedin.com/in/madhusudhan-mohan-04219329/",
    },
    {
      name: "M. S. Reddy",
      title: "Director (West)",
      img: "/assets/our-story/team/MsReddy.jpg",
      message:
        "I have always believed that the real value of sales lies in enabling progress for our customers. By introducing solutions that simplify research and strengthen outcomes, my focus has been to build trust step by step. Innovation matters, but what matters more is delivering it with honesty and consistency.",
      link: "https://www.linkedin.com/in/m-srinivasa-reddy-8874731/",
    },
    {
      name: "N. Saravanan",
      title: "Chief Operating Officer (All India)",
      img: "/assets/our-story/team/Saravanan.jpeg",
      message:
        "Service is where promises meet reality. My focus has always been on making sure every instrument we deliver continues to perform and every customer feels supported long after a sale is made. Reliability in service is not optional, it is the foundation on which lasting relationships are built.",
      link: "https://www.linkedin.com/in/saravanan-natarajan-027a2744/",
    },
  ],
};

// Head office first, then the other branches in the order the site lists them.
export const HEAD_OFFICE = "Hyderabad";
export const BRANCHES = [...branches]
  .sort((a, b) => (a.name === HEAD_OFFICE ? -1 : b.name === HEAD_OFFICE ? 1 : 0))
  .map(({ name, coords }) => ({ name, coords, headOffice: name === HEAD_OFFICE }));
