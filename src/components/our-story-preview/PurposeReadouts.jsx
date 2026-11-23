import Eyebrow from "./Eyebrow";
import { PURPOSE } from "./storyContent";
import styles from "./StoryPreview.module.css";

/** C · mission, vision and values as three readout panels; a scan line sweeps down each as it arrives. */
export default function PurposeReadouts() {
  return (
    <section className="bg-parchment-alt px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <Eyebrow>{PURPOSE.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[32px] leading-[1.08] text-ink sm:text-5xl" data-reveal>
              {PURPOSE.title}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg" data-reveal style={{ "--i": 1 }}>
            {PURPOSE.description}
          </p>
        </div>

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {PURPOSE.pillars.map((pillar, index) => (
            <li className={`${styles.readout} flex flex-col border border-line-light bg-white p-6 sm:p-8`} data-reveal key={pillar.key} style={{ "--i": index }}>
              <p className="flex items-center justify-between border-b border-line-light pb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className={`${styles.led} size-2 rounded-full bg-red`} style={{ animationDelay: `${index * 400}ms` }} />
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{pillar.key}</span>
              </p>
              <h3 className="mt-6 text-[24px] font-semibold text-ink">{pillar.title}</h3>
              <p className="mt-4 text-[17px] leading-relaxed text-ink">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
