// research/ux-touch-1101: the touch stage. A mouse cannot be a finger, so the Pointer switch puts `data-kp-touch` on the stage (the
// package's own switch for the touch layout); Show hit areas tints the invisible areas; the line under the stage counts, as a finger
// the targets whose hit area is under 44 px: a target's box grown by its invisible `::after` area, or its label's (uptime cells in
// height only: their row opens the nearest one). It reads the boxes and never scrolls, so the review dialog stays where it is.

import { setUptime } from '../../js/uptime.js';
import { on, say, settle } from './controls.js';

const STAGE = 'touch-targets-component';
const TARGETS = 'a[href], button, input:not([type=hidden]), select, textarea, [role=radio], [role=switch]';

/** 48 hourly periods ending now, one of them down. */
const hours = () =>
    Array.from({ length: 48 }, (_, i) => {
        const hour = `${String((i + 9) % 24).padStart(2, '0')}:00`;
        const down = i === 30;
        return {
            key: `h${i}`,
            label: hour,
            state: /** @type {'up' | 'down'} */ (down ? 'down' : 'up'),
            uptime: down ? 0.4 : 1,
            incidents: down ? 1 : 0,
            details: down ? ['Three probes failed in a row', `Back up at ${hour.slice(0, 2)}:40`] : ['No probe failed', 'Median answer 38 ms'],
        };
    });

/** @param {boolean} touch */
function drawUptime(touch) {
    const strip = document.getElementById('pg-t-uptime');
    if (!strip) return;
    strip.toggleAttribute('data-kp-uptime-row-tap', touch);
    setUptime(strip, { label: 'jellyfin', periods: hours(), ...(touch ? { open: /** @type {const} */ ('info') } : {}) });
}

/** The element a probe counts as the target: a hidden native control is counted by its label. @param {HTMLElement} el */
function hitOf(el) {
    const box = el.getBoundingClientRect();
    if (box.width > 2 && box.height > 2) return el;
    const label = /** @type {HTMLInputElement} */ (el).labels?.[0] ?? el.closest('label');
    return label instanceof HTMLElement ? label : null;
}

/** The box an element takes the pointer in: its own box grown by its `::after` hit area, when it has one. @param {Element} el */
function areaOf(el) {
    const box = el.getBoundingClientRect();
    const after = getComputedStyle(el, '::after');
    const area = { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
    if (after.content === 'none' || after.position !== 'absolute') return area;
    const own = getComputedStyle(el);
    const [top, right, bottom, left] = [after.top, after.right, after.bottom, after.left].map((v) => Number.parseFloat(v) || 0);
    area.left = Math.min(area.left, box.left + (Number.parseFloat(own.borderLeftWidth) || 0) + left);
    area.top = Math.min(area.top, box.top + (Number.parseFloat(own.borderTopWidth) || 0) + top);
    area.right = Math.max(area.right, box.right - (Number.parseFloat(own.borderRightWidth) || 0) - right);
    area.bottom = Math.max(area.bottom, box.bottom - (Number.parseFloat(own.borderBottomWidth) || 0) - bottom);
    return area;
}

/** Whether a target's hit area (its own, or its label's) is at least 44 px each way; an uptime cell's in height only. @param {HTMLElement} el */
function wide(el) {
    // A label takes the press for its control; a quantity's box puts the caret in its number.
    const labels = [.../** @type {HTMLInputElement} */ (el).labels ?? [], el.closest('label'), el.closest('.kp-quantity__field')].filter((l) => l instanceof Element);
    const areas = [areaOf(el), ...labels.map(areaOf)];
    const size = (/** @type {'x' | 'y'} */ axis) => Math.max(...areas.map((a) => (axis === 'x' ? a.right - a.left : a.bottom - a.top)));
    const floor = 43.5;
    return size('y') >= floor && (el.classList.contains('kp-uptime__cell') || size('x') >= floor);
}

/** Count the stage's targets and how many have a hit area under 44 px. @param {HTMLElement} stage */
function count(stage) {
    const seen = new Set();
    let small = 0;
    for (const found of /** @type {NodeListOf<HTMLElement>} */ (stage.querySelectorAll(TARGETS))) {
        if (/** @type {HTMLButtonElement} */ (found).disabled || !found.checkVisibility()) continue;
        const el = hitOf(found);
        if (!el || seen.has(el)) continue;
        seen.add(el);
        const ok = wide(el);
        // Shown with the hit areas: a target still under 44 px is ringed.
        el.toggleAttribute('data-pg-small', !ok);
        if (!ok) small += 1;
    }
    return { total: seen.size, small };
}

/** @param {HTMLElement | null} stage */
async function report(stage) {
    if (!stage) return;
    await settle();
    const { total, small } = count(stage);
    const touch = stage.hasAttribute('data-kp-touch');
    say('pg-touch-log', `${touch ? 'Touch' : 'Mouse'}: ${small} of ${total} targets in this stage have a hit area under 44 px.`);
}

on('pointer', (value, stage) => {
    stage?.toggleAttribute('data-kp-touch', value === 'touch');
    drawUptime(value === 'touch');
    void report(stage);
});
on('hits', (value, stage) => stage?.toggleAttribute('data-pg-hits', value === 'on'));
drawUptime(false);
// The first count once the package has drawn the stage's parts.
window.addEventListener('load', () => setTimeout(() => void report(document.getElementById(STAGE)), 300));
