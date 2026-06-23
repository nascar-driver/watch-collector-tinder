import { forwardRef } from "react";
import type { Watch } from "@/app/lib/types";
import { formatMoney, formatHandle } from "@/app/lib/format";
import { Logo } from "@/app/components/brand/Logo";

export const CARD_W = 1080;
export const CARD_H = 1350;

const INNER_W = CARD_W - 72 * 2; // content width inside padding

interface CollectionCardProps {
  name: string;
  handle: string;
  budget: number;
  spent: number;
  collected: Watch[];
  lost: boolean;
}

// Brand tokens (mirrors globals.css). Solid colors only — gradient text via
// background-clip is unreliable when rasterized by html-to-image.
const GOLD = "#e9cd9a";
const GOLD_DEEP = "#c9a96e";
const BUST = "#e5484d";
const CREAM = "#f5ecd9";
const MUTED = "rgba(245, 236, 217, 0.55)";
const HAIRLINE = "rgba(216, 185, 135, 0.22)";

function fmtSigned(n: number): string {
  return n < 0 ? `-${formatMoney(-n)}` : formatMoney(n);
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 6px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 36,
          whiteSpace: "nowrap",
          color: color ?? CREAM,
        }}
      >
        {value}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 8,
          fontSize: 20,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 20,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: MUTED,
      }}
    >
      {children}
    </div>
  );
}

/** Cumulative-value line/area chart — the collection growing over the run. */
function GrowthGraph({ collected, lost }: { collected: Watch[]; lost: boolean }) {
  const W = INNER_W;
  const H = 240;

  if (collected.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          width: W,
          height: H,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 18,
          border: `1px dashed ${HAIRLINE}`,
          color: MUTED,
          fontSize: 24,
        }}
      >
        No watches collected
      </div>
    );
  }

  // Cumulative spend after each purchase, starting from a 0 baseline.
  const cums = [0];
  for (const w of collected) cums.push(cums[cums.length - 1] + w.price);
  const max = cums[cums.length - 1] || 1;
  const n = cums.length;
  // Inset so strokes/dots at the edges aren't clipped by the SVG bounds
  // (otherwise the crash line on the right edge renders at half thickness).
  const PADX = 8;
  const innerW = W - PADX * 2;
  const px = (i: number) => (n === 1 ? W / 2 : PADX + (i / (n - 1)) * innerW);
  const py = (v: number) => H - 6 - (v / max) * (H - 12);
  const pts = cums.map((v, i) => [px(i), py(v)] as const);
  // On a ruined run, crash straight down from the peak to the baseline.
  const peak = pts[pts.length - 1];
  const linePts = lost ? [...pts, [peak[0], py(0)] as const] : pts;
  const line = linePts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  const lastX = linePts[linePts.length - 1][0];
  const area = `${line} L ${lastX} ${H} L ${pts[0][0]} ${H} Z`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="pf-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GOLD} stopOpacity="0.35" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#pf-grad)" />
      <path
        d={line}
        fill="none"
        stroke={GOLD}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={5} fill={GOLD} />
      ))}
    </svg>
  );
}

/**
 * The downloadable 1080×1350 collection card (portrait, X / IG Stories /
 * Telegram / Discord friendly). Rendered off-screen at full size and captured
 * to PNG by <DownloadCardModal />.
 */
export const CollectionCard = forwardRef<HTMLDivElement, CollectionCardProps>(
  function CollectionCard({ name, handle, budget, spent, collected, lost }, ref) {
    const remaining = budget - spent;
    const h = formatHandle(handle);
    const displayName = name.trim() || "A collector";
    const top3 = [...collected].sort((a, b) => b.price - a.price).slice(0, 3);

    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          height: CARD_H,
          display: "flex",
          flexDirection: "column",
          padding: 72,
          boxSizing: "border-box",
          borderRadius: 44,
          overflow: "hidden",
          backgroundImage:
            "linear-gradient(150deg, #000 0%, #0c0309 38%, #3e0f28 100%)",
          fontFamily: "var(--font-made-carving), sans-serif",
          color: CREAM,
        }}
      >
        {/* Brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Logo size={42} />
            <span style={{ display: "flex", fontSize: 34, color: GOLD }}>
              watch.fun
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            Watch Collector Tinder
          </div>
        </div>

        {/* Headline + collector */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 36 }}>
          <div
            style={{
              display: "flex",
              fontSize: 62,
              lineHeight: 1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: lost ? BUST : GOLD,
            }}
          >
            {lost ? "Collection Ruined" : "Collection Complete"}
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 34, color: CREAM }}>
            {displayName}
            {h ? <span style={{ color: MUTED }}>&nbsp;· {h}</span> : ""}
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 36,
            paddingTop: 30,
            paddingBottom: 30,
            borderTop: `1px solid ${HAIRLINE}`,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <Stat label="Budget" value={formatMoney(budget)} />
          <Stat label="Spent" value={formatMoney(spent)} />
          <Stat
            label="Remaining"
            value={fmtSigned(remaining)}
            color={remaining < 0 ? BUST : GOLD}
          />
        </div>

        {/* Top 3 watches */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 32, gap: 14 }}>
          <SectionLabel>Top Watches</SectionLabel>
          <div style={{ display: "flex", gap: 22 }}>
            {top3.map((w, i) => (
              <div
                key={`${w.id}-${i}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: (INNER_W - 22 * 2) / 3,
                  height: 250,
                  padding: 18,
                  boxSizing: "border-box",
                  borderRadius: 18,
                  backgroundColor: "rgba(8, 5, 10, 0.55)",
                  border: `1px solid rgba(216, 185, 135, 0.16)`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.image}
                    alt={w.model}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 130,
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 18,
                    color: CREAM,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {w.brand} {w.model}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 4,
                    fontSize: 20,
                    color: GOLD_DEEP,
                  }}
                >
                  {formatMoney(w.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio growth graph */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 28, gap: 14 }}>
          <SectionLabel>Portfolio Growth</SectionLabel>
          <GrowthGraph collected={collected} lost={lost} />
        </div>

        {/* Footer — total collection value */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 30,
            borderTop: `1px solid ${HAIRLINE}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              Total Collection Value
            </div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 64, color: GOLD }}>
              {formatMoney(spent)}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: MUTED }}>
            {collected.length} watches
          </div>
        </div>
      </div>
    );
  },
);
