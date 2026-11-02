#!/usr/bin/env python3
"""Create vertical 9:16 storyboard stubs with black inpaint bars for adult evening CGs.
Cursor image gen rejects explicit frames; composition + face area stay open for later inpaint.
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "assets"
ART = ROOT / "artwork" / "adult-evenings"
PEOPLE = [
    "milica", "dragan", "jelena", "asya", "luka", "ana", "stefan", "marko",
    "vuk", "lazar", "teodora", "ivana", "strahinya", "milos",
]
# Nikola already has real CGs — skip.
BEATS = [
    ("seductive", "look", (0.35, 0.55, 0.65, 0.82)),
    ("door", "door", (0.30, 0.50, 0.70, 0.88)),
    ("briefs", "bed", (0.25, 0.48, 0.75, 0.90)),
    ("touch", "touch", (0.28, 0.52, 0.72, 0.88)),
    ("ready", "ready", (0.22, 0.45, 0.78, 0.92)),
    ("sex", "sex", (0.20, 0.42, 0.80, 0.94)),
    ("climax", "face", (0.30, 0.28, 0.70, 0.55)),
    ("cum-inside", "finish", (0.25, 0.50, 0.75, 0.92)),
    ("cum-cloth", "finish", (0.25, 0.50, 0.75, 0.92)),
    ("cum-chest", "finish", (0.28, 0.40, 0.72, 0.75)),
    ("afterglow", "after", (0.25, 0.55, 0.75, 0.90)),
]
W, H = 1080, 1920


def font(size: int):
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def make(person: str, beat: str, label: str, bar: tuple[float, float, float, float]) -> Path:
    img = Image.new("RGB", (W, H), (18, 22, 34))
    draw = ImageDraw.Draw(img)
    # Warm lamp pool
    for r, a in ((520, 40), (360, 70), (220, 110)):
        overlay = Image.new("RGB", (W, H), (18, 22, 34))
        od = ImageDraw.Draw(overlay)
        od.ellipse((W // 2 - r, int(H * 0.28) - r, W // 2 + r, int(H * 0.28) + r), fill=(70, 48, 28))
        img = Image.blend(img, overlay, a / 255)
        draw = ImageDraw.Draw(img)
    # Head / shoulders silhouette (open for identity inpaint)
    cx, cy = W // 2, int(H * 0.32)
    draw.ellipse((cx - 120, cy - 150, cx + 120, cy + 150), fill=(42, 36, 48))
    draw.rounded_rectangle((cx - 160, cy + 120, cx + 160, int(H * 0.55)), radius=40, fill=(42, 36, 48))
    # Black inpaint bar
    x0, y0, x1, y1 = bar
    draw.rectangle((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)), fill=(0, 0, 0))
    # Labels
    title = f"{person} · {beat}"
    draw.text((48, 48), "SERBIAN SUMMER · 18+ STORYBOARD", fill=(180, 160, 120), font=font(28))
    draw.text((48, 100), title, fill=(240, 230, 210), font=font(44))
    draw.text((48, 170), f"inpaint zone: {label}", fill=(160, 150, 140), font=font(28))
    draw.text((48, H - 80), "replace black bar only · keep face", fill=(140, 130, 120), font=font(26))
    out = OUT / f"{person}-night-{beat}-v1.webp"
    img.save(out, "WEBP", quality=86, method=6)
    return out


def main() -> None:
    ART.mkdir(parents=True, exist_ok=True)
    made = []
    for person in PEOPLE:
        for beat, label, bar in BEATS:
            path = make(person, beat, label, bar)
            made.append(path.name)
    manifest = {
        "note": "Storyboard stubs with black bars for inpaint. Nikola reuses existing riverside-night CGs.",
        "files": made,
        "beats": [b[0] for b in BEATS],
        "people": PEOPLE,
    }
    (ART / "STORYBOARDS.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(made)} storyboards → {OUT}")


if __name__ == "__main__":
    main()
