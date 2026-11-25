import AskDexterButton from "./AskDexterButton";
import DexterAvatar from "./DexterAvatar";

/**
 * Dexter's tip, in the flow of a page: his avatar, one line, and a button
 * that opens the chat with the page's question already asked.
 */
export default function DexterTip({ children, question, place, buttonLabel = "Ask Dexter", mood = "hello", className = "" }) {
  return (
    <div className={`grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 border border-line-light border-l-[3px] border-l-red bg-white p-4 ${className}`}>
      <DexterAvatar mood={mood} size={44} />
      <div>
        <p className="text-[15px] leading-snug text-ink">{children}</p>
        {question ? <AskDexterButton className="mt-3" place={place} question={question}>{buttonLabel}</AskDexterButton> : null}
      </div>
    </div>
  );
}
