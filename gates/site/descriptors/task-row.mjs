// Page descriptor for the "task-row" documentation page [AR19]; the shape is pinned in ./types.mjs.

/**
 * One task row as the markup js/task-row.js draws.
 * @param {string} key @param {string} title @param {string} facts @param {string} extra attributes on the row
 */
const row = (key, title, facts, extra = '') => `<li class="kp-task-row" data-kp-row-key="${key}" data-kp-item="${key}" data-kp-label="${title}" tabindex="-1"${extra}>
<button type="button" class="kp-icon-button kp-task-row__handle" data-kp-handle aria-label="Move ${title}">⠿</button>
<label class="kp-task-row__hit"><input type="checkbox" class="kp-field__check kp-task-row__check" aria-label="Done: ${title}" /></label>
<button type="button" class="kp-task-row__title">${title}</button>
<div class="kp-task-row__facts">${facts}</div>
<div class="kp-task-row__actions"><button type="button" class="kp-icon-button kp-task-row__action" aria-label="Start timer: ${title}">▶</button></div>
</li>`;

/** @type {import('./types.mjs').Descriptor} */
export const taskRowDescriptor = {
    id: 'task-row',
    title: 'Task row',
    group: 'Data',
    classes: ['kp-task-row', 'kp-task-list', 'kp-swipe', 'kp-settled'],
    exports: [],
    aliases: ['done', 'priority', 'task-toggle', 'task-open', 'swipe', 'swipe-start', 'swipe-end', 'swipe-pointers', 'swipe-off', 'swipe-key', 'swipe-ignore', 'swiping', 'settled', 'settled-list'],
    intro: 'A list row for a thing to do [habits-1101]: a check for done, the title, a line of facts under it and the row’s actions in fixed columns, built from the package’s parts (the reorder handle, the field’s check box, badges, categorical dots and chips, icon buttons and the menu button). Every row of a list keeps one grid, so the handles, the boxes, the titles and each action stand in one column from top to bottom.',
    whenToUse:
        'For any list of things a person finishes: tasks, steps, errands. The rows move in their list and between lists (a reorder group), are picked without boxes (row picking) and open their actions on a right click (the context menu). For a list of things that each hold a stepper or a switch, use the list rows; for data to sort, the data table.',
    examples: [
        {
            title: 'Two tasks: a project, a deadline and a tag',
            why: 'The facts are the package’s own: a categorical dot before the project, the badge in its tone for a deadline, a categorical chip for a tag. `buildTaskRow(document, spec)` draws the same from data, with the ⋯ menu and its context menu.',
            markup: `
<ul class="kp-task-list" data-kp-reorder aria-label="Today">
${row('t1', 'Write the quarterly report', '<span class="kp-task-row__fact kp-task-row__fact--project" data-kp-cat="8"><span class="kp-cat-dot" aria-hidden="true"></span>Work</span><span class="kp-badge kp-badge--destructive">Overdue · yesterday</span><span class="kp-cat-chip" data-kp-cat="10">#writing</span>', ' data-kp-priority="high"')}
${row('t2', 'Call the plumber', '<span class="kp-task-row__fact kp-task-row__fact--project" data-kp-cat="5"><span class="kp-cat-dot" aria-hidden="true"></span>Home</span><span class="kp-badge kp-badge--warning">Due today</span>')}
</ul>
`,
        },
    ],
    variants: [
        { name: 'buildTaskRow', what: '`buildTaskRow(document, { key, title, done, priority, facts, actions, menu, handle })` draws one row: `facts` are strings (a muted fact) or `{ text, kind, tone, cat, href, label }` with `kind` `badge`, `project` (a dot) or `tag` (a chip); `actions` are the page’s icon buttons, each in a column; `menu` the ⋯ entries, also shown by the row’s context menu (`data-kp-context-menu="inner"`); `handle: false` keeps the first column empty.' },
        { name: 'kp-task-toggle / kp-task-open', what: 'Fired on the row: `{ key, done }` when its box is ticked or unticked, `{ key, source }` when its title is pressed.' },
        { name: 'data-kp-priority', what: '`high` or `medium`: an edge inside the border in the destructive or the warning colour.' },
        { name: 'data-kp-done', what: 'A done row: the title muted and struck through.' },
        { name: 'data-kp-swipe', what: 'The swipe row [parts-1102] (js/swipe.js), on the list: a finger that slides a row sideways moves its parts and shows the action’s plate in its tone with its words; `data-kp-swipe-start="done:Done:success"` is revealed swiping toward the end (right), `data-kp-swipe-end="tomorrow:Tomorrow:info"` the other way (`key:Words:tone`). Past the threshold (35 % of the row, at most 140 px) the plate arms and a phone ticks; let go there and the row fires `kp-swipe { key, action, row }`; it slides home in the theme’s own time and curve, at once under reduced motion. Touch only unless `data-kp-swipe-pointers="any"`; locks after 12 px sideways, rows take `touch-action: pan-y` on a coarse pointer; the check box, handle, icon and menu buttons keep their own press (`data-kp-swipe-ignore` marks more); `data-kp-swipe="off"` or a row’s `data-kp-swipe-off` stops it. A swipe is a shortcut: the row’s ⋯ menu carries the same actions for a keyboard, a mouse and a screen reader.' },
        { name: 'data-kp-settled', what: 'The settled row [parts-1102] (js/settled.js), on a row of a reorder list, checklist or task list (`data-kp-settled-list` for any other) whose item left while the page is open: its value is where it went (“Deleted”, “Moved to Work”). The row keeps its place and height, goes quiet (dashed, faded, struck through) and inert, shows the word at its end, is said once and fires `kp-settled { key, word }`, until the list is left: `clearSettled(list)` takes the settled rows out, `settleRow(row, word)` sets it, removing the attribute gives the row back.' },
        { name: 'data-kp-picked', what: 'Written by row picking (`data-kp-row-pick` on the list): the row is ringed and tinted.' },
    ],
    accessibility: [
        'Built in — the box, the handle and the more button are named after the task (“Done: Call the plumber”, “Move …”, “More for …”), in the dictionary.',
        'Built in — on a touch screen every icon column is 44 px, the box’s label as large as the buttons.',
        'Yours — give the list a name (`aria-label`), and keep `key` the task’s stable id: the reorder events and the picks report it.',
    ],
};
