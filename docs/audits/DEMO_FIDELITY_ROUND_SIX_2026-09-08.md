# Demo fidelity, round six — the nineteen lifts

What each lift reported rather than corrected, gathered in one document
for the combined ratification [S49, S42, KT15]. The rule: an approved
concept demo is implemented exactly, and where a gate, a test or an
invariant disagrees with it, the disagreement becomes a finding for Kenny
instead of a silent change to the demo.

Each section below is its lift's own Findings section, as its agent wrote
it. The three themes whose agent was killed before it could write a
report carry a section written here, from what the integration found.

The four themes ratified earlier in the round have their own documents:
`DEMO_FIDELITY_PHANTOM_2026-09-08.md`, `..._RETRO_...`, `..._TERMINAL_...`
and `..._BRUTALISM_...`.

## academia

**Tokens needed no change.** Converting every HSL token in
`themes/academia/tokens.json` to hex and diffing against the demo's own
literal hex table (its header comment) found **zero differences** —
`--background` `#1e1610`, `--primary` `#c9a25e`, `--accent` `#7c1d1d`,
all fifteen colours it lists, plus `--theme-font-display`/`-body` and
`--kp-text-display`, matched exactly. So X0 made no token edits, and
`node gates/check-contrast.mjs` / `check-invariants.mjs` pass with no
academia-specific findings.

**Fonts needed no change.** `fonts/families.json` already listed
Cormorant Garamond and the renamed Lora (`KP Academia Serif`, R6-Q1) for
this theme, both already subsetted on disk
(`fonts/cormorantgaramond/*.woff2`, `fonts/lora/*.woff2`) — apparently
done in an earlier round-six pass. X3 shipped nothing new.

**Two rendering deviations from the demo's own standalone CSS**, both
required by the package's own architecture (AR34: a page without the
effects module must read whole) rather than by any gate disagreeing with
the demo's *appearance*:

1. The demo's own `<script>`-and-CSS pair starts the headline/rule bars
   at `scaleX(0)` and only its own inline script ever reveals them; the
   register instead draws them by default and hides them only while
   `[data-kp-effects]` is present and the heading has not yet entered the
   viewport — identical to the demo whenever the module runs, and
   additionally correct for the no-script case the demo's own fragment
   never had to handle (same shape as cyberpunk/synthwave/terminal).
2. Same reasoning for the dossier's redaction marks: revealed by default,
   covered only while armed and not yet cleared.

**The folder stack is one plate, not two — found by a test, not by
inspection.** The demo's own markup wraps the card in a separate
`.kp-folder-stack` element carrying two rotated plates on its own
`::before`/`::after`. The shared concept-page template
(`showcase/examples.mjs`) has no such wrapper: `data-kp-reveal`
(the dossier hook) and `data-kp-label` (the stamp) sit on the *same*
`Card` element, and the stamp already needs `::before` (the convention
shared with terminal, retro, phantom and brutalism). My first version
put the folder-stack plates on `::before` **and** `::after` of that same
element, which silently stole the stamp's `::before` — the stamp still
rendered *something* (cascade merges properties per-declaration, not
per-rule), but rotated, mis-positioned and sitting behind the card at
`z-index:-1`, effectively invisible. I strengthened the dossier test to
assert the stamp's own content independently of the stack's plate, which
caught it; the fix keeps the stamp on `::before` and gives the folder
stack one plate on `::after` alone. Recorded in the anatomy as a finding
rather than silently "fixed to match the demo," per S49.

**The stamp never swaps its word.** The demo's own JS never changes
"Restricted" when the file opens. The shared template always emits a
`data-kp-label-open` attribute (added for the other four themes' own
swaps, S49-A11), so a word (`stampLabelOpen: 'Cleared'`) was supplied in
`showcase/concept-copy.mjs` for shape-completeness, but the register
does not read that attribute — the stamp stays static, exactly as the
demo shows it.

**The spec sheet's nine rows fit the shared template's fixed eight.**
The demo names nine swatches (ground, card, act, ordinary, means, alarm,
display, body, mono); the shared template has eight fixed slots tied to
specific tokens. `spec1`/`spec2` ("hero"/"ground") stand in for the
demo's one "ground" row split across the template's hero/page swatches
(identical colour in this theme); `spec5` ("marginal") is invented for
the template's required fifth-colour row (`--chart-4`), which the demo's
own dossier never discusses. "card", "act" and "ordinary" have no slot
and are not shown. Copy for `navEffects` ("Sources", the demo's own
remaining plain link), `navDocs` ("Colophon", invented) and
`footerCol3c` ("Home Assistant", invented, matching every other lifted
theme's own invention there) were filled in the demo's voice per
`copy-slots.md`'s instruction, since the shared nav/footer shape needs
six link slots the demo's own nav (four items) and footer (two links per
column) don't all name.

**Texture is under the ceiling with no override needed.** The duotone
wash (a local `--fx-texture`/`--fx-texture-opacity` layer on the hero and
app surfaces, additional to the theme's own pre-existing base grain in
`css/_rules.css`) sits at 0.04 effective opacity — `node
gates/check-texture.mjs` measured it directly; no `textureOpacityCeiling.perTheme`
entry was needed.

## blueprint

1. **`theme-font-mono` changed, the demo wins.** The demo names Geist Mono explicitly for every mono use on the page (the dimension labels, the dropdown's leaders, the spec sheet, the side note). The token held a generic system-mono stack. Changed the token; `node gates/check-contrast.mjs` and `node gates/check-invariants.mjs` both still pass unchanged (font family carries no contrast weight). `fonts/families.json` updated so the face is declared for this theme.
2. **The dropdown's per-item annotation label is dropped, not built.** The demo's title block carries `content: attr(data-kp-menu-label)` reading a per-submenu value (`"Detail · scale 4:1"`, `"Key · rev A"`, `"Sheet · lang"`) that the demo's own raw markup supplies as a data attribute on each `<ul class="kp-nav__menu">`. The canonical `NavBar` component the package's shared generator (`showcase/examples.mjs`) renders has no per-submenu label prop — adding one is a change to shared component code nineteen parallel lifts are not coordinating on. Everything else of the title block is built exactly: the ground-coloured panel (not a filled surface), the single hairline border, the cyan top rule, the numbered `01`/`02`/`03` leaders, the cyan wash on hover.
3. **The dossier's stamp moved from a literal child node to `content: attr(data-kp-label)`.** The demo's raw HTML has `<span class="kp-stamp">APPROVED FOR CONSTRUCTION</span>` inside the card header. The canonical `Card` component the generator renders carries the stamp only as a `data-kp-label` attribute with no child node — the same adaptation retro and terminal already made for their own stamps. Same visual result (a rotated, bordered mono label near the header), no shared file touched.
4. **The cyanotype construction diagram is not built at all.** The demo's SVG polygon beside the spec sheet (a wireframe hexagon under a cyan `mix-blend-mode: color` tint) has no slot in the canonical hero structure — the generator's spec aside is a fixed `<dl>` with no room for a second graphic, and every other lifted theme's page shares that same aside. This is the one piece of the demo genuinely missing from the package; it is decorative, not mechanical, unlike the dimension lines (which are built, live, and real).
5. **Texture over the ceiling, reported (S42).** The crosshair tile's `stroke-opacity` is `0.18` in the demo's own SVG — inside a data URI and so exempt from DI9's "no colour of your own" rule (`check-layers.mjs` masks data-URI content before scanning), but not from `gates/check-texture.mjs`'s opacity ceiling, which reads the strongest alpha anywhere in the whole `--fx-texture` declaration regardless of how sparse the mark carrying it is (one crosshair every 160px, ~6px of ink each). `gates/config.json`'s `textureOpacityCeiling.perTheme.blueprint` is `0.18`, kept rather than weakened.
6. **A contrast false positive on the lede's two marks, reported via the now-generalised `REPORTED` list, not fixed by changing the demo.** The demo's `.kp-lede mark` is a translucent cyan wash (`background-color: hsl(from --primary … / 0.28)`) with the page's ordinary foreground text on top — exactly the demo's own file. `tests/surfaces.spec.mjs`'s `GROUND` helper treats any non-fully-transparent `background-color` as an opaque ground and does not composite it against the mark's true ancestor (`--background`), so it measured `rgb(223,242,246)` against the *raw* translucent cyan and got 1.54 — both colours read as light because the alpha channel is not applied. I composited it by hand (alpha-blend in sRGB, the way a browser actually paints it): `rgb(223,242,246)` on the wash-over-`--background` is **7.75**, well clear of the 4.5 floor — the true rendered page is fine; the test tool's alpha-blind ground detection is not. Recorded in `tests/surfaces.spec.mjs`'s `REPORTED` dictionary (now a list per theme, matching the shade-dark precedent already there) with the composited value and the reasoning, exactly as S42 asks: reported, not silently changed.

## dark

**The token measurement (X0).** Dark's `themes/dark/tokens.json` was
measured against every literal the demo declares — background, card,
popover, primary, primary-foreground, accent, destructive, success,
warning, info and their foregrounds, border, border-strong/input,
fx-duration, fx-ease, radius — by converting each token's HSL to hex by
hand and comparing to the demo's own `#RRGGBB` literals (e.g. `hsl(226,
22%, 8%)` → `#101219`, exactly the demo's `--void`). **Every value
already matched exactly.** `node gates/check-contrast.mjs` and `node
gates/check-invariants.mjs` both pass with zero token changes. This is a
finding worth recording precisely because it means dark's Phase-2-era
tokens were already the demo's own palette — nothing was silently kept
different.

**The starfield, over DI9's ceiling — reported, not corrected (S42).**
The demo's own header comment measures its texture layer at **0.35**
effective opacity — roughly 5.8× DI9's 0.06 ceiling. `gates/config.json`
now carries `textureOpacityCeiling.perTheme.dark: 0.35`, the demo named
as the reason in the file's own shared comment, exactly the phantom
precedent (`0.14`). `node gates/check-texture.mjs` passes with this
ceiling in place; DI9's 0.06 remains unchanged for every other theme.

**The shimmer, a mechanism substitution (not a value change).** The
demo's ten brightest stars are an inline SVG `<symbol>` reused by ten
`<use>` elements. A register is CSS only, and `examples/concept.html`
(and its per-theme copies) is markup shared by every theme in the
package — a register cannot add an SVG block to it, and none of the
other five lifted themes' registers do either. The same appearance — a
soft core plus eight thin rays, subtle, fading with distance from the
star's centre, only ten of 112 points carrying it — is rebuilt with
layered `conic-gradient` rays (positioned with the gradient's own `at
X% Y%`, at the demo's own per-star rotation recomputed as angle offsets)
masked, per star, by a small `radial-gradient` window (`mask-image`,
default union across all ten), so the rays taper by distance the way the
SVG's stroke gradient did. This is **not** treated as an S49 finding
requiring Kenny's approval, because no value or appearance was changed —
the positions, radii, alphas, opacity and count are the demo's own
literals, unmoved; only the drawing technique differs, because the
alternative (adding markup) was not available to a register at all. It
is written down in `themes/dark/anatomy.md`'s closing section as a build
note.

**Two invented copy slots, marked in `showcase/concept-copy.mjs`.** The
demo's dossier carries one paragraph and a stamp that never swaps its
label; the shared concept page's template needs `dossierPara2` (the
second paragraph, explaining what the trigger does) and
`stampLabelOpen` (the stamp's word once the log is open) from every
theme. Both are written in the demo's own voice — "Open the log to clear
the redactions...", "Read" — and marked `// invented:` in the source
rather than presented as taken from the demo.

**The spec sheet's eight labels, an interpretive mapping.** The shared
concept page's spec sheet has eight fixed rows (hero ground, page ground,
alert, label/accent, a theme's own fifth colour, display, body, mono);
the demo's own spec sheet has ten rows in a different shape (an extra
`ink`/`tokens` pair, no separate hero-ground row). `spec1`–`spec8` answer
the template's eight fixed slots in the demo's own vocabulary (`ground`,
`void`, `danger`, `accent`, `edge`, `display`, `body`, `mono`) rather than
being a literal transcription of the demo's own ten-row list — this is
recorded in `themes/dark/anatomy.md` as a build note.

## deco

1. **Two colour literals in the demo's CSS are not exact token matches.** DI9 refuses a colour literal outside the token layer, and every one the demo wrote resolves onto an existing token — except the nav dropdown's shadow (`hsl(200 40% 2% / .5)`) and the dialog's backdrop (`hsl(200 40% 2% / .72)`), whose near-black is close to but not identical to `--sidebar-background` (`hsl(200, 28%, 6%)`). Both render visually indistinguishable from the demo (near-black, faintly blue) but are not bit-identical. The register uses `hsl(from var(--sidebar-background) h s l / N)` for both. If Kenny wants the exact literal, the alternative is a new token pinned to the demo's own value, which S47's parity gate would then require in all 25 themes — not done here, reported instead.
2. **The headline reveal is answered quietly, on purpose, not with a JS routine.** The demo's own script has no code for the headline at all — only the frame's CSS animation runs. None of `js/effects.js`'s headline routines (decipher, tracking, shout/slam, dissolve, type) matches "the whole frame scales in once, untouched text"; forcing one would either do nothing or risk a layout shift inside the cartouche. `--kp-reveal-headline` is left undeclared (quiet), and the frame's `kp-cartouche-in` animation runs unconditionally under the reduced-motion guard instead — this is a design decision recorded in the anatomy, not a gap.
3. **The pre-existing base-layer flourish for deco conflicted with the demo and was neutralised, not removed.** `css/_rules.css` already drew an unconditional double gold rule under every deco `h1`/`h2` (assigned when "one gesture per theme" was frozen, before this lift). Left alone it would have painted an extra rule under the cartouche-framed hero headline. The register cancels it with `content: none` scoped to `[data-kp-surface] h1::after` only, so a plain h1 elsewhere still gets the base flourish. The shared file itself was not edited.
4. **The dossier's three redacted facts became one flowing sentence, not three paragraphs**, and **the mirror flourish/nav dropdown/dialog literals were rewritten as relative colours of existing tokens** — both are honest adaptations to the shared page skeleton and to DI9, documented in full in the anatomy's closing section, not silent departures from the demo.

## formal

1. **`themes/formal/tokens.json` needed no changes.** I converted every
   hex value the demo's `:root` declares (`--paper`, `--card`, `--muted`,
   `--ink`, `--ink-soft`, `--navy`, `--on-navy`, `--bronze`,
   `--bronze-ink`, `--gold`, `--brick`, `--on-brick`, `--line`,
   `--line-strong`, `--ring`, `--radius`) to HSL and compared against the
   existing token values by hand (a throwaway Node script, not
   committed): every one matches exactly or within rounding of a hex
   round-trip. `--radius` (0.375rem) and `kp-text-display`
   (`clamp(2rem, 4vw, 3rem)`) also match exactly. This is a genuinely
   clean case — no token change, no gate re-check needed for a value
   change.
2. **The headline's per-word underline recolour could not be carried.**
   The demo draws a gold-then-navy underline under one word ("unchanged")
   only. The package's shared headline markup (`conceptBody()`) renders a
   theme's headline as one plain string with no way to mark a sub-phrase,
   and teaching it one broke a shared gate test (§3). Built instead: the
   headline's fade and rise, exactly as authored, with no underline. This
   is the single largest visible gap between the demo and what ships; the
   fix, if wanted, is a small additive change to `conceptBody()` (an
   optional slot only formal would set) plus a corresponding change to
   `gates/gates.test.mjs`'s exact-string assertion — out of scope for a
   single-theme lift touching shared infrastructure, and named here for
   Kenny.
3. **The hover/pressed colours are close to, not identical with, the
   demo's own literal values.** DI9 forbids a hex colour anywhere in the
   register. The demo's `:root` declares `--navy-hover: #192843` and
   `--brick-hover: #872222` as its own literal values (not derived from
   anything); the register uses the system's own `--primary-hover` /
   `--destructive-hover` (DI3's standard lightness step — this theme's
   own anatomy already commits to following it "unmodified"). Measured:
   `--primary-hover` resolves to `#132749` (demo: `#192843`, a few RGB
   units per channel apart); `--destructive-hover` to `#8e1018` (demo:
   `#872222`, a larger but still small drift, mainly in the green
   channel). Reported rather than corrected, per S49/DI9 both applying
   and pointing in opposite directions here.
4. **The secondary and ghost button hovers are exact.** The demo's own
   `.kp-button--secondary:hover` and `.kp-button--ghost:hover` read its
   own local `var(--line)` / `var(--card)`, which map onto the package's
   `--border` / `--card` tokens hex-for-hex. Used directly — no drift.
5. **The dossier is carried through the package's own mechanism,
   appearance kept (a Class B carry).** The demo builds three separate
   `<p>` lines with their own spans and a second "Close dossier" button
   that appears once revealed; the package's dossier is a `Card` with a
   single toggling trigger (a second press re-covers — the hook
   vocabulary's own `wireTrigger()`). The three redacted phrases are the
   demo's own three sentences, carried nearly verbatim as the three
   `<mark>`s of one flowing paragraph. The stamp text ("Draft — not for
   release") is exact and, matching the demo, never changes on reveal.
6. **Several copy slots are invented in the demo's own voice**, per the
   words process (A1), because the demo has no equivalent element: the
   platforms line (prose in the demo, four discrete labels in the
   schema — the four consumer names are carried verbatim), the three
   laurels (icon+value in the demo, bold+caption in the schema — the
   three values are verbatim, the captions invented), two of the eight
   spec rows (`--chart-4` and the mono face, neither shown in the demo's
   own spec sheet), the "Effects"/"Docs" nav links and the language
   dropdown's two options (the demo has neither a third/fourth nav link
   nor a language dropdown). Recorded in `themes/formal/anatomy.md`'s
   closing section in full.
7. **The texture is unchanged and already under the ceiling.** The
   register makes no claim on `--fx-texture`; formal's grain stays at
   0.035 (DI9's ceiling is 0.06), and the demo's own header explicitly
   licenses "no visible texture" — no conflict, no `gates/config.json`
   `textureOpacityCeiling.perTheme` entry needed.
8. **The old, blanket per-heading rule was retired**, not merely
   supplemented — see §3.

## grotesk

- **Token fidelity, measured exactly.** Recomputing every `hsl()` value in `themes/grotesk/tokens.json` to 8-bit sRGB and comparing against the demo's own literal hex: `paper`, `ink`, `signal` (`#E00618`, matching the demo's own *recomputed* figure, not the stale `#E30613` its prose carried — the demo's own comment says its recomputed value is authoritative and I've corrected the anatomy's prose to match), `alarm`, `plate`, `wash`, `muted-ink`, `hairline`, `info` all matched to the pixel. Only `kp-text-display` differed and was changed (§1).
- **The base layer's pre-round-six heading accent conflicts with the demo, and was resolved in the demo's favour, in my own file only.** `css/_rules.css` (shared, not touched) gives grotesk's `h1`/`h2` a static red square before the text since 3.1.1 ("Müller-Brockmann's mark"). The approved demo's own headings carry no such glyph. `content: none` on `[data-kp-surface] h1::before`/`h2::before`, scoped inside my register, suppresses it only inside a surface — the flourish still stands elsewhere (docs, showcase). **This is a finding, not a silent fix**: whether the base-layer signature should retire for grotesk everywhere is Kenny's call.
- **The twelve-column texture's opacity.** The demo's own comment states 4%; `css/_rules.css`'s grotesk texture block (predates this round) declares 5%. Both are under DI9's 6% ceiling; the file is shared base layer, not mine, so it was left as measured rather than edited. **Finding**: move 5% → 4%, or leave it — either is a one-point difference under the ceiling.
- **The demo's literal 2fr/12fr hero grid could not be built as a literal port.** The demo's own markup puts the vertical side note in a real 2fr grid column beside a 12fr headline column. The shared concept markup's hero grid has two different roles (content column, spec-sheet column via `data-kp-hero-grid`), and the side note is a sibling of that grid in every lifted theme, not a column in it. The register keeps the demo's *asymmetry* (3fr/1fr) and positions the side note absolutely in the margin — the same adaptation phantom and retro made for their own margin notes.
- **The concept page's spec-sheet labels I first wrote didn't match what the template actually swatches, and I caught it by looking at a screenshot, not by reading the markup twice.** The template's five swatch rows are fixed to `--surface-hero-bg`, `--background`, `--destructive`, `--accent`, `--chart-4` in that order (not something a lift chooses). For grotesk, `--accent` is ink (black) and `--chart-4` is the info blue — I had labelled those rows "plate" and "signal", which is wrong on the actual swatch colour. Corrected to `ground`/`ink`/`info` and re-verified visually.
- **DI5.** Every animation in the register is one-shot and monotone (the headline's blur+brightness resolve, the rule's draw-in, the redaction's three-step cut, the two-speed colour swaps, the dialog's open); `npm run report:di5` rates `kp-sharpen-in` at 0.00/s (filter isn't opacity-tracked, but it's the demo's own worked example of "one change" — see the `OUT_OF_SCOPE` reason). Nothing over the threshold; nothing to report under S42.

## high-contrast

Full detail is in `themes/high-contrast/anatomy.md`'s "What the demo
showed and the package now renders exactly (S49)" section. Summary:

1. **The dossier's redactions are `<mark>`, not the demo's own
   `.kp-redaction`/`<i>` markup.** The demo (a free-standing mockup) used
   custom `<span class="kp-redaction">` elements and an inline `<script>`
   toggling `data-kp-revealed`. The package's one shared concept-page
   descriptor (`showcase/examples.mjs`) renders the same three phrases as
   `<mark>` inside `data-kp-reveal="emphasis"` — the choice every other
   lifted theme (retro, phantom, terminal, brutalism) made too, since
   there is one descriptor for all 25 themes, not one per theme. The
   register reproduces the demo's exact appearance and stagger
   (0/90/180ms) through that mechanism.
2. **The headline and rule reveals are plain CSS, unconditional, and
   replay on every load rather than once per session.** No
   `--kp-reveal-headline` / `--kp-reveal-rule` is declared, so
   `js/effects.js` treats both as quiet. This was the only way to get the
   demo's exact clip-path wipe with the text never scrambled: every
   `js/effects.js` headline routine other than `tracking` / `shout` /
   `slam` / `dissolve` / `type` falls through to the decipher/glitch
   default, which the demo explicitly refuses ("no character
   scrambling"), and none of those five draws an ellipse wipe. The
   consequence: neither reveal is gated by `[data-kp-effects]`, neither
   uses the `sessionStorage` memo the other five registers rely on, and
   the rule draws on load rather than on scroll-into-view. A page refresh
   replays both wipes, where retro or phantom would not replay theirs.
3. **The ghost button's rising bar replaces the demo's duplicate-label
   slide.** The demo's mechanism needs two copies of the label in the
   DOM (`.kp-button__label` + `.kp-button__ghost-copy`); the shared
   `Button` renderer in `showcase/examples.mjs` emits one child only, and
   a page-local script to add the second copy is forbidden
   (`gates/generate-examples.mjs`'s own rule, TH109: four stylesheets,
   the markup, one module script, nothing else). Built instead: a 3px
   bar rises from the bottom edge on hover/focus-visible — the same
   "something arrives from below" gesture, CSS-only, content-free.
4. **The nav recolour on scroll has no JS to drive it.** `grep -rn
   "data-scrolled" js/*.js css/*.css` (before this lift) returned
   nothing — no module in the package sets `[data-scrolled]` anywhere.
   The register's rule is kept, inert, matching the demo exactly the
   moment such a hook exists.
5. **The spec sheet's five swatches are the shared template's fixed
   five, not the demo's own five.** The demo labels ground/ink/signal/
   action/alert against `surface-hero-bg`/`foreground`/`accent`/
   `primary`/`destructive`; `showcase/examples.mjs` hard-codes its five
   `data-token` values as `surface-hero-bg`/`background`/`destructive`/
   `accent`/`chart-4` for every theme. `primary` has no slot; `chart-4`
   does. Labelled in the demo's own words where a slot has one (`paper`,
   `alert`, `signal`), invented in its voice where none does (`page`,
   `flag`).
6. **The mirrored button's press needed one extra line to be instant.**
   The shared `.kp-button` rule (`css/components.css`) puts `translate`
   in its transition list for the hover lift every theme answers with
   `--fx-lift`. High-contrast's `--fx-lift` is `0px` so the lift itself
   is a no-op, but the same list would have eased the mirror's press over
   `--fx-duration` (120ms) instead of snapping it. Fixed with
   `.kp-button--mirror { transition: none; }`, scoped to that one
   variant — not a demo deviation once fixed, but worth recording since
   it was caught only by the drilled test failing on a fractional-pixel
   `translate` mid-transition.
7. **The laurel token count is measured, not copied from the demo's own
   text.** The demo's laurel reads "94 tokens"; the contract now declares
   96 (checked `themes/high-contrast/tokens.json`, 2026-09-08 — round six
   added tokens since the demo was written). Copy uses 96, per KT1.
8. **The dossier's meta line has no equivalent in the demo.** The
   mockup's card carries a visible stamp and no meta paragraph; the
   shared descriptor always renders one. Written in the demo's own
   bureaucratic voice: `FILE 06 · STATUS: PREVIEW · CLEARANCE: AAA`.

Nothing measured broke a contrast pair or an invariant. The theme's own
contrast table (in the demo's header comment) was re-verified by hand
against `themes/high-contrast/tokens.json` before writing any CSS —
`primary` = `hsl(220, 100%, 30%)`, `destructive` = `hsl(0, 100%, 32%)`,
`accent` = `hsl(48, 100%, 50%)` and the rest all convert to the exact hex
the demo's own comment computes, so **zero tokens changed** for this lift.
`node gates/check-contrast.mjs` and `node gates/check-invariants.mjs` both
pass unchanged, and `gates/check-texture.mjs` finds nothing to measure
for this theme (no `--fx-texture` declared) — no per-theme ceiling
override was needed.

One implementation bug caught by looking at a screenshot, not by a gate:
the dossier's third redaction ("tired eyes at the end of a shift") wraps
across two lines at 1280px, and an absolutely-positioned `::after` on an
inline `<mark>` only covers the LAST line fragment of a wrapped inline
box — the bar rendered as a thin sliver instead of covering the phrase.
Fixed with `display: inline-block` on the dossier's `mark`, which forces
the whole phrase to wrap as one atomic box. Re-screenshotted to confirm.

## light

1. **No token changed.** X0's palette check (Python, HSL→hex, all sixteen
   colours the demo's own header comment lists as measured) matched
   `themes/light/tokens.json` exactly, confirmed before writing a line of
   CSS. `node gates/check-contrast.mjs` and `node gates/check-invariants.mjs`
   were not affected.
2. **The button hover lift is 2px, not the demo's 1px.** `--fx-lift` is
   a cross-theme token every theme reads (`translate: 0 calc(-1 *
   var(--fx-lift))`); light's own value is 2px. Retuning it for a 1px
   cosmetic match would move every other theme's hover by the same
   amount — out of scope for a single-theme lift. Reported, not
   corrected (S42).
3. **The dialog backdrop is the base layer's `rgb(0 0 0 / 0.5)`, not the
   demo's `rgba(23, 27, 38, 0.35)`.** `css/components.css`'s own comment
   says this is deliberate ("a backdrop is a dimming of whatever is
   behind it, and a theme colour here would tint the page rather than
   dim it") — a cross-theme convention, not a light-specific choice.
   Reported, not corrected.
4. **The dossier redaction mechanism is a translation, not a copy.** The
   demo's own `.kp-redaction` spans plus a hand-rolled `<script>` with
   three `setTimeout`s do not exist in the package's shared concept-page
   markup — every theme's dossier uses `<mark>` elements inside a
   `[data-kp-reveal='emphasis']` container, driven by `js/effects.js`'s
   built-in trigger wiring (`wireTrigger`, which toggles every mark's
   class in the same tick, not staggered). The demo's exact rest colour,
   cleared colour, 260ms duration and 140ms stagger were all reproduced —
   the stagger as a CSS `transition-delay` per `nth-of-type` rather than
   three JS timers — with no visible difference, but it is a mechanism
   substitution worth naming plainly (retro's own audit records the
   identical pattern for its redaction brush).
5. **A cascade bug was caught by the spec, not by inspection**: the first
   draft of the register let a single shared `mark.is-cleared` sweep
   animation apply to *every* cleared mark, including the dossier's — a
   CSS animation always outranks a normal declaration regardless of
   specificity, so the lede's highlighter colour (`--accent-foreground`)
   was leaking into the dossier's redaction, which should read
   `--foreground`. Fixed by partitioning every mark selector on ancestry
   (`:not([data-kp-reveal='emphasis'] mark)` vs.
   `[data-kp-reveal='emphasis'] mark`) rather than relying on specificity.
   Caught by `tests/register-light.spec.mjs`'s own dossier test before
   any gate would have seen it — no gate checks cross-mark colour bleed.
6. **`themes/hooks.json`'s `emphasis` answer had to name the exact
   selector, not a conceptual one** — `[data-theme='light'] mark` (the
   selector I first wrote in the hooks row) stopped matching once finding
   §5 above required the real selector to carry a `:not(...)` clause;
   `check-hooks.mjs` refused it until the row was updated to the literal
   selector the CSS uses.

## mono

1. **Tokens already matched exactly — no token change for this lift.**
   Every value the demo's own header comment measures (the eight hex
   colours, the contrast ratios, the two font stacks, the display
   clamp, the spacing scale) was already present in `themes/mono/tokens.json`
   before I opened it — someone had already prepared it. `node
   gates/check-contrast.mjs` and `node gates/check-invariants.mjs` both
   passed unchanged, so this is a genuine zero rather than an unchecked
   claim.
2. **Fonts and their subset files already shipped.** Both faces the
   demo names — Inter Tight and Geist Mono — were already in
   `fonts/families.json` (`themes: ["mono"]`, `reservedFontName: false`
   for both) with their `.woff2` files already present under `fonts/`,
   and `css/fonts.css` already carried the `@font-face` rules. X3 needed
   no work.
3. **`--kp-mask-in` / `--kp-mask-out` is one mechanism, not two.** The
   demo's own top comment already says this: the headline reveal and
   the dossier's redaction bars are the same `mask-image` /
   `mask-position` sweep, run in opposite directions. The register
   expresses that as one pair of custom properties and one new
   `@keyframes kp-wipe`, used at 600ms on the headline and 400ms
   (staggered ×3) on the redaction bars — a genuine one-mechanism,
   two-hooks implementation rather than two lookalike but separate
   ones.
4. **The demo's stamp never changes when the file opens** (unlike
   brutalism's, which the S49 audit record for that theme names). The
   register declares no `[data-kp-open]` override; Classified stays
   Classified. `stampLabelOpen` still needed a value in
   `showcase/concept-copy.mjs`, because the shared generator always
   renders that attribute — set equal to `stampLabel` so the unused
   attribute is never empty, not a contradiction of the demo.
5. **The nav dropdown's shadow was extended to its whole panel family**
   (popover, menu, toast, tooltip, confirm, the datepicker panel, the
   combobox list, the palette, the theme menu) — the demo only shows
   the one dropdown, but every other lifted theme (brutalism, terminal)
   has made the same extension for the same reason: these are
   mechanically the same kind of surface. The dialog is excluded — the
   demo draws it modal and flat, and the register keeps it that way. Not
   a rule the demo contradicts, but flagged per S49 since it is copy in
   more places than the demo's own markup shows.
6. **One CSS colour-literal-in-a-comment slip, corrected before commit.**
   My first draft of the register quoted the demo's own `rgba(23, 23,
   23, .12)` inside a comment to explain the shadow token; `gates/check-layers.mjs`
   correctly refused it (DI9: "not even in a comment"). Fixed by
   describing it in words instead. Not a finding against the demo —
   against my own first draft, corrected, listed here because the brief
   asked for every rule violation measured, not only the ones that
   survived.
7. **No contrast pair, no texture, and no motion-budget overrun.** Mono
   declares `--fx-texture` nowhere (TH72, already true before this
   lift), so `check:texture` measures nothing new; DI5's report shows
   `kp-wipe` at 0.00 luminance-changes/second (mask-position carries no
   luminance channel); every contrast pair the demo's own header
   comment computes already clears its floor in the token contract.

## nostromo

**Reported, not corrected (S49):**

1. **The demo's rule and headline reveals are unconditional on
   `[data-kp-effects]`; the package's shared architecture gates the rule
   on `.is-in` (scroll-into-view).** The demo's raw standalone HTML plays
   both the headline and the two section-rule underlines the instant
   `data-kp-effects` is present (no `.is-in` class, no scroll gating,
   because the demo is a short static page with no scroll behaviour to
   model). `js/effects.js`'s `rule()` dispatch is unconditionally
   IntersectionObserver-driven for every theme that declares a rule
   routine, with no per-theme override point, and every other lifted
   theme (cyberpunk, synthwave, phantom, retro, terminal, brutalism)
   relies on that same gating. Rather than patch shared code for a
   difference invisible whenever the heading is above the fold (true of
   the generated concept page and of the spec's own tests), nostromo's
   rule reveal keeps the standard `.is-in` gating; the visual mechanism,
   duration (280ms) and delay (60ms) are otherwise exact. The headline is
   unaffected — no headline routine is scroll-gated in the shared
   module, so it fires at load exactly as the demo does.
2. **The demo scopes its vent texture to the hero section (`.kp-vent`);
   the package's shared texture layer is a fixed, page-wide `body::after`
   overlay.** Every other lifted theme uses the same page-wide mechanism
   (declared once in `css/_rules.css`, applied everywhere via the shared
   `kp.base` rule), and building a per-section texture-scoping mechanism
   that no other theme uses was out of proportion to a difference the
   demo's own short page (hero plus one section filling most of a normal
   viewport) makes nearly invisible. The rib direction and opacity are
   otherwise exact (see item 3 below).
3. **`.kp-field__required`'s colour.** The demo's own CSS colours this
   span with `--selected` (`color: var(--selected)`), which the demo's
   own contrast section (part 4 of its comment block) classifies as a
   **boundary** application (≥3:1 required) rather than text (≥4.5:1) —
   `selected #a94219 on bg #d7cbb7 : 3.77`, explicitly listed under
   "BOUNDARIES / NON-TEXT", not under the text-safe pairs. Measured
   again on the actual rendered app surface: 3.77, under the 4.5 floor
   `tests/surfaces.spec.mjs` enforces for every text span in every
   theme. Since the demo's own arithmetic never claimed this pairing
   clears the text floor, this register uses `--destructive` instead
   (6.08:1 in the same place, the same "attend to this" register the
   colour choice was going for) rather than reproduce a failure the
   demo's own measurement already flags as boundary-only.

**Measured and corrected within the lift (not silent — see anatomy.md
"What the demo showed" and this report's §3 above):**

- The pre-lift vent-texture direction and the pre-lift uppercase heading
  treatment in `css/_rules.css`, both predating the approved demo and
  both now matching it exactly.

**Discovered and fixed as ordinary bugs (not S49 conflicts):**

- `--kp-highlight` **name collision.** The knobs block first declared
  `--kp-highlight: hsl(from var(--selected) h s l / 0.28)` for the
  lede/loose-mark underline. `css/components.css` already uses
  `--kp-highlight` as its own generic knob (default `hsl(from
  var(--foreground) h s l / 0.08)`) for the keyboard-focus wash on eight
  shared components (menu, listbox, combobox, palette, tabs, the native
  `<select>` option hover, …). Redeclaring it globally under
  `[data-theme='nostromo']` silently overrode every one of those with a
  more saturated, more opaque, orange-tinted wash instead of the
  intended dim ink wash. Caught by `tests/dashboard.spec.mjs`,
  `tests/fixtures.spec.mjs` (three separate cases) and
  `tests/surfaces.spec.mjs` when running the shared suites — not by my
  own spec, which never exercised those shared components. Renamed to
  `--kp-underline` throughout the register; no visual change to
  anything the demo shows.
- `.kp-spinner`'s head/track pair (`--selected` vs `--border-strong`)
  measured 1.17:1, under KT8's 1.5:1 floor for "visibly turning" —
  switched the head to `--foreground` (2.92:1). Not something the demo
  specifies (the demo has no spinner); a beyond-demo component root.

## pastel

- **Every colour in the demo already matched an existing pastel token,
  measured to the pixel** (background, foreground, card,
  primary/-foreground, secondary/-foreground, accent/-foreground,
  destructive/-foreground, warning/-foreground, info/-foreground, border,
  border-strong, muted, muted-foreground, sidebar-background,
  fx-overprint, fx-ease, fx-duration, radius, and all three font tokens).
  No token value needed to change for X0, `--fx-lift` (3px → 2px)
  excepted.
- **The stamp's plate and ink colour** (`#3a9869` / `#000000` in the demo)
  matched no existing token. Rather than add a new contract-wide token
  (S47's remedy for a colour no token can reach at all), it is expressed
  as `hsl(from var(--accent) h 45% 41%)` — the accent token's own hue, at
  the demo's own measured saturation and lightness — and the ink as
  `hsl(from var(--foreground) h s 0%)`. Both are pixel-exact to the demo.
- **The dossier redaction markup differs from the demo's own HTML.** The
  demo draws three standalone `.kp-redaction` `<span>`s beside plain text;
  the package's shared concept skeleton (and every other lifted theme's
  dossier) puts the three redacted phrases inside `<mark>` elements in one
  flowing paragraph — the only shape `js/effects.js`'s emphasis trigger
  wires to. The mechanism (an ink bar that fades and narrows away,
  staggered 90ms) is built exactly; the markup it attaches to is the
  package's, not the demo's.
- **The stamp's position** is the package's established corner-badge
  pattern (`::before`, `attr(data-kp-label)`, absolutely positioned,
  rotated) rather than the demo's inline badge at the top of the card,
  because the shared Card component only carries a label through that one
  attribute-and-pseudo-element channel — every prior lifted theme's stamp
  is built the same way.
- **The halftone's `mix-blend-mode: multiply` could not be carried
  through.** The package's one shared texture layer
  (`body::after` in `css/_rules.css`) has only `background-image`,
  `background-size` and opacity knobs, no blend-mode. At the demo's own
  0.05 opacity over a near-white ground, normal and multiply blending are
  not distinguishable by eye. Reported rather than built (S42); no gate
  needed changing.
- **The texture is sitewide**, not scoped to the hero and the dossier the
  way the demo's `.kp-halftone` class was — every other lifted theme's
  texture is also sitewide (the one shared layer), so this follows
  established package mechanics rather than the demo's more surgical
  scoping.
- **The spec sheet's content doesn't match the demo's own kit.** The demo
  shows six split soft/ink colour-pair chips (mint, sky, sand, violet)
  plus ground and plum. The shared concept skeleton's spec sheet is fixed
  to five single-token swatches (hero ground, page ground, alert colour,
  label colour, and the theme's fifth colour — `--chart-4`, which the
  demo's palette never names at all) plus three font rows. Only matching
  labels for those five fixed tokens could be written; `--chart-4` is
  labelled "amber" for what it visibly renders as, since the demo gives it
  no name.
- **The platforms line carries the demo's own four words** (two Riso drum
  models, an offset proof, PDF/X-1a) rather than the four words every
  other lifted theme uses there (browsers/channels — the shared markup's
  `aria-label="Where it renders"` was written for that second meaning).
  Kept as the demo's exact words per S49 rather than silently swapped for
  the cross-theme convention; it reads slightly askew of its own
  `aria-label` as a result.
- **Contrast, invariants, tokens, texture:** nothing broke. `check:tokens`,
  `check:invariants`, `check:contrast`, `check:texture` all pass at their
  existing thresholds with pastel's exact values — no deviation needed
  asking for.

## sepia

**Every other demo value matched a token exactly (X0).** All fourteen
colours the demo's `:root` names were converted from hex to HSL and
diffed against `themes/sepia/tokens.json`: every one already equalled an
existing token (paper→`--background`, ink→`--foreground`,
sienna→`--primary`/`--primary-foreground`, rule-color→`--border-strong`/
`--input`, hairline→`--border`, tint→`--accent`/`--accent-foreground`,
red→`--destructive`/`--destructive-foreground`, selected→`--selected`).
No colour token changed. This is itself a finding worth recording, not
an assumption: the only value that needed changing was the duration
(§3).

**A full paper-grain texture is refused, not merely capped — and the
demo says why, in more specific words than `docs/LIFT_PLAN.md` row 9's
one-line mechanism shorthand ("multiply paper layer").** The demo's own
comment: "No aged-paper texture. The obvious flourish, and the wrong
one: a mottled background reduces text contrast for exactly the reader
this theme is for." `css/sepia-register.css` declares neither
`--fx-texture` nor `--fx-texture-opacity`; `node gates/check-texture.mjs`
measures the effective value at 0, under DI9's 0.06 ceiling, and no
per-theme ceiling override (`gates/config.json`'s
`textureOpacityCeiling.perTheme`) was needed. Reported per the demo's own
instruction to report this exact disagreement between the plan and the
anatomy, rather than silently pick one.

**The demo's hand-drawn SVG mechanisms are not reproducible without
markup.** The demo draws its heading rule and every inline-link
underline with an injected `<svg><path>` and `stroke-dasharray`/
`stroke-dashoffset`. The concept page's markup is the approved demo's own
structure and is identical for every theme (S46, `showcase/examples.mjs`
`conceptBody()`) — it carries no `<svg>` element for a per-theme curve,
and may not gain one for sepia alone. Approximated instead with
mechanisms already precedented in the package: the rule is a flat line
scaled by `transform: scaleX()` on the existing
`[data-kp-reveal='rule']::after` pseudo-element (the same technique
retro's groove and phantom's rail use for their own rule reveals); the
footer's link underlines are a `background-size` transition. Both keep
the demo's actual motion (nothing drawn until it should be, one growth,
once) and lose only the literal hand-drawn wobble of the curve.

**The double-rule divider has no child elements to paint with either.**
The demo's divider is a `<div>` with two `<i>` lines; the shared concept
page emits one bare `[data-kp-divider]` element (S46). The two lines are
layered `background` gradients on that one element (retro's own shell
groove does the same); the `alt` variant's diamond is `content: '◆'` — a
decorative glyph, not a word, so KT5 does not apply (precedented by
phantom's `▾` and the base layer's own `⌄`).

**The `ink` headline routine is new** — recorded in §3, repeated here
because it is the one place the demo "genuinely does something else"
(brief, X2): no existing routine is a whole-line settle with no
per-word stagger.

**Nothing else needed a finding.** The palette, the layout proportions,
the drop cap, the mark's wash, the redaction direction (`transform-origin:
left`, matching the demo's literal CSS rather than its prose description
of "left to right" — see the drill note in the spec file's header), the
stamp's rotation, and the whole measured contrast table in the demo's
own comment were all built as the demo declares them, and every value
that could be checked was checked (§5).

## shade-dark

1. **The palette needed no change (X0).** I converted all 24 HSL values in
   `themes/shade-dark/tokens.json` to hex with the same `hslToHex` the
   demo's own comment names and diffed them against the demo's header —
   every one matches exactly (`background #002d38`, `card #073541`,
   `primary #50a5e2`, `fx-signal #d84f92`, all 24). `tokens.json` is
   unchanged.
2. **The hero CTA and the dossier card's entrance plays on load, not on
   scroll.** The demo's own script hides both behind a blur and reveals
   them via an `IntersectionObserver`, "on first scroll-into-view".
   `js/effects.js`'s shared `emphasis()` function has no generic
   per-element scroll trigger for a container with nothing to clear (it
   only clears `<mark>` elements) — both containers here carry either no
   marks (the button) or marks clearing for an unrelated reason (the
   card's redactions, on a click trigger). Rather than add a second
   `IntersectionObserver` path to a function four already-shipped themes
   depend on, the register plays the blur-and-focus device once, as soon
   as `data-kp-effects` is present. This is right for the hero button
   (already near the top of the viewport at first paint) but means the
   dossier card, well below the fold, has already finished its reveal by
   the time a reader scrolls to it. **Needs Kenny's answer:** approve the
   simplification, or ask for a real per-element scroll trigger in
   `emphasis()`.
3. **The confirmation dialog's backdrop is 0.5, not the demo's 0.55.**
   `css/components.css`'s base `.kp-dialog::backdrop` is already a
   literal `rgb(0 0 0 / 0.5)`, deliberately exempted from DI9 with its own
   comment ("a theme colour here would tint the page rather than dim
   it"). A per-theme override to the demo's `rgba(0, 0, 0, 0.55)` would be
   a second literal colour in a register, which DI9 forbids outright, so
   the register does not touch it. The difference (0.05 of opacity on a
   full-viewport black) is not visually meaningful but is a literal,
   measured deviation from the demo and is recorded as one.
4. **The redaction DOM is the package's `<mark>`, not the demo's
   `<span class="kp-redact">`.** The page every register actually ships
   (`examples/concept-shade-dark.html`) is generated from the shared
   `examples/concept.html` structure (S46, KT11), whose dossier already
   carries real `<mark>` elements and a `data-kp-reveal-trigger` button
   wired to `js/effects.js`'s `wireTrigger()` — the mechanism retro and
   phantom's dossiers already use. The register targets that markup, and
   the visual result (three plates that clear left to right, 150ms apart,
   300ms each, on the trigger, closable again) matches the demo's
   description exactly; only the underlying DOM differs from the
   standalone artifact.
5. **A measured contrast pair the demo's own audit missed.** The demo's
   `.microlabel { color: var(--accent); }` is one rule for every surface
   the class appears on, including inside the dossier card. Measured by
   `tests/surfaces.spec.mjs` (run against the package's own concept page,
   every theme): accent (`#2aa298`) as text on the card (`#073541`) is
   **4.21:1**, under the 4.5 floor normal text needs. The demo's own
   contrast comment lists 12 pairs and never this one — accent only
   appears there as a *background* (accent-foreground on accent, 4.69).
   The register keeps the demo's single `.microlabel` rule rather than
   adding a card-specific override in a colour the demo never specified;
   this is the one test in the cross-theme suite that is red as a direct,
   measured, reported (not corrected) consequence — see §5.

One thing I found and **fixed without asking**, because it is not a demo
deviation but a rendering defect in my own first draft: the dossier's
`::after` redaction plate is a single absolutely-positioned box sized to
the `<mark>`'s own bounding rect. At 1280px the phrase "Solarized's paper"
wrapped across two lines in its column, and the bounding rect (and so the
plate) spanned both lines plus the gap between them — visibly wrong,
screenshotted and caught before the spec was written. Added `white-space:
nowrap` to the dossier's `mark` rule so a redacted phrase always renders
as one line (verified at both 1280 and 320 with a zoomed screenshot and a
`getBoundingClientRect()` check on all three marks — see §6).

## solstice

Recorded in full in `themes/solstice/anatomy.md`'s closing section; summarised
here.

1. **The calibration wipe's mechanism differs from the demo's, appearance
   kept.** The demo drives three independently-staggered `scaleX`
   transforms on three child `<span>`s inside the headline. The shared
   `conceptBody()` generator (`showcase/examples.mjs`) renders the headline
   as a single string with no child markup slot, so three separate overlay
   elements aren't available. The register approximates the same triad
   (primary/accent/foreground) and the same total duration (740ms = 520 +
   2×110) as **one** `clip-path` sweep across a single three-band
   gradient — same colours, same timing budget, a different technique.
   This is the same category of substitution the terminal audit records
   for the caret ("same visual result, different technique").
2. **The headline's `<em>calibrated</em>` emphasis is unreachable.** The
   demo colours and small-caps the word "calibrated" inside the headline.
   `c.headline` is a plain string in the copy dictionary and
   `conceptBody()` renders it as plain text — no markup slot exists for an
   inline `<em>`. The register still carries the `h1 em` CSS rule (written
   against the day the generator can pass inline markup), but it does not
   fire on the generated page today.
3. **The divider's inline SVG is approximated in CSS.** The demo's
   horizon-seam dividers are inline `<svg>` with hand-drawn zigzag paths;
   `[data-kp-divider]` in the shared markup is an empty `<div>` with no
   room for child SVG. A `conic-gradient` chevron over a hairline
   `linear-gradient` stands in for it.
4. **The nav is restructured, not just re-worded.** The demo's own nav is
   two links (a plain "Overview" and a "Field guide" dropdown of three)
   plus a language link. The shared `NavBar` is a fixed six-slot shape (a
   "Themes" dropdown, a "Components" dropdown, two plain links, a language
   dropdown, a CTA). The copy entry reuses the demo's own "Field guide"
   items for the `navThemes*` slots and writes a "Components" group in the
   demo's voice for the slot the demo has no equivalent for.
5. **The spec sheet's swatches don't match the demo's own six.** The demo
   shows Background, Primary/amber, Accent/rust, Card, Secondary,
   Border-strong. `showcase/examples.mjs` binds five **fixed** tokens for
   every theme's spec sheet — `--surface-hero-bg`, `--background`,
   `--destructive`, `--accent`, `--chart-4` — which is not the demo's own
   set. The copy entry's labels (`ground`/`page`/`alert`/`rust`/`ember`)
   describe what is actually bound, not the demo's own swatches.
6. **The dossier's three redactions are recombined.** The demo has three
   separate `<p class="kp-redaction">` paragraphs, each independently
   covered. The shared shape is one paragraph with three `<mark>`s. The
   copy entry keeps the demo's own three facts (the 28°/12° hue-family
   pairing, the 0.625rem radius, the 240ms motion floor) as the three
   marked phrases of one sentence.
7. **The wipe dialog's body text is not reproduced.** The demo's dialog
   says "This clears the name, email, desk, notes and consent you've
   entered below. There's no undo." The confirmation `js/components.js`
   opens is a package-wide mechanism whose body text is generic
   (`js/strings.js`, KT5), not a per-theme slot.
8. **Some copy slots are invented, not from the demo**, because the demo
   doesn't fill every slot the shared form needs: `platform4` ("Linux" —
   the demo names only three of the four), `handlePlaceholder`/
   `handleHelp` and `mailPlaceholder`/`mailHelp` (the demo's Name/Email
   fields carry neither), `dossierPara2` (the demo's closest text is the
   *hidden, post-reveal* detail line, not a visible pre-reveal paragraph),
   and the laurels' second halves (`laurel1`/`laurel2`/`laurel3` — the
   demo's laurels are single short phrases with no "bold + rest" split;
   `gates/gates.test.mjs`'s S49 test refuses an empty slot, so a short
   continuation phrase was written for each).
9. **Found and fixed, not merely a finding:** the mirror button's own
   `box-shadow` (the demo's calibration-bar highlight) silently replaced
   the base layer's two-channel focus ring outright, because
   `kp.register` sits after `kp.components` in the cascade — the *exact*
   fault `css/retro-register.css`'s own header comment records for its
   bevel. Composed instead (ring first, highlight after) rather than left
   broken; held by its own test (§5) and drilled as part of building it
   (the un-composed version was caught by the test before it ever reached
   a commit, not by removing a working rule afterwards, so it isn't
   counted as one of the three formal KT3 drills below).
10. **No token, contrast, or texture deviation.** All 20 of the demo's
    declared colours matched `themes/solstice/tokens.json` exactly (HSL→hex,
    independently computed); `--radius`, `--fx-duration`, `--fx-ease` all
    matched too. `node gates/check-contrast.mjs` and
    `node gates/check-invariants.mjs` both pass with solstice included, so
    X0 needed no token change and there is nothing to report there. The
    demo declares no texture (`--fx-texture`), and the register adds none.
11. **A pre-existing, unrelated table entry, for completeness:**
    `docs/DESIGN_INVARIANTS.md`'s generated compliance table now shows
    solstice's "DI5 flash threshold" cell as FAIL instead of "n/a", purely
    because solstice joined `gates/compliance.mjs`'s DI5-scope stylesheet
    list. That cell is one **global** boolean shared by every in-scope
    theme (`flash.every(Boolean)` across all seven registers' opacity
    keyframes) and was already FAIL for several other themes' columns
    before this lift — none of solstice's three keyframes animate opacity,
    so they contribute nothing to that boolean and could not have changed
    it. `npm run check:motion` (the actual gate, as opposed to the
    informational doc table) is green, and `reports/di5.md` rates all
    three of solstice's keyframes at 0.00/s.

## lapis

- **Tokens matched the demo exactly, no changes needed.** I converted
  every one of the demo's twelve literal-hex palette values (HSL → hex)
  and compared against `themes/lapis/tokens.json`: `background` →
  `#1b2a6a` (demo `#1B2A6A`), `primary` → `#d5a52a` (`#D5A52A`), `accent`
  → `#e24536` (`#E24536`), `sidebar-background` → `#101c4c` (`#101C4C`),
  `card` → `#22347c` (`#22347C`), `popover` → `#2a3e8d` (`#2A3E8D`),
  `foreground` → `#f2e9d4` (`#F2E9D4`), `muted-foreground` → `#a9afd1`
  (`#A9AFD1`), `border-strong` → `#bc9c4e` (`#BC9C4E`), `border` →
  `#324385` (`#324385`), `destructive` → `#f7796e` (`#F7796E`), `chart-3`
  → `#40bfaa` (`#40BFAA`). Twelve of twelve exact. This means the token
  file was already authored against this exact demo before this lift
  began.
- **The theme's own pre-round-six page-wide texture conflicts with the
  demo's explicit hazard-refusal, and I turned it off.** `css/_rules.css`
  (kp.base layer, from the 3.1.1 theme lift, TH74) carries a page-wide
  girih SVG at 5% opacity via `body::after`. The demo's own research
  comment explicitly refuses this: "Curio's page-wide star tile (~16%
  peak alpha, tiled over the entire viewport) is refused as-is... This
  demo runs the same conic-gradient recipe at 5%, confined to the
  hero/app surfaces, not the whole page." Per S49 the demo wins, so the
  register sets `--fx-texture-opacity: 0` (a later cascade layer than
  `_rules.css`'s `kp.base`) and paints its own girih tile, confined to
  `[data-kp-surface='hero']`/`['app']`, at the demo's own 5%. I did not
  edit `css/_rules.css` itself — the override is entirely inside my own
  file, using layer order (`kp.base, kp.components, kp.register, ...`).
  This is a real behavioural change to what lapis looked like before
  round six; drilled and covered by two spec tests.
- **The demo's `<span class="kp-redaction">` and `<dialog>` don't exist
  in the package's markup, and I mapped them onto the established
  pattern instead of building new elements.** The package's dossier
  redactions are `<mark>` inside `.kp-card[data-kp-reveal='emphasis']`
  for every already-lifted theme (terminal, retro, phantom, brutalism);
  the wipe-form confirmation is the shared `Button`'s `data-kp-confirm`
  mechanism, not a per-theme `<dialog>`. I built the seal's visual (a
  solid void plate, no ink, cleared on the trigger's own stagger) and
  the wipe's own words (`wipeConfirm: 'Wipe the form?'`, the demo's
  literal dialog question) onto those existing doors rather than adding
  a second, theme-specific dialog element beside the one the package
  already owns. Recorded in the anatomy's closing S49 section as an
  adaptation, not a silent change of the demo's visual intent.
- **The spec sheet's token references are a pre-existing package quirk,
  not something this lift introduced.** `showcase/examples.mjs`'s shared
  concept-page body hardcodes which token each `<i class="kp-spec__swatch"
  data-token="...">` names (`surface-hero-bg`, `background`, `destructive`,
  `accent`, `chart-4`) — only the row *labels* (`spec1`…`spec8`) are
  themed via copy. So my "gold" label sits next to a swatch reading
  `--destructive`, not `--primary` — the same mismatch terminal's and
  brutalism's copy already carries (terminal's "text: phosphor" label
  sits next to the same `--destructive` swatch). Not something a single
  theme's lift can fix without editing the shared template for every
  theme at once; out of this lift's scope.
- **No contrast pair or texture value exceeded a floor.** Nothing needed
  a `gates/config.json` `perTheme` override; the girih tile's 5% sits
  under DI9's 6% ceiling with margin.

## ticker

**Two demo mechanisms not built, both reported rather than adapted
(S49):**

1. **The market tape does not run anywhere.** The demo's own header note
   calls it "a bonus element, not in `showcase/concept-demo.json`'s 30."
   The generated concept page (`showcase/examples.mjs`'s `conceptBody()`)
   is one function shared by every theme with an approved demo; adding a
   ticker-only section to it is a shared-infrastructure change outside a
   single lift's ownership (`gates/integrate-lift.mjs`'s own `owned()`
   list draws that line: register, spec, anatomy, tokens — not the
   generator). Not built in the register either, for the same reason a
   consumer would have nothing to point it at.
2. **No off-screen pause exists as a mechanism at all, independent of
   (1).** Brutalism's `-50%` marquee — the package's one precedent for a
   seamless continuous loop — runs continuously behind its
   `prefers-reduced-motion` guard with no `IntersectionObserver` gating.
   Building that from scratch for an element outside the required
   inventory was judged out of proportion for one lift; it needs its own
   `TIMINGS` row, its own `js/effects.js` hook, and a decision about
   whether every existing loop in the package should gain the same
   behaviour — Kenny's call, not this lift's.

**One measured, reported contrast finding (S49, S42), following the
exact precedent `shade-dark`'s own lift already established in
`tests/surfaces.spec.mjs`'s `REPORTED` list:** the demo's own
`.kp-lede mark.kp-revealed { background: rgba(245, 161, 36, 0.18); color:
var(--fg); }` (and the dossier's marks at 22%) measure 1.70:1 against a
floor of 4.5 in that suite, because it reads the mark's own declared
colour pair without compositing the alpha wash over the black page it
actually sits on. The demo's own contrast table never scores this pair
either — only the solid ones. The composited pixel is not 1.70: 18%
amber over `#0A0A0A` works out to roughly `rgb(52,37,15)`, which clears
the floor by a wide margin against near-white ink. Five lines (two in the
hero's lede, three in the dossier — one rule, five marks), all recorded
in `REPORTED.ticker` with the measurement and the reasoning, awaiting
Kenny same as shade-dark's.

**One real bug found and fixed, not a finding — recorded here because it
was subtle and future lifts should know to check for it:**
`css/_rules.css` still carried ticker's **pre-lift placeholder**
styling — `[data-theme='ticker'] h1, h2 { background: var(--primary);
color: var(--primary-foreground); display: inline-block; padding-inline:
0.35em; }`, a "reverse video panel titles" sketch from before the
approved demo existed. The approved demo's own heading is plain colour,
no bar, no inline-block. My register's h1/h2 rules never touched
`background`/`display`/`padding-inline`, so the placeholder bled
through underneath everything I did write, painting every heading with
a solid amber bar and white-on-amber text at 1.70:1 contrast — caught by
`tests/surfaces.spec.mjs`, not by my own spec (which only opens my own
generated page, where the placeholder is masked by other rules in a way
the shared `examples/concept.html?theme=ticker` page — used by the
cross-theme suites — is not). Fixed by having my register's `h1, h2, h3,
h4` rule explicitly reset `display: block; background: none;
padding-inline: 0;` rather than leaving those properties untouched.

**A second real bug, same discovery path:** three of my rules
(`.kp-button`, `.kp-icon-button`, `.kp-nav__menu`, `.kp-dialog` and
neighbours, `.kp-card`) declared `box-shadow: none;` for explicitness,
following the sibling registers' convention — but because `kp.register`
puts a class selector (`.kp-button`) at the same specificity as my
broad `[data-theme='ticker'] :focus-visible` rule and later in source
order, the `none` won over the focus ring's box-shadow on every element
carrying it, leaving several controls with **no visible focus ring at
all** (`tests/button.spec.mjs` and `tests/dashboard.spec.mjs` both
caught this, on the primary button, the confirm dialog's Cancel button,
and generally). Fixed by removing the four redundant `box-shadow: none;`
declarations — ticker's `--fx-shadow-offset: 0px` token already
collapses the base layer's own offset shadow to nothing, so nothing
needed replacing.

**A third, `.kp-menu__item:focus-visible`:** the dossier's own
`.kp-menu` items sit inside `.kp-popover`, which clips at its own 4px
padding (`overflow: auto`). The demo's ring recipe reaches 8px (four
layers: background gap, amber, background gap, foreground), so on a
menu row only the first, invisible background-coloured layer ever
painted — `tests/dashboard.spec.mjs`'s W4/AR30 suite caught this on the
destructive row action and the confirm dialog's own buttons read no
shadow at all for the unrelated reason above. Fixed with a
`.kp-menu__item:focus-visible` override using the base layer's own
`--focus-ring`/`--focus-ring-contrast` pair at 4px total reach — the
demo never shows this component, so there is no amber to be faithful to
there, and matching the token names the test suite's `bothHalves()`
helper is actually calibrated to check turned out to matter more than I
first assumed (see the retry in §5).

## forest

Its agent was killed by a rate limit before it wrote a report. What the
integration found, in place of one:

- The register was complete and its spec ran green once two test-side
  faults were repaired: one read a whole `CSSStyleDeclaration` back out of
  `evaluate()`, which firefox hands over as an empty object, and one
  expected an `attr()` content resolved, which firefox does not do.
- The register wrote `box-shadow: none` on a focused button, to stop its
  hover shadow contesting the ring, and took the ring's own second channel
  with it — a DI2 and AR30 breach that fifteen cross-theme tests caught
  once every register sat in one tree. Repaired here by restating the base
  layer's ring.
- One KT3 drill was performed here rather than inherited on trust: the
  armed cover rule removed, both channels red, restored, green.
- The theme's rename to **forest** is still open.

## shade-light

Its agent was killed before it could run anything. What the integration
found:

- The headline routine did not run at all as written. `blur` is a word
  routine like phantom's `shout`, but its keyframe is the demo's own
  `kp-word-in`, and the group resolves a keyframe as `kp-<routine>` — so
  the module read a TIMINGS row that does not exist. `js/effects.js` now
  names that one exception.
- One test asked a flat button for `box-shadow: none` and got the
  package's own focus-ring channel resting at zero offset, blur and
  spread, which paints nothing. The assertion now says "draws nothing".
- One KT3 drill performed here: the word animation removed, both channels
  red on the headline test, restored, green.

## woodblock

Its agent was killed before it could run anything, and its work arrived
green in both browsers and both channels anyway.

- `css/_rules.css` still carried woodblock's pre-register hanko, animating
  the same `h1::after` the register's rule hook uses. Retired with the
  lift, the fifth theme in this round to need that.
- One KT3 drill performed here: the blue ghost plate's animation removed,
  both channels red on the kentō headline test, restored, green.
- The theme's rename to **woodblock** is still open, together with the
  name itself.
