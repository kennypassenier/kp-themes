// research/chassis-storage/demo.js: renders each section's stage of the Storage kit page, feeds the script-fed components (share bar,
// card and table states) and wires the section's own controls and choices. The wiring is that of research/chassis-kit-pages/demo.js:
// a section is wired by its own elements, so a lane that holds only some of the sections runs the same file.
import { attachAll } from '../../js/auto.js';
import { setStackbar } from '../../js/stackbar.js';
import { setCardState } from '../../js/card-state.js';
import { dataTable } from '../../js/datatable.js';
import { runFlashButton } from '../../js/flash.js';
import { toast } from '../../js/overlays.js';
import { NAV, app } from '../chassis-kit-pages/kit.js';
import {
    store,
    makeStore,
    kindById,
    defaultForm,
    preview,
    phrase,
    applyDelete,
    applyCompact,
    plural,
    dmy,
    parseDmy,
    size,
    totals,
    stackSpec,
    storagePage,
    statesPage,
    cleanupDialog,
    cleanupInner,
    compactDialog,
    compactInner,
} from './storage.js';

// The kit's own shell gains the page this demo is about.
if (!NAV.some((n) => n.id === 'storage'))
    NAV.push({ id: 'storage', label: 'Storage', href: '/storage', keys: 'g o', hint: 'What the service stores' });

/** The choices set in the review dialog, kept across re-renders. @type {Record<string, string>} */
const choice = { 'list-look': 'table', 'confirm-text': 'name' };

const sleep = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms));
const say = (/** @type {string} */ text) => toast(text, { ms: 3200 });

/** @typedef {import('./storage.js').Clean} Clean */
/** @typedef {import('./storage.js').Compact} Compact */

/** The state of every clean-up and compact dialog on screen: dialog → { uid, clean | compact }. @type {WeakMap<Element, any>} */
const DIALOGS = new WeakMap();
/** @type {Map<Element, () => void>} */
const detaches = new Map();

/* ------------------------------------------------------------------------------------------------- the views -- */

/** @param {DOMStringMap} d */
const phone = (d) => d.ckWidth === 'phone';

/** @type {Record<string, (d: DOMStringMap, uid: string, stage: HTMLElement) => string>} */
const VIEWS = {
    'storage-page': (d, uid) =>
        app(uid, 'storage', storagePage(uid, store.current, { cards: choice['list-look'] === 'cards' || phone(d) || innerWidth < 640 })),
    'storage-states': (d, uid) =>
        statesPage(uid, d.ckState === 'empty' ? makeStore('fresh') : store.current, {
            cards: choice['list-look'] === 'cards' || phone(d) || innerWidth < 640,
        }),
    'storage-delete'(d, uid, stage) {
        const clean = cleanFor(stage);
        const dlg = cleanupDialog(uid, clean, true);
        queueMicrotask(() => {
            const el = stage.querySelector('dialog');
            if (el) DIALOGS.set(el, { uid, clean });
        });
        return dlg;
    },
    'storage-compact'(d, uid, stage) {
        const compact = /** @type {Compact} */ ({ state: /** @type {any} */ (d.ckState ?? 'ready'), freed: 0 });
        queueMicrotask(() => {
            const el = stage.querySelector('dialog');
            if (el) DIALOGS.set(el, { uid, compact });
        });
        return compactDialog(uid, compact, true);
    },
};

/** The clean-up state of a stage, from its controls; a new kind starts from that kind's defaults. @type {WeakMap<Element, Clean>} */
const CLEANS = new WeakMap();

/** @param {HTMLElement} stage @returns {Clean} */
function cleanFor(stage) {
    const d = stage.dataset;
    let c = CLEANS.get(stage);
    if (!c || c.kind !== d.ckKind) {
        const k = kindById(d.ckKind ?? 'notifications');
        c = { kind: k.id, step: 'choose', preview: 'ready', typed: /** @type {any} */ (choice['confirm-text']), form: defaultForm(k), done: null };
        CLEANS.set(stage, c);
    }
    c.narrow = innerWidth < 640 || d.ckWidth === 'phone';
    c.step = /** @type {any} */ (d.ckStep ?? 'choose');
    c.typed = /** @type {any} */ (choice['confirm-text']);
    const wanted = /** @type {Clean['preview']} */ (d.ckPreview ?? 'ready');
    if (stage.dataset.ckPreviewSeen !== wanted) {
        stage.dataset.ckPreviewSeen = wanted;
        const k = kindById(c.kind);
        if (wanted === 'empty') c.form = { ...defaultForm(k), older: '01/01/2026' };
        else if (wanted === 'ready' && parseDmy(c.form.older) !== null && (parseDmy(c.form.older) ?? 0) < k.oldest) c.form = defaultForm(k);
        c.preview = wanted === 'empty' ? 'ready' : wanted;
    }
    return c;
}

/* ----------------------------------------------------------------------------------------------- hydration -- */

/** @param {ParentNode} root @param {string} state the stage's data state (ready, loading, empty, failed) */
async function hydrate(root, state = 'ready') {
    for (const el of root.querySelectorAll('[data-st-stackbar]'))
        setStackbar(
            /** @type {HTMLElement} */ (el),
            /** @type {any} */ ({ ...stackSpec(store.current), ...(state === 'empty' ? stackSpec(makeStore('fresh')) : {}) }),
        );
    for (const el of root.querySelectorAll('.st-card')) {
        const card = /** @type {HTMLElement} */ (el);
        if (state === 'loading') setCardState(card, 'loading', { words: 'Reading the storage…' });
        else if (state === 'failed')
            setCardState(card, 'error', {
                title: 'The storage could not be read',
                text: 'The service did not answer in time. Nothing was changed.',
                action: 'Try again',
            });
    }
    for (const el of root.querySelectorAll('.st-kinds')) {
        const handle = dataTable(/** @type {HTMLElement} */ (el));
        if (!handle) continue;
        if (state === 'loading') {
            handle.busy({ text: 'Reading what is stored…', overlay: true });
            handle.state('loading');
        } else if (state === 'failed') handle.fail('The service did not answer in time. Nothing was changed.');
    }
    for (const card of root.querySelectorAll('[data-st-card="preview"]')) {
        const c = /** @type {HTMLElement} */ (card);
        const asked = c.dataset.stPstate;
        if (asked === 'loading') setCardState(c, 'loading', { words: 'Counting the rows…' });
        else if (asked === 'idle')
            setCardState(c, 'empty', {
                title: 'Nothing to preview yet',
                text: 'Choose what to remove, then press Preview. Nothing is deleted by looking.',
            });
        else if (asked === 'empty')
            setCardState(c, 'empty', {
                title: 'Nothing matches',
                text: 'No row fits these choices, so there is nothing to delete. Change the date or a choice and preview again.',
            });
        else if (asked === 'error')
            setCardState(c, 'error', {
                title: 'The preview could not be made',
                text: 'The service did not answer in time. Nothing was changed.',
                action: 'Try again',
            });
    }
    for (const card of root.querySelectorAll('[data-st-card="steps"][data-kp-state="error"]'))
        setCardState(/** @type {HTMLElement} */ (card), 'error', {
            title: 'Compacting did not finish',
            text: 'The file is busy with a backup, so nothing was changed. Try again in a minute.',
            action: 'Try again',
        });
    for (const bar of root.querySelectorAll('.kp-refresh'))
        bar.addEventListener('kp-refresh', (/** @type {Event} */ e) => setTimeout(() => /** @type {CustomEvent} */ (e).detail.done(true), 350));
}

/* ------------------------------------------------------------------------------------------------- render -- */

/** @param {HTMLElement} stage */
async function render(stage) {
    const view = stage.dataset.ckView ?? '';
    const make = VIEWS[view];
    if (!make) return;
    detaches.get(stage)?.();
    stage.innerHTML = make(stage.dataset, view, stage);
    const detach = attachAll(stage);
    detaches.set(stage, () => /** @type {any} */ (detach)());
    await /** @type {any} */ (detach).ready;
    await hydrate(stage, stage.dataset.ckView === 'storage-states' ? (stage.dataset.ckState ?? 'ready') : 'ready');
    syncControls(stage);
}

/** Draw the inside of an open dialog again, keeping the dialog open and the focus where it was. @param {HTMLDialogElement} dlg */
async function redraw(dlg) {
    const info = DIALOGS.get(dlg);
    if (!info) return;
    const keep = /** @type {HTMLElement | null} */ (document.activeElement && dlg.contains(document.activeElement) ? document.activeElement : null);
    const key = keep ? keep.id || keep.getAttribute('data-st-filter') || '' : '';
    dlg.innerHTML = info.clean ? cleanupInner(info.uid, info.clean) : compactInner(info.uid, info.compact);
    const detach = attachAll(dlg);
    await /** @type {any} */ (detach).ready;
    await hydrate(dlg);
    if (key) /** @type {HTMLElement | null} */ (dlg.querySelector(`#${CSS.escape(key)}, [data-st-filter="${key}"]`))?.focus();
    // The stage that holds this dialog in place mirrors it in its controls.
    const stage = /** @type {HTMLElement | null} */ (dlg.closest('.ck-stage'));
    if (stage && info.clean) {
        stage.dataset.ckStep = info.clean.step;
        stage.dataset.ckPreview = info.clean.preview === 'ready' || info.clean.preview === 'empty' ? 'ready' : info.clean.preview;
        stage.dataset.ckPreviewSeen = stage.dataset.ckPreview;
        syncControls(stage);
    }
    if (stage && info.compact) {
        stage.dataset.ckState = info.compact.state;
        syncControls(stage);
    }
}

/** The pressed state of the section's buttons follows the stage. @param {HTMLElement} stage */
function syncControls(stage) {
    const section = stage.closest('[data-review-item]');
    for (const b of section?.querySelectorAll('[data-ck-set]') ?? []) {
        const key = /** @type {string} */ (b.getAttribute('data-ck-set'));
        const prop = `ck${key[0].toUpperCase()}${key.slice(1)}`;
        b.setAttribute('aria-pressed', String(stage.dataset[prop] === b.getAttribute('data-ck-value')));
    }
}

/** Set one control of a stage and draw it again. @param {HTMLElement} stage @param {string} key @param {string} value */
function setState(stage, key, value) {
    const prop = `ck${key[0].toUpperCase()}${key.slice(1)}`;
    stage.dataset[prop] = value;
    stage.setAttribute(`data-ck-${key}`, value);
    // Pressing a Preview state returns the dialog to its first step, where that state lives.
    if (key === 'preview' && stage.dataset.ckView === 'storage-delete') stage.dataset.ckStep = 'choose';
    if (key === 'kind') {
        stage.dataset.ckPreview = 'ready';
        delete stage.dataset.ckPreviewSeen;
    }
    if (key === 'budget') {
        // The budget scenario is the data of every section: the figures Kenny gave (warn), a tidy one and an over-budget one.
        store.current = makeStore(/** @type {any} */ (value));
        return renderAll();
    }
    return render(stage);
}

/** Draw every stage again. */
async function renderAll() {
    for (const stage of document.querySelectorAll('.ck-stage')) await render(/** @type {HTMLElement} */ (stage));
}

/** Every stage that shows the data draws it again: lists update at once. */
async function refreshAll() {
    for (const stage of document.querySelectorAll('.ck-stage')) {
        const view = /** @type {HTMLElement} */ (stage).dataset.ckView;
        if (view === 'storage-page' || view === 'storage-states') await render(/** @type {HTMLElement} */ (stage));
    }
}

/* -------------------------------------------------------------------------------------------- the dialogs -- */

/** A modal dialog next to the stage, so a re-render of the stage does not remove it. @param {HTMLElement} stage @param {string} html @param {any} info @param {string} cls */
async function openModal(stage, html, info, cls) {
    const holder = /** @type {HTMLElement} */ (stage.closest('section') ?? stage.parentElement);
    holder.querySelector('[data-st-modal]')?.remove();
    const host = document.createElement('div');
    host.setAttribute('data-st-modal', '');
    host.innerHTML = html;
    holder.append(host);
    const dlg = /** @type {HTMLDialogElement} */ (host.querySelector('dialog'));
    DIALOGS.set(dlg, info);
    const detach = attachAll(host);
    await /** @type {any} */ (detach).ready;
    await hydrate(host);
    dlg.addEventListener('close', () => host.remove());
    dlg.showModal();
    return dlg;
}

let opened = 0;

/** @param {HTMLElement} stage @param {string} kindId */
async function openCleanup(stage, kindId) {
    const k = kindById(kindId);
    const clean = /** @type {Clean} */ ({
        kind: k.id,
        step: 'choose',
        preview: 'loading',
        typed: /** @type {any} */ (choice['confirm-text']),
        form: defaultForm(k),
        done: null,
        narrow: innerWidth < 640,
    });
    const uid = `st-clean-${(opened += 1)}`;
    const dlg = await openModal(stage, cleanupDialog(uid, clean, false), { uid, clean }, 'st-clean');
    await sleep(700);
    clean.preview = 'ready';
    await redraw(dlg);
}

/** @param {HTMLElement} stage */
async function openCompact(stage) {
    const t = totals(store.current);
    const compact = /** @type {Compact} */ ({ state: t.free > 0 || t.wal > 0 ? 'ready' : 'none', freed: 0 });
    const uid = `st-compact-${(opened += 1)}`;
    await openModal(stage, compactDialog(uid, compact, false), { uid, compact }, 'st-compact');
}

/** What the form of an open clean-up dialog holds right now. @param {HTMLDialogElement} dlg @param {Clean} c */
function readForm(dlg, c) {
    const k = kindById(c.kind);
    const older = /** @type {HTMLInputElement | null} */ (dlg.querySelector('[data-st-older]'));
    if (older) c.form.older = older.value;
    for (const f of k.filters) {
        const el = /** @type {HTMLElement | null} */ (dlg.querySelector(`[data-st-filter="${f.id}"]`));
        if (!el) continue;
        if (f.type === 'choice') {
            const on = [...el.querySelectorAll('[aria-checked="true"]')].map((b) => b.getAttribute('data-value') ?? '');
            c.form.values[f.id] = f.multi ? on : (on[0] ?? f.def);
        } else if (f.type === 'flag') c.form.values[f.id] = /** @type {HTMLInputElement} */ (el).checked;
        else c.form.values[f.id] = /** @type {HTMLInputElement} */ (el).value;
    }
}

/** What the server answers to a delete: it recounts and checks the typed words itself, whatever the page enabled. @param {Clean} c @param {string} typed @param {number} expected */
function serverDelete(c, typed, expected) {
    const k = kindById(c.kind);
    const p = preview(k, c.form);
    if (typed.trim() !== phrase(c, k, p)) return { error: 'What you typed does not match', remedy: 'Type it exactly as shown, capitals included.' };
    if (p.count !== expected)
        return { error: `The data changed since the preview: now ${plural(p.count, 'row', 'rows')}`, remedy: 'Go back and preview again.' };
    applyDelete(k, p);
    return { ok: p };
}

/* ------------------------------------------------------------------------------------------------ events -- */

document.addEventListener('click', async (event) => {
    const t = event.target instanceof Element ? event.target : null;
    if (!t) return;
    const control = t.closest('[data-ck-set]');
    if (control) {
        const stage = /** @type {HTMLElement | null} */ (
            document.getElementById(control.closest('[data-review-controls]')?.getAttribute('data-review-controls-for') ?? '')
        );
        if (stage) await setState(stage, control.getAttribute('data-ck-set') ?? '', control.getAttribute('data-ck-value') ?? '');
        return;
    }
    const stage = /** @type {HTMLElement | null} */ (t.closest('.ck-stage') ?? t.closest('section')?.querySelector('.ck-stage') ?? null);
    const dlg = /** @type {HTMLDialogElement | null} */ (t.closest('dialog.st-clean, dialog.st-compact'));
    const info = dlg ? DIALOGS.get(dlg) : null;

    const cleanup = t.closest('[data-st-cleanup]');
    if (cleanup && stage) {
        event.preventDefault();
        await openCleanup(stage, cleanup.getAttribute('data-st-cleanup') ?? '');
        return;
    }
    if (t.closest('[data-st-compact]') && stage) {
        event.preventDefault();
        dlg?.close();
        await openCompact(stage);
        return;
    }
    if (t.closest('[data-kp-card-retry], [data-kp-datatable-retry]') && stage && stage.dataset.ckView === 'storage-states') {
        await setState(stage, 'state', 'ready');
        return;
    }
    const link = t.closest('a[href^="#"]');
    if (link && stage?.contains(link)) {
        event.preventDefault();
        say(`Opens ${link.textContent?.trim() || 'the page'} in the real dashboard.`);
        return;
    }
    if (!dlg || !info) return;

    if (info.clean) {
        const c = /** @type {Clean} */ (info.clean);
        if (t.closest('[data-st-reset]')) {
            c.form = defaultForm(kindById(c.kind));
            c.preview = 'idle';
            await redraw(dlg);
        } else if (t.closest('[data-st-preview]')) {
            readForm(dlg, c);
            c.preview = 'loading';
            await redraw(dlg);
            await sleep(800);
            c.preview = 'ready';
            await redraw(dlg);
        } else if (t.closest('[data-st-continue]')) {
            c.step = 'confirm';
            await redraw(dlg);
            dlg.querySelector('[data-kp-type-confirm] input')?.dispatchEvent(new Event('focus'));
            /** @type {HTMLElement | null} */ (dlg.querySelector('[data-kp-type-confirm] input'))?.focus();
        } else if (t.closest('[data-st-back]')) {
            c.step = 'choose';
            await redraw(dlg);
        } else if (t.closest('[data-st-delete]')) {
            const btn = /** @type {HTMLElement} */ (t.closest('[data-st-delete]'));
            const typed = /** @type {HTMLInputElement | null} */ (dlg.querySelector('[data-kp-type-confirm] input'))?.value ?? '';
            const expected = preview(kindById(c.kind), c.form).count;
            let result = /** @type {any} */ (null);
            await runFlashButton(btn, async () => {
                await sleep(900);
                result = serverDelete(c, typed, expected);
                return result.error ? result : undefined;
            });
            if (result?.ok) {
                c.done = { count: result.ok.count, bytes: result.ok.bytes };
                c.step = 'done';
                await redraw(dlg);
                await refreshAll();
            }
        }
    } else if (info.compact && t.closest('[data-st-run]')) {
        const c = /** @type {Compact} */ (info.compact);
        const btn = /** @type {HTMLElement} */ (t.closest('[data-st-run]'));
        const before = totals(store.current);
        let ok = false;
        await runFlashButton(btn, async () => {
            await sleep(500);
            const list = dlg.querySelector('.kp-steplist');
            for (const [id, state] of [
                ['pause', 'done'],
                ['rewrite', 'running'],
            ])
                list?.querySelector(`[data-kp-step-id="${id}"]`)?.setAttribute('data-state', state);
            await sleep(1500);
            applyCompact();
            ok = true;
            return undefined;
        });
        if (ok) {
            c.freed = before.free + before.wal;
            c.state = 'done';
            await redraw(dlg);
            await refreshAll();
        }
    }
});

// A card or a preview that failed asks again through the package's own retry event.
document.addEventListener('kp-card-retry', async (event) => {
    const el = event.target instanceof Element ? event.target : null;
    const stage = /** @type {HTMLElement | null} */ (el?.closest('.ck-stage'));
    const dlg = /** @type {HTMLDialogElement | null} */ (el?.closest('dialog.st-clean, dialog.st-compact') ?? null);
    const info = dlg ? DIALOGS.get(dlg) : null;
    if (info?.clean) {
        info.clean.preview = 'loading';
        await redraw(/** @type {HTMLDialogElement} */ (dlg));
        await sleep(700);
        info.clean.preview = 'ready';
        await redraw(/** @type {HTMLDialogElement} */ (dlg));
    } else if (info?.compact) {
        info.compact.state = 'ready';
        await redraw(/** @type {HTMLDialogElement} */ (dlg));
    } else if (stage?.dataset.ckView === 'storage-states') await setState(stage, 'state', 'ready');
});
document.addEventListener('kp-datatable-retry', async (event) => {
    const stage = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('.ck-stage') : null);
    if (stage?.dataset.ckView === 'storage-states') await setState(stage, 'state', 'ready');
});

// A change of any choice in an open clean-up dialog makes the old preview stale: it must be asked for again.
for (const type of ['change', 'kp-segmented-change', 'kp-date-change']) {
    document.addEventListener(type, async (event) => {
        const el = event.target instanceof Element ? event.target : null;
        const dlg = /** @type {HTMLDialogElement | null} */ (el?.closest('dialog.st-clean') ?? null);
        const info = dlg ? DIALOGS.get(dlg) : null;
        if (!dlg || !info?.clean || !el?.closest('[data-st-filter], [data-st-older], .kp-datepicker')) return;
        const c = /** @type {Clean} */ (info.clean);
        readForm(dlg, c);
        if (c.preview !== 'idle') {
            c.preview = 'idle';
            await redraw(dlg);
        }
    });
}

document.addEventListener('submit', (event) => {
    if (event.target instanceof HTMLFormElement && event.target.closest('.ck-stage')) event.preventDefault();
});

/** A choice of the review dialog: set it, and show it on every section it concerns. */
document.addEventListener('review:choice', async (event) => {
    const d = /** @type {CustomEvent} */ (event).detail;
    if (!d || !(d.id in choice)) return;
    choice[d.id] = String(d.value);
    await renderAll();
});

globalThis.stSize = size;
globalThis.stDmy = dmy;

await renderAll();
