// One column of the compare page: one component, one theme, on this
// document's own root. Every heading, note and stage element becomes a row,
// and each block ends in a row with its judging panel, for this column's
// theme, under the review page's keys (judging.js); the parent page tells
// each row how tall to be so it lines up with the same row in the other
// column.
import { attachAll } from '../../js/auto.js';
import { applyTheme } from '../../js/theme-core.js';
import { THEMES } from '../../js/theme-registry.js';
import { headingText, readPage, suffixIds } from '../review.js';
import { COMPONENT_PAGES } from '../pages.js';
import { stageElements } from '../block-hash.js';
import { REVIEW_PAGE } from '../review-state.js';
import { mountJudging } from '../judging.js';
import '../demos.js';

const params = new URLSearchParams(location.search);
const side = params.get('side') === 'b' ? 'b' : 'a';
const wanted = params.get('theme');
// The column's theme is the address's, never the stored one: the parent
// chose it, and this document must not write it back to storage either.
applyTheme(THEMES.some((t) => t.name === wanted) ? wanted : 'formal');

const page = COMPONENT_PAGES.find((p) => p.href === params.get('component')) ?? COMPONENT_PAGES[0];
const main = document.querySelector('[data-cat-frame]');
const rows = [];

function row(node) {
    const wrap = document.createElement('div');
    wrap.className = 'cat-frame__row';
    wrap.append(node);
    main.append(wrap);
    rows.push(wrap);
}

const { title, blocks } = await readPage(page);
const heading = document.createElement('h2');
heading.textContent = title;
row(heading);
const entries = [];
for (const block of blocks) {
    const h3 = document.createElement('h3');
    h3.textContent = headingText(block.node);
    row(h3);
    const cells = [];
    const look = block.node.querySelector('.cat-look');
    if (look) row(document.importNode(look, true));
    for (const [index, stage] of [...block.node.querySelectorAll('.cat-stage')].entries()) {
        const parts = stage.children.length ? [...stage.children] : [stage];
        for (const [part, child] of parts.entries()) {
            const cell = document.createElement('div');
            cell.className = stage.className;
            cell.append(document.importNode(child === stage ? stage : child, true));
            if (child === stage) cell.replaceChildren(...cell.firstChild.childNodes);
            suffixIds(cell, `-${index}-${part}`, `${block.id}--`);
            row(cell);
            cells.push(cell);
        }
    }
    // Each cell carries its stage's class, so the component's elements are the
    // descendants of the cells in order — what the review page hashes.
    const review = document.createElement('div');
    review.className = 'cat-frame__review';
    row(review);
    entries.push({
        key: block.id,
        notePage: REVIEW_PAGE,
        noteBlock: block.id,
        title: block.title,
        source: block.source,
        root: review,
        fieldId: `cat-feedback-${block.id}`,
        place: (panel) => review.append(panel),
        elements: () => stageElements(cells),
    });
}
attachAll(main);
const judging = mountJudging({ entries });
judging.start().then(report);

/** The natural height of every row, with no alignment applied. */
function natural() {
    for (const r of rows) r.style.minBlockSize = '';
    return rows.map((r) => r.getBoundingClientRect().height);
}

let reporting = false;
function report() {
    if (reporting) return;
    reporting = true;
    // A timer rather than a frame: a column scrolled out of view still has
    // to answer, and a hidden document never runs a frame.
    setTimeout(async () => {
        await document.fonts?.ready;
        parent.postMessage({ type: 'cat-rows', side, rows: natural() }, location.origin);
        reporting = false;
    }, 150);
}

window.addEventListener('message', (event) => {
    if (event.origin !== location.origin) return;
    if (event.data?.type === 'cat-align') {
        event.data.rows.forEach((height, i) => {
            if (rows[i]) rows[i].style.minBlockSize = `${height}px`;
        });
    }
    if (event.data?.type === 'cat-theme') {
        applyTheme(event.data.theme);
        report();
    }
});

// Anything that changes a row's size — a font arriving, a data table paging,
// an accordion opening — asks for a new alignment.
new ResizeObserver(() => {
    if (!rows.some((r) => r.style.minBlockSize)) report();
}).observe(main);
for (const r of rows) r.addEventListener('toggle', report, true);
main.addEventListener('click', () => setTimeout(report, 50));
report();
