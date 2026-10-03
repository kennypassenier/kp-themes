// The demo review kit: judge every section of a research demo in every theme
// from one dialog, and copy one structured answer back into the conversation
// (Kenny, 2026-10-03: "is er een manier om dit allemaal goed te keuren in een
// dialog zoals bij every component, one page? … kan dit vanaf nu altijd voor
// demos?"). Every research demo carries it from now on.
//
// A demo opts in with three attributes and one module:
//
//   <html data-review="<demo id>" data-review-themes="formal,retro">  (themes optional: default all)
//   <section data-review-item="spinner" data-review-title="Spinner">  (one per judged piece)
//     <div data-review-look><p data-for="formal">what to look at in formal</p>…</div>
//   <script type="module" src="../_review/review.js"></script>
//
// The dialog walks theme by theme: every item in one theme, then it switches
// the theme itself and walks the next, so the reviewer never picks a theme or
// a section by hand. The section moves into the dialog and back, so its
// behaviour and animations stay attached (the catalogue's review dialog does
// the same, catalogue/review-dialog.js). Keys as in the catalogue: Up
// approves, Down rejects (with a note), Left/Right move while the note is
// empty, Escape closes. After the last open pair the dialog closes.
//
// Verdicts and notes live in this browser only (localStorage, per demo id);
// the answer at the foot of the page is what reaches the conversation.
import { THEMES } from '../../js/theme-registry.js';
import { applyTheme, currentTheme } from '../../js/theme-core.js';

const root = document.documentElement;
const DEMO = root.dataset.review;
const STORE = `kp-demo-review:${DEMO}`;
const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const ORDER = root.dataset.reviewThemes
    ? root.dataset.reviewThemes.split(',').map((s) => s.trim()).filter(Boolean)
    : THEMES.map((t) => t.name);

const sections = [...document.querySelectorAll('[data-review-item]')];
const items = sections.map((section) => ({
    id: section.dataset.reviewItem,
    title: section.dataset.reviewTitle || section.querySelector('h2, h3')?.textContent.trim() || section.dataset.reviewItem,
    section,
}));
/** Theme-major: every item in one theme before the next theme. */
const pairs = ORDER.flatMap((theme) => items.map((item) => ({ theme, item, key: `${theme}|${item.id}` })));

/* ------------------------------------------------------------- storage */

function load() {
    try {
        return JSON.parse(localStorage.getItem(STORE) || '{}') || {};
    } catch {
        return {};
    }
}
let state = load();
function save() {
    try {
        localStorage.setItem(STORE, JSON.stringify(state));
    } catch {
        /* private window: the answer on the page still holds everything */
    }
}
const verdictOf = (pair) => state[pair.key]?.verdict;
const noteOf = (pair) => state[pair.key]?.note || '';
const isOpen = (pair) => !verdictOf(pair);

/* --------------------------------------------------------------- theme */

const registerUrl = (theme) => new URL(`../../css/${theme}-register.css`, import.meta.url).href;

/** Switches the theme, loading its register first so nothing paints unstyled. */
async function switchTheme(theme) {
    if (currentTheme() === theme) return;
    const managed = document.querySelector('link[data-kp-register]');
    const present = [...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => l.href === registerUrl(theme));
    if (!present) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = registerUrl(theme);
        link.setAttribute('data-kp-register', theme);
        const loaded = new Promise((resolve) => {
            link.onload = link.onerror = resolve;
        });
        (managed || document.head.lastElementChild).after(link);
        await loaded;
    }
    applyTheme(theme);
}

/* ---------------------------------------------------------------- page */

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = new URL('review.css', import.meta.url).href;
document.head.append(style);

const bar = document.createElement('div');
bar.className = 'rv-bar';
bar.innerHTML = `
    <span class="rv-bar__count" data-rv-count></span>
    <span class="rv-bar__spacer"></span>
    <button type="button" class="kp-button kp-button--primary" data-rv-open>Review in a dialog</button>
    <button type="button" class="kp-button" data-rv-copy>Copy answer</button>`;
// Inside the page's main column: on a page the catalogue shell wraps, the body
// is a grid and a bar beside main would become a cell of its own.
(document.querySelector('main') || document.body).prepend(bar);

const foot = document.createElement('section');
foot.className = 'rv-answer';
foot.setAttribute('aria-labelledby', 'rv-answer-title');
foot.innerHTML = `
    <h2 id="rv-answer-title">Your answer</h2>
    <p class="rv-meta">Every verdict and note from the dialog, as one answer to paste into the conversation. It stays in this browser until you clear it.</p>
    <pre class="rv-answer__text" data-rv-answer></pre>
    <p class="rv-answer__actions">
        <button type="button" class="kp-button" data-rv-copy>Copy answer</button>
        <button type="button" class="kp-button kp-button--ghost" data-rv-clear>Clear all verdicts</button>
        <span class="rv-meta" role="status" aria-live="polite" data-rv-status></span>
    </p>`;
(document.querySelector('main') || document.body).append(foot);

function answer() {
    const judged = pairs.filter((p) => !isOpen(p));
    const rejected = pairs.filter((p) => verdictOf(p) === 'rejected');
    const open = pairs.filter(isOpen);
    const lines = [
        `Demo review · ${DEMO} · ${judged.length} of ${pairs.length} judged, ${judged.length - rejected.length} approved, ${rejected.length} not approved, ${open.length} open`,
    ];
    const all = items.filter((item) => pairs.filter((p) => p.item === item).every((p) => verdictOf(p) === 'approved'));
    if (all.length) lines.push('', `Approved in every theme: ${all.map((i) => i.id).join(', ')}`);
    if (rejected.length) {
        lines.push('', 'Not approved:');
        for (const p of rejected) lines.push(`- ${p.item.id} · ${p.theme}: ${noteOf(p)}`);
    }
    const notes = pairs.filter((p) => verdictOf(p) === 'approved' && noteOf(p));
    if (notes.length) {
        lines.push('', 'Approved, with a note:');
        for (const p of notes) lines.push(`- ${p.item.id} · ${p.theme}: ${noteOf(p)}`);
    }
    if (open.length) {
        lines.push('', 'Still open:');
        for (const item of items) {
            const themes = open.filter((p) => p.item === item).map((p) => p.theme);
            if (themes.length) lines.push(`- ${item.id}: ${themes.length === ORDER.length ? 'every theme' : themes.join(', ')}`);
        }
    }
    return { text: lines.join('\n'), judged: judged.length, rejected: rejected.length };
}

function render() {
    const { text, judged, rejected } = answer();
    foot.querySelector('[data-rv-answer]').textContent = text;
    bar.querySelector('[data-rv-count]').textContent =
        `${judged} of ${pairs.length} judged${rejected ? ` · ${rejected} not approved` : ''}`;
    bar.querySelector('[data-rv-open]').textContent = judged ? (judged === pairs.length ? 'Look again in the dialog' : 'Continue in the dialog') : 'Review in a dialog';
}

const say = (message) => {
    foot.querySelector('[data-rv-status]').textContent = message;
};

for (const copy of document.querySelectorAll('[data-rv-copy]')) {
    copy.addEventListener('click', async () => {
        const { text } = answer();
        try {
            await navigator.clipboard.writeText(text);
            say('Copied. Paste it into the conversation.');
        } catch {
            const pre = foot.querySelector('[data-rv-answer]');
            pre.scrollIntoView({ block: 'center' });
            const range = document.createRange();
            range.selectNodeContents(pre);
            getSelection()?.removeAllRanges();
            getSelection()?.addRange(range);
            say('Selected. Press Ctrl+C to copy.');
        }
    });
}

foot.querySelector('[data-rv-clear]').addEventListener('click', () => {
    if (!confirm('Clear every verdict and note on this demo, in every theme?')) return;
    state = {};
    save();
    render();
    say('Cleared.');
});

/* -------------------------------------------------------------- dialog */

const dialog = document.createElement('dialog');
dialog.className = 'kp-dialog rv-dialog';
dialog.setAttribute('aria-labelledby', 'rv-dialog-title');
dialog.innerHTML = `
    <div class="rv-dialog__head">
        <p class="rv-dialog__position" data-rv-position></p>
        <h2 class="kp-dialog__title" id="rv-dialog-title" data-rv-title></h2>
        <span class="kp-badge" data-rv-theme></span>
        <span class="kp-badge" data-rv-state></span>
        <button type="button" class="kp-button kp-button--ghost rv-dialog__close" aria-label="Close (Escape)" data-rv-close>✕</button>
    </div>
    <div class="rv-dialog__grid">
        <div class="rv-dialog__stage" data-rv-stage></div>
        <div class="rv-dialog__side">
            <div class="rv-dialog__look" data-rv-look></div>
            <div class="kp-field rv-dialog__field">
                <label class="kp-field__label" for="rv-note">Note</label>
                <textarea class="kp-field__input kp-field__input--multiline" id="rv-note" rows="3" aria-describedby="rv-keys" data-rv-note></textarea>
                <p class="kp-field__error" role="alert" data-rv-refused hidden>Not approved needs a note saying what should change.</p>
            </div>
            <div class="rv-dialog__actions">
                <button type="button" class="kp-button" data-rv-go="-1">← Previous</button>
                <button type="button" class="kp-button" data-rv-go="1">Next →</button>
                <button type="button" class="kp-button kp-button--primary" data-rv-verdict="approved">↑ Approve</button>
                <button type="button" class="kp-button kp-button--destructive" data-rv-verdict="rejected">↓ Not approved</button>
                <button type="button" class="kp-button kp-button--ghost rv-dialog__wide" data-rv-theme-all>Approve the rest of this theme</button>
            </div>
            <p class="rv-meta" id="rv-keys">Up approves, Down rejects with a note, Left/Right move while the note is empty, Escape closes. The theme switches by itself.</p>
        </div>
    </div>`;
document.body.append(dialog);
const $ = (selector) => /** @type {HTMLElement} */ (dialog.querySelector(selector));
const note = /** @type {HTMLTextAreaElement} */ ($('[data-rv-note]'));
const stage = $('[data-rv-stage]');
const refused = $('[data-rv-refused]');

let index = 0;
/** @type {Comment | null} */
let placeholder = null;
let shown = null;

function putBack() {
    if (shown && placeholder) {
        placeholder.replaceWith(shown);
        placeholder = null;
        shown = null;
    }
}

/** True while a theme loads: a key pressed then would judge a pair not yet on screen. */
let busy = false;

async function show(at) {
    if (busy) return;
    busy = true;
    try {
        await display(at);
    } finally {
        busy = false;
    }
}

async function display(at) {
    const pair = pairs[(at + pairs.length) % pairs.length];
    await switchTheme(pair.theme);
    index = pairs.indexOf(pair);
    putBack();
    placeholder = document.createComment('review');
    pair.item.section.replaceWith(placeholder);
    stage.replaceChildren(pair.item.section);
    shown = pair.item.section;
    stage.scrollTop = 0;

    const themeAt = ORDER.indexOf(pair.theme) + 1;
    const itemAt = items.indexOf(pair.item) + 1;
    $('[data-rv-position]').textContent = `Theme ${themeAt}/${ORDER.length} · item ${itemAt}/${items.length}`;
    $('[data-rv-title]').textContent = pair.item.title;
    $('[data-rv-theme]').textContent = LABEL[pair.theme] || pair.theme;
    const verdict = verdictOf(pair);
    const badge = $('[data-rv-state]');
    badge.textContent = verdict === 'approved' ? 'Approved' : verdict === 'rejected' ? 'Not approved' : 'Open';
    badge.className = `kp-badge${verdict === 'approved' ? ' kp-badge--success' : verdict === 'rejected' ? ' kp-badge--destructive' : ''}`;

    const look = pair.item.section.querySelector(`[data-review-look] [data-for="${pair.theme}"]`);
    $('[data-rv-look]').innerHTML = look
        ? `<p class="rv-meta">Look at, in ${LABEL[pair.theme] || pair.theme}:</p><p>${look.innerHTML}</p>`
        : '';
    note.value = noteOf(pair);
    refused.hidden = true;
    if (!dialog.open) dialog.showModal();
    note.focus();
    note.setSelectionRange(note.value.length, note.value.length);
}

function nextOpen(from) {
    for (let step = 1; step <= pairs.length; step++) {
        const at = (from + step) % pairs.length;
        if (isOpen(pairs[at])) return at;
    }
    return -1;
}

function finish() {
    dialog.close();
    foot.scrollIntoView({ block: 'start' });
    say('Everything is judged. Copy the answer and paste it into the conversation.');
}

function record(verdict) {
    if (busy) return;
    const pair = pairs[index];
    const text = note.value.trim();
    if (verdict === 'rejected' && !text) {
        refused.hidden = false;
        note.focus();
        return;
    }
    state[pair.key] = { verdict, note: text, at: new Date().toISOString() };
    save();
    render();
    const next = nextOpen(index);
    if (next < 0) finish();
    else show(next);
}

function keepNote() {
    const pair = pairs[index];
    const text = note.value.trim();
    if (state[pair.key]) state[pair.key].note = text;
    else if (text) state[pair.key] = { note: text };
    save();
    render();
}

note.addEventListener('input', keepNote);

dialog.addEventListener('click', (event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    if (target.closest('[data-rv-close]')) return dialog.close();
    const go = target.closest('[data-rv-go]');
    if (go) return show(index + Number(go.getAttribute('data-rv-go')));
    const verdict = target.closest('[data-rv-verdict]');
    if (verdict) return record(/** @type {'approved'|'rejected'} */ (verdict.getAttribute('data-rv-verdict')));
    if (target.closest('[data-rv-theme-all]') && !busy) {
        const theme = pairs[index].theme;
        for (const pair of pairs.filter((p) => p.theme === theme && isOpen(p))) {
            state[pair.key] = { verdict: 'approved', note: noteOf(pair), at: new Date().toISOString() };
        }
        save();
        render();
        const next = nextOpen(index);
        if (next < 0) finish();
        else show(next);
    }
});

dialog.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    // Closed here rather than by the browser's own cancel: Chromium dropped
    // the Escape after the dialog had switched the theme a few times.
    if (event.key === 'Escape') {
        event.preventDefault();
        dialog.close();
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        record('approved');
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        record('rejected');
    } else if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !note.value) {
        event.preventDefault();
        show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
});

dialog.addEventListener('close', () => {
    putBack();
    stage.replaceChildren();
});

bar.querySelector('[data-rv-open]').addEventListener('click', () => {
    const first = nextOpen(-1);
    show(first < 0 ? 0 : first);
});

window.addEventListener('storage', (event) => {
    if (event.key === STORE) {
        state = load();
        render();
    }
});

render();
