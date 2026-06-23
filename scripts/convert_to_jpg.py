#!/usr/bin/env python3
"""Convert every watch image in public/watches/ to .jpg.

Source images come in mixed formats (.webp/.avif/.jpeg/.jpg). JPEG has no
alpha channel, so any transparency is flattened onto a background color first
(default white). Originals are removed after a successful convert.

Usage:
    python3 scripts/convert_to_jpg.py [--bg 255,255,255] [--quality 90]
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image
import pillow_avif  # noqa: F401  (registers the AVIF plugin via import side effect)

WATCH_DIR = Path(__file__).resolve().parent.parent / "public" / "watches"
SOURCE_EXTS = {".webp", ".avif", ".jpeg", ".png"}  # .jpg handled separately (rename only)


def convert(path: Path, bg: tuple[int, int, int], quality: int) -> Path:
    target = path.with_suffix(".jpg")
    with Image.open(path) as im:
        im = im.convert("RGBA")
        canvas = Image.new("RGB", im.size, bg)
        canvas.paste(im, mask=im.split()[3])  # composite using alpha
        canvas.save(target, "JPEG", quality=quality, optimize=True)
    if path != target:
        path.unlink()
    return target


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--bg", default="255,255,255", help="flatten background as R,G,B")
    ap.add_argument("--quality", type=int, default=90)
    args = ap.parse_args()
    bg = tuple(int(x) for x in args.bg.split(","))

    files = sorted(p for p in WATCH_DIR.iterdir() if p.suffix.lower() in SOURCE_EXTS)
    for p in files:
        out = convert(p, bg, args.quality)
        print(f"{p.name:50s} -> {out.name}")
    print(f"\nDone. {len(files)} converted. Folder now:")
    for p in sorted(WATCH_DIR.iterdir()):
        print(" ", p.name)


if __name__ == "__main__":
    main()
