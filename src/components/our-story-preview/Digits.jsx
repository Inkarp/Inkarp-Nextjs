import styles from "./StoryPreview.module.css";

/** Figures that slide up out of a mask on first paint, one character after another. */
export default function Digits({ value, delay = 0, className = "" }) {
  const text = String(value);
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={styles.digits}>
        {text.split("").map((char, index) => (
          <span key={index} style={{ "--i": index + delay }}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
