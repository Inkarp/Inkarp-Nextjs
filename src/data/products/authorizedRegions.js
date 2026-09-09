// Maps principal slug -> the region Inkarp is authorized to distribute/service in,
// sourced from the master workbook's "Authorized For (India, North India, Telangana etc)" column.
// Principals not listed here default to "India" (Pan India coverage).
export const DEFAULT_AUTHORIZED_REGION = "India";

export const principalAuthorizedRegions = {
  "ametek-brookfield": "North India",
  zeiss: "Andhra Pradesh, Telangana & Tamil Nadu",
  jeiotech: "South India",
};

export function getAuthorizedRegion(principalSlug) {
  return principalAuthorizedRegions[principalSlug] ?? DEFAULT_AUTHORIZED_REGION;
}
