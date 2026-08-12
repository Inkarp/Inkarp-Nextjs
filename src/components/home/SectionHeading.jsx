import RecTag from "@/components/home/RecTag";

// Matches the section-header pattern used across the home page sections
// (HomeWorkflowWheel, Companies, HomeClientReviews): a RecTag eyebrow, a
// left-aligned ink heading, then a soft description.
export default function SectionHeading({
  eyebrow,
  title,
  description,
  variant = "red",
  className = "",
  // Pass as="h1" for a page's primary heading; every other section stays h2.
  as: Heading = "h2",
}) {
  return (
    <div className={`mb-10 max-w-3xl ${className}`}>
      {eyebrow ? <RecTag variant={variant}>{eyebrow}</RecTag> : null}

      {title ? (
        <Heading className="max-w-[24ch] text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </Heading>
      ) : null}

      {description ? (
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
