import styles from "./GaneshCelebration.module.css";

function Diya() {
  return (
    <svg viewBox="0 0 80 90" className={styles.diya} aria-hidden="true">
      <path className={styles.flame} d="M40 5C20 31 26 44 40 46C54 44 59 31 40 5Z" fill="#ffd46b" />
      <path d="M40 24C32 36 35 43 40 44C47 42 47 35 40 24Z" fill="#fff9d8" />
      <path d="M8 51Q40 43 72 51Q65 79 40 80Q15 79 8 51Z" fill="#d66524" stroke="#ffcf70" strokeWidth="2" />
      <path d="M10 53Q40 64 70 53M22 66Q40 76 58 66" fill="none" stroke="#ffcf70" strokeWidth="2" />
    </svg>
  );
}

export default function GaneshCelebration({ campaign }) {
  return (
    <div className={styles.banner}>
      <div className={styles.garland} aria-hidden="true">
        {Array.from({ length: 48 }, (_, i) => <span key={i} style={{ "--drop": `${Math.sin((i % 12) / 11 * Math.PI) * 21}px` }} />)}
      </div>
      <div className={styles.petals} aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${-i * 0.7}s`, animationDuration: `${6 + i % 4}s` }} />)}
      </div>
      <div className={styles.content}>
        <div className={styles.art}>
          <svg viewBox="0 0 220 220" role="img" aria-label="Decorative illustration of Lord Ganesha" className={styles.ganesha}>
            <circle cx="110" cy="110" r="103" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 7" />
            <circle cx="110" cy="110" r="92" fill="#ffcf70" fillOpacity=".08" stroke="currentColor" strokeWidth="1" />
            <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M79 77L84 55L98 61L110 37L122 61L136 55L141 77ZM84 85Q110 77 136 85" />
              <path d="M81 96C43 69 37 117 61 139Q70 146 80 134M139 96C177 69 183 117 159 139Q150 146 140 134" />
              <path d="M88 91C74 116 84 134 103 140L103 160C103 181 133 178 132 160Q132 150 123 151" />
              <path d="M133 92Q149 121 126 139M91 109L99 112M121 112L129 109M108 94H114M111 101V115" />
              <path d="M89 130L87 144L99 139M77 150C43 152 46 179 80 181M146 150C179 152 175 179 141 181M77 190Q110 201 143 190" />
            </g>
            <circle cx="110" cy="68" r="4" fill="currentColor" />
          </svg>
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Inkarp wishes you &amp; your family</p>
          <h2 className={styles.title}>{campaign.title}</h2>
          <p className={styles.message}>{campaign.message}</p>
          <p className={styles.cheer}><span aria-hidden="true">✦</span> Ganpati Bappa Morya! <span aria-hidden="true">✦</span></p>
        </div>
        <div className={styles.lamps} aria-hidden="true"><Diya /><Diya /><Diya /></div>
      </div>
      <div className={styles.border} aria-hidden="true" />
    </div>
  );
}
