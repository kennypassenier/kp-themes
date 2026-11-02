// research/parts-habits-1102: the page's own wiring, part one: the shared helpers, the day timeline (Today's timeline with the list of
// tasks without a time beside it) and the swipe row (Today's list). demo-more.js wires the key line, the settled rows and the swatch
// picker. Every component is the package's; each section is wired by its own elements, so it works on any page that shows it. The
// titles, times, projects and events are mock.

import { buildTaskRow } from '../../js/task-row.js';
import { attachDaylines, setDaylineItems, setDaylineState } from '../../js/dayline.js';
import { attachSwipes } from '../../js/swipe.js';
import { attachSettled, settleRow } from '../../js/settled.js';
import { ALL_DAY, DAY, TODAY, TODAY_MENU, UNTIMED } from './data.js';

export const $ = (/** @type {string} */ id) => /** @type {HTMLElement | null} */ (document.getElementById(id));

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the handler. */
/** @type {Record<string, (value: string, target: HTMLElement | null) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    const handler = HANDLERS[button?.dataset.pg ?? ''];
    if (!button || !handler) return;
    const oneShot = button.parentElement?.querySelectorAll('button[data-pg]').length === 1 || ['reset', 'leave', 'swiped'].includes(button.dataset.value ?? '');
    if (!oneShot) for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', $(button.dataset.target ?? ''));
});
/** @param {string} name @param {(value: string, target: HTMLElement | null) => void} handler */
export const on = (name, handler) => {
    HANDLERS[name] = handler;
};
/** Mark a group's button pressed from the page. @param {string} name @param {string} target @param {string} value */
export const press = (name, target, value) => {
    for (const b of document.querySelectorAll(`button[data-pg="${name}"][data-target="${target}"]`)) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === value));
};
/** @param {string} id @param {string} text */
export const say = (id, text) => {
    const line = $(id);
    if (line) line.textContent = text;
};
on('width', (value, target) => target?.setAttribute('data-pg-width', value));

/** A task row as the app draws it. @param {import('../../js/task-row.js').TaskRowSpec} task @param {Partial<import('../../js/task-row.js').TaskRowSpec>} [extra] */
export const row = (task, extra = {}) => buildTaskRow(document, { ...task, ...extra });

// ---------------------------------------------------------------- 1 · dayline (Today's timeline)
const day = $('pg-day');
const untimed = $('pg-untimed');
if (day && untimed) {
    /** The day as the page holds it: moves and drops change it, as the app's store would. */
    let items = DAY.map((item) => ({ ...item }));
    let waiting = UNTIMED.map((task) => ({ ...task }));
    const drawList = () => {
        untimed.replaceChildren(
            ...waiting.map((task) => {
                const li = row(task, { handle: false });
                li.dataset.kpDaylineSource = task.key;
                li.dataset.kpDaylineFor = 'pg-day';
                li.dataset.kpDaylineLabel = task.title;
                return li;
            }),
        );
        const count = $('pg-untimed-count');
        if (count) count.textContent = String(waiting.length);
    };
    attachDaylines(day);
    drawList();
    setDaylineItems(day, items, { allDay: ALL_DAY });
    day.addEventListener('kp-dayline-change', (event) => {
        const { id, start, from, source } = /** @type {CustomEvent<{ id: string, start: string, from: string, source: string }>} */ (event).detail;
        items = items.map((item) => (item.id === id ? { ...item, start } : item));
        say('pg-day-log', `kp-dayline-change: ${id} from ${from} to ${start} (${source})`);
    });
    day.addEventListener('kp-dayline-open', (event) => say('pg-day-log', `kp-dayline-open: ${/** @type {CustomEvent<{ id: string }>} */ (event).detail.id}; the app opens the task`));
    day.addEventListener('kp-dayline-drop', (event) => {
        const { id, start } = /** @type {CustomEvent<{ id: string, start: string }>} */ (event).detail;
        const task = waiting.find((one) => one.key === id);
        if (!task) return;
        waiting = waiting.filter((one) => one !== task);
        items = [...items, { id, label: task.title, start, minutes: 30 }];
        drawList();
        setDaylineItems(day, items, { allDay: ALL_DAY });
        say('pg-day-log', `kp-dayline-drop: ${id} at ${start}`);
    });
    on('state', (value, target) => {
        if (target !== day) return;
        if (value === 'ready') setDaylineItems(day, items, { allDay: ALL_DAY });
        if (value === 'empty') setDaylineItems(day, [], { allDay: [] });
        const words = { empty: ['Nothing has a time today', 'Give a task a start time, or drag one here from the list.'], error: ['Today could not be read', 'Habits did not answer. Nothing was changed.'] };
        const [title, text] = /** @type {Record<string, string[]>} */ (words)[value] ?? ['', ''];
        setDaylineState(day, /** @type {any} */ (value), title, { text });
    });
    day.addEventListener('kp-dayline-retry', () => {
        press('state', 'pg-day', 'ready');
        setDaylineItems(day, items, { allDay: ALL_DAY });
        setDaylineState(day, 'ready');
    });
}

// ---------------------------------------------------------------- 2 · swipe-row (Today's list)
const swipe = $('pg-swipe');
if (swipe) {
    const WORDS = /** @type {Record<string, string>} */ ({ done: 'Done', tomorrow: 'Moved to tomorrow', delete: 'Deleted' });
    const draw = () => swipe.replaceChildren(...TODAY.map((task) => row(task, { handle: false, menu: TODAY_MENU })));
    draw();
    attachSwipes(swipe);
    attachSettled(swipe);
    swipe.addEventListener('kp-swipe', (event) => {
        const { key, action, row: swiped } = /** @type {CustomEvent<{ key: string, action: string, row: HTMLElement }>} */ (event).detail;
        settleRow(swiped, WORDS[action] ?? action);
        say('pg-swipe-log', `kp-swipe: ${key} ${action}; the app runs it and shows its Undo toast`);
    });
    swipe.addEventListener('kp-menu-select', (event) => {
        const { value } = /** @type {CustomEvent<{ value: string }>} */ (event).detail;
        const picked = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('.kp-task-row') : null);
        if (picked) settleRow(picked, WORDS[value] ?? value);
        say('pg-swipe-log', `⋯ menu: ${picked?.dataset.kpRowKey ?? ''} ${value}, the same as the swipe`);
    });
    on('pointers', (value, target) => target?.setAttribute('data-kp-swipe-pointers', value));
    on('swipe-rows', (value) => {
        draw();
        const first = /** @type {HTMLElement | null} */ (swipe.firstElementChild);
        if (value === 'swiped' && first) settleRow(first, WORDS.done);
        say('pg-swipe-log', value === 'swiped' ? 'The first row as a swipe to the right leaves it: settled as Done.' : 'The four rows are back.');
    });
}
