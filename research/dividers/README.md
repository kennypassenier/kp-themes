# Dividers: softer shapes for pastel, and a shape knob

Kenny, on `catalogue/page-effects.html#dividers` in pastel (2026-09-15): "The sawtooth isn't really fitting with 'Pastel' which is
fluffier and rounder. And there should be an option." Demo: [`demo.html`](demo.html) (34972 bytes, `wc -c`), in the catalogue under
"Research to look at". It opens in pastel; shade-light and dark are one click away.

**How dividers work today.** `[data-kp-divider]` is a hook [S45] listed in `themes/hooks.json`. The base rule in `css/themes.css` only
leaves one step of room (`--kp-space-xl`). Each register draws its own divider in `kp.register`, and `[data-kp-divider='alt']` marks the
footer seam. Pastel draws a 3.2rem `--primary` bar cut by a percentage `clip-path` polygon (18 teeth that stretch with the width), and
the alt bar in `--accent-foreground`. Grep finds `[data-kp-divider='alt']` 31 times in 21 registers; synthwave has no alt rule. There
is no way today for a consumer to choose a shape.

## Shapes

| Shape   | What it is for                                 | Reference                                                                                                                                    | What the package can reuse                                    | Build cost | Recommendation           |
| ------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------- | ------------------------ |
| zigzag  | Today's torn tab; hard, energetic              | pastel register as shipped                                                                                                                   | Redrawn as a fixed-size conic-gradient tile, so no stretching | small      | keep as a knob value     |
| scallop | Half circles: doily, cupcake case; round, calm | [CSS-Tricks, wavy shapes with mask](https://css-tricks.com/how-to-create-wavy-shapes-patterns-in-css/)                                       | One radial-gradient tile; no SVG                              | small      | **pastel's new default** |
| wave    | Smooth, no corners                             | [css-tip wavy divider](https://css-tip.com/wavy-divider/), [W3Schools SVG wave generator](https://www.w3schools.com/tools/tool_svg_wave.php) | A 40×10 SVG path tile in a data URI                           | small      | knob value               |
| cloud   | Bumps of two sizes; the fluffiest              | [css-generators wavy shapes](https://css-generators.com/wavy-shapes/)                                                                        | A 60×16 SVG arc tile in a data URI                            | small      | knob value; runner-up    |
| pearls  | Beads on a thread; no bar                      | nostromo's own vent-dot seam (the same idea)                                                                                                 | Radial-gradient beads spread with `mask-repeat: space`        | small      | knob value               |
| line    | Faded 3px rule with three beads                | common editorial ornament; the package's hairline seams                                                                                      | Linear gradient plus three radial dots                        | small      | knob value               |
| none    | Room only                                      | the base rule in `css/themes.css`                                                                                                            | `--kp-space-xl`                                               | small      | knob value               |

All the band shapes use a fixed tile size with `mask-repeat: round`. At 320px they just repeat fewer times, and no tile is cut in
half. The demo measures that no 20rem frame scrolls sideways.

## The knob

- **Name:** `data-kp-divider-shape="zigzag|scallop|wave|cloud|pearls|line|none"`. It can go on `<html>`, on any ancestor, or on a single
  divider. Each value only sets `--kp-divider-mask-*` custom properties, so the **nearest** element that names a shape wins through
  inheritance. The demo shows this: one divider marked `pearls` stays pearls while the frame around it switches.
- **Absent = the theme's own drawing**, exactly as today. The knob never changes a page that does not use it.
- **Other knobs:** `--kp-divider-tile` (1.5rem), `--kp-divider-height` (3rem), `--kp-divider-ink` (`--primary`) and `--kp-divider-ink-alt`
  (`--muted-foreground`). The alt ink cannot default to `--accent-foreground`: in shade-light that token is a pale ink that disappears
  on the page ground (seen in the demo). Pastel sets it back to `--accent-foreground` in its register.
- **Where it lives:** in `css/layout.css` (`kp.layout`), the only existing layer that comes after `kp.register`. That lets a consumer's
  choice beat a register's clip-path and pseudo-elements without adding a new layer.
- **Default per theme:** pastel changes its register drawing to `scallop`. The alt divider keeps its mint ink and faces up. The other
  21 themes keep their own drawings, and none of them changes.
- **Not chosen:** space-separated words in the existing attribute (`data-kp-divider="alt wave"`), as Kenny suggested. That works for a
  single divider but cannot be set page-wide. It would also turn all 31 `='alt'` selectors into `~='alt'`.
- **What the gates would need:** a `themes/hooks.json` row for pastel pointing at the new selector. A check in the style of
  `gates/check-hooks.mjs` that every documented shape value has a rule in `css/layout.css`, and that `site/layout.html` lists the five
  knobs with their defaults (the AR21 comment convention does this already). `tests/register-pastel.spec.mjs` judges dividers by eye
  since scope-73, so a browser test would need to be added: each shape draws a non-empty mask, and no 320px frame overflows. The
  texture gate does not apply: the dividers are opaque inks, not `--fx-texture`.

## Recommendation

Build the knob as specified and make **scallop** pastel's default. It is the roundest shape that still reads as a clear edge
between two pale grounds. It uses no SVG, and it keeps pastel's "two different sheets" idea through the alt ink and direction.
**Cloud** is the runner-up if Kenny wants more fluff. Pearls and line are too quiet as pastel defaults, but they are useful knob
values for other themes. Measured in the demo in Firefox: no console errors in pastel, shade-light and dark; the knob's "Theme
default" removes the attribute and brings back the register's zig-zag.

**Open questions for Kenny.** (1) Scallop or cloud for pastel? (2) Should pastel also switch to the **soft ink** shown in the demo
(both inks mixed toward the ground), or keep the full plum and dark mint? (3) Is `css/layout.css` the right home, even though its
header says the layer is about layout? The alternative is a new `kp.knobs` layer. (4) Is a value `theme` needed, so a nested element
can bring back the register drawing under a page-wide shape? The demo cannot do that today.
