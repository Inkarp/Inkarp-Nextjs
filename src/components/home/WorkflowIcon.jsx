const paths = {
  pharma: <path d="M9 2h6M10 2v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3.5L14 8V2" />,
  biotech: (
    <>
      <path d="M7 3c0 6 10 6 10 12M17 3c0 6-10 6-10 12" strokeLinecap="round" />
      <path d="M8 7h8M8 17h8" strokeLinecap="round" />
    </>
  ),
  rnd: (
    <>
      <path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 3h8" strokeLinecap="round" />
    </>
  ),
  food: <path d="M6 3v8a3 3 0 0 0 6 0V3M9 11v10M17 3c-2 0-3 2-3 4s1 4 3 4 3-2 3-4-1-4-3-4zM17 11v10" strokeLinecap="round" strokeLinejoin="round" />,
  environmental: <path d="M12 2s7 8.5 7 13a7 7 0 0 1-14 0c0-4.5 7-13 7-13z" strokeLinecap="round" strokeLinejoin="round" />,
  chemical: (
    <>
      <circle cx="12" cy="6" r="2" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="17" r="2" />
      <path d="M12 8v3M10.5 12.5 8 15.3M13.5 12.5 16 15.3" strokeLinecap="round" />
    </>
  ),
  academic: (
    <>
      <path d="M12 3 2 8l10 5 10-5-10-5z" strokeLinejoin="round" />
      <path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  materials: (
    <>
      <path d="M12 2 3 7l9 5 9-5-9-5z" strokeLinejoin="round" />
      <path d="M3 12l9 5 9-5M3 17l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  clinical: <path d="M4 12h4l2-5 4 10 2-5h4" strokeLinecap="round" strokeLinejoin="round" />,
};

export default function WorkflowIcon({ cat, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      {paths[cat]}
    </svg>
  );
}
