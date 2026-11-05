import Image from 'next/image';
import Link from 'next/link';
import { HeroIntro, HeroStats, StepsRow, ViewToggle } from './CatalogHeroParts';
import styles from './CatalogHero.module.css';

// `copy`: the second run of tiles that makes the loop seamless, hidden from
// screen readers and the keyboard.
function Tile({ photo, priority = false, copy = false, className = '' }) {
  return (
    <Link
      aria-hidden={copy ? 'true' : undefined}
      className={`${styles.tile} block border border-line-light bg-white p-3 ${className}`}
      href={photo.href}
      tabIndex={copy ? -1 : undefined}
      title={photo.name}
    >
      <span className="relative block h-[112px] w-full">
        <Image
          alt={photo.name}
          className="object-contain"
          fill
          loading={priority ? undefined : 'lazy'}
          sizes="160px"
          src={photo.image}
        />
      </span>
      <span className={`${styles.tileName} mt-2 line-clamp-2 block text-[11px] font-semibold leading-tight text-ink transition-colors`}>
        {photo.name}
      </span>
      <span className="mt-0.5 block truncate text-[10px] text-ink-soft">{photo.principalName}</span>
    </Link>
  );
}

/**
 * Preview 1: real product photos from the catalogue in three columns drifting
 * up and down (one strip sideways on phones); pointing at the wall stops it.
 */
export default function WallHero({ hero }) {
  const columns = [0, 1, 2].map((column) => hero.photos.filter((_, index) => index % 3 === column));
  const durations = ['52s', '60s', '46s'];

  return (
    <section className="overflow-hidden bg-white px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-14">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <HeroIntro />
            <ViewToggle className="mt-3" />
            <HeroStats className="mt-8" totals={hero.totals} />
          </div>

          {/* Wide screens: the wall. */}
          <div className={`${styles.wall} relative hidden h-[500px] border border-line-light bg-parchment-alt lg:block`}>
            {/* Each run of tiles carries its own spacing (no gaps), so half a track
                is exactly one run and the loop has no jump. */}
            <div className="grid h-full grid-cols-3 gap-3 overflow-hidden px-3">
              {columns.map((photos, column) => (
                <div className="min-w-0" key={column}>
                  <div
                    className={`${styles.wallTrack} ${column === 1 ? styles.wallTrackDown : ''} flex flex-col`}
                    style={{ '--wall-duration': durations[column] }}
                  >
                    {[...photos, ...photos].map((photo, index) => (
                      <Tile className="mt-3" copy={index >= photos.length} key={`${photo.href}-${index}`} photo={photo} priority={index < 2} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phones and tablets: one strip. */}
          <div className={`${styles.strip} -mx-4 overflow-hidden sm:-mx-6 lg:hidden`}>
            <div className={`${styles.stripTrack} flex w-max`}>
              {[...hero.photos, ...hero.photos].map((photo, index) => (
                <div className="w-[162px] shrink-0 pl-3" key={`${photo.href}-${index}`}>
                  <Tile copy={index >= hero.photos.length} photo={photo} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <StepsRow className="mt-10" />
      </div>
    </section>
  );
}
