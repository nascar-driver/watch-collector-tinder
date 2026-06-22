import type { Watch } from "@/app/lib/types";
import watchesData from "./watches.json";

export const watches: Watch[] = watchesData as Watch[];

/** Fisher–Yates shuffle returning a new array (does not mutate the input). */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface DeckOptions {
  /** Shuffle the deck for replayability. Default: false (authored order). */
  shuffle?: boolean;
}

/** Build a fresh deck (always a new array, never mutates the catalogue). */
export function getDeck({
  shuffle: doShuffle = false,
}: DeckOptions = {}): Watch[] {
  return doShuffle ? shuffle(watches) : watches.slice();
}

/** Look up a watch by id. */
export function getWatchById(id: string): Watch | undefined {
  return watches.find((w) => w.id === id);
}

/** Summary stats — handy for setup defaults (e.g. suggested budgets) and tests. */
export const deckStats = {
  count: watches.length,
  minPrice: Math.min(...watches.map((w) => w.price)),
  maxPrice: Math.max(...watches.map((w) => w.price)),
  totalValue: watches.reduce((sum, w) => sum + w.price, 0),
} as const;
