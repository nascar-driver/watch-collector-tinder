"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "motion/react";
import { toPng } from "html-to-image";
import { Download, Loader2 } from "lucide-react";
import type { Watch } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CollectionCard, CARD_W, CARD_H } from "./CollectionCard";

interface DownloadCardModalProps {
  name: string;
  handle: string;
  budget: number;
  spent: number;
  collected: Watch[];
  lost: boolean;
  triggerClassName?: string;
}

// Scale the full-size 1080×1350 card down for the on-screen preview.
const PREVIEW_W = 420;
const SCALE = PREVIEW_W / CARD_W;
const MAX_TILT = 10;

export function DownloadCardModal({
  name,
  handle,
  budget,
  spent,
  collected,
  lost,
  triggerClassName,
}: DownloadCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  // Mouse tilt for the preview only — springs back to flat on leave.
  const tiltX = useSpring(0, { stiffness: 150, damping: 15 });
  const tiltY = useSpring(0, { stiffness: 150, damping: 15 });

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * MAX_TILT);
    tiltX.set(-py * MAX_TILT);
  };
  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const handleDownload = async () => {
    if (!cardRef.current || busy) return;
    setBusy(true);
    try {
      // Render twice — the first pass primes font/image embedding, the second
      // reliably captures them (a known html-to-image quirk).
      const opts = {
        width: CARD_W,
        height: CARD_H,
        pixelRatio: 1,
        cacheBust: true,
      };
      await toPng(cardRef.current, opts);
      const dataUrl = await toPng(cardRef.current, opts);

      const slug =
        name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "collection";
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `watch-fun-${slug}.png`;
      a.click();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={triggerClassName}>
          Download
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-gold-gradient text-2xl uppercase">
            Your Collection Card
          </DialogTitle>
          <DialogDescription>
            Download a {CARD_W}×{CARD_H} PNG to share on X, Instagram, Telegram,
            or Discord.
          </DialogDescription>
        </DialogHeader>

        {/* On-screen preview (scaled + tiltable). */}
        <div className="flex justify-center py-2">
          <motion.div
            className="overflow-hidden rounded-2xl shadow-2xl"
            style={{
              width: PREVIEW_W,
              height: CARD_H * SCALE,
              rotateX: tiltX,
              rotateY: tiltY,
              transformPerspective: 900,
            }}
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
          >
            <div
              style={{
                transform: `scale(${SCALE})`,
                transformOrigin: "top left",
              }}
            >
              <CollectionCard
                ref={cardRef}
                name={name}
                handle={handle}
                budget={budget}
                spent={spent}
                collected={collected}
                lost={lost}
              />
            </div>
          </motion.div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={busy}
          className="h-12 w-full text-base"
        >
          {busy ? (
            <>
              <Loader2 className="animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Download /> Download PNG
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
