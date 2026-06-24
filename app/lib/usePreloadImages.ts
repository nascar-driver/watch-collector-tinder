"use client";

import { useEffect } from "react";

/**
 * Warm the browser's HTTP cache for a set of watch images so cards render
 * instantly instead of fetching on mount. Pass a STABLE array reference (e.g.
 * the catalogue or a run's deck) — the effect re-runs whenever it changes.
 *
 * Once an image finishes loading the bytes live in the HTTP cache, so a later
 * `<img src>` paints immediately even after the Image object is collected.
 */
export function usePreloadImages(items: ReadonlyArray<{ image: string }>) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    for (const { image } of items) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = image;
    }
  }, [items]);
}
