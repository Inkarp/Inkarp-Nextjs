export default function RecTag({ children, variant = "red" }) {
  const color = variant === "teal" ? "text-teal" : "text-red";
  const line = variant === "teal" ? "bg-teal" : "bg-red";

  return (
    <span className={`mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] ${color}`}>
      <span className={`h-px w-[22px] ${line}`} />
      {children}
    </span>
  );
}
