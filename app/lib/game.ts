import type { Watch } from "@/app/lib/types";
import { getDeck } from "@/app/data/watches";

/** Which screen the game is on. */
export type Phase = "setup" | "playing" | "won" | "lost";

export interface Guest {
  name: string;
  xHandle: string;
}

export interface GameState {
  phase: Phase;
  guest: Guest;
  /** The budget the guest started with (never changes during a run). */
  startingBudget: number;
  /** Whether the deck was shuffled this run (reused on Play Again). */
  shuffle: boolean;
  /** The deck for this run, in play order. */
  deck: Watch[];
  /** Index of the watch currently being decided. */
  deckIndex: number;
  /** Watches the guest bought, in purchase order. */
  collected: Watch[];
  /** Sum of collected prices. */
  spent: number;
}

export type GameAction =
  | { type: "START"; guest: Guest; budget: number; shuffle?: boolean }
  | { type: "PASS" }
  | { type: "BUY" }
  | { type: "CASH_OUT" }
  | { type: "PLAY_AGAIN" }
  | { type: "RESET" };

/** A fresh, empty game sitting on the Setup screen. */
export function createInitialState(): GameState {
  return {
    phase: "setup",
    guest: { name: "", xHandle: "" },
    startingBudget: 0,
    shuffle: false,
    deck: [],
    deckIndex: 0,
    collected: [],
    spent: 0,
  };
}

// --- Derived selectors (pure; never stored on state) ---

/** Budget left to spend. Can go negative on the busting purchase. */
export const remaining = (s: GameState): number => s.startingBudget - s.spent;

/** The watch awaiting a decision, or null if the deck is exhausted. */
export const currentWatch = (s: GameState): Watch | null =>
  s.deck[s.deckIndex] ?? null;

/** True once every watch has been decided. */
export const isDeckExhausted = (s: GameState): boolean =>
  s.deckIndex >= s.deck.length;

// --- Reducer ---

/** Advance to the next card after a PASS/BUY, resolving a win if the deck runs out. */
function advance(state: GameState): GameState {
  const deckIndex = state.deckIndex + 1;
  return {
    ...state,
    deckIndex,
    phase: deckIndex >= state.deck.length ? "won" : "playing",
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START": {
      const shuffle = action.shuffle ?? false;
      return {
        phase: "playing",
        guest: action.guest,
        startingBudget: action.budget,
        shuffle,
        deck: getDeck({ shuffle }),
        deckIndex: 0,
        collected: [],
        spent: 0,
      };
    }

    case "PASS": {
      if (state.phase !== "playing") return state;
      return advance(state);
    }

    case "BUY": {
      if (state.phase !== "playing") return state;
      const watch = currentWatch(state);
      if (!watch) return state;

      const spent = state.spent + watch.price;
      const collected = [...state.collected, watch];

      // Busting the budget ends the game immediately (the watch is still kept,
      // so it shows on the "COLLECTION RUINED" screen).
      if (spent > state.startingBudget) {
        return { ...state, collected, spent, phase: "lost" };
      }
      return advance({ ...state, collected, spent });
    }

    case "CASH_OUT": {
      if (state.phase !== "playing") return state;
      return { ...state, phase: "won" };
    }

    // Quick re-run: keep guest + budget, build a fresh deck, jump back into play.
    case "PLAY_AGAIN": {
      return {
        ...state,
        deck: getDeck({ shuffle: state.shuffle }),
        deckIndex: 0,
        collected: [],
        spent: 0,
        phase: "playing",
      };
    }

    // Back to Setup, but keep guest + budget pre-filled so they can edit.
    case "RESET": {
      return {
        ...createInitialState(),
        guest: state.guest,
        startingBudget: state.startingBudget,
        shuffle: state.shuffle,
      };
    }

    default:
      return state;
  }
}
