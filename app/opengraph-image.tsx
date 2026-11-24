import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Branded social-share card (Open Graph + Twitter), styled like watch.fun.collect's
// og.jpg: rays logomark + "watch.fun" wordmark over the charcoal/purple gradient,
// with the "Watch Collector Tinder" tagline. Next.js auto-wires og:image and
// mirrors it to twitter:image. The URL carries a hash of this file's source, so
// editing it gives Telegram/X a fresh URL; changing only icon.svg or the font
// does not, so bump this marker when you do.  og-version: 2
export const alt = "watch.fun — Watch Collector Tinder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [icon, bold] = await Promise.all([
    readFile(join(process.cwd(), "app/icon.svg")),
    readFile(join(process.cwd(), "app/fonts/MADECARVING-Bold.otf")),
  ]);
  const iconDataUri = `data:image/svg+xml;base64,${icon.toString("base64")}`;

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
          fontFamily: "MADE CARVING",
          backgroundImage:
            "radial-gradient(60% 70% at 85% 100%, rgba(112, 50, 207, 0.45), transparent 70%), linear-gradient(148deg, #000000, #242029)",
        }}
      >
        <img src={iconDataUri} width={180} height={180} alt="" />
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 112,
            fontWeight: 700,
            lineHeight: 1,
            color: "#EEE8DE",
          }}
        >
          watch<span style={{ color: "#9D5CFF" }}>.</span>fun
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#C198FF",
          }}
        >
          Watch Collector Tinder
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
