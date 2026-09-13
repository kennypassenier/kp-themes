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
import { currentTheme, THEME_EVENT } from '../js/theme-core.js';
import { themeOptionsMarkup } from '../js/theme-picker.js';
import { COMPONENT_PAGES } from './pages.js';

const ROOT = new URL('../', import.meta.url);
const APPROVALS_KEY = 'kp-catalogue-approvals:v1';

/* ------------------------------------------------------------ gathering */

export const slugOf = (href) =>
    href
        .split('/')
        .pop()
        .replace(/\.html$/, '');

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
        title: `${page.label} › ${block.querySelector('h2')?.textContent.trim() ?? block.id}`,
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
    const refAttrs = ['for', 'aria-controls', 'aria-labelledby', 'aria-describedby', 'popovertarget', 'list', 'form'];
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

/* ---------------------------------------------------------- fingerprint */

// What a block looks like, in the theme on screen, as a hash. The markup as
// written plus the computed style of every element and its two pseudo
// elements, over properties that do not depend on the window's width — so
// resizing the browser does not mark a block changed, and a colour, a
// border, a font or a spacing that moved does.
const PROPS = [
    'color',
    'background-color',
    'background-image',
    'opacity',
    'visibility',
    'display',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'outline-style',
    'outline-width',
    'outline-color',
    'box-shadow',
    'text-shadow',
    'filter',
    'clip-path',
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'letter-spacing',
    'line-height',
    'text-transform',
    'text-decoration-line',
    'text-align',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'margin-top',
    'margin-bottom',
    'row-gap',
    'column-gap',
    'transform',
    'content',
];
const MAX_ELEMENTS = 400; // a 200-row table repeats one rule; the first rows say it

async function sha256(text) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Hold every animation still while reading, so a glitch mid-frame is not a change. */
function stillAnimations() {
    const held = [];
    for (const animation of document.getAnimations()) {
        const timing = animation.effect?.getComputedTiming();
        if (timing && Number.isFinite(Number(timing.endTime))) animation.finish();
        else {
            held.push([animation, animation.playState]);
            animation.pause();
            animation.currentTime = 0;
        }
    }
    return () => {
        for (const [animation, state] of held) if (state === 'running') animation.play();
    };
}

async function fingerprint(block, source) {
    const lines = [source];
    const elements = [block, ...block.querySelectorAll('*')].filter((el) => !el.closest('.cat-feedback-field, .cat-approval')).slice(0, MAX_ELEMENTS);
    for (const el of elements) {
        for (const pseudo of [null, '::before', '::after']) {
            const cs = getComputedStyle(el, pseudo);
            if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
            lines.push(PROPS.map((prop) => cs.getPropertyValue(prop)).join('|'));
        }
    }
    return sha256(lines.join('\n'));
}

/* ------------------------------------------------------------ approvals */

function loadApprovals() {
    try {
        return JSON.parse(localStorage.getItem(APPROVALS_KEY) ?? '{}');
    } catch {
        return {};
    }
}

function saveApprovals(all) {
    try {
        localStorage.setItem(APPROVALS_KEY, JSON.stringify(all));
        return true;
    } catch {
        return false;
    }
}

const themeLabel = (name) => THEMES.find((t) => t.name === name)?.label ?? name;

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

    // The filter bar: every block, or only what needs approval in this theme.
    const toolbar = document.createElement('div');
    toolbar.className = 'cat-review-bar';
    toolbar.innerHTML = `
        <div class="kp-field kp-field--check cat-review-toggle">
            <input class="kp-field__check" type="checkbox" id="cat-only-changed" data-cat-only-changed />
            <label class="kp-field__label" for="cat-only-changed">Only blocks that need approval in this theme</label>
        </div>
        <span class="cat-note" role="status" aria-live="polite" data-cat-review-count></span>`;
    host.append(toolbar);

    const toc = document.createElement('ul');
    toc.className = 'cat-toc';
    host.append(toc);

    /** @type {{ id: string, source: string, section: HTMLElement, badge: HTMLElement, button: HTMLButtonElement }[]} */
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
            // Headings step down one level under the component's own.
            for (const h of section.querySelectorAll('h2')) {
                const h3 = document.createElement('h3');
                h3.innerHTML = h.innerHTML;
                h.replaceWith(h3);
            }
            section.dataset.catTitle = block.title;
            suffixIds(section, '', `${slug}--`);
            section.id = block.id;

            const approval = document.createElement('div');
            approval.className = 'cat-approval';
            approval.innerHTML = `
                <span class="kp-badge" data-cat-approval-state>Checking…</span>
                <button type="button" class="kp-button kp-button--secondary kp-button--sm" data-cat-approve>Approve</button>`;
            section.append(approval);
            component.append(section);
            entries.push({
                id: block.id,
                source: block.source,
                section,
                badge: approval.querySelector('[data-cat-approval-state]'),
                button: approval.querySelector('[data-cat-approve]'),
            });
        }
        host.append(component);
    }

    attachAll(host);
    await document.fonts?.ready;

    const only = toolbar.querySelector('[data-cat-only-changed]');
    const count = toolbar.querySelector('[data-cat-review-count]');
    let current = new Map(); // block id -> hash in the theme on screen

    async function measure() {
        const theme = currentTheme();
        const release = stillAnimations();
        const next = new Map();
        for (const entry of entries) next.set(entry.id, await fingerprint(entry.section, entry.source));
        release();
        if (theme !== currentTheme()) return; // the theme moved while reading; the next pass counts
        current = next;
        render();
    }

    function render() {
        const theme = currentTheme();
        const approvals = loadApprovals();
        let needing = 0;
        for (const entry of entries) {
            const approved = approvals[entry.id]?.[theme];
            const hash = current.get(entry.id);
            const state = !approved ? 'new' : approved === hash ? 'approved' : 'changed';
            if (state !== 'approved') needing += 1;
            entry.badge.textContent =
                state === 'approved'
                    ? `Approved in ${themeLabel(theme)}`
                    : state === 'changed'
                      ? `Changed since approval in ${themeLabel(theme)}`
                      : `Not yet approved in ${themeLabel(theme)}`;
            // The badge has no severity variants (only application statuses), so the
            // state is carried by the words alone.
            entry.badge.className = 'kp-badge';
            entry.button.textContent = state === 'approved' ? 'Approved' : `Approve in ${themeLabel(theme)}`;
            entry.button.disabled = state === 'approved' || !hash;
            entry.section.dataset.catState = state;
            entry.section.hidden = only.checked && state === 'approved';
        }
        for (const component of host.querySelectorAll('.cat-component')) {
            component.hidden = only.checked && !component.querySelector('.cat-block:not([hidden])');
        }
        count.textContent = `${needing} of ${entries.length} block(s) need approval in ${themeLabel(theme)}.`;
    }

    host.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? event.target.closest('[data-cat-approve]') : null;
        if (!button) return;
        const entry = entries.find((e) => e.button === button);
        const hash = entry && current.get(entry.id);
        if (!hash) return;
        const approvals = loadApprovals();
        (approvals[entry.id] ??= {})[currentTheme()] = hash;
        saveApprovals(approvals);
        render();
    });
    only.addEventListener('change', render);
    document.documentElement.addEventListener(THEME_EVENT, () => {
        for (const entry of entries) entry.badge.textContent = 'Checking…';
        // Give the register a moment to paint before reading it. A timer, not
        // requestAnimationFrame: a tab in the background never runs a frame,
        // and the badges then stayed on "Checking…" for good.
        setTimeout(() => measure(), 120);
    });

    await measure();
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
