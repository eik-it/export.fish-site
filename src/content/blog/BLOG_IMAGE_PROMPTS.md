# Blog Hero Image Prompts — Reconstruction Log

> Companion to `HERO_IMAGE_GUIDELINES.md`. That file is the **method**; this file is
> the **record** — what was actually fed to the image model for each published article.
>
> Caveat: the original per-article scene descriptions were not committed when the images
> were generated. The table below is **reconstructed by inspecting the rendered images**
> against the guidelines, so wording is approximate. The shared prefix and the model
> history are accurate. Going forward, append the real prompt here when a new hero is made.

---

## How a prompt is assembled

Every hero prompt is **`Common Theme Prefix` (verbatim, never changes) + a per-article scene description**. The prefix lives in `HERO_IMAGE_GUIDELINES.md` under "Common Theme Prefix" — paste it unchanged, then append 3–5 sentences describing one concrete focal object, the Norwegian coastal setting, the light, and a one-phrase mood, derived from the article's core theme.

Output: 1536×1024 px (3:2), WebP, quality ≈ 82, saved to `src/content/blog/images/<slug>.webp`.

---

## Model history

| Batch | When | Model | Notes |
|-------|------|-------|-------|
| Original 7 heroes (PR #243) | 2026-04 | `gemini-2.5-flash-image` ("Nano Banana") | aldersgrense, bot-for-rapportering, daglig-fangstrapportering, lovpalagt-fritidsboligeiere, ma-du-registrere, nullfangst, forberede-sesongen |
| New-article heroes (Apr–May 2026 onward) | 2026-04 → | `gemini-3-pro-image-preview` ("Nano Banana 2" / "Nano Banana Pro") | via the `mcp-image` MCP server (`npx -y mcp-image`), which now defaults to Gemini 3 Pro Image |

The `mcp-image` server reads `GEMINI_API_KEY` from its MCP env config; no model is pinned in this repo, so it follows the package default (currently Gemini 3 Pro Image).

---

## Per-article scene descriptions (reconstructed)

The prefix is identical for all rows; only the scene half differs.

| Article slug | Focal object / scene | Mood |
|---|---|---|
| `daglig-fangstrapportering-turistfiske` | Open paper tally book with hand-drawn fish-stroke marks + a pencil, beside a grey plastic fish crate of fresh cod on a wet dock; aluminium boat and red naust in the soft background, calm fjord, overcast | routine, precision, daily rhythm *(the recorded worked example)* |
| `50000-kr-grensen-turistfiskebedrift` | Antique brass balance scale on a weathered quay — one pan empty, one holding a stone; rusty bollard with coiled rope; aluminium boat with tyre fenders moored alongside; flat overcast light | the threshold / weighing it up |
| `aldersgrense-turistfiske-12-ar` | A child-sized fishing rod and a small orange child's life vest leaning against a wooden dock railing; mountains and calm fjord behind | the 12-year line |
| `bot-for-turistfiske-rapportering` | A worn leather notebook with a pen on a rain-beaded dock; thick rope coiled around a bollard; turf-roofed red naust in a misty fjord | quiet accountability |
| `fritidsfiske-sportsfiske-turistfiske-forskjell` | Three different fishing rods laid side by side along a weathered dock railing over still water | three terms, side by side |
| `leie-hytte-med-bat-sjekkliste` | A clipboard "season check" checklist nailed to a red naust wall; aluminium boat with two red life vests; coiled orange rope on the dock; calm inlet, distant peaks | the pre-season checklist |
| `lovpalagt-fangstrapportering-fritidsboligeiere` | A blank clipboard and a key on a leather fob hanging on a weathered red naust wall; small boat and life vests at the dock; misty headlands | the duty that comes with the cabin |
| `ma-du-registrere-turistfiskebedrift` | A rolled, tied paper document resting on a dock post; small boat at the quay; a cluster of fishing-village houses across the water | the form / the question |
| `minstemal-fredningstider-tabell` | A weathered wooden measuring board with carved centimetre marks plus a gaff hook on a wet dock, a single large pale fish laid beside it for scale; kelp and barnacled rocks; dusk fjord | minimum size, measured |
| `nullfangst-turistfiske-ma-det-rapporteres` | A wooden rowboat tied at a dock and an **empty** grey fish crate on the planks; glassy still fjord mirroring the sky; red naust cluster | zero catch still counts |
| `slik-kan-du-forberede-turistfiskesesongen` | Orange life vests airing on a dock railing, coiled rope, aluminium boat, red naust; snow still on the peaks; spring light | spring, getting ready |
| `slik-registrerer-du-turistfiskebedrift` | A freshly white-painted board leaning against an ochre naust with a paint roller and tray on the dock; two small cabin boats tied up; misty headland | setting up shop / registering |
| `tolletaten-grense-fisk-bot-unnga` | An open cooler box at a motorway lay-by stone wall, paper-wrapped fish parcels with tally marks inside, a hi-vis customs officer's gloved hand at the frame edge; wet asphalt, guardrail | the border check |
| `utforselsdokument-fisk-krav` | A blank folded sheet and a fountain pen on a rough wooden table inside a naust; window view of a fjord; a roof-box estate car with fishing rods inside parked outside | the document before departure |
| `utforselskvote-fisk-2026` | Vacuum-packed fish fillets laid out on a wet dock beside an estate car with open tailgate (cooler box visible) and a canvas tote of papers; red and ochre naust cluster, dusk | what the guest may take home |
| `sikkerhetsansvar-utleie-fiskebat` | A complete set of small-boat safety gear laid out tidily in the right foreground of a weathered dock — life jackets incl. a child size, red fire extinguisher, coiled throw line, bailing scoop, signal whistle; aluminium boat moored alongside, red naust right, calm sheltered inlet and grey headlands left; flat overcast late-afternoon light | quiet responsibility, careful preparation before the trip |

---

*Last updated: 2026-05-11*
