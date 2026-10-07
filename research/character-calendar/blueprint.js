// research/character-calendar, blueprint: the three things the calendar's own
// markup cannot say in CSS. Loading is ONE pen over the whole month (the grid's
// outline, then the place of every day's reading, in reading order); the month
// arrives read out on its scales (the register's own `[data-kp-arriving]`); and
// every day's reading, the share of its services backed up, is put on the
// scale of its cell for the pointer (--bpd-at), from its count. The pictures are
// the register's (css/blueprint-register.css); see ../character-shared/.
import { arrive, loading } from '../character-shared/blueprint.js';

loading({ scene: '[data-cl] .kp-calendar__grid', busy: '[aria-busy="true"]', places: '.kp-calendar__day:not([hidden])', outside: true });

/** Puts each day's reading on its scale: a count of 8/9 stands at 8 ninths of the ruler. */
const scale = (/** @type {Element} */ calendar) => {
    for (const day of calendar.querySelectorAll('.kp-calendar__day')) {
        const [, got, of] = /(\d+)\s*\/\s*(\d+)/.exec(day.querySelector('.kp-calendar__count')?.textContent ?? '') ?? [];
        if (of && Number(of) > 0) /** @type {HTMLElement} */ (day).style.setProperty('--bpd-at', String(Number(got) / Number(of)));
        else /** @type {HTMLElement} */ (day).style.removeProperty('--bpd-at');
    }
};

let queued = false;
const queue = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
        queued = false;
        document.querySelectorAll('[data-cl] .kp-calendar').forEach(scale);
    });
};

new MutationObserver((records) => {
    const grids = new Set();
    for (const r of records) {
        if (r.type !== 'attributes') continue;
        const el = /** @type {Element} */ (r.target);
        // A month that arrives (first drawn, or changed) and a month that stops loading.
        if (r.attributeName === 'data-cl-arrive' && el.hasAttribute('data-cl-arrive')) {
            const grid = el.querySelector('.kp-calendar__grid');
            if (grid && grid.getAttribute('aria-busy') !== 'true') grids.add(grid);
        }
        if (r.attributeName === 'aria-busy' && el.getAttribute('aria-busy') !== 'true') grids.add(el);
    }
    if (grids.size) for (const grid of grids) arrive([grid], { units: 3 });
    queue();
}).observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['data-cl-arrive', 'aria-busy'],
});
requestAnimationFrame(queue);
