# Collector Tinder — Build Plan & Tech Reference

> Watch.fun developer test. A livestream-friendly, single-operator web game where a guest
> builds a watch collection under a budget by swiping **BUY / PASS**, with a **CASH OUT**
> escape hatch. Used live and screen-shared via StreamYard. No backend, no auth, no guest device.
>
> Source of truth: `_reference/watch-collector-tinder-prd.md` + `_reference/brand_guideline/`.
> This file is the working plan — keep it updated as decisions change.

---

## 1. Locked decisions (from PRD + user)

| Topic | Decision |
|-------|----------|
| **Lose condition** | Player may BUY past remaining budget; doing so triggers loss when `spent > startingBudget`. |
| **Cash Out** | Voluntary stop → a "Complete"/win-style summary; walk away with collected watches. |
| **Price visibility** | **HIDDEN until the guest decides.** Card shows image/brand/model only; price is concealed during the BUY/PASS decision and revealed *after* the choice (on BUY it's revealed + deducted, busting them if it overshoots). This is the core tension. **The PRD's "Market value" on the game screen is overridden** (user-confirmed). Logic is already price-visibility-agnostic, so this is UI-only. Price IS shown on end screens + social card. **On PASS, briefly flash the skipped watch's price too** (option A — adds livestream drama). |
| **Accent color** | Brand base = **Purple / Black / Gold** (brand guideline). Per PRD, **ADD a green accent** for BUY/positive/success. Red for lose/bust. Gold stays primary luxury accent. (Brand guideline itself has NO green — this is an intentional PRD override.) |
| **Watch images** | **Branded placeholder cards** now (brand/model on gold-gradient/dark). Real transparent-bg PNGs swapped into `/public/watches/` later. |
| **Logo** | Provided at `app/assets/logo.svg` (eye logomark, transparent bg, gold `#F4E5B8`). Inline for recolor; pair with `watch.fun` MADE CARVING wordmark. |
| **Theme** | Locked to **dark** (`globals.css`, `color-scheme: dark`). Stream-friendly. |
| **Font** | MADE CARVING via `next/font/local` (already wired). Personal-use files during dev; swap licensed before deploy. |

---

## 2. Brand tokens (brand_guideline/Color Palette)

```
Purple   #3E0F28   (deep wine / aubergine)   — secondary surface / brand
Black    #000000                              — base
Gold gradient  #EBCC99 → #D8B987 → #D7A874 → #A7855B   — primary luxury accent
Cream    ~#FBF0D9                              — light paper bg (used sparingly on dark)
Foreground (app) #f5ecd9                       — warm off-white text on dark
Green accent  (PRD) — TBD exact value; emerald that sits with gold/purple, BUY/win
Red/bust      — lose state
```

Typography (MADE CARVING): Title = Regular, 0% tracking, ALL CAPS · Body = Light, 0% ·
Small & Buttons = Regular, **5% letter-spacing**. Titles gold, body cream.
Imagery motif: eclipse / corona / light-streaks, Multiply/Darken/Luminosity over purple/black/gold.
Tone: premium + mysterious + rebellious, with a web3/degen meme overlay (per metadata copy).

---

## 3. Tech stack & library research

Target runtime: **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4**. Client-only, no backend.

### 3.1 Swipe deck + animation — **Motion** (`motion`, import `motion/react`)
- **Why:** `react-tinder-card` is effectively unmaintained (last meaningful publish ~3 yrs ago) — rejected to avoid deprecation risk. The modern professional pattern for Tinder-style decks is to build on **Motion** (formerly *Framer Motion*; rebranded, package renamed to `motion`, import path `motion/react`). v12, **fully supports React 19 + Next.js 16**, no API breaking changes from framer-motion.
- **How:** a single `<motion.div drag="x">` per top card + `useMotionValue(x)` → `useTransform` for rotation/opacity and BUY/PASS color tint; `onDragEnd` checks velocity/offset threshold to commit a swipe; `AnimatePresence` for card exit + next-card reveal. Gives swipe gesture, spring physics, and screen transitions from one dependency.
- **Rejected alternatives:** `react-tinder-card` (stale); `react-spring` + `@use-gesture` (fine but two deps, Motion covers both); hand-rolled pointer math (reinvents physics, less polished).

### 3.2 Social card PNG — **`html-to-image`**
- **Why:** actively maintained, ~1.6M downloads/mo, strong web-font + SVG handling, fully client-side (fits "no backend"). Fork of `dom-to-image` with better reliability than `html2canvas` for text/vector-heavy layouts.
- **How:** render an off-screen, fixed **1080×1350** React node styled for export, then `toPng(node, { pixelRatio, cacheBust, fontEmbedCSS })` → trigger download.
- **Gotchas to handle:** (1) embed MADE CARVING into the snapshot (preload + `getFontEmbedCSS`) so the downloaded image isn't a fallback font; (2) watch images must be same-origin or CORS-enabled (placeholders are local → safe); (3) render at `pixelRatio` for crispness; (4) wait for fonts/images `decode()` before capture.
- **Rejected alternatives:** `satori`/`@vercel/og` (server/edge-oriented, needs a route + adds build complexity; reconsider only if we later want server-generated share links); `html2canvas` (older, weaker font handling); `dom-to-image` (less maintained parent).

### 3.3 State — **`useReducer` + Context**
- Small, deterministic state machine; zero dependencies. Escalate to `zustand` only if state outgrows this (not expected for the test scope).

### 3.4 Styling — **Tailwind v4** (already installed) + CSS tokens in `globals.css`.

### New dependencies to add
```
motion          # swipe deck + animations (formerly framer-motion)
html-to-image   # client-side 1080x1350 PNG export
```

---

## 4. Architecture / file structure

```
app/
  layout.tsx                 # fonts, metadata, dark lock (done)
  globals.css                # brand tokens + dark theme
  page.tsx                   # mounts GameProvider + phase router
  assets/logo.svg            # eye logomark (provided)
  fonts/                     # MADE CARVING (done)
  data/
    watches.ts               # typed deck (~16–20 watches, placeholder images)
  lib/
    types.ts                 # Watch, GameState, Phase, Action
    game.ts                  # pure reducer + helpers (budget math, lose/win checks)
    format.ts                # currency / number formatting
  state/
    GameProvider.tsx         # useReducer + Context, keyboard bindings
  components/
    screens/
      SetupScreen.tsx        # name, X handle, starting budget → start
      GameScreen.tsx         # HUD + swipe deck + controls
      LoseScreen.tsx         # COLLECTION RUINED + summary + actions
      WinScreen.tsx          # COLLECTION COMPLETE + summary + actions
    game/
      WatchCard.tsx          # motion draggable card (image/brand/model/price)
      SwipeDeck.tsx          # stack + AnimatePresence + swipe→action
      Hud.tsx                # original / remaining / spent / collected
      ControlBar.tsx         # PASS · BUY · CASH OUT
      MoneyCounter.tsx       # animated number
    share/
      ResultCard.tsx         # off-screen 1080x1350 export layout
      useDownloadCard.ts     # html-to-image capture + download
    brand/
      Logo.tsx               # inline svg + wordmark, colorway prop
public/
  watches/                   # real transparent PNGs later
```

---

## 5. Game logic spec (`lib/game.ts`, pure & testable)

```
Phase = 'setup' | 'playing' | 'won' | 'lost'

GameState {
  phase
  guest: { name, xHandle }
  startingBudget: number
  deckIndex: number
  collected: Watch[]          // bought watches
  spent: number               // sum of collected prices
}

derived: remaining = startingBudget - spent
         currentWatch = deck[deckIndex]

Actions:
  START({name, xHandle, budget})  -> phase=playing, reset deck/collected/spent
  PASS                            -> deckIndex++  (win if deck exhausted)
  BUY                             -> collected+=current, spent+=price, deckIndex++
                                     if spent > startingBudget -> phase=lost
                                     else if deck exhausted     -> phase=won
  CASH_OUT                        -> phase=won
  RESET                           -> phase=setup (Play Again keeps or clears guest? see open Q)
```

Edge cases: empty deck guard; budget must be > 0; last-card BUY resolves to won/lost not stuck.

---

## 6. Screens

1. **Setup** — Guest Name, X Handle (`@`), Starting Budget. Validation, big stream-legible inputs, Start. Branded backdrop.
2. **Game** — top: HUD (Original / Remaining / Spent / Collected count). center: swipe deck (one watch card). bottom: PASS · BUY · CASH OUT. Inputs: drag-swipe, button click, **keyboard (← PASS, → BUY, space = BUY, Esc/C = CASH OUT)** for the interviewer. Live money counters animate.
3. **Lose** — `COLLECTION RUINED`, Budget + Spent, grid of all collected watches, **Download Result Card** + **Play Again**.
4. **Win** (deck complete OR cash out) — `COLLECTION COMPLETE`, Budget + Spent + Remaining, grid of accepted watches, **Download Collection Card** + **Play Again**.

---

## 7. Social card (`share/ResultCard.tsx`)

- Fixed **1080×1350**, branded (purple/black/gold, gold-gradient title, logo, MADE CARVING, meme energy).
- Content: collector name, X handle, budget, spent, remaining, watch images + names + prices, total collection value, win/ruined state.
- Capture via `html-to-image` `toPng` with font embedding + image decode wait; download as `watchfun-collection-<handle>.png`.
- Must read well as a thumbnail on X / IG Stories / Telegram / Discord (large type, high contrast).

---

## 8. Build sequence (milestones)

1. **Foundations** — brand tokens in `globals.css`; clean starter `page.tsx`; add `motion` + `html-to-image`.
2. **Data + types** — `watches.ts`, `types.ts`.
3. **Logic** — `game.ts` reducer + `GameProvider` + keyboard.
4. **Setup screen**.
5. **Game screen** — HUD, `WatchCard`, `SwipeDeck` (Motion), `ControlBar`. End-to-end loop working (rough styling ok).
6. **End screens** — Win + Lose.
7. **Social card** — `ResultCard` + download.
8. **Brand polish** — animations, eclipse/gold ambiance, money counters, responsive screen-share framing.
9. **Writeup** (deliverable #3): architecture, tradeoffs, future improvements.

Deliverables: live demo URL · GitHub repo · writeup.
Evaluation focus: product thinking, UI/UX, livestream usability, visual polish, code quality, attention to detail, social card.

---

## 9. Open questions / risks

- **Green accent exact value** — pick a final emerald hex (sits with gold/purple). Proposed `#1Fae6f`-ish; confirm.
- ~~**Play Again**~~ — RESOLVED: `PLAY_AGAIN` keeps guest + budget and starts a fresh run immediately; `RESET` returns to Setup with guest + budget pre-filled for editing.
- **Deck order** — fixed authored order vs shuffled each game? (Shuffle adds replayability for repeat guests; confirm.)
- ~~**Watch dataset**~~ — DONE: 25 watches, 5 tiers (Tier 1 = cheap meme watches Casio/Swatch/Seiko; Tiers 2–5 = WristCheck luxury, $3.3k→$442.8k). Sourced from wristcheck.com (Watch.fun's partner) — Tier 5 + Daytona Panda are exact WristCheck listings; mid tiers use WristCheck index prices. Prices approximate; **real transparent PNGs still needed** (placeholders for now). See [[watch-dataset]] memory.
- **Font license** — swap licensed MADE CARVING before any public deploy (company owns it).
- **Logo recolor** — provided SVG is single gold tone; inline + `fill=currentColor` for purple-on-gold colorway if needed.
- **Repo hygiene** — `made_carving/` source folder + personal-use fonts should not ship to production build; confirm `.gitignore`/deploy handling.

---

## 10. Reference index

- PRD: `_reference/watch-collector-tinder-prd.md`
- Brand: `_reference/brand_guideline/` (Logo*.pdf, Typography.png, Layout Examples*, Illustration Style* + Color Palette)
- Font + license: `made_carving/`, `app/fonts/`
- Memory: `.claude/projects/.../memory/` (brand-palette, font-licensing)
```
