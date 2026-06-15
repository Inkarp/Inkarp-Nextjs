export const siteConfig = {
  company: {
    name: "Inkarp",
    tagline: "Scientific and analytical instrumentation solutions",
    description:
      "Inkarp Instruments Pvt Ltd partners with leading global brands to deliver laboratory equipment, analytical instruments, consumables, and application support across India.",
    logo: "/InkarpLogo.svg",
  },
  navigation: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About Us",
      href: "",
      children: [
        {
          label: "Our Story",
          href: "/our-story",
        },
        {
          label: "Awards and Recognitions",
          href: "/awards-and-recognitions",
        },
      ],
    },
    {
      label: "Products",
      href: "/products",
    },
    {
      label: "CatalystCue",
      href: "",
      logo: "/CatalystNew.svg",
      children: [
        {
          label: "Magazines",
          href: "/catalystcue",
        },
        {
          label: "Application Resources",
          href: "/application-resources",
        },
      ],
    },
    {
      label: "News and Events",
      href: "/news-and-events",
    },
    {
      label: "Careers",
      href: "/careers",
    },
    {
      label: "Contact Us",
      href: "/contact-us",
    },
  ],
  contact: {
    phone: "+91 00000 00000",
    email: "info@inkarp.co.in",
    address: "Hyderabad, Telangana, India",
  },
  socials: {
    linkedin: "https://www.linkedin.com/company/inkarp",
    facebook: "https://www.facebook.com/inkarp",
    instagram: "https://www.instagram.com/inkarp",
    youtube: "https://www.youtube.com/@inkarp",
  },
};
