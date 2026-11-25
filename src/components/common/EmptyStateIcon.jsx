import DexterAvatar from "@/components/dexter/DexterAvatar";
import { DEXTER_PLACES } from "@/data/dexter";

// Lab-equipment icon at the top of an empty state (empty quote list, no search
// results, page not found …). One tile style everywhere, so these screens read
// as a set. Pass a react-icons/lu icon, e.g. LuBeaker. With Dexter's empty
// states switched on, a puzzled Dexter stands in for the icon everywhere.
export default function EmptyStateIcon({ icon: Icon, className = "mx-auto mb-4", dexterMood = "puzzled" }) {
  if (DEXTER_PLACES.emptyStates) {
    return (
      <span aria-hidden="true" className={`block w-fit ${className}`}>
        <DexterAvatar mood={dexterMood} size={76} />
      </span>
    );
  }

  return (
    <span aria-hidden="true" className={`flex size-14 items-center justify-center bg-red/5 text-red ${className}`}>
      <Icon className="text-[26px]" />
    </span>
  );
}
