// research/character-kpi: the ninth component of the character round (Kenny,
// phase 1 brief, 2026-10-05): the plain key figure tile (`.kp-kpi`, without
// the trend variant `.kp-kpi--trend` or the columns strip
// `data-kp-kpis-columns`, each its own demo already: research/character-trend,
// research/character-columns). Every theme's tile has five aspects, each
// picked on its own from three options, as the meter and the trend tile do:
//
//   data-kf-shape="1|2|3"       the plate, the frame, the label, the number,
//                                the unit, the note, the delta's shape
//   data-kf-loading="1|2|3"     the picture while the figure loads (busy);
//                                it always moves (a still frame under reduced
//                                motion), and nothing fades
//   data-kf-tone="1|2|3"        how a warning or destructive figure reads,
//                                and the delta's plate
//   data-kf-interactive="1|2|3" hover, focus and press on a link or a toggle
//                                tile
//   data-kf-live="1|2|3"        what a new reading does to the number
//
// Every rule in kpi.css (and kpi-a..d.css, four empty groups) names one
// aspect only, so any combination composes. The markup is the package's own
// (`js/kpi.js` is not changed): `.kp-kpi` with `.kp-kpi__label`,
// `.kp-kpi__value` (`small` for the unit, `.kp-kpi__note`),
// `.kp-kpi__trend` (words, with `.kp-kpi__delta` for the change), `data-kp-tone`
// for a warning or destructive figure, `aria-busy` while loading. A plain
// tile, a link tile (`a.kp-kpi`) and a toggle tile (`button.kp-kpi--toggle`)
// are shown so interactive, tone and busy all have a surface to act on.

import { THEMES } from '../../js/theme-registry.js';
import R2A from './round2-a.js';
import R2B from './round2-b.js';
import R2C from './round2-c.js';
import R2D from './round2-d.js';

/** @typedef {{ name: string, text: string, key?: string }} Option */
/** @typedef {'shape' | 'loading' | 'tone' | 'interactive' | 'live'} Aspect */

/** The five aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: 'The plate, the frame, the label, the number, the unit, the note and the delta. Compare them as they stand.',
    },
    { id: 'loading', label: 'While loading', about: 'The picture while the figure is busy; it always moves. Press Loading.' },
    {
        id: 'tone',
        label: 'Tone and change',
        about: 'How a warning or destructive figure reads, and the delta chip. Press Warning, then Destructive, then None.',
    },
    {
        id: 'interactive',
        label: 'Hover, focus, press',
        about: 'A link tile and a toggle tile under the pointer, the keyboard and a click. Move the pointer over a tile, or tab to it.',
    },
    { id: 'live', label: 'Live update', about: 'What a new reading does to the number. Press Live update.' },
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
                text: 'A brass-plate engraving on paper, a ruled double frame, the number in the display serif, the change as its own status plate.',
            },
            {
                name: 'The annual report',
                text: 'A key figure from a printed annual report, a heavy rule above the label, the number large in the display serif, the change as its own status plate.',
            },
            {
                name: 'The red-ink entry',
                text: 'A share certificate, a thin navy rule inside the frame, a guilloche of fine rings behind the figure, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The dotted leader',
                text: 'While the figure loads, a dotted leader is written under the label, dot by dot; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The ledger is ruled',
                text: 'While the figure loads, four ledger rules are drawn across the card, left to right, and ruled again; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The seal is pressed',
                text: 'While the figure loads, a navy seal ring is pressed onto the card, lifted and pressed again; it keeps moving until the reading is drawn.',
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
        interactive: [
            {
                name: 'The clerk’s nod',
                text: 'As a link or a filter: the frame gains a second hairline on hover, a navy seal ring on focus, the plate dims a shade when pressed.',
            },
            {
                name: 'The ledger opens',
                text: 'As a link or a filter: a faint guilloche rises behind the number on hover, a navy outline on focus, the page turns a shade darker when pressed.',
            },
            {
                name: 'The wax seal',
                text: 'As a link or a filter: the corner lifts a hair on hover, a pressed wax-seal ring on focus, the seal presses flat when pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            {
                name: 'The entry is carried forward',
                text: 'A new reading: the old figure is ruled through and the new one entered beneath, slowing as it lands.',
            },
            { name: 'Signed again', text: 'A new reading: the number is retraced in its own serif, easing in and out.' },
        ],
    },
    light: {
        shape: [
            {
                name: 'The soft card',
                text: 'A white card lifted on a soft shadow, a wide radius, the number in a rounded sans, the change as its own status plate.',
            },
            {
                name: 'The soft outline',
                text: 'A pale sky wash behind the number, the sun a warm glow in the corner, the change as its own status plate.',
            },
            {
                name: 'The coloured tab',
                text: 'A sheet of paper on the page, a small radius, a lifted corner folded at the top right, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The dashed baseline',
                text: 'While the figure loads, a dashed line under the label drifts steadily to the right, looping at the edge; it keeps moving until the reading is drawn.',
            },
            {
                name: 'Daylight',
                text: 'While the figure loads, a slow diagonal band of daylight sweeps across the whole card from corner to corner and loops; it keeps moving until the reading is drawn.',
            },
            {
                name: 'A cloud passes',
                text: 'While the figure loads, a soft blurred cloud shadow drifts the full width of the card, left to right, and returns; it keeps moving until the reading is drawn.',
            },
        ],
        tone: [
            {
                name: 'The soft card',
                text: 'The change as a soft pill; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            { name: 'The soft outline', text: 'The change as a pill drawn in a soft outline of its own ink over its plate.' },
            {
                name: 'The coloured tab',
                text: 'The change as a pill with a soft drop shadow; a warning or destructive figure shows a band of its colour along the top of the card.',
            },
        ],
        interactive: [
            {
                name: 'The lift',
                text: 'As a link or a filter: the card lifts on a wider soft shadow and its border warms a shade on hover, a 2px indigo ring appears outside the edge on focus, the lift settles flat again when pressed.',
            },
            {
                name: 'The warm glow',
                text: "As a link or a filter: the sun's corner glow widens and brightens on hover, a thick warm-amber halo rings the tile on focus, the glow narrows back when pressed.",
            },
            {
                name: 'The paper curls',
                text: 'As a link or a filter: the folded corner lifts further and casts a small shadow on hover, an indigo rule frames the tile on focus, the corner flattens back down when pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            {
                name: 'A soft swell',
                text: 'A new reading: the number swells to 112% and settles back to size over half a second, easing out like a breath.',
            },
            {
                name: 'The page turns',
                text: "A new reading: the new figure slides in from the right while sliding the old one's place, slowing to a stop as it lands, as a page turning to the next entry.",
            },
        ],
    },
    dark: {
        shape: [
            {
                name: 'The status board',
                text: 'A black operations board, the number lit in ticker mono, a fine bevel, the change as its own status plate.',
            },
            {
                name: 'The machined tab',
                text: 'A machined black panel with a fine bevel, the label in mono capitals, the change as its own status plate.',
            },
            { name: 'The alarm lamp', text: 'A scope screen in a black panel, a lit rim, the number in mono, the change as its own status plate.' },
        ],
        loading: [
            {
                name: 'The ticker baseline',
                text: 'While the figure loads, a dashed line under the label ticks along in hard steps like a ticker tape reel, looping; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The slot is scanned',
                text: 'While the figure loads, a narrow lit band sweeps the full width of the card left to right, as a card reader scanning a slot, and loops; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The status lamps',
                text: 'While the figure loads, a single lit lamp steps between three fixed places along the foot of the panel, holding at each before jumping to the next; it keeps moving until the reading is drawn.',
            },
        ],
        tone: [
            {
                name: 'The status board',
                text: 'The change as a lit square chip; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            { name: 'The machined tab', text: 'The change as a flat tab with a square corner and a lit top edge.' },
            {
                name: 'The alarm lamp',
                text: 'The change as a lit square chip; a warning or destructive figure lights its number on the tone’s plate, as an alarm lamp.',
            },
        ],
        interactive: [
            {
                name: 'The panel lights',
                text: 'As a link or a filter: the frame brightens to the primary colour and the plate lifts a shade darker toward black on hover, a solid 2px primary ring appears on focus, the plate drops further toward black when pressed.',
            },
            {
                name: 'The scope glows',
                text: "As a link or a filter: the number's glow widens into a bright halo on hover, a dashed primary ring appears on focus, the glow is cut flat to nothing when pressed.",
            },
            {
                name: 'The lamp switches',
                text: 'As a link or a filter: a status lamp lights along the inside edge in the primary colour on hover, switches to the warning colour on focus, clicks off entirely when pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            {
                name: 'The trace jumps',
                text: 'A new reading: the number jolts upward once in two hard steps (no easing between them), as a needle snapping to a new mark, and settles.',
            },
            {
                name: 'The trace flares',
                text: "A new reading: the number's glow flares bright for a third of a second then dims back down to its resting glow, as an oscilloscope trace catching a spike.",
            },
        ],
    },
    cyberpunk: {
        shape: [
            {
                name: 'The neon trace',
                text: 'A neon trace on a black board with a faint circuit grid, the number in tech mono with a cyan halo, cut corners on the frame, the change as its own status plate.',
            },
            {
                name: 'The glitch HUD',
                text: 'A netrunner HUD, yellow brackets at the corners, the number with an RGB split, the change as its own status plate.',
            },
            {
                name: 'The holo plate',
                text: 'A holo plate: a yellow rim glowing inward, scan lines at 135 degrees, the 14 px notch cut at its dossier corner; the label a /// prefixed cyan mono capital, the figure in the display face, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The neon trace',
                text: 'While the figure loads, a short glowing packet of light runs the width of the baseline under the label, left to right, and loops at full speed; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The glitch HUD',
                text: 'While the figure loads, a warning-coloured glitch bar jumps between hard-cut positions across the card in five discrete steps, looping; it keeps moving until the reading is drawn.',
            },
            {
                name: 'Signal loss',
                text: 'While the figure loads, the word LOADING is deciphered from noise glyphs on its waiting lines, holds in neon with a cyan and a red copy, tears sideways and is sliced away: 1800 ms in hard ticks; it keeps going until the reading is drawn.',
            },
        ],
        tone: [
            {
                name: 'The neon trace',
                text: 'The change as a cut-corner chip; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The lock',
                text: "The change as a square mono chip with a 4 px cut at its end corner; a warning or destructive figure is locked as a target: four corner brackets in the tone's ink twitch twice as they lock and hold.",
            },
            {
                name: 'The hazard frame',
                text: 'The change as a slanted chip; a warning or destructive figure is boxed in a frame of its colour all round the card.',
            },
        ],
        interactive: [
            {
                name: 'Own tile: split edge, brackets, closed circuit',
                text: "As a link or a filter the tile is cyberpunk's own: hover doubles its edge (cyan along the head and the end, red along the foot, 5, 4, 3, then 2 px), focus closes four target brackets on it, a press lights the circuit grid at 60 %; nothing glows and nothing moves.",
            },
            {
                name: 'The HUD locks',
                text: 'As a link or a filter: a warning-coloured inset line appears around the tile on hover, the number splits into a red/cyan RGB ghost on focus, a primary-coloured ring replaces the warning line when focused.',
            },
            {
                name: 'The hazard tape',
                text: 'As a link or a filter: a warning-coloured hazard stripe lights along the top edge on hover, a warning ring with no offset cuts flush against the frame on focus, the stripe switches to destructive red when pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            {
                name: 'Packet in',
                text: 'A new reading: the number glitches sideways through four hard-cut positions in a third of a second, as a corrupted packet resolving, then settles.',
            },
            {
                name: 'The stutter home',
                text: 'A new reading: the number comes home from a yellow copy and a cyan copy of itself, 6, 4, 2, 1 px, four ticks of 120 ms, and never moves itself.',
            },
        ],
    },
    synthwave: {
        shape: [
            {
                name: 'The grid-floor horizon',
                text: 'A perspective grid floor under a pink horizon, the number in VT323, the change as its own status plate.',
            },
            {
                name: 'The VCR display',
                text: 'A VCR’s on-screen display on black, OSD numerals, scanlines over the tile, the change as its own status plate.',
            },
            {
                name: 'The arcade warning',
                text: 'An arcade cabinet’s marquee, a pink frame with a glow, the number in the display face with a pink drop, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The grid-floor horizon',
                text: 'While the figure loads, the perspective grid lines under the label drive steadily toward the viewer and loop; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The VCR display',
                text: 'While the figure loads, a pale tracking-error band rolls down the full height of the card from top to bottom and loops; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The sun rises',
                text: 'While the figure loads, a small striped sun at the foot of the card rises and sinks on the horizon in a slow two-second breath, looping; it keeps moving until the reading is drawn.',
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
        interactive: [
            {
                name: 'Over the horizon',
                text: 'As a link or a filter: the grid-floor lines brighten toward the primary pink on hover, a solid primary-pink ring appears outside the frame on focus, the lines dim back down when pressed.',
            },
            {
                name: 'The OSD blinks',
                text: "As a link or a filter: the number's colour switches to the primary pink on hover, the scanline pattern tightens to a denser weave on focus, the scanlines loosen back when pressed.",
            },
            {
                name: 'The marquee lights',
                text: 'As a link or a filter: a wide pink glow blooms around the whole tile on hover, a secondary-coloured ring appears on focus, the glow is cut down to almost nothing when pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            {
                name: 'The tracking jumps',
                text: "A new reading: the number jolts upward once in two hard steps, as a VCR's tracking catching a glitch, and settles.",
            },
            {
                name: 'The laser flares',
                text: "A new reading: the number's pink glow flares to full brightness then burns back down to its resting level over half a second, as a laser sweep catching the digits.",
            },
        ],
    },
    pastel: {
        shape: [
            {
                name: 'The sticker chart',
                text: 'A candy card with a flat sticker shadow, the number in the rounded face, the change as its own status plate.',
            },
            {
                name: 'The washi planner',
                text: 'A dotted planner pad with a strip of washi tape across the top, the change as its own status plate.',
            },
            { name: 'The heart sticker', text: 'A soft cloud, a wide round card with a dashed candy outline, the change as its own status plate.' },
        ],
        loading: [
            {
                name: 'The sticker chart',
                text: 'While the figure loads, a round candy dot hops in an arc from the left edge to the right edge of the card under the label, bouncing twice along the way, and loops; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The washi planner',
                text: 'While the figure loads, the strip of washi tape across the top gently rocks side to side, tilting a few degrees each way, looping; it keeps moving until the reading is drawn.',
            },
            {
                name: 'Sprinkles',
                text: 'While the figure loads, two small sprinkle dots of different colours slide together from the left edge to the right edge of the card and loop; it keeps moving until the reading is drawn.',
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
        interactive: [
            {
                name: 'The sticker peels',
                text: "As a link or a filter: the sticker's flat shadow grows and the card lifts a hair on hover, a dashed primary-coloured outline appears on focus, the shadow and lift flatten back to rest when pressed.",
            },
            {
                name: 'The tape lifts',
                text: "As a link or a filter: the washi tape's corner lifts and tilts further on hover, a dashed secondary-coloured outline appears on focus, the tape settles flat again when pressed.",
            },
            {
                name: 'The cloud bounces',
                text: 'As a link or a filter: the whole cloud card lifts a few pixels on hover, a solid thick primary ring appears on focus, the card squashes vertically for an instant when pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            {
                name: 'A happy hop',
                text: 'A new reading: the number hops up and grows slightly larger, overshooting past its resting size once with a bouncy spring before settling, as a happy little jump.',
            },
            {
                name: 'Squished',
                text: 'A new reading: the number swells to 112% and settles back over half a second, as a soft candy shape being squished and springing back.',
            },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'The top(1) row',
                text: 'A text screen framed in a double box-drawing line, everything in the mono, the label in capitals, the change as its own status plate.',
            },
            {
                name: 'The dumb-terminal plot',
                text: 'gnuplot’s dumb terminal, a grid of character cells, the axis in brackets of rules, the change as its own status plate.',
            },
            { name: 'The bell', text: 'A curses window, a single-line box, the label ruled off under it, the change as its own status plate.' },
        ],
        loading: [
            {
                name: 'The top(1) row',
                text: 'While the figure loads, a solid block caret sits under the label and blinks on and off in a hard, even beat, never a fade; it keeps blinking until the reading is drawn.',
            },
            {
                name: 'The dumb-terminal plot',
                text: 'While the figure loads, a row of dots under the label marches to the right four cells at a time, printing and reprinting in character-grid steps; it keeps marching until the reading is drawn.',
            },
            {
                name: 'The hash bar',
                text: 'While the figure loads, a bar of # blocks fills left to right in six hard steps, then snaps back to empty and fills again; it keeps filling until the reading is drawn.',
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
        interactive: [
            {
                name: 'Highlighted',
                text: 'As a link or a filter: the double box-rule turns primary-green on hover, a solid green outline locks on focus, and pressing fills the whole tile reverse-video, primary on black, for as long as the button is held.',
            },
            {
                name: 'The cursor blinks',
                text: 'As a link or a filter: the frame picks up the cursor ring on hover, a dashed box steps in on focus (no blink at rest — the terminal only moves on the loading picture), and pressing prints the tile reverse-video, as a line just entered.',
            },
            {
                name: 'The bell rings',
                text: 'As a link or a filter: the box rule turns dashed on hover, a dashed outline rings the whole tile on focus three units out, and pressing flashes the tile reverse-video once, as a terminal bell line.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading: the number is replaced at once, as both characters had it — no picture plays, the value simply is the new value.',
            },
            {
                name: 'Scrolled',
                text: 'A new reading: the number rises up from below the baseline into place in two hard character-row steps, as a line just scrolled onto the screen.',
            },
            {
                name: 'Reverse flash',
                text: "A new reading: the number's own cell flashes reverse-video once — green on black becomes black on green and back — a single hard step, like a line blinking as it is written.",
            },
        ],
    },
    forest: {
        shape: [
            {
                name: 'The ranger’s logbook',
                text: 'A ranger’s logbook on kraft paper, the label in serif italic, the number carved in bark ink, the change as its own status plate.',
            },
            { name: 'The canopy', text: 'Looking up into a canopy, a leaf-green wash on the card, the change as its own status plate.' },
            {
                name: 'The trail blaze',
                text: 'A pressed leaf on a herbarium sheet, leaf veins behind the number, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: "The ranger's logbook",
                text: "While the figure loads, a small lit trail-marker walks the full width under the label at an easy, continuous pace and loops back to start, as a ranger's torch passing on its round; it keeps walking until the reading is drawn.",
            },
            {
                name: 'The row is planted',
                text: 'While the figure loads, its skeleton lines are the bar’s planted row: seedlings on cleared ground and a grove of whole trees filling it start to end, until the reading is drawn.',
            },
            {
                name: 'Fireflies',
                text: 'While the figure loads, a single firefly drifts a slow loop low over the card, dipping and rising, never in a straight line, never fading, only moving; it keeps drifting until the reading is drawn.',
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
                text: 'The change on a field note (italic, leaf-cornered, in the tone’s own plate and ink); a warning or destructive figure is blazed in the tone’s ink along the left edge, 3 px, as a trail marker on a trunk.',
            },
        ],
        interactive: [
            {
                name: 'The tag turns',
                text: 'As a link or a filter: the frame deepens toward bark-green on hover, a moss-green ring lands on focus, and the whole tile settles down one pixel when pressed, as a wooden tag dropping back against its string.',
            },
            {
                name: 'The blaze settles',
                text: 'As a link or a filter: hover lays the dashed trail blaze round the tile, focus is the two-channel ring, a press closes the blaze in; the tile never moves.',
            },
            {
                name: 'The trail marks',
                text: 'As a link or a filter: the frame picks up the bark-ink primary colour on hover, a tight bark-ink ring lands on focus, and the plate deepens further when pressed, as a fresh blaze cut into the trunk.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading: the number is replaced at once, as both characters had it — no picture plays, the value simply is the new value.',
            },
            {
                name: 'A branch sways',
                text: 'A new reading: the number dips down and springs back once, slowing as it lands, as a branch pulled down by a landing bird and let go.',
            },
            {
                name: 'Growth ring',
                text: 'A new reading: the number swells outward once and settles back to size, easing in and out, as a new ring widening the trunk for a season.',
            },
        ],
    },
    'high-contrast': {
        shape: [
            {
                name: 'Ink and frame',
                text: 'Everything framed in a 2px rule, the number bold, a solid baseline under the label. Still: nothing moves, the change as its own status plate.',
            },
            {
                name: 'The heavy frame',
                text: 'The card inverted, an ink plate with the label and number in the paper colour. Still: nothing moves, the change as its own status plate.',
            },
            {
                name: 'The signal plate',
                text: 'A road signal, a heavy 3px frame, the number very large and heavy, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The dashed baseline',
                text: 'While the figure loads, the dashed rule under the label steps six hard units to the right, over and over, never sliding smoothly, so it always reads as a signal, not a decoration; it keeps stepping until the reading is drawn.',
            },
            {
                name: 'The striped block',
                text: "While the figure loads, a block of diagonal ink-and-paper stripes marches across the full width of the card's foot in four hard jumps and loops back; it keeps marching until the reading is drawn.",
            },
            {
                name: 'The scanning bar',
                text: 'While the figure loads, a thick solid bar steps down the full height of the card in five hard jumps, as a scanner reading a page line by line, then starts again at the top; it keeps scanning until the reading is drawn.',
            },
        ],
        tone: [
            {
                name: 'Ink and frame',
                text: 'The change as a framed plate with its own ink; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            { name: 'The heavy frame', text: 'The change in a 3px frame with square corners.' },
            {
                name: 'The signal plate',
                text: 'The change framed in ink with a hard shadow; a warning or destructive figure puts its number on the tone’s own plate and frames the card in the tone.',
            },
        ],
        interactive: [
            {
                name: 'Switched',
                text: 'As a link or a filter: the 2px rule doubles to 4px on hover, the whole tile flips to an ink plate with paper-coloured text on focus, and stays flipped while pressed, so the state is never in doubt.',
            },
            {
                name: 'The signal lights',
                text: 'As a link or a filter: the frame thickens to 3px on hover, a solid outline with a hard offset shadow locks on focus, and the tile flips to an ink plate while pressed.',
            },
            {
                name: 'The bar flips',
                text: 'As a link or a filter: a diagonal ink-and-paper stripe band appears behind the content on hover, a thick square outline lands flush on focus, and the tile flips to an ink plate while pressed.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading: the number is replaced at once, as both characters had it — no picture plays, the value simply is the new value.',
            },
            {
                name: 'The bar jumps',
                text: 'A new reading: the number jolts upward and back in two hard steps, as a needle striking its stop and bouncing once.',
            },
            {
                name: 'The bar flips',
                text: 'A new reading: the whole number flips to ink-on-paper and back once, a single hard step, never a blend of grey in between.',
            },
        ],
    },
    sepia: {
        shape: [
            {
                name: 'The barograph',
                text: 'A barograph drum, ruled chart paper behind the number, an aged vignette on the paper, the change as its own status plate.',
            },
            {
                name: 'Letterpress',
                text: 'A letterpress card on speckled paper, the number pressed into the sheet, the change as its own status plate.',
            },
            {
                name: 'The rubber stamp',
                text: 'A printed ticket stub, notches punched in both sides, a dashed tear line as the frame, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The barograph',
                text: "While the figure loads, a small ink dot sweeps the full width under the label at an even, unhurried pace and loops back, as a barograph's nib tracing a fair-weather line; it keeps sweeping until the reading is drawn.",
            },
            {
                name: 'The ink spreads',
                text: 'While the figure loads, a round blot of ink swells out from a point and draws back in, slowly, over and over, as a drop of ink feathering into damp paper and being blotted; it keeps swelling until the reading is drawn.',
            },
            {
                name: 'The drum turns',
                text: "While the figure loads, the ruled hour-lines behind the label slide steadily leftward under a still nib, as a barograph's drum turning through the day; it keeps turning until the reading is drawn.",
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
        interactive: [
            {
                name: 'The nib lifts',
                text: "As a link or a filter: the paper's vignette deepens on hover, a warm brown-ink ring lands on focus, and the card darkens a touch while pressed, as a nib lifted and set down again.",
            },
            {
                name: 'The press clamps',
                text: 'As a link or a filter: the letterpress shadow along the top and bottom deepens on hover, a thin ink-brown outline sits a little further out on focus, and the whole card presses flat (a faint scale-down) while held.',
            },
            {
                name: 'The stub tears',
                text: 'As a link or a filter: the frame warms toward the ring colour on hover, a dashed ink-brown ring appears on focus, and the tear-line border darkens further while pressed, as a ticket stub worked loose.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading: the number is replaced at once, as both characters had it — no picture plays, the value simply is the new value.',
            },
            {
                name: 'The nib moves on',
                text: 'A new reading: the number eases a short step sideways at a level, even pace, as a nib moving on to the next entry in the same line.',
            },
            {
                name: 'Inked again',
                text: 'A new reading: the number swells slightly and settles, easing in and out, as a figure retraced once more in fresh ink.',
            },
        ],
    },
    blueprint: {
        shape: [
            {
                name: 'The chart recorder',
                text: 'A strip-chart recorder on blueprint paper, a millimetre grid behind the number, technical mono capitals, the change as its own status plate.',
            },
            {
                name: 'The title block',
                text: 'A drawing’s title block, the tile parted into cells by drawn rules, the change as its own status plate.',
            },
            {
                name: 'The revision cloud',
                text: 'A section drawing, the card hatched at forty-five degrees, a dashed frame, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The chart recorder',
                text: "While the figure loads, a small lit point sweeps the full width under the label at a steady, linear pace with no easing, as a recorder's pen tracking a level line, and loops back to start; it keeps tracking until the reading is drawn.",
            },
            {
                name: 'The title block',
                text: 'While the figure loads, a dashed rule under the label steps along in five even, linear jumps, as a drafting hand ruling tick marks; it keeps stepping until the reading is drawn.',
            },
            {
                name: 'The dimension line',
                text: 'While the figure loads, a white dimension line draws itself from left to right at a steady pace, then snaps back to nothing and draws again, as a dimension re-ruled on every revision; it keeps drawing until the reading is drawn.',
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
        interactive: [
            {
                name: 'Drafted',
                text: 'As a link or a filter: the millimetre grid behind the number brightens on hover, a cyan-white rule locks on focus, and the plate dims a touch while pressed, as a line drafted then set.',
            },
            {
                name: 'The title cell lights',
                text: 'As a link or a filter: the drawn rule under the label doubles in weight on hover, a dashed cyan frame appears on focus, and the frame thickens further to 3px while pressed.',
            },
            {
                name: 'The revision marks',
                text: 'As a link or a filter: a faint hatch of revision marks appears over the plate on hover, a thin cyan rule sits out from the frame on focus, and the whole tile ticks inward slightly while pressed, as a revision noted and checked.',
            },
        ],
        live: [
            {
                name: 'Redrawn',
                text: 'A new reading: the number is replaced at once, as both characters had it — no picture plays, the value simply is the new value.',
            },
            {
                name: 'The pen steps',
                text: "A new reading: the number eases in from a short offset in three even, linear steps, as a recorder's pen stepping to a new line on the chart.",
            },
            {
                name: 'Retraced in ink',
                text: 'A new reading: the number settles into place from a short vertical offset at one steady, linear pace, as a figure retraced once in white ink.',
            },
        ],
    },
    solstice: {
        shape: [
            {
                name: 'The low sun',
                text: 'Charcoal paper lit from below by a low sun, a warm glow rising behind the number, the change as its own status plate.',
            },
            { name: 'The embers', text: 'Embers on charcoal, a hot halo behind the number, the change as its own status plate.' },
            { name: 'The red sky', text: 'The day’s horizon, a warm band of light across the foot of the card, the change as its own status plate.' },
        ],
        loading: [
            {
                name: 'The low sun',
                text: "While the figure loads, a warm disc of light at the card's foot swells wider and settles back, slow as a sun breathing behind haze; it keeps moving until the reading is drawn.",
            },
            {
                name: 'The embers',
                text: 'While the figure loads, a small coal at the foot of the card brightens hot and cools back to a dull glow, over and over; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The sun crosses',
                text: 'While the figure loads, a low amber sun drifts from one edge of the card to the other and back, never resting; it keeps moving until the reading is drawn.',
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
        interactive: [
            {
                name: 'The ember glows',
                text: 'As a link or a filter: the card tints warmer and its border lights amber on hover, an amber ring forms on focus, and the glow banks low the instant it is pressed.',
            },
            {
                name: 'The horizon brightens',
                text: 'As a link or a filter: the rust tint under the number warms on hover, a rust-coloured ring marks focus, and the warmth deepens further the instant it is pressed.',
            },
            {
                name: 'The sun flares',
                text: 'As a link or a filter: the card lights brighter amber on hover, a wide amber ring forms on focus, and it flares hottest the instant it is pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            {
                name: 'A flare of sun',
                text: 'A new reading: the number flares bright for a moment, as if the low sun caught it, then settles back to its usual warmth.',
            },
            {
                name: 'The day moves on',
                text: "A new reading: the number lifts off the horizon and settles back down, slowing as it lands, the way the sun's last light keeps moving before it rests.",
            },
        ],
    },
    brutalism: {
        shape: [
            {
                name: 'The slab',
                text: 'A concrete slab, a heavy black frame with a hard offset shadow, heavy capitals, the change as its own status plate.',
            },
            { name: 'The sticker sheet', text: 'A white slab in the 3px line on a 6px hard shadow, flat full paint, the number huge and heavy, the change as its own status plate.' },
            {
                name: 'The warning poster',
                text: 'A poster block, a 3px frame with a hard offset shadow in the accent, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The stamp',
                text: 'While the figure loads, a black block stamps down onto the card, lifts, and stamps again, no easing, hard steps only; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The drop',
                text: 'While the figure loads, a lavender block drops in from above the card and lands with a hard thud, again and again; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The hoisted lintel',
                text: 'While the figure loads, the reading’s place at the card’s foot is a well with a lintel hoisted in it on two cables: four hard lifts, held, let go to fall free and left to rest; it keeps going until the reading is drawn.',
            },
        ],
        tone: [
            {
                name: 'The slab',
                text: 'The change as a block with the hard shadow; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The sticker sheet',
                text: 'The change as a small square slab, no tilt; a warning or destructive figure prints its number on the tone’s plate framed in ink on a 3px shadow, and the card is taped off along its foot with 45 degree hazard stripes.',
            },
            {
                name: 'The warning poster',
                text: 'The change as a block with a hard shadow; a warning or destructive figure prints its number on the tone’s block, framed in ink.',
            },
        ],
        interactive: [
            {
                name: 'Slammed',
                text: 'As a link or a filter: the hard offset shadow grows on hover, a thick offset outline frames it on focus, and the whole tile slams flat against the card the instant it is pressed.',
            },
            {
                name: 'The sticker peels',
                text: 'As a link or a filter: the lavender plate tints brighter on hover, a thick black ring marks focus, and the plate snaps back to flat the instant it is pressed.',
            },
            {
                name: 'The poster shakes',
                text: 'As a link or a filter: the tile stands on its shadow; pointed at it inverts, nothing moves; focus lifts it under the two-channel ring; pressed it is driven onto its footprint.',
            },
        ],
        live: [
            { name: 'Slammed onto its yellow offset', text: 'A new reading: the number is slammed onto a yellow offset, three units of fall, twelve standing, struck off in one cut.' },
            {
                name: 'Kicked',
                text: 'A new reading: the number jolts straight up and lands, in two hard steps with no easing, as a needle hitting its stop.',
            },
            { name: 'Shoved', text: 'A new reading: the number shoves sideways and snaps back, in two hard steps, no easing anywhere.' },
        ],
    },
    deco: {
        shape: [
            {
                name: 'The gilt frame',
                text: 'A gilt frame on lacquer, a double gold rule, a faint sunburst rising behind the number, the change as its own status plate.',
            },
            {
                name: 'The marquee',
                text: 'A theatre marquee, a row of bulbs along the top and foot of the card, the change as its own status plate.',
            },
            {
                name: 'The gilt notice',
                text: 'An Art Deco tower, fine gold setback lines rising behind the figure, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The gilt frame',
                text: 'While the figure loads, a thin gold glint sweeps once across the card under the label and loops back to start; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The marquee',
                text: 'While the figure loads, a row of marquee bulbs along the foot of the card chases in hard jumps, bulb to bulb; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The sunburst opens',
                text: "While the figure loads, a gold sunburst at the card's foot opens ray by ray and glows, then closes back down to begin again; it keeps moving until the reading is drawn.",
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
        interactive: [
            {
                name: 'The gold glints',
                text: 'As a link or a filter: the card tints gold and the gold rule brightens on hover, a gold ring forms on focus, and it dims back toward lacquer the instant it is pressed.',
            },
            {
                name: 'The bulbs chase',
                text: 'As a link or a filter: the gold tint deepens on hover, a double gold ring frames it on focus, and the tint lightens back the instant it is pressed.',
            },
            {
                name: 'The curtain rises',
                text: "As a link or a filter: a bright gold ring traces the card's inner edge on hover, holds solid for focus, and the ring itself is the only thing that was ever there to press.",
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            {
                name: 'The bulbs chase',
                text: 'A new reading: the number flashes gold three times in quick hard jumps, like marquee bulbs chasing past it.',
            },
            { name: 'Gilded', text: 'A new reading: the number flares gold and swells once, settling back to lacquer, as if freshly gilded.' },
        ],
    },
    phantom: {
        shape: [
            {
                name: 'The evidence card',
                text: 'A white evidence card pinned to the board, the label slanted, the number stamped, the change as its own status plate.',
            },
            {
                name: 'The calling card',
                text: 'A black calling card under a halftone, the label skewed in display capitals, the change as its own status plate.',
            },
            {
                name: 'The ransom note',
                text: 'A ransom note, a halftone over the card, the number with a red offset shadow, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The stamp ring',
                text: 'While the figure loads, a red ring stamps down onto the card, swelling in from large to its true size, again and again; it keeps moving until the reading is drawn.',
            },
            {
                name: 'Stamped askew',
                text: 'While the figure loads, the halftone over the whole card shuffles a touch left, then right, like a photocopy slipping on the glass; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The string is pulled',
                text: "While the figure loads, a red thread along the card's foot is pulled taut from nothing to full length, in sharp jerks, then slackens to start again; it keeps moving until the reading is drawn.",
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
                name: 'The ransom note',
                text: 'The change as a skewed card; a warning or destructive note is stamped askew on the label, in the tone’s plate with a ruled border.',
            },
        ],
        interactive: [
            {
                name: 'The pin glints',
                text: "As a link or a filter: a red ring glints at the card's edge on hover, a dashed red outline marks focus, and the card tilts a touch the instant it is pressed.",
            },
            {
                name: 'The card is drawn',
                text: 'As a link or a filter: the card tints darker on hover, a solid red ring marks focus, and it tints darker still the instant it is pressed.',
            },
            {
                name: 'The note is unfolded',
                text: 'As a link or a filter: a hard red-tinted shadow appears on hover, a red ring marks focus, and the card drops flush against the board the instant it is pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            {
                name: 'Snatched',
                text: 'A new reading: the number jerks sideways and tilts twice, hard jumps with no easing, as if snatched off the board.',
            },
            {
                name: 'The string twangs',
                text: 'A new reading: the number jolts up, dips, and lands, three sharp steps like a plucked string settling.',
            },
        ],
    },
    retro: {
        shape: [
            {
                name: 'The 1995 dialog',
                text: 'A 1995 dialog, a raised grey bevel around the tile, the label in the system face without capitals, the change as its own status plate.',
            },
            {
                name: 'The flat field',
                text: 'A 1995 performance monitor, a black well with a green grid behind the number, the change as its own status plate.',
            },
            { name: 'The message box', text: 'A plain 1995 window, a 1px black frame with a hard drop shadow, the change as its own status plate.' },
        ],
        loading: [
            {
                name: 'The progress blocks',
                text: 'While the figure loads, blue progress blocks fill under the label block by block, then start over; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The marquee bar',
                text: 'While the figure loads, a group of three blue blocks slides across and comes round again; it keeps moving until the reading is drawn.',
            },
            {
                name: 'The defragmenter',
                text: 'While the figure loads, blocks of colour shift through the card in hard steps, as a defragmenter’s map; it keeps moving until the reading is drawn.',
            },
        ],
        tone: [
            {
                name: 'The 1995 dialog',
                text: 'The change as a raised button; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            { name: 'The flat field', text: 'The change as a flat square field with a 1px rule, no bevel.' },
            {
                name: 'The message box',
                text: 'The change as a sunken field; a warning or destructive figure is shown framed in its colour, as a message box asks for attention.',
            },
        ],
        interactive: [
            {
                name: 'The bevel presses',
                text: 'As a link or a filter: the raised grey bevel catches a brighter highlight on hover, a dotted Windows focus rectangle appears on focus, and the bevel inverts to sunken the instant it is pressed.',
            },
            {
                name: 'The monitor glows',
                text: 'As a link or a filter: the green phosphor grid glows brighter on hover, a dotted focus rectangle locks on for focus, and the grid dims a shade the instant it is pressed.',
            },
            {
                name: 'The window drags',
                text: 'As a link or a filter: the hard drop shadow grows a pixel on hover, a thin black outline marks focus, and the shadow flattens to nothing the instant it is pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            { name: 'Repainted', text: 'A new reading: the number repaints in two hard jumps, like a screen redrawing line by line.' },
            {
                name: 'Scrolled one',
                text: 'A new reading: the old figure scrolls up out of its well in one hard step and the new one drops in behind it.',
            },
        ],
    },
    grotesk: {
        shape: [
            {
                name: 'The transit board',
                text: 'A Swiss transit board, a thick bar in the series colour across the top, bold grotesque, the change as its own status plate.',
            },
            {
                name: 'The underlined figure',
                text: 'A Swiss poster, the number huge and flush left, a hairline under the label, the change as its own status plate.',
            },
            {
                name: 'The index colour',
                text: 'A Swiss index card, a red rule down the left margin, a hairline along the top, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The transit board',
                text: 'While the figure loads, a line runs across under the label; it keeps moving until the reading is drawn.',
            },
            { name: 'The Swiss poster', text: 'While the figure loads, three blocks cut in; it keeps moving until the reading is drawn.' },
            {
                name: 'The flap board',
                text: 'While the figure loads, three bars flip over one after the other, as a departure board’s flaps; it keeps moving until the reading is drawn.',
            },
        ],
        tone: [
            {
                name: 'Indexed',
                text: 'The change on a square plate with the arrows ↗ and ↘; a warning or destructive figure carries a 6 px bar of its tone down the start edge and the tone’s word before the number, the number itself ink on paper.',
            },
            { name: 'The underlined figure', text: 'The change on a flat plate with a heavy rule under it, square.' },
            {
                name: 'The index colour',
                text: 'The change on a flat plate; a warning or destructive figure prints its number on the tone’s plate, the poster’s index colour.',
            },
        ],
        interactive: [
            {
                name: 'The bar thickens',
                text: 'As a link or a filter: the colour bar across the top thickens on hover, a red rule-width ring marks focus, and the bar thins back the instant it is pressed.',
            },
            {
                name: 'The rule thickens',
                text: 'As a link or a filter: on hover the rule turns red and 7 px thick over a faint red wash, focus is the two-channel ring with the red plate falling into register on the tile, and a press thickens the rule in the deeper red, never grey.',
            },
            {
                name: 'The flap turns',
                text: 'As a link or a filter: a departure-board flap turns halfway on hover, flips fully for focus, and settles back the instant it is pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            {
                name: 'Re-registered',
                text: 'A new reading: the number is written at once; behind it a red copy of the number starts a few pixels off and falls into register along the closing spiral, clockwise, in 8 units.',
            },
            {
                name: 'Shifted',
                text: 'A new reading: the old figure slides out to the left and the new one slides in from the right, easing to a stop.',
            },
        ],
    },
    nostromo: {
        shape: [
            {
                name: 'The CRT trace',
                text: 'A green-black CRT in the beige bezel, scanlines over the card, mono capitals, the change as its own status plate.',
            },
            {
                name: 'The indicator panel',
                text: 'The ship’s indicator panel, the label on embossed label tape, the change as its own status plate.',
            },
            {
                name: 'The klaxon',
                text: 'The ship computer’s console, scanlines over the whole tile, a dark screen ringed in green, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The CRT trace',
                text: 'While the figure loads, a sweep runs across the tube under the label; it keeps moving until the reading is drawn.',
            },
            { name: 'The indicator panel', text: 'While the figure loads, the lamps scan; it keeps moving until the reading is drawn.' },
            {
                name: 'The motion tracker',
                text: 'While the figure loads, a ring pings out from the middle of the card, as the motion tracker sweeps; it keeps moving until the reading is drawn.',
            },
        ],
        tone: [
            {
                name: 'The klaxon frame, on tape',
                text: 'The change on its tone’s label tape, cut square; a warning or failed figure is framed all round, 3 px, in its tone’s ink, the figure in the plain ink; nothing moves.',
            },
            {
                name: 'The indicator panel',
                text: 'The change as a lit indicator lamp; a warning or destructive figure shows the note in the label on the tone’s plate.',
            },
            {
                name: 'The klaxon',
                text: 'The change as a lit lamp; a warning or destructive figure is framed all round in its colour, as the bridge alarm frames the screen.',
            },
        ],
        interactive: [
            {
                name: 'The tube warms',
                text: 'As a link or a filter: the CRT scanlines brighten on hover, a green phosphor ring locks on for focus, and the glow dims back the instant it is pressed.',
            },
            {
                name: 'The lamp lights',
                text: 'As a link or a filter: the lamp before the label lights in ink on hover on a ground one step lighter, focus is the two-channel ring with the lamp lit orange, a press turns the plate into a well.',
            },
            {
                name: 'The console locks',
                text: 'As a link or a filter: the green ring around the screen brightens on hover, a scan ring sweeps once for focus, and the ring settles the instant it is pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            { name: 'A blip', text: 'A new reading: the number flares once on the tube like a radar blip and settles back to green.' },
            {
                name: 'The trace rolls',
                text: 'A new reading: the old figure rolls off the top of the tube and the new one rolls in from the bottom, in two hard steps.',
            },
        ],
    },
    titanium: {
        shape: [
            {
                name: 'The milled plate',
                text: 'A milled titanium plate, a brushed grain on the tile, the number in instrument mono, the change as its own status plate.',
            },
            {
                name: 'The instrument dial',
                text: 'An instrument dial, a knurled band along the top of the tile, the change as its own status plate.',
            },
            {
                name: 'The anodised tag',
                text: 'An anodised badge, a wide rounded tile with a primary rim and a diagonal sheen, the change as its own status plate.',
            },
        ],
        loading: [
            {
                name: 'The milled plate',
                text: 'While the figure loads, the cutter runs along the edge under the label; it keeps moving until the reading is drawn.',
            },
            { name: 'The instrument dial', text: 'While the figure loads, the knurl rolls; it keeps moving until the reading is drawn.' },
            {
                name: 'The lathe',
                text: 'While the figure loads, knurled ridges run along the card, as a part turning on a lathe; it keeps moving until the reading is drawn.',
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
        interactive: [
            {
                name: 'The edge catches light',
                text: 'As a link or a filter: the brushed grain brightens on hover, an anodised ring on focus, dims when pressed.',
            },
            {
                name: 'The knurl turns',
                text: 'As a link or a filter: the knurled band brightens on hover, a machined ring on focus, settles when pressed.',
            },
            {
                name: 'The badge tilts',
                text: 'As a link or a filter: the diagonal sheen shifts on hover, a primary-rim ring on focus, settles when pressed.',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'A new reading: the number is replaced at once, as both characters had it.' },
            { name: 'A click of the dial', text: 'A new reading: the number jolts once, as a needle does, in 2 hard steps.' },
            { name: 'A glint', text: 'A new reading: the number flares with light once, slowing as it lands.' },
        ],
    },
};

/**
 * Round 1's verdicts (Kenny, 2026-10-06 19:24), in the order of ASPECTS:
 * shape, loading, tone, interactive, live. A number is settled and not asked
 * again; '' is open in round 2: new shapes for phantom, retro, grotesk,
 * nostromo and titanium, with what Kenny wants to see again in the new shape
 * (phantom's tone and hover; every aspect of retro and grotesk; nostromo's
 * hover; titanium's loading, six options, and hover). A settled aspect is
 * drawn in the new shape too.
 * Round 2's verdicts (Kenny, 2026-10-06 20:59) settle all but titanium's
 * loading, which he approved so much he wants a loading demo of its own.
 * Retro's and grotesk's loading '6' is the plain package loading, the empty
 * cell the dialog flipped to (fixed in the kit since).
 * Form v39 (2026-10-06 21:17): titanium's loading is The anodising bath (1).
 * @type {Record<string, string[]>}
 */
const PICKED = {
    formal: ['2', '3', '3', '2', '3'],
    light: ['3', '2', '3', '2', '2'],
    dark: ['3', '1', '3', '1', '3'],
    cyberpunk: ['3', '3', '2', '1', '3'],
    synthwave: ['3', '1', '1', '2', '3'],
    pastel: ['3', '3', '1', '1', '3'],
    terminal: ['2', '2', '2', '2', '1'],
    forest: ['2', '2', '3', '2', '3'],
    'high-contrast': ['1', '1', '3', '2', '1'],
    sepia: ['2', '3', '3', '2', '3'],
    blueprint: ['3', '3', '3', '3', '3'],
    solstice: ['2', '3', '1', '1', '2'],
    brutalism: ['2', '3', '2', '3', '1'],
    deco: ['1', '3', '1', '1', '3'],
    phantom: ['2', '2', '1', '1', '3'],
    retro: ['1', '6', '1', '1', '2'],
    grotesk: ['1', '6', '1', '2', '2'],
    nostromo: ['2', '2', '1', '2', '2'],
    titanium: ['1', '1', '1', '2', '3'],
};
const keptOf = (/** @type {string} */ t, /** @type {Aspect} */ id) => PICKED[t]?.[ASPECTS.findIndex((a) => a.id === id)] ?? '';
// Round 2's new options replace an aspect's, per aspect (each carries its
// own key, the attribute value its CSS answers to; round 1's are 1, 2, 3).
for (const file of [R2A, R2B, R2C, R2D])
    for (const [t, aspects] of Object.entries(file))
        for (const [id, options] of Object.entries(aspects)) if (options.length >= 3) IDEAS[t][id] = options;
const keyOf = (/** @type {string} */ t, /** @type {Aspect} */ id, /** @type {string} */ n) => IDEAS[t]?.[id]?.[Number(n) - 1]?.key ?? n;
const MOST = 6;

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="kpi"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// five choices per theme, each option's name and what it does as its hint.
// Round 2 asks only what Kenny sent back; the rest is settled and hidden.
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
for (const theme of Object.keys(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    const open = ASPECTS.filter(({ id }) => !keptOf(theme, id));
    p.textContent = open.length
        ? `Round 2: ${open.map(({ id, label }) => `${label.toLowerCase()} (${IDEAS[theme][id].length})`).join(', ')}, each drawn in the shape you pick first; everything else is settled as you picked it.`
        : 'Approved: every aspect is settled as you picked it.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

const TILE = (kind) => {
    if (kind === 'toggle')
        return `<button type="button" class="kp-kpi kp-kpi--toggle" data-kf-tile aria-pressed="false">
    <span class="kp-kpi__label">Open incidents</span>
    <span class="kp-kpi__hint" aria-hidden="true"><span data-kp-when="off">Filter</span><span data-kp-when="on">Filtering ×</span></span>
    <span class="kp-kpi__value" data-kf-value>3</span>
    <span class="kp-kpi__trend" data-kf-trend>2 new today</span>
</button>`;
    if (kind === 'link')
        return `<a class="kp-kpi" href="#h-kpi" data-kf-tile>
    <span class="kp-kpi__label">Flow now</span>
    <span class="kp-kpi__value" data-kf-value>412<small>m³/h</small><span class="kp-kpi__note">avg 15 min</span></span>
    <span class="kp-kpi__trend" data-kf-trend><span class="kp-kpi__delta" data-kp-direction="up" data-kp-tone="good">6 %</span> on yesterday</span>
</a>`;
    return `<div class="kp-kpi" data-kf-tile>
    <span class="kp-kpi__label">Readings today</span>
    <span class="kp-kpi__value" data-kf-value>18 240</span>
    <span class="kp-kpi__trend" data-kf-trend><span class="kp-kpi__delta" data-kp-direction="down" data-kp-tone="bad">2 %</span> on yesterday</span>
</div>`;
};

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-kf-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'kf-aspect';
    box.setAttribute('data-kf-aspect', id);
    box.setAttribute('aria-labelledby', `h-kf-${id}`);
    const head = document.createElement('div');
    head.className = 'kf-aspect__head';
    head.innerHTML = '<h3></h3><p></p>';
    head.firstElementChild.id = `h-kf-${id}`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'kf-trio';
    for (let at = 1; at <= MOST; at++) {
        const cell = document.createElement('div');
        cell.className = 'kf-col';
        cell.setAttribute('data-kf-vary', id);
        cell.setAttribute('data-kf-option', String(at));
        cell.innerHTML =
            `<p class="kf-label"><span class="kf-label__no">${label} · ${at}</span> <span data-kf-name></span></p>` +
            `<p class="kf-desc" data-kf-desc></p>` +
            `<div class="kp-kpis kf-strip" data-kf>${TILE('plain')}${TILE('link')}${TILE('toggle')}</div>`;
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
    const preview = section.querySelector('[data-kf-preview]');
    const t = theme();
    for (const { id } of ASPECTS) {
        const key = keyOf(t, id, now[id]);
        if (preview?.getAttribute(`data-kf-${id}`) !== key) preview?.setAttribute(`data-kf-${id}`, key);
    }
    // A settled aspect has no row; a row hides the cells its theme has no option for.
    for (const box of section.querySelectorAll('[data-kf-aspect]'))
        /** @type {HTMLElement} */ (box).hidden = Boolean(keptOf(t, /** @type {Aspect} */ (box.getAttribute('data-kf-aspect'))));
    for (const cell of section.querySelectorAll('[data-kf-vary]')) {
        const vary = cell.getAttribute('data-kf-vary');
        const option = cell.getAttribute('data-kf-option') ?? '1';
        const strip = cell.querySelector('[data-kf]');
        for (const { id } of ASPECTS) {
            const value = keyOf(t, id, id === vary ? option : now[id]);
            if (strip?.getAttribute(`data-kf-${id}`) !== value) strip?.setAttribute(`data-kf-${id}`, value);
        }
        cell.classList.toggle('kf-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-kf-picks]');
    const idea = IDEAS[t];
    if (words && idea)
        words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1]?.name ?? ''}`).join(' · ');
    for (const cell of section.querySelectorAll('[data-kf-vary]')) {
        const vary = /** @type {Aspect} */ (cell.getAttribute('data-kf-vary'));
        const option = idea?.[vary]?.[Number(cell.getAttribute('data-kf-option') ?? '1') - 1];
        /** @type {HTMLElement} */ (cell).hidden = !option;
        const name = cell.querySelector('[data-kf-name]');
        const desc = cell.querySelector('[data-kf-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* --------------------------------------------------- states, tone, live */

const log = /** @type {HTMLElement} */ (document.querySelector('[data-kf-log]'));
const say = (/** @type {string} */ text) => {
    if (log) log.textContent = text;
};

/** Every state button in the controls, toggled as a radio group within its own `role="group"`. */
function wireRadioGroup(selectorAttr, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${selectorAttr}]`)]);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const b of buttons) b.setAttribute('aria-pressed', String(b === button));
            apply(button.getAttribute(selectorAttr));
        });
    }
}

const allTiles = () => /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-kf-tile]')]);

wireRadioGroup('data-kf-state', (state) => {
    for (const tile of allTiles()) {
        tile.toggleAttribute('data-kp-loading', state === 'loading');
        tile.setAttribute('aria-busy', String(state === 'loading'));
        const value = tile.querySelector('[data-kf-value]');
        const trend = tile.querySelector('[data-kf-trend]');
        if (!value || !trend) continue;
        if (state === 'loading') {
            value.innerHTML = '<span class="kp-skeleton" style="inline-size: 60%"></span>';
            trend.innerHTML = '<span class="kp-skeleton" style="inline-size: 80%"></span>';
        } else {
            value.innerHTML = value.getAttribute('data-kf-original') ?? value.innerHTML;
            trend.innerHTML = trend.getAttribute('data-kf-original') ?? trend.innerHTML;
        }
    }
    say(`State: ${state}.`);
});

// Remember each tile's drawn content, so Loading can restore it.
for (const tile of allTiles()) {
    const value = tile.querySelector('[data-kf-value]');
    const trend = tile.querySelector('[data-kf-trend]');
    if (value && !value.hasAttribute('data-kf-original')) value.setAttribute('data-kf-original', value.innerHTML);
    if (trend && !trend.hasAttribute('data-kf-original')) trend.setAttribute('data-kf-original', trend.innerHTML);
}

wireRadioGroup('data-kf-tone', (tone) => {
    for (const tile of allTiles()) {
        if (tone) tile.setAttribute('data-kp-tone', tone);
        else tile.removeAttribute('data-kp-tone');
    }
    say(`Tone: ${tone || 'none'}.`);
});

document.querySelector('[data-kf-live]')?.addEventListener('click', () => {
    for (const tile of allTiles()) {
        tile.classList.remove('kf-flash');
        // Force the retrigger of the live-update rule on the next frame.
        void tile.offsetWidth;
        tile.classList.add('kf-flash');
    }
    say('Live update: a new reading landed.');
});

wireRadioGroup('data-kf-speed', (speed) => {
    document.documentElement.style.setProperty('--kf-speed', speed);
    say(`Speed: ${speed === '1' ? 'full' : speed}×.`);
});

// A toggle tile flips its own pressed state; a link tile logs instead of navigating.
document.addEventListener('click', (event) => {
    const toggle = /** @type {Element | null} */ (event.target instanceof Element ? event.target.closest('.kp-kpi--toggle[data-kf-tile]') : null);
    if (toggle) {
        toggle.setAttribute('aria-pressed', String(toggle.getAttribute('aria-pressed') !== 'true'));
        return;
    }
    const link = /** @type {HTMLAnchorElement | null} */ (event.target instanceof Element ? event.target.closest('a.kp-kpi[data-kf-tile]') : null);
    if (link) {
        event.preventDefault();
        say('The link tile would open its detail here.');
    }
});

compose();
// The rows follow the theme: its settled aspects hide, its own option names show.
new MutationObserver(compose).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// Themes a reviewer already approved are reopened with the new interactive
// aspect added (phase 1: no theme has been judged yet, so this is empty).
