# Hero Image Guidelines — eksportfiske.no

> This document defines the visual language for all blog hero images on eksportfiske.no.
> It is designed as a **nano-banana prompt prefix** — paste the "Common Theme Prefix" section
> verbatim at the start of every image generation prompt, then append the per-article
> scene description.

---

## Brand Context

**Site**: eksportfiske.no — marketing for a PWA reporting app for Norwegian fishing tourism operators (turistfiskebedrifter).

**Audience**: Small Norwegian coastal business owners who rent out cabins and boats to foreign fishing tourists. They are practical, no-nonsense, and deeply connected to the Norwegian coast.

**Tone**: Professional, trustworthy, authentically Norwegian coastal. Not stock-photo touristy, not glamour fishing, not holiday-brochure. Think: a real working harbour at 7am, not a glossy magazine spread.

---

## Common Theme Prefix

> **Copy this verbatim as the opening of every nano-banana generation prompt.**

```
Photorealistic wide-format hero image for a Norwegian coastal fishing tourism website.
Norwegian coastal palette: deep fjord navy (#1a3a5c), weathered granite grey,
fjord teal (#4a9b8e), pale morning sky, and soft natural daylight — no saturated
or tropical colours. Setting is authentically Norwegian: fjords, rocky coastline,
weathered wooden docks, traditional red or ochre boathouses (naust), calm open
water, overcast or soft golden Nordic light.

Compositional rules:
- Wide landscape format (3:2), subject centred or rule-of-thirds
- No text, no logos, no signs, no watermarks anywhere in the image
- No people's faces — backs, hands, silhouettes permitted if atmospheric
- No smartphones, tablets, computers, or screens visible
- No stock-photo clichés (no posed thumbs-up, no fake smiles, no bright tropical water)
- Foreground interest with mid-ground subject and atmospheric background depth
- Colour grade: slightly desaturated, cool-to-neutral, cinematic — not Instagram-filtered
- Mood: calm, purposeful, early morning or overcast Nordic light
- Photography style: documentary/editorial, as if shot by a Norwegian nature photographer

The image must work as a 1536×1024 px hero image (3:2 aspect ratio).
Keep the centre-left third of the image relatively uncluttered (text placement zone).
```

---

## What to Avoid (Hard Rules)

- No text, numbers, signs, labels, or watermarks anywhere
- No company logos or app icons
- No people's faces (backs and hands are fine)
- No screens or devices
- No tropical, Mediterranean, or non-Norwegian scenery
- No oversaturated "golden hour Instagram" colour grading
- No stock-photo fishing clichés (big trophy fish held to camera, forced smiles)
- No unrealistic fish sizes or fantasy catches
- No flags or political symbols

---

## Recurring Brand Elements (Use as Anchors)

These elements reinforce the Norwegian coastal identity and can appear across images:

- Weathered wooden dock or quay (brygge)
- Traditional Norwegian boathouse / naust (red or ochre painted wood)
- Flat-bottomed aluminium fishing boat (typical small-operator vessel)
- Granite rocks at the waterline
- Rope, nets, buoys — as texture, not as focal point
- Grey or pale blue overcast Nordic sky
- Calm fjord or sheltered coastal inlet
- Distant mountain or headland silhouette

---

## Colour Reference

| Role | Hex | Description |
|------|-----|-------------|
| Primary brand | `#2196f3` | Do NOT reproduce in images — it reads as digital/UI |
| Water (deep) | `#1a3a5c` | Deep fjord navy for open water |
| Water (shallow) | `#4a9b8e` | Fjord teal for sheltered inlets |
| Granite | `#7a8b8b` | Weathered coastal rock |
| Wood | `#8b6e4e` | Aged dock and boathouse timber |
| Sky | `#c8d8e4` | Pale overcast Nordic sky |
| Highlight | `#f0e8d0` | Soft morning light on water |

---

## Prompt Template Structure

Final prompt = **Common Theme Prefix** + **Per-Article Scene Description**

The Common Theme Prefix is reusable and never changes. The scene description is
written fresh for each new article from the article's content, following the
methodology below.

---

## How to Derive a Scene from a New Article

When generating a hero for a new blog post, work through these steps:

1. **Read the article** and identify its core theme in one sentence (e.g.
   "the legal duty to report catches", "preparing for the season").
2. **Pick a single concrete object or moment** that anchors the theme — not a
   metaphor, not a person performing an action. A boot at a dock edge, a fish
   crate on a wet quay, a rope coiled on a bollard. One readable focal point.
3. **Choose a setting** from the Recurring Brand Elements list (dock, naust,
   aluminium boat, fjord, hytte, harbour). Mix two if it adds depth, no more.
4. **Set the time of day and weather** to match the article's emotional tone:
   - Bright, purposeful topic → soft early-morning light, calm water
   - Serious, regulatory topic → overcast grey, dusk, muted palette
   - Reflective, melancholic topic → glassy still water, flat pale sky
   - Forward-looking, seasonal → spring light, snow leaving the mountains
5. **Name the mood explicitly** in one phrase ("quiet responsibility",
   "purposeful preparation", "honest accountability"). The model uses this
   to colour-grade and compose.
6. **Write the scene as 3–5 sentences** in plain English. Lead with the
   focal object, then the setting, then the light, then the mood.
   No people's faces. No text. No screens.
7. **Append it after the Common Theme Prefix verbatim** and feed the combined
   prompt to nano-banana. Save output to
   `src/content/blog/images/<article-slug>.webp`.

### Worked Example

Article: "Daglig fangstrapportering i turistfiske" (daily catch reporting)

- Core theme: *the daily routine of logging a catch*
- Focal object: *a fish crate with fresh cod on a wet dock*
- Setting: *coastal quay with boat in the soft background*
- Time/weather: *early morning, overcast, cool diffuse light*
- Mood: *routine, precision, daily rhythm*

Resulting scene description:

```
Scene: Early morning on a Norwegian coastal quay. A fresh catch of cod (torsk)
lies in a grey plastic fish crate on a wet dock, water droplets visible. In the
soft background, a small aluminium boat is tied up and a boathouse silhouette is
visible. The light is cool, diffuse, overcast — the start of a working day.
No people. Mood: routine, precision, daily rhythm.
```

---

## Rationale: Why 1536 × 1024?

- **On-page hero**: The image renders at its natural aspect ratio inside a `max-w-2xl` container — no cropping. At 800 px wide, a 3:2 image renders at ~533 px tall, giving a proper hero height. A 1.91:1 OG-ratio image would render only ~419 px tall — too flat for a hero.
- **OG / social sharing**: `Layout.astro` hard-crops *any* source image to 1200 × 630 at build time, regardless of source dimensions. The source aspect ratio does **not** affect OG output.
- **Consistency**: All 7 existing blog images are 1536 × 1024 (3:2). Matching this ensures a uniform visual language and predictable on-page rendering.

---

## Output Specifications for nano-banana

- **Dimensions**: 1536 × 1024 px (3:2 ratio — matches all existing images)
- **Format**: WebP
- **File naming**: Match existing slug-based names (e.g. `daglig-fangstrapportering-turistfiske.webp`)
- **Output path**: `/workspace/master/src/content/blog/images/`
- **Quality target**: High fidelity, photorealistic — not illustration or painterly

---

*Last updated: 2026-04-26*
