'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiZoomIn } from 'react-icons/fi';

/**
 * Zoom control for the product hero image. The trigger sits in the corner of
 * the image frame; the enlarged view opens in a portal so it clears the header
 * and the floating widgets, and closes on the button, a backdrop click, or Esc.
 */
export default function ProductImageZoom({ alt, src }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };

    // Hold the page still behind the enlarged image.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [close, open]);

  if (!src) return null;

  return (
    <>
      <button
        aria-label="Zoom product image"
        className="absolute bottom-2 right-2 inline-flex size-9 items-center justify-center border border-line-light bg-white/95 text-ink shadow-sm transition hover:border-rose-300 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        onClick={() => setOpen(true)}
        title="Zoom product image"
        type="button"
      >
        <FiZoomIn aria-hidden="true" className="size-4" />
      </button>

      {mounted && open
        ? createPortal(
            <div
              aria-label={`${alt ?? 'Product image'} enlarged`}
              aria-modal="true"
              className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm motion-safe:animate-[hvc-fade_200ms_ease-out] sm:p-8"
              // Clicking the backdrop dismisses; clicks on the image itself do not.
              onClick={close}
              role="dialog"
            >
              <div className="relative w-full max-w-[min(1100px,92vw)]" onClick={(event) => event.stopPropagation()}>
                <button
                  aria-label="Close enlarged image"
                  autoFocus
                  className="absolute -right-2 -top-2 inline-flex size-9 items-center justify-center border border-line-light bg-white text-ink shadow-md transition hover:border-rose-300 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 sm:-right-4 sm:-top-4 sm:size-11"
                  onClick={close}
                  type="button"
                >
                  <FiX aria-hidden="true" className="size-5" />
                </button>

                <Image
                  alt={alt ?? 'Product image'}
                  className="max-h-[82vh] w-full bg-white object-contain p-4 sm:p-8"
                  height={1400}
                  src={src}
                  width={1400}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
