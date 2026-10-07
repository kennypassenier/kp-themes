// research/character-trend: the fifth component of the character round
// (Kenny, form v18, 2026-10-05): the key figure with its 24-hour trend
// (`.kp-kpi--trend`), all 22 themes in one demo judged through the review
// kit. Round 2 (Kenny, 2026-10-05 20:03: every demo gets separate options per
// aspect, as the meter, "and it should be like this in the future"): nothing
// is bundled any more. Each theme's tile has five aspects, each picked on its
// own from three options: the shape, the loading picture, how the figure and
// the line arrive, the tone and the change, and the live update.
//
// The tiles are the package's own: attachTrendCharts() (js/chart.js) draws
// the trend, its crosshair, its chip and its axis, and keeps every behaviour
// (the pointer, the keys, a click that follows the tile's link, the live
// update). Every aspect is CSS only, in trends.css, keyed by one attribute
// each on the tile's strip (`data-ct-shape`, `data-ct-loading`,
// `data-ct-arrival`, `data-ct-tone`, `data-ct-live`), so any combination
// composes. On the page: one composed preview showing the current picks, and
// per aspect a row of three tiles that differ in that aspect only; the plain
// tile of today stands below them for reference. The controls sit in the
// section's `data-review-controls` container, which the review kit mirrors
// into its dialog. js/chart.js and js/kpi.js are not changed.

import { attachTrendCharts, setTrendData } from '../../js/chart.js';
import { THEMES } from '../../js/theme-registry.js';
import R3A from './round3-a.js';
import R3B from './round3-b.js';

/** @typedef {{ name: string, text: string, key?: string }} Option */
/** @typedef {'shape' | 'loading' | 'arrival' | 'tone' | 'live'} Aspect */

/** The five aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: 'The plate, the frame, the label, the number, the plot, the line and its wash, the axis. Compare them as they stand, then move the pointer over a trend.',
    },
    { id: 'loading', label: 'While loading', about: 'The picture on the plot while the tile loads; it always moves. Press Loading.' },
    {
        id: 'arrival',
        label: 'How the figure and the line arrive',
        about: 'How the number and the line come in after loading. Press Drawn to replay it.',
    },
    {
        id: 'tone',
        label: 'The tone and the change',
        about: 'How the change in the hour reads, and how a warning or destructive figure shows. Press Warning, then Destructive, then None.',
    },
    { id: 'live', label: 'Live update', about: 'What a new reading does to the line. Press Live update (ten minutes later).' },
];

/**
 * Per theme, three options for each aspect. Options 1 and 2 are round 1's
 * two characters split into their parts (where both had the same, option 2
 * is new); option 3 is new.
 * @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            {
                name: 'The engraved plate',
                text: 'A brass-plate engraving on paper: a ruled double frame, the label in the serif’s small capitals, the number in the display serif, the line engraved as a fine rule with no wash under it, the change boxed like an engraved figure.',
            },
            {
                name: 'The annual report',
                text: 'A key figure from a printed annual report: a heavy rule above the label, the number large in the display serif, the line over ledger rules with a ruled baseline, the axis in small capitals, the change in italics on its own plate.',
            },
            {
                name: 'The certificate',
                text: 'A share certificate: a thin navy rule inside the frame, a guilloche of fine rings rising behind the figure, the number in the display serif, the line in navy ink with almost no wash, the axis in small capitals.',
            },
        ],
        loading: [
            {
                name: 'The dotted leader',
                text: 'A dotted leader along the foot of the plot is written on, dot by dot.',
            },
            {
                name: 'The ledger is ruled',
                text: 'The ledger’s four rules are drawn across the plot, left to right, and ruled again.',
            },
            {
                name: 'The seal is pressed',
                text: 'A navy seal ring is pressed onto the plot, lifted and pressed again.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Engraved',
                text: 'The line is drawn in from the left, slowing as it lands; the number is written in from the left.',
            },
            {
                name: 'Entered in the ledger',
                text: 'The line is drawn in from the left, in 10 hard steps; the number is typed in.',
            },
        ],
        tone: [
            {
                name: 'The engraved plate',
                text: 'The change boxed like an engraved figure; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The annual report',
                text: 'The change in italics on its own plate; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The red-ink entry',
                text: 'The change on a plate inside a hairline rule, square; a warning or destructive figure is ruled off in its colour along the left edge, the accountant’s red ink.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'The entry is carried forward',
                text: 'The line steps one reading to the left, as chart paper advances, slowing as it lands.',
            },
            {
                name: 'Signed again',
                text: 'The line is traced again from its start, easing in and out.',
            },
        ],
    },
    light: {
        shape: [
            {
                name: 'The soft card',
                text: 'A white card lifted on a soft shadow, a wider radius, the line soft and round-capped over a fuller wash, the change as a soft pill.',
            },
            {
                name: 'Daylight',
                text: 'A pale sky over the line, from the primary wash at the top to the card at the foot, the sun as a warm glow in the corner, the change as a pill.',
            },
            {
                name: 'The paper sheet',
                text: 'A sheet of paper on the page: a small radius, a lifted corner folded over at the top right, faint writing rules in the plot, the line in indigo ink.',
            },
        ],
        loading: [
            {
                name: 'The dashed baseline',
                text: 'The dashed baseline under the plot drifts to the right.',
            },
            {
                name: 'Daylight',
                text: 'A slow band of daylight crosses the sky.',
            },
            {
                name: 'A cloud passes',
                text: 'The soft shadow of a cloud drifts across the plot, slowly.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Unfolds',
                text: 'The line opens from its middle, slowing as it lands; the number rises into its line.',
            },
            {
                name: 'Sunrise',
                text: 'The line rises from the baseline, slowing as it lands; the number drops into its line.',
            },
        ],
        tone: [
            {
                name: 'The soft card',
                text: 'The change as a soft pill; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The soft outline',
                text: 'The change as a pill drawn in a soft outline of its own ink over its plate.',
            },
            {
                name: 'The coloured tab',
                text: 'The change as a pill with a soft drop shadow; a warning or destructive figure shows a band of its colour along the top of the card.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'A soft swell',
                text: 'The line swells once and settles, slowing as it lands.',
            },
            {
                name: 'The page turns',
                text: 'The line steps one reading to the left, as chart paper advances, slowing as it lands.',
            },
        ],
    },
    dark: {
        shape: [
            {
                name: 'The status board',
                text: 'A black operations board: the number lit in ticker mono, the plot a dark well with a fine grid, the line lit with a soft glow, the change as a lit square chip.',
            },
            {
                name: 'The machined panel',
                text: 'A machined black panel with a fine bevel: the label in mono capitals, the line in a recessed slot (an inner shadow above, a lit lip below), the change as a flat machined tab.',
            },
            {
                name: 'The oscilloscope',
                text: 'A scope screen in a black panel: the plot a dark well with a dotted graticule and a lit rim, the line a green trace with a soft glow, the number in mono.',
            },
        ],
        loading: [
            {
                name: 'The ticker baseline',
                text: 'The dashed baseline ticks along like a ticker tape.',
            },
            {
                name: 'The slot is scanned',
                text: 'A lit band sweeps along the plot, as a scanner reads a slot.',
            },
            {
                name: 'The status lamps',
                text: 'A lamp steps between three places on the panel, one after the other.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Switched on',
                text: 'The line strikes on and off like a tube, then holds, in hard jumps; the number is there at once.',
            },
            {
                name: 'Machined in',
                text: 'The line is drawn in from the left, in 8 hard steps; the number is written in from the left.',
            },
        ],
        tone: [
            {
                name: 'The status board',
                text: 'The change as a lit square chip; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The machined tab',
                text: 'The change as a flat tab with a square corner and a lit top edge.',
            },
            {
                name: 'The alarm lamp',
                text: 'The change as a lit square chip; a warning or destructive figure lights its number on the tone’s plate, as an alarm lamp.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'The trace jumps',
                text: 'The line jolts once, as a needle does, in 2 hard steps.',
            },
            {
                name: 'The trace flares',
                text: 'The line flares with light once, slowing as it lands.',
            },
        ],
    },
    cyberpunk: {
        shape: [
            {
                name: 'The holo plate',
                text: 'A holo plate: a yellow rim glowing inward, scan lines at 135 degrees, the 14 px notch cut at its dossier corner; the number in the display face, the line a plain data stream with no glow at rest, the change as a cut-corner chip.',
            },
            {
                name: 'The glitch HUD',
                text: 'A netrunner HUD: yellow brackets at the corners of the plot, the number with an RGB split, the line a square-capped data stream, hazard tape along the top edge.',
            },
            {
                name: 'The holo card',
                text: 'A hologram card: a cyan rim with its glow, diagonal scan lines in the plot, the number in the display face, the line a cyan beam.',
            },
        ],
        loading: [
            {
                name: 'Signal loss',
                text: 'The tile’s waiting lines decipher the word LOADING from noise glyphs, hold it in neon with a cyan and a red copy, tear it sideways and slice it away: 1800 ms in hard ticks.',
            },
            {
                name: 'The glitch HUD',
                text: 'A glitch bar jumps across the plot.',
            },
            {
                name: 'Packet rain',
                text: 'Packets rain down the plot in columns.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Jacked in',
                text: 'The line jumps into place sideways, in hard jumps; the number glitches into place.',
            },
            {
                name: 'The channel split',
                text: 'The tile is a yellow copy and a cyan copy until they meet: four ticks of 120 ms, 6, 4, 2, 1 px, the notch cut at every tick.',
            },
        ],
        tone: [
            {
                name: 'The neon trace',
                text: 'The change as a cut-corner chip; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The glitch HUD',
                text: 'The change on its status plate; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The target lock',
                text: 'The change as a square mono chip with a 4 px cut; a warning or destructive figure is locked as a target: four corner brackets in its colour twitch twice as they lock and hold.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'Packet in',
                text: 'The line glitches sideways for a moment, in hard jumps.',
            },
            {
                name: 'The line stutters home',
                text: 'The line comes home from a yellow copy and a cyan copy of its own shape, 6, 4, 2, 1 px, four ticks of 120 ms.',
            },
        ],
    },
    synthwave: {
        shape: [
            {
                name: 'The grid-floor horizon',
                text: 'The plot is a perspective grid floor under a pink horizon, the line a sunset laser with its glow, the number in VT323, the change on a glass chip.',
            },
            {
                name: 'The VCR display',
                text: 'A VCR’s on-screen display on black: OSD numerals, scanlines over the tile, the line a hard square trace, the change as an inverse block.',
            },
            {
                name: 'The arcade marquee',
                text: 'An arcade cabinet’s marquee: a pink frame with a glow, the number in the display face with a pink drop, the line a cyan laser over a pink wash.',
            },
        ],
        loading: [
            {
                name: 'The grid-floor horizon',
                text: 'The grid floor drives toward you.',
            },
            {
                name: 'The VCR display',
                text: 'The tracking band rolls down the plot.',
            },
            {
                name: 'The sun rises',
                text: 'A striped sun swells up over the horizon at the foot of the plot and sinks again.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Over the horizon',
                text: 'The line rises from the baseline, slowing as it lands; the number rises into its line.',
            },
            {
                name: 'Tape loads',
                text: 'The line is drawn in from the left, in 12 hard steps; the number is typed in.',
            },
        ],
        tone: [
            {
                name: 'The grid-floor horizon',
                text: 'The change on a glass chip; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The VCR display',
                text: 'The change as an inverse block; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The arcade warning',
                text: 'The change on a glass chip with a glow; a warning or destructive figure flashes its plate under the number, as an arcade score.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'The tracking jumps',
                text: 'The line jolts once, as a needle does, in 2 hard steps.',
            },
            {
                name: 'The laser flares',
                text: 'The line flares with light once, slowing as it lands.',
            },
        ],
    },
    pastel: {
        shape: [
            {
                name: 'The sticker chart',
                text: 'A candy card with a flat sticker shadow: the line fat and round-capped like icing, the change as a sticker with its own flat shadow, the number in the rounded face.',
            },
            {
                name: 'The washi planner',
                text: 'A dotted planner pad with a strip of washi tape across the top of the tile, the line a dashed doodle, the change as a taped label.',
            },
            {
                name: 'The cloud card',
                text: 'A soft cloud: a wide round card with a dashed candy outline, a blob of colour behind the line, the line fat and round.',
            },
        ],
        loading: [
            {
                name: 'The sticker chart',
                text: 'A candy dot hops along the plot.',
            },
            {
                name: 'The washi planner',
                text: 'The tape drifts.',
            },
            {
                name: 'Sprinkles',
                text: 'Sprinkles in two colours hop along the plot.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Popped',
                text: 'The line rises from the baseline, overshooting once; the number is stamped down.',
            },
            {
                name: 'Doodled in',
                text: 'The line is drawn in from the left, easing in and out; the number is written in from the left.',
            },
        ],
        tone: [
            {
                name: 'The sticker chart',
                text: 'The change as a sticker with its own flat shadow, the number in the rounded face; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The washi planner',
                text: 'The change as a taped label; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The heart sticker',
                text: 'The change as a round sticker turned a little; a warning or destructive figure gets a candy band of its colour along the top.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'A happy hop',
                text: 'The line jolts once, as a needle does, overshooting once.',
            },
            {
                name: 'Squished',
                text: 'The line swells once and settles, slowing as it lands.',
            },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'The top(1) row',
                text: 'A text screen framed in a double box-drawing line: everything in the mono, the label in capitals, the line square-joined in the phosphor, the change in reverse video.',
            },
            {
                name: 'The dumb-terminal plot',
                text: 'gnuplot’s dumb terminal: the plot a grid of character cells, the line drawn in dots like a row of asterisks, the axis in brackets of rules, the change underlined.',
            },
            {
                name: 'The curses window',
                text: 'A curses window: a single-line box, the label ruled off under it, the plot boxed in a fainter rule, the line square in the phosphor, no wash.',
            },
        ],
        loading: [
            {
                name: 'The top(1) row',
                text: 'A block caret blinks in the plot, once a second.',
            },
            {
                name: 'The dumb-terminal plot',
                text: 'The dots march.',
            },
            {
                name: 'The hash bar',
                text: 'A row of # blocks fills the plot block by block, then starts over.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Printed',
                text: 'The line is drawn in from the left, in 16 hard steps; the number is typed in.',
            },
            {
                name: 'Paged in',
                text: 'The line drops into place from above, in 3 hard steps; the number drops into its line.',
            },
        ],
        tone: [
            {
                name: 'The top(1) row',
                text: 'The change in reverse video; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The dumb-terminal plot',
                text: 'The change underlined; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The bell',
                text: 'The change in a dashed box, as a curses field; a warning or destructive figure prints its number in reverse on the tone, as a terminal bell line.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'Scrolled',
                text: 'The line steps one reading to the left, as chart paper advances, in 2 hard steps.',
            },
            {
                name: 'Reverse flash',
                text: 'The line flashes in the ink for a moment, in hard jumps.',
            },
        ],
    },
    forest: {
        shape: [
            {
                name: 'The ranger’s logbook',
                text: 'A ranger’s logbook on kraft paper: the label in serif italic, contour rings behind the line, the line a moss trail with round caps, the change on a wooden tag.',
            },
            {
                name: 'The canopy',
                text: 'Looking up into a canopy: a leaf-green wash on the card, the area under the line a dense canopy, the line a twig in bark ink, the change on a leaf tag.',
            },
            {
                name: 'The herbarium sheet',
                text: 'A pressed leaf on a herbarium sheet: leaf veins in the plot, the label in serif italic, the line in moss green over a leaf-green wash.',
            },
        ],
        loading: [
            {
                name: 'The ranger’s logbook',
                text: 'A trail of light walks the plot.',
            },
            {
                name: 'The canopy',
                text: 'The canopy sways.',
            },
            {
                name: 'The row is planted',
                text: 'While it loads, the skeleton lines and the plot’s foot are the bar’s planted row: seedlings, then whole trees filling it start to end.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Grows',
                text: 'The line rises from the baseline, slowing as it lands; the number rises into its line.',
            },
            {
                name: 'The trail is walked',
                text: 'The line is drawn in from the left on forest’s growth curve, 1000 ms; the number is written in from the left.',
            },
        ],
        tone: [
            {
                name: 'The ranger’s logbook',
                text: 'The change on a wooden tag; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The canopy',
                text: 'The change on a leaf tag; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The trail blaze',
                text: 'The change on a carved tag; a warning or destructive figure is blazed in its colour along the left edge, as a trail marker on a trunk.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'A branch sways',
                text: 'The line dips once and comes back, slowing as it lands.',
            },
            {
                name: 'Growth ring',
                text: 'The line swells once and settles, easing in and out.',
            },
        ],
    },
    'high-contrast': {
        shape: [
            {
                name: 'Ink and frame',
                text: 'Everything framed in a 2px rule: the number bold, the line 3px with no wash, a solid baseline under it, the change as a framed plate with its own ink. Still: nothing moves.',
            },
            {
                name: 'The inverse plate',
                text: 'The plot inverted: an ink plate with the line drawn in the paper colour, the label bold, the number heavy, the change framed. Still: nothing moves.',
            },
            {
                name: 'The signal board',
                text: 'A road signal: a heavy 3px frame, the plot boxed in ink, the number very large and heavy, the line 4px square-capped, no wash.',
            },
        ],
        loading: [
            {
                name: 'The dashed baseline',
                text: 'The dashed baseline steps along in hard steps.',
            },
            {
                name: 'The striped block',
                text: 'A striped block in ink and paper steps across the foot of the plot; it shows on paper and on ink.',
            },
            {
                name: 'The scanning bar',
                text: 'A thick bar in ink and paper scans down the plot in hard steps.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Switched',
                text: 'The line is drawn in from the left, in 4 hard steps; the number is there at once.',
            },
            {
                name: 'Dropped',
                text: 'The line drops into place from above, in 2 hard steps; the number drops into its line.',
            },
        ],
        tone: [
            {
                name: 'Ink and frame',
                text: 'The change as a framed plate with its own ink; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The heavy frame',
                text: 'The change in a 3px frame with square corners.',
            },
            {
                name: 'The signal plate',
                text: 'The change framed in ink with a hard shadow; a warning or destructive figure puts its number on the tone’s own plate and frames the card in the tone.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'The bar jumps',
                text: 'The line jolts once, as a needle does, in 2 hard steps.',
            },
            {
                name: 'The bar flips',
                text: 'The line flashes in the ink for a moment, in hard jumps.',
            },
        ],
    },
    sepia: {
        shape: [
            {
                name: 'The barograph',
                text: 'A barograph drum: the plot is ruled chart paper (fine level lines and hour lines in sepia), the line a fine nib trace, an aged vignette on the paper.',
            },
            {
                name: 'Letterpress',
                text: 'A letterpress card on speckled paper: the number pressed into the sheet, the label in small capitals, the line a heavier ink rule, the change as a printed border.',
            },
            {
                name: 'The ticket stub',
                text: 'A printed ticket stub: notches punched in both sides, a dashed tear line as the frame, the number in the display serif, the line in brown ink.',
            },
        ],
        loading: [
            {
                name: 'The barograph',
                text: 'The nib sweeps across the drum.',
            },
            {
                name: 'The ink spreads',
                text: 'A blot of ink swells and draws back on the paper.',
            },
            {
                name: 'The drum turns',
                text: 'The barograph drum turns: the hour lines move left under a still nib.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'The nib writes',
                text: 'The line is drawn in from the left, at an even pace; the number is written in from the left.',
            },
            {
                name: 'Pressed',
                text: 'The line drops into place from above, slowing as it lands; the number is pressed into the sheet.',
            },
        ],
        tone: [
            {
                name: 'The barograph',
                text: 'The change on its status plate; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'Letterpress',
                text: 'The change as a printed border; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The rubber stamp',
                text: 'The change in a printed border; a warning or destructive note is stamped on the label askew, in the tone’s plate with a ruled border.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'The nib moves on',
                text: 'The line steps one reading to the left, as chart paper advances, at an even pace.',
            },
            {
                name: 'Inked again',
                text: 'The line is traced again from its start, easing in and out.',
            },
        ],
    },
    blueprint: {
        shape: [
            {
                name: 'The chart recorder',
                text: 'A strip-chart recorder on blueprint paper: a millimetre grid in the plot, the line in white ink, the label and the axis in technical mono capitals.',
            },
            {
                name: 'The title block',
                text: 'A drawing’s title block: the tile parted into cells by drawn rules, the axis with dimension ticks, the line as a chain line over a hatched area.',
            },
            {
                name: 'The section view',
                text: 'A section drawing: the plot hatched at forty-five degrees, a dashed frame, the line in white ink 2px, the label and axis in technical mono capitals.',
            },
        ],
        loading: [
            {
                name: 'The chart recorder',
                text: 'The recorder’s pen sweeps.',
            },
            {
                name: 'The title block',
                text: 'A dash marches along the baseline.',
            },
            {
                name: 'The dimension line',
                text: 'A dimension line with its ticks is drawn across the plot, again and again.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Drafted',
                text: 'The line is drawn in from the left, at an even pace; the number is written in from the left.',
            },
            {
                name: 'Plotted',
                text: 'The line is drawn in from the left, in 24 hard steps; the number is typed in.',
            },
        ],
        tone: [
            {
                name: 'The chart recorder',
                text: 'The change on its status plate; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The title block',
                text: 'The change on its status plate; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The revision cloud',
                text: 'The change in a ruled box; a warning or destructive figure is framed all round in its colour, as a revision marked on a drawing.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'The pen steps',
                text: 'The line steps one reading to the left, as chart paper advances, in 3 hard steps.',
            },
            {
                name: 'Retraced in ink',
                text: 'The line is traced again from its start, at an even pace.',
            },
        ],
    },
    solstice: {
        shape: [
            {
                name: 'The low sun',
                text: 'Charcoal paper lit from below by a low sun: a warm glow rising from the foot of the tile, the line in warm light, the change on a glowing chip.',
            },
            {
                name: 'The embers',
                text: 'Embers on charcoal: the line a glowing coal with a hot halo, the wash a faint heat, the number in the serif.',
            },
            {
                name: 'The horizon',
                text: 'The day’s horizon: a warm band of light across the foot of the card, the number in the display face, the line in the low sun’s colour with a glow.',
            },
        ],
        loading: [
            {
                name: 'The low sun',
                text: 'A glow rises from the foot of the plot, swelling and settling.',
            },
            {
                name: 'The embers',
                text: 'A heat glows from below, swelling and settling.',
            },
            {
                name: 'The sun crosses',
                text: 'A low sun crosses the plot from left to right.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Dawn',
                text: 'The line rises from the baseline, slowing as it lands; the number rises into its line.',
            },
            {
                name: 'Kindled',
                text: 'The line is drawn in backwards, from now, easing in and out; the number is written in from the left.',
            },
        ],
        tone: [
            {
                name: 'The low sun',
                text: 'The change on a glowing chip; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The embers',
                text: 'The change on its status plate; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The red sky',
                text: 'The change on a glowing chip; a warning or destructive figure turns the band of sky above the card into the tone.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'A flare of sun',
                text: 'The line flares with light once, slowing as it lands.',
            },
            {
                name: 'The day moves on',
                text: 'The line steps one reading to the left, as chart paper advances, easing in and out.',
            },
        ],
    },
    brutalism: {
        shape: [
            {
                name: 'The slab',
                text: 'A concrete slab: a heavy black frame with a hard offset shadow, the label in heavy capitals, the line 3px square-capped, the change as a block with the hard shadow.',
            },
            {
                name: 'The sticker sheet',
                text: 'A lavender sticker sheet: the number huge and heavy, the change as an askew sticker in a black outline, the plot a white well in black.',
            },
            {
                name: 'The poster block',
                text: 'A poster block: a 3px frame with a hard offset shadow in the accent, the plot hatched in ink, the number huge and in capitals, the line 4px.',
            },
        ],
        loading: [
            {
                name: 'The stamp',
                text: 'A black block is stamped onto the plot, lifted and stamped again.',
            },
            {
                name: 'The drop',
                text: 'A black block drops onto the plot and lands hard, again and again.',
            },
            {
                name: 'The hammer',
                text: 'A black block hammers on three places along the plot in turn.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Slammed',
                text: 'The line drops into place from above, in 2 hard steps; the number is stamped down.',
            },
            {
                name: 'Shoved in',
                text: 'The line is drawn in from the left, easing in and out; the number slides in slanted.',
            },
        ],
        tone: [
            {
                name: 'The slab',
                text: 'The change as a block with the hard shadow; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The sticker sheet',
                text: 'The change as an askew sticker in a black outline, the plot a white well in black; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The warning poster',
                text: 'The change as a block with a hard shadow; a warning or destructive figure prints its number on the tone’s block, framed in ink.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'Kicked',
                text: 'The line jolts once, as a needle does, in 2 hard steps.',
            },
            {
                name: 'Shoved',
                text: 'The line steps one reading to the left, as chart paper advances, in 2 hard steps.',
            },
        ],
    },
    deco: {
        shape: [
            {
                name: 'The gilt frame',
                text: 'A gilt frame on lacquer: a double gold rule, a faint sunburst rising behind the number, the label and the number in the display face’s capitals, the change on a gold-framed plaque.',
            },
            {
                name: 'The marquee',
                text: 'A theatre marquee: a row of bulbs along the top and the foot of the plot, the number in display capitals, the change as a marquee plaque.',
            },
            {
                name: 'The skyscraper',
                text: 'An Art Deco tower: fine gold setback lines rising behind the figure, a gold bar along the top, the label and number in the display capitals, the line in gold.',
            },
        ],
        loading: [
            {
                name: 'The gilt frame',
                text: 'A glint runs across.',
            },
            {
                name: 'The marquee',
                text: 'The bulbs chase.',
            },
            {
                name: 'The sunburst opens',
                text: 'A gold sunburst opens from the foot of the plot, ray by ray.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'The curtain rises',
                text: 'The line rises from the baseline, slowing as it lands; the number rises into its line.',
            },
            {
                name: 'The marquee lights',
                text: 'The line opens from its middle, in 9 hard steps; the number is written in from the left.',
            },
        ],
        tone: [
            {
                name: 'The gilt frame',
                text: 'The change on a gold-framed plaque; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The marquee',
                text: 'The change as a marquee plaque; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The gilt notice',
                text: 'The change on a plaque ringed twice in gold with a gap between; a warning or destructive figure is framed all round in its colour, as a notice in a gilt frame.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'The bulbs chase',
                text: 'The line flashes in the ink for a moment, in hard jumps.',
            },
            {
                name: 'Gilded',
                text: 'The line flares with light once, slowing as it lands.',
            },
        ],
    },
    phantom: {
        shape: [
            {
                name: 'The evidence card',
                text: 'A white evidence card pinned to the board: the label slanted, the line as red string, the change as a stamped ring set askew.',
            },
            {
                name: 'The calling card',
                text: 'A black calling card under a halftone: the label skewed in display capitals, a red slash across the corner, the line in the card’s ink.',
            },
            {
                name: 'The ransom note',
                text: 'A ransom note: a halftone over the card, the label skewed, the number with a red offset shadow, the line in red, square and heavy.',
            },
        ],
        loading: [
            {
                name: 'The stamp ring',
                text: 'A red ring is stamped onto the plot, again and again.',
            },
            {
                name: 'Stamped askew',
                text: 'The halftone shuffles.',
            },
            {
                name: 'The string is pulled',
                text: 'A red string is pulled across the plot in jerks.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'The card is thrown',
                text: 'The line jumps into place sideways, in hard jumps; the number slides in slanted.',
            },
            {
                name: 'Slashed in',
                text: 'The line is drawn in backwards, from now, easing in and out; the number slides in slanted.',
            },
        ],
        tone: [
            {
                name: 'The evidence card',
                text: 'The change as a stamped ring set askew; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The calling card',
                text: 'The change on its status plate; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The calling card',
                text: 'The change as a skewed card; a warning or destructive note is stamped askew on the label, in the tone’s plate with a ruled border.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'Snatched',
                text: 'The line glitches sideways for a moment, in hard jumps.',
            },
            {
                name: 'The string twangs',
                text: 'The line jolts once, as a needle does, in 3 hard steps.',
            },
        ],
    },
    retro: {
        shape: [
            {
                name: 'The 1995 dialog',
                text: 'A 1995 dialog: a raised grey bevel around the tile, the plot a sunken white well, one-pixel line with no wash, the label in the system face without capitals, the change as a raised button.',
            },
            {
                name: 'The performance monitor',
                text: 'A 1995 performance monitor: a black well with a green grid, the line in the phosphor, the number in the mono.',
            },
            {
                name: 'The Notepad window',
                text: 'A plain 1995 window: a 1px black frame with a hard drop shadow, the plot a white well with a black border, one-pixel line, no wash, the label in the system face.',
            },
        ],
        loading: [
            {
                name: 'The progress blocks',
                text: 'Blue progress blocks fill the foot of the well block by block, then start over.',
            },
            {
                name: 'The marquee bar',
                text: 'A group of three blue blocks slides across the well and comes round again.',
            },
            {
                name: 'The defragmenter',
                text: 'Blocks of colour shift through the well in hard steps, as a defragmenter’s map.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Painted',
                text: 'The line is drawn in from the left, in 6 hard steps; the number is there at once.',
            },
            {
                name: 'Dragged in',
                text: 'The line drops into place from above, in 2 hard steps; the number drops into its line.',
            },
        ],
        tone: [
            {
                name: 'The 1995 dialog',
                text: 'The change as a raised button; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The flat field',
                text: 'The change as a flat square field with a 1px rule, no bevel.',
            },
            {
                name: 'The message box',
                text: 'The change as a sunken field; a warning or destructive figure is shown framed in its colour, as a message box asks for attention.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'Repainted',
                text: 'The line flashes in the ink for a moment, in hard jumps.',
            },
            {
                name: 'Scrolled one',
                text: 'The line steps one reading to the left, as chart paper advances, in hard jumps.',
            },
        ],
    },
    grotesk: {
        shape: [
            {
                name: 'The transit board',
                text: 'A Swiss transit board: a column under a heavy ink rule, the number in bold grotesque, the line 3px round-capped, the change as a flat colour bar.',
            },
            {
                name: 'The Swiss poster',
                text: 'A Swiss poster: the number huge and flush left, the line a hairline, the change in the red index colour on its own plate.',
            },
            {
                name: 'The index card',
                text: 'A Swiss index card: a red rule down the left margin, a hairline along the top, the number large and tight, the line 2px over no wash.',
            },
        ],
        loading: [
            {
                name: 'Out of register',
                text: 'The tile’s lines and the plot are printed in two plates: the ink, and a red copy that closes in clockwise, falls into register, dwells and opens out again, 2640 ms.',
            },
            {
                name: 'The Swiss poster',
                text: 'Three blocks cut in.',
            },
            {
                name: 'The flap board',
                text: 'Three bars flip over one after the other, as a departure board’s flaps.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Printed',
                text: 'The line and the number are printed in black and their red plate falls into register on them along the closing spiral, clockwise, in 8 units.',
            },
            {
                name: 'The board flips',
                text: 'The line rises from the baseline, in 3 hard steps; the number rises into its line.',
            },
        ],
        tone: [
            {
                name: 'The transit board',
                text: 'The change as a flat colour bar; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The underlined figure',
                text: 'The change on a flat plate with a heavy rule under it, square.',
            },
            {
                name: 'The index colour',
                text: 'The change on a flat plate; a warning or destructive figure carries a 6 px bar of its tone down the start edge and the tone’s word before the number, the number ink on paper.',
            },
        ],
        live: [
            {
                name: 'Re-registered',
                text: 'A new reading redraws the line at once and its red plate falls back into register on it, clockwise, in 8 units.',
            },
            {
                name: 'Flipped',
                text: 'The line jolts once, as a needle does, in 2 hard steps.',
            },
            {
                name: 'Shifted',
                text: 'The line steps one reading to the left, as chart paper advances, easing in and out.',
            },
        ],
    },
    nostromo: {
        shape: [
            {
                name: 'The CRT trace',
                text: 'A green-black CRT in the beige bezel: scanlines over the plot, the line a phosphor trace with its glow, the label and the number in mono capitals.',
            },
            {
                name: 'The indicator panel',
                text: 'The ship’s indicator panel: the label on embossed label tape, the change as a lit indicator lamp, the plot an embossed window.',
            },
            {
                name: 'The MU-TH-UR screen',
                text: 'The ship computer’s console: everything in mono capitals, scanlines over the whole tile, the plot a dark screen ringed in green, the line a phosphor trace on it.',
            },
        ],
        loading: [
            {
                name: 'The CRT trace',
                text: 'A sweep runs across the tube.',
            },
            {
                name: 'The indicator panel',
                text: 'The lamps scan.',
            },
            {
                name: 'The motion tracker',
                text: 'A ring pings out from the middle of the plot, as the motion tracker sweeps.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Drawn by the raster',
                text: 'The raster writes the tile as one picture from its top edge down, an eighth per 80 ms frame (640 ms): the number and the plot come in where they stand.',
            },
            {
                name: 'Printed out',
                text: 'The line is drawn in from the left, in 20 hard steps; the number is typed in.',
            },
        ],
        tone: [
            {
                name: 'The CRT trace',
                text: 'The change on its status plate; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The indicator panel',
                text: 'The change as a lit indicator lamp, the plot an embossed window; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The klaxon',
                text: 'The change on its tone’s label tape, no glow; a warning or destructive figure is framed all round in its colour, as the bridge alarm frames the screen.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'A blip',
                text: 'The line flares with light once, slowing as it lands.',
            },
            {
                name: 'The trace rolls',
                text: 'The line steps one reading to the left, as chart paper advances, in 2 hard steps.',
            },
        ],
    },
    titanium: {
        shape: [
            {
                name: 'The milled plate',
                text: 'A milled titanium plate: a brushed grain on the tile, the plot ringed in an anodised edge, the label in small capitals, the number in instrument mono.',
            },
            {
                name: 'The instrument dial',
                text: 'An instrument dial: the plot a recessed aperture with an inner shadow, a knurled band along the top of the tile, the change on a machined tab.',
            },
            {
                name: 'The anodised badge',
                text: 'An anodised badge: a wide rounded tile with a primary rim and a diagonal sheen, the plot a rounded window, the number in instrument mono.',
            },
        ],
        loading: [
            {
                name: 'The milled plate',
                text: 'The cutter runs along the edge.',
            },
            {
                name: 'The instrument dial',
                text: 'The knurl rolls.',
            },
            {
                name: 'The lathe',
                text: 'Knurled ridges run along the plot, as a part turning on a lathe.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The number and the line are there the moment loading ends, as both characters had them.',
            },
            {
                name: 'Milled',
                text: 'The line is drawn in from the left, easing in and out; the number is written in from the left.',
            },
            {
                name: 'Seated',
                text: 'The line drops into place from above, overshooting once; the number is pressed into the sheet.',
            },
        ],
        tone: [
            {
                name: 'The milled plate',
                text: 'The change on its status plate; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The instrument dial',
                text: 'The change on a machined tab; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The anodised tag',
                text: 'The change on a machined tab; a warning or destructive figure shows a band of its colour across the top, an anodised tag.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading redraws the line in place at once, as both characters had it.',
            },
            {
                name: 'A click of the dial',
                text: 'The line jolts once, as a needle does, in 2 hard steps.',
            },
            {
                name: 'A glint',
                text: 'The line flares with light once, slowing as it lands.',
            },
        ],
    },
};

/**
 * Round 2's verdicts (Kenny, 2026-10-06 11:21), in the order of ASPECTS:
 * shape, loading, arrival, tone, live. A number is settled and not shown as a
 * choice again; '' is open in round 3: brutalism's shape, loading and
 * arrival ("everything besides tone and update needs to be redone"), deco's
 * loading, retro's and nostromo's shapes. A loading picture sent back gets
 * six options and is built from the tile's own line (Kenny, 2026-10-06).
 * @type {Record<string, string[]>}
 */
const PICKED = {
    formal: ['1', '2', '2', '3', '1'],
    light: ['1', '1', '3', '3', '2'],
    dark: ['1', '2', '2', '3', '3'],
    cyberpunk: ['1', '1', '3', '3', '3'],
    synthwave: ['1', '1', '2', '3', '3'],
    pastel: ['1', '2', '2', '3', '3'],
    terminal: ['1', '1', '2', '3', '3'],
    forest: ['1', '3', '3', '3', '3'],
    'high-contrast': ['1', '2', '1', '3', '3'],
    sepia: ['2', '3', '2', '3', '1'],
    blueprint: ['1', '1', '2', '3', '1'],
    solstice: ['2', '2', '2', '3', '2'],
    brutalism: ['1', '1', '1', '3', '1'],
    deco: ['3', '1', '2', '3', '3'],
    phantom: ['3', '1', '3', '3', '1'],
    retro: ['1', '1', '1', '3', '2'],
    grotesk: ['1', '1', '2', '3', '1'],
    nostromo: ['1', '1', '2', '3', '2'],
    titanium: ['2', '3', '2', '3', '3'],
};
/** The settled pick of one aspect, or '' when it is open in round 3. */
const keptOf = (/** @type {string} */ theme, /** @type {Aspect} */ aspect) => PICKED[theme]?.[ASPECTS.findIndex((a) => a.id === aspect)] ?? '';
// Round 3's new options replace an open aspect's (each carries its own key,
// the attribute value its CSS answers to; round 2's are keyed 1, 2, 3),
// merged per aspect. Kept unconditional, not gated on `!keptOf`: a round 3
// aspect that is since decided (PICKED filled in) still renders from round
// 3's options — the decided pick IS one of them [fix: a filled PICKED used
// to block this merge, so decided.json's round-3 picks resolved against
// round 2's options instead, e.g. nostromo's shape rendering "The CRT
// trace" for a pick of "The vent grille"].
for (const file of [R3A, R3B])
    for (const [t, aspects] of Object.entries(file))
        for (const [id, options] of Object.entries(aspects)) if (options.length >= 3) IDEAS[t][id] = options;
/** The attribute value of option n of an aspect in a theme. */
const keyOf = (/** @type {string} */ t, /** @type {Aspect} */ id, /** @type {string} */ n) => IDEAS[t]?.[id]?.[Number(n) - 1]?.key ?? n;
/** The most options any row shows. */
const MOST = 6;

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="trend"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// five choices per theme, each option's name and what it does as its hint.
// Round 3 asks only what Kenny sent back; the rest is settled and hidden.
const hints = (/** @type {Aspect} */ aspect, /** @type {number} */ at) =>
    Object.fromEntries(
        Object.entries(IDEAS)
            .filter(([, idea]) => idea[aspect][at])
            .map(([theme, idea]) => [theme, `${idea[aspect][at].name}. ${idea[aspect][at].text}`]),
    );
const countOf = (/** @type {Aspect} */ id) =>
    Math.max(
        3,
        ...Object.keys(IDEAS)
            .filter((t) => !keptOf(t, id))
            .map((t) => IDEAS[t][id].length),
    );
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map(({ id, label }) => ({
            id,
            label,
            options: [...Array(countOf(id)).keys()].map((at) => ({ value: String(at + 1), label: String(at + 1), hints: hints(id, at) })),
            default: Object.fromEntries(
                Object.keys(PICKED)
                    .filter((t) => keptOf(t, id))
                    .map((t) => [t, keptOf(t, id)]),
            ),
            fixed: Object.fromEntries(
                Object.keys(PICKED)
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
    const open = ASPECTS.filter(({ id }) => !keptOf(theme, id));
    p.textContent = open.length
        ? `Round 3: new options for ${open.map(({ id, label }) => `${label.toLowerCase()} (${idea[id].length})`).join(', ')}; everything else is settled as you picked it and is no longer a choice. ` +
          'Only the open rows are on the page; the preview at the top shows your picks. Press Drawn, Loading at full speed and at ¼, and Live update.'
        : 'Approved: every aspect is settled as you picked it.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

const TILE = `<div class="kp-kpi kp-kpi--trend" data-tr-tile>
    <span class="kp-kpi__label"><span data-tr-name-of-figure>Pressure</span> <span class="kp-kpi__label-note">avg 15 min</span></span>
    <a class="kp-kpi__link" href="#h-trend" title="Open the figure on Charts"><span class="kp-kpi__link-word">Charts</span> ↗</a>
    <span class="kp-kpi__value"></span>
    <span class="kp-kpi__trend"></span>
    <figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative" aria-label="Pressure, last 24 hours"></figure>
</div>`;
const rows = /** @type {HTMLElement} */ (section.querySelector('[data-ct-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'tr-aspect';
    box.setAttribute('data-ct-aspect', id);
    box.setAttribute('aria-labelledby', `h-ct-${id}`);
    const head = document.createElement('div');
    head.className = 'tr-aspect__head';
    head.innerHTML = '<h3></h3><p></p>';
    head.firstElementChild.id = `h-ct-${id}`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'tr-trio';
    for (let at = 1; at <= MOST; at++) {
        const cell = document.createElement('div');
        cell.className = 'tr-col';
        cell.setAttribute('data-ct-vary', id);
        cell.setAttribute('data-ct-option', String(at));
        cell.innerHTML =
            `<p class="tr-label"><span class="tr-label__no">${label} · ${at}</span> <span data-ct-name></span></p>` +
            `<p class="tr-desc" data-ct-desc></p><div class="kp-kpis tr-strip" data-ct>${TILE}</div>`;
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

/** Writes the five aspects on every strip: the preview takes the picks, each row's cell its own option in its own aspect. */
function compose() {
    const now = picks();
    const preview = section.querySelector('[data-ct-preview]');
    const t = theme();
    for (const { id } of ASPECTS) {
        const key = keyOf(t, id, now[id]);
        if (preview?.getAttribute(`data-ct-${id}`) !== key) preview?.setAttribute(`data-ct-${id}`, key);
    }
    for (const cell of section.querySelectorAll('[data-ct-vary]')) {
        const vary = cell.getAttribute('data-ct-vary');
        const option = cell.getAttribute('data-ct-option') ?? '1';
        const strip = cell.querySelector('[data-ct]');
        for (const { id } of ASPECTS) {
            const value = keyOf(t, id, id === vary ? option : now[id]);
            if (strip?.getAttribute(`data-ct-${id}`) !== value) strip?.setAttribute(`data-ct-${id}`, value);
        }
        cell.classList.toggle('tr-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-ct-picks]');
    const idea = IDEAS[theme()];
    if (words && idea) words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1].name}`).join(' · ');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* --------------------------------------------------------- the readings */

// Pump house 1, 24 hours of readings every ten minutes up to a fixed now:
// 20/10/2026 14:40 in Brussels (12:40 UTC), the same on every load.
const MINUTE = 60_000;
const STEP = 10 * MINUTE;
const DAY = 24 * 60 * MINUTE;
let clock = Date.UTC(2026, 9, 20, 12, 40);

/** Noise from the time alone. @param {number} t @param {number} k */
const noise = (t, k) => {
    const v = Math.sin((t / MINUTE) * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v) - 0.5;
};
/** The network's demand at `t` on the Brussels clock: a morning and an evening peak. @param {number} t */
const demand = (t) => {
    const h = (((t / 3_600_000 + 2) % 24) + 24) % 24;
    return 0.55 + 0.4 * Math.exp(-((h - 7.5) ** 2) / 3) + 0.3 * Math.exp(-((h - 19) ** 2) / 4) - 0.25 * Math.exp(-((h - 3.5) ** 2) / 5);
};

/**
 * @typedef {{ label: string, note: string, unit?: string, unitKind?: import('../../js/chart.js').ChartUnitKind, digits: number,
 *   context: string, at: (t: number) => number, from?: () => number, until?: () => number, one?: boolean,
 *   upIs: 'good' | 'bad' }} Figure
 */
/** @type {Record<string, Figure>} */
const FIGURES = {
    pressure: {
        label: 'Pressure',
        note: 'avg 15 min',
        unit: 'bar',
        digits: 2,
        context: 'two pumps',
        upIs: 'good',
        at: (t) => 3.6 - 0.6 * demand(t) + 0.04 * noise(t, 1),
    },
    long: {
        label: 'Pressure, far end of the ring',
        note: 'avg 15 min',
        unit: 'bar',
        digits: 2,
        context: 'Pleinstraat',
        upIs: 'good',
        at: (t) => 2.9 - 0.7 * demand(t) + 0.05 * noise(t, 5),
    },
    wide: {
        label: 'Water delivered this year',
        note: 'total',
        unit: 'm³',
        digits: 0,
        context: 'since 01/01/2026',
        upIs: 'good',
        at: (t) => Math.round(12_400_000 + ((t - Date.UTC(2026, 9, 19, 12, 40)) / STEP) * 550 * demand(t)),
    },
    stopped: {
        label: 'Flow into the network',
        note: 'avg 15 min',
        unit: 'm³/h',
        digits: 0,
        context: 'no reading for 40 min',
        upIs: 'good',
        at: (t) => 420 * demand(t) + 12 * noise(t, 2),
        until: () => clock - 40 * MINUTE,
    },
    today: {
        label: 'Reservoir South',
        note: 'avg 15 min',
        unitKind: 'percent',
        digits: 0,
        context: 'measured since 07:00',
        upIs: 'good',
        at: (t) => 72 - 9 * demand(t) + noise(t, 3),
        from: () => clock - 460 * MINUTE,
    },
    one: {
        label: 'Reservoir East',
        note: 'avg 15 min',
        unitKind: 'percent',
        digits: 0,
        context: 'measured since 14:30',
        upIs: 'good',
        at: () => 71,
        one: true,
    },
    hot: {
        label: 'Pump temperature',
        note: 'hottest pump',
        unitKind: 'celsius',
        digits: 0,
        context: 'limit 60 °C',
        upIs: 'bad',
        at: (t) => 47 + 11 * demand(t) + noise(t, 4),
    },
};

/** @param {Figure} f @returns {[number, number][]} */
const pointsOf = (f) => {
    if (f.one) return [[clock - STEP, f.at(clock)]];
    const end = Math.min(clock, f.until?.() ?? Infinity);
    const start = f.from?.() ?? clock - DAY;
    /** @type {[number, number][]} */
    const points = [];
    for (let t = start; t <= end; t += STEP) points.push([t, Number(f.at(t).toFixed(f.digits))]);
    return points;
};
const number = (/** @type {Figure} */ f, /** @type {number} */ v) =>
    v.toLocaleString('en-GB', { minimumFractionDigits: f.digits, maximumFractionDigits: f.digits });
const unitOf = (/** @type {Figure} */ f) => (f.unitKind === 'percent' ? '%' : f.unitKind === 'celsius' ? '°C' : (f.unit ?? ''));
const print = (/** @type {Figure} */ f, /** @type {number} */ v) => (f.unitKind === 'percent' ? `${number(f, v)}%` : `${number(f, v)} ${unitOf(f)}`);

const WORDS = {
    empty: 'nothing to draw yet: the sensor has sent no reading',
    error: 'could not read: the readings store did not answer',
};

const state = {
    shown: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ ('ready'),
    figure: 'pressure',
    tone: /** @type {'' | 'warning' | 'destructive'} */ (''),
};

const tiles = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-tr-tile]')]);

/** @param {HTMLElement} el @param {string} width @param {string} [height] */
const skeleton = (el, width, height) => {
    const s = document.createElement('span');
    s.className = 'kp-skeleton';
    s.style.inlineSize = width;
    if (height) s.style.setProperty('--kp-skeleton-height', height);
    el.replaceChildren(s);
};

/** @param {boolean} [loading] one busy frame, so Drawn replays the arrival */
function draw(loading = state.shown === 'loading') {
    const f = FIGURES[state.figure];
    for (const tile of tiles()) {
        const figure = /** @type {HTMLElement} */ (tile.querySelector('.kp-kpi__chart'));
        const value = /** @type {HTMLElement} */ (tile.querySelector('.kp-kpi__value'));
        const words = /** @type {HTMLElement} */ (tile.querySelector('.kp-kpi__trend'));
        const name = tile.querySelector('[data-tr-name-of-figure]');
        const note = tile.querySelector('.kp-kpi__label-note');
        const link = tile.querySelector('.kp-kpi__link');
        if (name) name.textContent = f.label;
        if (note) note.textContent = f.note;
        link?.setAttribute('title', `Open ${f.label} on Charts`);
        figure.setAttribute('aria-label', `${f.label}, last 24 hours`);
        if (state.tone) tile.setAttribute('data-kp-tone', state.tone);
        else tile.removeAttribute('data-kp-tone');
        if (loading) {
            skeleton(value, '3ch', '1.75rem');
            skeleton(words, '80%');
            setTrendData(figure, null);
            continue;
        }
        if (state.shown !== 'ready') {
            value.textContent = '—';
            words.textContent = WORDS[state.shown];
            setTrendData(figure, { points: [], step: STEP, unit: f.unit, unitKind: f.unitKind, digits: f.digits });
            continue;
        }
        const points = pointsOf(f);
        const last = points[points.length - 1][1];
        value.textContent = number(f, last);
        const unit = unitOf(f);
        if (unit) value.append(Object.assign(document.createElement('small'), { textContent: unit }));
        // The change over the last hour, its tone by what a rise means here.
        const hourAgo = points.length > 6 ? points[points.length - 7][1] : null;
        const parts = /** @type {(string | Node)[]} */ ([]);
        if (hourAgo != null && last !== hourAgo) {
            const up = last > hourAgo;
            const delta = document.createElement('span');
            delta.className = 'kp-kpi__delta';
            delta.setAttribute('data-kp-direction', up ? 'up' : 'down');
            delta.setAttribute('data-kp-tone', up === (f.upIs === 'good') ? 'good' : 'bad');
            delta.textContent = print(f, Math.abs(last - hourAgo));
            parts.push(delta, ' in the hour · ');
        }
        const peak = Math.max(...points.map((p) => p[1]));
        parts.push(points.length > 1 ? `peak ${print(f, peak)} · ${f.context}` : `one reading · ${f.context}`);
        words.replaceChildren(...parts);
        setTrendData(figure, { points, step: STEP, unit: f.unit, unitKind: f.unitKind, digits: f.digits });
    }
}

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

/** Drawn again: one busy frame, then the readings, so the arrival plays. */
const replay = () => {
    draw(true);
    requestAnimationFrame(() => requestAnimationFrame(() => draw()));
};

for (const b of section.querySelectorAll('[data-tr-state]'))
    b.addEventListener('click', () => {
        state.shown = /** @type {typeof state.shown} */ (b.getAttribute('data-tr-state') ?? 'ready');
        pressed('data-tr-state', state.shown);
        if (state.shown === 'ready') replay();
        else draw();
    });

for (const b of section.querySelectorAll('[data-tr-data]'))
    b.addEventListener('click', () => {
        state.figure = b.getAttribute('data-tr-data') ?? 'pressure';
        pressed('data-tr-data', state.figure);
        draw();
    });

for (const b of section.querySelectorAll('[data-tr-tone]'))
    b.addEventListener('click', () => {
        state.tone = /** @type {typeof state.tone} */ (b.getAttribute('data-tr-tone') ?? '');
        pressed('data-tr-tone', state.tone);
        draw();
    });

// A live update: ten minutes later, one more reading at the end and the
// oldest gone; a point being read stays at its moment.
section.querySelector('[data-tr-live]')?.addEventListener('click', () => {
    clock += STEP;
    state.shown = 'ready';
    pressed('data-tr-state', 'ready');
    draw();
});

// The links go nowhere on this page: say where they would go.
const log = section.querySelector('[data-tr-log]');
section.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('.kp-kpi__link') : null;
    if (!link) return;
    event.preventDefault();
    if (log) log.textContent = `Opened: ${link.getAttribute('title')}.`;
});

attachTrendCharts(section, { now: () => clock });
compose();
draw();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-tr-theme-name]')) el.textContent = LABEL[now] ?? now;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    // A settled aspect has no row, and a row hides the cells its theme has no option for.
    for (const box of section.querySelectorAll('[data-ct-aspect]'))
        /** @type {HTMLElement} */ (box).hidden = Boolean(keptOf(now, /** @type {Aspect} */ (box.getAttribute('data-ct-aspect'))));
    for (const cell of section.querySelectorAll('[data-ct-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (cell.getAttribute('data-ct-vary'))]?.[Number(cell.getAttribute('data-ct-option')) - 1];
        /** @type {HTMLElement} */ (cell).hidden = !option;
        const name = cell.querySelector('[data-ct-name]');
        const desc = cell.querySelector('[data-ct-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-tr-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-meter; full speed by default, since a loop is judged at
// its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('tr-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-tr-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-tr-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-tr-speed'));
        try {
            localStorage.setItem('tr-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();
