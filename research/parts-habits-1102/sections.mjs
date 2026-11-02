// research/parts-habits-1102: the five sections of the review page, each written once: what is asked, the heading and one sentence,
// what to expect, what to look at, the controls and the component's slot. demo.js and demo-more.js fill the slots with the Habits
// app's own shapes and words. Round 2 shows only the two Kenny sent back on 2026-11-02 01:12 (the day timeline and the swatch
// picker); the three he approved (swipe-row, chord-keys, settled-row) leave the page.

/** The twelve themes in the picker's order, for the swatch picker's row per theme. */
const THEME_ORDER = ['formal', 'dark', 'cyberpunk', 'synthwave', 'pastel', 'forest', 'blueprint', 'solstice', 'brutalism', 'deco', 'nostromo', 'titanium'];
/** The twelve colour names, in kp's order. */
const CAT_NAMES = ['Red', 'Orange', 'Amber', 'Lime', 'Green', 'Teal', 'Cyan', 'Blue', 'Indigo', 'Violet', 'Pink', 'Slate'];
/** One theme's twelve categorical colours on its own ground: the wrapper carries the theme, so the tokens are that theme's. */
const themeRow = (theme) => `<li class="pg-catrow" data-theme="${theme}"><p class="pg-catrow__name">${theme[0].toUpperCase()}${theme.slice(1)}</p><ul class="pg-catrow__cells" aria-label="The twelve colours of ${theme}">${CAT_NAMES.map(
    (name, i) => `<li class="pg-catrow__cell" data-kp-cat="${i + 1}"><span class="kp-cat-dot pg-catrow__dot" aria-hidden="true"></span><span class="pg-catrow__label">${name}</span></li>`,
).join('')}</ul></li>`;

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
export const group = (label, name, buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

/** The stage's width: the whole column, or a phone's 390 px. */
const width = (target) => group('Width', 'width', [['full', 'Full width', true], ['phone', 'Phone, 390 px']], target);
/** A line under a component that says what the page heard, two lines high whether it says something or not. */
const log = (id) => `<p class="pg-log" id="${id}" role="status" aria-live="polite"></p>`;

const ALL_SECTIONS = [
    {
        id: 'dayline',
        title: 'Day timeline: Today from top to bottom',
        topic: 'dayline',
        topicTitle: 'The day timeline',
        item: 'habits gap: vertical day timeline, with read-only events',
        asked: 'The package had the run timeline and the sequencer (both sideways) but no day running down the page, so Habits drew Today&rsquo;s timeline itself. <code>.kp-dayline[data-kp-dayline]</code> with <code>data-kp-start-hour</code> and <code>data-kp-step</code> draws <code>setDaylineItems(el, items, { allDay })</code>: blocks as long as their estimate, overlapping items side by side in lanes, a now line, moves in steps of the step by pointer and keyboard (<code>kp-dayline-change</code>), read-only calendar events dashed without a handle, an all-day strip, and a task dropped from the list beside it onto an hour (<code>kp-dayline-drop</code>).',
        h2: 'Today, Monday 2 November',
        intro: 'The day from 06:00 with the tasks that have a time, the calendar&rsquo;s events among them, and beside it the tasks without a time.',
        expected: [
            '<b>Round 2</b>: you asked whether the blocks themselves could be dragged. They can now, in the package: press a block anywhere on its body and drag it up or down (a press without moving still opens it, the line says <code>kp-dayline-open</code>); on a touch screen hold the block still for half a second, it lifts with a ring, then drag (a quick swipe still scrolls the day and the page). The tasks without a time are picked up the same way, by mouse, pen or finger: a copy follows the pointer and the dashed &ldquo;Starts 15:00&rdquo; band shows where it lands. Held near the top or bottom of the box, the hours scroll under it.',
            '<b>Ready</b>: the box opens at about 08:00, the now line at 10:40 a quarter down with &ldquo;Now 10:40&rdquo; on the hours. &ldquo;Write the quarterly report&rdquo; (09:00, 90 min, amber edge) and the dashed &ldquo;Dentist&rdquo; (10:00, no handle) stand side by side where they overlap; &ldquo;Morning pages&rdquo; is struck through. The strip above says &ldquo;All day&rdquo; with two dashed plates. Drag a block by its body or its ⠿ handle: it steps in quarter hours, its time follows, and on release the line under the day says <code>kp-dayline-change</code>; ↑ ↓ on a handle do the same (Shift: an hour), Escape during a drag puts it back. The dashed events never move.',
            'Drag &ldquo;Pay the energy bill&rdquo; from the list (its title or its free space; its check box stays a check box) onto 15:00: a dashed band says &ldquo;Starts 15:00&rdquo;; let go and it becomes a 30-minute block there and leaves the list; let go outside the day and nothing happens. <b>Loading</b>: the busy card over the hours. <b>Empty</b> and <b>Failed</b>: the package&rsquo;s plate over the whole box (Failed with Try again). <b>Phone</b>: the list goes under the day.',
        ],
        look: 'Formal: the blocks are the card stock with a coloured edge, the events the muted plate with a dashed rule, the now line navy; a block in hand wears formal&rsquo;s ring, the carried copy the card with the ring and formal&rsquo;s offset shadow. Check that dragging a block or a task feels direct, that a plain press still opens, and that nothing scrolls the page sideways.',
        controls: group('State', 'state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']], 'pg-day') + width('dayline-component'),
        component: `<div class="pg-plan">
                <section class="kp-card pg-plan__day" aria-labelledby="pg-day-h"><h3 class="pg-card-title" id="pg-day-h">Timeline</h3><section class="kp-dayline" id="pg-day" data-kp-dayline data-kp-start-hour="6" data-kp-step="15" data-kp-dayline-now="10:40" aria-label="Today, Monday 2 November"></section></section>
                <section class="kp-card pg-plan__side" aria-labelledby="pg-untimed-h"><h3 class="pg-card-title" id="pg-untimed-h">Without a time <span class="kp-badge" id="pg-untimed-count">3</span></h3><p class="pg-card-lede">Drag a task onto an hour to plan it there.</p><ul class="kp-task-list" id="pg-untimed" aria-labelledby="pg-untimed-h"></ul></section>
            </div>${log('pg-day-log')}`,
    },
    {
        id: 'swipe-row',
        title: 'Swipe row: Done to the right, Tomorrow to the left',
        topic: 'swipe',
        topicTitle: 'The swipe row',
        item: 'habits gap: swipe actions on a list row',
        asked: 'On a phone Habits swiped a task row right for done and left for tomorrow with its own code. <code>data-kp-swipe</code> on a list with <code>data-kp-swipe-start="done:Done:success"</code> and <code>data-kp-swipe-end="tomorrow:Tomorrow:info"</code> does it: touch only, locked after 12 px sideways so a vertical move still scrolls, a threshold, the plate in the tone&rsquo;s colour with its word, a tick on a phone, <code>kp-swipe { key, action }</code>, and the slide home in the theme&rsquo;s motion. The ⋯ menu carries the same two actions, so nothing needs a swipe.',
        h2: 'Today',
        intro: 'Four tasks of the Today page. A mouse swipes here only because this page sets <code>data-kp-swipe-pointers="any"</code>; in the app only a finger does.',
        expected: [
            '<b>Any pointer</b>: press a row&rsquo;s title and drag right: the row&rsquo;s parts follow and the room they leave is green with &ldquo;Done&rdquo;; past about a third of the row the word turns bold and the green plate gets an edge. Let go there: the row slides home and settles as &ldquo;Done&rdquo; (the line says <code>kp-swipe c1 done</code>). Drag left: the blue plate with &ldquo;Tomorrow&rdquo;. Let go early: it slides home and nothing happens. The check box, the ⋯ button and the handle never start a swipe.',
            '<b>Touch only</b> (the default): a mouse does nothing; the ⋯ menu&rsquo;s Done and Tomorrow do the same. <b>One swiped already</b> shows the first row after a swipe to the right (settled as Done); <b>Rows back</b> puts the four rows back. <b>Phone</b>: the same rows at 390 px.',
        ],
        look: 'Formal: the plate is the success or info plate with its own ink, the slide home formal&rsquo;s eased glide. Check that the word is never cut, never shows through the moving row, and that the row&rsquo;s frame does not move.',
        controls: group('Pointers', 'pointers', [['any', 'Any pointer (this page)', true], ['touch', 'Touch only (default)']], 'pg-swipe') + group('Rows', 'swipe-rows', [['swiped', 'One swiped already'], ['reset', 'Rows back']], 'pg-swipe') + width('swipe-row-component'),
        component: `<ul class="kp-task-list" id="pg-swipe" data-kp-swipe data-kp-swipe-pointers="any" data-kp-swipe-start="done:Done:success" data-kp-swipe-end="tomorrow:Tomorrow:info" aria-label="Today"></ul>${log('pg-swipe-log')}`,
    },
    {
        id: 'chord-keys',
        title: 'Chord keys: O then T in a key line',
        topic: 'keys',
        topicTitle: 'The key line',
        item: 'habits gap: chord keys in a key strip',
        asked: 'Today&rsquo;s overdue banner registers the chord O then T, but <code>setKeys</code> could only draw keys pressed together, so the app wrote one cap &ldquo;O T&rdquo;. <code>setKeys</code> now takes <code>[["O", "T"], what, { chord: true }]</code> and draws the caps with the dictionary&rsquo;s &ldquo;then&rdquo; between them (<code>keysThen</code>), the way the shortcut sheet shows <code>g t</code>.',
        h2: 'Overdue',
        intro: 'The banner over Today when tasks are past their day, with the keys that act on them.',
        expected: [
            'The banner&rsquo;s key line reads: <kbd>O</kbd> <i>then</i> <kbd>T</kbd> &ldquo;move them to today&rdquo;, <kbd>O</kbd> <i>then</i> <kbd>L</kbd> &ldquo;open the list&rdquo;, and <kbd>Ctrl</kbd><kbd>Z</kbd> &ldquo;undo&rdquo; pressed together for comparison: the chord&rsquo;s caps stand a little apart with a small italic &ldquo;then&rdquo;, the pair pressed together touch.',
            'Press O then T on the page: the line under the banner says the chord was heard. <b>Phone</b>: the items wrap; a chord never breaks between its caps.',
        ],
        look: 'Formal: the caps are the package&rsquo;s key caps on the warning alert. Check that &ldquo;O then T&rdquo; can never be read as O and T together.',
        controls: width('chord-keys-component'),
        component: `<div class="kp-alert kp-alert--warning pg-overdue" role="region" aria-labelledby="pg-overdue-h">
                <p class="kp-alert__title" id="pg-overdue-h">3 tasks are overdue</p>
                <p class="pg-overdue__text">Call the plumber, Renew the passport and Buy oat milk were planned for earlier days.</p>
                <div class="pg-overdue__keys" id="pg-keys"></div>
            </div>${log('pg-keys-log')}`,
    },
    {
        id: 'settled-row',
        title: 'Settled row: a task that left keeps its place',
        topic: 'settled',
        topicTitle: 'The settled row',
        item: 'habits gap: a settled (left) list row',
        asked: 'When a task left a list while it was open (ticked off, deleted, moved), Habits kept the row in place so nothing slid under the pointer, with its own CSS. <code>data-kp-settled="Deleted"</code> on a reorder, checklist or task list row does it: the row keeps its place and height, quiet and inert, and says where the item went, until the list is left (<code>clearSettled(list)</code>).',
        h2: 'Inbox',
        intro: 'Five Inbox tasks; &ldquo;Buy oat milk&rdquo; was deleted a moment ago.',
        expected: [
            '&ldquo;Buy oat milk&rdquo; stands where it was at its own height: dashed frame, its parts faded, the title struck through, and &ldquo;Deleted&rdquo; at its end on the muted plate; it answers no press, no key and no drag. Tick another task, or pick Delete or Move to in its ⋯ menu: it settles the same way with &ldquo;Done&rdquo;, &ldquo;Deleted&rdquo; or &ldquo;Moved to Work&rdquo;, and nothing under it moves.',
            '<b>Leave the list</b>: the settled rows go and the rest close up, as on a fresh visit. <b>Rows back</b>: the five rows again. <b>Phone</b>: the word wraps, never cut.',
        ],
        look: 'Formal: the dashed rule and the muted plate of formal&rsquo;s quiet states. Check that a settled row reads as finished at a glance and never as a row to press.',
        controls: group('The list', 'settled', [['leave', 'Leave the list'], ['reset', 'Rows back']], 'pg-inbox') + width('settled-row-component'),
        component: `<ul class="kp-task-list" id="pg-inbox" data-kp-reorder aria-label="Inbox"></ul>${log('pg-inbox-log')}`,
    },
    {
        id: 'swatch-picker',
        title: 'Swatch picker: a project&rsquo;s colour, one of twelve',
        topic: 'swatches',
        topicTitle: 'The swatch picker',
        item: 'habits gap: a colour swatch picker',
        asked: 'A project or a tag takes one of twelve colours, and the package had no swatch picker, so Habits drew twelve icon buttons in a popover. <code>.kp-swatches[data-kp-swatches]</code> with <code>setSwatches(el, [{ value, label, colour }], current)</code> draws the theme&rsquo;s twelve categorical colours (<code>--kp-cat-1..12</code>) as a grid: arrow keys, <code>aria-pressed</code> and a ✓ on the current one, 44 px under a coarse pointer, <code>kp-swatch-change { value }</code>.',
        h2: 'Edit the project',
        intro: 'The project&rsquo;s name and its colour, with the project&rsquo;s dot and tag as a task row will show them.',
        expected: [
            '<b>Round 2</b>: the colours were already the active theme&rsquo;s (each swatch paints <code>var(--kp-cat-N)</code>, so a theme switch repaints it at once); they were too close. Measured in OKLab (×100), the closest pair per theme went from 7.2 to 11.5 to between 12.0 and 13.1, every pair in every theme now at least 12 apart: each colour kept its hue family and its theme&rsquo;s chroma, and moved in lightness and a little in hue. The rows under the editor show each theme&rsquo;s twelve on its own ground.',
            'Twelve round swatches in two rows of six, Blue pressed with a ✓ and a ring, &ldquo;Blue&rdquo; under the grid. Press Teal: the ✓ moves, the name says Teal, the project&rsquo;s dot and its tag below turn teal and the line says <code>kp-swatch-change teal</code>. Tab into the grid: one stop; ← → walk a row, ↑ ↓ change rows, Enter picks.',
            '<b>Name off</b>: the line under the grid goes; the swatches keep their names for a screen reader and as a tooltip. <b>Phone</b>: the same two rows of six; the theme rows wrap to two rows of six.',
            '<b>Every theme</b>: twelve rows, formal to titanium, each on its own ground with its twelve colours and their names. No two in a row should look alike. Nostromo&rsquo;s amber, green and cyan read about 3.5:1 on its pale ground, below AA for text: the price of twelve that stay apart there.',
        ],
        look: 'Formal: formal&rsquo;s own twelve inks, the ring in the page&rsquo;s ink. Check that the current swatch is plain at a glance, and that in every theme row each of the twelve can be told from the others at a glance.',
        controls: group('Name under the grid', 'swatch-name', [['on', 'On (default)', true], ['off', 'Off']], 'pg-swatches') + width('swatch-picker-component'),
        component: `<div class="kp-card pg-project">
                <div class="kp-formgrid">
                    <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="pg-project-name">Name</label><div class="kp-formgrid__control"><input class="kp-field__input" id="pg-project-name" value="Work" /></div></div>
                    <div class="kp-formgrid__row"><span class="kp-formgrid__label" id="pg-swatches-l">Colour</span><div class="kp-formgrid__control"><div class="kp-swatches" id="pg-swatches" data-kp-swatches aria-labelledby="pg-swatches-l"></div></div></div>
                    <div class="kp-formgrid__row"><span class="kp-formgrid__label" id="pg-preview-l">Looks like</span><div class="kp-formgrid__control"><p class="pg-preview" id="pg-preview" aria-labelledby="pg-preview-l"></p></div></div>
                </div>
            </div>${log('pg-swatches-log')}
            <section class="pg-catrows" aria-labelledby="pg-catrows-h"><h3 class="pg-card-title" id="pg-catrows-h">The twelve colours in every theme</h3><ul class="pg-catrows__list">${THEME_ORDER.map(themeRow).join('')}</ul></section>`,
    },
];

/** Round 2: only the sections Kenny did not approve in round 1 (research/parts-habits-1102/VERDICTS.json). */
const ROUND_2 = new Set(['dayline', 'swatch-picker']);
export const SECTIONS = ALL_SECTIONS.filter((section) => ROUND_2.has(section.id));
