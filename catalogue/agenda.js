// catalogue/agenda.html, the Agenda: the ONE page Kenny starts from when something waits for his verdict (Kenny,
// 2026-10-13: "één pagina waar ik start, waar duidelijk getoond wordt wat ik nog moet beoordelen … en waar alles in
// volgorde staat"). It merges "To judge" (changed.html) and "Every component, one page" (index.html) as the way in;
// both stay reachable from its head.
//
// Every row is one item: a research demo under "Research to look at" (pages.js), or the catalogue blocks open in any
// theme. A row says what the item is, how many element-and-theme pairs are open and in how many themes, what to judge
// first (`after` in pages.js) and what a rejection here changes (`affects`), and its one button opens the review
// dialog over only what is open: a demo's own dialog (its page with `?review=open`, which walks only open pairs), or
// the catalogue's block dialog over the open blocks laid out below. Finished items fold away under Done.
//
// Nothing opens by itself (Kenny, 2026-10-14, replacing the auto-next of 2026-10-13: a demo finished with two notes
// came back here, was opened again at once, and its answer lost the notes). A demo ends on its own answer; one button
// there copies it and comes back. An answer left without copying waits in the band at the top (progress.js keepAnswer).
//
// The data and the logic are the shared ones (waiting.js, progress.js, open-pairs.js, judging.js); this module only
// draws them.
import { THEMES } from '../js/theme-registry.js';
import { JUDGEMENT_EVENT, loadJudgements } from './judgements.js';
import { openBusyCard } from '../js/busy-card.js';
import { gatherBlocks, isOpen } from './open-pairs.js';
import {
    ANSWER_EVENT,
    ANSWER_PAIR,
    answerWaiting,
    dropReceivedAnswer,
    journalDemos,
    journalOf,
    progressOf,
    rebuildAnswer,
    storedFor,
} from '../research/_review/progress.js';
import { paintAgenda } from '../research/_review/rv-progress.js'; // [kit-strip-1018]
import { updateFlow } from './flow-agenda.js'; // kit-flow hook
import { composeBlocks, counted, demoStatus, dependentsOf, inOrder, labelOf, readDecided, readDemo, researchPages, reviewUrl } from './waiting.js';

const ROOT = new URL('../', import.meta.url);
const SELF = new URL('agenda.html', import.meta.url).href;
const BLOCKS_ID = 'catalogue-blocks';

const $ = (/** @type {string} */ selector) => /** @type {HTMLElement} */ (document.querySelector(selector));
const ui = {
    start: /** @type {HTMLButtonElement} */ ($('[data-agenda-start]')),
    next: $('[data-agenda-next]'),
    status: $('[data-agenda-status]'),
    answers: $('[data-agenda-answers]'),
    answersText: $('[data-agenda-answers-text]'),
    answersCopy: /** @type {HTMLButtonElement} */ ($('[data-agenda-answers-copy]')),
    waiting: $('[data-agenda-waiting]'),
    done: /** @type {HTMLDetailsElement} */ ($('[data-agenda-done]')),
    doneCount: $('[data-agenda-done-count]'),
    doneList: $('[data-agenda-done-list]'),
    blocksPart: $('[data-agenda-blocks-part]'),
    blocksCount: $('[data-agenda-blocks-count]'),
    blocksHost: $('[data-cat-compose="agenda"]'),
    saved: /** @type {HTMLDetailsElement} */ ($('[data-agenda-saved]')),
    savedCount: $('[data-agenda-saved-count]'),
    savedEmpty: $('[data-agenda-saved-empty]'),
    savedList: $('[data-agenda-saved-list]'),
};

/* ------------------------------------------------------------------ model */

// The retired auto-next's `?auto=next` (an old link, a demo page still open from before): read as the plain Agenda.
if (new URLSearchParams(location.search).has('auto')) {
    const clean = new URL(location.href);
    clean.searchParams.delete('auto');
    history.replaceState(history.state, '', clean.href);
}

const { waiting: listed, inRework, archived } = researchPages();
const ordered = inOrder(listed);

/**
 * @typedef {object} Demo
 * @property {import('./pages.js').Page} page
 * @property {Awaited<ReturnType<typeof readDemo>> | undefined} shape  undefined while read, null without the kit
 * @property {boolean} failed
 */
/** @type {Demo[]} */
const demos = ordered.map((page) => ({ page, shape: undefined, failed: false }));

/** @type {{ page: import('./pages.js').Page, decided: string | undefined }[]} */
const archive = archived.map((page) => ({ page, decided: undefined }));

/**
 * The catalogue blocks: gathering until read, then the open pairs over every theme.
 * @type {{ gathered: Awaited<ReturnType<typeof gatherBlocks>> | null, composed: boolean, failed: boolean }}
 */
const blocks = { gathered: null, composed: false, failed: false };

/** The open block-and-theme pairs now, read from the verdicts as they stand. */
function blockPairs() {
    if (!blocks.gathered) return null;
    const stored = loadJudgements();
    const themes = new Set();
    let pairs = 0;
    /** @type {Set<string>} */
    const open = new Set();
    for (const block of blocks.gathered.blocks) {
        for (const { name } of THEMES) {
            if (!isOpen(block, name, stored)) continue;
            pairs += 1;
            themes.add(name);
            open.add(block.id);
        }
    }
    return { pairs, themes: themes.size, open };
}

/* ------------------------------------------------------------------ views */

/**
 * What one row shows. Every row has the same parts in the same places, whatever its kind or state.
 * @typedef {object} View
 * @property {string} id
 * @property {string} kind        the eyebrow: what sort of item, and its state
 * @property {string} title
 * @property {string} about       one sentence: what it asks
 * @property {string[]} after     hrefs to judge first
 * @property {string[]} before    hrefs that wait on this one (shown where `affects` says nothing)
 * @property {string} affects
 * @property {string} count       the open pairs, or the state in a word
 * @property {string} spread      in how many themes
 * @property {string} tone        the badge's tone class
 * @property {'reading' | 'waiting' | 'done'} state
 * @property {string} action
 * @property {string} [href]      a link, or else
 * @property {(() => void) | null} [press]  a button
 * @property {string} [reason]    why the button is disabled
 */

/** @param {Demo} demo @returns {View} */
function demoView({ page, shape, failed }) {
    const base = {
        id: page.href,
        title: page.label,
        about: page.about ?? '',
        after: page.after ?? [],
        before: dependentsOf(page.href, listed).map((p) => p.href),
        affects: page.affects ?? '',
    };
    if (shape === undefined && !failed) {
        return {
            ...base,
            kind: 'Research demo',
            count: 'Reading…',
            spread: '',
            tone: '',
            state: 'reading',
            action: 'Start',
            reason: 'Reading the demo',
        };
    }
    const url = new URL(page.href, ROOT).href;
    if (failed || !shape) {
        return {
            ...base,
            about: base.about || (failed ? 'This demo could not be read; open it to judge it on its own page.' : 'This demo has no review dialog.'),
            kind: 'Research demo',
            count: 'State unknown',
            spread: '',
            tone: '',
            state: 'waiting',
            action: 'Open',
            href: url,
        };
    }
    const { progress, stateWord, action } = demoStatus(shape);
    const done = progress.state === 'decided';
    const extras = progress.extrasLeft ? ' and its catalogue blocks' : '';
    return {
        ...base,
        about: base.about || shape.ask,
        kind: `Research demo · ${stateWord}`,
        count: done ? 'Judged' : `${progress.pairsLeft} to judge`,
        spread: done ? `in all ${counted(progress.themes, 'theme')}` : `in ${counted(progress.themesLeft, 'theme')}${extras}`,
        tone: done ? ' kp-badge--success' : progress.state === 'updated' ? ' kp-badge--info' : progress.state === 'new' ? '' : ' kp-badge--warning',
        state: done ? 'done' : 'waiting',
        action,
        href: reviewUrl(page.href, SELF),
    };
}

/** @returns {View} */
function blocksView() {
    const base = {
        id: BLOCKS_ID,
        title: 'Catalogue blocks',
        about: 'Blocks on the component pages that were never judged in a theme, changed since, or carry a note that asks again. They come after the demos, because a demo can still change how a component looks.',
        after: [],
        before: [],
        affects: '',
        kind: 'Catalogue',
    };
    if (blocks.failed) {
        return {
            ...base,
            count: 'State unknown',
            spread: '',
            tone: '',
            state: 'waiting',
            action: 'Open',
            href: new URL('catalogue/changed.html', ROOT).href,
        };
    }
    const now = blockPairs();
    if (!now) return { ...base, count: 'Gathering…', spread: '', tone: '', state: 'reading', action: 'Judge', reason: 'Gathering the blocks' };
    if (!now.pairs)
        return {
            ...base,
            count: 'Judged',
            spread: 'in every theme',
            tone: ' kp-badge--success',
            state: 'done',
            action: 'Look again',
            href: new URL('catalogue/index.html', ROOT).href,
        };
    return {
        ...base,
        count: `${now.pairs} to judge`,
        spread: `${counted(now.open.size, 'block')} in ${counted(now.themes, 'theme')}${blocks.composed ? '' : ' · laying them out…'}`,
        tone: ' kp-badge--warning',
        state: 'waiting',
        action: 'Judge',
        press: blocks.composed ? openBlockDialog : null,
        reason: blocks.composed ? '' : 'Laying out the blocks',
    };
}

/** The block dialog over the open blocks laid out below; it walks theme by theme by itself (judging.js). */
function openBlockDialog() {
    /** @type {HTMLButtonElement | null} */ (document.querySelector('[data-cat-dialog-open]'))?.click();
}

/* ------------------------------------------------------------------- rows */

/** @type {Map<string, HTMLLIElement>} */
const rows = new Map();

/** The items still being read: they have no row and no number yet; the busy card covers their place. */
const readingIds = new Set();

/**
 * The busy card over the list while it is read (DEMO_RULES "Motion and loading": a data list shows the theme's busy
 * card, never irregular skeletons). The area keeps a minimum height (agenda.css), the rows already known show as
 * they arrive and the card stays centred over the part still to come, until reading ends.
 * @type {import('../js/busy-card.js').BusyCard | null}
 */
let busy = null;

/** Lay, move or lift the card for the list's current reading state. */
function syncBusyCard(/** @type {boolean} */ reading) {
    const host = /** @type {HTMLElement} */ (ui.waiting.parentElement);
    if (!reading) {
        void busy?.close();
        busy = null;
        return;
    }
    if (!busy) {
        busy = openBusyCard(host, {
            words: 'Reading the research demos…',
            className: 'agenda__busy',
            arrive: !firstRender,
            area: () => {
                const box = host.getBoundingClientRect();
                const last = ui.waiting.lastElementChild;
                const top = last ? last.getBoundingClientRect().bottom : box.top;
                return [{ top: Math.min(top, box.bottom), left: box.left, right: box.right, bottom: box.bottom }];
            },
        });
    } else busy.place();
}

let firstRender = true;

/** One row's element, made once and repainted in place, so focus and scroll survive a refresh. */
function rowFor(/** @type {string} */ id) {
    let row = rows.get(id);
    if (row) return row;
    row = document.createElement('li');
    row.className = 'agenda-row';
    row.id = `agenda-${id.replace(/[^a-z0-9-]+/gi, '-')}`;
    row.innerHTML = `
        <span class="agenda-row__number" data-agenda-number aria-hidden="true"></span>
        <div class="agenda-row__what">
            <p class="agenda-row__kind" data-agenda-kind></p>
            <h3 class="agenda-row__title" data-agenda-title></h3>
            <p class="agenda-row__about" data-agenda-about></p>
            <ul class="agenda-row__links" data-agenda-links></ul>
        </div>
        <p class="agenda-row__count">
            <span class="kp-badge agenda-row__badge" data-agenda-count></span>
            <span class="agenda-row__spread" data-agenda-spread></span>
        </p>
        <div class="agenda-row__go" data-agenda-go></div>`;
    rows.set(id, row);
    return row;
}

/** The label of another item with its place in the list now. */
function placeOf(/** @type {string} */ href, /** @type {Map<string, number>} */ numbers) {
    const number = numbers.get(href);
    if (number) return `${number} · ${labelOf(href)}`;
    return readingIds.has(href) ? `${labelOf(href)} (still being read)` : `${labelOf(href)} (judged)`;
}

/**
 * @param {View} view @param {number | null} number its place among the waiting, or null under Done
 * @param {Map<string, number>} numbers
 */
function paintRow(view, number, numbers) {
    const row = rowFor(view.id);
    const set = (/** @type {string} */ selector, /** @type {string} */ text) => {
        const el = /** @type {HTMLElement} */ (row.querySelector(selector));
        el.textContent = text;
        el.hidden = !text;
    };
    row.dataset.agendaState = view.state;
    set('[data-agenda-number]', number ? String(number) : '✓');
    set('[data-agenda-kind]', view.kind);
    set('[data-agenda-title]', view.title);
    set('[data-agenda-about]', view.about);
    const badge = /** @type {HTMLElement} */ (row.querySelector('[data-agenda-count]'));
    badge.textContent = view.count;
    badge.className = `kp-badge agenda-row__badge${view.tone}`;
    set('[data-agenda-spread]', view.spread);

    // The order, said in words: what to judge first, and what a rejection here reaches.
    const links = /** @type {HTMLElement} */ (row.querySelector('[data-agenda-links]'));
    links.replaceChildren();
    const line = (/** @type {string} */ modifier, /** @type {string} */ label, /** @type {(Node | string)[]} */ parts) => {
        const li = document.createElement('li');
        li.className = `agenda-dep agenda-dep--${modifier}`;
        const b = document.createElement('span');
        b.className = 'agenda-dep__label';
        b.textContent = `${label}: `;
        li.append(b, ...parts);
        links.append(li);
    };
    const linkTo = (/** @type {string} */ href) => {
        const a = document.createElement('a');
        a.href = `#${rowFor(href).id}`;
        a.textContent = placeOf(href, numbers);
        return a;
    };
    if (view.state !== 'done') {
        for (const href of view.after) line('after', 'Judge after', [linkTo(href)]);
        if (view.affects) line('affects', 'A rejection here changes', [view.affects]);
        else for (const href of view.before) line('before', 'Judge before', [linkTo(href)]);
    }
    links.hidden = !links.childElementCount;

    // One action, in the same column on every row.
    const go = /** @type {HTMLElement} */ (row.querySelector('[data-agenda-go]'));
    const kind = view.href ? 'A' : 'BUTTON';
    let control = /** @type {HTMLAnchorElement | HTMLButtonElement | null} */ (go.firstElementChild);
    if (!control || control.tagName !== kind) {
        control = document.createElement(kind === 'A' ? 'a' : 'button');
        if (control instanceof HTMLButtonElement) control.type = 'button';
        go.replaceChildren(control);
    }
    control.className = 'kp-button agenda-row__button';
    control.textContent = view.action;
    control.setAttribute('aria-label', `${view.action}: ${view.title}`);
    if (control instanceof HTMLAnchorElement) control.href = /** @type {string} */ (view.href);
    else {
        control.disabled = !view.press;
        control.onclick = view.press ?? null;
        control.title = view.reason ?? '';
    }
    return row;
}

/** An archived demo's row under Done. */
function archivedView(/** @type {{ page: import('./pages.js').Page, decided: string | undefined }} */ { page, decided }) {
    return /** @type {View} */ ({
        id: page.href,
        kind: decided ? 'Research demo · Decided' : 'Research demo · Archived',
        title: page.label,
        about:
            decided === undefined
                ? 'Reading its decision…'
                : decided || 'Archived without a decision file: set aside, or decided before decided.json existed.',
        after: [],
        before: [],
        affects: '',
        count: decided ? 'Decided' : 'Archived',
        spread: '',
        tone: decided ? ' kp-badge--success' : '',
        state: 'done',
        action: 'Open',
        href: new URL(page.href, ROOT).href,
    });
}

/* ----------------------------------------------------------------- render */

function render() {
    const views = [...demos.map(demoView), blocksView()];
    const open = views.filter((view) => view.state !== 'done');
    const finished = views.filter((view) => view.state === 'done');
    // Only what is known to wait gets a row and a number; what is still being read is covered by the busy card.
    const known = open.filter((view) => view.state === 'waiting');
    readingIds.clear();
    for (const view of open) if (view.state === 'reading') readingIds.add(view.id);
    /** @type {Map<string, number>} */
    const numbers = new Map(known.map((view, i) => [view.id, i + 1]));

    ui.waiting.replaceChildren(...known.map((view, i) => paintRow(view, i + 1, numbers)));
    const reading = views.some((view) => view.state === 'reading');
    if (!open.length && !reading) {
        const none = document.createElement('li');
        none.className = 'cat-changed-done agenda__none';
        none.textContent = 'Nothing waits for your verdict: every demo and every catalogue block is judged in every theme.';
        ui.waiting.append(none);
    }
    ui.waiting.setAttribute('aria-busy', String(reading));
    syncBusyCard(reading);
    firstRender = false;

    const doneRows = [
        ...finished.map((view) => paintRow(view, null, numbers)),
        ...archive.map((entry) => paintRow(archivedView(entry), null, numbers)),
    ];
    ui.doneList.replaceChildren(...doneRows);
    ui.doneCount.textContent = `(${doneRows.length})`;

    const pairs = blockPairs();
    ui.blocksCount.textContent = pairs ? `(${counted(pairs.open.size, 'block')})` : '';
    renderStatus({ open, reading });
    renderStart(open, reading);
    renderAnswers();
    renderSaved();
    // [kit-strip-1018] rv-progress.js: remaining line on each row, Continue, Review options.
    paintAgenda(demos.map((demo) => ({ href: demo.page.href, label: demo.page.label, shape: demo.shape })));
    publishFlow(reading); // kit-flow hook
    document.title = `${reading ? '…' : open.length} waiting · Agenda · kp-themes catalogue`;
}

/**
 * The status line at the top. One sentence today; the slot (`data-agenda-status-slot`) takes further lines.
 * @param {{ open: View[], reading: boolean }} state
 */
function renderStatus({ open, reading }) {
    if (reading && !open.some((view) => view.state === 'waiting')) {
        ui.status.textContent = 'Reading the research demos and gathering the catalogue blocks…';
        return;
    }
    const demosOpen = open.filter((view) => view.id !== BLOCKS_ID && view.state === 'waiting');
    const blockView = open.find((view) => view.id === BLOCKS_ID);
    const parts = [];
    parts.push(demosOpen.length ? `${counted(demosOpen.length, 'research demo')}` : 'no research demo');
    if (blockView?.state === 'waiting') parts.push(`catalogue blocks (${blockView.count}, ${blockView.spread})`);
    else if (blockView?.state === 'reading') parts.push('the catalogue blocks still being gathered');
    else parts.push('no catalogue block');
    const rework = inRework
        ? ` ${counted(inRework, 'demo')} more ${inRework === 1 ? 'is' : 'are'} in rework and come${inRework === 1 ? 's' : ''} back with a new round.`
        : '';
    ui.status.textContent = open.length
        ? `${counted(open.length, 'item')} ${open.length === 1 ? 'waits' : 'wait'}: ${parts.join(' and ')}.${rework}`
        : `Nothing waits: every demo and every catalogue block is judged in every theme.${rework}`;
}

/** The head's primary button: the first item that waits. */
function renderStart(/** @type {View[]} */ open, /** @type {boolean} */ reading) {
    const first = open.find((view) => view.state === 'waiting');
    if (!first && reading) {
        ui.start.disabled = true;
        ui.start.textContent = 'Reading…';
        ui.next.textContent = 'Waiting for the first item to be read.';
        ui.start.onclick = null;
        return;
    }
    if (!first) {
        ui.start.disabled = true;
        ui.start.textContent = 'Nothing waits';
        ui.next.textContent = reading ? 'Still reading what waits.' : 'Everything is judged.';
        ui.start.onclick = null;
        return;
    }
    const ready = first.state === 'waiting' && (first.href || first.press);
    ui.start.disabled = !ready;
    ui.start.textContent = ready ? (first.action === 'Start' ? 'Start with item 1' : 'Continue with item 1') : 'Reading…';
    ui.next.textContent = ready
        ? `Opens “${first.title}”. After its last verdict the dialog stops on its answer, to copy and come back here.`
        : 'Waiting for the first item to be read.';
    ui.start.onclick = () => openItem(first);
}

function openItem(/** @type {View} */ view) {
    if (view.href) location.assign(view.href);
    else view.press?.();
}

/** kit-flow hook: the open demos in Agenda order, with the themes that still have a pair open, for flow-agenda.js. */
function publishFlow(/** @type {boolean} */ reading) {
    const entries = demos
        .filter((demo) => demo.shape && demoStatus(demo.shape).progress.pairsLeft > 0)
        .map((demo) => {
            const shape = /** @type {NonNullable<typeof demo.shape>} */ (demo.shape);
            const stored = storedFor(shape.id);
            return {
                id: shape.id,
                label: demo.page.label,
                href: reviewUrl(demo.page.href, SELF),
                themes: shape.themes.filter((theme) => progressOf({ ...shape, themes: [theme], extras: [] }, stored).pairsLeft > 0),
            };
        });
    updateFlow(entries, reading);
}

/* ---------------------------------------------------------------- answers */

/** The demos whose answer changed since it was last copied. */
const answersWaiting = () => demos.filter((demo) => demo.shape && answerWaiting(demo.shape.id));

function renderAnswers() {
    const list = answersWaiting();
    ui.answers.hidden = !list.length;
    if (!list.length) return;
    ui.answersText.textContent = `${counted(list.length, 'demo')} (${list.map((demo) => demo.page.label).join('; ')}) ${
        list.length === 1 ? 'has an answer' : 'have answers'
    } you have not copied yet. "Copy the answers" is the bar's Copy prompt: one press copies every answer and verdict together.`;
}

/*
 * Saved verdicts: the journal of every demo (progress.js, journal), newest first, and per demo one button that copies
 * the answer rebuilt from it for the round picked (Kenny, 2026-10-17: "ik moet altijd honderd procent absoluut zeker zijn
 * dat mijn beoordelingen vastgelegd worden").
 */
/** The journal as drawn last, so a refresh that changes nothing keeps the folds, the picks and the focus. */
let savedDrawn = '';
const when = (/** @type {string} */ at) => {
    const d = new Date(at);
    return Number.isNaN(d.getTime())
        ? at
        : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};
/** One journal entry in words. @param {import('../research/_review/progress.js').JournalEntry} e */
const entryWords = (e) => {
    if (e.pair === ANSWER_PAIR) return `the whole answer, kept when it was set aside as received:\n${e.note}`;
    const label = e.label || e.pair;
    const parts = [label];
    // [kit-keys] Undo (U) and bulk approval (G) entries say what they are.
    if (e.kind === 'undo') parts.push(e.verdict ? `Undone, back to ${e.verdict === 'rejected' ? 'not approved' : 'approved'}` : 'Undone, open again');
    else if (e.kind === 'bulk') parts.push(`Approved unseen (bulk, ${e.unseen || 1} pairs)`);
    else if (e.verdict) parts.push(e.verdict === 'rejected' ? 'Not approved' : 'Approved');
    if (e.choice) parts.push(`ticked ${e.choice.id} = ${e.choice.label || e.choice.value}`);
    const head = parts.join(' · ');
    return e.note ? `${head}: ${e.note}` : head;
};

function renderSaved() {
    const demosWith = journalDemos();
    const journals = demosWith.map((id) => ({ id, entries: journalOf(id) })).filter((j) => j.entries.length);
    const drawn = JSON.stringify(journals.map((j) => [j.id, j.entries.length, j.entries.at(-1)?.at]));
    if (drawn === savedDrawn) return;
    savedDrawn = drawn;
    const total = journals.reduce((sum, j) => sum + j.entries.length, 0);
    ui.savedCount.textContent = journals.length ? `(${counted(total, 'entry', 'entries')} in ${counted(journals.length, 'demo')})` : '';
    ui.savedEmpty.hidden = journals.length > 0;
    /** @type {Set<string>} */
    const open = new Set([...ui.savedList.querySelectorAll('details[open]')].map((d) => /** @type {HTMLElement} */ (d).dataset.demo || ''));
    ui.savedList.replaceChildren(
        ...journals.map(({ id, entries }) => {
            const box = document.createElement('details');
            box.className = 'agenda-saved';
            box.dataset.demo = id;
            box.open = open.has(id);
            const rounds = [...new Set([...entries].reverse().map((e) => e.round || ''))];
            const newest = entries.at(-1);
            box.innerHTML = `
                <summary class="agenda-saved__summary"></summary>
                <div class="agenda-saved__copy">
                    <span class="kp-field">
                        <label class="kp-field__label"></label>
                        <select class="kp-field__input agenda-saved__round"></select>
                    </span>
                    <button type="button" class="kp-button kp-button--primary agenda-saved__button">Copy this answer</button>
                </div>
                <p class="agenda-saved__said" role="status" aria-live="polite"></p>
                <pre class="agenda-saved__text" hidden></pre>
                <ol class="agenda-saved__entries"></ol>`;
            /** @type {HTMLElement} */ (box.querySelector('summary')).textContent =
                `${id} · ${counted(entries.length, 'entry', 'entries')} · last ${when(newest?.at || '')}`;
            const select = /** @type {HTMLSelectElement} */ (box.querySelector('select'));
            select.id = `agenda-saved-${id.replace(/[^a-z0-9-]+/gi, '-')}`;
            const label = /** @type {HTMLLabelElement} */ (box.querySelector('label'));
            label.htmlFor = select.id;
            label.textContent = 'Round';
            for (const r of rounds) {
                const option = document.createElement('option');
                option.value = r;
                option.textContent = r || '(no round id)';
                select.append(option);
            }
            const said = /** @type {HTMLElement} */ (box.querySelector('.agenda-saved__said'));
            const pre = /** @type {HTMLElement} */ (box.querySelector('pre'));
            box.querySelector('button')?.addEventListener('click', async () => {
                const text = rebuildAnswer(id, select.value);
                pre.textContent = text;
                pre.hidden = false;
                try {
                    await navigator.clipboard.writeText(text);
                    said.textContent = `Copied the answer of ${id}, round ${select.value || '(no round id)'}. Paste it into the conversation.`;
                } catch {
                    const range = document.createRange();
                    range.selectNodeContents(pre);
                    getSelection()?.removeAllRanges();
                    getSelection()?.addRange(range);
                    said.textContent = 'Selected below. Press Ctrl+C to copy.';
                }
            });
            const list = /** @type {HTMLElement} */ (box.querySelector('ol'));
            for (const e of [...entries].reverse()) {
                const li = document.createElement('li');
                li.className = 'agenda-saved__entry';
                const at = document.createElement('span');
                at.className = 'agenda-saved__when';
                at.textContent = when(e.at);
                const what = document.createElement('span');
                what.className = 'agenda-saved__what';
                what.textContent = `${e.round || '(no round id)'} · ${entryWords(e)}`;
                li.append(at, what);
                list.append(li);
            }
            return box;
        }),
    );
}

// One copy for everything (Kenny, 2026-10-13: "Dat moet gelijk getrokken worden"): this button presses the bar's
// "Copy prompt", which carries the demo answers waiting here and the catalogue's verdicts alike.
ui.answersCopy.addEventListener('click', () => {
    /** @type {HTMLButtonElement | null} */ (document.querySelector('[data-cat-prompt-bar] [data-cat-prompt-copy]'))?.click();
});
// The answers are passed on only once the prompt really left (prompt.js): the band follows that moment, whichever
// copy button did it.
document.addEventListener(ANSWER_EVENT, render);

/* ------------------------------------------------------------------ start */

/** Many reads land at once while the page loads: one render per frame, never one per read. */
let renderQueued = false;
function renderSoon() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
        renderQueued = false;
        render();
    });
}

render();

for (const demo of demos) {
    readDemo(demo.page.href)
        .then((shape) => {
            demo.shape = shape;
            // An answer of a round Claude already received is not waiting to be copied (progress.js, dropReceivedAnswer).
            if (shape) dropReceivedAnswer(shape.id, shape.round);
        })
        .catch(() => {
            demo.failed = true;
        })
        .finally(renderSoon);
}
// The archive's decision files are read only once Done is opened: 126 of them on every load, each followed by a
// whole render, made the Agenda slow (Kenny, 2026-10-19 05:11: "De agenda pagina begint traag te worden").
let archiveRead = false;
const readArchive = () => {
    if (archiveRead || !ui.done.open) return;
    archiveRead = true;
    for (const entry of archive)
        readDecided(entry.page.href).then((decided) => {
            entry.decided = decided;
            renderSoon();
        });
};
ui.done.addEventListener('toggle', readArchive);
readArchive();
gatherBlocks()
    .then(async (gathered) => {
        blocks.gathered = gathered;
        render();
        const now = blockPairs();
        if (!now?.pairs) {
            document.dispatchEvent(new CustomEvent('cat-composed'));
            return;
        }
        ui.blocksPart.hidden = false;
        await composeBlocks(ui.blocksHost, { pages: gathered.pages, chosen: now.open });
        blocks.composed = true;
        render();
    })
    .catch(() => {
        blocks.failed = true;
        render();
    });

// A verdict given here (the block dialog) or in a demo in another tab, or the way back through the history: read again.
document.addEventListener(JUDGEMENT_EVENT, render);
window.addEventListener('storage', (event) => {
    if (event.key === null || event.key.startsWith('kp-demo-review:') || event.key.startsWith('kp-catalogue')) render();
});
window.addEventListener('pageshow', (event) => {
    if (event.persisted) render();
});
