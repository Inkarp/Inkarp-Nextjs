"use client";

import { useEffect, useRef, useState } from "react";

const DFLIP_BASE = "/assets/vendor/dflip";

function loadStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) {
    return;
  }

  const link = document.createElement("link");
  link.href = href;
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
      } else {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.cfasync = "false";
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true }
    );
    script.addEventListener("error", reject, { once: true });
    document.body.appendChild(script);
  });
}

export default function FlipbookPage({ file, title }) {
  const [err, setErr] = useState("");
  const [fallbackMode, setFallbackMode] = useState(false);
  const shellRef = useRef(null);
  const initedRef = useRef(false);

  const recenterBook = () => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    const wrappers = shell.querySelectorAll(
      ".df-book-wrapper, .df-book-stage, .df-container"
    );

    wrappers.forEach((wrapper) => {
      wrapper.classList.remove("close-left", "close-right");
      wrapper.style.left = "0";
      wrapper.style.right = "0";
      wrapper.style.marginLeft = "auto";
      wrapper.style.marginRight = "auto";
    });
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    let cancelled = false;

    fetch(file, { method: "GET", headers: { Range: "bytes=0-0" } })
      .then((response) => {
        if (!cancelled && !response.ok) {
          setErr(`Could not prefetch PDF (HTTP ${response.status}).`);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErr("Preload blocked. Viewer will still try.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  useEffect(() => {
    if (!file || initedRef.current || fallbackMode) {
      return undefined;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        loadStylesheet(`${DFLIP_BASE}/css/dflip.min.css`);
        loadStylesheet(`${DFLIP_BASE}/css/themify-icons.min.css`);

        window.dFlipLocation = DFLIP_BASE;
        await loadScript(`${DFLIP_BASE}/js/libs/jquery.min.js`);
        await loadScript(`${DFLIP_BASE}/js/dflip.min.js`);

        if (cancelled || initedRef.current) {
          return;
        }

        const shell = shellRef.current;
        if (!shell) {
          return;
        }

        const book = document.createElement("div");
        book.className = "_df_book h-full w-full";
        book.id = "flipbook_embed";
        book.setAttribute("source", file);
        book.addEventListener(
          "df-error",
          () => {
            if (!cancelled) {
              setErr("DearFlip failed to render the PDF.");
              setFallbackMode(true);
            }
          },
          { passive: true }
        );

        shell.replaceChildren(book);

        window.option_flipbook_embed = {
          webgl: false,
          backgroundColor: "transparent",
          duration: 800,
          pageMode: 1,
          singlePageMode: 1,
          autoEnableOutline: false,
          autoEnableThumbnail: false,
          openPage: 1,
          maxTextureSize: 4096,
          enableDownload: true,
          soundEnable: false,
          scrollWheel: false,
          forceFit: true,
          hideControls: "outline,thumbnail,sound,pageMode",
          onReady: () => {
            window.setTimeout(recenterBook, 120);
          },
          onFlip: () => {
            window.setTimeout(recenterBook, 120);
            window.setTimeout(recenterBook, 860);
          },
          pdfjs: { disableRange: false, cMapPacked: true },
        };

        if (window.DFLIP && typeof window.DFLIP.parseBooks === "function") {
          window.DFLIP.parseBooks();
          initedRef.current = true;
        } else {
          setErr("DearFlip script loaded, but parser was not available.");
          setFallbackMode(true);
        }
      } catch {
        if (!cancelled) {
          setErr("DearFlip assets failed to load.");
          setFallbackMode(true);
        }
      }
    };

    setup();

    return () => {
      cancelled = true;
    };
  }, [file, fallbackMode]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || fallbackMode) {
      return undefined;
    }

    const handleInteraction = () => {
      window.setTimeout(recenterBook, 120);
      window.setTimeout(recenterBook, 860);
    };

    shell.addEventListener("click", handleInteraction);
    shell.addEventListener("pointerup", handleInteraction);

    return () => {
      shell.removeEventListener("click", handleInteraction);
      shell.removeEventListener("pointerup", handleInteraction);
    };
  }, [fallbackMode]);

  return (
    <main
      className="fixed inset-0 z-[9999] flex flex-col bg-black text-white"
      id="flipbook-page"
      style={{
        backgroundImage: "url('/assets/catalyst/BgCatalyst.jpg')",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/35"
      />

      <style jsx global>{`
        #flipbook-page .df-container {
          margin-left: auto !important;
          margin-right: auto !important;
          overflow: hidden !important;
        }

        #flipbook-page .df-book-stage {
          left: 0 !important;
          right: 0 !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding-left: 20px !important;
          padding-right: 20px !important;
        }

        #flipbook-page .df-book-wrapper,
        #flipbook-page .df-book-wrapper.close-left,
        #flipbook-page .df-book-wrapper.close-right {
          left: 0 !important;
          right: 0 !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        #flipbook-page .df-container.df-sidemenu-open .df-book-stage {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
      `}</style>

      {err ? (
        <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-md bg-black/70 px-3 py-2 text-xs text-white/80">
          {err}
        </div>
      ) : null}

      <div className="relative z-10 grid w-full flex-1 place-items-center pb-10">
        {!fallbackMode ? (
          <div
            className="h-full w-full overflow-hidden rounded-lg"
            ref={shellRef}
          />
        ) : (
          <object className="h-[80vh] w-full" data={file} type="application/pdf">
            <iframe className="h-full w-full border-0" src={file} title={title} />
          </object>
        )}
      </div>
    </main>
  );
}
