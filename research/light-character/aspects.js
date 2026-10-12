// What makes light light: the nineteen questions, as data. The designer's
// text, verbatim; demo.js wires each aspect's scene and options.css draws
// each option by `data-lc-<id>="<key>"` on the scene. The grammar is
// themes/light/CHARACTER.md (G1–G21); the anchor is the glare
// (research/light-anchor, Kenny 2026-10-08): a part is a glare first,
// blurred and too bright, and comes down into focus and into its own white;
// it leaves into the glare.

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

export const THEME = 'light';
export const LABEL = 'Light';
export const TITLE = 'What makes light light';
export const STORY = {
    what: 'Light is a photograph on white paper: pure white, near-black ink, one indigo that acts, a cyan that is light itself (a fill, never a word), no ornament but the seam with its circle, no depth but three soft shadows. The anchor you picked says what light does: it exposes. A part is a glare first, too bright to read, and the exposure comes down until it is crisp and white; what leaves goes back into the glare.',
    so: 'So everything that happens on screen is a matter of exposure: a part comes into focus (arriving), is re-exposed (a live update), waits out of focus (loading), burns out (leaving). Nothing slides, nothing grows, nothing is drawn; the picture is always already there, and only its exposure changes.',
    decided:
        'Already decided by you: the anchor = overexposed, out of the glare (the anchor round); your family picks for light (loading = the strip, arrival and live = the trend, hover = the header, tone = the tiles, shape = the strip); and the network graph changes in no theme. The questions below turn the anchor into rules for every other component; where a decided pick is at odds with the rule, the pick is on the page as an option named “the pick”. The full analysis is in themes/light/CHARACTER.md.',
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
        question: 'A dialog, a menu and a tile come out of the glare. On which curve does the exposure come down?',
        why: 'In every option every part comes out of the same glare (brightness 1.6, blur 5 px) for the same 420 ms, in place, so only the curve differs. Beside the parts a bead comes into focus next to one at an even pace.',
        kind: 'cycle',
        scene: 'moving',
        options: [
            {
                key: 'settle',
                name: 'The exposure settles',
                see: 'Light’s own settle curve, cubic-bezier(0.16, 1, 0.3, 1): most of the exposure comes down at once, then it settles into focus for the rest of the 420 ms, the way a lens pulls focus and stops. The close is the same backwards on the inverse curve.',
                verdict: rec(
                    'it is the register’s own curve for arriving things and it is how focus is pulled: fast, then the last touch; and it is not titanium’s quick-out, which never settles this long.',
                ),
            },
            {
                key: 'commit',
                name: 'The commit curve',
                see: 'cubic-bezier(0.2, 0, 0, 1), the shared --fx-ease: a quick start and a long, even settle.',
                verdict: not('it is formal’s and the default of the set; a focus pull on it looks like a slide.'),
            },
            {
                key: 'linear',
                name: 'Linear',
                see: 'The exposure comes down at one pace and stops dead.',
                verdict: not('a lens does not stop dead; the last moment of focus is where the eye is.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'Each part on its motion today: the dialog’s window opens from a slit on the settle curve, the menu appears at once, the tile fades.',
                verdict: not('a slit, a jump and a fade; none of them the glare.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Does a part travel while it comes into focus, and in what order does a group come?',
        why: 'Today the register’s leave rises 8 px into the glare and the picks rise, slide and lift. A photograph does not move while it is exposed.',
        kind: 'cycle',
        scene: 'direction',
        options: [
            {
                key: 'place',
                name: 'In place, no travel',
                see: 'Each day, the tile and the figure come into focus exactly where they stand; a group comes one after the other in reading order, 90 ms apart; the trend’s line is exposed along its length from the start, the glare running ahead of the focus.',
                verdict: rec('the picture is already there and only its exposure changes; no other theme arrives without moving.'),
            },
            {
                key: 'rise',
                name: 'Rises 8 px out of the glare (today)',
                see: 'Every part rises 8 px while it comes into focus, as the register’s leave does backwards.',
                verdict: not(
                    'the rise is small enough to be a tremor and large enough to be forest’s and solstice’s rising; it adds nothing to the exposure.',
                ),
            },
            {
                key: 'feed',
                name: 'Start → end',
                see: 'Each part is exposed from its start edge to its end edge, the glare wiping across it.',
                verdict: not('a wipe is titanium’s feed and deco’s glint; a photograph is exposed whole.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open, and how does it close?',
        why: 'Today the dialog and the toast open as a window from a slit at their centre (2.24 s, cut short by the reverse-close to 420 ms), the menu pops (the pick), the tooltip floats in 4 px.',
        kind: 'cycle',
        scene: 'opening',
        options: [
            {
                key: 'focus',
                name: 'Into focus under its anchor',
                see: 'The menu is a glare under its button that comes into focus; the dialog a glare where it stands; both go back into the glare to close, 420 ms each way.',
                verdict: rec('one picture for every panel, the anchor’s own; the words are never cut by a slit or squashed by a pop.'),
            },
            {
                key: 'window',
                name: 'The window from a slit (today)',
                see: 'A small rounded slit at the centre widens to the whole panel on the settle curve; closes to the slit.',
                verdict: not('it is deco’s centre-line opening with round corners, and it cuts the words while it opens.'),
            },
            {
                key: 'pop',
                name: 'A soft pop (the pick)',
                see: 'The menu scales up from 97 % with a gentle overshoot and scales down to leave.',
                verdict: not('a pop is what every default menu does; nothing of the exposure is in it.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long do a contact, an exposure, a group and a busy loop take?',
        why: 'Every option shows the same picture (parts coming into focus in place, groups in reading order, closing into the glare); only the times differ.',
        kind: 'cycle',
        scene: 'durations',
        options: [
            {
                key: 'exposure',
                name: 'One exposure: 150 · 420 (+90) · 2400 ms',
                see: 'A press answers in 150 ms; an exposure takes 420 ms (the register’s leave today); a group comes 90 ms apart (the register’s toasts); the busy bar’s glare runs the line in 2.4 s.',
                verdict: rec('the register’s own times, already measured in use: quick to answer, slow enough to see the focus pulled.'),
            },
            {
                key: 'brisk',
                name: 'Brisk: 100 · 260 (+60) · 1600 ms',
                see: 'A press in 100 ms, an exposure in 260 ms, a group 60 ms apart, the loop in 1.6 s.',
                verdict: not('an exposure in 260 ms is a blink; the glare is gone before it is seen.'),
            },
            {
                key: 'unhurried',
                name: 'Unhurried: 200 · 700 (+120) · 3600 ms',
                see: 'A press in 200 ms, an exposure in 700 ms, a group 120 ms apart, the loop in 3.6 s.',
                verdict: not('a dialog that takes 0.7 s to come into focus feels like a slow lens; a 200 ms press feels late.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What may be indigo, what may be cyan, and what colour is the glare?',
        why: 'The register keeps cyan a fill and never a word; the picks warm the hover with an amber halo and wash the chart’s sky pale blue.',
        kind: 'still',
        scene: 'colour',
        options: [
            {
                key: 'indigo',
                name: 'Indigo acts, cyan is light, white overexposes',
                see: 'Every act and pick is indigo; cyan is the bead, the glint, the laurel rule and nothing with words; the glare is white (brightness, not a tint); the status tints show a state, their inks say it.',
                verdict: rec('one acting colour, one colour for light itself, and a glare that is light and not paint.'),
            },
            {
                key: 'cyan',
                name: 'The glare is cyan',
                see: 'The overexposure tints toward cyan on its way to white: the arriving part is cyan-bright first.',
                verdict: not('a cyan flash on every arrival is light coloured in; the anatomy says no mood.'),
            },
            {
                key: 'amber',
                name: 'An amber warmth (the picks)',
                see: 'Hover and focus warm the control with an amber glow (the header’s and the key figure’s pick).',
                verdict: not('amber is solstice’s and blueprint’s; light has no warmth.'),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'Which corners are pills, which are 0.5 rem?',
        why: 'The register has two vocabularies: pills for what you act on, 0.5 rem for what you read; the picks add wide-radius soft cards and a folded corner.',
        kind: 'still',
        scene: 'corners',
        options: [
            {
                key: 'two',
                name: 'Pills for acting, 0.5 rem for reading',
                see: 'Buttons, chips, tags, the tooltip, the switch and the bar’s line are pills; cards, inputs, dialogs and menus take 0.5 rem; the checkbox 0.3 rem; as the register has it.',
                verdict: rec('the two radii already say what you can press and what you read; nothing to add.'),
            },
            {
                key: 'pills',
                name: 'All pills',
                see: 'Every plate and tag at 999 px: cards, dialogs and menus as stadiums.',
                verdict: not('a stadium card is pastel’s; a dialog with pill corners cannot hold a table.'),
            },
            {
                key: 'half',
                name: 'All 0.5 rem',
                see: 'Buttons and chips at 0.5 rem like the cards.',
                verdict: not('the pill is the one thing that tells a light button from a formal one.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is on the white before anything happens?',
        why: 'The register has nothing but three soft shadows and the seam with its circle; the picks add daylight skies, sun corners, soft cards everywhere.',
        kind: 'still',
        scene: 'surface',
        options: [
            {
                key: 'white',
                name: 'White, three shadows, the seam',
                see: 'Surfaces are white on white, told apart by the small, medium and large shadow; the seam with its open circle divides; no texture, no gradient, no sky.',
                verdict: rec('restraint is the decision; a photograph on white paper has no wallpaper behind it.'),
            },
            {
                key: 'flat',
                name: 'Flat white, lines only',
                see: 'No shadows: hairlines divide every surface.',
                verdict: not('without the shadows nothing is nearer than anything else; light’s depth is its only mood.'),
            },
            {
                key: 'sky',
                name: 'Daylight skies (the picks)',
                see: 'A pale sky at the top of the chart, a sun just off frame in the card’s corner, day cards lifted off a pale sky.',
                verdict: not('a sky is solstice’s and a sun corner is deco’s crest in blue; light is not a window.'),
            },
        ],
    },
    {
        id: 'warning',
        label: 'A warning',
        rule: 'G8',
        question: 'How does a figure that needs attention look?',
        why: 'Your tone picks for the tiles, the trend and the key figure are the coloured tab: a band of the tone’s colour along the card’s top and the change on a soft pill.',
        kind: 'still',
        scene: 'warning',
        options: [
            {
                key: 'band',
                name: 'A band along the top and a pill',
                see: 'The card carries a 3 px band of the tone’s colour along its top edge and the change sits on a soft pill in the tone’s ink; the card stays white.',
                verdict: rec('it is your pick for three components, and it keeps the card white: the tone is a tab, not a wash.'),
            },
            {
                key: 'tinted',
                name: 'The tinted card',
                see: 'The whole card takes the tone’s pale tint with its ink.',
                verdict: not('a tinted card is the alert, and every theme’s warning.'),
            },
            {
                key: 'exposed',
                name: 'The figure overexposed in the tone',
                see: 'The figure burns out in the tone’s colour for a beat whenever it is drawn.',
                verdict: not('a flash in red is an alarm, and a flash the flash gate counts.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens when a figure changes?',
        why: 'Today the register declares no update; the picks swell the figure softly to 112 % and back.',
        kind: 'cycle',
        scene: 'live',
        options: [
            {
                key: 'reexposed',
                name: 'Re-exposed',
                see: 'The changed figure goes into the glare for a beat (brightness 1.4, blur 2 px) and comes back into focus, 420 ms; the figure, the word, the line never move.',
                verdict: rec('it is the anchor on the changed figure: the new value is a new exposure; nothing swells.'),
            },
            {
                key: 'swell',
                name: 'The soft swell (the picks)',
                see: 'The figure swells to 112 % and settles, 500 ms ease-in-out.',
                verdict: not('a swell moves the figure and its neighbours; it is the forest round’s rejected swell and every theme’s pulse.'),
            },
            {
                key: 'none',
                name: 'Nothing (today)',
                see: 'The new value replaces the old at once.',
                verdict: not('a change you cannot see is a change you miss.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does a waiting surface show?',
        why: 'Your picks load with daylight bands, a dashed baseline drifting, a rising band; the register’s skeleton opens pills by a clip.',
        kind: 'loop',
        scene: 'loading',
        options: [
            {
                key: 'unfocused',
                name: 'Out of focus',
                see: 'The waiting surface stands in the glare, blurred and bright, its exposure breathing slowly (brightness 1.3 to 1.6, blur 3 to 5 px, 2.4 s) until the reading comes into focus; the skeleton’s pills are out of focus the same way; a tile, a panel, a menu entry, a day, a chart’s plot.',
                verdict: rec(
                    'waiting is the one state where the picture is not yet in focus; no band, no bar, no shimmer, and nothing like any other theme.',
                ),
            },
            {
                key: 'daylight',
                name: 'The daylight band (the picks)',
                see: 'A soft band of cyan light crosses the waiting part slowly, again and again.',
                verdict: not('it is your most frequent loading pick, but a band crossing a surface is titanium’s bath and every skeleton shimmer.'),
            },
            {
                key: 'dashed',
                name: 'The dashed baseline (the picks)',
                see: 'A dashed line under the waiting part drifts to the right.',
                verdict: not('a drifting dash is dark’s ticker in grey.'),
            },
            {
                key: 'clip',
                name: 'The skeleton’s clip (today)',
                see: 'Muted pills open from the start by a clip, 120 ms apart, once.',
                verdict: not('a pill opening once is an arrival, not a wait; after it the surface is still.'),
            },
        ],
    },
    {
        id: 'busybar',
        label: 'The busy progress bar',
        rule: 'G11',
        question: 'What does the progress bar do while no share is known?',
        why: 'Today the busy bar is three beads that do not move. The bar with a share is the indigo line with the bead at its head.',
        kind: 'loop',
        scene: 'busybar',
        options: [
            {
                key: 'glare',
                name: 'A glare runs the line',
                see: 'The indigo line is drawn whole and a short overexposed stretch (white, blurred) runs along it from the start and comes round again, 2.4 s, the bead at its head; the share bar beside it unchanged.',
                verdict: rec('the busy bar is the anchor on a line: the exposure runs along it until the share is known.'),
            },
            {
                key: 'beads',
                name: 'The three beads walk',
                see: 'The register’s three beads step along the track one place at a time and come round.',
                verdict: not('three dots walking is every loading indicator since the dial-up modem.'),
            },
            {
                key: 'orbit',
                name: 'The bead orbits the line',
                see: 'One cyan bead runs to the end of the hairline and back.',
                verdict: not('a bead to and fro is the meter’s band and nostromo’s bargraph.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G12',
        question: 'What does the spinner draw?',
        why: 'Today an indigo bead and a cyan bead orbit a hairline ring on the settle curve.',
        kind: 'loop',
        scene: 'spinner',
        options: [
            {
                key: 'burn',
                name: 'The bead burns out at the top',
                see: 'The register’s ring and its two beads orbiting, and the indigo bead overexposes as it passes the top (brighter, a 4 px blur) and comes back into focus by the foot; three sizes, in a busy button, in the busy panel.',
                verdict: rec('the spinner the register has, with the anchor on it: one bead goes into the glare and back every turn.'),
            },
            {
                key: 'orbit',
                name: 'The two beads (today)',
                see: 'The ring and the two beads orbiting, as the register draws them.',
                verdict: not('it is fine as it is, but nothing of the glare is in it.'),
            },
            {
                key: 'breathe',
                name: 'A ring breathing into the glare',
                see: 'A hairline ring blurs and brightens and comes back into focus, 1.2 s, no beads.',
                verdict: not('a ring breathing is a pulse; without the beads nothing turns, so nothing says working.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G13',
        question: 'How does a part arrive, and how does it leave?',
        why: 'Today a leaving part rises 8 px into the glare (brightness 1.6, blur 5 px) and an arriving part is that played backwards; the dialog opens as a window.',
        kind: 'cycle',
        scene: 'leave',
        options: [
            {
                key: 'place',
                name: 'Out of the glare in place',
                see: 'An alert, a card and a figure come into focus where they stand and go back into the glare to leave: one animation, forward and backwards, no rise.',
                verdict: rec('the anchor exactly, both ways; nothing moves but the exposure.'),
            },
            {
                key: 'rise',
                name: 'With the 8 px rise (today)',
                see: 'The register’s leave: into the glare and 8 px up; arriving, down out of it.',
                verdict: not('the rise is a tremor on a picture that should stand still.'),
            },
            {
                key: 'window',
                name: 'The window',
                see: 'The part opens from a rounded slit at its centre and closes to it.',
                verdict: not('the slit cuts the words; and it is deco’s opening with soft corners.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G14',
        question: 'Is a button inside a header, a menu, a tile or a drawer light’s own button?',
        why: 'The header’s pick warms its buttons with a glow, the tile’s Open becomes a filled pill on hover, the menu’s entries lift. Use the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: 'composites',
        options: [
            {
                key: 'own',
                name: 'Exactly light’s own',
                see: 'Every button, link and entry inside a composite hovers, focuses and presses exactly like the one standing alone: it settles toward the paper on hover, DI2’s ring on focus, lands flat and flashes on press.',
                verdict: rec('one manner for every control, wherever it stands.'),
            },
            {
                key: 'card',
                name: 'Light’s own on a soft card',
                see: 'The same manners, and the header’s actions and the drawer’s buttons sit on a soft card of their own with the small shadow.',
                verdict: not('a shadow on a shadow; the pill then settles toward a card that is itself lifted.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The warm glow, the filled Open pill, the lifted entry: three manners.',
                verdict: not('three hovers on one page.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G15',
        question: 'What happens where the pointer rests?',
        why: 'The register settles a button 2 px toward the paper and tightens its shadow (gap-4); the picks lift tiles and entries on a growing shadow. Use State: Hover.',
        kind: 'still',
        scene: 'hover',
        options: [
            {
                key: 'settle',
                name: 'Settles toward the paper',
                see: 'The control settles 2 px down and its shadow tightens from wide to close; a menu entry takes the muted wash; a link takes the pale-cyan wash; a tile’s shadow does not grow.',
                verdict: rec('it is the register’s own decision, the reverse of every kit that lifts, and it says the pointer has weight.'),
            },
            {
                key: 'lift',
                name: 'The shadow lifts (the picks)',
                see: 'The hovered tile, entry or pill rises on a wider shadow.',
                verdict: not('a lift on hover is Material’s and every kit’s; light decided the opposite on purpose.'),
            },
            {
                key: 'bright',
                name: 'A touch overexposed',
                see: 'The hovered control brightens 8 % and loses a hair of sharpness.',
                verdict: not('a blur on hover makes the label harder to read exactly when it is being read.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G16',
        question: 'What marks the control the keyboard is on?',
        why: 'DI2 fixes the two-channel ring; the picks add a halo of warm light. Use State: Focus.',
        kind: 'still',
        scene: 'focus',
        options: [
            {
                key: 'di2',
                name: 'The two-channel ring',
                see: 'DI2’s ring exactly: the ink ring on the white outline, with the settle under it when the part is also pointed at.',
                verdict: rec('a system constant; a halo would soften the one mark that must be hard.'),
            },
            {
                key: 'halo',
                name: 'A halo of light (the picks)',
                see: 'A soft wide cyan halo round the focused control instead of the ring.',
                verdict: not('a soft halo on white fails the contrast the ring was written for.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The register’s ring plus the picks’ amber halo and the tile’s soft focus ring.',
                verdict: not('three focus marks.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G17',
        question: 'What does a press do?',
        why: 'The register has no press of its own; the picks flatten the pill or narrow the glow. Use State: Press.',
        kind: 'still',
        scene: 'press',
        options: [
            {
                key: 'flash',
                name: 'Lands and flashes',
                see: 'The pill settles flat (its shadow gone) and overexposes for the contact (brightness 1.25 for 150 ms), then is crisp in its pressed ground; release lifts it back.',
                verdict: rec('the press is the exposure at its quickest: the shutter.'),
            },
            {
                key: 'flat',
                name: 'Lands flat',
                see: 'The pill settles flat, shadow gone, pressed ground; no flash.',
                verdict: not('right as a landing, but nothing of the anchor is in it.'),
            },
            {
                key: 'none',
                name: 'Nothing (today)',
                see: 'The register as it stands: the hover state holds while pressed.',
                verdict: not('a press that shows nothing is the state the anchor was picked to give.'),
            },
        ],
    },
    {
        id: 'type',
        label: 'The voice',
        rule: 'G18',
        question: 'In which face and weight are the figures, the labels and the prose set?',
        why: 'The anatomy says no display face; the register sets everything in Instrument Sans with 600 headings and mono for identifiers.',
        kind: 'still',
        scene: 'type',
        options: [
            {
                key: 'one',
                name: 'One face, two weights',
                see: 'Instrument Sans for everything: headings 600 tracked −0.01 em, figures 600 tabular, labels 500 at 0.8125 rem, prose 400; mono only for identifiers and timestamps.',
                verdict: rec('one voice is the decision; the weights do the work a second face would do.'),
            },
            {
                key: 'mono',
                name: 'Figures in mono',
                see: 'Figures and timestamps in the monospace face.',
                verdict: not('a typewriter figure is titanium’s and terminal’s; light’s figure is the same voice, heavier.'),
            },
            {
                key: 'heavy',
                name: 'Headings tight and heavy',
                see: 'Headings at 700 tracked −0.03 em, figures 700.',
                verdict: not('it is grotesk’s shout in a lighter face.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G19',
        question: 'Which marks may light draw, and where?',
        why: 'The register draws the seam with its circle and the bead; the picks add suns, gnomons, glints, sticky notes and folded corners.',
        kind: 'still',
        scene: 'motifs',
        options: [
            {
                key: 'seam',
                name: 'The seam, its circle, the bead',
                see: 'A hairline with an open circle divides; the bead is the head of a line and the spinner’s dot; nothing else is drawn.',
                verdict: rec('two marks and no ornament, as the anatomy was written.'),
            },
            {
                key: 'sun',
                name: 'Plus the sun and the gnomon (the picks)',
                see: 'The meter’s gnomon with its shadow, the calendar’s ring of sunlight, the sun corner on the key figure.',
                verdict: not('a sun and a shadow are solstice’s; light shows light, not its source.'),
            },
            {
                key: 'none',
                name: 'None',
                see: 'No seam circle, no bead: hairlines and lines only.',
                verdict: not('without the circle and the bead nothing tells a light page from a wireframe.'),
            },
        ],
    },
];
