// research/sidenav-minor: the four options play themselves. Each page names
// its scenario in `data-sm-scenario`; the script drives a pointer and keys
// over the real component and writes every event the panel really sends into
// the page's log. Nothing here is a mock: the panel, the handle, the
// backdrop and the events are js/sidenav.js's. Loops until the page is
// closed; a hidden page waits.
import { attachSidenavs, sidenavOf } from '../../js/sidenav.js';

const panel = /** @type {HTMLElement} */ (document.querySelector('.kp-sidenav'));
const main = /** @type {HTMLElement} */ (document.querySelector('.se-main'));
const log = /** @type {HTMLElement | null} */ (document.querySelector('.sm-log'));
const caption = /** @type {HTMLElement} */ (document.querySelector('.sm-caption'));
const ghost = /** @type {HTMLElement} */ (document.querySelector('.sm-ghost'));
const keyChip = /** @type {HTMLElement} */ (document.querySelector('.sm-key'));
const launcher = /** @type {HTMLElement} */ (document.querySelector('.kp-sidenav__launcher button'));
const scenario = document.body.dataset.smScenario;

const sleep = (/** @type {number} */ ms) => new Promise((done) => setTimeout(done, ms));
/** Wait while the page is hidden, so a tab nobody looks at does not run ahead. */
const visible = async () => {
    while (document.hidden) await sleep(250);
};
const step = async (/** @type {number} */ ms) => {
    await visible();
    await sleep(ms);
};

// ---- The log.
const MAX_LINES = 5;
/**
 * @param {string} name
 * @param {string} facts
 * @param {string} verdict
 * @param {'success' | 'destructive' | 'warning' | 'info'} tone
 */
function say(name, facts, verdict, tone) {
    if (!log) return;
    log.querySelector('.sm-log-empty')?.remove();
    for (const old of log.querySelectorAll('[data-new]')) old.removeAttribute('data-new');
    const line = document.createElement('li');
    line.setAttribute('data-new', '');
    line.innerHTML = `<code></code><span class="kp-badge kp-badge--${tone}"></span><small></small>`;
    /** @type {HTMLElement} */ (line.querySelector('code')).textContent = name;
    /** @type {HTMLElement} */ (line.querySelector('.kp-badge')).textContent = verdict;
    /** @type {HTMLElement} */ (line.querySelector('small')).textContent = facts;
    log.prepend(line);
    while (log.children.length > MAX_LINES) log.lastElementChild?.remove();
}
const clearLog = () => {
    if (log) log.innerHTML = '<li class="sm-log-empty">Nothing has happened yet.</li>';
};

/** @param {string} text @param {number} [n] */
const tell = (text, n) => {
    caption.innerHTML = `<b></b><span></span>`;
    /** @type {HTMLElement} */ (caption.querySelector('b')).textContent = n === undefined ? '' : `${n}.`;
    /** @type {HTMLElement} */ (caption.querySelector('span')).textContent = text;
};

// ---- The pointer and the keys.
/** @param {number} x @param {number} y */
async function pointTo(x, y) {
    await visible();
    ghost.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
    await sleep(800);
}
/** @param {Element} el @param {number} [fx] @param {number} [fy] */
async function pointAt(el, fx = 0.5, fy = 0.5) {
    const r = el.getBoundingClientRect();
    await pointTo(r.left + r.width * fx - 4, r.top + r.height * fy - 2);
}
async function pressDown() {
    ghost.removeAttribute('data-press');
    void ghost.offsetWidth;
    ghost.setAttribute('data-press', '');
    await sleep(160);
}
/** @param {HTMLElement} el */
async function click(el) {
    await pointAt(el);
    await pressDown();
    el.click();
    await step(350);
}
/** @param {string} label @param {string} key @param {EventTarget} [target] */
async function pressKey(label, key, target = document) {
    keyChip.textContent = label;
    keyChip.setAttribute('data-on', '');
    await step(380);
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await step(420);
    keyChip.removeAttribute('data-on');
}

const handle = () => sidenavOf(panel);
const waitHandle = async () => {
    while (!handle()) await sleep(50);
};
const settled = async () => {
    // The panel's slide, whatever the theme makes of it.
    await sleep(60);
    await Promise.all(panel.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {})));
    await sleep(250);
};

// ---- What the panel says: the real events.
/** @param {Event} event */
const onToggle = (event) => {
    const { open, reason } = /** @type {CustomEvent} */ (event).detail;
    const stopped = event.defaultPrevented;
    say('kp-sidenav-toggle', `open: ${open} · reason: ${reason}`, stopped ? 'cancelled' : 'allowed', stopped ? 'destructive' : 'success');
};
/** @param {Event} event */
const onPrevented = (event) => {
    const { open, reason, source } = /** @type {CustomEvent} */ (event).detail;
    say('kp-sidenav-prevented', `asked: open ${open} · reason: ${reason} · by: ${source}`, 'prevented', 'warning');
};

// ---- Scenarios.
const scenes = {
    /** Option 1: a page that refuses to close the menu while a draft is unsaved. */
    async cancel() {
        const field = /** @type {HTMLInputElement} */ (document.querySelector('#sm-draft'));
        const state = /** @type {HTMLElement} */ (document.querySelector('#sm-state'));
        const save = /** @type {HTMLElement} */ (document.querySelector('#sm-save'));
        const note = /** @type {HTMLElement} */ (document.querySelector('#sm-note'));
        let dirty = false;
        const mark = (/** @type {boolean} */ on) => {
            dirty = on;
            state.className = `kp-badge kp-badge--${on ? 'warning' : 'success'}`;
            state.textContent = on ? 'Unsaved changes' : 'Saved';
        };
        // The page's own guard: it comes first, so the log sees its verdict.
        panel.addEventListener('kp-sidenav-toggle', (event) => {
            const { open } = /** @type {CustomEvent} */ (event).detail;
            if (!open && dirty) {
                event.preventDefault();
                note.textContent = 'The menu stayed open: the draft is not saved yet.';
            } else note.textContent = '';
        });
        panel.addEventListener('kp-sidenav-toggle', onToggle);
        panel.addEventListener('kp-sidenav-prevented', onPrevented);
        for (;;) {
            clearLog();
            field.value = '';
            mark(false);
            note.textContent = '';
            if (handle()?.isOpen()) handle()?.close();
            await settled();
            tell('The reader opens the menu.', 1);
            await click(launcher);
            await settled();
            tell('The reader starts a draft: now there is something to lose.', 2);
            await pointAt(field);
            await pressDown();
            field.focus({ preventScroll: true });
            for (const part of ['Pump house 3', 'Pump house 3: valve', 'Pump house 3: valve V-12 sticks']) {
                field.value = part;
                mark(true);
                await step(450);
            }
            tell('The reader presses the bars to close the menu. The page cancels the event, so nothing moves.', 3);
            await click(launcher);
            await step(1300);
            tell('Escape asks too, with another reason. Cancelled as well.', 4);
            await pressKey('Esc', 'Escape');
            await step(1100);
            tell('The reader saves the draft.', 5);
            await click(save);
            mark(false);
            note.textContent = '';
            await step(800);
            tell('Escape again: nothing to lose now, so the event is allowed and the menu closes.', 6);
            await pressKey('Esc', 'Escape');
            await settled();
            await step(1800);
        }
    },

    /** Option 2: drag the handle, use the keys, reload, double press. */
    async resize() {
        const readout = /** @type {HTMLElement} */ (document.querySelector('#sm-px'));
        const fill = /** @type {HTMLElement} */ (document.querySelector('.sm-gauge__fill'));
        const kept = /** @type {HTMLElement} */ (document.querySelector('#sm-kept'));
        const limits = { min: 12 * 16, max: 26 * 16 };
        const show = () => {
            const px = Math.round(panel.getBoundingClientRect().width);
            readout.innerHTML = `${px}<small> px · ${(px / 16).toFixed(1)} rem</small>`;
            fill.style.setProperty('--sm-fill', `${Math.round(((px - limits.min) / (limits.max - limits.min)) * 100)}%`);
            let saved = null;
            try {
                saved = localStorage.getItem('kp-remember:sidenav:sm-resize:width');
            } catch {
                saved = null;
            }
            kept.textContent = saved === null ? 'Nothing remembered yet.' : `Remembered: ${Math.round(Number(saved))} px`;
        };
        new ResizeObserver(show).observe(panel);
        panel.addEventListener('kp-sidenav-mode', show);
        /** The page loading: the panel starts open and the module reads what the reader left. */
        const attach = async () => {
            panel.setAttribute('data-kp-sidenav-open', 'true');
            attachSidenavs(document);
            await waitHandle();
            await settled();
            show();
        };
        const gripNow = () => /** @type {HTMLElement} */ (panel.querySelector('.kp-sidenav__resizer'));
        const fire = (/** @type {string} */ type, /** @type {number} */ x, /** @type {HTMLElement} */ target = gripNow()) => {
            const r = gripNow().getBoundingClientRect();
            target.dispatchEvent(
                new PointerEvent(type, {
                    bubbles: true,
                    cancelable: true,
                    pointerId: 7,
                    isPrimary: true,
                    button: 0,
                    clientX: x,
                    clientY: r.top + r.height / 2,
                }),
            );
        };
        /** Drag the handle to a width (px), the pointer travelling there over `ms`. */
        const drag = async (/** @type {number} */ to, /** @type {number} */ ms) => {
            const left = panel.getBoundingClientRect().left;
            const from = left + panel.getBoundingClientRect().width - 3;
            await pointTo(from + 4, gripNow().getBoundingClientRect().top + gripNow().getBoundingClientRect().height / 2);
            await pressDown();
            fire('pointerdown', from);
            ghost.style.transition = `translate ${ms}ms linear`;
            const frames = Math.max(8, Math.round(ms / 16));
            const aim = left + to - 3;
            const first = from;
            ghost.style.translate = `${Math.round(aim + 4)}px ${Math.round(gripNow().getBoundingClientRect().top + gripNow().getBoundingClientRect().height / 2 - 2)}px`;
            for (let i = 1; i <= frames; i += 1) {
                await visible();
                fire('pointermove', first + ((aim - first) * i) / frames);
                await sleep(ms / frames);
            }
            fire('pointerup', aim);
            ghost.style.transition = '';
            await sleep(300);
        };
        for (;;) {
            handle()?.destroy();
            try {
                localStorage.removeItem('kp-remember:sidenav:sm-resize:width');
            } catch {
                /* storage refused: the demo still plays */
            }
            panel.style.removeProperty('--kp-sidenav-width');
            await attach();
            show();
            tell('The handle sits on the menu’s inner edge, inside the panel. The reader takes hold of it.', 1);
            await drag(24 * 16, 1500);
            await step(900);
            tell('Dragging past the limit stops at the narrowest width the page allows (12rem).', 2);
            await drag(6 * 16, 1500);
            await step(900);
            tell('With the handle focused, the arrow keys widen it by 1rem; Shift takes five.', 3);
            await pointAt(gripNow());
            await pressDown();
            gripNow().focus({ preventScroll: true });
            for (let i = 0; i < 3; i += 1) {
                await pressKey('→', 'ArrowRight', gripNow());
            }
            keyChip.textContent = 'Shift + →';
            keyChip.setAttribute('data-on', '');
            await step(380);
            gripNow().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true, cancelable: true }));
            await step(500);
            keyChip.removeAttribute('data-on');
            await step(700);
            tell('The page is reloaded (the panel is attached again): the width is where the reader left it.', 4);
            handle()?.destroy();
            await sleep(500);
            await attach();
            await step(1700);
            tell('A double press on the handle gives the width back to the stylesheet.', 5);
            await pointAt(gripNow());
            await pressDown();
            gripNow().dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
            await settled();
            show();
            await step(2000);
        }
    },

    /** Options 3 and 4: a click on the backdrop, and what each setting makes of it. */
    async backdrop() {
        const kind = document.body.dataset.smKind;
        panel.addEventListener('kp-sidenav-toggle', onToggle);
        panel.addEventListener('kp-sidenav-prevented', onPrevented);
        const backdropClick = (/** @type {Event} */ event) => {
            if (!(event.target instanceof Element) || !event.target.classList.contains('kp-sidenav__backdrop')) return;
            if (kind === 'quiet') say('click on the backdrop', 'the panel stays open · no event is sent', 'ignored', 'info');
        };
        document.addEventListener('click', backdropClick, true);
        for (;;) {
            clearLog();
            if (handle()?.isOpen()) handle()?.close();
            await settled();
            tell('The reader opens the menu. The backdrop dims the page.', 1);
            await click(launcher);
            await settled();
            await step(600);
            for (const n of [2, 3]) {
                tell(n === 2 ? 'The reader clicks outside the menu, on the backdrop.' : 'Once more, in case it was a slip.', n);
                const backdrop = /** @type {HTMLElement} */ (document.querySelector('.kp-sidenav__backdrop'));
                const w = panel.getBoundingClientRect().width;
                await pointTo(w + 90 + (n - 2) * 60, 190 + (n - 2) * 40);
                await pressDown();
                backdrop.click();
                await step(kind === 'static' ? 1500 : 1300);
            }
            tell('Escape is a different way out and still works.', 4);
            await pressKey('Esc', 'Escape');
            await settled();
            await step(1800);
        }
    },
};

await waitHandle();
const run = scenes[/** @type {keyof typeof scenes} */ (scenario ?? '')];
if (run) await run();
