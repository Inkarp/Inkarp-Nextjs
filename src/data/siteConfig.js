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
      label: "Service",
      href: "/contact-us?interest=service",
    },
    {
      label: "CatalystCue",
      href: "",
      logo: "/CatalystNew.svg",
      children: [
        {
          label: "CatalystCue",
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
      href: "",
       children: [
        {
          label: "Blogs",
          href: "/blogs",
        },
        {
          label: "Events",
          href: "/events",
        },
        
        {
          label: "Webinars",
          href: "/webinars",
        },
    
      ],
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
    phone: "+91 8125580808",
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
