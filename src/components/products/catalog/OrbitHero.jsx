import Image from 'next/image';
import Link from 'next/link';
import { CountUp, HeroIntro, HeroStats, StepsRow, ViewToggle } from './CatalogHeroParts';
import styles from './CatalogHero.module.css';

// Three rings around the hub, radius in % of the stage's width (cqw), how
// long a turn takes and which way. Neighbouring rings turn opposite ways.
const RINGS = [
  { radius: 20, share: 9, duration: '70s', direction: 'normal' },
  { radius: 32, share: 15, duration: '95s', direction: 'reverse' },
  { radius: 44, share: 20, duration: '125s', direction: 'normal' },
];

function splitIntoRings(brands) {
  const total = RINGS.reduce((sum, ring) => sum + ring.share, 0);
  let start = 0;
  return RINGS.map((ring, index) => {
    const size = index === RINGS.length - 1 ? brands.length - start : Math.round((brands.length * ring.share) / total);
    const slice = brands.slice(start, start + size);
    start += size;
    return { ...ring, brands: slice };
  });
}

/**
 * Preview 3: every principal's logo on three rings turning slowly around the
 * catalogue count; pointing at a logo stops them and shows that brand's
 * product count and country, and a click shows its products.
 */
export default function OrbitHero({ basePath, hero }) {
  const rings = splitIntoRings(hero.brands);
  const countries = new Set(hero.brands.map((brand) => brand.country).filter(Boolean)).size;

  return (
    <section className="overflow-hidden bg-white px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-14">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <HeroIntro />
            <ViewToggle className="mt-3" />
            <HeroStats className="mt-8" totals={hero.totals} />
          </div>

          <div className={`${styles.stage} relative mx-auto aspect-square w-full max-w-[540px]`}>
            {rings.map((ring) => (
              <span
                aria-hidden="true"
                className={styles.ringLine}
                key={`line-${ring.radius}`}
                style={{ height: `${ring.radius * 2}cqw`, width: `${ring.radius * 2}cqw` }}
              />
            ))}

            {/* The hub: the catalogue count. */}
            <div className="absolute left-1/2 top-1/2 flex size-[26cqw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-red/30 bg-white text-center shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
              <span className={`${styles.hubPulse} absolute inset-0 rounded-full`} />
              <span className="text-[7cqw] font-semibold leading-none tabular-nums tracking-tight text-ink">
                <CountUp value={hero.totals.products} />
              </span>
              <span className="mt-[1cqw] text-[2.3cqw] font-semibold uppercase tracking-[0.14em] text-red">Instruments</span>
              <span className="mt-[0.6cqw] text-[2cqw] text-ink-soft">
                {hero.totals.brands} brands · {countries} countries
              </span>
            </div>

            {rings.map((ring) => (
              <div
                className={styles.ring}
                key={ring.radius}
                style={{
                  '--orbit-duration': ring.duration,
                  '--orbit-direction': ring.direction,
                  '--orbit-counter': ring.direction === 'normal' ? 'reverse' : 'normal',
                }}
              >
                {ring.brands.map((brand, index) => {
                  const angle = (360 / ring.brands.length) * index;
                  return (
                    <span
                      className={styles.slot}
                      key={brand.value}
                      style={{ transform: `rotate(${angle}deg) translateY(-${ring.radius}cqw) rotate(${-angle}deg)` }}
                    >
                      <span className={`${styles.upright} absolute left-0 top-0`}>
                        <Link
                          aria-label={`${brand.label}: ${brand.count} products${brand.country ? `, ${brand.country}` : ''}`}
                          className={`${styles.brand} absolute left-0 top-0 block rounded-full border border-line-light bg-white p-[1.7cqw] shadow-[0_6px_16px_rgba(15,23,42,0.08)] outline-none`}
                          href={`${basePath}?brand=${brand.value}#product-results`}
                          scroll={false}
                        >
                          <span className="relative block size-full">
                            <Image alt="" className="object-contain" fill sizes="64px" src={brand.logo} />
                          </span>
                          <span className={`${styles.brandTip} pointer-events-none absolute left-1/2 top-full z-10 mt-2 whitespace-nowrap bg-ink px-2.5 py-1.5 text-center text-[11px] leading-4 text-white shadow-lg`}>
                            <span className="block font-semibold">{brand.label}</span>
                            <span className="block text-white/75">
                              {brand.count} {brand.count === 1 ? 'product' : 'products'}
                              {brand.country ? ` · ${brand.country}` : ''}
                            </span>
                          </span>
                        </Link>
                      </span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <StepsRow className="mt-10" />
      </div>
    </section>
  );
}
