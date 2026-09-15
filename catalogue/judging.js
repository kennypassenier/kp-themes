// The panel under every judged block — its state, Approve and Not approved,
// and the reviewer's note — and the verdicts behind it. One module for every
// place a block is judged: the review page, the component pages, the research
// demos and the compare columns (Kenny, 2026-09-13), so a verdict or a note
// made in one shows in all of them.
//
// Every verdict is per block, per theme and per browser engine (engine.js,
// detected, never asked), and counts from the register (verdicts.json) as
// well as from this browser's storage (judgements.js).
//
// Keys: a component block is `slug--block` for its verdicts and page
// `catalogue/index.html` + `slug--block` for its notes, wherever it is on
// screen; a research demo's block is `research/x/demo.html#block` and its
// notes stay under its own page.
import { currentTheme, THEME_EVENT } from '../js/theme-core.js';
import { JUDGEMENT_EVENT, JUDGEMENTS_KEY, loadJudgements, registerReady, restoreVerdict, stateOf, storeVerdict, verdictOf } from './judgements.js';
import { readBlocks } from './block-hash.js';
import { ENGINE, engineLabel } from './engine.js';
import { FEEDBACK_KEY, noteFor, NOTES_EVENT, rememberTitles, setNote, themeLabel } from './review-state.js';

/**
 * @typedef {object} Entry
 * @property {string} key        the verdict key
 * @property {string} notePage   the page its notes are stored under
 * @property {string} noteBlock  the block its notes are stored under
 * @property {string} title      what a prompt calls it
 * @property {string} source     the block's markup as written
 * @property {HTMLElement} root  what leaves the page once judged (and carries data-cat-state)
 * @property {string} fieldId    the note's textarea id
 * @property {(panel: HTMLElement) => void} place  puts the panel where it belongs
 * @property {() => Element[]} [elements]  the component's elements, where root is not the block
 */

/* ------------------------------------------------------------ review notes */

// While a block is rejected in a theme, catalogue/review-notes.json can say
// why and what changed to answer it (Kenny, 2026-09-14: a temporary text that
// goes once he approves, so the blocks' own explanations do not fill up with
// addendums). The note sits in the judging panel, outside the component under
// review, and is not part of the block's hash: writing one sends no other
// theme back to review. `node gates/verdicts.mjs note` writes one and
// `record` clears it with the approval.
//
//   { "<verdict key>": { "<theme>": { rejected, change, commit?, given } } }

/** @type {Record<string, Record<string, { rejected: string, change: string, commit?: string, given: string }>>} */
let reviewNotes = {};
/** Resolves once catalogue/review-notes.json is read (or found missing); never rejects. */
const notesReady = (async () => {
    try {
        const response = await fetch(new URL('./review-notes.json', import.meta.url), { cache: 'no-cache' });
        if (!response.ok) return;
        const data = await response.json();
        if (data && typeof data === 'object' && !Array.isArray(data)) reviewNotes = data;
    } catch {
        /* no notes */
    }
})();

/** The review note of a block in a theme, if Claude left one. */
const reviewNoteOf = (key, theme) => reviewNotes[key]?.[theme] ?? null;

/* ------------------------------------------------------------ block theme */

// A block is judged in the theme on screen, unless it declares a theme of its
// own with `data-cat-theme="<name>"` on its root (scope-86, Kenny 2026-09-15:
// "Het thema van de intro"). An intro block on catalogue/intros.html plays one
// theme's arrival in a window of its own, whatever the page wears, so its
// verdict, its note, its review note, its label and its prompt line belong to
// that theme. Only the block root is read: `data-cat-theme` on <html> is a
// page that opens in one theme (catalogue.js), and its blocks still follow the
// menu.

/** The theme a block is judged in: its own declaration, or the page's. */
export const blockTheme = (root) => root.getAttribute('data-cat-theme') || currentTheme();

const STATES = {
    new: { glyph: '○', words: 'Not yet judged', tone: '' },
    approved: { glyph: '✓', words: 'Approved', tone: ' kp-badge--success' },
    rejected: { glyph: '✕', words: 'Not approved', tone: ' kp-badge--destructive' },
    changed: { glyph: '↻', words: 'Changed since judged', tone: ' kp-badge--warning' },
    checking: { glyph: '…', words: 'Checking', tone: '' },
};

// Every rejection says why (scope-89, Kenny 2026-09-15: rejecting works only
// when the input holds text, on every review surface). Not approved with an
// empty note records nothing: the note field is marked, says what it needs
// and takes the focus, so the reviewer can type the reason and press again.
// An approval needs no text.

/** What a refused rejection says, under the note. */
export const REJECT_NEEDS_NOTE = 'Not recorded: a block is only not approved with a note. Write what is wrong, then press Not approved again.';

function panelFor(entry) {
    const panel = document.createElement('div');
    panel.className = 'cat-judge';
    panel.setAttribute('data-cat-block', entry.key);
    panel.innerHTML = `
        <div class="kp-alert kp-alert--warning cat-judge__review-note" role="note" data-cat-review-note hidden>
            <span class="kp-alert__icon" aria-hidden="true">↻</span>
            <div class="kp-alert__body">
                <p class="cat-judge__review-note-title"><span class="kp-alert__label">Rejected — what changed</span> <span class="cat-judge__review-note-meta" data-cat-review-note-meta></span></p>
                <p class="cat-judge__review-note-text"><span class="kp-alert__label">Your note:</span> <span data-cat-review-note-rejected></span></p>
                <p class="cat-judge__review-note-text"><span class="kp-alert__label">What changed:</span> <span data-cat-review-note-change></span></p>
            </div>
        </div>
        <div class="cat-judge__head">
            <p class="cat-judge__status">
                <span class="kp-badge cat-judge__badge" data-cat-approval-tone>
                    <span class="cat-judge__glyph" aria-hidden="true" data-cat-approval-glyph></span>
                    <span data-cat-approval-state></span>
                </span>
                <span class="cat-note cat-judge__source" data-cat-verdict-source></span>
            </p>
            <div class="cat-judge__actions">
                <button type="button" class="kp-button kp-button--primary kp-button--sm" data-cat-verdict="approved">Approve</button>
                <button type="button" class="kp-button kp-button--sm" data-cat-verdict="rejected">Not approved</button>
            </div>
        </div>
        <div class="kp-field cat-feedback-field cat-judge__note">
            <div class="cat-judge__note-head">
                <label class="kp-field__label cat-judge__label" for=""></label>
                <span class="cat-judge__saved" role="status" aria-live="polite" data-cat-note-saved></span>
            </div>
            <textarea class="kp-field__input kp-field__input--multiline cat-feedback-input cat-judge__input" rows="3"></textarea>
            <p class="kp-field__error cat-judge__refused" role="alert" data-cat-reject-refused hidden>${REJECT_NEEDS_NOTE}</p>
        </div>`;
    const area = panel.querySelector('textarea');
    area.id = entry.fieldId;
    panel.querySelector('label').htmlFor = entry.fieldId;
    const refused = panel.querySelector('[data-cat-reject-refused]');
    refused.id = `${entry.fieldId}-refused`;
    return panel;
}

/**
 * Mount a panel for every entry and keep them true to storage and theme.
 * @param {{ entries: Entry[], toolbar?: HTMLElement | null, onRender?: () => void }} options
 *   toolbar: a `.cat-review-bar` to fill with the count, Undo and "Show blocks already judged";
 *   given one, a judged block leaves the page until the toggle brings it back.
 */
export function mountJudging({ entries, toolbar = null, onRender }) {
    // A block with a theme of its own is read in it: its stages wear that
    // theme, so the hash is the same whatever the page around it wears.
    for (const entry of entries) {
        const own = entry.root.getAttribute('data-cat-theme');
        if (!own) continue;
        const stages = entry.root.matches('.cat-stage') ? [entry.root] : [...entry.root.querySelectorAll('.cat-stage')];
        for (const stage of stages) stage.setAttribute('data-theme', own);
    }
    const titles = {};
    for (const entry of entries) (titles[entry.notePage] ??= {})[entry.noteBlock] = entry.title;
    for (const [page, map] of Object.entries(titles)) rememberTitles(page, map);

    const items = entries.map((entry) => {
        const panel = panelFor(entry);
        entry.place(panel);
        return {
            entry,
            panel,
            badge: panel.querySelector('[data-cat-approval-tone]'),
            glyph: panel.querySelector('[data-cat-approval-glyph]'),
            state: panel.querySelector('[data-cat-approval-state]'),
            source: panel.querySelector('[data-cat-verdict-source]'),
            approve: panel.querySelector('[data-cat-verdict="approved"]'),
            reject: panel.querySelector('[data-cat-verdict="rejected"]'),
            label: panel.querySelector('label'),
            area: panel.querySelector('textarea'),
            saved: panel.querySelector('[data-cat-note-saved]'),
            field: panel.querySelector('.cat-judge__note'),
            refused: panel.querySelector('[data-cat-reject-refused]'),
            reviewNote: panel.querySelector('[data-cat-review-note]'),
            timer: 0,
        };
    });

    let count = null;
    let undo = null;
    let showJudged = null;
    if (toolbar) {
        toolbar.innerHTML = `
            <span class="cat-note" role="status" aria-live="polite" data-cat-review-count></span>
            <button type="button" class="kp-button kp-button--ghost kp-button--sm" data-cat-undo hidden>Undo</button>
            <span class="cat-bar__spacer"></span>
            <div class="kp-field kp-field--check cat-review-toggle">
                <input class="kp-field__check" type="checkbox" id="cat-show-judged" data-cat-show-judged />
                <label class="kp-field__label" for="cat-show-judged">Show blocks already judged</label>
            </div>`;
        count = toolbar.querySelector('[data-cat-review-count]');
        undo = toolbar.querySelector('[data-cat-undo]');
        showJudged = toolbar.querySelector('[data-cat-show-judged]');
    }

    let current = new Map(); // verdict key -> hash in the theme on screen
    // The block a link points at (catalogue/button.html#variants,
    // catalogue/index.html#button--variants) stays on the page even when it
    // is judged, and is scrolled to: Claude links to blocks by anchor
    // (Kenny, 2026-09-14: "je kan toch altijd links geven … een anchorlink").
    // Until this page gives it a verdict: then it leaves like the rest (fix-29).
    const pinnedId = () => decodeURIComponent(location.hash.slice(1));
    let pinned = pinnedId();
    let last = null; // { key, theme, previous, title } for Undo

    function render() {
        const label = `${themeLabel(currentTheme())} · ${engineLabel(ENGINE)}`;
        const all = loadJudgements();
        let open = 0;
        for (const item of items) {
            const theme = blockTheme(item.entry.root);
            // What the prompt reads to tell a stale verdict (review-state.js).
            item.panel.dataset.catJudgedTheme = theme;
            const hash = current.get(item.entry.key);
            const state = stateOf(item.entry.key, theme, hash, ENGINE, all);
            const shown = hash ? STATES[state] : STATES.checking;
            item.badge.className = `kp-badge cat-judge__badge${shown.tone}`;
            item.glyph.textContent = shown.glyph;
            item.state.textContent = `${shown.words} · ${themeLabel(theme)} · ${engineLabel(ENGINE)}`;
            // Where the verdict comes from: kept in the repository, or only in this browser so far.
            const verdict = verdictOf(item.entry.key, theme, ENGINE, all);
            item.source.textContent = verdict ? (verdict.recorded ? 'In the register' : 'In this browser, not yet recorded') : '';
            item.panel.dataset.catSource = verdict?.source ?? '';
            item.approve.disabled = state === 'approved' || !hash;
            item.reject.disabled = state === 'rejected' || !hash;
            item.entry.root.dataset.catState = state;
            item.panel.dataset.catState = state;
            // A review note asks for a look whatever the hash says, until this
            // browser holds a verdict of its own not yet in the register: the
            // answer, waiting to be recorded (record then clears the note).
            const note = reviewNoteOf(item.entry.key, theme);
            const asking = Boolean(note) && verdict?.source !== 'browser';
            showReviewNote(item, note);
            item.entry.root.toggleAttribute('data-cat-review-note', asking);
            const judged = (state === 'approved' || state === 'rejected') && !asking;
            if (!judged) open += 1;
            // Judged blocks leave the page, so the reviewer stays at the top and
            // judges one block after another; a block that changed since comes back.
            if (toolbar) item.entry.root.hidden = judged && !showJudged.checked && item.entry.root.id !== pinned;
        }
        if (count) count.textContent = open ? `${open} of ${items.length} block(s) left to judge in ${label}.` : `Every block is judged in ${label}.`;
        onRender?.();
        document.dispatchEvent(new CustomEvent(JUDGEMENT_EVENT));
    }

    /** The callout of a block's review note in the theme on screen, or none. */
    function showReviewNote(item, note) {
        const box = item.reviewNote;
        box.hidden = !note;
        if (!note) return;
        box.querySelector('[data-cat-review-note-rejected]').textContent = note.rejected;
        box.querySelector('[data-cat-review-note-change]').textContent = note.change;
        box.querySelector('[data-cat-review-note-meta]').textContent = `(${[note.given, note.commit].filter(Boolean).join(' · ')})`;
    }

    /** Show or clear the refusal of a rejection without a note. */
    function showRefusal(item, on) {
        item.refused.hidden = !on;
        item.field.classList.toggle('kp-field--invalid', on);
        if (on) {
            item.area.setAttribute('aria-invalid', 'true');
            item.area.setAttribute('aria-describedby', item.refused.id);
        } else {
            item.area.removeAttribute('aria-invalid');
            item.area.removeAttribute('aria-describedby');
        }
    }

    function renderNotes() {
        for (const item of items) {
            const theme = blockTheme(item.entry.root);
            item.label.textContent = `Note for ${themeLabel(theme)}`;
            // The one being typed in keeps its text; another document's write
            // to the same note must not move the caret.
            if (document.activeElement !== item.area) item.area.value = noteFor(item.entry.notePage, item.entry.noteBlock, theme);
            // A note that arrived (another theme's, another document's) answers a refusal.
            if (item.area.value.trim()) showRefusal(item, false);
        }
    }

    // One reading at a time. Two overlapping readings (a theme switched while
    // the long review page was still being read) let the first one's release
    // restart the animations the second one had held still, and a glitch
    // caught mid-frame was stored as the block's look: measured 2026-09-13,
    // button variants in cyberpunk hashed differently on the review page only.
    let reading = null;
    let again = false;
    function measure() {
        if (reading) {
            again = true;
            return reading;
        }
        reading = (async () => {
            do {
                again = false;
                await readOnce();
            } while (again);
            reading = null;
        })();
        return reading;
    }

    async function readOnce() {
        const theme = currentTheme();
        // A hidden block reads display:none on its own root; all are shown while reading.
        // So is what the page hid around them: the review page hides a component
        // whose every block left the page, and a block read inside a hidden
        // component has no layout. Its dialog read `margin: auto` for 0px, its
        // animations did not exist (a spinner's `transform: none`), its
        // container queries answered for no container (a collapsed bar's
        // padding, a data table's low-priority column): measured 2026-09-13 in
        // nostromo, ten register blocks, eleven after a theme switch, came back
        // as "Changed since judged" on the review page only. onRender puts the
        // wrappers back in step with the blocks.
        if (toolbar) {
            for (const item of items) item.entry.root.hidden = false;
            onRender?.();
        }
        // Laid out, fonts in, animations held still: block-hash.js's readBlocks.
        const hashes = await readBlocks(items.map(({ entry }) => ({ root: entry.root, source: entry.source, elements: entry.elements })));
        const next = new Map(items.map(({ entry }, i) => [entry.key, hashes[i].hash]));
        if (theme !== currentTheme()) return; // the theme moved while reading; the next pass counts
        current = next;
        render();
    }

    for (const item of items) {
        item.area.addEventListener('input', () => {
            if (item.area.value.trim()) showRefusal(item, false);
            const ok = setNote(item.entry.notePage, item.entry.noteBlock, blockTheme(item.entry.root), item.area.value);
            item.saved.textContent = '';
            clearTimeout(item.timer);
            if (!ok) {
                item.saved.textContent = 'Not saved: this browser refuses storage';
                return;
            }
            // Stored on every keystroke; said once typing stops.
            item.timer = setTimeout(() => {
                item.saved.textContent = 'Saved';
                item.timer = setTimeout(() => (item.saved.textContent = ''), 2000);
            }, 700);
        });
        for (const button of [item.approve, item.reject]) {
            button.addEventListener('click', () => {
                const hash = current.get(item.entry.key);
                if (!hash) return;
                const theme = blockTheme(item.entry.root);
                const verdict = button.getAttribute('data-cat-verdict');
                // A rejection without a reason is refused (scope-89).
                if (verdict === 'rejected' && !item.area.value.trim()) {
                    showRefusal(item, true);
                    item.area.focus();
                    return;
                }
                showRefusal(item, false);
                const previous = storeVerdict(item.entry.key, theme, verdict, hash);
                // An approval answers the reviewer's note in this theme, so the
                // note goes with it and no prompt carries it on (fix-29, Kenny
                // 2026-09-15). A rejection keeps it: it says why. Undo puts it back.
                const { notePage, noteBlock } = item.entry;
                const note = verdict === 'approved' ? noteFor(notePage, noteBlock, theme) : '';
                if (note) {
                    setNote(notePage, noteBlock, theme, '');
                    item.area.value = '';
                    clearTimeout(item.timer);
                    item.saved.textContent = '';
                }
                // The block a link pinned leaves like any other once it has its
                // verdict, and the address stops pinning it, so a reload does not
                // bring it back either (fix-29: it stayed, "Approved", for as long
                // as the address named it).
                if (pinned && item.entry.root.id === pinned) {
                    pinned = '';
                    history.replaceState(history.state, '', `${location.pathname}${location.search}`);
                }
                last = { key: item.entry.key, theme, previous, item, note };
                if (undo) {
                    undo.hidden = false;
                    undo.textContent = `Undo: ${item.entry.title}`;
                }
                render();
            });
        }
    }

    undo?.addEventListener('click', () => {
        if (!last) return;
        restoreVerdict(last.key, last.theme, last.previous);
        const { root, notePage, noteBlock } = last.item.entry;
        // The note an approval removed comes back with the verdict it was removed for.
        if (last.note) setNote(notePage, noteBlock, last.theme, last.note);
        last = null;
        undo.hidden = true;
        render();
        root.scrollIntoView({ block: 'start' });
    });
    showJudged?.addEventListener('change', render);

    /** Bring the linked block into view, once it is laid out. */
    function goToPinned() {
        if (!pinned) return;
        const target = items.find((item) => item.entry.root.id === pinned)?.entry.root;
        target?.scrollIntoView({ block: 'start' });
    }
    window.addEventListener('hashchange', () => {
        pinned = pinnedId();
        render();
        goToPinned();
    });

    // A verdict or a note written in another document — another tab, a compare
    // column, the page around one — shows here without a reload.
    window.addEventListener('storage', (event) => {
        if (event.key === JUDGEMENTS_KEY && current.size) render();
        if (event.key === FEEDBACK_KEY) renderNotes();
    });
    document.addEventListener(NOTES_EVENT, renderNotes);
    document.documentElement.addEventListener(THEME_EVENT, () => {
        current = new Map();
        render();
        renderNotes();
        // Give the register a moment to paint before reading it. A timer, not
        // requestAnimationFrame: a tab in the background never runs a frame.
        setTimeout(measure, 150);
    });

    render();
    renderNotes();
    // The register arrives after the first paint; a block judged in it is
    // judged in every browser of its engine.
    registerReady.then(render);
    notesReady.then(render);
    return {
        /** Measure every block in the theme on screen, once fonts are in. */
        async start() {
            await registerReady;
            await notesReady;
            await document.fonts?.ready;
            await new Promise((resolve) => setTimeout(resolve, 150));
            await measure();
            // The review page is composed after the browser tried the anchor;
            // measuring and hiding moved everything since. Go there now.
            goToPinned();
        },
    };
}
