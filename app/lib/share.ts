import type { Watch } from "@/app/lib/types";
import type { GameState } from "@/app/lib/game";
import { watches } from "@/app/data/watches";

/**
 * Compact, stateless representation of a finished run, encoded into the share
 * URL (`/c/<data>`). Watches are stored as indices into the canonical
 * `watches` catalogue so the link stays short and the server can re-hydrate
 * full brand/model/price without a database.
 */
export interface SharePayload {
  /** Guest name. */
  n: string;
  /** Raw X handle (may be empty). */
  h: string;
  /** Starting budget. */
  b: number;
  /** Total spent. */
  s: number;
  /** Outcome: win ("w") or lost/ruined ("l"). */
  o: "w" | "l";
  /** Collected watches, as indices into the `watches` catalogue. */
  w: number[];
}

// --- base64url (works in both the browser and Node) ---

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const base64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary =
    typeof atob !== "undefined"
      ? atob(base64)
      : Buffer.from(base64, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Build the share payload from a finished game state. */
export function buildPayload(state: GameState): SharePayload {
  return {
    n: state.guest.name,
    h: state.guest.xHandle,
    b: state.startingBudget,
    s: state.spent,
    o: state.phase === "lost" ? "l" : "w",
    w: state.collected
      .map((c) => watches.findIndex((x) => x.id === c.id))
      .filter((i) => i >= 0),
  };
}

/** Encode a finished game state into a URL-safe string. */
export function encodeResult(state: GameState): string {
  const json = JSON.stringify(buildPayload(state));
  return toBase64Url(new TextEncoder().encode(json));
}

/** Decode a share string back into a payload, or null if it's malformed. */
export function decodeResult(data: string): SharePayload | null {
  try {
    const obj: unknown = JSON.parse(
      new TextDecoder().decode(fromBase64Url(data)),
    );
    if (
      typeof obj !== "object" ||
      obj === null ||
      typeof (obj as SharePayload).b !== "number" ||
      typeof (obj as SharePayload).s !== "number" ||
      ((obj as SharePayload).o !== "w" && (obj as SharePayload).o !== "l") ||
      !Array.isArray((obj as SharePayload).w)
    ) {
      return null;
    }
    const p = obj as SharePayload;
    return {
      n: typeof p.n === "string" ? p.n : "",
      h: typeof p.h === "string" ? p.h : "",
      b: p.b,
      s: p.s,
      o: p.o,
      w: p.w.filter((i) => typeof i === "number"),
    };
  } catch {
    return null;
  }
}

/** Re-hydrate full watch objects from their catalogue indices. */
export function hydrateWatches(indices: number[]): Watch[] {
  return indices.map((i) => watches[i]).filter(Boolean);
}
