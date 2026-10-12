// What makes deco deco: the nineteen questions, as data. The designer's
// text, verbatim; demo.js wires each aspect's scene and options.css draws
// each option by `data-dc-<id>="<key>"` on the scene. The grammar is
// themes/deco/CHARACTER.md (G1–G21); the anchor is the fan
// (research/deco-anchor, Kenny 2026-10-08). Update 1 (2026-10-08): Kenny did
// not approve thirteen of the nineteen (his comment is in update.json); those
// thirteen are redrawn here in his direction, thin gold on lacquer with the
// wallpaper, the fan unfolding smoothly, nothing counted; his six picks
// (durations, surface, live, spinner, focus, type) stay as round one wrote them.
// Update 2 (2026-10-09-r3): the questions Kenny did not approve are redrawn (his comments are in update.json); his picks stay as they were.
// Update 3 (2026-10-09-r4): the questions Kenny did not approve are redrawn (his comments are in update.json); his picks stay as they were.

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
        why: 'The same card, menu panel, key figure, button, tag, chip, tooltip and bar head in every option; only the corners differ. Each shape is hairline gold and a few jewels, the same at every size.',
        kind: 'still',
        scene: 'corners',
        options: [
            {
                key: 'fan',
                name: 'A quarter sunburst in every corner',
                see: 'In each corner of a plate a quarter-fan of nine fine gold rays radiates into the plate from the corner point (a 90° sunburst, 14 px radius on a card, scaled to the part’s size and never beyond 22 px), the plate’s inlay line passing through the fan’s arc; the corner itself is square.',
                verdict:
                    'Recommended: this one, because it is the lobby’s signature (the fan) used as an ornament the way a ceiling uses it, in the four places the eye rests, and the fan is already deco’s anchor.',
            },
            {
                key: 'ziggurat',
                name: 'A ziggurat with a jewel at its point',
                see: 'Each corner is stepped three times inward like a setback tower, drawn as a double hairline, and a small lozenge jewel (a 5 px gold lozenge with a lighter facet) is set at the outermost point of the corner.',
                verdict: 'Not recommended, because the stepped corner is the earlier inlay corner with a jewel; elegant but familiar.',
            },
            {
                key: 'cove',
                name: 'A cove with a double hairline',
                see: 'Each corner is cut as a concave quarter-circle (an inverted fillet, a cove, 10 px) so the plate has soft hollow corners, and two parallel gold hairlines follow the cove and the straight edges; at the cove’s centre a tiny gold bead.',
                verdict:
                    'Not recommended, because curves are rare in deco’s geometry; the cove is a Moderne touch, graceful but softer than the lobby.',
            },
            {
                key: 'chevrons',
                name: 'Nested chevrons like moulding',
                see: 'Each corner holds three nested right-angle brackets of decreasing size (a hairline `⌐` three times, 6, 10 and 14 px, 3 px apart) like architectural moulding turning a corner; the plate’s inlay continues from the largest.',
                verdict: 'Not recommended, because crisp and architectural, but rule-like; less jewellery than the fan.',
            },
            {
                key: 'medallion',
                name: 'A medallion on the corner’s point',
                see: 'A small round medallion (a ring with eight short rays and a centre dot, 16 px) sits on each corner’s point, half over the plate and half over the page, interrupting the inlay line there as a brooch would.',
                verdict: 'Not recommended, because a medallion overlapping the edge reads as a rivet or a badge on small parts.',
            },
            {
                key: 'pilaster',
                name: 'Fluted pilasters rising at the corners',
                see: 'At each corner three fine vertical hairlines (a fluted pilaster, 12 px tall, 3 px apart) rise and fall across the corner, capped with a small gold lozenge, so the plate looks held at its corners by columns; the plate itself is square.',
                verdict: 'Not recommended, because tall and decorative; on a short tag the columns are as tall as the part.',
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
        why: 'A tile, a panel, a menu entry, a month of days, a chart’s plot and skeleton lines, waiting. Every option loops at 2.4 s, slow and rich, and none shows a count. Ten new pictures, and the breathing wallpaper kept for reference.',
        kind: 'loop',
        scene: 'loading',
        options: [
            {
                key: 'lattice',
                name: 'A wave of light through the wallpaper',
                see: 'The wallpaper’s lozenges brighten in a slow diagonal wave from the part’s top-left corner to the bottom-right, each lozenge rising from 8 % to 30 % gold and falling back as the wave passes (a band of three lozenges wide, 2.4 s), over the lacquer and under the content; the inlay stays still.',
                verdict:
                    'Recommended: this one, because it is the best of the earlier five (the wallpaper) made luxurious: the wall itself is lit lozenge by lozenge by a slow wave, nothing is added, and it fills the whole part.',
            },
            {
                key: 'tracing',
                name: 'Two hairlines tracing the inlay',
                see: 'Two bright points of gold, one clockwise and one counter-clockwise from the top centre, trace the plate’s inlay line and meet at the bottom, leaving the line brighter behind them; then the brightness fades and they start again; 2.4 s.',
                verdict: 'Not recommended, because elegant and light, but the inside of the part says nothing is loading.',
            },
            {
                key: 'crest',
                name: 'A crest rising like a sun',
                see: 'A large pale crest of fine rays (a half-sun, 40 % of the part’s width) stands at the part’s foot and rises very slowly behind the content, unfolding its rays smoothly until it is full, then sinking: 2.4 s up and down, at 14 % gold.',
                verdict: 'Not recommended, because large and atmospheric; behind a small tile it hides the number.',
            },
            {
                key: 'satin',
                name: 'A satin sheen over the lacquer',
                see: 'A wide soft band of light (40 % of the width, diagonal, 6 % gold, blurred) slides slowly over the lacquer from the start to the end as light moves across satin, the wallpaper visible under it; 2.4 s.',
                verdict: 'Not recommended, because a soft sheen is the glint you called loading’s shimmer, only wider.',
            },
            {
                key: 'pearls',
                name: 'A string of pearls',
                see: 'A row of seven small pearls (round, ivory with a gold ring) lies along the part’s foot; they light one after another from the start with a soft rise and fall (a wave along the string), the string reversing at the end like a necklace being lifted.',
                verdict: 'Not recommended, because pretty, and the pearl is a Gatsby touch, but a string is a progress bar.',
            },
            {
                key: 'jewel',
                name: 'A turning jewel',
                see: 'A large lozenge jewel (two facets, gold with emerald) stands at the part’s centre and turns about its vertical axis (its width opening and closing as a gem turns), throwing a small glint on each turn, 2.4 s.',
                verdict: 'Not recommended, because a jewel in the middle of a wait is a mark in the way of the content on a small part.',
            },
            {
                key: 'tide',
                name: 'A tide of deeper blue',
                see: 'The lacquer’s deep blue rises from the foot of the part to its top and sinks again, slowly, a thin gold waterline marking the level; the content stays above it in ivory.',
                verdict: 'Not recommended, because a tide is a fill, titanium’s bath in blue; the waterline is the gold touch.',
            },
            {
                key: 'doors',
                name: 'Lift doors that part and close',
                see: 'Two halves of lacquer meet at a gold double hairline down the part’s middle; they part to the sides by a third and close again, slowly, like a lift’s doors waiting; the wallpaper runs across both.',
                verdict: 'Not recommended, because doors are the earlier opening option; here they are on a loop and cover what they hide.',
            },
            {
                key: 'orbit',
                name: 'A glint orbiting the inlay',
                see: 'One slim glint circles the plate’s inlay line slowly, clockwise, once every 2.4 s, the line staying a little brighter behind it for a quarter of the lap; the lacquer, the wallpaper and the content stay still.',
                verdict: 'Not recommended, because beautiful and minimal, perhaps too minimal to read as loading on a phone.',
            },
            {
                key: 'engraver',
                name: 'An engraver cutting lines',
                see: 'Fine horizontal gold hairlines are cut one after another down the part from the top, each drawn from the centre outward to both sides as an engraver cuts them (120 ms apart), the whole set fading together and starting again.',
                verdict: 'Not recommended, because lines appearing and fading is a skeleton in gold; it is a fair second.',
            },
            {
                key: 'breathe',
                name: 'The wallpaper breathes (the earlier best)',
                see: 'The chevron wallpaper behind the waiting part brightens from 8 % to 20 % gold and back, 2.4 s.',
                verdict: 'Not recommended, because your best of the earlier five and not enough; kept as the reference.',
            },
        ],
    },
    {
        id: 'bar',
        label: 'The progress bar, redone',
        rule: 'G11',
        question: 'Which bar replaces the pennant? Each option is shown with a share known and busy.',
        why: 'Every option is shown at a 62 % share and busy, at three sizes, inside a busy button and beside a share bar. The pennant and the cheap options are gone; option 1 has two variations and five new bars are added, all elegant and made of hairlines, a lozenge or two and the lacquer.',
        kind: 'loop',
        scene: 'bar',
        options: [
            {
                key: 'inlay',
                name: 'A gold inlay with a lozenge head',
                see: 'The track is a thin gold hairline on lacquer with a small lozenge at each end; the share is a heavier gold line drawn along it from the start, its head a gold lozenge jewel; busy: no share, and a glint runs the hairline from start to end, 2.4 s, and again.',
                verdict:
                    'Recommended: this one, because it is the bar you kept: an inlaid line on a lobby wall with one jewel at its head, thin, gold and symmetric.',
            },
            {
                key: 'double',
                name: 'The inlay, doubled',
                see: 'Option 1 with a double hairline track (two fine gold lines 3 px apart with a lozenge at each end), the share drawn as a heavier gold line between them, the head a larger lozenge with a small fan of nine rays opening behind it; busy: a glint with an afterglow runs between the two lines.',
                verdict: 'Not recommended, because richer than the single line; the fan behind the head is busy at the small size.',
            },
            {
                key: 'ruled',
                name: 'The inlay, ruled with stations',
                see: 'Option 1 with a fine rule marked at every quarter by a small lozenge (hollow, filling gold as the share passes it), the head a lozenge with a lighter facet and an emerald centre; busy: the glint runs the rule and each lozenge it passes lights for a moment.',
                verdict: 'Not recommended, because a ruler of lozenges is precise and calm; the emerald in the head is the jewel.',
            },
            {
                key: 'crest',
                name: 'A horizon with a crest of rays at its head',
                see: 'The track is a thin horizon hairline; at the head of the share a half-sun of fine rays rises over the line (its rays unfolding smoothly as the share grows and its size fixed), the share drawn as gold below the horizon; busy: the crest travels the horizon and breathes.',
                verdict:
                    'Not recommended, because the sun at the head is the anchor’s fan used as a head; lovely at large sizes, small at the small.',
            },
            {
                key: 'guilloche',
                name: 'A guilloche weave',
                see: 'The track is a fine guilloche: two thin gold sine waves interlaced (like the engraved border of a banknote or a cigarette case), 6 px high; the share lights the weave in gold from the start and leaves the rest as a faint ghost; busy: the glint runs along the weave and the lines seem to cross over it.',
                verdict: 'Not recommended, because exquisite at 6 px and fiddly at 3; the most ornate of the eight.',
            },
            {
                key: 'stations',
                name: 'A line with three emerald stations',
                see: 'A thin gold line with three small emerald lozenge stations at 25 %, 50 % and 75 % and a gold lozenge at its head; the share lights the line gold, and each emerald lights when the head passes it; busy: a gold glint passes each station in turn.',
                verdict: 'Not recommended, because the stations are a stepper; they say how far, which a bar of unknown length cannot.',
            },
            {
                key: 'ribbon',
                name: 'A satin ribbon with gold edges',
                see: 'The track is a flat ribbon of the lacquer blue, 8 px tall, with a hairline of gold on each edge and a diagonal satin sheen over it; the share is a band of gold leaf inside the ribbon with a fine gloss line along its top; busy: the sheen slides along the ribbon.',
                verdict: 'Not recommended, because a ribbon is the most decorative; at 3 px it is two lines.',
            },
            {
                key: 'setback',
                name: 'A skyline of set-back hairlines',
                see: 'Five thin gold hairlines one above the other, each shorter than the one below by 12 % (a set-back skyline drawn only in lines), the share lights them from the start together, the head a lozenge on the top line; busy: the glint climbs the lines in turn.',
                verdict: 'Not recommended, because a stack of lines is the stepped bar you did not like, in hairlines; the most architectural.',
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
        why: 'An alert, a card and a key figure arrive and leave in every option, 480 ms each way; the leave is the arrival backwards. All ten are dressed the way the festoon is: satin and lacquer, gold trim, rosettes, tassels and braid; when a part has arrived the dressing is gone, and when it has left nothing remains drawn.',
        kind: 'cycle',
        scene: 'leave',
        options: [
            {
                key: 'festoon',
                name: 'The festoon curtain, fixed',
                see: 'A festoon of deep-blue satin hangs over the part in scalloped swags, each gathered by a gold rosette with a tassel; it gathers upward from the bottom in soft folds, each swag lifting in turn from the centre outward 60 ms apart, to a gold-trimmed valance and then away entirely, revealing the part; to leave, a valance comes down and the swags lower. Nothing of it is drawn once the part has arrived, or after it has left.',
                verdict:
                    'Recommended: this one, because it is the drawing you liked, with the one fault fixed: the dressing exists only while the part is coming or going.',
            },
            {
                key: 'roman',
                name: 'A Roman blind',
                see: 'A blind of deep-blue satin hangs flat over the part, ruled with gold braid every 22 px, a gold rosette pull-cord with a tassel hanging at the centre; it rises in horizontal folds (each fold gathering on the one above, 40 ms apart from the bottom) to a scalloped gold-trimmed hem at the top and then away; to leave it lowers the same way.',
                verdict: 'Not recommended, because quieter than the festoon and the most tailored; a flat blind is plainer than swags.',
            },
            {
                key: 'screen',
                name: 'A folding screen',
                see: 'A folding screen of four lacquered panels, each with a gold-trimmed frame and a fan motif in its upper half, stands over the part; the panels fold concertina to the two sides from the centre (the inner two first), their frames turning edge-on as they go, revealing the part; to leave they unfold back.',
                verdict: 'Not recommended, because a screen is a piece of furniture, strong and flat; the concertina is the whole effect.',
            },
            {
                key: 'ribbon',
                name: 'A ribbon and bow',
                see: 'Two satin ribbons with gold edges cross the part in an X and meet in a large bow with a gold clasp and two hanging tails; the clasp opens, the bow unties (the loops fall) and the ribbons slide off the part’s four corners; to leave they return and tie.',
                verdict: 'Not recommended, because a gift is not a lobby; delightful on a card, silly on a toast.',
            },
            {
                key: 'rope',
                name: 'A velvet rope between brass posts',
                see: 'A velvet rope in deep blue with gold braid hangs between two brass posts with gold balls at the part’s two sides; the rope unhooks from the right post and swings down to hang from the left one, revealing the part; to leave it swings back and hooks on.',
                verdict:
                    'Not recommended, because the lobby’s own barrier, and the part is only half dressed; the rope covers little of a large part.',
            },
            {
                key: 'shutters',
                name: 'Gilded shutters',
                see: 'Louvred shutters of lacquer with a gold-trimmed frame cover the part in two leaves; their slats turn edge-on (a venetian turn, 60 ms apart from the top) and the leaves fold back to the sides, revealing the part; to leave they come back and close.',
                verdict: 'Not recommended, because light and architectural; the turning slats are fine at the large sizes.',
            },
            {
                key: 'gate',
                name: 'A lift gate',
                see: 'A brass pantograph lift gate (an accordion lattice of crossed gold bars with a rivet at every crossing) closes the part; it collapses to the left like a lift gate being opened by hand, its lattice narrowing to a bundle of bars at the side, revealing the part; to leave it extends again.',
                verdict: 'Not recommended, because the most Deco of the ten and the busiest; the lattice is a lot to read on a toast.',
            },
            {
                key: 'fan',
                name: 'A great fan',
                see: 'A great fan (gold ribs and panels of deep-blue satin with a gold-braid edge, closed it is a single pointed shape at the bottom centre) opens to cover the part and then folds away, rib by rib from the left, taking the satin with it, to reveal the part; to leave it opens over the part and folds shut.',
                verdict: 'Not recommended, because the anchor again, large; lovely once, and it is the fan on every arrival.',
            },
            {
                key: 'beads',
                name: 'A bead curtain',
                see: 'Strings of gold and pearl beads hang across the part every 8 px, each ending in a small tassel; they part from the centre to both sides (the beads swinging, each string 20 ms apart) revealing the part; to leave they swing back and hang still.',
                verdict: 'Not recommended, because light and airy; a bead curtain is a doorway and the beads hide little.',
            },
            {
                key: 'shell',
                name: 'A scallop shell',
                see: 'A shell of deep-blue lacquer with gold ribs, hinged at the bottom and shaped to the part, is closed over it; it opens by turning on its hinge (the upper half tilting up and away by its ribs, the ribs fanning) and then is gone, revealing the part; to leave it closes.',
                verdict: 'Not recommended, because the shell is a Deco motif and the hinge turn the most theatrical; it asks for a tall part.',
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
        why: 'A button, a menu’s entries, a tile with its Open link, a link in running text, two key figures and a month of days. The elements answer your own pointer: move over them to test. The State buttons still force Hover and the first of each is pointed at.',
        kind: 'still',
        scene: 'hover',
        options: [
            {
                key: 'leaf',
                name: 'Gold leaf warms the plate',
                see: 'A very fine gold-leaf wash (gold at 9 %, with a fine irregular grain a few percent either way) fades into the plate over 320 ms, the hairline frame brightening to full gold and the label warming to champagne; on leaving it fades out.',
                verdict:
                    'Recommended: this one, because it is what a gilded thing does in warm light: it warms. Nothing moves, nothing opens, and the plate looks more expensive for it.',
            },
            {
                key: 'mat',
                name: 'An inner mat frame draws itself',
                see: 'A second hairline frame draws itself 4 px inside the first from the four corners to the edges’ middles in 320 ms, a tiny lozenge set at each corner of it, like a picture mount opening; on leaving it undraws.',
                verdict: 'Not recommended, because a frame inside a frame is a lot on a small button; very fine on a tile.',
            },
            {
                key: 'gleam',
                name: 'A single gleam crosses the plate',
                see: 'One slim diagonal gleam (a soft band, 12 % ivory, 24 px) crosses the plate once, from the start edge to the end, in 480 ms, the border brightening as it passes; it does not repeat while the pointer rests.',
                verdict: 'Not recommended, because a gleam is the glint of the earlier round; it is more refined once, still the glint.',
            },
            {
                key: 'relief',
                name: 'The plate comes into relief',
                see: 'The plate rises into relief like an embossed seal in 240 ms: a thin highlight line appears along its top edge and a thin shadow line along its foot, the inlay brightening, and a faint reflection of the label (a hairline under it) appears.',
                verdict: 'Not recommended, because relief is subtle and the most tactile; on a flat theme it can read as a bevel.',
            },
            {
                key: 'jewels',
                name: 'Two jewels set beside the label',
                see: 'Two tiny lozenge jewels (4 px, gold with a light facet) fade in at the two ends of the label in 240 ms, and the label’s letter-spacing opens by 0.01 em; on leaving they fade out.',
                verdict: 'Not recommended, because jewels beside every hovered label is a bracket by another name.',
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
        why: 'A button, a primary button, a menu entry, a calendar day and a key figure as a filter, each at rest and pressed. The elements answer your own press in the scene: press and hold them to test. The State buttons still force Press.',
        kind: 'still',
        scene: 'press',
        options: [
            {
                key: 'seal',
                name: 'A seal pressed into wax',
                see: 'On contact the plate sinks 1 px (an inner shadow at its top-left, a highlight at its bottom-right) and a single fine gold ring ripples out from the centre and fades in 400 ms; on release the plate rises back.',
                verdict:
                    'Recommended: this one, because a press worth the name is a seal pressed: it goes in, and it leaves a ring where it went; quiet, tactile, expensive.',
            },
            {
                key: 'engrave',
                name: 'An engraving',
                see: 'On contact the inlay line draws inward 2 px (the frame contracts) and the plate’s lacquer deepens a shade, as if cut deeper; on release the frame returns to its place in 160 ms.',
                verdict: 'Not recommended, because very quiet; at a small size the 2 px is the whole gesture.',
            },
            {
                key: 'gild',
                name: 'Gilding pressed on',
                see: 'On contact a wash of gold is pressed on from the middle outward over 240 ms, settling at 16 % while the press is held, the label ivory on it; on release it fades.',
                verdict: 'Not recommended, because a wash of gold is the casino fill at low strength; elegant only at low strength.',
            },
            {
                key: 'brass',
                name: 'A brass plate pressed',
                see: 'On contact the plate’s highlight and shadow swap (the highlight line moves from the top edge to the bottom, the shadow line from the foot to the top, as a physical plate is pressed), the label moving 1 px down; on release they swap back.',
                verdict: 'Not recommended, because the most physical and the plainest; a bevel by another name.',
            },
            {
                key: 'flash',
                name: 'Jewels flash at the label’s ends',
                see: 'On contact two lozenge jewels flash at the label’s ends (gold to ivory to gold, 200 ms) and the label brightens to ivory while held.',
                verdict: 'Not recommended, because a flash is a blink; the press should land, not signal.',
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
