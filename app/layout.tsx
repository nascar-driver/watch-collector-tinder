import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Brand typeface: MADE CARVING (per WATCH.FUN brand guidelines).
// Body uses Light (300); titles, small text and buttons use Regular (400).
const madeCarving = localFont({
  variable: "--font-made-carving",
  display: "swap",
  src: [
    {
      path: "./fonts/MADECARVINGPersonalUse-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/MADECARVINGPersonalUse-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MADECARVINGPersonalUse-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/MADECARVINGPersonalUse-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/MADECARVINGPersonalUse-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/MADECARVINGPersonalUse-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "watch.fun — Watch Collector Tinder",
    template: "watch.fun — %s",
  },
  description:
    "Swipe, ape, or pass. Stack the ultimate watch collection without getting rekt by your budget.🕰️",
  applicationName: "Watch Collector Tinder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${madeCarving.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
