// research/character-actions: the ninth component of the character round
// (Kenny, 2026-10-05: "doe voort aan het project", after character-attention),
// built the way the trend tile, the meter and the attention band were in
// round 2: nothing bundled, every aspect picked on its own from three
// options, any combination composes.
//
// The list is the package's own: attachActionColumns() (js/actions.js) lays
// every row's buttons on shared columns — `.kp-action-list` is a CSS
// subgrid, so the browser sizes the columns; the script only names each
// button's column and the list's count. Every aspect is CSS only, in
// actions.css, keyed by one attribute each on the cell wrapping the list
// (`data-ac-shape`, `data-ac-loading`, `data-ac-arrival`, `data-ac-tone`,
// `data-ac-interactive`). js/actions.js is not changed; this module sets
// `data-kp-arriving` on a new row itself (the way character-attention's
// demo does, since attachActionColumns() does not mark an arrival) and
// hands a resolved row to leave() (js/motion.js) on its way out, so the
// leave is the arrival's own mirror played backwards.

import { attachActionColumns } from '../../js/actions.js';
import { leave } from '../../js/motion.js';
import { THEMES } from '../../js/theme-registry.js';

/** @typedef {{ name: string, text: string }} Option */
/** @typedef {'shape' | 'loading' | 'arrival' | 'tone' | 'interactive'} Aspect */

/** The five aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: 'The row, the divider, the column rail and the primary button at rest. Compare them as they stand.',
    },
    {
        id: 'loading',
        label: 'While loading',
        about: 'The picture in place of the rows while the list is still loading; it always moves. Press Loading.',
    },
    {
        id: 'arrival',
        label: 'How a row arrives and leaves',
        about: 'What a new row does as it joins the list, and the mirror of that on its way out. Press Add row, then Resolve top row.',
    },
    {
        id: 'tone',
        label: 'The tone of the rail',
        about: "How the primary column and a destructive action read beside an ordinary one. Compare INC-4459's Open and INC-4455's Remove…",
    },
    {
        id: 'interactive',
        label: 'Hover and focus',
        about: "The rail's answer to the pointer and the keyboard. Move the pointer over a row's buttons, or tab to one.",
    },
];

/**
 * Three options per aspect, for every theme: formal and titanium built from
 * the characters this round already gave them elsewhere; the other twenty
 * from their own group's bespoke pass (ideas-a.json … ideas-d.json, merged
 * here; the JSON files are removed once merged).
 * @type {Record<string, Record<Aspect, Option[]>>}
 */
const THEME_IDEAS = {
    formal: {
        shape: [
            {
                name: 'The engraved ledger row',
                text: 'A fine ruled line under each row, the buttons set as engraved labels, the primary boxed like a stamped figure.',
            },
            { name: 'The annual report row', text: 'A heavy rule under the row, the buttons set in the display serif, the primary underlined once.' },
            {
                name: 'The certificate row',
                text: 'A thin navy rule under the row, the primary button on a ribbon tab, the others plain text buttons.',
            },
        ],
        loading: [
            { name: 'The dotted leader', text: "A dotted leader is written on dot by dot along each skeleton row's foot." },
            { name: 'The ledger is ruled', text: "The ledger's rule is drawn across the skeleton stack, left to right, again and again." },
            { name: 'The seal is pressed', text: 'A navy seal ring presses onto the skeleton stack, lifts and presses again.' },
        ],
        arrival: [
            {
                name: 'Unrolled',
                text: 'The row unrolls downward from a rolled edge, slowing as it lands; on the way out it rolls back up, the mirror.',
            },
            {
                name: 'Stamped in',
                text: 'The row drops once from above and is stamped flat; on the way out it lifts once and is drawn away, the mirror.',
            },
            {
                name: 'Entered in the ledger',
                text: 'The row is ruled in from the left margin in three hard steps; on the way out it is ruled out to the right in the same steps, reversed.',
            },
        ],
        tone: [
            {
                name: 'The engraved tone',
                text: "The primary boxed like an engraved figure; a destructive button carries a hairline rule in its colour down its left edge, the accountant's red ink.",
            },
            { name: 'The ledger tone', text: "The primary underlined once in navy; a destructive button's label sits in italics on its own plate." },
            {
                name: 'The certificate tone',
                text: "The primary on a ribbon tab; a destructive button's ribbon carries its own colour instead of navy.",
            },
        ],
        interactive: [
            { name: 'The pressed plate', text: 'The row gains a faint engraved shadow on hover or focus-within, as a plate pressed a touch deeper.' },
            { name: 'The traced rule', text: 'A fine navy rule traces in along the row on hover or focus-within, left to right.' },
            { name: 'The lifted seal', text: "A focused button's ring reads as a thin seal ring; hovering the rail lifts its rule a shade darker." },
        ],
    },
    titanium: {
        shape: [
            { name: 'The milled rail', text: 'A brushed-grain line under each row, the buttons as flush machined buttons, the primary chamfered.' },
            { name: 'The instrument rail', text: 'A recessed channel holds the rail, the buttons condensed, the primary a toggle-switch shape.' },
            { name: 'The anodised rail', text: 'A rounded rail with the primary on a lit anodised tab, the others flush buttons.' },
        ],
        loading: [
            { name: 'The cutter runs', text: "A bright line runs along each skeleton row's edge, as a cutter pass." },
            { name: 'The knurl rolls', text: 'A knurled band along the top of the skeleton stack rolls in place.' },
            { name: 'The lathe turns', text: 'Ridges run down the skeleton stack, as a part turning on a lathe.' },
        ],
        arrival: [
            {
                name: 'Seated',
                text: 'The row drops into its slot from above, overshooting once before it seats; on the way out it lifts and overshoots once leaving, the mirror.',
            },
            {
                name: 'Milled in',
                text: "The row's edge is cut in from the left in hard steps, as a mill pass; on the way out it is cut away to the right in the same steps, reversed.",
            },
            {
                name: 'Clicked in',
                text: 'The row rotates a quarter turn and locks flat, like a dial click; on the way out it rotates back and lifts away, the mirror.',
            },
        ],
        tone: [
            {
                name: 'The machined tone',
                text: "The primary a flat tab in the accent colour with a square corner; a destructive button's tab carries its own colour the same way.",
            },
            {
                name: 'The alarm tone',
                text: "The primary's own ring lights fully in the accent, as a status lamp; a destructive button's ring lights in its colour.",
            },
            {
                name: 'The anodised tone',
                text: "A band of the accent colour runs across the primary's top edge; a destructive button's band carries its own colour.",
            },
        ],
        interactive: [
            { name: 'The warmed plate', text: 'The row warms a shade brighter on hover or focus-within, as a panel under a worklight.' },
            { name: 'The lit groove', text: 'The milled groove under the row lights along its length on hover or focus-within.' },
            {
                name: 'The chamfered edge',
                text: "A focused button's ring reads as a cut chamfer; hovering the rail raises its buttons a hair on a soft shadow.",
            },
        ],
    },
    light: {
        shape: [
            {
                name: 'The pinned rail',
                text: "The rail's top-right corner curls like a pinned paper slip, buttons flush right, the primary boxed like a small stamp.",
            },
            {
                name: 'The ruled memo rail',
                text: 'A heavy rule stands above the rail like a ledger line, the primary bold and boxed, the rest plain text buttons.',
            },
            {
                name: 'The sun-flag rail',
                text: 'A small flag tab holds the rail at its edge, the primary set apart and underlined, no frame around the rest.',
            },
        ],
        loading: [
            { name: 'The pencil marches', text: "A dashed pencil line marches along each skeleton row's foot while it loads." },
            { name: 'The sun sweeps', text: 'A soft band of sunlight sweeps down the skeleton stack.' },
            { name: 'The shadow turns', text: "A small shadow turns around the panel's edge like a sundial's gnomon." },
        ],
        arrival: [
            { name: 'Unfurls', text: 'The row unfurls downward from a curled top edge; on the way out it furls back up, the mirror.' },
            {
                name: 'Catches the light',
                text: 'The row grows from no height as the sun catches it; on the way out it slips from the light, the mirror.',
            },
            {
                name: 'Pinned down',
                text: 'The row is pinned down in two quick taps; on the way out it is unpinned in the same two taps, the mirror.',
            },
        ],
        tone: [
            {
                name: 'The sun-tinted edge',
                text: 'A warm tint of the primary or destructive colour edges the rail, as paper catches a bit of colour in the light.',
            },
            { name: 'The stamped tone', text: 'The primary is stamped solid in its colour; a destructive button is stamped solid in its own.' },
            {
                name: 'The banded top',
                text: "A band of the primary's colour runs along the rail's top edge; a destructive column carries its own band.",
            },
        ],
        interactive: [
            { name: 'The warmed paper', text: 'The row warms a shade on hover or focus-within, as paper catching a touch more light.' },
            { name: 'The traced rule', text: "A fine rule traces in along the row's foot on hover or focus-within, left to right." },
            { name: 'The lifted corner', text: 'The rail lifts a hair on a soft paper shadow on hover; the focus ring reads as a small pin.' },
        ],
    },
    dark: {
        shape: [
            { name: 'The status rail', text: 'A flush mono rail, a square LED standing in for the primary at rest, the rest plain readout buttons.' },
            {
                name: 'The panel gauge rail',
                text: 'An inset bezel frames the rail, the primary a recessed toggle, the rest condensed readout buttons.',
            },
            { name: 'The OLED chip rail', text: 'The rail goes almost dark, the primary a glowing chip, the rest flush links.' },
        ],
        loading: [
            { name: 'The scanline marches', text: "An LED-coloured dashed line marches along each skeleton row's foot while it loads." },
            { name: 'The gauge sweeps', text: 'A soft band of panel light sweeps down the skeleton stack.' },
            { name: 'The LED pulses', text: "The skeleton rail's own ring pulses its size outward and back, like a status LED." },
        ],
        arrival: [
            {
                name: 'Powers up',
                text: 'The row lights up from no height, overshooting once as it settles; on the way out it powers down to no height, the mirror.',
            },
            {
                name: 'Scans in',
                text: 'The row is scanned in from the left in hard steps; on the way out it is scanned away to the right in the same steps, the mirror.',
            },
            { name: 'Locks in', text: 'The row drops into place and locks flat; on the way out it lifts and is drawn away, the mirror.' },
        ],
        tone: [
            { name: 'The LED edge', text: 'A thin LED-coloured edge marks the primary or destructive column down its inline-start side.' },
            {
                name: 'The lit lamp',
                text: 'The primary lights fully in its colour like a status lamp; a destructive button lights the same way in its own.',
            },
            { name: 'The glow bar', text: "A glowing bar sits along the primary column's top edge; a destructive column carries its own glow bar." },
        ],
        interactive: [
            { name: 'The warmed panel', text: "The row's panel lightens a shade on hover or focus-within, as a backlight coming up." },
            { name: 'The lit groove', text: "A groove along the row's inline-start edge lights up on hover or focus-within." },
            {
                name: 'The raised bezel',
                text: "The rail lifts on a soft panel shadow on hover; the focused button's ring reaches the row's edge like a bezel.",
            },
        ],
    },
    cyberpunk: {
        shape: [
            { name: 'The neon rail', text: "A neon rule glows along the rail's edge, the primary lit with a glow, the rest bare neon links." },
            {
                name: 'The glitch rail',
                text: 'The rail carries a chromatic double edge, the primary in a jagged outline, the rest sit on a faint scanline band.',
            },
            { name: 'The holo rail', text: 'The rail reads as a glowing holo pane, the primary ringed in light, the rest flush glow buttons.' },
        ],
        loading: [
            { name: 'The scanline marches', text: "A neon dashed line marches along each skeleton row's edge while it loads." },
            { name: 'The glitch sweeps', text: 'A neon band sweeps down the skeleton stack in hard jittering steps.' },
            { name: 'The ping pulses', text: "The skeleton rail's own ring pulses outward in neon, like a radar ping." },
        ],
        arrival: [
            {
                name: 'Boots onto the HUD',
                text: 'The row reveals top-down as if a scanline draws it in; on the way out it is scanned off the HUD top-down, the mirror.',
            },
            {
                name: 'Glitch-snaps in',
                text: 'The row jitters sideways in hard steps before it locks; on the way out it glitch-snaps away in the same steps, the mirror.',
            },
            { name: 'Rezzes in', text: 'The row tips up from flat and snaps upright; on the way out it tips down flat and derezzes, the mirror.' },
        ],
        tone: [
            { name: 'The chromatic edge', text: 'A two-colour chromatic edge marks the primary or destructive column.' },
            {
                name: 'The lit core',
                text: "The primary glows at full saturation in its colour; a destructive button's core glows the same way in its own.",
            },
            {
                name: 'The glow bar',
                text: "A blurred neon bar sits along the primary column's top edge; a destructive column carries its own glow bar.",
            },
        ],
        interactive: [
            { name: 'The lit rail', text: "The rail's background lifts into a neon tint on hover or focus-within." },
            { name: 'The traced edge', text: "A neon rule traces in along the row's inline-start edge on hover or focus-within." },
            { name: 'The ping focus', text: "The focused button's ring reads as a radar ping; hovering the rail brightens its glow a shade." },
        ],
    },
    synthwave: {
        shape: [
            {
                name: 'The horizon rail',
                text: "A neon horizon line glows along the rail's top edge, the primary a sun-disc button, the rest bare neon links.",
            },
            { name: 'The VCR rail', text: 'A scanline overlay sits over the rail, the primary a square button, the rest mono-digit links.' },
            {
                name: 'The marquee rail',
                text: 'A neon-framed rail glows at its border, the primary a chamfered marquee button, the rest flush links.',
            },
        ],
        loading: [
            { name: 'The grid scrolls', text: "The horizon's grid lines scroll past along each skeleton row's foot while it loads." },
            { name: 'The scanline sweeps', text: 'A scanline sweeps down the skeleton stack like a VCR tracking bar.' },
            { name: 'The marquee chases', text: "Lights chase around the skeleton rail's own ring like an arcade marquee." },
        ],
        arrival: [
            {
                name: 'Rises over the horizon',
                text: 'The row rises up from below the fold like a sun over a grid horizon; on the way out it sets below the horizon, the mirror.',
            },
            {
                name: 'Tracks in',
                text: 'The row jitters in from the left like a tape-tracking error settling; on the way out it tracks away to the right, the mirror.',
            },
            {
                name: 'Lights up',
                text: 'The row drops and bounces once as its marquee lights come on; on the way out it lifts and lights down, the mirror.',
            },
        ],
        tone: [
            { name: 'The sunset edge', text: 'A neon sunset-coloured edge marks the primary or destructive column.' },
            {
                name: 'The lit sign',
                text: "The primary lights fully in its neon colour; a destructive button's sign lights the same way in its own.",
            },
            {
                name: 'The marquee band',
                text: "A glowing band runs along the primary column's top edge; a destructive column carries its own marquee band.",
            },
        ],
        interactive: [
            { name: 'The lit horizon', text: "The rail's background glows a touch brighter along its horizon line on hover or focus-within." },
            { name: 'The traced grid', text: "A grid line along the row's foot lights up on hover or focus-within." },
            { name: 'The chasing focus', text: "The focused button's ring reads as a marquee bulb; hovering the rail lifts it a hair." },
        ],
    },
    pastel: {
        shape: [
            {
                name: 'The sticker rail',
                text: 'A fat rounded border edges the rail like a sticker, the primary a soft rounded pill, the rest plain buttons.',
            },
            {
                name: 'The washi rail',
                text: "A strip of patterned washi tape sits along the rail's top, the primary underlined, the rest plain links.",
            },
            { name: 'The cloud rail', text: 'The rail sits on a fully rounded cloud shape with a soft shadow, the primary a tiny rounded button.' },
        ],
        loading: [
            { name: 'The stitches march', text: "A dotted stitch line marches along each skeleton row's foot while it loads." },
            { name: 'The wash sweeps', text: 'A soft pastel wash sweeps down the skeleton stack.' },
            { name: 'The bubble breathes', text: "The skeleton rail's own ring breathes gently in and out while it loads." },
        ],
        arrival: [
            { name: 'Floats in', text: 'The row floats down and bounces gently once as it lands; on the way out it floats away, the mirror.' },
            {
                name: 'Peels on',
                text: 'The row peels on with a little rotate, like a sticker pressed down; on the way out it peels off the other way, the mirror.',
            },
            { name: 'Pops in', text: 'The row pops up from small with a bouncy overshoot; on the way out it pops back down to small, the mirror.' },
        ],
        tone: [
            { name: 'The crayon edge', text: 'A soft crayon-coloured edge marks the primary or destructive column.' },
            { name: 'The candy dot', text: 'The primary turns a solid candy colour; a destructive button turns a solid candy colour in its own.' },
            {
                name: 'The ribbon band',
                text: "A ribbon-coloured band runs along the primary column's top edge; a destructive column carries its own ribbon band.",
            },
        ],
        interactive: [
            { name: 'The warmed sticker', text: 'The row warms a shade on hover or focus-within, like a sticker catching the light.' },
            { name: 'The traced ribbon', text: "A ribbon-coloured rule traces in along the row's foot on hover or focus-within." },
            {
                name: 'The bouncy focus',
                text: "The focused button's ring sits soft and round; hovering the rail lifts it a hair with a gentle bounce shadow.",
            },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'The prompt row',
                text: 'A phosphor hairline under each row, buttons set like shell flags, the primary ending in a block cursor.',
            },
            {
                name: 'The man-page rail',
                text: "Every button reads as a bracketed hotkey in mono, the primary's bracket lit brighter than the rest.",
            },
            { name: 'The curses panel', text: 'A boxed double rule frames the rail like a curses window, the primary rendered in reverse video.' },
        ],
        loading: [
            { name: 'The cursor blinks', text: "A block cursor steps along each skeleton row's foot, on and off in hard frames." },
            { name: 'Lines scroll past', text: 'Rows of phosphor dashes scroll upward through the panel like a log buffer filling.' },
            { name: 'Static snows', text: 'A field of mono noise jumps between fixed frames across the panel, as a CRT losing signal.' },
        ],
        arrival: [
            {
                name: 'Printed',
                text: 'The row prints in character by character from the left; on the way out it is erased from the right, the mirror.',
            },
            {
                name: 'Paged in',
                text: 'The row drops in from above in three hard jumps, as a page feed; on the way out it jumps away below in the same three, the mirror.',
            },
            {
                name: 'Scrolled up',
                text: 'The row scrolls up into place from below the fold; on the way out it keeps scrolling, up and off the top.',
            },
        ],
        tone: [
            {
                name: 'The ANSI tone',
                text: 'The primary sits in reverse video, phosphor on black; a destructive button carries bold red ANSI text instead.',
            },
            {
                name: 'The bell tone',
                text: "The primary glows with a soft phosphor bloom; a destructive button's label is bracketed by a static bell mark, ␇, in its colour.",
            },
            {
                name: 'The flagged tone',
                text: "The primary's label is prefixed by a static ›, as a run flag; a destructive button is prefixed by a static !, in its colour.",
            },
        ],
        interactive: [
            { name: 'The cursor row', text: "A solid phosphor block sits at the row's start on hover or focus-within, as a resting cursor." },
            {
                name: 'The reverse-video rail',
                text: "The rail's own box inverts to phosphor-on-black on hover or focus-within, a true reverse-video pick.",
            },
            {
                name: 'The echoed rail',
                text: 'Every button underlines on hover or focus-within, and the focused one sits inside a dotted terminal box.',
            },
        ],
    },
    forest: {
        shape: [
            {
                name: 'The trail markers',
                text: "A contour-coloured hairline under each row, every button carrying a small blaze dot, the primary's blaze larger.",
            },
            {
                name: "The ranger's clipboard",
                text: 'The rail sits on a paper-toned tab with rounded top corners and a soft shadow, a rule above it in trail brown.',
            },
            {
                name: 'The contour rail',
                text: 'A double hairline under the row reads as two elevation bands; the primary sits a touch above the lower one.',
            },
        ],
        loading: [
            { name: 'Fog rolls across', text: 'Diagonal contour lines scroll across the panel, as fog crossing a ridge line.' },
            { name: 'Leaves drift', text: 'A scatter of small dots drifts sideways through the panel, as leaves carried past a window.' },
            { name: 'The compass spins', text: 'A ringed needle turns steadily in the middle of the panel, reading a bearing that never settles.' },
        ],
        arrival: [
            {
                name: 'Blazed in',
                text: 'The row grows outward from a single blaze point until it fills; on the way out it shrinks back to that point, the mirror.',
            },
            {
                name: 'Crested the ridge',
                text: 'The row rises from below and settles past a slight crest; on the way out it sinks back below the ridge, the mirror.',
            },
            { name: 'Pressed like a leaf', text: 'The row tilts in and flattens onto the page; on the way out it lifts and tilts away, the mirror.' },
        ],
        tone: [
            {
                name: 'The blazed tone',
                text: "The primary carries a filled blaze dot in the accent colour; a destructive button's blaze dot carries its own colour.",
            },
            {
                name: 'The waypoint tone',
                text: 'The primary is shaped as a waypoint pin, pointed at the foot; a destructive button takes the same pin shape in its colour.',
            },
            {
                name: 'The canopy tone',
                text: "The primary sits under a thick canopy-coloured top edge; a destructive button's top edge carries its own colour instead.",
            },
        ],
        interactive: [
            { name: 'The pressed trail', text: 'The row gains a soft inset shadow on hover or focus-within, as ground pressed underfoot.' },
            { name: 'The lit clearing', text: "The row's background lightens a shade on hover or focus-within, as sun breaking through canopy." },
            { name: 'The blazed edge', text: "A small blaze dot appears at the row's start on hover or focus-within, in the accent colour." },
        ],
    },
    'high-contrast': {
        shape: [
            {
                name: 'The framed rail',
                text: 'A thick solid rule boxes the rail, every button plain, the primary filled solid with no rounding anywhere.',
            },
            {
                name: 'The inverse rail',
                text: "The rail's own box inverts fully, foreground on background, the primary picked out with a signal fill.",
            },
            {
                name: 'The signal rail',
                text: 'A thick double rule separates the rail from the row; the primary carries a thick signal-coloured top edge.',
            },
        ],
        loading: [
            { name: 'The strobe bar', text: "A hard black-and-white bar jumps between two fixed positions along the panel's foot, no fade." },
            { name: 'The signal flashes', text: "A solid signal-coloured block jumps between fixed points across the panel's foot." },
            { name: 'The marching frame', text: "A thick striped segment jumps step by step around the panel's border." },
        ],
        arrival: [
            {
                name: 'Snapped in',
                text: 'The row snaps into place from above in one hard step; on the way out it snaps away below in the same one step, the mirror.',
            },
            {
                name: 'Framed in',
                text: 'A thick frame scales open around the row in two hard steps; on the way out it scales shut in the same two, the mirror.',
            },
            {
                name: 'Barred in',
                text: 'The row is revealed left to right behind a signal bar in three hard steps; on the way out it is covered right to left in the same three, the mirror.',
            },
        ],
        tone: [
            {
                name: 'The inverse tone',
                text: 'The primary inverts fully, background on foreground; a destructive button fills solid in its own colour with a thick border.',
            },
            {
                name: 'The signal tone',
                text: 'The primary carries a thick signal-coloured top bar; a destructive button carries a thick striped top bar in its own colour.',
            },
            {
                name: 'The framed tone',
                text: 'The primary sits inside a double rule; a destructive button sits inside one very thick rule in its own colour.',
            },
        ],
        interactive: [
            { name: 'The inverted row', text: 'The whole row inverts, background on foreground, on hover or focus-within.' },
            { name: 'The barred row', text: "A thick signal-coloured bar appears at the row's start on hover or focus-within." },
            { name: 'The framed button', text: 'A focused button gets a thick double outline; hovering the rail thickens its border.' },
        ],
    },
    sepia: {
        shape: [
            {
                name: 'The letterpress row',
                text: 'Every button sits a touch impressed into the page, serif capitals, the primary impressed deeper than the rest.',
            },
            {
                name: 'The ticket stub rail',
                text: 'A perforated-looking dashed edge sits before the rail, the primary set on a small torn-edge tab.',
            },
            { name: 'The barograph rail', text: 'A fine inked rule with small ticks sits under the row, the primary boxed plainly in the same ink.' },
        ],
        loading: [
            { name: 'Ink bleeds', text: "A soft blot of sepia ink grows outward from the panel's centre, again and again." },
            { name: 'The quill writes', text: 'A thin ink line sweeps left to right beneath the rows, as a quill tracing a page.' },
            { name: 'The stub is punched', text: 'A row of small round punch holes travels down the panel, as a ticket roll feeding through.' },
        ],
        arrival: [
            {
                name: 'Inked in',
                text: 'The row tilts in from a slight skew and settles flat; on the way out it tilts back and lifts away, the mirror.',
            },
            {
                name: 'Pressed',
                text: 'The row is squeezed flat once as it is stamped in; on the way out it is squeezed flat once more as it lifts, the mirror.',
            },
            {
                name: 'Torn in',
                text: 'The row enters from the right edge, as if torn from the stub; on the way out it tears off the same edge, continuing right.',
            },
        ],
        tone: [
            {
                name: 'The letterpress tone',
                text: 'The primary sits impressed a touch deeper; a destructive button carries no fill at all, only its own colour of ink.',
            },
            {
                name: 'The ticket tone',
                text: "The primary sits on a stub-coloured tab; a destructive button's edge is dashed, in its own colour, as a line to tear along.",
            },
            {
                name: 'The barograph tone',
                text: 'The primary is underlined once in a thin ink trace; a destructive button is underlined in a dotted trace, in its own colour.',
            },
        ],
        interactive: [
            { name: 'The warmed page', text: "The row's background warms a shade on hover or focus-within, as paper under lamp light." },
            { name: 'The traced line', text: 'A thin ink line grows under the row on hover or focus-within, left to right.' },
            { name: 'The pressed corner', text: 'A focused button reads as softly embossed; hovering the rail lifts it the faintest hair.' },
        ],
    },
    blueprint: {
        shape: [
            {
                name: 'The ruled rail',
                text: "Short dimension ticks mark the rail's edge, the primary boxed like a drafting stamp with square corners.",
            },
            {
                name: 'The title block',
                text: "The rail sits boxed like a drawing's title block, small caps throughout, the primary filled in a solid cell.",
            },
            {
                name: 'The grid rail',
                text: 'A faint graph-paper grid sits behind the rail only, the primary outlined as a construction line drawn solid.',
            },
        ],
        loading: [
            { name: 'The pen plots', text: "A bright plotted line sweeps down the panel, as a chart recorder's pen tracing a reading." },
            { name: 'Grid lines scroll', text: 'A faint graph-paper grid scrolls diagonally across the panel.' },
            { name: 'The dimension ticks march', text: "A row of dimension ticks marches along the panel's foot." },
        ],
        arrival: [
            {
                name: 'Drafted in',
                text: 'The row is revealed left to right as if a ruler drew it; on the way out it is covered right to left, the mirror.',
            },
            {
                name: 'Plotted in',
                text: 'The row rises as a pen lifting a plotted point, settling past a slight overshoot; on the way out it drops back below, the mirror.',
            },
            {
                name: 'Ruled in',
                text: 'The row is ruled in from the left margin in hard steps; on the way out it is ruled out to the right in the same steps, the mirror.',
            },
        ],
        tone: [
            {
                name: 'The inked tone',
                text: 'The primary fills solid with a crisp edge, as a line inked over pencil; a destructive button fills solid in its own colour with a cut corner.',
            },
            {
                name: 'The dimensioned tone',
                text: 'The primary carries small dimension-arrow ticks at each end; a destructive button carries the same ticks in its own colour.',
            },
            {
                name: 'The stamped tone',
                text: 'The primary sits inside a double rule, as an approval stamp; a destructive button sits inside one thick rule in its own colour.',
            },
        ],
        interactive: [
            { name: 'The traced rail', text: 'A ruled line draws itself under the rail, growing from the start edge, on hover or focus-within.' },
            { name: 'The lit grid', text: "The rail's grid brightens and gains a soft cyan-toned glow on hover or focus-within." },
            {
                name: 'The snapped corner',
                text: "A focused button's ring reads as a right-angle drafting corner; hovering the rail adds a tick at the row's end.",
            },
        ],
    },
    solstice: {
        shape: [
            {
                name: 'The horizon rail',
                text: "A warm glow lifts from the row's foot like the sun at the horizon, and the primary button catches the last of the light.",
            },
            {
                name: 'The ember rail',
                text: 'The rail sits on a bed of banked embers, a rounded amber tint behind the buttons, warming at the edges.',
            },
            {
                name: 'The rising rail',
                text: 'A thin amber rule stands before the rail like a sunrise line, and the primary button sits a touch higher, catching first light.',
            },
        ],
        loading: [
            {
                name: 'The sun crawls the horizon',
                text: "A low amber glow travels along the skeleton stack's foot, from one edge to the other and back.",
            },
            { name: 'The embers breathe', text: 'A bank of embers under the stack swells and settles, breathing in and out.' },
            { name: 'The light swings', text: 'A small ember swings slowly from one side of the stack to the other, like a lantern at dusk.' },
        ],
        arrival: [
            {
                name: 'Rises over the horizon',
                text: 'The row rises up from below like the sun clearing the horizon; on the way out it sets back below, the mirror.',
            },
            {
                name: 'Kindles',
                text: 'The row catches like a flame from its own foot, growing upward; on the way out it dims back down to nothing, the mirror.',
            },
            {
                name: 'Drifts in on embers',
                text: "The row drifts sideways into place in three soft embers' steps; on the way out it drifts away the same three steps, reversed.",
            },
        ],
        tone: [
            {
                name: 'The glowing tone',
                text: 'The primary button glows in its own amber light; a destructive one glows in its own colour the same way.',
            },
            {
                name: 'The banked tone',
                text: 'The primary button banks a line of light along its foot; a destructive one banks the same line in its own colour.',
            },
            {
                name: 'The risen tone',
                text: 'The primary button is lifted and glowing, caught in first light; a destructive one is underlined in its own colour, like rust.',
            },
        ],
        interactive: [
            { name: 'The warmed row', text: "A warm glow lifts from the row's foot on hover or focus-within, as the horizon catching light." },
            {
                name: 'The kindled edge',
                text: "A rule along the row's inline-start edge lights amber on hover or focus-within, with a faint glow spilling inward.",
            },
            { name: 'The lifted ember', text: "The rail's own box lifts on a warm amber glow on hover or focus-within." },
        ],
    },
    brutalism: {
        shape: [
            {
                name: 'The slab rail',
                text: 'A thick black rule under each row, the primary button cast with a hard offset shadow, like a slab dropped in place.',
            },
            { name: 'The sticker-sheet rail', text: 'The rail sits on its own bordered sticker, tilted a degree off true, peeled from a sheet.' },
            {
                name: 'The poster-block rail',
                text: "The row's labels run in bold capitals, the primary button boxed and offset like type stamped on a poster.",
            },
        ],
        loading: [
            { name: 'The stamp lands', text: 'A black block stamps down onto the skeleton stack and springs back, again and again.' },
            { name: 'The poster peels', text: 'A hard diagonal strip peels across the skeleton stack in sharp jumps.' },
            { name: 'The sticker hops', text: "A bordered sticker hops across the skeleton stack's foot in four hard jumps." },
        ],
        arrival: [
            { name: 'Slams in', text: 'The row slams down from above and lands flat; on the way out it slams back up the same way, the mirror.' },
            {
                name: 'Stamped flat',
                text: 'The row is stamped down to size in two hard steps; on the way out it is stamped back up to size, reversed.',
            },
            {
                name: 'Shoved in',
                text: 'The row is shoved in from the left in four hard steps; on the way out it is shoved back out to the left, reversed.',
            },
        ],
        tone: [
            {
                name: 'The offset tone',
                text: 'The primary button carries a hard offset shadow in its own colour; a destructive one carries the same offset in its own colour.',
            },
            {
                name: 'The branded tone',
                text: 'The primary button is a solid block in its own colour; a destructive one is a solid block in its own colour, no softening.',
            },
            {
                name: 'The torn tone',
                text: "The primary button's corner is torn off at an angle; a destructive one is torn off the opposite corner.",
            },
        ],
        interactive: [
            {
                name: 'The pressed slab',
                text: "The rail's offset shadow shrinks and the rail slides toward it on hover or focus-within, as a slab pressed flat.",
            },
            { name: 'The marked edge', text: "A thick black rule along the row's inline-start edge appears on hover or focus-within." },
            {
                name: 'The raised block',
                text: "The rail's offset shadow grows larger in the primary colour on hover or focus-within, lifting the block off the page.",
            },
        ],
    },
    deco: {
        shape: [
            { name: 'The gilt-frame rail', text: 'The primary button sits behind a double inset frame, like gilt moulding around a figure.' },
            {
                name: 'The marquee rail',
                text: "A row of small lit bulbs runs along the row's foot, the labels set wide in the display face, as a marquee reads its programme.",
            },
            { name: 'The skyscraper rail', text: "The primary button's corner is stepped back like a skyscraper's setback silhouette." },
        ],
        loading: [
            { name: 'The marquee bulbs chase', text: "A line of small bulbs chases along the skeleton stack's middle, one lighting after another." },
            { name: 'The sunburst opens', text: "A gilt sunburst pattern opens upward from the skeleton stack's foot in hard rays." },
            { name: 'The spotlight sweeps', text: 'A gilt spotlight beam sweeps across the skeleton stack, back and forth.' },
        ],
        arrival: [
            {
                name: 'Unveiled',
                text: 'The row is unveiled from the left like a curtain drawn back; on the way out it is curtained again from the right, the mirror.',
            },
            {
                name: 'Lit in',
                text: "The row lights up from the left in five quick steps, as a marquee's bulbs catching in sequence; on the way out it darkens the same way, reversed.",
            },
            {
                name: 'Ascends',
                text: 'The row rises into place in hard steps, like a skyscraper under construction; on the way out it descends the same steps, reversed.',
            },
        ],
        tone: [
            {
                name: 'The gilt tone',
                text: 'The primary button sits behind a double gilt frame; a destructive one sits behind the same frame in its own colour.',
            },
            {
                name: 'The marquee tone',
                text: 'The primary button carries a lit bulb-line along its top edge; a destructive one carries the same line in its own colour.',
            },
            {
                name: 'The spotlight tone',
                text: 'The primary button sits inside a soft spotlight glow; a destructive one sits inside the same glow in its own colour.',
            },
        ],
        interactive: [
            { name: 'The lit frame', text: "A gilt frame lights along the row's inset edge on hover or focus-within." },
            {
                name: 'The chasing bulbs',
                text: "A line of small bulbs lights along the row's top edge on hover or focus-within, as a marquee waking.",
            },
            {
                name: 'The elevated marquee',
                text: "The rail lifts on a gilt glow on hover or focus-within, as a marquee's own light spilling outward.",
            },
        ],
    },
    phantom: {
        shape: [
            { name: 'The evidence-card rail', text: 'The primary button is a stark inverted plate, like a card stamped for the file.' },
            {
                name: 'The calling-card rail',
                text: 'A dashed perforation runs under the row, the labels set a touch askew, as a calling card slipped under a door.',
            },
            { name: 'The ransom-note rail', text: 'Each button sits at its own small tilt, cut-paper letters pasted at a slight angle to the next.' },
        ],
        loading: [
            { name: 'The stamp lands', text: "A dark ring stamps down onto the skeleton stack's middle and lifts away, again and again." },
            { name: 'The calling card is punched', text: "A row of small holes punches across the skeleton stack's middle, left to right." },
            {
                name: 'The string is pulled',
                text: 'A diagonal string slides across the skeleton stack, as if pulled taut from one corner to the other.',
            },
        ],
        arrival: [
            {
                name: 'Slapped down',
                text: 'The row is slapped down from above at a slight tilt in two hard steps; on the way out it is lifted away the same two steps, reversed.',
            },
            {
                name: 'Punched in',
                text: 'The row is punched in from the left in four hard steps, as a card through a slot; on the way out it is punched back out, reversed.',
            },
            {
                name: 'Snipped in',
                text: 'The row is revealed left to right as if snipped free of the stack; on the way out it is snipped away the same way, reversed.',
            },
        ],
        tone: [
            { name: 'The stamped tone', text: 'The primary button is a stark inverted plate; a destructive one is a solid plate in its own colour.' },
            {
                name: 'The punched tone',
                text: 'The primary button carries a dashed perforation along its foot; a destructive one carries the same perforation in its own colour.',
            },
            {
                name: 'The ransom tone',
                text: 'The primary button sits at its own tilt in a solid block; a destructive one tilts the other way in its own colour.',
            },
        ],
        interactive: [
            { name: 'The inked press', text: 'The row darkens a shade, as a plate freshly inked, on hover or focus-within.' },
            {
                name: 'The traced perforation',
                text: "A dashed line appears along the row's top edge on hover or focus-within, as a perforation newly torn.",
            },
            {
                name: 'The snipped edge',
                text: "A focused button's corner reads as freshly snipped; hovering the rail nudges it a touch sideways, as a card slid free.",
            },
        ],
    },
    'shade-light': {
        shape: [
            { name: 'The pencil-shaded rail', text: "A faint pencil hatch shades the row's foot, as graphite laid lightly across the page." },
            { name: 'The leaf-shade rail', text: "Soft round shadows dapple the row's foot, as leaves letting through broken light." },
            { name: 'The window-light rail', text: 'A pale diagonal band of light crosses the row, as sun falling through a window.' },
        ],
        loading: [
            { name: 'Pencil in the shade', text: 'A soft pencil hatch slides along the skeleton stack, as a hand shading in the margin.' },
            {
                name: 'The leaf shade drifts',
                text: "A soft round shadow drifts across the skeleton stack, as a leaf's shade moving with the breeze.",
            },
            { name: 'Leaves sway', text: 'Two soft round shadows sway gently side to side across the skeleton stack, as leaves overhead stirring.' },
        ],
        arrival: [
            {
                name: 'Drawn in',
                text: 'The row is drawn in sideways at a slight tilt, as a pencil stroke laid down; on the way out it is drawn away the same way, the mirror.',
            },
            {
                name: 'Shaded in',
                text: 'The row grows downward from its top edge, as shade falling over the page; on the way out it lifts back up, the mirror.',
            },
            {
                name: 'Lit in',
                text: 'The row rises gently from below, as light finding its way in; on the way out it settles back down, the mirror.',
            },
        ],
        tone: [
            {
                name: 'The traced tone',
                text: 'The primary button is underlined once in its own colour; a destructive one is underlined once in its own colour.',
            },
            {
                name: 'The dappled tone',
                text: 'The primary button sits in a soft dapple of its own colour; a destructive one sits in the same soft dapple of its own colour.',
            },
            {
                name: 'The lit tone',
                text: "A pale band of light in the primary's colour crosses its button; a destructive one is crossed by the same band in its own colour.",
            },
        ],
        interactive: [
            { name: 'The warmed page', text: "The row's background warms a shade on hover or focus-within, as paper catching a little more light." },
            {
                name: 'The pencil trace',
                text: 'A soft pencil hatch appears along the row on hover or focus-within, with a rule lighting its inline-start edge.',
            },
            { name: 'The lit edge', text: "The rail's own box gains a soft, paper-coloured glow on hover or focus-within." },
        ],
    },
    'shade-dark': {
        shape: [
            {
                name: 'The glow rail',
                text: 'A hairline rule under each row with a soft pool of light at its near corner; the primary button carries its own close glow.',
            },
            { name: 'The gauge rail', text: 'The action rail sits in a sunken gauge box; the primary is a small lit, round chip.' },
            { name: 'The halo rail', text: 'The primary sits inside a glowing halo ring; the rest of the rail stays plain and dark.' },
        ],
        loading: [
            { name: 'The ember line', text: "A line of glowing embers marches along each skeleton row's foot while it loads." },
            { name: 'The drifting pool', text: 'A soft pool of light drifts back and forth across the skeleton stack, like a lamp swaying.' },
            { name: 'The pulsing halo', text: "A ring of light around the rail's edge pulses outward and back in place of its buttons." },
        ],
        arrival: [
            {
                name: 'Lamp swings in',
                text: 'The row swings down from the top edge like a pull-chain lamp and settles; on the way out it swings back up, the mirror.',
            },
            {
                name: 'Glow blooms',
                text: 'The row grows from a smaller size as if a lamp were turned toward it; on the way out it shrinks back, the mirror.',
            },
            {
                name: 'Flickers in',
                text: 'The row rises in three uneven steps, like a lamp struggling to catch; on the way out it sinks away the same uneven way, the mirror.',
            },
        ],
        tone: [
            { name: 'The glowing edge', text: "A glowing edge in the primary's or destructive's colour runs down the button's near side." },
            { name: 'The halo button', text: "The primary and a destructive button each sit inside their own colour's halo ring." },
            { name: 'The underlit band', text: "A band of light in the primary's or destructive's colour rises from beneath the button's top edge." },
        ],
        interactive: [
            { name: 'The warmed glow', text: "The row's background gains a soft pool of light on hover or focus-within." },
            { name: 'The lit filament', text: "A glowing line along the row's inline-start edge appears on hover or focus-within." },
            { name: 'The raised lamp', text: "The rail lifts on a soft glow on hover, and the focused button's ring glows." },
        ],
    },
    retro: {
        shape: [
            { name: 'The dialog rail', text: "A raised grey bevel frames the rail, like a 1995 dialog's button row, the primary beveled outward." },
            { name: 'The status rail', text: 'A sunken bevel holds the rail, like a status bar, the buttons set in the DOS mono font.' },
            { name: 'The title rail', text: 'A hard navy title strip sits above the rail, the primary a beveled button with a drop shadow.' },
        ],
        loading: [
            { name: 'The marquee rail', text: "A bordered bar with a marching dashed fill scrolls along each skeleton row's foot while it loads." },
            { name: 'The scanning block', text: 'A solid block scans across the skeleton stack in hard steps, like an old progress bar.' },
            { name: 'The hourglass flip', text: "A small block flips end to end in the rail's place, like an hourglass turning." },
        ],
        arrival: [
            {
                name: 'Pops open',
                text: 'The row snaps open from no height in three hard steps, like a dialog box opening; on the way out it snaps shut the same way, the mirror.',
            },
            {
                name: 'Slides in off-screen',
                text: 'The row slides in from the side in hard steps, like a window dragged into place; on the way out it slides away the same way, the mirror.',
            },
            {
                name: 'Boots up',
                text: 'The row rises in three jerky steps, like a screen warming up; on the way out it sinks away the same jerky way, the mirror.',
            },
        ],
        tone: [
            { name: 'The beveled edge', text: "A thick solid bevel edge in the button's colour sits down its near side." },
            { name: 'The beveled lamp', text: 'The button alone carries its colour as a small beveled square lamp.' },
            { name: 'The title strip', text: "A thick solid strip in the button's colour sits across its top edge, like a coloured title bar." },
        ],
        interactive: [
            { name: 'The pressed bevel', text: "The row's bevel inverts to a pressed, sunken look on hover or focus-within." },
            { name: 'The marquee edge', text: "A dashed marquee line appears along the row's inline-start edge on hover or focus-within." },
            {
                name: 'The lit title',
                text: "The rail's title strip lights in the primary colour on hover, and the focused button gets a dotted DOS-style outline.",
            },
        ],
    },
    grotesk: {
        shape: [
            { name: 'The transit rail', text: "A thick primary rule runs down the rail's near edge, the buttons bold and uppercase, flush right." },
            { name: 'The poster rail', text: 'A heavy black frame boxes the rail, the primary squared with a thick ring.' },
            { name: 'The index rail', text: 'A thin rule under the row and a red hairline near the rail, the primary underlined in a heavy stroke.' },
        ],
        loading: [
            { name: 'The marching ticks', text: "Bold primary ticks march along each skeleton row's foot while it loads." },
            { name: 'The grid runner', text: 'A thin primary bar runs across the skeleton stack in hard geometric steps.' },
            { name: 'The flap flip', text: "A squared block flips side to side in the rail's place, like a transit board flap." },
        ],
        arrival: [
            {
                name: 'Slides onto the grid',
                text: 'The row slides on from the side in hard geometric steps, snapping to the grid; on the way out it slides off the same way, the mirror.',
            },
            {
                name: 'Stamps down',
                text: 'The row is stamped flat from no height in one hard linear motion; on the way out it is lifted away the same way, the mirror.',
            },
            {
                name: 'Flips in',
                text: 'The row flips down from a right angle in three hard steps, like a transit board character; on the way out it flips back up the same way, the mirror.',
            },
        ],
        tone: [
            { name: 'The ruled edge', text: "A thick rule in the button's colour runs down its near edge, geometric and flat." },
            { name: 'The boxed button', text: 'The button alone carries a thick ring in its colour.' },
            { name: 'The ruled top', text: "A thick rule in the button's colour runs across its top edge." },
        ],
        interactive: [
            { name: 'The grid flash', text: "The row's background flashes to a flat tint on hover or focus-within, a hard cut, never a fade." },
            {
                name: 'The ruled mark',
                text: "A thick rule in the primary colour appears along the row's inline-start edge on hover or focus-within.",
            },
            { name: 'The raised plate', text: 'The rail lifts on a hard black shadow on hover, the focus ring square and thick.' },
        ],
    },
    lapis: {
        shape: [
            {
                name: 'The girih rail',
                text: 'A gold rule under each row over a faint star pattern, the primary in the display serif with a gold ring.',
            },
            { name: 'The gilt rail', text: "A gold rule down the rail's near edge, the primary ringed in gold." },
            { name: 'The margin rail', text: 'Two fine gold rules beside the rail, the primary wavy-underlined like a manuscript gloss.' },
        ],
        loading: [
            { name: 'The girih turns', text: "The star pattern along each skeleton row's foot turns in place while it loads." },
            { name: 'The illumination sweeps', text: 'A soft gold wash drifts back and forth across the skeleton stack, like a lamp over a page.' },
            { name: 'The ink spreads', text: "A gold ring grows and recedes in the rail's place, like ink spreading and settling." },
        ],
        arrival: [
            {
                name: 'Unfurls',
                text: 'The row unrolls downward from a rolled edge, slowing as it settles, like a scroll opening; on the way out it rolls back up, the mirror.',
            },
            {
                name: 'Illuminated in',
                text: 'A band of gold light sweeps across the row left to right as it reveals; on the way out a band sweeps right to left, the mirror.',
            },
            {
                name: 'Inked in',
                text: 'The row spreads outward from a point near the rail, like ink soaking into vellum; on the way out it draws back inward, the mirror.',
            },
        ],
        tone: [
            { name: 'The gold edge', text: "A fine gold-and-colour edge runs down the button's near side, as a ruled manuscript line." },
            { name: 'The gilt button', text: 'The button alone carries its colour, ringed in gold like a roundel.' },
            { name: 'The double rule', text: "A double rule in the button's colour runs across its top edge." },
        ],
        interactive: [
            { name: 'The warmed vellum', text: 'The row warms with a faint gold wash on hover or focus-within.' },
            { name: 'The traced gilt', text: "A fine gold rule traces in along the row's inline-start edge on hover or focus-within." },
            {
                name: 'The illuminated ring',
                text: "A focused button's ring reads as a thin gold roundel; hovering the rail deepens the gold a shade.",
            },
        ],
    },
    nostromo: {
        shape: [
            { name: 'The CRT rail', text: 'Faint scanlines sit behind the rail, the buttons in instrument mono, flush right.' },
            { name: 'The indicator rail', text: 'A moulded plastic plate holds the rail, the primary a lit indicator ring.' },
            { name: 'The tape rail', text: 'A printed label-tape title sits above the rail in dark mono caps, a rule beneath the row.' },
        ],
        loading: [
            { name: 'The scan line', text: "A bright scanning dash sweeps along each skeleton row's edge while it loads." },
            { name: 'The indicator blinks', text: "A round indicator light blinks steadily in the rail's place." },
            { name: 'The tape feeds', text: "A ridged label tape feeds past in the rail's place." },
        ],
        arrival: [
            {
                name: 'Scans in',
                text: 'The row rolls down from the top in hard steps, like a CRT frame scanning in; on the way out it rolls up and away, the mirror.',
            },
            {
                name: 'Feeds in',
                text: 'The row feeds in from the side in hard steps, like a punch card drawn through a reader; on the way out it feeds out the same way, the mirror.',
            },
            {
                name: 'Warms up',
                text: 'The row grows from a smaller size and settles with a slight overshoot, like a tube warming up; on the way out it shrinks back with the same overshoot, the mirror.',
            },
        ],
        tone: [
            { name: 'The indicator edge', text: "A moulded edge in the button's colour runs down its near side." },
            { name: 'The lit indicator', text: 'The button alone lights in its colour like a panel LED.' },
            { name: 'The tape band', text: "A band in the button's colour runs across its top, like a strip of warning tape." },
        ],
        interactive: [
            { name: 'The warmed panel', text: 'The row warms a shade brighter on hover or focus-within, like a panel under a worklight.' },
            { name: 'The lit groove', text: 'A moulded groove under the row lights along its length on hover or focus-within.' },
            { name: 'The scan flash', text: "A focused button's ring reads as a quick scan flash; hovering the rail lifts it a hair." },
        ],
    },
};

const IDEAS = Object.fromEntries(THEMES.map((t) => [t.name, THEME_IDEAS[t.name]]));

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="actions"]'));

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
        `Five picks, each on its own. ${idea.shape[0].name} and ${idea.shape[1].name} are this theme's own first two characters; shape 3 is new. ` +
        'Each row below changes one thing only; the preview at the top shows what you ticked so far. ' +
        'Press Loading, Add row and Resolve top row at full speed and at ¼; every row keeps its height steady in every state.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

const cellMarkup = () => `<ul class="kp-action-list" data-ac></ul><div class="ac-loading-panel" data-ac-loading-panel hidden></div>`;

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-ac-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'ac-aspect';
    box.setAttribute('data-ac-aspect', id);
    box.setAttribute('aria-labelledby', `h-ac-${id}`);
    const head = document.createElement('div');
    head.className = 'ac-aspect__head';
    head.innerHTML = '<h3></h3><p></p>';
    head.firstElementChild.id = `h-ac-${id}`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'ac-trio';
    for (const at of [1, 2, 3]) {
        const cell = document.createElement('div');
        cell.className = 'ac-col';
        cell.setAttribute('data-ac-vary', id);
        cell.setAttribute('data-ac-option', String(at));
        cell.innerHTML =
            `<p class="ac-label"><span class="ac-label__no">${label} · ${at}</span> <span data-ac-name></span></p>` +
            `<p class="ac-desc" data-ac-desc></p><div class="ac-cell" data-ac-cell>${cellMarkup()}</div>`;
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

/** Every cell this page carries, including the reference's list (which has no `[data-ac-cell]` wrapper). @returns {HTMLElement[]} */
const allCells = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-ac-cell]')]);

function compose() {
    const now = picks();
    const previewCell = section.querySelector('[data-ac-preview]');
    for (const { id } of ASPECTS) if (previewCell?.getAttribute(`data-ac-${id}`) !== now[id]) previewCell?.setAttribute(`data-ac-${id}`, now[id]);
    for (const col of section.querySelectorAll('[data-ac-vary]')) {
        const vary = col.getAttribute('data-ac-vary');
        const option = col.getAttribute('data-ac-option') ?? '1';
        const cell = col.querySelector('[data-ac-cell]');
        for (const { id } of ASPECTS) {
            const value = id === vary ? option : now[id];
            if (cell?.getAttribute(`data-ac-${id}`) !== value) cell?.setAttribute(`data-ac-${id}`, value);
        }
        col.classList.toggle('ac-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-ac-picks]');
    const idea = IDEAS[theme()];
    if (words && idea) words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1].name}`).join(' · ');
    if (idea)
        for (const cell of allCells()) {
            const panel = cell.querySelector('[data-ac-loading-panel]');
            const option = idea.loading[Number(cell.getAttribute('data-ac-loading') ?? '1') - 1];
            if (panel && panel.dataset.name !== option.name) {
                panel.dataset.name = option.name;
                panel.textContent = option.name;
            }
        }
}

section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* --------------------------------------------------------- the rows */

/** @typedef {{ label: string, role: string, variant?: 'primary' | 'destructive' }} RowButton */
/** @typedef {{ key: string, text: string, buttons: RowButton[] }} Row */

/** @type {Row[]} */
let rowData = [
    {
        key: 'inc-4471',
        text: 'INC-4471 — Pump house 3: pressure below 2.1 bar',
        buttons: [
            { label: 'Acknowledge', role: 'ack' },
            { label: 'Assign…', role: 'assign' },
            { label: 'Open', role: 'open', variant: 'primary' },
        ],
    },
    {
        key: 'inc-4468',
        text: 'INC-4468 — Pump house 7: no reading since 06:00',
        buttons: [
            { label: 'Reassign…', role: 'assign' },
            { label: 'Open', role: 'open', variant: 'primary' },
        ],
    },
    {
        key: 'inc-4462',
        text: 'INC-4462 — Reservoir North: level sensor drifting',
        buttons: [
            { label: 'Acknowledge', role: 'ack' },
            { label: 'Assign…', role: 'assign' },
            { label: 'Open', role: 'open', variant: 'primary' },
        ],
    },
    { key: 'inc-4459', text: 'INC-4459 — Pump house 1: door contact open', buttons: [{ label: 'Open', role: 'open', variant: 'primary' }] },
    {
        key: 'inc-4455',
        text: 'INC-4455 — Sensor offline: remove from the roster',
        buttons: [
            { label: 'Remove…', role: 'remove', variant: 'destructive' },
            { label: 'Open', role: 'open', variant: 'primary' },
        ],
    },
];
let nextSeq = 1;
/** @type {'ready' | 'loading'} */
let state = 'ready';

const log = section.querySelector('[data-ac-log]');
const buttonEl = (/** @type {RowButton} */ button) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `kp-button kp-button--sm${button.variant ? ` kp-button--${button.variant}` : ''}`;
    b.dataset.kpAction = button.role;
    b.textContent = button.label;
    b.addEventListener('click', (event) => {
        event.preventDefault();
        const li = /** @type {HTMLElement} */ (b.closest('li'));
        if (log) log.textContent = `Pressed: ${button.label} on ${li?.dataset.acKey ?? '?'}.`;
    });
    return b;
};

const rowEl = (/** @type {Row} */ row) => {
    const li = document.createElement('li');
    li.dataset.acKey = row.key;
    const text = document.createElement('div');
    text.textContent = row.text;
    const actions = document.createElement('div');
    actions.className = 'kp-row-actions';
    for (const button of row.buttons) actions.append(buttonEl(button));
    li.append(text, actions);
    return li;
};

/** Paint the current `rowData` onto every list, then mark any brand-new row as arriving. */
function paint() {
    for (const cell of allCells()) {
        const list = cell.querySelector('[data-ac]');
        const panel = cell.querySelector('[data-ac-loading-panel]');
        if (!list) continue;
        const before = new Set([...list.children].map((el) => /** @type {HTMLElement} */ (el).dataset.acKey));
        for (const el of [...list.children]) if (!rowData.some((row) => row.key === /** @type {HTMLElement} */ (el).dataset.acKey)) el.remove();
        for (const row of rowData) {
            const existing = /** @type {HTMLElement | null} */ (list.querySelector(`[data-ac-key="${row.key}"]`));
            if (existing) continue;
            list.append(rowEl(row));
        }
        // Keep DOM order the same as `rowData`.
        for (const row of rowData) {
            const el = list.querySelector(`[data-ac-key="${row.key}"]`);
            if (el) list.append(el);
        }
        for (const el of [...list.children])
            if (!before.has(/** @type {HTMLElement} */ (el).dataset.acKey) && !el.hasAttribute('data-kp-leaving')) {
                el.setAttribute('data-kp-arriving', '');
                const clear = () => el.removeAttribute('data-kp-arriving');
                el.addEventListener('animationend', clear, { once: true });
                setTimeout(clear, 1600);
            }
        list.hidden = state !== 'ready';
        list.setAttribute('aria-busy', String(state === 'loading'));
        if (panel) panel.hidden = state !== 'loading';
    }
    const refList = section.querySelector('[data-ac-ref]');
    if (refList) {
        refList.replaceChildren();
        for (const row of rowData) refList.append(rowEl(row));
    }
}

section.querySelector('[data-ac-add]')?.addEventListener('click', () => {
    nextSeq += 1;
    rowData = [
        {
            key: `inc-new-${nextSeq}`,
            text: `INC-NEW-${nextSeq} — Added just now, on Add row`,
            buttons: [
                { label: 'Acknowledge', role: 'ack' },
                { label: 'Open', role: 'open', variant: 'primary' },
            ],
        },
        ...rowData,
    ];
    state = 'ready';
    pressedState();
    paint();
});

section.querySelector('[data-ac-resolve]')?.addEventListener('click', async () => {
    if (!rowData.length) return;
    const [top, ...rest] = rowData;
    rowData = rest;
    state = 'ready';
    pressedState();
    const promises = [];
    for (const cell of allCells()) {
        const el = /** @type {HTMLElement | null} */ (cell.querySelector(`[data-ac-key="${top.key}"]`));
        if (el) promises.push(leave(el));
    }
    const refEl = /** @type {HTMLElement | null} */ (section.querySelector(`[data-ac-ref] [data-ac-key="${top.key}"]`));
    if (refEl) promises.push(leave(refEl));
    await Promise.all(promises);
    paint();
});

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};
const pressedState = () => pressed('data-ac-state', state);

for (const b of section.querySelectorAll('[data-ac-state]'))
    b.addEventListener('click', () => {
        state = /** @type {typeof state} */ (b.getAttribute('data-ac-state') ?? 'ready');
        pressedState();
        paint();
    });

attachActionColumns(section);
paint();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-ac-theme-name]')) el.textContent = LABEL[now] ?? now;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    for (const col of section.querySelectorAll('[data-ac-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (col.getAttribute('data-ac-vary'))]?.[Number(col.getAttribute('data-ac-option')) - 1];
        const name = col.querySelector('[data-ac-name]');
        const desc = col.querySelector('[data-ac-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-ac-motion]')?.removeAttribute('hidden');

let rate = 1;
try {
    const kept = Number(localStorage.getItem('ac-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-ac-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-ac-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-ac-speed'));
        try {
            localStorage.setItem('ac-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();
