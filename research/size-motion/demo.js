// research/size-motion, round two: the proposal side runs the package's own
// js/motion.js in every theme; the "Package today" side runs nothing.

import { THEMES } from '../../js/theme-registry.js';
import { attachMotion, closeDialog, easeSize, themeMotion } from '../../js/motion.js';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-sm-motion]')?.removeAttribute('hidden');

/** Round four: what each re-drawn theme's growing and shrinking is meant to feel like. */
const CHARACTER = {
    formal: 'A ledger: a fine frame is ruled around the box while it changes, and a new line is written in from left to right, like ink.',
    light: 'Daylight: the box brightens a touch while it opens up, and new content blooms in out of the glare.',
    dark: 'The darkroom: the oxide halo glows while the box changes, and new content develops from a pale print to full contrast.',
    synthwave: 'Neon: the edge burns pink and cyan while it moves, and new rows race in from the left, leaning into the speed.',
    'high-contrast':
        'Clarity first: the box changes in two plain steps behind a bold outline, and whatever arrives is outlined once so the eye finds it.',
    sepia: 'Paper: the box unrolls with a curl of shadow under its edge, and a new line turns down like a page.',
    blueprint:
        "The drawing: a dashed dimension frame stands off the box while it is measured anew, and new lines are plotted top down at the plotter's even pace.",
    solstice: 'Dawn: a warm light rises under the box as it grows, and new content rises into it, still bright from the sun.',
    'shade-light':
        "The shadow: the box's shadow lengthens as if it were lifted to be resized and settles back, and new rows come up out of their own shadow.",
    'shade-dark':
        "The shadow: the box's shadow lengthens as if it were lifted to be resized and settles back, and new rows come up out of their own shadow.",
    grotesk: 'The cut: the box jumps in three hard cuts behind a heavy rule, and a new line is cut in from the left in three.',
    lapis: 'The burnish: the box catches the gold while it moves, and new content arrives gilded and cools to its own colour.',
    nostromo: "The ship's terminal, in amber: the box moves a line at a time inside a glowing amber frame, and a new line prints with a scan.",
    titanium: 'The machine: the box runs at an even, mechanical pace inside a fine machined edge, and new content slides in like a drawer.',
};

// One note per section serves every theme: the review dialog reads a note
// per theme, so formal's is copied to the other twenty-one, and the two
// growing sections add the theme's character where it was re-drawn.
for (const look of document.querySelectorAll('[data-review-look]')) {
    const note = look.querySelector('[data-for="formal"]');
    if (!note) continue;
    const item = look.closest('[data-review-item]')?.getAttribute('data-review-item') ?? '';
    const grows = item === 'dialog-grow' || item === 'card-grow';
    const base = note.innerHTML;
    for (const { name } of THEMES) {
        const copy = name === 'formal' ? note : /** @type {HTMLElement} */ (note.cloneNode(true));
        copy.setAttribute('data-for', name);
        const character = /** @type {Record<string, string>} */ (CHARACTER)[name];
        if (grows && character) copy.innerHTML = `${base}<br /><b>This theme's character:</b> ${character}`;
        if (copy !== note) {
            copy.hidden = true;
            look.append(copy);
        }
    }
}

/** The theme's timing, shown in the intro and refreshed when the theme changes. */
const timing = document.querySelector('[data-sm-timing]');
const showTiming = () => {
    if (!timing) return;
    const { open, close, size, ease } = themeMotion();
    timing.textContent = open
        ? `opens in ${Math.round(open)} ms, closes in ${Math.round(close)} ms, resizes in ${Math.round(size)} ms, on ${ease}`
        : 'this theme has no dialog entrance, so nothing moves';
};
// The register arrives after the theme attribute changes; read once it has.
new MutationObserver(() => setTimeout(showTiming, 300)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
addEventListener('load', showTiming);

/** How much slower everything plays: 4 for the "¼ speed" buttons. */
let slow = 1;
const setSlow = (/** @type {number} */ n) => {
    slow = n;
    document.documentElement.style.setProperty('--kp-motion-scale', String(n));
};

/* --------------------------------------------------------- the rows */

let reading = 0;
const row = () => {
    reading += 1;
    const li = document.createElement('li');
    const bar = (1 + ((reading * 37) % 90) / 100).toFixed(2);
    li.innerHTML = `<span>02:${String(40 + (reading % 20)).padStart(2, '0')}</span><span>${bar} bar</span>`;
    return li;
};
/** @param {HTMLElement} list @param {string} what */
const changeRows = (list, what) => {
    if (what === 'clear') list.replaceChildren();
    else if (Number(what) < 0) list.lastElementChild?.remove();
    else for (let i = 0; i < Number(what); i += 1) list.append(row());
};

/* ------------------------------------------------------- the dialogs */

/** @param {string} kind @param {'proposal' | 'today'} mode */
function openDialog(kind, mode) {
    const template = /** @type {HTMLTemplateElement} */ (document.querySelector(`[data-sm-template="${kind}"]`));
    const dialog = /** @type {HTMLDialogElement} */ (template.content.firstElementChild?.cloneNode(true));
    document.body.append(dialog);
    const proposal = mode === 'proposal';
    // Slow motion stretches the theme's own entrance too, so in and out are compared at one speed.
    if (slow > 1) dialog.style.setProperty('--kp-sig-dur', `calc(${getComputedStyle(dialog).getPropertyValue('--kp-sig-dur') || '300ms'} * ${slow})`);
    if (proposal) attachMotion(dialog);
    const close = () => (proposal ? closeDialog(dialog) : dialog.close());
    if (!proposal)
        dialog.addEventListener('cancel', (event) => {
            event.preventDefault();
            dialog.close();
        });
    dialog.addEventListener('click', (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target === dialog) {
            // A click on the backdrop lands on the dialog itself, outside its box.
            const box = dialog.getBoundingClientRect();
            const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
            if (!inside) void close();
        }
        if (target.closest('[data-sm-close]')) void close();
        const rows = target.closest('[data-sm-rows]');
        if (rows) changeRows(/** @type {HTMLElement} */ (dialog.querySelector('[data-sm-list]')), rows.getAttribute('data-sm-rows') ?? '');
    });
    dialog.addEventListener('close', () => {
        dialog.remove();
        setSlow(1);
    });
    dialog.showModal();
}

document.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.target).closest('[data-sm-dialog]');
    if (!button) return;
    setSlow(button.hasAttribute('data-sm-slow') ? 4 : 1);
    openDialog(button.getAttribute('data-sm-dialog') ?? 'close', /** @type {'proposal' | 'today'} */ (button.getAttribute('data-sm-mode')));
});

/* --------------------------------------------------------- the cards */

for (const col of document.querySelectorAll('[data-sm-card]')) {
    const card = /** @type {HTMLElement} */ (col.querySelector('.sm-card'));
    const list = /** @type {HTMLElement} */ (col.querySelector('[data-sm-list]'));
    const alert = /** @type {HTMLElement} */ (col.querySelector('[data-sm-alert]'));
    if (col.getAttribute('data-sm-card') === 'proposal') easeSize(card);
    col.addEventListener('click', (event) => {
        const act = /** @type {HTMLElement} */ (event.target).closest('[data-sm-card-act]')?.getAttribute('data-sm-card-act');
        if (act === 'alert') alert.hidden = !alert.hidden;
        if (act === 'load') changeRows(list, '6');
        if (act === 'clear') {
            changeRows(list, 'clear');
            alert.hidden = true;
        }
    });
}

/* -------------------------------------------- the accordion and tabs */

for (const el of document.querySelectorAll('[data-sm-accordion]')) attachMotion(el);

const PANELS = [
    ['Summary', 'Pressure on line 2 dropped to 1.1 bar at 02:40. The line is locked out at the manifold.'],
    [
        'Readings',
        'Sixty readings from the last hour; the gauge and the sensor agree within 0.05 bar. 02:00 2.31 bar, 02:10 2.29 bar, 02:20 2.30 bar, 02:30 1.84 bar, 02:40 1.10 bar, 02:50 1.08 bar. The drop began between 02:20 and 02:30, faster than the thirty-minute threshold, which is why the line locked itself out. The sensor on the manifold and the gauge at the pump agree throughout.',
    ],
    ['Handover', 'The night shift locked the line out at 02:45 and logged the tag number. The day shift reopens it after two readings agree.'],
];
for (const host of document.querySelectorAll('[data-sm-tabs]')) {
    const mode = host.getAttribute('data-sm-tabs');
    host.innerHTML = `
        <div class="kp-tabs__list" role="tablist" aria-label="Incident INC-4471 (${mode})">
            ${PANELS.map(([label], i) => `<button type="button" class="kp-tab" role="tab" id="sm-${mode}-tab-${i}" aria-controls="sm-${mode}-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`).join('')}
        </div>
        ${PANELS.map(([, text], i) => `<div class="kp-tabs__panel" role="tabpanel" id="sm-${mode}-panel-${i}" aria-labelledby="sm-${mode}-tab-${i}"${i === 0 ? '' : ' hidden'}>${text}</div>`).join('')}`;
    if (mode === 'proposal') attachMotion(host);
    host.addEventListener('click', (event) => {
        const tab = /** @type {HTMLElement} */ (event.target).closest('[role="tab"]');
        if (!tab) return;
        for (const t of host.querySelectorAll('[role="tab"]')) {
            const on = t === tab;
            t.setAttribute('aria-selected', String(on));
            t.setAttribute('tabindex', on ? '0' : '-1');
            /** @type {HTMLElement} */ (host.querySelector(`#${t.getAttribute('aria-controls')}`)).hidden = !on;
        }
    });
}
void slow;
