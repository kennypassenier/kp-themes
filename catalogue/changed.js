// catalogue/changed.html, "To judge, by theme": the list of what waits for
// Kenny's verdict in the theme on screen. Since 2026-10-13 the page he starts
// from is the Agenda (agenda.html, which reads the same data through
// waiting.js); this one stays reachable from it.
//
// In order: first the research demos under "Research to look at" that carry
// the review kit, each with its state read from the kit's own storage
// (research/_review/progress.js), then the catalogue blocks still open in the
// theme on screen. Start opens the first unfinished item; a demo opened from
// here carries `?next=` back to this page and opens its dialog by itself.
//
// The blocks: gathered the way "Every component, one page" gathers them
// (review.js), with the same keys, panels, prompt and review dialog, but
// only the pairs open-pairs.js calls open: never judged in this theme,
// judged on other markup, an approval whose pixels moved, or a review note
// that asks again. Page by page, in the navigation's order.
//
// The set belongs to one theme, so the page is one theme at a time
// (`data-cat-theme-fixed` without a theme of its own keeps the theme menu
// but stops the review dialog walking on to the next theme over blocks
// gathered for this one); another theme picked in the menu gathers again.
import { currentTheme, THEME_EVENT } from '../js/theme-core.js';
import { themeLabel } from './review-state.js';
import { gatherBlocks, isOpen } from './open-pairs.js';
import { progressOf, storedFor } from '../research/_review/progress.js';
import { composeBlocks, demoStatus, readDecided, readDemo, researchPages, reviewUrl } from './waiting.js';

const ROOT = new URL('../', import.meta.url);

async function composeChanged(host) {
    const theme = currentTheme();
    const title = document.querySelector('[data-cat-changed-title]');
    const status = document.createElement('p');
    status.className = 'cat-note';
    status.setAttribute('role', 'status');
    status.textContent = `Gathering what is open in ${themeLabel(theme)}…`;
    host.append(status);

    const { pages, blocks } = await gatherBlocks();
    const open = new Set(blocks.filter((block) => isOpen(block, theme)).map((block) => block.id));
    status.remove();

    const heading = (count) => {
        if (title) title.textContent = `2 · Catalogue blocks in ${themeLabel(theme)}: ${count} open`;
        hub.blocks(count);
    };
    heading(open.size);

    if (!open.size) {
        const done = document.createElement('p');
        done.className = 'cat-changed-done';
        done.setAttribute('data-cat-changed-none', '');
        done.textContent = `Nothing is open in ${themeLabel(theme)}: every block has its verdict, on the markup as it stands, and no pixel check or review note asks again. Pick another theme in the menu.`;
        host.append(done);
        document.dispatchEvent(new CustomEvent('cat-composed'));
        return;
    }
    await composeBlocks(host, { pages, chosen: open, onRender: (left) => heading(left) });
}

/* ------------------------------------------------------------------ the hub */

/**
 * The demos and the summary above the blocks. Every demo the navigation lists
 * under "Research to look at" is read once (its markup, not its page), and
 * every row is drawn from the first frame with its final geometry, its state
 * saying "Reading" until the markup is in.
 */
function mountHub() {
    const totals = /** @type {HTMLElement} */ (document.querySelector('[data-cat-hub-totals]'));
    const start = /** @type {HTMLButtonElement} */ (document.querySelector('[data-cat-hub-start]'));
    const next = /** @type {HTMLElement} */ (document.querySelector('[data-cat-hub-next]'));
    const list = /** @type {HTMLElement} */ (document.querySelector('[data-cat-hub-demos]'));
    const decided = /** @type {HTMLDetailsElement} */ (document.querySelector('[data-cat-hub-decided]'));
    const decidedList = /** @type {HTMLElement} */ (document.querySelector('[data-cat-hub-decided-list]'));
    const self = new URL('changed.html', import.meta.url);
    const { waiting: pages, inRework, archived: archivedPages } = researchPages();

    /** @typedef {{ href: string, label: string, url: URL, shape: Awaited<ReturnType<typeof readDemo>> | undefined, failed: boolean, row: HTMLLIElement }} Demo */
    /** @type {Demo[]} */
    const demos = pages.map((page) => ({ ...page, url: new URL(page.href, ROOT), shape: undefined, failed: false, row: rowFor(page) }));
    list.replaceChildren(...demos.map((demo) => demo.row));
    // Under Decided as well: every archived demo, with the decision its
    // folder records (decided.json), newest first (Kenny, 2026-10-07: "ik heb
    // al veel meer demos goedgekeurd dan deze laatste vier").
    const archived = archivedPages.map((page) => {
        const row = rowFor(page);
        const url = new URL(page.href, ROOT);
        const open = /** @type {HTMLAnchorElement} */ (row.querySelector('[data-cat-hub-open]'));
        open.href = url.href;
        open.textContent = 'Open';
        open.setAttribute('aria-label', `Open: ${page.label}`);
        row.dataset.catHubState = 'archived';
        return { row, url, href: page.href, decided: '' };
    });
    /** One archived row's words and badge, from its decided.json or its absence. */
    const paintArchived = (entry) => {
        const ask = /** @type {HTMLElement} */ (entry.row.querySelector('[data-cat-hub-ask]'));
        const badge = /** @type {HTMLElement} */ (entry.row.querySelector('[data-cat-hub-state]'));
        ask.textContent = entry.decided || 'Archived without a decision file: set aside, or decided before decided.json existed.';
        badge.textContent = entry.decided ? 'Decided' : 'Archived';
        badge.className = entry.decided ? 'kp-badge kp-badge--success' : 'kp-badge';
    };
    archived.forEach(paintArchived);
    /** @type {number | null} open catalogue blocks in the theme on screen, null while gathering */
    let blocksLeft = null;

    /** The address that opens a demo: its dialog at once, and the way back to here. */
    const openUrl = (demo) => reviewUrl(demo.href, self.href);

    function rowFor(page) {
        const li = document.createElement('li');
        li.className = 'cat-hub__row';
        li.innerHTML = `
            <div class="cat-hub__what">
                <h3 class="cat-hub__title" data-cat-hub-title></h3>
                <p class="cat-hub__ask" data-cat-hub-ask>Reading the demo…</p>
            </div>
            <p class="cat-hub__state"><span class="kp-badge" data-cat-hub-state>Reading</span></p>
            <a class="kp-button cat-hub__open" data-cat-hub-open>Open</a>`;
        li.querySelector('[data-cat-hub-title]').textContent = page.label;
        return li;
    }

    /** One row's text, link and state, from what is known now. @param {Demo} demo */
    function paint(demo) {
        const { row, shape } = demo;
        const href = openUrl(demo);
        const open = /** @type {HTMLAnchorElement} */ (row.querySelector('[data-cat-hub-open]'));
        const ask = /** @type {HTMLElement} */ (row.querySelector('[data-cat-hub-ask]'));
        const badge = /** @type {HTMLElement} */ (row.querySelector('[data-cat-hub-state]'));
        open.href = href;
        if (demo.failed || shape === null) {
            ask.textContent = demo.failed ? 'This demo could not be read; open it to judge it on its own page.' : 'This demo has no review dialog.';
            badge.textContent = 'State unknown';
            badge.className = 'kp-badge';
            row.dataset.catHubState = 'unknown';
            return;
        }
        if (!shape) return;
        const { progress, action } = demoStatus(shape);
        ask.textContent = shape.ask;
        row.dataset.catHubState = progress.state;
        const extras = progress.extrasLeft ? ' and its catalogue blocks' : '';
        if (progress.state === 'decided') {
            badge.textContent = `Judged in all ${progress.themes} themes`;
            badge.className = 'kp-badge kp-badge--success';
        } else if (progress.state === 'updated') {
            // A later round: name the themes it reopened, so Kenny sees which round he is in.
            const names = progress.updated.map(themeLabel);
            if (progress.extrasUpdated) names.push('its catalogue blocks');
            // More than three names wrap the badge a word per line in the card (Kenny, 2026-10-13: "zet gewoon 'Changed x
            // themes'"): the count says it, the dialog shows which.
            const count = progress.updated.length;
            const which = count > 3 ? `${count} themes` : names.join(', ');
            const blocks = count > 3 && progress.extrasUpdated ? ' and its catalogue blocks' : '';
            badge.textContent = `${progress.update ? `Update ${progress.update}` : 'Changed'} · ${which}${blocks}`;
            badge.className = 'kp-badge kp-badge--info';
        } else if (progress.state === 'new') {
            badge.textContent = `Not started · ${progress.themes} themes`;
            badge.className = 'kp-badge';
        } else {
            badge.textContent = `${progress.themesLeft} of ${progress.themes} themes left${extras}`;
            badge.className = 'kp-badge kp-badge--warning';
        }
        open.textContent = action;
        open.setAttribute('aria-label', `${open.textContent}: ${demo.label}`);
    }

    /** Rows in their list, totals and Start, from what is known now. */
    function render() {
        for (const demo of demos) paint(demo);
        const done = demos.filter((demo) => demo.row.dataset.catHubState === 'decided');
        const waiting = demos.filter((demo) => demo.row.dataset.catHubState !== 'decided');
        list.replaceChildren(...waiting.map((demo) => demo.row));
        const byDate = [...archived].sort((a, b) => Number(!a.decided) - Number(!b.decided) || b.decided.localeCompare(a.decided));
        decidedList.replaceChildren(...done.map((demo) => demo.row), ...byDate.map((entry) => entry.row));
        const count = done.length + archived.length;
        decided.hidden = !count;
        decided.querySelector('[data-cat-hub-decided-count]').textContent = `(${count})`;
        if (!waiting.length) {
            const none = document.createElement('li');
            none.className = 'cat-changed-done';
            none.textContent = 'Every demo is judged in every theme. Their answers wait under Decided until you copy them.';
            list.append(none);
        }

        const reading = demos.some((demo) => demo.shape === undefined && !demo.failed);
        const themesLeft = demos.reduce((sum, demo) => sum + (demo.shape ? progressOf(demo.shape, storedFor(demo.shape.id)).themesLeft : 0), 0);
        const theme = themeLabel(currentTheme());
        const blocks = blocksLeft === null ? `catalogue blocks in ${theme}: gathering…` : `${blocksLeft} catalogue block(s) open in ${theme}`;
        totals.textContent = reading
            ? `Reading the research demos… ${blocks}.`
            : `Left: ${waiting.length} of ${demos.length} demos (${themesLeft} theme step(s) in them)${
                  inRework ? ` · ${inRework} more in rework, back when their new round is out` : ''
              } · ${blocks}.`;
        const items = waiting.length + (blocksLeft ?? 0);
        document.title = `${reading || blocksLeft === null ? '…' : items} to judge · kp-themes catalogue`;

        // Start: the first demo that waits, else the blocks of this theme.
        const first = waiting[0];
        const begun = demos.some((demo) => demo.row.dataset.catHubState !== 'new' && demo.row.dataset.catHubState !== undefined);
        start.disabled = false;
        start.dataset.catHubTarget = first ? 'demo' : blocksLeft ? 'blocks' : '';
        if (first) {
            start.textContent = begun ? 'Continue' : 'Start';
            next.textContent = `Opens “${first.label}” in its review dialog.`;
        } else if (blocksLeft) {
            start.textContent = 'Continue';
            next.textContent = `Every demo is judged: opens the review dialog over the ${blocksLeft} block(s) open in ${theme}.`;
        } else {
            start.textContent = 'Start';
            start.disabled = true;
            next.textContent =
                blocksLeft === null
                    ? 'Waiting for the catalogue blocks to be gathered.'
                    : `Nothing waits in ${theme}. Another theme in the menu may.`;
        }
        start.onclick = () => {
            if (first) location.assign(openUrl(first));
            else {
                document.getElementById('cat-hub-blocks')?.scrollIntoView({ block: 'start' });
                /** @type {HTMLButtonElement | null} */ (document.querySelector('[data-cat-dialog-open]'))?.click();
            }
        };
    }

    render();
    Promise.all(
        demos.map(async (demo) => {
            try {
                demo.shape = await readDemo(demo.href);
            } catch {
                demo.failed = true;
            }
            render();
        }),
    );
    Promise.all(
        archived.map(async (entry) => {
            entry.decided = await readDecided(entry.href);
            paintArchived(entry);
        }),
    ).then(render);
    // A verdict given in a demo in another tab, or the way back to this page
    // through the browser's history: the states are read again.
    window.addEventListener('storage', (event) => {
        if (event.key === null || event.key.startsWith('kp-demo-review:')) render();
    });
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) render();
    });
    return {
        /** The catalogue blocks open in the theme on screen, once gathered and after every verdict. @param {number} count */
        blocks(count) {
            blocksLeft = count;
            render();
        },
    };
}

const hub = document.querySelector('[data-cat-hub-demos]') ? mountHub() : { blocks() {} };

const host = document.querySelector('[data-cat-compose="changed"]');
if (host) {
    const composedIn = currentTheme();
    composeChanged(host);
    // Another theme has another set: gather it again.
    document.documentElement.addEventListener(THEME_EVENT, () => {
        if (currentTheme() !== composedIn) location.reload();
    });
}
