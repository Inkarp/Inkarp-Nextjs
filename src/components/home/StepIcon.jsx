const STEP_ICON_PATHS = [
  <path key="0" d="M9.5 3h5M10.5 3v14a1.5 1.5 0 0 0 3 0V3M10.5 12h3" />,
  <path key="1" d="M12 4c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z" />,
  <path key="2" d="M5 5h14l-5.5 6.5V19l-3-1.5v-6L5 5z" />,
  <path key="3" d="M10 3h4M11 3v6l-4.3 7.4A2 2 0 0 0 8.4 19.5h7.2a2 2 0 0 0 1.7-3.1L13 9V3" />,
  <path key="4" d="M3 12h3l2.5-6 4 12 2.5-6H21" />,
  <path key="5" d="M5 20v-8M12 20V5M19 20v-6" />,
  <g key="6">
    <circle cx="10.5" cy="10.5" r="5.5" />
    <path d="M14.8 14.8 20 20" />
  </g>,
  <g key="7">
    <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" />
    <path d="M9 11.5l2 2 4-4" />
  </g>,
];

export default function StepIcon({ index, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {STEP_ICON_PATHS[index % STEP_ICON_PATHS.length]}
    </svg>
  );
}
