// The review page and the compare page: both gather the blocks of every
// component page into one document, so the component pages stay the one
// place a block is written and these two pages cannot drift from them.
//
//   data-cat-compose="all"      every block of every component, one long
//                               page, one notes prompt, and a filter that
//                               shows only what changed since approval
//   data-cat-compose="compare"  one component under two themes, each
//                               element of a block in the same row, so the
//                               two versions always start side by side
import { attachAll } from '../js/auto.js';
import { THEMES } from '../js/theme-registry.js';
import { themeOptionsMarkup } from '../js/theme-picker.js';
import { COMPONENT_PAGES } from './pages.js';
import { REVIEW_PAGE, slugOf, themeLabel } from './review-state.js';
import { mountJudging } from './judging.js';

const ROOT = new URL('../', import.meta.url);

/* ------------------------------------------------------------ gathering */

export { slugOf };

/** A block's own heading, without a label set inside it (the data table demo's "mock"). */
export function headingText(block) {
    const heading = block.querySelector('h2, h3');
    if (!heading) return block.id;
    const copy = /** @type {HTMLElement} */ (heading.cloneNode(true));
    for (const tag of copy.querySelectorAll('[class*="-tag"]')) tag.remove();
    return copy.textContent.trim() || block.id;
}

/**
 * Fetch one component page and return its title and blocks, each block with
 * the markup exactly as written, before anything attaches to it.
 */
export async function readPage(page) {
    const response = await fetch(new URL(page.href, ROOT));
    if (!response.ok) throw new Error(`${page.href} answered ${response.status}`);
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    const slug = slugOf(page.href);
    const blocks = [...doc.querySelectorAll('.cat-main .cat-block[id]')].map((block) => ({
        id: `${slug}--${block.id}`,
        source: block.outerHTML,
        title: `${page.label} › ${headingText(block)}`,
        node: block,
    }));
    return { page, slug, title: doc.querySelector('.cat-main h1')?.textContent.trim() ?? page.label, blocks };
}

/** Give every id in a subtree a suffix, and every reference to it too. */
export function suffixIds(root, suffix, prefix = '') {
    const ids = new Map();
    for (const el of root.querySelectorAll('[id]')) {
        const next = `${prefix}${el.id}${suffix}`;
        ids.set(el.id, next);
        el.id = next;
    }
    if (!ids.size) return;
    // The package's own id references too: a gathered "Open the dialog" or
    // "Copy" whose target kept its old id opened and copied nothing.
    const refAttrs = [
        'for',
        'aria-controls',
        'aria-labelledby',
        'aria-describedby',
        'popovertarget',
        'list',
        'form',
        'data-kp-dialog',
        'data-kp-copy',
        'data-kp-palette-open',
    ];
    for (const el of root.querySelectorAll('*')) {
        for (const attr of refAttrs) {
            const value = el.getAttribute(attr);
            if (value)
                el.setAttribute(
                    attr,
                    value
                        .split(/\s+/)
                        .map((v) => ids.get(v) ?? v)
                        .join(' '),
                );
        }
        const href = el.getAttribute('href');
        if (href?.startsWith('#') && ids.has(href.slice(1))) el.setAttribute('href', `#${ids.get(href.slice(1))}`);
        // position-anchor / anchor-name ride on inline style in the package's popovers.
        const style = el.getAttribute('style');
        if (style?.includes('--')) {
            el.setAttribute(
                'style',
                style.replace(/--([A-Za-z0-9_-]+)/g, (whole, name) => (ids.has(name) ? `--${ids.get(name)}` : whole)),
            );
        }
    }
}

/* ------------------------------------------------------ the review page */

async function composeAll(host) {
    const main = host.closest('main') ?? host;
    const status = document.createElement('p');
    status.className = 'cat-note';
    status.setAttribute('role', 'status');
    status.textContent = `Gathering ${COMPONENT_PAGES.length} component page(s)…`;
    host.append(status);

    const pages = await Promise.all(COMPONENT_PAGES.map(readPage));
    status.remove();

    // The review bar: what is left to judge, the way back from a mistaken
    // click, and whether judged blocks stay on the page (judging.js fills it).
    // The prompt controls sit in the bar every page carries (prompt.js).
    const toolbar = document.createElement('div');
    toolbar.className = 'cat-review-bar';
    host.append(toolbar);

    const toc = document.createElement('ul');
    toc.className = 'cat-toc';
    host.append(toc);

    const entries = [];
    for (const { page, slug, title, blocks } of pages) {
        const component = document.createElement('section');
        component.className = 'cat-component';
        component.id = slug;
        const heading = document.createElement('h2');
        heading.className = 'cat-component__title';
        heading.textContent = title;
        const source = document.createElement('a');
        source.className = 'cat-note';
        source.href = new URL(page.href, ROOT).href;
        source.textContent = `Open ${page.label} on its own page`;
        component.append(heading, source);

        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${slug}`;
        link.textContent = title;
        item.append(link);
        toc.append(item);

        for (const block of blocks) {
            const section = /** @type {HTMLElement} */ (document.importNode(block.node, true));
            // The block's own heading steps down one level under the component's.
            // Only that one: a heading inside the stage is part of what is being
            // reviewed (a dialog title, a card title), and rewriting it dropped its
            // class — 17 of them lost their styling on this page (fix-21).
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
                title: block.title,
                source: block.source,
                root: section,
                fieldId: `cat-feedback-${block.id}`,
                place: (panel) => section.append(panel),
            });
        }
        host.append(component);
    }

    // Attached before the panels go in: the panels are the catalogue's, not
    // components under review.
    attachAll(host);
    const judging = mountJudging({
        entries,
        toolbar,
        // A component whose every block left the page leaves with them.
        onRender() {
            for (const component of host.querySelectorAll('.cat-component')) {
                component.hidden = !component.querySelector('.cat-block:not([hidden])');
            }
        },
    });
    await judging.start();
    document.dispatchEvent(new CustomEvent('cat-composed'));
}

/* ----------------------------------------------------- the compare page */

// Each column is its own document (catalogue/frame/compare.html) with the
// theme on its own root. A theme cannot be nested inside another on one page:
// the registers are written as `[data-theme='x'] .kp-button`, so the outer
// theme's rules reach every element below the root, whatever theme an inner
// element wears — measured 2026-09-13, formal buttons drawn with cyberpunk's
// notch. Two documents keep each theme exactly as a consumer sees it; the
// rows are then lined up across them by message.

/** A theme menu that picks a theme for one column rather than for the page. */
function columnMenu(id, label, onPick) {
    const wrap = document.createElement('span');
    wrap.className = 'kp-theme-menu cat-compare__menu';
    wrap.innerHTML =
        `<button type="button" class="kp-button" popovertarget="${id}" style="anchor-name: --${id}" data-cat-column-label></button>` +
        `<div popover="auto" id="${id}" class="kp-popover" style="position-anchor: --${id}">` +
        `<ul class="kp-menu" aria-label="${label}">${themeOptionsMarkup()}</ul></div>`;
    const button = wrap.querySelector('[data-cat-column-label]');
    const popover = wrap.querySelector('[popover]');
    const set = (theme) => {
        button.textContent = `${label}: ${themeLabel(theme)}`;
        for (const option of wrap.querySelectorAll('[data-kp-theme]')) {
            option.setAttribute('aria-pressed', String(option.getAttribute('data-kp-theme') === theme));
        }
    };
    wrap.addEventListener('click', (event) => {
        const option = event.target instanceof Element ? event.target.closest('[data-kp-theme]') : null;
        if (!option) return;
        const theme = option.getAttribute('data-kp-theme');
        set(theme);
        popover.hidePopover?.();
        onPick(theme);
    });
    return { wrap, set };
}

async function composeCompare(host) {
    const params = new URLSearchParams(location.search);
    const valid = (name) => THEMES.some((t) => t.name === name);
    const state = {
        a: valid(params.get('a')) ? params.get('a') : 'formal',
        b: valid(params.get('b')) ? params.get('b') : 'cyberpunk',
        component: (COMPONENT_PAGES.find((p) => slugOf(p.href) === params.get('component')) ?? COMPONENT_PAGES[0]).href,
    };

    const controls = document.createElement('div');
    controls.className = 'cat-review-bar';
    const componentField = document.createElement('div');
    componentField.className = 'kp-field cat-compare__component';
    componentField.innerHTML = `<label class="kp-field__label" for="cat-compare-component">Component</label>
        <select class="kp-field__input" id="cat-compare-component">${COMPONENT_PAGES.map((p) => `<option value="${p.href}">${p.label}</option>`).join(
            '',
        )}</select>`;
    const select = componentField.querySelector('select');
    select.value = state.component;

    const frames = {};
    const menus = {};
    const heights = { a: null, b: null };

    const grid = document.createElement('div');
    grid.className = 'cat-compare';
    for (const side of ['a', 'b']) {
        menus[side] = columnMenu(`cat-compare-${side}`, side === 'a' ? 'Left' : 'Right', (theme) => {
            state[side] = theme;
            heights[side] = null;
            frames[side].contentWindow?.postMessage({ type: 'cat-theme', theme }, location.origin);
            remember();
        });
        const frame = document.createElement('iframe');
        frame.className = 'cat-compare__frame';
        frame.title = side === 'a' ? 'Left theme' : 'Right theme';
        frames[side] = frame;
        grid.append(frame);
    }
    controls.append(componentField, menus.a.wrap, menus.b.wrap);
    host.append(controls, grid);

    function remember() {
        menus.a.set(state.a);
        menus.b.set(state.b);
        const url = new URL(location.href);
        url.searchParams.set('a', state.a);
        url.searchParams.set('b', state.b);
        url.searchParams.set('component', slugOf(state.component));
        history.replaceState(null, '', url);
    }

    function load() {
        heights.a = heights.b = null;
        for (const side of ['a', 'b']) {
            const src = new URL('catalogue/frame/compare.html', ROOT);
            src.searchParams.set('component', state.component);
            src.searchParams.set('theme', state[side]);
            src.searchParams.set('side', side);
            frames[side].src = src.href;
        }
        remember();
    }

    // Both columns report the natural height of every row; each row is then
    // given the taller of the two on both sides, so pair n starts at the same
    // height in both columns whatever either theme does to its size.
    window.addEventListener('message', (event) => {
        if (event.origin !== location.origin || event.data?.type !== 'cat-rows') return;
        heights[event.data.side] = event.data.rows;
        if (!heights.a || !heights.b) return;
        const rows = Math.max(heights.a.length, heights.b.length);
        const tallest = Array.from({ length: rows }, (_, i) => Math.max(heights.a[i] ?? 0, heights.b[i] ?? 0));
        const total = tallest.reduce((sum, h) => sum + h, 0);
        for (const side of ['a', 'b']) {
            frames[side].contentWindow?.postMessage({ type: 'cat-align', rows: tallest }, location.origin);
        }
        const height = `${Math.ceil(total + 64)}px`;
        frames.a.style.blockSize = height;
        frames.b.style.blockSize = height;
    });

    select.addEventListener('change', () => {
        state.component = select.value;
        load();
    });
    load();
    document.dispatchEvent(new CustomEvent('cat-composed'));
}

/* -------------------------------------------------------------- mounting */

const host = document.querySelector('[data-cat-compose]');
if (host?.getAttribute('data-cat-compose') === 'all') composeAll(host);
if (host?.getAttribute('data-cat-compose') === 'compare') composeCompare(host);
