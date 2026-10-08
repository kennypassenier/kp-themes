// What makes deco deco: the nineteen questions, as data. The designer's
// text, verbatim; demo.js wires each aspect's scene and options.css draws
// each option by `data-dc-<id>="<key>"` on the scene. The grammar is
// themes/deco/CHARACTER.md (G1–G21); the anchor is the fan
// (research/deco-anchor, Kenny 2026-10-08): a crest of gold rays folded to
// a point opens ray by ray and folds back. Kenny added that the progress bar
// is to be redone: question 11.

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

export const THEME = 'deco';
export const LABEL = 'Art Deco';
export const TITLE = 'What makes deco deco';
export const STORY = {
    what: 'Deco is the lobby of 1925: flat gold on blue-black lacquer, an emerald and a ruby as jewels, capitals tracked wide, double rules, the chevron and the lozenge, corners cut and never rounded. The anchor you picked says what the lobby does: it fans open. A crest of rays folded to a point opens ray by ray from one side to the other and folds back the same way.',
    so: 'So everything that happens on screen is a fan: it opens from a point (arriving, opening), is counted ray by ray (every motion is stepped, never smeared), folds shut (leaving). Gold is never a gradient, nothing fades, nothing slides, nothing rises.',
    decided:
        'Already decided by you: the anchor = the fan opens (the anchor round), and the progress bar is to be redone (question 11 asks which bar replaces the pennant); the network graph changes in no theme. The questions below turn the anchor into rules for every other component; where a decided pick is at odds with the rule, the pick is on the page as an option named “the pick”. The full analysis is in themes/deco/CHARACTER.md.',
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
        question: 'A dialog, a menu and a tile fan open. On which curve does a fan open?',
        why: 'In every option every part fans open from its base for the same 480 ms (its rays first, the plate behind them), so only the curve differs. Beside the parts a fan of twelve rays opens next to one on an even sweep.',
        kind: 'cycle',
        scene: 'moving',
        options: [
            {
                key: 'counted',
                name: 'Ray by ray, counted',
                see: 'The fan opens one ray per step, twelve steps in 480 ms, each ray whole, nothing between two rays (steps); the plate follows in the same count; the close is the same steps backwards.',
                verdict: rec(
                    'a fan has rays, not a sweep: it opens by whole rays, and a count is what tells deco’s fan from solstice’s sun and synthwave’s stripes, which glide.',
                ),
            },
            {
                key: 'sweep',
                name: 'One smooth sweep',
                see: 'The fan opens as one sweep of its angle, linear, the rays appearing wherever the sweep has passed.',
                verdict: not('a sweep smears the rays; the anchor demo opened ray by ray and you picked it.'),
            },
            {
                key: 'register',
                name: 'The register’s curve (today)',
                see: 'cubic-bezier(0.4, 0, 0.2, 1), the Material curve the register puts on everything: the fan fades in on it.',
                verdict: not('the least characterful curve in the set, and a fade is not a fan opening.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'From where does a fan open, and in what order does a group come?',
        why: 'A fan opens from its base point up and out; the picks rise skylines and curtains from the foot and chase bulbs from the start.',
        kind: 'cycle',
        scene: 'direction',
        options: [
            {
                key: 'point',
                name: 'From a point outward, groups from the centre',
                see: 'Each day fans open from its base; a group of days comes from the centre out (the middle first, then one on each side); the tile fans open from its base; the trend’s line is lit from its start as a fan from its first ray.',
                verdict: rec('one origin for everything: a point, and from it outward; a group that opens from its centre is a fan of parts.'),
            },
            {
                key: 'rise',
                name: 'Rising from the foot (the picks)',
                see: 'The days, the tile and the line rise from their foot into place, slowing as they land (the curtain, the skyline).',
                verdict: not('rising is forest’s growth and solstice’s light; a fan does not rise, it opens.'),
            },
            {
                key: 'feed',
                name: 'Start → end',
                see: 'Everything is revealed from its start edge to its end, the glint’s way.',
                verdict: not('a wipe is titanium’s feed and the glint you did not pick as the anchor.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open, and how does it close?',
        why: 'Today the dialog rises as a sun (the crest fans, the panel unfolds), the toast and the tooltip open from their centre line, the menu’s pick is unveiled by a gold sweep from the top.',
        kind: 'cycle',
        scene: 'opening',
        options: [
            {
                key: 'fan',
                name: 'Fans open from its anchor',
                see: 'The menu fans open from its button’s base point: its rays first, counted, then the plate behind them; the dialog fans open from the base of its crest, the crest first, then the panel; both fold shut the same way.',
                verdict: rec(
                    'the sun that rises on the dialog today, counted and given to every panel; the menu comes out of its button the way a fan comes out of a hand.',
                ),
            },
            {
                key: 'curtain',
                name: 'The curtain rises (the picks)',
                see: 'A pleated lacquer curtain lifts off the panel from its hem.',
                verdict: not('the theatre is deco’s too, but a curtain rises and the anchor opens from a point.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The dialog’s smooth sunrise, the toast’s and the tooltip’s centre-line clip, the menu at once.',
                verdict: not('three openings; the centre-line clip is a window, not a fan.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long do a contact, a fan, a plate, a group and a loop take?',
        why: 'Every option shows the same picture (fans opening ray by ray, plates behind them, groups from the centre); only the times differ.',
        kind: 'cycle',
        scene: 'durations',
        options: [
            {
                key: 'fan',
                name: 'One fan: 160 · 480 (+160, +80) · 2400 ms',
                see: 'A press answers in 160 ms; a fan of twelve rays opens in 480 ms (40 ms a ray); the plate behind it takes 160 ms more; a group comes 80 ms apart from the centre; the spinner’s fan opens and folds in 2.4 s.',
                verdict: rec('forty milliseconds a ray is slow enough to count and quick enough that a menu is open in two thirds of a second.'),
            },
            {
                key: 'brisk',
                name: 'Brisk: 120 · 320 (+100, +50) · 1600 ms',
                see: 'A press in 120 ms, a fan in 320 ms, the plate 100 ms after, a group 50 ms apart, the loop in 1.6 s.',
                verdict: not('27 ms a ray cannot be counted; the fan reads as a flicker.'),
            },
            {
                key: 'grand',
                name: 'Grand: 200 · 720 (+240, +120) · 3600 ms',
                see: 'A press in 200 ms, a fan in 720 ms, the plate 240 ms after, a group 120 ms apart, the loop in 3.6 s.',
                verdict: not('a dialog that takes a second to open is a ceremony; the lobby is grand, the lift is quick.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What may be gold, what emerald, what ruby?',
        why: 'The anatomy says gold is flat; the picks glint the gold, light bulbs, and put a sunburst behind warnings.',
        kind: 'still',
        scene: 'colour',
        options: [
            {
                key: 'flat',
                name: 'Gold acts flat, emerald marks, ruby warns',
                see: 'Every rule, ray, act and pick is flat gold; emerald is the jewel on what is current or done (the head, the picked day, the switch); ruby warns on a plate with ivory ink; ivory is every word; no gradient, no glow.',
                verdict: rec('one gold, always flat (a gradient reads as a casino), one jewel for what is done, one for what is wrong.'),
            },
            {
                key: 'glint',
                name: 'Gold with a glint (the picks)',
                see: 'A bright glint runs along the gold rules and the lit bulbs glow.',
                verdict: not('a glint is a gradient that moves; the anatomy forbids it and it is the loading of half the set.'),
            },
            {
                key: 'ivory',
                name: 'Gold and ivory only',
                see: 'No emerald, no ruby: a failure is ivory on lacquer with a heavier rule.',
                verdict: not('without the jewels nothing says done or wrong but a rule’s weight.'),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'How are the corners cut?',
        why: 'Radius is 0; the cartouche bites one corner as a chevron; the tooltip carries a stepped ziggurat notch; the picks step corners everywhere.',
        kind: 'still',
        scene: 'corners',
        options: [
            {
                key: 'cut',
                name: 'Cut corners, lozenge ends',
                see: 'Plates have radius 0 and one corner bitten as a chevron; small parts (tags, the change, the tooltip, the bar’s head) end in a lozenge point; the stepped notch stays the tooltip’s alone.',
                verdict: rec('one bite and one point: the chevron and the lozenge, deco’s two shapes, each in its place.'),
            },
            {
                key: 'stepped',
                name: 'Stepped ziggurat corners',
                see: 'Every plate’s corners stepped in three setbacks.',
                verdict: not('setbacks on every card is a skyline of cards; the ziggurat is for the tower, not the tag.'),
            },
            {
                key: 'square',
                name: 'All square',
                see: 'Radius 0, no bite, no point.',
                verdict: not('square and nothing else is brutalism’s and grotesk’s; the bite is deco’s signature.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is on the lacquer before anything happens?',
        why: 'The register has the chevron lattice felt and not seen and the double rule; the picks put a sunburst behind every title and setbacks behind every plate.',
        kind: 'still',
        scene: 'surface',
        options: [
            {
                key: 'lacquer',
                name: 'Lacquer, the double rule, one crest',
                see: 'Blue-black lacquer with the lattice at 5 %; the double gold rule on what matters (a dialog, a header, a certificate); a title may stand under one small crest; a plain card, a tile, a menu is lacquer with a hairline.',
                verdict: rec('a crest means something when there is one; the double rule frames what matters and nothing else is ornamented.'),
            },
            {
                key: 'sunburst',
                name: 'A sunburst behind every figure (the picks)',
                see: 'The faint sunburst behind the key figure, the menu’s headings, the state word, the header’s title.',
                verdict: not('when every figure has a crest the fan has no moment of its own.'),
            },
            {
                key: 'setbacks',
                name: 'Setbacks behind every plate (the picks)',
                see: 'Fine gold setback lines rising behind the trend, the tiles, the chart.',
                verdict: not('a skyline behind every plate is wallpaper, and it rises where the anchor opens.'),
            },
        ],
    },
    {
        id: 'warning',
        label: 'A warning',
        rule: 'G8',
        question: 'How does a figure that needs attention look?',
        why: 'Your tone picks for the trend, the key figure and the tiles are the gilt notice; the state word’s pick tints its sunburst; the menu’s frames the entry all round.',
        kind: 'still',
        scene: 'warning',
        options: [
            {
                key: 'notice',
                name: 'The gilt notice',
                see: 'A warning or failed figure sits on a plaque ringed twice in the tone’s colour (ruby for a failure) with ivory ink, its change on a lozenge-ended tag; the plate behind stays lacquer.',
                verdict: rec('it is your pick for three components and the lobby’s own notice: a plaque, not a wash.'),
            },
            {
                key: 'tinted',
                name: 'A tinted sunburst (the state’s pick)',
                see: 'The crest behind the figure tints toward the tone’s colour.',
                verdict: not('a ruby sunburst is an alarm, and the surface question retires sunbursts behind figures.'),
            },
            {
                key: 'framed',
                name: 'Framed all round in gold',
                see: 'The whole card takes a heavy double gold frame.',
                verdict: not('a gold frame says “matters”, not “wrong”; nostromo frames its klaxon.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens when a figure changes?',
        why: 'The register declares no update; the picks flare the figure gold, grow an underline, run a glint.',
        kind: 'cycle',
        scene: 'live',
        options: [
            {
                key: 'flash',
                name: 'One flash of the fan',
                see: 'Behind the changed figure a small fan opens ray by ray and folds (480 ms each way); the figure, the word, the line never move.',
                verdict: rec('the anchor on the changed figure: a fan opens for it and folds; nothing flares, nothing swells.'),
            },
            {
                key: 'gilded',
                name: 'Gilded: a flare (the picks)',
                see: 'The figure flares gold, swells once and settles.',
                verdict: not('a flare is a glow, which deco has only on its lamps, and a swell moves the figure.'),
            },
            {
                key: 'glint',
                name: 'The glint (the picks)',
                see: 'A glint runs along the changed figure’s rule.',
                verdict: not('a glint is a moving gradient and every theme’s shimmer.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does a waiting surface show?',
        why: 'Your picks load with glints (calendar, columns, menu), bulbs chasing (tiles, busy), a sunburst opening (key figure), the fan rays (chart), the setbacks climbing (trend).',
        kind: 'loop',
        scene: 'loading',
        options: [
            {
                key: 'fan',
                name: 'A fan opens and folds',
                see: 'On every waiting surface a crest of rays opens from the surface’s foot-centre ray by ray and folds, and opens again; the skeleton’s lines are lit ray by ray from the start: a tile, a panel, a menu entry, a day, a chart’s plot.',
                verdict: rec('your chart and key figure picks carried everywhere: a surface waiting is a fan opening for what is coming.'),
            },
            {
                key: 'glint',
                name: 'The glint runs (the picks)',
                see: 'A glint runs along the waiting part’s gilt, again and again.',
                verdict: not('your most frequent loading pick, but it is a gradient on the move and the shimmer of every skeleton.'),
            },
            {
                key: 'bulbs',
                name: 'The bulbs chase (the picks)',
                see: 'Marquee bulbs along the waiting part light in turn in hard steps.',
                verdict: not('a marquee is retro’s and synthwave’s device, and the motif question retires the bulbs.'),
            },
            {
                key: 'strips',
                name: 'The skeleton’s strips (today)',
                see: 'Lozenge-ended strips open from their centre, hold, fade, 2.8 s.',
                verdict: not('a strip opening from its centre and fading is the window clip again, in gold.'),
            },
        ],
    },
    {
        id: 'bar',
        label: 'The progress bar, redone',
        rule: 'G11',
        question: 'Which bar replaces the pennant? Each option is shown with a share known and busy.',
        why: 'You said the fluted pennant with its emerald lozenge must be redone. Every option here keeps the double-rule track and the flat gold, and differs in what the share is made of.',
        kind: 'loop',
        scene: 'bar',
        options: [
            {
                key: 'rays',
                name: 'A fan laid flat',
                see: 'The track is a row of thin gold rays, each a lozenge-ended stroke at 22 %, a fan laid along a line; the share lights the rays one by one from the start (counted), the head is the last lit ray’s lozenge in emerald; busy: the rays light across and fold back, 2.4 s.',
                verdict: rec(
                    'the anchor laid flat: a bar that is counted in rays, lit in flat gold, with the jewel at its head and no flute, no gradient, no chevron point.',
                ),
            },
            {
                key: 'band',
                name: 'A flat band with a chevron tip',
                see: 'A flat gold band on the double-rule track, its leading end cut as a chevron, no flutes; busy: the band runs across and back.',
                verdict: not('it is the pennant with the flutes and the jewel taken off; what you did not like stays in its shape.'),
            },
            {
                key: 'lamps',
                name: 'The lift’s lamps',
                see: 'A row of lamps along the track lit one by one, the meter’s floor indicator as a bar; busy: a pair of lamps runs along.',
                verdict: not('lamps glow, and the motif question retires the lamps with the bulbs.'),
            },
            {
                key: 'tiers',
                name: 'Stepped tiers',
                see: 'The share rises as a stepped gold staircase along the track, each tier a setback; busy: the staircase climbs and falls.',
                verdict: not('a staircase on a bar is the setbacks the surface question retires, and a bar that rises in tiers reads as a chart.'),
            },
            {
                key: 'pennant',
                name: 'The pennant (today, for reference)',
                see: 'The fluted gold pennant with its chevron tip and emerald lozenge, as the register draws it.',
                verdict: not('you asked for it to be redone.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G12',
        question: 'What does the spinner draw?',
        why: 'Today a sunburst of rays rotates inside a double ring.',
        kind: 'loop',
        scene: 'spinner',
        options: [
            {
                key: 'fan',
                name: 'A fan opens and folds',
                see: 'A crest of twelve rays opens ray by ray and folds ray by ray round a gold centre dot, 2.4 s a loop, never turning; three sizes, in a busy button, in the busy panel.',
                verdict: rec('the anchor as a spinner: a fan that opens and folds says working without turning like every other spinner.'),
            },
            {
                key: 'rotate',
                name: 'The sunburst rotates (today)',
                see: 'The register’s rays turning in 3.6 s, linear.',
                verdict: not('a turning sunburst is a turning thing, which every theme’s spinner is; the fan opens.'),
            },
            {
                key: 'lamps',
                name: 'The lift’s lamps round',
                see: 'Lamps round a ring lit one after the other.',
                verdict: not('lamps round a ring is the marquee again, and lamps are retired.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G13',
        question: 'How does a part arrive, and how does it leave?',
        why: 'Today a leaving part folds flat (scaleX to 0 and fades) and an arriving part is that backwards; the picks raise a curtain.',
        kind: 'cycle',
        scene: 'leave',
        options: [
            {
                key: 'fan',
                name: 'Fans open from its base, folds to it',
                see: 'An alert, a card and a figure arrive as a fan opening from their base point: the rays first (or, on a plate without a crest, the plate itself counted in vertical pleats from its centre out), then they stand; they leave folding to the point, the same steps backwards.',
                verdict: rec('the anchor both ways: open as a fan, fold as a fan, counted, no fade.'),
            },
            {
                key: 'flat',
                name: 'Folds flat (today)',
                see: 'The register’s leave: the part squeezes to nothing on its centre and fades; arriving, the reverse.',
                verdict: not('a squeeze with a fade is the picture of a fold without its count; the pleats make it a fan.'),
            },
            {
                key: 'curtain',
                name: 'The curtain (the picks)',
                see: 'A pleated curtain lifts to reveal the part and falls to hide it.',
                verdict: not('a curtain rises, and rising is retired by the direction question.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G14',
        question: 'Is a button inside a header, a menu, a tile or a drawer deco’s own button?',
        why: 'The header’s pick gilds its buttons’ edges with a flare, the tiles’ Open gains a plaque, the menu’s entries light like bulbs. Use the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: 'composites',
        options: [
            {
                key: 'own',
                name: 'Exactly deco’s own',
                see: 'Every button, link and entry inside a composite hovers, focuses and presses exactly like the one standing alone: the fan behind the label on hover, DI2’s ring on focus, the fan fully open on press.',
                verdict: rec('one manner for every control, wherever it stands.'),
            },
            {
                key: 'plaque',
                name: 'Deco’s own on a gilt plaque',
                see: 'The same manners, and the header’s actions and the drawer’s buttons sit on a gold-framed plaque the composite adds.',
                verdict: not('a frame round a framed button; the fan then opens inside two rules.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The gilded flare, the Open plaque, the chasing bulbs: three manners.',
                verdict: not('three hovers on one page.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G15',
        question: 'What happens where the pointer rests?',
        why: 'The register opens the fan behind a hovered button’s label (gap-4, faded in today); the picks flare the gilt edge and light bulbs. Use State: Hover.',
        kind: 'still',
        scene: 'hover',
        options: [
            {
                key: 'fan',
                name: 'The fan opens behind the label',
                see: 'The rays from the button’s lower-left corner open behind the label, counted; a menu entry’s fan opens from its start edge; a link gains its overline; a day in the month gets a small fan under its figure.',
                verdict: rec('it is the register’s own loudest gesture, counted now, and the anchor in the hand.'),
            },
            {
                key: 'edge',
                name: 'The gilded edge (the picks)',
                see: 'The hovered control’s gold edge brightens with a flare.',
                verdict: not('a flare is a glow; the fan is the deco answer.'),
            },
            {
                key: 'bulbs',
                name: 'The bulbs light (the picks)',
                see: 'A row of bulbs along the hovered entry lights steady.',
                verdict: not('the marquee is retro’s and synthwave’s, and retired.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G16',
        question: 'What marks the control the keyboard is on?',
        why: 'DI2 fixes the two-channel ring; the picks ring the control in gold. Use State: Focus.',
        kind: 'still',
        scene: 'focus',
        options: [
            {
                key: 'di2',
                name: 'The two-channel ring',
                see: 'DI2’s ring exactly: the ivory ring on the lacquer outline, the fan under it when the part is also pointed at.',
                verdict: rec('a system constant; gold on gold would vanish on a primary button.'),
            },
            {
                key: 'double',
                name: 'A double gold ring',
                see: 'A 3px double gold ring round the focused control.',
                verdict: not('one channel in gold fails where the control is gold.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The register’s ring plus the picks’ gold rings and bulb frames.',
                verdict: not('three focus marks.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G17',
        question: 'What does a press do?',
        why: 'The register’s press is a colour step; the picks settle the flare or hold the bulbs lit. Use State: Press.',
        kind: 'still',
        scene: 'press',
        options: [
            {
                key: 'full',
                name: 'The fan opens fully',
                see: 'The fan behind the label opens all its rays and the face takes the pressed ground (gold at 8 % on a primary button); release folds the fan; nothing moves.',
                verdict: rec('hover opens the fan a little, the press opens it all: one gesture in two degrees.'),
            },
            {
                key: 'shut',
                name: 'The fan folds shut',
                see: 'The hover’s fan folds to its point on press and reopens on release.',
                verdict: not('a press that takes the fan away reads as a refusal.'),
            },
            {
                key: 'colour',
                name: 'A colour step (today)',
                see: 'The face takes the pressed ground; no motion.',
                verdict: not('the default press of the set; nothing of the anchor.'),
            },
        ],
    },
    {
        id: 'type',
        label: 'The voice',
        rule: 'G18',
        question: 'In which face are the titles, the figures and the prose set?',
        why: 'The register sets headings in Poiret One capitals and everything else in Josefin Sans.',
        kind: 'still',
        scene: 'type',
        options: [
            {
                key: 'poiret',
                name: 'Poiret capitals, Josefin figures',
                see: 'Titles and the words on a crest in Poiret One uppercase tracked 0.16 em; figures in Josefin Sans 600 tabular; labels in Josefin uppercase tracked 0.08 em; prose in Josefin; mono for identifiers only.',
                verdict: rec(
                    'Poiret is a display face built from circles and lines and reads at a title’s size; a figure in it would be a figure drawn with a compass.',
                ),
            },
            {
                key: 'figures',
                name: 'Poiret figures too',
                see: 'Large figures in Poiret One.',
                verdict: not('Poiret’s hairline digits vanish at a key figure’s weight and read as a logo.'),
            },
            {
                key: 'josefin',
                name: 'Josefin everywhere',
                see: 'Titles in Josefin Sans 600 uppercase.',
                verdict: not('without Poiret the lobby loses its lettering.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G19',
        question: 'Which marks may deco draw, and where?',
        why: 'The register draws the fan, the double rule, the lozenge and the chevron; the picks add marquee bulbs, setbacks, curtains and glints.',
        kind: 'still',
        scene: 'motifs',
        options: [
            {
                key: 'four',
                name: 'The fan, the double rule, the lozenge, the chevron',
                see: 'The fan where something happens; the double rule on what matters; the lozenge as a point and a jewel; the chevron as a corner’s bite; the setbacks stay the tooltip’s notch.',
                verdict: rec('four marks that are one style; the bulbs, the curtain and the glint are other themes’ or other eras’.'),
            },
            {
                key: 'bulbs',
                name: 'Plus the bulbs and the setbacks (the picks)',
                see: 'The four, and marquee bulbs round the tiles and the graph, setbacks behind the trend.',
                verdict: not('six marks; the marquee is retro’s and synthwave’s.'),
            },
            {
                key: 'all',
                name: 'As today (everything)',
                see: 'Every mark the picks and the register carry.',
                verdict: not('a lobby with every ornament of 1925 at once.'),
            },
        ],
    },
];
