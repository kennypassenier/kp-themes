// What makes formal formal: the nineteen questions, as data. The designer's
// text, verbatim; demo.js wires each aspect's scene and options.css draws
// each option by `data-fm-<id>="<key>"` on the scene. The grammar is
// themes/formal/CHARACTER.md (G1–G21); the anchor is the double rule
// (research/formal-anchor, Kenny 2026-10-08): a rule ruled under the figure
// at an even pace to the margin, closed with a thinner second rule.

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

export const THEME = 'formal';
export const LABEL = 'Formal';
export const TITLE = 'What makes formal formal';
export const STORY = {
    what: 'Formal is the clerk’s ledger: paper stock in three tones, near-black ink with a blue cast, one navy that does every acting, red ink for the entries that need the eye, gold only on a ribbon. The anchor you picked says what the clerk does: he rules. A rule is drawn under a figure from the start at an even pace, it stops at the margin, and when the account is done a thinner second rule closes it.',
    so: 'So everything that happens on screen is something a clerk does to a ledger: it is ruled in (arriving), ruled off (leaving), closed with the double rule (done), ruled again (a live update), ruled line by line (loading, opening). Nothing fades, nothing rises, nothing is stamped or sealed or squashed, and nothing performs: motion commits.',
    decided:
        'Already decided by you: the anchor = the account is closed, the double rule (the anchor round); your family picks for formal (loading = the busy table, arrival = the meter, live = the trend, hover = the network graph, tone = the tiles, shape = the meter); and the network graph changes in no theme. The questions below turn the anchor into rules for every other component; where a decided pick is at odds with the rule, the pick is on the page as an option named “the pick”. The full analysis is in themes/formal/CHARACTER.md.',
};

/**
 * `kind`: 'cycle' scenes are replayed by the page's clock (arrive, open,
 * press, update, leave), 'loop' scenes loop in CSS, 'still' scenes do not
 * move. `scene` names the scene demo.js builds. `options[0]` is the
 * recommendation.
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', scene: string,
 *   options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
export const ASPECTS = [
    {
        id: 'curve',
        label: 'The motion curve',
        rule: 'G1',
        question: 'A rule is drawn under a figure; a dialog, a menu and a tile are ruled in. On which curve is a rule ruled?',
        why: 'In every option every part is ruled for the same 400 ms and in the same way (its rules drawn along their lines, top down), so only the curve differs. Beside the parts a navy rule is ruled next to a grey one at an even pace, so the curve is seen on its own.',
        kind: 'cycle',
        scene: 'moving',
        options: [
            {
                key: 'ruled',
                name: 'Ruled at an even pace, dead stop',
                see: 'The rule starts at once and runs to the margin at one speed, and stops dead there: linear. The dialog’s frame, the menu’s lines and the tile’s rules all run so; the words appear behind each rule as it passes. The close is the same backwards.',
                verdict: rec(
                    'it is how a rule is ruled (a pen along a straight edge neither accelerates nor settles), it is the anchor’s own pace, and it is told from grotesk’s even pace by what stops it: formal stops at the margin and closes with a second rule, grotesk dwells and turns.',
                ),
            },
            {
                key: 'commit',
                name: 'The register’s commit curve (formal today)',
                see: 'cubic-bezier(0.2, 0, 0, 1), formal’s --fx-ease: the rule is half way at 0.1 s and spends the rest settling into the margin; the dialog and the menu today slide into place on it.',
                verdict: not(
                    'it is a thing sliding into place and easing to a stop, which is right for a colour change and wrong for a line: a rule that slows before the margin was not ruled, it was placed.',
                ),
            },
            {
                key: 'hand',
                name: 'The hand’s ease-in-out',
                see: 'The rule starts gently, runs, and slows to the margin (ease-in-out): a hand drawing freehand.',
                verdict: not(
                    'a freehand line belongs to sepia’s nib and blueprint’s pen; a clerk rules against a straight edge and does not slow down.',
                ),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'Each part on the motion it has today: the dialog fades and rises 14 px on the commit curve, the menu appears at once, the tile fades; the rule on the commit curve.',
                verdict: not('nothing is ruled: two fades, a rise and a jump, none of them the anchor.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Which way does a rule run, and in what order are several ruled?',
        why: 'A rule runs along its line from where you start reading to where you stop (left to right here, mirrored in right-to-left languages); a ledger is filled from the top down. Every option rules the same parts for the same time; only the way differs.',
        kind: 'cycle',
        scene: 'direction',
        options: [
            {
                key: 'along',
                name: 'Along the line start → end, lines top → bottom',
                see: 'The days of a week are ruled one after the other in reading order, 60 ms apart; the tile’s frame then its lines, top down; the trend’s line is drawn left to right; the loading lines are ruled top down.',
                verdict: rec('it is the ledger’s own order: along the line, line after line; the eye reads where the rule goes.'),
            },
            {
                key: 'rise',
                name: 'Up from the base line',
                see: 'Each day, the tile and the figure rise into their line from below it, clipped at the line (forest’s and solstice’s arrival), the trend’s line from the baseline.',
                verdict: not('it is forest’s growth and solstice’s rising light; nothing in a ledger rises.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'Today’s picks: the days turn down like diary leaves (the page turns), the tile is written in from the left, the trend’s line is written by hand, the columns are set in type in hard steps.',
                verdict: not('four directions on one screen; the eye cannot predict where the next thing comes from.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open, and how does it close?',
        why: 'Today the menu is unrolled like a scroll (the pick), the header’s menu drops on a hinge, and the dialog fades and rises 14 px. A ledger opens by being ruled: the frame, then the lines.',
        kind: 'cycle',
        scene: 'opening',
        options: [
            {
                key: 'ruled',
                name: 'Ruled open from its anchor',
                see: 'The menu is ruled line by line downward out of its button’s edge: its frame rule first, then each entry’s line, 60 ms apart, the words behind each rule; the dialog is ruled where it stands, its frame rule, its title’s rule, its lines, top down. Both close as the rules taken off, bottom first.',
                verdict: rec(
                    'one picture for every panel, the anchor’s own, and the words are never squashed or faded: they are revealed as the rule passes.',
                ),
            },
            {
                key: 'unrolled',
                name: 'Unrolled (the pick)',
                see: 'The menu unrolls down from the button like a scroll (its height grows from 0 on the commit curve) and rolls up to close; the dialog the same from its top edge.',
                verdict: not(
                    'it is your menu pick, but a scroll unrolling is a paper gesture, not a ruling one, and the words are squashed while it unrolls.',
                ),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The menu appears at once; the dialog fades in while rising 14 px and shrinking from 98.5 %, and closes the same backwards in two thirds of the time.',
                verdict: not('a fade and a rise is what every theme without a character does.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long do a contact, a rule, a group of rules and a busy loop take?',
        why: 'Every option shows the same picture (rules ruled along their lines, top down, closing as the rules lifted); only the times differ. A contact must answer at once; a rule must be slow enough to be seen ruled and quick enough not to hold up the tenth dialog.',
        kind: 'cycle',
        scene: 'durations',
        options: [
            {
                key: 'ruling',
                name: 'One ruling time: 180 · 400 (+60) · 2400 ms',
                see: 'A press answers in 180 ms; a rule across a part takes 400 ms; a group is ruled 60 ms apart, so a six-line menu is done in 700 ms; the busy bar’s rule-and-close takes 2.4 s a loop.',
                verdict: rec('one pace for every rule, seen but never waited for; the register’s 180 ms contact stays.'),
            },
            {
                key: 'brisk',
                name: 'Brisk: 120 · 240 (+40) · 1600 ms',
                see: 'A press in 120 ms, a rule in 240 ms, lines 40 ms apart, the loop in 1.6 s.',
                verdict: not('a rule in 240 ms reads as a flash; the ruling is over before the eye follows it.'),
            },
            {
                key: 'unhurried',
                name: 'Unhurried: 240 · 700 (+90) · 3600 ms',
                see: 'A press in 240 ms, a rule in 700 ms, lines 90 ms apart (a six-line menu in 1.15 s), the loop in 3.6 s.',
                verdict: not('handsome once; a menu that takes over a second to rule holds up the work.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What may be navy, what may be red ink, and where do bronze and gold go?',
        why: 'The anatomy says one navy does every acting and bronze and gold are the second voice, never a control. Today gold offsets the mirror button, red frames the voided stamp, and the tiles glow in the light success plate.',
        kind: 'still',
        scene: 'colour',
        options: [
            {
                key: 'navy',
                name: 'Navy rules, red ink marks, gold never acts',
                see: 'Every rule, pick and act is navy; a warning or failure is ruled off in red ink along its start edge, its change on a square plate; bronze is a wash behind emphasised words; gold is the meter’s ribbon and nothing else.',
                verdict: rec(
                    'one acting colour and one marking colour, both ink; the status plates show a state and never act; gold stays a ribbon.',
                ),
            },
            {
                key: 'gold',
                name: 'Gold draws the second rule',
                see: 'The closing rule (the second, thinner one) is gold: on the bar, under a changed figure, inside a pressed button.',
                verdict: not('a gilt rule is deco’s, and gold on every press breaks the anatomy’s rule that gold never acts.'),
            },
            {
                key: 'ink',
                name: 'Ink only',
                see: 'Every rule in the near-black ink; navy only on the primary button; red ink stays for warnings.',
                verdict: not('a ledger ruled in black is a table; the navy is what makes a rule an act.'),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'Which corners are rounded, which are square?',
        why: 'The register gives plates 0.375 rem and small things half that; the picks add square plates inside hairlines (the change, the field note), index tabs and certificates. A ruled thing has square ends.',
        kind: 'still',
        scene: 'corners',
        options: [
            {
                key: 'plates',
                name: 'Plates keep their corner, ruled things are square',
                see: 'Cards, dialogs, menus and tiles at 0.375 rem; every rule has square ends; a small plate that sits inside a rule (the change, a tag, the tooltip, a menu caption) is square.',
                verdict: rec('a plate is paper with a softened corner; a thing inside a rule is ruled, and a ruled thing has no rounded corner.'),
            },
            {
                key: 'square',
                name: 'Everything square',
                see: 'Radius 0 on plates, buttons, tags and tooltips: a ledger page with nothing softened.',
                verdict: not('square plates all round are grotesk’s and brutalism’s; formal’s paper keeps its corner.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'Today’s values: 0.375 rem plates, 0.1875 rem tags, round status dots, the picks’ square change plates and 3 px stamps.',
                verdict: not('three radii and a square on one theme with no rule for which is which.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is on the paper before anything happens?',
        why: 'Today the page has its gravure grain (felt, not seen); the picks frame nearly every component in an engraved double rule and rule ledger lines in the chart and the trend.',
        kind: 'still',
        scene: 'surface',
        options: [
            {
                key: 'ledger',
                name: 'Ledger lines under figures, the double rule on what matters',
                see: 'Faint ledger lines run under tabular figures, a chart’s plot and the empty state; a heading, a dialog, a certificate carry the double rule; a plain card, a tile, a menu is paper with a hairline and no frame.',
                verdict: rec('the frame says “this matters” only when it is used sparingly; ledger lines under figures are the ledger itself.'),
            },
            {
                key: 'plain',
                name: 'Plain paper, rules only when something happens',
                see: 'No ledger lines, no double rules at rest: a rule is drawn only when something arrives, changes or is pointed at.',
                verdict: not('a page that is bare until it moves is light’s; formal’s paper is ruled before the clerk writes.'),
            },
            {
                key: 'engraved',
                name: 'As today: engraved frames everywhere',
                see: 'The picks as decided: the engraved double frame on the busy table, the menu, the drawer, the tiles, the trend, the key figure, the columns, the header.',
                verdict: not('eight framed plates on one dashboard; when everything is framed, nothing matters more than the rest.'),
            },
        ],
    },
    {
        id: 'warning',
        label: 'A warning',
        rule: 'G8',
        question: 'How does a figure that needs attention look?',
        why: 'Your tone picks for the key figure, the trend and the menu are the red-ink entry; the calendar’s tone is a tinted plate with a rule; the busy table’s failure is the voided stamp.',
        kind: 'still',
        scene: 'warning',
        options: [
            {
                key: 'redink',
                name: 'The red-ink entry',
                see: 'A warning or failed figure is ruled off along its start edge in 3 px red ink; its change sits on a square plate inside a hairline; the plate’s ground stays paper; a destructive menu entry is ruled off the same way.',
                verdict: rec('it is your pick for three components and the accountant’s own mark: red ink on the entry, never a red plate.'),
            },
            {
                key: 'tinted',
                name: 'The tinted plate with a rule',
                see: 'The figure’s plate takes the tone’s light tint and a rule along its top in the tone’s ink (the calendar’s tone pick).',
                verdict: not('a tinted plate is every theme’s warning; the rule along the top is the only formal part of it.'),
            },
            {
                key: 'stamp',
                name: 'The voided stamp',
                see: 'A rotated red double-ruled stamp reading VOID lands on the failed figure (the busy table’s failure pick).',
                verdict: not('a stamp is brutalism’s and sepia’s device too, and the anchor retired the stamp from formal.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens when a figure changes?',
        why: 'Today the register stamps a checked frame on the changed value (--kp-update: stamp); the picks sign it again, stamp it, or slide a pointer. The anchor closes an account with a second rule.',
        kind: 'cycle',
        scene: 'live',
        options: [
            {
                key: 'closed',
                name: 'Ruled again and closed',
                see: 'A navy rule is ruled under the changed figure from the start (400 ms), the second rule closes it at the end, both are lifted; the figure, the word, the line never move.',
                verdict: rec(
                    'it is the anchor on the changed figure exactly: the account closed on the new value; nothing swells, nothing is stamped.',
                ),
            },
            {
                key: 'stamp',
                name: 'The checked stamp (today)',
                see: 'A 1.5 px navy frame lands round the changed value askew, from a third larger, and soaks in (the register’s update stamp).',
                verdict: not('a frame landing askew is a stamp, which the anchor retired; on a chart it frames the last point like a sticker.'),
            },
            {
                key: 'signed',
                name: 'Signed again',
                see: 'The figure is retraced in its own serif, easing in and out (the key figure’s and the tiles’ live pick).',
                verdict: not('a retrace is a glow by another name; the anchor rules, it does not sign.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does a waiting surface show?',
        why: 'Your picks load six ways: the dotted leader (busy, kpi, tiles, columns, menu, calendar), the seal pressed (busy, kpi), the received stamp (chart), the ledger ruled (trend), the skeleton’s ink (register). The anchor rules lines.',
        kind: 'loop',
        scene: 'loading',
        options: [
            {
                key: 'lines',
                name: 'Ruling the lines',
                see: 'On every waiting surface the ledger’s lines are ruled across it one after the other, top down, at the ruling pace, lifted, and ruled again: a tile, a panel, a menu entry, a day, a chart’s plot, the skeleton’s three lines.',
                verdict: rec(
                    'it is your trend pick carried everywhere and the anchor at work: a surface waiting is a ledger being ruled for the figures to come.',
                ),
            },
            {
                key: 'leader',
                name: 'The dotted leader (the picks)',
                see: 'A dotted leader is written dot by dot across the waiting part, “to be entered”, and again.',
                verdict: not(
                    'it is your most frequent loading pick, but a leader is written, not ruled, and dots appearing one by one are the busy bar’s still dots in motion.',
                ),
            },
            {
                key: 'seal',
                name: 'The seal is pressed (the picks)',
                see: 'A navy seal ring scales up and back on the waiting part’s centre, again and again.',
                verdict: not('the anchor round set the seal aside; a seal pulsing on every waiting part is a heartbeat, not a ledger.'),
            },
            {
                key: 'ink',
                name: 'As today: the skeleton’s ink',
                see: 'The register’s skeleton: a pale word-shape run under a double rule, a navy copy inked across it and wiped off, 3 s a loop.',
                verdict: not('the picture is near the rule but it is a shimmer in a 3 s loop, and only the skeleton has it.'),
            },
        ],
    },
    {
        id: 'busybar',
        label: 'The busy progress bar',
        rule: 'G11',
        question: 'What does the progress bar do while no share is known?',
        why: 'Today the busy bar is a leader of navy dots that does not move. The bar with a share is the anchor’s own drawing (the band ruled, the second rule at 100 %).',
        kind: 'loop',
        scene: 'busybar',
        options: [
            {
                key: 'closed',
                name: 'Ruled and closed, lifted, ruled again',
                see: 'The band is ruled start → end (1.2 s), the second rule closes it, both are lifted from the start (1.2 s), and it is ruled again; the share bar beside it unchanged.',
                verdict: rec(
                    'the busy bar does what the share bar does at 100 %, over and over: the account ruled and closed while the clerk waits.',
                ),
            },
            {
                key: 'leader',
                name: 'The dotted leader written dot by dot',
                see: 'The leader’s dots are written one by one across the track and wiped, 2.4 s a loop.',
                verdict: not('it moves what stands still today, but a leader is a wait mark on a page, not the bar’s own rule.'),
            },
            {
                key: 'slides',
                name: 'The band slides to and fro (the meter’s)',
                see: 'A short navy band slides from the start to the end and back on ease-in-out (the meter’s loading today).',
                verdict: not('a band sliding to and fro is every indeterminate bar since 2010 and nothing of the ledger.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G12',
        question: 'What does the spinner draw?',
        why: 'Today the spinner is a watch dial: a hairline ring with a 12 o’clock tick and a navy hand turning on the hand’s curve.',
        kind: 'loop',
        scene: 'spinner',
        options: [
            {
                key: 'arc',
                name: 'An arc ruled round a double ring',
                see: 'A hairline ring with a thinner ring inside it; a navy arc is ruled round the ring at an even pace, closes with a thinner arc inside it, both are lifted, and it is ruled again; three sizes, in a busy button, in the busy panel.',
                verdict: rec('the double rule, round: the spinner rules an account on a ring and closes it, at the ruling pace.'),
            },
            {
                key: 'dial',
                name: 'The dial (today)',
                see: 'The register’s watch dial: the ring, the tick, the hand turning in 1.6 s on ease-in-out.',
                verdict: not(
                    'a hand turning is a clock, which is the one object a clerk does not draw in a ledger; it eases where the anchor rules.',
                ),
            },
            {
                key: 'dots',
                name: 'A dotted leader round a ring',
                see: 'Navy dots are written one by one round the ring and wiped.',
                verdict: not('the leader again, bent round; dots appearing round a ring is every loading spinner.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G13',
        question: 'How does a part arrive, and how does it leave?',
        why: 'Today a leaving part folds up like a letter into its top edge and an arriving part is that played backwards. The anchor rules a part in; what is ruled can be ruled off.',
        kind: 'cycle',
        scene: 'leave',
        options: [
            {
                key: 'ruled',
                name: 'Ruled in, ruled off',
                see: 'An alert, a card and a figure arrive as their rules are ruled: the frame rule start → end, then the lines top down, the words revealed behind each rule; they leave as the rules are taken off, bottom first, end → start: one animation, forward and backwards.',
                verdict: rec('arriving and leaving are the same ruling, read forward and backward; nothing fades, nothing folds.'),
            },
            {
                key: 'folded',
                name: 'Folded up like a letter (today)',
                see: 'The part collapses up into its top edge (scaleY to 0) at 20 % ink and arrives unfolding from it.',
                verdict: not('a fold squashes the words while it moves and reads as a blind rolling up; it is not a ruling.'),
            },
            {
                key: 'struck',
                name: 'Struck through',
                see: 'A navy rule is ruled through the part’s middle and the part is lifted behind it; arriving, the rule is ruled and the part revealed behind it, the rule lifted.',
                verdict: not('a strike-through says “wrong”, so every leave reads as a correction; the anchor rules under, never through.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G14',
        question: 'Is a button inside a header, a menu, a tile or a drawer formal’s own button?',
        why: 'The header’s pick gives its buttons a ruled plate that thickens and presses inward; the key figure’s pick raises a guilloche on hover; the tile’s Open link underlines and the tile lifts. Use the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: 'composites',
        options: [
            {
                key: 'own',
                name: 'Exactly formal’s own',
                see: 'Every button, link and entry inside a composite hovers, focuses and presses exactly like the one standing alone: the inner rule on hover, DI2’s ring on focus, the rule doubled on press.',
                verdict: rec('one manner for every control, wherever it stands; a composite may frame them with a rule and may not change them.'),
            },
            {
                key: 'framed',
                name: 'Formal’s own plus a rule round them',
                see: 'The same manners, and the header’s actions and the drawer’s buttons sit on a ruled plate (a hairline frame) that the composite adds.',
                verdict: not('a frame round a framed button is the double rule drawn twice; the inner rule on hover then reads as a third.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The header’s ruled plate that thickens and presses inward, the key figure’s guilloche, the tile’s lift: three manners.',
                verdict: not('three hovers on one page; the eye cannot learn one.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G15',
        question: 'What happens where the pointer rests?',
        why: 'The register draws the rule 2 px inside a hovered control (gap-4); the tiles’ pick lifts the tile on a soft shadow; the menu’s pick underlines the entry. Use the State buttons above: Hover plays the pointer arriving and leaving.',
        kind: 'still',
        scene: 'hover',
        options: [
            {
                key: 'inner',
                name: 'The inner rule',
                see: 'The rule is drawn 2 px inside the control (navy on paper, the label’s colour on a filled button); a menu entry takes the muted ground and a rule under its label; a link’s underline turns double; a day in the month gets the rule under its figure; no lift, no shadow.',
                verdict: rec(
                    'it is the one gesture formal’s controls already make, and the anchor’s first rule: pointing rules the control, pressing doubles it.',
                ),
            },
            {
                key: 'under',
                name: 'A rule under the label',
                see: 'Hover rules a 2 px navy line under the button’s label, inside the face (the menu’s quill underline, carried to every control).',
                verdict: not('a rule under the words is grotesk’s baseline; formal’s rule frames the control.'),
            },
            {
                key: 'lift',
                name: 'The lift (the tiles’)',
                see: 'The hovered part rises 2 px on a soft shadow and its Open link underlines.',
                verdict: not('a lift on a shadow is light’s depth; formal has no shadow but the dialog’s mat.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G16',
        question: 'What marks the control the keyboard is on?',
        why: 'DI2 fixes the two-channel ring for every theme (an outline in the contrast colour and a ring in the focus colour); the question is only what formal adds. Use State: Focus.',
        kind: 'still',
        scene: 'focus',
        options: [
            {
                key: 'di2',
                name: 'The two-channel ring',
                see: 'DI2’s ring exactly, with the inner rule drawn under it when the part is also pointed at; the drawer’s highlight uses the same two channels.',
                verdict: rec('a system constant; adding a formal flourish to it would make the ring less visible where it must be most.'),
            },
            {
                key: 'double',
                name: 'The double rule as the ring',
                see: 'Focus draws the double rule round the control (a strong hairline with a thinner inside it) instead of the two-channel ring.',
                verdict: not('two navy rules read as one channel: on a navy button the ring vanishes, which DI2 was written to prevent.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The register’s ring plus the header pick’s dotted outline and the key figure pick’s single 2 px ring.',
                verdict: not('three focus marks; the keyboard user should learn one.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G17',
        question: 'What does a press do?',
        why: 'The register has no press of its own (only the system’s darker ground); the picks press the header’s plate inward and darken the key figure. The anchor’s press doubles the rule. Use State: Press.',
        kind: 'still',
        scene: 'press',
        options: [
            {
                key: 'double',
                name: 'The rule doubles',
                see: 'The inner rule gains its second rule 3 px further in and the face takes the pressed ground; nothing moves; release lifts the second rule. A menu entry’s rule doubles under its label; a day in the month is ruled twice.',
                verdict: rec('it is the anchor’s press as you picked it: the account closed under the finger.'),
            },
            {
                key: 'pressed',
                name: 'The plate pressed a shade',
                see: 'The face takes the pressed ground and darkens a shade (the key figure’s and the header’s pick); no rule.',
                verdict: not('a shade darker is the system’s default press; nothing of the anchor is in it.'),
            },
            {
                key: 'none',
                name: 'As today (nothing)',
                see: 'The register as it stands: the pressed ground only, no rule, no motion.',
                verdict: not('a press that shows nothing of its own is the one state the anchor was picked to give.'),
            },
        ],
    },
    {
        id: 'type',
        label: 'The voice',
        rule: 'G18',
        question: 'In which face are the figures, the labels and the prose set?',
        why: 'The register sets headings in Fraunces and everything else in Instrument Sans; the picks set labels in small capitals and the ledger’s figures in monospace.',
        kind: 'still',
        scene: 'type',
        options: [
            {
                key: 'fraunces',
                name: 'Fraunces figures, small-caps labels',
                see: 'Titles and large figures in Fraunces with tabular numerals; labels, captions, menu headings and tags in all-small-caps Instrument Sans tracked 0.06 em; prose in Instrument Sans; identifiers and timestamps in small capitals too, no monospace.',
                verdict: rec(
                    'the figure is the thing a ledger is for, so it is set in the display face; the labels whisper in small capitals; one voice, no typewriter.',
                ),
            },
            {
                key: 'sans',
                name: 'Sans figures',
                see: 'Figures in Instrument Sans 600 with tabular numerals; Fraunces for headings only.',
                verdict: not('it is light’s voice; formal’s figures lose their serif and with it the ledger.'),
            },
            {
                key: 'mono',
                name: 'Tabular mono figures',
                see: 'Figures, timestamps and identifiers in the monospace face (the ledger graph’s pick).',
                verdict: not('a typewriter in a ledger is titanium’s and terminal’s voice; the anatomy says formal has no mono voice.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G19',
        question: 'Which marks may formal draw, and where?',
        why: 'The picks carry the double rule, the docket cut, red ink, the dotted leader, the seal, the stamp, the ribbon and the guilloche. The anchor is a rule.',
        kind: 'still',
        scene: 'motifs',
        options: [
            {
                key: 'rules',
                name: 'The rule, the double rule, the docket cut, red ink',
                see: 'A rule under a figure; the double rule on a heading, a dialog, a certificate, the closed account; the docket cut (hairline and tick) as the divider and the bar’s track; red ink on an entry; the meter keeps its ribbon.',
                verdict: rec('four marks, all made with a ruling pen; the seal and the stamp are retired, as the anchor round decided.'),
            },
            {
                key: 'seal',
                name: 'Those plus the seal where picked',
                see: 'The same four, and the wax seal stays before the state word and on the busy table as you picked them.',
                verdict: not('a seal is the one thing a ruling pen cannot draw; keeping it in two places keeps two grammars.'),
            },
            {
                key: 'all',
                name: 'As today (everything)',
                see: 'Every mark the picks and the register carry: rules, seals, stamps, the leader, the ribbon, the guilloche, the laurels.',
                verdict: not('a clerk with eight instruments; the eye cannot tell what a mark means.'),
            },
        ],
    },
];
