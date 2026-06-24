export const categories = [
  "All",
  "Application Notes",
  "Industry Insights",
  "Product Updates",
  "Company News",
];

export const posts = [
  {
    id: 1,
    title: "Why Early Process Understanding Reduces Scale-Up Risk",
    category: "Industry Insights",
    excerpt:
      "Manufacturing challenges often begin as process questions. Here's how smart scale-down models and lab automation help teams catch issues before they reach the plant floor.",
    image: "/assets/images/productImages/Banner/Banner1.jpg",
    author: "Inkarp Applications Team",
    date: "2026-05-18",
    readTime: "5 min read",
    paragraphs: [
      "Understanding process behavior early can help teams reduce uncertainty, improve decision-making, and strengthen process robustness before scale-up.",
      "Laboratory automation and smart scale-down models support process development teams in investigating conditions, evaluating performance, and generating more reliable process knowledge — long before a batch ever reaches manufacturing scale.",
      "Automation-driven workflows accelerate process studies, while data-driven experimentation improves consistency and data quality across development and manufacturing environments.",
    ],
  },
  {
    id: 2,
    title: "MALS vs Mass Spec: Choosing the Right Detector for Peptide Analysis",
    category: "Application Notes",
    excerpt:
      "Detector choice plays a critical role in analytical outcomes for GLP-1RA and peptide therapeutics. We break down when to reach for MALS and when MS wins out.",
    image: "/assets/images/productImages/Banner/Banner2.jpg",
    author: "Inkarp Applications Team",
    date: "2026-05-02",
    readTime: "6 min read",
    paragraphs: [
      "Whether the goal is molecular weight determination, aggregation assessment, impurity identification, or structural characterization, detector choice plays a critical role in analytical outcomes.",
      "Multi-Angle Light Scattering (MALS) and Mass Spectrometry (MS) address different analytical challenges, and each contributes uniquely to peptide and GLP-1RA therapeutic understanding.",
      "Practical detector selection improves analytical workflow confidence and supports stronger biopharmaceutical characterization across QC and method development laboratories.",
    ],
  },
  {
    id: 3,
    title: "Inkarp Expands Service Network Across South India",
    category: "Company News",
    excerpt:
      "New regional service hubs mean faster response times and reduced instrument downtime for customers across Karnataka, Tamil Nadu, and Telangana.",
    image: "/assets/our-story/InkarpBuilding.jpg",
    author: "Inkarp Team",
    date: "2026-04-20",
    readTime: "3 min read",
    paragraphs: [
      "As our customer base across South India continues to grow, we've expanded our field service capacity to keep response times short and instrument uptime high.",
      "New service engineers have been onboarded and trained directly with our principal manufacturers, ensuring the same quality of support customers expect from our Hyderabad headquarters.",
      "This expansion is part of a broader commitment to being a true long-term partner — not just a supplier — for laboratories across the region.",
    ],
  },
  {
    id: 4,
    title: "Achieving Accurate BOD Results: Common Pitfalls and Fixes",
    category: "Application Notes",
    excerpt:
      "Sample handling, dissolved oxygen measurement, and incubation conditions all influence BOD accuracy. Here's what we've learned from hundreds of customer queries.",
    image: "/assets/images/productImages/Banner/Banner3.jpg",
    author: "Inkarp Applications Team",
    date: "2026-04-05",
    readTime: "4 min read",
    paragraphs: [
      "Biochemical Oxygen Demand (BOD) testing plays a critical role in assessing water quality and supporting environmental compliance.",
      "Achieving accurate and reliable results requires careful control of factors such as sample handling, dissolved oxygen measurement, incubation conditions, and testing methodology.",
      "Better testing practices support consistent, defensible water quality data — and help compliance and water quality laboratories reduce uncertainty in their results.",
    ],
  },
  {
    id: 5,
    title: "What's New in Lab Automation: A Look at DIGIBAT",
    category: "Product Updates",
    excerpt:
      "Inside the UK's first fully automated energy research facility, and what it means for battery and clean-energy discovery workflows.",
    image: "/assets/images/productImages/Banner/ProductBanner.jpg",
    author: "Inkarp Applications Team",
    date: "2026-03-22",
    readTime: "5 min read",
    paragraphs: [
      "What if battery and clean-energy discovery could move from manual experiments to fully automated, AI-ready workflows?",
      "DIGIBAT, the UK's first fully automated energy research facility at Imperial College London, shows how robotics, high-throughput experimentation, and structured data are transforming battery and Power-to-X research.",
      "The connected workflow spans materials synthesis, electrode preparation, glovebox coin-cell assembly, electrocatalysis, and electrochemical testing — turning manual protocols into scalable, AI-ready laboratory workflows.",
    ],
  },
];

export function getPostsByCategory(category) {
  if (!category || category === "All") {
    return posts;
  }
  return posts.filter((post) => post.category === category);
}

export function getFeaturedPost() {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}

export function formatPostDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
