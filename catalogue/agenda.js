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
import { gatherBlocks, isOpen } from './open-pairs.js';
import { ANSWER_EVENT, answerWaiting } from '../research/_review/progress.js';
import {
    composeBlocks,
    counted,
    demoStatus,
    dependentsOf,
    inOrder,
    labelOf,
    readDecided,
    readDemo,
    researchPages,
    reviewUrl,
} from './waiting.js';

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
        return { ...base, kind: 'Research demo', count: 'Reading…', spread: '', tone: '', state: 'reading', action: 'Start', reason: 'Reading the demo' };
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
        return { ...base, count: 'State unknown', spread: '', tone: '', state: 'waiting', action: 'Open', href: new URL('catalogue/changed.html', ROOT).href };
    }
    const now = blockPairs();
    if (!now) return { ...base, count: 'Gathering…', spread: '', tone: '', state: 'reading', action: 'Judge', reason: 'Gathering the blocks' };
    if (!now.pairs) return { ...base, count: 'Judged', spread: 'in every theme', tone: ' kp-badge--success', state: 'done', action: 'Look again', href: new URL('catalogue/index.html', ROOT).href };
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
    return number ? `${number} · ${labelOf(href)}` : `${labelOf(href)} (judged)`;
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
    /** @type {Map<string, number>} */
    const numbers = new Map(open.map((view, i) => [view.id, i + 1]));

    ui.waiting.replaceChildren(...open.map((view, i) => paintRow(view, i + 1, numbers)));
    if (!open.length) {
        const none = document.createElement('li');
        none.className = 'cat-changed-done agenda__none';
        none.textContent = 'Nothing waits for your verdict: every demo and every catalogue block is judged in every theme.';
        ui.waiting.append(none);
    }
    const reading = views.some((view) => view.state === 'reading');
    ui.waiting.setAttribute('aria-busy', String(reading));

    const doneRows = [...finished.map((view) => paintRow(view, null, numbers)), ...archive.map((entry) => paintRow(archivedView(entry), null, numbers))];
    ui.doneList.replaceChildren(...doneRows);
    ui.doneCount.textContent = `(${doneRows.length})`;

    const pairs = blockPairs();
    ui.blocksCount.textContent = pairs ? `(${counted(pairs.open.size, 'block')})` : '';
    renderStatus({ open, reading });
    renderStart(open, reading);
    renderAnswers();
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
    const rework = inRework ? ` ${counted(inRework, 'demo')} more ${inRework === 1 ? 'is' : 'are'} in rework and come${inRework === 1 ? 's' : ''} back with a new round.` : '';
    ui.status.textContent = open.length
        ? `${counted(open.length, 'item')} ${open.length === 1 ? 'waits' : 'wait'}: ${parts.join(' and ')}.${rework}`
        : `Nothing waits: every demo and every catalogue block is judged in every theme.${rework}`;
}

/** The head's primary button: the first item that waits. */
function renderStart(/** @type {View[]} */ open, /** @type {boolean} */ reading) {
    const first = open[0];
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

// One copy for everything (Kenny, 2026-10-13: "Dat moet gelijk getrokken worden"): this button presses the bar's
// "Copy prompt", which carries the demo answers waiting here and the catalogue's verdicts alike.
ui.answersCopy.addEventListener('click', () => {
    /** @type {HTMLButtonElement | null} */ (document.querySelector('[data-cat-prompt-bar] [data-cat-prompt-copy]'))?.click();
});
// The answers are passed on only once the prompt really left (prompt.js): the band follows that moment, whichever
// copy button did it.
document.addEventListener(ANSWER_EVENT, render);

/* ------------------------------------------------------------------ start */

render();

for (const demo of demos) {
    readDemo(demo.page.href)
        .then((shape) => {
            demo.shape = shape;
        })
        .catch(() => {
            demo.failed = true;
        })
        .finally(render);
}
for (const entry of archive) {
    readDecided(entry.page.href).then((decided) => {
        entry.decided = decided;
        render();
    });
}
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
