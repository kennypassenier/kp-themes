// research/character-header: the page header (`.kp-page-header`: a title and
// its one-sentence description on the left, secondary buttons, one primary
// and an overflow menu on the right; below 40rem it stacks, the primary full
// width and first). Phase 1 (Kenny, 2026-10-05 brief): every theme's header
// has three aspects, each picked on its own from three options, as the
// meter, the trend tile and the key figure do:
//
//   data-ph-shape="1|2|3"       the plate, the title, the description, the
//                                 buttons and the overflow button's own look
//   data-ph-menu="1|2|3"        how the overflow menu opens and closes; a
//                                 leave is the arrival in reverse, nothing
//                                 fades, and it always moves (still under
//                                 reduced motion)
//   data-ph-interactive="1|2|3" hover, focus-visible and :active on every
//                                 button in the header
//
// Every rule in header.css (and header-a..d.css, four empty groups) names
// one aspect only, so any combination composes. The markup is the
// package's own shape (`.kp-page-header` > `.kp-page-header__inner` >
// title/description, `.kp-page-header__actions`); js/* is not changed —
// this demo's own small script only opens and closes the menu and mirrors
// the controls, the way a page using the header would wire its own button.

import { THEMES } from '../../js/theme-registry.js';

/** @typedef {{ name: string, text: string }} Option */
/** @typedef {'shape' | 'menu' | 'interactive'} Aspect */

/** The three aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: 'The plate, the title, the description, the buttons and the overflow button. Compare them as they stand, at both widths.',
    },
    {
        id: 'menu',
        label: 'The overflow menu opens and closes',
        about: 'How More ▾ opens the menu, and how the menu leaves — always its arrival in reverse. Press Open, then Closed.',
    },
    {
        id: 'interactive',
        label: 'Hover, focus, press',
        about: 'Every button in the header under the pointer, the keyboard and a click. Move the pointer over a button, or tab to one.',
    },
];

/**
 * Per theme, three options for each aspect: the spec other helpers build
 * from. @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            {
                name: 'The letterhead',
                text: 'A letterhead plate: a thin double rule under the title, the title in the display serif’s capitals, the description in italic, the buttons as ruled plates, the overflow in small capitals.',
            },
            {
                name: 'The minute book',
                text: 'A boardroom minute page: a heavy rule above the title, the description in italic below it, the actions ruled off into their own strip on the right.',
            },
            {
                name: 'The engraved seal',
                text: 'An engraved card: the title in the display serif with a navy rule beneath it, a faint guilloche behind the actions, the overflow button a small engraved plate.',
            },
        ],
        menu: [
            {
                name: 'Unrolled',
                text: 'The menu unrolls down from the button like a scroll, slowing as it lands; it rolls back up the same way to close.',
            },
            {
                name: 'Ruled open',
                text: 'The menu is ruled open under its button: its frame rule start to end, then each entry in turn, 60 ms apart; it closes as that played backwards.',
            },
            {
                name: 'The ledger opens',
                text: 'The menu’s ruled lines are written in top to bottom as it opens; they are rubbed out bottom to top as it closes.',
            },
        ],
        interactive: [
            {
                name: 'Formal’s own button',
                text: 'A header’s button is formal’s own: a rule under its label on hover, the two-channel ring on focus, the rule doubled on a press.',
            },
            {
                name: 'The wax seal',
                text: 'On hover a button’s rule brightens, on focus a ring of dots appears round it, on press the plate dips as a seal presses in.',
            },
            {
                name: 'The stamp',
                text: 'Hovering a button lifts its rule a hair, focus draws a dashed box round it, pressing stamps the plate flat for the moment it is held.',
            },
        ],
    },
    light: {
        shape: [
            {
                name: 'The soft card',
                text: 'A white header of 0.5 rem on the small shadow, the title at 600, the actions as pills with a soft shadow.',
            },
            {
                name: 'Daylight',
                text: 'A pale sky wash behind the title, the actions as bright pill buttons with a gentle lift, the overflow a soft outline pill.',
            },
            {
                name: 'The paper sheet',
                text: 'A sheet of paper with a lifted corner at the top right, the title in indigo, the actions as flat paper tabs along the fold.',
            },
        ],
        menu: [
            {
                name: 'Out of the glare',
                text: 'The panel comes into focus where it hangs under its button, out of a blurred, too bright glare, 700 ms on a long settle; it goes back into the glare to close.',
            },
            { name: 'Floats down', text: 'The menu drifts down and settles with a soft bounce; it drifts back up the same way to close.' },
            {
                name: 'A cloud passes',
                text: 'The menu’s shadow grows as it drops into place; the shadow shrinks away the same way as it closes.',
            },
        ],
        interactive: [
            {
                name: 'The soft lift',
                text: 'A button lifts a little higher on hover, gets a soft outer ring on focus, and sinks back down on press.',
            },
            {
                name: 'Settles toward the paper',
                text: 'A button in the header is light’s own: it settles 2 px and its shadow tightens when pointed at, wears the two-channel ring when focused, and lands flat and flashes when pressed.',
            },
            { name: 'The gentle press', text: 'Hover brightens a button’s fill, focus draws a dashed halo, press dents the pill softly inward.' },
        ],
    },
    dark: {
        shape: [
            {
                name: 'The status board',
                text: 'A black operations panel: the title lit in ticker mono, a fine grid behind the description, the actions as lit square chips.',
            },
            {
                name: 'The machined panel',
                text: 'A machined black panel with a bevel: the title in mono capitals, the actions recessed with a lit lower lip.',
            },
            {
                name: 'The oscilloscope',
                text: 'A scope bezel: the title in mono with a green glow, the description dimmed, the actions as lit rim buttons.',
            },
        ],
        menu: [
            {
                name: 'Switched on',
                text: 'The menu strikes on like a tube, flickering once before it holds; it cuts off the same way in reverse to close.',
            },
            { name: 'Scanned open', text: 'A lit band sweeps down to reveal the menu; the band sweeps back up the same way to close it.' },
            {
                name: 'Panel slides',
                text: 'The menu panel slides down out of a slot with a mechanical snap; it slides back up the same way to close.',
            },
        ],
        interactive: [
            {
                name: 'The lit chip',
                text: 'Hover lights a button’s rim, focus adds a square glow ring, press dims the chip for the moment it is held.',
            },
            {
                name: 'The toggle switch',
                text: 'Hover brightens a button’s bevel, focus outlines it in a lit square, press clicks the panel flush like a toggle.',
            },
            {
                name: 'The alarm lamp',
                text: 'Hover warms a button’s glow, focus rings it in light, press flashes the chip once before settling dim.',
            },
        ],
    },
    cyberpunk: {
        shape: [
            {
                name: 'The neon trace',
                text: 'A black board with a circuit grid: the title in tech mono with a cyan halo, cut corners, the actions as cut-corner chips.',
            },
            {
                name: 'The glitch HUD',
                text: 'A netrunner HUD: yellow brackets frame the title, the description in a thin mono, hazard tape along the action row.',
            },
            {
                name: 'The holo plate',
                text: 'A holo plate: a yellow rim glowing inward, scan lines at 135 degrees, the 14 px notch cut at its dossier corner; the title in the condensed display capitals, the actions cyberpunk’s own notched buttons.',
            },
        ],
        menu: [
            {
                name: 'Jacked in',
                text: 'The menu snaps open in a hard jump with a glitch flicker; it glitches shut the same way in reverse to close.',
            },
            {
                name: 'The channel split',
                text: 'The panel is a yellow copy and a cyan copy until they meet: four ticks of 120 ms, 6, 4, 2, 1 px, the notch cut at every tick; it splits shut as the same four the other way round.',
            },
            { name: 'The HUD unfolds', text: 'Yellow brackets snap outward to frame the opening menu; they snap back inward the same way to close.' },
        ],
        interactive: [
            {
                name: 'Own buttons: split edge, brackets, closed circuit',
                text: 'The header’s buttons are cyberpunk’s own: hover doubles the edge (cyan along the head and the end, red along the foot, 5, 4, 3, then 2 px), focus closes four target brackets on the button, press lights the circuit grid at 60 %; nothing moves.',
            },
            {
                name: 'The RGB split',
                text: 'Hover splits a button’s edge into a brief colour fringe, focus rings it in cyan, press flattens the glow hard.',
            },
            {
                name: 'The hazard strike',
                text: 'Hover brightens the hazard tape, focus flashes a bracket round the button, press cuts the glow for an instant.',
            },
        ],
    },
    synthwave: {
        shape: [
            {
                name: 'The grid-floor horizon',
                text: 'A perspective grid floor under a pink horizon behind the title, the actions on glass chips, the overflow a VT323 tab.',
            },
            { name: 'The VCR display', text: 'A VCR OSD: scanlines over the header, the title in OSD numerals, the actions as inverse blocks.' },
            {
                name: 'The arcade marquee',
                text: 'An arcade marquee frame with a glow, the title in the display face with a pink drop, the actions as marquee buttons.',
            },
        ],
        menu: [
            {
                name: 'Over the horizon',
                text: 'The menu rises up over the horizon into place, slowing as it lands; it sinks back below in reverse to close.',
            },
            {
                name: 'Tape loads',
                text: 'The menu’s rows print in from the top in hard steps, like a tape loading; they clear the same way to close.',
            },
            { name: 'The sun rises', text: 'A striped sun swells behind the menu as it opens; it sinks away the same way as the menu closes.' },
        ],
        interactive: [
            {
                name: 'The glass charge',
                text: 'Hover lights a button’s glass chip, focus rings it with a glow, press dims the chip for the moment held.',
            },
            { name: 'The tracking jump', text: 'Hover rolls a tracking band over a button, focus rings it in neon, press jolts the chip once.' },
            {
                name: 'The laser flare',
                text: 'Hover flares a button’s edge with light, focus rings it in pink, press flattens the glow hard for an instant.',
            },
        ],
    },
    pastel: {
        shape: [
            {
                name: 'The sticker chart',
                text: 'A candy card with a flat sticker shadow, the title in the rounded face, the actions as flat-shadow stickers.',
            },
            {
                name: 'The washi planner',
                text: 'A dotted planner with a strip of washi tape across the top, the title in a doodled hand, the actions as taped tabs.',
            },
            {
                name: 'The cloud card',
                text: 'A soft cloud card with a dashed candy outline, a blob of colour behind the title, the actions as round candy buttons.',
            },
        ],
        menu: [
            { name: 'Popped', text: 'The menu pops open, overshooting once before it settles; it pops back shut the same way in reverse.' },
            { name: 'Unrolled tape', text: 'The menu’s tape unrolls down to reveal it; the tape rolls back up the same way to close it.' },
            { name: 'A happy hop', text: 'The menu hops down into place and settles with a wobble; it hops back up the same way to close.' },
        ],
        interactive: [
            {
                name: 'The sticker press',
                text: 'Hover lifts a button’s sticker shadow, focus rings it in a dashed candy line, press flattens the sticker for a moment.',
            },
            {
                name: 'The tape peel',
                text: 'Hover peels a button’s tape corner up a little, focus dashes a line round it, press presses the tape back down.',
            },
            {
                name: 'The candy bounce',
                text: 'Hover bounces a button up a touch, focus rings it softly, press squashes it down for the moment held.',
            },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'The top(1) row',
                text: 'A double box-drawing frame: the title in capitals, the description in dim mono, the actions in reverse-video blocks.',
            },
            {
                name: 'The dumb-terminal plot',
                text: 'gnuplot’s dumb terminal: the actions bracketed in rules, the title in bold mono, no colour beyond the phosphor.',
            },
            {
                name: 'The curses window',
                text: 'A single-line curses box: the title ruled off, the actions boxed in a fainter rule, square and plain.',
            },
        ],
        menu: [
            {
                name: 'Printed',
                text: 'The menu prints in from the top line by line, the caret blinking after each; it erases the same way, bottom up, to close.',
            },
            {
                name: 'Paged in',
                text: 'The menu drops into place from above in hard steps, like a page scrolling; it scrolls back up the same way to close.',
            },
            { name: 'The hash bar fills', text: 'A row of # blocks fills in to reveal the menu; the blocks clear the same way to close it.' },
        ],
        interactive: [
            {
                name: 'Reverse video',
                text: 'Hover shows a button in reverse video, focus dashes a box round it, press holds the reverse for the moment held.',
            },
            { name: 'The block caret', text: 'Hover blinks a caret beside a button, focus underlines it, press flashes it in reverse once.' },
            { name: 'The bell', text: 'Hover underlines a button, focus boxes it dashed, press flashes it in reverse, as a terminal bell line.' },
        ],
    },
    forest: {
        shape: [
            {
                name: 'The ranger’s logbook',
                text: 'A logbook on kraft paper: contour rings behind the title, the actions on wooden tags, the description in serif italic.',
            },
            { name: 'The canopy', text: 'Looking up into a canopy: a leaf-green wash behind the title, the actions on leaf tags.' },
            {
                name: 'The herbarium sheet',
                text: 'A pressed-leaf sheet: leaf veins behind the title, the actions as pinned specimen tags, moss-green ink.',
            },
        ],
        menu: [
            {
                name: 'Grows',
                text: 'The menu grows down from the button like a shoot unfurling, slowing as it lands; it withdraws the same way in reverse to close.',
            },
            {
                name: 'The trail is walked',
                text: 'The menu’s rows are walked in one by one, left to right then down; they are walked back the same way to close.',
            },
            {
                name: 'A branch grows',
                text: 'The menu grows down out of its button, far end first, clipped at the button’s line, 1000 ms on the growth curve; closing is that growth reversed.',
            },
        ],
        interactive: [
            {
                name: 'The wooden tag',
                text: 'Hover lifts a button’s wooden tag a hair, focus rings it in bark, press presses the tag flat for a moment.',
            },
            { name: 'A branch dips', text: 'Hover dips a button once like a branch, focus outlines it in moss, press settles it down.' },
            {
                name: 'The trail blaze',
                text: 'The header’s buttons are forest’s own: hover lays the dashed blaze ring, focus is the two-channel ring, press closes the blaze in.',
            },
        ],
    },
    'high-contrast': {
        shape: [
            {
                name: 'Ink and frame',
                text: 'Everything framed in a 2px rule: the title bold, the description plain, the actions as framed plates. Still: nothing moves.',
            },
            {
                name: 'The inverse plate',
                text: 'An ink plate with the title in the paper colour, the actions framed heavy. Still: nothing moves.',
            },
            {
                name: 'The signal board',
                text: 'A road-signal frame, heavy and square: the title very large, the actions in thick frames. Still: nothing moves.',
            },
        ],
        menu: [
            { name: 'Switched', text: 'The menu appears in one hard step, no ease; it disappears the same way in reverse to close.' },
            {
                name: 'The striped block',
                text: 'A striped ink-and-paper block steps once to reveal the menu; it steps back the same way to close it.',
            },
            { name: 'Dropped', text: 'The menu drops into place in one hard step from above; it jumps back up the same way to close.' },
        ],
        interactive: [
            {
                name: 'The heavy frame',
                text: 'Hover thickens a button’s frame, focus adds a second frame outside it, press inverts the plate for the moment held.',
            },
            {
                name: 'The signal plate',
                text: 'Hover inverts a button’s ink and paper, focus frames it heavy, press holds the invert while pressed.',
            },
            {
                name: 'The switched plate',
                text: 'Hover thickens a button’s rule, focus boxes it twice, press flips it to the inverse plate for a moment.',
            },
        ],
    },
    sepia: {
        shape: [
            {
                name: 'The barograph',
                text: 'Ruled chart paper behind the title, an aged vignette, the actions as printed-border buttons in sepia ink.',
            },
            { name: 'Letterpress', text: 'A letterpress card: the title pressed into the sheet, the actions as printed borders, speckled paper.' },
            {
                name: 'The ticket stub',
                text: 'A printed stub with notches punched in both sides, a dashed tear line, the title in the display serif.',
            },
        ],
        menu: [
            {
                name: 'The nib writes',
                text: 'The menu is written in from the top at an even pace, as a nib moving down the page; it is written out the same way in reverse to close.',
            },
            {
                name: 'Pressed',
                text: 'The menu drops into place from above, slowing as it lands, as if pressed into the sheet; it lifts back up the same way to close.',
            },
            {
                name: 'The drum turns',
                text: 'The menu’s rows turn into view like a barograph drum advancing; they turn back out of view the same way to close.',
            },
        ],
        interactive: [
            {
                name: 'The ink spreads',
                text: 'Hover spreads a little ink into a button’s border, focus rings it, press presses the border into the sheet for a moment.',
            },
            {
                name: 'The rubber stamp',
                text: 'Hover darkens a button’s border, focus dashes a ring round it, press stamps it flat for the moment held.',
            },
            { name: 'The nib lifts', text: 'Hover lifts a button’s rule a hair in ink, focus underlines it, press presses the ink down again.' },
        ],
    },
    blueprint: {
        shape: [
            { name: 'The chart recorder', text: 'A millimetre grid behind the title, the actions in white-ink boxes, mono capitals throughout.' },
            { name: 'The title block', text: 'A drawing’s title block: the header parted into ruled cells, the actions with dimension ticks.' },
            {
                name: 'The section view',
                text: 'The header stands on the graticule’s two axes, a ruler along its start edge and its foot, no hatch and no closed frame; the title upright in the sans, the actions plain buttons.',
            },
        ],
        menu: [
            {
                name: 'Drafted',
                text: 'The menu is drawn: the pen traces the panel’s outline from its corner, along the top, down the end, back along the foot and up the start, then the panel is inked; closing is that played backwards; 5 units (800 ms).',
            },
            {
                name: 'Plotted',
                text: 'The menu’s rows plot in from the top in hard steps; they plot out the same way, top to bottom, to close.',
            },
            {
                name: 'The dimension line extends',
                text: 'A dimension line with its ticks extends down to reveal the menu; it retracts the same way to close it.',
            },
        ],
        interactive: [
            {
                name: 'The pen lifts',
                text: 'Hover lifts a button’s white-ink rule a hair, focus dashes a box round it, press presses the rule flat for a moment.',
            },
            {
                name: 'The revision cloud',
                text: 'Hover rings a button lightly, focus boxes it in a revision cloud, press flattens the frame for the moment held.',
            },
            {
                name: 'The chain line',
                text: 'The actions are blueprint’s own buttons: on hover two amber witness lines and a ruler with a pointer at each end, on focus the two-channel ring with the witness lines, on a press the dimension below the button; nothing lifts, thickens or recolours.',
            },
        ],
    },
    solstice: {
        shape: [
            { name: 'The low sun', text: 'A warm glow rising from the foot of the header behind the title, the actions on glowing chips.' },
            { name: 'The embers', text: 'Embers on charcoal: the title with a hot halo, the actions as warm glowing tabs.' },
            {
                name: 'The horizon',
                text: 'A warm band of light along the foot of the header, the title in the display face, the actions in the low sun’s colour.',
            },
        ],
        menu: [
            {
                name: 'Dawn',
                text: 'The menu rises up from the horizon into place, slowing as it lands; it sets back below the horizon in reverse to close.',
            },
            {
                name: 'Kindled',
                text: 'The menu’s rows are lit in from the top, one after another, like embers catching; they dim out the same way, top first, to close.',
            },
            { name: 'The sun crosses', text: 'A low glow sweeps down to reveal the menu; it sweeps back up the same way to close it.' },
        ],
        interactive: [
            { name: 'The glowing chip', text: 'Hover warms a button’s chip, focus rings it with a glow, press dims the chip for the moment held.' },
            { name: 'A flare of sun', text: 'Hover flares a button’s edge with warm light, focus rings it, press settles the flare for a moment.' },
            { name: 'The red sky', text: 'Hover warms the sky band above a button, focus rings it, press lets the warmth sink for the moment held.' },
        ],
    },
    brutalism: {
        shape: [
            {
                name: 'The slab',
                text: 'A heavy black frame with a hard offset shadow, the title in heavy capitals, the actions brutalism’s own buttons: a 3px line on a 6px hard shadow.',
            },
            { name: 'The sticker sheet', text: 'A lavender sheet: the title huge and heavy, the actions as askew stickers in a black outline.' },
            {
                name: 'The poster block',
                text: 'A 3px frame with a hard offset shadow in the accent, the title huge in capitals, the actions as poster blocks.',
            },
        ],
        menu: [
            {
                name: 'Dropped onto its footprint',
                text: 'The menu is dropped onto its footprint from up-left, 300 ms on the fall curve, no clip, no steps; closing is that drop played backwards.',
            },
            { name: 'The drop', text: 'The menu drops onto the page and lands hard with a jolt; it is yanked back up the same way to close.' },
            {
                name: 'The hammer',
                text: 'The menu’s rows are hammered into place one by one, top to bottom; they are knocked out the same way to close.',
            },
        ],
        interactive: [
            {
                name: 'Inverted',
                text: 'Hover inverts a button, ink and plate swapped, nothing moves; focus lifts it under the two-channel ring; press drives the block onto its footprint for the moment held.',
            },
            {
                name: 'Shoved',
                text: 'Hover shoves a button’s block sideways a touch, focus thickens its outline, press flattens the shadow for a moment.',
            },
            {
                name: 'Stamped',
                text: 'Hover thickens a button’s frame, focus doubles the outline, press stamps the block down hard for the moment held.',
            },
        ],
    },
    deco: {
        shape: [
            { name: 'The gilt frame', text: 'A double gold rule, a faint sunburst rising behind the title, the actions on gold-framed plaques.' },
            {
                name: 'The marquee',
                text: 'A theatre marquee: a row of bulbs along the header, the title in display capitals, the actions as marquee plaques.',
            },
            { name: 'The skyscraper', text: 'Fine gold setback lines rising behind the title, a gold bar along the top, the actions in gold.' },
        ],
        menu: [
            {
                name: 'The curtain rises',
                text: 'The menu rises from the baseline into place, slowing as it lands, like a curtain; it falls back down the same way in reverse to close.',
            },
            {
                name: 'The marquee lights',
                text: 'The menu’s rows light in from the top in hard steps, bulb by bulb; they dim out the same way, top first, to close.',
            },
            {
                name: 'The sunburst opens',
                text: 'A gold sunburst opens ray by ray to reveal the menu; it closes ray by ray the same way to hide it.',
            },
        ],
        interactive: [
            {
                name: 'The bulbs chase',
                text: 'Hover chases a light round a button’s rim, focus rings it in gold, press dims the glow for the moment held.',
            },
            { name: 'Gilded', text: 'Hover gilds a button’s edge with a flare of light, focus rings it, press settles the flare for a moment.' },
            {
                name: 'The glint runs',
                text: 'Hover runs a glint across a button, focus rings it in gold, press holds the glint still while pressed.',
            },
        ],
    },
    phantom: {
        shape: [
            { name: 'The evidence card', text: 'A white evidence card: the title slanted, the actions as stamped rings set askew.' },
            {
                name: 'The calling card',
                text: 'A black calling card under a halftone: the title skewed in display capitals, a red slash across the corner, the actions in the card’s ink.',
            },
            { name: 'The ransom note', text: 'A halftone over the header, the title skewed, a red offset shadow on the actions.' },
        ],
        menu: [
            {
                name: 'The card is thrown',
                text: 'The menu jumps into place sideways in a hard jump, as a card thrown down; it jumps back the same way in reverse to close.',
            },
            {
                name: 'Slashed in',
                text: 'The menu is drawn in backwards from the bottom, easing in and out, like a slash across the card; it is drawn out the same way to close.',
            },
            { name: 'Stamped askew', text: 'The menu’s halftone shuffles into place as it opens; it shuffles out of place the same way to close.' },
        ],
        interactive: [
            {
                name: 'The stamp ring',
                text: 'Hover stamps a faint ring round a button, focus skews it a touch, press presses the stamp flat for the moment held.',
            },
            { name: 'The red slash', text: 'Hover slashes a button’s corner in red, focus skews the slash, press holds it flat while pressed.' },
            {
                name: 'The string is pulled',
                text: 'Hover pulls a red thread taut across a button, focus skews the button, press plucks the thread once.',
            },
        ],
    },
    grotesk: {
        shape: [
            {
                name: 'The transit board',
                text: 'A column under its rule: a heavy ink rule along the top, the title in bold grotesque, the actions grotesk’s own buttons.',
            },
            { name: 'The Swiss poster', text: 'The title huge and flush left, a hairline under it, the actions in the red index colour.' },
            { name: 'The index card', text: 'A red rule down the left margin, a hairline along the top, the actions in tight flat plates.' },
        ],
        menu: [
            {
                name: 'Printed',
                text: 'The menu is printed in black and its red plate falls into register on it along the closing spiral, clockwise, in 8 units; the same fall played backwards closes it.',
            },
            {
                name: 'The board flips',
                text: 'The menu’s rows flip into place one after another, top to bottom, like departure-board flaps; they flip back the same way to close.',
            },
            { name: 'The flap board', text: 'Bars flip over one after the other to reveal the menu; they flip back the other way to close.' },
        ],
        interactive: [
            {
                name: 'The button’s own',
                text: 'A header button is grotesk’s own button: hover draws a red bar on its foot, focus is the two-channel ring with the red plate falling into register, a press thickens the baseline on the paper face, never grey.',
            },
            { name: 'The index colour', text: 'Hover brightens a button’s index colour, focus rings it, press settles the colour for a moment.' },
            { name: 'The flat bar', text: 'Hover extends a button’s colour bar, focus boxes it, press flattens the bar for the moment held.' },
        ],
    },
    nostromo: {
        shape: [
            {
                name: 'The CRT trace',
                text: 'The header is beige case, raised and clean (scanlines and glow are the screen’s), the title in Michroma, the actions nostromo’s own buttons with their lamps.',
            },
            { name: 'The indicator panel', text: 'The title on embossed label tape, the actions as lit indicator lamps on an embossed panel.' },
            { name: 'The MU-TH-UR screen', text: 'Scanlines over the whole header, the title in mono capitals, the actions ringed in green.' },
        ],
        menu: [
            {
                name: 'Drawn by the raster',
                text: 'The raster writes the menu from its top edge down, a quarter per 80 ms frame, a bright beam at the edge of what is written (320 ms); closing is that draw backwards, the beam climbing.',
            },
            {
                name: 'Printed out',
                text: 'The menu’s rows print in from the top in hard steps, like a teleprinter; they print out the same way to close.',
            },
            {
                name: 'The motion tracker',
                text: 'A ring pings outward to reveal the menu, as the motion tracker sweeps; it pings inward the same way to close it.',
            },
        ],
        interactive: [
            {
                name: 'The lit lamp',
                text: 'Hover lights a button’s indicator lamp, focus rings it in green, press dims the lamp for the moment held.',
            },
            {
                name: 'Nostromo’s own button',
                text: 'The actions hover, focus and press exactly as nostromo’s button: the lamp lights in ink under the pointer, focus is the two-channel ring with the lamp lit orange, a press turns the raised key into a well.',
            },
            { name: 'The sweep', text: 'Hover sweeps a faint light across a button, focus rings it, press stills the sweep while pressed.' },
        ],
    },
    titanium: {
        shape: [
            {
                name: 'The milled plate',
                text: 'A brushed-titanium header: a milled grain on the plate, the title in small capitals, the actions on anodised chips.',
            },
            {
                name: 'The instrument dial',
                text: 'A knurled band along the top of the header, the title in instrument mono, the actions as machined tabs.',
            },
            {
                name: 'The anodised badge',
                text: 'A wide rounded header with a primary-coloured rim and a diagonal sheen, the actions as rounded chips.',
            },
        ],
        menu: [
            {
                name: 'Milled',
                text: 'The menu is drawn in from the top, easing in and out, as if milled into place; it is milled back out the same way in reverse to close.',
            },
            {
                name: 'Seated',
                text: 'The menu drops into place from above, overshooting once before it seats; it lifts back up, overshooting once, in reverse to close.',
            },
            {
                name: 'The lathe',
                text: 'Knurled ridges turn into view to reveal the menu, as a part turning on a lathe; they turn back the same way to close it.',
            },
        ],
        interactive: [
            {
                name: 'The machined tab',
                text: 'Hover brightens a button’s anodised sheen, focus rings it, press presses the tab flat for the moment held.',
            },
            { name: 'A click of the dial', text: 'Hover turns a button’s knurl a hair, focus rings it, press clicks the dial once.' },
            { name: 'A glint', text: 'Hover flares a button’s edge with a glint of light, focus rings it, press settles the glint for a moment.' },
        ],
    },
};

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="header"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// three choices per theme, each option's name and what it does as its hint.
// Nothing is ticked for the reviewer.
const hints = (/** @type {Aspect} */ aspect, /** @type {number} */ at) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, idea]) => [theme, `${idea[aspect][at].name}. ${idea[aspect][at].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map(({ id, label }) => ({
            id,
            label,
            options: [0, 1, 2].map((at) => ({ value: String(at + 1), label: String(at + 1), hints: hints(id, at) })),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const [theme, idea] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    p.textContent =
        `Three picks, each on its own: shape, the overflow menu’s open and close, and hover/focus/press (${idea.shape[0].name.replace(/^The /, 'the ')}, ` +
        `${idea.menu[0].name.toLowerCase()}, ${idea.interactive[0].name.toLowerCase()} are option 1). ` +
        'Each row changes one thing only; the preview at the top shows what you ticked so far. ' +
        'Open and close the menu, and try the narrow width; the header keeps its layout in every state.';
    look.append(p);
}

/* ------------------------------------------------------ the header's markup */

const MENU_ID = () => `ph-menu-${Math.random().toString(36).slice(2)}`;

/** One header, the package's own shape, used for the preview, every option cell and the plain reference. */
function buildHeader() {
    const panelId = MENU_ID();
    const el = document.createElement('header');
    el.className = 'kp-page-header';
    el.innerHTML = `
        <div class="kp-page-header__inner">
            <div>
                <h3 class="kp-page-header__title">Pump houses</h3>
                <p class="kp-page-header__description">
                    Fifteen pump houses on the northern network: their state, the last reading of each, and what needs a visit.
                </p>
            </div>
            <div class="kp-page-header__actions">
                <button type="button" class="kp-button">Export readings</button>
                <button type="button" class="kp-button">Schedule a visit</button>
                <button type="button" class="kp-button kp-button--primary">Add a pump house</button>
                <button type="button" class="kp-button" data-ph-more aria-haspopup="menu" aria-expanded="false" aria-controls="${panelId}">More ▾</button>
                <div class="kp-popover" id="${panelId}" data-ph-panel role="menu" hidden>
                    <ul class="kp-menu" role="none">
                        <li role="none"><button type="button" role="menuitem" class="kp-menu__item" data-ph-item>Import from a file…</button></li>
                        <li role="none"><button type="button" role="menuitem" class="kp-menu__item" data-ph-item>Print the overview</button></li>
                        <li role="separator" class="kp-menu__separator"></li>
                        <li role="none">
                            <button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive" data-ph-item>Archive the network…</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`;
    return el;
}

// The plain reference header: the package's own, unmodified.
const plainHost = /** @type {HTMLElement} */ (section.querySelector('[data-ph-plain]'));
plainHost.append(buildHeader());

/* ------------------------------------------------------- the rows of options */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-ph-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'ph-aspect';
    box.setAttribute('data-ph-vary', id);
    box.setAttribute('aria-labelledby', `h-ph-${id}`);
    const head = document.createElement('div');
    head.className = 'ph-aspect__head';
    head.innerHTML = '<h3></h3><p></p>';
    /** @type {HTMLElement} */ (head.firstElementChild).id = `h-ph-${id}`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'ph-trio';
    for (const at of [1, 2, 3]) {
        const cell = document.createElement('div');
        cell.className = 'ph-col';
        cell.setAttribute('data-ph-vary', id);
        cell.setAttribute('data-ph-option', String(at));
        const copy = document.createElement('div');
        copy.innerHTML = `<p class="ph-label"><span class="ph-label__no">${label} · ${at}</span> <span data-ph-name></span></p><p class="ph-desc" data-ph-desc></p>`;
        const resize = document.createElement('div');
        resize.className = 'ph-resize';
        const strip = document.createElement('div');
        strip.className = 'ph-strip';
        strip.setAttribute('data-ph', '');
        resize.append(strip);
        cell.append(...copy.children, resize);
        trio.append(cell);
    }
    box.append(head, trio);
    rows.append(box);
}

// Every strip (the preview and every row's cell) gets its own header.
for (const strip of section.querySelectorAll('[data-ph]')) strip.append(buildHeader());

/* ------------------------------------------------------------- the picks */

/** What is ticked in the dialog, per theme; an aspect not ticked yet shows its option 1. */
/** @type {Record<string, Partial<Record<Aspect, string>>>} */
const ticked = {};
const theme = () => document.documentElement.getAttribute('data-theme') ?? 'formal';
const picks = () => /** @type {Record<Aspect, string>} */ (Object.fromEntries(ASPECTS.map(({ id }) => [id, ticked[theme()]?.[id] ?? '1'])));

/** Writes the three aspects on every strip: the preview takes the picks, each row's cell its own option in its own aspect. */
function compose() {
    const now = picks();
    const preview = section.querySelector('[data-ph-preview]');
    for (const { id } of ASPECTS) if (preview?.getAttribute(`data-ph-${id}`) !== now[id]) preview?.setAttribute(`data-ph-${id}`, now[id]);
    for (const cell of section.querySelectorAll('[data-ph-vary]')) {
        if (!cell.classList.contains('ph-col')) continue;
        const vary = cell.getAttribute('data-ph-vary');
        const option = cell.getAttribute('data-ph-option') ?? '1';
        const strip = cell.querySelector('[data-ph]');
        for (const { id } of ASPECTS) {
            const value = id === vary ? option : now[id];
            if (strip?.getAttribute(`data-ph-${id}`) !== value) strip?.setAttribute(`data-ph-${id}`, value);
        }
        cell.classList.toggle('ph-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-ph-picks]');
    const idea = IDEAS[theme()];
    if (words && idea) words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1].name}`).join(' · ');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* ------------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-ph-theme-name]')) el.textContent = LABEL[now] ?? now;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    for (const cell of section.querySelectorAll('.ph-col[data-ph-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (cell.getAttribute('data-ph-vary'))]?.[Number(cell.getAttribute('data-ph-option')) - 1];
        const name = cell.querySelector('[data-ph-name]');
        const desc = cell.querySelector('[data-ph-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------ the overflow menu */

const log = section.querySelector('[data-ph-log]');

/**
 * Hangs a panel right under its own More button, wherever the actions wrapped
 * to (Kenny, 2026-10-06 20:12: in the narrow width the menu no longer stuck
 * to the More button). The actions row is the offset parent.
 */
function placePanel(/** @type {HTMLElement} */ button, /** @type {HTMLElement} */ panel) {
    const row = /** @type {HTMLElement} */ (button.offsetParent);
    if (!row) return;
    // Under the button's end when the panel fits leftwards, else under its
    // start (a More that wrapped to the row's left edge).
    const fitsLeft = button.offsetLeft + button.offsetWidth - panel.offsetWidth >= 0;
    panel.style.insetInlineEnd = fitsLeft ? `${Math.max(0, row.clientWidth - (button.offsetLeft + button.offsetWidth))}px` : 'auto';
    panel.style.insetInlineStart = fitsLeft ? 'auto' : `${button.offsetLeft}px`;
    panel.style.insetBlockStart = `calc(${button.offsetTop + button.offsetHeight}px + 0.25rem)`;
}

/** Opens or closes every `[data-ph-more]` button's panel, playing the arrival or its mirrored leave. */
function setMenu(/** @type {HTMLElement} */ button, /** @type {boolean} */ open) {
    const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');
    if (!panel) return;
    button.setAttribute('aria-expanded', String(open));
    if (open) {
        panel.hidden = false;
        placePanel(button, panel);
        panel.removeAttribute('data-ph-anim');
        requestAnimationFrame(() => panel.setAttribute('data-ph-anim', 'open'));
    } else if (!panel.hidden) {
        // The same keyframes name is reused for the close (in reverse), so
        // the attribute is cleared and set again on the next frame, as the
        // open above does: changing which value an already-finished
        // animation's name resolves to, without that reset, never restarts
        // it.
        panel.removeAttribute('data-ph-anim');
        const done = () => {
            panel.hidden = true;
            panel.removeAttribute('data-ph-anim');
        };
        if (reduced()) done();
        else
            requestAnimationFrame(() => {
                panel.setAttribute('data-ph-anim', 'close');
                panel.addEventListener('animationend', done, { once: true });
            });
    }
}

// An open panel follows its button when the row reflows: a width change, a
// shape with other button sizes, or a hidden option coming into view.
const follow = new ResizeObserver((entries) => {
    for (const { target } of entries) {
        const more = /** @type {HTMLElement | null} */ (target.querySelector('[data-ph-more][aria-expanded="true"]'));
        const panel = more && document.getElementById(more.getAttribute('aria-controls') ?? '');
        if (more && panel) placePanel(more, panel);
    }
});
for (const row of section.querySelectorAll('.kp-page-header__actions')) follow.observe(row);

const closeEveryMenu = (/** @type {Element | null} */ except) => {
    for (const button of section.querySelectorAll('[data-ph-more]')) if (button !== except) setMenu(/** @type {HTMLElement} */ (button), false);
};

section.addEventListener('click', (event) => {
    const target = /** @type {Element} */ (event.target);
    const more = target.closest('[data-ph-more]');
    if (more) {
        const panel = document.getElementById(more.getAttribute('aria-controls') ?? '');
        const open = panel?.hidden !== false;
        closeEveryMenu(more);
        setMenu(/** @type {HTMLElement} */ (more), open);
        return;
    }
    const item = target.closest('[data-ph-item]');
    if (item) {
        if (log) log.textContent = `Opened: ${item.textContent?.trim()}.`;
        closeEveryMenu(null);
        return;
    }
    // A click on the demo's own controls bar is handled by that control's
    // own listener (below); it is not "outside the menu" in the sense this
    // generic close is for, and running both would undo the control.
    if (target.closest('[data-review-controls]')) return;
    if (!target.closest('[data-ph-panel]')) closeEveryMenu(null);
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeEveryMenu(null);
});

// The demo's own "Menu: Open / Closed" control opens or closes every menu at
// once, so the controls bar the review dialog mirrors can try both states
// without hunting down one particular button.
const menuButtons = [...section.querySelectorAll('[data-ph-menu-state]')];
for (const b of menuButtons)
    b.addEventListener('click', () => {
        const open = b.getAttribute('data-ph-menu-state') === 'open';
        for (const mb of menuButtons) mb.setAttribute('aria-pressed', String(mb === b));
        for (const more of section.querySelectorAll('[data-ph-more]')) setMenu(/** @type {HTMLElement} */ (more), open);
    });

/* -------------------------------------------------------------- width */

for (const b of section.querySelectorAll('[data-ph-width]'))
    b.addEventListener('click', () => {
        const narrow = b.getAttribute('data-ph-width') === 'narrow';
        for (const wb of section.querySelectorAll('[data-ph-width]')) wb.setAttribute('aria-pressed', String(wb === b));
        for (const box of section.querySelectorAll('.ph-resize')) {
            if (narrow) box.setAttribute('data-ph-narrow', '');
            else box.removeAttribute('data-ph-narrow');
        }
        for (const more of section.querySelectorAll('[data-ph-more][aria-expanded="true"]')) {
            const panel = document.getElementById(more.getAttribute('aria-controls') ?? '');
            if (panel) placePanel(/** @type {HTMLElement} */ (more), panel);
        }
    });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-ph-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as the meter and
// the trend tile do; full speed by default, since a loop is judged at its own
// pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('ph-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-ph-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-ph-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-ph-speed'));
        try {
            localStorage.setItem('ph-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();
