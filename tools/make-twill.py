# Run from the repo root: python3 tools/make-twill.py  (needs pillow + numpy)
# Generates a tileable 2/2 wool twill weave texture (grayscale, used as an overlay).
import numpy as np
from PIL import Image, ImageFilter
rng = np.random.default_rng(58)
S = 480            # tile size in px
T = 6              # thread pitch in px (S % (4*T) == 0 keeps the tile seamless)
n = S // T
y, x = np.mgrid[0:S, 0:S]
tx, ty = x // T, y // T            # thread index
fx, fy = (x % T) / T, (y % T) / T  # position inside thread
warp_up = ((tx + ty) % 4) < 2      # 2/2 twill: warp floats over two wefts, shifts by one
# per-thread tone variation (slubs), periodic by construction
warp_tone = rng.normal(0, 0.03, n)[tx]
weft_tone = rng.normal(0, 0.03, n)[ty]
# cylindrical yarn shading across the thread
warp_shade = np.sin(np.pi * fx) ** 0.7
weft_shade = np.sin(np.pi * fy) ** 0.7
# fibre twist: fine diagonal striation along each yarn
twist_w = 0.06 * np.sin(2 * np.pi * (fy * 3 + fx * 1.2))
twist_f = 0.06 * np.sin(2 * np.pi * (fx * 3 + fy * 1.2))
warp = 0.52 + 0.36 * warp_shade + warp_tone + twist_w
weft = 0.46 + 0.32 * weft_shade + weft_tone + twist_f
img = np.where(warp_up, warp, weft)
# fibre fuzz, wrapped so it stays tileable
fuzz = rng.normal(0, 0.05, (S, S))
img = np.clip(img + fuzz, 0, 1)
im = Image.fromarray((img * 255).astype(np.uint8), 'L')
# soften slightly, with wrap-around padding to keep seams clean
pad = Image.new('L', (S * 3, S * 3))
for i in range(3):
    for j in range(3):
        pad.paste(im, (i * S, j * S))
pad = pad.filter(ImageFilter.GaussianBlur(0.5))
im = pad.crop((S, S, 2 * S, 2 * S))
im.save('assets/img/twill.jpg', quality=82, optimize=True, progressive=True)
print(im.size)
