# research/audhd-opts-1019: three options the AuDHD recipes project asked for

Round `audhdopts-<uuid>` (see `demo.html`, 2026-10-19): 3 sections, 3 pairs (formal). Gaps 1, 2 and 24 of `~/Projects/kp-gaps/audhd-recepten.md`
(open items O1, O2, O9). They add options to approved components, so they come back through the review dialog with a "What changed" text.
Bundled into `round-3-1019` (VERDICTS.json `bundledInto`); the page has no `catalogue/pages.js` entry. See CHANGELOG.md "Unreleased".

1. **action-size**: `data-kp-action-size="compact" | "large"` on the tile board, a tile or any element above them (css/components.css, js/action-tiles.js `setActionSize`).
2. **freshness-tone**: `data-kp-stale-tone="calm"` (a quiet plate instead of the amber one) and `data-kp-ago-units="days"` (whole days from one day on) (css/components.css, js/freshness.js).
3. **sentence-computed**: a read-only computed field, `<output class="kp-sentence__computed" data-kp-sentence-computed="name">`, worked out by `attachSentences(root, { computed })`, `sentence(form).compute(name, fn)` or `setSentenceComputed()` (css/components.css, js/sentence.js).

Every section is a board of twelve columns (the component on eight, a readout on four); the freshness lines sit in a `.kp-formgrid`.

**Generated** by `node research/audhd-opts-1019/build.mjs` (edit the builder, never the page).
