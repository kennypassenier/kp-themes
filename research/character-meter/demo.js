// research/character-meter: the first component of the character round
// (Kenny, form v18, 2026-10-05), all 22 themes in one demo judged through the
// review kit. Round 3 (Kenny, 2026-10-05 18:45: "I like the shape of option 1,
// but the loading behaviour of option 2, so you need to keep these things
// separate so I could choose one over another, also do this for the other
// things you like to show me"): nothing is bundled any more. Each theme's
// meter has five aspects, each picked on its own from three options: the
// shape, the loading picture, how the share arrives, how a new tone shows,
// and how the mark moves and stands past the end.
//
// The meters are the package's own: setMeter() (js/kpi.js) writes their
// share, mark, tone, loading state and ARIA. Every aspect is CSS only, in
// meters.css, keyed by one attribute each on the meters' wrapper
// (`data-cm-shape`, `data-cm-loading`, `data-cm-arrival`, `data-cm-tone`,
// `data-cm-mark`), so any combination composes. On the page: one composed
// preview showing the current picks, and per aspect a row of three meters
// that differ in that aspect only. The controls sit in the section's
// `data-review-controls` container, which the review kit mirrors into its
// dialog.

import { setMeter } from '../../js/kpi.js';
import { THEMES } from '../../js/theme-registry.js';

/** @typedef {{ name: string, text: string }} Option */
/** @typedef {'shape' | 'loading' | 'arrival' | 'tone' | 'mark'} Aspect */

/** The five aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    { id: 'shape', label: 'Shape', about: 'The track, the share, the mark and the sign past the end. Press nothing: compare them as they stand.' },
    { id: 'loading', label: 'While loading', about: 'The picture a meter shows while it measures. Press Loading.' },
    { id: 'arrival', label: 'How the share arrives', about: 'How the share comes in after loading. Press Drawn to replay it.' },
    {
        id: 'tone',
        label: 'When the tone changes',
        about: 'How the meter shows a new tone. Press Warning, then Destructive, then None.',
    },
    {
        id: 'mark',
        label: 'The mark past the end',
        about: 'How the mark moves, and where and how a mark beyond the range stands. The upper meter moves its mark when you press Mark past the end; the lower one has its mark at 115 % throughout.',
    },
];

/**
 * Per theme, three options for each aspect. The shape's option 1 is the
 * shape approved in round 1 (forest, retro, grotesk: round 2's new shape);
 * the other four reuse round 2's option names, split into their parts.
 * @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            {
                name: 'The bound volume and its ribbon',
                text: "The track is a book's fore-edge, page after page; the share is the navy buckram binding laid over it; the mark is a gold ribbon bookmark hanging out below the book; past the end one more volume leans past the shelf.",
            },
            {
                name: 'The ledger column',
                text: 'A column ruled in a ledger: a hairline above and below and a faint column rule every tenth; the share is the navy entry written into it. The mark is a tick-and-tie: two ink hairlines with paper between, standing out of the column. Past the end the entry is closed with the double rule and carried forward, "c/f".',
            },
            {
                name: 'The signature line and its seal',
                text: 'A dotted signature line on the page; the share is the signature in navy ink, heavier where the pen pressed; the mark is a red wax seal pressed on the line; past the end a flourish (~).',
            },
        ],
        loading: [
            {
                name: 'Written into the ledger',
                text: 'The pages riffle: a shade runs slowly along the fore-edge.',
            },
            {
                name: 'Stamped and filed',
                text: 'The ribbon bookmark slides along the fore-edge and back.',
            },
            {
                name: 'Counted in tenths',
                text: 'A dotted leader is written dot by dot, "to be entered".',
            },
        ],
        arrival: [
            {
                name: 'Written into the ledger',
                text: 'The share is drawn in from the left slowing as it lands.',
            },
            {
                name: 'Stamped and filed',
                text: 'The share opens from its middle line slowing as it lands.',
            },
            {
                name: 'Counted in tenths',
                text: 'The share is drawn in from the left in 10 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Written into the ledger',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Stamped and filed',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
            {
                name: 'Counted in tenths',
                text: 'A new tone swells the meter once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'Written into the ledger',
                text: "The mark moves easing in and out; a mark past the end stops at the meter's end, » after it.",
            },
            {
                name: 'Stamped and filed',
                text: 'The mark moves slowing as it lands; a mark past the end stands just outside the end, › after it.',
            },
            {
                name: 'Counted in tenths',
                text: 'The mark moves in 5 hard steps; a mark past the end leans over the end, ‡ beside it.',
            },
        ],
    },
    light: {
        shape: [
            {
                name: 'Daylight',
                text: 'A soft pill in the light: the indigo share brightens towards its end, the mark is a thin gnomon with a short shadow, and past the end the light spills out in a cyan glint.',
            },
            {
                name: 'The seam and its circle',
                text: "Light's divider as a meter: a 1px seam, the share an indigo pill laid over it, and the mark the divider's own open circle resting on the seam. Past the end the seam runs on to a small cyan circle.",
            },
            {
                name: 'The folded note',
                text: 'A paper note lifted off the page by a soft shadow; the share is indigo laid inside its edge; the mark is a paper pin with a cyan head; past the end the note’s corner folds over.',
            },
        ],
        loading: [
            {
                name: 'Morning light',
                text: 'A band of daylight crosses the track, slowly.',
            },
            {
                name: 'The shadow swings',
                text: 'The thin shadow of a gnomon sweeps across the track.',
            },
            {
                name: 'Through the window',
                text: 'Window panes of light drift along the track.',
            },
        ],
        arrival: [
            {
                name: 'Morning light',
                text: 'The share is drawn in from the left slowing as it lands.',
            },
            {
                name: 'The shadow swings',
                text: 'The share stretches out from the start slowing as it lands.',
            },
            {
                name: 'Through the window',
                text: 'The share is drawn in from the left in 4 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Morning light',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'The shadow swings',
                text: 'A new tone swells the meter once, slowing as it lands.',
            },
            {
                name: 'Through the window',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'Morning light',
                text: "The mark moves easing in and out; a mark past the end stops at the meter's end, › after it.",
            },
            {
                name: 'The shadow swings',
                text: 'The mark moves easing in and out; a mark past the end leans over the end, › beside it.',
            },
            {
                name: 'Through the window',
                text: 'The mark moves in 4 hard steps; a mark past the end stands just outside the end, › after it.',
            },
        ],
    },
    dark: {
        shape: [
            {
                name: 'The machined channel',
                text: 'A channel with its corners cut at forty-five degrees; the share is bright machined metal with the oxide film along its top edge; the mark is a V milled into the edge; past the end the part runs out with a chamfered tip.',
            },
            {
                name: 'The spectrometer',
                text: 'A black slit with a ruler tick every tenth above and below. The share is one emission line whose colour is read from the oxide film at that point, cyan at the start, violet, magenta, lime at the end; the mark is dark\'s closing bracket "]" in near-white. Past the end a second bracket in magenta.',
            },
            {
                name: 'The OLED strip',
                text: 'A pure black strip in a hairline; the share is lit, with a bright top line; the mark is one lit pixel column with a dot of light above it; past the end a +.',
            },
        ],
        loading: [
            {
                name: 'Machined',
                text: 'The empty channel’s engraved scale, still.',
            },
            {
                name: 'Milled in passes',
                text: 'Engraved cross-hatching in the channel, still.',
            },
            {
                name: 'Pressed in the die',
                text: 'A row of centre-punch dots, still.',
            },
        ],
        arrival: [
            {
                name: 'Machined',
                text: 'The share stretches out from the start at an even pace.',
            },
            {
                name: 'Milled in passes',
                text: 'The share stretches out from the start in 5 hard steps.',
            },
            {
                name: 'Pressed in the die',
                text: 'The share opens from its middle line at an even pace.',
            },
        ],
        tone: [
            {
                name: 'Machined',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Milled in passes',
                text: 'A new tone knocks the meter up and back once, at an even pace.',
            },
            {
                name: 'Pressed in the die',
                text: 'A new tone swells the meter once, at an even pace.',
            },
        ],
        mark: [
            {
                name: 'Machined',
                text: "The mark moves at an even pace; a mark past the end stops at the meter's end, ▸ after it.",
            },
            {
                name: 'Milled in passes',
                text: 'The mark moves in 4 hard steps; a mark past the end stands just outside the end, › after it.',
            },
            {
                name: 'Pressed in the die',
                text: 'The mark moves at an even pace; a mark past the end leans over the end, ▸ beside it.',
            },
        ],
    },
    cyberpunk: {
        shape: [
            {
                name: 'The neon tube with a glitch tick',
                text: 'A yellow neon tube in a dark glass sleeve; the mark is a cyan tick that glitches every three seconds; past the end the tube reads OVR in red.',
            },
            {
                name: 'The HUD segment gauge',
                text: 'A notched readout: the share is yellow plates split by void slits, the leading plate cut at forty-five degrees, over a rail of dim yellow dashes. The mark is a cyan target notch with a void cut through the plates. Past the end a red notched plate.',
            },
            {
                name: 'The barcode',
                text: 'A dim barcode as the track; the share is the same bars printed in yellow; the mark is a scanner’s cyan bracket; past the end ERR in red.',
            },
        ],
        loading: [
            {
                name: 'Ignition',
                text: 'The tube tries to strike, flickers twice, then dark.',
            },
            {
                name: 'Data burst',
                text: 'Yellow hazard stripes run along the sleeve.',
            },
            {
                name: 'Packet sync',
                text: 'A cyan data packet hops along the tube.',
            },
        ],
        arrival: [
            {
                name: 'Ignition',
                text: 'The share is drawn in from the left in 6 hard steps.',
            },
            {
                name: 'Data burst',
                text: 'The share is cut in from the left with a slanted edge slowing as it lands.',
            },
            {
                name: 'Packet sync',
                text: 'The share stretches out from the start in 8 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Ignition',
                text: 'A new tone jolts the meter sideways, in 4 hard steps.',
            },
            {
                name: 'Data burst',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Packet sync',
                text: 'A new tone knocks the meter up and back once, in 3 hard steps.',
            },
        ],
        mark: [
            {
                name: 'Ignition',
                text: "The mark moves in 3 hard steps; a mark past the end stops at the meter's end, » after it.",
            },
            {
                name: 'Data burst',
                text: 'The mark moves in 2 hard steps; a mark past the end stands just outside the end, ▶ after it.',
            },
            {
                name: 'Packet sync',
                text: 'The mark moves in 2 hard steps; a mark past the end leans over the end, ! beside it.',
            },
        ],
    },
    synthwave: {
        shape: [
            {
                name: 'Chrome over the grid',
                text: 'The track is the floor grid with the pink horizon on top; the share is chrome, sky, horizon line and sunset; the mark is the striped sun, half risen; past the end a cyan ».',
            },
            {
                name: 'The neon sign',
                text: "The '84 rule: the tube's core is light and the colour lives in the glow, pink around a lavender core, over an unlit tube. The mark is a cyan tube. Past the end the sign bends into a glowing ›.",
            },
            {
                name: 'The VHS tracking bar',
                text: 'A tape’s scanlines as the track; the share bleeds a pixel either way, pink on one side and cyan on the other; the mark is a white play head with a triangle under the tape; past the end ▸▸.',
            },
        ],
        loading: [
            {
                name: 'Sunrise',
                text: 'The camera drives along the grid floor.',
            },
            {
                name: 'Overdrive',
                text: 'A cyan laser scanline sweeps the grid and back.',
            },
            {
                name: 'Arcade attract',
                text: 'Pink grid lines rush past.',
            },
        ],
        arrival: [
            {
                name: 'Sunrise',
                text: 'The share is drawn in from the left slowing as it lands.',
            },
            {
                name: 'Overdrive',
                text: 'The share stretches out from the start overshooting and settling.',
            },
            {
                name: 'Arcade attract',
                text: 'The share is drawn in from the left in 12 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Sunrise',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Overdrive',
                text: 'A new tone swells the meter once, slowing as it lands.',
            },
            {
                name: 'Arcade attract',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'Sunrise',
                text: "The mark moves easing in and out; a mark past the end stops at the meter's end, » after it.",
            },
            {
                name: 'Overdrive',
                text: 'The mark moves slowing as it lands; a mark past the end stands just outside the end, › after it.',
            },
            {
                name: 'Arcade attract',
                text: 'The mark moves in 6 hard steps; a mark past the end leans over the end, » beside it.',
            },
        ],
    },
    pastel: {
        shape: [
            {
                name: 'Washi tape',
                text: 'A strip of plum washi tape with white stripes, its far end torn, the sky second pass off register, on a dotted pill; the mark is a round sticker on a pin; past the end the corner curls.',
            },
            {
                name: 'Gummy candy',
                text: 'A sticker of a pill with its hard flat shadow; the share is plum candy with a gloss stripe and a shine at its end. The mark is a candy stick in white and mint with a plum outline. Past the end a gummy drop.',
            },
            {
                name: 'The bead bracelet',
                text: 'A string of pale beads; the share is the beads threaded in plum with a gloss; the mark is a mint charm on a ring; past the end a dangling drop.',
            },
        ],
        loading: [
            {
                name: 'Boing',
                text: 'The stripes of a pale tape drift along the track.',
            },
            {
                name: 'Pressed sticker',
                text: 'A mint candy rolls along the pill and back.',
            },
            {
                name: 'Dropped in',
                text: 'Plum dots are stuck on one by one.',
            },
        ],
        arrival: [
            {
                name: 'Boing',
                text: 'The share stretches out from the start overshooting and settling.',
            },
            {
                name: 'Pressed sticker',
                text: 'The share opens from its middle line overshooting and settling.',
            },
            {
                name: 'Dropped in',
                text: 'The share drops in from above overshooting and settling.',
            },
        ],
        tone: [
            {
                name: 'Boing',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Pressed sticker',
                text: 'A new tone swells the meter once, overshooting and settling.',
            },
            {
                name: 'Dropped in',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'Boing',
                text: "The mark moves overshooting and settling; a mark past the end stops at the meter's end, ♥ after it.",
            },
            {
                name: 'Pressed sticker',
                text: 'The mark moves overshooting and settling; a mark past the end leans over the end, ♥ beside it.',
            },
            {
                name: 'Dropped in',
                text: 'The mark moves slowing as it lands; a mark past the end stands just outside the end, ★ after it.',
            },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'The htop meter',
                text: 'One line of htop: [||||||||   ] between square brackets, one phosphor bar per character cell; the mark is the block caret; past the end a + after the bracket.',
            },
            {
                name: 'The oscilloscope',
                text: 'A graticule with a division every tenth; the share is the trace, a bright phosphor line over its afterglow. The mark is the yellow cursor.',
            },
            {
                name: 'The download line',
                text: 'A dotted line of cells, as curl and wget draw one; the share is block characters in phosphor; the mark is a caret with a ^ under the line; past the end >.',
            },
        ],
        loading: [
            {
                name: 'Line by line',
                text: 'A lit cell walks along the line.',
            },
            {
                name: 'Redraw',
                text: 'A row of phosphor dots crawls along, three steps to a cell.',
            },
            {
                name: 'Typed out',
                text: 'The block cursor runs along the line.',
            },
        ],
        arrival: [
            {
                name: 'Line by line',
                text: 'The share is drawn in from the left in 16 hard steps.',
            },
            {
                name: 'Redraw',
                text: 'The share stretches out from the start in 8 hard steps.',
            },
            {
                name: 'Typed out',
                text: 'The share is drawn in from the left in 32 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Line by line',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Redraw',
                text: 'A new tone jolts the meter sideways, in 2 hard steps.',
            },
            {
                name: 'Typed out',
                text: 'A new tone knocks the meter up and back once, in 2 hard steps.',
            },
        ],
        mark: [
            {
                name: 'Line by line',
                text: "The mark moves in 4 hard steps; a mark past the end stops at the meter's end, + after it.",
            },
            {
                name: 'Redraw',
                text: 'The mark moves in 2 hard steps; a mark past the end stands just outside the end, > after it.',
            },
            {
                name: 'Typed out',
                text: 'The mark moves in 3 hard steps; a mark past the end leans over the end, ▶ beside it.',
            },
        ],
    },
    forest: {
        shape: [
            {
                name: "The wooden gauge with the trail's marks",
                text: 'Your combination: the width and filling of the wooden gauge (a groove routed into light wood, the share the same wood stained forest green, with a knot) with the icons of the trail on the map: a trig point (the survey triangle with its dot, on a post) as the mark and a clay trail blaze past the end. No leaf.',
            },
            {
                name: 'The wooden gauge with a leaf',
                text: 'A groove routed into light wood, the grain running along it; the share is the same wood stained forest green, with a knot. The mark is a stem with a leaf on top. Past the end the gauge sprouts a leaf.',
            },
            {
                name: 'The trail on the map',
                text: 'Two contour lines and the planned trail in clay dashes; the share is the trail walked, in forest ink. The mark is a trig point: the black survey triangle with its dot, on a post. Past the end a clay trail blaze points on.',
            },
        ],
        loading: [
            {
                name: 'Footsteps',
                text: 'Footsteps in forest ink walk along the groove.',
            },
            {
                name: 'Growth rings',
                text: 'The grain of the wood runs through the groove.',
            },
            {
                name: 'Blazed trail',
                text: 'A clay blaze hops from tree to tree along the groove.',
            },
        ],
        arrival: [
            {
                name: 'Footsteps',
                text: 'The share is drawn in from the left at an even pace.',
            },
            {
                name: 'Growth rings',
                text: 'The share stretches out from the start slowing as it lands.',
            },
            {
                name: 'Blazed trail',
                text: 'The share is drawn in from the left in 6 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Footsteps',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Growth rings',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
            {
                name: 'Blazed trail',
                text: 'A new tone swells the meter once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'Footsteps',
                text: "The mark moves easing in and out; a mark past the end stops at the meter's end, › after it.",
            },
            {
                name: 'Growth rings',
                text: 'The mark moves slowing as it lands; a mark past the end stands just outside the end, › after it.',
            },
            {
                name: 'Blazed trail',
                text: 'The mark moves easing in and out; a mark past the end leans over the end, › beside it.',
            },
        ],
    },
    'high-contrast': {
        shape: [
            {
                name: 'The pattern-coded gauge',
                text: 'The share is ink hatching closed by a solid ink edge, readable by pattern as well as by tone; the mark is a yellow column in ink edges; past the end a solid ink arrowhead.',
            },
            {
                name: 'The ink frame',
                text: 'A 2px ink frame filled with solid ink, no colour needed; the mark is a white slot between two ink edges, readable on the ink and on the paper alike. Past the end a yellow plate in an ink frame with a +.',
            },
            {
                name: 'The slotted gauge',
                text: 'A 2px ink frame; the share is solid ink with a white slot every quarter of the scale, readable by counting; the mark is a yellow column in a double ink edge; past the end a +.',
            },
        ],
        loading: [
            {
                name: 'At once',
                text: 'A dashed ink line through the empty frame, still.',
            },
            {
                name: 'In two steps',
                text: 'A row of ink dots, still.',
            },
            {
                name: 'In quarters',
                text: 'An ink dash line, still.',
            },
        ],
        arrival: [
            {
                name: 'At once',
                text: 'The share is drawn in from the left at once.',
            },
            {
                name: 'In two steps',
                text: 'The share is drawn in from the left in 2 hard steps.',
            },
            {
                name: 'In quarters',
                text: 'The share is drawn in from the left in 4 hard steps.',
            },
        ],
        tone: [
            {
                name: 'At once',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'In two steps',
                text: 'A new tone knocks the meter up and back once, in 2 hard steps.',
            },
            {
                name: 'In quarters',
                text: 'A new tone jolts the meter sideways, in 2 hard steps.',
            },
        ],
        mark: [
            {
                name: 'At once',
                text: "The mark moves at once; a mark past the end stops at the meter's end, + after it.",
            },
            {
                name: 'In two steps',
                text: 'The mark moves in 2 hard steps; a mark past the end stands just outside the end, ▶ after it.',
            },
            {
                name: 'In quarters',
                text: 'The mark moves in 2 hard steps; a mark past the end leans over the end, ▶ beside it.',
            },
        ],
    },
    sepia: {
        shape: [
            {
                name: 'The letterpress impression',
                text: 'A blind impression pressed into the paper; the share is inked into it, speckled where the ink did not take; the mark is a brass rule with a pilcrow above it; past the end the ink is squeezed out.',
            },
            {
                name: 'The pen stroke and the blot',
                text: "A pencilled guide line of dots; the share is a brown ink stroke from a nib, tapered where the pen came down and pooled where it stops. The mark is a hairline with the lozenge of the theme's divider on top. Past the end the ink blots.",
            },
            {
                name: 'The bookbinder’s thread',
                text: 'A stitched guide on the paper; the share is the thread sewn in, a long stitch and a short gap; the mark is a needle with its eye; past the end a knot.',
            },
        ],
        loading: [
            {
                name: 'The platen',
                text: 'The platen presses, the impression deepens and lifts.',
            },
            {
                name: 'Quill stroke',
                text: 'A dotted pencil guide is drawn along the track.',
            },
            {
                name: 'Set in type',
                text: 'A sort of type moves along the stick.',
            },
        ],
        arrival: [
            {
                name: 'The platen',
                text: 'The share opens from its middle line slowing as it lands.',
            },
            {
                name: 'Quill stroke',
                text: 'The share is cut in from the left with a slanted edge slowing as it lands.',
            },
            {
                name: 'Set in type',
                text: 'The share is drawn in from the left in 8 hard steps.',
            },
        ],
        tone: [
            {
                name: 'The platen',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Quill stroke',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
            {
                name: 'Set in type',
                text: 'A new tone swells the meter once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'The platen',
                text: "The mark moves easing in and out; a mark past the end stops at the meter's end, ¶ after it.",
            },
            {
                name: 'Quill stroke',
                text: 'The mark moves easing in and out; a mark past the end leans over the end, ¶ beside it.',
            },
            {
                name: 'Set in type',
                text: 'The mark moves in 4 hard steps; a mark past the end stands just outside the end, ❧ after it.',
            },
        ],
    },
    blueprint: {
        shape: [
            {
                name: "The engineer's scale with a break line",
                text: 'A printed scale with a tick every 5 % and 25 %; the share is the drawn line weight with a cyan tint; the mark is an amber datum triangle; past the end the break line.',
            },
            {
                name: 'The tolerance band',
                text: 'An outlined band on the millimetre grid; the share is a tinted bar drawn in outline. The mark is the amber centre line, a chain line that runs on above and below. Past the end the out-of-tolerance region is hatched in amber.',
            },
            {
                name: 'The dimension line',
                text: 'Extension lines at both ends and a centre line; the share is the measured length with its arrowhead; the mark is an amber leader with its ring; past the end ↦.',
            },
        ],
        loading: [
            {
                name: 'The plotter',
                text: 'The plotter pen runs along the baseline.',
            },
            {
                name: 'Dimensioned',
                text: 'A chain line, dash and dot, runs along the scale.',
            },
            {
                name: 'Redrawn',
                text: 'The amber datum line travels along the scale and back.',
            },
        ],
        arrival: [
            {
                name: 'The plotter',
                text: 'The share is drawn in from the left at an even pace.',
            },
            {
                name: 'Dimensioned',
                text: 'The share stretches out from the start slowing as it lands.',
            },
            {
                name: 'Redrawn',
                text: 'The share is drawn in from the left in 4 hard steps.',
            },
        ],
        tone: [
            {
                name: 'The plotter',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Dimensioned',
                text: 'A new tone knocks the meter up and back once, at an even pace.',
            },
            {
                name: 'Redrawn',
                text: 'A new tone jolts the meter sideways, in 4 hard steps.',
            },
        ],
        mark: [
            {
                name: 'The plotter',
                text: "The mark moves at an even pace; a mark past the end stops at the meter's end, ▸ after it.",
            },
            {
                name: 'Dimensioned',
                text: 'The mark moves at an even pace; a mark past the end stands just outside the end, ↦ after it.',
            },
            {
                name: 'Redrawn',
                text: 'The mark moves in 5 hard steps; a mark past the end leans over the end, ▸ beside it.',
            },
        ],
    },
    solstice: {
        shape: [
            {
                name: 'The standing stones',
                text: 'Ridged ground caught by the low sun; the mark is a standing stone throwing its long shadow; past the end the sun rises over the horizon.',
            },
            {
                name: 'The embers',
                text: 'A charcoal log; the share is embers, amber with hot specks and rust, breathing slowly. The mark is a dark iron poker with a pale edge. Past the end sparks fly up. Firelight, not neon.',
            },
            {
                name: 'The horizon',
                text: 'The dusk sky as the track; the share is the land, lit along its edge by the low sun; the mark is the sun on a stalk; past the end a ray (✳).',
            },
        ],
        loading: [
            {
                name: 'Long dawn',
                text: 'A warm dawn rises and goes, unhurried.',
            },
            {
                name: 'The shadow lengthens',
                text: 'The low sun crosses the horizon and back.',
            },
            {
                name: 'Stone by stone',
                text: 'A row of standing stones is raised, one by one.',
            },
        ],
        arrival: [
            {
                name: 'Long dawn',
                text: 'The share is drawn in from the left slowing as it lands.',
            },
            {
                name: 'The shadow lengthens',
                text: 'The share stretches out from the start easing in and out.',
            },
            {
                name: 'Stone by stone',
                text: 'The share is drawn in from the left in 7 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Long dawn',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'The shadow lengthens',
                text: 'A new tone swells the meter once, easing in and out.',
            },
            {
                name: 'Stone by stone',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'Long dawn',
                text: "The mark moves easing in and out; a mark past the end stops at the meter's end, › after it.",
            },
            {
                name: 'The shadow lengthens',
                text: 'The mark moves easing in and out; a mark past the end leans over the end, › beside it.',
            },
            {
                name: 'Stone by stone',
                text: 'The mark moves in 7 hard steps; a mark past the end stands just outside the end, › after it.',
            },
        ],
    },
    brutalism: {
        shape: [
            {
                name: 'The stacked blocks',
                text: 'Ten boxes in a row in the black line, filled lavender up to the share; the mark is a yellow peg; past the end one more block is thrown on top.',
            },
            {
                name: 'The slab with an overhang',
                text: 'A box in the 3px black line with the hard shadow; the share is the yellow plate with a black line at its edge. The mark is a black post with a lavender cap. Past the end a yellow block is slammed out over the edge of the box.',
            },
            {
                name: 'The concrete formwork',
                text: 'Grey board-marked concrete in a 2px frame; the share is a flat plate with a heavy black end; the mark is a black I-beam; past the end a black box reading !!.',
            },
        ],
        loading: [
            {
                name: 'Thrown on',
                text: 'The blocks drop in one at a time.',
            },
            {
                name: 'Slammed',
                text: 'Black hazard tape runs through the boxes.',
            },
            {
                name: 'Block by block',
                text: 'A black block hops along the row.',
            },
        ],
        arrival: [
            {
                name: 'Thrown on',
                text: 'The share drops in from above speeding up until it lands.',
            },
            {
                name: 'Slammed',
                text: 'The share stretches out from the start in 3 hard steps.',
            },
            {
                name: 'Block by block',
                text: 'The share is drawn in from the left in 10 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Thrown on',
                text: 'A new tone jolts the meter sideways, in 3 hard steps.',
            },
            {
                name: 'Slammed',
                text: 'A new tone knocks the meter up and back once, in 2 hard steps.',
            },
            {
                name: 'Block by block',
                text: 'A new tone swells the meter once, in 2 hard steps.',
            },
        ],
        mark: [
            {
                name: 'Thrown on',
                text: "The mark moves at once; a mark past the end stops at the meter's end, ! after it.",
            },
            {
                name: 'Slammed',
                text: 'The mark moves at once; a mark past the end stands just outside the end, ▶ after it.',
            },
            {
                name: 'Block by block',
                text: 'The mark moves in 2 hard steps; a mark past the end leans over the end, ■ beside it.',
            },
        ],
    },
    deco: {
        shape: [
            {
                name: 'The lobby floor indicator',
                text: 'A row of lift lamps lit in gold up to the share; the mark is a gold arrow pointing down; past the end an arrow up.',
            },
            {
                name: 'The gilt frieze',
                text: "A black band between two double gold rules; the share is flat gold that ends in the Empire State's chevron. The mark is an emerald lozenge set on a dark spire. Past the end the chevrons go on: ›››.",
            },
            {
                name: 'The ziggurat',
                text: 'A black band between gold rules; the share ends in gold steps like a ziggurat’s flank; the mark is an emerald keystone rimmed in gold; past the end three gold steps.',
            },
        ],
        loading: [
            {
                name: 'The lift ascends',
                text: 'One lit lamp moves along the row, the lift travelling.',
            },
            {
                name: 'Gilt sweep',
                text: 'Fine gold rays slide along the frieze.',
            },
            {
                name: 'Fanfare',
                text: 'A pair of gold lamps glides up and down the row.',
            },
        ],
        arrival: [
            {
                name: 'The lift ascends',
                text: 'The share is drawn in from the left in 10 hard steps.',
            },
            {
                name: 'Gilt sweep',
                text: 'The share is drawn in from the left slowing as it lands.',
            },
            {
                name: 'Fanfare',
                text: 'The share opens from its middle line slowing as it lands.',
            },
        ],
        tone: [
            {
                name: 'The lift ascends',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Gilt sweep',
                text: 'A new tone swells the meter once, easing in and out.',
            },
            {
                name: 'Fanfare',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'The lift ascends',
                text: "The mark moves in 10 hard steps; a mark past the end stops at the meter's end, ▲ after it.",
            },
            {
                name: 'Gilt sweep',
                text: 'The mark moves easing in and out; a mark past the end stands just outside the end, › after it.',
            },
            {
                name: 'Fanfare',
                text: 'The mark moves easing in and out; a mark past the end leans over the end, ▼ beside it.',
            },
        ],
    },
    phantom: {
        shape: [
            {
                name: 'The calling card',
                text: 'A slab cut at -8°, black under a halftone; the share is the red plate with its second plate off register; the mark is a white shard; past the end a white burst with "!".',
            },
            {
                name: 'The ransom collage',
                text: 'The share is a strip of cut paper pieces, red, white and red, glued at a slant with black cuts between. The mark is a black shard edged in white. Past the end the strip tears off in a jagged white shard.',
            },
            {
                name: 'The slashed slab',
                text: 'A black slab skewed at -8°; the share is red cut by black slashes; the mark is a white star; past the end !!.',
            },
        ],
        loading: [
            {
                name: 'Card thrown',
                text: 'The halftone screen slides.',
            },
            {
                name: 'Cut out',
                text: 'Red halftone dots shift in hard steps.',
            },
            {
                name: 'The stamp',
                text: 'A red shard jumps along the slab.',
            },
        ],
        arrival: [
            {
                name: 'Card thrown',
                text: 'The share is cut in from the left with a slanted edge slowing as it lands.',
            },
            {
                name: 'Cut out',
                text: 'The share is drawn in from the left in 5 hard steps.',
            },
            {
                name: 'The stamp',
                text: 'The share opens from its middle line in 2 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Card thrown',
                text: 'A new tone jolts the meter sideways, in 3 hard steps.',
            },
            {
                name: 'Cut out',
                text: 'A new tone knocks the meter up and back once, in 2 hard steps.',
            },
            {
                name: 'The stamp',
                text: 'A new tone swells the meter once, in 2 hard steps.',
            },
        ],
        mark: [
            {
                name: 'Card thrown',
                text: "The mark moves in 2 hard steps; a mark past the end stops at the meter's end, ! after it.",
            },
            {
                name: 'Cut out',
                text: 'The mark moves in 2 hard steps; a mark past the end leans over the end, ! beside it.',
            },
            {
                name: 'The stamp',
                text: 'The mark moves in 2 hard steps; a mark past the end stands just outside the end, » after it.',
            },
        ],
    },
    'shade-light': {
        shape: [
            {
                name: 'The pencil gauge',
                text: 'An outline drawn in pencil; the share is the blue plate hatched over in pencil; the mark is a graphite stroke with a soft shade; past the end a patch of scribble.',
            },
            {
                name: 'The pin and its shade',
                text: 'A groove in the paper; the share is a raised blue strip throwing a soft shade. The mark is a pin with a magenta head standing in the gauge, its shade falling to the side. Past the end the strip hangs over the edge, its shade falling beyond.',
            },
            {
                name: 'The paper cut-out',
                text: 'A slot cut into the paper with its inner shade; the share is a strip of coloured paper laid in it with its own soft shadow; the mark is a magenta paper flag on a pin; past the end the strip curls out.',
            },
        ],
        loading: [
            {
                name: 'Hatched in',
                text: 'The empty gauge is hatched in once.',
            },
            {
                name: 'Pressed paper',
                text: 'A pencil line is drawn through the gauge once.',
            },
            {
                name: 'Passing shade',
                text: 'A soft band of shade moves along the gauge and back.',
            },
        ],
        arrival: [
            {
                name: 'Hatched in',
                text: 'The share is drawn in from the left slowing as it lands.',
            },
            {
                name: 'Pressed paper',
                text: 'The share opens from its middle line slowing as it lands.',
            },
            {
                name: 'Passing shade',
                text: 'The share stretches out from the start easing in and out.',
            },
        ],
        tone: [
            {
                name: 'Hatched in',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Pressed paper',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
            {
                name: 'Passing shade',
                text: 'A new tone swells the meter once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'Hatched in',
                text: "The mark moves easing in and out; a mark past the end stops at the meter's end, › after it.",
            },
            {
                name: 'Pressed paper',
                text: 'The mark moves slowing as it lands; a mark past the end leans over the end, › beside it.',
            },
            {
                name: 'Passing shade',
                text: 'The mark moves slowing as it lands; a mark past the end stands just outside the end, › after it.',
            },
        ],
    },
    'shade-dark': {
        shape: [
            {
                name: 'Silverpoint',
                text: 'Fine silver lines hatched across the dark ground; the share is the blue plate with a lit top edge; the mark is a pale metal stroke; past the end silver scribble.',
            },
            {
                name: 'The reading lamp',
                text: 'A deep well; the share is the blue plate lifted out of the shade. The mark carries the light: a pale pin with a pool of lamplight around it, so the target is where the light is. Past the end the light spills out beyond the well.',
            },
            {
                name: 'The stitched leather',
                text: 'A dark strap stitched along both edges; the share is the blue plate with a lit top edge; the mark is a pale silver rivet; past the end one more rivet.',
            },
        ],
        loading: [
            {
                name: 'Silver drawn',
                text: 'The empty gauge is hatched in once.',
            },
            {
                name: 'Lifted',
                text: 'A silver line is drawn through the gauge once.',
            },
            {
                name: 'Lamp passes',
                text: 'A pale band of lamplight moves along the gauge and back.',
            },
        ],
        arrival: [
            {
                name: 'Silver drawn',
                text: 'The share is drawn in from the left slowing as it lands.',
            },
            {
                name: 'Lifted',
                text: 'The share opens from its middle line slowing as it lands.',
            },
            {
                name: 'Lamp passes',
                text: 'The share stretches out from the start easing in and out.',
            },
        ],
        tone: [
            {
                name: 'Silver drawn',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Lifted',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
            {
                name: 'Lamp passes',
                text: 'A new tone swells the meter once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'Silver drawn',
                text: "The mark moves easing in and out; a mark past the end stops at the meter's end, › after it.",
            },
            {
                name: 'Lifted',
                text: 'The mark moves slowing as it lands; a mark past the end leans over the end, › beside it.',
            },
            {
                name: 'Lamp passes',
                text: 'The mark moves slowing as it lands; a mark past the end stands just outside the end, › after it.',
            },
        ],
    },
    retro: {
        shape: [
            {
                name: 'The system monitor',
                text: 'New, unlike the installer bar and the defragmenter: a sunken black panel of LED segments as Task Manager and Winamp drew a level. Unlit segments glow dark green, the share is lit (yellow for a warning, red for danger), the mark is a white peak-hold segment in a black frame, and past the end the red clip lamp is lit.',
            },
            {
                name: 'The dithered installer bar',
                text: 'A sunken field with the bevel inside its boundary; the share is navy whose last few pixels are dithered, 1995-style. The mark is a raised grey slider thumb. Past the end a raised scroll-arrow button.',
            },
            {
                name: 'The defragmenter',
                text: 'Two rows of tiny cells, as the 1995 disk defragmenter drew a drive: navy cells up to the share, a few teal ones among them, white cells beyond. The mark is a white cell column in a black frame. Past the end two more cells sit outside the field.',
            },
        ],
        loading: [
            {
                name: 'Task Manager',
                text: 'The history grid scrolls one step at a time.',
            },
            {
                name: 'Winamp',
                text: 'A chase of lit LEDs runs along the panel.',
            },
            {
                name: 'Disk light',
                text: 'One red drive lamp jumps along the panel and back.',
            },
        ],
        arrival: [
            {
                name: 'Task Manager',
                text: 'The share is drawn in from the left in 12 hard steps.',
            },
            {
                name: 'Winamp',
                text: 'The share stretches out from the start in 4 hard steps.',
            },
            {
                name: 'Disk light',
                text: 'The share is drawn in from the left in 4 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Task Manager',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Winamp',
                text: 'A new tone knocks the meter up and back once, in 2 hard steps.',
            },
            {
                name: 'Disk light',
                text: 'A new tone jolts the meter sideways, in 2 hard steps.',
            },
        ],
        mark: [
            {
                name: 'Task Manager',
                text: "The mark moves in 6 hard steps; a mark past the end stops at the meter's end, ▸ after it.",
            },
            {
                name: 'Winamp',
                text: 'The mark moves in 12 hard steps; a mark past the end stands just outside the end, » after it.',
            },
            {
                name: 'Disk light',
                text: "The mark moves in 2 hard steps; a mark past the end stops at the meter's end, ! after it.",
            },
        ],
    },
    grotesk: {
        shape: [
            {
                name: 'The transit line',
                text: 'New, unlike the red block and the zebra scale: the route diagram of Swiss transit signage. The line served so far runs in red with a station tick every sixth, the rest in grey; the mark is the interchange, a white capsule in a black outline across the line; past the end the line runs on to a black terminus bar.',
            },
            {
                name: 'The red block on the baseline',
                text: 'A black baseline; the share is a flat red block standing on it. The mark is a black rule rising from the baseline, flush. Past the end an oversized black →.',
            },
            {
                name: 'The zebra scale',
                text: 'A frame with a black-and-white zebra scale of twelve columns along its foot; the share is solid black. The mark is a red rule with a small red square flag. Past the end a red square set lower, off the line.',
            },
        ],
        loading: [
            {
                name: 'Departure',
                text: 'A black train stops at each station.',
            },
            {
                name: 'Express',
                text: 'Red dashes, a line under construction, run along.',
            },
            {
                name: 'Timetable',
                text: 'The station ticks are printed one by one.',
            },
        ],
        arrival: [
            {
                name: 'Departure',
                text: 'The share is drawn in from the left in 6 hard steps.',
            },
            {
                name: 'Express',
                text: 'The share is drawn in from the left slowing as it lands.',
            },
            {
                name: 'Timetable',
                text: 'The share stretches out from the start in 4 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Departure',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Express',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
            {
                name: 'Timetable',
                text: 'A new tone jolts the meter sideways, in 2 hard steps.',
            },
        ],
        mark: [
            {
                name: 'Departure',
                text: "The mark moves in 6 hard steps; a mark past the end stops at the meter's end, → after it.",
            },
            {
                name: 'Express',
                text: 'The mark moves slowing as it lands; a mark past the end stands just outside the end, → after it.',
            },
            {
                name: 'Timetable',
                text: 'The mark moves in 3 hard steps; a mark past the end leans over the end, + beside it.',
            },
        ],
    },
    lapis: {
        shape: [
            {
                name: 'The gilt band',
                text: 'Deep lapis ruled in gold; the share is gold leaf tooled with a fine lattice; the mark is a vermilion reed stroke with its nuqta; past the end a vermilion toranj.',
            },
            {
                name: 'Lapis stone on vellum',
                text: 'The track is ivory vellum ruled in gold; the share is the stone itself, deep lapis flecked with gold pyrite and a streak of calcite. The mark is a gold leaf stroke. Past the end a chipped shard of the stone.',
            },
            {
                name: 'The tile frieze',
                text: 'A row of tiles ruled in gold; the share is glazed tiles, each with its gold joint and a glint; the mark is a vermilion lozenge in gold; past the end a vermilion lozenge.',
            },
        ],
        loading: [
            {
                name: 'Gold laid',
                text: "A burnisher's glint runs along the gold.",
            },
            {
                name: 'Reed stroke',
                text: 'The tooled gold dots are punched along the band.',
            },
            {
                name: 'Tile by tile',
                text: 'A vermilion tile moves along the band.',
            },
        ],
        arrival: [
            {
                name: 'Gold laid',
                text: 'The share is drawn in from the left slowing as it lands.',
            },
            {
                name: 'Reed stroke',
                text: 'The share is cut in from the left with a slanted edge slowing as it lands.',
            },
            {
                name: 'Tile by tile',
                text: 'The share is drawn in from the left in 8 hard steps.',
            },
        ],
        tone: [
            {
                name: 'Gold laid',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Reed stroke',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
            {
                name: 'Tile by tile',
                text: 'A new tone swells the meter once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'Gold laid',
                text: "The mark moves easing in and out; a mark past the end stops at the meter's end, › after it.",
            },
            {
                name: 'Reed stroke',
                text: 'The mark moves easing in and out; a mark past the end leans over the end, › beside it.',
            },
            {
                name: 'Tile by tile',
                text: 'The mark moves in 4 hard steps; a mark past the end stands just outside the end, ✦ after it.',
            },
        ],
    },
    nostromo: {
        shape: [
            {
                name: 'The backlit vents',
                text: 'Vent slots in the beige plastic lit orange from inside up to the share; the mark is black label tape with ▼; past the end a cut piece of label tape reads +.',
            },
            {
                name: 'The bargraph tube',
                text: 'A dark glass tube set into the beige case, a wire along it; the share glows orange in the tube, a hot core in a warm glow, like a 1979 bargraph tube. The mark is a cream tick printed on the glass.',
            },
            {
                name: 'The punched tape',
                text: 'Paper tape with its sprocket holes; the share is the data punched in rows, lit from behind; the mark is the reader head, dark with a cream edge; past the end the torn tape.',
            },
        ],
        loading: [
            {
                name: 'Power up',
                text: 'A glow runs along the slots, one after another.',
            },
            {
                name: 'Relay clack',
                text: 'An orange lamp scans the vents and back.',
            },
            {
                name: 'Warm-up',
                text: 'The vent slots glow in turn.',
            },
        ],
        arrival: [
            {
                name: 'Power up',
                text: 'The share is drawn in from the left in 8 hard steps.',
            },
            {
                name: 'Relay clack',
                text: 'The share stretches out from the start in 3 hard steps.',
            },
            {
                name: 'Warm-up',
                text: 'The share is drawn in from the left slowing as it lands.',
            },
        ],
        tone: [
            {
                name: 'Power up',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Relay clack',
                text: 'A new tone jolts the meter sideways, in 3 hard steps.',
            },
            {
                name: 'Warm-up',
                text: 'A new tone knocks the meter up and back once, slowing as it lands.',
            },
        ],
        mark: [
            {
                name: 'Power up',
                text: "The mark moves in 4 hard steps; a mark past the end stops at the meter's end, + after it.",
            },
            {
                name: 'Relay clack',
                text: 'The mark moves in 2 hard steps; a mark past the end stands just outside the end, ▼ after it.',
            },
            {
                name: 'Warm-up',
                text: 'The mark moves easing in and out; a mark past the end leans over the end, ▼ beside it.',
            },
        ],
    },
    titanium: {
        shape: [
            {
                name: 'The heat-tinted groove',
                text: 'An engraved groove; the share is the heat-tint oxide, gold, bronze, violet, blue, fixed by position; the mark is a two-faceted milled pointer; past the end a bright burr.',
            },
            {
                name: 'The vernier caliper',
                text: "The main scale engraved along the top; the share is the caliper's sliding beam, bright metal with a knurled grip. The mark is the vernier's zero line filled with the blue oxide, its small scale beside it. Past the end the jaw's chamfered tip slides off the scale.",
            },
            {
                name: 'The anodised bar',
                text: 'A brushed bar in its frame; the share is anodised colour with a polished bevel; the mark is a machined notch in bright metal; past the end a +.',
            },
        ],
        loading: [
            {
                name: 'Cut',
                text: 'The cutter runs along the groove at an even, linear pace.',
            },
            {
                name: 'Heat tint',
                text: 'A brushed-metal sheen sweeps the groove.',
            },
            {
                name: 'Machined tick',
                text: 'The knurl is rolled into the groove.',
            },
        ],
        arrival: [
            {
                name: 'Cut',
                text: 'The share is drawn in from the left at an even pace.',
            },
            {
                name: 'Heat tint',
                text: 'The share is drawn in from the left in 4 hard steps.',
            },
            {
                name: 'Machined tick',
                text: 'The share stretches out from the start at an even pace.',
            },
        ],
        tone: [
            {
                name: 'Cut',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'Heat tint',
                text: 'A new tone knocks the meter up and back once, at an even pace.',
            },
            {
                name: 'Machined tick',
                text: 'A new tone jolts the meter sideways, at an even pace.',
            },
        ],
        mark: [
            {
                name: 'Cut',
                text: "The mark moves at an even pace; a mark past the end stops at the meter's end, ▸ after it.",
            },
            {
                name: 'Heat tint',
                text: 'The mark moves at an even pace; a mark past the end stands just outside the end, ▸ after it.',
            },
            {
                name: 'Machined tick',
                text: 'The mark moves at an even pace; a mark past the end leans over the end, ▸ beside it.',
            },
        ],
    },
};

/** Themes whose shape was approved in round 1; forest, retro and grotesk were not. */
const APPROVED = new Set(Object.keys(IDEAS).filter((t) => !['forest', 'retro', 'grotesk'].includes(t)));

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="meter"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// five choices per theme, each option's name and what it does as its hint.
const hints = (/** @type {Aspect} */ aspect, /** @type {number} */ at) =>
    Object.fromEntries(
        Object.entries(IDEAS).map(([theme, idea]) => [
            theme,
            `${idea[aspect][at].name}. ${idea[aspect][at].text}` +
                (aspect === 'shape' && at === 0 ? (APPROVED.has(theme) ? ' (Approved in round 1.)' : ' (New in round 2.)') : ''),
        ]),
    );
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map(({ id, label }) => ({
            id,
            label,
            options: [0, 1, 2].map((at) => ({ value: String(at + 1), label: String(at + 1), hints: hints(id, at) })),
            // The shape Kenny approved in round 1 (and formal's shape 1, his
            // 18:45 verdict) is ticked for him; he only ticks what is open.
            ...(id === 'shape' ? { default: Object.fromEntries([...APPROVED, 'formal'].map((theme) => [theme, '1'])) } : {}),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const [theme, idea] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    p.textContent =
        `Five picks, each on its own. Shape 1 is ${idea.shape[0].name.replace(/^The /, 'the ')}` +
        (APPROVED.has(theme) ? ', approved in round 1 (keep it unless another one is better). ' : ', new in round 2. ') +
        'Each row changes one thing only; the preview at the top shows what you ticked so far. ' +
        'Press Drawn, Loading, Mark past the end and the tones at full speed and at ¼; the words around the meters never move.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-cm-aspects]'));
const meterRow = (/** @type {string} */ key, /** @type {string} */ text) => {
    const row = document.createElement('div');
    row.className = 'cm-row';
    const label = document.createElement('span');
    label.className = 'cm-row__label';
    if (key === 'disk') label.setAttribute('data-cm-label', 'disk');
    label.textContent = text;
    const meter = document.createElement('span');
    meter.className = 'kp-meter';
    meter.setAttribute('data-cm-meter', key);
    row.append(label, meter);
    return row;
};
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'cm-aspect';
    box.setAttribute('data-cm-aspect', id);
    box.setAttribute('aria-labelledby', `h-cm-${id}`);
    const head = document.createElement('div');
    head.className = 'cm-aspect__head';
    head.innerHTML = `<h3 id="h-cm-${id}"></h3><p></p>`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'cm-trio';
    for (const at of [1, 2, 3]) {
        const cell = document.createElement('div');
        cell.className = 'cm-col';
        cell.setAttribute('data-cm-vary', id);
        cell.setAttribute('data-cm-option', String(at));
        cell.innerHTML =
            `<p class="cm-label"><span class="cm-label__no">${label} · ${at}</span> <span data-cm-name></span></p>` +
            '<p class="cm-desc" data-cm-desc></p><div class="cm-meters" data-cm></div>';
        const meters = /** @type {HTMLElement} */ (cell.querySelector('.cm-meters'));
        meters.append(meterRow('disk', 'Disk: 62 % used, target 80 %'));
        if (id === 'mark') meters.append(meterRow('over', 'Disk: 62 % used, target 115 %'));
        else meters.append(meterRow('seats', 'Seats: 130 % booked, comfortable at 80 %'));
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
const picks = () => /** @type {Record<Aspect, string>} */ (Object.fromEntries(ASPECTS.map(({ id }) => [id, ticked[theme()]?.[id] ?? '1'])));

/** Writes the five aspects on every wrapper: the preview takes the picks, each row's cell its own option in its own aspect. */
function compose() {
    const now = picks();
    const preview = section.querySelector('[data-cm-preview]');
    for (const { id } of ASPECTS) preview?.setAttribute(`data-cm-${id}`, now[id]);
    for (const cell of section.querySelectorAll('[data-cm-vary]')) {
        const vary = cell.getAttribute('data-cm-vary');
        const option = cell.getAttribute('data-cm-option') ?? '1';
        const meters = cell.querySelector('[data-cm]');
        for (const { id } of ASPECTS) meters?.setAttribute(`data-cm-${id}`, id === vary ? option : now[id]);
        cell.classList.toggle('cm-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-cm-picks]');
    const idea = IDEAS[theme()];
    if (words && idea) words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1].name}`).join(' · ');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* ------------------------------------------------------- the meters */

/** @type {Record<string, { value: number, mark: number | null, label: string, markLabel: string }>} */
const METERS = {
    disk: { value: 0.62, mark: 0.8, label: 'of the disk used', markLabel: 'the target' },
    over: { value: 0.62, mark: 1.15, label: 'of the disk used', markLabel: 'the target' },
    seats: { value: 1.3, mark: 0.8, label: 'of the seats booked', markLabel: 'comfortable' },
    quota: { value: 0.91, mark: 0.8, label: 'of the quota used', markLabel: 'the warning level' },
    sign: { value: 1.3, mark: null, label: 'booked', markLabel: '' },
};
const state = { view: /** @type {'drawn' | 'loading' | 'markover'} */ ('drawn'), tone: /** @type {'' | 'warning' | 'destructive'} */ ('') };

function draw(loading = state.view === 'loading') {
    for (const el of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-cm-meter]'))) {
        const key = el.getAttribute('data-cm-meter') ?? 'disk';
        const m = METERS[key];
        const mark = key === 'disk' && state.view === 'markover' ? 1.15 : m.mark;
        setMeter(el, { value: m.value, mark, tone: state.tone || null, label: m.label, markLabel: m.markLabel, loading });
    }
    for (const label of document.querySelectorAll('[data-cm-label="disk"]'))
        label.textContent = state.view === 'markover' ? 'Disk: 62 % used, target 115 %' : 'Disk: 62 % used, target 80 %';
}

// Drawn always replays the arrival: one frame loading, then the share comes
// in the way the arrival brings it.
const stateButtons = [...document.querySelectorAll('[data-cm-state]')];
for (const button of stateButtons)
    button.addEventListener('click', () => {
        const view = /** @type {'drawn' | 'loading' | 'markover'} */ (button.getAttribute('data-cm-state'));
        const replay = view === 'drawn' && state.view === 'drawn';
        state.view = view;
        for (const b of stateButtons) b.setAttribute('aria-pressed', String(b === button));
        if (!replay) return draw();
        draw(true);
        requestAnimationFrame(() => requestAnimationFrame(() => draw()));
    });
const toneButtons = [...document.querySelectorAll('[data-cm-tone]')];
for (const button of toneButtons)
    button.addEventListener('click', () => {
        state.tone = /** @type {'' | 'warning' | 'destructive'} */ (button.getAttribute('data-cm-tone') ?? '');
        for (const b of toneButtons) b.setAttribute('aria-pressed', String(b === button));
        draw();
    });
compose();
draw();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-cm-theme-name]')) el.textContent = LABEL[now] ?? now;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) p.hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    for (const cell of section.querySelectorAll('[data-cm-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (cell.getAttribute('data-cm-vary'))]?.[Number(cell.getAttribute('data-cm-option')) - 1];
        const name = cell.querySelector('[data-cm-name]');
        const desc = cell.querySelector('[data-cm-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-cm-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/open-reverse; full speed by default, since a loop is judged at
// its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('cm-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-cm-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-cm-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-cm-speed'));
        try {
            localStorage.setItem('cm-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();
