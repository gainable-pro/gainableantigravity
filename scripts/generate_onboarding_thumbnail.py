from PIL import Image, ImageDraw, ImageFont
import os

img_path = r"public\images\thumbnail-onboarding-frame.jpg"
out_path = r"public\images\thumbnail-onboarding-play.jpg"

if os.path.exists(img_path):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size

    # Create dark overlay with slight gold vignette
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Draw semi-transparent gradient/overlay
    draw.rectangle([0, 0, width, height], fill=(15, 23, 42, 60))

    # Outer circle for Play button
    cx, cy = width // 2, height // 2
    r_outer = 48
    r_inner = 40

    # Glow / Outer circle
    draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], fill=(213, 155, 43, 200))
    draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=(213, 155, 43, 255))

    # Play triangle inside circle
    tri_pts = [
        (cx - 12, cy - 18),
        (cx - 12, cy + 18),
        (cx + 20, cy)
    ]
    draw.polygon(tri_pts, fill=(255, 255, 255, 255))

    # Bottom banner
    banner_h = 50
    draw.rectangle([0, height - banner_h, width, height], fill=(15, 23, 42, 230))

    final_img = Image.alpha_composite(img, overlay).convert("RGB")
    final_img.save(out_path, "JPEG", quality=90)
    print(f"Saved {out_path}")
else:
    print("Base image not found")
