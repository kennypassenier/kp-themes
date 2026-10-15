// research/leftover-looks: the deco menus. The package's own js/menu-button.js opens and closes them; this
// file does two things the package does not:
//   1. stands in for the proposed hook: when a menu of the "under the button" bar opens, it writes where the
//      button's centre falls on the menu as --kp-menu-anchor-x (js/menu-button.js would do this in placeMenu(),
//      after it has put the menu where it goes);
//   2. drives the page's own buttons (open the menus at the start, middle or end of the bars, hold the draw).
import { closeMenu, openMenu, setMenu } from '../../js/menu-button.js';

const note = document.querySelector('[data-lo-motion]');
if (note instanceof HTMLElement && matchMedia('(prefers-reduced-motion: reduce)').matches) note.hidden = false;

const PLACES = ['start', 'middle', 'end'];

// The rich menu every button opens: entries over a one-line hint, as the dashboard's "More".
const GROUPS = [
    {
        group: '',
        items: [
            { label: 'Export readings', hint: 'The last 24 hours, as a file' },
            { label: 'Schedule a visit', hint: 'Book the next inspection' },
            { label: 'Mute alarms', hint: 'For one hour' },
            { label: 'Open the log', hint: 'This week, line by line' },
        ],
    },
];
for (const wrapper of document.querySelectorAll('[data-lo-stage="deco"] [data-kp-menu-button]')) setMenu(wrapper, GROUPS);
/** The cove and the bead the inlay turns at: the origin stays on the straight part of the top edge. */
const EDGE = 14;

/** @param {string} place */
const wrappersAt = (place) => [...document.querySelectorAll(`[data-lo-stage="deco"] [data-kp-menu-button][data-lo-position="${place}"]`)];

/** Where the button's centre falls on the open menu, in px from the menu's start edge. @param {Element} wrapper */
function writeAnchor(wrapper) {
    const button = wrapper.querySelector(':scope > button');
    const menu = wrapper.querySelector(':scope > [role="menu"]');
    if (!(button instanceof HTMLElement) || !(menu instanceof HTMLElement)) return;
    const b = button.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const x = Math.min(Math.max(b.left + b.width / 2 - m.left, EDGE), Math.max(m.width - EDGE, EDGE));
    menu.style.setProperty('--kp-menu-anchor-x', `${Math.round(x * 10) / 10}px`);
}

document.addEventListener('kp-menu-open', (event) => {
    const wrapper = event.target;
    if (wrapper instanceof Element && wrapper.closest('[data-lo-bar="anchor"]')) writeAnchor(wrapper);
});

/** @param {string} place @param {boolean} on */
function pressPlace(place, on) {
    for (const button of document.querySelectorAll(`[data-lo-open="${place}"]`)) button.setAttribute('aria-pressed', String(on));
}

/** @param {string} place */
function openAt(place) {
    for (const wrapper of wrappersAt(place)) openMenu(wrapper, { focus: 'none' });
    pressPlace(place, true);
}

/** @param {string} place */
function closeAt(place) {
    for (const wrapper of wrappersAt(place)) closeMenu(wrapper);
    pressPlace(place, false);
}

// A menu closed by Escape or by a click elsewhere un-presses its button.
document.addEventListener('kp-menu-close', (event) => {
    const wrapper = event.target;
    if (!(wrapper instanceof HTMLElement)) return;
    const place = wrapper.dataset.loPosition;
    if (place && !wrappersAt(place).some((w) => w.querySelector(':scope > button')?.getAttribute('aria-expanded') === 'true')) pressPlace(place, false);
});

let next = 0;
document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const open = target?.closest('[data-lo-open]');
    if (open instanceof HTMLElement) {
        const place = open.dataset.loOpen ?? '';
        // The click outside a menu has already closed the menus (js/menu-button.js), so the button's own state says what it was.
        if (open.getAttribute('aria-pressed') === 'true') closeAt(place);
        else {
            for (const other of PLACES) if (other !== place) closeAt(other);
            openAt(place);
        }
        return;
    }
    const hold = target?.closest('[data-lo-hold]');
    if (hold instanceof HTMLElement) {
        const on = hold.getAttribute('aria-pressed') !== 'true';
        for (const button of document.querySelectorAll('[data-lo-hold]')) button.setAttribute('aria-pressed', String(on));
        for (const stage of document.querySelectorAll('[data-lo-stage="deco"]')) {
            if (on) stage.setAttribute('data-lo-held', '');
            else stage.removeAttribute('data-lo-held');
        }
        return;
    }
    // "Next place": the review dialog's play loop presses it, open then close, and it goes on to the next place each time.
    const cycle = target?.closest('[data-lo-next]');
    if (cycle instanceof HTMLElement) {
        const place = PLACES[next % PLACES.length] ?? 'start';
        if (cycle.getAttribute('aria-expanded') === 'true') {
            closeAt(place);
            next += 1;
            cycle.setAttribute('aria-expanded', 'false');
        } else {
            for (const other of PLACES) closeAt(other);
            openAt(place);
            cycle.setAttribute('aria-expanded', 'true');
            cycle.textContent = `■ Close the ${place} menus`;
            return;
        }
        cycle.textContent = `▶ Open the ${PLACES[next % PLACES.length]} menus`;
    }
});
