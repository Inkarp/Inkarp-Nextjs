import Image from 'next/image';
import { INDIA_MAP } from '@/data/indiaMap';

/**
 * India's states drawn to scale (scripts/build-india-map.mjs). Children are
 * laid over the map; place them with mapPercent() from @/data/indiaMap so a
 * branch's lat/lon lands exactly on its city at every screen size.
 */
export default function IndiaMapFrame({ alt = 'Map of India', children, className = '', imageClassName = '', priority = false }) {
  return (
    <div className={className}>
      <div className="relative w-full" style={{ aspectRatio: `${INDIA_MAP.width} / ${INDIA_MAP.height}` }}>
        <Image
          alt={alt}
          className={`absolute inset-0 h-full w-full select-none ${imageClassName}`}
          draggable={false}
          height={INDIA_MAP.height}
          priority={priority}
          src={INDIA_MAP.src}
          width={INDIA_MAP.width}
        />
        {children}
      </div>
      {/* The boundary data's licence (CC BY 4.0) asks for this credit. */}
      <p className="mt-2 text-right text-[10px] leading-4 text-ink-soft">
        <a className="hover:text-red" href={INDIA_MAP.credit.href} rel="noopener noreferrer" target="_blank">
          {INDIA_MAP.credit.label}
        </a>
      </p>
    </div>
  );
}
