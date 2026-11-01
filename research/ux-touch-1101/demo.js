// research/ux-touch-1101: the page's own wiring. Every component is the package's; this file fills the board with the Habits app's
// data (data.js) and wires each section's controls by that section's own elements, so a section works on any page that shows it:
// the board's log, the secret field's measured row, the documentation window's menu. The touch stage is demo-touch.js.

import { buildTaskRow } from '../../js/task-row.js';
import { attachBoards } from '../../js/board.js';
import { attachContextMenus } from '../../js/context-menu.js';
import { $, on, say, settle } from './controls.js';
import { BOARD, menuOf } from './data.js';
import './demo-touch.js';

// ---------------------------------------------------------------- 1 · the board on a phone
const board = document.getElementById('pg-board');
/** The title of a card by its key. @param {string} key */
const titleOf = (key) => document.querySelector(`[data-kp-row-key="${CSS.escape(key)}"]`)?.getAttribute('data-kp-label') ?? key;
if (board) {
    for (const lane of BOARD) {
        // A div, not a section: the review page judges every section with an id, and a lane gets one.
        const el = document.createElement('div');
        el.dataset.kpBoardLane = lane.key;
        el.dataset.kpBoardLabel = lane.label;
        el.dataset.kpTone = String(lane.tone);
        if (lane.limit) el.dataset.kpBoardLimit = String(lane.limit);
        const list = document.createElement('ul');
        list.setAttribute('data-kp-reorder', '');
        list.append(...lane.cards.map((task) => buildTaskRow(document, { ...task, menu: menuOf(task), handle: true })));
        el.append(list);
        board.append(el);
    }
    attachBoards(board.parentElement ?? document);
    attachContextMenus(board);
    board.addEventListener('kp-reorder', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        if (d.fromList && d.fromList !== d.toList) say('pg-board-log', `kp-reorder: “${titleOf(d.id)}” from ${d.fromList} to ${d.toList}, place ${d.to + 1}.`);
    });
    board.addEventListener('kp-menu-select', (event) => {
        const value = String(/** @type {CustomEvent} */ (event).detail?.value ?? '');
        if (!value.startsWith('kp-board-move:')) say('pg-board-log', `Picked “${value}” (the app’s own entry; the page would act on it).`);
    });
}

// ---------------------------------------------------------------- 2 · the secret field keeps its height
const secret = document.getElementById('pg-secret');
if (secret) {
    const under = $('pg-secret-under');
    let rest = under.getBoundingClientRect().top - secret.getBoundingClientRect().top;
    /** Where the row under the field stands against the field's own top, against where it stood at rest. */
    const measure = async (/** @type {string} */ what) => {
        await settle();
        const now = under.getBoundingClientRect().top - secret.getBoundingClientRect().top;
        say('pg-secret-log', `${what}: the row under the field moved ${Math.round((now - rest) * 10) / 10} px.`);
    };
    secret.addEventListener('kp-secret', (event) => void measure(/** @type {CustomEvent} */ (event).detail.shown ? 'Shown' : 'Hidden'));
    on('secret-wrap', (value) => {
        if (value === 'wrap') secret.setAttribute('data-kp-secret-wrap', 'wrap');
        else secret.removeAttribute('data-kp-secret-wrap');
        requestAnimationFrame(() => {
            rest = under.getBoundingClientRect().top - secret.getBoundingClientRect().top;
            say('pg-secret-log', value === 'wrap' ? 'Wrap: press Reveal; the long token wraps inside two lines.' : 'One line: press Reveal.');
        });
    });
    say('pg-secret-log', 'Press Reveal: the line here says how far the row under the field moves.');
}

// ---------------------------------------------------------------- 4 · the documentation on a phone
const docs = /** @type {HTMLIFrameElement | null} */ (document.getElementById('pg-docs'));
if (docs) {
    const inner = () => docs.contentDocument;
    const report = () => {
        const doc = inner();
        const h1 = doc?.querySelector('main h1');
        if (!doc || !h1) return;
        const open = doc.querySelector('.sc-nav__launcher button')?.getAttribute('aria-expanded') === 'true';
        say('pg-docs-log', `The page’s title starts ${Math.round(h1.getBoundingClientRect().top + (doc.defaultView?.scrollY ?? 0))} px from the top; the navigation is ${open ? 'open over the page' : 'folded behind the menu button'}.`);
    };
    docs.addEventListener('load', () => {
        // The window follows the review's theme.
        inner()?.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') ?? 'formal');
        setTimeout(report, 400);
    });
    // The published review (/review/ or /review-branch/) carries no site/: the documentation lives one level up, beside it.
    // Kenny opened the section on the Agenda and the window showed a 404 [uxtouch-1101 docs-nav].
    const docsSrc = () => {
        const src = docs.dataset.pgSrc ?? '';
        return /\/review(-branch)?\/research\//.test(location.pathname) ? `../${src}` : src;
    };
    window.addEventListener('load', () => docs.setAttribute('src', docsSrc()), { once: true });
    on('docs-menu', (value) => {
        const button = /** @type {HTMLElement | null | undefined} */ (inner()?.querySelector('.sc-nav__launcher button'));
        if ((value === 'open') !== (button?.getAttribute('aria-expanded') === 'true')) button?.click();
        setTimeout(report, 600);
    });
}
