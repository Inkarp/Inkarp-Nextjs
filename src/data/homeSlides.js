export const homeBannerConfig = {
  autoSlideDelay: 5000,
  videoEndDelay: 1600,
  linkedin: {
    label: "Follow Us",
    href: "https://www.linkedin.com/company/inkarp-instruments/",
  },
  search: {
    label: "Search for Products",
    badge: "NEW",
  },
  watchMore: {
    label: "Watch More",
    href: "https://www.youtube.com/@InkarpInstrument/videos",
    slideIndex: 0,
  },
};

export const heroSlides = [
  {
    id: "sbt-collaboration",
    title: "",
    subtitle: "",
    media: {
      type: "video",
      src: "/assets/home/SBT_Collab_Video.mp4",
      poster: "/assets/home/CatalystTeamInkarp.webp",
      alt: "SBT Instruments collaboration video",
    },
  },
  {
    id: "catalyst-2026",
    title: "Catalyst 2026",
    subtitle: "Inkarp Team",
    href: "/application-resources",
    media: {
      type: "image",
      src: "/assets/home/CatalystTeamInkarp.webp",
      alt: "Inkarp Catalyst 2026 team",
      sizes: "98vw",
    },
  },
  {
    id: "hitachi-nexta-dsc",
    title: "Click Here to Know More",
    subtitle: "",
    href: "/products/dsc-differential-scanning-calorimeters",
    media: {
      type: "image",
      src: "/assets/home/BannerHitachi.jpg",
      alt: "Hitachi NEXTA DSC banner",
      sizes: "98vw",
    },
  },
  {
    id: "rotachrom-intro",
    title: "",
    subtitle: "",
    media: {
      type: "video",
      src: "/assets/home/RC-intro.webm",
      poster: "/assets/home/BannerHitachi.jpg",
      alt: "RotaChrom introduction video",
    },
  },
];
