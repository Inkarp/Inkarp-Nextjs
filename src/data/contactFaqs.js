import { branches } from "@/data/branches";
import { directoryEntry, SERVICE_DESK } from "@/data/contactDirectory";

const importDesk = directoryEntry("import");
const accounts = directoryEntry("accounts");
const hr = directoryEntry("hr");

// FAQ on /contact, also emitted as FAQPage structured data. Answers are
// plain text (that's what the schema needs); `link` renders after the answer.
export const CONTACT_FAQS = [
  {
    question: "How do I get one quotation for several products?",
    answer:
      "Add each product to your Quote List from its product page, then open the Quote page and send the whole list as one request. You can also choose \"Sales & quotes\" in the form above and list the products in your message.",
    link: { href: "/quote", label: "Open your Quote List" },
  },
  {
    question: "How do I book a service visit or an AMC?",
    answer: `Use the service request form on our Service page, with the instrument name and serial number to hand. For an urgent breakdown, call the service desk on +91 ${SERVICE_DESK.phone}.`,
    link: { href: "/service#service-request", label: "Go to the service request form" },
  },
  {
    question: "Can I see a demo before I buy?",
    answer:
      "Yes. Choose \"Demo & applications\" in the form above, tell us the product and what you want to run on it, and our team will get in touch to plan the demo.",
    link: { href: "#contact-form", label: "Request a demo" },
  },
  {
    question: "Which branch covers my city?",
    answer: `Inkarp has ${branches.length} branches across India. Use "Find my nearest branch" in the branch network above, or pick your state in the form, to see the nearest one and its numbers. Inkarp covers all major cities and institutes across India; if your city isn't listed, contact us to confirm availability in your location.`,
    link: { href: "#coverage-network", label: "Find my nearest branch" },
  },
  {
    question: "Where do I send import, customs or invoice queries?",
    answer: `Import, logistics and customs queries go to ${importDesk.email} (+91 ${importDesk.phone}). Invoices and payments go to our accounts team at ${accounts.email} (+91 ${accounts.phone}).`,
  },
  {
    question: "How do I apply for a job at Inkarp?",
    answer: `See current openings and apply on our Careers page. For other HR queries, write to ${hr.email}.`,
    link: { href: "/careers", label: "View careers" },
  },
];
