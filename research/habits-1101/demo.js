// research/habits-1101: the page's own wiring. Every component is the package's; this file fills each with the Habits app's data
// (research/habits-1101/data.js) and wires each section's controls by that section's own elements, so a section works on any page
// that shows it. The titles, projects and tags are mock.

import { buildTaskRow } from '../../js/task-row.js';
import { attachStructure } from '../../js/structure.js';
import { attachBoards, recountBoard, setBoardState } from '../../js/board.js';
import { attachContextMenus, openContextMenu } from '../../js/context-menu.js';
import { attachMarkdownEditors, showMarkdownView } from '../../js/markdown-editor.js';
import { attachRowPick } from '../../js/row-pick.js';
import { BOARD, CATS, INBOX, NOTES, PLANNER, TODAY, menuOf } from './data.js';

const $ = (/** @type {string} */ id) => /** @type {HTMLElement | null} */ (document.getElementById(id));

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the handler. */
/** @type {Record<string, (value: string, target: HTMLElement | null) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    const handler = HANDLERS[button?.dataset.pg ?? ''];
    if (!button || !handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', $(button.dataset.target ?? ''));
});
/** @param {string} name @param {(value: string, target: HTMLElement | null) => void} handler */
const on = (name, handler) => {
    HANDLERS[name] = handler;
};
/** The pressed value of a group that drives `target`. @param {string} name @param {string} target @param {string} fallback */
const pressed = (name, target, fallback) =>
    /** @type {HTMLElement | null} */ (document.querySelector(`button[data-pg="${name}"][data-target="${target}"][aria-pressed="true"]`))?.dataset.value ?? fallback;
/** Mark a group's button pressed from the page. @param {string} name @param {string} target @param {string} value */
const press = (name, target, value) => {
    for (const b of document.querySelectorAll(`button[data-pg="${name}"][data-target="${target}"]`)) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === value));
};
/** @param {string} id @param {string} text */
const say = (id, text) => {
    const line = $(id);
    if (line) line.textContent = text;
};
on('width', (value, target) => target?.setAttribute('data-pg-width', value));

/** The app's timer button, in the row's first action column. @param {import('./data.js').Task} task */
function timer(task) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kp-icon-button';
    const paint = (/** @type {boolean} */ running) => {
        button.textContent = running ? '■' : '▶';
        button.setAttribute('aria-pressed', String(running));
        button.setAttribute('aria-label', `${running ? 'Stop timer' : 'Start timer'}: ${task.title}`);
    };
    paint(task.running === true);
    button.disabled = task.done === true;
    button.addEventListener('click', () => paint(button.getAttribute('aria-pressed') !== 'true'));
    return button;
}
/** A row from the app's task. @param {import('./data.js').Task} task @param {{ handle?: boolean }} [options] */
const row = (task, options = {}) => buildTaskRow(document, { ...task, actions: [timer(task)], menu: menuOf(task), handle: options.handle ?? true });
/** The title of a row by its key. @param {string} key */
const titleOf = (key) => document.querySelector(`[data-kp-row-key="${CSS.escape(key)}"]`)?.getAttribute('data-kp-label') ?? key;
/** What a pick in a row's menu says. @param {CustomEvent} event */
const picked = (event) => {
    const rowEl = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('[data-kp-row-key]'));
    const from = event.detail.context ? 'its context menu' : 'its ⋯ menu';
    return `“${event.detail.item.querySelector('.kp-menu__label')?.textContent}” on “${titleOf(rowEl?.dataset.kpRowKey ?? '')}”, from ${from}`;
};

// ---------------------------------------------------------------- 1 · the Planner's days (drag between lists)
const days = $('pg-days');
if (days) {
    for (const list of /** @type {HTMLElement[]} */ ([...days.querySelectorAll('[data-pg-day]')])) list.append(...(PLANNER[list.dataset.pgDay ?? ''] ?? []).map((t) => row(t)));
    attachStructure(days);
    attachContextMenus(days);
    days.addEventListener('kp-reorder', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        const where = d.fromList && d.fromList !== d.toList ? `fromList ${d.fromList} → toList ${d.toList}` : `within ${d.toList ?? 'its day'}`;
        say('pg-days-log', `kp-reorder: “${titleOf(d.id)}”, ${where}, from place ${d.from + 1} to place ${d.to + 1}.`);
    });
    on('group', (value) => {
        for (const list of days.querySelectorAll('[data-pg-day]')) {
            if (value === 'shared') list.setAttribute('data-kp-reorder-group', 'planner');
            else list.removeAttribute('data-kp-reorder-group');
        }
        say('pg-days-log', '');
    });
}

// ---------------------------------------------------------------- 2 · the Boards page
const board = $('pg-board');
if (board) {
    for (const lane of BOARD) {
        // A div, not a section: the review page judges every section with an id, and a lane gets one.
        const section = document.createElement('div');
        section.dataset.kpBoardLane = lane.key;
        section.dataset.kpBoardLabel = lane.label;
        section.dataset.kpTone = String(lane.tone);
        if (lane.limit) section.dataset.kpBoardLimit = String(lane.limit);
        const list = document.createElement('ul');
        list.setAttribute('data-kp-reorder', '');
        list.append(...lane.cards.map((t) => row(t)));
        section.append(list);
        board.append(section);
    }
    attachBoards(board.parentElement ?? document);
    attachContextMenus(board);
    board.addEventListener('kp-reorder', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        if (d.fromList !== d.toList) say('pg-board-log', `kp-reorder: “${titleOf(d.id)}” from ${d.fromList} to ${d.toList}, place ${d.to + 1}.`);
    });
    on('narrow', (value) => board.setAttribute('data-kp-board-narrow', value));
    on('limit', (value) => {
        const doing = board.querySelector('[data-kp-board-lane="doing"]');
        if (value === '0') doing?.removeAttribute('data-kp-board-limit');
        else doing?.setAttribute('data-kp-board-limit', value);
        recountBoard(board);
    });
    const WORDS = { empty: 'No cards on this board yet.', error: 'The server did not answer.' };
    on('state', (value, target) => {
        if (target !== board) return;
        setBoardState(board, /** @type {any} */ (value), /** @type {Record<string, string>} */ (WORDS)[value] ?? '');
    });
    board.addEventListener('kp-board-retry', () => (press('state', 'pg-board', 'ready'), setBoardState(board, 'ready')));
}

// ---------------------------------------------------------------- 3 · Today, with a context menu on every row
const today = $('pg-ctx');
if (today) {
    today.append(...TODAY.map((t) => row(t, { handle: false })));
    attachContextMenus(today);
    today.addEventListener('kp-menu-select', (event) => {
        say('pg-ctx-log', `Picked ${picked(/** @type {CustomEvent} */ (event))}.`);
        // The demo keeps its rows as they are: a pick is only reported.
        event.preventDefault();
    });
    on('shown', (value) => {
        const first = /** @type {HTMLElement | null} */ (today.firstElementChild);
        if (value === 'opened' && first) {
            const box = first.querySelector('.kp-task-row__title')?.getBoundingClientRect();
            openContextMenu(first, box ? { x: box.left + box.width / 3, y: box.top + box.height / 2 } : {});
        } else document.querySelector('.kp-context-menu [role="menu"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
}

// ---------------------------------------------------------------- 4 · the notes of a task (Markdown editor)
const editor = $('pg-md');
if (editor) {
    const area = /** @type {HTMLTextAreaElement} */ (editor.querySelector('textarea'));
    area.value = NOTES;
    attachMarkdownEditors(editor.parentElement ?? document);
    area.addEventListener('input', () => say('pg-md-log', `The page heard input: ${area.value.length} characters to save.`));
    on('preview', (value) => {
        editor.setAttribute('data-kp-md-preview', value);
        showMarkdownView(editor, 'write');
    });
}

// ---------------------------------------------------------------- 5 · the twelve categorical colours
const cats = $('pg-cats');
if (cats) {
    cats.append(
        ...CATS.map(([name, project, tag], index) => {
            const li = document.createElement('li');
            li.className = 'pg-cat';
            li.dataset.kpCat = String(index + 1);
            const head = Object.assign(document.createElement('p'), { className: 'pg-cat__name', textContent: `${index + 1} · ${name}` });
            const proj = Object.assign(document.createElement('p'), { className: 'pg-cat__project' });
            proj.append(Object.assign(document.createElement('span'), { className: 'kp-cat-dot' }), project);
            const chip = Object.assign(document.createElement('span'), { className: 'kp-cat-chip', textContent: `#${tag}` });
            li.append(head, proj, chip);
            return li;
        }),
    );
}

// ---------------------------------------------------------------- 6 · the Inbox: task rows
const inbox = $('pg-rows');
if (inbox) {
    const fill = () => inbox.replaceChildren(...INBOX.map((t) => row(t, { handle: pressed('handle', 'pg-rows', 'on') === 'on' })));
    fill();
    attachStructure(inbox);
    attachRowPick(inbox);
    attachContextMenus(inbox);
    on('handle', () => fill());
    inbox.addEventListener('kp-task-toggle', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        say('pg-rows-log', `kp-task-toggle: “${titleOf(d.key)}” is ${d.done ? 'done' : 'open again'}.`);
    });
    inbox.addEventListener('kp-task-open', (event) => say('pg-rows-log', `kp-task-open: the panel of “${titleOf(/** @type {CustomEvent} */ (event).detail.key)}” would open.`));
    inbox.addEventListener('kp-rows-select', (event) => say('pg-rows-log', `Picked: ${/** @type {CustomEvent} */ (event).detail.keys.map(titleOf).join(', ') || 'none'}.`));
    inbox.addEventListener('kp-menu-select', (event) => {
        say('pg-rows-log', `Picked ${picked(/** @type {CustomEvent} */ (event))}.`);
        event.preventDefault();
    });
}
