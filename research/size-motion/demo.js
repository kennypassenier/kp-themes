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
    formal: ['Folded up like a letter, from the bottom edge to the top.', 'A red VOID stamp thuds onto it, then the voided entry fades.'],
    light: ['Lifted up and out of the page.', 'A beam of sunlight sweeps across and bleaches away everything it passes.'],
    dark: ['It sinks into the dark.', 'The lights go out around it until a pinpoint is left, then that goes out too.'],
    cyberpunk: [
        'Derezzed: colours shift, it skews and breaks up.',
        'The colour channels tear apart, a DELETED tag flickers over it, and it drops off the feed.',
    ],
    synthwave: ['It sinks into the sunset, colours shifting.', 'It tips back onto the neon grid and races to the vanishing point.'],
    pastel: ['A balloon let go: it floats up with a little tilt.', 'It swells like a bubble and pops into confetti.'],
    terminal: ['Cleared from the top, line by line.', 'A block cursor backs up over the line, deleting it character by character.'],
    forest: ['It withers: browns, shrinks and fades.', 'It turns to autumn, and its leaves come loose and drift down.'],
    'high-contrast': [
        'Announced: a bold caption, the way a screen reader would say it, REMOVED in ink on yellow, is laid across it; then it is gone in one step.',
        'Braille: its text turns into raised dots, the way it would read under a fingertip, and the dots go out row by row.',
        'Focus moves on: the thick keyboard focus ring locks onto it, then the element closes to the centre inside it, the way focus jumps to the next element.',
    ],
    sepia: ['It fades like an old photograph.', 'The iris of an old film closes on it, like the end of a reel.'],
    blueprint: ['Erased from left to right at an even pace.', 'Hatched out like a wall marked for demolition on a plan, then lifted off the sheet.'],
    solstice: ['It rises like morning mist.', 'An eclipse: a dark disc with a glowing corona crosses it and takes the light.'],
    brutalism: ['Slammed out to the left in two hard steps.', 'A huge black cross slams onto it, then it falls off in two hard steps.'],
    deco: ['A curtain closing from both sides to the centre.', 'Gold sunburst rays fan out from its foot, then it folds shut into them like a fan.'],
    phantom: ['It rises into mist.', 'It becomes a ghost: see-through and wavering, it rises out of its place and dissolves.'],
    'shade-light': ['Lifted off the page: its shadow grows, then it fades.', 'Its own shadow grows under it and swallows it whole.'],
    retro: ['It falls off the screen in four pixel steps.', 'PAC-MAN comes in from the left and eats it.'],
    grotesk: ['Shoved out to the right in three hard steps.', 'A thick censor bar is slapped across it in three moves, then it is ripped away.'],
    lapis: ['It sinks into deep blue.', 'Gold leaf is laid over it with a shimmer, then the gilded piece flakes away.'],
    nostromo: ['The phosphor glows up and fades out.', 'MOTHER types her verdict over it, ENTRY PURGED, and the line goes dark.'],
    titanium: ['It slides down a rail at an even pace.', 'A steel shutter rolls down over it, slat by slat, and locks.'],
    'shade-dark': ['Lifted off the page: its shadow grows, then it fades.', 'Its own shadow grows under it and swallows it whole.'],
};

// Round seven: the nine themes sent back show three new exits each.
const ROUND7 = {
    cyberpunk: [
        'Your exit 3 without the tag, as the classic glitch: the text turns neon blue, a cyan copy jumps right and up while a magenta copy jumps right and down, it jitters and is sliced away.',
        'Slice shift: it is cut into bands that slide past each other, the colour drifting, until the bands run out.',
        'Signal lost: the colour channels pull apart, scan noise rolls over it, and it collapses to a bright line that cuts out.',
    ],
    synthwave: [
        'Your exit 3, reworked: it tips back onto the neon grid around its own foot and fades as it lies flat, in its own place; nothing moves over the element above.',
        'Sunset: the striped retro sun rises behind it from below, its bands widening until the element is gone in the glow.',
        'Outrun: it turns into its neon outline and races off to the right inside its own lane, light streaks trailing.',
    ],
    terminal: [
        'Your exit 3, reworked: the block cursor glides back over the line in one fluent sweep, deleting it as it goes, in under half a second.',
        'Line feed: it rolls up out of its line, bottom first, with a phosphor afterglow.',
        'Clear: a bright scan beam sweeps down over it and leaves the line empty behind it.',
    ],
    'high-contrast': [
        'Announced: a bold caption, the way a screen reader would say it, REMOVED in ink on yellow, is laid across it; then it is gone in one step.',
        'Braille: its text turns into raised dots, the way it would read under a fingertip, and the dots go out row by row.',
        'Focus moves on: the thick keyboard focus ring locks onto it, then the element closes to the centre inside it, the way focus jumps to the next element.',
    ],
    sepia: [
        'Your 1 and 2 together: the page turns up and over away from you while it fades to an old photograph.',
        'Burned: the edges brown and char inward like paper held to a candle, until nothing is left.',
        'Torn out: a ragged tear runs across it and the scrap is pulled off the page.',
    ],
    phantom: [
        'Your exit 3, faster: see-through and wavering, it rises a little and dissolves, now in 650 ms and within its own place.',
        'Possessed: it flickers twice in a violet glow, then stretches into a blur and is gone.',
        'Through the wall: it passes into an unseen wall, fading from its leading edge, a faint trail behind.',
    ],
    grotesk: [
        'Headline: a big word, GONE, slams across it in two hard moves, then the whole block is gone.',
        'Cut on the diagonal: three hard cuts slice it down to a sliver, like a poster trimmed with a guillotine.',
        'Colour bands: three flat bands, accent, ink and paper, sweep across like a Swiss poster and take it with them.',
    ],
    lapis: [
        'Your exit 3, much faster: gold leaf is laid over it with one shimmer, then the gilded piece flakes off from the corner, in 550 ms.',
        'Lapis dust: it deepens to lapis blue flecked with gold, then crumbles to nothing.',
        'Inlay: its gold frame thickens inward until it covers it whole, then it is gone.',
    ],
    titanium: [
        'Anodised: it runs through the colours titanium takes under heat, gold, violet, blue, and cools away.',
        'Machined: a cutting line runs down it, turning it to brushed metal behind it, and the plate drops into its slot.',
        'Bolted plate: four bolts are set in its corners, then the plate slides out along its rail with a precise mechanical ease.',
    ],
};
for (const [name, [one, two, three]] of Object.entries(ROUND7)) {
    /** @type {Record<string, string>} */ (LEAVE)[name] = one;
    /** @type {Record<string, string[]>} */ (EXITS)[name] = [two, three];
}

// The leave section's choices say what each option does; the exits in each
// theme's own words (Kenny, 2026-10-04: "leg duidelijker uit wat het verschil
// tussen opties is"). Set before the review kit reads them.
const leaveSection = /** @type {HTMLElement | null} */ (document.querySelector('[data-review-item="leave"]'));
if (leaveSection) {
    const choices = JSON.parse(leaveSection.dataset.reviewChoices || '[]');
    const names = THEMES.map((t) => t.name);
    const exitHints = (/** @type {number} */ n) =>
        Object.fromEntries(
            names.map((name) => [
                name,
                n === 0 ? /** @type {Record<string, string>} */ (LEAVE)[name] : /** @type {Record<string, string[]>} */ (EXITS)[name]?.[n - 1],
            ]),
        );
    const HINTS = {
        together: 'The space starts closing while the exit is still playing: quicker, but the closing squeezes part of the exit.',
        after: 'The exit plays out in full on its own; only then does the space close and the card shrink.',
        pause: 'As after the exit, with a short empty moment (150 ms) between the exit and the closing.',
        ghost: 'A copy plays the exit on top while the space closes underneath at the same moment: the exit is never squeezed, and it is the quickest.',
        1: 'Each element finishes its exit before the next one starts: nine rows take 10.4 s at full speed.',
        0.5: 'The next one starts when the one before is halfway: nine rows take 6.3 s at full speed.',
    };
    for (const choice of choices)
        for (const [n, option] of choice.options.entries()) {
            if (choice.id === 'exit') option.hints = exitHints(n);
            else option.hint = /** @type {Record<string, string>} */ (HINTS)[option.value];
        }
    leaveSection.dataset.reviewChoices = JSON.stringify(choices);
}

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
        const exits = /** @type {Record<string, string[]>} */ (EXITS)[name];
        if (item === 'leave' && leaves && exits)
            copy.innerHTML = `${base}<br /><b>Exit 1:</b> ${leaves}<br /><b>Exit 2:</b> ${exits[0]}<br /><b>Exit 3:</b> ${exits[1]}`;
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

// The leave section closes its space when the pressed button says.
const timingButtons = [...document.querySelectorAll('[data-sm-exit-timing]')];
const applyExitTiming = (/** @type {string} */ value) => {
    for (const b of timingButtons) b.setAttribute('aria-pressed', String(b.getAttribute('data-sm-exit-timing') === value));
    for (const col of document.querySelectorAll('[data-sm-exit]')) {
        const style = /** @type {HTMLElement} */ (col).style;
        style.setProperty('--kp-leave-fold', value === 'pause' ? 'after' : value);
        style.setProperty('--kp-leave-pause', value === 'pause' ? '150ms' : '0ms');
    }
};
for (const b of timingButtons) b.addEventListener('click', () => applyExitTiming(b.getAttribute('data-sm-exit-timing') ?? 'after'));
applyExitTiming('together');

// Remove all at once: each exit in full, or the next starting halfway.
const staggerButtons = [...document.querySelectorAll('[data-sm-stagger]')];
const applyStagger = (/** @type {string} */ value) => {
    for (const b of staggerButtons) b.setAttribute('aria-pressed', String(b.getAttribute('data-sm-stagger') === value));
    for (const col of document.querySelectorAll('[data-sm-exit]')) /** @type {HTMLElement} */ (col).style.setProperty('--kp-leave-stagger', value);
};
for (const b of staggerButtons) b.addEventListener('click', () => applyStagger(b.getAttribute('data-sm-stagger') ?? '1'));
applyStagger('0.5');

// Slow motion for judging (Kenny, 2026-10-04: "zet is een optie om alles op
// 1/4 snelheid te kunnen afspelen"): every animation on the page, CSS or
// scripted, plays at a quarter while the toggle is on; remembered per viewer.
const speedButtons = [...document.querySelectorAll('[data-sm-speed]')];
// A quarter by default, so the detail can be seen (Kenny, 2026-10-04: "maak
// de demo standaard nog trager, ik wil het in detail kunnen zien").
let rate = 0.25;
try {
    const kept = Number(localStorage.getItem('sm-speed'));
    if (kept > 0) rate = kept;
} catch {
    // No storage: start at a quarter.
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
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-sm-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-sm-speed'));
        try {
            localStorage.setItem('sm-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();

// Each exit card names what it does in the theme on screen.
const describeExits = () => {
    const name = document.documentElement.getAttribute('data-theme') ?? 'formal';
    const exits = /** @type {Record<string, string[]>} */ (EXITS)[name] ?? [];
    const texts = [/** @type {Record<string, string>} */ (LEAVE)[name], ...exits];
    for (const el of document.querySelectorAll('[data-sm-exit-desc]')) el.textContent = texts[Number(el.getAttribute('data-sm-exit-desc')) - 1] ?? '';
};
new MutationObserver(() => {
    describeExits();
    // The exit ticked for one theme says nothing about the next.
    for (const col of document.querySelectorAll('.sm-picked')) col.classList.remove('sm-picked');
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
describeExits();

// What is ticked in the review dialog is what the page shows.
document.querySelector('[data-review-item="leave"]')?.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    if (id === 'space') applyExitTiming(value);
    if (id === 'stagger') applyStagger(value);
    if (id === 'exit')
        for (const col of document.querySelectorAll('[data-sm-exit]')) col.classList.toggle('sm-picked', col.getAttribute('data-sm-exit') === value);
});
