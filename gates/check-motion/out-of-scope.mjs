// Keyframes this gate deliberately does not measure, each with the reason it cannot.

/**
 * Animations the flash threshold does not reach, each with the reason.
 * AR8: a gate says what it did not check, or it is not a gate. An
 * animation missing from both this list and the opacity analysis fails.
 */
/** @type {Record<string, string>} */
export const OUT_OF_SCOPE = {
    // The removed Phantom register [PH1]: the loader's bar and its shove out, both
    // transforms; the removed Retro register [RT1]: the selection bar and the
    // redaction brush, both clip-paths; the brutalism register [BR1]: the slam and the marquee.
    'kp-bar-run': 'a horizontal scale on a 3px bar, once; no luminance change and nothing over 341x256 px',
    'kp-load-out': 'the arrival overlay skewing and translating off the viewport once; the overlay keeps its colours, only its position moves',
    'kp-drag-select': 'a clip-path widening over a phrase once (the selection bar); under 341x256 px',
    'kp-redact-lift': 'a clip-path narrowing over a phrase once (the redaction brush); under 341x256 px',
    'kp-slam': 'a word translating onto its text-shadow once; a transform on a word, under 341x256 px',
    'kp-marquee': 'a strip translating -50% over 42 seconds; the strip keeps its colours, only its position moves',
    // The solstice register [scope-12]: the raking band.
    'kp-rake': 'a 45%-wide band translating once across a control under the pointer; a transform, and the band is a 50% tint of the theme primary',
    // The synthwave register [SW1].
    'kp-shine':
        'a highlight band sliding across clipped text once (background-position); the text keeps its colours and the band is under 341x256 px',
    'kp-tube-on': 'a colour and text-shadow switch on an inline phrase, one dip, once; rated in TIMINGS at 2.7/s and under 341x256 px',
    'kp-floor-drift': 'a background-position slide of a grid over 6 seconds; the pattern keeps its colours, only its position moves',

    'kp-spin': 'a rotation: no luminance change at all',
    'kp-rule-in': 'a horizontal scale on a 1px rule; no luminance change and nothing over 341x256 px',
    'kp-settle': 'a scale from 0.92 to 1 on a badge, once',
    'kp-slide-in': 'a 6px translate on a badge, once; nothing changes luminance [TH70]',
    'kp-drift': 'a background-position slide over 40 seconds; the texture keeps its colours, only their position moves',
    // The busy progress bar [scope-140].
    'kp-progressbar-sweep':
        'a band a third of the track wide translating across a bar 0.75rem tall every 1.4 seconds; a transform, the band keeps its colour, only its position moves, and it stands still under reduced motion',
    // Cyberpunk's section divider [scope-96].
    'kp-stream-144':
        'a mask-position slide of a 144px dash tile by one tile every 8 seconds, on a 28px divider; the dashes keep their colours, only their position moves',
    'kp-stream-216':
        'a mask-position slide of a 216px packet tile by one tile every 8 seconds, on a 28px divider; the packets keep their colours, only their position moves',
    'kp-ember': 'a box-shadow that grows and fades once over the card edge; the card itself does not change luminance',
    // The dark register [S48, LIFT_PLAN row 15]: the mark's ignite and the
    // rule's sweep are both bound to `animation-timeline: view()` — the
    // reader's own scroll position, not a clock — so neither can free-run
    // or loop; each is one monotonic change across its range.
    'kp-ignite':
        'a mark’s ink and underline colour resolving once as the reader scrolls past it; a colour property this gate cannot parse from opacity stops, and it cannot oscillate because it is scroll-bound, not timed',
    'kp-sweep-in':
        'a rule sweeping in under a heading once as it enters the viewport (background-position); the rule keeps its colours, only its position moves, and it is scroll-bound so it cannot loop',
    // The solstice register [S48, LIFT_PLAN row 18].
    'kp-cal-slide':
        'a clip-path sweep, once, over the headline overlay (mix-blend-mode: difference); strictly monotonic in one direction, so it has zero opposing luminance changes, which is the threshold DI5 measures',
    'kp-cal-rule': 'a horizontal scale on a 3px rule; no luminance change and nothing over 341x256 px',
    'kp-cal-redact': 'a background narrowing over one marked phrase in a dossier paragraph, once; under 341x256 px',
    // The mono register [S48, LIFT_PLAN row 11]: a hard-edge mask sweeping
    // once across a headline or a redaction bar (mask-position).
    'kp-wipe':
        'a hard-edge mask sweeping once across a headline (the whole line, unsplit) or a redaction bar (mark::after); the content under the mask keeps its own colours, only the reveal edge moves',
    // The Lapis register [S48, LIFT_PLAN row 6].
    'kp-burnish':
        'a clip-path wipe over the headline once (the burnish); the text is gold from the first frame of the wipe and stays gold, only the reveal boundary moves',
    // The blueprint register [S48, LIFT_PLAN row 6]: the two dimension
    // lines extending like a tape measure, one transform each.
    'kp-dim-draw': 'a horizontal scale on a hairline under the headline, once; no luminance change and nothing over 341x256 px',
    'kp-elev-draw': 'a vertical scale on a hairline beside the headline, once; no luminance change and nothing over 341x256 px',
    // The grotesk register [S48, LIFT_PLAN row 12]: the headline's optical
    // resolve, on the whole, unsplit line (`kp-sharpen-in` — not
    // `kp-focus`/`focus`, which the dark and Shade (dark) registers
    // already own for their own, different mechanics).
    'kp-sharpen-in':
        "a blur+brightness filter resolving a headline from dim to full once, monotone, over 640ms — one change, well under the three DI5 allows, matching the demo's own worked example of a single fade [S49]",
    // The light register [S48, LIFT_PLAN, A1]: the lede mark coming into
    // focus out of the glare, one blur and brightness filter on an inline
    // phrase, once and monotone; under 341x256 px.
    'kp-mark-sweep': 'a blur and brightness filter resolving one inline phrase to none, once and monotone; under 341x256 px',
    // The forest register [TP1]: the contour trace beside the headline.
    'kp-trace': 'a stroke-dashoffset draw on a 9rem SVG path once; no luminance change and well under 341x256 px',
    // The Shade (light) register [SL2]: the lede mark's ink-fill is a
    // background-size change, not a luminance one — the fill colour and
    // its alpha are constant throughout, only the covered area grows.
    'kp-mark-in': 'a background-size widening over a mark once, 0% to 100%; the fill colour and alpha never change, only the area',
    // The pastel register [S48, LIFT_PLAN row 6].
    'kp-fill': "a mark's background-size growing from 0% to 100% once; the ink colour itself never changes, only how much of the word it covers",
    'kp-draw': "a rule's width growing from 0% to 100% once; no luminance change and the rule is a few px tall",
    // The woodblock register [S48].
    'kp-kento-blue':
        'a translate of a ghost plate converging to its final offset, once; no luminance change (mix-blend-mode multiply, no opacity or colour-stop keyframe)',
    'kp-kento-red':
        'a translate of a ghost plate converging to its final offset, once; no luminance change (mix-blend-mode multiply, no opacity or colour-stop keyframe)',
    // The shared marquee [M1, 2026-09-08]: one transform across a doubled
    // row, at whatever speed the theme names. No luminance change of its
    // own, and it rests while it is off screen unless a theme says never.
    // The alarm [scope-94]: the split copies of the headline, the letter
    // cells' decode, the hazard stripes and the sweeping band. Every opacity
    // step of the alarm is measured by the pass above; the rendered frames
    // of the whole alarm are measured in tests/alarm.spec.mjs.
    'kp-alarm-slice-in':
        'a clip-path showing thin bands of two copies of the headline, four positions once; the copies keep their colours and a band is under 341x256 px',
    'kp-alarm-slice': 'the same bands for 200 ms once every five seconds; a clip-path, under 341x256 px',
    'kp-alarm-decode-letter':
        'a letter cell turning from transparent to its ink once, stepped; one change per cell, ever, and a cell is far under 341x256 px',
    'kp-alarm-march':
        'a background-position slide of the hazard stripes by one period every 1.6 seconds, on a bar 0.9rem tall; the stripes keep their colours, only their position moves',
    'kp-alarm-sweep': 'a band of a faint tint translating down the plate once per six seconds; a transform, and the tint is under the 10% change',
    'kp-marquee-pass':
        'a row of items translated -50% and back to its start, seamlessly; a transform only, no opacity or colour stop, and paused whenever the band is outside the viewport',
    // The meter with a mark, each theme's way [research/character-meter round 3,
    // 2026-10-05]: transforms, clip-paths and pattern slides on a meter a few px tall.
    'kp-sig-formal-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    'kp-sig-formal-meter-wipe-d': "a clip-path wipe revealing a meter's share once, replayed in the destructive tone; under 341x256 px",
    'kp-sig-formal-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-formal-meter-wipe-w': "a clip-path wipe revealing a meter's share once, replayed in the warning tone; under 341x256 px",
    // Formal's grammar [themes/formal/CHARACTER.md §4, Kenny, 2026-10-08]: a
    // registered custom property drives the extent of rules and of an arc (a
    // clip, a background size, a mask angle); the rules keep their colour.
    'kp-sig-formal-ruling':
        "a registered custom property ruling a menu's or a popover's lines top down once; the lines keep their colour, only their extent changes",
    'kp-sig-formal-loading':
        'a registered custom property ruling three ledger lines under a waiting part, again and again; the lines keep their colour, only their extent changes',
    'kp-sig-formal-update-closed':
        'a registered custom property ruling the two lines under a changed figure once; the lines keep their colour, only their extent changes',
    'kp-sig-formal-arc-outer':
        'a registered custom property driving a mask angle: an arc ruled round the outer ring of the spinner, 2400 ms a loop; the arc keeps its colour',
    'kp-sig-formal-arc-inner':
        'a registered custom property driving a mask angle: an arc ruled round the inner ring of the spinner, 2400 ms a loop; the arc keeps its colour',
    // Light's grammar [themes/light/CHARACTER.md §4, Kenny, 2026-10-08]: every
    // one is a blur and brightness filter or a clip-path, none a change of
    // opacity or a colour, so none can flash.
    'kp-sig-synthwave-meter-grow-o': "a meter's share scaling in from its start once; a transform, under 341x256 px",
    'kp-sig-synthwave-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    'kp-sig-pastel-meter-drift':
        'a striped tape pattern translating one stripe along a loading meter; the stripes keep their colours, only their position moves',
    'kp-sig-pastel-meter-drop-d': "a meter's share dropping into its track once, replayed in the destructive tone; a transform, under 341x256 px",
    'kp-sig-pastel-meter-drop-o': "a meter's share dropping into its track once; a transform, under 341x256 px",
    'kp-sig-pastel-meter-drop-w': "a meter's share dropping into its track once, replayed in the warning tone; a transform, under 341x256 px",
    'kp-sig-forest-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-solstice-meter-bump-d': 'a meter swelling once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-solstice-meter-bump-o': 'a meter swelling once as its tone clears; a transform, under 341x256 px',
    'kp-sig-solstice-meter-bump-w': 'a meter swelling once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-solstice-meter-grow-o': "a meter's share scaling in from its start once; a transform, under 341x256 px",
    'kp-sig-solstice-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    // The deco grammar [themes/deco/CHARACTER.md §4, Kenny, 2026-10-09]: registered
    // custom properties drive extents and angles (a conic mask, a translate, a
    // background size); the gold keeps its colour throughout, nothing changes
    // opacity or lightness by 10% twice in a second.
    'kp-sig-deco-arrive':
        "a registered custom property drawing a plate's gold inlay round once and then raising its lacquer (480 ms); the lines keep their colour, only their extent changes",
    'kp-sig-deco-fan':
        'a registered custom property opening a great fan over a part, hiding it, and folding the fan away once (720 ms); the fan keeps its colours, only its angle changes',
    'kp-sig-deco-wipe':
        "a registered custom property folding a mask's fan-shaped window shut once (360 ms); the part keeps its colours, only its extent changes",
    'kp-sig-deco-gilded':
        'a changed figure flaring gold with a drop shadow and a 10% swell once over a second, and settling; one flare per update, a filter on a figure, under 341x256 px',
    'kp-sig-deco-doors':
        'a registered custom property parting two lift doors by a third of a part and closing them, 2400 ms a loop; the doors keep their colours, only their place changes',
    'kp-sig-deco-glint':
        'a registered custom property running a glint between the two lines of a bar, 2400 ms a loop; a few px tall, a gradient position only',
    'kp-sig-deco-seal':
        'a registered custom property growing one fine gold ring from the centre of a pressed control and fading it in 400 ms, once per press; under 341x256 px',
    'kp-sig-deco-meter-knock-d': 'a meter knocked up 3px and back once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-deco-meter-knock-o': 'a meter knocked up 3px and back once as its tone clears; a transform, under 341x256 px',
    'kp-sig-deco-meter-knock-w': 'a meter knocked up 3px and back once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-deco-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-nostromo-meter-scan': 'a lit band sliding along the tube of a loading meter; the band keeps its colour, only its position moves',
    'kp-sig-nostromo-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-titanium-meter-grow-o': "a meter's share scaling in from its start once; a transform, under 341x256 px",
    'kp-sig-titanium-meter-jolt-d': 'a meter shaking 2px sideways once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-titanium-meter-jolt-o': 'a meter shaking 2px sideways once as its tone clears; a transform, under 341x256 px',
    'kp-sig-titanium-meter-jolt-w': 'a meter shaking 2px sideways once as it turns to the warning tone; a transform, under 341x256 px',
    // The meter, round 4 [research/character-meter, 2026-10-05]: dark again and the
    // six reopened themes; transforms, clip-paths and pattern slides on a meter a few px tall.
    // Dark's grammar [themes/dark/CHARACTER.md §4, Kenny, 2026-10-09]: a pass is a mask
    // revealing a part's own box from its start edge, a registered number or angle
    // drives the film's turn, the figure's letters and the spinner's bars; the line
    // keeps its colours, only its extent and place change.
    'kp-sig-dark-sweep':
        "a three-layer mask revealing a panel's own box from its start edge at one pace, once (open) or backwards (close); the panel keeps its colours, only the reveal edge moves",
    'kp-sig-dark-film':
        "a registered angle turning the conic film of a panel's edges once as the line crosses it; the film keeps its colours, only its angle changes",
    'kp-sig-dark-figure':
        'a registered percentage and number letting the film show through the letters of a changed figure once, behind the line, and settling back to ink; the figure never moves, under 341x256 px',
    'kp-sig-dark-bars':
        "a registered number driving the heights of the spinner's five bars over 2400 ms a loop; the bars keep their colours, only their heights change, under 341x256 px",
    'kp-sig-dark-meter-lay': "a mask revealing a meter's share from its start once; the share keeps its colour, under 341x256 px",
    'kp-sig-cyberpunk-meter-slip-o': "a meter's share landing with a few px sideways jumps and offset ghosts once; a transform, under 341x256 px",
    // Information that updates in place [research/update-motion, 2026-10-05].
    'kp-sig-cyberpunk-update-stutter':
        'two unblurred text-shadow copies of a changed value ticking home from 6px to nothing in four steps, once per update for 480 ms; the value itself keeps its colour and place, far under 341x256 px [research/cyberpunk-live]',
    'kp-sig-cyberpunk-update-still':
        'under reduced motion: two text-shadow copies of a changed value standing 2px out for 1.2 s, once, and going; nothing moves, far under 341x256 px [research/cyberpunk-live]',
    // The character rounds [scope-143], listed by the port session
    // (2026-10-08). The keyframes that only move or reshape are classified by
    // the gate itself (GEOMETRY_ONLY); these animate a custom property, a
    // filter, a shadow, a colour, visibility or content, so each says why it
    // cannot flash. What a custom property drives was read from the rules
    // that use it in the same register.
    'kp-progressbar-forest-breath':
        'a custom property that sets how far the rows of trees on a busy bar have grown (a background size, rounded to whole trees); the trees keep their colours, only their extent changes',
    'kp-skeleton-forest-treeline':
        'a custom property that grows a treeline drawn in a skeleton (its radii and width); the trees keep their colours, only their extent changes, 6.6 s a loop',
    'kp-sig-blueprint-callout':
        'a tooltip being traced once: its line drawn round the box and its ink and ground set at the end; one change from blank to drawn, under 341x256 px',
    'kp-sig-blueprint-frame':
        'a pen tracing a skeleton block frame: custom properties for the length drawn and the nib; the line keeps its colour, only its length grows, and the nib is a dot',
    'kp-sig-blueprint-place':
        'a pen tracing a skeleton line: custom properties for the length drawn and the nib; the line keeps its colour, only its length grows, and the nib is a dot',
    'kp-sig-blueprint-ring':
        'a pen tracing a skeleton circle: custom properties for the length drawn and the nib; the line keeps its colour, only its length grows, and the nib is a dot',
    'kp-sig-blueprint-stroke':
        'a pen tracing a busy bar or meter: custom properties for the length drawn and the nib; the line keeps its colour, only its length grows, and the nib is a dot',
    'kp-sig-blueprint-read':
        "a meter's reading traced once, or untraced on its leave: custom properties for the length drawn; one monotone change, under 341x256 px",
    'kp-sig-blueprint-trace':
        'a panel or toast being traced once: its outline drawn segment by segment (custom properties for the length), visible from the first frame; one monotone change',
    'kp-sig-blueprint-trace-out': 'the trace above played backwards once on a close or leave; one monotone change',
    'kp-sig-blueprint-update-read':
        'the revision mark on a changed value traced once (custom properties for the length drawn); one monotone change, far under 341x256 px',
    'kp-sig-brutalism-drop':
        'a slab dropped onto its footprint once: a translate and its hard shadow shrinking to the resting offset; the slab keeps its colours',
    'kp-sig-brutalism-hold': "a dialog's veil held visible for the length of the dialog's close, then gone in one step; one change",
    'kp-sig-brutalism-leave': 'a slab hoisted out once and hidden at the end; one change from shown to hidden',
    'kp-sig-brutalism-update-slam':
        'a changed value slammed onto its yellow offset once: a translate with a yellow drop-shadow whose offset grows from 3 to 9 px and settles; the colours stay, only the offset moves, under 341x256 px',
    'kp-sig-cyberpunk-bars-1':
        "a custom property setting the height of one of the spinner's bars, stepped every half second over 3 s; the bar keeps its colour, only its height changes, under 341x256 px",
    'kp-sig-cyberpunk-lock':
        'a custom property setting where the four lock corners sit round a toned part, in six steps over 360 ms, once; the corners keep their colour, only their position moves',
    'kp-sig-cyberpunk-split':
        'a toast or dialog arriving as clip-path slices with offset shadow copies, in hard steps, once; the copies keep their colours, the change is where they are cut',
    'kp-sig-cyberpunk-split-out': 'the split above played as the leave, once',
    'kp-sig-cyberpunk-word': "a loading word's text stepped letter by letter (content) every 1.8 s; the word keeps its colour, under 341x256 px",
    'kp-sig-forest-leave':
        'a part withering away once: it sinks, is clipped from the top and fades through a desaturating filter; one monotone change',
    'kp-sig-forest-arrive':
        'the withering above played as an arrival once (it grows up out of its line from a desaturating filter to none); one monotone change',
    'kp-sig-forest-ground':
        "the alarm's ground coming in once, from transparent to its own colour, on the growth curve over 1 s; one monotone change",
    'kp-sig-nostromo-size-scan':
        'an arriving part revealed in four scan frames (clip-path) while a brightness filter settles from 1.8 to none once; one monotone change, 80 ms a frame',
    'kp-sig-synthwave-sun': 'the sun sinking below the horizon once (a translate) and hidden at the end; one change from shown to hidden',
    'kp-sig-titanium-ti-cut':
        "a custom property setting where a dialog's chamfer cut sits as it opens, once; the dialog keeps its colours, only its outline changes",
};
