// What makes dark dark: the nineteen questions, as data. The designer's
// text, verbatim; demo.js wires each aspect's scene and options.css draws
// each option by `data-dk-<id>="<key>"` on the scene. The grammar is
// themes/dark/CHARACTER.md (G1–G21); the anchor is the pass
// (research/dark-anchor, update 1, Kenny 2026-10-08): a spectral line of
// film light sweeps a part from its start at an even pace and lays the
// oxide film along its edge behind it, turning; when the line reaches the
// end the figure takes the film through its letters and the turn settles,
// cyan at the top; the leave is the pass back.

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

export const THEME = 'dark';
export const LABEL = 'Dark';
export const TITLE = 'What makes dark dark';
export const STORY = {
    what: 'Dark is a spectral instrument: near-black ruled with a faint grid, near-white ink, and one mechanism, the anodised oxide film that runs along every edge that matters and turns with the pointer. The anchor you picked says what the instrument does: it passes a line. A spectral line of film light sweeps a part from its start at an even pace and lays the film along its edge behind it, turning; when the line reaches the end the figure takes the film through its letters and the turn settles, cyan at the top. Held, the line sweeps back and takes the film with it.',
    so: 'So everything that happens on screen is one pass: a part is laid by the line (arriving, opening), re-laid by it (a live update), swept while it waits (loading, the busy bar, the spinner), and taken off by the pass back (leaving). The film is the only colour and the line the only light: nothing fades, nothing pops, nothing blinks, no lamp lights and no trace flares.',
    decided:
        'Already decided by you: the anchor = the line lays the film down, turning (the anchor round, update 1), and round one’s progress bar stays exactly (the chamfered ticked track, the film fill whose colour turns as it fills, the `]` head) with the line at its head; the network graph changes in no theme. The questions below turn the anchor into rules for every other component; where a decided pick is at odds with the rule, the pick is on the page as an option named “the pick” or “today”. The full analysis is in themes/dark/CHARACTER.md.',
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
        question: 'A dialog, a menu and a tile are laid by the line. On which curve does the line pass, and on which does the film turn?',
        why: 'In every option every part is laid the same way for the same 660 ms (the line crosses from the start, the film is laid behind it and turns), so only the curves differ. Beside the parts a short line crosses a slot next to one at an even pace with no turn, so the curve is seen on its own.',
        kind: 'cycle',
        scene: 'moving',
        options: [
            {
                key: 'pass',
                name: 'An even pass, the turn settles',
                see: 'The line crosses at one pace (linear) and stops dead at the end; the film it lays turns through its angle on dark’s settle curve, cubic-bezier(0.22, 1, 0.36, 1): most of the turn at once, then a long settle to cyan at the top, 220 ms after the line has stopped. The close is the pass back at the same pace and the turn back on the inverse curve.',
                verdict: rec(
                    'a line of light has one speed and a film settles after it, which is the anchor exactly: the sweep’s sleekness and the turn’s settle in one gesture; formal’s pass is even too but stops dead with nothing after it, and titanium’s wash never turns.',
                ),
            },
            {
                key: 'register',
                name: 'The register’s curve (today)',
                see: 'cubic-bezier(0.16, 0.84, 0.28, 1), the register’s --fx-ease on both the line and the turn: the line starts fast and slows into the end, the turn with it.',
                verdict: not(
                    'a line that slows down reads as a slide, not a sweep; the turn and the line on one curve are one thing instead of a cause and its effect.',
                ),
            },
            {
                key: 'settle',
                name: 'The settle on everything',
                see: 'The line and the turn both on the settle curve: the line is most of the way across at once and creeps to the end.',
                verdict: not('a line that creeps to its end never stops dead, and the sweep you liked is the even one.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'Each part on its motion today: the dialog develops (a flash that fades on the register’s curve), the menu fades in, the tile strikes on like a tube in hard steps.',
                verdict: not('a develop, a fade and a strike; none of them the pass.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'From where does the line enter a part, and in what order does a group come?',
        why: 'A week of days, a tile and a trend line arrive. Every option takes 660 ms and the same line; only where it enters and the order of the group differ.',
        kind: 'cycle',
        scene: 'direction',
        options: [
            {
                key: 'start',
                name: 'From the start, along the edge',
                see: 'The line enters at the part’s start edge and crosses to its end, laying the film along the edge it has passed; a group of days is crossed by one line, each day lit as the line reaches it, 60 ms apart; the trend line is lit along its length as the line runs it from its start.',
                verdict: rec(
                    'a spectral line is read from its start, as a spectrum is; one line crossing a group makes the group one instrument instead of seven; nothing rises, nothing scales.',
                ),
            },
            {
                key: 'switch',
                name: 'Switched on in place (the picks)',
                see: 'Every part strikes on where it stands, like a tube: dark, a flash, dark, on, in hard steps; a group all at once; the trend line appears whole.',
                verdict: not(
                    'a strike is the console dialect of the picks (lamps and tubes), not the film; and a hard step is terminal’s and nostromo’s gait.',
                ),
            },
            {
                key: 'centre',
                name: 'From the centre out',
                see: 'The line starts at the part’s centre and runs to both ends at once; a group from its middle outward; the trend line from its middle to both ends.',
                verdict: not('a line that splits in two is two lines; a spectrum has one start.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open, and how does it close?',
        why: 'A menu opens under its button, a dialog opens on the ground, a toast and a tooltip appear. Every option takes 660 ms; only what is drawn differs. Every close is the open backwards.',
        kind: 'cycle',
        scene: 'opening',
        options: [
            {
                key: 'swept',
                name: 'Swept in from its anchor',
                see: 'The line crosses the menu’s footprint from its button’s edge downward and lays the panel behind it, its film edge turning; the dialog is swept from its start edge where it stands; the toast from its start edge; the tooltip from its notch. The close is the pass back: the line returns and the panel goes dark behind it.',
                verdict: rec(
                    'it is the anchor on a panel: what opens is laid by the line from the thing that opened it, and the close is the line taking it off; no fade, no flash, no rise.',
                ),
            },
            {
                key: 'develop',
                name: 'Developed (today)',
                see: 'The register’s dialog: a film flash over the panel that fades out while the panel scales from 1.02 to 1, 420 ms; the menu fades in; the toast rises 6 px; the tooltip opens from a slit.',
                verdict: not('a darkroom develop is a flash fading; nothing in it is a line crossing, and the register has four different openings.'),
            },
            {
                key: 'scanned',
                name: 'Scanned open by a lit band (the pick)',
                see: 'The header’s pick: a lit band sweeps down over the menu’s footprint and reveals it, and back up to close; the dialog the same.',
                verdict: not(
                    'close to the pass, but the band is a lamp’s light, white and wide; the anchor’s line is a slice of the film, thin, with the turn behind it.',
                ),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long do a contact, a pass, the turn’s settle, a group and a loop take?',
        why: 'Every option shows the same picture (the line laying a dialog, a group crossed, the busy bar running); only the times differ, printed under each part.',
        kind: 'cycle',
        scene: 'durations',
        options: [
            {
                key: 'pass',
                name: 'One pass: 220 · 660 (+220, +60) · 2400 ms',
                see: 'A press answers in 220 ms; the line crosses a part in 660 ms (the anchor’s six units); the turn settles 220 ms after the line stops; a group is lit 60 ms apart along the line; a loop (the busy bar, the spinner, loading) runs 2.4 s.',
                verdict: rec(
                    'it is the anchor’s own clock (the sweep in six units of 110 ms, the settle in two), quick enough for a menu and slow enough for the turn to be seen.',
                ),
            },
            {
                key: 'brisk',
                name: 'Brisk: 150 · 440 (+150, +40) · 1600 ms',
                see: 'A press in 150 ms, the pass in 440 ms, the settle 150 ms after, a group 40 ms apart, the loop 1.6 s.',
                verdict: not('at 440 ms the turn is not seen; the film flips instead of turning.'),
            },
            {
                key: 'unhurried',
                name: 'Unhurried: 300 · 990 (+330, +90) · 3600 ms',
                see: 'A press in 300 ms, the pass in 990 ms, the settle 330 ms after, a group 90 ms apart, the loop 3.6 s.',
                verdict: not('a menu that takes a second to be laid is slow to use; the instrument should answer, not perform.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What may carry the film, and what else may be a colour?',
        why: 'The same panel, buttons, a key figure, a meter, a switch, a status word and a failed export in every option; only the colour rule differs.',
        kind: 'still',
        scene: 'colour',
        options: [
            {
                key: 'film',
                name: 'The film and meaning',
                see: 'The film (cyan, violet, magenta, lime) is every edge that matters, the line, the fill, the head and the ring; ink is near-white; an act is a light plate, not a hue; danger is coral and nothing else is a colour. The line is a 2 px slice of the film with the one glow the theme allows (10 px of cyan at 40 %).',
                verdict: rec(
                    'colour that means something (the film says “live”, coral says “wrong”) and nothing that is merely coloured; the anatomy’s rule, and the thing that keeps dark from being cyberpunk or synthwave, which colour everything.',
                ),
            },
            {
                key: 'console',
                name: 'The lit console (the picks)',
                see: 'The picks’ palette on top of the film: a green scope trace behind the key figure, a red alarm lamp on a warning, lit square chips on the header, a status lamp before the state word.',
                verdict: not(
                    'lamps and traces are a second colour language next to the film; a reader cannot tell a lamp’s red from coral’s meaning.',
                ),
            },
            {
                key: 'ink',
                name: 'Ink only',
                see: 'No film: every edge is a grey hairline, the line is white, the act plate is white; coral for danger.',
                verdict: not('without the film dark is a grey instrument; the film is the one thing the theme owns.'),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'How are the corners cut?',
        why: 'The same panel, menu, key figure, button, tag, chip, tooltip and bar head in every option; only the corners differ.',
        kind: 'still',
        scene: 'corners',
        options: [
            {
                key: 'two',
                name: 'Chamfered on two opposite corners',
                see: 'Radius 0; controls cut 0.55 rem on the top-left and bottom-right corners, panels 1 rem; brackets close on a label. As the register has it.',
                verdict: rec(
                    'two opposite chamfers are a machined part seen from one side, the register’s own cut; four would be nostromo’s panel, none would be brutalism.',
                ),
            },
            {
                key: 'four',
                name: 'Chamfered on all four corners',
                see: 'Every corner cut, the same size, on plates and small parts alike.',
                verdict: not('four chamfers are nostromo’s and cyberpunk’s; dark cuts two.'),
            },
            {
                key: 'square',
                name: 'Square',
                see: 'Radius 0 and no cut anywhere.',
                verdict: not('a square panel on black with a film edge is a terminal; the chamfer is what says instrument.'),
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
                key: 'instrument',
                name: 'Near-black, the grid, the film on the edge',
                see: 'The ground carries the instrument grid (hairlines at 4.5 %) and the pointer’s pool of light; a panel is one shade lighter with the film along its edge where it matters and the four-colour halo behind a lit panel; no texture, no grey shadow, no scanline, no board.',
                verdict: rec(
                    'quiet so the film can be seen: the one rule the anatomy wrote; every other surface in the set has a ground of its own colour.',
                ),
            },
            {
                key: 'board',
                name: 'The status board (the picks)',
                see: 'The header’s and the key figure’s picks: a black-ops panel with a fine grid behind the text, the title in the ticker mono, lit square chips, a scope trace behind the figure.',
                verdict: not('a status board is a console, terminal’s and nostromo’s world; it buries the film under hardware.'),
            },
            {
                key: 'halo',
                name: 'The halo on everything',
                see: 'Every panel carries the four-colour halo and the film on all its edges.',
                verdict: not('a halo on every panel is a glow on every panel, and the film everywhere is the film nowhere.'),
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
                key: 'coral',
                name: 'The film gone coral',
                see: 'The warning part’s film edge takes the tone’s colour along its whole length (coral for a failure, the warning colour for a warning) and its change is set in that ink; the plate stays near-black. A destructive menu entry has a coral edge at its start and coral ink.',
                verdict: rec(
                    'the warning is told by the one coloured thing the part already has (its film) changing colour; nothing is added and the instrument stays dark.',
                ),
            },
            {
                key: 'lamp',
                name: 'The alarm lamp (the picks)',
                see: 'A red lamp lights the number on the tone’s plate; the state word’s console line lights red; a tile’s chip lights.',
                verdict: not('a lamp is hardware from another dialect; it says “console”, not “film”.'),
            },
            {
                key: 'tinted',
                name: 'The tinted plate',
                see: 'The whole plate takes a deep tint of the tone with the tone’s luminous ink; the film edge stays.',
                verdict: not('a tinted plate is every default theme’s warning; the film does not take part.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens when a figure changes?',
        why: 'A key figure, a state word, a trend line, a strip column and a tile change in every option, 660 ms each; the value changes on the way in and again on the way out.',
        kind: 'cycle',
        scene: 'live',
        options: [
            {
                key: 'pass',
                name: 'One pass over the figure',
                see: 'The line crosses the changed figure once from its start, the figure takes the film through its letters as the line passes and settles back to ink; the figure never moves. The trend line is re-laid by the line from its start; the tile’s edge is re-laid.',
                verdict: rec(
                    'it is the anchor on a figure (re-laid, so the eye knows it is new) and nothing moves, flares or jolts; nostromo refreshes a readout, cyberpunk glitches, dark passes a line.',
                ),
            },
            {
                key: 'flare',
                name: 'The trace flares (the picks)',
                see: 'The key figure’s pick: the number’s glow flares for a third of a second; the tile’s mark jolts like a needle; the lamp flares.',
                verdict: not('a flare is a glow, and a jolt is a needle; both are the console, and neither is the line.'),
            },
            {
                key: 'none',
                name: 'Nothing (today)',
                see: 'The register declares no update: the figure changes and nothing marks it.',
                verdict: not('a reader who missed the change has no way to find it.'),
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
                key: 'sweep',
                name: 'The line sweeps the slot',
                see: 'On every waiting surface the line crosses from start to end and the film it lays turns behind it, then dims as the line leaves at the end; again from the start, 2.4 s a loop. The skeleton’s lines are the slots the line sweeps; the chart’s plot is swept whole.',
                verdict: rec(
                    'the anchor on a loop: a slot swept by light that never lands, which is what waiting is; it fills the whole part, it is slow, and it is the same line as everywhere else.',
                ),
            },
            {
                key: 'ticker',
                name: 'The ticker baseline (the picks)',
                see: 'A dashed baseline under the waiting part ticks along, as a ticker tape would.',
                verdict: not('a ticker is the console dialect, and a dashed line drifting is the loading of a stock board, not an instrument.'),
            },
            {
                key: 'ghosts',
                name: 'The ghosts drift (today)',
                see: 'The register’s skeleton: a cyan ghost and a magenta ghost of each line drift 8 px apart and back.',
                verdict: not('a misregistration is cyberpunk’s glitch in dark’s colours; Kenny rejected it there for that reason.'),
            },
        ],
    },
    {
        id: 'busybar',
        label: 'The busy progress bar',
        rule: 'G11',
        question: 'What does the progress bar do while no share is known?',
        why: 'Round one’s bar stays exactly: the chamfered ticked track, the film fill whose colour turns as it fills, the `]` head. Every option is shown at three sizes busy, in a busy button, and beside a bar with a share (62 %), which is the same in every option.',
        kind: 'loop',
        scene: 'busybar',
        options: [
            {
                key: 'runs',
                name: 'The line runs the track',
                see: 'Busy: the line runs the empty track from start to end laying a short stretch of film behind it that turns and dims, 2.4 s, and again; with a share known, the fill is laid to the share with the line at its head.',
                verdict: rec(
                    'the bar you loved with the line as its head, and busy is the line looking for the end: one line, one track, one picture for both states.',
                ),
            },
            {
                key: 'hatch',
                name: 'The hatch (today)',
                see: 'The register’s busy bar: a static diagonal hatch in the film’s colours that does not move.',
                verdict: not('a hatch that stands still does not say busy; and it is the one still loader in the set.'),
            },
            {
                key: 'breathe',
                name: 'The fill breathes',
                see: 'The film fill is laid whole and its brightness breathes slowly, up and down.',
                verdict: not('a breathing bar is light’s exposure and titanium’s drift; the line is dark’s.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G12',
        question: 'What does the spinner draw?',
        why: 'Three sizes, a busy button and a busy panel in every option; every option loops at 2.4 s.',
        kind: 'loop',
        scene: 'spinner',
        options: [
            {
                key: 'runs',
                name: 'The line runs the ring',
                see: 'The register’s ring in film colours, and the line runs round it once per loop laying the film behind it, which turns and dims by the time the line comes round; the ring itself never rotates.',
                verdict: rec(
                    'the anchor bent into a ring: the line passing and the film settling behind it, the same at 1 rem and at 3 rem; a plain rotation is every theme’s spinner.',
                ),
            },
            {
                key: 'turns',
                name: 'The ring turns (today)',
                see: 'The register’s spinner: a ring in film colours rotating linear, 1.2 s a turn.',
                verdict: not('a rotating ring is the default spinner of the web with the film as its paint.'),
            },
            {
                key: 'brackets',
                name: 'The brackets turn',
                see: 'A pair of brackets `[ ]` turns round a centre, the film laid on their inner edge.',
                verdict: not('turning brackets read as a target reticle, blueprint’s and the graph’s device.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G13',
        question: 'How does a part arrive, and how does it leave?',
        why: 'An alert, a card and a key figure arrive and leave in every option, 660 ms each way; the leave is the arrival backwards.',
        kind: 'cycle',
        scene: 'leave',
        options: [
            {
                key: 'pass',
                name: 'The pass lays, the pass back takes off',
                see: 'Arriving: the line crosses from the part’s start and the part is laid behind it, the film edge turning, settling cyan at the top. Leaving: the line crosses back from the end and the part goes dark behind it, the film taken with it.',
                verdict: rec('the anchor exactly, both ways; one gesture for arriving, opening and leaving, and nothing ends in black.'),
            },
            {
                key: 'black',
                name: 'To black (today)',
                see: 'The register’s leave: brightness to 0 and scale to 0.98 in 460 ms, ease-in; arriving is the same backwards.',
                verdict: not('a fade to black is a switch-off; the line never takes part.'),
            },
            {
                key: 'powered',
                name: 'Powered up and down (the picks)',
                see: 'The menu button’s pick: the part strikes on like a tube (dark, flash, dark, on) in hard steps; it strikes off the same way.',
                verdict: not('a tube’s strike is hardware and hard steps; the instrument has one light, the line.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G14',
        question: 'Is a button inside a header, a menu, a tile or a drawer dark’s own button?',
        why: 'Dark’s own button stands alone for reference; then the same button inside a page header, a menu, a tile, a drawer and a key figure. Use the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: 'composites',
        options: [
            {
                key: 'own',
                name: 'Exactly dark’s own',
                see: 'Every button, link and entry inside a composite is dark’s bracketed button as it stands alone (the brackets, the film edge from the start, the chamfer); it hovers, focuses and presses exactly the same wherever it stands.',
                verdict: rec('one manner for every control, wherever it stands; the instrument has one kind of key.'),
            },
            {
                key: 'lit',
                name: 'Dark’s own on a lit panel',
                see: 'The same manners, and the header’s actions and the drawer’s buttons stand on a panel with the film along all its edges and the halo behind it.',
                verdict: not('a lit panel round the buttons is a glow round the buttons; it adds light for no act.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The header’s pick lights the rim and adds a square glow ring, the tiles’ Open lights, the drawer’s buttons take a glow ring: three hovers on one page.',
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
                key: 'rests',
                name: 'The line rests at the start',
                see: 'The line stands at the control’s start edge (a 2 px slice of film with its glow) and the brackets close one step; a menu entry takes the line at its start; a link’s underline takes the film; a tile’s Open takes the line. Leaving, the line goes.',
                verdict: rec(
                    'the anchor at rest: the line waiting at the start of the thing it would lay; it is the register’s own film edge, and nothing lights or lifts.',
                ),
            },
            {
                key: 'lights',
                name: 'The panel lights (the picks)',
                see: 'The key figure’s and the tiles’ pick: the panel’s bevel lip brightens, the rim lights, Open lights.',
                verdict: not('a panel that lights is a lamp; and it moves the whole plate for a pointer.'),
            },
            {
                key: 'brackets',
                name: 'The brackets close',
                see: 'Only the brackets close on the label, one step; no line.',
                verdict: not('the brackets closing is the press’s mark; on hover it leaves nothing for the press.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G16',
        question: 'What marks the control the keyboard is on?',
        why: 'A button, a header action, a key figure as a link, a menu entry, a calendar day and a tile’s link, each focused. DI2 fixes the two-channel ring for every theme; the question is only what dark adds. Use State: Focus.',
        kind: 'still',
        scene: 'focus',
        options: [
            {
                key: 'di2',
                name: 'The two-channel ring',
                see: 'DI2’s ring exactly: the ink ring outside, the ring colour (cyan) inside, on every control, chamfered with it; nothing added.',
                verdict: rec('a system constant; adding a glow to it would make the keyboard’s mark the one thing that glows.'),
            },
            {
                key: 'glow',
                name: 'A square glow ring (the picks)',
                see: 'The header’s pick: a square glow ring in the film’s cyan round the focused control instead of the two channels.',
                verdict: not('a glow ring is one channel of light; DI2 was written for the contrast it lacks.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The register’s ring plus the picks’ glow rings and dashed outlines where a pick drew them.',
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
                key: 'quarter',
                name: 'A pass, the edge turns a quarter',
                see: 'On contact the line crosses the face (220 ms) and the film edge turns a quarter and settles; the brackets close; the face takes the pressed ground. Release turns the edge back. Nothing moves.',
                verdict: rec(
                    'the anchor as a press: the line passes and the film answers by turning; a quarter is seen and is over before the hand lifts.',
                ),
            },
            {
                key: 'dims',
                name: 'The plate dims (today)',
                see: 'The face takes the pressed ground; no line, no turn.',
                verdict: not('the default press of the set; nothing of the film is in it.'),
            },
            {
                key: 'snap',
                name: 'The brackets snap shut',
                see: 'The brackets close onto the label in one step and the face dims; no line.',
                verdict: not('a snap is a hard step, the console’s gait; the brackets closing is the hover’s mark here.'),
            },
        ],
    },
    {
        id: 'type',
        label: 'The voice',
        rule: 'G18',
        question: 'In which face are the titles, the figures, the readings and the prose set?',
        why: 'A tile with its title, a figure, a reading with its brackets, a timestamp and a line of prose in every option.',
        kind: 'still',
        scene: 'type',
        options: [
            {
                key: 'archivo',
                name: 'Archivo, the ticker mono for readings',
                see: 'Headings Archivo 700, buttons 600, prose 400; readouts, brackets, microlabels, timestamps and identifiers in the ticker mono. As the register has it.',
                verdict: rec(
                    'one face for words and one for readings, the instrument’s own split; the picks’ titles in the ticker mono make every title a readout.',
                ),
            },
            {
                key: 'ticker',
                name: 'The ticker mono for titles too (the picks)',
                see: 'The header’s and the key figure’s pick: titles and captions in the ticker mono, uppercase, letter-spaced.',
                verdict: not('mono titles are terminal’s voice; dark speaks in Archivo and reads in mono.'),
            },
            {
                key: 'everywhere',
                name: 'Archivo everywhere',
                see: 'No mono: readings and timestamps in Archivo 600 with tabular numerals.',
                verdict: not('a reading without the ticker mono loses the brackets’ register; the readout is the instrument’s voice.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G19',
        question: 'Which marks may dark draw, and where?',
        why: 'A panel with its title, a meter with its mark, a chart’s events, a button and a list, an empty state and a divider in every option; only the marks differ.',
        kind: 'still',
        scene: 'motifs',
        options: [
            {
                key: 'film',
                name: 'The film, the line, the chamfer, the brackets, the grid',
                see: 'The film on an edge that matters, the line where something happens, the chamfer on two corners, the brackets on a label, the instrument grid on the ground; nothing else is drawn. No lamps, tubes, ticker tapes, scope traces, status boards, misregistration ghosts or darkroom flashes.',
                verdict: rec(
                    'five marks that are one instrument; everything else in the picks is a console from another theme, and the register’s ghosts are cyberpunk’s.',
                ),
            },
            {
                key: 'console',
                name: 'Plus the lamps and the scope (the picks)',
                see: 'The same five, and the picks’ status lamps, tube switch-ons, ticker baselines and the oscilloscope trace behind the key figure.',
                verdict: not('two dialects on one page; the lamp and the film both say “live” in different words.'),
            },
            {
                key: 'all',
                name: 'As today (everything)',
                see: 'Every mark the register and the picks carry: the film, the ghosts, the develop flash, the lamps, the scope, the boards, the glow rings.',
                verdict: not('an instrument with every gauge of every era bolted on.'),
            },
        ],
    },
];
