import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Branded social-share card (Open Graph + Twitter). Built on the finished
// brand artwork (og-base.png: eye logomark + "watch.fun" wordmark over the
// purple/gold ambiance) with the "Watch Collector Tinder" tagline overlaid.
// Next.js auto-wires the <meta> tags; twitter-image.tsx re-exports this.
export const alt = "watch.fun — Watch Collector Tinder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [bg, bold] = await Promise.all([
    readFile(join(process.cwd(), "app/og-base.png")),
    readFile(join(process.cwd(), "app/fonts/MADECARVING-Bold.otf")),
  ]);
  const bgDataUri = `data:image/png;base64,${bg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "MADE CARVING",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgDataUri}
          width={size.width}
          height={size.height}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 700,
              letterSpacing: "0.04em",
              // Match the .text-gold-gradient brand style used for "Collector
              // Tinder" on the setup screen (globals.css).
              backgroundImage: "linear-gradient(135deg, #ebcc99, #a7855b)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Watch Collector Tinder
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "MADE CARVING", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
