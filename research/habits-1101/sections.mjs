// research/habits-1101: the six sections of the review page, each written once: what is asked, the heading and one sentence, what to
// expect, what to look at, the controls and the component's slot. demo.js fills the slots with the Habits app's own shapes and words.

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
/** The data states a section's component takes. */
const states = (target) => group('State', 'state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']], target);
/** A line under a component that says what the page heard, one line high whether it says something or not. */
const log = (id) => `<p class="pg-log" id="${id}" role="status" aria-live="polite"></p>`;

const DAYS = [
    ['2026-11-02', 'Monday 2 November'],
    ['2026-11-03', 'Tuesday 3 November'],
    ['2026-11-04', 'Wednesday 4 November'],
];

export const SECTIONS = [
    {
        id: 'reorder-group',
        title: 'Drag between lists: a task to another day',
        topic: 'reorder',
        topicTitle: 'The reorder list',
        item: 'habits gap: drag between lists',
        asked: 'A reorder list moved items only within itself, so the Planner sent a task to another day through its ⋯ menu. <code>data-kp-reorder-group="planner"</code> on the three days lets a task go from one day to another: drag it by its handle over the other day, or press ← / → on the handle. The move is said with the day’s name, and <code>kp-reorder</code> adds <code>fromList</code> and <code>toList</code> (the days’ dates). Without a group (the default) a list keeps its items as approved.',
        h2: 'This week in the Planner',
        intro: 'Three days of the Planner, each a list of task rows keyed by its date.',
        expected: [
            '<b>Shared</b>: drag “Call the plumber about the leak” by its handle onto Tuesday: it goes in where the pointer is, Monday counts one fewer, and the line under the days says <code>fromList 2026-11-02 → toList 2026-11-03</code> with its place. With the keyboard: Tab to a handle, ← / → to the day before or after (the focus stays on the handle), ↑ / ↓ within the day; past Wednesday it says there is no list further.',
            '<b>Each list its own (as approved)</b>: a task cannot leave its day; ↑ / ↓ still reorder it.',
            '<b>Phone</b>: the days stand under each other; a task dragged down onto the next day goes into it.',
        ],
        look: 'Formal: the task rows on the page’s paper, the dragged row dashed in navy. Check that a task lands where the pointer is, never in a gap between days, and that nothing jumps under the pointer.',
        controls: group('Group', 'group', [['shared', 'Shared', true], ['own', 'Each list its own (default)']], 'pg-days') + width('reorder-group-component'),
        component: `<div class="pg-days" id="pg-days">${DAYS.map(
            ([key, name]) =>
                `<section class="pg-day" aria-labelledby="pg-day-${key}"><h3 class="pg-day__name" id="pg-day-${key}">${name}</h3><ul class="kp-task-list pg-day__list" data-kp-reorder data-kp-reorder-group="planner" data-kp-reorder-list="${key}" aria-labelledby="pg-day-${key}" data-pg-day="${key}"></ul></section>`,
        ).join('')}</div>${log('pg-days-log')}`,
    },
    {
        id: 'board',
        title: 'Board: cards that move between lanes',
        topic: 'board',
        topicTitle: 'The board',
        item: 'habits gap: kanban board',
        asked: 'The pipeline is read-only, so the Boards page moved cards with a “Move to …” menu. <code>data-kp-board</code> is the editable board: the pipeline’s lanes, the app’s task rows as cards, moved by drag or ← / →; <code>data-kp-board-limit</code> a lane’s limit; narrow, the lanes scroll in the board’s box (<code>scroll</code>, default) or turn to <code>tabs</code>.',
        h2: 'Weekly review',
        intro: 'Three tags as lanes, as the Boards page has them: To do, Doing (at most 3), Waiting.',
        expected: [
            '<b>Ready</b>: three lanes side by side at one width, as tall as the tallest; Doing reads “3 / 3”. Drag a card from To do into Doing: Doing reads “4 / 3”, turns to its failing look with “Over the limit” under its name, and nothing is refused. Waiting, once empty, says “Nothing here yet. Drag a card here.” in a dashed place and still takes a card.',
            '<b>Limit off</b>: Doing shows its plain count. <b>Loading</b>: the busy card over the lanes. <b>Empty</b> and <b>Failed</b>: the package’s plate over the whole board at its height (Failed with Try again).',
            '<b>Phone, Scroll</b>: each lane 85% of the box, snapping, the next lane peeking; the page itself never scrolls sideways. <b>Phone, Tabs</b>: one lane under the tabs To do, Doing, Waiting with their counts; a card sent with → brings its lane into view.',
        ],
        look: 'Formal: the pipeline’s ledger columns, each head an engraved plate under the double rule. Check that the counts are exact, that an over-full lane reads as a warning and not a fault, and that the empty lane invites a drop.',
        controls:
            group('Narrow', 'narrow', [['scroll', 'Scroll (default)', true], ['tabs', 'Tabs']], 'pg-board') +
            group('Limit', 'limit', [['3', 'Doing at most 3', true], ['0', 'No limit']], 'pg-board') +
            states('pg-board') +
            width('board-component'),
        component: `<div class="kp-board" id="pg-board" role="region" data-kp-board data-kp-board-narrow="scroll" aria-label="Weekly review"></div>${log('pg-board-log')}`,
    },
    {
        id: 'context-menu',
        title: 'Context menu: a right click or a long press on a row',
        topic: 'context-menu',
        topicTitle: 'The context menu',
        item: 'habits gap: context menu',
        asked: 'A task’s actions were only behind its ⋯ button. <code>data-kp-context-menu</code> on any element opens a kp menu at the pointer on a right click, a long press on touch and Shift+F10, with the menu button’s plate, keys and <code>kp-menu-select</code>; <code>inner</code> shows the element’s own ⋯ entries and reports the pick there. Shift with a right click keeps the browser’s menu.',
        h2: 'Today',
        intro: 'Four tasks of the Today page, each with the app’s own ⋯ menu.',
        expected: [
            '<b>Closed</b>: right-click anywhere on a row: its menu opens with its top corner at the pointer, the focus on “Today”; ↓ ↑ Home End and a letter move, Enter picks, Esc closes and gives the focus back. The line under the list names the pick and the task. Focus a row’s title and press Shift+F10: the same menu hangs from the title’s start edge.',
            '<b>Opened</b>: the first row’s menu is shown open, as the menu button’s rich menu: groups under small capitals, Delete in the destructive ink.',
            '<b>Phone</b>: a long press on a row opens it at the finger; near the edge it moves inside the screen.',
        ],
        look: 'Formal: the menu button’s paper plate with its ruled items, the same as the ⋯ menu beside it. Check that it opens where you clicked and never detached from the row.',
        controls: group('Shown', 'shown', [['closed', 'Closed', true], ['opened', 'Opened']], 'pg-ctx') + width('context-menu-component'),
        component: `<ul class="kp-task-list" id="pg-ctx" aria-label="Today"></ul>${log('pg-ctx-log')}`,
    },
    {
        id: 'md-editor',
        title: 'Markdown editor: a toolbar, shortcuts and a preview',
        topic: 'markdown',
        topicTitle: 'Markdown notes',
        item: 'habits gap: Markdown editor',
        asked: 'Only the reader existed, so the app’s notes were a text area with an Edit / Preview switch. <code>data-kp-md-editor</code> round the text area adds a toolbar (bold, italic, heading, list, checklist, link), Mod+B, Mod+I and Mod+K, a list that continues on Enter, and the reader’s preview beside the text when the editor is at least 48rem wide, behind Write / Preview tabs when narrower. A box ticked in the preview is written into the text. <code>data-kp-md-preview</code>: <code>side</code> (default), <code>tabs</code> or <code>off</code>.',
        h2: 'Notes of “Plan the team offsite”',
        intro: 'The task’s notes in Markdown, with a checklist of what is still open.',
        expected: [
            '<b>Side</b>: the toolbar over the text, the preview beside it at the same height (it scrolls inside). Select words and press Ctrl+B: they turn bold in the preview. At the end of “- [ ] Book the venue” press Enter: a new “- [ ] ” item starts; Enter again on it ends the list. Tick “Send the agenda” in the preview: its line in the text reads “- [x]”.',
            '<b>Tabs</b>: Write and Preview tabs over one pane. <b>Off</b>: the toolbar and the text only.',
            '<b>Phone</b>: the tabs, whichever is set; the tools wrap under each other, never cut.',
        ],
        look: 'Formal: the tools are the package’s small bordered buttons, the preview the reader on the card stock. Check that the tools line up as one row of equals and that the preview reads as the text’s twin.',
        controls: group('Preview', 'preview', [['side', 'Side (default)', true], ['tabs', 'Tabs'], ['off', 'Off']], 'pg-md') + width('md-editor-component'),
        component: `<div class="kp-md-editor" id="pg-md" data-kp-md-editor><textarea class="kp-field__input kp-field__input--multiline" aria-label="Notes of Plan the team offsite" rows="12"></textarea></div>${log('pg-md-log')}`,
    },
    {
        id: 'categorical',
        title: 'Twelve categorical colours for projects and tags',
        topic: 'categorical',
        topicTitle: 'Categorical colours',
        item: 'habits gap: categorical colours',
        asked: 'There were five chart colours, and a project or a tag needs one of twelve, so the app mapped twelve names to hues itself. Every theme now has <code>--kp-cat-1</code> … <code>--kp-cat-12</code> (red, orange, amber, lime, green, teal, cyan, blue, indigo, violet, pink, slate) and <code>--kp-cat-ink</code>; <code>data-kp-cat="1"</code> … <code>"12"</code> picks one, <code>.kp-cat-dot</code> is a round mark and <code>.kp-cat-chip</code> a filled tag. Each reads as ink on the page and as a fill; neighbours differ in lightness as well as hue.',
        h2: 'The app’s twelve colours',
        intro: 'Each colour as the app uses it: a project’s dot and a tag’s chip (the names are mock).',
        expected: [
            '<b>Full width</b>: twelve tiles of one size in rows of six (four on a tablet), each with the colour’s name, a project with its dot and a tag as a chip. Every chip’s words read on its fill; no two neighbours look alike.',
            '<b>Phone</b>: two tiles a row, the same tiles.',
        ],
        look: 'Formal: editorial inks, not a rainbow of sweets: navy, oxblood, bronze, moss. Check that each tag can be told from its neighbour at a glance, and that slate reads as the neutral one.',
        controls: width('categorical-component'),
        component: `<ul class="pg-cats" id="pg-cats" aria-label="The twelve categorical colours"></ul>`,
    },
    {
        id: 'task-row',
        title: 'Task row: check, title, facts and fixed action columns',
        topic: 'task-row',
        topicTitle: 'The task row',
        item: 'habits gap: task row',
        asked: 'The app built its task row from kp parts by hand. <code>.kp-task-row</code> (<code>buildTaskRow</code>) is that row: the reorder handle, the field’s check box, the title, a line of facts (deadline badge, project dot, tag chip) and fixed action columns (the app’s timer, then the ⋯ menu, also on a right click), keyed for row picking.',
        h2: 'Inbox',
        intro: 'Five Inbox tasks with every fact the app shows; one is done, one has its timer running.',
        expected: [
            '<b>Handle shown</b>: handles, boxes and titles each on one edge from row to row, the timer and the ⋯ in two columns of their own; the facts wrap under the title and the actions. The high-priority row has a red edge inside its border, the medium one an amber edge; the done row is muted and struck through.',
            'Tick a box: the row turns done and the line under the list says so. Ctrl+click two rows: they are ringed and tinted. Press a title: the line says the panel would open.',
            '<b>Handle hidden</b>: the first column stays, empty, so nothing moves. <b>Phone</b>: the same columns; a long title wraps, never cut.',
        ],
        look: 'Formal: each row a ruled entry on the card stock, the actions in a fixed column like a ledger’s margin. Check that the same function sits in the same place in every row.',
        controls: group('Handle', 'handle', [['on', 'Handle shown (default)', true], ['off', 'Handle hidden']], 'pg-rows') + width('task-row-component'),
        component: `<ul class="kp-task-list" id="pg-rows" data-kp-reorder data-kp-row-pick aria-label="Inbox"></ul>${log('pg-rows-log')}`,
    },
];
