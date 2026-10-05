# A drawer and its guided tour, each of its own, per theme

Kenny, form v18 (2026-10-05): the character round, one component at a time,
all 22 themes in one demo. This is the component that pairs `dialog.kp-drawer`
(a help drawer that slides in at the end edge, full height, with a head that
stays, a body that scrolls and a foot that stays) with the guided tour
`js/tour.js` starts from it (`startTour()`: a non-modal card beside the part
it talks about, a ring on that part and the rest of the page dimmed, Back /
Skip / Next, the count exact). The catalogue's own block is
`catalogue/overlays.html#drawer` and `#help-tour`.

## Structure (one pick per aspect)

As the meter, the trend tile and the other character demos: nothing is
bundled. Five aspects, each picked on its own from three options, and any
combination composes.

| Aspect                  | Attribute           | What it covers                                                                                            |
| ----------------------- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| Shape                   | `data-dt-shape`     | the drawer's plate, its frame, the head/body/foot dividers, and the edge that says the body still scrolls |
| How it opens and closes | `data-dt-openclose` | the drawer's arrival from the end edge and its leave — the leave is the arrival's exact reverse           |
| The tour's highlight    | `data-dt-highlight` | the ring on the part the tour talks about, and how the rest of the page is dimmed around it               |
| The tour's step card    | `data-dt-card`      | the card's plate, its frame, its title and its foot                                                       |
| Moving to the next step | `data-dt-next`      | what happens to the card and the count when Back, Skip or Next moves the tour to another step             |

Every rule names one aspect only and sets that aspect's knobs only, so any
combination composes. Options are inventive per theme (no fades: no
`opacity` keyframe anywhere) and the open/close pair always mirrors — a
theme's close is its open played backwards, never a different idea. A
loading picture does not apply here (the drawer and the card have no busy
state of their own); the aspects instead come from what the two parts of
this component actually do: a shape (always first), an open/close (the
drawer moves), and three things proper to the tour — its highlight, its card
and the step it moves to next.

## Files

- `demo.html` — the page: one section, the combination at the top, a row per
  aspect below it (three stages that differ in that aspect alone), the plain
  drawer and tour at the foot for reference, controls (open/close the
  drawer, start/step the tour, speed) in `data-review-controls`.
- `demo.js` — `ASPECTS`, the full `IDEAS` table (three named, theme-native
  options per aspect, for all 22 themes — this is the spec the group
  helpers implement in CSS), `compose()` wiring the picks onto every stage,
  and the drawer-open/tour-step mechanics (no dependency on `js/tour.js`'s
  DOM search — the stages are static markup the demo drives itself, so
  every one of the 22 themes' three-wide rows can be compared side by side
  without 110 real dialogs and tours open at once).
- `demo.css` — the page chrome (layout, controls, the aspect rows).
- `drawer.css` — the contract every option keeps, and the complete
  theme-native CSS for **formal** and **titanium**, in `@layer
kp.signature`.
- `drawer-a.css` … `drawer-d.css` — empty (`@layer kp.signature {}`), one per
  theme group, filled by the group helpers: a = light, dark, cyberpunk,
  synthwave, pastel; b = terminal, forest, high-contrast, sepia, blueprint;
  c = solstice, brutalism, deco, phantom, shade-light; d = shade-dark, retro,
  grotesk, lapis, nostromo.

## The IDEAS table (names only; full text is in `demo.js`)

| Theme         | Shape                                                            | Open/close                                                                                           | Highlight                                                          | Card                                                        | Next step                                                                   |
| ------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| formal        | the engraved plate · the ledger panel · the certificate drawer   | the drawer is drawn out · the leaf is turned · the seal is broken                                    | the ruled margin note · the engraved bracket · the wax seal ring   | the index card · the memorandum · the certificate slip      | the leaf turns · the entry is carried forward · the seal is pressed again   |
| light         | the soft card · the daylight pane · the paper sheet              | it slides on daylight · it drifts in like a curtain · it lifts off the sheet                         | the soft halo · the daylight beam · the pencil circle              | the sticky note · the sunlit card · the paper tab           | the halo drifts · the beam swings · the tab is peeled                       |
| dark          | the slate panel · the glass pane · the console tray              | it slides from the glow · it rises from the floor · it unlatches                                     | the glow ring · the laser outline · the aperture                   | the glass tile · the console readout · the aperture card    | the glow steps over · the readout refreshes · the aperture re-irises        |
| cyberpunk     | the neon panel · the HUD tray · the data slab                    | it glitches in · it rezzes in from static · it slots home                                            | the scanline ring · the glitch bracket · the target reticle        | the HUD tooltip · the terminal popup · the data chip        | the reticle snaps · the glitch cuts over · the chip reprints                |
| synthwave     | the outrun panel · the sunset tray · the grid slab               | it rolls up over the horizon · it slides on the grid · it drops from the sun                         | the neon tube ring · the horizon beam · the grid cell              | the neon sign · the dashboard readout · the arcade marquee  | the tube relights · the beam sweeps · the marquee recycles                  |
| pastel        | the candy card · the bubble tray · the macaron slab              | it bounces in · it unrolls like ribbon · it pops open                                                | the bubble ring · the crayon circle · the sticker halo             | the sticky-note bubble · the balloon tag · the macaron card | the bubble hops · the ribbon slides · the sticker peels                     |
| terminal      | the CRT panel · the box-drawn tray · the man-page slab           | it types open · it scrolls up from the prompt · it is piped in                                       | the cursor box · the ASCII bracket · the grep highlight            | the man-page box · the tooltip prompt · the log line        | the cursor retypes · the prompt reprints · the grep rehighlights            |
| forest        | the bark panel · the leaf-litter tray · the canopy slab          | it grows out from the trunk · it unfurls like a leaf · it is pulled from the undergrowth             | the lichen ring · the knot-hole circle · the moss halo             | the leaf tag · the bark plaque · the mushroom cap           | the ring widens · the leaf turns · the cap tilts                            |
| high-contrast | the stark panel · the block tray · the placard slab              | it snaps open · it slides on a hard edge · it is slotted in                                          | the thick ring · the hazard bracket · the crosshair                | the placard · the index card · the stencil tag              | the ring thickens on the next · the bracket jumps · the crosshair recentres |
| sepia         | the aged panel · the parchment tray · the daguerreotype slab     | it is drawn from a sleeve · it unrolls like a scroll · it swings on a hinge                          | the ink-blot ring · the pencil halo · the brass loupe circle       | the postcard · the index card · the ticket stub             | the ink dries anew · the scroll advances · the stub is stamped again        |
| blueprint     | the drafting panel · the vellum tray · the drawing-board slab    | it is drawn out on its rail · it unrolls from the tube · it is pinned open                           | the dimension ring · the compass circle · the crosshair bracket    | the callout tag · the title-block card · the detail bubble  | the leader redraws · the compass swings · the callout retargets             |
| solstice      | the amber panel · the sundial tray · the horizon slab            | it rises like the sun · it slides over the horizon · it swings on warm light                         | the sun-ring halo · the shadow arc · the amber bracket             | the sundial tag · the horizon card · the amber plaque       | the arc advances · the halo swings · the plaque relights                    |
| brutalism     | the concrete panel · the shutter tray · the slab of poured stock | it is forced open on its rail · it drops like a shutter · it is cranked out                          | the rebar ring · the stencil bracket · the hazard frame            | the stencilled tag · the hazard card · the poured plaque    | the bracket jumps a notch · the shutter re-drops · the frame re-clamps      |
| deco          | the gilt panel · the fan-motif tray · the lacquered slab         | it glides open on a gilt rail · it unfolds like a fan · it rises behind a sunburst                   | the sunburst ring · the chevron bracket · the gilt circle          | the marquee tag · the lacquered card · the fan-fold ticket  | the sunburst re-rays · the fan refolds · the chevron resets                 |
| phantom       | the spectral panel · the fog-bank tray · the veil slab           | it seeps in through the edge · it rises like mist · it is drawn by an unseen hand                    | the pale halo · the vapour ring · the faint bracket                | the apparition tag · the veiled card · the faint plaque     | the halo drifts on · the vapour reshapes · the veil resettles               |
| shade-light   | the washed panel · the gradient tray · the duotone slab          | it slides up through the wash · it bleeds in from the edge · it tilts into the light                 | the gradient ring · the wash halo · the duotone bracket            | the wash tag · the gradient card · the duotone chip         | the wash shifts a step · the gradient re-sweeps · the bracket redraws       |
| shade-dark    | the deep-wash panel · the night-gradient tray · the duotone slab | it rises out of the dark wash · it bleeds in from the deep edge · it tilts out of shadow             | the deep-glow ring · the night-wash halo · the duotone bracket     | the night tag · the deep-wash card · the duotone chip       | the glow shifts a step · the wash re-sweeps · the bracket redraws           |
| retro         | the CRT-cabinet panel · the woodgrain tray · the console slab    | it slides on with a scanline wipe · it rolls up like a blind · it clunks open on a hinge             | the dashed ring · the dial bracket · the tube-glow halo            | the index card · the ticket card · the dial tag             | the dial clicks forward · the blind re-rolls · the scanline re-wipes        |
| grotesk       | the bold-type panel · the poster tray · the block slab           | it slams open · it slides on a hard beat · it is stamped down                                        | the thick-rule ring · the block bracket · the poster frame         | the headline tag · the poster card · the stamp chip         | the rule re-stamps · the block re-slams · the frame re-snaps                |
| lapis         | the lapis panel · the pyrite-veined tray · the gilt-inlay slab   | it is drawn out on gilt rails · it unfolds like an illuminated page · it rises behind a gold vein    | the gold-vein ring · the gilt bracket · the pyrite-fleck halo      | the illuminated tag · the gilt-edge card · the inlay chip   | the vein re-traces · the gilt re-rays · the fleck re-glints                 |
| nostromo      | the bulkhead panel · the rivet tray · the stencilled hatch slab  | it slides on a hatch rail with a hiss · it unlatches and swings · it is cranked out by a winch       | the amber-CRT ring · the stencil bracket · the warning-strobe halo | the manifest tag · the console card · the stencil plate     | the amber ring re-sweeps · the strobe re-pulses · the stencil replate       |
| titanium      | the brushed-metal panel · the machined tray · the anodised slab  | it slides on a machined rail · it is drawn out like a drawer on its glide · it pivots on a hinge pin | the machined ring · the bevel bracket · the anodised halo          | the machined tag · the bevel card · the anodised chip       | the bevel re-cuts · the ring re-machines · the chip re-anodises             |

The full one-sentence text for every option is in `demo.js`'s `IDEAS`
table — this README only lists the names, so the table above is a map, not
a duplicate of the spec.

## Checks run (Phase 1)

Firefox via Playwright, through the project's browser-slot lock, DOM/console
only (no screenshot lock): formal and titanium, both motion settings — 0
console errors, every control works, the three options per aspect row
differ in computed style, and the open/close pair plays at full motion and
is replaced by its end state under reduced motion. `node
gates/check-catalogue.mjs` and `node gates/check-demo-variants.mjs` both
run clean. `npx prettier --check` on this directory's own files.
