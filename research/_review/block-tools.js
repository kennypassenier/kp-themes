// Two tools over every section the review dialog shows (Kenny, 2026-10-13, both "onmisbaar"):
//
// - Previous version (V): the section as Kenny saw it in the round before, in the same theme, in place of the
//   current one, and back. It is read from the snapshot `research/_review/snapshot.mjs` keeps beside the demo
//   (`_previous/`, see the README); a demo without one, or a section new in this round, says so on the button.
// - Play open and close (L), at 1× or ¼× (the speed buttons): the section's own opener is pressed, the opening
//   plays out, the part is closed again the way the demo closes it, and that repeats until it is stopped. Which
//   control opens: one the demo marks `data-review-replay`, else the first of the package's own openers (a side
//   navigation toggle, a popover or dialog button, the palette, a menu button), also inside a window (iframe) of
//   the section. The slow speed runs every animation of the section (and of the previous version) at a quarter of
//   its rate through the Web Animations API, so it needs nothing from the demo.
//
// The tools sit in a bar above the section in the dialog's stage and leave with it (teardown). The bar shows only
// what is relevant (Kenny, 2026-10-18 00:28: "de balk met previous version, playopen and close is hier niet relevant
// dus moet niet getoond worden, enkel wanneer het relevant is"):
//
// - "Previous version" appears only when a `_previous` snapshot holds this section.
// - "Play open and close" and the speed appear only when the section has something that opens and closes: the demo
//   says so with `data-review-motion` on the section (any value but "none" forces it on, "none" forces it off), else
//   the section is searched for the package's own openers (OPENERS, also inside its windows) and shown once one is
//   visible. The search repeats while the section changes, since a demo may build its parts late.
// - With neither, the whole bar is `hidden` and takes no space.

/** The package's openers, most specific first. */
const OPENERS = [
    '[data-review-replay]',
    '[data-kp-sidenav-toggle]',
    '[data-kp-palette-open]',
    '[data-kp-dialog]',
    '[popovertarget]',
    '[role="combobox"]',
    '[aria-haspopup]:not([aria-haspopup="false"])',
    '[aria-expanded]',
];

/** The snapshot of the previous round, read once per page. */
let previousInfo = /** @type {Promise<{ round: string, base: URL } | null> | null} */ (null);
function previousOf() {
    previousInfo ??= (async () => {
        try {
            const base = new URL('_previous/', location.href);
            const response = await fetch(new URL('previous.json', base), { cache: 'no-cache' });
            if (!response.ok) return null;
            const data = await response.json();
            const topic = location.pathname.replace(/\/[^/]*$/, '').replace(/^.*\//, '');
            return { round: String(data.round || ''), base: new URL(`research/${topic}/${location.pathname.replace(/^.*\//, '')}`, base) };
        } catch {
            return null;
        }
    })();
    return previousInfo;
}

/** A round id as words: "2026-10-13-r3" reads ", round 3 of 13/10/2026". */
const roundName = (/** @type {string} */ round) => {
    const match = round.match(/^(\d{4})-(\d{2})-(\d{2})-r(\d+)$/);
    if (match) return `, round ${match[4]} of ${match[3]}/${match[2]}/${match[1]}`;
    return round ? `, round ${round}` : '';
};

const visible = (/** @type {Element} */ el) => {
    const box = el.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && !el.closest('[hidden], [inert], [data-review-look], [data-review-controls]');
};

/** The documents a section reaches: its own, and the same-origin windows inside it. */
function scopesOf(/** @type {Element} */ root) {
    /** @type {{ doc: Document, root: Element }[]} */
    const scopes = [{ doc: root.ownerDocument, root }];
    for (const frame of root.querySelectorAll('iframe')) {
        try {
            const doc = frame.contentDocument;
            if (doc?.body) scopes.push({ doc, root: doc.body });
        } catch {
            /* another origin: not reached */
        }
    }
    return scopes;
}

function openerIn(/** @type {Element} */ root) {
    for (const selector of OPENERS)
        for (const { root: scope } of scopesOf(root)) {
            const found = [...scope.querySelectorAll(selector)].find((el) => visible(el) && !el.matches('.kp-sidenav__category-toggle'));
            if (found) return /** @type {HTMLElement} */ (found);
        }
    return null;
}

/** The animations running in a section and its windows, the top layer included (it is in the section's subtree). */
function animationsIn(/** @type {Element} */ root) {
    return scopesOf(root).flatMap(({ doc, root: scope }) =>
        doc.getAnimations().filter((a) => {
            const target = /** @type {KeyframeEffect | null} */ (a.effect)?.target;
            return target instanceof doc.defaultView.Element && scope.contains(target);
        }),
    );
}

const frames = (n) =>
    new Promise((resolve) => {
        let left = n;
        const tick = () => (--left <= 0 ? resolve(undefined) : requestAnimationFrame(tick));
        requestAnimationFrame(tick);
    });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Wait until what the section plays has finished (looping animations aside), at most `limit` ms. */
async function settle(/** @type {Element} */ root, /** @type {number} */ limit, /** @type {() => boolean} */ stopped) {
    await frames(2);
    const until = performance.now() + limit;
    while (!stopped() && performance.now() < until) {
        const running = animationsIn(root).filter((a) => a.playState === 'running' && a.effect?.getComputedTiming().endTime !== Infinity);
        if (!running.length) return;
        await Promise.race([Promise.all(running.map((a) => a.finished.catch(() => undefined))), sleep(250)]);
    }
}

/** What is open in a section now: dialogs, popovers, and the toggles that say they are expanded. */
function openParts(/** @type {Element} */ root) {
    return new Set(
        scopesOf(root).flatMap(({ root: scope }) => [
            ...scope.querySelectorAll('dialog[open], [popover]:popover-open, [data-kp-sidenav-open="true"], [aria-expanded="true"]'),
        ]),
    );
}

/**
 * Mount the tools above one section in the dialog's stage.
 * @param {{ section: HTMLElement, item: string, theme: string, themeLabel: string, title: string }} options
 * @returns {{ bar: HTMLElement, teardown: () => void, key: (code: string) => boolean }}
 */
export function mountBlockTools({ section, item, theme, themeLabel, title }) {
    const bar = document.createElement('div');
    bar.className = 'rv-tools';
    bar.hidden = true;
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', `Tools for ${title}`);
    bar.innerHTML = `
        <button type="button" class="kp-button kp-button--sm" aria-pressed="false" data-rv-previous hidden>Previous version (V)</button>
        <span class="rv-tools__motion" data-rv-motion hidden>
            <button type="button" class="kp-button kp-button--sm" aria-pressed="false" data-rv-loop>▶ Play open and close (L)</button>
            <span class="rv-tools__speed" role="group" aria-label="Speed of the motion">
                <button type="button" class="kp-button kp-button--sm" aria-pressed="true" data-rv-rate="1">1×</button>
                <button type="button" class="kp-button kp-button--sm" aria-pressed="false" data-rv-rate="0.25">¼×</button>
            </span>
        </span>
        <span class="rv-meta rv-tools__note" role="status" aria-live="polite" data-rv-tools-note></span>`;
    const $ = (/** @type {string} */ s) => /** @type {HTMLElement} */ (bar.querySelector(s));
    const previousButton = /** @type {HTMLButtonElement} */ ($('[data-rv-previous]'));
    const loopButton = /** @type {HTMLButtonElement} */ ($('[data-rv-loop]'));
    const note = $('[data-rv-tools-note]');
    const motionBox = $('[data-rv-motion]');
    let hasPrevious = false;
    /** Show the bar, and each part of it, only while it applies. */
    const refresh = () => {
        if (!alive) return;
        const mark = section.getAttribute('data-review-motion');
        const motion = looping || (mark === null ? openerIn(shown()) !== null : mark !== 'none');
        previousButton.hidden = !hasPrevious;
        motionBox.hidden = !motion;
        bar.hidden = !hasPrevious && !motion;
    };
    let alive = true;
    let rate = 1;
    let looping = false;
    /** @type {HTMLElement | null} */
    let earlier = null;
    /** @type {HTMLIFrameElement | null} */
    let frame = null;

    /** The section on show: the current one, or the previous version's. */
    const shown = () =>
        (earlier && frame?.contentDocument ? frame.contentDocument.querySelector(`[data-review-item="${CSS.escape(item)}"]`) : null) ?? section;

    /* -------------------------------------------------- speed */
    let rateTimer = 0;
    const applyRate = () => {
        for (const a of animationsIn(section)) if (a.playbackRate !== rate) a.playbackRate = rate;
        const other = earlier && shown();
        if (other && other !== section) for (const a of animationsIn(other)) if (a.playbackRate !== rate) a.playbackRate = rate;
    };
    const keepRate = () => {
        if (!alive) return;
        applyRate();
        rateTimer = rate === 1 ? 0 : requestAnimationFrame(keepRate);
    };
    function setRate(/** @type {number} */ next) {
        rate = next;
        for (const b of bar.querySelectorAll('[data-rv-rate]'))
            b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-rv-rate')) === rate));
        cancelAnimationFrame(rateTimer);
        applyRate();
        if (rate !== 1) keepRate();
    }

    /* --------------------------------------------------- loop */
    // A note being typed keeps the focus while the loop plays: a part that opens takes the focus (a side
    // navigation's initial focus, a combobox, a frame's own page), and the letters then went to the demo
    // (Kenny, 2026-10-13: typing in brutalism's note on "Over the page" stopped). The field held is the one
    // last focused outside the section; a press of the pointer anywhere else lets it go.
    const TYPING =
        'textarea, input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="reset"]), [contenteditable]:not([contenteditable="false"])';
    /** @type {HTMLElement | null} */
    let held = null;
    const takenBySection = (/** @type {Element | null} */ el) => el !== null && (section.contains(el) || (earlier?.contains(el) ?? false));
    document.addEventListener('focusin', (event) => {
        const el = /** @type {Element} */ (event.target);
        if (alive && el.matches?.(TYPING) && !takenBySection(el)) held = /** @type {HTMLElement} */ (el);
    });
    document.addEventListener(
        'pointerdown',
        (event) => {
            if (alive && held && event.target !== held) held = null;
        },
        true,
    );
    const keepTyping = () => {
        if (!alive || !looping) return;
        if (held?.isConnected && document.activeElement !== held && takenBySection(document.activeElement)) held.focus({ preventScroll: true });
        requestAnimationFrame(keepTyping);
    };
    // The part's own focus() calls are what take the field away: while a field is held, a focus() on an element of
    // the section (or of a page framed in it) does nothing, so not one letter goes astray.
    /** @type {(() => void)[]} */
    let unguard = [];
    const guardFocus = () => {
        for (const { doc, root: scope } of scopesOf(section)) {
            const proto = /** @type {any} */ (doc.defaultView)?.HTMLElement?.prototype;
            if (!proto || unguard.some((u) => /** @type {any} */ (u).proto === proto)) continue;
            const own = proto.focus;
            proto.focus = function (/** @type {FocusOptions | undefined} */ options) {
                if (held?.isConnected && looping && scope.contains(this)) return;
                return own.call(this, options);
            };
            const undo = () => {
                proto.focus = own;
            };
            /** @type {any} */ (undo).proto = proto;
            unguard.push(undo);
        }
    };
    async function loop() {
        guardFocus();
        requestAnimationFrame(keepTyping);
        while (alive && looping) {
            const root = shown();
            const opener = openerIn(root);
            if (!opener) {
                note.textContent = 'This section has no control that opens something; use its own buttons.';
                break;
            }
            note.textContent = rate === 1 ? 'Playing the opening and the close, again and again.' : 'Playing at a quarter of the speed.';
            const before = openParts(root);
            const expanded = opener.getAttribute('aria-expanded');
            const combobox = opener.matches('[role="combobox"]');
            // A combobox opens from the keyboard (the ARIA pattern), and closes when the focus leaves it.
            if (combobox) {
                opener.focus();
                opener.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', bubbles: true, cancelable: true }));
            } else opener.click();
            await settle(root, 8000 / rate, () => !looping || !alive);
            if (!looping || !alive) break;
            await sleep(900 / Math.sqrt(rate));
            if (!looping || !alive) break;
            // Closed again the way the demo closes it: the same toggle, else the part that opened.
            const opened = [...openParts(root)].filter((el) => !before.has(el));
            const dialog = /** @type {HTMLDialogElement | undefined} */ (opened.find((el) => el.matches('dialog')));
            const popover = /** @type {HTMLElement | undefined} */ (opened.find((el) => el.matches('[popover]')));
            if (combobox) loopButton.focus();
            else if (opener.getAttribute('aria-expanded') !== expanded || opener.matches('[data-kp-sidenav-toggle]') || !opened.length)
                opener.click();
            else if (dialog) {
                if (typeof dialog.requestClose === 'function') dialog.requestClose();
                else if (dialog.dispatchEvent(new Event('cancel', { cancelable: true }))) dialog.close();
            } else if (popover) popover.hidePopover();
            else opener.click();
            await settle(root, 8000 / rate, () => !looping || !alive);
            await sleep(700 / Math.sqrt(rate));
        }
        looping = false;
        for (const undo of unguard) undo();
        unguard = [];
        loopButton.setAttribute('aria-pressed', 'false');
        loopButton.textContent = '▶ Play open and close (L)';
    }
    function toggleLoop() {
        looping = !looping;
        loopButton.setAttribute('aria-pressed', String(looping));
        loopButton.textContent = looping ? '■ Stop playing (L)' : '▶ Play open and close (L)';
        if (looping) void loop();
        else note.textContent = '';
    }

    /* ------------------------------------------ previous version */
    async function togglePrevious() {
        if (previousButton.hidden) return;
        const wasLooping = looping;
        if (looping) toggleLoop();
        if (earlier) {
            earlier.remove();
            earlier = frame = null;
            section.hidden = false;
            previousButton.setAttribute('aria-pressed', 'false');
            note.textContent = 'The current version.';
            if (wasLooping) toggleLoop();
            return;
        }
        const info = await previousOf();
        if (!info || !alive) return;
        earlier = document.createElement('div');
        earlier.className = 'rv-previous';
        earlier.innerHTML = `<p class="rv-previous__label"></p><iframe class="rv-previous__frame"></iframe>`;
        /** @type {HTMLElement} */ (earlier.querySelector('.rv-previous__label')).textContent =
            `Previous version${roundName(info.round)}, in ${themeLabel}: as you judged it before this round.`;
        frame = /** @type {HTMLIFrameElement} */ (earlier.querySelector('iframe'));
        frame.title = `${title}: the previous version`;
        const src = new URL(info.base);
        src.searchParams.set('theme', theme);
        const box = earlier;
        const ready = new Promise((resolve) => frame?.addEventListener('load', resolve, { once: true }));
        frame.src = src.href;
        early(frame, item);
        section.after(earlier);
        section.hidden = true;
        previousButton.setAttribute('aria-pressed', 'true');
        note.textContent = 'Loading the previous version…';
        await ready;
        if (!alive || earlier !== box || !frame) return;
        await isolate(frame, item, theme);
        note.textContent = 'The previous version. V shows the current one again.';
        if (wasLooping) toggleLoop();
    }

    previousOf().then(async (info) => {
        if (!alive) return;
        if (!info) {
            return;
        }
        // A section new in this round has no earlier picture.
        try {
            const html = await (await fetch(info.base, { cache: 'no-cache' })).text();
            const had = new DOMParser().parseFromString(html, 'text/html').querySelector(`[data-review-item="${CSS.escape(item)}"]`);
            hasPrevious = !!had;
        } catch {
            /* unreadable: no earlier version is offered */
        }
        refresh();
    });
    // The parts a demo builds late, or opens and closes, change what is relevant: look again while the section changes.
    const watch = new MutationObserver(() => requestAnimationFrame(refresh));
    watch.observe(section, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['hidden', 'style', 'class', 'open', 'aria-expanded'],
    });
    const recheck = setInterval(refresh, 1500);
    refresh();

    bar.addEventListener('click', (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.closest('[data-rv-previous]')) void togglePrevious();
        else if (target.closest('[data-rv-loop]')) toggleLoop();
        const r = target.closest('[data-rv-rate]');
        if (r) setRate(Number(r.getAttribute('data-rv-rate')));
    });

    return {
        bar,
        teardown() {
            alive = false;
            looping = false;
            watch.disconnect();
            clearInterval(recheck);
            cancelAnimationFrame(rateTimer);
            for (const a of animationsIn(section)) if (a.playbackRate !== 1) a.playbackRate = 1;
            earlier?.remove();
            section.hidden = false;
            bar.remove();
        },
        key(code) {
            if (code === 'KeyV' && !previousButton.hidden) void togglePrevious();
            else if (code === 'KeyL' && !motionBox.hidden) toggleLoop();
            else return false;
            return true;
        },
    };
}

/**
 * A lane frame, like the previous version's frame, loads the whole demo, every section of it, for the one section
 * it shows. As soon as its document exists, before the demo's modules run, the other sections are laid aside, so they
 * neither lay out nor animate
 * while the step loads, and nothing in the frame may scroll the dialog around it: a section that focuses or scrolls
 * itself into view while it boots pulled the dialog down to the last frame (Kenny, 2026-10-17: "vroeger laadden die
 * toch veel sneller? en nu als alles geladen is dan moet ik manueel naar boven scrollen").
 * @param {HTMLIFrameElement} frame @param {string} item
 */
export function early(frame, item) {
    const started = performance.now();
    const tick = () => {
        const doc = frame.contentDocument;
        const win = frame.contentWindow;
        if (!frame.isConnected || performance.now() - started > 20000) return;
        if (!doc || !win || doc.URL === 'about:blank' || !doc.head) return void requestAnimationFrame(tick);
        const style = doc.createElement('style');
        style.textContent = `[data-review-item]:not([data-review-item="${CSS.escape(item)}"]) { display: none !important; }`;
        doc.head.append(style);
        const proto = /** @type {any} */ (win).HTMLElement.prototype;
        const focus = proto.focus;
        proto.focus = function (/** @type {FocusOptions | undefined} */ options) {
            return focus.call(this, { ...options, preventScroll: true });
        };
        /** @type {any} */ (win).Element.prototype.scrollIntoView = function () {};
    };
    tick();
}

/**
 * The previous version's page shows only this section, in this theme: everything around it is set aside, the
 * theme's register is loaded, and the frame takes the section's height.
 * @param {HTMLIFrameElement} frame @param {string} item @param {string} theme
 */
export async function isolate(frame, item, theme) {
    const doc = frame.contentDocument;
    if (!doc) return;
    const root = doc.documentElement;
    const href = new URL(`../../css/${theme}-register.css`, doc.baseURI).href;
    if (![...doc.querySelectorAll('link[rel="stylesheet"]')].some((link) => /** @type {HTMLLinkElement} */ (link).href === href)) {
        const link = doc.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.setAttribute('data-kp-register', theme);
        const loaded = new Promise((resolve) => {
            link.addEventListener('load', resolve, { once: true });
            link.addEventListener('error', resolve, { once: true });
        });
        doc.head.append(link);
        await loaded;
    }
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-cat-theme', theme);
    const section = doc.querySelector(`[data-review-item="${CSS.escape(item)}"]`);
    if (!section) return;
    const style = doc.createElement('style');
    // The frame takes the document's height, so nothing in it may take its least height from the frame's: the
    // catalogue's `body.cat-shell { min-block-size: 100vh }` plus the root padding terminal's bezel adds
    // (terminal-register.css, `:root[data-theme='terminal'] { padding: var(--kp-bezel) }`) made the document 100vh plus
    // two bezels high, the frame grew to it, 100vh with it, and terminal's frame grew without end (Kenny, 2026-10-16:
    // "terminal lijkt eindeloos lang te zijn en ik geraak niet aan items onder terminal").
    style.textContent =
        '[data-rv-off], [data-review-look] { display: none !important; } body { margin: 0; } main { padding-block: 0 !important; }' +
        ' html, body { min-block-size: 0 !important; block-size: auto !important; } :root { --kp-shell-min: 0px; }';
    doc.head.append(style);
    for (let el = /** @type {Element} */ (section); el.parentElement && el !== doc.body; el = el.parentElement)
        for (const sibling of el.parentElement.children)
            if (sibling !== el && !sibling.matches('script, style, link')) sibling.setAttribute('data-rv-off', '');
    // A guard against any other height that follows the frame's: a document that grows by the same step on every fit
    // five times in a row is the frame feeding itself, and the frame stops following it.
    let last = 0;
    let step = 0;
    let echoes = 0;
    // The body's own height and overflow, never the document's scroll height: that is at least the frame's own height,
    // so a section that got shorter (the dialog lays it out once it has loaded) left a blank band under it.
    // Room for a panel that opens over what follows (a picker's list, a menu): given the moment an opener is pressed or
    // focused, so the panel finds space under its opener instead of flipping over the section, and taken back once
    // nothing is open (Kenny, 2026-10-18 16:27: no empty areas held in reserve). An open panel's own bottom counts too.
    const OPENERS = '[role="combobox"], [aria-haspopup]:not([aria-haspopup="false"]), [popovertarget], [data-kp-combobox] input';
    const ROOM = 448;
    let room = 0;
    const panels = () =>
        [...section.querySelectorAll('[popover]:popover-open, dialog[open], [role="listbox"], [role="menu"]')].filter((el) => {
            const r = el.getBoundingClientRect();
            // A list that floats over what follows; one in the flow is part of the section's own height.
            return r.width > 0 && r.height > 0 && /^(fixed|absolute)$/.test(getComputedStyle(el).position);
        });
    let granted = 0;
    const opening = (/** @type {Event} */ event) => {
        const from = /** @type {Element} */ (event.target);
        if (!from.closest?.(OPENERS) || from.closest('[data-review-controls]') || room) return;
        room = ROOM;
        granted = performance.now();
        fit();
    };
    /** Something of the section is open or about to open: an opener holds the focus, or a panel is shown. */
    const inUse = () =>
        Boolean(doc.activeElement?.closest?.(OPENERS) && section.contains(doc.activeElement)) || panels().some((el) => !el.closest('[data-rv-off]'));
    section.addEventListener('pointerdown', opening, true);
    section.addEventListener('focusin', opening, true);
    const settleRoom = () => {
        if (room && performance.now() - granted > 800 && !inUse()) {
            room = 0;
            fit();
        }
    };
    section.addEventListener('focusout', () => setTimeout(settleRoom, 300));
    setInterval(() => frame.isConnected && settleRoom(), 1000);
    // A modal dialog the section opens (the document preview, a confirm) takes its size from the viewport, and the viewport
    // of a lane is the frame, sized to the section: a viewer of "90% of the window" was 90% of a 219 px frame, its stage
    // 58 px, and showed nothing of the file (Kenny, 2026-10-18 19:08: "de dialog die opent is veel te nauw (verticaal) het
    // toont niet alle content"). While a modal is open the frame is as tall as the dialog's view has room under the lane's
    // head, so the modal gets the window it would get in an app, and the lane is brought to the top of the view; it
    // shrinks back when the modal closes.
    const outerView = /** @type {HTMLElement | null} */ (frame.closest('.rv-dialog__view'));
    const modalOpen = () => [...doc.querySelectorAll('dialog[open]')].some((el) => el.matches(':modal'));
    let modalShown = false;
    const modalRoom = () => {
        if (!outerView || !modalOpen()) {
            modalShown = false;
            return 0;
        }
        const card = /** @type {HTMLElement} */ (frame.parentElement);
        const head = frame.getBoundingClientRect().top - card.getBoundingClientRect().top;
        if (!modalShown) {
            modalShown = true;
            const view = outerView.getBoundingClientRect();
            const top = card.getBoundingClientRect().top;
            if (Math.abs(top - view.top) > 1) outerView.scrollTop += top - view.top;
        }
        return Math.max(0, outerView.clientHeight - head - 8);
    };
    const fit = () => {
        const content = Math.max(doc.body.scrollHeight, doc.body.getBoundingClientRect().height);
        const panelBottom = Math.max(0, ...panels().map((el) => el.getBoundingClientRect().bottom + 16));
        const next = Math.ceil(Math.max(content + room, panelBottom, modalRoom()));
        const grew = next - last;
        echoes = grew > 0 && grew === step ? echoes + 1 : 0;
        step = grew;
        if (echoes >= 4) return;
        last = next;
        frame.style.blockSize = `${next}px`;
    };
    new ResizeObserver(fit).observe(doc.body);
    // A panel that opens over what follows (a picker's list) changes no box the observer sees: the frame follows the
    // section's changes too, once a frame, so it grows while the panel is open and shrinks after.
    let queued = false;
    new MutationObserver(() => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            fit();
        });
    }).observe(section, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden', 'open', 'aria-expanded', 'style'] });
    // A modal is appended to the body, outside the section, and showModal() and close() change no box: the frame follows
    // a dialog that opens or closes anywhere in the document.
    const followModal = () => requestAnimationFrame(fit);
    new MutationObserver(followModal).observe(doc.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    new MutationObserver(followModal).observe(doc.body, { childList: true });
    doc.addEventListener('close', followModal, true);
    fit();
}
