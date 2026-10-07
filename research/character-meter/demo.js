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
                name: 'The milling pass',
                text: 'A bright cutter edge with a short trail of oxide colour traverses the empty channel and starts again.',
            },
            {
                name: 'The oxide film runs',
                text: 'Thin bands of the film’s colours, the way heat tints a polished part, slide along the whole channel.',
            },
            {
                name: 'The spectral scan',
                text: 'One thin emission line steps across the slit, reading it line by line, and starts again.',
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
                name: 'The scanline',
                text: 'A cyan beam with a yellow afterglow runs across a track of faint scanlines, again and again.',
            },
            {
                name: 'The packet stream',
                text: 'Packets of cyan and yellow of every length run along a thin data line through the middle, one packet at a time.',
            },
            {
                name: 'Signal noise',
                text: 'A corrupt line on the empty track: red, cyan and yellow slivers jump to a new place every beat.',
            },
        ],
        arrival: [
            {
                name: 'Data burst',
                text: 'The share is written in eight packets, white-hot as they land, cooling to its neon in the same eight steps.',
            },
            {
                name: 'Glitch slip',
                text: 'The share lands torn, split into cyan and red ghosts and thrown left and right, and snaps true in three jumps.',
            },
            {
                name: 'Neon strike',
                text: 'The share is there at once, dark, and the tube strikes: two failed flickers, then it holds.',
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
                name: 'The groove is planted',
                text: 'While it measures, the groove is the bar’s planted row: seedlings, then whole trees filling it start to end.',
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
                name: 'A growth ring',
                text: 'A new tone draws a thin ring once round the meter, clockwise from the top, then it fades; the share never swells.',
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
                name: 'The stepping block',
                text: 'A square of ink jumps across the frame in ten hard steps and starts again; it never touches the start, so it cannot be read as a share.',
            },
            {
                name: 'Counting dots',
                text: 'Three ink rings in the middle, filled one after another, the way a phone counts while it waits.',
            },
            {
                name: 'Marching chevrons',
                text: 'A row of ink › marches to the right in hard steps, the sign of something on its way.',
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
                name: 'The marquee',
                text: 'A block of three lit segments slides through the panel and comes round again, the way a busy progress bar did.',
            },
            {
                name: 'The modem handshake',
                text: 'A green and a yellow lamp run in from both ends, meet in the middle and part again.',
            },
            {
                name: 'The rubber band',
                text: 'A dotted selection line along the top and the bottom of the panel, marching in opposite directions.',
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
                name: 'The rule and its cursor',
                text: 'A steel rule: a white strip in a black outline, a long tick every tenth and a short one every fiftieth hanging from its top edge; the share is a red band along its lower half, under the ticks; the mark is a black cursor triangle pointing up from below, with a hairline across the rule; past the end a bold red +.',
            },
            {
                name: 'The poster bar and its slash',
                text: 'A poster’s heavy bar: a thick black outline on white with the share set solid red inside it; the mark is a black oblique slash cut through the bar, standing out above and below; past the end a bold black !.',
            },
            {
                name: 'The twelve-column grid',
                text: 'The Swiss layout grid as a meter: twelve columns marked by hairline guides between a top and a bottom rule, the share set flush in red over them; the mark is a black rule with an open grid node on top; past the end the guides run on, three more columns in red hairline.',
            },
        ],
        loading: [
            {
                name: 'Departure',
                text: 'A black train stops at each station.',
            },
            {
                name: 'Out of register',
                text: 'The meter’s own ruler (a hairline above and below it and a tick every tenth) is printed in ink and, under it, in red: the red copy closes in clockwise, falls into register, dwells and opens out again, 2640 ms.',
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
                text: 'The share stretches out from the start in 4 hard steps, 480 ms.',
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
                name: 'The plate',
                text: 'A new tone prints the meter again: its red plate falls back into register on it once, clockwise, in 8 units.',
            },
        ],
        mark: [
            {
                name: 'Departure',
                text: "The mark moves in 6 hard steps; a mark past the end stops at the meter's end, → after it.",
            },
            {
                name: 'Express',
                text: 'The mark moves at an even pace, 480 ms; a mark past the end stands just outside the end, → after it.',
            },
            {
                name: 'Timetable',
                text: 'The mark moves in 3 hard steps; a mark past the end leans over the end, + beside it.',
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
                text: 'The share is printed in from the left in 8 frames of 80 ms (640 ms), equal steps.',
            },
        ],
        tone: [
            {
                name: 'Power up',
                text: 'A new tone draws the share again in the new colour, the way the picked arrival brings it.',
            },
            {
                name: 'The klaxon',
                text: 'The klaxon: a meter in warning or failure is framed all round in its tone’s ink; nothing moves.',
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

/**
 * Round 3's verdicts (Kenny, 2026-10-05 20:03), shape / loading / arrival /
 * tone / mark: the 16 themes approved in full, and for the six he sent back
 * the aspects he kept ('' = open again in round 4; dark's loading too:
 * its three were still, and a loading picture always moves now). Every value here is
 * ticked for him in the dialog as the group's `default`; he only ticks what
 * is open.
 * @type {Record<string, string[]>}
 */
const PICKED = {
    formal: ['1', '2', '1', '1', '2'],
    light: ['1', '1', '2', '2', '2'],
    dark: ['1', '', '2', '3', '3'],
    synthwave: ['1', '2', '2', '2', '1'],
    pastel: ['1', '1', '3', '1', '2'],
    terminal: ['1', '3', '3', '2', '2'],
    forest: ['1', '3', '1', '3', '3'],
    sepia: ['1', '2', '2', '2', '2'],
    blueprint: ['3', '1', '1', '1', '3'],
    solstice: ['3', '2', '2', '2', '2'],
    brutalism: ['1', '1', '1', '3', '3'],
    deco: ['1', '3', '2', '3', '3'],
    phantom: ['1', '1', '1', '1', '2'],
    nostromo: ['1', '1', '3', '2', '3'],
    titanium: ['1', '1', '3', '3', '3'],
    cyberpunk: ['2', '', '', '3', '3'],
    'high-contrast': ['2', '', '1', '1', '3'],
    retro: ['1', '', '1', '2', '2'],
    grotesk: ['', '2', '3', '3', '2'],
};
/** The aspect's pick from round 3, or '' when it is open in round 4. */
const keptOf = (/** @type {string} */ theme, /** @type {Aspect} */ aspect) => PICKED[theme]?.[ASPECTS.findIndex((a) => a.id === aspect)] ?? '';
/** Round 4 redraws the open aspects of these six themes. */
const REDRAWN = Object.keys(PICKED).filter((theme) => PICKED[theme].includes(''));

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
                (REDRAWN.includes(theme) && !keptOf(theme, aspect) ? ' (New in round 4.)' : '') +
                (keptOf(theme, aspect) === String(at + 1) ? ' (Kept in round 3.)' : ''),
        ]),
    );
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map(({ id, label }) => ({
            id,
            label,
            options: [0, 1, 2].map((at) => ({ value: String(at + 1), label: String(at + 1), hints: hints(id, at) })),
            // What Kenny kept or approved in round 3 is ticked for him.
            default: Object.fromEntries(
                Object.keys(PICKED)
                    .filter((theme) => keptOf(theme, id))
                    .map((theme) => [theme, keptOf(theme, id)]),
            ),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const theme of Object.keys(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    const open = ASPECTS.filter(({ id }) => !keptOf(theme, id)).map(({ label }) => label.toLowerCase());
    p.textContent = open.length
        ? `Round 4: only ${open.join(' and ')} ${open.length > 1 ? 'are' : 'is'} new, three options${open.length > 1 ? ' each' : ''}; ` +
          'what you kept in round 3 is ticked already. Each row changes one thing only; the preview at the top shows your picks. ' +
          'Press Loading, Drawn and the tones at full speed and at ¼; the words around the meters never move.'
        : 'Approved in round 3: your picks are ticked.';
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

/** What is ticked in the dialog, per theme; an aspect not ticked yet shows its round-3 pick, or its option 1 when it is open. */
/** @type {Record<string, Partial<Record<Aspect, string>>>} */
const ticked = {};
const theme = () => document.documentElement.getAttribute('data-theme') ?? 'formal';
const picks = () =>
    /** @type {Record<Aspect, string>} */ (Object.fromEntries(ASPECTS.map(({ id }) => [id, ticked[theme()]?.[id] ?? (keptOf(theme(), id) || '1')])));

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
        cell.classList.toggle(
            'cm-picked',
            (ticked[theme()]?.[/** @type {Aspect} */ (vary)] ?? keptOf(theme(), /** @type {Aspect} */ (vary))) === option,
        );
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
