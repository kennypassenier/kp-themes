// research/character-tiles: dashboard tiles of their own, per theme
// (Kenny, 2026-10-05: "keep these things separate so I could choose one
// over another … it should be like this in the future"). Each theme's
// tile board has six aspects, each picked on its own from three options:
// the shape, the loading picture, how the tiles arrive, the tone, the
// hover and focus of the tile's link, and the live update.
//
// The tiles are the package's own: `.kp-tiles` of `.kp-card`
// (css/components.css), evened by attachTileSets() (js/tiles.js). Every
// aspect is CSS only, in tiles.css, keyed by one attribute each on the
// grid (`data-ti-shape`, `data-ti-loading`, `data-ti-arrival`,
// `data-ti-tone`, `data-ti-hover`, `data-ti-live`), so any combination
// composes. On the page: one composed preview, and per aspect a row of
// three boards that differ in that aspect only; the plain tiles of today
// stand below for reference. The controls sit in the section's
// `data-review-controls` container, which the review kit mirrors into its
// dialog. js/tiles.js is not changed.

import { attachTileSets } from '../../js/tiles.js';
import { THEMES } from '../../js/theme-registry.js';
import R2A from './round2-a.js';
import R2B from './round2-b.js';
import R2C from './round2-c.js';
import R2D from './round2-d.js';

/** @typedef {{ name: string, text: string, key?: string }} Option */
/** @typedef {'shape' | 'loading' | 'arrival' | 'tone' | 'hover' | 'live'} Aspect */

/** The six aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    { id: 'shape', label: 'Shape', about: 'The plate, the title, the mark and the footer rule. Compare the two tiles as they stand.' },
    { id: 'loading', label: 'While loading', about: 'The picture while a tile loads; it always moves. Press Loading.' },
    { id: 'arrival', label: 'How the tiles arrive', about: 'How a tile’s content lands once it is shown. Press Shown to replay it.' },
    { id: 'tone', label: 'The tone of a tile', about: 'How a warning or destructive tile reads. Press Warning, then Destructive, then None.' },
    {
        id: 'hover',
        label: 'Hover and focus, the tile’s link',
        about: 'What the pointer or the keyboard does to a tile and its Open link. Press Pointed at, or tab to Open.',
    },
    { id: 'live', label: 'Live update', about: 'What a new reading does to a tile. Press Live update.' },
];

/**
 * Per theme, three options for each aspect: name + what it does, written
 * for the tile (the plate, the title, the mark, the footer, the Open
 * link), in the theme's own world. Never a fade.
 * @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            {
                name: 'The engraved plate',
                text: 'A ruled double frame, the title in the serif’s small capitals, a diamond mark, a hairline footer rule.',
            },
            { name: 'The ledger card', text: 'A heavy rule above the title, the mark a wax-seal dot, the footer set off by a double rule.' },
            { name: 'The certificate', text: 'A thin navy rule inside the frame, a guilloche corner, the mark a small crest.' },
        ],
        loading: [
            { name: 'The dotted leader', text: 'A dotted leader is written across the body, dot by dot.' },
            { name: 'The ledger is ruled', text: 'Two ledger rules draw across the body, left to right, and rule again.' },
            { name: 'The seal is pressed', text: 'A navy seal ring presses onto the plate, lifts and presses again.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Engraved', text: 'The title is written in from the left, slowing as it lands; the body follows a beat later.' },
            { name: 'Entered in the ledger', text: 'Tile after tile drops into the ledger, each a beat after the last.' },
        ],
        tone: [
            { name: 'The engraved plate', text: 'A warning or destructive tile shows the note on its plate, boxed like an engraved figure.' },
            { name: 'The ribbon', text: 'A warning or destructive tile is marked by a ribbon of its colour along the top edge.' },
            { name: 'The red-ink entry', text: 'A warning or destructive tile is ruled off along the left edge in the accountant’s red ink.' },
        ],
        hover: [
            { name: 'The raised seal', text: 'The plate lifts a hair on a soft shadow; Open underlines in navy; the border darkens on focus.' },
            { name: 'The ink deepens', text: 'The frame’s rule doubles; Open gains a navy plate; a focus ring in navy traces the tile.' },
            { name: 'The wax warms', text: 'The mark glows faintly; Open’s underline thickens; focus draws a fine double rule.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'Entered again', text: 'The footer’s timestamp is struck through once, then the new one is written in.' },
            { name: 'Signed again', text: 'The whole tile is traced again by a thin rule, left to right.' },
        ],
    },
    light: {
        shape: [
            { name: 'The soft card', text: 'A white card lifted on a soft shadow, a wide radius, the mark a soft dot.' },
            { name: 'Daylight', text: 'A pale wash from the top, the mark a small sun, the footer a soft rule.' },
            { name: 'The paper sheet', text: 'A lifted corner at the top right, faint writing rules, the mark a paperclip dot.' },
        ],
        loading: [
            { name: 'The dashed baseline', text: 'A dashed line under the body drifts to the right.' },
            { name: 'Daylight', text: 'A slow band of light crosses the plate.' },
            { name: 'A cloud passes', text: 'The soft shadow of a cloud drifts across the plate, slowly.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Unfolds', text: 'The card opens from its middle, slowing as it lands.' },
            { name: 'Sunrise', text: 'Tile after tile rises from the bottom, each a beat after the last.' },
        ],
        tone: [
            { name: 'The soft pill', text: 'A warning or destructive tile shows the note on a soft pill under the title.' },
            { name: 'The coloured tab', text: 'A warning or destructive tile gets a soft band of its colour along the top.' },
            { name: 'The outline', text: 'A warning or destructive tile is ringed in a soft outline of its own colour.' },
        ],
        hover: [
            { name: 'The shadow lifts', text: 'The card’s shadow grows softly; Open becomes a filled soft pill; focus adds a soft ring.' },
            { name: 'The warmth rises', text: 'The card warms a shade; Open underlines; a focus ring glows around the tile.' },
            { name: 'The corner lifts', text: 'The paper corner lifts further; Open gains a dot; focus traces a dashed outline.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'A soft swell', text: 'The card swells once and settles, slowing as it lands.' },
            { name: 'The page turns', text: 'The tile flips like a page corner, then shows the new reading.' },
        ],
    },
    dark: {
        shape: [
            { name: 'The status board', text: 'A black panel, the title in ticker mono, the mark a lit square chip.' },
            { name: 'The machined panel', text: 'A fine bevel, the title in mono capitals, the mark a recessed lamp.' },
            { name: 'The oscilloscope', text: 'A dark well with a fine grid, the mark a glowing dot, mono throughout.' },
        ],
        loading: [
            { name: 'The ticker baseline', text: 'A dashed baseline ticks along like a ticker tape.' },
            { name: 'The slot is scanned', text: 'A lit band sweeps across the body, as a scanner reads a slot.' },
            { name: 'The status lamp', text: 'A lamp steps between three spots on the panel, one after the other.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Switched on', text: 'The panel strikes on and off once like a tube, then holds.' },
            { name: 'Machined in', text: 'Tile after tile snaps into place in hard steps, one after the other.' },
        ],
        tone: [
            { name: 'The lit chip', text: 'A warning or destructive tile shows the note on a lit square chip.' },
            { name: 'The machined tab', text: 'A warning or destructive tile gets a flat tab with a lit top edge.' },
            { name: 'The alarm lamp', text: 'A warning or destructive tile lights its mark, as an alarm lamp.' },
        ],
        hover: [
            { name: 'The panel lights', text: 'The bevel’s lip brightens; Open lights up; focus draws a lit square ring.' },
            { name: 'The glow rises', text: 'The mark’s glow widens; Open underlines in the glow colour; focus adds a soft halo.' },
            { name: 'The slot opens', text: 'The recessed window brightens; Open gains a lit chip; focus traces the bevel in light.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'The trace jumps', text: 'The mark jolts once, as a needle does.' },
            { name: 'The trace flares', text: 'The whole tile flares with light once, slowing as it settles back.' },
        ],
    },
    cyberpunk: {
        shape: [
            { name: 'The neon trace', text: 'A black board with a faint circuit grid, the mark a neon tube, cut corners.' },
            { name: 'The glitch HUD', text: 'Yellow brackets at the corners, hazard tape along the top, the mark an RGB-split dot.' },
            { name: 'The holo card', text: 'A cyan rim with glow, diagonal scan lines, the mark a cyan diamond.' },
        ],
        loading: [
            { name: 'The neon trace', text: 'A packet of light runs along the baseline.' },
            { name: 'The glitch bar', text: 'A glitch bar jumps across the body.' },
            { name: 'Packet rain', text: 'Packets rain down the plate in columns.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Jacked in', text: 'The tile jumps into place sideways, in hard jumps.' },
            { name: 'The neon strikes', text: 'Tile after tile strikes on like a tube, then holds.' },
        ],
        tone: [
            { name: 'The cut-corner chip', text: 'A warning or destructive tile shows the note on a cut-corner chip.' },
            { name: 'The hazard frame', text: 'A warning or destructive tile is boxed all round in its colour, hazard-tape style.' },
            { name: 'The glitch mark', text: 'A warning or destructive tile’s mark glitches between two positions.' },
        ],
        hover: [
            { name: 'The circuit lights', text: 'The grid lines brighten; Open gains a neon underline; focus draws a glitch-cut ring.' },
            { name: 'The HUD locks on', text: 'The corner brackets snap tighter; Open flashes once; focus adds yellow brackets.' },
            { name: 'The hologram flickers', text: 'The rim flickers brighter; Open underlines in cyan; focus adds a scan-line sweep.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'Packet in', text: 'The tile glitches sideways for a moment, in hard jumps.' },
            { name: 'The trace burns', text: 'The tile flares with neon light once, slowing as it settles.' },
        ],
    },
    synthwave: {
        shape: [
            { name: 'The grid-floor horizon', text: 'A perspective grid floor under a pink horizon, the mark a sunset laser dot.' },
            { name: 'The VCR display', text: 'OSD numerals, scanlines over the tile, the mark an inverse block.' },
            { name: 'The arcade marquee', text: 'A pink frame with a glow, the mark a pink drop, VT323 throughout.' },
        ],
        loading: [
            { name: 'The grid-floor horizon', text: 'The grid floor drives toward you.' },
            { name: 'The VCR display', text: 'A tracking band rolls down the body.' },
            { name: 'The sun rises', text: 'A striped sun swells up over the horizon and sinks again.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Over the horizon', text: 'The tile rises from the baseline, slowing as it lands.' },
            { name: 'Tape loads', text: 'Tile after tile snaps in, in hard steps, as a tape loads.' },
        ],
        tone: [
            { name: 'The glass chip', text: 'A warning or destructive tile shows the note on a glass chip.' },
            { name: 'The inverse block', text: 'A warning or destructive tile flips to an inverse block of its colour.' },
            { name: 'The arcade warning', text: 'A warning or destructive tile’s plate flashes under the title, as an arcade score.' },
        ],
        hover: [
            { name: 'The laser brightens', text: 'The grid lines pulse brighter; Open underlines in neon pink; focus adds a laser-pink ring.' },
            { name: 'The tracking locks', text: 'Scanlines settle; Open inverts; focus frames the tile in the OSD style.' },
            { name: 'The marquee glows', text: 'The frame’s glow widens; Open gains a pink drop; focus traces the marquee in light.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'The tracking jumps', text: 'The tile jolts once, as a needle does.' },
            { name: 'The laser flares', text: 'The tile flares with light once, slowing as it lands.' },
        ],
    },
    pastel: {
        shape: [
            { name: 'The sticker chart', text: 'A candy card with a flat sticker shadow, the mark a round sticker dot.' },
            { name: 'The washi planner', text: 'A strip of washi tape across the top, the mark a dashed doodle star.' },
            { name: 'The cloud card', text: 'A wide round card with a dashed candy outline, the mark a blob of colour.' },
        ],
        loading: [
            { name: 'The sticker chart', text: 'A candy dot hops along the body.' },
            { name: 'The washi planner', text: 'The tape drifts.' },
            { name: 'Sprinkles', text: 'Sprinkles in two colours hop along the plate.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Popped', text: 'The tile rises from the bottom, overshooting once.' },
            { name: 'Doodled in', text: 'Tile after tile is drawn in from the left, easing in and out.' },
        ],
        tone: [
            { name: 'The sticker', text: 'A warning or destructive tile shows the note on a sticker with its own flat shadow.' },
            { name: 'The washi label', text: 'A warning or destructive tile shows the note on a taped label.' },
            { name: 'The heart sticker', text: 'A warning or destructive tile gets a candy band of its colour along the top.' },
        ],
        hover: [
            { name: 'The sticker lifts', text: 'The card lifts on its sticker shadow; Open becomes a filled pill; focus adds a dashed ring.' },
            { name: 'The tape flutters', text: 'The washi tape flutters once; Open underlines in candy colour; focus traces a doodle outline.' },
            { name: 'The cloud bounces', text: 'The card bounces once softly; Open gains a sparkle dot; focus glows round the tile.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'A happy hop', text: 'The tile jolts once, as a needle does, overshooting once.' },
            { name: 'Squished', text: 'The tile swells once and settles, slowing as it lands.' },
        ],
    },
    terminal: {
        shape: [
            { name: 'The top(1) row', text: 'A double box-drawing frame, the title in capitals, the mark a blinking block.' },
            { name: 'The dumb-terminal card', text: 'A grid of character cells, the mark an asterisk, the footer underlined.' },
            { name: 'The curses window', text: 'A single-line box, the title ruled off under it, the mark a bracketed dot.' },
        ],
        loading: [
            { name: 'The top(1) row', text: 'A block caret blinks in the body, once a second.' },
            { name: 'The dumb-terminal plot', text: 'A row of dots marches across the body.' },
            { name: 'The hash bar', text: 'A row of # blocks fills the body block by block, then starts over.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Printed', text: 'The body is typed in from the left, character by character.' },
            { name: 'Paged in', text: 'Tile after tile drops into place from above, in hard steps.' },
        ],
        tone: [
            { name: 'Reverse video', text: 'A warning or destructive tile shows the note in reverse video.' },
            { name: 'Underlined', text: 'A warning or destructive tile’s note is underlined in its colour.' },
            { name: 'The bell', text: 'A warning or destructive tile prints its note in reverse on a dashed box, as a terminal bell line.' },
        ],
        hover: [
            { name: 'The cursor lands', text: 'A block caret appears beside the title; Open inverts; focus draws a dashed box.' },
            { name: 'The row highlights', text: 'The whole row inverts briefly; Open underlines; focus thickens the frame to 2px.' },
            { name: 'The prompt blinks', text: 'A > prompt blinks before the title; Open gains brackets; focus traces the box twice.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'Scrolled', text: 'The tile steps up one line, as a terminal scrolls, in hard steps.' },
            { name: 'Reverse flash', text: 'The tile flashes in reverse once, in hard jumps.' },
        ],
    },
    forest: {
        shape: [
            { name: 'The ranger’s logbook', text: 'Kraft paper, the title in serif italic, the mark a wooden tag dot.' },
            { name: 'The canopy', text: 'A leaf-green wash, the mark a leaf tag, the footer a twig rule.' },
            { name: 'The herbarium sheet', text: 'Leaf veins faint in the plate, the mark a pressed-leaf dot, serif italic.' },
        ],
        loading: [
            { name: 'The ranger’s logbook', text: 'A trail of light walks across the body.' },
            {
                name: 'The row is planted',
                text: 'A waiting tile’s skeleton lines and foot are the bar’s planted row: seedlings, then whole trees filling it start to end.',
            },
            { name: 'Fireflies', text: 'Two fireflies drift to and fro over the plate.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Grows', text: 'The tile rises from the ground, slowing as it lands.' },
            { name: 'Every tile grows', text: 'Tile after tile grows up out of its own line on forest’s growth curve, 1000 ms, 80 ms apart.' },
        ],
        tone: [
            { name: 'The wooden tag', text: 'A warning or destructive tile shows the note on a wooden tag.' },
            { name: 'The leaf tag', text: 'A warning or destructive tile shows the note on a leaf tag.' },
            { name: 'The trail blaze', text: 'A warning or destructive tile is blazed in its colour along the left edge.' },
        ],
        hover: [
            { name: 'The leaves rustle', text: 'The canopy wash deepens; Open underlines in moss; focus traces a bark-brown ring.' },
            { name: 'The tag swings', text: 'The wooden tag tilts a little; Open gains a leaf dot; focus adds a dashed vine outline.' },
            {
                name: 'The trail blaze',
                text: 'Pointing at a tile lays the dashed trail blaze round it; Open is forest’s own ghost button (blaze, two-channel focus ring, press closes the blaze in).',
            },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            {
                name: 'A growth ring',
                text: 'A thin ring is drawn once round the tile that changed, clockwise from the top, then fades; the tile never moves.',
            },
            { name: 'Growth ring', text: 'The tile swells once and settles, easing in and out.' },
        ],
    },
    'high-contrast': {
        shape: [
            { name: 'Ink and frame', text: 'A 2px rule all round, the title bold, the mark a solid square. Still: nothing moves.' },
            { name: 'The inverse plate', text: 'An ink plate with the title in the paper colour, the mark heavy. Still: nothing moves.' },
            { name: 'The signal board', text: 'A heavy 3px frame, the title very large, the mark a bold ring. Still: nothing moves.' },
        ],
        loading: [
            { name: 'The dashed baseline', text: 'A dashed baseline steps along in hard steps.' },
            { name: 'The striped block', text: 'A striped block in ink and paper steps across the body.' },
            { name: 'The scanning bar', text: 'A thick bar in ink and paper scans down the plate in hard steps.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Switched', text: 'The tile is drawn in hard steps, four at a time.' },
            { name: 'Dropped', text: 'Tile after tile drops into place from above, in hard steps.' },
        ],
        tone: [
            { name: 'The framed plate', text: 'A warning or destructive tile shows the note on a framed plate with its own ink.' },
            { name: 'The heavy frame', text: 'A warning or destructive tile gets a 3px frame with square corners.' },
            { name: 'The signal plate', text: 'A warning or destructive tile puts its note on the tone’s own plate, framed in ink.' },
        ],
        hover: [
            { name: 'The frame thickens', text: 'The border doubles to 3px; Open inverts fully; focus draws a 4px outer ring.' },
            { name: 'The plate flips', text: 'The whole tile inverts ink and paper; Open underlines heavily; focus adds a thick dashed ring.' },
            { name: 'The signal flashes', text: 'The frame flashes once to full ink; Open gains a solid block; focus frames twice.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'The bar jumps', text: 'The tile jolts once, as a needle does, in hard steps.' },
            { name: 'The bar flips', text: 'The tile flashes to its inverse once, in hard jumps.' },
        ],
    },
    sepia: {
        shape: [
            { name: 'The barograph', text: 'Ruled chart paper, a fine nib trace rule, the mark a sepia dot, an aged vignette.' },
            { name: 'Letterpress', text: 'The title pressed into speckled paper, the mark a printed border dot.' },
            { name: 'The ticket stub', text: 'Punched notches on both sides, a dashed tear-line frame, the mark a brown ink dot.' },
        ],
        loading: [
            { name: 'The barograph', text: 'The nib sweeps across the drum.' },
            { name: 'The ink spreads', text: 'A blot of ink swells and draws back on the paper.' },
            { name: 'The drum turns', text: 'The hour lines move left under a still nib.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'The nib writes', text: 'The body is written in from the left, at an even pace.' },
            { name: 'Pressed', text: 'Tile after tile drops into place from above, slowing as it lands.' },
        ],
        tone: [
            { name: 'The status plate', text: 'A warning or destructive tile shows the note on its own status plate.' },
            { name: 'Letterpress border', text: 'A warning or destructive tile gets a printed border in its colour.' },
            { name: 'The rubber stamp', text: 'A warning or destructive tile is stamped askew on the label, in a ruled border.' },
        ],
        hover: [
            { name: 'The ink deepens', text: 'The sepia tone deepens a shade; Open underlines in brown ink; focus traces a dashed tear-line.' },
            { name: 'The seal warms', text: 'The vignette brightens at the centre; Open gains a punched-notch mark; focus doubles the frame.' },
            { name: 'The press lands', text: 'The title presses a hair deeper; Open underlines heavily; focus adds a stamped ring.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'The nib moves on', text: 'The footer’s timestamp steps forward, at an even pace.' },
            { name: 'Inked again', text: 'The tile is traced again from its edge, easing in and out.' },
        ],
    },
    blueprint: {
        shape: [
            { name: 'The chart recorder', text: 'A millimetre grid, the title in technical mono capitals, the mark a white-ink dot.' },
            { name: 'The title block', text: 'The tile parted into cells by drawn rules, the mark a dimension tick.' },
            { name: 'The section view', text: 'A hatched plate at forty-five degrees, a dashed frame, the mark a chain-line dot.' },
        ],
        loading: [
            { name: 'The chart recorder', text: 'The recorder’s pen sweeps.' },
            { name: 'The title block', text: 'A dash marches along the baseline.' },
            { name: 'The dimension line', text: 'A dimension line with its ticks is drawn across the plate, again and again.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Drafted', text: 'The body is drawn in from the left, at an even pace.' },
            { name: 'Plotted', text: 'Tile after tile is drawn in from the left, in hard steps.' },
        ],
        tone: [
            { name: 'The status plate', text: 'A warning or destructive tile shows the note on its own status plate.' },
            { name: 'The ruled box', text: 'A warning or destructive tile’s note sits in a ruled box.' },
            { name: 'The revision cloud', text: 'A warning or destructive tile is framed all round in its colour, as a drawing revision.' },
        ],
        hover: [
            { name: 'The pen hovers', text: 'The grid lines brighten faintly; Open underlines in white ink; focus draws a dashed outline.' },
            { name: 'The cell highlights', text: 'The title-block cell fills faintly; Open gains a tick mark; focus doubles the rule.' },
            { name: 'The hatching tightens', text: 'The hatching draws closer; Open underlines; focus adds a revision-cloud ring.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'The pen steps', text: 'The footer’s timestamp steps forward, in hard steps.' },
            { name: 'Retraced in ink', text: 'The tile is traced again from its edge, at an even pace.' },
        ],
    },
    solstice: {
        shape: [
            { name: 'The low sun', text: 'A warm glow rising from the foot of the tile, the mark a glowing dot.' },
            { name: 'The embers', text: 'A faint heat wash, the mark a glowing coal with a hot halo.' },
            { name: 'The horizon', text: 'A warm band of light across the foot of the card, the mark a sun-dot.' },
        ],
        loading: [
            { name: 'The low sun', text: 'A glow rises from the foot of the body, swelling and settling.' },
            { name: 'The embers', text: 'A heat glows from below, swelling and settling.' },
            { name: 'The sun crosses', text: 'A low sun crosses the plate from left to right.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Dawn', text: 'The tile rises from the baseline, slowing as it lands.' },
            { name: 'Kindled', text: 'Tile after tile is drawn in backwards, from the last to the first.' },
        ],
        tone: [
            { name: 'The glowing chip', text: 'A warning or destructive tile shows the note on a glowing chip.' },
            { name: 'The status plate', text: 'A warning or destructive tile shows the note on its own status plate.' },
            { name: 'The red sky', text: 'A warning or destructive tile turns the band of light above the card into the tone.' },
        ],
        hover: [
            { name: 'The glow widens', text: 'The warm glow widens and brightens; Open gains a glowing underline; focus halos the tile.' },
            { name: 'The embers brighten', text: 'The heat wash brightens a shade; Open underlines warmly; focus adds a soft amber ring.' },
            { name: 'The horizon lifts', text: 'The band of light rises slightly; Open glows; focus traces the horizon in light.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'A flare of sun', text: 'The tile flares with light once, slowing as it lands.' },
            { name: 'The day moves on', text: 'The footer’s timestamp steps forward, easing in and out.' },
        ],
    },
    brutalism: {
        shape: [
            { name: 'The slab', text: 'A heavy black frame with a hard offset shadow, the mark a square block.' },
            { name: 'The sticker sheet', text: 'A lavender sheet, the mark an askew sticker in a black outline.' },
            { name: 'The poster block', text: 'A 3px frame with a hard offset shadow, the mark a hatched block.' },
        ],
        loading: [
            { name: 'The stamp', text: 'A black block is stamped onto the body, lifted and stamped again.' },
            { name: 'The drop', text: 'A black block drops onto the body and lands hard, again and again.' },
            { name: 'The hammer', text: 'A black block hammers on three spots along the body in turn.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Slammed', text: 'The tile drops into place from above, in hard steps.' },
            { name: 'Shoved in', text: 'Tile after tile slides in slanted, easing in and out.' },
        ],
        tone: [
            { name: 'The hard-shadow block', text: 'A warning or destructive tile shows the note on a block with the hard shadow.' },
            { name: 'The sticker', text: 'A warning or destructive tile shows the note on an askew sticker in a black outline.' },
            { name: 'The warning poster', text: 'A warning or destructive tile prints its note on the tone’s block, framed in ink.' },
        ],
        hover: [
            { name: 'The shadow grows', text: 'The offset shadow grows harder; Open becomes a solid block; focus doubles the frame to 4px.' },
            { name: 'The sticker peels', text: 'The sticker tilts further; Open gains a black outline; focus adds a hatched ring.' },
            { name: 'The slab tips', text: 'The whole tile tilts a degree; Open underlines heavily; focus frames it twice.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'Kicked', text: 'The tile jolts once, as a needle does, in hard steps.' },
            { name: 'Shoved', text: 'The footer’s timestamp steps forward, in hard steps.' },
        ],
    },
    deco: {
        shape: [
            { name: 'The gilt frame', text: 'A double gold rule, a faint sunburst behind the title, the mark a gold plaque.' },
            { name: 'The marquee', text: 'A row of bulbs along the top, the mark a marquee plaque.' },
            { name: 'The skyscraper', text: 'Fine gold setback lines rising, the mark a gold bar dot.' },
        ],
        loading: [
            { name: 'The gilt frame', text: 'A glint runs across the body.' },
            { name: 'The marquee', text: 'The bulbs chase.' },
            { name: 'The sunburst opens', text: 'A gold sunburst opens from the foot of the body, ray by ray.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'The curtain rises', text: 'The tile rises from the baseline, slowing as it lands.' },
            { name: 'The marquee lights', text: 'Tile after tile lights up in hard steps, one after the other.' },
        ],
        tone: [
            { name: 'The gold-framed plaque', text: 'A warning or destructive tile shows the note on a gold-framed plaque.' },
            { name: 'The marquee plaque', text: 'A warning or destructive tile shows the note on a marquee plaque.' },
            { name: 'The gilt notice', text: 'A warning or destructive tile is framed all round in its colour, as a notice in a gilt frame.' },
        ],
        hover: [
            { name: 'The gold warms', text: 'The gold rule brightens; Open underlines in gold; focus traces a double gold ring.' },
            { name: 'The bulbs light', text: 'The marquee bulbs glow steady; Open gains a plaque; focus frames the tile in bulbs.' },
            { name: 'The sunburst widens', text: 'The sunburst behind the title widens; Open underlines in gold; focus halos the tile.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'The bulbs chase', text: 'The tile flashes once, in hard jumps, as marquee bulbs chase.' },
            { name: 'Gilded', text: 'The tile flares with light once, slowing as it lands.' },
        ],
    },
    phantom: {
        shape: [
            { name: 'The evidence card', text: 'A white card pinned to a board, the title slanted, the mark a stamped ring.' },
            { name: 'The calling card', text: 'A black card under a halftone, the mark a red slash corner.' },
            { name: 'The ransom note', text: 'A halftone over the card, the mark a red offset square.' },
        ],
        loading: [
            { name: 'The stamp ring', text: 'A red ring is stamped onto the body, again and again.' },
            { name: 'Stamped askew', text: 'The halftone shuffles.' },
            { name: 'The string is pulled', text: 'A red string is pulled across the body in jerks.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'The card is thrown', text: 'The tile jumps into place sideways, in hard jumps.' },
            { name: 'Slashed in', text: 'Tile after tile is drawn in backwards, easing in and out.' },
        ],
        tone: [
            { name: 'The stamped ring', text: 'A warning or destructive tile shows the note on a stamped ring set askew.' },
            { name: 'The status plate', text: 'A warning or destructive tile shows the note on its own status plate.' },
            { name: 'The askew card', text: 'A warning or destructive tile is stamped askew on the label, in a ruled border.' },
        ],
        hover: [
            { name: 'The pin tightens', text: 'The card lifts off the board slightly; Open gains a red underline; focus draws a stamped ring.' },
            { name: 'The halftone sharpens', text: 'The halftone pattern sharpens; Open underlines in red; focus adds a slash corner.' },
            { name: 'The string tautens', text: 'The red string straightens; Open underlines; focus traces the card’s edge in red.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'Snatched', text: 'The tile glitches sideways for a moment, in hard jumps.' },
            { name: 'The string twangs', text: 'The tile jolts once, as a needle does.' },
        ],
    },
    retro: {
        shape: [
            { name: 'The 1995 dialog', text: 'A raised grey bevel, the title in the system face, the mark a raised button dot.' },
            { name: 'The performance monitor', text: 'A black well with a green grid, the mark a phosphor dot.' },
            { name: 'The Notepad window', text: 'A 1px black frame with a hard drop shadow, the mark a black square.' },
        ],
        loading: [
            { name: 'The progress blocks', text: 'Blue progress blocks fill the body block by block, then start over.' },
            { name: 'The marquee bar', text: 'A group of three blue blocks slides across the body and comes round again.' },
            { name: 'The defragmenter', text: 'Blocks of colour shift through the body in hard steps, as a defragmenter’s map.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Painted', text: 'The tile is drawn in from the left, in hard steps.' },
            { name: 'Dragged in', text: 'Tile after tile drops into place from above, in hard steps.' },
        ],
        tone: [
            { name: 'The raised button', text: 'A warning or destructive tile shows the note on a raised button.' },
            { name: 'The flat field', text: 'A warning or destructive tile shows the note on a flat field with a 1px rule.' },
            { name: 'The message box', text: 'A warning or destructive tile is shown framed in its colour, as a message box asks for attention.' },
        ],
        hover: [
            { name: 'The bevel presses', text: 'The bevel inverts to a pressed look; Open underlines; focus draws a dotted marching-ants ring.' },
            { name: 'The screen glows', text: 'The green grid brightens; Open underlines in phosphor; focus halos the tile faintly.' },
            { name: 'The window raises', text: 'The drop shadow deepens; Open underlines; focus doubles the black frame.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'Repainted', text: 'The tile flashes once, in hard jumps.' },
            { name: 'Scrolled one', text: 'The footer’s timestamp steps forward, in hard jumps.' },
        ],
    },
    grotesk: {
        shape: [
            { name: 'The transit board', text: 'A thick bar in the series colour across the top, the mark a flat colour bar.' },
            { name: 'The Swiss poster', text: 'The title huge and flush left, the mark a red index dot.' },
            { name: 'The index card', text: 'A red rule down the left margin, the mark a small square dot.' },
        ],
        loading: [
            { name: 'The transit board', text: 'A line runs across the body.' },
            { name: 'The Swiss poster', text: 'Three blocks cut in.' },
            { name: 'The flap board', text: 'Three bars flip over one after the other, as a departure board’s flaps.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Set in type', text: 'The body is drawn in from the left, easing in and out.' },
            { name: 'The board flips', text: 'Tile after tile rises from the bottom, in hard steps.' },
        ],
        tone: [
            { name: 'The flat colour bar', text: 'A warning or destructive tile shows the note on a flat colour bar.' },
            { name: 'The underlined figure', text: 'A warning or destructive tile shows the note on a flat plate with a heavy rule under it.' },
            { name: 'The index colour', text: 'A warning or destructive tile prints its note on the poster’s index colour.' },
        ],
        hover: [
            { name: 'The bar widens', text: 'The top colour bar thickens; Open underlines heavily; focus draws a bold index-red ring.' },
            { name: 'The type sharpens', text: 'The title weight increases; Open gains an index-colour underline; focus doubles the hairline.' },
            { name: 'The flap turns', text: 'A thin bar flips once under the title; Open underlines; focus frames the card in red.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'Flipped', text: 'The tile jolts once, as a needle does, in hard steps.' },
            { name: 'Shifted', text: 'The footer’s timestamp steps forward, easing in and out.' },
        ],
    },
    nostromo: {
        shape: [
            { name: 'The CRT trace', text: 'A green-black screen in a beige bezel, scanlines, the mark a phosphor dot.' },
            { name: 'The indicator panel', text: 'Embossed label tape for the title, the mark a lit indicator lamp.' },
            { name: 'The MU-TH-UR screen', text: 'Mono capitals throughout, scanlines over the whole tile, the mark a green ring dot.' },
        ],
        loading: [
            { name: 'The CRT trace', text: 'A sweep runs across the tube.' },
            { name: 'The indicator panel', text: 'The lamps scan.' },
            { name: 'The motion tracker', text: 'A ring pings out from the middle of the body, as the motion tracker sweeps.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Warmed up', text: 'The tile strikes on and off once like a tube, then holds.' },
            { name: 'Printed out', text: 'Tile after tile is drawn in from the left, in hard steps.' },
        ],
        tone: [
            { name: 'The status plate', text: 'A warning or destructive tile shows the note on its own status plate.' },
            { name: 'The lit lamp', text: 'A warning or destructive tile shows the note on a lit indicator lamp.' },
            { name: 'The klaxon', text: 'A warning or destructive tile is framed all round in its colour, as the bridge alarm frames the screen.' },
        ],
        hover: [
            { name: 'The tube warms', text: 'The phosphor trace brightens; Open underlines in green; focus adds a scanline sweep ring.' },
            { name: 'The lamp blinks', text: 'The indicator lamp blinks once then holds lit; Open underlines; focus frames the tile in a lit ring.' },
            { name: 'The console wakes', text: 'The scanlines sharpen; Open gains a green underline; focus traces the bezel in light.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'A blip', text: 'The tile flares with light once, slowing as it lands.' },
            { name: 'The trace rolls', text: 'The footer’s timestamp steps forward, in hard steps.' },
        ],
    },
    titanium: {
        shape: [
            { name: 'The milled plate', text: 'A brushed grain, the plot ringed in an anodised edge, the mark a milled dot, instrument mono.' },
            { name: 'The instrument dial', text: 'A knurled band along the top, the mark a machined tab, a recessed aperture feel.' },
            { name: 'The anodised badge', text: 'A wide rounded tile with a primary rim and a diagonal sheen, the mark a rounded dot.' },
        ],
        loading: [
            { name: 'The milled plate', text: 'The cutter runs along the edge.' },
            { name: 'The instrument dial', text: 'The knurl rolls.' },
            { name: 'The lathe', text: 'Knurled ridges run along the body, as a part turning on a lathe.' },
        ],
        arrival: [
            { name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            { name: 'Milled', text: 'The body is drawn in from the left, easing in and out.' },
            { name: 'Seated', text: 'Tile after tile drops into place from above, overshooting once.' },
        ],
        tone: [
            { name: 'The status plate', text: 'A warning or destructive tile shows the note on its own status plate.' },
            { name: 'The machined tab', text: 'A warning or destructive tile shows the note on a machined tab.' },
            { name: 'The anodised tag', text: 'A warning or destructive tile shows a band of its colour across the top, an anodised tag.' },
        ],
        hover: [
            {
                name: 'The surface catches light',
                text: 'The brushed grain catches a diagonal sheen; Open underlines in the primary; focus traces an anodised ring.',
            },
            {
                name: 'The dial clicks',
                text: 'The knurled band tightens a notch; Open gains a machined tab; focus frames the aperture in a lit edge.',
            },
            { name: 'The badge tilts', text: 'The diagonal sheen sweeps once; Open underlines; focus halos the rim in the primary.' },
        ],
        live: [
            { name: 'Redrawn', text: 'The body text changes in place at once.' },
            { name: 'A click of the dial', text: 'The tile jolts once, as a needle does.' },
            { name: 'A glint', text: 'The tile flares with light once, slowing as it lands.' },
        ],
    },
};

/**
 * Round 1's verdicts (Kenny, 2026-10-06 18:04), in the order of ASPECTS:
 * shape, loading, arrival, tone, hover, live. A number is settled and not
 * asked again; '' is open in round 2 (cyberpunk's loading, arrival, tone and
 * live; the tone of synthwave and sepia; phantom's tone, hover and live;
 * retro's shape). A loading picture sent back gets six options.
 * @type {Record<string, string[]>}
 */
const PICKED = {
    formal: ['1', '1', '2', '1', '1', '3'],
    light: ['1', '1', '3', '1', '1', '2'],
    dark: ['2', '1', '2', '1', '1', '2'],
    cyberpunk: ['3', '6', '3', '2', '1', '3'],
    synthwave: ['3', '1', '1', '3', '3', '2'],
    pastel: ['3', '2', '1', '2', '1', '3'],
    terminal: ['2', '2', '2', '1', '3', '2'],
    forest: ['3', '2', '3', '3', '3', '2'],
    'high-contrast': ['3', '1', '3', '3', '2', '2'],
    sepia: ['3', '1', '2', '1', '1', '3'],
    blueprint: ['3', '2', '2', '1', '1', '3'],
    solstice: ['3', '3', '3', '1', '3', '3'],
    brutalism: ['2', '1', '3', '1', '1', '2'],
    deco: ['3', '2', '3', '1', '2', '2'],
    phantom: ['2', '2', '2', '3', '1', '1'],
    retro: ['1', '1', '3', '1', '1', '3'],
    grotesk: ['1', '3', '2', '2', '1', '2'],
    nostromo: ['2', '1', '2', '3', '3', '1'],
    titanium: ['1', '2', '2', '1', '2', '3'],
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
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="tiles"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// six choices per theme, each option's name and what it does as its hint.
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
        ? `Round 2: new options for ${open.map(({ id, label }) => `${label.toLowerCase()} (${IDEAS[theme][id].length})`).join(', ')}; everything else is settled as you picked it.`
        : 'Approved: every aspect is settled as you picked it.';
    look.append(p);
}

/* ------------------------------------------------------ the rows of options */

const TILE = (/** @type {'pump' | 'reservoir'} */ which) =>
    which === 'pump'
        ? `<li class="kp-card" data-tl-tile="pump">
    <div class="tl-head"><h3 class="kp-card__title">Pump house 1</h3><span class="tl-mark" data-tl-mark aria-hidden="true"></span></div>
    <p class="kp-card__body" data-tl-body>Two pumps, both running. Pressure 3.4 bar.</p>
    <div class="kp-card__footer kp-row kp-row--between kp-fs-sm">
        <span class="kp-timestamp" data-tl-time>Read 2 min ago</span><a class="kp-button kp-button--sm kp-button--ghost" data-tl-link href="#h-tiles">Open</a>
    </div>
</li>`
        : `<li class="kp-card" data-tl-tile="reservoir">
    <div class="tl-head"><h3 class="kp-card__title">Reservoir North</h3><span class="tl-mark" data-tl-mark aria-hidden="true"></span></div>
    <p class="kp-card__body" data-tl-body>71 % full.</p>
    <div class="kp-card__footer kp-row kp-row--between kp-fs-sm">
        <span class="kp-timestamp" data-tl-time>Read 3 min ago</span><a class="kp-button kp-button--sm kp-button--ghost" data-tl-link href="#h-tiles">Open</a>
    </div>
</li>`;

const previewGrid = document.querySelector('[data-ti-preview]');
if (previewGrid) previewGrid.innerHTML = `${TILE('pump')}${TILE('reservoir')}`;

const rows = /** @type {HTMLElement} */ (document.querySelector('[data-ti-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'tl-aspect';
    box.setAttribute('data-ti-aspect', id);
    box.setAttribute('aria-labelledby', `h-ti-${id}`);
    const head = document.createElement('div');
    head.className = 'tl-aspect__head';
    head.innerHTML = '<h3></h3><p></p>';
    head.firstElementChild.id = `h-ti-${id}`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'tl-trio';
    for (let at = 1; at <= MOST; at++) {
        const cell = document.createElement('div');
        cell.className = 'tl-col';
        cell.setAttribute('data-ti-vary', id);
        cell.setAttribute('data-ti-option', String(at));
        cell.innerHTML =
            `<p class="tl-label"><span class="tl-label__no">${label} · ${at}</span> <span data-ti-name></span></p>` +
            `<p class="tl-desc" data-ti-desc></p>` +
            `<div class="tl-board" data-kp-tiles-set><ul class="kp-tiles tl-grid" data-ti>${TILE('pump')}${TILE('reservoir')}</ul></div>`;
        trio.append(cell);
    }
    box.append(head, trio);
    rows.append(box);
}

/* ------------------------------------------------------------- the picks */

/** What is ticked in the dialog, per theme; an aspect not ticked yet shows its option 1. */
/** @type {Record<string, Partial<Record<Aspect, string>>>} */
const ticked = {};
const theme = () => document.documentElement.getAttribute('data-theme') ?? 'formal';
const picks = () =>
    /** @type {Record<Aspect, string>} */ (Object.fromEntries(ASPECTS.map(({ id }) => [id, ticked[theme()]?.[id] ?? (keptOf(theme(), id) || '1')])));

/** Writes the six aspects on every grid: the preview takes the picks, each row's cell its own option in its own aspect. */
function compose() {
    const now = picks();
    const preview = document.querySelector('[data-ti-preview]');
    const t = theme();
    for (const { id } of ASPECTS) {
        const key = keyOf(t, id, now[id]);
        if (preview?.getAttribute(`data-ti-${id}`) !== key) preview?.setAttribute(`data-ti-${id}`, key);
    }
    for (const cell of document.querySelectorAll('[data-ti-vary]')) {
        const vary = cell.getAttribute('data-ti-vary');
        const option = cell.getAttribute('data-ti-option') ?? '1';
        const grid = cell.querySelector('[data-ti]');
        for (const { id } of ASPECTS) {
            const value = keyOf(t, id, id === vary ? option : now[id]);
            if (grid?.getAttribute(`data-ti-${id}`) !== value) grid?.setAttribute(`data-ti-${id}`, value);
        }
        cell.classList.toggle('tl-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = document.querySelector('[data-ti-picks]');
    const idea = IDEAS[theme()];
    if (words && idea) words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1].name}`).join(' · ');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* --------------------------------------------------------------- the state */

const state = {
    shown: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ ('ready'),
    tone: /** @type {'' | 'warning' | 'destructive'} */ (''),
    point: false,
};

let clock = Date.UTC(2026, 9, 20, 12, 40);
const MINUTE = 60_000;

const WORDS = { empty: 'no reading yet', error: 'could not read: the readings store did not answer' };

/** @param {HTMLElement} el @param {string} width @param {string} [height] */
const skeleton = (el, width, height) => {
    const s = document.createElement('span');
    s.className = 'kp-skeleton';
    s.style.inlineSize = width;
    if (height) s.style.setProperty('--kp-skeleton-height', height);
    el.replaceChildren(s);
};

const minutesAgo = (t) => {
    const m = Math.round((clock - t) / MINUTE);
    if (m < 1) return 'just now';
    if (m < 60) return `Read ${m} min ago`;
    return `Read ${Math.floor(m / 60)} h ${m % 60} min ago`;
};

/** @param {boolean} [loading] one busy frame, so Shown replays the arrival */
function draw(loading = state.shown === 'loading') {
    for (const grid of document.querySelectorAll('[data-ti]')) {
        const pump = grid.querySelector('[data-tl-tile="pump"]');
        const reservoir = grid.querySelector('[data-tl-tile="reservoir"]');
        for (const tile of [pump, reservoir]) {
            if (!(tile instanceof HTMLElement)) continue;
            const body = /** @type {HTMLElement} */ (tile.querySelector('[data-tl-body]'));
            const time = /** @type {HTMLElement} */ (tile.querySelector('[data-tl-time]'));
            const isPump = tile === pump;
            if (isPump && state.tone) tile.setAttribute('data-kp-tone', state.tone);
            else if (isPump) tile.removeAttribute('data-kp-tone');
            if (isPump && state.point) tile.classList.add('tl-hover-sim');
            else tile.classList.remove('tl-hover-sim');
            if (loading) {
                tile.setAttribute('aria-busy', 'true');
                tile.setAttribute('data-kp-busy', '');
                skeleton(body, '85%');
                skeleton(time, '8ch');
                continue;
            }
            tile.removeAttribute('aria-busy');
            tile.removeAttribute('data-kp-busy');
            if (state.shown !== 'ready') {
                body.textContent = WORDS[state.shown];
                time.textContent = state.shown === 'empty' ? 'No reading yet' : 'Could not read';
                continue;
            }
            body.textContent = isPump ? 'Two pumps, both running. Pressure 3.4 bar.' : '71 % full.';
            time.textContent = minutesAgo(clock - (isPump ? 2 : 3) * MINUTE);
        }
    }
}

/** Drawn again: one busy frame, then the readings, so the arrival plays. */
const replay = () => {
    // A tile that flashed a live update arrives again: the arrival rules skip [data-tl-flash].
    for (const tile of document.querySelectorAll('[data-tl-flash]')) tile.removeAttribute('data-tl-flash');
    draw(true);
    requestAnimationFrame(() => requestAnimationFrame(() => draw()));
};

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of document.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

for (const b of document.querySelectorAll('[data-tl-state]'))
    b.addEventListener('click', () => {
        state.shown = /** @type {typeof state.shown} */ (b.getAttribute('data-tl-state') ?? 'ready');
        pressed('data-tl-state', state.shown);
        if (state.shown === 'ready') replay();
        else draw();
    });

for (const b of document.querySelectorAll('[data-tl-tone]'))
    b.addEventListener('click', () => {
        state.tone = /** @type {typeof state.tone} */ (b.getAttribute('data-tl-tone') ?? '');
        pressed('data-tl-tone', state.tone);
        draw();
    });

for (const b of document.querySelectorAll('[data-tl-point]'))
    b.addEventListener('click', () => {
        state.point = b.getAttribute('data-tl-point') === 'on';
        pressed('data-tl-point', b.getAttribute('data-tl-point') ?? '');
        draw();
    });

// A live update: a new reading for pump house 1; flashes the tile once per
// its live option, then settles. The oldest reading would drop off a real
// chart; here only the text changes.
document.querySelector('[data-tl-live]')?.addEventListener('click', () => {
    clock += 10 * MINUTE;
    state.shown = 'ready';
    pressed('data-tl-state', 'ready');
    draw();
    for (const grid of document.querySelectorAll('[data-ti]')) {
        const tile = grid.querySelector('[data-tl-tile="pump"]');
        if (!(tile instanceof HTMLElement)) continue;
        // The flash stays on once played (the arrival rules skip a flashing
        // tile, so taking it off would play the arrival again); off and on
        // with a style read between restarts it.
        tile.removeAttribute('data-tl-flash');
        void getComputedStyle(tile).animationName;
        tile.setAttribute('data-tl-flash', '');
    }
});

// The links go nowhere on this page: say where they would go.
const log = document.querySelector('[data-tl-log]');
document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('[data-tl-link]') : null;
    if (!link) return;
    event.preventDefault();
    const title = link.closest('[data-tl-tile]')?.querySelector('.kp-card__title')?.textContent;
    if (log) log.textContent = `Opened: ${title}.`;
});

/* -------------------------------------------------------- the plain tiles */

const plain = document.querySelector('[data-tl-plain]');
if (plain)
    plain.innerHTML = `
    <li class="kp-card"><h3 class="kp-card__title">Pump house 1</h3><p class="kp-card__body">Two pumps, both running. Pressure 3.4 bar.</p>
        <div class="kp-card__footer kp-row kp-row--between kp-fs-sm"><span class="kp-timestamp">Read 2 min ago</span><a class="kp-button kp-button--sm kp-button--ghost" href="#h-tiles">Open</a></div></li>
    <li class="kp-card"><h3 class="kp-card__title">Reservoir North</h3><p class="kp-card__body">71 % full.</p>
        <div class="kp-card__footer kp-row kp-row--between kp-fs-sm"><span class="kp-timestamp">Read 3 min ago</span><a class="kp-button kp-button--sm kp-button--ghost" href="#h-tiles">Open</a></div></li>`;

attachTileSets(document);
compose();
draw();

/* --------------------------------------------------------------- the theme */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-tl-theme-name]')) el.textContent = LABEL[now] ?? now;
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    // A settled aspect has no row; a row hides the cells its theme has no option for.
    for (const box of document.querySelectorAll('[data-ti-aspect]'))
        /** @type {HTMLElement} */ (box).hidden = Boolean(keptOf(now, /** @type {Aspect} */ (box.getAttribute('data-ti-aspect'))));
    for (const cell of document.querySelectorAll('[data-ti-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (cell.getAttribute('data-ti-vary'))]?.[Number(cell.getAttribute('data-ti-option')) - 1];
        /** @type {HTMLElement} */ (cell).hidden = !option;
        const name = cell.querySelector('[data-ti-name]');
        const desc = cell.querySelector('[data-ti-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ---------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-tl-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-trend; full speed by default, since a loop is judged
// at its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('tl-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-tl-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-tl-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-tl-speed'));
        try {
            localStorage.setItem('tl-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();
