// "Am I through?" — the page that says whether a round is finished [fix-48].
//
// Kenny, 2026-09-16, twice: "Op het einde mag er dan een boodschap komen dat
// zegt dat ik rond ben", and then "Er MOET een pagina komen die toont dat ik
// klaar ben als ik alles beoordeeld heb. Waarom moet ik dit meer dan 1 keer
// zeggen?". The dialog says it at the end of a walk, but a walk can only say
// it after going through every theme; this page says it at any moment, from
// the verdicts alone.
//
// It counts, per theme, how many component blocks carry a verdict in this
// engine — the register in the repository and this browser's own judgements,
// the way judgements.js reads them. It does not hash a single block: what a
// block looks like now is the review page's question, and reading 143 blocks
// in 22 themes would take minutes.
//
// A block that declares a theme of its own (a theme intro) is counted in that
// theme alone [scope-111], the same rule the approval advice uses.
import { COMPONENT_PAGES } from './pages.js';
import { ENGINE, engineLabel } from './engine.js';
import { registerReady, verdictOf } from './judgements.js';
import { readPage } from './review.js';
import { themeLabel } from './review-state.js';
import { THEMES } from '../js/theme-registry.js';

const status = /** @type {HTMLElement} */ (document.querySelector('[data-cat-round-status]'));
const banner = /** @type {HTMLElement} */ (document.querySelector('[data-cat-round-banner]'));
const rows = /** @type {HTMLElement} */ (document.querySelector('[data-cat-round-rows]'));

/**
 * What is left to judge, per theme.
 * @param {{ key: string, theme: string | null }[]} blocks every block, with the theme it is fixed to
 * @param {string[]} themes
 * @param {(key: string, theme: string) => boolean} judged
 * @returns {{ theme: string, judged: number, left: number, blocks: string[] }[]}
 */
export function roundState(blocks, themes, judged) {
    return themes.map((theme) => {
        const here = blocks.filter((block) => (block.theme ? block.theme === theme : true));
        const left = here.filter((block) => !judged(block.key, theme));
        return { theme, judged: here.length - left.length, left: left.length, blocks: left.map((block) => block.key) };
    });
}

async function main() {
    await registerReady;
    const pages = await Promise.all(COMPONENT_PAGES.map(readPage));
    /** @type {{ key: string, theme: string | null }[]} */
    const blocks = pages.flatMap((page) => page.blocks.map((block) => ({ key: block.id, theme: block.node.getAttribute('data-cat-theme') })));
    const themes = THEMES.map((theme) => theme.name);
    const state = roundState(blocks, themes, (key, theme) => Boolean(verdictOf(key, theme, ENGINE)));

    const left = state.reduce((sum, theme) => sum + theme.left, 0);
    const pairs = state.reduce((sum, theme) => sum + theme.left + theme.judged, 0);
    status.textContent =
        `${pairs - left} of ${pairs} block/theme pair(s) carry a verdict in ${engineLabel(ENGINE)}` +
        `${left ? `; ${left} left in ${state.filter((theme) => theme.left).length} theme(s).` : '.'}`;

    banner.hidden = false;
    banner.className = `kp-alert ${left ? 'kp-alert--info' : 'kp-alert--success'}`;
    banner.innerHTML = left
        ? `<p class="kp-alert__label">Not yet through</p><div class="kp-alert__body">${left} block/theme pair(s) are still waiting for a verdict. The themes below say where.</div>`
        : `<p class="kp-alert__label">You are through</p><div class="kp-alert__body">Every block of every component page carries a verdict in every theme, in ${engineLabel(
              ENGINE,
          )}. Nothing on the review page is waiting for you.</div>`;

    rows.replaceChildren(
        ...state.map(({ theme, judged, left: open, blocks: names }) => {
            const row = document.createElement('tr');
            const where = open
                ? `<a href="./index.html#${names[0]}">open the first one</a><span class="cat-note"> · ${names
                      .slice(0, 3)
                      .join(', ')}${names.length > 3 ? `, and ${names.length - 3} more` : ''}</span>`
                : '<span class="kp-badge kp-badge--success">done</span>';
            row.innerHTML = `<th scope="row">${themeLabel(theme)}</th>` + `<td>${judged}</td>` + `<td>${open || '—'}</td>` + `<td>${where}</td>`;
            return row;
        }),
    );
}

await main();
