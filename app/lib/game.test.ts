import { describe, it, expect } from "vitest";
import type { Watch } from "@/app/lib/types";
import { watches } from "@/app/data/watches";
import {
  createInitialState,
  gameReducer,
  remaining,
  currentWatch,
  isDeckExhausted,
  type GameState,
} from "./game";

// --- helpers ---
const w = (id: string, price: number): Watch => ({
  id,
  brand: "TestBrand",
  model: id,
  price,
  image: "",
});

const guest = { name: "Ada", xHandle: "@ada" };

/** A controlled "playing" state with a small, deterministic deck. */
function playing(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: "playing",
    guest,
    startingBudget: 10000,
    shuffle: false,
    deck: [w("a", 3000), w("b", 4000), w("c", 5000)],
    deckIndex: 0,
    collected: [],
    spent: 0,
    ...overrides,
  };
}

describe("createInitialState", () => {
  it("starts empty on the setup screen", () => {
    const s = createInitialState();
    expect(s.phase).toBe("setup");
    expect(s.guest).toEqual({ name: "", xHandle: "" });
    expect(s.startingBudget).toBe(0);
    expect(s.deck).toEqual([]);
    expect(s.collected).toEqual([]);
    expect(s.spent).toBe(0);
  });
});

describe("selectors", () => {
  it("remaining = budget - spent", () => {
    expect(remaining(playing({ spent: 2500 }))).toBe(7500);
  });

  it("currentWatch returns the card at deckIndex, or null when exhausted", () => {
    expect(currentWatch(playing())?.id).toBe("a");
    expect(currentWatch(playing({ deckIndex: 3 }))).toBeNull();
  });

  it("isDeckExhausted reflects the index", () => {
    expect(isDeckExhausted(playing())).toBe(false);
    expect(isDeckExhausted(playing({ deckIndex: 3 }))).toBe(true);
  });
});

describe("START", () => {
  it("seeds a fresh playing game from the catalogue", () => {
    const s = gameReducer(createInitialState(), {
      type: "START",
      guest,
      budget: 50000,
    });
    expect(s.phase).toBe("playing");
    expect(s.guest).toEqual(guest);
    expect(s.startingBudget).toBe(50000);
    expect(s.deckIndex).toBe(0);
    expect(s.collected).toEqual([]);
    expect(s.spent).toBe(0);
    // No shuffle → authored order.
    expect(s.deck).toEqual(watches);
  });
});

describe("PASS", () => {
  it("advances to the next card without changing money", () => {
    const s = gameReducer(playing(), { type: "PASS" });
    expect(s.deckIndex).toBe(1);
    expect(s.spent).toBe(0);
    expect(s.collected).toEqual([]);
    expect(s.phase).toBe("playing");
  });

  it("wins when passing the final card", () => {
    const s = gameReducer(playing({ deckIndex: 2 }), { type: "PASS" });
    expect(s.phase).toBe("won");
  });
});

describe("BUY", () => {
  it("collects the watch, deducts the price, and advances", () => {
    const s = gameReducer(playing(), { type: "BUY" });
    expect(s.collected.map((c) => c.id)).toEqual(["a"]);
    expect(s.spent).toBe(3000);
    expect(remaining(s)).toBe(7000);
    expect(s.deckIndex).toBe(1);
    expect(s.phase).toBe("playing");
  });

  it("loses when a purchase exceeds the budget (and still keeps the watch)", () => {
    const s = gameReducer(playing({ startingBudget: 2000 }), { type: "BUY" });
    expect(s.phase).toBe("lost");
    expect(s.collected.map((c) => c.id)).toEqual(["a"]);
    expect(s.spent).toBe(3000);
  });

  it("does not lose when spend exactly equals the budget", () => {
    const s = gameReducer(playing({ startingBudget: 3000 }), { type: "BUY" });
    expect(s.phase).toBe("playing");
    expect(s.spent).toBe(3000);
  });

  it("wins when the final card is bought within budget", () => {
    const s = gameReducer(playing({ deckIndex: 2 }), { type: "BUY" });
    expect(s.phase).toBe("won");
    expect(s.collected.map((c) => c.id)).toEqual(["c"]);
  });
});

describe("CASH_OUT", () => {
  it("ends the game as a win, keeping the collection", () => {
    const start = playing({ deckIndex: 1, collected: [w("a", 3000)], spent: 3000 });
    const s = gameReducer(start, { type: "CASH_OUT" });
    expect(s.phase).toBe("won");
    expect(s.collected.map((c) => c.id)).toEqual(["a"]);
    expect(s.spent).toBe(3000);
  });
});

describe("guards", () => {
  it("ignores play actions when the game is not in progress", () => {
    const ended = playing({ phase: "won" });
    expect(gameReducer(ended, { type: "PASS" })).toBe(ended);
    expect(gameReducer(ended, { type: "BUY" })).toBe(ended);
    expect(gameReducer(ended, { type: "CASH_OUT" })).toBe(ended);
  });
});

describe("PLAY_AGAIN", () => {
  it("keeps guest + budget but starts a fresh run", () => {
    const ended = playing({
      phase: "won",
      startingBudget: 50000,
      deckIndex: 2,
      collected: [w("a", 3000)],
      spent: 3000,
    });
    const s = gameReducer(ended, { type: "PLAY_AGAIN" });
    expect(s.phase).toBe("playing");
    expect(s.guest).toEqual(guest);
    expect(s.startingBudget).toBe(50000);
    expect(s.deckIndex).toBe(0);
    expect(s.collected).toEqual([]);
    expect(s.spent).toBe(0);
    expect(s.deck).toEqual(watches); // shuffle=false → authored order
  });
});

describe("RESET", () => {
  it("returns to setup with guest + budget pre-filled for editing", () => {
    const ended = playing({ phase: "lost", startingBudget: 50000 });
    const s = gameReducer(ended, { type: "RESET" });
    expect(s.phase).toBe("setup");
    expect(s.guest).toEqual(guest);
    expect(s.startingBudget).toBe(50000);
    expect(s.deck).toEqual([]);
    expect(s.collected).toEqual([]);
    expect(s.spent).toBe(0);
  });
});
