// research/character-busy: Phase 1 of the character round (Kenny,
// scratchpad/phase1-brief.md, 2026-10-05): the data table's busy overlay
// (`.kp-datatable__busy-overlay`, `data-kp-busy-overlay` or
// `busy({ overlay: true })`, fix-80 to fix-85) — a large spinner, the app's
// words, a live busy counter, and the failed alert (`[data-kp-datatable-failed]`)
// that can stand in its place when `fail()` is called. Every theme's overlay
// has five aspects, each picked on its own from three options, as the meter
// and the trend tile do:
//
//   data-bo-shape="1|2|3"    the overlay's veil and the panel's chrome
//                             (border, radius, shadow, the spinner's own
//                             ring)
//   data-bo-loading="1|2|3"  the picture that plays while the panel shows;
//                             it always moves (a still frame under reduced
//                             motion), and nothing fades
//   data-bo-arrival="1|2|3"  how the panel comes in when the table turns
//                             busy; `js/datatable.js` draws the layer fresh
//                             every time (`drawOverlay()`), so a CSS
//                             animation on insert is all a character needs,
//                             and plays again on "Loading" here
//   data-bo-failure="1|2|3"  the failed alert that replaces the panel when
//                             `fail()` is called: the same plate, the
//                             destructive pair
//   data-bo-phone="1|2|3"    the panel's own accents in the flat layout a
//                             phone gets below 30rem (`@container kp-table`)
//
// Every rule in busy.css (and busy-a..d.css, four empty groups) names one
// aspect only, so any combination composes. The markup is the package's own:
// `attachDataTables()` draws `.kp-datatable__busy-overlay` >
// `.kp-datatable__busy-panel` > `.kp-spinner` + `.kp-datatable__busy-words` +
// `.kp-datatable__busy-clock`, and builds `[data-kp-datatable-failed]`
// (`.kp-alert.kp-alert--destructive`) itself when a table's markup has none.
// `js/datatable.js` is not changed; the five attributes sit on the
// `.kp-datatable` wrapper itself, beside `data-kp-datatable`.
//
// What the module does not hand a character, found while building: the
// overlay layer is removed from the DOM the instant the table leaves
// `loading` (`drawOverlay()` calls `.remove()` synchronously, with no
// transition window), so a true *leave* animation cannot be shown — only
// the *arrival* plays, and it plays again every time "Loading" is pressed
// fresh. The failed alert, by contrast, only toggles `hidden`, so it stays
// in the DOM and the shared part gives its arrival a genuine transition
// (`@starting-style`) with no JS of its own — but not its leave either:
// the base layer's `[hidden] { display: none !important }` (KT13) cuts it
// instantly, before `transition-behavior: allow-discrete` gets a frame to
// delay. Neither element can show the reverse half of "opposites mirror";
// busy.css's header says so beside the rule.

import { attachDataTables, dataTable } from '../../js/datatable.js';
import { THEMES } from '../../js/theme-registry.js';
import R2A from './round2-a.js';
import R2B from './round2-b.js';
import R2C from './round2-c.js';
import R2D from './round2-d.js';

/** @typedef {{ name: string, text: string }} Option */
/** @typedef {'shape' | 'loading' | 'arrival' | 'failure' | 'phone'} Aspect */

/** The five aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: "The overlay's veil and the panel's chrome: its border, radius, shadow and the spinner's own ring. Compare them as they stand.",
    },
    { id: 'loading', label: 'While loading', about: 'The picture that plays on the panel while it covers the rows; it always moves. Press Loading.' },
    {
        id: 'arrival',
        label: 'How the panel arrives',
        about: 'How the panel comes in when the table turns busy. Press Loading again to replay it.',
    },
    { id: 'failure', label: 'The failed state', about: "The alert that stands in the panel's place when the table could not load. Press Failed." },
    { id: 'phone', label: 'On a phone', about: 'The panel flat, below the 30rem the package switches at; shown here in a fixed 334px pane.' },
];

/**
 * Per theme, three options for each aspect: the spec other helpers build
 * from. @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            {
                name: 'The engraved plate',
                text: 'A ruled double frame around the panel, the words in the serif’s small capitals, a fine rule under the spinner row.',
            },
            {
                name: 'The docket',
                text: 'A paper docket with a folded corner at the top right, a single rule under the words, the spinner a plain navy ring.',
            },
            {
                name: 'The seal',
                text: 'A circular wax-seal ring stands in for the spinner, the panel framed in a single hairline, the words in small capitals.',
            },
        ],
        loading: [
            {
                name: 'The dotted leader',
                text: 'A dotted leader under the words travels from the panel’s start to its end and begins again, in the ink.',
            },
            {
                name: 'The ledger is ruled',
                text: 'A fine rule sweeps down the panel from top to bottom and begins again, as a ledger page is ruled.',
            },
            {
                name: 'The seal is pressed',
                text: 'The seal ring scales up and back on its own centre, as if pressed and lifted, again and again.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Engraved',
                text: 'The panel grows in from a thin rule to its full height, slowing as it lands.',
            },
            {
                name: 'Entered in the ledger',
                text: 'The panel rises from the row below it in hard steps, as an entry is written line by line.',
            },
        ],
        failure: [
            {
                name: 'The red-ink entry',
                text: 'The failed alert is ruled off along its leading edge in the destructive ink, the reason in small capitals.',
            },
            {
                name: 'The torn notice',
                text: 'A jagged clipped edge along the top of the alert, as a notice torn from a pad, the destructive pair on its plate.',
            },
            {
                name: 'The voided stamp',
                text: 'A double-ruled frame like a voided cheque sits around the alert, the reason stamped in the destructive ink.',
            },
        ],
        phone: [
            {
                name: 'The folded note',
                text: 'The panel keeps its ruled baseline under a single compact row of the spinner and the words.',
            },
            {
                name: 'The docket strip',
                text: 'The panel narrows to a strip with its folded corner kept at the inline-start, the words beside the ring.',
            },
            {
                name: 'The ledger line',
                text: 'A single hairline parts the spinner from the words, the panel otherwise flat and ungarnished.',
            },
        ],
    },
    light: {
        shape: [
            {
                name: 'The soft card',
                text: 'A white panel lifted on a soft shadow with a wide radius, the words in the regular face.',
            },
            {
                name: 'Daylight',
                text: 'A pale wash from the primary colour at the panel’s top fading toward the card at its foot, no hard frame.',
            },
            {
                name: 'The paper sheet',
                text: 'A small radius and a lifted corner fold at the top right, faint writing rules behind the words.',
            },
        ],
        loading: [
            {
                name: 'The dashed baseline',
                text: 'A dashed baseline under the words drifts to the right and loops back, slow and even.',
            },
            {
                name: 'Daylight crosses',
                text: 'A soft band of the primary wash crosses the panel from one side to the other and begins again.',
            },
            {
                name: 'A cloud passes',
                text: 'A soft round shadow drifts across the panel’s face, slow, like a cloud over a lawn.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Unfolds',
                text: 'The panel opens from its middle, growing to full height and slowing as it lands.',
            },
            {
                name: 'Sunrise',
                text: 'The panel rises from the row below it, slowing as it lands, as a sun clears the sill.',
            },
        ],
        failure: [
            {
                name: 'The soft alarm',
                text: 'The failed alert keeps the soft card’s radius and shadow, its plate the destructive pair.',
            },
            {
                name: 'The outlined notice',
                text: 'The alert is drawn in a soft outline of the destructive ink over its own plate, no fill change.',
            },
            {
                name: 'The coloured tab',
                text: 'A band of the destructive colour runs along the top edge of the alert, the rest the soft card.',
            },
        ],
        phone: [
            {
                name: 'The flat card',
                text: 'The panel lies flat with its soft shadow kept only along the top edge.',
            },
            {
                name: 'The sheet strip',
                text: 'The panel narrows to a strip with its folded corner kept small at the inline-start.',
            },
            {
                name: 'The daylight strip',
                text: 'The wash narrows to a thin band along the top of the flattened panel.',
            },
        ],
    },
    dark: {
        shape: [
            {
                name: 'The status board',
                text: 'A black panel with a fine bevel, the words lit in mono, a lit rule under the spinner row.',
            },
            {
                name: 'The machined panel',
                text: 'A recessed slot (an inner shadow above, a lit lip below) holds the spinner and the words.',
            },
            {
                name: 'The oscilloscope',
                text: 'A dark well with a dotted graticule behind the words and a lit rim around the panel.',
            },
        ],
        loading: [
            {
                name: 'The ticker baseline',
                text: 'A dashed baseline under the words ticks along like a ticker tape, looping without a seam.',
            },
            {
                name: 'The slot is scanned',
                text: 'A lit band sweeps along the recessed slot, as a scanner reads it, and begins again.',
            },
            {
                name: 'The scope sweeps',
                text: 'A lit sweep line crosses the graticule left to right and begins again, as a scope trace.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Switched on',
                text: 'The panel strikes on and off once like a tube warming, then holds, in two hard jumps.',
            },
            {
                name: 'Machined in',
                text: 'The panel is drawn up from the row below it in hard steps, as a panel is machined into place.',
            },
        ],
        failure: [
            {
                name: 'The alarm lamp',
                text: 'The failed alert reads as a lit square chip in the destructive pair, inset like a panel lamp.',
            },
            {
                name: 'The machined tab',
                text: 'The alert is a flat tab with a square corner and a lit top edge, in the destructive pair.',
            },
            {
                name: 'The scope fault',
                text: 'A lit rim in the destructive colour rings the alert, as a scope marks an out-of-range trace.',
            },
        ],
        phone: [
            {
                name: 'The flat board',
                text: 'The panel lies flat, the lit rule under the spinner row kept, the bevel dropped.',
            },
            {
                name: 'The flat slot',
                text: 'The recessed slot narrows to a thin lit lip along the top of the flattened panel.',
            },
            {
                name: 'The flat scope',
                text: 'The graticule narrows to a single lit rule along the top of the flattened panel.',
            },
        ],
    },
    cyberpunk: {
        shape: [
            {
                name: 'The neon trace',
                text: 'Cut corners on the panel’s frame, the words in tech mono with a cyan halo on the spinner ring.',
            },
            {
                name: 'The glitch HUD',
                text: 'Yellow brackets sit at the corners of the panel, hazard tape along its top edge.',
            },
            {
                name: 'The holo card',
                text: 'A thin holographic rim around the panel, the words in tech mono, no frame otherwise.',
            },
        ],
        loading: [
            {
                name: 'The neon trace sweeps',
                text: 'A neon rule sweeps along the panel’s foot, looping, with its own glow.',
            },
            {
                name: 'The glitch flickers',
                text: 'The yellow corner brackets jump a few pixels out and back, hard, again and again.',
            },
            {
                name: 'Packet rain',
                text: 'A column of short marks falls down the panel’s face and loops from the top.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Jacked in',
                text: 'The panel snaps in from a sliver to full width in one hard step, then settles.',
            },
            {
                name: 'The neon strikes',
                text: 'The panel’s frame draws itself from one corner to the diagonal corner, then the panel fills in.',
            },
        ],
        failure: [
            {
                name: 'The neon fault',
                text: 'The failed alert’s frame glows in the destructive colour, cut corners kept.',
            },
            {
                name: 'The glitch alarm',
                text: 'The corner brackets turn to the destructive colour and jump once, hard, then hold.',
            },
            {
                name: 'The hazard frame',
                text: 'Hazard tape in the destructive colour runs along the alert’s top edge.',
            },
        ],
        phone: [
            {
                name: 'The flat trace',
                text: 'The panel flattens, the neon rule kept as a thin line along the top.',
            },
            {
                name: 'The flat HUD',
                text: 'The corner brackets shrink to marks on the top corners of the flattened panel only.',
            },
            {
                name: 'The flat holo',
                text: 'The holographic rim narrows to a line along the top of the flattened panel.',
            },
        ],
    },
    synthwave: {
        shape: [
            {
                name: 'The grid-floor horizon',
                text: 'A perspective grid floor under a pink horizon line sits behind the words.',
            },
            {
                name: 'The VCR display',
                text: 'OSD-style numerals and scanlines over the panel, a hard square frame.',
            },
            {
                name: 'The arcade marquee',
                text: 'A row of lit cells runs along the top of the panel, the words in the display face.',
            },
        ],
        loading: [
            {
                name: 'The horizon rolls',
                text: 'The grid floor’s lines march toward the horizon and loop, as a drive through the grid.',
            },
            {
                name: 'The tape tracks',
                text: 'A scanline band rolls down the panel and loops, as a tape head finds its track.',
            },
            {
                name: 'The marquee chases',
                text: 'The lit cells along the top light in sequence, left to right, looping without a seam.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Over the horizon',
                text: 'The panel rises from the horizon line to its full height, slowing as it lands.',
            },
            {
                name: 'Tape loads',
                text: 'The panel snaps up in three hard steps, as a tape loads a screen.',
            },
        ],
        failure: [
            {
                name: 'The grid fault',
                text: 'The horizon line turns to the destructive colour, the grid floor kept.',
            },
            {
                name: 'The VCR warning',
                text: 'The scanlines pause and the frame turns to the destructive colour, square corners kept.',
            },
            {
                name: 'The arcade warning',
                text: 'The lit cells along the top all turn to the destructive colour at once.',
            },
        ],
        phone: [
            {
                name: 'The flat horizon',
                text: 'The grid floor flattens to a single horizon line along the top of the panel.',
            },
            {
                name: 'The flat display',
                text: 'The scanlines narrow to two or three bands across the flattened panel.',
            },
            {
                name: 'The flat marquee',
                text: 'The lit cells shrink to a short row along the top of the flattened panel.',
            },
        ],
    },
    pastel: {
        shape: [
            {
                name: 'The sticker chart',
                text: 'A fat, round-capped rule under the words, the panel’s corners generously rounded.',
            },
            {
                name: 'The washi planner',
                text: 'A strip of washi tape crosses the top of the panel, dotted planner rules behind the words.',
            },
            {
                name: 'The cloud card',
                text: 'The panel’s outline is drawn as a soft scalloped cloud shape, rounded throughout.',
            },
        ],
        loading: [
            {
                name: 'Sprinkles fall',
                text: 'Small round marks fall gently down the panel’s face and loop from the top.',
            },
            {
                name: 'The washi flutters',
                text: 'The washi tape strip sways gently side to side and back, looping.',
            },
            {
                name: 'The cloud drifts',
                text: 'The scalloped outline nudges a little to one side and back, slow and soft.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Popped',
                text: 'The panel grows from a small sticker size to full size with a soft overshoot and settle.',
            },
            {
                name: 'Doodled in',
                text: 'The panel’s rounded outline draws itself on in one sweep, then the panel fills in.',
            },
        ],
        failure: [
            {
                name: 'The heart sticker',
                text: 'The failed alert keeps the sticker chart’s rounded corners, its plate the destructive pair.',
            },
            {
                name: 'The torn washi',
                text: 'The washi tape strip turns to the destructive colour, kept at an easy angle.',
            },
            {
                name: 'The cloud warning',
                text: 'The scalloped cloud outline turns to the destructive colour, shape kept.',
            },
        ],
        phone: [
            {
                name: 'The flat sticker',
                text: 'The panel flattens, the fat rule under the words kept as the one accent.',
            },
            {
                name: 'The flat washi',
                text: 'The washi tape strip narrows to a short tab at the inline-start of the flattened panel.',
            },
            {
                name: 'The flat cloud',
                text: 'The scalloped outline softens to a single rounded top edge on the flattened panel.',
            },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'The top(1) row',
                text: 'Everything in the mono, the words in capitals, a square frame in the phosphor colour.',
            },
            {
                name: 'The dumb-terminal plot',
                text: 'A grid of character cells behind the words, the frame drawn in rule characters.',
            },
            {
                name: 'The curses window',
                text: 'A double-line box frame around the panel, the words in the mono, a status bar rule at the foot.',
            },
        ],
        loading: [
            {
                name: 'The cursor blinks',
                text: 'A block cursor at the end of the words appears and disappears on a hard beat, no fade.',
            },
            {
                name: 'The marquee scrolls',
                text: 'The words’ row scrolls a trailing dot pattern from right to left and loops.',
            },
            {
                name: 'The spinner cycles',
                text: 'A single ASCII-style glyph in the frame’s corner steps through a short cycle, hard, looping.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Printed',
                text: 'The panel’s frame draws itself top to bottom in rule characters, then the panel fills in.',
            },
            {
                name: 'Paged in',
                text: 'The panel scrolls up from the row below it in hard character-row steps.',
            },
        ],
        failure: [
            {
                name: 'The bell',
                text: 'The failed alert’s frame flashes to the destructive colour once, hard, then holds.',
            },
            {
                name: 'Reverse flash',
                text: 'The alert’s frame and words swap to reverse video in the destructive pair.',
            },
            {
                name: 'The core dump',
                text: 'A block of character-cell marks fills the alert’s corner in the destructive colour.',
            },
        ],
        phone: [
            {
                name: 'The flat row',
                text: 'The panel flattens to one mono row, the square frame kept thin along the top.',
            },
            {
                name: 'The flat plot',
                text: 'The character-cell grid narrows to a single row behind the words.',
            },
            {
                name: 'The flat window',
                text: 'The double-line frame narrows to a single rule along the top of the panel.',
            },
        ],
    },
    forest: {
        shape: [
            {
                name: 'The ranger’s logbook',
                text: 'Contour rings sit faintly behind the words, the frame a thin bark-coloured rule.',
            },
            {
                name: 'The canopy',
                text: 'A leaf-green wash rises from the panel’s foot, the words in the serif italic.',
            },
            {
                name: 'The herbarium sheet',
                text: 'A pressed-leaf outline sits faintly behind the words, a single rule under the spinner row.',
            },
        ],
        loading: [
            {
                name: 'The trail is walked',
                text: 'A footprint mark steps along the foot of the panel and loops back to the start.',
            },
            {
                name: 'The canopy sways',
                text: 'The leaf-green wash shifts gently side to side at the panel’s foot, looping.',
            },
            {
                name: 'Fireflies drift',
                text: 'Small round marks drift up through the panel and loop from the foot.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Grows',
                text: 'The panel grows up from the foot like a seedling, slowing as it reaches full height.',
            },
            {
                name: 'The trail is walked in',
                text: 'The panel rises in a few uneven steps, as a trail is walked into a clearing.',
            },
        ],
        failure: [
            {
                name: 'The trail blaze',
                text: 'A painted blaze mark in the destructive colour sits on the alert’s leading edge.',
            },
            {
                name: 'The withered canopy',
                text: 'The leaf-green wash turns to the destructive colour, shape kept.',
            },
            {
                name: 'The warning tag',
                text: 'A wooden-tag shape in the alert’s corner carries the destructive pair.',
            },
        ],
        phone: [
            {
                name: 'The flat logbook',
                text: 'The panel flattens, the contour rings kept faint behind the words only.',
            },
            {
                name: 'The flat canopy',
                text: 'The leaf-green wash narrows to a band along the top of the flattened panel.',
            },
            {
                name: 'The flat sheet',
                text: 'The pressed-leaf outline fades to a single rule under the spinner row.',
            },
        ],
    },
    'high-contrast': {
        shape: [
            {
                name: 'Ink and frame',
                text: 'A solid heavy frame in full ink, the words bold, a solid baseline under the spinner row.',
            },
            {
                name: 'The inverse plate',
                text: 'The panel is an ink plate with the words drawn in the paper colour, bold throughout.',
            },
            {
                name: 'The signal board',
                text: 'A thick double frame, the words heavy, the spinner ring drawn in full ink.',
            },
        ],
        loading: [
            {
                name: 'The dashed baseline',
                text: 'A heavy dashed baseline under the words marches to the right and loops, hard steps.',
            },
            {
                name: 'The striped block',
                text: 'A block of heavy stripes slides along the panel’s foot and loops, hard steps.',
            },
            {
                name: 'The scanning bar',
                text: 'A heavy bar sweeps the full height of the panel left to right and loops, hard steps.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Switched',
                text: 'The panel appears at full size in one hard step, no easing.',
            },
            {
                name: 'Dropped',
                text: 'The panel drops in from above in one hard step and holds, no overshoot.',
            },
        ],
        failure: [
            {
                name: 'Ink and frame',
                text: 'The failed alert keeps the heavy frame, its plate the destructive pair, bold words.',
            },
            {
                name: 'The heavy frame',
                text: 'A thicker frame than the ready panel’s, the destructive pair, bold words.',
            },
            {
                name: 'The signal plate',
                text: 'The alert is the inverse plate in the destructive pair, bold throughout.',
            },
        ],
        phone: [
            {
                name: 'The flat frame',
                text: 'The panel flattens, the heavy frame kept only along the top edge.',
            },
            {
                name: 'The flat inverse',
                text: 'The ink plate narrows to a band along the top of the flattened panel.',
            },
            {
                name: 'The flat signal',
                text: 'The double frame narrows to one heavy rule along the top of the panel.',
            },
        ],
    },
    sepia: {
        shape: [
            {
                name: 'The barograph',
                text: 'Ruled chart paper (fine level and hour lines) sits behind the words, a vignette at the edges.',
            },
            {
                name: 'Letterpress',
                text: 'The words sit pressed into the sheet, the frame a heavier ink rule.',
            },
            {
                name: 'The ticket stub',
                text: 'A perforated edge runs down one side of the panel, the words in small capitals.',
            },
        ],
        loading: [
            {
                name: 'The nib writes',
                text: 'A fine nib trace draws along the chart paper’s hour line and loops back to the start.',
            },
            {
                name: 'The ink spreads',
                text: 'A soft sepia wash spreads from the panel’s centre and recedes, looping, no opacity change.',
            },
            {
                name: 'The drum turns',
                text: 'A ruled band turns around the panel’s edge like a drum, looping.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'The nib writes it in',
                text: 'The panel’s frame draws itself along the chart lines, then the panel fills in.',
            },
            {
                name: 'Pressed',
                text: 'The panel presses into place from a slimmer size, settling with a slight give.',
            },
        ],
        failure: [
            {
                name: 'The rubber stamp',
                text: 'A stamped ring in the destructive colour sits askew on the alert’s corner.',
            },
            {
                name: 'Letterpress fault',
                text: 'The words press in bold, the frame in the destructive colour.',
            },
            {
                name: 'The voided stub',
                text: 'The perforated edge turns to the destructive colour, kept along the same side.',
            },
        ],
        phone: [
            {
                name: 'The flat graph',
                text: 'The panel flattens, the chart paper kept as a faint band behind the words.',
            },
            {
                name: 'The flat press',
                text: 'The letterpress rule narrows to a single line along the top of the panel.',
            },
            {
                name: 'The flat stub',
                text: 'The perforated edge narrows to a short mark at the inline-start of the panel.',
            },
        ],
    },
    blueprint: {
        shape: [
            {
                name: 'The chart recorder',
                text: 'A millimetre grid sits behind the words, the frame in the technical mono.',
            },
            {
                name: 'The title block',
                text: 'The panel is parted into cells by drawn rules, the words in technical mono capitals.',
            },
            {
                name: 'The section view',
                text: 'A hatched band sits along one edge of the panel, a chain-line frame.',
            },
        ],
        loading: [
            {
                name: 'The pen steps',
                text: 'A drafting-pen mark steps along the millimetre grid, left to right, and loops.',
            },
            {
                name: 'The cell fills',
                text: 'One cell of the title block lights along its rule and the next follows, looping.',
            },
            {
                name: 'The hatch sweeps',
                text: 'The hatched band’s lines shift along the edge and loop, in hard steps.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Drafted',
                text: 'The panel’s frame draws itself rule by rule, then the panel fills in.',
            },
            {
                name: 'Plotted',
                text: 'The panel rises from the grid in hard steps, as a plotter draws a frame up.',
            },
        ],
        failure: [
            {
                name: 'The revision cloud',
                text: 'A scalloped revision-cloud outline in the destructive colour rings the alert.',
            },
            {
                name: 'The red-line fault',
                text: 'A chain-line in the destructive colour runs along the alert’s leading edge.',
            },
            {
                name: 'The out-of-tolerance mark',
                text: 'A hatched band in the destructive colour sits along the alert’s top edge.',
            },
        ],
        phone: [
            {
                name: 'The flat recorder',
                text: 'The panel flattens, the millimetre grid kept faint behind the words.',
            },
            {
                name: 'The flat block',
                text: 'The title block’s cells collapse to one row with a single parting rule.',
            },
            {
                name: 'The flat section',
                text: 'The hatched band narrows to a thin line along the top of the panel.',
            },
        ],
    },
    solstice: {
        shape: [
            {
                name: 'The low sun',
                text: 'A warm glow rises from the panel’s foot behind the words, no hard frame.',
            },
            {
                name: 'The embers',
                text: 'A faint heat wash sits at the panel’s foot, the words in the serif.',
            },
            {
                name: 'The horizon',
                text: 'A warm line sits across the panel’s lower third, the words above it.',
            },
        ],
        loading: [
            {
                name: 'The sun crosses',
                text: 'The warm glow’s centre drifts across the panel’s foot and loops back.',
            },
            {
                name: 'The embers glow',
                text: 'The heat wash swells gently at the panel’s foot and settles, looping, by scale not opacity.',
            },
            {
                name: 'The horizon line glows',
                text: 'The warm line’s edge brightens along its length and dims back, looping, by colour-mix not opacity.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Dawn',
                text: 'The panel rises from the horizon line to full height, slowing as it lands.',
            },
            {
                name: 'Kindled',
                text: 'The panel grows from the embers at its foot, slowing as it reaches full height.',
            },
        ],
        failure: [
            {
                name: 'The red sky',
                text: 'The warm glow turns to the destructive colour, shape kept.',
            },
            {
                name: 'The cold ember',
                text: 'The heat wash turns to the destructive colour at the panel’s foot.',
            },
            {
                name: 'The warning horizon',
                text: 'The horizon line turns to the destructive colour across its length.',
            },
        ],
        phone: [
            {
                name: 'The flat sun',
                text: 'The panel flattens, the warm glow kept as a band along the top.',
            },
            {
                name: 'The flat embers',
                text: 'The heat wash narrows to a thin band along the top of the panel.',
            },
            {
                name: 'The flat horizon',
                text: 'The horizon line moves to the top edge of the flattened panel.',
            },
        ],
    },
    brutalism: {
        shape: [
            {
                name: 'The slab',
                text: 'A heavy black frame with a hard offset shadow, the words in heavy capitals.',
            },
            {
                name: 'The sticker sheet',
                text: 'The panel sits askew by a degree or two, a black outline, the words huge.',
            },
            {
                name: 'The poster block',
                text: 'A thick black rule runs across the top of the panel, the words set tight.',
            },
        ],
        loading: [
            {
                name: 'The stamp',
                text: 'A heavy mark stamps down onto the panel and lifts, hard, again and again.',
            },
            {
                name: 'The hammer',
                text: 'The panel’s hard shadow jumps a few pixels and snaps back, hard, looping.',
            },
            {
                name: 'The drop',
                text: 'A heavy block drops from above the panel and bounces once, hard, looping.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Slammed',
                text: 'The panel slams in from a smaller size to full size in one hard step, no easing.',
            },
            {
                name: 'Shoved in',
                text: 'The panel shoves in from the side in one hard step and holds.',
            },
        ],
        failure: [
            {
                name: 'The warning poster',
                text: 'A thick rule in the destructive colour runs across the top of the alert.',
            },
            {
                name: 'The hazard slab',
                text: 'The alert’s hard shadow turns to the destructive colour, shape kept.',
            },
            {
                name: 'The stamped fault',
                text: 'A heavy stamp mark in the destructive colour sits askew on the alert.',
            },
        ],
        phone: [
            {
                name: 'The flat slab',
                text: 'The panel flattens, the hard shadow kept only along the top edge.',
            },
            {
                name: 'The flat sheet',
                text: 'The askew angle is dropped on the flattened panel, the outline kept.',
            },
            {
                name: 'The flat poster',
                text: 'The thick top rule is kept as the one accent on the flattened panel.',
            },
        ],
    },
    deco: {
        shape: [
            {
                name: 'The gilt frame',
                text: 'A double gold rule frames the panel, a faint sunburst rising behind the words.',
            },
            {
                name: 'The marquee',
                text: 'A row of lit cells runs along the top and foot of the panel, the words in display capitals.',
            },
            {
                name: 'The skyscraper',
                text: 'Stepped-back bands rise behind the words, a thin gold rule at each step.',
            },
        ],
        loading: [
            {
                name: 'The sunburst opens',
                text: 'The sunburst’s rays lengthen from the centre and shorten back, looping, by scale not opacity.',
            },
            {
                name: 'The bulbs chase',
                text: 'The lit cells along the top light in sequence, left to right, looping without a seam.',
            },
            {
                name: 'The steps climb',
                text: 'A gold mark climbs the stepped-back bands and resets to the foot, looping.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'The curtain rises',
                text: 'The panel rises from the foot like a curtain, slowing as it reaches full height.',
            },
            {
                name: 'The marquee lights',
                text: 'The panel’s gold frame draws itself corner to corner, then the panel fills in.',
            },
        ],
        failure: [
            {
                name: 'The gilt notice',
                text: 'The failed alert keeps the double gold frame, its plate the destructive pair.',
            },
            {
                name: 'The marquee warning',
                text: 'The lit cells along the top turn to the destructive colour at once.',
            },
            {
                name: 'The red skyscraper',
                text: 'The stepped-back bands turn to the destructive colour, shape kept.',
            },
        ],
        phone: [
            {
                name: 'The flat gilt',
                text: 'The panel flattens, the gold frame kept as a single rule along the top.',
            },
            {
                name: 'The flat marquee',
                text: 'The lit cells shrink to a short row along the top of the flattened panel.',
            },
            {
                name: 'The flat skyscraper',
                text: 'The stepped bands collapse to one band along the top of the panel.',
            },
        ],
    },
    phantom: {
        shape: [
            {
                name: 'The evidence card',
                text: 'The words sit slightly slanted, a thin red string runs along one edge of the panel.',
            },
            {
                name: 'The calling card',
                text: 'The panel sits skewed by a degree, display capitals, a red slash across one corner.',
            },
            {
                name: 'The ransom note',
                text: 'The words sit at a slight irregular slant, torn edges down the panel’s sides.',
            },
        ],
        loading: [
            {
                name: 'The string is pulled',
                text: 'The red string along the edge tautens and slackens, looping, by scale not opacity.',
            },
            {
                name: 'The slash redraws',
                text: 'The red slash across the corner lengthens and shortens, looping, by scale not opacity.',
            },
            {
                name: 'The note trembles',
                text: 'The panel’s slant rocks a degree one way then the other, looping.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'The card is thrown',
                text: 'The panel slides in from the side and settles into its skewed rest, slowing as it lands.',
            },
            {
                name: 'Slashed in',
                text: 'The panel’s red slash draws itself across the corner first, then the panel fills in.',
            },
        ],
        failure: [
            {
                name: 'The calling card',
                text: 'The failed alert keeps the skewed angle, its slash in the destructive colour.',
            },
            {
                name: 'The stamped ring',
                text: 'A stamped ring set askew in the destructive colour sits on the alert.',
            },
            {
                name: 'The torn warning',
                text: 'The torn edges down the alert’s sides turn to the destructive colour.',
            },
        ],
        phone: [
            {
                name: 'The flat evidence',
                text: 'The panel sits level on the flattened layout, the red string kept along the top.',
            },
            {
                name: 'The flat card',
                text: 'The skew is dropped on the flattened panel, the corner slash kept.',
            },
            {
                name: 'The flat note',
                text: 'The torn edges soften to a single torn line along the top of the panel.',
            },
        ],
    },
    'shade-light': {
        shape: [
            {
                name: 'Pencil in the shade',
                text: 'The panel is hatched in fine pencil lines, a soft graphite frame.',
            },
            {
                name: 'The leaf shade',
                text: 'Dappled leaf-shade shapes sit faintly over the panel, a soft line frame.',
            },
            {
                name: 'The window light',
                text: 'A soft diagonal band of light crosses the panel, a thin frame.',
            },
        ],
        loading: [
            {
                name: 'Leaves sway',
                text: 'The dappled leaf shapes drift a little side to side and back, looping, by position not opacity.',
            },
            {
                name: 'The pencil hatches',
                text: 'A fresh hatch line is drawn across the panel and fades into the set, looping by position.',
            },
            {
                name: 'The light shifts',
                text: 'The diagonal light band slides across the panel and loops back.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Drawn in pencil',
                text: 'The panel’s hatching fills in stroke by stroke, then the panel is complete.',
            },
            {
                name: 'Out of the shade',
                text: 'The panel slides out from under the leaf shade to its full position, slowing as it lands.',
            },
        ],
        failure: [
            {
                name: 'The pinned note',
                text: 'A small pin mark sits in the alert’s corner, the destructive pair on its plate.',
            },
            {
                name: 'The withered leaf',
                text: 'The dappled leaf shapes turn to the destructive colour over the alert.',
            },
            {
                name: 'The warning window',
                text: 'The diagonal light band turns to the destructive colour across the alert.',
            },
        ],
        phone: [
            {
                name: 'The flat pencil',
                text: 'The panel flattens, the hatching kept faint behind the words.',
            },
            {
                name: 'The flat leaf',
                text: 'The dappled shapes thin to a few marks along the top of the panel.',
            },
            {
                name: 'The flat window',
                text: 'The diagonal band straightens to a line along the top of the panel.',
            },
        ],
    },
    'shade-dark': {
        shape: [
            {
                name: 'Silverpoint',
                text: 'A silver hairline sits above the words over a faint silver wash.',
            },
            {
                name: 'The reading lamp',
                text: 'A pool of light sits behind the words, a soft frame around the panel.',
            },
            {
                name: 'The night window',
                text: 'A faint moonlit band crosses the panel, a thin frame.',
            },
        ],
        loading: [
            {
                name: 'The glint travels',
                text: 'A silver glint travels along the hairline and loops back to the start.',
            },
            {
                name: 'The lamp flickers',
                text: 'The pool of light behind the words shifts a little and settles, looping, by position not opacity.',
            },
            {
                name: 'The moon crosses',
                text: 'The moonlit band drifts across the panel and loops back.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Silverpoint',
                text: 'The silver hairline draws itself across first, then the panel fills in below it.',
            },
            {
                name: 'The lamp is lit',
                text: 'The panel’s pool of light grows from a point to its full size, slowing as it lands.',
            },
        ],
        failure: [
            {
                name: 'The red lamp',
                text: 'The pool of light behind the words turns to the destructive colour.',
            },
            {
                name: 'The tarnished point',
                text: 'The silver hairline turns to the destructive colour, position kept.',
            },
            {
                name: 'The red window',
                text: 'The moonlit band turns to the destructive colour across the alert.',
            },
        ],
        phone: [
            {
                name: 'The flat point',
                text: 'The panel flattens, the silver hairline kept along the top edge.',
            },
            {
                name: 'The flat lamp',
                text: 'The pool of light narrows to a band along the top of the panel.',
            },
            {
                name: 'The flat window',
                text: 'The moonlit band moves to the top edge of the flattened panel.',
            },
        ],
    },
    retro: {
        shape: [
            {
                name: 'The 1995 dialog',
                text: 'A raised grey bevel frames the panel, a sunken white well behind the words.',
            },
            {
                name: 'The performance monitor',
                text: 'A black well with a green grid sits behind the words, a thin frame.',
            },
            {
                name: 'The Notepad window',
                text: 'A plain single-pixel frame, a title-bar-style rule above the words.',
            },
        ],
        loading: [
            {
                name: 'The progress blocks',
                text: 'Blocks fill the panel’s foot left to right, then clear and start again, in hard steps.',
            },
            {
                name: 'The marquee bar',
                text: 'A short bar slides back and forth along the panel’s foot, hard steps, bouncing at each end.',
            },
            {
                name: 'The defragmenter',
                text: 'Small blocks swap places across the panel’s face in short hard jumps, looping.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Painted',
                text: 'The panel paints in from the top in a few hard rows, as a slow screen redraw.',
            },
            {
                name: 'Dragged in',
                text: 'The panel is dragged in from the side in one hard step, bevel first.',
            },
        ],
        failure: [
            {
                name: 'The message box',
                text: 'The failed alert is the 1995 dialog’s bevel with a destructive-coloured title rule.',
            },
            {
                name: 'The flat field',
                text: 'The alert loses its bevel for a flat destructive-coloured frame instead.',
            },
            {
                name: 'The monitor fault',
                text: 'The green grid turns to the destructive colour behind the alert’s words.',
            },
        ],
        phone: [
            {
                name: 'The flat dialog',
                text: 'The panel flattens, the raised bevel kept only along the top edge.',
            },
            {
                name: 'The flat monitor',
                text: 'The green grid narrows to one or two lines behind the words.',
            },
            {
                name: 'The flat window',
                text: 'The title-bar rule is kept as the one accent on the flattened panel.',
            },
        ],
    },
    grotesk: {
        shape: [
            {
                name: 'The transit board',
                text: 'A thick bar in the series colour sits across the top of the panel.',
            },
            {
                name: 'The Swiss poster',
                text: 'The words sit huge and flush to one side, a hairline frame.',
            },
            {
                name: 'The index card',
                text: 'A thin rule under the words, the panel otherwise unornamented.',
            },
        ],
        loading: [
            {
                name: 'The board flips',
                text: 'A short strip across the top flips through a few positions, hard, looping.',
            },
            {
                name: 'The poster shifts',
                text: 'The huge word nudges a pixel or two and back on a hard beat, looping.',
            },
            {
                name: 'The index turns',
                text: 'The rule under the words redraws itself left to right and starts again, looping.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Set in type',
                text: 'The panel’s words set in from a narrow column to full width, slowing as it lands.',
            },
            {
                name: 'The board flips in',
                text: 'The panel flips up from the row below it in one hard step.',
            },
        ],
        failure: [
            {
                name: 'The index colour',
                text: 'The failed alert’s rule turns to the destructive colour, the rest unornamented.',
            },
            {
                name: 'The red bar',
                text: 'The thick top bar turns to the destructive colour, shape kept.',
            },
            {
                name: 'The poster warning',
                text: 'The huge word takes the destructive colour, the frame unchanged.',
            },
        ],
        phone: [
            {
                name: 'The flat board',
                text: 'The panel flattens, the top bar kept as the one accent.',
            },
            {
                name: 'The flat poster',
                text: 'The words shrink to a normal size on the flattened panel, the hairline kept.',
            },
            {
                name: 'The flat index',
                text: 'The rule under the words is kept as the only accent on the flattened panel.',
            },
        ],
    },
    lapis: {
        shape: [
            {
                name: 'The girih tile',
                text: 'A faint star lattice sits behind the words, a double gold frame.',
            },
            {
                name: 'Lapis on vellum',
                text: 'A gold rim runs around the panel, the words in the serif italic.',
            },
            {
                name: 'The manuscript margin',
                text: 'A thin gold rule sits down one side of the panel, the words in the serif.',
            },
        ],
        loading: [
            {
                name: 'The star turns',
                text: 'The star lattice behind the words rotates a few degrees and back, looping, no opacity.',
            },
            {
                name: 'The gold leaf is laid',
                text: 'A gold mark travels along the rim and loops back to the start.',
            },
            {
                name: 'The margin is inked',
                text: 'The gold rule down the side redraws itself top to bottom and starts again.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Illuminated',
                text: 'The panel’s gold rim draws itself around the edge, then the panel fills in.',
            },
            {
                name: 'Inked',
                text: 'The panel grows from the margin rule outward to full width, slowing as it lands.',
            },
        ],
        failure: [
            {
                name: 'The rubric',
                text: 'The failed alert’s rule turns to the destructive colour, in the manuscript’s red-letter style.',
            },
            {
                name: 'The tarnished tile',
                text: 'The star lattice turns to the destructive colour, shape kept.',
            },
            {
                name: 'The red vellum',
                text: 'The gold rim turns to the destructive colour around the alert.',
            },
        ],
        phone: [
            {
                name: 'The flat tile',
                text: 'The panel flattens, the star lattice kept faint behind the words.',
            },
            {
                name: 'The flat vellum',
                text: 'The gold rim narrows to a single rule along the top of the panel.',
            },
            {
                name: 'The flat margin',
                text: 'The side rule moves to the top edge of the flattened panel.',
            },
        ],
    },
    nostromo: {
        shape: [
            {
                name: 'The CRT trace',
                text: 'Scanlines sit over the panel, the words in mono capitals, a phosphor-coloured frame.',
            },
            {
                name: 'The indicator panel',
                text: 'The words sit on embossed label tape, a lit indicator lamp beside the spinner.',
            },
            {
                name: 'The MU-TH-UR screen',
                text: 'A boxed mono readout, the words in capitals, a thin green frame.',
            },
        ],
        loading: [
            {
                name: 'The trace rolls',
                text: 'A phosphor trace rolls down the panel’s face and loops from the top, with its glow.',
            },
            {
                name: 'The lamp blips',
                text: 'The indicator lamp beside the spinner blinks on a hard beat, no fade, looping.',
            },
            {
                name: 'The readout prints',
                text: 'A line of mono characters types across the screen and clears, looping.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Warmed up',
                text: 'The panel strikes on and off once like a CRT warming, then holds, in two hard jumps.',
            },
            {
                name: 'Printed out',
                text: 'The panel scrolls up from the row below it in hard character-row steps.',
            },
        ],
        failure: [
            {
                name: 'The klaxon',
                text: 'The failed alert’s frame turns to the destructive colour, the lamp lit steady.',
            },
            {
                name: 'The red trace',
                text: 'The phosphor trace turns to the destructive colour over the alert.',
            },
            {
                name: 'The MU-TH-UR warning',
                text: 'The boxed readout’s frame turns to the destructive colour, capitals kept.',
            },
        ],
        phone: [
            {
                name: 'The flat trace',
                text: 'The panel flattens, the scanlines kept faint behind the words.',
            },
            {
                name: 'The flat indicator',
                text: 'The label tape narrows to a strip along the top, the lamp kept beside the spinner.',
            },
            {
                name: 'The flat readout',
                text: 'The boxed frame narrows to a single rule along the top of the panel.',
            },
        ],
    },
    titanium: {
        shape: [
            {
                name: 'The milled plate',
                text: 'A brushed-grain panel ringed in an anodised edge, the words in instrument mono.',
            },
            {
                name: 'The instrument dial',
                text: 'A recessed aperture with an inner shadow, a knurled band along the top of the panel.',
            },
            {
                name: 'The inspection window',
                text: 'A rounded window with a canted highlight along its upper edge, a thin frame.',
            },
        ],
        loading: [
            {
                name: 'The needle sweeps',
                text: 'A fine needle mark sweeps across the aperture and resets to its start, looping.',
            },
            {
                name: 'The gauge warms',
                text: 'The anodised edge ring brightens along its length and dims back, looping, by colour-mix not opacity.',
            },
            {
                name: 'The rivets step',
                text: 'Small marks along the knurled band light one after another and loop, hard steps.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The panel is there the moment the table turns busy, full size, no entrance of its own.',
            },
            {
                name: 'Seated',
                text: 'The panel grows from a slightly smaller size to full size with a small overshoot, then settles.',
            },
            {
                name: 'Torqued in',
                text: 'The panel turns a couple of degrees while it grows to full size, then settles level.',
            },
        ],
        failure: [
            {
                name: 'The alarm lamp',
                text: 'The anodised edge ring turns to the destructive colour, the rest of the plate unchanged.',
            },
            {
                name: 'The hazard band',
                text: 'A repeating hazard pattern in the destructive colour runs along the top of the alert.',
            },
            {
                name: 'The fault tag',
                text: 'A small tag shape in the alert’s corner carries the destructive pair.',
            },
        ],
        phone: [
            {
                name: 'The flat plate',
                text: 'The panel flattens, the anodised edge ring kept as a thin line along the top.',
            },
            {
                name: 'The flat dial',
                text: 'The knurled band narrows to a short strip along the top of the panel.',
            },
            {
                name: 'The flat window',
                text: 'The canted highlight softens to a single line along the top of the panel.',
            },
        ],
    },
};

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="busy"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// five choices per theme, each option's name and what it does as its hint.
// What Kenny picked and did not send back is settled and not asked again
// (formal, 2026-10-06 12:04: shape 1, loading 3, failed state 3; he sent
// back the demo's controls, not those three, and could not judge the
// arrival and the phone without a Draw button).
/** @type {Record<string, Partial<Record<Aspect, string>>>} */
const KEPT = { formal: { shape: '1', loading: '3', failure: '3' } };
const keptOf = (/** @type {string} */ t, /** @type {Aspect} */ id) => KEPT[t]?.[id] ?? '';
// Round 2 (Kenny, 2026-10-06 22:30: "wat evalueren we bij shape? ik zie enkel
// dezelfde vorm"): new shape options per theme replace round 1's, which
// differed by 0-4 % of their pixels; each carries its own key.
for (const file of [R2A, R2B, R2C, R2D])
    for (const [t, aspects] of Object.entries(file))
        for (const [id, options] of Object.entries(aspects)) if (options.length >= 3) IDEAS[t][id] = options;
const keyOf = (/** @type {string} */ t, /** @type {Aspect} */ id, /** @type {string} */ n) => IDEAS[t]?.[id]?.[Number(n) - 1]?.key ?? n;
const hints = (/** @type {Aspect} */ aspect, /** @type {number} */ at) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, idea]) => [theme, `${idea[aspect][at].name}. ${idea[aspect][at].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map(({ id, label }) => ({
            id,
            label,
            options: [0, 1, 2].map((at) => ({ value: String(at + 1), label: String(at + 1), hints: hints(id, at) })),
            default: Object.fromEntries(
                Object.keys(KEPT)
                    .filter((t) => keptOf(t, id))
                    .map((t) => [t, keptOf(t, id)]),
            ),
            fixed: Object.fromEntries(
                Object.keys(KEPT)
                    .filter((t) => keptOf(t, id))
                    .map((t) => [t, true]),
            ),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const [theme, idea] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    p.textContent =
        `Five picks, each on its own. Shapes 1, 2 and 3: ${idea.shape[0].name.replace(/^The /, 'the ')}, ${idea.shape[1].name.replace(/^The /, 'the ')}, ${idea.shape[2].name.replace(/^The /, 'the ')}. ` +
        'Each row changes one thing only; the preview at the top shows what you ticked so far. ' +
        'Press Draw to replay the arrival, Ready, Loading and Failed to put every table in that state, Failed for the alert, Long reason for a longer sentence, and try ¼ speed; the overlay keeps the table’s own rows underneath it.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

const COLS = ['Pump house', 'Pressure', 'Read'];
const ROWS = [
    ['Pump house 1', '3.42 bar', '2 min ago'],
    ['Pump house 2', '3.08 bar', '5 min ago'],
    ['Pump house 3', '2.95 bar', '1 min ago'],
];
const TABLE = (/** @type {string} */ caption) => `<div class="kp-datatable" data-bo data-kp-datatable data-kp-busy-overlay>
    <div class="kp-table-wrap">
        <table class="kp-table">
            <caption class="kp-sr-only">${caption}</caption>
            <thead><tr>${COLS.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>
            <tbody>${ROWS.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
    </div>
    <div class="kp-datatable__bar"><p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p></div>
</div>`;

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-bo-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'bo-aspect';
    box.setAttribute('data-bo-aspect', id);
    box.setAttribute('aria-labelledby', `h-bo-${id}`);
    const head = document.createElement('div');
    head.className = 'bo-aspect__head';
    head.innerHTML = '<h3></h3><p></p>';
    head.firstElementChild.id = `h-bo-${id}`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'bo-trio';
    for (const at of [1, 2, 3]) {
        const cell = document.createElement('div');
        cell.className = 'bo-col';
        cell.setAttribute('data-bo-vary', id);
        cell.setAttribute('data-bo-option', String(at));
        cell.innerHTML =
            `<p class="bo-label"><span class="bo-label__no">${label} · ${at}</span> <span data-bo-name></span></p>` +
            `<p class="bo-desc" data-bo-desc></p>`;
        const pane = document.createElement('div');
        if (id === 'phone') pane.className = 'bo-phone-pane';
        pane.innerHTML = TABLE(`Pump houses, ${label} option ${at}`);
        cell.append(pane);
        trio.append(cell);
    }
    box.append(head, trio);
    rows.append(box);
}

/* ------------------------------------------------------- the picks */

/** What is ticked in the dialog, per theme; an aspect not ticked yet shows its option 1. */
/** @type {Record<string, Partial<Record<Aspect, string>>>} */
const ticked = {};
const theme = () => document.documentElement.getAttribute('data-theme') ?? 'formal';
const picks = () =>
    /** @type {Record<Aspect, string>} */ (Object.fromEntries(ASPECTS.map(({ id }) => [id, ticked[theme()]?.[id] ?? (keptOf(theme(), id) || '1')])));

/** Writes the five aspects on the preview and on every row's cell. */
function compose() {
    const now = picks();
    const preview = section.querySelector('[data-bo-preview]');
    for (const { id } of ASPECTS) {
        const key = keyOf(theme(), id, now[id]);
        if (preview?.getAttribute(`data-bo-${id}`) !== key) preview?.setAttribute(`data-bo-${id}`, key);
    }
    for (const cell of section.querySelectorAll('[data-bo-vary]')) {
        const vary = cell.getAttribute('data-bo-vary');
        const option = cell.getAttribute('data-bo-option') ?? '1';
        const table = cell.querySelector('[data-bo]');
        for (const { id } of ASPECTS) {
            const value = keyOf(theme(), id, id === vary ? option : now[id]);
            if (table?.getAttribute(`data-bo-${id}`) !== value) table?.setAttribute(`data-bo-${id}`, value);
        }
        cell.classList.toggle('bo-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-bo-picks]');
    const idea = IDEAS[theme()];
    if (words && idea) words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1].name}`).join(' · ');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* ------------------------------------------------------- driving the tables */

const SINCE_MS = 42_000;
const WORDS = {
    short: 'Reading the pump houses…',
    long: 'Reading the pump houses from the field units on the northern network, retrying the slow ones…',
};
const REASON = {
    short: 'The status service answered 503. The rows below are from the last good read; nothing was changed.',
    long: 'The status service at the northern network office answered 503 at 02:14, after three retries over the field link; the rows below are from 02:10, and nothing on this page was changed.',
};

/** The current demo-wide controls: what every table (the preview, the reference, every row's cells) is driven to. */
const words = { length: /** @type {'short' | 'long'} */ ('short') };

/** @param {Element} el @param {'ready' | 'loading' | 'failed'} shown */
function drive(el, shown) {
    const handle = dataTable(el);
    if (!handle) return;
    if (shown === 'loading') {
        handle.state('ready');
        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                handle.busy({ text: WORDS[words.length], since: Date.now() - SINCE_MS, overlay: true });
                handle.state('loading');
            }),
        );
    } else if (shown === 'failed') {
        handle.fail(REASON[words.length]);
    } else {
        handle.state('ready');
    }
}

const allTables = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-kp-datatable]')]);
const previewTable = () => /** @type {HTMLElement} */ (section.querySelector('[data-bo-preview]'));
const referenceTable = () => /** @type {HTMLElement} */ (section.querySelector('.bo-reference [data-kp-datatable]'));
const rowCell = (/** @type {Aspect} */ aspect) => [...section.querySelectorAll(`[data-bo-vary='${aspect}'] [data-kp-datatable]`)];

attachDataTables(section);

// The reference overlay stands for comparison, always busy, the package's own words.
drive(referenceTable(), 'loading');
// Shape, loading and arrival are judged while the panel shows; the phone row
// the same, in its narrow pane; failure is judged with the alert up.
for (const aspect of ['shape', 'loading', 'arrival', 'phone']) for (const el of rowCell(/** @type {Aspect} */ (aspect))) drive(el, 'loading');
for (const el of rowCell('failure')) drive(el, 'failed');

const log = section.querySelector('[data-bo-log]');
section.addEventListener('kp-datatable-retry', (event) => {
    const el = /** @type {HTMLElement} */ (event.target);
    drive(el, 'loading');
    if (log) log.textContent = 'Tried again: the panel loads once more.';
});

/** The preview's own state, driven by the State buttons. */
let previewState = /** @type {'ready' | 'loading' | 'failed'} */ ('loading');
const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

// The State buttons drive every table on the page, the rows and the phone
// pane included (Kenny, 2026-10-06: "bij on the phone zie ik enkel loading
// dat vastzit? ... verander dit voor de hele demo"); the reference stays busy.
const driveAll = () => {
    drive(previewTable(), previewState);
    for (const { id } of ASPECTS) for (const el of rowCell(id)) drive(el, previewState);
};
for (const b of section.querySelectorAll('[data-bo-state]'))
    b.addEventListener('click', () => {
        previewState = /** @type {typeof previewState} */ (b.getAttribute('data-bo-state') ?? 'ready');
        pressed('data-bo-state', previewState);
        driveAll();
    });

// Draw replays the panel's arrival everywhere: every table turns busy anew
// (Kenny, 2026-10-06: "geef een draw knop om te zien hoe het element arrives").
// It never changes the state the reviewer set (Kenny, 2026-10-06 21:53: "te
// pas en te onpas staat die weer op loading als ik het niet wil … state moet
// onthouden worden"): the panel arrives, and when the state is not Loading
// the tables go back to it once the arrival has played.
let drawBack = 0;
section.querySelector('[data-bo-draw]')?.addEventListener('click', () => {
    clearTimeout(drawBack);
    drive(previewTable(), 'loading');
    for (const { id } of ASPECTS) for (const el of rowCell(id)) drive(el, 'loading');
    drive(referenceTable(), 'loading');
    if (previewState !== 'loading') drawBack = window.setTimeout(driveAll, 1600);
});

for (const b of section.querySelectorAll('[data-bo-words]'))
    b.addEventListener('click', () => {
        words.length = /** @type {typeof words.length} */ (b.getAttribute('data-bo-words') ?? 'short');
        pressed('data-bo-words', words.length);
        driveAll();
    });

compose();
drive(previewTable(), previewState);

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-bo-theme-name]')) el.textContent = LABEL[now] ?? now;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    // A settled aspect has no row.
    for (const box of section.querySelectorAll('[data-bo-aspect]'))
        /** @type {HTMLElement} */ (box).hidden = Boolean(keptOf(now, /** @type {Aspect} */ (box.getAttribute('data-bo-aspect'))));
    for (const cell of section.querySelectorAll('[data-bo-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (cell.getAttribute('data-bo-vary'))]?.[Number(cell.getAttribute('data-bo-option')) - 1];
        const name = cell.querySelector('[data-bo-name]');
        const desc = cell.querySelector('[data-bo-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-bo-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-meter and research/character-trend; full speed by
// default, since a loop is judged at its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('bo-speed'));
    if (kept > 0) rate = kept;
} catch {
    // No storage: full speed.
}
const slowNow = () => {
    for (const a of document.getAnimations()) if (a.playbackRate !== rate) a.playbackRate = rate;
};
const slowEachFrame = () => {
    slowNow();
    requestAnimationFrame(slowEachFrame);
};
document.addEventListener('animationstart', slowNow, { capture: true });
requestAnimationFrame(slowEachFrame);
const speedButtons = [...document.querySelectorAll('[data-bo-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-bo-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-bo-speed'));
        try {
            localStorage.setItem('bo-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
