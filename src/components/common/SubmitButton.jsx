import { FiCheck } from "react-icons/fi";

/**
 * Submit button for every enquiry form ("border trace"). The form keeps its own
 * look through `className`; this adds the motion (styles: `.submit-trace` in globals.css):
 * - sending: a red -> orange -> sand light runs around the edge, the label shimmers;
 * - succeeded: the edge turns green and `doneLabel` shows for a moment, then the
 *   normal label returns (or stays, with `keepDone`, for one-time forms).
 * The three labels share one grid cell, so the button never changes width.
 *
 * Optional `progress` (0–1): the button fills with brand red from the left as
 * the form is completed, its label white over the red part, and shows
 * `progressLabel` (e.g. "7 of 11 done · Send enquiry") until it is full; at
 * 1 it is solid red with the normal label. Styles: `.submit-trace[data-progress]`.
 */
export default function SubmitButton({
  children,
  className = "",
  disabled,
  doneLabel = "Submitted",
  keepDone = false,
  progress,
  progressLabel,
  sending = false,
  sendingLabel = "Sending...",
  style,
  succeeded = false,
  ...rest
}) {
  const state = sending ? "sending" : succeeded ? "done" : "idle";
  // The "done" flash is visual only (the form's own status message announces success),
  // so screen readers keep the normal label unless the done label stays on screen.
  const showsDone = state === "done" && keepDone;
  const hasProgress = typeof progress === "number";
  const fill = hasProgress ? Math.round(Math.min(Math.max(progress, 0), 1) * 100) : 0;
  const complete = hasProgress && fill >= 100;
  const idleLabel = hasProgress && !complete && progressLabel ? progressLabel : children;

  return (
    <button
      aria-busy={sending || undefined}
      className={`submit-trace ${className}`}
      data-complete={complete || undefined}
      data-keep-done={keepDone || undefined}
      data-progress={hasProgress || undefined}
      data-state={state}
      disabled={sending || disabled}
      style={hasProgress ? { ...style, "--submit-fill": `${fill}%` } : style}
      type="submit"
      {...rest}
    >
      <span className="submit-trace-label">
        <span aria-hidden={state === "sending" || showsDone || undefined} className="st-idle">
          {idleLabel}
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
