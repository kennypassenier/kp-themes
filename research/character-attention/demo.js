// research/character-attention: the eighth component of the character round
// (Kenny, 2026-10-05: "doe voort aan het project", after character-tiles),
// built the way the trend tile and the meter were in round 2: nothing
// bundled, every aspect picked on its own from three options, any
// combination composes.
//
// The band is the package's own: attachAttention()/setAttention()
// (js/attention.js) rank problems worst first, update an item by its key,
// and hand a removed item to leave() (js/motion.js) when it is
// acknowledged. Every aspect is CSS only, in attention.css, keyed by one
// attribute each on the band (`data-aa-shape`, `data-aa-arrival`,
// `data-aa-leave`, `data-aa-tone`, `data-aa-empty`, `data-aa-loading`).
// js/attention.js and js/motion.js are not changed; this module only sets
// `data-kp-arriving` on a new item itself (the way a register's own leave
// is drawn on `data-kp-leaving`) because setAttention() does not mark an
// arrival.

import { attachAttention, setAttention } from '../../js/attention.js';
import { leave } from '../../js/motion.js';
import { THEMES } from '../../js/theme-registry.js';

/** @typedef {{ name: string, text: string }} Option */
/** @typedef {'shape' | 'arrival' | 'leave' | 'tone' | 'empty' | 'loading'} Aspect */

/** The six aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    { id: 'shape', label: 'Shape', about: 'The plate, the icon, the title, the count and the fix action. Compare them as they stand.' },
    { id: 'arrival', label: 'How a problem arrives', about: 'What a new item does as it joins the band. Press Add item to replay it.' },
    {
        id: 'leave',
        label: 'How a problem leaves when it is acknowledged',
        about: 'The mirror of arrival: what an item does on its way out. Press Acknowledge to replay it.',
    },
    { id: 'tone', label: 'The tone', about: 'How a warning and a critical problem read beside an ordinary one. Press Tone.' },
    { id: 'empty', label: 'The empty state', about: 'What stands where the band would be when nothing needs attention. Press Empty.' },
    {
        id: 'loading',
        label: 'While loading',
        about: 'The picture while the band is still finding out what needs attention; it always moves. Press Loading.',
    },
];

/**
 * Three options per aspect. A theme not named here (most of the 22) takes
 * GENERIC: distinct, token-only, no bespoke per-theme pass yet — the
 * honest state this first round shipped in, named in README.md.
 * @type {Record<Aspect, Option[]>}
 */
const GENERIC = {
    shape: [
        { name: 'The quiet strip', text: 'A plain plate, a round icon, the count after the title, the fix right-aligned.' },
        { name: 'The ruled row', text: 'A rule before the icon, the count as a small chip, the fix stacked below on a narrow band.' },
        { name: 'The badge line', text: 'The icon carries the count when more than one shares it, the title bold, the fix as a text link.' },
    ],
    arrival: [
        { name: 'Slides in', text: 'The item slides in from the top edge of the band and settles.' },
        { name: 'Grows in', text: 'The item grows from no height, its icon scaling in last.' },
        { name: 'Steps in', text: 'The item appears in two quick hard steps, snapping into place.' },
    ],
    leave: [
        { name: 'Slides out', text: 'The item slides out toward the top edge, the mirror of Slides in, and the row below closes.' },
        { name: 'Shrinks out', text: 'The item shrinks to no height, its icon collapsing first, the mirror of Grows in.' },
        { name: 'Steps out', text: 'The item leaves in two hard steps, the mirror of Steps in, then the row closes.' },
    ],
    tone: [
        { name: 'The tinted edge', text: 'A tint of the severity behind the item with an edge of it, as the band ships today.' },
        { name: 'The solid chip', text: 'The icon alone carries the full severity colour; the plate stays neutral.' },
        { name: 'The banded top', text: "A band of the severity's colour runs along the top edge of the item." },
    ],
    empty: [
        { name: 'The quiet line', text: 'One calm line of muted text where the band would be: no border, no icon.' },
        { name: 'The settled card', text: 'A small plain card with a check mark, settled.' },
        { name: 'The closed strip', text: "The band's own frame stays, empty inside, one muted sentence." },
    ],
    loading: [
        { name: 'The marching dashes', text: "A dashed line marches along the item's edge while it loads." },
        { name: 'The sweeping band', text: "A soft band of the plate's own tint sweeps across the item." },
        { name: 'The pulsing ring', text: "The icon's ring pulses outward and back in place of its glyph." },
    ],
};

/** Bespoke worlds, built from the same characters the trend tile and the meter already gave formal and titanium. @type {Record<string, Record<Aspect, Option[]>>} */
const BESPOKE = {
    formal: {
        shape: [
            {
                name: 'The engraved plate',
                text: 'A ruled double frame, the icon a wax seal, the count a small roman numeral, the title in small capitals, the fix a single engraved link.',
            },
            {
                name: 'The annual report',
                text: 'A heavy rule above the icon, the count a ledger tally in brackets, the title in the display serif, the fix underlined once.',
            },
            {
                name: 'The certificate',
                text: 'A thin navy rule frame, the icon a guilloche ring, the count on a ribbon tab, the fix a wax-sealed button.',
            },
        ],
        arrival: [
            { name: 'Unrolled', text: 'The plate unrolls downward from a rolled edge, slowing as it lands.' },
            { name: 'Stamped in', text: 'The plate drops once from above and is stamped flat.' },
            { name: 'Entered in the ledger', text: 'The plate is ruled in from the left margin, in three hard steps.' },
        ],
        leave: [
            { name: 'Rolled away', text: 'The plate rolls back up toward its rolled edge, the mirror of Unrolled.' },
            { name: 'Filed', text: 'The plate lifts once and is drawn away upward, the mirror of Stamped in.' },
            { name: 'Struck from the ledger', text: 'The plate is ruled out to the right in three hard steps, the mirror of Entered in the ledger.' },
        ],
        tone: [
            { name: 'The engraved tone', text: "A boxed figure in the severity's ink, as an engraved plate's figure." },
            { name: 'The ledger tone', text: "The severity's note set in italics on its own plate, as an annual report's figure." },
            { name: 'The red-ink tone', text: "A hairline rule in the severity's colour down the left edge, the accountant's red ink." },
        ],
        empty: [
            { name: 'The clear ledger', text: 'A single ruled line reading "Nothing outstanding", in the small capitals.' },
            { name: 'The closed file', text: 'A thin frame with "All accounts clear" set faintly in the corner.' },
            { name: 'The blank certificate', text: 'The certificate\'s navy rule with no figure inside, just "Nothing to sign".' },
        ],
        loading: [
            { name: 'The dotted leader', text: "A dotted leader is written on dot by dot along the plate's foot." },
            { name: 'The ledger is ruled', text: "The ledger's rule is drawn across the plate, left to right, again and again." },
            { name: 'The seal is pressed', text: 'A navy seal ring presses onto the plate, lifts and presses again.' },
        ],
    },
    titanium: {
        shape: [
            {
                name: 'The milled plate',
                text: 'A brushed-grain plate, the icon a knurled disc, the count on a machined tab, the title in instrument mono, the fix a flush button.',
            },
            {
                name: 'The instrument dial',
                text: 'The icon a recessed aperture, the count a dial readout, the title condensed, the fix a toggle switch.',
            },
            {
                name: 'The anodised badge',
                text: 'A rounded plate with a primary rim, the icon a lit ring, the count a glowing digit, the fix a chamfered button.',
            },
        ],
        arrival: [
            { name: 'Seated', text: 'The plate drops into its slot from above, overshooting once before it seats.' },
            { name: 'Milled in', text: "The plate's edge is cut in from the left in hard steps, as a mill pass." },
            { name: 'Clicked in', text: 'The plate rotates a quarter turn and locks flat, like a dial click.' },
        ],
        leave: [
            { name: 'Unseated', text: 'The plate lifts from its slot and overshoots once on the way out, the mirror of Seated.' },
            { name: 'Milled out', text: "The plate's edge is cut away to the right in hard steps, the mirror of Milled in." },
            { name: 'Clicked out', text: 'The plate rotates a quarter turn back and lifts away, the mirror of Clicked in.' },
        ],
        tone: [
            { name: 'The machined tone', text: "A flat tab in the severity's colour with a square corner." },
            { name: 'The alarm tone', text: "The icon's ring lights fully in the severity, as a status lamp." },
            { name: 'The anodised tone', text: "A band of the severity's colour across the top, an anodised tag." },
        ],
        empty: [
            { name: 'The idle dial', text: 'A recessed aperture with its needle at rest, "Nothing to flag".' },
            { name: 'The cleared panel', text: 'A brushed plate with one lit green ring, "All clear".' },
            { name: 'The flush plate', text: 'A plain milled plate with no tab, "Nothing needs attention".' },
        ],
        loading: [
            { name: 'The cutter runs', text: "A bright line runs along the plate's edge, as a cutter pass." },
            { name: 'The knurl rolls', text: 'The knurled band along the top rolls in place.' },
            { name: 'The lathe turns', text: 'Ridges run along the plate, as a part turning on a lathe.' },
        ],
    },
    light: {
        shape: [
            {
                name: 'The pinned slip',
                text: 'A paper slip pinned at the corner, the icon a round stamp, the count a small tally, the fix a plain button below.',
            },
            {
                name: 'The ruled memo',
                text: 'A rule above the icon, the count bracketed like a ledger line, the title bold, the fix a lone link to the right.',
            },
            {
                name: 'The sun-flag tab',
                text: 'A small flag tab holds the icon at the edge, the count on the flag, the fix underlined, no frame at all.',
            },
        ],
        arrival: [
            { name: 'Unfurls', text: 'The slip drops down and unfurls from a curled top edge.' },
            { name: 'Catches the light', text: 'The slip grows up from no height as the sun catches it.' },
            { name: 'Pinned down', text: 'The slip is pinned down in two quick taps, snapping into place.' },
        ],
        leave: [
            { name: 'Furls away', text: 'The slip curls back up at its top edge, the mirror of Unfurls.' },
            { name: 'Slips from the light', text: 'The slip shrinks back to no height, the mirror of Catches the light.' },
            { name: 'Unpinned', text: 'The slip is lifted away in two quick taps, the mirror of Pinned down.' },
        ],
        tone: [
            {
                name: 'The sun-tinted edge',
                text: 'A warm tint of the severity colours the slip with an edge of it, as paper catches a bit of colour in the light.',
            },
            { name: 'The stamped tone', text: "The icon alone is stamped solid in the severity's colour; the slip stays plain paper." },
            { name: 'The banded top', text: 'A band of the severity runs along the top edge of the slip, like a highlighter stripe.' },
        ],
        empty: [
            { name: 'The clear desk', text: 'One calm line of muted text: nothing on the desk, no border, no icon.' },
            { name: 'The settled note', text: 'A small plain card with a check mark, all caught up, settled in the sun.' },
            { name: 'The blank slip', text: "The slip's own pinned frame stays, empty inside, one muted line: nothing pinned." },
        ],
        loading: [
            { name: 'The pencil marches', text: "A dashed pencil line marches along the slip's foot while it loads." },
            { name: 'The sun sweeps', text: 'A soft band of sunlight sweeps across the slip.' },
            { name: 'The shadow turns', text: "A small shadow turns around the icon like a sundial's gnomon." },
        ],
    },
    dark: {
        shape: [
            { name: 'The status row', text: 'A flush mono row, a square LED for the icon, the count a digit readout, the fix a plain button.' },
            { name: 'The panel gauge', text: 'An inset bezel frames the icon, the count on a recessed dial, the title condensed, the fix a toggle.' },
            { name: 'The OLED chip', text: 'The plate goes almost dark, the icon a glowing ring, the title lit, the fix a flush link.' },
        ],
        arrival: [
            { name: 'Powers up', text: 'The row lights up from no height, overshooting once as it settles.' },
            { name: 'Scans in', text: 'The row is scanned in from the left in hard steps.' },
            { name: 'Locks in', text: 'The row drops into place and locks flat.' },
        ],
        leave: [
            { name: 'Powers down', text: 'The row dims to no height, the mirror of Powers up.' },
            { name: 'Scans out', text: 'The row is scanned away to the right in hard steps, the mirror of Scans in.' },
            { name: 'Unlocks', text: 'The row lifts and is drawn away upward, the mirror of Locks in.' },
        ],
        tone: [
            { name: 'The LED edge', text: "A thin LED-coloured edge marks the severity down the row's inline-start side." },
            { name: 'The lit lamp', text: 'The icon alone lights fully in the severity colour, like a status lamp.' },
            { name: 'The glow bar', text: "A glowing bar sits along the top edge in the severity's colour." },
        ],
        empty: [
            { name: 'Standby', text: 'One muted mono line: standby, nothing flagged, no border, no icon.' },
            { name: 'All green', text: 'A small panel with a steady green LED, all systems clear.' },
            { name: 'Blank screen', text: "The console's own frame stays, the screen dark, one dim line: no readout." },
        ],
        loading: [
            { name: 'The scanline marches', text: "A dashed scanline marches along the row's edge while it loads." },
            { name: 'The sweep crosses', text: 'A pale sweep crosses the row, like a radar wipe.' },
            { name: 'The ping pulses', text: 'A ring pulses outward from the icon like a radar ping.' },
        ],
    },
    cyberpunk: {
        shape: [
            {
                name: 'The neon rail',
                text: "A neon rail runs down the item's edge, the icon glows, the count a lit digit, the fix a bare neon link.",
            },
            {
                name: 'The glitch strip',
                text: 'The title splits into a chromatic double image, the count in a scanline chip, the fix in a jagged outline button.',
            },
            { name: 'The holo pane', text: 'The plate reads as a glowing holo pane, the icon ringed in light, the fix a flush glow button.' },
        ],
        arrival: [
            { name: 'Boots onto the HUD', text: 'The item reveals top-down as if a scanline draws it in.' },
            { name: 'Glitch-snaps in', text: 'The item jitters sideways in hard steps before it locks.' },
            { name: 'Rezzes in', text: 'The item tips up from flat and snaps upright.' },
        ],
        leave: [
            { name: 'Scanned off the HUD', text: 'The item closes top-down, the mirror of Boots onto the HUD.' },
            { name: 'Glitch-snaps out', text: 'The item jitters sideways away in hard steps, the mirror of Glitch-snaps in.' },
            { name: 'Derezzes', text: 'The item tips down flat and vanishes from the top, the mirror of Rezzes in.' },
        ],
        tone: [
            { name: 'The chromatic edge', text: 'A two-colour chromatic edge marks the severity.' },
            { name: 'The lit core', text: 'The icon alone glows at full saturation in the severity colour.' },
            { name: 'The glow bar', text: 'A blurred neon bar sits along the top edge.' },
        ],
        empty: [
            { name: 'No signal', text: 'One muted mono line: no signal, no border, no icon.' },
            { name: 'All clear', text: 'A small panel with a steady ping dot, clear.' },
            { name: 'Dead HUD', text: "Only the HUD's corner brackets stay, nothing inside, one dim line: nothing flagged." },
        ],
        loading: [
            { name: 'The scanline marches', text: "A neon dashed line marches along the item's edge while it loads." },
            { name: 'The glitch sweeps', text: 'A neon band sweeps across the item in hard jittering steps.' },
            { name: 'The ping pulses', text: "The icon's ring pulses outward in neon, like a radar ping." },
        ],
    },
    synthwave: {
        shape: [
            { name: 'The horizon rail', text: "A neon horizon line glows along the item's top edge, the icon a sun disc, the fix a bare neon link." },
            { name: 'The VCR row', text: 'A scanline overlay sits over the row, mono digits for the count, the fix a square button.' },
            { name: 'The marquee card', text: 'A neon-framed card with a glowing border, a bold display title, the fix a chamfered button.' },
        ],
        arrival: [
            { name: 'Rises over the horizon', text: 'The item rises up from below the fold like a sun over a grid horizon.' },
            { name: 'Tracks in', text: 'The item jitters in from the left like a tape-tracking error settling.' },
            { name: 'Lights up', text: 'The item drops and bounces once as its marquee lights come on.' },
        ],
        leave: [
            { name: 'Sets below the horizon', text: 'The item sinks down below the fold, the mirror of Rises over the horizon.' },
            { name: 'Tracks out', text: 'The item jitters away to the right like a tracking error, the mirror of Tracks in.' },
            { name: 'Lights down', text: 'The item lifts and is drawn away, the mirror of Lights up.' },
        ],
        tone: [
            { name: 'The sunset edge', text: 'A neon sunset-coloured edge marks the severity.' },
            { name: 'The lit sign', text: "The icon alone lights fully in the severity's neon colour." },
            { name: 'The marquee band', text: "A glowing band runs along the top edge in the severity's colour." },
        ],
        empty: [
            { name: 'No signal', text: 'One muted line: no signal, no border, no icon.' },
            { name: 'Paused', text: 'A small panel reading paused, nothing to flag, mono, centred.' },
            { name: 'Dark marquee', text: "The marquee's frame stays, unlit, one dim line: nothing playing." },
        ],
        loading: [
            { name: 'The grid scrolls', text: "The horizon's grid lines scroll past while it loads." },
            { name: 'The scanline sweeps', text: 'A scanline sweeps down the item like a VCR tracking bar.' },
            { name: 'The marquee chases', text: "Lights chase around the item's ring like an arcade marquee." },
        ],
    },
    pastel: {
        shape: [
            { name: 'The sticker tag', text: "A fat rounded border like a sticker's edge, the icon a round sticker, the fix a soft pill button." },
            { name: 'The washi strip', text: 'A strip of patterned washi tape sits along the top, the count a small tag, the fix underlined.' },
            { name: 'The cloud bubble', text: 'A fully rounded cloud-shaped plate, a soft shadow, the fix a tiny rounded button.' },
        ],
        arrival: [
            { name: 'Floats in', text: 'The item floats down and bounces gently once as it lands.' },
            { name: 'Peels on', text: 'The item peels on with a little rotate, like a sticker being pressed down.' },
            { name: 'Pops in', text: 'The item pops up from small with a bouncy overshoot.' },
        ],
        leave: [
            { name: 'Floats away', text: 'The item floats up and away, the mirror of Floats in.' },
            { name: 'Peels off', text: 'The item peels off with a little rotate the other way, the mirror of Peels on.' },
            { name: 'Pops away', text: 'The item pops back down to small, the mirror of Pops in.' },
        ],
        tone: [
            { name: 'The crayon edge', text: 'A soft crayon-coloured edge marks the severity.' },
            { name: 'The candy dot', text: 'The icon alone turns a solid candy colour for the severity.' },
            { name: 'The ribbon band', text: 'A ribbon-coloured band runs along the top edge.' },
        ],
        empty: [
            { name: 'All tidy', text: 'One soft line of muted text: all tidy here, no border, no icon.' },
            { name: 'The happy note', text: 'A small rounded card with a smiley check, nothing to do.' },
            { name: 'The empty envelope', text: 'A dashed envelope outline, empty inside, one soft line: nothing inside.' },
        ],
        loading: [
            { name: 'The stitches march', text: "A dotted stitch line marches along the item's edge while it loads." },
            { name: 'The wash sweeps', text: 'A soft pastel wash sweeps across the item.' },
            { name: 'The bubble breathes', text: "The icon's ring breathes gently in and out while it loads." },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'The status line',
                text: 'A double CRT rule frames the plate, the icon squared off, the title in uppercase mono, the fix in plain text.',
            },
            {
                name: 'The curses window',
                text: "A single-line border with an inset ring, the title underscored like a window's own rule, mono throughout.",
            },
            { name: 'The prompt row', text: 'No frame at all; the icon boxed in outline, the count tabular, the fix bracketed like `[ Open ]`.' },
        ],
        arrival: [
            { name: 'Printed in', text: 'The row prints onto the band left to right, in hard dot-matrix steps.' },
            { name: 'Boots up', text: 'The row flares bright as a tube warming, overshoots once and settles to its steady glow.' },
            { name: 'Pasted in', text: 'The row snaps in from the right in two hard steps, as a terminal paste.' },
        ],
        leave: [
            { name: 'Cleared', text: 'The row is erased right to left, in hard dot-matrix steps, the mirror of Printed in.' },
            { name: 'Shuts down', text: 'The row flares once more and collapses to nothing, the mirror of Boots up.' },
            { name: 'Cut', text: 'The row snaps out to the right in two hard steps, the mirror of Pasted in.' },
        ],
        tone: [
            { name: 'The signal edge', text: "A thick left rule in the severity's colour, the plate otherwise unchanged." },
            { name: 'The solid chip', text: "The icon alone fills with the severity's colour, squared off, no curve." },
            { name: 'The banded top', text: "A thick rule in the severity's colour runs along the row's top edge." },
        ],
        empty: [
            { name: 'No signal', text: 'One muted uppercase line of mono text where the band would be.' },
            { name: 'Standing by', text: 'A single-line boxed panel, centred mono text.' },
            { name: 'All clear', text: 'A double-ruled frame with no signal inside, one line of mono text.' },
        ],
        loading: [
            { name: 'The dot-matrix prints', text: "A dashed line marches along the panel's foot in hard printer steps." },
            { name: 'The scanline sweeps', text: 'A bright accent line sweeps down the panel like a CRT redraw.' },
            { name: 'The cursor marches', text: 'A solid block cursor steps across the panel and jumps back, typing.' },
        ],
    },
    forest: {
        shape: [
            { name: 'The logbook entry', text: 'A plain ruled underline, the title set in the display italic, no frame at all.' },
            { name: 'The canopy tile', text: 'A soft rounded plate tinted from the primary, the icon a ringed circle.' },
            { name: 'The herbarium sheet', text: 'A pressed-leaf border with a faint cross-hatch behind it, the title in the display italic.' },
        ],
        arrival: [
            { name: 'Sprouts up', text: 'The row grows upward from no height at the foot, overshooting slightly as it settles.' },
            { name: 'Falls into place', text: 'The row drifts down like a falling leaf, turning slightly, and rights itself.' },
            { name: 'Rings outward', text: 'The row grows outward from a point, as a tree ring widening, and settles to size.' },
        ],
        leave: [
            { name: 'Withers down', text: 'The row shrinks to no height at the foot, the mirror of Sprouts up.' },
            { name: 'Lifts away', text: 'The row drifts up and turns away like a leaf lifting off, the mirror of Falls into place.' },
            { name: 'Rings inward', text: 'The row shrinks inward to a point, the mirror of Rings outward.' },
        ],
        tone: [
            { name: 'The mossy edge', text: "A left rule in the severity's colour, soft against the canopy tint." },
            { name: 'The bark chip', text: "The icon's ring fills with the severity's colour." },
            { name: 'The canopy band', text: "A rule in the severity's colour runs along the row's rounded top." },
        ],
        empty: [
            { name: 'The clearing', text: 'One muted italic line where the band would be: no border, no icon.' },
            { name: 'The quiet grove', text: 'A soft rounded card, centred text, tinted like the canopy.' },
            { name: 'Nothing underfoot', text: 'A pressed-leaf dashed border with one muted line inside.' },
        ],
        loading: [
            { name: 'Sap rises', text: 'A soft green band rises and falls inside the panel like sap moving.' },
            { name: 'Leaves rustle', text: 'A dashed line along the foot shivers side to side like leaves in a breeze.' },
            { name: 'A growth ring expands', text: 'A ring grows outward and fades into the next, like a tree ring forming.' },
        ],
    },
    'high-contrast': {
        shape: [
            { name: 'Ink and frame', text: 'A heavy two-pixel border, the title in extra-bold weight, nothing else.' },
            { name: 'The inverse plate', text: 'A heavy border with the icon fully inverted: foreground fill, background glyph.' },
            { name: 'The signal board', text: 'Thick top and bottom bars frame the row, the title set largest and heaviest.' },
        ],
        arrival: [
            { name: 'Snaps into frame', text: 'The row snaps to full size in two hard steps, no easing.' },
            { name: 'Flips to signal', text: 'The row flips down from face-up to flat, like a signal board dropping into view.' },
            { name: 'Bars slide', text: "The row's bars slide in from the left edge in four hard steps." },
        ],
        leave: [
            { name: 'Unsnaps', text: 'The row snaps down to nothing in two hard steps, the mirror of Snaps into frame.' },
            { name: 'Flips away', text: 'The row flips up and away, the mirror of Flips to signal.' },
            { name: 'Bars retreat', text: "The row's bars slide out to the right in four hard steps, the mirror of Bars slide." },
        ],
        tone: [
            { name: 'The machined edge', text: "A thick left rule in the severity's colour, nothing softened." },
            { name: 'The inverse tone', text: "The icon inverts fully into the severity's colour." },
            { name: 'The signal bar', text: "A thick rule in the severity's colour tops the row." },
        ],
        empty: [
            { name: 'Nothing flagged', text: 'One bold line of text where the band would be, no border.' },
            { name: 'The clear frame', text: 'A heavy-bordered panel, centred bold text.' },
            { name: 'The idle board', text: 'Thick top and bottom bars with no signal between them, bold text.' },
        ],
        loading: [
            { name: 'Bars march', text: "A row of thick dashes marches along the panel's foot in hard steps." },
            { name: 'The signal sweeps', text: 'A solid bar sweeps across the panel in two hard jumps, back and forth.' },
            { name: 'The block pulses', text: 'A solid square pulses larger and back in sharp steps, never fading.' },
        ],
    },
    sepia: {
        shape: [
            { name: 'The barograph trace', text: 'A thin ruled underline, the title set in the display serif italic, no frame.' },
            { name: 'The letterpress plate', text: 'An embossed title in small caps, the plate otherwise bare.' },
            { name: 'The ticket stub', text: 'A dashed border punched with two perforation notches, the title tracked wide in capitals.' },
        ],
        arrival: [
            { name: 'Inked in', text: 'The row is stamped down at a slight angle and settles flat, like a wet seal pressed in.' },
            { name: 'Unspooled', text: 'The row slides in from the left as if paper were unspooling across the band.' },
            { name: 'Punched in', text: 'The row rises in three hard steps from no height, like a ticket punch striking down in reverse.' },
        ],
        leave: [
            { name: 'Blotted out', text: 'The row tilts and collapses to nothing, the mirror of Inked in.' },
            { name: 'Rewound', text: 'The row slides back out to the left, the mirror of Unspooled.' },
            { name: 'Torn away', text: 'The row collapses in three hard steps, the mirror of Punched in.' },
        ],
        tone: [
            { name: 'The ink edge', text: "A left rule in the severity's colour, aged against the paper." },
            { name: 'The emboss tone', text: "The icon presses inward, filled with the severity's colour." },
            { name: 'The perforated band', text: "A dashed rule in the severity's colour runs along the row's top." },
        ],
        empty: [
            { name: 'Nothing recorded', text: 'One muted italic serif line where the band would be.' },
            { name: 'The blank page', text: 'A plain card, centred serif text, no ornament.' },
            { name: 'No stub drawn', text: 'A dashed border with wide-tracked capitals, no perforation cut.' },
        ],
        loading: [
            { name: 'The needle traces', text: 'A fine ink line travels across the panel like a barograph pen.' },
            { name: 'Type sets', text: 'A dark disc presses down and lifts again and again, like letterpress type striking the page.' },
            { name: 'The stub perforates', text: "A ring of tiny holes marches along the panel's foot, punching as it goes." },
        ],
    },
    blueprint: {
        shape: [
            { name: 'The chart recorder', text: 'A fine grid fills the plate behind the row, the title in uppercase mono.' },
            { name: 'The title block', text: 'A ruled border with an underlined title, uppercase mono throughout.' },
            { name: 'The section view', text: 'A dashed border over a diagonal hatch, the title in tracked mono.' },
        ],
        arrival: [
            { name: 'Plotted in', text: 'The row draws itself in from the left edge, as a pen plotting a line.' },
            { name: 'Drafted in', text: 'The row is placed in from the left in four hard drafting steps.' },
            { name: 'Section cut', text: 'The row drops down into place in two hard steps, as a section being cut in.' },
        ],
        leave: [
            { name: 'Erased', text: 'The row erases itself back to the left edge, the mirror of Plotted in.' },
            { name: 'Undrafted', text: 'The row is lifted out to the left in four hard steps, the mirror of Drafted in.' },
            { name: 'Section closed', text: 'The row lifts up and out in two hard steps, the mirror of Section cut.' },
        ],
        tone: [
            { name: 'The grid line', text: "A left rule in the severity's colour against the fine grid." },
            { name: 'The title banner', text: "The icon fills solidly with the severity's colour, squared off." },
            { name: 'The section band', text: "A dashed rule in the severity's colour runs along the row's top." },
        ],
        empty: [
            { name: 'Nothing plotted', text: 'One muted uppercase mono line where the band would be.' },
            { name: 'The clean sheet', text: 'A bordered panel with the fine grid still behind it, centred mono text.' },
            { name: 'No section cut', text: 'A dashed border with tracked mono text, no hatch drawn.' },
        ],
        loading: [
            { name: 'The pen sweeps', text: 'A bright accent line sweeps across the panel like a plotter pen.' },
            { name: 'The grid scans', text: 'The fine grid itself scrolls diagonally across the panel.' },
            { name: 'The hatch fills', text: 'A diagonal hatch marches across the panel in hard steps, as a section filling in.' },
        ],
    },
    solstice: {
        shape: [
            { name: 'The low sun', text: 'A warm glow pools under the item, the icon ringed in amber light.' },
            { name: 'The embers', text: 'A rule of ember orange under the item, the icon a glowing coal, the title in the display serif.' },
            { name: 'The horizon line', text: 'A soft amber frame and a glowing icon, the fix a plain underlined word in rust.' },
        ],
        arrival: [
            { name: 'Rises', text: "The item rises from below the band's edge like the sun clearing the horizon." },
            { name: 'Kindled', text: 'The item grows upward from nothing, as a fire catching from its base.' },
            { name: 'Catches light', text: 'The item steps in from the side in three quick embers of motion.' },
        ],
        leave: [
            { name: 'Sets', text: 'The item sinks back below the horizon, the mirror of Rises.' },
            { name: 'Dims out', text: 'The item shrinks back down to nothing, the mirror of Kindled.' },
            { name: 'Burns out', text: 'The item steps away in three quick embers, the mirror of Catches light.' },
        ],
        tone: [
            { name: 'The glowing ring', text: "The icon carries a soft glow in the severity's colour, a lamp at dusk." },
            { name: 'The banked coal', text: "The icon's corners round off and warm in the severity's colour." },
            { name: 'The red sky', text: "A warm wash of the severity's colour rises from the bottom of the item." },
        ],
        empty: [
            { name: 'The dimmed hearth', text: 'One muted line under a faint amber rule, the fire gone out for now.' },
            { name: 'The quiet ember', text: 'A rounded, warm-tinted card: nothing left burning.' },
            { name: 'The cold horizon', text: 'A dashed amber frame with nothing inside, just the sentence.' },
        ],
        loading: [
            { name: 'The sun breathes', text: 'A dome of amber light under the item swells and settles, again and again.' },
            { name: 'The embers glow', text: 'A warm pool of light at the base of the item pulses brighter and dimmer.' },
            { name: 'The sun crosses', text: "A small glowing disc arcs across the item, low to high to low, like the sun's path." },
        ],
    },
    brutalism: {
        shape: [
            { name: 'The slab', text: 'A heavy black border and a hard offset shadow, the title in heavy weight, worn like a protest sign.' },
            { name: 'The sticker sheet', text: 'A candy-bright plate boxed in black, the icon a cut square, the fix stacked below.' },
            { name: 'The poster block', text: 'A double hard shadow in black and the accent colour, the title uppercase and tracked wide.' },
        ],
        arrival: [
            { name: 'Dropped', text: 'The item drops from above in two hard steps and lands flat, no easing.' },
            { name: 'Slammed', text: 'The item falls in tilted and snaps flat with a jolt, like a stamp hitting paper.' },
            { name: 'Shoved in', text: 'The item is shoved in from the side in four hard steps.' },
        ],
        leave: [
            { name: 'Yanked up', text: 'The item is yanked back up in two hard steps, the mirror of Dropped.' },
            { name: 'Ripped off', text: 'The item tilts and is torn away upward, the mirror of Slammed.' },
            { name: 'Shoved out', text: 'The item is shoved out to the side in four hard steps, the mirror of Shoved in.' },
        ],
        tone: [
            { name: 'The stamped shadow', text: "The item's hard shadow switches to the severity's colour, unmissable." },
            { name: 'The crooked sticker', text: "The icon tilts off-square in the severity's colour, like a sticker slapped on fast." },
            { name: 'The warning label', text: "The title sits on a solid block of the severity's colour, stamped like a hazard label." },
        ],
        empty: [
            { name: 'The bare slab', text: 'One heavy black rule and a flat line of text: nothing posted here.' },
            { name: 'The empty frame', text: 'A boxed card with its own hard shadow, holding nothing but the sentence.' },
            { name: 'The torn-down poster', text: 'A dashed black frame where a poster used to be.' },
        ],
        loading: [
            { name: 'The stamp presses', text: 'A black square presses down and springs back, over and over, like a rubber stamp.' },
            { name: 'The weight drops', text: 'A heavy block falls, bounces once and falls again, hard and mechanical.' },
            { name: 'The hammer hops', text: 'A solid black block hops hard across the item and back, no easing.' },
        ],
    },
    deco: {
        shape: [
            { name: 'The gilt frame', text: 'A thin gold rule inside a double border, the title in the display serif, uppercase and tracked.' },
            { name: 'The marquee', text: 'A row of gold dots lines the top and bottom like a theatre marquee, the title in display type.' },
            { name: 'The skyscraper', text: 'A single gold step along the top edge, the fix framed in a thin gold rule.' },
        ],
        arrival: [
            { name: 'The curtain rises', text: 'The item rises smoothly into place, as a stage curtain lifting.' },
            { name: 'The marquee lights', text: "The item's gold dots step on in nine quick beats, lighting up left to right." },
            { name: 'Unrolled in gold', text: 'The item unrolls downward from a rolled edge at the top.' },
        ],
        leave: [
            { name: 'The curtain falls', text: 'The item falls smoothly out of place, the mirror of The curtain rises.' },
            { name: 'The marquee dims', text: "The item's gold dots step off in nine quick beats, the mirror of The marquee lights." },
            { name: 'Rolled away in gold', text: 'The item rolls back up toward the top, the mirror of Unrolled in gold.' },
        ],
        tone: [
            { name: 'The gilt border', text: "The item's frame turns to the severity's colour, a single clean rule." },
            { name: 'The double rule', text: "The item's border doubles in the severity's colour, formal and deliberate." },
            { name: 'The gilt notice', text: "A thin boxed frame in the severity's colour sits just inside the item's own border." },
        ],
        empty: [
            { name: 'The dark marquee', text: 'A single gold rule under faint, tracked uppercase text: the lights are off.' },
            { name: 'The closed curtain', text: 'A double gold border with nothing behind it, the sentence centred.' },
            { name: 'The bare stage', text: 'A thin gold frame with a single step along the top, holding nothing.' },
        ],
        loading: [
            { name: 'The spotlight sweeps', text: 'A narrow gold beam slides across the item, side to side, like a searchlight.' },
            { name: 'The marquee runs', text: "A row of gold dots marches steadily along the item's edge." },
            { name: 'The sunburst turns', text: 'A gold fan of rays spins slowly in place, like a deco sunburst motif.' },
        ],
    },
    phantom: {
        shape: [
            { name: 'The evidence card', text: 'A solid black plate with skewed white type, stark as a case file photo pinned to a board.' },
            { name: 'The calling card', text: 'A clean plate with one red corner torn diagonally, the title skewed.' },
            { name: 'The ransom note', text: 'A dotted halftone ground behind the title, the text shadowed hard in red.' },
        ],
        arrival: [
            { name: 'Thrown down', text: 'The item is thrown in at an angle and lands flat, rough and sudden.' },
            { name: 'Glitches in', text: 'The item jolts sideways twice before settling, like a signal catching.' },
            { name: 'Slashed in', text: 'The item is cut in from the top, skewed, and straightens as it lands.' },
        ],
        leave: [
            { name: 'Thrown away', text: 'The item is thrown back out at an angle, the mirror of Thrown down.' },
            { name: 'Glitches out', text: 'The item jolts sideways and skews away, the mirror of Glitches in.' },
            { name: 'Slashed out', text: 'The item is cut away upward, skewed, the mirror of Slashed in.' },
        ],
        tone: [
            { name: 'The stamped ring', text: "The icon tilts off-axis in the severity's colour, like a rubber stamp pressed at an angle." },
            { name: 'The skewed card', text: "The whole item leans in the severity's reading, a card thrown down crooked." },
            { name: 'The torn tag', text: "A small skewed tag in the severity's colour sits beside the title, torn at an angle." },
        ],
        empty: [
            { name: 'The blank evidence card', text: 'A faint halftone ground with nothing pinned to it.' },
            { name: 'The closed case', text: 'A hard black-bordered card holding only the sentence.' },
            { name: 'The empty frame', text: 'A dotted halftone frame where a ransom note used to sit.' },
        ],
        loading: [
            { name: 'The stamp ring presses', text: 'A ring of red presses down and springs back, like a rubber stamp hitting paper.' },
            { name: 'The halftone shifts', text: 'A field of dots marches across the item, mechanical and relentless.' },
            { name: 'The string is pulled', text: 'A diagonal red line is pulled across the item, then yanked back, over and over.' },
        ],
    },
    'shade-light': {
        shape: [
            { name: 'Pencil in the shade', text: 'A soft hatched tint along the edge, as pencil shading under a tree.' },
            { name: 'The leaf shade', text: 'A gentle lifted shadow under the plate, cool and quiet.' },
            { name: 'The window light', text: 'A soft diagonal band of light crosses the item, as sun through a blind.' },
        ],
        arrival: [
            { name: 'Drawn in pencil', text: 'The item draws itself in from the left, as a line sketched by hand.' },
            { name: 'Settles into shade', text: 'The item eases in sideways and settles, unhurried.' },
            { name: 'Rises into the light', text: 'The item rises gently into place, like a page catching the light.' },
        ],
        leave: [
            { name: 'Erased', text: 'The item draws itself away to the right, the mirror of Drawn in pencil.' },
            { name: 'Fades into shade', text: 'The item eases back out sideways, the mirror of Settles into shade.' },
            { name: 'Sinks from the light', text: 'The item sinks gently out of place, the mirror of Rises into the light.' },
        ],
        tone: [
            { name: 'The lifted note', text: "A soft shadow under the item deepens in the severity's weight." },
            { name: 'The rounded mark', text: "The icon softens to a full circle in the severity's colour." },
            { name: 'The pinned note', text: "A small shadow along one edge, as a note pinned at an angle, in the severity's colour." },
        ],
        empty: [
            { name: 'The blank page', text: 'A faint pencil hatch under one quiet line: nothing written here.' },
            { name: 'The clear desk', text: 'A softly lifted card holding only the sentence, calm and tidy.' },
            { name: 'The open window', text: 'A dashed quiet frame where the light falls through, empty.' },
        ],
        loading: [
            { name: 'The pencil moves', text: 'A hatched band slides across the item, as a pencil shading a page.' },
            { name: 'The light drifts', text: 'A soft pool of shade drifts slowly back and forth across the item.' },
            { name: 'The leaves sway', text: 'Two soft round shadows sway gently side to side, like leaves in a breeze.' },
        ],
    },
    'shade-dark': {
        shape: [
            { name: 'The dimmed panel', text: 'A plain plate with a soft pool of its own light at the corner, a round icon, the fix right-aligned.' },
            { name: 'The lit gauge', text: 'The icon glows like a dial lamp in the dark, the count a small chip, the fix stacked below.' },
            {
                name: 'The halo chip',
                text: "The icon sits inside a glowing ring in the severity's colour, the title lit by a faint glow of its own.",
            },
        ],
        arrival: [
            { name: 'Lamp swings in', text: 'The item swings down from the top edge like a pull-chain lamp and settles.' },
            { name: 'Glow blooms', text: 'The item grows from a smaller size as if a lamp were turned toward it.' },
            { name: 'Flickers in', text: 'The item rises in three uneven steps, like a lamp struggling to catch.' },
        ],
        leave: [
            { name: 'Lamp swings away', text: 'The item swings back up toward the top edge, the mirror of Lamp swings in.' },
            { name: 'Glow settles back', text: 'The item shrinks back to its smaller size, the mirror of Glow blooms.' },
            { name: 'Flickers out', text: 'The item sinks away in three uneven steps, the mirror of Flickers in.' },
        ],
        tone: [
            { name: 'The glowing edge', text: 'A soft glow of the severity along the start edge, a lamp held close.' },
            { name: 'The halo icon', text: "The icon alone glows in the severity's colour; the plate stays dark and plain." },
            { name: 'The underlit band', text: "A glow of the severity rises from beneath the item's top edge." },
        ],
        empty: [
            { name: 'The quiet dim line', text: 'One faint line of muted text where the band would be, a thin glow above it.' },
            { name: 'The settled card', text: "A small dark card with a hint of a lamp's highlight along its top." },
            { name: 'The closed strip', text: 'A dashed, faintly glowing frame, empty inside, one muted sentence.' },
        ],
        loading: [
            { name: 'The ember trail', text: "A trail of glowing dashes marches along the item's edge while it loads." },
            { name: 'The drifting glow', text: 'A soft pool of light drifts back and forth across the item, like a lamp swaying.' },
            { name: 'The glow ring', text: "A ring of light pulses outward and back in place of the icon's glyph." },
        ],
    },
    retro: {
        shape: [
            {
                name: 'The dialog box',
                text: 'A raised grey bevel like a 1995 dialog, a beveled square icon, the count after the title, the fix right-aligned.',
            },
            { name: 'The status bar', text: 'A sunken bevel like a status bar, the title in the system mono font, the fix stacked below.' },
            { name: 'The title bar', text: 'A hard navy title strip for the title, a drop-shadow frame, the fix a beveled button.' },
        ],
        arrival: [
            { name: 'Pops open', text: 'The item snaps open from no height in three hard steps, like a dialog box opening.' },
            { name: 'Slides in off-screen', text: 'The item slides in from the side in hard steps, like a window dragged into place.' },
            { name: 'Boots up', text: 'The item rises in three jerky steps, like a screen warming up.' },
        ],
        leave: [
            { name: 'Snaps shut', text: 'The item snaps closed to no height in three hard steps, the mirror of Pops open.' },
            { name: 'Slides away off-screen', text: 'The item slides out to the side in hard steps, the mirror of Slides in off-screen.' },
            { name: 'Powers down', text: 'The item sinks away in three jerky steps, the mirror of Boots up.' },
        ],
        tone: [
            { name: 'The beveled edge', text: "A thick solid edge in the severity's colour down the start side, square-cornered." },
            { name: 'The beveled lamp', text: 'The icon alone carries the severity as a beveled square lamp; the plate stays grey.' },
            { name: 'The title strip', text: 'A thick solid strip of the severity along the top edge, like a coloured title bar.' },
        ],
        empty: [
            { name: 'The console line', text: 'One line of mono text where the band would be, a thin rule beneath it.' },
            { name: 'The sunken panel', text: 'A beveled, sunken panel with a calm sentence inside, like an empty list box.' },
            { name: 'The notepad frame', text: 'A square frame with a drop shadow, empty inside, one plain sentence.' },
        ],
        loading: [
            { name: 'The marquee', text: "A bordered bar with a marching dashed fill scrolls along the item's edge while it loads." },
            { name: 'The scanning block', text: 'A solid block scans across the item in hard steps, like an old progress bar.' },
            { name: 'The hourglass flip', text: "A small block flips over end to end in place of the icon's glyph, like an hourglass turning." },
        ],
    },
    grotesk: {
        shape: [
            { name: 'The transit board', text: 'A thick primary rule down the start edge, the title bold and uppercase, the fix right-aligned.' },
            { name: 'The Swiss poster', text: 'A heavy black frame, a squared icon with a thick ring, the title extra bold.' },
            { name: 'The index card', text: 'A thin rule under the item and a red hairline near the icon, the fix underlined in a heavy stroke.' },
        ],
        arrival: [
            { name: 'Slides onto the grid', text: 'The item slides on from the side in hard geometric steps, snapping to the grid.' },
            { name: 'Stamps down', text: 'The item is stamped flat from no height in one hard linear motion.' },
            { name: 'Flips in', text: 'The item flips down from a right angle in three hard steps, like a transit board character.' },
        ],
        leave: [
            { name: 'Slides off the grid', text: 'The item slides off to the side in hard geometric steps, the mirror of Slides onto the grid.' },
            { name: 'Lifts away', text: 'The item is lifted away to no height in one hard linear motion, the mirror of Stamps down.' },
            { name: 'Flips out', text: 'The item flips up to a right angle in three hard steps, the mirror of Flips in.' },
        ],
        tone: [
            { name: 'The ruled edge', text: "A thick rule in the severity's colour down the start edge, geometric and flat." },
            { name: 'The boxed icon', text: "The icon alone carries a thick ring in the severity's colour; the plate stays plain." },
            { name: 'The ruled top', text: "A thick rule in the severity's colour across the top edge." },
        ],
        empty: [
            { name: 'The ruled line', text: 'One bold line of text under a thick black rule where the band would be.' },
            { name: 'The framed card', text: 'A heavy black frame with a calm bold sentence inside.' },
            { name: 'The ruled strip', text: 'A thick primary rule down the side, empty inside, one plain sentence.' },
        ],
        loading: [
            { name: 'The marching ticks', text: 'Bold primary ticks march along the bottom edge while it loads.' },
            { name: 'The grid runner', text: 'A thin primary bar runs across the item in hard geometric steps.' },
            { name: 'The flap flip', text: "A squared block flips side to side in place of the icon's glyph, like a transit board flap." },
        ],
    },
    lapis: {
        shape: [
            { name: 'The girih tile', text: 'A gold double frame over a faint star pattern, the title in the display serif, the fix right-aligned.' },
            { name: 'The gilt roundel', text: 'A gold rule down the start edge, the icon ringed in gold, the title in italic serif.' },
            { name: 'The manuscript margin', text: 'Two fine gold rules beside the icon, the title in the display serif, the fix wavy-underlined.' },
        ],
        arrival: [
            { name: 'Unfurls', text: 'The item unrolls downward from a rolled edge at the top, slowing as it settles, like a scroll opening.' },
            { name: 'Illuminated in', text: "A band of gold light sweeps across the item left to right as it reveals, like an illuminator's wash." },
            { name: 'Inked in', text: 'The item spreads outward from a point near the icon, like ink soaking into vellum.' },
        ],
        leave: [
            { name: 'Rolled away', text: 'The item rolls back up toward its rolled edge, the mirror of Unfurls.' },
            { name: 'Shadow drawn over', text: 'A band sweeps across the item right to left as it withdraws, the mirror of Illuminated in.' },
            { name: 'Ink retracts', text: 'The item draws back inward toward the point near the icon, the mirror of Inked in.' },
        ],
        tone: [
            { name: 'The gold edge', text: 'A fine gold-and-severity edge down the start side, as a ruled manuscript line.' },
            { name: 'The gilt icon', text: 'The icon alone carries the severity, ringed in gold like a roundel; the plate stays lapis.' },
            { name: 'The double rule', text: "A double rule in the severity's colour across the top edge." },
        ],
        empty: [
            { name: 'The vellum line', text: 'One italic line under a gold rule where the band would be, calm and settled.' },
            { name: 'The gilt panel', text: 'A gold-framed card with a centred italic sentence, like an empty cartouche.' },
            { name: 'The dashed border', text: 'A gold dashed frame, empty inside, one italic sentence.' },
        ],
        loading: [
            { name: 'The girih turns', text: 'The star pattern along the edge turns in place while it loads.' },
            { name: 'The illumination sweeps', text: 'A soft gold wash drifts back and forth across the item, like a lamp over a page.' },
            { name: 'The ink spreads', text: "A gold ring grows and recedes in place of the icon's glyph, like ink spreading and settling." },
        ],
    },
    nostromo: {
        shape: [
            { name: 'The CRT trace', text: 'Faint scanlines behind the item, the title in instrument mono, the fix right-aligned.' },
            { name: 'The indicator panel', text: 'A moulded plastic plate, the icon a lit indicator ring, the fix stacked below.' },
            { name: 'The label tape', text: 'A printed label-tape title in dark mono caps, a rule beneath the item.' },
        ],
        arrival: [
            { name: 'Scans in', text: 'The item rolls down from the top in hard steps, like a CRT frame scanning in.' },
            { name: 'Feeds in', text: 'The item feeds in from the side in hard steps, like a punch card drawn through a reader.' },
            { name: 'Warms up', text: 'The item grows from a smaller size and settles with a slight overshoot, like a tube warming up.' },
        ],
        leave: [
            { name: 'Scans out', text: 'The item rolls up and away in hard steps, the mirror of Scans in.' },
            { name: 'Ejects', text: 'The item feeds out to the side in hard steps, the mirror of Feeds in.' },
            { name: 'Cools down', text: 'The item shrinks back with a slight overshoot, the mirror of Warms up.' },
        ],
        tone: [
            { name: 'The indicator edge', text: "A moulded edge in the severity's colour down the start side." },
            { name: 'The lit indicator', text: "The icon alone lights in the severity's colour like a panel LED; the plate stays plastic beige." },
            { name: 'The tape band', text: "A band in the severity's colour across the top, like a strip of warning tape." },
        ],
        empty: [
            { name: 'The console line', text: 'One mono line where the band would be, no border, no icon.' },
            { name: 'The idle panel', text: 'A moulded plastic card with a calm sentence inside, like an idle console.' },
            { name: 'The scanlined strip', text: 'Faint scanlines behind a dashed frame, empty inside, one mono sentence.' },
        ],
        loading: [
            { name: 'The scan line', text: "A bright scanning dash sweeps along the item's edge while it loads." },
            { name: 'The indicator blinks', text: "A round indicator light blinks steadily in place of the icon's glyph." },
            { name: 'The tape feeds', text: "A ridged label tape feeds past in place of the icon's glyph." },
        ],
    },
};

/** Every theme now has its own bespoke pass; GENERIC is kept only as a documented fallback shape. @type {Record<string, Record<Aspect, Option[]>>} */
const IDEAS = Object.fromEntries(THEMES.map((t) => [t.name, BESPOKE[t.name] ?? GENERIC]));

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="attention"]'));

/* ------------------------------------------------- the review kit's text */

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
        `Six picks, each on its own. ${idea.shape[0].name} and ${idea.shape[1].name} are the shapes this theme's other components already use; shape 3 is new. ` +
        'Each row changes one thing only; the preview at the top shows what you ticked so far. ' +
        'Press Add item, Acknowledge, Tone, Empty and Loading at full speed and at ¼; the band keeps its row height steady in every state.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

const cellMarkup = () =>
    `<div class="kp-attention" data-aa role="region" aria-label="Needs attention"></div>
     <div class="aa-empty-panel" data-aa-empty-panel hidden></div>
     <div class="aa-loading-panel" data-aa-loading-panel hidden></div>`;

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-aa-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'aa-aspect';
    box.setAttribute('data-aa-aspect', id);
    box.setAttribute('aria-labelledby', `h-aa-${id}`);
    const head = document.createElement('div');
    head.className = 'aa-aspect__head';
    head.innerHTML = '<h3></h3><p></p>';
    head.firstElementChild.id = `h-aa-${id}`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'aa-trio';
    for (const at of [1, 2, 3]) {
        const cell = document.createElement('div');
        cell.className = 'aa-col';
        cell.setAttribute('data-aa-vary', id);
        cell.setAttribute('data-aa-option', String(at));
        cell.innerHTML =
            `<p class="aa-label"><span class="aa-label__no">${label} · ${at}</span> <span data-aa-name></span></p>` +
            `<p class="aa-desc" data-aa-desc></p><div class="aa-cell" data-aa-cell>${cellMarkup()}</div>`;
        trio.append(cell);
    }
    box.append(head, trio);
    rows.append(box);
}

/* ------------------------------------------------------- the picks */

/** @type {Record<string, Partial<Record<Aspect, string>>>} */
const ticked = {};
const theme = () => document.documentElement.getAttribute('data-theme') ?? 'formal';
const picks = () => /** @type {Record<Aspect, string>} */ (Object.fromEntries(ASPECTS.map(({ id }) => [id, ticked[theme()]?.[id] ?? '1'])));

/** Every cell this page carries, including the reference. @returns {HTMLElement[]} */
const allCells = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-aa-cell]')]);

function compose() {
    const now = picks();
    const previewCell = section.querySelector('[data-aa-preview]');
    for (const { id } of ASPECTS) if (previewCell?.getAttribute(`data-aa-${id}`) !== now[id]) previewCell?.setAttribute(`data-aa-${id}`, now[id]);
    for (const col of section.querySelectorAll('[data-aa-vary]')) {
        const vary = col.getAttribute('data-aa-vary');
        const option = col.getAttribute('data-aa-option') ?? '1';
        const cell = col.querySelector('[data-aa-cell]');
        for (const { id } of ASPECTS) {
            const value = id === vary ? option : now[id];
            if (cell?.getAttribute(`data-aa-${id}`) !== value) cell?.setAttribute(`data-aa-${id}`, value);
        }
        col.classList.toggle('aa-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-aa-picks]');
    const idea = IDEAS[theme()];
    if (words && idea) words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1].name}`).join(' · ');
    // Every cell's empty and loading panels carry that cell's own option,
    // whichever aspect the cell is varying.
    if (idea)
        for (const cell of allCells()) {
            const emptyPanel = cell.querySelector('[data-aa-empty-panel]');
            const loadingPanel = cell.querySelector('[data-aa-loading-panel]');
            const empty = idea.empty[Number(cell.getAttribute('data-aa-empty') ?? '1') - 1];
            const loading = idea.loading[Number(cell.getAttribute('data-aa-loading') ?? '1') - 1];
            if (emptyPanel && emptyPanel.textContent !== empty.text) emptyPanel.textContent = empty.text;
            if (loadingPanel && loadingPanel.dataset.name !== loading.name) {
                loadingPanel.dataset.name = loading.name;
                loadingPanel.textContent = loading.name;
            }
        }
}

section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* --------------------------------------------------------- the items */

/** @type {{ key: string, severity: 'critical' | 'warning' | 'info', title: string, text: string, fix: string }[]} */
let items = [
    { key: 'ring', severity: 'warning', title: 'Reservoir East is low', text: 'Below 20% since this morning.', fix: 'See the forecast' },
    { key: 'leak', severity: 'critical', title: 'Pressure drop at Pleinstraat', text: 'Fell 0.4 bar in ten minutes.', fix: 'Open the incident' },
];
let nextSeq = 1;
/** @type {'info' | 'warning' | 'critical'} */
let newTone = 'info';
/** @type {'normal' | 'empty' | 'loading'} */
let view = 'normal';

/** @param {HTMLElement} band */
const action = (/** @type {string} */ label) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kp-button kp-button--sm';
    b.textContent = label;
    return b;
};

const log = section.querySelector('[data-aa-log]');
const act = (/** @type {Event} */ event) => {
    event.preventDefault();
    const label = /** @type {HTMLElement} */ (event.currentTarget).textContent;
    if (log) log.textContent = `Fix pressed: ${label}.`;
};

/** Paint the current `items` onto every band, then mark any brand-new element as arriving. */
function paint() {
    for (const cell of allCells()) {
        const band = cell.querySelector('[data-aa]');
        const emptyPanel = cell.querySelector('[data-aa-empty-panel]');
        const loadingPanel = cell.querySelector('[data-aa-loading-panel]');
        if (!band) continue;
        const before = new Set([...band.children].map((el) => el.getAttribute('data-kp-key')));
        setAttention(
            band,
            items.map((item) => ({
                ...item,
                action: (() => {
                    const el = action(item.fix);
                    el.addEventListener('click', act);
                    return el;
                })(),
            })),
        );
        for (const el of [...band.children])
            if (el.classList.contains('kp-attention__item') && !before.has(el.getAttribute('data-kp-key')) && !el.hasAttribute('data-kp-leaving')) {
                el.setAttribute('data-kp-arriving', '');
                const clear = () => el.removeAttribute('data-kp-arriving');
                el.addEventListener('animationend', clear, { once: true });
                setTimeout(clear, 1600);
            }
        band.hidden = view !== 'normal';
        if (emptyPanel) emptyPanel.hidden = view !== 'empty';
        if (loadingPanel) loadingPanel.hidden = view !== 'loading';
    }
    const refBand = section.querySelector('[data-aa-ref]');
    if (refBand)
        setAttention(
            refBand,
            items.map((item) => ({
                ...item,
                action: (() => {
                    const el = action(item.fix);
                    el.addEventListener('click', act);
                    return el;
                })(),
            })),
        );
}

section.querySelector('[data-aa-add]')?.addEventListener('click', () => {
    nextSeq += 1;
    items = [
        ...items,
        {
            key: `item-${nextSeq}`,
            severity: newTone === 'critical' ? 'critical' : newTone === 'warning' ? 'warning' : 'info',
            title: `New reading needs a look (#${nextSeq})`,
            text: 'Added just now, on Add item.',
            fix: 'Open it',
        },
    ];
    view = 'normal';
    pressedView();
    paint();
});

section.querySelector('[data-aa-ack]')?.addEventListener('click', () => {
    if (!items.length) return;
    items = items.slice(1);
    view = 'normal';
    pressedView();
    paint();
});

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};
const pressedView = () => pressed('data-aa-view', view);

for (const b of section.querySelectorAll('[data-aa-view]'))
    b.addEventListener('click', () => {
        view = /** @type {typeof view} */ (b.getAttribute('data-aa-view') ?? 'normal');
        pressedView();
        paint();
    });

for (const b of section.querySelectorAll('[data-aa-tone]'))
    b.addEventListener('click', () => {
        newTone = /** @type {typeof newTone} */ (b.getAttribute('data-aa-tone') ?? 'info');
        pressed('data-aa-tone', newTone);
    });

attachAttention(section);
paint();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-aa-theme-name]')) el.textContent = LABEL[now] ?? now;
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    for (const col of section.querySelectorAll('[data-aa-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (col.getAttribute('data-aa-vary'))]?.[Number(col.getAttribute('data-aa-option')) - 1];
        const name = col.querySelector('[data-aa-name]');
        const desc = col.querySelector('[data-aa-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-aa-motion]')?.removeAttribute('hidden');

let rate = 1;
try {
    const kept = Number(localStorage.getItem('aa-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-aa-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-aa-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-aa-speed'));
        try {
            localStorage.setItem('aa-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();
