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

const STATES = {
    new: { glyph: '○', words: 'Not yet judged', tone: '' },
    approved: { glyph: '✓', words: 'Approved', tone: ' kp-badge--success' },
    rejected: { glyph: '✕', words: 'Not approved', tone: ' kp-badge--destructive' },
    changed: { glyph: '↻', words: 'Changed since judged', tone: ' kp-badge--warning' },
    checking: { glyph: '…', words: 'Checking', tone: '' },
};

function panelFor(entry) {
    const panel = document.createElement('div');
    panel.className = 'cat-judge';
    panel.setAttribute('data-cat-block', entry.key);
    panel.innerHTML = `
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
        </div>`;
    const area = panel.querySelector('textarea');
    area.id = entry.fieldId;
    panel.querySelector('label').htmlFor = entry.fieldId;
    return panel;
}

/**
 * Mount a panel for every entry and keep them true to storage and theme.
 * @param {{ entries: Entry[], toolbar?: HTMLElement | null, onRender?: () => void }} options
 *   toolbar: a `.cat-review-bar` to fill with the count, Undo and "Show blocks already judged";
 *   given one, a judged block leaves the page until the toggle brings it back.
 */
export function mountJudging({ entries, toolbar = null, onRender }) {
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
    let last = null; // { key, theme, previous, title } for Undo

    function render() {
        const theme = currentTheme();
        const label = `${themeLabel(theme)} · ${engineLabel(ENGINE)}`;
        const all = loadJudgements();
        let open = 0;
        for (const item of items) {
            const hash = current.get(item.entry.key);
            const state = stateOf(item.entry.key, theme, hash, ENGINE, all);
            const shown = hash ? STATES[state] : STATES.checking;
            item.badge.className = `kp-badge cat-judge__badge${shown.tone}`;
            item.glyph.textContent = shown.glyph;
            item.state.textContent = `${shown.words} · ${label}`;
            // Where the verdict comes from: kept in the repository, or only in this browser so far.
            const verdict = verdictOf(item.entry.key, theme, ENGINE, all);
            item.source.textContent = verdict ? (verdict.recorded ? 'In the register' : 'In this browser, not yet recorded') : '';
            item.panel.dataset.catSource = verdict?.source ?? '';
            item.approve.disabled = state === 'approved' || !hash;
            item.reject.disabled = state === 'rejected' || !hash;
            item.entry.root.dataset.catState = state;
            item.panel.dataset.catState = state;
            const judged = state === 'approved' || state === 'rejected';
            if (!judged) open += 1;
            // Judged blocks leave the page, so the reviewer stays at the top and
            // judges one block after another; a block that changed since comes back.
            if (toolbar) item.entry.root.hidden = judged && !showJudged.checked;
        }
        if (count) count.textContent = open ? `${open} of ${items.length} block(s) left to judge in ${label}.` : `Every block is judged in ${label}.`;
        onRender?.();
        document.dispatchEvent(new CustomEvent(JUDGEMENT_EVENT));
    }

    function renderNotes() {
        const theme = currentTheme();
        for (const item of items) {
            item.label.textContent = `Note for ${themeLabel(theme)}`;
            // The one being typed in keeps its text; another document's write
            // to the same note must not move the caret.
            if (document.activeElement !== item.area) item.area.value = noteFor(item.entry.notePage, item.entry.noteBlock, theme);
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
            const ok = setNote(item.entry.notePage, item.entry.noteBlock, currentTheme(), item.area.value);
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
                const theme = currentTheme();
                const previous = storeVerdict(item.entry.key, theme, button.getAttribute('data-cat-verdict'), hash);
                last = { key: item.entry.key, theme, previous, item };
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
        const { root } = last.item.entry;
        last = null;
        undo.hidden = true;
        render();
        root.scrollIntoView({ block: 'start' });
    });
    showJudged?.addEventListener('change', render);

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
    return {
        /** Measure every block in the theme on screen, once fonts are in. */
        async start() {
            await registerReady;
            await document.fonts?.ready;
            await new Promise((resolve) => setTimeout(resolve, 150));
            await measure();
        },
    };
}
