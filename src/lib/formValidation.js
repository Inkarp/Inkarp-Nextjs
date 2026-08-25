/**
 * Validators shared by the product enquiry form and the /api/forms route, so
 * the browser and the server agree on what a valid submission looks like.
 */

const GSTIN_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GSTIN_SHAPE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function normaliseGstin(value) {
  return String(value ?? "").toUpperCase().replace(/\s+/g, "");
}

/**
 * A GSTIN is 15 characters — 2-digit state code, 10-character PAN, entity
 * number, a literal "Z", then a mod-36 checksum. Shape alone is easy to fake,
 * so the checksum is verified too.
 */
export function isValidGstin(value) {
  const gstin = normaliseGstin(value);
  if (!GSTIN_SHAPE.test(gstin)) return false;

  const stateCode = Number(gstin.slice(0, 2));
  if (stateCode < 1 || stateCode > 38) return false;

  let sum = 0;
  for (let i = 0; i < 14; i += 1) {
    const code = GSTIN_CHARS.indexOf(gstin[i]);
    const product = code * (i % 2 === 0 ? 1 : 2);
    sum += Math.floor(product / 36) + (product % 36);
  }

  return GSTIN_CHARS[(36 - (sum % 36)) % 36] === gstin[14];
}

export function isValidEmail(value) {
  const email = String(value ?? "").trim();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
}

/** Indian mobile number, tolerant of +91, 0, spaces and dashes. */
export function isValidIndianPhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "").replace(/^(91|0)/, "");
  return /^[6-9]\d{9}$/.test(digits);
}

/** Fields the product enquiry form collects, in display order. */
export const PRODUCT_ENQUIRY_FIELDS = [
  "firstName",
  "lastName",
  "designation",
  "department",
  "productName",
  "companyName",
  "gstNumber",
  "industry",
  "state",
  "city",
  "email",
  "contact",
];

/**
 * Validate a product enquiry payload.
 * @returns {Record<string, string>} field key -> message, empty when valid.
 */
export function validateProductEnquiry(values = {}) {
  const errors = {};
  const text = (key) => String(values[key] ?? "").trim();

  const LABELS = {
    firstName: "First name",
    lastName: "Last name",
    designation: "Designation",
    department: "Department",
    productName: "Product name",
    companyName: "Company name",
    gstNumber: "GST number",
    industry: "Industry",
    state: "State",
    city: "City",
    email: "Email",
    contact: "Contact number",
  };

  for (const key of PRODUCT_ENQUIRY_FIELDS) {
    if (!text(key)) errors[key] = `${LABELS[key]} is required.`;
  }

  if (!errors.email && !isValidEmail(text("email"))) {
    errors.email = "Enter a valid email address.";
  }
  if (!errors.contact && !isValidIndianPhone(text("contact"))) {
    errors.contact = "Enter a valid 10-digit Indian mobile number.";
  }
  if (!errors.gstNumber && !isValidGstin(text("gstNumber"))) {
    errors.gstNumber = "Enter a valid 15-character GSTIN (e.g. 27AAPFU0939F1ZV).";
  }

  return errors;
}

/**
 * Buyer details for a multi-product quote request. Same person fields as a
 * single product enquiry, without the product name (the basket carries the
 * items) and without GSTIN — colleges and research institutes often have none,
 * and a mandatory GST field would block them from enquiring at all.
 */
export const QUOTE_REQUEST_FIELDS = [
  "firstName",
  "lastName",
  "designation",
  "department",
  "companyName",
  "industry",
  "state",
  "city",
  "email",
  "contact",
];

const QUOTE_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  designation: "Designation",
  department: "Department",
  companyName: "Company name",
  industry: "Industry",
  state: "State",
  city: "City",
  email: "Email",
  contact: "Contact number",
};

/**
 * Validate a quote-basket payload.
 * @returns {Record<string, string>} field key -> message, empty when valid.
 */
export function validateQuoteRequest(values = {}) {
  const errors = {};
  const text = (key) => String(values[key] ?? "").trim();

  for (const key of QUOTE_REQUEST_FIELDS) {
    if (!text(key)) errors[key] = `${QUOTE_LABELS[key]} is required.`;
  }

  if (!errors.email && !isValidEmail(text("email"))) {
    errors.email = "Enter a valid email address.";
  }
  if (!errors.contact && !isValidIndianPhone(text("contact"))) {
    errors.contact = "Enter a valid 10-digit Indian mobile number.";
  }

  return errors;
}
