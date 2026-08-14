const ORIGINAL_LOGO = "/InkarpLogo.svg";
const INDEPENDENCE_DAY_LOGO = "/assets/Inkarp_logo%20animation.gif";
const INDEPENDENCE_DAY_LOGO_END = new Date("2026-08-17T00:00:00+05:30");

function getActiveCompanyLogo() {
  return new Date() < INDEPENDENCE_DAY_LOGO_END
    ? INDEPENDENCE_DAY_LOGO
    : ORIGINAL_LOGO;
}

export const siteConfig = {
  company: {
    name: "Inkarp",
    tagline: "Scientific and analytical instrumentation solutions",
    description:
      "Inkarp Instruments Pvt Ltd partners with leading global brands to deliver laboratory equipment, analytical instruments, consumables, and application support across India.",
    logo: getActiveCompanyLogo(),
    originalLogo: ORIGINAL_LOGO,
    independenceDayLogo: INDEPENDENCE_DAY_LOGO,
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
          href: "/awards",
        },
      ],
    },
    {
      label: "Products",
      href: "/products",
    },
    {
      label: "Workflows",
      href: "/workflows",
    },
    {
      label: "Service",
      href: "/service",
    },
    {
      label: "CATALYSTCue",
      href: "",
      logo: "/CatalystNew.svg",
      children: [
        {
          label: "CATALYSTCue",
          href: "/magazine",
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
          href: "/blog",
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
      href: "/contact",
    },
  ],
  contact: {
    phone: "+91 8125580808",
    email: "info@inkarp.co.in",
    address: "Plot No - 5A/10-11 3rd Floor, IDA Nacharam Road, 1, Chilka Nagar Main Rd, Nacharam, Hyderabad, Telangana 500076",
    addressNav: "Hyderabad, Telangana 500076",
  },
  socials: {
    linkedin: "https://www.linkedin.com/company/inkarp",
    facebook: "https://www.facebook.com/inkarp",
    instagram: "https://www.instagram.com/inkarpinstruments/",
    youtube: "https://www.youtube.com/@InkarpInstrument",
  },

  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5601922545243!2d78.55536867462791!3d17.432881801493995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb993f40000001%3A0x534548d1d6e2d4bd!2sInkarp%20Instruments%20Private%20Limited!5e0!3m2!1sen!2sin!4v1782193121677!5m2!1sen!2sin",

  // Google Business Profile (opens the listing with reviews). Official share
  // link for the Inkarp listing — used by the "See us on Google" button.
  googleBusinessUrl: "https://share.google/Tz1IBsgK9XGpqlsGz",

  // Direct Google Maps link to the same listing (cid 6000282144631608509),
  // matching mapEmbedUrl above. Used by the footer map tile and address.
  mapPlaceUrl:
    "https://www.google.com/maps?ll=17.432877,78.557944&z=16&t=m&hl=en&gl=IN&mapclient=embed&cid=6000282144631608509",
};
