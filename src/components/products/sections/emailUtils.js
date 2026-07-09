export const INKARP_EMAIL = 'info@inkarp.co.in';

function padEnd(value, width) {
  return String(value).padEnd(width, ' ');
}

// Renders Page + Section + the given rows as one aligned plain-text table,
// since mailto: bodies can't carry real HTML/markdown tables.
export function buildTableEmailBody({ productName, sectionName, intro, rows, note }) {
  const tableRows = [
    { label: 'Page', value: typeof window !== 'undefined' ? window.location.href : '' },
    { label: 'Section', value: sectionName ?? '' },
    ...rows,
  ];

  const labelWidth = Math.max(5, ...tableRows.map((row) => String(row.label).length));
  const valueWidth = Math.max(5, ...tableRows.map((row) => String(row.value).length));
  const divider = `${'-'.repeat(labelWidth)}-|-${'-'.repeat(valueWidth)}`;

  return [
    productName,
    intro ? '' : null,
    intro,
    '',
    `${padEnd('Field', labelWidth)} | Value`,
    divider,
    ...tableRows.map((row) => `${padEnd(row.label, labelWidth)} | ${row.value}`),
    '',
    note,
  ].filter((line) => line !== null && line !== undefined).join('\n');
}

export function openMailto({ subject, body }) {
  window.location.href = `mailto:${INKARP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
