"use client";

import { useEffect, useRef } from "react";

interface LegalModalProps {
  title: string;
  /** Trusted, authored HTML for the document body. */
  html: string;
  onClose: () => void;
}

/**
 * Reusable legal document modal (Terms of Service, Privacy Policy, …).
 * Renders a centered, scrollable dialog over a dimmed backdrop. Closes on the
 * close button, backdrop click, or Escape, and locks page scroll while open.
 * Pass any document from the LEGAL_DOCS registry via `title` + `html`.
 */
export function LegalModal({ title, html, onClose }: LegalModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 normal-case lg:items-center lg:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="legal-modal"
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="legal-modal-close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 6L4 12L10 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <path
              d="M5 12H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </button>

        <h2
          id="legal-modal-title"
          className="shrink-0 px-12 text-center text-[28px] text-foreground"
        >
          {title}
        </h2>

        <div className="mt-12 flex-1 overflow-y-auto px-6">
          <div
            className="legal-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
