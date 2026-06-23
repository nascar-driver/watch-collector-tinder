import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Branded social-share card (Open Graph + Twitter). Next.js auto-wires the
// resulting <meta> tags from this file; twitter-image.tsx re-exports it.
export const alt = "watch.fun — Watch Collector Tinder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The all-seeing-eye logomark (from components/brand/Logo.tsx) with the brand
// gold gradient baked in, as a standalone SVG we can embed as an <img>.
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 40 40" fill="none"><defs><linearGradient id="g" x1="0" x2="5.606" y1="0" y2="44.348" gradientUnits="userSpaceOnUse"><stop stop-color="#A7855B"/><stop offset="0.25" stop-color="#D8B987"/><stop offset="0.5" stop-color="#EBCC99"/><stop offset="0.75" stop-color="#D7A874"/><stop offset="1" stop-color="#A7855B"/></linearGradient></defs><path fill="url(#g)" d="M40.064 19.866q0-.667-.052-1.322C39.259 8.236 30.649.074 20.145 0h-.292C9.35.075.739 8.239-.012 18.544q-.049.656-.053 1.322v.292q0 .666.053 1.323C.74 31.788 9.352 39.952 19.853 40.026h.292c10.504-.074 19.114-8.24 19.866-18.545q.048-.656.052-1.323zM28.72 4.688a17.8 17.8 0 0 1 6.645 6.629c.333.582-.322 1.233-.905.9a14 14 0 0 0-.56-.305 23.4 23.4 0 0 0-4.103-1.672 23.3 23.3 0 0 0-1.673-4.096q-.15-.285-.307-.556a.66.66 0 0 1 .109-.795.67.67 0 0 1 .797-.108m-8.723-2.297c2.828 0 5.397 2.843 7.017 7.148a36.3 36.3 0 0 0-14.033 0c1.62-4.306 4.187-7.148 7.016-7.148m1.616 17.625a1.61 1.61 0 0 1-1.04 1.511 34 34 0 0 1-.577 4.976 34 34 0 0 1-.578-4.976 1.614 1.614 0 0 1-.754-2.422c.185-.269.448-.475.754-.592.071-1.67.264-3.333.578-4.975.314 1.642.508 3.305.578 4.975a1.61 1.61 0 0 1 1.038 1.51M4.633 11.318a17.8 17.8 0 0 1 6.645-6.63c.584-.33 1.237.323.906.903-.106.177-.208.368-.308.558A23 23 0 0 0 10.2 10.24a23.4 23.4 0 0 0-4.098 1.672q-.285.15-.557.305a.66.66 0 0 1-.906-.9m-2.287 8.689a.95.95 0 0 1 .31-.697c1.404-1.274 3.697-3.152 6.557-4.749a28 28 0 0 1 2.687-1.326 22.2 22.2 0 0 1 5.141-1.536 8.84 8.84 0 0 0-3.942 2.79 8.8 8.8 0 0 0-1.883 4.44v.005a9 9 0 0 0 0 2.16v.005a8.8 8.8 0 0 0 1.888 4.442 8.85 8.85 0 0 0 3.949 2.788h-.008a22.3 22.3 0 0 1-5.14-1.541 29 29 0 0 1-2.692-1.328C6.365 23.863 4.074 22 2.666 20.72a.96.96 0 0 1-.314-.712zm8.927 15.333a17.8 17.8 0 0 1-6.645-6.63c-.333-.581.323-1.234.906-.9.177.104.367.205.557.306a23.5 23.5 0 0 0 4.103 1.672 23.3 23.3 0 0 0 1.673 4.094q.15.285.308.557a.66.66 0 0 1-.11.794.666.666 0 0 1-.796.11M20 37.636c-2.828 0-5.397-2.843-7.016-7.15a35.3 35.3 0 0 0 7.016.686 35.3 35.3 0 0 0 7.017-.685c-1.621 4.309-4.188 7.15-7.017 7.15m15.365-8.927a17.76 17.76 0 0 1-6.646 6.63c-.583.331-1.237-.322-.903-.905q.156-.267.306-.556a23.3 23.3 0 0 0 1.676-4.092 23.7 23.7 0 0 0 4.106-1.67q.285-.15.56-.306c.582-.332 1.236.319.905.9m2.281-8.698a.95.95 0 0 1-.312.705c-1.409 1.276-3.7 3.146-6.557 4.745a28 28 0 0 1-2.687 1.326 22.3 22.3 0 0 1-5.138 1.542h-.01a8.83 8.83 0 0 0 5.832-7.244 8.8 8.8 0 0 0 0-2.132 8.82 8.82 0 0 0-5.824-7.24c1.769.305 3.495.822 5.14 1.539q1.375.587 2.685 1.316c2.861 1.6 5.155 3.473 6.564 4.75.196.178.307.43.307.694"/></svg>`;

const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString("base64")}`;

export default async function OpengraphImage() {
  const [light, bold] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/MADECARVING-Light.otf")),
    readFile(join(process.cwd(), "app/fonts/MADECARVING-Bold.otf")),
  ]);

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
          background:
            "radial-gradient(circle at 50% 18%, #2a1a24 0%, #0a0a0a 60%)",
          fontFamily: "MADE CARVING",
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri} width={220} height={220} alt="" />
        <div
          style={{
            display: "flex",
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginTop: 24,
            background:
              "linear-gradient(90deg, #A7855B, #EBCC99 50%, #A7855B)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          watch.fun
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 300,
            color: "#f5ecd9",
            opacity: 0.85,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Swipe, ape, or pass. Stack the ultimate collection.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "MADE CARVING", data: light, weight: 300, style: "normal" },
        { name: "MADE CARVING", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
