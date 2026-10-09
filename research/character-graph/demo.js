// research/character-graph: the fourth component of the character round,
// all 22 themes in one demo judged through the review kit. Round 2 (Kenny,
// 2026-10-05 20:03: every demo gets separate options per aspect, like the
// meter, "and it should be like this in the future"): nothing is bundled any
// more. Each theme's network graph has five aspects, each picked on its own
// from three options: the shape, the loading picture, how the network
// arrives, how a pick and a hidden kind read, and how a live update shows.
//
// The graphs are the package's own: attachGraphs() (js/graph.js) builds the
// kinds, Show all, the picture and the hint, and keeps every behaviour
// (hover, picking, the keys, the kinds, the live update). Every aspect is CSS
// only, in graphs.css, keyed by one attribute each on the graph's wrapper
// (`data-cg-shape`, `data-cg-loading`, `data-cg-arrival`, `data-cg-focus`,
// `data-cg-live`), so any combination composes. This file marks the moment
// on each graph (`data-cg-moment`: "arrive" when a drawn network comes in,
// "live" on a live update) and the site and link a live update changed
// (`data-cg-changed`), which js/graph.js does not say. On the page: one
// composed preview showing the current picks, and per aspect a row of three
// graphs that differ in that aspect only. The controls sit in the section's
// `data-review-controls` container, which the review kit mirrors into its
// dialog. js/graph.js is not changed.

import {
    attachGraphs,
    GRAPH_CHANGE_EVENT,
    graphBends,
    graphHideKind,
    graphLayout,
    graphSelect,
    hubOf,
    ringOf,
    setGraphData,
    setGraphState,
} from '../../js/graph.js';
import { THEMES } from '../../js/theme-registry.js';
import R2A from './round2-a.js';
import R2B from './round2-b.js';
import R2C from './round2-c.js';
import R2D from './round2-d.js';
import R2E from './round2-e.js';
import R2F from './round2-f.js';
import R3A from './round3-a.js';
import R3B from './round3-b.js';
import R3C from './round3-c.js';
import R4A from './round4-a.js';
import R4B from './round4-b.js';

/** @typedef {[name: string, text: string, key?: string]} Option */
/** @typedef {'shape' | 'loading' | 'arrival' | 'focus' | 'live'} Aspect */

/** The five aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: 'The paper, the nodes, the links, the labels and the kinds above. Compare them as they stand, then hover a node.',
    },
    { id: 'loading', label: 'While loading', about: 'The picture while the network is read; it always moves. Press Loading.' },
    { id: 'arrival', label: 'How the network arrives', about: 'How the drawn network comes in after loading. Press Drawn to replay it.' },
    {
        id: 'focus',
        label: 'The picked node and the hidden kind',
        about: 'How a pick, the dimmed rest and a hidden kind read. In this row Pump house 3 is always picked and the radio links are always hidden.',
    },
    {
        id: 'live',
        label: 'Live update',
        about: 'How a site and its link show that their numbers just changed. Press Live update: a different site changes each time.',
    },
];

/**
 * Per theme, three options for each aspect: [name, what it does]. Shape 1
 * and 2 are round 1's two characters; the rest is said in each text.
 * @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            [
                'The organisation chart',
                'Hairline links, small open circles with a thin navy rule and a pale core, the hub in a double weight, labels in the serif’s small capitals; the kinds are small-caps entries with a rule under the one that is on.',
            ],
            [
                'The engraved plate',
                'A ruled border with a fine inner frame, links engraved as fine lines, solid dots inside an engraved ring, labels in serif italic; the kinds boxed like a map key.',
            ],
            [
                'The annual report',
                'Tracked serif capitals, hairline rules in the ink, every site a solid dot in a hairline ring, the hub ringed in a dotted rule; the kinds as tracked capitals with no box.',
            ],
        ],
        loading: [
            ['Counted dot by dot', 'Character 1’s dotted circle, now moving: the dots step slowly round, one at a time.'],
            ['Engraved round', 'Character 2’s engraved ring, now cut again and again by a fine burin line.'],
            ['The guilloché border', 'A navy rule of dots and dashes runs slowly round, like the border of a share certificate.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Inked in', 'The links are drawn with the pen from end to end, then each site is set down on them, one after another.'],
            ['Typeset', 'The sites are set one by one like type, without motion; the links are ruled in once every site stands.'],
        ],
        focus: [
            ['Pencil tint', 'As character 1 had it: the rest of the chart turns to a grey pencil tint; a hidden kind’s key turns grey.'],
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            [
                'Red-ink tick',
                'The pick is ringed in red ink; the rest stays half visible in grey pencil; a hidden kind is struck through in the key.',
            ],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['Re-inked', 'The changed site’s ring and its link are inked over in navy for a moment, then dry to their own colour.'],
            ['Amended in the margin', 'The changed site blinks three times like a correction mark; its link is ruled again.'],
        ],
    },
    light: {
        shape: [
            [
                'The soft canvas',
                'White discs on a soft shadow with their hue as a thin rim, soft round links, labels on a white halo; the kinds are soft pills.',
            ],
            ['Daylight', 'Every node a white disc with a wide pastel rim, round-capped links, a sunny amber hub over a warm wash; plain chips.'],
            [
                'The paper cut-out',
                'Cut paper on the page: each site a white disc with a grey cut edge and a full hue core, solid round links, semi-bold labels; the kinds as paper tabs with a printed edge below.',
            ],
        ],
        loading: [
            ['A soft dashed ring', 'Character 1’s soft dashed ring, now gliding slowly round.'],
            ['A band of daylight', 'As character 2 had it: one amber band of light runs round the ring.'],
            ['Pearls on a string', 'A string of round pearls in the primary slides round the ring.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Lifted onto the canvas', 'Each site rises a little into place, one after another, while the links draw out softly.'],
            ['Unfolding', 'The sites grow from a point with a soft overshoot, the links follow them out.'],
        ],
        focus: [
            ['Misted', 'As character 1 had it: the rest fades back into a soft mist at 22 %, the links nearly vanish.'],
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['The highlighter', 'The pick gets a wide amber highlighter ring; the rest stays at half strength; a hidden kind is struck through.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['A soft ripple', 'The changed site’s ring swells in the primary and settles; its link glows thicker for a moment.'],
            ['Sunlit', 'The changed site pops up in the sun and its link takes an amber light for a moment.'],
        ],
    },
    dark: {
        shape: [
            ['The status board', 'Black discs with a lit rim in their hue, thin lit links, ticker-mono labels; the kinds are square lit chips.'],
            ['The machined panel', 'Chamfered pockets lit from below, engraved lit links, mono capitals; the kinds are flat machined tabs.'],
            [
                'The OLED readout',
                'Pure black glass, every site a solid lit dot with no ring, links as thin lit lines, labels in mono on black; the kinds as underlined text.',
            ],
        ],
        loading: [
            ['The ticking ring', 'Character 1’s dim dashed ring, now ticking round a step at a time like a status board.'],
            ['The scanning light', 'Character 2’s machined ring with a lit segment that sweeps round it.'],
            ['The busy dots', 'Three lit dots chase each other round, as a phone’s busy sign.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Powered up', 'The sites switch on one after another; the links light once every site is on.'],
            ['Slid in', 'Each site slides up into its pocket and the links are drawn between them.'],
        ],
        focus: [
            ['Dull outline', 'As character 1 had it: the rest drops to a dull grey outline at 35 %.'],
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['Spotlit', 'The pick glows in the primary; the rest dims to 25 %; a hidden kind gets a dashed outline in the key.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The lit pulse', 'The changed site’s rim flashes white-hot and its link carries a pulse of light.'],
            ['The status blink', 'The changed site blinks three times like a status lamp; its link thickens for a moment.'],
        ],
    },
    cyberpunk: {
        shape: [
            [
                'The neon circuit',
                'A trace grid on black, neon tube links with a glow, glowing rings with a dark core, a hazard-yellow hub; cut-corner neon chips.',
            ],
            ['The netrunner map', 'Square-capped data links, thick broken ICE rings, condensed display capitals; hazard-taped tabs.'],
            [
                'The holo HUD',
                'A cyan holo overlay: thin square links, nodes as hexagon-cut rings with a bright core, mono labels, scan lines over the glass; the kinds as bracketed HUD tags.',
            ],
        ],
        loading: [
            ['The packet run', 'As character 1 had it: one bright packet runs round the dashed ring.'],
            ['The ICE spins', 'As character 2 had it: the broken ICE ring spins fast.'],
            ['The glitch', 'The ring is torn into data blocks that jump and jitter in hazard yellow.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Jacked in', 'The neon links flicker on like tubes igniting, then the sites switch on in a burst.'],
            ['The data burst', 'Every site shoots out from the hub to its place, the links trace after them.'],
        ],
        focus: [
            ['Glow killed', 'As character 1 had it: everything not picked loses its colour and its glow.'],
            ['Cold outline', 'As character 2 had it: the rest goes grey and darker, a cold outline.'],
            [
                'Target lock',
                'The pick gets a hazard-yellow lock ring with a glow; the rest drops to 20 %; a hidden kind is struck through like a dead link.',
            ],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The glitch', 'The changed site glitches sideways for a moment; its link carries a packet.'],
            ['The neon surge', 'The changed site’s ring and its link surge in hazard yellow and cool back.'],
        ],
    },
    synthwave: {
        shape: [
            [
                'The grid-floor constellation',
                'A perspective floor and a pink horizon, star nodes with a glow ring, glowing star lines, VT323 labels; glass chips.',
            ],
            ['The arcade vector screen', 'Outline-only nodes and glowing links under scanlines, VT323 capitals; neon-outlined chips.'],
            [
                'The chrome sunset',
                'A striped sunset disc behind the hub, chrome-white rings with a pink core, thick neon links, VT323 labels; the kinds as chrome-edged chips.',
            ],
        ],
        loading: [
            ['The horizon breathes', 'Character 1’s pink horizon ring, now breathing in and out.'],
            ['The vector ring', 'As character 2 had it: the vector ring runs round.'],
            ['The VHS roll', 'A tracking band rolls down the screen over a pink ring, as a tape finding its place.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Stars come out', 'The stars appear one by one across the sky, then the lines between them are drawn.'],
            ['Vector draw', 'The vector beam draws every link fast, then the nodes snap in.'],
        ],
        focus: [
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['Neon spotlight', 'The pick glows pink; the rest dims to a quarter; a hidden kind is outlined dashed in the key.'],
            ['Night falls', 'Everything but the pick turns grey and dark, as lights going out across the city; a hidden kind is struck through.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The laser flash', 'The changed site’s ring flashes pink and its link carries a laser pulse.'],
            ['The arcade pop', 'The changed site pops like a score, its link surges cyan.'],
        ],
    },
    pastel: {
        shape: [
            ['Candy beads and licorice', 'Fat candy beads with a highlight, thick round licorice strings, bold labels; sticker-shadow chips.'],
            ['The pinboard doodle', 'A dotted pad, dotted hand-drawn rings, dashed doodle links; washi-tape chips.'],
            [
                'The gumdrops',
                'Soft gumdrops on a pink sheet: every site a filled pastel blob with a white sugar ring, soft links, rounded labels; the kinds as round candy buttons.',
            ],
        ],
        loading: [
            ['The beads hop', 'As character 1 had it: the bead ring hops round a bead at a time.'],
            ['The doodle drifts', 'As character 2 had it: the dashed doodle drifts round.'],
            ['The bouncing gumdrop', 'One fat candy dot bounces round the ring and squashes as it lands.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Beads dropped in', 'The beads drop one by one onto their strings with a little bounce.'],
            ['Popped', 'Every site pops from a point like a bubble, the strings follow.'],
        ],
        focus: [
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['The sticker', 'The pick wears a thick ink ring like a sticker; the rest fades to sugar at 35 %; a hidden kind is struck through.'],
            ['The heart', 'The pick hops up in a pink ring; the rest stays at half; a hidden kind’s chip is outlined dashed.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['A happy hop', 'The changed site hops twice; its string flashes pink.'],
            ['The wobble', 'The changed site wobbles like jelly; its string is drawn again.'],
        ],
    },
    terminal: {
        shape: [
            ['The box-drawing map', 'A framed text screen, square-capped phosphor links, dashed square-ish rings; [x] / [ ] kinds.'],
            ['traceroute', 'Hop-dot links, inverse-video node blocks, the hub in reverse video; underlined kinds.'],
            [
                'The ASCII plot',
                'Plain characters on the screen: every site an open circle in the phosphor with a + core, links in fine dotted ink, bold labels; the kinds as > prompts.',
            ],
        ],
        loading: [
            ['The text spinner', 'As character 1 had it: the dashed ring ticks round like a spinner.'],
            ['Hops marching', 'As character 2 had it: the hop dots march round.'],
            ['The blinking cursor', 'A block cursor blinks on the ring while it ticks a step at a time.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Printed line by line', 'The sites are printed one by one, as a command writes its output; the links come after.'],
            ['Scrolled up', 'The whole network scrolls up into place in four steps, as a screen filling.'],
        ],
        focus: [
            ['Half bright', 'As character 1 had it: the rest drops to half brightness.'],
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['Reverse video', 'The pick is drawn in reverse video; the rest dims to a quarter; a hidden kind is struck through.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The cursor blink', 'The changed site blinks three times like a cursor; its link runs a dotted packet.'],
            ['Bold for a beat', 'The changed site’s ring and its link turn bold phosphor for a beat.'],
        ],
    },
    forest: {
        shape: [
            ['The trail map', 'Contour rings on kraft, trail-dash links, cairn rings, a ranger station hub, serif italic labels; wooden markers.'],
            ['The canopy', 'Thick bark twigs, leaf discs with a dark vein ring, body-face labels; leaf tags.'],
            [
                'The mushroom ring',
                'A moss floor: every site a cap in its hue on a pale stem ring, links as roots in a thin root brown, serif labels; the kinds as round wooden tokens.',
            ],
        ],
        loading: [
            ['The trail walks', 'As character 1 had it: the trail dashes walk round.'],
            ['The canopy sways', 'Character 2’s thick leaf ring, now swaying gently in the wind.'],
            ['Fireflies', 'A few lit firefly dots drift round the clearing at different paces.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['The trail is walked', 'The trails are walked in from the station outwards, each site set down as the trail reaches it.'],
            ['Sprouting', 'Every site grows up from the ground with a little sway, the roots follow.'],
        ],
        focus: [
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['In the clearing', 'The pick stands in a sunlit ring; the rest falls back into the shade at 35 %; a hidden kind is struck through.'],
            ['Blazed', 'The pick is blazed with a bold trail ring; the rest is mossed over in green; a hidden kind’s marker is outlined dashed.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The rustle', 'The changed site rustles like a leaf in the wind; its trail is walked again.'],
            ['The firefly', 'The changed site’s ring lights up in firefly yellow; its link glows.'],
        ],
    },
    'high-contrast': {
        shape: [
            [
                'Patterned edges, shaped nodes',
                'Every kind its own heavy pattern, every node a different core shape, thick black rings, a 2px frame; framed kinds.',
            ],
            ['The ink plate', 'Black discs with a white core, heavy patterned links, a double-weight hub; framed buttons.'],
            [
                'The signage',
                'Wayfinding signage: heavy square-capped links, every site a thick ring with a solid square core, bold large labels on a full halo; the kinds as heavy black tabs with white text.',
            ],
        ],
        loading: [
            ['The heavy dash', 'Character 1’s heavy dashed ring, now stepping round in clear jumps.'],
            ['The running bar', 'Character 2’s solid ring with one heavy black bar running round it.'],
            ['The countdown', 'A thick ring that is counted off in four hard quarters, then starts again.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Placed', 'Each site is placed in one hard step, one after another; the links are drawn in after.'],
            ['Stamped', 'Every site is stamped down at once in two hard steps, then the links appear.'],
        ],
        focus: [
            ['The yellow ring', 'As character 1 had it: the pick gets a 6px focus-yellow ring, the rest drops to 40 %.'],
            [
                'The yellow ring, heavier',
                'As character 2 had it: the same focus-yellow ring on the ink plate, with the package’s dimming of the rest.',
            ],
            [
                'Boxed',
                'The pick gets a double ring (yellow inside black); the rest keeps full ink but loses its colour; a hidden kind is struck through.',
            ],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The thick flash', 'The changed site’s ring and its link turn focus-yellow and heavy for a moment, in two hard steps.'],
            ['The blink', 'The changed site blinks three times in full ink; its link is drawn again.'],
        ],
    },
    sepia: {
        shape: [
            ['The family tree', 'Fine nib lines, washed ink rings, a vignette, serif italic labels; an engraved key.'],
            ['The letterpress chart', 'Speckled paper, blind-impressed nodes, heavier ink rules, small-caps labels; printed borders.'],
            [
                'The old atlas',
                'An atlas plate: links as fine dotted roads, each site a town dot in a red-ink ring, a compass rose behind the hub, serif labels; the kinds as cartouche boxes.',
            ],
        ],
        loading: [
            ['The nib draws', 'As character 1 had it: the nib draws the ring again and again.'],
            ['The platen presses', 'Character 2’s heavy ring, now pressed in by the platen with each beat.'],
            ['The pendulum', 'A short ink rule swings back and forth along the ring, like a clock’s pendulum.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Written by hand', 'Each link is written in with the nib, then the sites are inked one by one.'],
            ['Printed', 'The whole plate is printed in one pressing: everything comes down at once from slightly larger.'],
        ],
        focus: [
            ['Faded ink', 'As character 1 had it: the rest fades to faded sepia ink at 35 %.'],
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['Circled in red', 'The pick is circled in red ink; the rest stays at half; a hidden kind is struck through in the key.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['Re-inked', 'The changed site’s ring is inked over in dark ink, its link is written again.'],
            ['The seal', 'The changed site is pressed like a seal and its link darkens for a moment.'],
        ],
    },
    blueprint: {
        shape: [
            [
                'The wiring schematic',
                'A millimetre grid, white-ink wires, junction dots in a thin ring, an amber terminal block hub, mono capitals; a boxed legend.',
            ],
            ['The drafting sheet', 'A 40 px grid in a drawn frame, chain lines, dash-and-dot rings; title-block cells.'],
            [
                'The pin board',
                'An electronics layout: thick trace links with square ends, every site a square pad (a ring with a square core), a dimension frame; the kinds as silk-screened labels.',
            ],
        ],
        loading: [
            ['The plotter dashes', 'As character 1 had it: the plotter dashes the ring in amber.'],
            ['The dash marches', 'As character 2 had it: the chain line marches round.'],
            ['The compass draws', 'A white arc is drawn round with the compass, rubbed out and drawn again.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Plotted', 'The plotter draws every wire in turn, then sets each junction dot.'],
            ['Measured out', 'Every site is measured out from the hub along its line, and the wires follow.'],
        ],
        focus: [
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['Redlined', 'The pick is ringed in a redline; the rest goes faint like a back sheet; a hidden kind is struck through.'],
            ['Callout', 'The pick gets an amber callout ring; the rest stays at half; a hidden kind is outlined dashed.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['Revised', 'The changed wire is drawn again and the site’s ring flashes amber, as a revision cloud.'],
            ['The signal', 'A pulse runs down the changed wire and the site’s ring blinks.'],
        ],
    },
    solstice: {
        shape: [
            ['The low sun', 'A glow rising from the foot, warm links, sun-lit node rings with a glow; glowing chips.'],
            ['The embers', 'Coal-dash links, hot warning rims, the fire as the hub; ember chips.'],
            [
                'The sundial',
                'A sundial’s face: every site a gnomon dot on a fine bronze ring, links as hour lines, the hub a heavy bronze disc; the kinds as bronze plates.',
            ],
        ],
        loading: [
            ['A dawn rises', 'Character 1’s sun ring, now rising and settling like a slow dawn.'],
            ['The embers glow', 'Character 2’s ember ring, now flickering as coals do.'],
            ['The shadow turns', 'A gnomon’s shadow turns round the ring, as the sun crosses the sky.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Sunrise', 'The network rises from below the horizon into place; the links are lit as the sun reaches them.'],
            ['Kindled', 'Every site is lit like a flame, flickering on; the links catch after.'],
        ],
        focus: [
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['In the sun', 'The pick is lit by the sun with a warm glow; the rest falls into the evening at 30 %; a hidden kind is struck through.'],
            ['The hot coal', 'The pick glows red-hot; the rest cools to grey ash; a hidden kind is outlined dashed.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['A flare', 'The changed site flares in the sun’s colour and its link glows for a moment.'],
            ['A spark', 'The changed site jumps like a spark from the fire; its link flickers.'],
        ],
    },
    brutalism: {
        shape: [
            ['Slabs and heavy lines', '4px square-capped links, 4px black rings with a hard shadow, heavy capitals; black-bordered blocks.'],
            ['The sticker sheet', 'A lavender sheet, fat hue-filled stickers in black outline, heavy black links; askew sticker kinds.'],
            [
                'The poster grid',
                'A raw poster: a thick black frame, links as heavy black rules, every site a solid square-cut block in its hue, black capitals on yellow; the kinds as flat colour slabs.',
            ],
        ],
        loading: [
            ['The slab stamps', 'As character 1 had it: the heavy slab ring stamps round in three hard steps.'],
            ['The stickers drop', 'Character 2’s heavy ring, dropped onto the sheet again and again.'],
            ['The jackhammer', 'A thick black ring that shakes in hard jolts, as a jackhammer at work.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Slammed down', 'Every site is slammed down from above with a hard stop, one after another.'],
            ['Stamped', 'The sites are stamped on in two hard steps, the heavy rules after.'],
        ],
        focus: [
            ['The yellow pick', 'As character 1 had it: the pick is filled yellow with a 6px black ring.'],
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            [
                'Crossed out',
                'The pick keeps full colour in a heavy ring; the rest is greyed hard; a hidden kind is struck through with a thick line.',
            ],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The shake', 'The changed site shakes hard, its rule thickens for a moment.'],
            ['The stamp', 'The changed site is stamped again from larger and its rule flashes yellow.'],
        ],
    },
    deco: {
        shape: [
            ['Gilt rays', 'A lacquer sunburst in a double gold frame, fine gold rays, gold-framed medallions; gold plaques.'],
            ['The marquee', 'Every link a row of bulbs, nodes ringed in bulbs, display capitals; marquee plaques.'],
            [
                'The fan',
                'A gilded fan motif: links as triple fine gold lines, each site a stepped ziggurat ring (gold over black), tracked capitals; the kinds as stepped plaques.',
            ],
        ],
        loading: [
            ['A glint runs the gold', 'As character 1 had it: a gold glint runs round the ring.'],
            ['The bulbs chase', 'As character 2 had it: the bulbs chase round.'],
            ['The spotlight', 'A gold spotlight beam sweeps the stage while the ring of gold steps round.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Curtain up', 'The network rises like a curtain, then the gold rays are drawn from the hub.'],
            ['The lights come up', 'The bulbs of each site light one after another, the rays light after.'],
        ],
        focus: [
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['In the spotlight', 'The pick is lit in a gold spotlight; the rest goes dark at 30 %; a hidden kind is struck through.'],
            ['Gold-framed', 'The pick gets a double gold frame; the rest loses its colour; a hidden kind is outlined dashed.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The glint', 'A glint of gold runs down the changed ray and the site’s ring flashes gold.'],
            ['The bulb flash', 'The changed site flashes on and off like a marquee bulb; its ray thickens.'],
        ],
    },
    phantom: {
        shape: [
            ['Stamped tags and string', 'White card, red string, stamped ring tags, slanted capitals; askew ransom chips.'],
            ['The calling card', 'Black cards under a halftone, a red slash ring, white links; slanted card kinds.'],
            [
                'The ransom note',
                'Cut-out letters on black: every site a white disc with a heavy black ring, links in red and black, mixed-weight capitals; the kinds as cut-out blocks.',
            ],
        ],
        loading: [
            ['The stamp beats', 'As character 1 had it: the red stamp ring beats on and off.'],
            ['The halftone shuffles', 'As character 2 had it: the red dashes shuffle round.'],
            ['The calling-card spin', 'A red slash cuts round the ring in hard jumps while the halftone slides.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Pinned up', 'Each tag is pinned on with a jolt, slightly askew, one after another; the strings are pulled taut after.'],
            ['All-out attack', 'Every site slashes in from the side at once, the links cut in behind.'],
        ],
        focus: [
            ['The board goes grey', 'As character 1 had it: everything not picked turns grey.'],
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['The target', 'The pick gets a red target ring; the rest goes dark; a hidden kind is struck through like a struck name.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The slash', 'The changed site is slashed sideways in a jolt; its string snaps red.'],
            ['The calling card', 'The changed site’s ring flashes red three times; its string is pulled again.'],
        ],
    },
    grotesk: {
        shape: [
            ['The transit map', '5px round-capped coloured lines, white interchange rings, bold labels; flat colour bars.'],
            ['The Swiss grid', 'Hairline links, solid black discs, a red hub, bold labels flush beside them; boxed bold kinds.'],
            [
                'The Bauhaus primer',
                'Primary geometry: links as straight black rules, every site a flat disc in red, blue or yellow with no ring, the hub a black square; the kinds as flat primary blocks.',
            ],
        ],
        loading: [
            ['A line runs', 'As character 1 had it: a coloured line runs round.'],
            ['Three blocks cut in', 'As character 2 had it: three black blocks cut round in steps.'],
            ['The rotating square', 'A heavy red quarter turns round the ring in four exact steps, like a Swiss clock.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Lines laid', 'The lines are laid one after the other, then the stations are set down on them.'],
            ['The grid snaps', 'Every site slides in on its axis and snaps into the grid.'],
        ],
        focus: [
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['Red pick', 'The pick takes a red ring; the rest drops to 25 %; a hidden kind is struck through.'],
            ['Black frame', 'The pick takes a square black frame; the rest loses its colour; a hidden kind’s bar gets a dashed outline.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The train passes', 'A train runs along the changed line and the station’s ring flashes red.'],
            ['Re-set', 'The changed station pops and its line is laid again.'],
        ],
    },
    nostromo: {
        shape: [
            ['The CRT radar', 'A green-black CRT in the beige bezel under scanlines, phosphor traces and blips; phosphor tabs.'],
            ['The indicator panel', 'Embossed links, lit indicator lamps in a thick bezel, label-tape kinds.'],
            [
                'The vector monitor',
                'An amber vector monitor: every site a hollow amber diamond-cut ring, links as thin amber vectors, mono capitals in amber; the kinds as amber bracket tabs.',
            ],
        ],
        loading: [
            ['The radar sweep', 'As character 1 had it: a radar sweep turns over the picture and the blip ring waits.'],
            ['The lamps scan', 'As character 2 had it: the lamps scan round.'],
            ['MOTHER computes', 'A row of block characters fills the ring and is wiped, as MOTHER answering.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Blips acquired', 'The blips light one by one as the sweep finds them, the traces after.'],
            ['Switched on', 'The panel switches on: every lamp blinks on at once, the lines light after.'],
        ],
        focus: [
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['Target locked', 'The pick gets a bright phosphor lock ring; the rest drops to a dim trace; a hidden kind is struck through.'],
            ['The warning lamp', 'The pick is ringed in the warning amber; the rest is greyed; a hidden kind is outlined dashed.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The ping', 'The changed blip pings bright and its trace carries a pulse.'],
            ['The lamp blinks', 'The changed lamp blinks three times and its line lights amber.'],
        ],
    },
    titanium: {
        shape: [
            ['The milled plate', 'A brushed plate, engraved links, knurled (dotted) rings, a blue heat-tint hub, instrument mono; machined tabs.'],
            ['The instrument dial', 'Recessed apertures ringed in their anodised hue, a knurled hub ring, fine links; round chips.'],
            [
                'The anodised parts',
                'Anodised parts on a bead-blasted plate: each site a thick ring in its anodised hue with a bright machined core, links as fine laser-etched lines, mono labels; the kinds as anodised pills.',
            ],
        ],
        loading: [
            ['The cutter runs', 'As character 1 had it: the cutter runs round the ring.'],
            ['The knurl rolls', 'As character 2 had it: the knurled ring rolls.'],
            ['The lathe', 'A bright chip of metal is turned off the ring, spinning fast, with a blue heat-tint.'],
        ],
        arrival: [
            ['At once', 'As both characters had it: when the reading is done the whole network stands there in one frame; nothing moves in.'],
            ['Machined in', 'Every link is cut by the cutter in one pass, then each part is pressed into its seat.'],
            ['Dialled in', 'The parts turn into place like a dial being set, the links etched after.'],
        ],
        focus: [
            [
                'The package’s dimming',
                'As character 2 had it: a pick takes a heavier ring in its own colour, the rest drops back to 30 %, a hidden kind’s key turns grey.',
            ],
            ['Heat-tinted', 'The pick takes a blue heat-tint ring; the rest is brushed grey; a hidden kind is struck through.'],
            ['Engraved mark', 'The pick gets a fine engraved double ring; the rest stays at half; a hidden kind’s pill is outlined dashed.'],
        ],
        live: [
            ['In place', 'As both characters had it: the new numbers are simply there; nothing marks which site or link changed.'],
            ['The glint', 'A bright glint runs along the changed link and the part’s ring flashes blue.'],
            ['The click', 'The changed part clicks a notch round, like a dial; its link is etched again.'],
        ],
    },
};

/**
 * Round 2's verdicts (Kenny, 2026-10-06 10:58), in the order of ASPECTS:
 * shape, loading, arrival, focus, live. A number is settled and not shown as
 * a choice again; '' is open in round 3. Every theme's loading goes round
 * again, six options each ("it should be something based on the shape of
 * the graph (nodes and lines), now it's too detached from the end result.
 * Be creative"); brutalism keeps only its shape ("Only the shape is good,
 * the rest needs to be redone").
 * @type {Record<string, string[]>}
 * Round 4's verdicts (Kenny, 2026-10-06 21:07) settle all but the loading
 * of brutalism ("none fits brutalism … be creative") and grotesk ("some
 * don't even move"): six new options each in round 5 (round4-a/b).
 * Round 5's verdict (Kenny, 2026-10-06 21:37): brutalism 3, grotesk 3 (Out
 * of register, which also starts a grotesk-only loading demo after the
 * titanium one). Decided.
 */
const PICKED = {
    formal: ['3', '3', '3', '3', '2'],
    light: ['1', '3', '3', '3', '2'],
    dark: ['1', '3', '2', '3', '3'],
    cyberpunk: ['3', '4', '2', '3', '3'],
    synthwave: ['1', '4', '2', '2', '3'],
    pastel: ['1', '4', '2', '1', '3'],
    terminal: ['1', '4', '2', '2', '2'],
    forest: ['3', '3', '2', '3', '2'],
    'high-contrast': ['3', '2', '2', '2', '2'],
    sepia: ['2', '1', '2', '3', '3'],
    blueprint: ['2', '3', '2', '2', '2'],
    solstice: ['1', '2', '3', '2', '2'],
    brutalism: ['2', '3', '2', '2', '3'],
    deco: ['2', '3', '2', '3', '2'],
    phantom: ['1', '4', '2', '3', '2'],
    grotesk: ['1', '3', '2', '2', '2'],
    nostromo: ['1', '2', '3', '3', '3'],
    titanium: ['2', '3', '1', '2', '2'],
};
/** The settled pick of one aspect, or '' when it is open in round 4 (Kenny, 2026-10-06 12:31: loading again in high-contrast, brutalism, deco, grotesk and lapis, "don't like any of these"; brutalism's other open aspects too). */
const keptOf = (/** @type {string} */ theme, /** @type {Aspect} */ aspect) => PICKED[theme]?.[ASPECTS.findIndex((a) => a.id === aspect)] ?? '';
// Round 3's new options replace an open aspect's (each carries its own key
// as its third element, the attribute value its CSS answers to; round 2's
// are keyed 1, 2, 3).
// Merged per aspect, so two files may each bring one theme's aspects.
// An aspect takes the newest round's options it has (round 4's, else round
// 3's), whether open or settled: a settled number counts in that list.
for (const file of [R2A, R2B, R2C, R2D, R2E, R2F, R3A, R3B, R3C, R4A, R4B])
    for (const [t, aspects] of Object.entries(file))
        for (const [id, options] of Object.entries(aspects)) if (options.length >= 3) IDEAS[t][id] = options;
/** The attribute value of option n of an aspect in a theme. */
const keyOf = (/** @type {string} */ t, /** @type {Aspect} */ id, /** @type {string} */ n) => IDEAS[t]?.[id]?.[Number(n) - 1]?.[2] ?? n;
/** The most options any row shows. */
const MOST = 6;

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="graph"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// five choices per theme, each option's name and what it does as its hint.
// Round 3 asks only what Kenny sent back; the rest is settled and hidden.
const hints = (/** @type {Aspect} */ aspect, /** @type {number} */ at) =>
    Object.fromEntries(
        Object.entries(IDEAS)
            .filter(([, idea]) => idea[aspect][at])
            .map(([theme, idea]) => [theme, `${idea[aspect][at][0]}. ${idea[aspect][at][1]}`]),
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
        ? `Round 4: new options for ${open.map(({ id, label }) => `${label.toLowerCase()} (${idea[id].length} options)`).join(', ')}; everything else is settled as you picked it and is no longer a choice. ` +
          'Only the open rows are on the page; the combination at the top shows your picks. Press Loading at full speed and at ¼, Drawn and Live update.'
        : 'Approved: every aspect is settled as you picked it.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-gr-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'gr-aspect';
    box.setAttribute('data-gr-aspect', id);
    box.setAttribute('aria-labelledby', `h-gr-${id}`);
    const head = document.createElement('div');
    head.className = 'gr-aspect__head';
    head.innerHTML = `<h3 id="h-gr-${id}"></h3><p></p>`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'gr-trio';
    for (let at = 1; at <= MOST; at++) {
        const cell = document.createElement('div');
        cell.className = 'gr-col';
        cell.setAttribute('data-gr-vary', id);
        cell.setAttribute('data-gr-option', String(at));
        cell.innerHTML =
            `<p class="gr-label"><span class="gr-label__no">${label} · ${at}</span> <span data-gr-name></span></p>` +
            '<p class="gr-desc" data-gr-desc></p>' +
            `<div class="gr-graph" data-cg><figure class="kp-graph" data-kp-graph data-kp-key="network-${id}-${at}"></figure></div>`;
        cell.querySelector('figure')?.setAttribute('aria-label', `The northern network, ${label.toLowerCase()} ${at}`);
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

/** Writes the five aspects on every wrapper: the preview takes the picks, each row's cell its own option in its own aspect. */
function compose() {
    const now = picks();
    const preview = section.querySelector('[data-gr-preview]');
    const t = theme();
    for (const { id } of ASPECTS) preview?.setAttribute(`data-cg-${id}`, keyOf(t, id, now[id]));
    for (const cell of section.querySelectorAll('[data-gr-vary]')) {
        const vary = /** @type {Aspect} */ (cell.getAttribute('data-gr-vary'));
        const option = cell.getAttribute('data-gr-option') ?? '1';
        const wrap = cell.querySelector('[data-cg]');
        for (const { id } of ASPECTS) wrap?.setAttribute(`data-cg-${id}`, keyOf(t, id, id === vary ? option : now[id]));
        cell.classList.toggle('gr-picked', ticked[theme()]?.[vary] === option);
    }
    const words = section.querySelector('[data-gr-picks]');
    const idea = IDEAS[theme()];
    if (words && idea)
        words.textContent = ASPECTS.map(
            ({ id, label }) =>
                `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1][0]}${ticked[theme()]?.[id] || keptOf(theme(), id) ? '' : ' (not ticked yet)'}`,
        ).join(' · ');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* ---------------------------------------------------------- the network */

// The catalogue's northern network (catalogue/demos.js), the same on every
// load: a control centre, six pump houses, two reservoirs, a treatment plant
// and two addresses outside the network; or fifteen long names.

/** @type {import('../../js/graph.js').GraphKind[]} */
const KINDS = [
    { kind: 'telemetry', label: 'Telemetry', hint: 'Readings sent to the control centre every minute', style: 'solid', colour: 'var(--chart-1)' },
    { kind: 'control', label: 'Remote control', hint: 'Commands from the control centre to the site', style: 'dash', colour: 'var(--chart-2)' },
    { kind: 'radio', label: 'Radio link', hint: 'A spare path over radio for when the line is down', style: 'dot', colour: 'var(--chart-4)' },
    { kind: 'planned', label: 'Planned', hint: 'A link that is ordered but not live yet', style: 'long-dash', colour: 'var(--muted-foreground)' },
];

/** The sites a live update changes, one per press, each with a telemetry link to the hub. */
const CHANGING = ['ph4', 'ph1', 'north', 'ph3', 'plant', 'ph2', 'south', 'ph5'];

/** @param {{ weights: boolean, tick: number }} o @returns {import('../../js/graph.js').GraphData} */
function network({ weights, tick }) {
    const sites = [
        ['ph1', 'Pump house 1', 'two pumps, ring main west'],
        ['ph2', 'Pump house 2', 'one pump, the old town'],
        ['ph3', 'Pump house 3', 'two pumps, ring main north'],
        ['ph4', 'Pump house 4', 'two pumps, the harbour'],
        ['ph5', 'Pump house 5', 'one pump, the hills'],
        ['ph6', 'Pump house 6', 'being built, live in November'],
        ['north', 'Reservoir North', 'level sensor and an inlet valve'],
        ['south', 'Reservoir South', 'level sensor and an inlet valve'],
        ['plant', 'Treatment plant', 'where the water comes from'],
    ];
    const changed = tick ? CHANGING[(tick - 1) % CHANGING.length] : '';
    return {
        nodes: [
            { id: 'centre', label: 'Control centre', description: 'where every reading arrives', weight: weights ? 1 : null },
            ...sites.map(([id, label, description], i) => ({
                id,
                label,
                description:
                    (id === 'ph5' ? `${description}; its settings on site differ from the plan` : description) +
                    (id === changed ? `; ${120 + tick * 7} m³ an hour now` : ''),
                flag: id === 'ph5' ? /** @type {const} */ ('mismatch') : null,
                weight: weights ? ((i * 37 + (id === changed ? tick * 29 : 0)) % 100) / 100 : null,
            })),
            { id: 'weather', label: 'Weather service', description: 'an address outside the network', external: true },
            { id: 'energy', label: 'Energy supplier', description: 'an address outside the network', external: true },
        ],
        edges: [
            ...sites
                .filter(([id]) => id !== 'ph6')
                .map(([id]) => ({
                    from: id,
                    to: 'centre',
                    kind: 'telemetry',
                    detail: id === changed ? `readings every minute, ${tick} new` : 'readings every minute',
                })),
            { from: 'centre', to: 'ph1', kind: 'control', detail: 'pump start and stop' },
            { from: 'centre', to: 'ph3', kind: 'control', detail: 'pump start and stop, valve' },
            { from: 'centre', to: 'plant', kind: 'control', detail: 'intake rate' },
            { from: 'ph3', to: 'ph4', kind: 'radio', detail: 'spare path' },
            { from: 'ph4', to: 'centre', kind: 'radio', detail: 'spare path' },
            { from: 'centre', to: 'ph6', kind: 'planned', detail: 'fibre ordered' },
            { from: 'centre', to: 'energy', kind: 'planned', detail: 'tariff feed ordered' },
            { from: 'weather', to: 'centre', kind: 'telemetry', detail: 'rain radar every 10 min' },
        ],
        kinds: KINDS,
        hub: 'centre',
    };
}

/** @param {{ weights: boolean, tick: number }} o @returns {import('../../js/graph.js').GraphData} */
function longNetwork({ weights, tick }) {
    const names = [
        'Booster site A',
        'Booster site B',
        'Booster site C',
        'Reservoir North-East high zone',
        'Booster site E',
        'Booster site F',
        'Treatment plant on the river',
        'Booster site H',
        'Booster site I',
        'Booster site J',
        'Booster site K',
        'Pumping station by the harbour',
        'Booster site M',
        'Booster site N',
    ];
    const changed = tick ? (tick * 5) % names.length : -1;
    const edges = names.map((_, i) => ({
        from: `n${i}`,
        to: 'hub',
        kind: i % 4 === 3 ? 'radio' : 'telemetry',
        detail: i === changed ? `${tick} new` : '',
    }));
    edges.push({ from: 'hub', to: 'n2', kind: 'control', detail: '' }, { from: 'hub', to: 'n2', kind: 'planned', detail: '' });
    return {
        nodes: [
            { id: 'hub', label: 'Control centre', description: 'where every reading arrives' },
            ...names.map((label, i) => ({
                id: `n${i}`,
                label,
                description: i === changed ? `site ${i + 1}, ${tick} new readings` : `site ${i + 1}`,
                weight: weights ? ((i + (i === changed ? tick : 0)) % 5) / 4 : null,
            })),
        ],
        edges,
        kinds: KINDS,
        hub: 'hub',
    };
}

/** The site and its link to the hub that the last live update changed. */
const changedNow = () =>
    state.tick === 0
        ? null
        : state.long
          ? { node: `n${(state.tick * 5) % 14}`, hub: 'hub' }
          : { node: CHANGING[(state.tick - 1) % CHANGING.length], hub: 'centre' };

const WORDS = {
    loading: 'Reading the network: 4 of 12 sites answered.',
    empty: 'Nothing to draw yet: no site has reported to the control centre.',
    error: 'The network could not be read: the control centre did not answer.',
};

const graphs = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-kp-graph]')]);
/** The focus row always shows a pick and a hidden kind, whatever the buttons say. */
const inFocusRow = (/** @type {Element} */ el) => el.closest('[data-gr-vary="focus"]') !== null;

const state = {
    shown: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ ('ready'),
    long: false,
    weights: false,
    pick: false,
    hide: false,
    tick: 0,
};

/** Marks the site and the link a live update changed, on a graph just drawn. @param {HTMLElement} el */
function markChanged(el) {
    const changed = changedNow();
    if (!changed) return;
    el.querySelector(`.kp-graph__node[data-kp-id="${changed.node}"]`)?.setAttribute('data-cg-changed', '');
    el.querySelector(`.kp-graph__edge[data-kp-from="${changed.node}"][data-kp-to="${changed.hub}"]`)?.setAttribute('data-cg-changed', '');
}

/* ------------------------------------------------- the ghost network */

// Round 3 (Kenny, 2026-10-06 10:58): the loading picture is "based on the
// shape of the graph (nodes and lines)", not detached from the end result.
// While loading, js/graph.js draws only one ellipse; the demo lays the
// network that is coming out as a ghost under it, in the package's own
// classes (kp-graph__edge, kp-graph__node, kp-graph__ring, kp-graph__core),
// so each theme's settled shape draws it in its own nodes and lines, and the
// loading options move it. Every part carries --i (its order: the hub 0, then
// round the ring) and --n (how many), for staggered motion. A finding for the
// port: js/graph.js should draw this skeleton itself (PACKAGE_FINDINGS).
const SVG_NS = 'http://www.w3.org/2000/svg';
/** @param {string} tag @param {Record<string, string | number>} attrs */
const svgPart = (tag, attrs) => {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
    return node;
};
/** Lays the ghost of the coming network into a loading graph's picture. @param {HTMLElement} el */
function ghost(el) {
    const svg = el.querySelector('.kp-graph__svg');
    if (!svg || el.dataset.kpState !== 'loading' || svg.querySelector('.kp-graph__ghost')) return;
    const [, , W, H] = (svg.getAttribute('viewBox') ?? '0 0 800 480').split(' ').map(Number);
    const data = state.long ? longNetwork(state) : network(state);
    const at = graphLayout(data, W, H);
    const hub = hubOf(data);
    const order = [...(hub ? [hub] : []), ...ringOf(data, hub).map((n) => n.id)];
    const bends = graphBends(data.edges);
    const kinds = new Map(data.kinds.map((k) => [k.kind, k]));
    const sorted = data.nodes.filter((n) => !n.external).sort((a, b) => a.label.localeCompare(b.label));
    const root = svgPart('g', { class: 'kp-graph__ghost', 'aria-hidden': 'true', style: `--n: ${order.length}` });
    const edges = svgPart('g', { class: 'kp-graph__edges' });
    data.edges.forEach((e, i) => {
        const a = at.get(e.from);
        const b = at.get(e.to);
        if (!a || !b) return;
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const mx = (a.x + b.x) / 2 - ((b.y - a.y) / len) * bends[i];
        const my = (a.y + b.y) / 2 + ((b.x - a.x) / len) * bends[i];
        const far = order.indexOf(e.from === hub ? e.to : e.from);
        const path = svgPart('path', {
            class: 'kp-graph__edge',
            d: `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`,
            pathLength: 100,
            'data-kp-kind': e.kind,
            'data-kp-style': kinds.get(e.kind)?.style ?? 'solid',
            style: `--i: ${Math.max(0, far)}` + (kinds.get(e.kind)?.colour ? `; --kp-graph-edge-colour: ${kinds.get(e.kind)?.colour}` : ''),
        });
        edges.append(path);
    });
    root.append(edges);
    order.forEach((id, i) => {
        const n = data.nodes.find((x) => x.id === id);
        const p = at.get(id);
        if (!n || !p) return;
        const r = n.external ? 9 : n.weight != null ? 10 + 14 * Math.sqrt(Math.max(0, Math.min(1, n.weight))) : 14;
        const node = svgPart('g', {
            class: `kp-graph__node${n.external ? ' kp-graph__node--external' : ''}${id === hub ? ' kp-graph__node--hub' : ''}`,
            style:
                `--i: ${i}` + (n.external ? '' : `; --kp-graph-hue: ${n.hue ?? Math.round((sorted.indexOf(n) / Math.max(1, sorted.length)) * 360)}`),
        });
        node.append(svgPart('circle', { class: 'kp-graph__ring', cx: p.x, cy: p.y, r }));
        if (!n.external) node.append(svgPart('circle', { class: 'kp-graph__core', cx: p.x, cy: p.y, r: Math.max(4, r - 6) }));
        root.append(node);
    });
    svg.prepend(root);
}
// js/graph.js redraws its picture on a resize or when fonts load: lay the
// ghost again whenever a loading picture is drawn anew.
const ghostWatch = new MutationObserver((records) => {
    for (const r of records) {
        const el = /** @type {HTMLElement | null} */ (/** @type {Element} */ (r.target).closest('[data-kp-graph]'));
        if (el) ghost(el);
    }
});

/** @param {'arrive' | 'live'} moment */
function draw(moment = 'arrive') {
    for (const el of graphs()) {
        el.setAttribute('data-cg-moment', moment);
        if (state.shown !== 'ready') {
            // No arrival or live moment while loading: their rules would
            // otherwise animate the ghost network instead of the loading option.
            el.removeAttribute('data-cg-moment');
            setGraphState(el, state.shown, WORDS[state.shown]);
            ghost(el);
            const svg = el.querySelector('.kp-graph__svg');
            if (svg && !svg.hasAttribute('data-cg-watched')) {
                svg.setAttribute('data-cg-watched', '');
                ghostWatch.observe(svg, { childList: true });
            }
            continue;
        }
        setGraphData(el, state.long ? longNetwork(state) : network(state));
        const focusRow = inFocusRow(el);
        graphSelect(el, state.pick || focusRow ? [state.long ? 'n2' : 'ph3'] : []);
        graphHideKind(el, 'telemetry', state.hide && !focusRow);
        graphHideKind(el, 'radio', focusRow);
        if (moment === 'live') markChanged(el);
    }
}

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

// Drawn always replays the arrival: the network is handed over again.
for (const b of section.querySelectorAll('[data-gr-state]'))
    b.addEventListener('click', () => {
        state.shown = /** @type {typeof state.shown} */ (b.getAttribute('data-gr-state') ?? 'ready');
        pressed('data-gr-state', state.shown);
        draw();
    });

// A live update: the same network with new numbers for one site (its
// description and its link's detail, and its flow when sized by flow),
// handed over in one setGraphData(); ids that stay keep their pick and the
// focus. A different site changes on each press.
section.querySelector('[data-gr-live]')?.addEventListener('click', () => {
    state.tick += 1;
    state.shown = 'ready';
    pressed('data-gr-state', 'ready');
    draw('live');
});

for (const b of section.querySelectorAll('[data-gr-toggle]'))
    b.addEventListener('click', () => {
        const what = /** @type {'long' | 'weights' | 'pick' | 'hide'} */ (b.getAttribute('data-gr-toggle'));
        state[what] = !state[what];
        b.setAttribute('aria-pressed', String(state[what]));
        if (state.shown !== 'ready') return;
        if (what === 'long' || what === 'weights') return draw();
        for (const el of graphs()) {
            if (inFocusRow(el)) continue;
            if (what === 'pick') graphSelect(el, state.pick ? [state.long ? 'n2' : 'ph3'] : []);
            else graphHideKind(el, 'telemetry', state.hide);
        }
    });

const log = section.querySelector('[data-gr-log]');
section.addEventListener(GRAPH_CHANGE_EVENT, (event) => {
    if (event.target !== graphs()[0]) return;
    const { selected, hiddenKinds } = /** @type {CustomEvent<{ selected: string[], hiddenKinds: string[] }>} */ (event).detail;
    const data = state.long ? longNetwork(state) : network(state);
    const name = (/** @type {string} */ id) => data.nodes.find((n) => n.id === id)?.label ?? id;
    const kind = (/** @type {string} */ k) => KINDS.find((x) => x.kind === k)?.label ?? k;
    if (log)
        log.textContent =
            (selected.length ? `Picked: ${selected.map(name).join(', ')}.` : 'Nothing picked.') +
            (hiddenKinds.length ? ` Hidden: ${hiddenKinds.map(kind).join(', ')}.` : ' Every kind of link is shown.');
});

attachGraphs(section);
compose();
draw();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-gr-theme-name]')) el.textContent = LABEL[now] ?? now;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    // A settled aspect has no row, and a row hides the cells its theme has no option for.
    for (const box of section.querySelectorAll('[data-gr-aspect]'))
        /** @type {HTMLElement} */ (box).hidden = Boolean(keptOf(now, /** @type {Aspect} */ (box.getAttribute('data-gr-aspect'))));
    for (const cell of section.querySelectorAll('[data-gr-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (cell.getAttribute('data-gr-vary'))]?.[Number(cell.getAttribute('data-gr-option')) - 1];
        /** @type {HTMLElement} */ (cell).hidden = !option;
        const name = cell.querySelector('[data-gr-name]');
        const desc = cell.querySelector('[data-gr-desc]');
        if (name) name.textContent = option?.[0] ?? '';
        if (desc) desc.textContent = option?.[1] ?? '';
    }
    compose();
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-gr-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-meter; full speed by default, since a loop is judged at
// its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('gr-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-gr-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-gr-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-gr-speed'));
        try {
            localStorage.setItem('gr-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();
