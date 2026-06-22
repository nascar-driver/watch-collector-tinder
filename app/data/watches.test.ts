import { describe, it, expect } from "vitest";
import {
  watches,
  getDeck,
  shuffle,
  getWatchById,
  deckStats,
} from "./watches";

describe("watches catalogue", () => {
  it("is non-empty", () => {
    expect(watches.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    const ids = watches.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has positive prices and required fields on every entry", () => {
    for (const w of watches) {
      expect(w.id).toBeTruthy();
      expect(w.brand).toBeTruthy();
      expect(w.model).toBeTruthy();
      expect(w.image).toBeTruthy();
      expect(w.price).toBeGreaterThan(0);
    }
  });
});

describe("getDeck", () => {
  it("returns all watches in authored order by default", () => {
    expect(getDeck()).toEqual(watches);
  });

  it("returns a fresh array that does not mutate the catalogue", () => {
    const deck = getDeck();
    expect(deck).not.toBe(watches);
    deck.pop();
    expect(watches.length).toBeGreaterThan(deck.length);
  });

  it("keeps every watch when shuffled (only order may differ)", () => {
    const deck = getDeck({ shuffle: true });
    expect(deck).toHaveLength(watches.length);
    expect([...deck].sort()).not.toBe(watches); // distinct array
    expect(new Set(deck.map((w) => w.id))).toEqual(
      new Set(watches.map((w) => w.id)),
    );
  });
});

describe("shuffle", () => {
  it("does not mutate the input array", () => {
    const input = watches.slice();
    const snapshot = input.slice();
    shuffle(input);
    expect(input).toEqual(snapshot);
  });

  it("preserves all elements", () => {
    const result = shuffle(watches);
    expect(new Set(result)).toEqual(new Set(watches));
  });
});

describe("getWatchById", () => {
  it("finds an existing watch", () => {
    const first = watches[0];
    expect(getWatchById(first.id)).toEqual(first);
  });

  it("returns undefined for an unknown id", () => {
    expect(getWatchById("does-not-exist")).toBeUndefined();
  });
});

describe("deckStats", () => {
  it("reports correct count and price bounds", () => {
    const prices = watches.map((w) => w.price);
    expect(deckStats.count).toBe(watches.length);
    expect(deckStats.minPrice).toBe(Math.min(...prices));
    expect(deckStats.maxPrice).toBe(Math.max(...prices));
    expect(deckStats.totalValue).toBe(prices.reduce((a, b) => a + b, 0));
  });
});
