import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { decodeResult } from "@/app/lib/share";
import { formatMoney, formatHandle } from "@/app/lib/format";

// Personalized social-share card for a finished run (/c/<data>). Decodes the
// stats from the URL and renders them on the brand gradient. Stats-only, so no
// per-watch image loading. Falls back to the generic tagline if the payload is
// malformed. Next.js auto-wires the <meta> tags; twitter-image re-exports this.
export const alt = "watch.fun — my watch collection";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens (mirrors globals.css).
const BG = "linear-gradient(135deg, #000, #000 25%, #3e0f28)";
const GOLD_GRADIENT = "linear-gradient(135deg, #ebcc99, #a7855b)";
const BUST = "#e5484d";
const CREAM = "#f5ecd9";
const MUTED = "rgba(245, 236, 217, 0.55)";

function Stat({
  label,
  value,
  color,
  gradient,
}: {
  label: string;
  value: string;
  color?: string;
  gradient?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 30px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 56,
          ...(gradient
            ? {
                backgroundImage: GOLD_GRADIENT,
                backgroundClip: "text",
                color: "transparent",
              }
            : { color: color ?? CREAM }),
        }}
      >
        {value}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 8,
          fontSize: 22,
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

export default async function Image({
  params,
}: {
  params: Promise<{ data: string }>;
}) {
  const { data } = await params;
  const result = decodeResult(data);

  const bold = await readFile(
    join(process.cwd(), "app/fonts/MADECARVING-Bold.otf"),
  );

  const lost = result?.o === "l";
  const remaining = result ? result.b - result.s : 0;
  const handle = result ? formatHandle(result.h) : "";
  const name = result?.n?.trim() || "A collector";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundImage: BG,
          fontFamily: "MADE CARVING",
        }}
      >
        {result ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0 64px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 78,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                ...(lost
                  ? { color: BUST }
                  : {
                      backgroundImage: GOLD_GRADIENT,
                      backgroundClip: "text",
                      color: "transparent",
                    }),
              }}
            >
              {lost ? "Collection Ruined" : "Collection Complete"}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 14,
                fontSize: 32,
                color: CREAM,
              }}
            >
              {name}
              {handle ? (
                <span style={{ color: MUTED }}>&nbsp;· {handle}</span>
              ) : (
                ""
              )}
            </div>
            <div style={{ display: "flex", marginTop: 56 }}>
              <Stat label="Budget" value={formatMoney(result.b)} />
              <Stat label="Spent" value={formatMoney(result.s)} />
              <Stat
                label="Remaining"
                value={
                  remaining < 0
                    ? `-${formatMoney(-remaining)}`
                    : formatMoney(remaining)
                }
                color={remaining < 0 ? BUST : undefined}
                gradient={remaining >= 0 && !lost}
              />
              <Stat label="Watches" value={String(result.w.length)} />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: 64,
              letterSpacing: "0.04em",
              backgroundImage: GOLD_GRADIENT,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Watch Collector Tinder
          </div>
        )}

        {/* Brand wordmark, anchored bottom. */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            display: "flex",
            fontSize: 30,
            letterSpacing: "0.02em",
            backgroundImage: GOLD_GRADIENT,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          watch.fun
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "MADE CARVING", data: bold, weight: 700, style: "normal" }],
    },
  );
}
