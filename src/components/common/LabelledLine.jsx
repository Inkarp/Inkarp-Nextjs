const LEADING_LABEL = /^([A-Za-z][A-Za-z0-9 /.()&-]{1,40}):\s/;

/**
 * Renders "Label: rest of the text" with the label bolded — used on the legal
 * pages for lines like "Address:", "GST Number:", "Email:". Falls back to
 * plain text when there's no leading "Label:" to bold, so it's safe to wrap
 * every line with this rather than only the ones known to match.
 */
export default function LabelledLine({ text }) {
  const match = LEADING_LABEL.exec(text);
  if (!match) return text;

  const rest = text.slice(match[0].length);

  return (
    <>
      <strong>{match[1]}:</strong> {rest}
    </>
  );
}
