'use client';
import { branches } from '@/data/branches';
import { mapPercent } from '@/data/indiaMap';
import IndiaMapFrame from './IndiaMapFrame';

// Which side of its pin each branch name sits on, so close branches
// (Ahmedabad/Vadodara, Mumbai/Pune, Bengaluru/Chennai, Chandigarh/Delhi) never
// overlap. Checked at desktop and tablet widths; phones show only the selected
// name, and three names that would run off a phone-width map flip to the right.
const LABEL_SIDE = {
  Ahmedabad: 'left',
  Vadodara: 'right',
  Mumbai: 'left',
  Pune: 'right',
  Chandigarh: 'left',
  Delhi: 'right',
  Bengaluru: 'left',
  Chennai: 'right',
  Thiruvananthapuram: 'left',
  Hyderabad: 'left',
  Visakhapatnam: 'right',
  Kolkata: 'right',
};
const PHONE_RIGHT = new Set(['Ahmedabad', 'Mumbai', 'Thiruvananthapuram']);

function labelSideClass(name) {
  if (LABEL_SIDE[name] !== 'left') return 'left-[9px]';
  return PHONE_RIGHT.has(name) ? 'left-[9px] sm:left-auto sm:right-[9px]' : 'right-[9px]';
}

// A map pin whose tip is the bottom centre of its box, so the tip sits on the city.
function PinIcon({ selected }) {
  return (
    <svg
      aria-hidden="true"
      className={`absolute left-0 top-0 h-[19px] w-[14px] -translate-x-1/2 -translate-y-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] transition-colors sm:h-6 sm:w-[18px] ${
        selected ? 'text-red' : 'text-ink group-hover:text-red'
      }`}
      viewBox="0 0 24 32"
    >
      <path d="M12 31.5C11.2 30.4 2 18.6 2 12a10 10 0 0 1 20 0c0 6.6-9.2 18.4-10 19.5Z" fill="currentColor" stroke="#fff" strokeWidth="1.5" />
      <circle cx="12" cy="12" fill="#fff" r="3.8" />
    </svg>
  );
}

/**
 * India map with a pin on every branch. Each pin's tip is the branch's
 * lat/lon, projected exactly as the map itself is drawn.
 */
export default function BranchPinMap({ selected, onSelect, alt = 'India service coverage map', className = '', priority = false }) {
  return (
    <IndiaMapFrame alt={alt} className={className} priority={priority}>
      {branches.map((branch, i) => {
        const isSelected = selected === i;

        return (
          <button
            aria-label={`Show ${branch.name} branch details`}
            aria-pressed={isSelected}
            className="group absolute size-0 outline-none"
            key={branch.name}
            onClick={() => onSelect(i)}
            style={{ ...mapPercent(branch.coords), zIndex: isSelected ? 30 : 10 }}
            type="button"
          >
            {/* The exact point, then the pin standing on it. */}
            <span className="absolute left-0 top-0 h-1 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30" />
            {isSelected && (
              <span className="absolute left-0 top-0 size-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-red/50 motion-reduce:hidden" />
            )}
            <PinIcon selected={isSelected} />
            <span
              className={`absolute top-[-12px] -translate-y-1/2 whitespace-nowrap border px-1.5 py-0.5 text-[10px] font-semibold leading-[14px] shadow-sm transition-colors group-focus-visible:ring-2 group-focus-visible:ring-red/40 sm:top-[-15px] ${labelSideClass(branch.name)} ${
                isSelected
                  ? 'block border-black bg-red text-white'
                  : 'hidden border-line-light bg-white text-ink group-hover:border-red/50 group-hover:text-red sm:block'
              }`}
            >
              {branch.name}
            </span>
          </button>
        );
      })}
    </IndiaMapFrame>
  );
}
