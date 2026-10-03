// Department contacts for /contact. The "For Support & Enquiries" cards, the
// contact form's direct-line hints and the page's structured data all read
// from here, so a changed number only needs changing once.
export const contactDirectory = [
  {
    id: "import",
    title: "Import / Logistics / Customs\nRelated Enquiries",
    email: "saritha@inkarp.co.in",
    phone: "9949018605",
  },
  {
    id: "accounts",
    title: "Accounts / Finance Enquiries",
    email: "sundar@inkarp.co.in",
    phone: "7032221890",
  },
  {
    id: "hr",
    title: "HR Enquiries",
    email: "hrd@inkarp.co.in",
    phone: "8886277717",
  },
];

// Central service desk, shown on /service beside the service request form.
export const SERVICE_DESK = {
  email: "service@inkarp.co.in",
  phone: "7330731315",
};

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
