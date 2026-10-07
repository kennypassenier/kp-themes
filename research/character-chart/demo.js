// research/character-chart: the second component of the character round
// (Kenny, form v18, 2026-10-05), all 22 themes in one demo judged through the
// review kit. Round 2 (Kenny, 2026-10-05 20:03: 19 themes approved with a
// pick, their loading screens not, "I want those in a separate demo";
// high-contrast and brutalism new, solstice "the background of character 1,
// but the riveted tooltip from character 2"; and since today every aspect is
// its own choice): each theme's time chart has six aspects, each picked on
// its own from three options: the shape, the loading picture, how the series
// arrives, how a new reading shows, the event dots and the pinned tooltip.
//
// The charts are the package's own: attachCharts() (js/chart.js) draws the
// plot, the axes, the lines and areas, the tooltip, the legend, the zoom chip,
// the states and the spark lines, and keeps every behaviour. Every aspect is
// CSS only, keyed by one attribute each on the chart's wrapper
// (`data-cc-shape`, `data-cc-tip` in charts.css and round2.css;
// `data-cc-loading`, `data-cc-arrival`, `data-cc-update`, `data-cc-events` in
// aspects.css), so any combination composes. On the page: one composed
// preview with the current picks, and per aspect a row of three charts that
// differ in that aspect only. The controls sit in the section's
// `data-review-controls` container, which the review kit mirrors into its
// dialog.

import { attachCharts, chartSelect, chartZoom, setChartData } from '../../js/chart.js';
import { THEMES } from '../../js/theme-registry.js';
import { NOW, sampleData } from '../../catalogue/chart-sample.js';
import R3A from './round3-a.js';
import R3B from './round3-b.js';
import R3C from './round3-c.js';
import R3D from './round3-d.js';
import R3E from './round3-e.js';
import R4A from './round4-a.js';
import R4B from './round4-b.js';
import R4C from './round4-c.js';
import R4D from './round4-d.js';
import R4E from './round4-e.js';

/**
 * Round 1's two characters per theme: a name and what each part becomes.
 * Their shape and their tooltip are options in round 2.
 * @type {Record<string, { a: { name: string, text: string }, b: { name: string, text: string } }>}
 */
const IDEAS = {
    formal: {
        a: {
            name: 'The annual report',
            text: 'A chart from a printed annual report: a navy rule over the plot and a hairline under it, the grid in dotted hairlines, the tick labels in the serif with old-style figures. The lines are drawn fine, the area is a faint wash. The tooltip is a footnote with a navy rule on top and the time in serif italic; the legend is words with a short rule beneath, the pressed one underlined in navy. Loading is a dotted leader across the empty plot, still; the error carries a dagger.',
        },
        b: {
            name: 'The ledger graph',
            text: "A graph ruled into a ledger: column rules every tenth across the paper, the baseline closed with the bookkeeper's double rule, the tick labels in ledger figures (monospaced). The pen draws with sharp corners and the area is hatched by hand. The tooltip is a ledger slip with its ruled lines and a red-ink margin in navy; the legend is index tabs, the pressed one inked. Loading shows the empty ruled page, still; nothing moves in formal.",
        },
    },
    light: {
        a: {
            name: 'The seam',
            text: "Light's divider as a chart: no frame, the grid in seams, the tick labels in the sans at medium weight. The line is a confident indigo pen whose area fades to nothing as it falls to the baseline. The tooltip is a white card with the divider's open circle as its pin; the legend is pills, the pressed one tinted indigo. Loading is a dashed seam across the plot, still.",
        },
        b: {
            name: 'Daylight',
            text: 'The plot in the light: a pale sky at its top, the sun just out of frame in the top corner, and every line throwing a soft shadow on the paper below it. The tooltip is frosted glass; the legend is pills with a soft shadow. Loading lets a band of daylight cross the plot, slowly.',
        },
    },
    dark: {
        a: {
            name: 'The spectrometer',
            text: 'The plot is a black slit with a ruler along its top and foot, the grid dashed fine, the tick labels in the ticker mono. Each line glows faintly in its own colour over an area that fades to black. The tooltip is a black slab with the oxide film (cyan, violet, magenta) along its top edge; the legend is bracketed [ ] in the mono, the brackets lit when pressed. Loading shows the calibration spectrum, faint and still.',
        },
        b: {
            name: 'The machined pocket',
            text: 'The plot is a pocket milled into the instrument, its corners cut at forty-five degrees, lit along its lower lip; the grid lines are engraved (a dark cut over a lit edge) and so are the tick labels. The tooltip and the legend buttons are chamfered plates. Loading is the empty pocket, still: nothing in dark moves that the reader did not move.',
        },
    },
    cyberpunk: {
        a: {
            name: 'The neon HUD',
            text: 'A heads-up display: the void with a fine scan grid, HUD brackets in the four corners, the tick labels in the tech mono in cyan, upper case. The lines are neon tubes with their glow, the areas scanned in lines. Every three seconds a glitch tears through the plot for a frame, cyan and red. The tooltip is a notched plate with a yellow bar; the legend notched outlines, the pressed one filled yellow. Loading is the data stream: cyan packets running along a rail.',
        },
        b: {
            name: 'The hazard terminal',
            text: 'A plot framed in signal yellow with hazard stripes along its top, the grid in cyan dots, the tick labels in the condensed display face. The lines are drawn hard, with sharp corners and no glow, over areas hatched at forty-five degrees. The tooltip is a yellow plate with black text and a cut corner; the legend black plates with a yellow bar under the pressed one. Loading crawls the hazard stripes across the plot.',
        },
    },
    synthwave: {
        a: {
            name: 'The grid floor horizon',
            text: 'The plot is the night sky over the floor grid: a pink horizon glows above the baseline and the perspective grid runs towards it. The lines are neon tubes, a light core in a coloured glow; the tick labels are in VT323, in cyan. The tooltip is a dark plate whose border runs from pink to cyan; the legend glowing outlines. Loading drives along the grid floor.',
        },
        b: {
            name: 'The VHS playback',
            text: "A tape played back on the TV: the striped sun setting behind the plot, a faint tracking band under the plot's top, the tick labels in VT323. The lines glow; the areas carry the tape's scan lines. The tooltip is the VCR's on-screen display, cyan letters on black; the legend the same OSD, the pressed one in pink. Loading rolls the tracking band down the screen.",
        },
    },
    pastel: {
        a: {
            name: 'Candy',
            text: 'A plump plot with a pastel wash and a dotted riso grid; the lines are thick candy strokes with a hard flat sticker shadow, the areas in candy-cane stripes. The tooltip is a sticker bubble with its flat shadow; the legend candy pills tinted in their colour, the pressed one solid. Loading hops a candy dot along three others.',
        },
        b: {
            name: 'Washi tape and riso',
            text: 'The plot is a riso print taped into a notebook: two strips of washi tape hold its top corners, the paper carries riso grain, the lines print with a second pass off register, the areas in halftone dots. The tooltip is a note held by its own tape; the legend small tape labels. Loading drifts the stripes of a pale tape across the plot.',
        },
    },
    terminal: {
        a: {
            name: 'The braille plot',
            text: 'A plot drawn in a terminal with braille cells: the lines and the areas are made of dots on a character grid, the grid lines box-drawing dashes ┄, the tick labels in the mono. The tooltip is framed in the double box line ═; the legend is a checklist [x]. Loading walks a lit cell along a line, the caret blinking once a second (the loop the theme allows).',
        },
        b: {
            name: 'The oscilloscope',
            text: "The plot is a scope screen: a graticule with ten divisions and the minor ticks on its centre lines, the lines a phosphor trace with its glow, the area its afterglow. The crosshair is the yellow cursor. The tooltip is the scope's measurement box; the legend the channel keys, the pressed one lit. Loading sweeps the beam across the screen.",
        },
    },
    forest: {
        a: {
            name: "The ranger's logbook",
            text: "A chart drawn into a ranger's logbook: wood-pulp paper with its fibres, ruled lines and a clay margin, the tick labels in italic. The lines are drawn in ink and the areas hatched in pencil. The tooltip is a luggage tag with its punched hole; the legend tags too. Loading shows the ruled page while a leaf drifts across it.",
        },
        b: {
            name: 'The contour map',
            text: 'The plot is a survey map: contour lines ring the paper, the grid lines are the clay trail in dashes, the tick labels are spaced capitals like place names. The lines are forest ink over a lake-blue wash. The tooltip is the map key in a double neatline; the legend trail blazes. Loading walks the trail dashes along.',
        },
    },
    'high-contrast': {
        a: {
            name: 'The ink frame',
            text: 'A 2px ink frame, a dashed ink grid, the tick labels in bold. Every source is told by its pattern as well as its colour: the first line solid, the second dashed, the third dotted, their areas hatched, cross-hatched and dotted. The tooltip is a white plate in a 2px ink frame; the legend framed buttons, the pressed one inked solid. Loading shows three ink squares, still: nothing loops, ever.',
        },
        b: {
            name: 'The inverse plate',
            text: 'The plot printed in reverse: an ink plate with every line in white, told apart by pattern alone (solid, dashed, dotted), so it reads in greyscale and in forced colours alike. The crosshair and the tooltip are the signal yellow with ink text; the legend white frames on ink. Loading shows a dashed white line across the plate, still.',
        },
    },
    sepia: {
        a: {
            name: 'A nib on laid paper',
            text: 'Laid paper with its fine lines and chain lines, the tick labels in the serif italic. The lines are drawn with a nib, the ink bleeding a hair into the paper, over a watercolour wash that fades to the baseline. The tooltip is a slip with a double ink rule; the legend underlined words. Loading writes a stroke across the page slowly and lets it fade, as a pen does.',
        },
        b: {
            name: 'The letterpress specimen',
            text: 'The plot is pressed into the paper (a blind impression), the tick labels in letter-spaced small capitals. The lines are inked type, speckled where the ink did not take, the areas stippled. The tooltip is a printed slip with a fleuron ❧ in its corner; the legend pilcrows ¶. Loading presses the platen: the impression deepens and lifts.',
        },
    },
    blueprint: {
        a: {
            name: 'The millimetre paper',
            text: "Drafting film over millimetre paper: a fine line every millimetre and a heavier one every centimetre, the tick labels in the drafting mono. The pen draws the lines crisp, the areas are section-hatched, the crosshair is an amber chain line. The tooltip is the drawing's title block; the legend ruled cells. Loading runs a plotter dash across the sheet.",
        },
        b: {
            name: 'The drawing frame',
            text: "The plot is a drawing in its frame: a double border with the zone ticks along its edges and registration marks in the corners, construction lines for the grid. The lines are drawn in white ink with round ends. The tooltip is a callout with its leader; the legend dimension labels. Loading traces the frame's outline with a moving dash.",
        },
    },
    solstice: {
        a: {
            name: 'The low sun',
            text: 'The plot at dusk: a low sun warms its bottom corner, the grid lines lie like long shadows, the tick labels are in the serif. The lines glow warm and their areas carry the firelight down to the ground. The tooltip is a charcoal slab with an ember edge; the legend stone pills. Loading lets a dawn rise and fade, unhurried.',
        },
        b: {
            name: 'The embers',
            text: 'The plot is a charcoal log with embers in it; the lines are glowing filaments, the areas ember speckle. The tooltip is an iron plate with four rivets; the legend iron buttons with a hot edge when pressed. Loading lets embers breathe along the log. Firelight, not neon.',
        },
    },
    brutalism: {
        a: {
            name: 'The slab',
            text: 'A box in the 3px black line with the hard shadow, a heavy dashed grid, the tick labels in bold grotesque. The lines are thick with square ends and sharp corners over solid candy areas. The tooltip is a box with its hard shadow; the legend chunky buttons that press in. Loading runs the yellow-and-black tape through the box.',
        },
        b: {
            name: 'The sticker sheet',
            text: 'The plot is a lavender sheet in a black frame; every line is a sticker cut out with a black outline, over areas with a black edge. The tooltip is a black plate with lavender shadow; the legend sticker labels. Loading drops blocks into the box one at a time.',
        },
    },
    deco: {
        a: {
            name: 'The gilt rules',
            text: 'Black lacquer between double gold rules above and below, the grid in long-short gold hairlines, the tick labels in the thin deco capitals. The areas are fluted like a deco column. The tooltip is a panel with a double gold border and stepped corners; the legend gold outlines, the pressed one gilded. Loading lets a glint run along the gilt rule.',
        },
        b: {
            name: 'The sunburst',
            text: 'A gold sunburst fans out from the foot of the plot behind the lines, under an arched gold frame. The tooltip is a deep emerald plaque between gold rules; the legend jewelled lamps that light when pressed. Loading opens the fan.',
        },
    },
    phantom: {
        a: {
            name: 'The stamped ledger',
            text: "The plot is a ledger page ruled in white, a red rubber stamp's frame pressed at a slant in its corner; the tick labels in the condensed capitals. The lines are stamp ink, grainy where the stamp did not take. The tooltip is a white index card with a red stamp line; the legend stamped labels, the pressed one in red. Loading slides the halftone screen.",
        },
        b: {
            name: 'The calling card',
            text: 'Black under a halftone screen, the lines in the violent red with a white second plate off register, the tick labels in condensed capitals. The tooltip is a cut-paper ransom note, white, set at a slant with a red shadow; the legend cut-paper scraps. Loading shuffles the halftone in hard steps.',
        },
    },
    retro: {
        a: {
            name: 'The plotter on fanfold paper',
            text: 'Continuous fanfold paper with its green-bar bands (in the teal) and a perforation, the tick labels in the pixel face. The lines are a plotter pen, crisp and thin. The tooltip is a 1995 tooltip: a plain box with a 1px black line; the legend raised bevelled buttons that sink when pressed. Loading shows the bands still: nothing blinks.',
        },
        b: {
            name: 'The spreadsheet chart of 1995',
            text: 'A spreadsheet chart of 1995: a grey plot area sunk into a bevel, solid black grid lines, crisp lines over areas filled with the 50 % dither. The tooltip is a little window with a navy title bar; the legend sits in a raised frame. Loading fills the plot with the dither, still.',
        },
    },
    grotesk: {
        a: {
            name: 'The Swiss grid',
            text: 'White paper, one heavy black baseline, hairline grid, the tick labels in bold grotesque set flush. The lines are flat with sharp corners, the first in red. The tooltip is a black plate with white figures; the legend plain words, a red square before the pressed one. Loading cuts in three black squares, one after another, in hard steps.',
        },
        b: {
            name: 'The zebra scale',
            text: 'A zebra time scale of twelve columns along the foot of the plot and a column grid above it; the lines black and red. The tooltip is a red plate with white text; the legend numbered 01, 02, 03 in the grotesque. Loading hops the zebra one column and back.',
        },
    },
    nostromo: {
        a: {
            name: 'The amber CRT',
            text: 'The plot is a dark CRT set into the beige case: rounded glass, a vignette and scanlines, the lines amber and cream phosphor with their glow, the tick labels in the mono. The crosshair is a block cursor. The tooltip is a phosphor readout boxed on the screen; the legend raised beige keys with an LED that lights when the key is pressed into a well. Loading warms the screen while the cursor blinks.',
        },
        b: {
            name: 'The strip-chart recorder',
            text: 'The plot is the paper roll of a 1979 strip-chart recorder: orange millimetre grid on pale paper, the pens in dark ink and orange. The tooltip is a strip of embossed black label tape; the legend label tape too. Loading feeds the roll through at an even pace.',
        },
    },
    titanium: {
        a: {
            name: 'The engraved dial face',
            text: 'The plot is a face of brushed titanium; the grid lines and the tick labels are engraved, a dark cut over a lit lip; the lines are anodised colour laid into the metal. The tooltip is a machined plate held by four screws; the legend machined keys. Loading runs the cutter across the face at an even, linear pace: metal does not ease.',
        },
        b: {
            name: 'The vernier',
            text: "Carbon weave under the plot and a vernier scale engraved along its top; the crosshair is the vernier's zero line in the blue oxide. The tooltip is the vernier's sliding plate with a knurled edge; the legend knurled keys. Loading rolls the knurl, linearly.",
        },
    },
};

/** @typedef {'shape' | 'loading' | 'arrival' | 'update' | 'events' | 'tip'} Aspect */
/** @typedef {{ key: string, name: string, text: string, ink?: string, ink2?: string, say?: string }} Option */

/** The six aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: 'The drawn chart: the paper, the frame, the grid, the tick labels, the lines and areas, the legend. Compare them as they stand.',
    },
    { id: 'loading', label: 'While loading', about: 'The picture the plot shows while the readings load. Press Loading; every option moves.' },
    { id: 'arrival', label: 'How the series arrives', about: 'How the lines come in once the readings are there. Press Drawn to replay it.' },
    { id: 'update', label: 'How a new reading shows', about: 'A live update: one new reading at the right end. Press Live update.' },
    { id: 'events', label: 'The event dots', about: 'The dots above the plot (the alarm, the restart) and their lines down into it.' },
    {
        id: 'tip',
        label: 'The pinned tooltip',
        about: 'The tooltip, pinned at 07:30 with the alarm and the restart in reach (here and in the preview; elsewhere point at a plot). Keep "The tooltip, pinned" on.',
    },
];

/** Round 1's picks (Kenny, 2026-10-05 20:03); high-contrast, solstice and brutalism are open. */
const PICK = {
    formal: 'b',
    light: 'b',
    dark: 'b',
    terminal: 'b',
    phantom: 'b',
    retro: 'b',
    cyberpunk: 'a',
    synthwave: 'a',
    pastel: 'a',
    forest: 'a',
    sepia: 'a',
    blueprint: 'a',
    deco: 'a',
    grotesk: 'a',
    nostromo: 'a',
    titanium: 'a',
};

/** What each kind does, the same words in every theme; the name is the theme's own. */
const KIND = {
    loading: {
        type: 'A line is typed out behind a block cursor that blinks, then typed again.',
        scan: 'Fine scanlines over the plot; a bright band runs down them, over and over.',
        sweep: 'A beam crosses the plot with its afterglow behind it, left to right, again and again.',
        cutter: 'A cutter runs across at an even, linear pace and leaves a brushed track behind it.',
        knurl: 'A knurled band rolls in place at an even pace.',
        hazard: 'A band of stripes crawls along the middle of the plot.',
        dash: 'A pen rules a dashed line across, one dash at a time, in hard steps.',
        pen: 'A stroke is written across the plot, the nib at its head, then written again.',
        halftone: 'A dot screen lies on the plot; a patch of heavier dots shifts in hard steps.',
        hatch: 'Hatching is laid in from the left until it covers the plot, then laid again.',
        blocks: 'Three blocks are cut in, one after another, in hard steps.',
        hop: 'Three dots in a row; a fourth hops along them and back.',
        feed: 'The ruled paper feeds through under a still pen, at an even pace.',
        rise: 'A band of light rises from the foot of the plot to its top, again and again.',
        glint: 'A glint runs along a double rule across the plot.',
        march: 'Dashes march round the inside of the frame.',
        fan: 'Rays fan out from the foot and swing a little to and fro.',
        radar: 'A beam goes round over still rings, like a sweep on a screen.',
        drop: 'A block drops from the top onto a floor line, again and again.',
        dither: 'The dither shifts by a pixel in hard steps while a framed bar fills, step by step.',
        needle: 'A needle searches to and fro along a graduated arc.',
        stamp: 'A ruled stamp comes down on the page, once a beat.',
        tape: 'A strip of striped tape slides across the plot over a dotted line.',
        embers: 'Sparks rise from a glowing floor at an even pace.',
        segments: 'A framed bar fills segment by segment, then starts again.',
    },
    arrival: {
        none: 'The lines are there at once, as round 1 drew them.',
        wipe: 'The lines are revealed from the left, slowing as they land.',
        steps: 'The lines are revealed from the left in ten hard steps.',
        linear: 'The lines are revealed from the left at an even, linear pace.',
        draw: 'A pen draws each line from its start; the area follows under it.',
        rise: 'The lines grow up from the baseline with a small overshoot.',
        drop: 'The lines drop in from above and land hard.',
        centre: 'The lines open from the middle outwards.',
        scan: 'The lines are revealed from the top down, at an even pace.',
        glitch: 'The lines tear in from the left in jerky steps, shifting sideways as they come.',
        stamp: 'The lines are stamped on: a hair larger, then pressed flat at once.',
    },
    update: {
        none: 'The new reading simply appears at the right end, as round 1 drew it.',
        shift: 'The lines slide one step to the left, slowing as they land, and the new reading is there.',
        tick: 'The lines move one step to the left in three hard ticks.',
        tail: 'The newest stretch at the right end is drawn in.',
        swell: 'The lines swell once and settle back to their width.',
        jolt: 'The lines jolt up and settle, like a needle taking a reading.',
        glitch: 'The lines jitter sideways for a moment in hard steps.',
    },
    events: {
        shape: 'The dots and lines exactly as the picked shape draws them.',
        ring: "Each event is a hollow ring in its tone on the paper, its line solid in the event's tone.",
        bead: 'Each dot is ringed with a beaded ink edge, like a rivet; its line dotted in ink.',
        halo: 'Each dot sits in a soft halo of its own tone; its line in long dashes.',
        pin: 'A smaller dot ringed in ink on a solid ink stem: a map pin.',
        target: "A solid dot with a crisp outline, its line in short dashes in the event's tone.",
    },
};

/**
 * Per theme, the options of the four aspects that are not taken from round
 * 1: [kind, name, ink token, second ink token, words typed].
 * @type {Record<string, { loading: [string, string, string?, string?, string?][], arrival: [string, string][], update: [string, string][], events: [string, string][] }>}
 */
const R2 = {
    formal: {
        loading: [
            ['pen', 'The fountain pen', '--primary', '--foreground'],
            ['dash', 'The ruling pen', '--primary', '--primary'],
            ['stamp', 'The received stamp', '--primary'],
        ],
        arrival: [
            ['wipe', 'Entered from the left'],
            ['draw', 'Written in by hand'],
        ],
        update: [
            ['tail', 'The new line entered'],
            ['shift', 'The page moved on'],
        ],
        events: [
            ['ring', 'Open circles'],
            ['pin', 'Pins in the margin'],
        ],
    },
    light: {
        loading: [
            ['glint', 'Sunlight along the seam', '--primary', '--chart-2'],
            ['rise', 'Morning rising', '--primary', '--primary'],
            ['hop', 'Three beads', '--primary', '--primary'],
        ],
        arrival: [
            ['rise', 'Grows into the light'],
            ['wipe', 'Drawn in, softly'],
        ],
        update: [
            ['shift', 'Slides along'],
            ['tail', 'A new piece drawn'],
        ],
        events: [
            ['ring', "The divider's open circle"],
            ['halo', 'A dot in its own light'],
        ],
    },
    dark: {
        loading: [
            ['sweep', 'The slit scan', '--primary'],
            ['cutter', 'The mill pass', '--muted-foreground', '--primary'],
            ['radar', 'The calibration ring', '--primary'],
        ],
        arrival: [
            ['linear', 'Milled in, evenly'],
            ['scan', 'Exposed top down'],
        ],
        update: [
            ['tail', 'The new cut'],
            ['tick', 'Indexed one step'],
        ],
        events: [
            ['ring', 'Engraved rings'],
            ['target', 'Lit markers'],
        ],
    },
    cyberpunk: {
        loading: [
            ['scan', 'The HUD scan', '--primary'],
            ['type', 'The jack-in prompt', '--primary', , "'> jack_in --gauges'"],
            ['march', 'The data perimeter', '--accent'],
        ],
        arrival: [
            ['glitch', 'Glitched in'],
            ['scan', 'Scanned in'],
        ],
        update: [
            ['glitch', 'A glitch'],
            ['tick', 'A packet in'],
        ],
        events: [
            ['target', 'Lock-on markers'],
            ['halo', 'Neon beacons'],
        ],
    },
    synthwave: {
        loading: [
            ['feed', 'The floor drives on', '--primary', '--accent'],
            ['rise', 'The sun comes up', '--primary', '--accent'],
            ['scan', 'The tracking line', '--accent'],
        ],
        arrival: [
            ['rise', 'Up from the horizon'],
            ['scan', 'Rolled in like tape'],
        ],
        update: [
            ['shift', 'The floor rolls on'],
            ['swell', 'A neon swell'],
        ],
        events: [
            ['halo', 'Neon beacons'],
            ['ring', 'Neon rings'],
        ],
    },
    pastel: {
        loading: [
            ['blocks', 'Sugar cubes', '--primary', '--accent'],
            ['halftone', 'The riso dots shuffle', '--primary', '--accent'],
            ['tape', 'A ribbon pulled through', '--primary', '--accent'],
        ],
        arrival: [
            ['rise', 'Bounces up'],
            ['centre', 'Unwrapped from the middle'],
        ],
        update: [
            ['jolt', 'A happy hop'],
            ['swell', 'Puffs up'],
        ],
        events: [
            ['halo', 'Candy drops'],
            ['ring', 'Sticker rings'],
        ],
    },
    terminal: {
        loading: [
            ['type', 'The prompt', '--primary', , "'$ tail -f gauges'"],
            ['segments', 'The progress bar', '--primary', '--primary'],
            ['sweep', 'The phosphor sweep', '--primary'],
        ],
        arrival: [
            ['steps', 'Printed column by column'],
            ['scan', 'Refreshed top down'],
        ],
        update: [
            ['tick', 'One line scrolls'],
            ['tail', 'The new sample drawn'],
        ],
        events: [
            ['ring', 'Open cells'],
            ['target', 'Lit cells'],
        ],
    },
    forest: {
        loading: [
            ['pen', 'The pencil sketch', '--foreground', '--accent'],
            ['needle', 'The compass needle', '--primary', '--accent'],
            ['drop', 'A pine cone drops', '--primary', '--accent'],
        ],
        arrival: [
            ['draw', 'Sketched in'],
            ['rise', 'Grows from the ground'],
        ],
        update: [
            ['tail', 'The new mile walked'],
            ['shift', 'The trail moves on'],
        ],
        events: [
            ['pin', 'Trail pins'],
            ['ring', 'Waymarks'],
        ],
    },
    'high-contrast': {
        loading: [
            ['segments', 'The progress bar', '--foreground', '--primary'],
            ['blocks', 'Three ink squares, cut in', '--foreground', '--primary'],
            ['march', 'The marching frame', '--foreground'],
        ],
        arrival: [
            ['steps', 'In ten clear steps'],
            ['wipe', 'Drawn in from the left'],
            ['linear', 'At an even pace'],
        ],
        update: [
            ['tick', 'One clear tick'],
            ['tail', 'The new piece drawn'],
            ['none', 'Just there'],
        ],
        events: [
            ['ring', 'Heavy rings'],
            ['pin', 'Ink pins'],
            ['bead', 'Beaded rings'],
        ],
    },
    sepia: {
        loading: [
            ['pen', 'The dip pen', '--foreground', '--primary'],
            ['stamp', 'The platen comes down', '--primary'],
            ['halftone', "The engraver's dots", '--foreground', '--primary'],
        ],
        arrival: [
            ['draw', 'Written with the nib'],
            ['stamp', 'Pressed into the paper'],
        ],
        update: [
            ['tail', 'A new stroke'],
            ['shift', 'The page turns on'],
        ],
        events: [
            ['ring', 'Ink rings'],
            ['bead', 'Wax-seal beads'],
        ],
    },
    blueprint: {
        loading: [
            ['dash', 'The plotter pen', '--foreground', '--accent'],
            ['sweep', 'The scanner bar', '--foreground'],
            ['needle', 'The protractor arm', '--foreground', '--accent'],
        ],
        arrival: [
            ['draw', 'Plotted in'],
            ['linear', 'Traced at an even pace'],
        ],
        update: [
            ['tail', 'The next segment plotted'],
            ['tick', 'Indexed one step'],
        ],
        events: [
            ['ring', 'Datum circles'],
            ['target', 'Reference marks'],
        ],
    },
    solstice: {
        loading: [
            ['embers', 'Embers rising', '--primary', '--accent'],
            ['rise', 'The sun rising', '--primary', '--accent'],
            ['glint', 'Firelight along the rule', '--primary', '--primary'],
        ],
        arrival: [
            ['rise', 'Rises like the sun'],
            ['wipe', 'Lit from the left'],
            ['draw', 'Drawn in fire'],
        ],
        update: [
            ['swell', 'Flares once'],
            ['tail', 'A new ember'],
            ['shift', 'The day moves on'],
        ],
        events: [
            ['halo', 'Glowing embers'],
            ['bead', 'Rivets'],
            ['ring', 'Iron rings'],
        ],
    },
    brutalism: {
        loading: [
            ['drop', 'The block drop', '--foreground', '--accent'],
            ['hazard', 'Hazard tape', '--foreground', '--primary-foreground'],
            ['blocks', 'Cut in three', '--foreground', '--accent'],
        ],
        arrival: [
            ['drop', 'Dropped in'],
            ['steps', 'In hard steps'],
            ['stamp', 'Slammed on'],
        ],
        update: [
            ['jolt', 'A hard jolt'],
            ['tick', 'A hard tick'],
            ['none', 'Just there'],
        ],
        events: [
            ['pin', 'Black pins'],
            ['bead', 'Bolts'],
            ['ring', 'Fat rings'],
        ],
    },
    deco: {
        loading: [
            ['fan', 'The fan rays', '--primary'],
            ['march', 'The marquee lights', '--primary'],
            ['needle', 'The elevator dial', '--primary', '--primary'],
        ],
        arrival: [
            ['centre', 'Opens like a curtain'],
            ['rise', 'Rises like a skyline'],
        ],
        update: [
            ['shift', 'Glides on'],
            ['tail', 'A new gilt piece'],
        ],
        events: [
            ['bead', 'Jewelled studs'],
            ['ring', 'Gold rings'],
        ],
    },
    phantom: {
        loading: [
            ['stamp', 'The calling-card stamp', '--primary'],
            ['type', 'The typewriter', '--foreground', , "'TAKE YOUR TIME'"],
            ['blocks', 'Cut-out letters', '--primary', '--foreground'],
        ],
        arrival: [
            ['stamp', 'Stamped on'],
            ['glitch', 'Torn in'],
        ],
        update: [
            ['jolt', 'A hard jolt'],
            ['glitch', 'Torn'],
        ],
        events: [
            ['target', 'Red marks'],
            ['pin', 'Pinned notes'],
        ],
    },
    retro: {
        loading: [
            ['dither', 'The dither bar', '--foreground', '--primary'],
            ['segments', 'The 1995 progress bar', '--foreground', '--primary'],
            ['type', 'The DOS prompt', '--foreground', , "'C:\\\\> LOAD GAUGES'"],
        ],
        arrival: [
            ['steps', 'Painted in steps'],
            ['scan', 'Redrawn top down'],
        ],
        update: [
            ['tick', 'One step on'],
            ['tail', 'The new column painted'],
        ],
        events: [
            ['pin', 'Push pins'],
            ['ring', 'Bevel rings'],
        ],
    },
    grotesk: {
        loading: [
            ['segments', 'The ruled bar', '--foreground', '--primary'],
            ['dash', 'The column count', '--foreground', '--primary'],
            ['drop', 'The square drops', '--foreground', '--primary'],
        ],
        arrival: [
            ['steps', 'Column by column'],
            ['linear', 'At an even pace'],
        ],
        update: [
            ['tick', 'One column on'],
            ['tail', 'The new column'],
        ],
        events: [
            ['pin', 'Black pins'],
            ['target', 'Red marks'],
        ],
    },
    nostromo: {
        loading: [
            ['type', 'MU-TH-UR at the prompt', '--primary', , "'INTERFACE 2037 READY'"],
            ['radar', 'The motion tracker', '--primary'],
            ['scan', 'The CRT warms', '--primary'],
        ],
        arrival: [
            ['scan', 'Drawn by the beam'],
            ['steps', 'Plotted in steps'],
        ],
        update: [
            ['tick', 'The roll ticks on'],
            ['jolt', 'The pen kicks'],
        ],
        events: [
            ['target', 'Blips'],
            ['ring', 'Rings on the glass'],
        ],
    },
    titanium: {
        loading: [
            ['cutter', 'The mill pass', '--muted-foreground', '--primary'],
            ['needle', 'The dial indicator', '--muted-foreground', '--primary'],
            ['sweep', 'The laser etch', '--primary'],
        ],
        arrival: [
            ['linear', 'Milled in, linearly'],
            ['draw', 'Etched in'],
        ],
        update: [
            ['tick', 'Indexed one step'],
            ['tail', 'The new cut'],
        ],
        events: [
            ['bead', 'Screw heads'],
            ['ring', 'Machined rings'],
        ],
    },
};

/** Round 2's new shapes and tooltips for the three open themes. */
const NEW = {
    'high-contrast': {
        shape: [
            {
                key: 'hc1',
                name: 'The signal board',
                text: 'White paper with one heavy L of ink along the left and the foot, the grid in grey hairlines, bold 13px figures; three-pixel lines told apart by pattern too (solid, dashed, dotted) and no areas; the legend has an ink bar before each source, the pressed one on signal yellow.',
            },
            {
                key: 'hc2',
                name: 'The highlighter',
                text: 'A 2px ink frame with a band of signal yellow along the foot, a dotted ink grid, bold figures; lines drawn 3.5px wide with a white halo so they stay apart where they cross, no areas; the legend underlined in ink, the pressed one highlighted yellow; the crosshair in the strong blue.',
            },
            {
                key: 'hc3',
                name: 'Large print',
                text: 'A 3px ink frame with rounded corners, 14px bold figures and a bigger title, a grey grid, four-pixel lines with patterns and a firmer area; the legend is large ink-framed pills, the pressed one filled blue.',
            },
        ],
        tip: [
            {
                key: 'hc1',
                name: 'The inverse plate',
                text: 'Black with white text and a thick signal-yellow bar on top.',
            },
            {
                key: 'hc2',
                name: 'The yellow card',
                text: 'Signal yellow in a 2px ink frame, black text.',
            },
            {
                key: 'hc3',
                name: 'The large-print card',
                text: 'White with a 3px blue frame and rounded corners, the text a size larger.',
            },
        ],
    },
    brutalism: {
        shape: [
            {
                key: 'br1',
                name: 'The poster',
                text: 'The plot printed on yellow stock in a 4px black frame with a hard black shadow, a heavy dotted grid, figures in Archivo Black; the first line black, the others red and violet, four pixels wide with square ends and no areas; the legend is chunky white boxes with a hard shadow that press in, black with yellow letters when pressed.',
            },
            {
                key: 'br2',
                name: 'The concrete block',
                text: 'Poured grey with aggregate speckle in a 3px black frame, three-pixel rules for the grid, figures in Archivo Black, five-pixel lines with square ends over firm areas; the legend is black slabs with white letters, lavender when pressed.',
            },
            {
                key: 'br3',
                name: 'The cut-out',
                text: 'A white card in a 3px black line, lifted off a lavender block that shows at its lower right; a dashed grid, bold figures; every line outlined in black like a cut-out; the legend is round sticker tags, lavender when pressed.',
            },
        ],
        tip: [
            { key: 'br1', name: 'The hard box', text: 'White in a 3px black line with a hard black shadow, the time in Archivo Black capitals.' },
            { key: 'br2', name: 'The black slab', text: 'Black with white text and a thick lavender bar down its left side.' },
            { key: 'br3', name: 'The lavender sticker', text: 'Lavender with rounded corners, a 3px black line and a hard shadow.' },
        ],
    },
    solstice: {
        shape: [
            {
                key: 'a',
                name: 'The low sun',
                text: "Round 1's character 1 (the background you liked): a low sun warming the bottom corner, the grid lines as long shadows, serif figures, warm glowing lines over firelit areas; stone pills for the legend.",
            },
            {
                key: 'so2',
                name: 'The hearth',
                text: 'Charcoal with a warm glow coming up from the foot, an ember-coloured dotted grid, serif figures; lines glowing softly in their own warmth over fuller areas; the legend is warm pills that glow when pressed.',
            },
            {
                key: 'so3',
                name: 'Midsummer dusk',
                text: 'The sky darkening upward from a rust horizon low in the plot, faint hairline grid, light serif figures with a little tracking, fine lines; the legend underlined words, amber under the pressed one.',
            },
        ],
        tip: [
            {
                key: 'b',
                name: 'The riveted iron plate',
                text: "Round 1's character 2 tooltip (the one you liked): an iron plate with four rivets.",
            },
            { key: 'a', name: 'The charcoal slab', text: "Round 1's character 1 tooltip: a charcoal slab with an ember edge." },
            { key: 'so3', name: 'The bronze plaque', text: 'A plaque with an inner amber rule, its time in amber serif capitals.' },
        ],
    },
};

/**
 * The verdicts so far, in the order of ASPECTS: shape, loading, arrival,
 * update, events, tip. Round 2 (Kenny, 2026-10-06 00:08) settled what he did
 * not name ("De dingen die ik niet specifiek benoem om aan te passen staan
 * vast en moeten niet terug een keuze zijn"); round 3 (2026-10-06 09:31)
 * settled 17 themes in full and every pick he ticked without a note. A number
 * is settled and not shown as a choice again; it counts in the newest list
 * of options that aspect has (round 4, else round 3, else round 2). '' is
 * open in round 4: six options from round4-<g>.js ("give 6 versions for
 * every loading screen in themes that I don't approve this round"; pastel's
 * event dots: "try six types").
 * @type {Record<string, string[]>}
 */
const PICKED = {
    formal: ['1', '3', '3', '1', '1', '1'],
    light: ['1', '2', '2', '1', '3', '1'],
    dark: ['2', '2', '2', '1', '3', '2'],
    synthwave: ['1', '1', '2', '1', '3', '1'],
    'high-contrast': ['1', '3', '3', '3', '3', '1'],
    solstice: ['3', '1', '1', '1', '2', '2'],
    cyberpunk: ['3', '1', '2', '1', '2', '1'],
    pastel: ['2', '2', '2', '1', '2', '1'],
    terminal: ['2', '6', '1', '1', '2', '1'],
    forest: ['1', '6', '3', '1', '1', '1'],
    sepia: ['2', '5', '3', '1', '3', '2'],
    blueprint: ['1', '5', '3', '1', '3', '1'],
    brutalism: ['1', '3', '1', '3', '2', '1'],
    deco: ['1', '1', '3', '1', '1', '1'],
    phantom: ['1', '2', '1', '1', '1', '1'],
    retro: ['1', '3', '2', '3', '2', '3'],
    grotesk: ['1', '2', '3', '1', '1', '3'],
    nostromo: ['1', '1', '3', '1', '2', '1'],
    titanium: ['1', '1', '3', '1', '2', '1'],
};
/** The settled pick of one aspect, or '' when it is open in round 4. */
const keptOf = (/** @type {string} */ theme, /** @type {Aspect} */ aspect) => PICKED[theme]?.[ASPECTS.findIndex((a) => a.id === aspect)] ?? '';
/** Round 3's new options, per theme and open aspect (one file per theme group). @type {Record<string, Partial<Record<Aspect, Option[]>>>} */
const R3 = { ...R3A, ...R3B, ...R3C, ...R3D, ...R3E };
/** Round 4's new options (six each), per theme and open aspect. @type {Record<string, Partial<Record<Aspect, Option[]>>>} */
const R4 = { ...R4A, ...R4B, ...R4C, ...R4D, ...R4E };
/** The most options any open aspect has. */
const MOST = 6;

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const lower = (/** @type {string} */ name) => name.replace(/^(The|A) /, (m) => m.toLowerCase());

/** Every theme's three options per aspect, built from the tables above. @type {Record<string, Record<Aspect, Option[]>>} */
const OPTIONS = Object.fromEntries(
    Object.keys(IDEAS).map((theme) => {
        const pick = PICK[theme];
        const r2 = R2[theme];
        const other = pick === 'a' ? 'b' : 'a';
        const plain = {
            key: 'plain',
            name: 'The plain chart, as today',
            text: "The package's own chart: the same shape as everywhere, in the theme's colours.",
        };
        /** @type {Record<Aspect, Option[]>} */
        const o = {
            shape: NEW[theme]?.shape ?? [
                { key: pick, name: IDEAS[theme][pick].name, text: `Approved in round 1. ${IDEAS[theme][pick].text}` },
                { key: other, name: IDEAS[theme][other].name, text: `Round 1's other character. ${IDEAS[theme][other].text}` },
                plain,
            ],
            tip: NEW[theme]?.tip ?? [
                {
                    key: pick,
                    name: theme === 'cyberpunk' ? 'The notched tooltip' : `The tooltip of ${lower(IDEAS[theme][pick].name)}`,
                    text:
                        theme === 'cyberpunk'
                            ? 'The tooltip is a plate with a cyan rim, the 8 px notch cut at its bottom-end corner, in mono; it splits in as four ticks of 120 ms and splits out as the same four the other way round.'
                            : 'Approved in round 1, with the shape you picked.',
                },
                { key: other, name: `The tooltip of ${lower(IDEAS[theme][other].name)}`, text: "Round 1's other character's tooltip." },
                { key: 'plain', name: 'The plain tooltip', text: "The package's popover, as today." },
            ],
            loading: r2.loading.map(([key, name, ink, ink2, say]) => ({ key, name, text: KIND.loading[key], ink, ink2, say })),
            arrival: [...(pick ? [['none', 'As approved: at once']] : []), ...r2.arrival].map(([key, name]) => ({
                key,
                name,
                text: KIND.arrival[key],
            })),
            update: [...(pick ? [['none', 'As approved: it appears']] : []), ...r2.update].map(([key, name]) => ({
                key,
                // Forest's decided "it appears" is its growth ring (research/character-chart/forest.js).
                name:
                    theme === 'forest' && key === 'none'
                        ? 'A growth ring on the newest point'
                        : theme === 'grotesk' && key === 'none'
                          ? 'Re-registered'
                          : theme === 'cyberpunk' && key === 'none'
                            ? 'The lines stutter home'
                            : name,
                text:
                    theme === 'forest' && key === 'none'
                        ? 'The new reading is drawn at once; a thin ring is drawn once round its newest point, clockwise from the top, then fades.'
                        : theme === 'grotesk' && key === 'none'
                          ? 'The new reading is drawn at once and the plot’s red plate falls back into register on it, clockwise, in 8 units.'
                          : theme === 'cyberpunk' && key === 'none'
                            ? 'The new reading is drawn at once; the lines come home from a yellow copy and a cyan copy of their own shape, 6, 4, 2, 1 px, four ticks of 120 ms, and never move themselves.'
                            : KIND.update[key],
            })),
            events: [...(r2.events.length < 3 ? [['shape', 'As the shape draws them']] : []), ...r2.events].map(([key, name]) => ({
                key,
                name,
                text: KIND.events[key],
            })),
        };
        // Round 3: an open aspect takes its three new options (while they
        // are not written yet, round 2's stay in their place).
        // An aspect takes the newest round's options it has: round 4's (six),
        // else round 3's (three); a settled number counts in that list.
        for (const { id } of ASPECTS) {
            if ((R4[theme]?.[id]?.length ?? 0) >= 3) o[id] = /** @type {Option[]} */ (R4[theme][id]);
            else if (R3[theme]?.[id]?.length === 3) o[id] = /** @type {Option[]} */ (R3[theme][id]);
        }
        return [theme, o];
    }),
);
/** Themes whose round-3 options are still being built (shown, but not ready to judge). */
const PENDING = [];
/** The aspects open in round 3, per theme. */
const openOf = (/** @type {string} */ theme) => ASPECTS.filter(({ id }) => !keptOf(theme, id));

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="chart"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// six choices per theme, each option's name and what it does as its hint.
// Round 3 asks only what Kenny sent back in round 2; every other aspect is
// settled with his pick and not shown in the dialog.
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map(({ id, label }) => ({
            id,
            label,
            options: [
                ...Array(
                    Math.max(
                        ...Object.values(OPTIONS)
                            .filter((o, i) => !keptOf(Object.keys(OPTIONS)[i], id))
                            .map((o) => o[id].length),
                        3,
                    ),
                ).keys(),
            ].map((at) => ({
                value: String(at + 1),
                label: String(at + 1),
                hints: Object.fromEntries(
                    Object.entries(OPTIONS)
                        .filter(([, o]) => o[id][at])
                        .map(([theme, o]) => [theme, `${o[id][at].name}. ${o[id][at].text}`]),
                ),
            })),
            // What Kenny picked in round 2 is the answer and is not asked again.
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
for (const theme of Object.keys(OPTIONS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    const open = openOf(theme).map(({ label }) => label.toLowerCase());
    p.textContent = PENDING.includes(theme)
        ? 'Not ready yet: the new options for this theme are still being built. Skip it for now; it comes back on To judge when it is done.'
        : open.length
          ? `Round 4: ${OPTIONS[theme][openOf(theme)[0].id].length} new options for ${open.length > 1 ? `${open.slice(0, -1).join(', ')} and ${open.at(-1)}` : open[0]}; ` +
            'everything else is settled as you picked it and is no longer a choice. Only the open rows are on the page; the preview at the top shows your picks. ' +
            'Press Loading at full speed and at ¼, Drawn, and Live update.'
          : 'Approved: every aspect is settled as you picked it.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

/** One chart group: the zoom chip and the pressure chart, the sparks only in the preview. */
const groupHtml = (/** @type {boolean} */ sparks) =>
    '<div class="kp-chart-group cc-group" data-kp-chart-group data-kp-chart-span="24h">' +
    '<div class="kp-chart-group__bar"><span class="kp-chart-zoom" data-kp-chart-zoom hidden></span></div>' +
    '<figure class="kp-chart" data-kp-chart data-cc-chart="pressure" aria-label="Pressure"><figcaption class="kp-chart__title">Pressure, bar</figcaption></figure>' +
    (sparks
        ? '<div class="cc-sparks"><div class="kp-chart" data-kp-chart="spark" data-cc-chart="spark-0" aria-label="Pump house 1 pressure"></div>' +
          '<div class="kp-chart" data-kp-chart="spark" data-cc-chart="spark-1" aria-label="Pump house 3 pressure"></div></div>'
        : '') +
    '</div>';

const preview = /** @type {HTMLElement} */ (section.querySelector('[data-cc-preview]'));
preview.innerHTML = groupHtml(true);
const rows = /** @type {HTMLElement} */ (section.querySelector('[data-cc-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'cc-aspect';
    box.setAttribute('data-cc-aspect', id);
    box.setAttribute('aria-labelledby', `h-cc-${id}`);
    const head = document.createElement('div');
    head.className = 'cc-aspect__head';
    head.innerHTML = `<h3 id="h-cc-${id}"></h3><p></p>`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'cc-trio';
    for (let at = 1; at <= MOST; at++) {
        const cell = document.createElement('div');
        cell.className = 'cc-col';
        cell.setAttribute('data-cc-vary', id);
        cell.setAttribute('data-cc-option', String(at));
        cell.innerHTML =
            `<p class="cc-label"><span class="cc-label__no">${label} · ${at}</span> <span data-cc-name></span></p>` +
            `<p class="cc-desc" data-cc-desc></p><div class="cc-cell" data-cc>${groupHtml(false)}</div>`;
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

/** Writes one wrapper's six attributes (and the loading option's inks and words) from option numbers. */
function dress(/** @type {Element} */ el, /** @type {Record<Aspect, string>} */ at) {
    const o = OPTIONS[theme()];
    if (!o) return;
    for (const { id } of ASPECTS) el.setAttribute(`data-cc-${id}`, o[id][Number(at[id]) - 1].key);
    const load = o.loading[Number(at.loading) - 1];
    const style = /** @type {HTMLElement} */ (el).style;
    style.setProperty('--ccl-ink', load.ink ? `var(${load.ink})` : '');
    style.setProperty('--ccl-ink2', load.ink2 ? `var(${load.ink2})` : '');
    style.setProperty('--ccl-text', load.say ?? '');
}

/** The preview takes the picks; each row's cell its own option in its own aspect, the picks in the rest. */
function compose() {
    const now = picks();
    const wrap = section.querySelector('[data-cc-preview]');
    if (wrap) dress(wrap, now);
    for (const cell of section.querySelectorAll('[data-cc-vary]')) {
        const vary = /** @type {Aspect} */ (cell.getAttribute('data-cc-vary'));
        const option = cell.getAttribute('data-cc-option') ?? '1';
        // A theme with fewer options than the row's cells leaves the rest empty.
        if (!OPTIONS[theme()]?.[vary]?.[Number(option) - 1]) continue;
        const inner = cell.querySelector('[data-cc]');
        if (inner) dress(inner, { ...now, [vary]: option });
        cell.classList.toggle('cc-picked', ticked[theme()]?.[vary] === option);
    }
    const words = section.querySelector('[data-cc-picks]');
    const o = OPTIONS[theme()];
    if (words && o) words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${o[id][Number(now[id]) - 1].name}`).join(' · ');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* -------------------------------------------------------- the readings */

// The catalogue's pump houses (catalogue/chart-sample.js), the last 24
// hours, with the events of that day only. A live update moves every
// source on by one reading: the oldest goes, a new one comes at the end.
const FULL = sampleData('pressure', '24h');
const EVENTS = (FULL.events ?? []).filter((ev) => ev.at > NOW - 24 * 3_600_000);
let moved = 0;
/** @param {number} n the sources shown @returns {import('../../js/chart.js').ChartData} */
const pressure = (n) => ({
    ...FULL,
    events: EVENTS,
    series: FULL.series.slice(0, n).map((s) => {
        const values = [...s.values];
        for (let i = 0; i < moved; i++) values.push(values[values.length - 1] + (i % 2 ? -0.04 : 0.07));
        return { ...s, start: s.start + moved * s.step, values: values.slice(moved) };
    }),
});
/** A spark line without the catalogue's own colour, so a character's colours reach it. @param {number} k */
const spark = (k) => {
    const d = sampleData(`spark-${k === 1 ? 1 : 0}`);
    return { ...d, series: d.series.map(({ colour: _, ...rest }) => rest) };
};

const state = {
    shown: /** @type {'filled' | 'loading' | 'empty' | 'error'} */ ('filled'),
    sources: 2,
    pin: true,
    zoom: false,
    press: false,
    hot: false,
};

const charts = () => /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-cc-chart="pressure"]')]);
const sparks = () => /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-cc-chart^="spark-"]')]);

/** Pin the tooltip at 07:30, the alarm and the restart within its reach, the way End, ← and Enter do. @param {HTMLElement} el */
function pinAt(el) {
    const tip = el.querySelector('.kp-chart__tip');
    if (tip?.hasAttribute('data-kp-pinned')) return;
    const plot = el.querySelector('.kp-chart__plot');
    if (!plot) return;
    const key = (/** @type {string} */ k) => plot.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    key('End');
    for (let i = 0; i < 18; i++) key('ArrowLeft');
    key('Enter');
}

/** Release a pinned tooltip with its own ✕. @param {HTMLElement} el */
function release(el) {
    const tip = el.querySelector('.kp-chart__tip[data-kp-pinned]');
    /** @type {HTMLElement | null} */ (tip?.querySelector('.kp-chart__release'))?.click();
}

/** Plays a one-off motion on every wrapper: sets the flag again so it restarts, and clears it when done. */
const timers = new Map();
function flag(/** @type {string} */ attr) {
    for (const el of section.querySelectorAll('[data-cc-preview], [data-cc]')) {
        el.removeAttribute(attr);
        void (/** @type {HTMLElement} */ (el).offsetWidth);
        el.setAttribute(attr, '');
    }
    clearTimeout(timers.get(attr));
    timers.set(
        attr,
        setTimeout(() => {
            for (const el of section.querySelectorAll(`[${attr}]`)) el.removeAttribute(attr);
        }, 2200 / rate),
    );
}

function draw() {
    for (const el of charts()) {
        if (state.shown === 'loading') {
            el.setAttribute('data-kp-chart-sources', String(state.sources));
            el.setAttribute('data-kp-chart-loading', '');
            continue;
        }
        const data = pressure(state.sources);
        if (state.shown === 'empty') setChartData(el, { ...data, series: data.series.map((s) => ({ label: s.label, points: [] })) });
        else if (state.shown === 'error') setChartData(el, { ...data, error: 'The gauge server did not answer at 09:00.' });
        else setChartData(el, data);
    }
    sparks().forEach((el) => {
        const k = Number(el.getAttribute('data-cc-chart')?.replace('spark-', '') ?? 0);
        const d = spark(k);
        setChartData(el, state.shown === 'filled' ? d : { ...d, series: d.series.map((s) => ({ label: s.label, points: [] })) });
    });
    showToggles();
}

function showToggles() {
    const filled = state.shown === 'filled';
    for (const el of charts()) {
        // Pinned only where the tooltip is judged (its own row and the
        // preview): elsewhere it would hide the plot of a narrow column.
        const judged = !!el.closest('[data-cc-preview], [data-cc-vary="tip"]');
        if (filled && state.pin && judged) pinAt(el);
        else if (!state.pin || !judged) release(el);
        chartSelect(el, null);
        if (state.press && state.sources > 1) chartSelect(el, 0, true);
        const first = el.querySelector('.kp-chart__source');
        first?.dispatchEvent(new PointerEvent(state.hot && state.sources > 1 ? 'pointerenter' : 'pointerleave'));
    }
    for (const group of document.querySelectorAll('.cc-group'))
        chartZoom(group, state.zoom ? { from: NOW - 5 * 3_600_000, to: NOW - 30 * 60_000 } : null);
}

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of document.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};
// Drawn after any other state brings the readings in the way the arrival
// does; Drawn again replays it.
for (const b of document.querySelectorAll('[data-cc-state]'))
    b.addEventListener('click', () => {
        state.shown = /** @type {typeof state.shown} */ (b.getAttribute('data-cc-state') ?? 'filled');
        pressed('data-cc-state', state.shown);
        draw();
        if (state.shown === 'filled') flag('data-cc-arriving');
    });
for (const b of document.querySelectorAll('[data-cc-live]'))
    b.addEventListener('click', () => {
        if (state.shown !== 'filled') {
            state.shown = 'filled';
            pressed('data-cc-state', 'filled');
        }
        moved += 1;
        draw();
        flag('data-cc-updating');
    });
for (const b of document.querySelectorAll('[data-cc-sources]'))
    b.addEventListener('click', () => {
        state.sources = Number(b.getAttribute('data-cc-sources'));
        pressed('data-cc-sources', String(state.sources));
        draw();
    });
for (const b of document.querySelectorAll('[data-cc-toggle]'))
    b.addEventListener('click', () => {
        const key = /** @type {'pin' | 'zoom' | 'press' | 'hot'} */ (b.getAttribute('data-cc-toggle'));
        state[key] = !state[key];
        b.setAttribute('aria-pressed', String(state[key]));
        showToggles();
    });

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-cc-theme-name]')) el.textContent = LABEL[now] ?? now;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) p.hidden = p.getAttribute('data-for') !== now;
    const o = OPTIONS[now];
    // A settled aspect has no row: only what is open in round 3 is shown.
    for (const box of section.querySelectorAll('[data-cc-aspect]'))
        /** @type {HTMLElement} */ (box).hidden = Boolean(keptOf(now, /** @type {Aspect} */ (box.getAttribute('data-cc-aspect'))));
    for (const cell of section.querySelectorAll('[data-cc-vary]')) {
        const option = o?.[/** @type {Aspect} */ (cell.getAttribute('data-cc-vary'))]?.[Number(cell.getAttribute('data-cc-option')) - 1];
        /** @type {HTMLElement} */ (cell).hidden = !option;
        const name = cell.querySelector('[data-cc-name]');
        const desc = cell.querySelector('[data-cc-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
    // A theme's register may change the chart's size or type: draw again.
    requestAnimationFrame(() => draw());
}

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-cc-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-meter; full speed by default, since a loop is judged at
// its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('cc-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-cc-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-cc-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-cc-speed'));
        try {
            localStorage.setItem('cc-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();

attachCharts(document);
showTheme();
draw();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
