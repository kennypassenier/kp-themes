// What waits for Kenny's verdict, read once for every page that lists it: the Agenda (agenda.js, the page he starts
// from) and To judge (changed.js). Two halves:
//
// - the research demos under "Research to look at" in pages.js, each read from its markup (not its page) with its
//   state from the review kit's own storage (research/_review/progress.js), ordered by the `after` each declares;
// - the catalogue blocks open in a theme (open-pairs.js), laid out on the page with the judging panel and the
//   review dialog of "Every component, one page" (judging.js), so the dialog has them to walk.
//
// Nothing here knows a demo by name: the order and the dependency lines come from pages.js.
import { attachAll } from '../js/auto.js';
import { headingText, suffixIds } from './review.js';
import { REVIEW_PAGE } from './review-state.js';
import { mountJudging } from './judging.js';
import { PAGES } from './pages.js';
import { fingerprintOf, loadUpdate, progressOf, shapeFromFacts, shapeOf, storedFor } from '../research/_review/progress.js';
import { indexedDecided, indexedDemo } from './agenda-index.js';

const ROOT = new URL('../', import.meta.url);

export const RESEARCH_GROUP = 'Research to look at';
export const ARCHIVE_GROUP = 'Archived research';

/** @typedef {import('./pages.js').Page} Page */

/** The research pages: the ones waiting (in the navigation's order), how many are in rework, and the archive. */
export function researchPages() {
    const listed = PAGES.find((group) => group.group === RESEARCH_GROUP)?.pages ?? [];
    // A round being rebuilt (`rework` in pages.js) waits for its new round, not for a verdict.
    const waiting = listed.filter((page) => !page.rework);
    const archived = PAGES.find((group) => group.group === ARCHIVE_GROUP)?.pages ?? [];
    return { waiting, inRework: listed.length - waiting.length, archived };
}

/** A page's label, by its href, from anywhere in the navigation. */
export const labelOf = (href) => PAGES.flatMap((group) => group.pages).find((page) => page.href === href)?.label ?? href;

/**
 * The pages in an order where every page comes after the pages its `after` names, otherwise as listed. A name
 * outside the list orders nothing; a cycle is broken where it closes, in list order.
 * @template {Page} T
 * @param {T[]} pages
 * @returns {T[]}
 */
export function inOrder(pages) {
    const byHref = new Map(pages.map((page) => [page.href, page]));
    /** @type {T[]} */
    const out = [];
    const placed = new Set();
    const visiting = new Set();
    const visit = (/** @type {T} */ page) => {
        if (placed.has(page.href) || visiting.has(page.href)) return;
        visiting.add(page.href);
        for (const href of page.after ?? []) {
            const first = byHref.get(href);
            if (first) visit(first);
        }
        visiting.delete(page.href);
        placed.add(page.href);
        out.push(page);
    };
    pages.forEach(visit);
    return out;
}

/** The pages that name `href` in their `after`: the ones to judge once it is done. */
export const dependentsOf = (href, pages) => pages.filter((page) => page.after?.includes(href));

/**
 * Read one demo's shape (progress.js shapeOf) with its version and its update: from the Agenda's index when it holds
 * the demo, else from the page. Null for a page without the review kit; throws when the page cannot be read.
 * @param {string} href
 */
export async function readDemo(href) {
    // The index holds what the page would say (catalogue/agenda-index.json): one file for every demo on the Agenda.
    const known = await indexedDemo(href);
    if (known) {
        const shape = shapeFromFacts(known.facts);
        if (shape) [shape.fingerprint, shape.update] = [known.fingerprint, known.update];
        return shape;
    }
    const url = new URL(href, ROOT);
    const fetchUrl = new URL(url);
    fetchUrl.searchParams.set('_', String(Date.now()));
    // The update note is asked for beside the page, not after it: one round trip less before the row is known.
    const update = loadUpdate(new URL('update.json', url));
    const response = await fetch(fetchUrl.href, { cache: 'no-cache' });
    if (!response.ok) throw new Error(String(response.status));
    const html = await response.text();
    const shape = shapeOf(new DOMParser().parseFromString(html, 'text/html'));
    // Its version, so a verdict on earlier files of this round reads as open.
    if (shape) [shape.fingerprint, shape.update] = await Promise.all([fingerprintOf(url, html), update]);
    return shape;
}

/** An archived demo's decision, from the decided.json beside it; '' without one. */
export async function readDecided(href) {
    const known = await indexedDecided(href);
    if (known !== undefined) return known;
    try {
        const url = new URL('decided.json', new URL(href, ROOT));
        url.searchParams.set('_', String(Date.now()));
        const response = await fetch(url.href, { cache: 'no-cache' });
        if (response.ok) return String((await response.json())?.decided || 'Decided; see its decided.json.');
    } catch {
        // No decision file.
    }
    return '';
}

/**
 * The address that opens a demo's review dialog at once, with the way back. `auto` asks the page it returns to for
 * the next item at once (auto-next across demos).
 * @param {string} href @param {string} back @param {{ auto?: boolean }} [options]
 */
export function reviewUrl(href, back, { auto = false } = {}) {
    const url = new URL(href, ROOT);
    url.searchParams.set('next', back);
    url.searchParams.set('review', 'open');
    if (auto) url.searchParams.set('auto', 'next');
    return url.href;
}

/**
 * How far a demo has come, with the words both pages use for it.
 * @param {NonNullable<ReturnType<typeof shapeOf>>} shape
 */
export function demoStatus(shape) {
    const progress = progressOf(shape, storedFor(shape.id));
    /** What the state is called, in a word or two. */
    const stateWord = {
        decided: 'Done',
        updated: progress.update ? `Update ${progress.update}` : 'Asked again',
        new: 'Not started',
        partly: 'Begun',
    }[progress.state];
    /** The button's word. */
    const action = progress.state === 'decided' ? 'Open again' : progress.state === 'new' ? 'Start' : 'Continue';
    return { progress, stateWord, action };
}

/**
 * Plural words with their number. @param {number} count @param {string} one @param {string} [many]
 */
export const counted = (count, one, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;

/* --------------------------------------------------------------- blocks */

/**
 * Lay out the chosen catalogue blocks page by page, in the navigation's order, each with the judging panel, and
 * mount the review dialog over them: the composition of "Every component, one page", over a subset.
 * @param {HTMLElement} host
 * @param {{
 *   pages: Awaited<ReturnType<typeof import('./open-pairs.js').gatherBlocks>>['pages'],
 *   chosen: Set<string>,
 *   onRender?: (left: number, entries: { root: HTMLElement }[]) => void,
 * }} options
 */
export async function composeBlocks(host, { pages, chosen, onRender }) {
    const toolbar = document.createElement('div');
    toolbar.className = 'cat-review-bar';
    host.append(toolbar);
    const toc = document.createElement('ul');
    toc.className = 'cat-toc';
    host.append(toc);

    const entries = [];
    for (const { page, slug, title: pageTitle, blocks: pageBlocks } of pages) {
        const picked = pageBlocks.filter((block) => chosen.has(block.id));
        if (!picked.length) continue;
        const component = document.createElement('section');
        component.className = 'cat-component';
        component.id = slug;
        const h2 = document.createElement('h2');
        h2.className = 'cat-component__title';
        h2.textContent = `${pageTitle} (${picked.length})`;
        const source = document.createElement('a');
        source.className = 'cat-note';
        source.href = new URL(page.href, ROOT).href;
        source.textContent = `Open ${page.label} on its own page`;
        component.append(h2, source);

        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${slug}`;
        link.textContent = `${pageTitle} (${picked.length})`;
        item.append(link);
        toc.append(item);

        for (const block of picked) {
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
            onRender?.(left, entries);
        },
    });
    await judging.start();
    document.dispatchEvent(new CustomEvent('cat-composed'));
}
