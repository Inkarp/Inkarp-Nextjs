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
};

export default function WorkflowIcon({ cat, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      {paths[cat]}
    </svg>
  );
}
