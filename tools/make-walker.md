# Walk-in cutout (videos/yuruyus.*)

Source: Seedance clip supplied by the owner (man walks in, buttons his jacket).
1. `ffmpeg -i source.mp4 -vf scale=540:-2 in/f%03d.png`
2. Background removed per frame with rembg (`u2net_human_seg`), near-white pixels cleared.
3. `videos/yuruyus.webm`: VP9 with alpha (`-pix_fmt yuva420p`), cropped to 540x936, for Chrome, Edge, Firefox, Android.
4. `videos/yuruyus.webp`: animated WebP, plays once (12 fps, 360x624), for Safari and iOS.
5. `videos/yuruyus-son.webp`: last frame, used for reduced motion and as fallback.
