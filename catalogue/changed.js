// catalogue/changed.html: only the blocks that wait for a verdict in the
// theme on screen (Kenny, 2026-10-05: "het zijn veel goedkeuringen
// telkens"). Gathered the way "Every component, one page" gathers them
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
        if (title) title.textContent = `What changed since my last verdicts: ${count} open in ${themeLabel(theme)}`;
        document.title = `${count} open · What changed · kp-themes catalogue`;
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

const host = document.querySelector('[data-cat-compose="changed"]');
if (host) {
    const composedIn = currentTheme();
    composeChanged(host);
    // Another theme has another set: gather it again.
    document.documentElement.addEventListener(THEME_EVENT, () => {
        if (currentTheme() !== composedIn) location.reload();
    });
}
