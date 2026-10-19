// research/app-homelab-activity: the History rows. This module runs before js/auto.js attaches the data table, so the table
// finds its rows when it is attached; demo.js imports the same instance and refills the table when a filter narrows it.
import { build, dayKeyOf, dayText, midnight, took, when, wall } from './data.js';

export const NOW = Date.now();
export const FLEET = build(NOW);

const OUTCOME = {
    done: ['Done', 'kp-badge--success'],
    failed: ['Failed', 'kp-badge--destructive'],
    running: ['Running', 'kp-badge--info'],
};

/** @param {string} s */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** "Today, 19/10/2026", "Yesterday, 18/10/2026", then the weekday and the date. @param {number} ms */
export function dayTitle(ms) {
    const days = Math.round((FLEET.today - ms) / 86_400_000);
    if (days === 0) return `Today, ${dayText(ms + 3_600_000)}`;
    if (days === 1) return `Yesterday, ${dayText(ms + 3_600_000)}`;
    const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const w = wall(ms + 12 * 3_600_000);
    return `${names[new Date(Date.UTC(w.y, w.m - 1, w.d)).getUTCDay()]}, ${dayText(ms + 3_600_000)}`;
}

/** The seconds an operation took, or has taken so far. @param {import('./data.js').Op} op */
export const secondsOf = (op) => ((op.end ?? NOW) - op.start) / 1000;

/** @param {import('./data.js').Op} op */
export const tookText = (op) => (op.state === 'running' ? `${took(secondsOf(op))} so far` : took(secondsOf(op)));

/**
 * The tbody for these operations: a heading row per day, then each operation with its (empty) detail row.
 * @param {import('./data.js').Op[]} ops newest first
 */
export function rowsHtml(ops) {
    let html = '';
    let day = '';
    for (const op of ops) {
        const key = dayKeyOf(op.start);
        if (key !== day) {
            day = key;
            const age = Math.floor((NOW - op.start) / 86_400_000);
            html += `<tr data-kp-row-group="${key}"${age >= 3 ? ' data-kp-folded' : ''}><th scope="rowgroup" colspan="6">${esc(dayTitle(midnight(op.start)))} <span class="kp-badge" data-kp-group-count></span></th></tr>`;
        }
        const [label, tone] = OUTCOME[op.state];
        html +=
            `<tr data-kp-row-key="${op.key}" data-kp-group-of="${key}">` +
            `<td data-label="Started" class="kp-numeric" data-kp-sort-value="${op.start}">${when(op.start)}</td>` +
            `<td data-label="Stack"><code class="kp-mono">${esc(op.stack)}</code></td>` +
            `<td data-label="Operation">${esc(op.action)}</td>` +
            `<td data-label="By">${esc(op.by)}</td>` +
            `<td data-label="Outcome"><span class="kp-badge ${tone}">${label}</span></td>` +
            `<td data-label="Took" class="kp-text-end kp-numeric" data-kp-sort-value="${Math.round(secondsOf(op))}">${tookText(op)}</td>` +
            `</tr><tr data-kp-row-detail hidden><td colspan="6"></td></tr>`;
    }
    return html;
}

/** @param {import('./data.js').Op[]} ops */
export function fillTable(ops) {
    const body = document.getElementById('hx-body');
    if (body) body.innerHTML = rowsHtml(ops);
}

fillTable(FLEET.ops);
