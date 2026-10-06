// research/character-menu: the menu button (js/menu-button.js, `.kp-menu-button`
// with its `.kp-menu--rich`), phase 1 of its character round, all 22 themes in
// one demo judged through the review kit. As the trend tile and the meter
// (round 2): nothing is bundled, each theme's menu button has five aspects,
// each picked on its own from three options, so any combination composes.
//
// The menu button is the package's own: attachMenuButtons() wires every
// `[data-kp-menu-button]` on the page (opening, closing, the keys), setMenu()
// fills it with one fixed set of actions (one disabled entry with its reason,
// one destructive entry), and openMenu()/closeMenu() drive the controls. Every
// aspect is CSS only, keyed by one attribute each on the wrapper
// (`data-mb-shape`, `data-mb-loading`, `data-mb-open`, `data-mb-tone`,
// `data-mb-interact`), so any combination composes. js/menu-button.js is not
// changed; the animated *leave* on Close is demo.js's own doing (the module
// hides the menu at once, with no leave hook of its own), built by playing a
// CSS animation on the menu before calling the real closeMenu().

import { attachMenuButtons, openMenu, closeMenu, setMenu, MENU_BUTTON, MENU_SELECT_EVENT } from '../../js/menu-button.js';
import { THEMES } from '../../js/theme-registry.js';
import R2A from './round2-a.js';
import R2B from './round2-b.js';
import R2C from './round2-c.js';
import R2D from './round2-d.js';
import R3A from './round3-a.js';
import R3B from './round3-b.js';

/** @typedef {{ name: string, text: string, key?: string }} Option */
/** @typedef {'shape' | 'loading' | 'open' | 'tone' | 'interact'} Aspect */

/** The five aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: 'The plate, the group headings, and how a label sits over its hint. Open a menu and compare them as they stand.',
    },
    { id: 'loading', label: 'While loading', about: 'The one entry a fill waits behind; it always moves. Press Loading.' },
    {
        id: 'open',
        label: 'Open and close',
        about: 'How the menu arrives when the button opens it, and leaves the same way in reverse. Press Open, then Close.',
    },
    {
        id: 'tone',
        label: 'A destructive entry and a disabled reason',
        about: 'How the destructive entry reads, and how a disabled entry shows why it cannot be used. Open a menu to see both.',
    },
    {
        id: 'interact',
        label: 'Hover, focus and a press',
        about: 'How an entry reads under the pointer, with the keyboard focus, and while it is pressed. Press Focus, or hover and click an entry.',
    },
];

/**
 * Per theme, three options for each aspect: the spec other helpers build
 * from, one sentence each.
 * @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            {
                name: 'The engraved plate',
                text: 'A ruled double frame around the menu, headings in the serif’s small capitals, hints in a lighter serif underneath.',
            },
            { name: 'The ledger page', text: 'A fine rule under each heading like a ledger page, entries in the display serif, hints in italic.' },
            {
                name: 'The certificate',
                text: 'A thin navy rule inside the frame over a faint guilloche, entries set tight with a hairline between groups.',
            },
        ],
        loading: [
            { name: 'The dotted leader', text: 'A dotted leader is written across the loading row, left to right, and starts again.' },
            { name: 'The seal is pressed', text: 'A small navy seal ring presses onto the loading row, lifts, and presses again.' },
            { name: 'The nib sweeps', text: 'A fine nib sweeps once across the loading row and lifts for the next pass.' },
        ],
        open: [
            { name: 'Unrolled', text: 'The menu unrolls downward from the button like a scroll, and rolls back up the same way to close.' },
            {
                name: 'The frame draws in',
                text: 'The double rule draws in from the corners to its edges, and draws back out to the corners to leave.',
            },
            { name: 'Pressed open', text: 'The menu tips open a few degrees like a hinged cover, and swings shut the same way to close.' },
        ],
        tone: [
            {
                name: 'The red-ink entry',
                text: 'The destructive entry is ruled off along its left edge in the accountant’s red ink; a disabled reason sits in small italic.',
            },
            {
                name: 'The struck entry',
                text: 'The destructive entry’s label is struck through once in red on hover; the disabled reason reads under a thin rule.',
            },
            {
                name: 'The void stamp',
                text: 'The destructive entry carries a small red seal at its end; a disabled entry’s reason is stamped “void” beside it.',
            },
        ],
        interact: [
            {
                name: 'The quill underline',
                text: 'A hovered or focused entry gets a fine navy rule under its label; a press deepens it to a double rule.',
            },
            { name: 'The margin mark', text: 'A hovered or focused entry gets a thin navy tick in the left margin; a press fills the tick solid.' },
            {
                name: 'The wax seal',
                text: 'A focused entry’s row is framed in a hairline; hover tints the plate faintly, a press presses the frame in by one pixel.',
            },
        ],
    },
    light: {
        shape: [
            {
                name: 'The soft card',
                text: 'A white plate on a soft shadow with a wide radius, headings in muted small caps over a feather-light rule.',
            },
            { name: 'Daylight', text: 'A pale wash lightens toward the top of the plate, headings sit on it plainly, entries keep generous air.' },
            {
                name: 'The paper sheet',
                text: 'A lifted corner folds over the plate’s top right, faint writing rules run behind the groups, hints in a soft grey.',
            },
        ],
        loading: [
            { name: 'The dashed baseline', text: 'A dashed baseline under the loading row drifts to the right, then starts again.' },
            { name: 'Daylight', text: 'A slow band of daylight crosses the loading row, left to right.' },
            { name: 'A cloud passes', text: 'The soft shadow of a cloud drifts across the loading row, slowly, and returns.' },
        ],
        open: [
            { name: 'Unfolds', text: 'The menu opens from its middle like a folded card, and folds back to its middle to close.' },
            { name: 'Sunrise', text: 'The menu rises softly from the button’s edge, slowing as it lands, and sinks back the same way to close.' },
            { name: 'A soft pop', text: 'The menu scales up from 97% with a gentle overshoot, and scales back down to leave.' },
        ],
        tone: [
            {
                name: 'The coloured tab',
                text: 'The destructive entry carries a soft drop shadow in its colour; a disabled reason reads muted under a dashed rule.',
            },
            {
                name: 'The soft outline',
                text: 'The destructive entry is ringed in a soft outline of its own ink; the disabled reason sits in a lighter, smaller line.',
            },
            {
                name: 'The warm edge',
                text: 'A warm band glows along the destructive entry’s top edge; a disabled entry’s reason carries a soft dot before it.',
            },
        ],
        interact: [
            { name: 'The soft lift', text: 'A hovered or focused entry lifts on a soft shadow of its own; a press settles it flat again.' },
            { name: 'The glow', text: 'A hovered or focused entry’s plate glows a touch warmer; a press dims it back for a moment.' },
            { name: 'The round pill', text: 'A hovered or focused entry gets a soft rounded fill behind it; a press shrinks the fill by a hair.' },
        ],
    },
    dark: {
        shape: [
            {
                name: 'The status board',
                text: 'A black panel with a fine bevel, headings in mono capitals lit faintly, a hairline between every group.',
            },
            { name: 'The machined panel', text: 'Entries sit in a recessed slot with an inner shadow above and a lit lip below, headings in mono.' },
            {
                name: 'The oscilloscope',
                text: 'A dark well with a dotted graticule behind the groups and a lit rim around the plate, mono throughout.',
            },
        ],
        loading: [
            { name: 'The ticker baseline', text: 'A dashed baseline on the loading row ticks along like a ticker tape, then starts again.' },
            { name: 'The slot is scanned', text: 'A lit band sweeps along the loading row, as a scanner reads a slot.' },
            { name: 'The status lamp', text: 'A small lamp steps between three places on the loading row, one after the other.' },
        ],
        open: [
            { name: 'Switched on', text: 'The menu strikes on and off once like a tube, then holds; it strikes off the same way to close.' },
            { name: 'Slid out', text: 'The menu slides out from under the button’s edge in hard steps, and slides back in the same steps to close.' },
            { name: 'Powered up', text: 'The menu’s rim lights from dim to full across three steps, and dims back across the same steps to close.' },
        ],
        tone: [
            {
                name: 'The alarm lamp',
                text: 'The destructive entry lights its label like an alarm lamp; the disabled reason reads in a dim mono line.',
            },
            {
                name: 'The machined tab',
                text: 'The destructive entry sits on a flat recessed tab with a square corner; the disabled reason carries a dim bracket.',
            },
            { name: 'The red rim', text: 'A red rim lights the destructive entry’s left edge; a disabled entry’s reason sits behind a faint hatch.' },
        ],
        interact: [
            { name: 'The lit slot', text: 'A hovered or focused entry’s slot lights from within; a press dims it for a moment, as a switch thrown.' },
            { name: 'The scan line', text: 'A hovered or focused entry gets a thin scan line across it; a press holds the line still and bright.' },
            { name: 'The panel glow', text: 'A hovered or focused entry’s row glows at its rim; a press snaps the glow off and straight back on.' },
        ],
    },
    cyberpunk: {
        shape: [
            {
                name: 'The neon trace',
                text: 'Cut corners on the plate, headings in tech mono with a cyan halo, a faint circuit grid behind the groups.',
            },
            {
                name: 'The glitch HUD',
                text: 'Yellow brackets mark the plate’s corners, hazard tape runs along its top edge, entries in a square data face.',
            },
            { name: 'The holo card', text: 'A cyan rim glows around the plate, diagonal scan lines cross the groups, headings in the display face.' },
        ],
        loading: [
            { name: 'The packet runs', text: 'A packet of light runs along the loading row’s baseline, then starts again.' },
            { name: 'The glitch bar', text: 'A glitch bar jumps across the loading row in hard steps.' },
            { name: 'Packet rain', text: 'Packets of light rain down the loading row in columns, looping.' },
        ],
        open: [
            { name: 'Jacked in', text: 'The menu jumps into place sideways in hard jumps, and glitches back sideways the same way to close.' },
            { name: 'The neon strikes', text: 'The menu’s rim strikes on and off like a tube, then holds; it strikes off the same way to close.' },
            { name: 'Booted', text: 'The menu scans up from a single line to its full height in hard steps, and scans back down to close.' },
        ],
        tone: [
            {
                name: 'The hazard frame',
                text: 'The destructive entry is framed all round in hazard colour; the disabled entry’s reason sits behind a faint glitch.',
            },
            {
                name: 'The cut-corner chip',
                text: 'The destructive entry sits on a cut-corner chip in its colour; the disabled reason reads in a dim RGB split.',
            },
            {
                name: 'The warning scanline',
                text: 'A scanline in the destructive colour crosses that entry once; the disabled reason carries a small no-signal glyph.',
            },
        ],
        interact: [
            { name: 'The RGB split', text: 'A hovered or focused entry’s label gets a faint RGB split; a press snaps the split back to one line.' },
            { name: 'The cyan edge', text: 'A hovered or focused entry lights a cyan edge along its side; a press brightens the edge for a moment.' },
            {
                name: 'The data flicker',
                text: 'A hovered or focused entry flickers once into a brighter face; a press holds that brighter face while pressed.',
            },
        ],
    },
    synthwave: {
        shape: [
            {
                name: 'The grid-floor horizon',
                text: 'A perspective grid floor under a pink horizon behind the groups, headings in the display face with a pink drop.',
            },
            {
                name: 'The VCR display',
                text: 'OSD-style numerals and scanlines over the plate, entries in a hard square face, headings in capitals.',
            },
            {
                name: 'The arcade marquee',
                text: 'A pink frame glows around the plate, headings sit on a cyan wash, entries in the arcade display face.',
            },
        ],
        loading: [
            { name: 'The grid drives', text: 'The grid floor on the loading row drives toward the reader, looping.' },
            { name: 'The tracking rolls', text: 'A tracking band rolls down the loading row, as a VCR losing sync.' },
            { name: 'The sun rises', text: 'A striped sun swells up over the horizon on the loading row and sinks again.' },
        ],
        open: [
            { name: 'Over the horizon', text: 'The menu rises from the horizon line, slowing as it lands, and sinks back below it to close.' },
            { name: 'Tape loads', text: 'The menu draws in from the top in hard steps like a tape loading, and retracts the same steps to close.' },
            { name: 'Neon strikes', text: 'The menu’s rim strikes on then holds, pink then cyan; it strikes off the same way to close.' },
        ],
        tone: [
            {
                name: 'The arcade warning',
                text: 'The destructive entry’s plate flashes once under the label, as an arcade score; the disabled reason sits in dim OSD text.',
            },
            {
                name: 'The inverse block',
                text: 'The destructive entry inverts to a solid block in its colour; the disabled reason carries a dim scanline.',
            },
            {
                name: 'The laser edge',
                text: 'A laser-thin edge in the destructive colour runs along that entry; the disabled reason reads behind a faint grid.',
            },
        ],
        interact: [
            {
                name: 'The laser sweep',
                text: 'A hovered or focused entry gets a laser-thin underline that sweeps in; a press holds the sweep at full length.',
            },
            { name: 'The glass glow', text: 'A hovered or focused entry’s plate glows like glass; a press dims the glow for a moment.' },
            { name: 'The VCR flicker', text: 'A hovered or focused entry flickers into inverse once; a press holds the inverse while pressed.' },
        ],
    },
    pastel: {
        shape: [
            {
                name: 'The sticker chart',
                text: 'A candy plate with a flat sticker shadow, headings in a rounded face, a soft dot between the groups.',
            },
            {
                name: 'The washi planner',
                text: 'A strip of washi tape crosses the plate’s top, headings in a dotted planner face, hints handwritten-soft.',
            },
            { name: 'The cloud card', text: 'A wide round plate with a dashed candy outline, a soft blob of colour behind the headings.' },
        ],
        loading: [
            { name: 'The candy hop', text: 'A candy dot hops along the loading row, bouncing, and starts again.' },
            { name: 'The tape drifts', text: 'The washi tape on the loading row drifts gently side to side.' },
            { name: 'Sprinkles', text: 'Two sprinkles in soft colours hop along the loading row in turn.' },
        ],
        open: [
            { name: 'Popped', text: 'The menu pops up from the button with one happy overshoot, and squashes back down the same way to close.' },
            { name: 'Unwrapped', text: 'The menu unfolds from its middle like a wrapped sticker sheet, and folds back to close.' },
            { name: 'Bounced in', text: 'The menu bounces down into place in two soft steps, and bounces back up to close.' },
        ],
        tone: [
            {
                name: 'The heart sticker',
                text: 'The destructive entry carries a small heart-shaped mark turned askew; the disabled reason sits in a soft grey bubble.',
            },
            {
                name: 'The taped label',
                text: 'The destructive entry sits under a strip of coloured tape; the disabled reason reads under a dashed line.',
            },
            {
                name: 'The candy band',
                text: 'A candy-coloured band runs along the destructive entry’s top; the disabled reason carries a small soft dot.',
            },
        ],
        interact: [
            { name: 'The happy hop', text: 'A hovered or focused entry hops up a touch with an overshoot; a press squashes it back down.' },
            {
                name: 'The sticker peel',
                text: 'A hovered or focused entry tilts a few degrees like a peeling sticker; a press flattens it straight.',
            },
            {
                name: 'The soft bubble',
                text: 'A hovered or focused entry gets a soft rounded bubble behind it; a press shrinks the bubble by a hair.',
            },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'The top(1) row',
                text: 'A double box-drawing frame around the plate, headings in mono capitals, entries square-joined in the phosphor.',
            },
            { name: 'The dumb-terminal plot', text: 'Groups separated by a row of character-cell rules, hints in brackets, everything in the mono.' },
            {
                name: 'The curses window',
                text: 'A single-line box frame, headings ruled off under them in a fainter line, entries square in the phosphor.',
            },
        ],
        loading: [
            { name: 'The block caret', text: 'A block caret blinks on the loading row, once a second.' },
            { name: 'The dots march', text: 'A row of dots marches across the loading row, then starts again.' },
            { name: 'The hash bar', text: 'A row of # blocks fills the loading row block by block, then starts over.' },
        ],
        open: [
            { name: 'Printed', text: 'The menu prints in line by line in hard steps, and erases back line by line to close.' },
            { name: 'Paged in', text: 'The menu drops into place from above in three hard steps, and drops back up the same steps to close.' },
            { name: 'Booted', text: 'The menu’s frame draws on in a single hard step, and drops off in a single step to close.' },
        ],
        tone: [
            { name: 'The bell', text: 'The destructive entry flashes in reverse video once on open; the disabled reason prints under a dashed box.' },
            { name: 'Reverse video', text: 'The destructive entry sits permanently in reverse video; the disabled entry’s reason is underlined.' },
            { name: 'The warning glyph', text: 'A ! glyph sits before the destructive entry’s label; the disabled reason reads in brackets.' },
        ],
        interact: [
            {
                name: 'Reverse on hover',
                text: 'A hovered or focused entry flips to reverse video; a press holds the reverse a beat longer before release.',
            },
            { name: 'The caret moves', text: 'A hovered or focused entry gets a block caret before its label; a press fills the caret solid.' },
            {
                name: 'The underline cursor',
                text: 'A hovered or focused entry’s label gets an underline cursor that blinks once; a press stops the blink solid.',
            },
        ],
    },
    forest: {
        shape: [
            { name: 'The ranger’s logbook', text: 'A kraft-paper plate, headings in serif italic, contour rings running faintly behind the groups.' },
            { name: 'The canopy', text: 'A leaf-green wash lightens toward the plate’s top, headings sit on bark-ink rules between groups.' },
            {
                name: 'The herbarium sheet',
                text: 'Pressed leaf veins run behind the headings, entries in serif italic over a faint leaf-green wash.',
            },
        ],
        loading: [
            { name: 'The trail of light', text: 'A trail of light walks along the loading row, then starts again.' },
            { name: 'The canopy sways', text: 'A leaf-green wash on the loading row sways gently side to side.' },
            { name: 'Fireflies', text: 'Two fireflies drift to and fro over the loading row.' },
        ],
        open: [
            { name: 'Grows', text: 'The menu grows up from the button like a sapling, slowing as it lands, and withers back down to close.' },
            { name: 'The trail is walked', text: 'The menu draws in from the left, easing in and out, and draws back out the same way to close.' },
            { name: 'Unfurled', text: 'The menu unfurls from its top edge like a fern, and curls back up the same way to close.' },
        ],
        tone: [
            {
                name: 'The trail blaze',
                text: 'The destructive entry is blazed along its left edge in its colour, as a trail marker on a trunk; the disabled reason sits on a wooden tag.',
            },
            {
                name: 'The fallen leaf',
                text: 'The destructive entry carries a small fallen-leaf mark; the disabled reason sits under a faint vein pattern.',
            },
            {
                name: 'The warning moss',
                text: 'A band of moss-dark colour runs along the destructive entry’s top; the disabled reason reads under a leaf tag.',
            },
        ],
        interact: [
            { name: 'The branch sways', text: 'A hovered or focused entry sways a touch like a branch; a press settles it back still.' },
            { name: 'The leaf tag lifts', text: 'A hovered or focused entry’s tag lifts a hair with a soft shadow; a press presses it flat again.' },
            { name: 'The dew glints', text: 'A hovered or focused entry gets a soft glint at its edge; a press dims the glint for a moment.' },
        ],
    },
    'high-contrast': {
        shape: [
            {
                name: 'Ink and frame',
                text: 'A 2px rule frames the plate, headings bold, a solid rule under every heading. Still: nothing moves at rest.',
            },
            {
                name: 'The inverse plate',
                text: 'The plate inverts to an ink fill with entries in the paper colour, headings heavy. Still: nothing moves at rest.',
            },
            {
                name: 'The signal board',
                text: 'A heavy 3px frame, headings very large and heavy, a solid rule between every group. Still: nothing moves at rest.',
            },
        ],
        loading: [
            { name: 'The dashed baseline', text: 'A dashed baseline on the loading row steps along in hard steps, then starts again.' },
            { name: 'The striped block', text: 'A striped block in ink and paper steps across the loading row; it shows on both.' },
            { name: 'The scanning bar', text: 'A thick bar in ink and paper scans down the loading row in hard steps.' },
        ],
        open: [
            { name: 'Switched', text: 'The menu is drawn on in four hard steps, and drawn off in the same four steps to close.' },
            { name: 'Dropped', text: 'The menu drops into place from above in two hard steps, and drops back up in two steps to close.' },
            { name: 'Flipped', text: 'The menu flips from ink to paper in one hard step to open, and flips back to close.' },
        ],
        tone: [
            {
                name: 'The signal plate',
                text: 'The destructive entry sits on its own plate framed in ink with a hard shadow; the disabled reason reads in a 1px frame.',
            },
            {
                name: 'The heavy frame',
                text: 'The destructive entry sits in a 3px frame with square corners; the disabled reason reads bold, underlined.',
            },
            {
                name: 'The struck block',
                text: 'The destructive entry’s label is struck through once in a thick rule; the disabled reason sits boxed.',
            },
        ],
        interact: [
            { name: 'The bar flips', text: 'A hovered or focused entry flips from ink to paper; a press holds the flip a beat longer.' },
            { name: 'The frame thickens', text: 'A hovered or focused entry’s frame thickens from 1px to 3px; a press thickens it once more.' },
            { name: 'The block inverts', text: 'A hovered or focused entry inverts solid; a press inverts back for the duration of the press.' },
        ],
    },
    sepia: {
        shape: [
            {
                name: 'The barograph',
                text: 'Fine level lines and hour lines in sepia behind the groups, headings in small capitals, an aged vignette on the plate.',
            },
            { name: 'Letterpress', text: 'Headings pressed into the sheet, entries on speckled paper, a heavier ink rule between groups.' },
            {
                name: 'The ticket stub',
                text: 'Notches punched along both sides of the plate, a dashed tear line as the frame, entries in the display serif.',
            },
        ],
        loading: [
            { name: 'The nib sweeps', text: 'A fine nib sweeps across the loading row, then starts again.' },
            { name: 'The ink spreads', text: 'A blot of ink swells and draws back on the loading row.' },
            { name: 'The drum turns', text: 'The loading row’s hour lines move left under a still nib, as a barograph drum turning.' },
        ],
        open: [
            { name: 'The nib writes', text: 'The menu is written in from the top at an even pace, and the ink lifts away the same way to close.' },
            { name: 'Pressed', text: 'The menu drops into place from above, slowing as it lands, and is pressed back up to close.' },
            { name: 'Unrolled', text: 'The menu unrolls from the drum like a strip-chart, and rolls back up to close.' },
        ],
        tone: [
            {
                name: 'The rubber stamp',
                text: 'The destructive entry is stamped across in red askew; the disabled reason is stamped “void” beside it.',
            },
            {
                name: 'The printed border',
                text: 'The destructive entry sits inside its own printed border; the disabled reason reads under a ruled line.',
            },
            {
                name: 'The red ink entry',
                text: 'A line of red ink runs under the destructive entry’s label; the disabled reason sits in a fainter sepia tone.',
            },
        ],
        interact: [
            {
                name: 'The nib lingers',
                text: 'A hovered or focused entry gets a fine ink underline that lingers in; a press deepens it to a double line.',
            },
            { name: 'The paper warms', text: 'A hovered or focused entry’s plate warms a shade; a press cools it back for a moment.' },
            { name: 'The stamp presses', text: 'A hovered or focused entry’s frame presses in by a pixel; a press holds the pressed frame.' },
        ],
    },
    blueprint: {
        shape: [
            {
                name: 'The chart recorder',
                text: 'A millimetre grid behind the groups, headings and hints in technical mono capitals, white ink rules between groups.',
            },
            { name: 'The title block', text: 'The plate parted into cells by drawn rules like a drawing’s title block, headings in mono capitals.' },
            {
                name: 'The section view',
                text: 'The plate hatched at forty-five degrees behind the groups, a dashed frame, headings in technical mono capitals.',
            },
        ],
        loading: [
            { name: 'The pen sweeps', text: 'The recorder’s pen sweeps across the loading row, then starts again.' },
            { name: 'The dash marches', text: 'A dash marches along the loading row’s baseline.' },
            { name: 'The dimension line', text: 'A dimension line with its ticks is drawn across the loading row, again and again.' },
        ],
        open: [
            { name: 'Drafted', text: 'The menu is drawn in from the top at an even pace in white ink, and erased the same way to close.' },
            { name: 'Plotted', text: 'The menu is drawn in from the top in hard steps like a plotter pen, and retracts the same steps to close.' },
            { name: 'Unfolded', text: 'The menu unfolds along a drawn hinge line, and folds back along it to close.' },
        ],
        tone: [
            {
                name: 'The revision cloud',
                text: 'The destructive entry is framed all round in its colour like a revision cloud; the disabled reason reads in dimension mono.',
            },
            {
                name: 'The dimension flag',
                text: 'A small flag in the destructive colour sits at the end of that entry; the disabled reason reads under a dashed leader.',
            },
            {
                name: 'The hatched warning',
                text: 'The destructive entry’s plate is hatched in its colour; the disabled reason reads in a fainter mono weight.',
            },
        ],
        interact: [
            { name: 'The pen underlines', text: 'A hovered or focused entry gets a white-ink underline drawn in; a press deepens the line.' },
            {
                name: 'The grid highlights',
                text: 'A hovered or focused entry’s grid cell lights a shade brighter; a press dims it back for a moment.',
            },
            {
                name: 'The dimension ticks',
                text: 'A hovered or focused entry gets dimension ticks at each end; a press closes the ticks in by a hair.',
            },
        ],
    },
    solstice: {
        shape: [
            {
                name: 'The low sun',
                text: 'A warm glow rises from the plate’s foot behind the groups, headings in the display face, a thin warm rule between groups.',
            },
            {
                name: 'The embers',
                text: 'A faint heat wash sits behind the headings, entries in the serif, a glowing coal-coloured rule between groups.',
            },
            { name: 'The horizon', text: 'A warm band of light runs across the plate’s foot, headings in the display face over it.' },
        ],
        loading: [
            { name: 'The glow rises', text: 'A glow rises from the foot of the loading row, swelling and settling, then starts again.' },
            { name: 'The heat glows', text: 'A heat shimmer glows from below the loading row, swelling and settling.' },
            { name: 'The sun crosses', text: 'A low sun crosses the loading row from left to right.' },
        ],
        open: [
            { name: 'Dawn', text: 'The menu rises from the button like a sunrise, slowing as it lands, and sets back down to close.' },
            {
                name: 'Kindled',
                text: 'The menu is drawn in from the bottom up, warming and brightening as it rises, and draws back down from the top, cooling as it goes, to close.',
            },
            { name: 'The horizon opens', text: 'The menu opens along the horizon line outward, and closes back along it to leave.' },
        ],
        tone: [
            {
                name: 'The red sky',
                text: 'A band of sky above the destructive entry turns to its colour; the disabled reason reads under a dim ember rule.',
            },
            {
                name: 'The glowing chip',
                text: 'The destructive entry sits on a chip that glows faintly in its colour; the disabled reason carries a fainter glow.',
            },
            {
                name: 'The ember edge',
                text: 'An ember-coloured edge runs along the destructive entry’s side; the disabled reason reads in a cooled tone.',
            },
        ],
        interact: [
            { name: 'The flare', text: 'A hovered or focused entry flares with warmth once; a press holds the flare steady while pressed.' },
            { name: 'The ember glows', text: 'A hovered or focused entry’s edge glows like an ember; a press brightens the glow for a moment.' },
            { name: 'The sun crosses', text: 'A hovered or focused entry gets a warm band that crosses it once; a press stops the band mid-way.' },
        ],
    },
    brutalism: {
        shape: [
            { name: 'The slab', text: 'A heavy black frame with a hard offset shadow, headings in heavy capitals, a thick rule between groups.' },
            { name: 'The sticker sheet', text: 'A lavender plate with entries in a heavy black outline, headings huge and tight.' },
            { name: 'The poster block', text: 'A 3px frame with a hard offset shadow in the accent, the plate hatched in ink behind the groups.' },
        ],
        loading: [
            { name: 'The stamp', text: 'A black block is stamped onto the loading row, lifted and stamped again.' },
            { name: 'The drop', text: 'A black block drops onto the loading row and lands hard, again and again.' },
            { name: 'The hammer', text: 'A black block hammers three places along the loading row in turn.' },
        ],
        open: [
            { name: 'Slammed', text: 'The menu drops into place from above in two hard steps, and is yanked back up in two steps to close.' },
            { name: 'Shoved in', text: 'The menu is shoved in from the side in one hard step, and shoved back out the same step to close.' },
            { name: 'Stamped', text: 'The menu stamps down flat onto the button in one hard step, and is lifted off in one step to close.' },
        ],
        tone: [
            {
                name: 'The warning poster',
                text: 'The destructive entry prints its label on a block with a hard shadow, framed in ink; the disabled reason sits boxed plainly.',
            },
            {
                name: 'The askew sticker',
                text: 'The destructive entry sits on an askew sticker in a black outline; the disabled reason reads under a thick rule.',
            },
            {
                name: 'The hazard block',
                text: 'A hard-edged block in the destructive colour sits behind that entry’s label; the disabled reason carries a thick strike mark.',
            },
        ],
        interact: [
            { name: 'Kicked', text: 'A hovered or focused entry jolts once sideways in a hard step; a press holds it shoved over.' },
            { name: 'The block drops', text: 'A hovered or focused entry’s shadow drops harder; a press flattens the shadow to nothing.' },
            { name: 'The stamp presses', text: 'A hovered or focused entry’s frame thickens by a hard step; a press stamps it down flat.' },
        ],
    },
    deco: {
        shape: [
            {
                name: 'The gilt frame',
                text: 'A double gold rule frames the plate, a faint sunburst rises behind the headings, entries in the display face’s capitals.',
            },
            {
                name: 'The marquee',
                text: 'A row of bulbs runs along the plate’s top edge, headings in display capitals, a gold rule between groups.',
            },
            {
                name: 'The skyscraper',
                text: 'Fine gold setback lines rise behind the headings, a gold bar along the top, entries in the display capitals.',
            },
        ],
        loading: [
            { name: 'The glint runs', text: 'A glint runs across the loading row, then starts again.' },
            { name: 'The bulbs chase', text: 'Marquee bulbs chase along the loading row.' },
            { name: 'The sunburst opens', text: 'A gold sunburst opens from the loading row’s foot, ray by ray.' },
        ],
        open: [
            {
                name: 'The curtain rises',
                text: 'The menu rises from the button like a curtain, slowing as it lands, and falls back the same way to close.',
            },
            {
                name: 'The marquee lights',
                text: 'The menu opens from its middle outward in hard steps like bulbs lighting, and dims inward the same steps to close.',
            },
            { name: 'Unveiled', text: 'The menu draws in from the top in a gold sweep, and sweeps back up to close.' },
        ],
        tone: [
            {
                name: 'The gilt notice',
                text: 'The destructive entry is framed all round in its colour, as a notice in a gilt frame; the disabled reason sits on a plain plaque.',
            },
            {
                name: 'The marquee plaque',
                text: 'The destructive entry sits on a plaque that flashes once on open; the disabled reason reads under a thin gold rule.',
            },
            {
                name: 'The gold warning rule',
                text: 'A gold-edged rule in the destructive colour runs under that entry; the disabled reason carries a dimmer gold tick.',
            },
        ],
        interact: [
            { name: 'The bulbs chase', text: 'A hovered or focused entry lights like a chasing bulb; a press holds the bulb lit while pressed.' },
            { name: 'Gilded', text: 'A hovered or focused entry’s edge gilds with a glint; a press deepens the gilt for a moment.' },
            { name: 'The curtain parts', text: 'A hovered or focused entry’s rule parts a touch wider; a press closes it back in.' },
        ],
    },
    phantom: {
        shape: [
            { name: 'The evidence card', text: 'A white plate pinned to a board look, headings slanted, a red string motif running between groups.' },
            { name: 'The calling card', text: 'A black plate under a halftone, headings skewed in display capitals, a red slash marks the corner.' },
            { name: 'The ransom note', text: 'A halftone over the plate, headings skewed, a red offset shadow behind the group names.' },
        ],
        loading: [
            { name: 'The stamp ring', text: 'A red ring is stamped onto the loading row, again and again.' },
            { name: 'Stamped askew', text: 'The halftone on the loading row shuffles, looping.' },
            { name: 'The string is pulled', text: 'A red string is pulled across the loading row in jerks.' },
        ],
        open: [
            { name: 'The card is thrown', text: 'The menu is thrown into place sideways in hard jumps, and snatched back the same way to close.' },
            { name: 'Slashed in', text: 'The menu is drawn in backwards, from its end, easing in and out, and drawn back out to close.' },
            { name: 'Pinned', text: 'The menu drops in and is pinned at a slight angle, then straightens; it tilts and lifts away to close.' },
        ],
        tone: [
            {
                name: 'The calling card',
                text: 'The destructive entry sits on its own plate stamped askew; the disabled reason carries a ruled border.',
            },
            { name: 'The red slash', text: 'A red slash crosses the destructive entry’s corner; the disabled reason reads under a faint halftone.' },
            { name: 'The ransom cut', text: 'The destructive entry’s label is cut from a different, redder type; the disabled reason reads plain.' },
        ],
        interact: [
            { name: 'Snatched', text: 'A hovered or focused entry glitches sideways for a moment; a press holds it shifted while pressed.' },
            { name: 'The string twangs', text: 'A hovered or focused entry jolts once like a plucked string; a press stills it taut.' },
            { name: 'The halftone shifts', text: 'A hovered or focused entry’s halftone shifts a step; a press locks the shift in place.' },
        ],
    },
    'shade-light': {
        shape: [
            { name: 'Pencil in the shade', text: 'A pencil-hatched plate, headings in a soft graphite stroke, a faint shadow band between groups.' },
            { name: 'The leaf shade', text: 'Dappled leaf shade falls across the plate, headings sit plainly on the paper.' },
            { name: 'The window light', text: 'A shaft of window light falls across the plate from the left, the plate otherwise plain.' },
        ],
        loading: [
            { name: 'The hatching sweeps', text: 'Pencil hatching sweeps in across the loading row, then starts again.' },
            { name: 'The cloud passes', text: 'A cloud’s shade passes over the loading row.' },
            { name: 'Leaves sway', text: 'The leaf shade over the loading row sways to and fro.' },
        ],
        open: [
            { name: 'Drawn in pencil', text: 'The menu is drawn in from the left, easing in and out, and erased the same way to close.' },
            { name: 'Out of the shade', text: 'The menu rises from the shade below, slowing as it lands, and sinks back to close.' },
            { name: 'The light falls', text: 'A shaft of light sweeps the menu into place, and sweeps it away to close.' },
        ],
        tone: [
            {
                name: 'The pinned note',
                text: 'The destructive entry is marked along its left edge in its colour, as a note pinned to the card; the disabled reason sits on a paper chip.',
            },
            {
                name: 'The graphite warning',
                text: 'The destructive entry’s label sits over a darker pencil smudge; the disabled reason reads lighter.',
            },
            { name: 'The shaded band', text: 'A soft shaded band crosses the destructive entry; the disabled reason carries a lighter shadow.' },
        ],
        interact: [
            { name: 'A breeze', text: 'A hovered or focused entry dips once and comes back, easing in and out; a press settles it still.' },
            { name: 'Pencilled again', text: 'A hovered or focused entry’s underline is traced again lightly; a press deepens the trace.' },
            { name: 'The shade lifts', text: 'A hovered or focused entry’s shade lifts a touch; a press darkens it back for a moment.' },
        ],
    },
    'shade-dark': {
        shape: [
            { name: 'Silverpoint', text: 'A silver hairline runs above the headings over dark paper, entries in a faint silver wash.' },
            { name: 'The reading lamp', text: 'A warm pool of light sits behind the headings, entries in warm ink.' },
            { name: 'The night window', text: 'A shaft of moonlight falls across the plate, entries in a cool silver ink with a faint glow.' },
        ],
        loading: [
            { name: 'The silver hatches', text: 'Silver hatching sweeps in across the loading row, then starts again.' },
            { name: 'The lamp swells', text: 'A pool of lamplight on the loading row swells and settles.' },
            { name: 'The candle flickers', text: 'A small candle flame flickers in the corner of the loading row.' },
        ],
        open: [
            { name: 'Silverpoint drawn', text: 'The menu is drawn in from the left in silver, easing in and out, and erased the same way to close.' },
            { name: 'The lamp is lit', text: 'The menu opens from its middle like a lamp catching, slowing as it lands, and dims shut to close.' },
            { name: 'Moonrise', text: 'The menu rises softly into the moonlight, slowing as it lands, and sets back down to close.' },
        ],
        tone: [
            {
                name: 'The red lamp',
                text: 'A band of colour lights over the destructive entry, a lamp lit over the card; the disabled reason sits under a soft chip.',
            },
            {
                name: 'The silver warning',
                text: 'A silver-edged rule in the destructive colour runs under that entry; the disabled reason reads in a dimmer silver.',
            },
            { name: 'The night flare', text: 'The destructive entry flares once with colour in the dark; the disabled reason carries a faint glow.' },
        ],
        interact: [
            { name: 'A glint', text: 'A hovered or focused entry flares with light once, slowing as it lands; a press holds the glint steady.' },
            { name: 'The lamp brightens', text: 'A hovered or focused entry’s pool of light brightens; a press dims it back for a moment.' },
            { name: 'The silver traces', text: 'A hovered or focused entry’s underline traces in silver; a press deepens the trace for the press.' },
        ],
    },
    retro: {
        shape: [
            {
                name: 'The 1995 dialog',
                text: 'A raised grey bevel frames the plate, headings in the system face without capitals, a sunken rule between groups.',
            },
            { name: 'The performance monitor', text: 'A black well with a green grid behind the groups, entries in the phosphor mono.' },
            {
                name: 'The Notepad window',
                text: 'A 1px black frame with a hard drop shadow, headings in the system face, a plain rule between groups.',
            },
        ],
        loading: [
            { name: 'The progress blocks', text: 'Blue progress blocks fill the loading row block by block, then start over.' },
            { name: 'The marquee bar', text: 'A group of three blue blocks slides across the loading row and comes round again.' },
            { name: 'The defragmenter', text: 'Blocks of colour shift through the loading row in hard steps, as a defragmenter’s map.' },
        ],
        open: [
            { name: 'Painted', text: 'The menu is drawn in from the left in six hard steps, and erased the same six steps to close.' },
            { name: 'Dragged in', text: 'The menu drops into place from above in two hard steps, and drags back up in two steps to close.' },
            { name: 'Switched', text: 'The menu’s bevel pops out in one hard step to open, and pops back in to close.' },
        ],
        tone: [
            {
                name: 'The message box',
                text: 'The destructive entry is framed in its colour like a message box asking for attention; the disabled reason sits in a sunken field.',
            },
            {
                name: 'The flat field',
                text: 'The destructive entry sits in a flat square field with a 1px rule; the disabled reason reads plainly below.',
            },
            {
                name: 'The error beep',
                text: 'The destructive entry’s plate flashes once on open, as an error beep; the disabled reason reads under a dotted rule.',
            },
        ],
        interact: [
            {
                name: 'The bevel presses',
                text: 'A hovered or focused entry’s bevel raises; a press sinks the bevel in for the duration of the press.',
            },
            { name: 'Repainted', text: 'A hovered or focused entry flashes in the ink for a moment, in hard jumps; a press holds the flash.' },
            {
                name: 'The highlight bar',
                text: 'A hovered or focused entry gets the system’s blue highlight bar; a press darkens the bar by one shade.',
            },
        ],
    },
    grotesk: {
        shape: [
            {
                name: 'The transit board',
                text: 'A thick bar in the series colour runs along the plate’s top, headings in bold grotesque, a flat rule between groups.',
            },
            { name: 'The Swiss poster', text: 'Headings huge and flush left, a hairline between groups, entries tight and plain.' },
            { name: 'The index card', text: 'A red rule runs down the plate’s left margin, a hairline along the top, entries large and tight.' },
        ],
        loading: [
            { name: 'The line runs', text: 'A line runs across the loading row, then starts again.' },
            { name: 'Three blocks cut in', text: 'Three blocks cut into the loading row in turn.' },
            { name: 'The flap board', text: 'Three bars flip over one after the other, as a departure board’s flaps.' },
        ],
        open: [
            { name: 'Set in type', text: 'The menu is drawn in from the left, easing in and out, and erased the same way to close.' },
            {
                name: 'The board flips',
                text: 'The menu rises from the bottom in three hard steps like flap-board tiles, and flips back down to close.',
            },
            { name: 'Snapped in', text: 'The menu snaps into place in one hard step, and snaps back out in one step to close.' },
        ],
        tone: [
            {
                name: 'The index colour',
                text: 'The destructive entry prints on the poster’s index colour; the disabled reason reads under a heavy rule.',
            },
            {
                name: 'The underlined figure',
                text: 'The destructive entry’s label sits under a heavy rule in its colour; the disabled reason reads plain and small.',
            },
            {
                name: 'The red margin',
                text: 'The destructive entry’s margin rule turns to its colour; the disabled reason reads in a lighter weight.',
            },
        ],
        interact: [
            { name: 'Flipped', text: 'A hovered or focused entry flips a few degrees like a departure-board tile; a press holds the flip.' },
            { name: 'The bar runs', text: 'A hovered or focused entry’s top bar runs the entry’s width; a press pulls the bar back and in.' },
            { name: 'Shifted', text: 'A hovered or focused entry shifts a hair toward the margin rule; a press shifts it back flush.' },
        ],
    },
    lapis: {
        shape: [
            { name: 'The girih tile', text: 'A faint star lattice runs behind the plate, a double gold frame, headings in the display face.' },
            { name: 'Lapis on vellum', text: 'Entries in lapis ink on an ivory plate, a gold rim around it, headings in serif italic.' },
            {
                name: 'The manuscript margin',
                text: 'A double gold rule runs down the plate’s left margin, headings in serif italic, a gold rule under each group.',
            },
        ],
        loading: [
            { name: 'The glint runs the frame', text: 'A glint runs the loading row’s frame, then starts again.' },
            { name: 'The gold leaf is laid', text: 'A band of gold leaf is laid along the loading row, left to right, and laid again.' },
            { name: 'The star turns', text: 'An eight-point star of gold rays turns slowly behind the loading row.' },
        ],
        open: [
            {
                name: 'Illuminated',
                text: 'The menu opens from its middle like an illuminated page, slowing as it lands, and closes back to its middle.',
            },
            { name: 'Inked', text: 'The menu is drawn in from the left in lapis ink, easing in and out, and drawn back out to close.' },
            { name: 'Unrolled', text: 'The menu unrolls from the top like a manuscript scroll, and rolls back up to close.' },
        ],
        tone: [
            {
                name: 'The rubric',
                text: 'The destructive entry is marked down the margin in its colour, as a rubric in red; the disabled reason sits on a gold-ruled plate.',
            },
            {
                name: 'The gold-ruled warning',
                text: 'The destructive entry sits inside a double gold ring; the disabled reason reads in a fainter ink.',
            },
            {
                name: 'The lapis mark',
                text: 'A lapis-dark mark runs under the destructive entry’s label; the disabled reason reads under a thin gold tick.',
            },
        ],
        interact: [
            { name: 'Gilded', text: 'A hovered or focused entry flares with light once, slowing as it lands; a press holds the gilt bright.' },
            { name: 'Inked again', text: 'A hovered or focused entry’s underline is traced again in lapis ink; a press deepens the trace.' },
            { name: 'The star glints', text: 'A hovered or focused entry’s gold rim glints once; a press holds the glint steady while pressed.' },
        ],
    },
    nostromo: {
        shape: [
            {
                name: 'The CRT trace',
                text: 'Scanlines run over the plate, headings and entries in mono capitals, a phosphor-green rule between groups.',
            },
            { name: 'The indicator panel', text: 'Headings on embossed label tape, entries in an embossed window look, a lit rule between groups.' },
            { name: 'The MU-TH-UR screen', text: 'Scanlines over the whole plate, entries ringed in green, everything in mono capitals.' },
        ],
        loading: [
            { name: 'The sweep runs', text: 'A sweep runs across the loading row like a CRT tube, then starts again.' },
            { name: 'The lamps scan', text: 'Indicator lamps on the loading row scan in sequence.' },
            { name: 'The motion tracker', text: 'A ring pings out from the middle of the loading row, as the motion tracker sweeps.' },
        ],
        open: [
            { name: 'Warmed up', text: 'The menu strikes on and off like a tube, then holds; it strikes off the same way to close.' },
            { name: 'Printed out', text: 'The menu is drawn in from the left in hard steps like a printout, and retracts the same steps to close.' },
            { name: 'Pinged', text: 'The menu rings open from the button like a tracker ping, and rings shut the same way to close.' },
        ],
        tone: [
            {
                name: 'The klaxon',
                text: 'The destructive entry is framed all round in its colour, as the bridge alarm frames the screen; the disabled reason reads behind scanlines.',
            },
            {
                name: 'The lit indicator lamp',
                text: 'The destructive entry sits behind a lit indicator lamp in its colour; the disabled reason reads in a dimmer mono.',
            },
            {
                name: 'The red ping',
                text: 'A red ping ring marks the destructive entry once on open; the disabled reason reads under a faint scanline.',
            },
        ],
        interact: [
            { name: 'A blip', text: 'A hovered or focused entry blips once like a tracker ping; a press holds the ring steady while pressed.' },
            {
                name: 'The scanline sweeps',
                text: 'A hovered or focused entry gets a scanline that sweeps across once; a press holds the sweep mid-way.',
            },
            {
                name: 'The lamp lights',
                text: 'A hovered or focused entry’s indicator lamp lights; a press dims it for a moment, as a switch thrown.',
            },
        ],
    },
    titanium: {
        shape: [
            {
                name: 'The milled plate',
                text: 'A brushed-grain plate ringed in an anodised edge, headings in small capitals, entries in instrument mono.',
            },
            {
                name: 'The instrument dial',
                text: 'A recessed panel with an inner shadow above groups, a knurled band along the top, entries in instrument mono.',
            },
            {
                name: 'The anodised badge',
                text: 'A rounded plate with a primary rim and a diagonal sheen, headings in small capitals, a machined rule between groups.',
            },
        ],
        loading: [
            { name: 'The cutter runs', text: 'The cutter runs along the loading row’s edge, then starts again.' },
            { name: 'The knurl rolls', text: 'The knurl on the loading row rolls, looping.' },
            { name: 'The lathe turns', text: 'Knurled ridges run along the loading row, as a part turning on a lathe.' },
        ],
        open: [
            { name: 'Milled', text: 'The menu is drawn in from the left, easing in and out, and milled back out the same way to close.' },
            { name: 'Seated', text: 'The menu drops into place from above, overshooting once, and lifts back off to close.' },
            { name: 'Torqued open', text: 'The menu twists open a few degrees like a machined latch, and twists shut the same way to close.' },
        ],
        tone: [
            {
                name: 'The anodised tag',
                text: 'A band of the destructive colour runs across the top of that entry, an anodised tag; the disabled reason sits on a machined tab.',
            },
            {
                name: 'The machined tab',
                text: 'The destructive entry sits on a machined tab with a square corner; the disabled reason reads in a dimmer mono.',
            },
            {
                name: 'The torque warning',
                text: 'A knurled ring in the destructive colour marks that entry; the disabled reason reads under a faint bevel.',
            },
        ],
        interact: [
            {
                name: 'A click of the dial',
                text: 'A hovered or focused entry jolts once, as a dial clicking a notch; a press holds the notch while pressed.',
            },
            { name: 'A glint', text: 'A hovered or focused entry flares with light once, slowing as it lands; a press holds the glint steady.' },
            {
                name: 'The knurl catches',
                text: 'A hovered or focused entry’s edge catches a knurled highlight; a press deepens the highlight for the press.',
            },
        ],
    },
};

/* ------------------------------------------------- the review kit's text */

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
/**
 * Round 1's verdicts (Kenny, 2026-10-06 12:59), in the order of ASPECTS:
 * shape, loading, open, tone, interact. A number is settled and not asked
 * again; '' is open in round 2: the loading picture in dark, cyberpunk,
 * terminal, forest, brutalism, grotesk, nostromo and titanium (six options),
 * every aspect in cyberpunk ("if you make suggestions, they should be in
 * line with what we already have for other elements of a certain theme"),
 * retro's hover, focus and press, and phantom's (its menu did not sit at
 * its More tile; the picks stand, the aspect is asked again once fixed).
 * Round 2's verdicts (Kenny, 2026-10-06 20:54) settle the loading pictures
 * and phantom's and cyberpunk's hover; round 3 asks again cyberpunk's shape,
 * loading (six), open/close and tone ("none of these is cyberpunk") and
 * retro's hover, focus and press ("none is readable … I want the wow").
 * @type {Record<string, string[]>}
 */
const PICKED = {
    formal: ['1', '1', '1', '1', '1'],
    light: ['1', '2', '3', '1', '1'],
    dark: ['2', '3', '3', '3', '1'],
    synthwave: ['2', '1', '3', '1', '1'],
    pastel: ['1', '2', '3', '2', '2'],
    terminal: ['1', '4', '1', '1', '1'],
    forest: ['2', '5', '3', '1', '1'],
    'high-contrast': ['1', '1', '1', '1', '1'],
    sepia: ['2', '3', '2', '1', '2'],
    blueprint: ['1', '1', '1', '3', '2'],
    solstice: ['2', '2', '2', '1', '1'],
    brutalism: ['2', '5', '1', '1', '1'],
    deco: ['1', '1', '3', '1', '1'],
    phantom: ['2', '3', '2', '1', '3'],
    'shade-light': ['1', '3', '1', '1', '1'],
    'shade-dark': ['3', '3', '3', '1', '1'],
    retro: ['1', '1', '1', '1', ''],
    grotesk: ['1', '2', '1', '1', '2'],
    lapis: ['2', '2', '3', '2', '3'],
    nostromo: ['1', '2', '3', '1', '2'],
    titanium: ['3', '1', '2', '1', '3'],
    cyberpunk: ['', '', '', '', '3'],
};
const keptOf = (/** @type {string} */ t, /** @type {Aspect} */ id) => PICKED[t]?.[ASPECTS.findIndex((a) => a.id === id)] ?? '';
// Round 2's new options replace an open aspect's; each carries its own key,
// the attribute value its CSS answers to (round 1's are keyed 1, 2, 3).
for (const file of [R2A, R2B, R2C, R2D, R3A, R3B])
    for (const [t, aspects] of Object.entries(file))
        for (const [id, options] of Object.entries(aspects)) if (options.length >= 3) IDEAS[t][id] = options;
const keyOf = (/** @type {string} */ t, /** @type {Aspect} */ id, /** @type {string} */ n) => IDEAS[t]?.[id]?.[Number(n) - 1]?.key ?? n;
const MOST = 6;

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="menu"]'));

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
        ? `Round 2: new options for ${open.map(({ id, label }) => `${label.toLowerCase()} (${IDEAS[theme][id].length})`).join(', ')}; everything else is settled as you picked it. Open and close the menu, press Loading, and try the speed at full and at ¼.`
        : 'Approved: every aspect is settled as you picked it.';
    look.append(p);
}

/* ------------------------------------------------ the fixed menu content */

/** @type {import('../../js/menu-button.js').MenuGroup[]} */
const GROUPS = [
    {
        group: 'Run',
        items: [
            { label: 'Restart the pumps', hint: 'Stop and start both pumps, one after the other.', value: 'restart' },
            { label: 'Switch to the spare pump', hint: 'Run on pump 2 while pump 1 rests.', value: 'spare' },
            { label: 'Run a pressure test', hint: 'Raises the pressure for two minutes.', disabled: 'Needs both pumps running', value: 'test' },
        ],
    },
    {
        group: 'Manage',
        items: [
            { label: 'Rename this pump house', hint: 'Shown on every dashboard and report.', value: 'rename' },
            { label: 'Remove this pump house', hint: 'Stops its monitoring for good.', danger: true, value: 'remove' },
        ],
    },
];

/* ------------------------------------------------ the rows of options */

const SLOT = `<div class="kp-menu-button" data-kp-menu-button data-mb-slot>
    <button type="button" class="kp-button">More ▾</button>
    <div class="kp-menu kp-menu--rich" role="menu" aria-label="Every other action" hidden></div>
</div>`;
const rows = /** @type {HTMLElement} */ (section.querySelector('[data-mb-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'mb-aspect';
    box.setAttribute('data-mb-aspect', id);
    box.setAttribute('aria-labelledby', `h-mb-${id}`);
    const head = document.createElement('div');
    head.className = 'mb-aspect__head';
    head.innerHTML = '<h3></h3><p></p>';
    /** @type {HTMLElement} */ (head.firstElementChild).id = `h-mb-${id}`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'mb-trio';
    for (let at = 1; at <= MOST; at++) {
        const cell = document.createElement('div');
        cell.className = 'mb-col';
        cell.setAttribute('data-mb-vary', id);
        cell.setAttribute('data-mb-option', String(at));
        cell.innerHTML =
            `<p class="mb-label"><span class="mb-label__no">${label} · ${at}</span> <span data-mb-name></span></p>` +
            `<p class="mb-desc" data-mb-desc></p><div class="mb-strip" data-mb>${SLOT}</div>`;
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
    const t = theme();
    const preview = section.querySelector('[data-mb-preview]');
    for (const { id } of ASPECTS) {
        const key = keyOf(t, id, now[id]);
        if (preview?.getAttribute(`data-mb-${id}`) !== key) preview?.setAttribute(`data-mb-${id}`, key);
    }
    // A settled aspect has no row; a row hides the cells its theme has no option for.
    for (const box of section.querySelectorAll('[data-mb-aspect]'))
        /** @type {HTMLElement} */ (box).hidden = Boolean(keptOf(t, /** @type {Aspect} */ (box.getAttribute('data-mb-aspect'))));
    for (const cell of section.querySelectorAll('[data-mb-vary]')) {
        const vary = cell.getAttribute('data-mb-vary');
        const option = cell.getAttribute('data-mb-option') ?? '1';
        /** @type {HTMLElement} */ (cell).hidden = !IDEAS[t]?.[/** @type {Aspect} */ (vary)]?.[Number(option) - 1];
        if (/** @type {HTMLElement} */ (cell).hidden) continue;
        const strip = cell.querySelector('[data-mb]');
        for (const { id } of ASPECTS) {
            const value = keyOf(t, id, id === vary ? option : now[id]);
            if (strip?.getAttribute(`data-mb-${id}`) !== value) strip?.setAttribute(`data-mb-${id}`, value);
        }
        cell.classList.toggle('mb-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
        const idea = IDEAS[theme()];
        if (idea) {
            /** @type {HTMLElement | null} */ (cell.querySelector('[data-mb-name]')).textContent =
                idea[/** @type {Aspect} */ (vary)][Number(option) - 1].name;
            /** @type {HTMLElement | null} */ (cell.querySelector('[data-mb-desc]')).textContent =
                idea[/** @type {Aspect} */ (vary)][Number(option) - 1].text;
        }
    }
    const words = section.querySelector('[data-mb-picks]');
    const idea = IDEAS[theme()];
    if (words && idea) words.textContent = ASPECTS.map(({ label, id }) => `${label}: ${idea[id][Number(now[id]) - 1].name}`).join(' · ');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* ------------------------------------------------------- wiring the menus */

for (const wrapper of /** @type {HTMLElement[]} */ ([...section.querySelectorAll(MENU_BUTTON)])) setMenu(wrapper, GROUPS);
attachMenuButtons(section);
section.addEventListener(MENU_SELECT_EVENT, (event) => {
    const log = /** @type {HTMLElement | null} */ (section.querySelector('[data-mb-log]'));
    const { value } = /** @type {CustomEvent<{ value: string }>} */ (event).detail;
    if (log) log.textContent = `Picked: ${value}. It goes nowhere here.`;
});

/** Every `.kp-menu` on the page, with its wrapper. */
const allWrappers = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll(MENU_BUTTON)]);

/** The one disabled entry a loading fill shows, toggled for every menu on the page at once. */
let loading = false;
function setLoadingAll(next) {
    loading = next;
    for (const wrapper of allWrappers()) setMenu(wrapper, next ? 'loading' : GROUPS);
}

/* --------------------------------------------- the animated open/close */

// js/menu-button.js hides the menu at once on close, with no leave of its
// own: the button here plays a CSS leave (data-mb-leaving) and only then
// calls the real closeMenu(), so the leave is seen before the menu vanishes.
// The arrival plays by itself: a CSS animation on `.kp-menu:not([hidden])`
// restarts whenever `hidden` is lifted, which is exactly what openMenu() does.
function openAll() {
    for (const wrapper of allWrappers()) openMenu(wrapper, { focus: 'none' });
}
function closeAll() {
    for (const wrapper of allWrappers()) {
        const menu = /** @type {HTMLElement | null} */ (wrapper.querySelector('.kp-menu'));
        if (!menu || menu.hidden) continue;
        if (reduced.matches) {
            closeMenu(wrapper);
            continue;
        }
        menu.setAttribute('data-mb-leaving', '');
        const style = getComputedStyle(menu);
        const ms = Math.max(0, parseFloat(style.animationDuration || '0') * 1000) || 260;
        const done = () => {
            menu.removeEventListener('animationend', done);
            menu.removeAttribute('data-mb-leaving');
            closeMenu(wrapper);
        };
        menu.addEventListener('animationend', done, { once: true });
        setTimeout(done, ms + 80);
    }
}

/* ------------------------------------------------------------ controls */

const controls = /** @type {HTMLElement} */ (section.querySelector('[data-review-controls]'));
controls.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement | null} */ (
        event.target instanceof Element ? event.target.closest('button[data-mb-action], button[data-mb-speed]') : null
    );
    if (!button) return;
    const action = button.dataset.mbAction;
    if (action === 'open') openAll();
    else if (action === 'close') closeAll();
    else if (action === 'loading' || action === 'filled') {
        // The package waits with a new fill while a menu is open, so the menus
        // shut at once, take the fill, and open again: Loading and Filled
        // always show the menu as it now reads (and the review dialog, which
        // presses them for the loading and other aspects, shows it at once).
        for (const wrapper of allWrappers()) closeMenu(wrapper);
        setLoadingAll(action === 'loading');
        requestAnimationFrame(() => openAll());
        for (const b of controls.querySelectorAll('[data-mb-action="loading"], [data-mb-action="filled"]'))
            b.setAttribute('aria-pressed', String(b === button));
    } else if (action === 'focus') {
        for (const wrapper of allWrappers()) {
            const items = /** @type {HTMLElement[]} */ ([...wrapper.querySelectorAll('[role="menuitem"]')]);
            items[1]?.setAttribute('data-mb-force-focus', '');
            items[1]?.focus();
        }
    }
    const speed = button.dataset.mbSpeed;
    if (speed) {
        document.documentElement.style.setProperty('--mb-speed', speed);
        for (const b of controls.querySelectorAll('[data-mb-speed]')) b.setAttribute('aria-pressed', String(b === button));
    }
});

// A programmatic focus() stays visually marked only while that element
// holds the focus; moving on (another click, Tab, Esc) drops the marker.
section.addEventListener(
    'focusout',
    (event) => {
        /** @type {HTMLElement | null} */ (event.target instanceof HTMLElement ? event.target : null)?.removeAttribute('data-mb-force-focus');
    },
    true,
);

/* ---------------------------------------------------------- motion flag */

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const setMotion = () => {
    const el = /** @type {HTMLElement | null} */ (document.querySelector('[data-mb-motion]'));
    if (el) el.hidden = !reduced.matches;
};
reduced.addEventListener('change', setMotion);
setMotion();

/* ----------------------------------------------------------- theme name */

const setThemeName = () => {
    const name = theme();
    for (const el of document.querySelectorAll('[data-mb-theme-name]')) el.textContent = LABEL[name] ?? name;
};
// A theme switch (the review dialog walks the themes) recomposes too: which
// rows are open, and every cell's options, depend on the theme.
new MutationObserver(() => {
    setThemeName();
    compose();
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
setThemeName();

compose();
