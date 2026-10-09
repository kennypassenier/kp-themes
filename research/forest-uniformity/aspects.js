// Forest, straightened: the ten questions, as data. Each question is one
// family of findings from the uniformity audit (README.md, findings.json):
// what forest's approved grammar (themes/forest/CHARACTER.md G1-G16, decided
// 2026-10-07) already says, measured against what the package does in forest
// today, measured in Chromium on 2026-10-09. demo.js wires each question's
// scene and options.css draws each option by `data-fu-<id>="<key>"` on the
// scene. Every option follows the approved grammar; the last option of every
// question is "today", the package as it stands. No option invents a new
// character: they differ only in how far the grammar is carried.

export const THEME = 'forest';
export const LABEL = 'Forest';
export const TITLE = 'Forest, straightened';
export const STORY = {
    what: 'You approved forest’s grammar on 2026-10-07: everything grows out of its own line on one growth curve in one growth time (1000 ms), what hangs from a button grows down out of it, every close is its open played backwards, pointing is the dashed green blaze, focus is the two-channel ring, loading is planting, and every plate and small part has the leaf corner. The register applied it to the dialog, the menus, the buttons, the toast, the tooltip and the drawer.',
    so: 'The audit measured every component root of the package in forest (Chromium, 2026-10-09) against that grammar. Most of it holds. What does not is mostly the parts the first apply did not reach: the bar’s dropdown still fades in 200 ms and the phone menu appears at once, the palette, the date picker and the theme menu open and close at once, the tour fades, half of the pointable parts answer the pointer with nothing or with a grey wash, and a few small parts keep the package’s corners.',
    decided:
        'Each question below is one family of those findings. Every option is a live scene; the last one is forest as it is today, the first is the recommendation, and the others carry the grammar a different distance. Where your grammar already settles the answer (every close is its open reversed, what opens grows like its family, the leaf corner on every small part) the recommendation is ticked for you. Pure faults with no choice in them (a pressed primary button that turns pale under its words, two focus rings with one channel) are listed in README.md to be fixed, not asked here.',
};

/**
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', scene: string, settled?: boolean,
 *   options: { key: string, name: string, see: string, verdict: string, untick?: 'now' | 'after' }[] }[]}
 */
export const ASPECTS = [
    {
        id: 'navigation',
        label: 'The bar',
        rule: 'G3, G11, G12',
        question: 'How does the bar’s dropdown and its phone menu open, and how do the bar’s links, tabs, crumbs and pages answer the pointer?',
        why: 'Measured in Chromium: the bar’s dropdown fades in 200 ms and out the same way (opacity 0, 0.37, 0.85, 1 at 0, 60, 120, 180 ms), where a menu under a button grows down out of it in 1000 ms; the phone menu appears and goes at once. The links underline in green in 200 ms, but the Report button, the menu toggle, the tabs, the crumbs and the page numbers answer nothing at all. The dropdown opens and closes on its own here; the pointed parts are drawn pointed.',
        kind: 'cycle',
        scene: 'navigation',
        options: [
            {
                key: 'grown',
                name: 'Grows out of the bar; a link answers as a link',
                see: 'The dropdown grows down out of its link and the phone menu down out of the bar, far end first, in 1000 ms on the growth curve, and closes as that growth backwards. A link, a tab, a crumb and a page number answer the pointer as forest’s link does: a 2 px green rule under the words, drawn in 200 ms. The Report button and the menu toggle are buttons, so they blaze. Crumbs and page numbers speak in the body face, not the monospace.',
                verdict:
                    'Recommended: this one, because it is your grammar on the one menu it has not reached (a menu grows out of what it hangs from) and your rule for composites (a link inside a bar is the theme’s link, a button is its button); the bar keeps its quiet underline.',
            },
            {
                key: 'blazed',
                name: 'Grows; everything in the bar blazes',
                see: 'The same growth. Every link, tab, crumb and page number pointed at gets the dashed green blaze ring 2 px outside it, like a button.',
                verdict: 'Not recommended, because a bar of rings is loud, a blazed link reads as a button, and your grammar keeps a link a link.',
            },
            {
                key: 'today',
                name: 'Today',
                see: 'The dropdown fades in and out in 200 ms; the phone menu appears and goes at once; the links underline, but the Report button, the toggle, the tabs, the crumbs and the page numbers show nothing when pointed at; crumbs and pages in the monospace.',
                verdict: 'Not recommended, because the dropdown is the one menu that does not grow, and half the bar does not answer the pointer.',
            },
        ],
    },
    {
        id: 'loading',
        label: 'One picture per waiting panel',
        rule: 'G9',
        question: 'A panel that waits (a busy table, a busy month) has room for a planting row. Does it show the row, the planted tree, or both?',
        why: 'Measured: the busy table panel and the busy month card play the planting row at their foot (6600 ms breath) and, in their middle, the spinner’s planted tree (1600 ms) that js/datatable.js and js/calendar.js put there: two loading pictures on two clocks in one panel. Your grammar: the row wherever there is room for one, one tree only where there is not. The busy button and the lone spinner are the same in every option.',
        kind: 'loop',
        scene: 'loading',
        options: [
            {
                key: 'row',
                name: 'The row where it fits, the tree where it does not',
                see: 'The busy table and the busy month show the planting row at their foot under their words, and no tree; the spinner’s tree stays where there is no room for a row (alone, in a day, beside a word).',
                verdict: 'Recommended: this one, because it is G9 exactly: one loading picture per surface, so a panel never runs two clocks.',
            },
            {
                key: 'tree',
                name: 'The tree in a panel, the row in bars only',
                see: 'The panels show the planted tree in their middle and no row; the row stays in the bar, the busy button and the skeleton lines.',
                verdict: 'Not recommended, because the row is your loading picture and a panel is exactly where it has room.',
            },
            {
                key: 'both',
                name: 'Both (today)',
                see: 'The row breathes at the panel’s foot while the tree is planted again and again in its middle.',
                verdict:
                    'Not recommended, because two pictures on two clocks (6600 and 1600 ms) in one panel is the busyness the grammar was written against.',
            },
        ],
    },
    {
        id: 'pointing',
        label: 'Pointing and focus on small parts',
        rule: 'G11, G12, DI2',
        question: 'How do the small parts outside the buttons answer the pointer and the keyboard?',
        why: 'Measured with the pointer forced on each part: a button, an icon button, a menu entry and a key-figure link blaze in 200 ms; an accordion heading, a combobox option, a palette option and a chart’s legend key answer nothing or a thin grey edge; a date picker day takes a grey ground at once and a theme menu option a grey wash. Focus is the two-channel ring everywhere except on a theme menu option (only the pale outer channel and a 1 px line) and on a day of the month (one 2 px ring). The scenes point at one part of each and focus another.',
        kind: 'still',
        scene: 'pointing',
        options: [
            {
                key: 'blaze',
                name: 'Every pointable part blazes',
                see: 'Every part you can point at gets the dashed green blaze, 2 px out (laid just inside a part that fills its row edge to edge), in 200 ms on the growth curve; a press closes it in. Focus is the two-channel ring on every part, the theme menu option and the day included.',
                verdict:
                    'Recommended: this one, because pointing is blazing (your pick) and a composite’s inner part is the theme’s own; one answer for every part.',
            },
            {
                key: 'wash',
                name: 'Small parts take the entry’s ground',
                see: 'Small parts take the menu entry’s kraft ground when pointed at, in 200 ms, without a ring; buttons keep their blaze. Focus is the two-channel ring everywhere.',
                verdict: 'Not recommended, because it makes a second hover family beside the blaze; quieter, but two answers for one gesture.',
            },
            {
                key: 'today',
                name: 'Today',
                see: 'Accordion headings, combobox options and palette options show nothing; a date picker day takes a grey ground at once; a theme option a grey wash in 200 ms; a legend key a thin grey edge. The theme option’s focus is a pale ring with a 1 px line, the day’s one dark ring.',
                verdict: 'Not recommended, because four hover answers and two focus rings that break DI2.',
            },
        ],
    },
    {
        id: 'pairs',
        label: 'Every close is its open reversed',
        rule: 'G1, G3, G10',
        settled: true,
        question:
            'A check is set and cleared, a list drops and goes, a group unfolds and folds, a tour card arrives and leaves. Does each close play its open backwards?',
        why: 'Measured: the tick is drawn in 200 ms and cleared at once; the radio dot scales in from 160 % and goes at once; the combobox list grows up out of its own foot (the arrival) instead of down out of its field, and goes at once; the side navigation’s group unfolds in 200 ms where the accordion unfolds in 1000 ms; the tour card fades in in 160 ms (ease-out) and goes at once. Each scene opens, holds and closes.',
        kind: 'cycle',
        scene: 'pairs',
        options: [
            {
                key: 'mirror',
                name: 'Every pair mirrored on forest’s curve',
                see: 'The tick is drawn in 200 ms and taken back the same way; the radio dot grows up out of its foot (no scaling) and sinks back; the list grows down out of its field and back into it; the side navigation’s group unfolds like the accordion, 1000 ms, and folds back; the tour card grows up from autumn to green and withers back, 1000 ms.',
                verdict:
                    'Recommended (your rule, so ticked): every close is its open played backwards, and what opens grows like its family; the small checks keep contact time (200 ms).',
                untick: 'after',
            },
            {
                key: 'panels',
                name: 'Panels mirrored, checks as they are',
                see: 'The list, the group and the tour card as in the first option; the tick and the radio dot keep today’s one-way motion (drawn in, gone at once; the dot scales in).',
                verdict: 'Not recommended, because the checks would stay the only one-way motion in forest, and the radio would still scale.',
                untick: 'now',
            },
            {
                key: 'today',
                name: 'Today',
                see: 'Tick drawn in, gone at once; dot scaled in from 160 %, gone at once; the list grows up from its foot and vanishes; the group unfolds in 200 ms; the tour card fades in in 160 ms and vanishes.',
                verdict: 'Not recommended, because four closes that are not their opens, and two speeds for one unfolding.',
                untick: 'now',
            },
        ],
    },
    {
        id: 'overlays',
        label: 'The overlays that do not grow yet',
        rule: 'G3, G4',
        settled: true,
        question: 'How do the command palette, the date picker, the theme menu and the side navigation open and close?',
        why: 'Measured: the palette (a dialog of its own class), the date picker’s panel (a manual popover) and the theme menu’s list have no motion in forest at all: they appear and go at once, because forest’s growth names `.kp-dialog` and `.kp-popover[popover]` only. The side navigation slides in 200 ms where the drawer grows out of its edge in 1000 ms. Each scene opens, holds and closes.',
        kind: 'cycle',
        scene: 'overlays',
        options: [
            {
                key: 'family',
                name: 'Each grows like its family',
                see: 'The palette grows up out of its base like the dialog; the date picker’s panel and the theme menu grow down out of their trigger like every menu; the side navigation grows out of its edge, far side first, like the drawer. 1000 ms on the growth curve, each closing as its growth backwards.',
                verdict: 'Recommended (your grammar, so ticked): one gesture per family, and these four are the only overlays still outside it.',
            },
            {
                key: 'quicknav',
                name: 'The same, the side navigation at contact speed',
                see: 'As the first option, but the side navigation keeps a 200 ms slide (now on the growth curve) because it is opened often.',
                verdict:
                    'Not recommended, because the drawer and the side navigation are the same gesture at two speeds; your durations give every growth one time.',
            },
            {
                key: 'today',
                name: 'Today',
                see: 'The palette, the date picker’s panel and the theme menu appear and vanish at once; the side navigation slides in and out in 200 ms.',
                verdict: 'Not recommended, because three overlays with no motion and one at a fifth of the growth time.',
            },
        ],
    },
    {
        id: 'forms',
        label: 'Fields under the pointer',
        rule: 'G11, G12',
        question: 'What does a field, a check, a switch or the drop zone do when you point at it?',
        why: 'Measured with the pointer forced: a text field, a select, a checkbox, a radio, a switch and the upload’s drop zone show no change at all; their focus is the two-channel ring (the field’s border turns green as well). The scenes point at each.',
        kind: 'still',
        scene: 'forms',
        options: [
            {
                key: 'blaze',
                name: 'They blaze',
                see: 'A pointed field, check, switch or drop zone gets the dashed green blaze 2 px outside it, in 200 ms, like a button; focus stays the two-channel ring with the green border.',
                verdict: 'Recommended: this one, because pointing is blazing on every part you can act on, and a field is acted on.',
            },
            {
                key: 'edge',
                name: 'Their edge turns green',
                see: 'A pointed field, check, switch or drop zone turns its edge forest green in 200 ms (the focus border without the ring).',
                verdict: 'Not recommended, because the green edge is half of the focus look: pointing and focus would read alike.',
            },
            {
                key: 'today',
                name: 'Today',
                see: 'Nothing changes under the pointer.',
                verdict: 'Not recommended, because a field is the one control that does not answer, beside buttons that do.',
            },
        ],
    },
    {
        id: 'rows',
        label: 'Rows under the pointer',
        rule: 'G11, G12, G4',
        question: 'A row of a table, a tree, the side navigation and the bar’s dropdown is pointed at. What does it show, and how fast?',
        why: 'Measured: a menu entry takes the kraft ground and the blaze laid just inside it in 200 ms; a dropdown entry and a table row take the kraft ground at once; a tree row and a side navigation row a grey ground at once (the side navigation also greys its words), with 5 px and square corners. Four answers for one gesture. The scenes point at the second row of each.',
        kind: 'still',
        scene: 'rows',
        options: [
            {
                key: 'entry',
                name: 'Every row answers as a menu entry',
                see: 'Every row pointed at takes the kraft ground and the dashed blaze laid just inside it, in 200 ms on the growth curve, as forest’s menu entry already does; its words keep their ink.',
                verdict: 'Recommended: this one, because the menu entry is forest’s row and it already blazes; one row answer in every list.',
            },
            {
                key: 'ground',
                name: 'Every row takes the ground only',
                see: 'Every row, the menu entry included, takes the kraft ground in 200 ms, with no ring.',
                verdict: 'Not recommended, because it takes the blaze off the menu entry you approved, and a ground alone is the generic hover.',
            },
            {
                key: 'today',
                name: 'Today',
                see: 'The menu entry: ground and blaze in 200 ms. The dropdown entry and the table row: kraft ground at once. The tree and the side navigation: grey ground at once, the side navigation’s words greyed.',
                verdict: 'Not recommended, because four answers and two speeds for one gesture.',
            },
        ],
    },
    {
        id: 'feedback',
        label: 'The alarm',
        rule: 'G1, G3, G8',
        question: 'How does the alarm arrive, and how does it keep calling?',
        why: 'The toast, the alert and the tooltip already grow (1000 ms on the growth curve, the leave their arrival backwards; measured). The alarm still plays the package’s entrance: its ground fades in 240 ms (ease-out), its plate rises 1.25 rem and scales from 98 % in 520 ms on the quick curve, its headline scales from 106 % in 480 ms, and its glow pulses for ever, 1400 ms each way. Forest’s register answers only its colours. The toast beside it is the reference.',
        kind: 'cycle',
        scene: 'feedback',
        options: [
            {
                key: 'grown',
                name: 'Grows like the dialog; a growth ring keeps calling',
                see: 'The alarm’s plate grows up out of its base like the dialog, 1000 ms on the growth curve, its words with it; while it waits for an answer a growth ring is laid round it once every 3200 ms (drawn clockwise in 550 ms, then it fades), instead of the glow pulse.',
                verdict:
                    'Recommended: this one, because the alarm is a dialog that will not be dismissed: it should arrive as forest’s dialog does, and forest’s way to say “look here” is the ring, not a flashing glow.',
            },
            {
                key: 'pulse',
                name: 'Grows like the dialog; the glow keeps pulsing',
                see: 'The same growth; the package’s glow pulse stays (opacity 0.4 to 1, 1400 ms each way, for ever).',
                verdict: 'Not recommended, because a pulsing glow is light’s and cyberpunk’s material; forest has no glow anywhere else.',
            },
            {
                key: 'today',
                name: 'Today',
                see: 'The package’s entrance: a fade, a rise with a 2 % scale on the quick curve, the headline scaled from 106 %, and the glow pulsing.',
                verdict:
                    'Not recommended, because it scales the words (G3 never scales) on titanium’s quick curve, and it is the one overlay forest never answered.',
            },
        ],
    },
    {
        id: 'corners',
        label: 'The leaf corner on the last small parts',
        rule: 'G6',
        settled: true,
        question: 'Which corner do the small parts take that the leaf has not reached yet?',
        why: 'Measured: plates take the leaf (0 20 0 20 px), buttons, tags, fields and the tooltip half of it (0 10 0 10 px), the meter and the bar 3 px. Still on the package’s corners: page numbers and the Report button square, date picker days, tree rows and theme menu options 5 px all round, colour swatches 10 px all round, chart legend keys and the tag’s remove button pills.',
        kind: 'still',
        scene: 'corners',
        options: [
            {
                key: 'leaf',
                name: 'The leaf on every small part',
                see: 'Every small part takes half the leaf: top-right and bottom-left rounded, the others square. What is round in a wood stays round: the radio, the switch’s thumb, the tag’s remove ×, the month’s logs.',
                verdict: 'Recommended (your pick of 2026-10-07, so ticked): the leaf corner on every plate and every small part.',
            },
            {
                key: 'press',
                name: 'The leaf on what you press, rows square',
                see: 'Page numbers, the Report button, legend keys and swatches take the leaf; the rows of a list (date picker days, tree rows, theme options) are square, like the ruled lines of a logbook.',
                verdict: 'Not recommended, because it adds a third corner (square) where your pick has one.',
            },
            {
                key: 'today',
                name: 'Today',
                see: 'Square page numbers and Report button, 5 px days, tree rows and theme options, 10 px swatches, pill legend keys and remove buttons.',
                verdict: 'Not recommended, because five corners beside the leaf.',
            },
        ],
    },
    {
        id: 'timing',
        label: 'One rhythm for every waiting surface',
        rule: 'G4, G9',
        question:
            'The bar, the skeleton lines and the busy panels breathe in 6600 ms; the skeleton block and circle in 3200 ms. Should they share one rhythm?',
        why: 'Measured: the busy bar, the skeleton lines, the measuring meter and the busy panels breathe 3000 ms in, 600 ms full, 3000 ms out (6600 ms, your change of 2026-10-07); the skeleton block and circle (the treeline) 1400, 400, 1400 (3200 ms); the spinner plants a tree every 1600 ms. On a page that loads, the block and the lines beside it drift apart every cycle. The spinner is the same in every option.',
        kind: 'loop',
        scene: 'timing',
        options: [
            {
                key: 'breath',
                name: 'The bar’s breath everywhere',
                see: 'The treeline of a block or a circle fills in 3000 ms, stands 600 ms and leaves in 3000 ms, on the bar’s own ease, so every row and block on a page breathes together; the spinner keeps its tree every 1600 ms.',
                verdict:
                    'Recommended: this one, because your bar’s breath is the loading rhythm you chose; everything that waits then moves as one grove.',
            },
            {
                key: 'grove',
                name: 'The grammar’s 3200 ms everywhere',
                see: 'Everything on the grammar’s loop of 3200 ms: the bar and the lines breathe 1450, 300, 1450 ms, the treeline as today.',
                verdict: 'Not recommended, because it halves the breath you chose for the bar on 2026-10-07.',
            },
            {
                key: 'today',
                name: 'Today',
                see: 'The bar and the lines on 6600 ms, the block and the circle on 3200 ms.',
                verdict: 'Not recommended, because the two drift apart on every page that shows both.',
            },
        ],
    },
];
