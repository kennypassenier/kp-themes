// Page descriptor for the "action-columns" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const actionColumnsDescriptor = {
        id: 'action-columns',
        title: 'Buttons in shared columns',
        group: 'Data',
        classes: ['kp-action-list', 'kp-row-actions'],
        exports: [],
        // `data-kp-action` names a button's role; the button page claims the
        // same word for its undo action, so the two share it.
        aliases: ['action'],
        intro: 'A list’s row buttons on columns the whole list shares: a button of one role starts at one edge and has one width on every row, whatever its label, and a row without that role leaves its column empty. In a list the browser does it — the list is a grid, each row a subgrid — and by position from the end no script is needed. A table measures, through `attachActionColumns()` in js/actions.js.',
        whenToUse:
            'For a list or a table whose rows carry the same few actions, so the eye finds Open in the same place on every row. Not for one row’s toolbar, and not for a long row of actions: four from the end is what the stylesheet places alone, and beyond that a menu reads better.',
        examples: [
            {
                title: 'A list, by position from the end',
                why: 'No script: the last button of every row shares the last column, the one before it the column before, and a shorter row leaves its first columns empty. Every column is as wide as its widest button.',
                markup: `
<ul class="kp-action-list">
<li>
<div><b>INC-4471</b> Pump house 3: pressure below 2.1 bar</div>
<div class="kp-row-actions">
<button type="button" class="kp-button kp-button--sm">Acknowledge</button>
<button type="button" class="kp-button kp-button--sm">Assign…</button>
<button type="button" class="kp-button kp-button--sm kp-button--primary">Open</button>
</div>
</li>
<li>
<div><b>INC-4468</b> Pump house 7: no reading since 06:00</div>
<div class="kp-row-actions">
<button type="button" class="kp-button kp-button--sm">Reassign…</button>
<button type="button" class="kp-button kp-button--sm kp-button--primary">Open</button>
</div>
</li>
</ul>
`,
            },
            {
                title: 'A table, by role',
                why: 'A table cannot be a subgrid, so `attachActionColumns()` measures each role’s widest button and writes the widths on the table. Named by role, Open stays under Open on a row without Recalibrate.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table">
<thead><tr><th scope="col">Pump house</th><th scope="col"><span class="kp-sr-only">Actions</span></th></tr></thead>
<tbody>
<tr><td>Pump house 1</td><td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="recalibrate">Recalibrate…</button><button type="button" class="kp-button kp-button--sm kp-button--primary" data-kp-action="open">Open</button></div></td></tr>
<tr><td>Pump house 3</td><td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm kp-button--primary" data-kp-action="open">Open</button></div></td></tr>
</tbody>
</table>
</div>
`,
            },
            {
                title: 'Rows with a lead: an inbox that is walked by keyboard and acts on one row',
                why: '`kp-action-list--lead` gives every row a lead column before its words (`.kp-action-list__lead`: a state dot, a badge, a file format, a day and hour), as wide as the widest lead in the list so every title starts at one edge. The words are `.kp-action-list__main` with a `.kp-action-list__title`, a `.kp-action-list__text` and a `.kp-action-list__meta` line whose parts are set apart by a dot. A row says its state on `data-kp-state` (`new`, `active`, `warn`, `failed`, `next`, `done`, `past`) by a bar along its start edge that every row reserves, so a state moves nothing. `data-kp-row-keys` on the list lets j and k (or the arrows) walk the rows, Home and End jump, and Enter on a row fires `kp-row-open`; `attachRowKeys(root)` wires it. `setRowBusy(row, true, button)` makes the row wait without moving a column (the pressed button shows the spinner where its words are) and `removeRow(row)` lets the row leave the theme’s way and keeps the keyboard’s place. Press Mark seen on a row, or focus the list and press j.',
                markup: `
<div class="kp-stack">
<ul class="kp-action-list kp-action-list--lead" aria-label="Inbox" data-kp-row-keys data-doc-inbox>
<li data-kp-state="new">
<span class="kp-action-list__lead"><span class="kp-health" data-state="warn"><span class="kp-health__dot" aria-hidden="true"></span><span class="kp-sr-only">Warning</span></span></span>
<div class="kp-action-list__main"><strong class="kp-action-list__title">Backup of media is late</strong><span class="kp-action-list__text">The nightly copy has not finished after 3 h 10 min.</span><span class="kp-action-list__meta"><span>Backups</span><span>Nightly copy</span><span>12 min ago</span></span></div>
<div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm kp-button--primary" data-kp-action="open">Open</button><button type="button" class="kp-button kp-button--sm" data-kp-action="seen" data-doc-seen>Mark seen</button></div>
</li>
<li data-kp-state="failed">
<span class="kp-action-list__lead"><span class="kp-health" data-state="down"><span class="kp-health__dot" aria-hidden="true"></span><span class="kp-sr-only">Failed</span></span></span>
<div class="kp-action-list__main"><strong class="kp-action-list__title">Certificate renewal failed</strong><span class="kp-action-list__text">The challenge for the wildcard certificate was refused.</span><span class="kp-action-list__meta"><span>Platform</span><span>Renewals</span><span>1 h ago</span></span></div>
<div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm kp-button--primary" data-kp-action="open">Open</button></div>
</li>
<li data-kp-state="done">
<span class="kp-action-list__lead"><span class="kp-health" data-state="ok"><span class="kp-health__dot" aria-hidden="true"></span><span class="kp-sr-only">Fine</span></span></span>
<div class="kp-action-list__main"><strong class="kp-action-list__title">Restore test passed</strong><span class="kp-action-list__text">The weekly restore of the home stack matched its checksum.</span><span class="kp-action-list__meta"><span>Backups</span><span>Restore test</span><span>Yesterday</span></span></div>
<div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="open">Open</button><button type="button" class="kp-button kp-button--sm" data-kp-action="seen" data-doc-seen>Mark seen</button></div>
</li>
</ul>
<p class="kp-text-muted" data-doc-inbox-said role="status">Press Mark seen, or focus the list and press j, k or Enter.</p>
</div>
`,
                script: `
import { attachActionColumns, attachRowKeys, removeRow, setRowBusy } from '@kp-soft/themes/js/actions';

const list = document.querySelector('[data-doc-inbox]');
const said = document.querySelector('[data-doc-inbox-said]');
attachActionColumns(list.parentElement);
attachRowKeys(list.parentElement);

list.addEventListener('kp-row-open', (event) => {
    said.textContent = 'Opened: ' + event.detail.row.querySelector('.kp-action-list__title').textContent;
});
list.addEventListener('click', async (event) => {
    const seen = event.target.closest('[data-doc-seen]');
    const row = event.target.closest('li');
    if (!seen || row.getAttribute('aria-busy') === 'true') return;
    setRowBusy(row, true, seen);
    await new Promise((done) => setTimeout(done, 1200));
    await removeRow(row);
    said.textContent = 'Marked seen.';
});
`,
            },
            {
                title: 'Rows with a lead: a backlog with a payload, appointments in groups',
                why: 'The same list with other leads. A badge for a message’s state, and a `.kp-action-list__more` fold (the accordion’s bare item) with a `.kp-action-list__payload` that opens with the theme’s fold motion. Appointments lead with a `.kp-action-list__when` (a day over an hour); the next one up is `next` (the bar, a primary wash and the lead in the primary), earlier ones `past` (quieter ink, not opacity), and an `li.kp-action-list__group` is a heading row across the list.',
                markup: `
<div class="kp-stack">
<ul class="kp-action-list kp-action-list--lead" aria-label="Backlog">
<li data-kp-state="failed">
<span class="kp-action-list__lead"><span class="kp-badge kp-badge--destructive">dead</span></span>
<div class="kp-action-list__main"><span class="kp-action-list__title kp-id">msg-7f3a21</span><span class="kp-action-list__meta"><span>published 16/10/2026 03:12</span><span>5 attempts</span></span>
<details class="kp-accordion__item kp-accordion__item--bare kp-action-list__more"><summary>Payload</summary><pre class="kp-action-list__payload">{"topic":"backup.done","ok":false,"volume":"media"}</pre></details></div>
<div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="requeue">Requeue</button><button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-action="delete">Delete</button></div>
</li>
<li data-kp-state="active">
<span class="kp-action-list__lead"><span class="kp-badge kp-badge--info">claimed</span></span>
<div class="kp-action-list__main"><span class="kp-action-list__title kp-id">msg-7f3a22</span><span class="kp-action-list__meta"><span>published 16/10/2026 03:14</span><span>1 attempt</span></span></div>
<div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-action="delete">Delete</button></div>
</li>
</ul>
<ul class="kp-action-list kp-action-list--lead" aria-label="Appointments">
<li class="kp-action-list__group"><h4>Upcoming</h4></li>
<li data-kp-state="next">
<span class="kp-action-list__lead"><time class="kp-action-list__when"><span>Tue 21/10/2026</span><span>14:00</span></time></span>
<div class="kp-action-list__main"><strong class="kp-action-list__title">Second interview</strong><span class="kp-action-list__text">Two people from the team; at their office.</span></div>
<div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-action="delete">Delete</button></div>
</li>
<li>
<span class="kp-action-list__lead"><time class="kp-action-list__when"><span>Tue 28/10/2026</span><span>10:00</span></time></span>
<div class="kp-action-list__main"><strong class="kp-action-list__title">Technical test</strong><span class="kp-action-list__text">Two hours, remote.</span></div>
<div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-action="delete">Delete</button></div>
</li>
<li class="kp-action-list__group"><h4>Past</h4></li>
<li data-kp-state="past">
<span class="kp-action-list__lead"><time class="kp-action-list__when"><span>Tue 14/10/2026</span><span>09:30</span></time></span>
<div class="kp-action-list__main"><strong class="kp-action-list__title">Intro call</strong><span class="kp-action-list__text">Twenty minutes with the recruiter.</span></div>
<div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-action="delete">Delete</button></div>
</li>
</ul>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-action-list', what: 'A list (`ul` or `ol`) whose rows are one grid: the row’s text first, then one column per button.' },
            { name: '.kp-row-actions', what: 'The button box in a row or a table cell. Empty, it takes no room.' },
            { name: 'data-kp-action', what: 'A button’s role, for rows whose buttons are not the same from the end: one column per role, in the order the rows give them.' },
            { name: '.kp-action-list--lead', what: 'Rows with a lead column before their words, as wide as the widest lead and no wider; the buttons keep their shared columns. In a narrow list the lead stays beside the words and the buttons go under them.' },
            { name: '.kp-action-list__lead, __main', what: 'The lead (a state dot or badge, a file’s format, a day and hour) sits on the title’s first line; the words are the main part.' },
            { name: '.kp-action-list__title, __text, __meta', what: 'The title in the heavier weight, one muted sentence, and a muted line of parts set apart by a dot that never starts a wrapped line.' },
            { name: '.kp-action-list__when', what: 'A moment as two lines, a day over an hour; in a `next` row the second line takes the primary ink.' },
            { name: '.kp-action-list__more, __payload', what: 'A fold for a payload (the accordion’s bare item), and the text inside it in the mono face at a readable height.' },
            { name: 'li.kp-action-list__group', what: 'A heading row across the whole list (Upcoming, Past); the keyboard walk skips it.' },
            { name: 'data-kp-state on a row', what: '`new` (unread), `active` (claimed, in flight), `warn`, `failed`, `next` (the next one up: the bar, a primary wash and the lead in the primary), `done` and `past` (quieter ink, not opacity). Every row reserves the bar, so a state moves nothing.' },
            { name: 'setRowBusy(row, busy, button)', what: 'The row carries `aria-busy`, every button in it refuses a press with `aria-disabled` (the focus stays), and the pressed one shows the theme’s spinner in `.kp-button__busy` while its words (`.kp-button__text`) keep their room, so no column moves.' },
            { name: 'removeRow(row)', what: 'The row leaves the theme’s way (at once under reduced motion). When the focus is in it, the focus goes first to the same place in the next row, else the row before, else the list.' },
            { name: 'data-kp-row-keys / attachRowKeys(root) / ROW_KEYS', what: 'j or ↓ next row, k or ↑ the row before, Home and End the first and last, Enter on the row fires `kp-row-open` with `{ row }`. Never while typing in a field or with a modifier held; a button in a row keeps Enter. One row is in the tab order, so Tab reaches the list once.' },
            {
                name: 'on a phone',
                what: 'In a list narrower than 30rem the buttons go under the row’s text, side by side, spread over the full width in equal columns, so a role still lines up from row to row. In a narrow table they stack in the cell at one width.',
            },
            { name: 'data-kp-action-measuring', what: 'What the script writes on a table for the moment it measures, every button at its own size.' },
            { name: 'a disabled action', what: 'A button with a reason keeps its column: the reason’s wrapper wears the button’s `data-kp-action`.' },
        ],
        accessibility: [
            'Built in — the buttons keep their order in the markup; the columns are layout only, so the tab order is the row’s own.',
            'Built in — a column a row leaves empty holds nothing focusable.',
            'Yours — name a button by what it does to that row (“Open INC-4471” for a screen reader) when the visible word alone is the same on every row.',
        ],
    };
