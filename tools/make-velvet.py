# Run from the repo root: python3 tools/make-velvet.py  (needs pillow + numpy)
# Generates a tileable crushed-velvet pile texture (grayscale, used as a soft-light overlay).
# Spectral synthesis wraps by construction, so the tile has no seams.
import numpy as np
from PIL import Image

rng = np.random.default_rng(1908)
S = 1024

def spectral_noise(beta, stretch=(1.0, 1.0), low_cut=0.0):
    fy = np.fft.fftfreq(S)[:, None] * stretch[0]
    fx = np.fft.fftfreq(S)[None, :] * stretch[1]
    f = np.sqrt(fx ** 2 + fy ** 2)
    f[0, 0] = 1.0
    amp = 1.0 / f ** beta
    amp[f < low_cut] = 0
    amp[0, 0] = 0
    phase = rng.uniform(0, 2 * np.pi, (S, S))
    field = np.real(np.fft.ifft2(amp * np.exp(1j * phase)))
    return (field - field.mean()) / field.std()

# crushed sheen: broad irregular patches, slightly stretched along the pile direction
crush = spectral_noise(2.1, stretch=(1.0, 1.7), low_cut=1.5 / S)
# pressed creases: sharper ridges folded out of a second field
ridge = 1 - np.abs(spectral_noise(1.8, stretch=(1.6, 1.0), low_cut=2 / S))
ridge = (ridge - ridge.mean()) / ridge.std()
# pile: very fine fibre noise
pile = spectral_noise(0.6, low_cut=80 / S)

v = 0.62 * crush + 0.28 * ridge + 0.10 * pile
v = np.tanh(v * 0.9)               # soft shoulder so highlights read as sheen, not blotches
img = 0.5 + 0.1 * v                # centred on mid-grey for soft-light blending
img = np.clip(img, 0, 1)
im = Image.fromarray((img * 255).astype(np.uint8), 'L')
im.save('assets/img/velvet.jpg', quality=80, optimize=True, progressive=True)
print(im.size)
