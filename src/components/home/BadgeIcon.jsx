const icons = [
  // years in business — clock
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
  </>,
  // branch offices — map pin
  <>
    <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </>,
  // principal brands — id card
  <>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M9 21v-4h6v4M9 7h.01M9 11h.01M15 7h.01M15 11h.01" strokeLinecap="round" />
  </>,
  // core markets — target
  <>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r=".5" fill="currentColor" />
  </>,
];

export default function BadgeIcon({ index, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      {icons[index % icons.length]}
    </svg>
  );
}
