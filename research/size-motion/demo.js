// research/size-motion, round two: the proposal side runs the package's own
// js/motion.js in every theme; the "Package today" side runs nothing.

import { THEMES } from '../../js/theme-registry.js';
import { attachMotion, closeDialog, easeSize, leave, themeMotion } from '../../js/motion.js';

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

/** Round five: how each theme lets something leave. */
const LEAVE = {
    formal: 'Blotted out: the line is wiped away from its start, like a ledger entry ruled off.',
    light: 'It rises into the light and is gone in the glare.',
    dark: 'Overexposed: the print burns white and fades off the paper.',
    cyberpunk: 'Glitched out: it tears sideways in slices and drops from the feed.',
    synthwave: 'It races off to the right, leaning into the speed, with a neon streak behind it.',
    pastel: 'A soft bubble that swells a touch and pops.',
    terminal: 'Deleted from the end, a character at a time, like a held backspace.',
    forest: 'A leaf that lets go: it tips and drifts down.',
    'high-contrast': 'Outlined once so the eye sees what goes, then gone in one step.',
    sepia: 'The page is turned away, up and over.',
    blueprint: 'The plotter takes it back up, bottom to top, inside its dashed frame.',
    solstice: 'It sets like the sun: it sinks and dims into dusk.',
    brutalism: 'Dropped, in two hard steps, and gone.',
    deco: 'It closes like a fan, folding to its centre.',
    phantom: 'It dissolves into a ghost and drifts off.',
    'shade-light': 'It sinks back into its own shadow.',
    'shade-dark': 'It sinks back into its own shadow.',
    retro: 'Shrunk away in four pixel steps.',
    grotesk: 'Cut out from the left in three hard cuts.',
    lapis: 'It catches the gold one last time and fades.',
    nostromo: 'Switched off like the old monitor: it collapses to a glowing line, then the line goes out.',
    titanium: 'Pulled out like a drawer, at an even mechanical pace.',
};

// Options 2 and 3 per theme in the exit-options section (exits.css).
const EXITS = {
    formal: ['Folded up like a letter, from the bottom edge to the top.', 'The ink greys out and the line slides back into the margin.'],
    light: ['Lifted up and out of the page.', 'It brightens to white where it stands.'],
    dark: ['It sinks into the dark.', 'It slips left into shadow.'],
    cyberpunk: ['Derezzed: colours shift, it skews and breaks up.', 'A scanline wipes it from the top down.'],
    synthwave: ['It sinks into the sunset, colours shifting.', 'It turns to neon vapour and drifts away.'],
    pastel: ['A balloon let go: it floats up with a little tilt.', 'It melts down softly into the page.'],
    terminal: ['Cleared from the top, line by line.', 'It flickers twice and is gone.'],
    forest: ['It withers: browns, shrinks and fades.', 'Blown off by the wind, to the right.'],
    'high-contrast': ['Inverted for a moment, then gone.', 'Collapsed to a thick line, then gone.'],
    sepia: ['It fades like an old photograph.', 'Slid back into the book, like a page turned sideways.'],
    blueprint: ['Erased from left to right at an even pace.', 'It fades back to tracing paper, then is gone.'],
    solstice: ['It rises like morning mist.', 'An eclipse: a circle closes over it.'],
    brutalism: ['Slammed out to the left in two hard steps.', 'Cut in half, then gone.'],
    deco: ['A curtain closing from both sides to the centre.', 'A last gold flash, then it fades.'],
    phantom: ['It rises into mist.', 'It flickers like a ghost before vanishing.'],
    'shade-light': ['Lifted off the page: its shadow grows, then it fades.', 'Pressed flat into the page.'],
    retro: ['It falls off the screen in four pixel steps.', 'It blinks out like a lost life.'],
    grotesk: ['Shoved out to the right in three hard steps.', 'Cut away from the top in three cuts.'],
    lapis: ['It sinks into deep blue.', 'A gold sweep wipes it away from the left.'],
    nostromo: ['The phosphor glows up and fades out.', 'It scrolls off the top of the monitor.'],
    titanium: ['It slides down a rail at an even pace.', 'A shutter closes over it from the top.'],
    'shade-dark': ['Lifted off the page: its shadow grows, then it fades.', 'Pressed flat into the page.'],
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
        const leaves = /** @type {Record<string, string>} */ (LEAVE)[name];
        if (item.startsWith('leave') && item !== 'leave-exits' && leaves) copy.innerHTML = `${base}<br /><b>This theme's leave:</b> ${leaves}`;
        const exits = /** @type {Record<string, string[]>} */ (EXITS)[name];
        if (item === 'leave-exits' && leaves && exits)
            copy.innerHTML = `${base}<br /><b>Option 1:</b> ${leaves}<br /><b>Option 2:</b> ${exits[0]}<br /><b>Option 3:</b> ${exits[1]}`;
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

/* ------------------------------------------------- elements that leave */

const NOTICES = [
    ['kp-alert--warning', 'Pressure on line 2 dropped to 1.1 bar at 02:40.'],
    ['kp-alert--info', 'The night shift locked the line out at 02:45.'],
    ['kp-alert--destructive', 'Sensor 4 stopped reporting at 02:51.'],
    ['kp-alert--success', 'Line 1 is back within range.'],
];
for (const col of document.querySelectorAll('[data-sm-leave]')) {
    const proposal = col.getAttribute('data-sm-leave') !== 'today';
    const card = /** @type {HTMLElement} */ (col.querySelector('.sm-card'));
    const notices = /** @type {HTMLElement} */ (col.querySelector('[data-sm-notices]'));
    const list = /** @type {HTMLElement} */ (col.querySelector('[data-sm-leave-list]'));
    if (proposal) {
        easeSize(card);
        attachMotion(card);
    }
    const go = (/** @type {HTMLElement} */ el) => (proposal ? leave(el) : el.remove());
    const fill = () => {
        notices.replaceChildren(
            ...NOTICES.map(([kind, text]) => {
                const n = document.createElement('div');
                n.className = `kp-alert ${kind} sm-notice`;
                n.setAttribute('role', 'status');
                n.innerHTML = `<p>${text}</p><button type="button" class="kp-button kp-button--ghost kp-button--sm" data-sm-gone aria-label="Dismiss">✕</button>`;
                return n;
            }),
        );
        list.replaceChildren();
        for (let i = 0; i < 5; i += 1) {
            const li = row();
            li.insertAdjacentHTML(
                'beforeend',
                '<button type="button" class="kp-button kp-button--ghost kp-button--sm" data-sm-gone aria-label="Remove">✕</button>',
            );
            list.append(li);
        }
    };
    fill();
    col.addEventListener('click', (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        const gone = target.closest('[data-sm-gone]');
        if (gone) void go(/** @type {HTMLElement} */ (gone.parentElement));
        const act = target.closest('[data-sm-leave-act]')?.getAttribute('data-sm-leave-act');
        if (act === 'reset') fill();
        if (act === 'all') for (const el of [...notices.children, ...list.children]) void go(/** @type {HTMLElement} */ (el));
    });
}

// The exit-options section closes its space with the timing picked above it.
const exitTiming = /** @type {HTMLSelectElement | null} */ (document.querySelector('[data-sm-exit-timing]'));
const applyExitTiming = () => {
    if (!exitTiming) return;
    for (const col of document.querySelectorAll('[data-sm-exit]')) {
        const style = /** @type {HTMLElement} */ (col).style;
        style.setProperty('--kp-leave-fold', exitTiming.value === 'pause' ? 'after' : exitTiming.value);
        style.setProperty('--kp-leave-pause', exitTiming.value === 'pause' ? '150ms' : '0ms');
    }
};
exitTiming?.addEventListener('change', applyExitTiming);
applyExitTiming();

// Slow motion for judging (Kenny, 2026-10-04: "zet is een optie om alles op
// 1/4 snelheid te kunnen afspelen"): every animation on the page, CSS or
// scripted, plays at a quarter while the toggle is on; remembered per viewer.
const slowButton = document.querySelector('[data-sm-slow]');
let rate = 1;
try {
    if (localStorage.getItem('sm-slow') === '1') rate = 0.25;
} catch {
    // No storage: start at full speed.
}
const animate = Element.prototype.animate;
Element.prototype.animate = function (...args) {
    const a = animate.apply(this, /** @type {any} */ (args));
    a.playbackRate = rate;
    return a;
};
const slowNow = () => {
    for (const a of document.getAnimations()) if (a.playbackRate !== rate) a.playbackRate = rate;
};
const slowEachFrame = () => {
    slowNow();
    requestAnimationFrame(slowEachFrame);
};
document.addEventListener('animationstart', slowNow, { capture: true });
requestAnimationFrame(slowEachFrame);
const showSlow = () => {
    if (!slowButton) return;
    slowButton.setAttribute('aria-pressed', String(rate < 1));
    slowButton.textContent = rate < 1 ? 'Back to full speed' : 'Play everything at ¼ speed';
};
slowButton?.addEventListener('click', () => {
    rate = rate < 1 ? 1 : 0.25;
    try {
        localStorage.setItem('sm-slow', rate < 1 ? '1' : '0');
    } catch {
        // Not remembered; it still applies now.
    }
    showSlow();
});
showSlow();
