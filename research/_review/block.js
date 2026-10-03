// One catalogue block in one theme, for the demo review kit's last step
// (review.js, `data-review-extra`): ?page=catalogue/field.html&block=choices&theme=retro.
// The block's stages are copied from the catalogue page itself, as the
// compare column does (catalogue/frame/compare.js), so what is judged here is
// what the catalogue shows; the theme is the address's, never the stored one.
import { attachAll } from '../../js/auto.js';
import { applyTheme } from '../../js/theme-core.js';
import { THEMES } from '../../js/theme-registry.js';
import { readPage } from '../../catalogue/review.js';
import '../../catalogue/demos.js';

const params = new URLSearchParams(location.search);
const wanted = params.get('theme');
applyTheme(THEMES.some((t) => t.name === wanted) ? wanted : 'formal');

const main = document.querySelector('[data-rv-block]');
const { blocks } = await readPage({ href: params.get('page'), label: '' });
const block = blocks.find((b) => b.node.id === params.get('block'));
if (!block) {
    main.textContent = `No block "${params.get('block')}" on ${params.get('page')}.`;
} else {
    for (const stage of block.node.querySelectorAll('.cat-stage')) main.append(document.importNode(stage, true));
    attachAll(main);
}
