import { siteConfig } from "@/data/siteConfig";

// Central service desk, shown on /service beside the service request form.
export const SERVICE_DESK = {
  email: "service@inkarp.co.in",
  phone: "7330731315",
};

// Department contacts for /contact. The "Who should I contact?" cards, the
// contact form's direct-line hints, the FAQ and the page's structured data
// all read from here, so a changed number only needs changing once.
// Phones are stored without +91. `primary` cards render wider.
export const contactDirectory = [
  {
    id: "sales",
    title: "Sales & Quotations",
    summary: "Prices, quotations, demos and help choosing the right instrument.",
    // No separate sales desk is published, so this is the main enquiry line
    // (also the WhatsApp number).
    email: siteConfig.contact.email,
    phone: siteConfig.contact.phone.replace(/^\+91\s*/, ""),
    whatsapp: true,
    primary: true,
  },
  {
    id: "service",
    title: "Service & AMC",
    summary: "Installation, breakdowns, AMC, calibration and spares.",
    email: SERVICE_DESK.email,
    phone: SERVICE_DESK.phone,
    link: { href: "/service#service-request", label: "Service request form" },
    primary: true,
  },
  {
    id: "import",
    title: "Import, Logistics & Customs",
    summary: "Shipments, customs clearance and import paperwork.",
    email: "saritha@inkarp.co.in",
    phone: "9949018605",
  },
  {
    id: "accounts",
    title: "Accounts & Finance",
    summary: "Invoices, payments and account statements.",
    email: "sundar@inkarp.co.in",
    phone: "7032221890",
  },
  {
    id: "hr",
    title: "HR",
    summary: "Job applications and other HR queries.",
    email: "hrd@inkarp.co.in",
    phone: "8886277717",
    link: { href: "/careers", label: "See open roles" },
  },
];

export function directoryEntry(id) {
  return contactDirectory.find((entry) => entry.id === id);
}

// "What do you need help with?" choices on the contact form. The chosen label
// is sent as `inquiryType`, so it reads as-is in the notification email.
// `directoryId` points the form at that team's direct line.
export const ENQUIRY_DEPARTMENTS = [
  { label: "Sales & quotes" },
  { label: "Demo & applications" },
  { label: "Service & AMC" },
  { label: "Spares & consumables" },
  { label: "Import & logistics", directoryId: "import" },
  { label: "Accounts & finance", directoryId: "accounts" },
  { label: "HR & careers", directoryId: "hr" },
  { label: "Something else" },
];

export const QUOTE_DEPARTMENT = "Sales & quotes";
export const SERVICE_DEPARTMENT = "Service & AMC";
export const HR_DEPARTMENT = "HR & careers";
