// What makes phantom phantom: the nineteen questions, as data. The designer's
// text, verbatim; demo.js wires each aspect's scene and options.css draws
// each option by `data-ph-<id>="<key>"` on the scene. The grammar is
// themes/phantom/CHARACTER.md (G1–G21); the anchor is the thrown screen
// (research/phantom-anchor, update 1, Kenny 2026-10-08): the calling card
// flies in as its own halftone, a silhouette of dots in its shape, slaps
// down with a dead stop and resolves into the solid card in three hard cuts;
// it leaves by dissolving into dots and being snatched off.

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

export const THEME = 'phantom';
export const LABEL = 'Phantom';
export const TITLE = 'What makes phantom phantom';
export const STORY = {
    what: 'Phantom is print: black, white and one violent red, cut paper, a halftone screen over everything, condensed italic capitals, hard offset shadows and no light. The anchor you picked says what phantom does: it throws a screen that resolves. A part flies in as its own halftone, a silhouette of dots in its shape, slaps down with a dead stop and resolves into the solid thing in three hard cuts, as a print comes out of its screen; it leaves by dissolving into dots and being snatched off.',
    so: 'So everything that happens on screen is a print: a part is thrown and resolves (arriving, opening), dissolves and resolves again (a live update), waits as a screen that will not resolve (loading, the busy bar), and dissolves and is snatched (leaving). The throw is the shove with its dead stop, the resolve is hard cuts; nothing eases to a stop but the shove, nothing fades, nothing glows, nothing blurs.',
    decided:
        'Already decided by you: the anchor = thrown as a screen, resolves at the slap (the anchor round, update 1); round one’s progress bar stays (the skewed track, the black halftone well, the deep-red second plate, the white shard head); the network graph changes in no theme. The questions below turn the anchor into rules for every other component; where a decided pick is at odds with the rule, the pick is on the page as an option named “the pick” or “today”. The full analysis is in themes/phantom/CHARACTER.md.',
};

/**
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', scene: string,
 *   options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
export const ASPECTS = [
    {
        id: 'curve',
        label: 'The motion curve',
        rule: 'G1',
        question: 'A dialog, a menu and a tile are thrown in and resolve. On which curve do they fly, and how do they resolve?',
        why: 'In every option every part arrives the same way for the same 700 ms (thrown in as a screen from off the start edge, 400 ms; resolved at the stop, 300 ms), so only the curves differ. Beside the parts a small plate is thrown next to one at an even pace, so the curve is seen on its own.',
        kind: 'cycle',
        scene: 'moving',
        options: [
            {
                key: 'shove',
                name: 'The shove and cuts',
                see: 'The throw is the register’s shove, cubic-bezier(0.81, 0, 0, 1): a hard start and a dead stop a degree and a half askew; the resolve is three hard cuts (steps, 100 ms each), the dots densifying to solid with nothing between two cuts. The close is the cuts backwards and the throw back on the inverse curve.',
                verdict: rec(
                    'a thrown card has one curve (fast, then it is there) and a print resolves in cuts, not a fade: the two gaits the anchor already has, kept apart; grotesk falls and dwells, cyberpunk cuts and jitters, phantom throws and resolves.',
                ),
            },
            {
                key: 'register',
                name: 'The register’s curve (today)',
                see: 'cubic-bezier(0.2, 0.9, 0.25, 1), the register’s --fx-ease on the throw: fast out, slowing into place with a touch of overshoot; the resolve on the same curve as a fade of the dots.',
                verdict: not('a throw that slows down never slaps, and dots that fade are a blur: print has no fade.'),
            },
            {
                key: 'eased',
                name: 'Eased in and out (the picks)',
                see: 'The trend’s and the menu’s pick: slashed in easing in and out (cubic-bezier(0.65, 0, 0.35, 1)); the resolve eased the same way.',
                verdict: not('ease-in-out is a ceremony on a calling card; nothing in it stops dead.'),
            },
            {
                key: 'cuts',
                name: 'All cuts',
                see: 'The throw itself in four hard jumps (steps(4)) and the resolve in three; nothing moves between frames.',
                verdict: not('a card thrown in jumps is retro’s flying sheet; the shove is phantom’s own.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'From where is a part thrown, and in what order does a group come?',
        why: 'A week of days, a tile and a trend line arrive. Every option takes 700 ms and the same throw and resolve; only where it comes from and the order of the group differ.',
        kind: 'cycle',
        scene: 'direction',
        options: [
            {
                key: 'start',
                name: 'Thrown from off the start edge',
                see: 'A part comes from beyond its start edge along the −8° skew and lands a degree and a half askew; a group of days is thrown one after the other, 80 ms apart, each slapping where it lands; the trend line is cut in from its start in hard cuts.',
                verdict: rec(
                    'a card is thrown from one hand, so every part has one origin, and a group thrown one by one is a hand dealing; nothing rises, nothing scales, nothing comes from the centre.',
                ),
            },
            {
                key: 'jumps',
                name: 'In hard jumps from the side (the picks)',
                see: 'The tiles’ pick: each part jumps into place sideways in three hard jumps; a group all at once; the trend line slashed in from its end.',
                verdict: not('jumps are retro’s frames, and from the end is backwards for a reader.'),
            },
            {
                key: 'centre',
                name: 'From the centre out',
                see: 'Every part resolves in place from its centre outward (the dots densify from the middle); a group from its middle outward; no throw.',
                verdict: not('without the throw the slap is gone; resolving from the centre is deco’s fan in dots.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open, and how does it close?',
        why: 'A menu opens under its button, a dialog opens on the board, a toast and a tooltip appear. Every option takes 700 ms; only what is drawn differs. Every close is the open backwards.',
        kind: 'cycle',
        scene: 'opening',
        options: [
            {
                key: 'thrown',
                name: 'Thrown from its anchor, resolves',
                see: 'The menu is thrown from its button’s edge as a screen and resolves under it in three cuts; the dialog is thrown onto the board from off the start edge and resolves askew; the toast is thrown from the start edge; the tooltip is too small to fly and resolves in place in three cuts. The close: three cuts to dots, then the throw back.',
                verdict: rec(
                    'it is the anchor on every opening: what opens is a card thrown from the thing that opened it, and it is read as print the moment it lands; no scale, no rotate, no pop.',
                ),
            },
            {
                key: 'scaled',
                name: 'Scaled and rotated (today)',
                see: 'The register’s dialog: enters at scale 1.25 rotated −7° and settles to rest; the tooltip pops from 0.4; the toast slides in skewed; the nav menu fades in three steps.',
                verdict: not('a scale from large is a zoom, not a throw; four openings in one register.'),
            },
            {
                key: 'slashed',
                name: 'Slashed in easing (the picks)',
                see: 'The menu’s pick: drawn in backwards from its end, easing in and out; drawn out to close.',
                verdict: not('an eased wipe from the end is the one thing print cannot do; it is light’s feed in black.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long do a contact, a throw, a resolve, a group and a loop take?',
        why: 'Every option shows the same picture (a dialog thrown and resolved, a group dealt, the busy bar shoved); only the times differ, printed under each part.',
        kind: 'cycle',
        scene: 'durations',
        options: [
            {
                key: 'throw',
                name: 'One throw: 120 · 400 (+300, +80) · 1500 ms',
                see: 'A press answers in 120 ms; a throw takes 400 ms (the anchor’s four units); the resolve 300 ms more (three cuts of 100); a group is dealt 80 ms apart; a loop (the busy slab, loading) runs 1.5 s, the register’s shove.',
                verdict: rec(
                    'it is the anchor’s own clock: a throw short enough to slap and cuts long enough to be seen as cuts; the register’s 120 ms contact and 1.5 s shove are kept.',
                ),
            },
            {
                key: 'brisk',
                name: 'Brisk: 80 · 260 (+200, +50) · 1000 ms',
                see: 'A press in 80 ms, a throw in 260 ms, the resolve 200 ms (three cuts of 67), a group 50 ms apart, the loop 1 s.',
                verdict: not('at 67 ms a cut is a flicker; the resolve has to be read cut by cut.'),
            },
            {
                key: 'unhurried',
                name: 'Unhurried: 180 · 600 (+450, +120) · 2250 ms',
                see: 'A press in 180 ms, a throw in 600 ms, the resolve 450 ms, a group 120 ms apart, the loop 2.25 s.',
                verdict: not('a card that takes 600 ms to arrive floats; a throw is quick or it is not a throw.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What may be red, what white, what black, what yellow?',
        why: 'The same card, buttons, a switch, a month, a key figure, a meter and a failed export in every option; only the colour rule differs.',
        kind: 'still',
        scene: 'colour',
        options: [
            {
                key: 'plate',
                name: 'Red is a plate, white and black print',
                see: 'Red is a plate with black ink (a bar, a slab, a card’s edge, the primary button), never a word; cards are white with black ink or black with white; the halftone is white dots on black; the deep red is the second plate behind a red one and every hard shadow; yellow is the overprint for a warning only. Nothing glows, nothing is a gradient.',
                verdict: rec(
                    'print has one ink colour and it is a plate: red on black fails as text (4.12:1) and black on red reads; the anatomy’s rule, and the thing that tells phantom from grotesk, whose red is a word too.',
                ),
            },
            {
                key: 'words',
                name: 'Red words too',
                see: 'Red may be a word: a red title, a red figure, a red link, on black or white.',
                verdict: not('red words on black fail contrast and read as cyberpunk’s neon; a plate never fails.'),
            },
            {
                key: 'evidence',
                name: 'The evidence board’s colours (the picks)',
                see: 'The picks’ palette: red string, stamped rings in red ink, a target’s red rings, a yellow staple tag, bullet holes with a cracked halo.',
                verdict: not('a board of red string and stamps is a detective’s wall; phantom is a calling card.'),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'How are the corners drawn?',
        why: 'The same card, menu panel, key figure, button, tag, chip, tooltip and bar head in every option; only the corners differ.',
        kind: 'still',
        scene: 'corners',
        options: [
            {
                key: 'skewed',
                name: 'Square, skewed, cut',
                see: 'Radius 0; controls and bars are parallelograms (−8°, the label un-skewed); cards and menus are cut paper with their corners clipped; a landed card a degree and a half askew; the tooltip a slab at −3°. As the register has it.',
                verdict: rec(
                    'the skew is the one shape every control shares, and cut paper is the card; the anchor lands askew because a thrown thing does.',
                ),
            },
            {
                key: 'level',
                name: 'Square and level',
                see: 'Radius 0, no skew, no cut, nothing askew.',
                verdict: not('level and square is brutalism and grotesk; the skew is phantom’s signature.'),
            },
            {
                key: 'torn',
                name: 'Torn edges (the picks)',
                see: 'The calendar’s and the busy table’s pick: torn tickets, a notch bitten from each side, a perforated dashed line.',
                verdict: not('a torn ticket is one pick’s shape; on every plate it is a stub, not a card.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is on the ground before anything happens?',
        why: 'A dialog with its title, a key figure, a trend tile, a menu with headings and the state word in every option; only the surface differs.',
        kind: 'still',
        scene: 'surface',
        options: [
            {
                key: 'screen',
                name: 'Black under the screen, cards as plates, hard shadows',
                see: 'The ground is black under the 7 px halftone screen and the grain; a card is a white or black plate with a hard offset shadow in deep red; the hero carries the red slash. No glow, no blur, no soft shadow, no gradient, no board.',
                verdict: rec('print on a screened black page: the register’s own ground, and the one surface in the set with a halftone on it.'),
            },
            {
                key: 'board',
                name: 'The evidence board (the picks)',
                see: 'The picks’ surfaces: a bullseye behind the key figure, red string across the panel, stamped rings, a redaction bar before every heading, a ransom note over the header.',
                verdict: not('a wall of evidence is a set, not a surface; it buries the card under props.'),
            },
            {
                key: 'ghost',
                name: 'The ghost (the drawer’s pick)',
                see: 'The drawer’s pick: a pale translucent panel, a soft inner shadow, a feathered border, a pale halo, vapour.',
                verdict: not('the ghost reading of the name: blur, haze and glow, the three things print cannot do.'),
            },
        ],
    },
    {
        id: 'warning',
        label: 'A warning',
        rule: 'G8',
        question: 'How does a figure that needs attention look?',
        why: 'A warning key figure, a failed trend tile, a destructive menu entry and a warning alert in every option.',
        kind: 'still',
        scene: 'warning',
        options: [
            {
                key: 'overprint',
                name: 'The yellow overprint',
                see: 'A warning figure’s change is stamped on a yellow plate with black ink, overprinted 2 px off register on the figure; a failure’s change on the red plate; the card stays its plate. A destructive menu entry is a red plate with black ink.',
                verdict: rec(
                    'the warning is told by the one colour the theme keeps for it, printed as a plate with black ink, a touch off register as an overprint is; nothing is tinted, nothing is framed.',
                ),
            },
            {
                key: 'stamped',
                name: 'Stamped askew (the picks)',
                see: 'The tiles’ and the trend’s pick: the label stamped askew in the tone’s colour with a ruled border; the kpi’s stamped ring.',
                verdict: not('a stamp is the evidence board; and a ruled stamp on a skewed card is two angles.'),
            },
            {
                key: 'redboth',
                name: 'The red plate for both',
                see: 'Warning and failure both on the red plate with black ink; no yellow.',
                verdict: not('a warning and a failure that look the same cannot be told apart; yellow exists for this.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens when a figure changes?',
        why: 'A key figure, a state word, a trend line, a strip column and a tile change in every option, 400 ms each; the value changes on the way in and again on the way out.',
        kind: 'cycle',
        scene: 'live',
        options: [
            {
                key: 'resolve',
                name: 'Dissolves and resolves',
                see: 'The changed figure dissolves into its dots (two cuts) and resolves to the new value (two cuts), in place; it never moves. The trend line dissolves and resolves; the tile’s mark the same.',
                verdict: rec(
                    'it is the anchor on a figure: a new print of it, read as new because it was a screen for a beat; and nothing moves, jolts, shivers or twangs.',
                ),
            },
            {
                key: 'twang',
                name: 'The string twangs (the picks)',
                see: 'The kpi’s pick: the number jolts up, dips and lands in three sharp steps; the tiles’ mark punches out and snaps back; the columns’ figure shivers sideways.',
                verdict: not('a jolt is cyberpunk’s jitter, and a figure that moves is hard to read while it moves.'),
            },
            {
                key: 'redrawn',
                name: 'Redrawn (the trend’s pick)',
                see: 'The line redraws in place at once; the figure changes with no mark.',
                verdict: not('a reader who missed the change has no way to find it.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does a waiting surface show?',
        why: 'A tile, a panel, a menu entry, a month of days, a chart’s plot and skeleton lines, waiting. Every option loops at 1.5 s.',
        kind: 'loop',
        scene: 'loading',
        options: [
            {
                key: 'screen',
                name: 'A screen that will not resolve',
                see: 'The waiting part is its own halftone silhouette, dissolving and resolving without landing (density 25 → 50 → 75 → 50 → 25 %, hard cuts), never solid; the skeleton’s lines are dot silhouettes doing the same; the chart’s plot is a dotted plot that will not resolve.',
                verdict: rec(
                    'the anchor stopped short: a print that never comes out of its screen is exactly what waiting is; it fills the whole part, keeps its shape, and is the same screen as everywhere else.',
                ),
            },
            {
                key: 'slash',
                name: 'The red slash (today)',
                see: 'The register’s skeleton: a red parallelogram slash sweeps across each dotted line, 1.4 s, and again.',
                verdict: not('a sweep is a wipe; the slash is a hero decoration, not a wait.'),
            },
            {
                key: 'shuffle',
                name: 'The shuffle (the picks)',
                see: 'The kpi’s and the tiles’ pick: the halftone shuffles left and right like a slipping photocopy.',
                verdict: not('a shuffle is the jolt you did not pick, on a loop.'),
            },
            {
                key: 'stamp',
                name: 'The stamp ring (the picks)',
                see: 'The trend’s pick: a red ring stamped onto the plot again and again.',
                verdict: not('a stamp is the evidence board, and a ring stamped forever says nothing about waiting.'),
            },
        ],
    },
    {
        id: 'busybar',
        label: 'The busy progress bar',
        rule: 'G11',
        question: 'What does the progress bar do while no share is known?',
        why: 'Round one’s bar stays: the skewed track, the black halftone well, the deep-red second plate, the white shard head. Every option is shown at three sizes busy, in a busy button, and beside a bar with a share (62 %), which is the same in every option.',
        kind: 'loop',
        scene: 'busybar',
        options: [
            {
                key: 'screen',
                name: 'The slab shoved across as a screen',
                see: 'Busy: the red slab is shoved across the well as a dot silhouette that never resolves, 1.5 s on the shove, and again; with a share known the slab resolves solid at its stop with the shard at its edge.',
                verdict: rec(
                    'the register’s shove with the anchor’s screen: a slab that will not resolve until the share is known, one picture for both states.',
                ),
            },
            {
                key: 'solid',
                name: 'The slab solid (today)',
                see: 'The register’s busy bar: the solid red slab shoved across and across.',
                verdict: not('a solid slab says a share is there when it is not; the screen says waiting.'),
            },
            {
                key: 'slides',
                name: 'The screen slides (the meter’s pick)',
                see: 'The meter’s loading pick: the halftone screen of the well slides sideways, linear, and again.',
                verdict: not('a sliding screen is the shuffle on a loop; nothing crosses the track.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G12',
        question: 'What does the spinner draw?',
        why: 'Three sizes, a busy button and a busy panel in every option; every option loops at 1.2 s.',
        kind: 'loop',
        scene: 'spinner',
        options: [
            {
                key: 'resolves',
                name: 'The star snaps and resolves',
                see: 'The register’s white star over its red second plate snaps 72° at a time (five cuts a turn); on each landing it resolves from dots to solid in one cut, so it is a screen in the air and a print at rest.',
                verdict: rec(
                    'the anchor on the register’s own spinner: the star that snaps, printed on each landing; a smooth turn is every theme’s spinner.',
                ),
            },
            {
                key: 'snaps',
                name: 'The star snaps (today)',
                see: 'The register’s spinner: the star snaps 72° at a time, solid throughout.',
                verdict: not('close, but the star never passes through its screen; it is a jolt without the print.'),
            },
            {
                key: 'shoved',
                name: 'A dotted star shoved round',
                see: 'The star as a screen shoved round smoothly on the shove curve, once a loop, never solid.',
                verdict: not('a star that turns smoothly is a wheel; the snap is the gait.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G13',
        question: 'How does a part arrive, and how does it leave?',
        why: 'An alert, a card and a key figure arrive and leave in every option, 700 ms each way; the leave is the arrival backwards.',
        kind: 'cycle',
        scene: 'leave',
        options: [
            {
                key: 'thrown',
                name: 'Thrown and resolved, dissolved and snatched',
                see: 'Arriving: thrown in as a screen from off the start edge (400 ms), slapped down askew, three cuts to solid. Leaving: three cuts to dots, then the throw back off the start edge.',
                verdict: rec('the anchor exactly, both ways; one gesture for arriving, opening and leaving, and nothing ends in a blur.'),
            },
            {
                key: 'ghost',
                name: 'The wavering ghost (today)',
                see: 'The register’s leave: the part goes see-through and wavers (skew, a red glow, a blur) and rises 9 px away; arriving is the same backwards.',
                verdict: not('the one blur and the one glow in a theme whose rule is no blur and no glow; it is the ghost reading of the name.'),
            },
            {
                key: 'solid',
                name: 'Thrown solid, snatched solid',
                see: 'The card is thrown in solid and slaps down; it is snatched off solid; no screen, no cuts.',
                verdict: not('round one’s throw, which you asked to combine with the halftone; the screen is the half you added.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G14',
        question: 'Is a button inside a header, a menu, a tile or a drawer phantom’s own button?',
        why: 'Phantom’s own button stands alone for reference; then the same button inside a page header, a menu, a tile, a drawer and a key figure. Use the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: 'composites',
        options: [
            {
                key: 'own',
                name: 'Exactly phantom’s own',
                see: 'Every button, link and entry inside a composite is phantom’s key cap as it stands alone (skewed, the 2 px frame, the red bar on hover, the drop onto the shadow on press); it hovers, focuses and presses exactly the same wherever it stands.',
                verdict: rec('one manner for every control, wherever it stands; a calling card has one hand.'),
            },
            {
                key: 'card',
                name: 'Phantom’s own on a card',
                see: 'The same manners, and the header’s actions and the drawer’s buttons stand together on one white card askew with its hard shadow.',
                verdict: not('a card inside a card is a plate on a plate; it adds a shadow for no act.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The header’s pick stamps a ring round a hovered button, the tiles’ Open fills solid red and the card jumps, the kpi’s ring glints: three hovers on one page.',
                verdict: not('three hovers on one page.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G15',
        question: 'What happens where the pointer rests?',
        why: 'A button, a menu’s entries, a tile with its Open link, a link in running text, two key figures and a month of days, the first of each pointed at. Use State: Hover to see the pointer arrive and leave.',
        kind: 'still',
        scene: 'hover',
        options: [
            {
                key: 'bar',
                name: 'The red bar thrown in and resolved',
                see: 'The register’s red bar behind the label (the parallelogram) is thrown in from the start edge as a screen and resolves solid in two cuts, the ink flipping to black; a menu entry the same; a link’s underline the same bar, thin; a card does not move. Leaving, the bar dissolves and is snatched.',
                verdict: rec(
                    'the register’s best device (the bar that slides behind a pointed-at item) with the anchor’s gait: thrown and printed; nothing glints, tilts, lifts or jumps.',
                ),
            },
            {
                key: 'glint',
                name: 'The pin glints (the picks)',
                see: 'The kpi’s pick: the red ring round the figure glints; the header’s stamps a faint ring; the card tilts.',
                verdict: not('a glint is light, and a tilt is a card moving for a pointer.'),
            },
            {
                key: 'snatched',
                name: 'Snatched off the board (the picks)',
                see: 'The tiles’ pick: the card jumps up hard on a bigger offset shadow; Open fills solid red.',
                verdict: not('a card that jumps on hover is a card that cannot be read on hover.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G16',
        question: 'What marks the control the keyboard is on?',
        why: 'A button, a header action, a key figure as a link, a menu entry, a calendar day and a tile’s link, each focused. DI2 fixes the two-channel ring for every theme; the question is only what phantom adds. Use State: Focus.',
        kind: 'still',
        scene: 'focus',
        options: [
            {
                key: 'rings',
                name: 'The two rings (DI2, today)',
                see: 'The register’s focus: two rings outside the skewed plate, 2 px paper then 5 px red, skewed with it; nothing added.',
                verdict: rec('DI2’s two channels in phantom’s own colours, already there; nothing to add.'),
            },
            {
                key: 'dashed',
                name: 'A dashed red ring (the picks)',
                see: 'The kpi’s and the tiles’ pick: a dashed red outline round the focused control instead of the two rings.',
                verdict: not('a dashed ring is one channel and reads as a selection marquee.'),
            },
            {
                key: 'mix',
                name: 'As today’s mix',
                see: 'The register’s rings plus the picks’ dashed rings and skewed focus where a pick drew them.',
                verdict: not('three focus marks.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G17',
        question: 'What does a press do?',
        why: 'A button, a primary button, a menu entry, a calendar day and a key figure as a filter, each at rest and pressed. Use State: Press.',
        kind: 'still',
        scene: 'press',
        options: [
            {
                key: 'drops',
                name: 'The cap drops, the face resolves',
                see: 'The key cap drops 5 px onto its deep-red shadow (the register’s press) and its face resolves from dots to solid red in two cuts; release lifts it and the face is solid. Nothing eases.',
                verdict: rec('the register’s press with the anchor’s print: the cap lands and is printed; the anchor’s own button press.'),
            },
            {
                key: 'today',
                name: 'The cap drops (today)',
                see: 'The register’s press: the cap drops onto its shadow; the face stays solid.',
                verdict: not('close, but the press never passes through the screen; it is the one gesture without the print.'),
            },
            {
                key: 'tilts',
                name: 'The card tilts (the picks)',
                see: 'The kpi’s pick: the card tilts on press; the tiles’ Open fills; the header’s stamp flattens.',
                verdict: not('a tilt is a card moving under the hand; a pressed thing should drop.'),
            },
        ],
    },
    {
        id: 'type',
        label: 'The voice',
        rule: 'G18',
        question: 'In which face are the titles, the labels, the figures and the prose set?',
        why: 'A tile with its title, a label, a figure, an identifier and a line of prose in every option.',
        kind: 'still',
        scene: 'type',
        options: [
            {
                key: 'condensed',
                name: 'Barlow Condensed shouts, Barlow speaks',
                see: 'Titles, labels, buttons and tabs in Barlow Condensed 900 italic uppercase; prose and figures in Barlow; identifiers, help and errors in the monospace. As the register has it.',
                verdict: rec(
                    'a calling card shouts its title and says the rest plainly; a figure in the condensed italic cannot be read as a number.',
                ),
            },
            {
                key: 'everywhere',
                name: 'Condensed everywhere',
                see: 'Figures and prose in Barlow Condensed too, italic, uppercase where it is a label.',
                verdict: not('prose in a 900 italic condensed is unreadable past a line.'),
            },
            {
                key: 'ransom',
                name: 'The ransom note (the picks)',
                see: 'The trend’s and the header’s pick: labels as cut-out scraps, each word on its own skewed paper, the figure with a red offset shadow.',
                verdict: not('a ransom note is the evidence board’s voice; one scrap per word is noise on a dashboard.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G19',
        question: 'Which marks may phantom draw, and where?',
        why: 'A card with its title, a meter with its mark, a chart’s events, a button and a list, an empty state and a divider in every option; only the marks differ.',
        kind: 'still',
        scene: 'motifs',
        options: [
            {
                key: 'print',
                name: 'The screen, the skew, the red plate, the second plate, the slash, the star',
                see: 'The halftone screen on every ground and on anything arriving; the skew on every control; the red plate with black ink; the deep-red second plate off register and the hard shadow; the slash as a cut, a corner and the divider; the five-point star as the spinner and the radio’s mark. Nothing else: no stamps, strings, pins, staples, bullet holes, targets, dossiers or ransom cuts.',
                verdict: rec('six marks that are one print; the evidence board is a different film and the ghost a different name.'),
            },
            {
                key: 'evidence',
                name: 'Plus the evidence board (the picks)',
                see: 'The same six, and the picks’ red string, stamped rings, pins, staple tags, bullet holes, targets and redaction bars.',
                verdict: not('two worlds on one page: the card and the wall it was pinned to.'),
            },
            {
                key: 'all',
                name: 'As today (everything)',
                see: 'Every mark the register and the picks carry: the print, the board, the ghost’s blur and glow, the vapour.',
                verdict: not('a calling card, an evidence wall and a ghost at once.'),
            },
        ],
    },
];
