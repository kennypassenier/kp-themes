// The review dialog's key helpers [kit-keys-1018]: a key legend, focus between sections, Undo, the "Rejected so far"
// popover and a bulk approval. They live in this module so the dialog's layout (review.js / review.css) stays
// another owner's; review.js calls five hooks, each marked `[kit-keys]`.
//
// Every helper is a per-viewer OPTION (localStorage `kp-review-keys`, switched at runtime from the "Keys" button in the
// dialog's head, or `window.kpReviewKeys.set('bulk', true)`):
//
//   legend    default ON   the one compact line that lists the keys
//   undo      default ON   U undoes the last approve or reject
//   rejected  default ON   Y (or the button) opens "Rejected so far", an overlay on the stage
//   bulk      default OFF  G approves the rest of a theme after 3 approvals in a row there, with a 10 s undo
//
// Keys are PHYSICAL key codes (event.code), so they sit under the same fingers on AZERTY and QWERTY. The kit's rule is
// the left hand on the home row and the right on the arrows (DEMO_RULES 7): X and G are left hand; J K U Y are
// right-hand letters Kenny's brief named, kept in KEYS below so moving one is a one-line change.
//
// The journal stays append-only: an undo and a bulk approval are appended as entries (`kind: 'undo' | 'bulk'`,
// progress.js), nothing is ever removed.
import { journal, storeKey } from './progress.js';

/** The physical key of every action; the only place a key is named. */
export const KEYS = {
    next: 'KeyJ', // focus the next section
    prev: 'KeyK', // focus the previous section
    toggle: 'KeyX', // toggle "Not approved" on the focused section
    reject: 'KeyN', // with ArrowDown: reject the focused section (never un-rejects)
    undo: 'KeyU',
    rejected: 'KeyY',
    bulk: 'KeyG',
};
/** The keys a lane frame hands up to the dialog (review.js lane()), besides V and L. */
export const FRAME_KEYS = new Set([KEYS.next, KEYS.prev, KEYS.toggle, KEYS.reject, KEYS.undo, KEYS.rejected, KEYS.bulk]);

const SETTINGS_KEY = 'kp-review-keys';
const DEFAULTS = { legend: true, undo: true, rejected: true, bulk: false };
const OPTION_TEXT = {
    legend: ['Key legend', 'One line that lists the keys.'],
    undo: ['Undo (U)', 'Takes back the last approve or reject.'],
    rejected: ['Rejected so far (Y)', 'An overlay with your rejections, changed defaults and removed options.'],
    bulk: ['Approve the rest of a theme (G)', 'Offered after 3 approvals in a row in a theme; recorded as approved unseen.'],
};
const STREAK = 3;
const BULK_UNDO_MS = 10000;
const STACK_MAX = 50;

function loadOptions() {
    try {
        const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') || {};
        return Object.fromEntries(Object.entries(DEFAULTS).map(([name, on]) => [name, typeof stored[name] === 'boolean' ? stored[name] : on]));
    } catch {
        return { ...DEFAULTS };
    }
}
function saveOptions(options) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(options));
    } catch {
        /* a private window: the setting holds for this visit */
    }
}

const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
};
const kbd = (text) => el('kbd', 'rvk-key', text);

/**
 * @param {object} api  what review.js hands over (closures over its own state):
 *   demo, dialog, stage, list, approveButton, steps, pairs, index(), shownPairs(), round(), state(), save(), render(),
 *   show(at), isOpen(pair), verdictOf(pair), noteOf(pair), changedFrom(pair, choice), defaultOf, choiceOf, removedOf,
 *   optionLabel, onceKey, label(theme)
 */
export function mountKeys(api) {
    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.href = new URL('rv-keys.css', import.meta.url).href;
    document.head.append(sheet);

    const options = loadOptions();
    const undoKey = `${storeKey(api.demo)}:keys-undo`;
    const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------------ chrome */
    const head = api.dialog.querySelector('.rv-dialog__head');
    const barEl = el('div', 'rvk-bar');
    const legendEl = el('p', 'rvk-legend');
    legendEl.id = 'rvk-legend';
    const said = el('span', 'rvk-said');
    said.setAttribute('role', 'status');
    said.setAttribute('aria-live', 'polite');
    const rejectedButton = el('button', 'kp-button kp-button--sm kp-button--ghost rvk-button', 'Rejected so far');
    rejectedButton.type = 'button';
    rejectedButton.setAttribute('aria-expanded', 'false');
    rejectedButton.setAttribute('aria-controls', 'rvk-pop');
    const gear = el('button', 'kp-button kp-button--sm kp-button--ghost rvk-button', 'Keys');
    gear.type = 'button';
    gear.title = 'Switch the key helpers on or off';
    gear.setAttribute('aria-expanded', 'false');
    gear.setAttribute('aria-controls', 'rvk-panel');
    barEl.append(legendEl, said, rejectedButton, gear);
    head.append(barEl);

    const panel = el('div', 'rvk-panel');
    panel.id = 'rvk-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', 'Key helpers');
    for (const [name, [title, hint]] of Object.entries(OPTION_TEXT)) {
        const row = el('label', 'rvk-panel__row');
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = options[name];
        box.dataset.rvkOption = name;
        box.addEventListener('change', () => set(name, box.checked));
        const text = el('span');
        text.append(el('b', '', title), el('span', 'rvk-panel__hint', hint));
        row.append(box, text);
        panel.append(row);
    }

    const pop = el('aside', 'rvk-pop');
    pop.id = 'rvk-pop';
    pop.hidden = true;
    pop.setAttribute('aria-label', 'Rejected so far');
    const popHead = el('div', 'rvk-pop__head');
    popHead.append(el('b', '', 'Rejected so far'));
    const popClose = el('button', 'kp-button kp-button--sm kp-button--ghost', 'Close (Y)');
    popClose.type = 'button';
    popHead.append(popClose);
    const popList = el('ul', 'rvk-pop__list');
    pop.append(popHead, popList);

    const toast = el('div', 'rvk-toast');
    toast.hidden = true;
    toast.setAttribute('role', 'status');
    api.dialog.append(panel, pop, toast);

    /* ------------------------------------------------------------- state */
    let focusKey = null;
    let confirming = null;
    let toastTimer = 0;
    let saidTimer = 0;
    /** The undo stack, newest last; kept in this browser so a reload still undoes. @type {Array<any>} */
    let stack = [];
    try {
        stack = (JSON.parse(localStorage.getItem(undoKey) || '[]') || []).filter((entry) => entry.round === api.round());
    } catch {
        stack = [];
    }
    const persist = () => {
        try {
            localStorage.setItem(undoKey, JSON.stringify(stack.slice(-STACK_MAX)));
        } catch {
            /* the stack holds for this visit; the journal has everything */
        }
    };

    const step = () => api.steps[api.index()];
    const isAspect = () => Boolean(step()?.aspect);
    const stepTheme = () => step()?.laneTheme || step()?.theme || null;
    const pairByKey = (key) => api.pairs.find((p) => p.key === key);
    const say = (message) => {
        said.textContent = message;
        clearTimeout(saidTimer);
        saidTimer = setTimeout(() => (said.textContent = ''), 7000);
    };
    const scrollTo = (node, block) => node?.scrollIntoView({ block, behavior: reduced() ? 'auto' : 'smooth' });

    /* ------------------------------------------------------------ options */
    function set(name, on) {
        if (!(name in DEFAULTS)) return;
        options[name] = Boolean(on);
        saveOptions(options);
        const box = panel.querySelector(`[data-rvk-option="${name}"]`);
        if (box) box.checked = options[name];
        if (!options.rejected) closePop();
        if (!options.bulk) cancelConfirm();
        paintLegend();
    }
    window.kpReviewKeys = { options: () => ({ ...options }), set };

    function togglePanel(open = panel.hidden) {
        panel.hidden = !open;
        gear.setAttribute('aria-expanded', String(open));
    }
    gear.addEventListener('click', () => togglePanel());

    /* ------------------------------------------------------------- legend */
    function paintLegend() {
        legendEl.hidden = !options.legend;
        rejectedButton.hidden = !options.rejected;
        legendEl.replaceChildren();
        const add = (keys, text, title) => {
            const item = el('span', 'rvk-legend__item');
            keys.forEach((key, at) => item.append(...(at ? [document.createTextNode(' '), kbd(key)] : [kbd(key)])));
            item.append(document.createTextNode(` ${text}`));
            if (title) item.title = title;
            legendEl.append(item);
        };
        if (isAspect()) {
            add(['←', '→'], 'flip');
            add(['↑'], 'pick');
            add(['↓', 'N'], 'none of these');
        } else {
            add(['↑'], 'approve');
            add(['↓', 'N'], 'reject focused');
            add(['J', 'K'], 'focus', 'J moves the focus to the next section, K to the previous one');
            add(['X'], 'not approved', 'Toggles "Not approved" on the focused section');
            add(['←', '→'], 'step');
        }
        if (options.undo) add(['U'], 'undo');
        if (options.rejected) add(['Y'], 'rejected so far');
        if (options.bulk) {
            const offer = bulkOffer();
            if (offer) add(['G'], `approve the rest of ${api.label(offer.theme)} (${offer.keys.length})`, 'Approves every open pair of this theme without showing it');
        }
        add(['Esc'], 'close');
        rejectedButton.setAttribute('aria-keyshortcuts', 'Y');
    }

    /* -------------------------------------------------------------- focus */
    const rowKeys = () => [...api.list.querySelectorAll('.rv-row[data-rv-key]')].map((row) => row.dataset.rvKey);
    function paintFocus() {
        for (const node of api.dialog.querySelectorAll('.rvk-focus')) node.classList.remove('rvk-focus');
        if (!focusKey || isAspect()) return;
        const sel = CSS.escape(focusKey);
        api.stage.querySelector(`[data-rv-pair="${sel}"]`)?.classList.add('rvk-focus');
        api.list.querySelector(`.rv-row[data-rv-key="${sel}"]`)?.classList.add('rvk-focus');
    }
    /** Focus moves to a section: the subtle left rule on it and on its row. */
    function setFocus(key, { scroll = false } = {}) {
        focusKey = key;
        paintFocus();
        if (scroll && key) {
            const sel = CSS.escape(key);
            scrollTo(api.stage.querySelector(`[data-rv-pair="${sel}"]`), 'start');
            scrollTo(api.list.querySelector(`.rv-row[data-rv-key="${sel}"]`), 'nearest');
        }
    }
    function moveFocus(dir) {
        const keys = rowKeys();
        if (!keys.length) return;
        const at = keys.indexOf(focusKey);
        const to = Math.max(0, Math.min(keys.length - 1, at < 0 ? 0 : at + dir));
        setFocus(keys[to], { scroll: true });
        if (to === at) say(dir > 0 ? 'This is the last section.' : 'This is the first section.');
    }
    const rewatch = new MutationObserver(paintFocus);
    rewatch.observe(api.stage, { childList: true });
    rewatch.observe(api.list, { childList: true });
    api.dialog.addEventListener('click', (event) => {
        const node = /** @type {HTMLElement} */ (event.target).closest?.('[data-rv-pair], .rv-row[data-rv-key]');
        const key = node?.dataset.rvPair || node?.dataset.rvKey;
        if (key && key !== focusKey) setFocus(key);
    });
    // A click inside a lane's frame moves the page's focus to the frame: the lane it is in takes the rule.
    addEventListener('blur', () =>
        setTimeout(() => {
            const frame = document.activeElement;
            const key = frame?.tagName === 'IFRAME' ? frame.closest('[data-rv-pair]')?.dataset.rvPair : null;
            if (key && api.dialog.open) setFocus(key);
        }),
    );

    /** Sets or clears "Not approved" on a section, through its own box so the kit files it as ever. */
    function setReject(key, want) {
        const box = key && api.list.querySelector(`.rv-row[data-rv-key="${CSS.escape(key)}"] [data-rv-reject]`);
        if (!box) return say('Nothing to reject here.');
        if (box.checked !== want) {
            box.checked = want;
            box.dispatchEvent(new Event('change'));
        }
        // The kit puts the caret in the note; a keyed reject needs no note, and the keys must keep working.
        if (document.activeElement?.matches?.('textarea')) api.approveButton.focus({ preventScroll: true });
        scrollTo(api.stage.querySelector(`[data-rv-pair="${CSS.escape(key)}"]`), 'nearest');
        refresh();
    }

    /* --------------------------------------------------------------- undo */
    /**
     * Called by review.js BEFORE it changes the verdicts of these pairs (a box, Approve, an aspect answer).
     * @param {string[]} keys @param {string} label
     */
    function snap(keys, label) {
        if (!options.undo) return;
        const state = api.state();
        const before = {};
        for (const key of keys) before[key] = state[key] ? JSON.parse(JSON.stringify(state[key])) : null;
        stack.push({ kind: 'verdict', round: api.round(), index: api.index(), keys, before, label });
        stack = stack.slice(-STACK_MAX);
        persist();
    }

    async function undo() {
        if (!options.undo) return;
        const top = stack.at(-1);
        if (!top) return say('Nothing to undo.');
        stack.pop();
        persist();
        if (top.kind === 'bulk' && Date.now() > top.until) {
            hideToast();
            return say('That bulk approval is final: its 10 s are over. U now undoes the action before it.');
        }
        const state = api.state();
        for (const key of top.keys) {
            const was = top.before[key];
            if (was) state[key] = was;
            else delete state[key];
            journal(api.demo, {
                round: api.round(),
                pair: key,
                verdict: was?.verdict ?? null,
                note: was?.note || '',
                choice: null,
                label: pairByKey(key)?.label,
                kind: 'undo',
            });
        }
        api.save();
        api.render();
        hideToast();
        await api.show(Math.min(top.index, api.steps.length - 1));
        const first = top.keys.find((key) => rowKeys().includes(key)) || rowKeys()[0];
        if (first) setFocus(first, { scroll: true });
        say(
            top.kind === 'bulk'
                ? `Undone: ${top.keys.length} pairs are open again.`
                : `Undone: ${top.label}. You are back on that step.`,
        );
    }

    /* ------------------------------------------------------ rejected so far */
    function rejectedLines() {
        const state = api.state();
        const seen = new Set();
        const out = [];
        for (const pair of api.pairs) {
            const lines = [];
            if (api.verdictOf(pair) === 'rejected') lines.push(['Not approved', api.noteOf(pair) || 'no note']);
            for (const choice of pair.item?.choices || []) {
                if (choice.once) {
                    const now = state[api.onceKey(pair.item, choice)]?.value;
                    const mark = `${pair.item.id}|${choice.id}`;
                    if (now && now !== api.defaultOf({ theme: '' }, choice) && !seen.has(mark)) {
                        seen.add(mark);
                        lines.push(['Default changed', `${choice.label}: ${api.optionLabel(choice, now)} (every theme)`]);
                    }
                } else if (api.changedFrom(pair, choice)) {
                    lines.push(['Default changed', `${choice.label}: ${api.optionLabel(choice, api.choiceOf(pair, choice))}`]);
                }
                for (const value of api.removedOf(pair, choice)) lines.push(['Option removed', `${choice.label}: ${api.optionLabel(choice, value)}`]);
            }
            if (lines.length) out.push({ pair, lines });
        }
        return out;
    }
    function paintPop() {
        if (pop.hidden) return;
        const groups = rejectedLines();
        popList.replaceChildren();
        if (!groups.length) popList.append(el('li', 'rvk-pop__empty', 'Nothing rejected, changed or removed yet.'));
        for (const { pair, lines } of groups) {
            const item = el('li', 'rvk-pop__item');
            const jump = el('button', 'rvk-pop__jump', pair.label);
            jump.type = 'button';
            jump.addEventListener('click', () => jumpTo(pair));
            item.append(jump);
            for (const [kind, text] of lines) {
                const line = el('p', 'rvk-pop__line');
                line.append(el('b', '', `${kind}: `), document.createTextNode(text));
                item.append(line);
            }
            popList.append(item);
        }
        popHead.querySelector('b').textContent = `Rejected so far (${groups.length})`;
    }
    function openPop(open = pop.hidden) {
        if (open && !options.rejected) return;
        pop.hidden = !open;
        rejectedButton.setAttribute('aria-expanded', String(open));
        paintPop();
    }
    const closePop = () => openPop(false);
    rejectedButton.addEventListener('click', () => openPop());
    popClose.addEventListener('click', closePop);
    async function jumpTo(pair) {
        const at = api.steps.findIndex((s) => s.pairs.includes(pair));
        if (at < 0) return;
        if (at !== api.index()) await api.show(at);
        if (rowKeys().includes(pair.key)) setFocus(pair.key, { scroll: true });
        else say(`${pair.label} is approved, so its section is no longer shown; its step is open.`);
    }

    /* --------------------------------------------------------------- bulk */
    /** Approvals in a row in a theme: the newest approvals of that theme, counted per Approve, until a rejection. */
    function streakOf(theme) {
        const state = api.state();
        const judged = api.pairs
            .filter((p) => !p.extra && p.theme === theme && state[p.key]?.verdict && state[p.key]?.at)
            .sort((a, b) => String(state[a.key].at).localeCompare(String(state[b.key].at)));
        const approvals = new Set();
        for (const pair of judged.reverse()) {
            const entry = state[pair.key];
            if (entry.verdict !== 'approved' || entry.unseen) break;
            approvals.add(entry.at);
        }
        return approvals.size;
    }
    /** What G would approve now, or null: not offered before 3 approvals in a row in this step's theme. */
    function bulkOffer() {
        const theme = stepTheme();
        if (!options.bulk || !theme || isAspect() || !step()?.pairs.length) return null;
        if (streakOf(theme) < STREAK) return null;
        const here = new Set(step().pairs);
        const keys = api.pairs.filter((p) => !p.extra && p.theme === theme && api.isOpen(p) && !here.has(p)).map((p) => p.key);
        return keys.length ? { theme, keys } : null;
    }
    function cancelConfirm() {
        if (!confirming) return;
        confirming = null;
        hideToast();
    }
    function showToast(build, { timeout = 0 } = {}) {
        clearTimeout(toastTimer);
        toast.replaceChildren();
        build(toast);
        toast.hidden = false;
        if (timeout) toastTimer = setTimeout(hideToast, timeout);
    }
    function hideToast() {
        clearTimeout(toastTimer);
        toast.hidden = true;
        toast.replaceChildren();
    }
    function askBulk() {
        const offer = bulkOffer();
        if (!options.bulk) return;
        if (!offer) return say(`G is offered after ${STREAK} approvals in a row in a theme, while pairs of it are still open.`);
        const topics = new Set(api.steps.filter((s) => s.pairs.some((p) => offer.keys.includes(p.key))).map((s) => s.topic || s.title));
        confirming = offer;
        showToast((box) => {
            const text = el('p', 'rvk-toast__text');
            text.append(
                el('b', '', `Approve ${offer.keys.length} pair${offer.keys.length === 1 ? '' : 's'} of ${api.label(offer.theme)} without looking?`),
                document.createTextNode(` They are approved as not seen, across ${topics.size} topic${topics.size === 1 ? '' : 's'}, and recorded as "approved unseen, ${offer.keys.length} pairs". You can undo it for 10 s.`),
            );
            const yes = el('button', 'kp-button kp-button--primary kp-button--sm', `Approve ${offer.keys.length} unseen (G)`);
            yes.type = 'button';
            yes.addEventListener('click', doBulk);
            const no = el('button', 'kp-button kp-button--sm', 'Cancel (Esc)');
            no.type = 'button';
            no.addEventListener('click', cancelConfirm);
            box.append(text, yes, no);
            queueMicrotask(() => yes.focus({ preventScroll: true }));
        });
    }
    async function doBulk() {
        const offer = confirming;
        confirming = null;
        if (!offer) return;
        const state = api.state();
        const at = new Date().toISOString();
        const n = offer.keys.length;
        const before = {};
        for (const key of offer.keys) before[key] = state[key] ? JSON.parse(JSON.stringify(state[key])) : null;
        const until = Date.now() + BULK_UNDO_MS;
        stack.push({ kind: 'bulk', round: api.round(), index: api.index(), keys: offer.keys, before, label: `approved unseen, ${n} pairs`, until });
        stack = stack.slice(-STACK_MAX);
        persist();
        for (const key of offer.keys) {
            state[key] = { ...state[key], verdict: 'approved', note: state[key]?.note || '', at, unseen: n };
            journal(api.demo, { round: api.round(), pair: key, verdict: 'approved', note: '', choice: null, label: pairByKey(key)?.label, kind: 'bulk', unseen: n });
        }
        api.save();
        api.render();
        showToast(
            (box) => {
                const text = el('p', 'rvk-toast__text');
                text.append(el('b', '', `Approved unseen: ${n} pair${n === 1 ? '' : 's'} of ${api.label(offer.theme)}.`), document.createTextNode(' Undo within 10 s.'));
                const back = el('button', 'kp-button kp-button--sm', 'Undo (U)');
                back.type = 'button';
                back.addEventListener('click', undo);
                box.append(text, back);
            },
            { timeout: BULK_UNDO_MS },
        );
        await api.show(api.index());
    }

    /* ----------------------------------------------------------- keyboard */
    const TYPING = 'textarea, select, [contenteditable], input:not([type="checkbox"]):not([type="radio"]):not([type="button"])';
    function run(code, { fromStage = false, key = '', event = null } = {}) {
        const stop = () => {
            event?.preventDefault();
            event?.stopImmediatePropagation();
            return true;
        };
        if (code === 'Escape') {
            if (confirming) return cancelConfirm(), stop();
            if (!panel.hidden) return togglePanel(false), stop();
            if (!pop.hidden) return closePop(), stop();
            return false;
        }
        if (confirming && (code === KEYS.bulk || code === 'Enter' || code === 'NumpadEnter')) return doBulk(), stop();
        if (code === KEYS.undo && options.undo) return undo(), stop();
        if (code === KEYS.rejected && options.rejected) return openPop(), stop();
        if (code === KEYS.bulk && options.bulk && !isAspect()) return askBulk(), stop();
        if (isAspect()) return false;
        if (code === KEYS.next) return moveFocus(1), stop();
        if (code === KEYS.prev) return moveFocus(-1), stop();
        if (code === KEYS.toggle) {
            const box = focusKey && api.list.querySelector(`.rv-row[data-rv-key="${CSS.escape(focusKey)}"] [data-rv-reject]`);
            return setReject(focusKey, !box?.checked), stop();
        }
        if (code === KEYS.reject || (code === 'ArrowDown' && !fromStage)) return setReject(focusKey, true), stop();
        return false;
    }
    // Window capture: before the dialog's own listener on the document, so Escape closes an open overlay first and a
    // key handled here never reaches the demo.
    addEventListener(
        'keydown',
        (event) => {
            if (!api.dialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
            const from = /** @type {HTMLElement} */ (event.target);
            if (from.matches?.(TYPING) && event.code !== 'Escape') return;
            if (event.repeat && event.code !== KEYS.next && event.code !== KEYS.prev) return;
            run(event.code, { fromStage: api.stage.contains(from), key: event.key, event });
        },
        true,
    );
    // A key pressed inside a lane's frame (review.js lane() hands it up).
    function fromFrame(code) {
        if (api.dialog.open) run(code, { fromStage: true });
    }

    /* ------------------------------------------------------------- hooks */
    function refresh() {
        paintLegend();
        paintPop();
    }
    /** review.js, at the end of show(): a step is on screen. */
    function shown(current, shownPairs) {
        cancelConfirm();
        const keys = rowKeys();
        focusKey = keys.includes(focusKey) ? focusKey : keys[0] || null;
        paintFocus();
        refresh();
    }
    api.dialog.addEventListener('change', () => queueMicrotask(refresh));
    api.dialog.addEventListener('close', () => {
        cancelConfirm();
        togglePanel(false);
    });
    /** review.js answer(): the pairs approved unseen get their own lines. */
    function answerLines() {
        const state = api.state();
        const unseen = api.pairs.filter((p) => state[p.key]?.unseen && api.verdictOf(p) === 'approved');
        return unseen.length ? ['', `Approved unseen (bulk, ${unseen.length} pairs):`, ...unseen.map((p) => `- ${p.label}`)] : [];
    }

    paintLegend();
    return { snap, shown, answerLines, fromFrame };
}
