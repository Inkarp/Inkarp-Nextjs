import { FiCheck } from "react-icons/fi";

/**
 * Submit button for every enquiry form ("border trace"). The form keeps its own
 * look through `className`; this adds the motion (styles: `.submit-trace` in globals.css):
 * - sending: a red -> orange -> sand light runs around the edge, the label shimmers;
 * - succeeded: the edge turns green and `doneLabel` shows for a moment, then the
 *   normal label returns (or stays, with `keepDone`, for one-time forms).
 * The three labels share one grid cell, so the button never changes width.
 */
export default function SubmitButton({
  children,
  className = "",
  disabled,
  doneLabel = "Submitted",
  keepDone = false,
  sending = false,
  sendingLabel = "Sending...",
  succeeded = false,
  ...rest
}) {
  const state = sending ? "sending" : succeeded ? "done" : "idle";
  // The "done" flash is visual only (the form's own status message announces success),
  // so screen readers keep the normal label unless the done label stays on screen.
  const showsDone = state === "done" && keepDone;

  return (
    <button
      aria-busy={sending || undefined}
      className={`submit-trace ${className}`}
      data-keep-done={keepDone || undefined}
      data-state={state}
      disabled={sending || disabled}
      type="submit"
      {...rest}
    >
      <span className="submit-trace-label">
        <span aria-hidden={state === "sending" || showsDone || undefined} className="st-idle">
          {children}
        </span>
        <span aria-hidden={state !== "sending" || undefined} className="st-sending">
          <span className="st-shimmer">{sendingLabel}</span>
        </span>
        <span aria-hidden={!showsDone || undefined} className="st-done">
          <FiCheck aria-hidden="true" />
          {doneLabel}
        </span>
      </span>
    </button>
  );
}
