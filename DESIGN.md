---
name: PARLA Herrenmode
description: A lamp-lit fitting cabin in green velvet, brass and mirror glass, for a menswear store in Mannheim.
colors:
  brass: "#e6c476"
  brass-hi: "#f7e1a8"
  brass-lo: "#a17c38"
  velvet-975: "#10261e"
  velvet-950: "#1b3d31"
  velvet-900: "#264e40"
  velvet-850: "#2c5647"
  lamp: "#f5eedd"
  lamp-2: "#e8e9dc"
  lamp-3: "#dfe1d1"
  lamp-line: "rgba(232, 198, 121, 0.36)"
  cloth-navy: "#24365a"
  cloth-charcoal: "#3f4448"
  cloth-ivory: "#e7dfcc"
typography:
  display:
    fontFamily: "Imbue, Didot, 'Bodoni 72', serif"
    fontSize: "clamp(3.5rem, 1.6rem + 5.2vw, 6rem)"
    fontWeight: 450
    lineHeight: 0.94
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Imbue, Didot, 'Bodoni 72', serif"
    fontSize: "clamp(2.6rem, 1.5rem + 3.8vw, 4.75rem)"
    fontWeight: 460
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  statement:
    fontFamily: "Imbue, Didot, 'Bodoni 72', serif"
    fontSize: "clamp(2.6rem, 1.3rem + 4.4vw, 6rem)"
    fontWeight: 440
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  handle:
    fontFamily: "Imbue, Didot, 'Bodoni 72', serif"
    fontSize: "clamp(2.6rem, 0.8rem + 7.4vw, 6rem)"
    fontWeight: 430
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  quote:
    fontFamily: "Imbue, Didot, 'Bodoni 72', serif"
    fontSize: "clamp(1.75rem, 1.2rem + 1.6vw, 2.6rem)"
    fontWeight: 420
    lineHeight: 1.18
  title:
    fontFamily: "Imbue, Didot, 'Bodoni 72', serif"
    fontSize: "clamp(1.9rem, 1.4rem + 1.2vw, 2.6rem)"
    fontWeight: 460
    lineHeight: 1
  menu-link:
    fontFamily: "Imbue, Didot, 'Bodoni 72', serif"
    fontSize: "clamp(3rem, 14vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.1
  numeral:
    fontFamily: "Imbue, Didot, 'Bodoni 72', serif"
    fontSize: "1.9rem"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "'lnum' 1, 'tnum' 1"
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    letterSpacing: "0.12em"
    fontVariation: "'wdth' 125"
  label-sm:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 600
    letterSpacing: "0.12em"
    fontVariation: "'wdth' 125"
  nav-link:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    letterSpacing: "0.1em"
    fontVariation: "'wdth' 112"
  wordmark:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.34em"
    fontVariation: "'wdth' 125"
  wordmark-sub:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.42em"
    fontVariation: "'wdth' 125"
  woven-label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.66rem"
    fontWeight: 700
    letterSpacing: "0.34em"
    fontVariation: "'wdth' 125"
rounded:
  none: "0px"
  frame: "2px"
  focus: "4px"
  pill: "999px"
  ring: "50%"
spacing:
  gutter: "clamp(1rem, 4vw, 3rem)"
  section: "clamp(5.5rem, 11vw, 10rem)"
  container-max: "1280px"
  nav-height: "68px"
  grid-gap: "1.5rem"
  frame-inset: "7px"
  gap-xs: "0.6rem"
  gap-sm: "0.9rem"
  gap-md: "1.6rem"
  gap-lg: "2.2rem"
components:
  button-brass:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.velvet-975}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.35rem"
    height: "3.25rem"
  button-brass-sm:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.velvet-975}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1.05rem"
    height: "2.6rem"
  button-ghost:
    backgroundColor: "rgba(239, 231, 212, 0.06)"
    textColor: "{colors.lamp}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.35rem"
    height: "3.25rem"
  button-ghost-hover:
    backgroundColor: "rgba(239, 231, 212, 0.11)"
  link-arrow:
    textColor: "{colors.lamp}"
  lang-toggle-active:
    backgroundColor: "{colors.lamp}"
    textColor: "{colors.velvet-975}"
    rounded: "{rounded.pill}"
    height: "2.1rem"
  lang-toggle-idle:
    backgroundColor: "transparent"
    textColor: "{colors.lamp-3}"
    rounded: "{rounded.pill}"
    height: "2.1rem"
  copy-chip:
    backgroundColor: "rgba(239, 231, 212, 0.07)"
    textColor: "{colors.lamp-2}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.85rem"
    height: "2.4rem"
  copy-chip-hover:
    backgroundColor: "rgba(239, 231, 212, 0.12)"
    textColor: "{colors.lamp}"
  nav-solid:
    backgroundColor: "rgba(12, 38, 30, 0.9)"
    textColor: "{colors.lamp-2}"
    typography: "{typography.nav-link}"
    height: "{spacing.nav-height}"
  mobile-dock:
    backgroundColor: "rgba(8, 26, 20, 0.92)"
    padding: "0.7rem clamp(1rem, 4vw, 3rem)"
  mirror-frame:
    backgroundColor: "{colors.brass}"
    rounded: "{rounded.frame}"
    padding: "{spacing.frame-inset}"
  garment-cloth:
    backgroundColor: "{colors.cloth-navy}"
    rounded: "{rounded.frame}"
  woven-label:
    backgroundColor: "#e9e1ca"
    textColor: "#22302a"
    typography: "{typography.woven-label}"
    rounded: "{rounded.none}"
    padding: "0.55rem 1.1rem 0.55rem 1.45rem"
  woven-label-dark:
    backgroundColor: "{colors.velvet-850}"
    textColor: "{colors.brass}"
  name-plate:
    backgroundColor: "transparent"
    textColor: "{colors.brass}"
    rounded: "{rounded.none}"
    padding: "2.2rem 2.4rem 2rem"
    width: "min(100%, 22rem)"
  footer:
    backgroundColor: "rgba(4, 14, 10, 0.62)"
    textColor: "{colors.lamp-2}"
---

# Design System: PARLA Herrenmode

## Overview

**Creative North Star: "The Anprobe"**

Every screen is the inside of a fitting cabin. The visitor has stepped behind the curtain, and everything he sees could plausibly be in that small, lamp-lit room: green cloth on the walls, a brass rod for the curtain, hooks for the suits, a mirror to stand in front of, an engraved sign by the door. The interface is built from those four materials (velvet, brass, mirror glass, lamplight) and nothing else. There are no cards, panels or generic UI chrome, because nothing like that hangs in a cabin.

The mood is warm, dim and quietly formal. Type reads like lamplight on dark cloth, and brass behaves like polished metal: a vertical gradient, a light top edge and a dark lower edge. Density is low. Each section is built around a single object (the three-way mirror, the garment rail, the arched mirror, the name plate, the social handle) with a few lines of copy next to it. Type carries the page at large sizes: a tall, narrow high-contrast face for anything read as a line, and a wide grotesk in spaced capitals for small engraved labels.

Motion is physical and happens once. The curtain opens once per session, the suits swing once when the rail comes into view, and a sheen crosses the mirror glass as the pointer moves. Everything else is a short, quiet state change, and all of it is removed under reduced motion. The system deliberately avoids the menswear default of monochrome full-bleed model photography, a hairline serif and an "explore" button.

**Key Characteristics:**
- One continuous textured velvet ground from nav to footer; sections have no fills of their own.
- Brass is the only accent, and it always reads as metal.
- Every image sits in a brass-framed mirror or on cloth, and each frame looks finished before a photo is added.
- Tall narrow display lines against wide engraved caps; two typefaces, never a third.
- Square frames, pill-shaped controls, circular rings; one arch, reserved for the wedding mirror.
- Depth comes from hanging objects and lamplight, never from raised surfaces.
- German in the markup, Turkish in the script, swapped in place with a short crossfade.

## Colors

A three-material palette: dark bottle-green velvet for every surface, warm ivory lamplight for text, and brass as the single accent. Three cloth colours exist only as garment material.

### Primary
- **Polished Brass** (#d8b264): the metal of the room. Rail and rings, hooks and hanger bars, the curtain holdback, the primary call/route pill, star fill, the icon tint in links, facts and chips, the "Herrenmode" line of the wordmark, engraved caps subheadings, the name plate's lettering and all 1px hairlines. On any surface larger than a hairline it is rendered as one of the two brass gradients below, never as a flat fill.
- **Brass Highlight** (#f0d596): the focus ring, the hover colour of large display links (phone number, social handle) and the lit top of each hook stem.
- **Brass Shadow** (#8f6d2e): the dark foot of each hook stem and the scrollbar thumb. Never used for text (2.7:1 on the ground).

The two brass gradients, which are the material behind every brass surface:
- **Hanging brass**, vertical: `linear-gradient(180deg, #f3dca2 0%, #d8b264 38%, #a78139 72%, #c9a153 100%)`. Rods, hanger bars, holdback, the primary pill.
- **Frame brass**, horizontal: `linear-gradient(90deg, #a8823a 0%, #e9cc88 30%, #cfa758 55%, #9c7732 80%, #d3ad60 100%)`. Mirror frames, the arch and the shopfront frame.

### Neutral
- **Bottle-Green Velvet** (#12382c, velvet-900): the ground. The body background, blended with the procedural crushed-velvet texture (`assets/img/velvet.jpg`, 1024px tile, soft-light). Also the browser theme colour and the favicon tile.
- **Deep Velvet** (#0c261e, velvet-950): the root background beneath the body and the full-screen mobile menu. The scrolled nav uses it at 90%.
- **Velvet Ink** (#081a14, velvet-975): text on brass and on the pressed language pill, selection text, scrollbar track. The mobile dock uses it at 92%.
- **Plush Velvet** (#164133, velvet-850): the dark woven-label variant, used on the ivory garment.
- **Lamplight** (#efe7d4, lamp): headings, primary text, the pressed language pill. The brightest text in the system (10.5:1 on the ground).
- **Soft Lamplight** (#bcc5b0, lamp-2): leads, notes, resting nav links, footer text (7.2:1).
- **Dim Lamplight** (#a7b6a4, lamp-3): small caps labels in lists, review sources, the idle language option, legal notes, the copyright line (6.1:1).
- **Brass Hairline** (rgba(216, 178, 100, 0.26), lamp-line): rules in the facts list and above the wedding checklist. Other hairlines use the same brass at other strengths: 0.16 on the scrolled nav, 0.18 on the footer, 0.2 on the dock, 0.35 and 0.75 on the name plate.
- **Cloth** (garments only): **Midnight Worsted** (#1c2a44, cloth-navy) for the business suit, **Charcoal Flannel** (#33373b, cloth-charcoal) for the occasion suit, **Wedding Ivory** (#e7dfcc, cloth-ivory) for the wedding suit. Each is overlaid with the procedural twill (`assets/img/twill.jpg`, drawn at 240px, soft-light) and side shading. These are fabric, never UI colours.

### Named Rules
**The One Ground Rule.** The velvet is laid once, on the body, and every section sits on it transparently. A section may add one warm lamplight pool (a radial gradient of rgba(240, 213, 150) at 0.10 to 0.14 alpha, fading out by 60 to 70%) and nothing else: no flat fills, no alternating bands, no section colours. The fixed nav and mobile dock are translucent velvet over a blur; the footer is the only shade, a 62% dark veil that the velvet still shows through.

**The Brass Is Hardware Rule.** Brass is the only accent, and it appears only where metal would be: rails, rings, hooks, frames, the holdback, the primary pill, icons, stars, hairlines and engraved caps. No second hue is introduced for emphasis, status or links. Links are lamplight with a brass underline.

**The Lamplight Rule.** Text is warm ivory in three steps (lamp, lamp-2, lamp-3), never pure white and never neutral grey. Pure white appears only as light inside the mirror sheen.

## Typography

**Display Font:** Imbue (self-hosted variable font with an optical-size axis and weights 100 to 900), with Didot, Bodoni 72, serif as fallback
**Body Font:** Archivo (self-hosted variable font with a 62 to 125% width axis and weights 100 to 900), with system-ui, sans-serif as fallback
**Label Font:** Archivo widened to 125% (112% for nav links), uppercase

Both faces are under the SIL Open Font License and served from `assets/fonts/` in latin and latin-ext subsets (the latin-ext files carry the Turkish ı, ş, ğ). The latin files are preloaded. There is no third-party font request.

**Character:** A tall, narrow, high-contrast face with optical sizing that echoes the upright proportion of the mirror panels, set against a wide grotesk whose spaced capitals read like lettering cut into a brass sign. The pairing's contrast is narrow against wide, not only serif against sans.

### Hierarchy
- **Display** (Imbue 450, clamp(3.5rem, 1.6rem + 5.2vw, 6rem), line-height 0.94, -0.012em): the hero headline only, two short lines with a manual break.
- **Headline** (Imbue 460, clamp(2.6rem, 1.5rem + 3.8vw, 4.75rem), 0.98, -0.01em, balanced): section headings and the h1 of the legal pages.
- **Statement** (Imbue 440, clamp(2.6rem, 1.3rem + 4.4vw, 6rem), 0.98, -0.01em, balanced): the three advice beats, sentences set as headlines.
- **Handle** (Imbue 430, clamp(2.6rem, 0.8rem + 7.4vw, 6rem), 1.02, -0.01em): the social handle as the page's closing line; allowed to break anywhere on narrow screens.
- **Quote** (Imbue 420, clamp(1.75rem, 1.2rem + 1.6vw, 2.6rem), 1.18): review excerpts, verbatim, with German quotation marks („…“).
- **Title** (Imbue 460, clamp(1.9rem, 1.4rem + 1.2vw, 2.6rem), 1): garment names on the rail.
- **Numeral** (Imbue 400, 1.9rem, 1, lining tabular figures): the phone number beside a call pill.
- **Menu link** (Imbue 400, clamp(3rem, 14vw, 4.5rem), 1.1): links in the full-screen mobile menu.
- **Lead** (Archivo 400 at 100% width, clamp(1.0625rem, 1rem + 0.3vw, 1.25rem), 1.55, pretty wrap): the one sentence under a heading, in soft lamplight, capped at 34ch (38ch in the wedding copy, 26ch in the closing row).
- **Body** (Archivo 400 at 100% width, 1.0625rem / 17px, 1.6): notes and running text. Home-page measures run 28 to 46ch; legal pages cap at 65ch.
- **Label** (Archivo 600 at 125% width, 0.8rem, 0.12em, uppercase): button text and legal subheadings. The small label (0.74 to 0.78rem, 0.12 to 0.14em) serves list terms, the checklist subheading and review sources. Small buttons drop to 0.72rem, the language options to 0.7rem.
- **Nav link** (Archivo 500 at 112% width, 0.8rem, 0.1em, uppercase).
- **Wordmark** (Archivo 700 at 125% width, 1.2rem, 0.34em, uppercase "PARLA" in lamplight, over "HERRENMODE" in Archivo 500 at 0.6875rem, 0.42em, in brass). The name plate repeats it at 1.7rem; the woven label sets "PARLA" in Archivo 700 at 0.66rem, 0.34em. The wordmark is set in type because no logo file exists yet.

### Named Rules
**The Two Faces Rule.** Imbue and Archivo only. Imbue sets anything meant to be read as a line (headings, beats, quotes, garment names, the handle, the phone number, menu links), always in sentence case, weights 400 to 460, never above 6rem, and tracked no tighter than -0.012em. Archivo sets everything else.

**The Engraved Caps Rule.** Uppercase appears only in Archivo, widened (125%, or 112% for nav links), at weight 500 to 700 and tracked 0.1em to 0.42em. Archivo at its normal 100% width is never set in caps, and Imbue is never set in caps.

**The Standing Heading Rule.** A heading stands alone on the velvet. No kicker, eyebrow, section number or tag sits above it. The only caps line near a heading is a subheading for the list beneath it.

## Layout

The page is a single column of long, open sections on one ground, each built around one object. The container is 1280px wide plus gutters (clamp(1rem, 4vw, 3rem) each side). Each content section pads clamp(5.5rem, 11vw, 10rem) top and bottom; the hero fills the viewport (100dvh). Headings sit 1.3 to 1.6rem above what follows them, and action rows about 2.2rem below the lead. In-component gaps cluster at 0.6rem, 0.9rem, 1.6rem and 2.2rem.

Two-part rows use a 12-column grid with a 1.5rem column gap: copy on one side, the object on the other. The garment rail is its own three-column grid (1fr 1fr 1.28fr), with the wedding suit largest and last, and its brass rod runs out into the gutters. Sequences step to the right instead of lining up: the second and third advice beats indent by clamp(0rem, 10vw, 11rem) and clamp(0rem, 20vw, 22rem), and the second review quote by clamp(0rem, 6vw, 5rem). The hero adds 60% of the gathered curtain's width to its side padding so copy never runs under the cloth. The fixed nav is 68px tall, and anchor scrolling clears it by 1rem.

**Responsive behaviour:**
- **At 1080px and below:** nav links tighten to a 1.4rem gap, and the hero copy widens to six columns.
- **At 900px and below:** the nav drops to 64px; nav links and the nav call pill hide, and a round menu button appears. Every two-part grid collapses to one column with a 3rem row gap. The mirror centres at min(100%, 440px) with its wings at 20deg. The rail becomes an edge-to-edge horizontal scroll-snap strip (each garment min(72vw, 300px), hidden scrollbar), and the arch shrinks to min(82%, 360px). The review score is no longer sticky, and the stagger indents shrink to 1.5rem and 3rem. A call/route dock is fixed to the bottom once the hero actions scroll away, and the footer pads 6.5rem at the bottom to clear it. The curtain gathers to 9% of each half with fewer, wider folds.
- **At 560px and below:** fact rows stack, the beat rings hide, the beat indents shrink to 1rem and 2rem, and the footer stacks.
- Safe-area insets are respected on the menu, the dock and the footer (`viewport-fit=cover`).

### Named Rules
**The Open Column Rule.** In a two-part row, copy and object are separated by one empty grid column: 5 | 6 in the hero, the wedding and the visit sections, 4 | 7 in the reviews, where the score sticks under the nav. Only the closing social row runs 8 | 4, bottom-aligned, with its side text right-aligned.

**The Stagger Rule.** Items in a sequence step diagonally down the page, like garments along a rail, instead of forming an aligned grid of equal boxes.

## Elevation & Depth

Depth is staged like a room lit by one lamp overhead, not layered like an app. No surface is raised and nothing is a card. Objects that hang in the room cast long, soft shadows straight down; brass hardware casts short, tight ones and carries a light top edge like polished metal. Warm light is painted as radial pools: at the top of the hero, above the mirror, behind the wedding arch and, low and soft, under the closing line. A dark pool sits on the floor under the mirror. The mirror glass itself reflects the room: a silver gradient, faint green pleat stripes of the velvet opposite, a lamp highlight at the top and a thin brass reflection of the rail near 5% height.

### Shadow Vocabulary
- **Hanging drop, mirror** (`box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.85), inset 0 0 0 1px rgba(94, 71, 25, 0.35)`): the three mirror panels. The inset line darkens the frame's inner edge.
- **Hanging drop, garment** (`box-shadow: 0 34px 60px -34px rgba(0, 0, 0, 0.9)`): cloth on the rail.
- **Hanging drop, arch** (`box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.9)`): the wedding arch mirror.
- **Hardware** (`box-shadow: 0 3px 6px -2px rgba(0, 0, 0, 0.6)`): the curtain rail rod. The garment rod uses `0 4px 8px -3px rgba(0, 0, 0, 0.7)`, the hanger bar `0 3px 5px -1px rgba(0, 0, 0, 0.6)` and the holdback `0 4px 6px -2px rgba(0, 0, 0, 0.6)`.
- **Ring** (`box-shadow: inset 0 1px 0 rgba(255, 240, 200, 0.5), 0 2px 3px rgba(0, 0, 0, 0.5)`): curtain rings. Hook and beat rings keep only the inset highlight.
- **Polished pill** (`box-shadow: inset 0 1px 0 rgba(255, 246, 214, 0.65), inset 0 -1px 0 rgba(94, 71, 25, 0.5), 0 6px 18px -8px rgba(0, 0, 0, 0.7)`): the brass button. On hover the top edge rises to 0.8 and the drop deepens to `0 10px 22px -10px rgba(0, 0, 0, 0.8)`.
- **Hairline outline** (`box-shadow: inset 0 0 0 1px rgba(239, 231, 212, 0.22)`): the ghost pill; the language track uses 0.2.
- **Sewn label** (`box-shadow: 0 2px 4px rgba(0, 0, 0, 0.35)`): the woven label on the cloth.
- **Fixed-bar veil** (translucent velvet with `backdrop-filter: blur(14px) saturate(1.2)` and a brass hairline edge): the scrolled nav and the mobile dock only.

### Named Rules
**The Hanging Object Rule.** Only things that hang cast a shadow, and it falls straight down: zero x-offset and a large negative spread. Text, containers and every control except the brass pill stay flat.

**The Lamp Above Rule.** Light comes from overhead. Highlights sit on top edges (a 1px inset light line), the hero and mirror pools sit at the top of the scene, and shadows fall below. The only low light is the soft glow under the closing row.

## Shapes

The form language is a tailor's: straight edges on anything that frames, round only where metal is round. Mirror glass, garment cloth, the shopfront frame and the hanger bar take a barely softened 2px corner. The name plate and the woven label are true squares (0). Pills (999px) are reserved for small controls: brass and ghost buttons, the language toggle, the copy chip, the menu button and the skip link. Circles (50%) are reserved for rings: curtain rings (16px with a 2.5px brass border, 12px and 2px on small screens), the hook ring (18px), the advice beat rings (clamp(14px, 1.6vw, 20px) with a 3px border) and the checklist bullets (11px with a 2px border). Rods are capsules whose radius equals their height (6px and 7px).

The single arch (999px 999px 2px 2px outside, 999px 999px 0 0 on the glass) belongs to the wedding mirror only. Borders are 1px brass hairlines. The name plate doubles its hairline (a 1px border at 0.75 plus a 1px outline at 0.35, inset 7px); the woven label carries a 1px dashed stitch inset 4px. The curtain halves are cut by a polygon clip pinched at 56% height, where the brass holdback sits, and the star rating is filled by an inset clip at 96.5%. The focus ring is 2px of brass highlight, offset 3px, at a 4px radius. The favicon, a velvet tile with a brass-gradient "P", is the only rounded square, following the app-icon convention.

### Named Rules
**The Square Frame Rule.** Frames are square (2px) and plates are squarer still (0). Pills are for controls a thumb presses, circles are for rings, and the arch is for the wedding mirror. Nothing that holds content is ever rounded beyond 2px.

## Components

### Buttons
Tactile and few: one polished brass pill per action row, with a quieter partner beside it.
- **Shape:** full pill (999px), minimum height 3.25rem, padding 0.85rem 1.35rem, 0.6rem icon gap, a 1.15em icon leading.
- **Brass (primary):** hanging-brass gradient fill, velvet-ink label in engraved caps (Archivo 600 at 125%, 0.8rem, 0.12em), polished-pill shadow. Used only for the two real actions: call and route.
- **Brass small:** 2.6rem tall, padding 0.55rem 1.05rem, 0.72rem label. The nav's call button.
- **Ghost:** lamplight at 6% fill with a 1px lamplight inset outline at 22%, lamplight text. Social links and the dock's route button.
- **Hover:** on fine pointers only, brass brightens (filter brightness 1.07) and its drop deepens; ghost fill rises to 11%. Colour transitions take 200ms ease.
- **Active:** scale(0.97) over 160ms on the ease-out curve.
- **Focus:** global 2px brass-highlight outline, 3px offset.
- **Arrow link (tertiary):** lamplight text at weight 500, underlined in brass at 55% with a 0.35em offset, followed by a brass north-east arrow at 0.95em. On hover the underline turns full brass and the arrow nudges 2px up and right (200ms ease-out). It is the partner to the brass pill in the hero, and it links to Google in the reviews and hours rows.
- **Pairing:** each action row holds one brass pill. Its partner is an arrow link (hero), the phone number set as a numeral (wedding) or a ghost pill (dock, social).

### Chips
- **Copy chip:** pill, lamplight at 7% fill, soft-lamplight 0.8rem text, brass 1rem copy icon, minimum height 2.4rem. On hover the fill rises to 12% and the text to lamplight. On click the address goes to the clipboard, and for 2.2 seconds the icon becomes a check and the label reads "Kopiert" (announced politely).
- **Language toggle:** a pill track with a 1px lamplight inset outline at 20% and 3px padding, holding two options (DE, TR) of at least 2.5rem × 2.1rem in engraved caps at 0.7rem. The pressed option is a lamplight pill with velvet-ink text; the idle option is dim lamplight and lifts to lamplight on hover.

### Cards / Containers
There are no cards. Content sits on the velvet or inside an object from the room.
- **Mirror frame:** a frame-brass border 7px deep (2px corner) around silvered glass. The photo, when present, fills the glass inset 7px.
- **Garment cloth:** 3:4 (the lead garment 3:3.7), 2px corner, a cloth colour under the twill texture with side shading and a dark collar shadow at the top, plus the garment hanging drop.
- **Arch mirror:** 9:13, an 8px frame-brass border, arched top, silvered glass with a lamp highlight at the top.
- **Name plate:** a transparent square with a doubled brass hairline, at most 22rem wide and padded 2.2rem 2.4rem 2rem. It holds "PARLA" (lamplight, 1.7rem, 700), "HERRENMODE" (brass, 0.72rem, 0.42em) and the address in 0.8rem caps at 0.2em under a hairline rule. It sits straight on the velvet.
- **Facts list:** definition rows separated by brass hairlines (lamp-line), each padded 1.3rem top and bottom, with a term column of minmax(9rem, 12rem). Terms are small dim-lamplight caps with a brass icon; values are 1.0625rem lamplight with tabular numerals.

### Navigation
- **Bar:** fixed, 68px, transparent over the hero. Once the page moves it turns into the fixed-bar veil (velvet-950 at 90%, blur, brass hairline at 16% along the bottom) over 300ms.
- **Wordmark:** left-aligned and typeset (see Typography). It links to the top.
- **Links:** centred, nav-link caps in soft lamplight. On hover they turn lamplight and draw a 1px brass underline from the left (scaleX over 320ms ease-out). The social handle draws the same underline at 2px on hover; the wedding garment's name, the rail's only link, keeps it permanently drawn.
- **Actions:** the language toggle and a small brass call pill, right-aligned.
- **Mobile (900px and below):** links and the call pill hide, leaving the wordmark, the toggle and a 2.75rem round menu button (lamplight at 8%). The menu is a full-screen velvet-950 sheet with a lamplight pool at the top. It drops in from above (460ms, drawer curve), and its links, set in Imbue, rise and fade in with a stagger of 140ms + 50ms per link. It closes on a link tap, on Escape or with its own button; the last two return focus to the opener.
- **Dock (900px and below):** a bottom bar with a brass call pill (1.4fr) and a ghost route pill (1fr) on velvet-975 at 92% with blur and a brass hairline at 20%. It slides up (360ms, drawer curve) only once the hero actions have scrolled out of view, and stays out of the tab order while hidden.
- **Skip link:** a brass pill that slides in from the top-left on keyboard focus.

### Curtain and Rail (signature)
A brass rod (6px, hanging brass) crosses the hero just under the nav, carrying eight rings on each half. On the first visit of a session the page opens with the curtain drawn: two velvet halves with fine flat pleats. After fonts load (or 900ms at most) and a 280ms pause, each half gathers to 10% of its width (9% at 900px and below) over 1500ms on the in-out curve. The pleats cross-fade into a few deep rounded folds (1200ms), the rings bunch toward the edges, and a brass holdback appears at 56% height once the curtain has settled (500ms, delayed 1100ms). A safety timeout never leaves the curtain shut. Under reduced motion, or on a repeat visit within the session, the curtain starts open.

### Three-way Mirror (signature)
Three frame-brass panels in CSS 3D (1500px perspective): the centre panel faces the viewer at 1.3 times the width of the wings, and the wings turn inward on rotateY(24deg), 20deg on small screens. The panels sit 5px apart in a 1.02 aspect box of at most 560px. A band of light (white at 22%, screen blend) lies across the glass and follows the pointer horizontally, eased with a 0.08 lerp; it sweeps in once when the curtain opens (1600ms ease-out, staggered 350, 450 and 550ms across the panels). Where scroll-driven animation is supported, the wings close toward 8deg as the hero leaves the viewport. The side panels carry an extra darkening gradient toward their outer edge, so each wing reflects the room from its own angle.

### Garment Rail (signature)
A 7px brass rod runs across the section into the gutters. Each garment hangs from a 2px brass hook stem (brass highlight fading to brass shadow) topped by an 18px ring, with a 96px hanger bar across the shoulders. A woven label is sewn into the lining 13% down the cloth: cream with a dashed stitch, or plush velvet with brass lettering on the ivory wedding suit. When the rail first comes into view, the garments swing once, like cloth settling on a hanger (1900ms ease-out, staggered 110ms, damped from 2.6deg down to 0).

### Photo Slots
Every image slot is a real file path in `images/` placed inside a material. The image stays invisible until it loads, then fades in over 500ms ease-out. If the file is missing, the slot marks itself empty and the material stays: silvered glass in the mirrors and the arch, twill cloth on the rail. An optional slot (the shopfront) disappears entirely when its photo is missing. Required sizes and ratios are listed in `images/README.md`: 3:5 for the mirror panels, 3:4 for garments, 9:13 for the arch and 3:2 for the shopfront.

### Advice Beats and Rating
- **Beats:** three statement lines in an ordered list, each led by an empty brass ring on the baseline and followed by a soft-lamplight note of at most 40ch. The section heading is visually hidden, so the beats open the section themselves.
- **Stars:** five outlined stars in brass at 28%, with a brass row clipped to the exact rating (96.5% for 4.8) laid on top. The whole row is labelled as a single image.

### Language
German copy lives in the HTML, each string tagged with a `data-i18n` key (`data-i18n-attr` for alt and aria-label). The Turkish strings live in the TR dictionary at the top of `assets/js/site.js` under the same keys, along with the Turkish title and meta description. When the language changes, tagged text fades out and blurs by 3px over 180ms, swaps, and fades back. Review quotes stay in the original German; a Turkish translation line appears under each one only when the page is in Turkish. The choice persists per browser, and `?lang=tr` or a Turkish browser language opens the Turkish version.

### Legal Pages
Impressum and Datenschutz share the stylesheet: a simple header with the wordmark and an arrow link home, a single 44rem column, the page title as a headline, subheadings as brass caps labels (0.8rem, 0.12em) and paragraphs in soft lamplight at 65ch. Fields the owner must still fill in are highlighted with brass at 18% behind lamplight text, at a 3px radius.

### Named Rules
**The Material Fallback Rule.** No slot ever shows a broken image, a grey box or a stock photo. Each photo lands inside a material that already looks finished without it.

**The Once Rule.** Each signature motion plays once: the curtain once per session, the swing and the sweep once per page view. After that the room stays still except for the sheen following the pointer. Things that move across the screen use the in-out curve (cubic-bezier(0.77, 0, 0.175, 1)); entrances, hovers and presses use the ease-out curve (cubic-bezier(0.23, 1, 0.32, 1)); sheets use the drawer curve (cubic-bezier(0.32, 0.72, 0, 1)). Reduced motion removes all of it and leaves plain opacity fades.

## Do's and Don'ts

### Do:
- **Do** lay the velvet once on the body (velvet-900 under `velvet.jpg` at 1024px, soft-light) and keep every section transparent over it. A section may add one lamplight pool at 0.10 to 0.14 alpha.
- **Do** render any brass surface wider than a hairline with one of the two brass gradients, and give brass hardware a light top edge.
- **Do** keep frames and plates square: 2px on mirror glass, garment cloth and the shopfront; 0 on the name plate and the woven label.
- **Do** reserve pills (999px) for small controls: brass and ghost buttons, the language toggle, the copy chip, the menu button and the skip link.
- **Do** put every image in a slot with a real path in `images/` and a material fallback (silvered glass or twill cloth); make optional slots hide themselves when empty.
- **Do** set headings in Imbue, sentence case, weight 420 to 460, at most 6rem; set caps only in Archivo widened to 125% (112% for nav links) with 0.1em to 0.42em tracking.
- **Do** give each action row exactly one brass pill and a quieter partner (an arrow link, the phone numeral or a ghost pill).
- **Do** write German copy in the HTML with a `data-i18n` key and add the Turkish string under the same key in the TR dictionary in `assets/js/site.js`.
- **Do** move things across the screen on the in-out curve, bring things in on the ease-out curve, gate hover styles behind `(hover: hover) and (pointer: fine)`, and give every animation a reduced-motion fallback.
- **Do** theme the browser surfaces from the palette: brass selection with velvet-ink text, a brass-shadow scrollbar on velvet ink, a 2px brass-highlight focus ring offset 3px.

### Don't:
- **Don't** add cards, panels or boxed tiles of icon, heading and text; content sits on the velvet or inside a mirror, cloth or plate.
- **Don't** give a section its own background fill, colour band or alternating tone.
- **Don't** introduce a second accent hue; brass (with its highlight and shadow) is the only one, and the cloth colours never appear in UI.
- **Don't** round a frame or plate beyond 2px, or put a pill shape on anything larger than a control. The arch belongs to the wedding mirror alone.
- **Don't** place a kicker, eyebrow label, section number or tag above a heading.
- **Don't** add a third typeface, set Imbue in capitals, or set Archivo capitals at its normal 100% width.
- **Don't** use pure white or neutral grey for text, or brass shadow (#8f6d2e) for text of any size.
- **Don't** cast shadows from text, controls other than the brass pill, or content containers; only hanging objects and hardware cast shadows.
- **Don't** ship stock, placeholder or generated photos in a slot, or leave a slot that can show a broken image.
- **Don't** hardcode Turkish in the HTML or German in the TR dictionary.
