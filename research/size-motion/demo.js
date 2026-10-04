// The proposal behind research/size-motion: a dialog that leaves the way it
// came, and boxes that ease to a new size instead of jumping, growing or
// shrinking. Demo code: what Kenny approves here is what the package then
// builds into js/overlays.js and a small size helper.

const root = document.documentElement;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-sm-motion]')?.removeAttribute('hidden');

/** A theme knob in milliseconds, read from the element it applies to. */
const ms = (/** @type {Element} */ el, /** @type {string} */ name, /** @type {number} */ fallback) => {
    const raw = getComputedStyle(el).getPropertyValue(name).trim();
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return fallback;
    return raw.endsWith('ms') ? n : n * 1000;
};
const knob = (/** @type {Element} */ el, /** @type {string} */ name, /** @type {string} */ fallback) =>
    getComputedStyle(el).getPropertyValue(name).trim() || fallback;

/** How much slower everything plays: 4 for the "¼ speed" buttons. */
let slow = 1;

/* ------------------------------------------------------- size, eased */

/**
 * Ease `box` from its old height to its new one whenever its content
 * (`inner`) changes size, in both directions. A change during a glide
 * continues from where the box is.
 * @param {HTMLElement} box @param {HTMLElement} inner
 */
function smoothSize(box, inner) {
    let last = box.getBoundingClientRect().height;
    /** @type {Animation | null} */
    let running = null;
    new ResizeObserver(() => {
        const from = running ? box.getBoundingClientRect().height : last;
        running?.cancel();
        const to = box.getBoundingClientRect().height;
        last = to;
        if (reduced() || Math.abs(to - from) < 1 || !box.isConnected) return;
        box.style.overflow = 'clip';
        running = box.animate([{ height: `${from}px` }, { height: `${to}px` }], {
            duration: ms(box, '--kp-size-dur', 240) * slow,
            easing: knob(box, '--kp-size-ease', 'ease-out'),
        });
        const mine = running;
        mine.finished
            .then(() => {
                if (running === mine) {
                    running = null;
                    box.style.overflow = '';
                }
            })
            .catch(() => {});
    }).observe(inner);
}

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

/**
 * Close the way it opened, reversed: formal's sheet sinks the 14px it rose
 * and fades, with the backdrop fading along.
 * @param {HTMLDialogElement} dialog
 */
async function closeEased(dialog) {
    if (dialog.dataset.smClosing) return;
    if (reduced()) return dialog.close();
    dialog.dataset.smClosing = '1';
    const timing = {
        duration: ms(root, '--kp-close-dur', 200) * slow,
        easing: knob(root, '--kp-close-ease', 'ease-in'),
        fill: /** @type {const} */ ('forwards'),
    };
    const out = [
        dialog.animate(
            [
                { opacity: 1, transform: 'none' },
                { opacity: 0, transform: 'translateY(14px) scale(0.985)' },
            ],
            timing,
        ),
    ];
    try {
        out.push(dialog.animate([{ opacity: 1 }, { opacity: 0 }], { ...timing, pseudoElement: '::backdrop' }));
    } catch {
        /* an engine that cannot animate ::backdrop lets it go at the end */
    }
    await Promise.all(out.map((a) => a.finished.catch(() => {})));
    dialog.close();
    for (const a of out) a.cancel();
}

/** @param {string} kind @param {'proposal' | 'today'} mode */
function openDialog(kind, mode) {
    const template = /** @type {HTMLTemplateElement} */ (document.querySelector(`[data-sm-template="${kind}"]`));
    const dialog = /** @type {HTMLDialogElement} */ (template.content.firstElementChild.cloneNode(true));
    document.body.append(dialog);
    const proposal = mode === 'proposal';
    const close = () => (proposal ? closeEased(dialog) : dialog.close());
    dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        close();
    });
    dialog.addEventListener('click', (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target === dialog) {
            // A click on the backdrop lands on the dialog itself, outside its box.
            const box = dialog.getBoundingClientRect();
            const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
            if (!inside) close();
        }
        if (target.closest('[data-sm-close]')) close();
        const rows = target.closest('[data-sm-rows]');
        if (rows) changeRows(/** @type {HTMLElement} */ (dialog.querySelector('[data-sm-list]')), rows.getAttribute('data-sm-rows') ?? '');
    });
    dialog.addEventListener('close', () => {
        dialog.remove();
        slow = 1;
    });
    dialog.showModal();
    if (proposal && kind === 'grow') smoothSize(dialog, /** @type {HTMLElement} */ (dialog.querySelector('[data-sm-inner]')));
}

document.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.target).closest('[data-sm-dialog]');
    if (!button) return;
    slow = button.hasAttribute('data-sm-slow') ? 4 : 1;
    openDialog(button.getAttribute('data-sm-dialog') ?? 'close', /** @type {'proposal' | 'today'} */ (button.getAttribute('data-sm-mode')));
});

/* --------------------------------------------------------- the cards */

for (const col of document.querySelectorAll('[data-sm-card]')) {
    const card = /** @type {HTMLElement} */ (col.querySelector('.sm-card'));
    const inner = /** @type {HTMLElement} */ (col.querySelector('[data-sm-inner]'));
    const list = /** @type {HTMLElement} */ (col.querySelector('[data-sm-list]'));
    const alert = /** @type {HTMLElement} */ (col.querySelector('[data-sm-alert]'));
    if (col.getAttribute('data-sm-card') === 'proposal') smoothSize(card, inner);
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

/* ----------------------------------------------------- the accordion */

// The answer unfolds: the item eases from the summary's height to its open
// height and back. Closing waits for the fold before `open` goes away, so
// the answer is still there to fold.
for (const item of document.querySelectorAll('[data-sm-accordion] .kp-accordion__item')) {
    const details = /** @type {HTMLDetailsElement} */ (item);
    const summary = /** @type {HTMLElement} */ (details.querySelector('summary'));
    /** @type {Animation | null} */
    let running = null;
    summary.addEventListener('click', (event) => {
        if (reduced()) return;
        event.preventDefault();
        const from = details.getBoundingClientRect().height;
        running?.cancel();
        const opening = !details.open || details.dataset.smClosing === '1';
        delete details.dataset.smClosing;
        details.open = true;
        const full = details.getBoundingClientRect().height;
        const shut = summary.getBoundingClientRect().height + parseFloat(getComputedStyle(details).borderBottomWidth || '0');
        const to = opening ? full : shut;
        if (!opening) details.dataset.smClosing = '1';
        details.style.overflow = 'clip';
        running = details.animate([{ height: `${from}px` }, { height: `${to}px` }], {
            duration: ms(details, '--kp-size-dur', 240) * slow,
            easing: knob(details, '--kp-size-ease', 'ease-out'),
        });
        const mine = running;
        mine.finished
            .then(() => {
                if (running !== mine) return;
                running = null;
                details.style.overflow = '';
                if (details.dataset.smClosing === '1') {
                    details.open = false;
                    delete details.dataset.smClosing;
                }
            })
            .catch(() => {});
    });
}

/* ---------------------------------------------------------- the tabs */

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
        <div data-sm-tabs-box><div data-sm-inner>
            ${PANELS.map(([, text], i) => `<div class="kp-tabs__panel" role="tabpanel" id="sm-${mode}-panel-${i}" aria-labelledby="sm-${mode}-tab-${i}"${i === 0 ? '' : ' hidden'}>${text}</div>`).join('')}
        </div></div>`;
    const box = /** @type {HTMLElement} */ (host.querySelector('[data-sm-tabs-box]'));
    if (mode === 'proposal') smoothSize(box, /** @type {HTMLElement} */ (host.querySelector('[data-sm-inner]')));
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
