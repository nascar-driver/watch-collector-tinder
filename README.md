# watch.fun — Watch Collector Tinder

Swipe to **BUY** or **PASS** on luxury watches and build the best collection you can
without busting your budget. The catch: the price is **hidden** until after you decide.

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm test         # vitest (reducer + data)
```

Stacks **Next.js (App Router), React, TypeScript, Tailwind v4, shadcn/ui, Motion, Vitest**.

Deployed on [Vercel](https://vercel.com).

## Architecture

- **Pure reducer core.** All game logic lives in `app/lib/game.ts` as a pure
  `(state, action) => state` reducer plus derived selectors (`remaining`,
  `currentWatch`, …). It's framework-agnostic and unit-tested; React only wires
  it up via a `GameProvider` context, so the UI never owns game rules.
- **Phase state machine.** One `phase` (`setup → playing → won | lost`) drives
  which screen renders (`app/page.tsx`). No router — the whole game is one client
  view, so transitions are state changes, not navigations.
- **Static, typed data.** The watch catalogue is `watches.json` typed as
  `Watch[]`; decks are built (optionally shuffled) by `getDeck`. Images are
  transparent PNGs normalized **offline** (`scripts/normalize-watches.ps1`) to a
  uniform subject size, and preloaded so cards never load-in mid-game.
- **Motion as a separate layer.** Swipe/tilt/glare, the history tooltip, the
  curtain intro and cash-out loader are `motion` components kept apart from
  logic, so animation never blocks or couples to state.
- **Shareable result card.** The downloadable 1080×1350 PNG is a dedicated
  component rasterized by `html-to-image`.
- **Scripts**
  - `normalize-watches.ps1`: normalizes watch images to a uniform subject size.
  - `generate-watches.ts`: generates `watches.json` from the watch maker's website.
## Tradeoffs

- **Client-only, no backend.** Context + reducer is fast to build and zero-infra,
  but there's no persistence or leaderboard — a refresh resets the run.
- **Curated static prices** keep it simple and offline, at the cost of going
  stale; no live market feed.
- **Share card duplicates styling.** `html-to-image` can't reliably rasterize
  Tailwind/`background-clip` text, so the PNG uses inline styles and a fixed
  pixel budget — reliable output, but some style duplication.
- **Preload-everything** trades upfront bandwidth for instant cards. Fine for a
  small catalogue of PNGs; wouldn't scale to hundreds.
- **Manual Watch image extraction** manually extracted the watch images from the website.
## Future improvements

- Persist runs (localStorage) + shareable result URLs and a backend leaderboard.
- Live/periodic market pricing and a larger, categorized catalogue. (Long term goal)
- `next/image` (responsive/WebP) for the few oversized PNGs.
- `prefers-reduced-motion` support across the animation layer.
- Difficulty modes, deeper scoring, and sound effects.
- Python scripts for image normalization.
