export const CHATBOT_CONFIG = {
  brandName: "Inkarp",
  emailSubject: "New website chatbot enquiry",
  mongoCollectionName: "chatEnquiries",
  colors: {
    brandBlue: "#BE0010",
    accent: "#BE0010",
    launcher: "#BE0010",
    launcherText: "#ffffff",
  },
  productOptions: [
    { name: "Hei-VAP Core Rotary Evaporator", slug: "hei-vap-core-rotary-evaporator", brand: "Heidolph" },
    { name: "Hei-VAP Expert Rotary Evaporator", slug: "hei-vap-expert-rotary-evaporator", brand: "Heidolph" },
    { name: "Hei-VAP Ultimate Rotary Evaporator", slug: "hei-vap-ultimate-rotary-evaporator", brand: "Heidolph" },
    { name: "Hei-VAP Industrial Rotary Evaporator", slug: "hei-vap-industrial-rotary-evaporator", brand: "Heidolph" },
    { name: "Hei-VAP Industrial Basic Rotary Evaporator", slug: "hei-vap-industrial-basic-rotary-evaporator", brand: "Heidolph" },
    { name: "Large Scale Hei-VOLUME Distimatic Pro", slug: "large-scale-hei-volume-distimatic-pro", brand: "Heidolph" },
    { name: "Hei-Mix S Magnetic Stirrer", slug: "hei-mix-s-magnetic-stirrer", brand: "Heidolph" },
    { name: "Hei-Plate Mix 20 L Magnetic Stirrer", slug: "hei-plate-mix-20-l-magnetic-stirrer", brand: "Heidolph" },
    { name: "Hei-Plate Mix 'n' Heat Core Magnetic Stirrer", slug: "hei-plate-mix-n-heat-core-magnetic-stirrer", brand: "Heidolph" },
  ],
  crossSellProductMap: {
    "hei-vap-core-rotary-evaporator": [
      "Hei-VAP Expert Rotary Evaporator",
      "Hei-VAP Ultimate Rotary Evaporator",
    ],
    "hei-vap-industrial-rotary-evaporator": [
      "Hei-VAP Industrial Basic Rotary Evaporator",
      "Large Scale Hei-VOLUME Distimatic Pro",
    ],
    "hei-mix-s-magnetic-stirrer": [
      "Hei-Plate Mix 20 L Magnetic Stirrer",
      "Hei-Plate Mix 'n' Heat Core Magnetic Stirrer",
    ],
    "hei-plate-mix-20-l-magnetic-stirrer": [
      "Hei-Mix S Magnetic Stirrer",
      "Hei-Plate Mix 'n' Heat Core Magnetic Stirrer",
    ],
  },
};

export const CHATBOT_ENQUIRY_TYPES = [
  { category: "Product", label: "Product Enquiry", blurb: "Ask about specs, pricing, or availability" },
  { category: "Service", label: "Service Request", blurb: "Installation, breakdown, AMC, or calibration" },
  { category: "Quote", label: "Request a Quote", blurb: "Get a formal quotation for your order" },
  { category: "Talk to expert", label: "Talk to Expert", blurb: "Have our team call you back" },
];

export const CHATBOT_FIELDS = {
  Product: [
    { name: "productName", label: "Product / instrument", type: "text", required: true },
    { name: "name", label: "Name", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "contact", label: "Contact", type: "tel", required: true },
    { name: "industry", label: "Industry", type: "text", required: true },
    { name: "designation", label: "Designation", type: "text", required: true },
    { name: "country", label: "Country", type: "text", required: true },
    { name: "state", label: "State", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "gst", label: "GST", type: "text", required: true },
  ],
  Service: [
    { name: "customerName", label: "Customer Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "contact", label: "Contact", type: "tel", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "productName", label: "Product Name", type: "text", required: true },
    { name: "modelNumber", label: "Model Number", type: "text", required: true },
    {
      name: "serviceType",
      label: "Service Type",
      type: "select",
      required: true,
      options: ["Installation", "Breakdown", "Preventive maintenance", "Calibration", "AMC", "Other"],
    },
    {
      name: "underWarranty",
      label: "Under Warranty",
      type: "select",
      required: true,
      options: ["Yes", "No", "Not sure"],
    },
    { name: "country", label: "Country", type: "text", required: true },
    { name: "state", label: "State", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "message", label: "Message", type: "textarea", required: true },
  ],
  Quote: [
    { name: "customerName", label: "Customer Name", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "contact", label: "Contact", type: "tel", required: true },
    { name: "gst", label: "GST", type: "text", required: true },
    { name: "country", label: "Country", type: "text", required: true },
    { name: "state", label: "State", type: "text", required: true },
    { name: "billingAddress", label: "Billing Address", type: "textarea", required: true },
    { name: "shippingAddress", label: "Shipping Address", type: "textarea", required: true },
  ],
  "Talk to expert": [
    { name: "customerName", label: "Customer Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "contact", label: "Contact", type: "tel", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "enquiredProduct", label: "Enquired Product", type: "text", required: true },
    { name: "country", label: "Country", type: "text", required: true },
    { name: "state", label: "State", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "message", label: "Message", type: "textarea", required: true },
  ],
};
export const CHATBOT_WORKFLOW_QUESTIONS = [
  {
    id: "workflowGoal",
    question: "Which laboratory workflow are you trying to improve?",
    options: [
      { label: "Solvent evaporation or recovery", scoreKey: "evaporation" },
      { label: "Large-volume or pilot-scale distillation", scoreKey: "industrialEvaporation" },
      { label: "Magnetic stirring or heated mixing", scoreKey: "stirring" },
      { label: "Unattended continuous distillation", scoreKey: "automation" },
    ],
  },
  {
    id: "sampleCondition",
    question: "What matters most for your sample or process?",
    options: [
      { label: "Precise solvent recovery and condensation", scoreKey: "evaporation" },
      { label: "Higher batch capacity and safety visibility", scoreKey: "industrialEvaporation" },
      { label: "Gentle mixing, heating, or thermolabile handling", scoreKey: "stirring" },
      { label: "Reducing manual refill and collection time", scoreKey: "automation" },
    ],
  },
  {
    id: "scaleNeed",
    question: "What scale or operating style do you need?",
    options: [
      { label: "Benchtop R&D or QC workflow", scoreKey: "evaporation" },
      { label: "20 L flask or large-volume workflow", scoreKey: "industrialEvaporation" },
      { label: "Routine bench stirring up to 20 L", scoreKey: "stirring" },
      { label: "Overnight or weekend unattended runs", scoreKey: "automation" },
    ],
  },
];

export const CHATBOT_WORKFLOW_RESULTS = {
  evaporation: {
    title: "Rotary evaporators",
    productName: "Hei-VAP Expert Rotary Evaporator",
    productSlug: "hei-vap-expert-rotary-evaporator",
    href: "/products/hei-vap-expert-rotary-evaporator",
  },
  industrialEvaporation: {
    title: "Large scale evaporation",
    productName: "Hei-VAP Industrial Rotary Evaporator",
    productSlug: "hei-vap-industrial-rotary-evaporator",
    href: "/products/hei-vap-industrial-rotary-evaporator",
  },
  stirring: {
    title: "Magnetic stirrers",
    productName: "Hei-Plate Mix 20 L Magnetic Stirrer",
    productSlug: "hei-plate-mix-20-l-magnetic-stirrer",
    href: "/products/hei-plate-mix-20-l-magnetic-stirrer",
  },
  automation: {
    title: "Automation modules",
    productName: "Large Scale Hei-VOLUME Distimatic Pro",
    productSlug: "large-scale-hei-volume-distimatic-pro",
    href: "/products/large-scale-hei-volume-distimatic-pro",
  },
};
