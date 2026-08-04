// Maps the free-text `countryOfOrigin` values used across product data to
// ISO 3166-1 alpha-2 codes, for use with country-flag-icons. A value maps to
// more than one code when a product credits multiple countries of origin.
const COUNTRY_NAME_TO_ISO_CODES = {
  Canada: ["CA"],
  "Czech Republic": ["CZ"],
  Denmark: ["DK"],
  France: ["FR"],
  Germany: ["DE"],
  Hungary: ["HU"],
  India: ["IN"],
  Italy: ["IT"],
  Japan: ["JP"],
  "South Korea": ["KR"],
  Spain: ["ES"],
  Switzerland: ["CH"],
  "United Kingdom": ["GB"],
  "United States of America": ["US"],
  "United States of America & France": ["US", "FR"],
};

export function getCountryFlagCodes(countryOfOrigin) {
  if (!countryOfOrigin) return [];
  return COUNTRY_NAME_TO_ISO_CODES[countryOfOrigin] ?? [];
}
