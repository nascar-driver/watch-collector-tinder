import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CurtainIntro } from "@/app/components/brand/CurtainIntro";
import { CashOutLoader } from "@/app/components/brand/CashOutLoader";

// Brand typeface: MADE CARVING (per WATCH.FUN brand guidelines), licensed.
// Body uses Light (300); titles, small text and buttons use Regular (400).
const madeCarving = localFont({
  variable: "--font-made-carving",
  display: "swap",
  src: [
    {
      path: "./fonts/MADECARVING-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/MADECARVING-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MADECARVING-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/MADECARVING-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/MADECARVING-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/MADECARVING-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
});

const TITLE = "watch.fun — Watch Collector Tinder";
const DESCRIPTION =
  "Swipe, ape, or pass. Stack the ultimate watch collection without getting rekt by your budget.🕰️";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://watch-collector-tinder.vercel.app/",
  ),
  title: {
    default: TITLE,
    template: "watch.fun — %s",
  },
  description: DESCRIPTION,
  applicationName: "Watch Collector Tinder",
  openGraph: {
    type: "website",
    siteName: "watch.fun",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    // og:image is auto-generated from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    site: "@watchdotfun",
    creator: "@watchdotfun",
    title: TITLE,
    description: DESCRIPTION,
    // twitter:image mirrors og:image (app/opengraph-image.tsx)
  },
  // icons come from app/icon.svg + app/favicon.ico (watch.fun.collect's mark)
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", madeCarving.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CurtainIntro />
        <CashOutLoader />
      </body>
    </html>
  );
}
