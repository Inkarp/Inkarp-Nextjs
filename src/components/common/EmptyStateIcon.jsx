// Lab-equipment icon at the top of an empty state (empty quote list, no search
// results, page not found …). One tile style everywhere, so these screens read
// as a set. Pass a react-icons/lu icon, e.g. LuBeaker.
export default function EmptyStateIcon({ icon: Icon, className = "mx-auto mb-4" }) {
  return (
    <span aria-hidden="true" className={`flex size-14 items-center justify-center bg-red/5 text-red ${className}`}>
      <Icon className="text-[26px]" />
    </span>
  );
}
