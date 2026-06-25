"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

function MobileMagazineReader({ file, title }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return undefined;
    }

    const updateWidth = () => {
      setStageWidth(Math.max(stage.clientWidth - 24, 280));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");
    setPdfDoc(null);
    setPageNumber(1);
    setPageCount(0);

    const loadPdf = async () => {
      try {
        await loadScript(`${DFLIP_BASE}/js/libs/pdf.min.js`);

        if (!window.pdfjsLib) {
          throw new Error("PDF.js was not available.");
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${DFLIP_BASE}/js/libs/pdf.worker.min.js`;
        const documentTask = window.pdfjsLib.getDocument(file);
        const loadedPdf = await documentTask.promise;

        if (!cancelled) {
          setPdfDoc(loadedPdf);
          setPageCount(loadedPdf.numPages);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load this magazine page.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel?.();
    };
  }, [file]);

  useEffect(() => {
    if (!pdfDoc || !stageWidth || !canvasRef.current) {
      return undefined;
    }

    let cancelled = false;

    const renderPage = async () => {
      try {
        renderTaskRef.current?.cancel?.();

        const page = await pdfDoc.getPage(pageNumber);
        if (cancelled) {
          return;
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const cssScale = stageWidth / baseViewport.width;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: cssScale * pixelRatio });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${stageWidth}px`;
        canvas.style.height = `${baseViewport.height * cssScale}px`;

        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport,
        });

        await renderTaskRef.current.promise;
      } catch (renderError) {
        if (!cancelled && renderError?.name !== "RenderingCancelledException") {
          setError("Could not render this page.");
        }
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel?.();
    };
  }, [pdfDoc, pageNumber, stageWidth]);

  const goToPrevious = () => {
    setPageNumber((current) => Math.max(current - 1, 1));
  };

  const goToNext = () => {
    setPageNumber((current) => Math.min(current + 1, pageCount || current));
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-black/20">
      <div
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
        ref={stageRef}
      >
        <div className="mx-auto flex min-h-full w-full items-start justify-center">
          {error ? (
            <div className="mt-10 rounded-lg bg-black/70 px-4 py-3 text-sm text-white/80">
              {error}
            </div>
          ) : null}
          {!error ? (
            <canvas
              aria-label={`${title} page ${pageNumber}`}
              className="block max-w-full bg-white shadow-2xl shadow-black/40"
              ref={canvasRef}
            />
          ) : null}
        </div>
      </div>

      <div className="relative z-20 flex min-h-[64px] items-center justify-between gap-3 border-t border-white/10 bg-black/75 px-3 py-2 backdrop-blur">
        <button
          aria-label="Previous page"
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-white disabled:opacity-35"
          disabled={pageNumber <= 1 || loading}
          onClick={goToPrevious}
          type="button"
        >
          &#8249;
        </button>
        <div className="min-w-0 text-center">
          <p className="font-maxot text-sm font-semibold text-white">
            {loading ? "Loading..." : `${pageNumber} / ${pageCount || "-"}`}
          </p>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide text-white/50">
            Mobile Reader
          </p>
        </div>
        <button
          aria-label="Next page"
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-white disabled:opacity-35"
          disabled={!pageCount || pageNumber >= pageCount || loading}
          onClick={goToNext}
          type="button"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}

export default function FlipbookPage({ file, title }) {
  const [err, setErr] = useState("");
  const [fallbackMode, setFallbackMode] = useState(false);
  const [isMobileViewer, setIsMobileViewer] = useState(false);
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewerMode = () => setIsMobileViewer(mediaQuery.matches);

    updateViewerMode();
    mediaQuery.addEventListener("change", updateViewerMode);

    return () => mediaQuery.removeEventListener("change", updateViewerMode);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

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
    if (
      !mounted ||
      !file ||
      initedRef.current ||
      fallbackMode ||
      isMobileViewer
    ) {
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
          pageMode: 2,
          singlePageMode: 1,
          autoEnableOutline: false,
          autoEnableThumbnail: false,
          openPage: 1,
          maxTextureSize: 4096,
          enableDownload: true,
          soundEnable: false,
          scrollWheel: false,
          forceFit: true,
          height: "100%",
          paddingTop: 16,
          paddingRight: 44,
          paddingBottom: 104,
          paddingLeft: 44,
          hideControls:
            "outline,thumbnail,sound,pageMode,download,search,startPage,endPage",
          onReady: () => {
            window.setTimeout(recenterBook, 120);
            window.setTimeout(recenterBook, 680);
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
  }, [file, fallbackMode, mounted, isMobileViewer]);

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

  const content = (
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
          height: 100% !important;
          min-height: 0 !important;
          margin-left: auto !important;
          margin-right: auto !important;
          overflow: hidden !important;
        }

        #flipbook-page .df-book-stage {
          left: 0 !important;
          right: 0 !important;
          overflow: hidden !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding: 16px 44px 104px !important;
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
          padding: 16px 44px 104px !important;
        }

        #flipbook-page ._df_book {
          height: 100% !important;
          min-height: 0 !important;
          width: 100% !important;
        }

        #flipbook-page .df-floating .df-ui-controls {
          bottom: 24px !important;
        }

        #flipbook-page .df-ui-wrapper.df-ui-controls {
          max-width: calc(100vw - 32px);
        }

        #flipbook-page .df-ui-download {
          display: none !important;
        }

        #flipbook-page .magazine-mobile-frame {
          background: rgba(0, 0, 0, 0.28);
        }
      `}</style>

      {err ? (
        <div className="pointer-events-none absolute left-4 top-24 z-20 rounded-md bg-black/70 px-3 py-2 text-xs text-white/80">
          {err}
        </div>
      ) : null}

      <div className="relative z-20 grid min-h-[60px] grid-cols-[auto_1fr] items-center gap-3 border-b border-white/10 bg-black/70 px-3 py-2 shadow-lg shadow-black/30 backdrop-blur sm:grid-cols-[auto_1fr_auto] sm:px-6">
        <a
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 px-3 text-sm font-semibold text-white transition hover:bg-white hover:text-zinc-950 sm:px-4"
          href="/magazine"
        >
          Back
        </a>
        <div className="min-w-0 text-center sm:pr-[72px]">
          <p className="font-maxot text-[11px] uppercase tracking-wide text-white/60 sm:text-xs">
            Magazine
          </p>
          <h1 className="truncate font-maxot text-sm font-semibold text-white sm:text-lg">
            {title}
          </h1>
        </div>
      </div>

      <div className="relative z-10 grid min-h-0 w-full flex-1 place-items-center overflow-hidden">
        {isMobileViewer ? (
          <MobileMagazineReader file={file} title={title} />
        ) : !fallbackMode ? (
          <div
            className="h-full min-h-0 w-full overflow-hidden rounded-lg"
            ref={shellRef}
          />
        ) : (
          <object className="h-full min-h-0 w-full rounded-lg" data={file} type="application/pdf">
            <iframe className="h-full w-full border-0" src={file} title={title} />
          </object>
        )}
      </div>
    </main>
  );

  return mounted ? createPortal(content, document.body) : null;
}
