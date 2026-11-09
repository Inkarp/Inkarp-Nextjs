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
      {/* The "Map data: DataMeet India (CC BY 4.0)" line under the map was
          removed at the user's request (9 Nov 2026); the credit itself stays in
          INDIA_MAP.credit (src/data/indiaMap.js) for wherever it is shown. */}
    </div>
  );
}
