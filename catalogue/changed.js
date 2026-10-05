// catalogue/changed.html, "To judge": the ONE page Kenny starts from when
// something waits for his verdict (Kenny, 2026-10-05: "ik heb altijd gezegd
// van dingen te bundelen zodat ik vanuit één centrale locatie/pagina verder
// kan, dus doe dat"). Claude links only this page when it asks Kenny to look,
// never a demo or a catalogue page on its own.
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
import { attachAll } from '../js/auto.js';
import { currentTheme, THEME_EVENT } from '../js/theme-core.js';
import { headingText, suffixIds } from './review.js';
import { REVIEW_PAGE, themeLabel } from './review-state.js';
import { mountJudging } from './judging.js';
import { gatherBlocks, isOpen } from './open-pairs.js';
import { PAGES } from './pages.js';
import { progressOf, shapeOf, storedFor } from '../research/_review/progress.js';

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

    const toolbar = document.createElement('div');
    toolbar.className = 'cat-review-bar';
    host.append(toolbar);
    const toc = document.createElement('ul');
    toc.className = 'cat-toc';
    host.append(toc);

    const entries = [];
    for (const { page, slug, title: pageTitle, blocks: pageBlocks } of pages) {
        const chosen = pageBlocks.filter((block) => open.has(block.id));
        if (!chosen.length) continue;
        const component = document.createElement('section');
        component.className = 'cat-component';
        component.id = slug;
        const h2 = document.createElement('h2');
        h2.className = 'cat-component__title';
        h2.textContent = `${pageTitle} (${chosen.length})`;
        const source = document.createElement('a');
        source.className = 'cat-note';
        source.href = new URL(page.href, ROOT).href;
        source.textContent = `Open ${page.label} on its own page`;
        component.append(h2, source);

        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${slug}`;
        link.textContent = `${pageTitle} (${chosen.length})`;
        item.append(link);
        toc.append(item);

        for (const block of chosen) {
            const section = /** @type {HTMLElement} */ (document.importNode(block.node, true));
            // As on the review page: the block's own heading one level down.
            for (const h of section.querySelectorAll(':scope > h2')) {
                const h3 = document.createElement('h3');
                for (const { name, value } of h.attributes) h3.setAttribute(name, value);
                h3.innerHTML = h.innerHTML;
                h.replaceWith(h3);
            }
            section.dataset.catTitle = block.title;
            suffixIds(section, '', `${slug}--`);
            section.id = block.id;
            component.append(section);
            entries.push({
                key: block.id,
                notePage: REVIEW_PAGE,
                noteBlock: block.id,
                title: block.title ?? headingText(section),
                source: block.source,
                root: section,
                fieldId: `cat-feedback-${block.id}`,
                place: (panel) => section.append(panel),
            });
        }
        host.append(component);
    }

    attachAll(host);
    const judging = mountJudging({
        entries,
        toolbar,
        onRender() {
            for (const component of host.querySelectorAll('.cat-component')) {
                component.hidden = !component.querySelector('.cat-block:not([hidden])');
            }
            // Open as judging.js has it: no verdict that stands, or a review note asking again.
            const left = entries.filter(
                ({ root }) => !['approved', 'rejected'].includes(root.dataset.catState ?? '') || root.hasAttribute('data-cat-review-note'),
            ).length;
            heading(left);
        },
    });
    await judging.start();
    document.dispatchEvent(new CustomEvent('cat-composed'));
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
    const pages = PAGES.find((group) => group.group === 'Research to look at')?.pages ?? [];

    /** @typedef {{ href: string, label: string, url: URL, shape: ReturnType<typeof shapeOf> | undefined, failed: boolean, row: HTMLLIElement }} Demo */
    /** @type {Demo[]} */
    const demos = pages.map((page) => ({ ...page, url: new URL(page.href, ROOT), shape: undefined, failed: false, row: rowFor(page) }));
    list.replaceChildren(...demos.map((demo) => demo.row));
    /** @type {number | null} open catalogue blocks in the theme on screen, null while gathering */
    let blocksLeft = null;

    /** The address that opens a demo: its dialog at once, and the way back to here. */
    const openUrl = (demo) => {
        const url = new URL(demo.url);
        url.searchParams.set('next', self.href);
        url.searchParams.set('review', 'open');
        return url.href;
    };

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
        const progress = progressOf(shape, storedFor(shape.id));
        ask.textContent = shape.ask;
        row.dataset.catHubState = progress.state;
        const extras = progress.extrasLeft ? ' and its catalogue blocks' : '';
        if (progress.state === 'decided') {
            badge.textContent = `Judged in all ${progress.themes} themes`;
            badge.className = 'kp-badge kp-badge--success';
            open.textContent = 'Open again';
        } else if (progress.state === 'new') {
            badge.textContent = `Not started · ${progress.themes} themes`;
            badge.className = 'kp-badge';
            open.textContent = 'Start';
        } else {
            badge.textContent = `${progress.themesLeft} of ${progress.themes} themes left${extras}`;
            badge.className = 'kp-badge kp-badge--warning';
            open.textContent = 'Continue';
        }
        open.setAttribute('aria-label', `${open.textContent}: ${demo.label}`);
    }

    /** Rows in their list, totals and Start, from what is known now. */
    function render() {
        for (const demo of demos) paint(demo);
        const done = demos.filter((demo) => demo.row.dataset.catHubState === 'decided');
        const waiting = demos.filter((demo) => demo.row.dataset.catHubState !== 'decided');
        list.replaceChildren(...waiting.map((demo) => demo.row));
        decidedList.replaceChildren(...done.map((demo) => demo.row));
        decided.hidden = !done.length;
        decided.querySelector('[data-cat-hub-decided-count]').textContent = `(${done.length})`;
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
            : `Left: ${waiting.length} of ${demos.length} demos (${themesLeft} theme step(s) in them) · ${blocks}.`;
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
                const response = await fetch(demo.url, { cache: 'no-cache' });
                if (!response.ok) throw new Error(String(response.status));
                demo.shape = shapeOf(new DOMParser().parseFromString(await response.text(), 'text/html'));
            } catch {
                demo.failed = true;
            }
            render();
        }),
    );
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
