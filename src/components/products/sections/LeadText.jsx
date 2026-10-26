// Shows a line's short leading label in bold, the way the source documents set it:
// "What it's for: stained slides…", "Use Case: …", "Suggested setpoint: …", "ST-50G: 50 L".
// Only a label of up to four words with no comma or sentence punctuation counts, so a
// sentence that merely contains a colon ("Flow-based SPR systems come with a real setup
// cost: …") stays as written. Anything that isn't a string is returned unchanged.
const LEAD = /^([A-Z0-9“"(][^:.!?,]{0,48}?):(\s+)(?=\S)/;

export function leadLabel(text) {
  if (typeof text !== 'string') return null;
  const match = LEAD.exec(text);
  if (!match || match[1].trim().split(/\s+/).length > 4) return null;
  return { label: match[1], gap: match[2], rest: text.slice(match[0].length) };
}

export default function LeadText({ text }) {
  const lead = leadLabel(text);
  if (!lead) return text ?? null;
  return (
    <>
      <strong className="font-semibold">{lead.label}:</strong>
      {lead.gap}
      {lead.rest}
    </>
  );
}
