// research/character-meter: the first component of the character round
// (Kenny, form v18, 2026-10-05), all 22 themes in one demo judged through the
// review kit. Round 2 (Kenny, 2026-10-05 18:01: "onthoud de goedgekeurde
// items, maar geef nu nog is drie opties, telkens met loading, mark past the
// end, de drie tone opties en speed of every animation, maar wel in de
// dialog"; "Dus enkel de 'vorm' is goedgekeurd"): each theme keeps the shape
// picked in round 1 (forest: the wooden gauge with the trail's marks; retro
// and grotesk: new shapes), and three options say how that shape moves.
//
// The meters are the package's own: setMeter() (js/kpi.js) writes their
// share, mark, tone, loading state and ARIA. The shape and the options are
// CSS only, in meters.css, scoped by `[data-theme]` and the column's
// `[data-cm]`; this file says what each one is, sets the states, and runs
// the speed. The controls sit in the section's `data-review-controls`
// container, which the review kit mirrors into its dialog.

import { setMeter } from '../../js/kpi.js';
import { THEMES } from '../../js/theme-registry.js';

/**
 * Per theme: the shape, and the three ways it moves.
 * @type {Record<string, { shape: { name: string, text: string }, options: { name: string, text: string }[] }>}
 */
const IDEAS = {
    formal: {
        shape: {
            name: 'The bound volume and its ribbon',
            text: "The track is a book's fore-edge, page after page; the share is the navy buckram binding laid over it; the mark is a gold ribbon bookmark hanging out below the book; past the end one more volume leans past the shelf.",
        },
        options: [
            {
                name: 'Written into the ledger',
                text: "The binding is laid on as a pen writes an entry, unhurried. The share is drawn in from the left slowing as it lands; a new tone draws the share again in the new colour; the mark moves easing in and out, and a mark past the end stops at the meter's end, » after it. Loading: the pages riffle: a shade runs slowly along the fore-edge.",
            },
            {
                name: 'Stamped and filed',
                text: 'A clerk’s stamp: the binding is pressed on in one firm stroke. The share opens from its middle line slowing as it lands; a new tone knocks the meter up and back once, slowing as it lands; the mark moves slowing as it lands, and a mark past the end stands just outside the end, › after it. Loading: the ribbon bookmark slides along the fore-edge and back.',
            },
            {
                name: 'Counted in tenths',
                text: 'The bookkeeper adds the column a tenth at a time. The share is drawn in from the left in 10 hard steps; a new tone swells the meter once, slowing as it lands; the mark moves in 5 hard steps, and a mark past the end leans over the end, ‡ beside it. Loading: a dotted leader is written dot by dot, "to be entered".',
            },
        ],
    },
    light: {
        shape: {
            name: 'Daylight',
            text: 'A soft pill in the light: the indigo share brightens towards its end, the mark is a thin gnomon with a short shadow, and past the end the light spills out in a cyan glint.',
        },
        options: [
            {
                name: 'Morning light',
                text: "The share comes up like the morning, slowing as it arrives. The share is drawn in from the left slowing as it lands; a new tone draws the share again in the new colour; the mark moves easing in and out, and a mark past the end stops at the meter's end, › after it. Loading: a band of daylight crosses the track, slowly.",
            },
            {
                name: 'The shadow swings',
                text: 'A sundial: the gnomon’s shadow swings over the scale. The share stretches out from the start slowing as it lands; a new tone swells the meter once, slowing as it lands; the mark moves easing in and out, and a mark past the end leans over the end, › beside it. Loading: the thin shadow of a gnomon sweeps across the track.',
            },
            {
                name: 'Through the window',
                text: 'Light through a window, pane by pane. The share is drawn in from the left in 4 hard steps; a new tone knocks the meter up and back once, slowing as it lands; the mark moves in 4 hard steps, and a mark past the end stands just outside the end, › after it. Loading: window panes of light drift along the track.',
            },
        ],
    },
    dark: {
        shape: {
            name: 'The machined channel',
            text: 'A channel with its corners cut at forty-five degrees; the share is bright machined metal with the oxide film along its top edge; the mark is a V milled into the edge; past the end the part runs out with a chamfered tip.',
        },
        options: [
            {
                name: 'Machined',
                text: "The part is cut at an even feed; nothing moves that you did not move. The share stretches out from the start at an even pace; a new tone draws the share again in the new colour; the mark moves at an even pace, and a mark past the end stops at the meter's end, ▸ after it. Loading: the empty channel’s engraved scale, still.",
            },
            {
                name: 'Milled in passes',
                text: 'The cutter takes five passes. The share stretches out from the start in 5 hard steps; a new tone knocks the meter up and back once, at an even pace; the mark moves in 4 hard steps, and a mark past the end stands just outside the end, › after it. Loading: engraved cross-hatching in the channel, still.',
            },
            {
                name: 'Pressed in the die',
                text: 'The part is struck in one blow from its middle line. The share opens from its middle line at an even pace; a new tone swells the meter once, at an even pace; the mark moves at an even pace, and a mark past the end leans over the end, ▸ beside it. Loading: a row of centre-punch dots, still.',
            },
        ],
    },
    cyberpunk: {
        shape: {
            name: 'The neon tube with a glitch tick',
            text: 'A yellow neon tube in a dark glass sleeve; the mark is a cyan tick that glitches every three seconds; past the end the tube reads OVR in red.',
        },
        options: [
            {
                name: 'Ignition',
                text: "The tube strikes in hard stutters. The share is drawn in from the left in 6 hard steps; a new tone jolts the meter sideways, in 4 hard steps; the mark moves in 3 hard steps, and a mark past the end stops at the meter's end, » after it. Loading: the tube tries to strike, flickers twice, then dark.",
            },
            {
                name: 'Data burst',
                text: 'The share is cut in by a blade of light. The share is cut in from the left with a slanted edge slowing as it lands; a new tone draws the share again in the new colour; the mark moves in 2 hard steps, and a mark past the end stands just outside the end, ▶ after it. Loading: yellow hazard stripes run along the sleeve.',
            },
            {
                name: 'Packet sync',
                text: 'The share syncs in eight packets. The share stretches out from the start in 8 hard steps; a new tone knocks the meter up and back once, in 3 hard steps; the mark moves in 2 hard steps, and a mark past the end leans over the end, ! beside it. Loading: a cyan data packet hops along the tube.',
            },
        ],
    },
    synthwave: {
        shape: {
            name: 'Chrome over the grid',
            text: 'The track is the floor grid with the pink horizon on top; the share is chrome, sky, horizon line and sunset; the mark is the striped sun, half risen; past the end a cyan ».',
        },
        options: [
            {
                name: 'Sunrise',
                text: "The chrome rises like the sun over the grid, slow and smooth. The share is drawn in from the left slowing as it lands; a new tone draws the share again in the new colour; the mark moves easing in and out, and a mark past the end stops at the meter's end, » after it. Loading: the camera drives along the grid floor.",
            },
            {
                name: 'Overdrive',
                text: 'The chrome shoots out, overshoots and settles. The share stretches out from the start overshooting and settling; a new tone swells the meter once, slowing as it lands; the mark moves slowing as it lands, and a mark past the end stands just outside the end, › after it. Loading: a cyan laser scanline sweeps the grid and back.',
            },
            {
                name: 'Arcade attract',
                text: 'An arcade cabinet’s attract mode: the chrome fills in twelve steps. The share is drawn in from the left in 12 hard steps; a new tone knocks the meter up and back once, slowing as it lands; the mark moves in 6 hard steps, and a mark past the end leans over the end, » beside it. Loading: pink grid lines rush past.',
            },
        ],
    },
    pastel: {
        shape: {
            name: 'Washi tape',
            text: 'A strip of plum washi tape with white stripes, its far end torn, the sky second pass off register, on a dotted pill; the mark is a round sticker on a pin; past the end the corner curls.',
        },
        options: [
            {
                name: 'Boing',
                text: "The tape springs out, overshoots and settles. The share stretches out from the start overshooting and settling; a new tone draws the share again in the new colour; the mark moves overshooting and settling, and a mark past the end stops at the meter's end, ♥ after it. Loading: the stripes of a pale tape drift along the track.",
            },
            {
                name: 'Pressed sticker',
                text: 'The tape is pressed down with a thumb, squashing a little. The share opens from its middle line overshooting and settling; a new tone swells the meter once, overshooting and settling; the mark moves overshooting and settling, and a mark past the end leans over the end, ♥ beside it. Loading: a mint candy rolls along the pill and back.',
            },
            {
                name: 'Dropped in',
                text: 'The tape drops onto the page and bounces. The share drops in from above overshooting and settling; a new tone knocks the meter up and back once, slowing as it lands; the mark moves slowing as it lands, and a mark past the end stands just outside the end, ★ after it. Loading: plum dots are stuck on one by one.',
            },
        ],
    },
    terminal: {
        shape: {
            name: 'The htop meter',
            text: 'One line of htop: [||||||||   ] between square brackets, one phosphor bar per character cell; the mark is the block caret; past the end a + after the bracket.',
        },
        options: [
            {
                name: 'Line by line',
                text: "The bars are printed cell by cell, as a terminal draws. The share is drawn in from the left in 16 hard steps; a new tone draws the share again in the new colour; the mark moves in 4 hard steps, and a mark past the end stops at the meter's end, + after it. Loading: a lit cell walks along the line.",
            },
            {
                name: 'Redraw',
                text: 'The screen redraws in eight hard frames. The share stretches out from the start in 8 hard steps; a new tone jolts the meter sideways, in 2 hard steps; the mark moves in 2 hard steps, and a mark past the end stands just outside the end, > after it. Loading: a row of phosphor dots crawls along, three steps to a cell.',
            },
            {
                name: 'Typed out',
                text: 'Typed at a teletype, character by character. The share is drawn in from the left in 32 hard steps; a new tone knocks the meter up and back once, in 2 hard steps; the mark moves in 3 hard steps, and a mark past the end leans over the end, ▶ beside it. Loading: the block cursor runs along the line.',
            },
        ],
    },
    forest: {
        shape: {
            name: "The wooden gauge with the trail's marks",
            text: 'Your combination: the width and filling of the wooden gauge (a groove routed into light wood, the share the same wood stained forest green, with a knot) with the icons of the trail on the map: a trig point (the survey triangle with its dot, on a post) as the mark and a clay trail blaze past the end. No leaf.',
        },
        options: [
            {
                name: 'Footsteps',
                text: "The share is walked in at a hiker’s even pace. The share is drawn in from the left at an even pace; a new tone draws the share again in the new colour; the mark moves easing in and out, and a mark past the end stops at the meter's end, › after it. Loading: footsteps in forest ink walk along the groove.",
            },
            {
                name: 'Growth rings',
                text: 'The wood grows out from the start, slowing like a tree in autumn. The share stretches out from the start slowing as it lands; a new tone knocks the meter up and back once, slowing as it lands; the mark moves slowing as it lands, and a mark past the end stands just outside the end, › after it. Loading: the grain of the wood runs through the groove.',
            },
            {
                name: 'Blazed trail',
                text: 'From blaze to blaze: the share arrives in six legs. The share is drawn in from the left in 6 hard steps; a new tone swells the meter once, slowing as it lands; the mark moves easing in and out, and a mark past the end leans over the end, › beside it. Loading: a clay blaze hops from tree to tree along the groove.',
            },
        ],
    },
    'high-contrast': {
        shape: {
            name: 'The pattern-coded gauge',
            text: 'The share is ink hatching closed by a solid ink edge, readable by pattern as well as by tone; the mark is a yellow column in ink edges; past the end a solid ink arrowhead.',
        },
        options: [
            {
                name: 'At once',
                text: "No motion to read: the share is there at once. The share is drawn in from the left at once; a new tone draws the share again in the new colour; the mark moves at once, and a mark past the end stops at the meter's end, + after it. Loading: a dashed ink line through the empty frame, still.",
            },
            {
                name: 'In two steps',
                text: 'Half, then all: two hard steps. The share is drawn in from the left in 2 hard steps; a new tone knocks the meter up and back once, in 2 hard steps; the mark moves in 2 hard steps, and a mark past the end stands just outside the end, ▶ after it. Loading: a row of ink dots, still.',
            },
            {
                name: 'In quarters',
                text: 'Four hard steps, a quarter each. The share is drawn in from the left in 4 hard steps; a new tone jolts the meter sideways, in 2 hard steps; the mark moves in 2 hard steps, and a mark past the end leans over the end, ▶ beside it. Loading: an ink dash line, still.',
            },
        ],
    },
    sepia: {
        shape: {
            name: 'The letterpress impression',
            text: 'A blind impression pressed into the paper; the share is inked into it, speckled where the ink did not take; the mark is a brass rule with a pilcrow above it; past the end the ink is squeezed out.',
        },
        options: [
            {
                name: 'The platen',
                text: "The press comes down: the impression is pressed in from its middle. The share opens from its middle line slowing as it lands; a new tone draws the share again in the new colour; the mark moves easing in and out, and a mark past the end stops at the meter's end, ¶ after it. Loading: the platen presses, the impression deepens and lifts.",
            },
            {
                name: 'Quill stroke',
                text: 'Drawn with a quill, its leading edge slanted. The share is cut in from the left with a slanted edge slowing as it lands; a new tone knocks the meter up and back once, slowing as it lands; the mark moves easing in and out, and a mark past the end leans over the end, ¶ beside it. Loading: a dotted pencil guide is drawn along the track.',
            },
            {
                name: 'Set in type',
                text: 'The compositor sets the line sort by sort. The share is drawn in from the left in 8 hard steps; a new tone swells the meter once, slowing as it lands; the mark moves in 4 hard steps, and a mark past the end stands just outside the end, ❧ after it. Loading: a sort of type moves along the stick.',
            },
        ],
    },
    blueprint: {
        shape: {
            name: "The engineer's scale with a break line",
            text: 'A printed scale with a tick every 5 % and 25 %; the share is the drawn line weight with a cyan tint; the mark is an amber datum triangle; past the end the break line.',
        },
        options: [
            {
                name: 'The plotter',
                text: "The plotter pen draws the line weight at an even pace. The share is drawn in from the left at an even pace; a new tone draws the share again in the new colour; the mark moves at an even pace, and a mark past the end stops at the meter's end, ▸ after it. Loading: the plotter pen runs along the baseline.",
            },
            {
                name: 'Dimensioned',
                text: 'The dimension line is pulled out to its length. The share stretches out from the start slowing as it lands; a new tone knocks the meter up and back once, at an even pace; the mark moves at an even pace, and a mark past the end stands just outside the end, ↦ after it. Loading: a chain line, dash and dot, runs along the scale.',
            },
            {
                name: 'Redrawn',
                text: 'Revised in quarters, one long tick at a time. The share is drawn in from the left in 4 hard steps; a new tone jolts the meter sideways, in 4 hard steps; the mark moves in 5 hard steps, and a mark past the end leans over the end, ▸ beside it. Loading: the amber datum line travels along the scale and back.',
            },
        ],
    },
    solstice: {
        shape: {
            name: 'The standing stones',
            text: 'Ridged ground caught by the low sun; the mark is a standing stone throwing its long shadow; past the end the sun rises over the horizon.',
        },
        options: [
            {
                name: 'Long dawn',
                text: "The light spreads like a winter dawn, slowly. The share is drawn in from the left slowing as it lands; a new tone draws the share again in the new colour; the mark moves easing in and out, and a mark past the end stops at the meter's end, › after it. Loading: a warm dawn rises and goes, unhurried.",
            },
            {
                name: 'The shadow lengthens',
                text: 'The ground stretches out like a shadow at day’s end. The share stretches out from the start easing in and out; a new tone swells the meter once, easing in and out; the mark moves easing in and out, and a mark past the end leans over the end, › beside it. Loading: the low sun crosses the horizon and back.',
            },
            {
                name: 'Stone by stone',
                text: 'Seven stones in the circle, raised one by one. The share is drawn in from the left in 7 hard steps; a new tone knocks the meter up and back once, slowing as it lands; the mark moves in 7 hard steps, and a mark past the end stands just outside the end, › after it. Loading: a row of standing stones is raised, one by one.',
            },
        ],
    },
    brutalism: {
        shape: {
            name: 'The stacked blocks',
            text: 'Ten boxes in a row in the black line, filled lavender up to the share; the mark is a yellow peg; past the end one more block is thrown on top.',
        },
        options: [
            {
                name: 'Thrown on',
                text: "The blocks are thrown down from above and land hard. The share drops in from above speeding up until it lands; a new tone jolts the meter sideways, in 3 hard steps; the mark moves at once, and a mark past the end stops at the meter's end, ! after it. Loading: the blocks drop in one at a time.",
            },
            {
                name: 'Slammed',
                text: 'The row is slammed out in three hard frames. The share stretches out from the start in 3 hard steps; a new tone knocks the meter up and back once, in 2 hard steps; the mark moves at once, and a mark past the end stands just outside the end, ▶ after it. Loading: black hazard tape runs through the boxes.',
            },
            {
                name: 'Block by block',
                text: 'Ten blocks, ten hard steps. The share is drawn in from the left in 10 hard steps; a new tone swells the meter once, in 2 hard steps; the mark moves in 2 hard steps, and a mark past the end leans over the end, ■ beside it. Loading: a black block hops along the row.',
            },
        ],
    },
    deco: {
        shape: {
            name: 'The lobby floor indicator',
            text: 'A row of lift lamps lit in gold up to the share; the mark is a gold arrow pointing down; past the end an arrow up.',
        },
        options: [
            {
                name: 'The lift ascends',
                text: "Floor by floor, the lamps light up as the lift rises. The share is drawn in from the left in 10 hard steps; a new tone draws the share again in the new colour; the mark moves in 10 hard steps, and a mark past the end stops at the meter's end, ▲ after it. Loading: one lit lamp moves along the row, the lift travelling.",
            },
            {
                name: 'Gilt sweep',
                text: 'The gold is swept on in one grand gesture. The share is drawn in from the left slowing as it lands; a new tone swells the meter once, easing in and out; the mark moves easing in and out, and a mark past the end stands just outside the end, › after it. Loading: fine gold rays slide along the frieze.',
            },
            {
                name: 'Fanfare',
                text: 'The gold opens from its middle line like a curtain going up. The share opens from its middle line slowing as it lands; a new tone knocks the meter up and back once, slowing as it lands; the mark moves easing in and out, and a mark past the end leans over the end, ▼ beside it. Loading: a pair of gold lamps glides up and down the row.',
            },
        ],
    },
    phantom: {
        shape: {
            name: 'The calling card',
            text: 'A slab cut at -8°, black under a halftone; the share is the red plate with its second plate off register; the mark is a white shard; past the end a white burst with "!".',
        },
        options: [
            {
                name: 'Card thrown',
                text: "The card is flung in, its edge slanted. The share is cut in from the left with a slanted edge slowing as it lands; a new tone jolts the meter sideways, in 3 hard steps; the mark moves in 2 hard steps, and a mark past the end stops at the meter's end, ! after it. Loading: the halftone screen slides.",
            },
            {
                name: 'Cut out',
                text: 'Cut from the paper in five quick snips. The share is drawn in from the left in 5 hard steps; a new tone knocks the meter up and back once, in 2 hard steps; the mark moves in 2 hard steps, and a mark past the end leans over the end, ! beside it. Loading: red halftone dots shift in hard steps.',
            },
            {
                name: 'The stamp',
                text: 'Stamped in two blows. The share opens from its middle line in 2 hard steps; a new tone swells the meter once, in 2 hard steps; the mark moves in 2 hard steps, and a mark past the end stands just outside the end, » after it. Loading: a red shard jumps along the slab.',
            },
        ],
    },
    'shade-light': {
        shape: {
            name: 'The pencil gauge',
            text: 'An outline drawn in pencil; the share is the blue plate hatched over in pencil; the mark is a graphite stroke with a soft shade; past the end a patch of scribble.',
        },
        options: [
            {
                name: 'Hatched in',
                text: "The plate is drawn in once, slowing at the end. The share is drawn in from the left slowing as it lands; a new tone draws the share again in the new colour; the mark moves easing in and out, and a mark past the end stops at the meter's end, › after it. Loading: the empty gauge is hatched in once.",
            },
            {
                name: 'Pressed paper',
                text: 'The plate is pressed into the paper from its middle. The share opens from its middle line slowing as it lands; a new tone knocks the meter up and back once, slowing as it lands; the mark moves slowing as it lands, and a mark past the end leans over the end, › beside it. Loading: a pencil line is drawn through the gauge once.',
            },
            {
                name: 'Passing shade',
                text: 'The plate stretches out as a shade passes over the paper. The share stretches out from the start easing in and out; a new tone swells the meter once, slowing as it lands; the mark moves slowing as it lands, and a mark past the end stands just outside the end, › after it. Loading: a soft band of shade moves along the gauge and back.',
            },
        ],
    },
    'shade-dark': {
        shape: {
            name: 'Silverpoint',
            text: 'Fine silver lines hatched across the dark ground; the share is the blue plate with a lit top edge; the mark is a pale metal stroke; past the end silver scribble.',
        },
        options: [
            {
                name: 'Silver drawn',
                text: "The plate is drawn in once, slowing at the end. The share is drawn in from the left slowing as it lands; a new tone draws the share again in the new colour; the mark moves easing in and out, and a mark past the end stops at the meter's end, › after it. Loading: the empty gauge is hatched in once.",
            },
            {
                name: 'Lifted',
                text: 'The plate is lifted out of the shade from its middle. The share opens from its middle line slowing as it lands; a new tone knocks the meter up and back once, slowing as it lands; the mark moves slowing as it lands, and a mark past the end leans over the end, › beside it. Loading: a silver line is drawn through the gauge once.',
            },
            {
                name: 'Lamp passes',
                text: 'The plate stretches out as a lamp passes. The share stretches out from the start easing in and out; a new tone swells the meter once, slowing as it lands; the mark moves slowing as it lands, and a mark past the end stands just outside the end, › after it. Loading: a pale band of lamplight moves along the gauge and back.',
            },
        ],
    },
    retro: {
        shape: {
            name: 'The system monitor',
            text: 'New, unlike the installer bar and the defragmenter: a sunken black panel of LED segments as Task Manager and Winamp drew a level. Unlit segments glow dark green, the share is lit (yellow for a warning, red for danger), the mark is a white peak-hold segment in a black frame, and past the end the red clip lamp is lit.',
        },
        options: [
            {
                name: 'Task Manager',
                text: "The level climbs segment by segment, as a 1996 system monitor redraws. The share is drawn in from the left in 12 hard steps; a new tone draws the share again in the new colour; the mark moves in 6 hard steps, and a mark past the end stops at the meter's end, ▸ after it. Loading: the history grid scrolls one step at a time.",
            },
            {
                name: 'Winamp',
                text: 'The LEDs jump up at once and the peak-hold segment falls back step by step, like Winamp’s spectrum. The share stretches out from the start in 4 hard steps; a new tone knocks the meter up and back once, in 2 hard steps; the mark moves in 12 hard steps, and a mark past the end stands just outside the end, » after it. Loading: a chase of lit LEDs runs along the panel.',
            },
            {
                name: 'Disk light',
                text: "The drive light: the level comes in four hard blocks. The share is drawn in from the left in 4 hard steps; a new tone jolts the meter sideways, in 2 hard steps; the mark moves in 2 hard steps, and a mark past the end stops at the meter's end, ! after it. Loading: one red drive lamp jumps along the panel and back.",
            },
        ],
    },
    grotesk: {
        shape: {
            name: 'The transit line',
            text: 'New, unlike the red block and the zebra scale: the route diagram of Swiss transit signage. The line served so far runs in red with a station tick every sixth, the rest in grey; the mark is the interchange, a white capsule in a black outline across the line; past the end the line runs on to a black terminus bar.',
        },
        options: [
            {
                name: 'Departure',
                text: "The line is served station by station. The share is drawn in from the left in 6 hard steps; a new tone draws the share again in the new colour; the mark moves in 6 hard steps, and a mark past the end stops at the meter's end, → after it. Loading: a black train stops at each station.",
            },
            {
                name: 'Express',
                text: 'Non-stop: the red runs out in one fast stroke. The share is drawn in from the left slowing as it lands; a new tone knocks the meter up and back once, slowing as it lands; the mark moves slowing as it lands, and a mark past the end stands just outside the end, → after it. Loading: red dashes, a line under construction, run along.',
            },
            {
                name: 'Timetable',
                text: 'The timetable flips over in four beats. The share stretches out from the start in 4 hard steps; a new tone jolts the meter sideways, in 2 hard steps; the mark moves in 3 hard steps, and a mark past the end leans over the end, + beside it. Loading: the station ticks are printed one by one.',
            },
        ],
    },
    lapis: {
        shape: {
            name: 'The gilt band',
            text: 'Deep lapis ruled in gold; the share is gold leaf tooled with a fine lattice; the mark is a vermilion reed stroke with its nuqta; past the end a vermilion toranj.',
        },
        options: [
            {
                name: 'Gold laid',
                text: "The gold leaf is laid on and burnished, slowly. The share is drawn in from the left slowing as it lands; a new tone draws the share again in the new colour; the mark moves easing in and out, and a mark past the end stops at the meter's end, › after it. Loading: a burnisher's glint runs along the gold.",
            },
            {
                name: 'Reed stroke',
                text: 'Drawn with the reed pen, its edge slanted. The share is cut in from the left with a slanted edge slowing as it lands; a new tone knocks the meter up and back once, slowing as it lands; the mark moves easing in and out, and a mark past the end leans over the end, › beside it. Loading: the tooled gold dots are punched along the band.',
            },
            {
                name: 'Tile by tile',
                text: 'Set like a mosaic, tile by tile. The share is drawn in from the left in 8 hard steps; a new tone swells the meter once, slowing as it lands; the mark moves in 4 hard steps, and a mark past the end stands just outside the end, ✦ after it. Loading: a vermilion tile moves along the band.',
            },
        ],
    },
    nostromo: {
        shape: {
            name: 'The backlit vents',
            text: 'Vent slots in the beige plastic lit orange from inside up to the share; the mark is black label tape with ▼; past the end a cut piece of label tape reads +.',
        },
        options: [
            {
                name: 'Power up',
                text: "The vents light up one by one as the ship powers up. The share is drawn in from the left in 8 hard steps; a new tone draws the share again in the new colour; the mark moves in 4 hard steps, and a mark past the end stops at the meter's end, + after it. Loading: a glow runs along the slots, one after another.",
            },
            {
                name: 'Relay clack',
                text: 'The relays close in three loud clacks. The share stretches out from the start in 3 hard steps; a new tone jolts the meter sideways, in 3 hard steps; the mark moves in 2 hard steps, and a mark past the end stands just outside the end, ▼ after it. Loading: an orange lamp scans the vents and back.',
            },
            {
                name: 'Warm-up',
                text: 'The tubes warm up: slow to start, then on. The share is drawn in from the left slowing as it lands; a new tone knocks the meter up and back once, slowing as it lands; the mark moves easing in and out, and a mark past the end leans over the end, ▼ beside it. Loading: the vent slots glow in turn.',
            },
        ],
    },
    titanium: {
        shape: {
            name: 'The heat-tinted groove',
            text: 'An engraved groove; the share is the heat-tint oxide, gold, bronze, violet, blue, fixed by position; the mark is a two-faceted milled pointer; past the end a bright burr.',
        },
        options: [
            {
                name: 'Cut',
                text: "The cutter runs at an even feed: metal does not ease. The share is drawn in from the left at an even pace; a new tone draws the share again in the new colour; the mark moves at an even pace, and a mark past the end stops at the meter's end, ▸ after it. Loading: the cutter runs along the groove at an even, linear pace.",
            },
            {
                name: 'Heat tint',
                text: 'Heated in four bands, gold, bronze, violet, blue, one after another. The share is drawn in from the left in 4 hard steps; a new tone knocks the meter up and back once, at an even pace; the mark moves at an even pace, and a mark past the end stands just outside the end, ▸ after it. Loading: a brushed-metal sheen sweeps the groove.',
            },
            {
                name: 'Machined tick',
                text: 'A precise stroke from the start, like a dial indicator. The share stretches out from the start at an even pace; a new tone jolts the meter sideways, at an even pace; the mark moves at an even pace, and a mark past the end leans over the end, ▸ beside it. Loading: the knurl is rolled into the groove.',
            },
        ],
    },
};

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// one choice per theme, the three options' names and parts as its hints.
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="meter"]'));
const hints = (/** @type {number} */ at) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, idea]) => [theme, `${idea.options[at].name}. ${idea.options[at].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'meter',
            label: 'How the meter moves in this theme',
            options: [0, 1, 2].map((at) => ({ value: String(at + 1), label: `Option ${at + 1}`, hints: hints(at) })),
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const [theme, idea] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    const [one, two, three] = idea.options.map((o) => o.name);
    p.textContent =
        `The shape is ${idea.shape.name.replace(/^The /, 'the ')}, the same in all three columns; option 1 is ${one}, option 2 ${two}, option 3 ${three}. ` +
        'Press Drawn to replay how the share arrives, then Loading, Mark past the end and the tones, at full speed and at ¼; ' +
        'the words around the meters never move, and the mark reads on the fill and on the track alike.';
    look.append(p);
}

/* ------------------------------------------------------- the meters */

/** @type {Record<string, { value: number, mark: number | null, label: string, markLabel: string }>} */
const METERS = {
    disk: { value: 0.62, mark: 0.8, label: 'of the disk used', markLabel: 'the target' },
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
// in the way the option brings it.
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
draw();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const theme = document.documentElement.getAttribute('data-theme') ?? 'formal';
    for (const el of document.querySelectorAll('[data-cm-theme-name]')) el.textContent = LABEL[theme] ?? theme;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) p.hidden = p.getAttribute('data-for') !== theme;
    const idea = IDEAS[theme];
    const shapeName = document.querySelector('[data-cm-shape-name]');
    const shapeText = document.querySelector('[data-cm-shape-text]');
    if (shapeName) shapeName.textContent = idea ? idea.shape.name : '';
    if (shapeText) shapeText.textContent = idea ? idea.shape.text : '';
    for (const at of [0, 1, 2]) {
        const name = document.querySelector(`[data-cm-name="${at + 1}"]`);
        const desc = document.querySelector(`[data-cm-desc="${at + 1}"]`);
        if (name) name.textContent = idea ? idea.options[at].name : '';
        if (desc) desc.textContent = idea ? idea.options[at].text : '';
    }
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

/* ----------------------------------------------------- the pick shown */

// What is ticked in the review dialog is what the page marks.
section.addEventListener('review:choice', (event) => {
    const { value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    for (const col of section.querySelectorAll('[data-cm-pick]')) col.classList.toggle('cm-picked', col.getAttribute('data-cm-pick') === value);
});
new MutationObserver(() => {
    // A pick for one theme says nothing about the next.
    for (const col of document.querySelectorAll('.cm-picked')) col.classList.remove('cm-picked');
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
