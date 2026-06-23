#!/usr/bin/env python3
"""Remove the background from every watch JPG in public/watches/.

Uses rembg (u2net) to cut the watch out of its white studio background and
writes a transparent PNG. JPEG can't store alpha, so the source .jpg is
replaced by a .png. Run scripts/convert_to_jpg.py first to normalize inputs.

Usage:
    python3 scripts/remove_bg.py [--no-matting] [--keep-jpg]
"""
from __future__ import annotations

import argparse
import io
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

WATCH_DIR = Path(__file__).resolve().parent.parent / "public" / "watches"


def cut(path: Path, session, matting: bool) -> Path:
    target = path.with_suffix(".png")
    src = Image.open(path).convert("RGB")
    out = remove(
        src,
        session=session,
        # alpha matting refines hairline edges (bracelet links, lugs)
        alpha_matting=matting,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=8,
        post_process_mask=True,
    )
    out.save(target, "PNG", optimize=True)
    return target


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-matting", action="store_true", help="faster, slightly rougher edges")
    ap.add_argument("--keep-jpg", action="store_true", help="don't delete the source .jpg")
    args = ap.parse_args()

    session = new_session("u2net")
    jpgs = sorted(WATCH_DIR.glob("*.jpg"))
    if not jpgs:
        print("No .jpg files found in", WATCH_DIR)
        return

    for p in jpgs:
        out = cut(p, session, matting=not args.no_matting)
        kb = out.stat().st_size // 1024
        print(f"{p.name:50s} -> {out.name}  ({kb}k)")
        if not args.keep_jpg:
            p.unlink()

    print(f"\nDone. {len(jpgs)} processed.")


if __name__ == "__main__":
    main()
