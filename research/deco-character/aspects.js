// What makes deco deco: the nineteen questions, as data. The designer's
// text, verbatim; demo.js wires each aspect's scene and options.css draws
// each option by `data-dc-<id>="<key>"` on the scene. The grammar is
// themes/deco/CHARACTER.md (G1–G21); the anchor is the fan
// (research/deco-anchor, Kenny 2026-10-08). Update 1 (2026-10-08): Kenny did
// not approve thirteen of the nineteen (his comment is in update.json); those
// thirteen are redrawn here in his direction, thin gold on lacquer with the
// wallpaper, the fan unfolding smoothly, nothing counted; his six picks
// (durations, surface, live, spinner, focus, type) stay as round one wrote them.

export const THEME = 'deco';
export const LABEL = 'Art Deco';
export const TITLE = 'What makes deco deco';
export const STORY = {
    what: 'Deco is the grand lobby of 1925 after the lights go down: deep blue lacquer with the chevron wallpaper on every wall, thin gold inlay lines set into it with stepped corners, ivory type in wide capitals, one emerald as a jewel. Gold is a line and a small mark, never a wall of it. The anchor you picked says what the lobby does: it fans open — a fan of gold hairlines unfolds smoothly from its base, the way a lady’s fan opens, and folds back the same way. Nothing is counted, nothing shouts.',
    so: 'So everything that happens on screen is drawn in thin gold on lacquer: a part arrives as its gold inlay draws itself and its lacquer comes up behind it; a fan unfolds smoothly where something happens; a glint passes once and is gone. Symmetry rules (from the centre to both sides), motion is unhurried and settles, the wallpaper is behind every plate, and gold stays a hairline except on the one button that acts.',
    decided:
        'Already decided by you: the anchor = the fan opens; the progress bar is to be redone (question 11); the durations = one fan, 160 · 480 (+160, +80) · 2400 ms; the surface = lacquer, the double rule, one crest; a live update = gilded, a flare; the spinner = the sunburst rotates; the focus ring = a double gold ring; the voice = Poiret capitals, Josefin figures. Those six stay ticked. Update 1 (your comment on the other thirteen: “this should be the fancy, distinguished theme, with lots of gold accents and fancy blue backgrounds … it should exhume elegance without being too in your face”) redraws the thirteen: five new options each, the first recommended, all thin gold on lacquer with the wallpaper, nothing counted. The network graph changes in no theme. The full analysis is in themes/deco/CHARACTER.md.',
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
        question: 'A dialog, a menu and a tile come in on the lacquer. On which curve does deco move?',
        why: 'In every option every part arrives the same way for the same 480 ms (its gold inlay draws from the centre to both sides, then its lacquer and words come up), so only the curve differs. Beside the parts a fan of gold hairlines unfolds next to one at an even pace, so the curve is seen on its own.',
        kind: 'cycle',
        scene: 'moving',
        options: [
            {
                key: 'unfold',
                name: 'The fan unfolds and settles',
                see: 'Quick to start, long to settle: cubic-bezier(0.22, 1, 0.36, 1). The inlay is most of the way round in the first third of the 480 ms and spends the rest coming to rest; the fan opens its outer rays slowly last, the way a fan opened by hand comes to its full spread. The close is the same backwards on the inverse curve.',
                verdict:
                    'Recommended: this one, because a hand opens a fan fast and lets it settle; a line drawn that way reads as inlaid, not switched on, and the long settle is what makes the lobby unhurried. It is not light’s settle (light has no line to draw and settles out of a blur) and not formal’s even pace.',
            },
            {
                key: 'ceremony',
                name: 'Slow at both ends',
                see: 'cubic-bezier(0.65, 0, 0.35, 1), ease-in-out: the inlay starts slowly, runs, and slows into place; the fan opens the same way.',
                verdict: 'Not recommended, because slow at both ends is a ceremony on every menu; a part that takes its time to start feels late.',
            },
            {
                key: 'glint',
                name: 'Even, with a glint at the tip',
                see: 'The inlay draws at an even pace (linear) and a small glint rides its drawing tip; the fan opens evenly with a glint on its last ray.',
                verdict:
                    'Not recommended, because an even pace is formal’s ruling pen; the glint on the tip is decoration on a motion that has none of its own.',
            },
            {
                key: 'folds',
                name: 'In three folds',
                see: 'The fan opens as three pleats, one after the other, each on the settle curve, 120 ms apart; the inlay draws in three strokes the same way.',
                verdict:
                    'Not recommended, because three folds is a count in disguise; it reads as a stutter on a plate, and the stepped motion was what you did not want.',
            },
            {
                key: 'register',
                name: 'The register’s curve (today)',
                see: 'cubic-bezier(0.4, 0, 0.2, 1), the Material curve the register puts on everything: the inlay and the fan ease in on it.',
                verdict: 'Not recommended, because the least characterful curve in the set; nothing about it is a fan or a lobby.',
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'From where does deco draw a part, and in what order does a group come?',
        why: 'A week of days, a tile and a trend line arrive. Every option takes 480 ms and the same gold inlay; only where it starts and the order of the group differ.',
        kind: 'cycle',
        scene: 'direction',
        options: [
            {
                key: 'centre',
                name: 'From the centre to both sides',
                see: 'A plate’s inlay draws from the middle of its top edge round both ways and meets at the bottom; a group of days comes from its middle outward in pairs, 80 ms apart; the trend line is drawn from its middle to both ends. Everything symmetric.',
                verdict:
                    'Recommended: this one, because symmetry is deco’s first law (the Chrysler’s crown, a cartouche, a lobby door); a group that opens from its centre is a fan of parts, and nothing else in the set draws from the centre out.',
            },
            {
                key: 'base',
                name: 'From the base point up and out',
                see: 'Everything opens from the bottom-centre of its footprint, up and out to both top corners, the fan’s own geometry; a group from its foot.',
                verdict:
                    'Not recommended, because a plate unfolding from its foot leans toward solstice’s rising sun; the geometry fits a fan and nothing else.',
            },
            {
                key: 'descend',
                name: 'From the top down',
                see: 'The inlay draws from the top edge down both sides, like a chandelier lowered; a group comes top to bottom; the trend line from its start.',
                verdict: 'Not recommended, because top to bottom is the reading order every theme already has; nothing in it is deco.',
            },
            {
                key: 'glintway',
                name: 'From the start edge',
                see: 'Everything is drawn from its start edge to its end, the way a glint crosses lacquer; a group start to end.',
                verdict: 'Not recommended, because a wipe from the start is titanium’s feed and the glint you did not pick as the anchor.',
            },
            {
                key: 'corners',
                name: 'From the four corners inward',
                see: 'The inlay draws from all four corners at once and meets at the middle of each edge; a group comes from both ends inward; the trend line from both ends to its middle.',
                verdict: 'Not recommended, because four corners closing in is a frame being built, not a fan opening; it is busy on a small part.',
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open, and how does it close?',
        why: 'A menu opens under its button, a dialog opens on the lacquer, a toast and a tooltip appear. Every option takes 480 ms on the settle curve; only what is drawn differs. Every close is the open backwards.',
        kind: 'cycle',
        scene: 'opening',
        options: [
            {
                key: 'inlay',
                name: 'The gold inlay draws itself, the lacquer comes up',
                see: 'A thin gold frame draws from the middle of its top edge round both ways and meets at the bottom (320 ms); as it closes the plate’s lacquer and the chevron wallpaper come up behind it and the words with them (the last 160 ms). The menu’s inlay starts at its button; the dialog’s at its crest; the tooltip’s at its notch. The close: the lacquer sinks, the inlay undraws to its start.',
                verdict:
                    'Recommended: this one, because it is the anchor on a plate: a gold line that opens from a point to both sides and a surface that fills behind it, and it is the only way in the set a surface arrives by its frame. Thin, symmetric, nothing counted.',
            },
            {
                key: 'fan',
                name: 'Unfolds like a fan from its anchor',
                see: 'The plate unfolds from its anchor point as a fan of gold hairlines that becomes the plate: the rays spread smoothly, the lacquer fills between them, the rays become the inlay.',
                verdict:
                    'Not recommended, because a whole menu unfolding as a fan is the anchor made big on every opening; it is the “in your face” you asked to lose.',
            },
            {
                key: 'doors',
                name: 'The lift doors part',
                see: 'The plate stands as two halves meeting at a gold hairline down its middle; they slide apart to the edges to reveal the words, brass lift doors in a lobby; they close over them.',
                verdict:
                    'Not recommended, because lift doors are a lovely lobby thing and the wrong size for a tooltip; two halves sliding is nostromo’s airlock.',
            },
            {
                key: 'threads',
                name: 'A curtain of gold threads parts',
                see: 'Thin vertical gold threads cover the plate’s footprint; they part from the centre to both sides and the words are behind them; the close draws them shut.',
                verdict:
                    'Not recommended, because threads parting is a curtain, the picks’ device you did not take, and the threads clutter a small menu.',
            },
            {
                key: 'surface',
                name: 'Rises from the lacquer, a glint passes',
                see: 'The plate comes up out of the lacquer in place (no travel), its inlay already there, and one glint crosses the inlay as it lands; the close sinks it back.',
                verdict: 'Not recommended, because a fade-up with a glint is a fade; the inlay is not drawn, so nothing of the anchor is in it.',
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
                verdict:
                    'Recommended: this one, because forty milliseconds a ray is slow enough to count and quick enough that a menu is open in two thirds of a second.',
            },
            {
                key: 'brisk',
                name: 'Brisk: 120 · 320 (+100, +50) · 1600 ms',
                see: 'A press in 120 ms, a fan in 320 ms, the plate 100 ms after, a group 50 ms apart, the loop in 1.6 s.',
                verdict: 'Not recommended, because 27 ms a ray cannot be counted; the fan reads as a flicker.',
            },
            {
                key: 'grand',
                name: 'Grand: 200 · 720 (+240, +120) · 3600 ms',
                see: 'A press in 200 ms, a fan in 720 ms, the plate 240 ms after, a group 120 ms apart, the loop in 3.6 s.',
                verdict: 'Not recommended, because a dialog that takes a second to open is a ceremony; the lobby is grand, the lift is quick.',
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What may be gold, what blue, what emerald, what ruby?',
        why: 'The same card, buttons, a switch, a month, a key figure, a meter and a failed export in every option; only the colour rule differs.',
        kind: 'still',
        scene: 'colour',
        options: [
            {
                key: 'inlay',
                name: 'Gold is a line and a jewel, blue is the ground, ivory reads',
                see: 'Every plate is deep blue lacquer with the chevron wallpaper in gold at 8 %; gold is the inlay line, the double rule, the head, the picked day’s ring and a lozenge jewel, never a fill, except on the one primary button, which is solid gold with lacquer ink; the emerald is the one jewel on what is on or done; ruby is a hairline and a word on a failure; every word is ivory.',
                verdict:
                    'Recommended: this one, because gold as a line on blue is the inlay of a lobby wall and reads as rich without covering anything; one solid gold button is the single thing that acts; it is not solstice’s warm fills and not synthwave’s neon.',
            },
            {
                key: 'fills',
                name: 'Gold fills what acts',
                see: 'Every button, the picked day and the switch on are solid gold; inlay lines elsewhere.',
                verdict: 'Not recommended, because several solid gold plates on one screen is the casino the anatomy warns of.',
            },
            {
                key: 'twoblues',
                name: 'Two blues: plates lighter than the page',
                see: 'The page is the deep lacquer; every plate is a step lighter midnight blue with a gold hairline; gold otherwise as a line.',
                verdict:
                    'Not recommended, because a lighter plate on a dark page is dark’s and nostromo’s depth; deco’s plates are the same lacquer with a line round them.',
            },
            {
                key: 'ivory',
                name: 'Gold and ivory only',
                see: 'No emerald, no ruby: a failure is ivory on lacquer with a heavier rule; the picked day a gold ring.',
                verdict: 'Not recommended, because without the jewels nothing says done or wrong but a rule’s weight.',
            },
            {
                key: 'champagne',
                name: 'Champagne gold, bronze for the muted',
                see: 'The gold is paler (champagne), muted parts are bronze, the lacquer stays.',
                verdict: 'Not recommended, because champagne and bronze are two golds; the register’s one gold is the line’s whole strength.',
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'How are a plate’s corners drawn?',
        why: 'The same card, menu panel, key figure, button, tag, chip, tooltip and bar head in every option; only the corners differ.',
        kind: 'still',
        scene: 'corners',
        options: [
            {
                key: 'inlay',
                name: 'Square plates, an inlay line with stepped corners',
                see: 'Every plate is square (radius 0) and carries a thin gold line set 6 px in from its edge; at each corner the line steps once inward (a small ziggurat notch), the inlaid frame of a lobby panel. Small parts (tags, the change, the tooltip, the bar’s head) are square with a lozenge point at one end.',
                verdict:
                    'Recommended: this one, because the stepped inlay corner is the one deco corner nobody else has (grotesk bites, brutalism squares, nostromo chamfers); it is thin, symmetric and gold, and it is the same mark at every size.',
            },
            {
                key: 'bite',
                name: 'One corner bitten (the cartouche, today)',
                see: 'Radius 0 and the top-right corner cut as a chevron, the register’s cartouche bite, on every plate.',
                verdict: 'Not recommended, because one bitten corner is one loud corner; it is the Empire State on every tile.',
            },
            {
                key: 'chamfer',
                name: 'All four corners chamfered',
                see: 'Every corner cut at 45°, 8 px, on plates and small parts alike.',
                verdict: 'Not recommended, because four chamfers are nostromo’s panel; on a tag they vanish.',
            },
            {
                key: 'crown',
                name: 'Stepped at the top corners only',
                see: 'The two top corners step inward twice (the crown of a tower); the bottom corners are square.',
                verdict: 'Not recommended, because a crown on every card makes every card a building; it is heavy on a menu.',
            },
            {
                key: 'square',
                name: 'All square, nothing',
                see: 'Radius 0 everywhere, no inlay, no bite, no point.',
                verdict: 'Not recommended, because square and bare is brutalism; nothing says deco without the inlay.',
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
                verdict:
                    'Recommended: this one, because a crest means something when there is one; the double rule frames what matters and nothing else is ornamented.',
            },
            {
                key: 'sunburst',
                name: 'A sunburst behind every figure (the picks)',
                see: 'The faint sunburst behind the key figure, the menu’s headings, the state word, the header’s title.',
                verdict: 'Not recommended, because when every figure has a crest the fan has no moment of its own.',
            },
            {
                key: 'setbacks',
                name: 'Setbacks behind every plate (the picks)',
                see: 'Fine gold setback lines rising behind the trend, the tiles, the chart.',
                verdict: 'Not recommended, because a skyline behind every plate is wallpaper, and it rises where the anchor opens.',
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
                key: 'hairline',
                name: 'A ruby inlay and a ruby word',
                see: 'The plate stays lacquer; its gold inlay line turns ruby and the figure’s change (or the word that failed) is set in ruby; everything else as it was. A destructive menu entry has a ruby hairline at its start edge and ruby text.',
                verdict:
                    'Recommended: this one, because the warning is told by the one line the plate already has changing colour, nothing added, nothing tinted; ruby on lacquer is loud enough and the lobby stays calm.',
            },
            {
                key: 'figure',
                name: 'The figure in ruby, a gold rule under it',
                see: 'The figure itself is set in ruby with a thin gold rule under it; the inlay stays gold.',
                verdict: 'Not recommended, because a ruby figure on gold rules is two jewels competing; the change tag already carries the tone.',
            },
            {
                key: 'jewel',
                name: 'A ruby lozenge before the figure',
                see: 'A small ruby lozenge stands before the figure or the entry; nothing else changes.',
                verdict: 'Not recommended, because a lozenge is too small to warn on a phone; it is a jewel, not a signal.',
            },
            {
                key: 'plaque',
                name: 'A ruby plaque, ivory ink',
                see: 'The warning part sits on a solid ruby plaque with ivory ink and a gold inlay.',
                verdict: 'Not recommended, because a solid ruby plate is the one loud thing on the page; it is the gilt notice you did not take.',
            },
            {
                key: 'tint',
                name: 'The lacquer tinted toward ruby',
                see: 'The plate’s lacquer shifts a few degrees toward ruby and its inlay stays gold.',
                verdict:
                    'Not recommended, because a tinted lacquer is hard to tell from a plate in shadow; the tone has to be in a line, not a mood.',
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
                verdict:
                    'Recommended: this one, because the anchor on the changed figure: a fan opens for it and folds; nothing flares, nothing swells.',
            },
            {
                key: 'gilded',
                name: 'Gilded: a flare (the picks)',
                see: 'The figure flares gold, swells once and settles.',
                verdict: 'Not recommended, because a flare is a glow, which deco has only on its lamps, and a swell moves the figure.',
            },
            {
                key: 'glint',
                name: 'The glint (the picks)',
                see: 'A glint runs along the changed figure’s rule.',
                verdict: 'Not recommended, because a glint is a moving gradient and every theme’s shimmer.',
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does a waiting surface show?',
        why: 'A tile, a panel, a menu entry, a month of days, a chart’s plot and skeleton lines, waiting. Every option loops at 2.4 s.',
        kind: 'loop',
        scene: 'loading',
        options: [
            {
                key: 'glint',
                name: 'Light on lacquer: a glint crosses the waiting part',
                see: 'The waiting part is lacquer with the wallpaper and its gold inlay; a soft band of light (gold at 12 %, 30 % of the width, blurred) crosses it slowly from the start edge to the end, 2.4 s, and again; the skeleton’s lines are thin gold hairlines the glint lights as it passes.',
                verdict:
                    'Recommended: this one, because it is the one loading picture that needs nothing added: a wall waiting under a passing light; it fills the whole part, it is slow, and the only gold is the line already there. Titanium’s bath is a liquid fill, not a passing light.',
            },
            {
                key: 'fan',
                name: 'A small fan unfolds and folds',
                see: 'In the centre of the waiting part a fan of twelve gold hairlines unfolds smoothly (1.2 s) and folds (1.2 s); the skeleton’s lines unfold from their start.',
                verdict:
                    'Not recommended, because a fan in every waiting tile is the anchor repeated six times on one screen; lovely once, busy in a grid.',
            },
            {
                key: 'frame',
                name: 'The inlay draws and undraws',
                see: 'The waiting part’s gold inlay draws itself from the centre round and undraws, again and again; inside, lacquer.',
                verdict: 'Not recommended, because a frame drawing round an empty plate says arriving, not waiting; it is the opening on a loop.',
            },
            {
                key: 'breathe',
                name: 'The wallpaper breathes',
                see: 'The chevron wallpaper behind the waiting part brightens from 8 % to 20 % gold and back, 2.4 s.',
                verdict:
                    'Not recommended, because a brightening wallpaper is too quiet to read as loading on a phone, and it is light’s breathing exposure in gold.',
            },
            {
                key: 'strips',
                name: 'The skeleton’s strips (today)',
                see: 'The register’s skeleton: muted strips opening from their centre, 0.8 s, once.',
                verdict: 'Not recommended, because strips opening once is an arrival, not a wait; nothing in it is gold or lacquer.',
            },
        ],
    },
    {
        id: 'bar',
        label: 'The progress bar, redone',
        rule: 'G11',
        question: 'Which bar replaces the pennant? Each option is shown with a share known and busy.',
        why: 'Every option is shown at a 62 % share and busy, at three sizes, inside a busy button and beside a share bar. The pennant is retired.',
        kind: 'loop',
        scene: 'bar',
        options: [
            {
                key: 'inlay',
                name: 'A gold inlay with a lozenge head',
                see: 'The track is a thin gold hairline on lacquer with a small lozenge at each end; the share is a heavier gold line drawn along it from the start, its head a gold lozenge jewel; busy: no share, and a glint runs the hairline from start to end, 2.4 s, and again.',
                verdict:
                    'Recommended: this one, because it is an inlaid line on a lobby wall with one jewel at its head: thin, gold, symmetric at rest, and busy it is the same light-on-lacquer as loading. Forest’s bar is a tree, nostromo’s a bargraph, formal’s a ruled line in navy; nothing else is a jewelled hairline.',
            },
            {
                key: 'lozenges',
                name: 'A string of lozenges',
                see: 'The track is a row of small hollow gold lozenges; the share fills them one by one from the start; busy: a filled lozenge travels the string and back.',
                verdict: 'Not recommended, because a string of jewels is a necklace, and a travelling jewel is a bead to and fro, the meter’s band.',
            },
            {
                key: 'double',
                name: 'Between two hairlines',
                see: 'Two thin gold hairlines; the share fills between them in muted gold from the start; busy: the fill sweeps across and fades.',
                verdict: 'Not recommended, because a fill between rules is formal’s bar with gold ink.',
            },
            {
                key: 'stepped',
                name: 'A stepped head',
                see: 'A gold band whose head is stepped like a ziggurat (three steps); the share grows from the start; busy: the steps glint in turn.',
                verdict: 'Not recommended, because a stepped head on a thin bar is unreadable at the small size; the steps become noise.',
            },
            {
                key: 'fanflat',
                name: 'A fan laid flat, smooth',
                see: 'The track is a row of thin gold rays leaning as a fan laid along a line; the share lights them smoothly from the start; busy: the light sweeps across and back.',
                verdict:
                    'Not recommended, because rays along a track are the counted bar you did not approve, uncounted; it is still a row of spikes.',
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
                verdict:
                    'Recommended: this one, because the anchor as a spinner: a fan that opens and folds says working without turning like every other spinner.',
            },
            {
                key: 'rotate',
                name: 'The sunburst rotates (today)',
                see: 'The register’s rays turning in 3.6 s, linear.',
                verdict: 'Not recommended, because a turning sunburst is a turning thing, which every theme’s spinner is; the fan opens.',
            },
            {
                key: 'lamps',
                name: 'The lift’s lamps round',
                see: 'Lamps round a ring lit one after the other.',
                verdict: 'Not recommended, because lamps round a ring is the marquee again, and lamps are retired.',
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G13',
        question: 'How does a part arrive, and how does it leave?',
        why: 'An alert, a card and a key figure arrive and leave in every option, 480 ms each way on the settle curve; the leave is the arrival backwards.',
        kind: 'cycle',
        scene: 'leave',
        options: [
            {
                key: 'inlay',
                name: 'The inlay draws, the lacquer comes up; undraws, sinks',
                see: 'Arriving: the part’s gold inlay draws from the centre of its top edge round both ways (320 ms), its lacquer, wallpaper and words come up behind it (160 ms). Leaving: the lacquer and words sink into the page, the inlay undraws to its start.',
                verdict:
                    'Recommended: this one, because the same gesture as the opening (one grammar: a surface comes and goes by its inlay), thin and symmetric; nothing rises, nothing slides, nothing fans in the reader’s face.',
            },
            {
                key: 'fan',
                name: 'Unfolds from its base, folds to it',
                see: 'The part unfolds smoothly from its bottom-centre as a fan of gold hairlines that becomes the part; it folds back to the point to leave.',
                verdict: 'Not recommended, because every alert unfolding as a fan is the anchor made big; the lobby would never stop fanning.',
            },
            {
                key: 'sink',
                name: 'Sinks into the lacquer, a glint passes',
                see: 'Arriving: the part comes up out of the lacquer in place with one glint crossing its inlay; leaving: it sinks back, the glint crossing the other way.',
                verdict: 'Not recommended, because a fade with a glint on it is still a fade; the inlay is never drawn.',
            },
            {
                key: 'doors',
                name: 'The lift doors close over it',
                see: 'Two lacquer halves slide from the sides and meet over the leaving part at a gold hairline; they part to let it arrive.',
                verdict: 'Not recommended, because doors closing over an alert is nostromo’s airlock; it needs more stage than a toast has.',
            },
            {
                key: 'threads',
                name: 'The curtain of threads',
                see: 'Gold threads draw shut over the leaving part from both sides to the centre; they part to let it arrive.',
                verdict: 'Not recommended, because the curtain is the picks’ device you did not take, and threads over a key figure hide its number.',
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G14',
        question: 'Is a button inside a header, a menu, a tile or a drawer deco’s own button?',
        why: 'Deco’s own button stands alone for reference; then the same button inside a page header, a menu, a tile, a drawer and a key figure. Use the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: 'composites',
        options: [
            {
                key: 'own',
                name: 'Exactly deco’s own',
                see: 'Every button, link and entry inside a composite is deco’s button as it stands alone: a gold hairline frame with ivory capitals, the one primary solid gold; it hovers, focuses and presses exactly the same wherever it stands.',
                verdict:
                    'Recommended: this one, because one manner for every control, wherever it stands; the lobby has one brass and one way to polish it.',
            },
            {
                key: 'ghost',
                name: 'Hairline inside, solid alone',
                see: 'Inside a composite every button is a hairline (ghost) button, even the primary; alone, the primary is solid gold.',
                verdict: 'Not recommended, because two primaries, one solid and one hollow, is two rules; the header’s act should look like an act.',
            },
            {
                key: 'text',
                name: 'Gold text only inside composites',
                see: 'Inside a composite a button is gold capitals with no frame; the frame appears on hover; alone it keeps its frame.',
                verdict: 'Not recommended, because a frameless button inside a tile is a link; the frame is what makes it a button.',
            },
            {
                key: 'plaque',
                name: 'Deco’s own on a lacquer plaque',
                see: 'The same manners, and the header’s and the drawer’s buttons stand together on one darker lacquer plaque with its own inlay.',
                verdict: 'Not recommended, because a plaque inside a plate is a frame inside a frame; it adds a surface for no act.',
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The header’s pick gilds its buttons’ edges with a flare, the tiles’ Open gains a plaque, the menu’s entries light like bulbs: three hovers on one page.',
                verdict: 'Not recommended, because three hovers on one page.',
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
                key: 'glint',
                name: 'The inlay brightens, a glint passes once',
                see: 'The control’s gold hairline brightens from 55 % to full gold and one glint crosses it from the start edge to the end (480 ms) and is gone; the label stays; a menu entry gains the hairline at its start edge and the glint; a link’s underline brightens with the glint. Leaving: the hairline dims back.',
                verdict:
                    'Recommended: this one, because light on brass is what a hand near it does in a lobby: the line that is already there brightens and a passing glint says “here”, once, then rest. Nothing moves, nothing opens, and it is the same mark as loading’s light on lacquer.',
            },
            {
                key: 'underline',
                name: 'A hairline draws under the label from its centre',
                see: 'A thin gold rule draws under the label from its middle to both ends (240 ms); the frame stays.',
                verdict: 'Not recommended, because a rule under the label is formal’s hover with gold ink; the control already has a frame.',
            },
            {
                key: 'lighten',
                name: 'The lacquer lightens a shade',
                see: 'The control’s ground lightens a shade (the secondary surface); nothing else.',
                verdict: 'Not recommended, because a lighter ground is every default hover; nothing gold happens.',
            },
            {
                key: 'fan',
                name: 'A small fan unfolds behind the label',
                see: 'Behind the label a fan of gold hairlines unfolds smoothly from the lower-left corner (480 ms) and folds when the pointer leaves.',
                verdict:
                    'Not recommended, because the fan on every hover was the register’s gap-4 and the part you called in your face; it stays the anchor’s own gesture, not the hover’s.',
            },
            {
                key: 'tracking',
                name: 'The capitals open their tracking',
                see: 'The label’s letter-spacing widens from 0.08 em to 0.14 em (240 ms) and closes when the pointer leaves; nothing else.',
                verdict: 'Not recommended, because letters that move are hard to read while they move, and the change is lost on a phone.',
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
                verdict: 'Recommended: this one, because a system constant; gold on gold would vanish on a primary button.',
            },
            {
                key: 'double',
                name: 'A double gold ring',
                see: 'A 3px double gold ring round the focused control.',
                verdict: 'Not recommended, because one channel in gold fails where the control is gold.',
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The register’s ring plus the picks’ gold rings and bulb frames.',
                verdict: 'Not recommended, because three focus marks.',
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
                key: 'double',
                name: 'The inlay doubles, the face sinks a shade',
                see: 'For the contact (160 ms) the control’s gold hairline becomes a double hairline (a second line 2 px inside) and its lacquer sinks a shade darker; on release the second line is gone and the face comes back. The primary button’s solid gold darkens a shade and gains the inner line in lacquer.',
                verdict:
                    'Recommended: this one, because the double rule is deco’s mark for “this matters” and a press is the moment it matters; a shade darker says contact; nothing moves and nothing opens.',
            },
            {
                key: 'fill',
                name: 'Gold fills it for the contact',
                see: 'The control fills solid gold with lacquer ink for the contact and returns to the hairline on release.',
                verdict: 'Not recommended, because a flash of solid gold on every tap is the casino again, a thousand times a day.',
            },
            {
                key: 'fold',
                name: 'The fan folds shut behind the label',
                see: 'The hover’s fan (if the fan were the hover) folds shut on press and reopens on release.',
                verdict: 'Not recommended, because it only means something if the hover is the fan, which is not recommended.',
            },
            {
                key: 'jewel',
                name: 'A lozenge jewel lights at the label’s start',
                see: 'A small gold lozenge appears before the label for the contact and is gone on release.',
                verdict: 'Not recommended, because a jewel appearing is a mark, not a press; a pressed thing should feel pressed.',
            },
            {
                key: 'colour',
                name: 'A colour step (today)',
                see: 'The face takes the pressed ground; no line, no motion.',
                verdict: 'Not recommended, because the default press of the set; nothing of the inlay is in it.',
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
                verdict:
                    'Recommended: this one, because Poiret is a display face built from circles and lines and reads at a title’s size; a figure in it would be a figure drawn with a compass.',
            },
            {
                key: 'figures',
                name: 'Poiret figures too',
                see: 'Large figures in Poiret One.',
                verdict: 'Not recommended, because Poiret’s hairline digits vanish at a key figure’s weight and read as a logo.',
            },
            {
                key: 'josefin',
                name: 'Josefin everywhere',
                see: 'Titles in Josefin Sans 600 uppercase.',
                verdict: 'Not recommended, because without Poiret the lobby loses its lettering.',
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G19',
        question: 'Which marks may deco draw, and where?',
        why: 'A card with its title, a meter with its mark, a chart’s events, a button and a list, an empty state and a divider in every option; only the marks differ.',
        kind: 'still',
        scene: 'motifs',
        options: [
            {
                key: 'inlay',
                name: 'The wallpaper, the stepped inlay, the double rule, the lozenge',
                see: 'The chevron wallpaper behind every plate; the gold inlay line with stepped corners on every plate; the double rule under a title and on what matters; the lozenge as a point, a jewel and a divider’s centre; the fan only where something happens (the anchor). No crest on every title, no sunburst, no bulbs, no setbacks, no curtain.',
                verdict:
                    'Recommended: this one, because four marks that are one style and thin: a wall, its inlay, its rule and its jewel; everything else is retired to one place or none, and the fan stays the one gesture.',
            },
            {
                key: 'crest',
                name: 'Those plus a small crest on titles',
                see: 'The same four, and a small sunburst crest of gold hairlines stands over every title and the empty state.',
                verdict:
                    'Not recommended, because a crest over every title is a sunburst on every card; one crest on the page’s title is the surface you picked.',
            },
            {
                key: 'bite',
                name: 'Those plus the chevron bite',
                see: 'The same four, and one corner of every plate bitten as a chevron.',
                verdict: 'Not recommended, because the bite and the stepped inlay are two corners on one plate.',
            },
            {
                key: 'bare',
                name: 'The wallpaper and hairlines only',
                see: 'No lozenge, no double rule: plates with a single inlay on the wallpaper.',
                verdict: 'Not recommended, because without the rule and the jewel nothing is marked as mattering or done.',
            },
            {
                key: 'all',
                name: 'As today (everything)',
                see: 'Every mark the picks and the register carry: crests, sunbursts, bulbs, setbacks, the curtain, the glint, the lozenge, the chevron.',
                verdict: 'Not recommended, because a lobby with every ornament of 1925 at once; the eye cannot tell what a mark means.',
            },
        ],
    },
];
